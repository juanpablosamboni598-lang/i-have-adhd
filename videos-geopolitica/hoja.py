import json, sys
sys.path.insert(0, '.')
import motor
from PIL import ImageDraw, Image
folder, frac, out = sys.argv[1], float(sys.argv[2]), sys.argv[3]
esc = json.load(open(f'{folder}/escenas.json')); tl = json.load(open(f'{folder}/timeline.json'))
th = []
for i, sc in enumerate(esc):
    seg = tl['scenes'][i]; t = seg['dur'] * frac
    im = motor.background_at(motor.make_background(i), seg['start'] + t); d = ImageDraw.Draw(im)
    motor.SCENES[sc['tipo']](d, t, seg['dur'], sc)
    if sc['tipo'] not in ('titulo', 'gran_titulo'): motor.header(d, sc, t, seg['dur'])
    motor.captions(d, seg['words'], t)
    th.append(im.resize((480, 270)))
sh = Image.new('RGB', (480 * 4, 270 * 4))
for k, im in enumerate(th): sh.paste(im, ((k % 4) * 480, (k // 4) * 270))
sh.save(out, quality=85)
