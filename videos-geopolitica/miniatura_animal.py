import sys, json
sys.path.insert(0, '.')
import motor as m
from PIL import Image, ImageDraw, ImageFilter, ImageChops
W, H = 1920, 1080
cfg = json.loads(sys.argv[1]); out = sys.argv[2]
im = Image.new('RGB', (W, H)); d = ImageDraw.Draw(im)
for y in range(H): d.line([(0, y), (W, y)], fill=m.mix((10, 60, 120), (2, 10, 30), y / H))
for k in range(9):
    x = 900 + k * 120
    d.polygon([(x, 0), (x + 60, 0), (x - 200, H), (x - 320, H)], fill=m.mix((10, 60, 120), (40, 110, 170), 0.25))
g = Image.new('RGB', (W, H)); gd = ImageDraw.Draw(g)
gx, gy = cfg['glow']
for r, f in ((420, 0.4), (260, 0.7), (140, 1.0)):
    gd.ellipse([gx - r, gy - r, gx + r, gy + r], fill=tuple(int(c * f) for c in cfg.get('glowcol', (255, 80, 60))))
im = ImageChops.add(im, g.filter(ImageFilter.GaussianBlur(110)).point(lambda v: int(v * 0.7)))
d = ImageDraw.Draw(im)
S = m.SCENES['criatura']
# dibujar la criatura directamente con el motor (t fijo)
sc = {'kind': cfg['kind'], 'callouts': []}
S(d, 3.0, 10.0, sc)
grad = Image.new('L', (W, H), 0); gdd = ImageDraw.Draw(grad)
for x in range(W): gdd.line([(x, 0), (x, H)], fill=235 if x < 450 else int(max(0, 235 - (x - 450) * 0.6)))
im = Image.composite(Image.new('RGB', (W, H), (0, 0, 0)), im, grad); d = ImageDraw.Draw(im)
y = cfg.get('y0', 140)
for txt, size, col in cfg['lineas']:
    f = m.font('Black', size)
    while d.textlength(txt, font=f) > 860 and size > 60:
        size -= 10; f = m.font('Black', size)
    d.text((70, y), txt, font=f, fill=tuple(col), stroke_width=10, stroke_fill=(0, 0, 0)); y += int(size * 1.08)
if cfg.get('caja'):
    f = m.font('Black', 84); w = d.textlength(cfg['caja'], font=f)
    d.rounded_rectangle([75, y + 20, 75 + w + 60, y + 135], 22, fill=(230, 30, 40))
    d.text((105, y + 77), cfg['caja'], font=f, fill=(255, 255, 255), anchor='lm')
im.resize((1280, 720), Image.LANCZOS).save(out, quality=93)
