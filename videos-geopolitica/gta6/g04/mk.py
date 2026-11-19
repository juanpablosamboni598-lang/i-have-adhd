"""g04 (errores del día 1): los caps ya vienen en escenas.json; aquí se agregan los SFX por tipo de escena
y un 'click' en cada texto según los tiempos de timeline.json. Uso: python3 gta6/g04/mk.py"""
import json, os, re
here = os.path.dirname(os.path.abspath(__file__))
E = json.load(open(f'{here}/escenas.json'))
FX = {
    'pantalla': [[0.03, 'bip'], [0.1, 'pop'], [0.45, 'alarma'], [0.8, 'whoosh']],
    'reloj': [[0.05, 'tic'], [0.1, 'tic'], [0.25, 'pop'], [0.6, 'tic'], [0.65, 'tic']],
    'disco': [[0.05, 'pop'], [0.2, 'electrico'], [0.5, 'tic'], [0.7, 'ding']],
    'consola': [[0.03, 'impacto'], [0.1, 'brillo'], [0.3, 'impacto'], [0.6, 'fallo']],
    'ranuras': [[round(0.08 + k * 0.06, 2), 'pop'] for k in range(6)] + [[0.7, 'ding']],
    'caja': [[0.05, 'pop'], [0.35, 'fallo'], [0.6, 'swish']],
    'spoilers': [[round(0.05 + k * 0.04, 2), 'pop'] for k in range(9)] + [[0.55, 'swish']],
}
def norm(s):
    s = s.lower()
    for a, b in zip('áéíóú', 'aeiou'): s = s.replace(a, b)
    return re.sub(r'[^a-zñ0-9]', '', s)
tl = json.load(open(f'{here}/timeline.json')) if os.path.exists(f'{here}/timeline.json') else None
for i, e in enumerate(E):
    fx = list(FX[e['tipo']])
    if tl:
        sc = tl['scenes'][i]
        for trig, _ in e['caps']:
            w = next((x for x in sc['words'] if any(norm(a) in norm(x[0]) for a in trig.split('|'))), None)
            if w: fx.append([round(w[1] / sc['dur'], 3), 'click'])
    e['sfx'] = sorted(fx)
json.dump(E, open(f'{here}/escenas.json', 'w'), ensure_ascii=False, indent=1)
print('escenas', len(E), 'sfx total', sum(len(e['sfx']) for e in E), 'con tiempos' if tl else 'sin timeline')
