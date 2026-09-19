from PIL import Image, ImageFilter, ImageDraw, ImageEnhance
import math
import random

W, H = 3600, 1000

# 1. Load source images
im_tavern = Image.open('assets/tavern_house.jpg').resize((1200, H), Image.Resampling.LANCZOS)
im_forest = Image.open('assets/forest_roots.jpg').resize((1200, H), Image.Resampling.LANCZOS)
fruit_stall_crop = Image.open('assets/fruit_stall.jpg')

# Master canvas
canvas = Image.new('RGB', (W, H), (100, 150, 110))

# -------------------------------------------------------------
# 2. Market Zone Generation (x: 0 .. 1200)
# -------------------------------------------------------------
market_img = Image.new('RGB', (1200, H))
draw = ImageDraw.Draw(market_img)

# Sky: Soft Ghibli cerulean blue fading into warm golden morning mist (y: 0 .. 280)
for y in range(280):
    t = y / 280.0
    r = int(90 * (1-t) + 215 * t)
    g = int(145 * (1-t) + 225 * t)
    b = int(210 * (1-t) + 215 * t)
    draw.line([(0, y), (1200, y)], fill=(r, g, b))

# Anime watercolor cumulus clouds
for cx, cy, rad in [(150, 100, 65), (280, 75, 75), (550, 110, 60), (820, 85, 80), (1050, 95, 70)]:
    for r_i in range(rad, 0, -8):
        alpha_t = r_i / rad
        cr = int(255 * (1 - alpha_t*0.15))
        cg = int(250 * (1 - alpha_t*0.1))
        cb = int(240 * (1 - alpha_t*0.05))
        draw.ellipse([cx - r_i, cy - r_i*0.6, cx + r_i, cy + r_i*0.6], fill=(cr, cg, cb))

# Distant watercolor mountains & rolling green hills (y: 180 .. 320)
for x in range(1200):
    hy = int(210 + 35 * math.sin(x * 0.007) + 12 * math.cos(x * 0.025))
    for y in range(hy, 320):
        t = (y - hy) / max(1, 320 - hy)
        mr = int(75 * (1-t) + 55 * t)
        mg = int(135 * (1-t) + 105 * t)
        mb = int(95 * (1-t) + 75 * t)
        market_img.putpixel((x, y), (mr, mg, mb))

# Pine tree silhouettes along ridge (y: 240 .. 320)
random.seed(42)
for tx in range(20, 1200, 35):
    th = random.randint(25, 45)
    ty = 270 + int(20 * math.sin(tx * 0.01))
    draw.polygon([(tx, ty - th), (tx - 12, ty), (tx + 12, ty)], fill=(45, 80, 55))

# Cobblestone ground (y: 280 .. H) - Ghibli sunlit warm stone pavers
for y in range(280, H):
    t = (y - 280) / (H - 280)
    # Warm earthy cobblestone base
    base_r = int(180 * (1-t*0.35))
    base_g = int(165 * (1-t*0.35))
    base_b = int(145 * (1-t*0.35))
    for x in range(1200):
        # Organic stone shading
        grain = (math.sin(x * 0.12) * math.cos(y * 0.12) + math.sin(x * 0.03 + y * 0.04)) * 10
        market_img.putpixel((x, y), (
            max(0, min(255, int(base_r + grain))),
            max(0, min(255, int(base_g + grain))),
            max(0, min(255, int(base_b + grain)))
        ))

# Draw individual cobblestones with mortar & highlights
stone_draw = ImageDraw.Draw(market_img)
for row_idx, sy in enumerate(range(300, H, 24)):
    offset = 18 if (row_idx % 2 == 1) else 0
    stone_h = 20
    for sx in range(offset, 1200, 38):
        stone_w = random.randint(32, 36)
        # Mortar shadow
        stone_draw.rectangle([sx, sy, sx + stone_w, sy + stone_h], outline=(105, 95, 85), width=1)
        # Top-left stone bevel highlight
        stone_draw.line([(sx+1, sy+1), (sx + stone_w - 1, sy+1)], fill=(215, 205, 185))
        # Stone center tint variation
        tint = random.randint(-12, 12)
        if random.random() < 0.2:
            # subtle green moss in mortar
            stone_draw.line([(sx, sy + stone_h), (sx + stone_w, sy + stone_h)], fill=(75, 115, 65))

# -------------------------------------------------------------
# 3. Stitch Zones Together with Smooth Blending
# -------------------------------------------------------------
# Market goes to 0..1200
canvas.paste(market_img, (0, 0))

# Tavern goes to 1100..2300 with 250px feathered transition on left
mask_tavern = Image.new('L', (1200, H), 255)
for x in range(250):
    # smoothstep curve: 3x^2 - 2x^3
    t = x / 250.0
    alpha = int(255 * (t * t * (3 - 2 * t)))
    for y in range(H):
        mask_tavern.putpixel((x, y), alpha)

canvas.paste(im_tavern, (1150, 0), mask_tavern)

# Forest goes to 2300..3600 with 250px feathered transition on left
mask_forest = Image.new('L', (1300, H), 255)
for x in range(250):
    t = x / 250.0
    alpha = int(255 * (t * t * (3 - 2 * t)))
    for y in range(H):
        mask_forest.putpixel((x, y), alpha)

im_forest_wide = im_forest.resize((1300, H), Image.Resampling.LANCZOS)
canvas.paste(im_forest_wide, (2300, 0), mask_forest)

# -------------------------------------------------------------
# 4. Global Harmonization: Sky wash across full 3600px width
# -------------------------------------------------------------
# Apply a soft ambient gradient at the very top (0..120) to perfectly unify the skies
sky_overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
sky_draw = ImageDraw.Draw(sky_overlay)
for y in range(140):
    alpha = int(90 * (1 - y / 140.0))
    sky_draw.line([(0, y), (W, y)], fill=(85, 140, 205, alpha))

canvas = Image.alpha_composite(canvas.convert('RGBA'), sky_overlay).convert('RGB')

# Save final world master background
canvas.save('assets/world_master_bg.jpg', quality=92)
print("SUCCESS: assets/world_master_bg.jpg successfully created! Size:", canvas.size)
