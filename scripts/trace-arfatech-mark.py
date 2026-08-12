"""Build exact ARFATECH-matched SVG mark (blue a + black t) via contour trace."""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

REF = Path(
    r"C:\Users\aftab\.cursor\projects\d-Arfa-Voice-Agent\assets"
    r"\c__Users_aftab_AppData_Roaming_Cursor_User_workspaceStorage_"
    r"68039065495a8fa4e16bb0530e731283_images_download__1_-9f71651e-f7bb-4729-bb7b-e0c16c3cb25a.png"
)
OUT = Path(__file__).resolve().parents[1] / "public" / "images"
COMP = Path(__file__).resolve().parents[1] / "components" / "ArfaLogo.tsx"


def ink(p):
    r, g, b, a = p
    return a > 40 and not (r > 235 and g > 235 and b > 235) and r + g + b < 700


def is_red(p):
    r, g, b, a = p
    return ink(p) and r > 100 and r >= g + 20 and r >= b + 20


def extract_mark():
    ref = Image.open(REF).convert("RGBA")
    xs, ys = [], []
    px = ref.load()
    for y in range(ref.height):
        for x in range(ref.width):
            if ink(px[x, y]):
                xs.append(x)
                ys.append(y)
    content = ref.crop((min(xs), min(ys), max(xs) + 1, max(ys) + 1))
    # Stop before ARFA text capital A
    mark = content.crop((0, 0, 41, content.height))
    return mark


def masks(mark: Image.Image):
    w, h = mark.size
    red = [[0] * w for _ in range(h)]
    blk = [[0] * w for _ in range(h)]
    for y in range(h):
        for x in range(w):
            p = mark.getpixel((x, y))
            if is_red(p):
                red[y][x] = 1
            elif ink(p):
                blk[y][x] = 1
    return red, blk, w, h


def find_contours(mask):
    """Moore neighborhood contour trace; returns list of loops as (x,y) lists."""
    h = len(mask)
    w = len(mask[0])
    visited = [[False] * w for _ in range(h)]
    # pad
    def get(x, y):
        if x < 0 or y < 0 or x >= w or y >= h:
            return 0
        return mask[y][x]

    loops = []
    # N, NE, E, SE, S, SW, W, NW
    dirs = [(0, -1), (1, -1), (1, 0), (1, 1), (0, 1), (-1, 1), (-1, 0), (-1, -1)]

    for y in range(h):
        for x in range(w):
            if mask[y][x] != 1 or visited[y][x]:
                continue
            # only start on boundary
            if get(x - 1, y) and get(x + 1, y) and get(x, y - 1) and get(x, y + 1):
                continue
            # Moore trace
            start = (x, y)
            contour = [start]
            visited[y][x] = True
            cx, cy = x, y
            # backtrack direction: came from west
            back = 6  # W
            guard = 0
            while guard < w * h * 4:
                guard += 1
                # start searching from back+1
                found = False
                for i in range(8):
                    di = (back + 1 + i) % 8
                    dx, dy = dirs[di]
                    nx, ny = cx + dx, cy + dy
                    if get(nx, ny):
                        # enter this pixel
                        if (nx, ny) == start and len(contour) > 3:
                            found = False
                            guard = w * h * 5
                            break
                        contour.append((nx, ny))
                        if 0 <= nx < w and 0 <= ny < h:
                            visited[ny][nx] = True
                        cx, cy = nx, ny
                        back = (di + 4) % 8  # opposite
                        found = True
                        break
                if not found:
                    break
            if len(contour) >= 8:
                loops.append(contour)
    return loops


def simplify(pts, epsilon=0.85):
    """Ramer-Douglas-Peucker."""
    if len(pts) < 3:
        return pts

    def perp(a, b, p):
        (x1, y1), (x2, y2), (x, y) = a, b, p
        dx, dy = x2 - x1, y2 - y1
        if dx == 0 and dy == 0:
            return ((x - x1) ** 2 + (y - y1) ** 2) ** 0.5
        t = max(0, min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)))
        projx, projy = x1 + t * dx, y1 + t * dy
        return ((x - projx) ** 2 + (y - projy) ** 2) ** 0.5

    def rdp(points):
        if len(points) < 3:
            return points
        a, b = points[0], points[-1]
        idx, dist = max(((i, perp(a, b, p)) for i, p in enumerate(points[1:-1])), key=lambda t: t[1], default=(0, 0))
        idx += 1
        if dist > epsilon:
            left = rdp(points[: idx + 1])
            right = rdp(points[idx:])
            return left[:-1] + right
        return [a, b]

    return rdp(pts)


def loop_to_path(loop, scale=1.0, ox=0.5, oy=0.5):
    pts = simplify([(x + ox, y + oy) for x, y in loop], epsilon=0.9)
    if len(pts) < 3:
        return ""
    d = [f"M{pts[0][0] * scale:.2f} {pts[0][1] * scale:.2f}"]
    for x, y in pts[1:]:
        d.append(f"L{x * scale:.2f} {y * scale:.2f}")
    d.append("Z")
    return " ".join(d)


