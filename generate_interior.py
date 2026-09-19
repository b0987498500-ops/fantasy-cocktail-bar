from PIL import Image, ImageDraw, ImageFilter
import math
import random

W, H = 1100, 700
img = Image.new('RGB', (W, H), (45, 26, 16))
draw = ImageDraw.Draw(img)

# 1. Back Timber Wall (y: 0 .. 420)
# Dark warm oak planks with wood grain and lighting
for y in range(420):
    t = y / 420.0
    # Soft warm lighting from lanterns above
    r = int(55 + 25 * (1 - t*0.5))
    g = int(32 + 15 * (1 - t*0.5))
    b = int(18 + 8 * (1 - t*0.5))
    draw.line([(0, y), (W, y)], fill=(r, g, b))

# Wall plank vertical seams
for px in range(0, W, 32):
    draw.line([(px, 0), (px, 420)], fill=(30, 16, 10), width=2)
    draw.line([(px+1, 0), (px+1, 420)], fill=(75, 45, 25), width=1)

# Ceiling Beams (y: 0 .. 90)
draw.rectangle([0, 0, W, 80], fill=(32, 18, 10))
draw.line([(0, 80), (W, 80)], fill=(65, 38, 20), width=3)
for bx in range(80, W, 140):
    draw.rectangle([bx, 0, bx + 36, 80], fill=(24, 12, 6))
    draw.line([(bx, 0), (bx, 80)], fill=(50, 28, 15), width=1)
    draw.line([(bx+36, 0), (bx+36, 80)], fill=(15, 8, 4), width=2)

# 2. Warm Polished Wood Parquet Floor (y: 400 .. H)
for y in range(400, H):
    t = (y - 400) / (H - 400.0)
    fr = int(60 * (1-t) + 38 * t)
    fg = int(36 * (1-t) + 22 * t)
    fb = int(20 * (1-t) + 12 * t)
    draw.line([(0, y), (W, y)], fill=(fr, fg, fb))

# Floor plank lines
for fy in range(420, H, 24):
    draw.line([(0, fy), (W, fy)], fill=(22, 12, 6), width=1)
    draw.line([(0, fy+1), (W, fy+1)], fill=(75, 45, 25), width=1)
    # Staggered board joints
    row = (fy - 420) // 24
    offset = 45 if row % 2 == 1 else 0
    for fx in range(offset, W, 90):
        draw.line([(fx, fy), (fx, fy+24)], fill=(20, 10, 5), width=1)

# 3. Left Side: Cozy Stone Fireplace (x: 100 .. 280, y: 160 .. 460)
# Stone chimney & hearth
draw.rectangle([110, 120, 270, 440], fill=(55, 52, 50))
# Stone block outlines
for sy in range(130, 440, 30):
    for sx in range(110, 270, 40):
        draw.rectangle([sx, sy, sx + 38, sy + 28], outline=(35, 32, 30), width=2)
        draw.line([(sx+2, sy+2), (sx+36, sy+2)], fill=(80, 75, 70))
# Fireplace hearth arch
draw.pieslice([130, 260, 250, 440], 180, 360, fill=(25, 12, 8))
draw.rectangle([130, 350, 250, 440], fill=(20, 10, 6))
# Glowing fire inside fireplace
fire_colors = [(255, 230, 100), (255, 160, 20), (230, 70, 10), (180, 30, 5)]
for rad, col in zip([45, 35, 25, 15], fire_colors):
    draw.ellipse([190 - rad, 410 - int(rad*1.2), 190 + rad, 410 + int(rad*0.5)], fill=col)

# 4. Center-Right: Large Stained Glass Window (x: 750 .. 950, y: 90 .. 300)
# Arched window with warm golden morning rays
draw.pieslice([760, 90, 940, 270], 180, 360, fill=(180, 220, 240))
draw.rectangle([760, 180, 940, 300], fill=(160, 210, 235))
# Window wood frame
draw.arc([760, 90, 940, 270], 180, 360, fill=(45, 25, 15), width=6)
draw.rectangle([760, 180, 940, 300], outline=(45, 25, 15), width=6)
draw.line([(850, 90), (850, 300)], fill=(45, 25, 15), width=4)
draw.line([(760, 230), (940, 230)], fill=(45, 25, 15), width=4)
# Window mullions / diamond leaded glass
for wy in range(120, 290, 25):
    draw.line([(765, wy), (935, wy)], fill=(120, 160, 190), width=1)

