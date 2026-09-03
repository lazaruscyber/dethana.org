from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
NAVY = (14, 42, 71)
NAVY_DEEP = (8, 24, 40)
WHITE = (255, 255, 255)
WAVE1 = (158, 182, 201)
WAVE2 = (213, 224, 234)
WAVE3 = (255, 255, 255)

OUT = Path(__file__).resolve().parents[1] / "site" / "public" / "og-image.png"


def cubic(p0, p1, p2, p3, t):
    u = 1 - t
    return (
        u**3 * p0[0] + 3 * u**2 * t * p1[0] + 3 * u * t**2 * p2[0] + t**3 * p3[0],
        u**3 * p0[1] + 3 * u**2 * t * p1[1] + 3 * u * t**2 * p2[1] + t**3 * p3[1],
    )


def map_pt(x, y, wave_h=168):
    return (x * W / 1440, H - wave_h + y * wave_h / 90)


def path_points(segments, steps=28):
    pts = []
    for p0, p1, p2, p3 in segments:
        for i in range(steps + 1):
            x, y = cubic(p0, p1, p2, p3, i / steps)
            pts.append(map_pt(x, y))
    pts.append((W, H))
    pts.append((0, H))
    return pts


# Hero waves from Home.tsx, viewBox 0 0 1440 90
WAVE_A = [
    ((0, 50), (240, 90), (480, 10), (720, 40)),
    ((720, 40), (960, 70), (1200, 20), (1440, 48)),
]
WAVE_B = [
    ((0, 62), (300, 20), (620, 88), (900, 50)),
    ((900, 50), (1140, 22), (1300, 70), (1440, 58)),
]
WAVE_C = [
    ((0, 72), (360, 40), (780, 100), (1100, 68)),
    ((1100, 68), (1280, 50), (1380, 78), (1440, 70)),
]


def font(size):
    for name in (
        "C:/Windows/Fonts/georgia.ttf",
        "C:/Windows/Fonts/times.ttf",
        "C:/Windows/Fonts/timesi.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
    ):
        p = Path(name)
        if p.exists():
            return ImageFont.truetype(str(p), size)
    return ImageFont.load_default()


def main():
    img = Image.new("RGB", (W, H), NAVY)
    draw = ImageDraw.Draw(img)
    for y in range(H):
        t = y / H
        r = int(NAVY[0] * (1 - t * 0.22) + NAVY_DEEP[0] * t * 0.22)
        g = int(NAVY[1] * (1 - t * 0.22) + NAVY_DEEP[1] * t * 0.22)
        b = int(NAVY[2] * (1 - t * 0.22) + NAVY_DEEP[2] * t * 0.22)
        draw.line([(0, y), (W, y)], fill=(r, g, b))

    draw.polygon(path_points(WAVE_A), fill=WAVE1)
    draw.polygon(path_points(WAVE_B), fill=WAVE2)
    draw.polygon(path_points(WAVE_C), fill=WAVE3)

    word = "Dethana"
    fnt = font(92)
    spacing = 18
    widths = []
    for ch in word:
        bbox = draw.textbbox((0, 0), ch, font=fnt)
        widths.append(bbox[2] - bbox[0])
    total = sum(widths) + spacing * (len(word) - 1)
    x = (W - total) / 2
    y = 198
    for ch, wch in zip(word, widths):
        draw.text((x, y), ch, font=fnt, fill=WHITE)
        x += wch + spacing

    line_w = total * 0.92
    lx = (W - line_w) / 2
    ly = y + 118
    draw.rectangle([lx, ly, lx + line_w, ly + 2], fill=(255, 255, 255))

    img.save(OUT, "PNG", optimize=True)
    print(f"wrote {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