def main():
    mark = extract_mark()
    red, blk, w, h = masks(mark)
    red_loops = find_contours(red)
    blk_loops = find_contours(blk)
    # Largest loop = outer; smaller = hole for evenodd
    red_loops.sort(key=len, reverse=True)
    blk_loops.sort(key=len, reverse=True)

    scale = 2.0  # viewBox in scaled units
    vb_w = w * scale
    vb_h = h * scale

    red_paths = [loop_to_path(lp, scale) for lp in red_loops[:2]]  # outer + hole
    blk_paths = [loop_to_path(lp, scale) for lp in blk_loops[:1]]

    red_d = " ".join(p for p in red_paths if p)
    blk_d = " ".join(p for p in blk_paths if p)

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {vb_w:.0f} {vb_h:.0f}" fill="none" role="img" aria-label="Arfa Developers">
  <path fill="#0A7CFF" fill-rule="evenodd" d="{red_d}"/>
  <path fill="#111111" d="{blk_d}"/>
</svg>
'''
    (OUT / "logo-arfa-developers-icon.svg").write_text(svg, encoding="utf-8")
    print("wrote icon svg", vb_w, vb_h, "red loops", len(red_loops), "blk", len(blk_loops))
    print("red path lens", [len(p) for p in red_paths], "blk", [len(p) for p in blk_paths])

    # Update React component to use this SVG inline
    component = f''''use client'

import Link from 'next/link'
import {{ Box }} from '@mui/material'

type ArfaLogoProps = {{
  height?: number
  href?: string
  iconOnly?: boolean
}}

/** ARFATECH-matched HD vector mark (blue a + black t) + ARFADEVELOPERS wordmark. */
export default function ArfaLogo({{
  height = 36,
  href = '/',
  iconOnly = false,
}}: ArfaLogoProps) {{
  const markH = height
  const markW = Math.round(height * ({vb_w:.0f} / {vb_h:.0f}))

  const mark = (
    <Box
      component="svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 {vb_w:.0f} {vb_h:.0f}"
      aria-hidden
      sx={{ height: markH, width: markW, flexShrink: 0, display: 'block' }}
    >
      <path fill="#0A7CFF" fillRule="evenodd" d={{`{red_d}`}} />
      <path fill="#111111" d={{`{blk_d}`}} />
    </Box>
  )

  const wordmark = !iconOnly ? (
    <Box
      component="span"
      sx={{{{
        fontFamily: 'Inter, Arial, Helvetica, sans-serif',
        fontWeight: 800,
        fontSize: Math.max(15, Math.round(height * 0.5)),
        letterSpacing: '0.04em',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        userSelect: 'none',
        display: 'inline-flex',
        alignItems: 'center',
      }}}}
    >
      <Box component="span" sx={{{{ color: '#0A7CFF' }}}}>
        ARFA
      </Box>
      <Box component="span" sx={{{{ color: '#111111' }}}}>
        DEVELOPERS
      </Box>
    </Box>
  ) : null

  const content = (
    <Box sx={{{{ display: 'inline-flex', alignItems: 'center', gap: 1.25, lineHeight: 0 }}}}>
      {{mark}}
      {{wordmark}}
    </Box>
  )

  if (!href) return content

  return (
    <Link
      href={{href}}
      aria-label="Arfa Developers Home"
      style={{{{ textDecoration: 'none', lineHeight: 0, display: 'inline-flex', alignItems: 'center' }}}}
    >
      {{content}}
    </Link>
  )
}}
'''
    COMP.write_text(component, encoding="utf-8")
    print("wrote", COMP)

    # Also HD PNG preview via sharp-like PIL from SVG paths rendered simply
    # Render masks at high res for preview PNG
    s = 12
    img = Image.new("RGBA", (w * s, h * s), (0, 0, 0, 0))
    # draw from SVG-ish by painting original masks smoothly
    px = img.load()
    for y in range(h):
        for x in range(w):
            col = None
            if red[y][x]:
                col = (10, 124, 255, 255)
            elif blk[y][x]:
                col = (17, 17, 17, 255)
            if col:
                for dy in range(s):
                    for dx in range(s):
                        px[x * s + dx, y * s + dy] = col
    smooth = img.resize((w * 4, h * 4), Image.Resampling.LANCZOS)
    bb = smooth.getbbox()
    smooth = smooth.crop(bb)
    smooth.save(OUT / "logo-arfa-developers-icon.png")

    # full logo preview
    target_h = 96
    sc = target_h / smooth.height
    mark_r = smooth.resize((max(1, int(smooth.width * sc)), target_h), Image.Resampling.LANCZOS)
    font = ImageFont.truetype(r"C:\\Windows\\Fonts\\arialbd.ttf", int(target_h * 0.55))
    td = ImageDraw.Draw(Image.new("RGBA", (8, 8)))
    arfa, rest = "ARFA", "DEVELOPERS"
    aw = td.textlength(arfa, font=font)
    rw = td.textlength(rest, font=font)
    gap = int(target_h * 0.22)
    canvas = Image.new("RGBA", (4 + mark_r.width + gap + int(aw + rw) + 4, target_h + 4), (0, 0, 0, 0))
    canvas.paste(mark_r, (4, 2), mark_r)
    draw = ImageDraw.Draw(canvas)
    ascent, descent = font.getmetrics()
    ty = (canvas.height - (ascent + descent)) // 2
    tx = 4 + mark_r.width + gap
    draw.text((tx, ty), arfa, font=font, fill=(10, 124, 255, 255))
    draw.text((tx + aw, ty), rest, font=font, fill=(17, 17, 17, 255))
    canvas = canvas.crop(canvas.getbbox())
    canvas.save(OUT / "logo-arfa-developers.png")
    prev = Image.new("RGB", (canvas.width + 40, canvas.height + 40), (255, 255, 255))
    prev.paste(canvas, (20, 20), canvas)
    prev.save(OUT / "_logo-preview.png")
    print("preview ready")


if __name__ == "__main__":
    main()
