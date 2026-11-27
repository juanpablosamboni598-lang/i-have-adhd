# Saca a Xeno de chars28.json como SVG sueltos (mismo viewBox) para importarlos en RaveAnima.
import json, pathlib, sys
d = json.load(open('../remotion/src/chars28.json'))['X']
VB = '-260 -250 520 1100'  # caja comun: cabeza arriba, pies abajo
out = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '.')
def svg(inner): return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{VB}" width="520" height="1100">{inner}</svg>'
(out / 'x_cuerpo.svg').write_text(svg(d['b']['normal']))
for e in ('sorprendido', 'riendo', 'normal'):
    (out / f'x_cabeza_{e}.svg').write_text(svg(f'<g transform="translate(0 -40)">{d["h"][e]}</g>'))
(out / 'x_completo.svg').write_text(svg(d['b']['normal'] + f'<g transform="translate(0 -40)">{d["h"]["riendo"]}</g>'))
