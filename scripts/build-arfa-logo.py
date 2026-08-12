"""Build Arfa Developers logo matching ARFATECH mark style (blue + black)."""
from __future__ import annotations

from collections import Counter
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "images"
REF = Path(
    r"C:\Users\aftab\.cursor\projects\d-Arfa-Voice-Agent\assets"
    r"\c__Users_aftab_AppData_Roaming_Cursor_User_workspaceStorage_"
    r"68039065495a8fa4e16bb0530e731283_images_download__1_-fb7ab1ff-1088-4704-883c-0757e6ed3574.png"
)

BLUE = (10, 124, 255, 255)
BLACK = (17, 17, 17, 255)


def is_ink(p: tuple[int, int, int, int]) -> bool:
    r, g, b, a = p
    if a < 30:
        return False
    if r > 230 and g > 230 and b > 230:
        return False
    return (r + g + b) < 720


def recolor_mark(src: Image.Image) -> Image.Image:
    src = src.convert("RGBA")
    out = Image.new("RGBA", src.size, (0, 0, 0, 0))
    sp, op = src.load(), out.load()
    for y in range(src.height):
        for x in range(src.width):
            r, g, b, a = sp[x, y]
            if a < 20:
                continue
            if r > 230 and g > 230 and b > 230:
                continue
            # Red / crimson -> brand blue
            if r > 100 and r >= g + 20 and r >= b + 20:
                op[x, y] = (10, 124, 255, a)
            elif r < 60 and g < 60 and b < 60:
                op[x, y] = (17, 17, 17, a)
            elif abs(r - g) < 30 and abs(g - b) < 30 and r < 200:
                op[x, y] = (17, 17, 17, a)
            else:
                if r > g and r > b:
                    op[x, y] = (10, 124, 255, a)
                else:
                    op[x, y] = (17, 17, 17, a)
    return out


def content_bbox(img: Image.Image) -> tuple[int, int, int, int]:
    px = img.load()
    xs, ys = [], []
    for y in range(img.height):
        for x in range(img.width):
            if is_ink(px[x, y]):
                xs.append(x)
                ys.append(y)
    return min(xs), min(ys), max(xs) + 1, max(ys) + 1


def find_icon_right(img: Image.Image) -> int:
    """Gap between monogram and wordmark (skip the small gap inside a+t)."""
    px = img.load()
    col = Counter()
    for x in range(img.width):
        for y in range(img.height):
            if is_ink(px[x, y]):
                col[x] += 1

    gaps = []
    gap_start = None
    for x in range(img.width):
        empty = col[x] < 2
        if empty:
            if gap_start is None:
                gap_start = x
        else:
            if gap_start is not None:
                gaps.append((gap_start, x - 1, x - gap_start))
                gap_start = None

    # Monogram has a narrow internal gap; wordmark gap is the later one
    candidates = [g for g in gaps if 20 < g[0] < img.width * 0.6]
    print("gaps", gaps)
    if len(candidates) >= 2:
        # Use the second gap (after full a+t mark)
        return candidates[1][0]
    if candidates:
        return candidates[-1][0]
    return int(img.width * 0.45)


def load_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for path in [
        r"C:\Windows\Fonts\arialbd.ttf",
        r"C:\Windows\Fonts\seguisb.ttf",
        r"C:\Windows\Fonts\segoeuib.ttf",
        r"C:\Windows\Fonts\calibrib.ttf",
    ]:
        if Path(path).exists():
            return ImageFont.truetype(path, size=size)
    return ImageFont.load_default()


def build_logo() -> Path:
    ref = Image.open(REF).convert("RGBA")
    bx0, by0, bx1, by1 = content_bbox(ref)
    content = ref.crop((bx0, by0, bx1, by1))
    content.save(OUT / "_full-crop.png")
    icon_right = find_icon_right(content)
    print("content", content.size, "icon_right", icon_right)

    icon = content.crop((0, 0, icon_right, content.height))
    ib = content_bbox(icon)
    icon = icon.crop(ib)
    icon = recolor_mark(icon)
    icon.save(OUT / "_icon-recolor.png")

    target_h = 96
    scale = target_h / icon.height
    icon_w = max(1, int(icon.width * scale))
    icon = icon.resize((icon_w, target_h), Image.Resampling.LANCZOS)

    font = load_font(int(target_h * 0.56))
    td = ImageDraw.Draw(Image.new("RGBA", (8, 8)))
    arfa, rest = "ARFA", "DEVELOPERS"
    aw = td.textlength(arfa, font=font)
    gap = int(target_h * 0.2)
    pad = 2
    total_w = pad + icon_w + gap + int(aw + td.textlength(rest, font=font)) + pad
    canvas = Image.new("RGBA", (total_w, target_h + 6), (0, 0, 0, 0))
    canvas.paste(icon, (pad, 3), icon)

    draw = ImageDraw.Draw(canvas)
    ascent, descent = font.getmetrics()
    ty = (canvas.height - (ascent + descent)) // 2
    tx = pad + icon_w + gap
    draw.text((tx, ty), arfa, font=font, fill=BLUE)
    draw.text((tx + aw, ty), rest, font=font, fill=BLACK)

    canvas = canvas.crop(content_bbox(canvas))
    out_path = OUT / "logo-arfa-developers.png"
    canvas.save(out_path)
    print("wrote", out_path, canvas.size)
    icon.save(OUT / "logo-arfa-developers-icon.png")
    return out_path


if __name__ == "__main__":
    build_logo()
