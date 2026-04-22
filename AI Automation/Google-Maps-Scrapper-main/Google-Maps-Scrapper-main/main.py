import logging
from typing import List, Optional
from playwright.sync_api import sync_playwright, Page
from dataclasses import dataclass, asdict
import argparse
import platform
import time
import os
import csv
from urllib.parse import quote_plus

@dataclass
class Place:
    name: str = ""
    address: str = ""
    website: str = ""
    phone_number: str = ""
    reviews_count: Optional[int] = None
    reviews_average: Optional[float] = None
    store_shopping: str = "No"
    in_store_pickup: str = "No"
    store_delivery: str = "No"
    place_type: str = ""
    opens_at: str = ""
    introduction: str = ""

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
    )

def extract_text(page: Page, xpath: str) -> str:
    try:
        if page.locator(xpath).count() > 0:
            return page.locator(xpath).inner_text()
    except Exception as e:
        logging.warning(f"Failed to extract text for xpath {xpath}: {e}")
    return ""

def extract_place(page: Page) -> Place:
    # XPaths
    # Prefer stable CSS selectors where possible (Google frequently changes wrapper class names).
    name_xpath = 'h1.DUwDvf'
    address_xpath = '//button[@data-item-id="address"]//div[contains(@class, "fontBodyMedium")]'
    website_xpath = '//a[@data-item-id="authority"]//div[contains(@class, "fontBodyMedium")]'
    phone_number_xpath = '//button[contains(@data-item-id, "phone:tel:")]//div[contains(@class, "fontBodyMedium")]'
    reviews_count_xpath = '//div[@class="TIHn2 "]//div[@class="fontBodyMedium dmRWX"]//div//span//span//span[@aria-label]'
    reviews_average_xpath = '//div[@class="TIHn2 "]//div[@class="fontBodyMedium dmRWX"]//div//span[@aria-hidden]'
    info1 = '//div[@class="LTs0Rc"][1]'
    info2 = '//div[@class="LTs0Rc"][2]'
    info3 = '//div[@class="LTs0Rc"][3]'
    opens_at_xpath = '//button[contains(@data-item-id, "oh")]//div[contains(@class, "fontBodyMedium")]'
    opens_at_xpath2 = '//div[@class="MkV9"]//span[@class="ZDu9vd"]//span[2]'
    place_type_xpath = '//div[@class="LBgpqf"]//button[@class="DkEaL "]'
    intro_xpath = '//div[@class="WeS02d fontBodyMedium"]//div[@class="PYvSYb "]'

    place = Place()
    place.name = extract_text(page, name_xpath)
    place.address = extract_text(page, address_xpath)
    place.website = extract_text(page, website_xpath)
    place.phone_number = extract_text(page, phone_number_xpath)
    place.place_type = extract_text(page, place_type_xpath)
    place.introduction = extract_text(page, intro_xpath) or "None Found"

    # Reviews Count
    reviews_count_raw = extract_text(page, reviews_count_xpath)
    if reviews_count_raw:
        try:
            temp = reviews_count_raw.replace('\xa0', '').replace('(','').replace(')','').replace(',','')
            place.reviews_count = int(temp)
        except Exception as e:
            logging.warning(f"Failed to parse reviews count: {e}")
    # Reviews Average
    reviews_avg_raw = extract_text(page, reviews_average_xpath)
    if reviews_avg_raw:
        try:
            temp = reviews_avg_raw.replace(' ','').replace(',','.')
            place.reviews_average = float(temp)
        except Exception as e:
            logging.warning(f"Failed to parse reviews average: {e}")
    # Store Info
    for idx, info_xpath in enumerate([info1, info2, info3]):
        info_raw = extract_text(page, info_xpath)
        if info_raw:
            temp = info_raw.split('·')
            if len(temp) > 1:
                check = temp[1].replace("\n", "").lower()
                if 'shop' in check:
                    place.store_shopping = "Yes"
                if 'pickup' in check:
                    place.in_store_pickup = "Yes"
                if 'delivery' in check:
                    place.store_delivery = "Yes"
    # Opens At
    opens_at_raw = extract_text(page, opens_at_xpath)
    if opens_at_raw:
        opens = opens_at_raw.split('⋅')
        if len(opens) > 1:
            place.opens_at = opens[1].replace("\u202f","")
        else:
            place.opens_at = opens_at_raw.replace("\u202f","")
    else:
        opens_at2_raw = extract_text(page, opens_at_xpath2)
        if opens_at2_raw:
            opens = opens_at2_raw.split('⋅')
            if len(opens) > 1:
                place.opens_at = opens[1].replace("\u202f","")
            else:
                place.opens_at = opens_at2_raw.replace("\u202f","")
    return place

