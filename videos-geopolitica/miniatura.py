"""Genera una miniatura: mapa + resplandor rojo + texto grande a la izquierda."""
import sys, json, math
sys.path.insert(0, '.')
import motor as m
from escenas_geo import GEO
from PIL import Image, ImageDraw, ImageFilter, ImageChops
W, H = 1920, 1080
cfg = json.loads(sys.argv[1]); out = sys.argv[2]
im = Image.new('RGB', (W, H)); d = ImageDraw.Draw(im)
for y in range(H): d.line([(0, y), (W, y)], fill=m.mix((10, 70, 140), (5, 40, 95), y / H))
lon_c, lat_c, span = cfg['vista']
lat_span = span * math.cos(math.radians(lat_c)) * H / (W - 380)
pr = m.Proj(lon_c - span / 2, lon_c + span / 2, lat_c - lat_span / 2, lat_c + lat_span / 2, (380, 0, W, H))
COL = {'land': (196, 170, 120), 'land2': (176, 150, 105), 'red': (220, 40, 50), 'dark': (120, 105, 80), 'blue': (60, 110, 200)}
for key, c in cfg['tierras']:
    d.polygon([pr(*p) for p in GEO[key]], fill=COL[c], outline=(255, 255, 255))
gx, gy = pr(*cfg['foco'])
g = Image.new('RGB', (W, H)); gd = ImageDraw.Draw(g)
for r, f in ((230, 0.45), (150, 0.75), (80, 1.0)):
    gd.ellipse([gx - r, gy - r, gx + r, gy + r], fill=tuple(int(c * f) for c in (255, 50, 40)))
im = ImageChops.add(im, g.filter(ImageFilter.GaussianBlur(60)).point(lambda v: int(v * 0.8)))
d = ImageDraw.Draw(im)
d.ellipse([gx - 95, gy - 95, gx + 95, gy + 95], outline=(255, 30, 30), width=14)
grad = Image.new('L', (W, H), 0); gdd = ImageDraw.Draw(grad)
for x in range(W): gdd.line([(x, 0), (x, H)], fill=245 if x < 520 else int(max(0, 245 - (x - 520) * 0.55)))
im = Image.composite(Image.new('RGB', (W, H), (0, 0, 0)), im, grad); d = ImageDraw.Draw(im)
ax0, ay0 = 880, 560
ang = math.atan2(gy - ay0, gx - 100 - ax0); tip = (gx - 100 * math.cos(ang), gy - 100 * math.sin(ang))
d.line([(ax0, ay0), tip], fill=(255, 214, 0), width=24)
d.polygon([tip, (tip[0] - 70 * math.cos(ang - 0.5), tip[1] - 70 * math.sin(ang - 0.5)),
           (tip[0] - 70 * math.cos(ang + 0.5), tip[1] - 70 * math.sin(ang + 0.5))], fill=(255, 214, 0))
y = 120
for txt, size, col in cfg['lineas']:
    f = m.font('Black', size)
    while d.textlength(txt, font=f) > 840 and size > 60:
        size -= 10; f = m.font('Black', size)
    d.text((70, y), txt, font=f, fill=tuple(col), stroke_width=10, stroke_fill=(0, 0, 0)); y += int(size * 1.08)
if cfg.get('caja'):
    f = m.font('Black', 90); w = d.textlength(cfg['caja'], font=f)
    d.rounded_rectangle([75, y + 20, 75 + w + 60, y + 140], 22, fill=(230, 30, 40))
    d.text((105, y + 80), cfg['caja'], font=f, fill=(255, 255, 255), anchor='lm')
im.resize((1280, 720), Image.LANCZOS).save(out, quality=93)