# 5. Massive Multi-Tier Liquor & Potion Shelves (x: 340 .. 700, y: 110 .. 270)
draw.rectangle([330, 110, 710, 265], fill=(36, 20, 12))
for sy in [155, 205, 255]:
    # Heavy oak shelf board with highlight
    draw.rectangle([325, sy, 715, sy + 10], fill=(58, 34, 18))
    draw.line([(325, sy), (715, sy)], fill=(105, 65, 35), width=2)
    # Bottles on shelf
    bot_colors = [
        (255, 195, 18),  # Amber Rum
        (0, 206, 201),   # Cyan Frost
        (235, 77, 75),   # Ruby Wine
        (106, 176, 76),  # Emerald Herb
        (165, 94, 234),  # Magic Amethyst
        (255, 121, 121), # Rosé
        (246, 229, 141)  # Mead
    ]
    random.seed(sy)
    for bx in range(340, 700, 18):
        bcol = bot_colors[bx % len(bot_colors)]
        bh = random.randint(22, 34)
        bw = random.randint(8, 12)
        # Bottle body
        draw.rectangle([bx, sy - bh, bx + bw, sy], fill=bcol)
        # Bottle neck
        draw.rectangle([bx + bw//3, sy - bh - 6, bx + bw - bw//3, sy - bh], fill=bcol)
        # Glass highlight
        draw.line([(bx+1, sy - bh + 2), (bx+1, sy - 2)], fill=(255, 255, 255))
        # Cork
        draw.rectangle([bx + bw//3, sy - bh - 8, bx + bw - bw//3, sy - bh - 6], fill=(180, 140, 100))

# 6. Grand Mahogany Bartending Counter (x: 300 .. 760, y: 275 .. 365)
# Countertop base
draw.rectangle([300, 280, 760, 360], fill=(62, 32, 16))
draw.line([(300, 280), (760, 280)], fill=(125, 75, 40), width=3)
# Polished countertop top surface
for cy in range(282, 310):
    t = (cy - 282) / 28.0
    r = int(95 * (1-t) + 65 * t)
    g = int(52 * (1-t) + 35 * t)
    b = int(28 * (1-t) + 18 * t)
    draw.line([(305, cy), (755, cy)], fill=(r, g, b))
# Mirror glossy reflection streak
draw.line([(310, 285), (750, 285)], fill=(255, 255, 255), width=2)
# Counter front wood panelling with brass foot rail
for px in range(320, 750, 55):
    draw.rectangle([px, 312, px + 48, 355], outline=(40, 20, 10), width=2)
# Brass foot rail
draw.line([(295, 360), (765, 360)], fill=(215, 175, 55), width=4)

# 7. Rich Persian Rug on the Floor (x: 320 .. 740, y: 440 .. 640)
draw.rectangle([320, 440, 740, 640], fill=(125, 28, 42))
draw.rectangle([320, 440, 740, 640], outline=(215, 185, 95), width=6)
draw.rectangle([335, 455, 725, 625], outline=(45, 15, 25), width=3)
# Rug ornate center medallion
draw.ellipse([480, 500, 580, 580], fill=(180, 40, 55), outline=(215, 185, 95), width=3)

# 8. Cozy Warm Lanterns with Radial Glow
lantern_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
l_draw = ImageDraw.Draw(lantern_layer)

for lx, ly in [(280, 130), (520, 100), (750, 130), (190, 400)]:
    # Glowing orb
    for r in range(120, 0, -5):
        alpha = int(45 * (1 - r / 120.0))
        l_draw.ellipse([lx - r, ly - r, lx + r, ly + r], fill=(255, 200, 80, alpha))
    # Brass lantern housing
    l_draw.rectangle([lx - 8, ly - 12, lx + 8, ly + 12], fill=(40, 25, 12, 255))
    l_draw.rectangle([lx - 5, ly - 8, lx + 5, ly + 8], fill=(255, 235, 160, 255))

img = Image.alpha_composite(img.convert('RGBA'), lantern_layer).convert('RGB')

# Save final tavern interior
img.save('assets/tavern_interior.jpg', quality=92)
print("SUCCESS: assets/tavern_interior.jpg successfully created! Size:", img.size)