def scrape_places(search_for: str, total: int) -> List[Place]:
    setup_logging()
    places: List[Place] = []
    with sync_playwright() as p:
        # Prefer system Chrome on Windows, but gracefully fall back to bundled Chromium.
        launch_kwargs = {"headless": False}
        if platform.system() == "Windows":
            browser_path = r"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
            if os.path.isfile(browser_path):
                launch_kwargs["executable_path"] = browser_path
        browser = p.chromium.launch(**launch_kwargs)
        page = browser.new_page()
        page.set_default_timeout(60000)
        try:
            # Navigate directly to the search URL; this is more reliable than depending on a specific input id
            # that Google may change in different layouts.
            search_url = "https://www.google.com/maps/search/" + quote_plus(search_for)
            page.goto(search_url, timeout=60000, wait_until="domcontentloaded")
            page.wait_for_timeout(750)
            logging.info(f"Loaded URL: {page.url}")

            # Cookie consent / overlays can block the search box in some regions.
            # Try a few common consent buttons without failing if they don't exist.
            try:
                consent_labels = [
                    "Accept all",
                    "Accept",
                    "I agree",
                    "Agree",
                    "Reject all",
                    "Reject",
                    "Got it",
                    "Continue",
                ]
                for label in consent_labels:
                    btn = page.get_by_role("button", name=label)
                    if btn.count() > 0:
                        btn.first.click(timeout=3000)
                        page.wait_for_timeout(750)
                        break

                # Fallback for non-role buttons (some consent screens don't expose proper roles/names)
                for label in consent_labels:
                    loc = page.locator(f'button:has-text("{label}")')
                    if loc.count() > 0:
                        loc.first.click(timeout=3000)
                        page.wait_for_timeout(750)
                        break
            except Exception:
                pass

            # Wait for results to appear.
            try:
                page.wait_for_load_state("networkidle", timeout=30000)
            except Exception:
                pass

            place_link_selector = '//a[contains(@href, "https://www.google.com/maps/place")]'
            try:
                page.wait_for_selector(place_link_selector, timeout=60000)
            except Exception as e:
                # Write a screenshot to help diagnose what screen we're on (consent/captcha/etc.)
                try:
                    debug_path = os.path.join(os.environ.get("TEMP", "."), "gmaps_debug.png")
                    page.screenshot(path=debug_path, full_page=True)
                    logging.error(f"Results not visible. URL={page.url}. Screenshot={debug_path}")
                except Exception:
                    logging.error(f"Results not visible. URL={page.url}. (Screenshot failed)")
                raise e
            page.hover(place_link_selector)
            feed = page.locator('div[role="feed"]')
            if feed.count() > 0:
                try:
                    feed.first.hover()
                except Exception:
                    pass

            previously_counted = 0
            stagnant = 0
            max_scrolls = 40
            while True:
                # Scroll the results list (not the map) so more listings load.
                if feed.count() > 0:
                    try:
                        feed.first.hover()
                    except Exception:
                        pass
                page.mouse.wheel(0, 12000)
                page.wait_for_selector(place_link_selector)
                found = page.locator(place_link_selector).count()
                logging.info(f"Currently Found: {found}")
                if found >= total:
                    break
                if found == previously_counted:
                    stagnant += 1
                    if stagnant >= 3:
                        logging.info("Arrived at all available")
                        break
                else:
                    stagnant = 0
                    previously_counted = found
                max_scrolls -= 1
                if max_scrolls <= 0:
                    break

            total_found = min(total, page.locator(place_link_selector).count())
            logging.info(f"Total Found: {total_found}")

            # Capture hrefs first, then visit each place URL directly.
            hrefs = []
            for idx in range(total_found):
                try:
                    href = page.locator(place_link_selector).nth(idx).get_attribute("href")
                    if href:
                        hrefs.append(href)
                except Exception:
                    continue

            # De-dupe while preserving order
            seen_href = set()
            place_urls = []
            for h in hrefs:
                if h not in seen_href:
                    seen_href.add(h)
                    place_urls.append(h)

            seen_names = set()
            for idx, href in enumerate(place_urls[:total_found]):
                try:
                    url = href
                    if url.startswith("/"):
                        url = "https://www.google.com" + url
                    page.goto(url, timeout=60000, wait_until="domcontentloaded")
                    page.wait_for_selector('h1.DUwDvf', timeout=30000)
                    time.sleep(1.5)  # Give time for details to load
                    place = extract_place(page)
                    if not place.name:
                        # One quick retry if the pane loaded but text extraction lagged.
                        page.wait_for_timeout(800)
                        place = extract_place(page)
                    if place.name and place.name not in seen_names:
                        seen_names.add(place.name)
                        places.append(place)
                    else:
                        logging.warning(f"No name found for listing {idx+1}, skipping.")
                except Exception as e:
                    logging.warning(f"Failed to extract listing {idx+1}: {e}")
        finally:
            browser.close()
    return places

def save_places_to_csv(places: List[Place], output_path: str = "result.csv", append: bool = False):
    rows = [asdict(place) for place in places]
    if not rows:
        logging.warning("No data to save. Places list is empty.")
        return

    # Drop columns where all values are identical (keeps output clean like the pandas version)
    keys = list(rows[0].keys())
    drop_keys = []
    for k in keys:
        vals = [str(r.get(k, "")) for r in rows]
        if len(set(vals)) == 1:
            drop_keys.append(k)

    fieldnames = [k for k in keys if k not in drop_keys]
    file_exists = os.path.isfile(output_path)
    mode = "a" if append else "w"
    write_header = not (append and file_exists)

    with open(output_path, mode, newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        if write_header:
            writer.writeheader()
        for r in rows:
            writer.writerow({k: r.get(k, "") for k in fieldnames})

    logging.info(f"Saved {len(rows)} places to {output_path} (append={append})")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("-s", "--search", type=str, help="Search query for Google Maps")
    parser.add_argument("-t", "--total", type=int, help="Total number of results to scrape")
    parser.add_argument("-o", "--output", type=str, default="result.csv", help="Output CSV file path")
    parser.add_argument("--append", action="store_true", help="Append results to the output file instead of overwriting")
    args = parser.parse_args()
    search_for = args.search or "turkish stores in toronto Canada"
    total = args.total or 1
    output_path = args.output
    append = args.append
    places = scrape_places(search_for, total)
    save_places_to_csv(places, output_path, append=append)

if __name__ == "__main__":
    main()
