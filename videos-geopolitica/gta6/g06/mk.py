"""g06 (la filtración, animación 2D): los caps ya vienen en escenas.json; aquí se agregan los SFX por tipo de escena
y un 'click' en cada texto según los tiempos de timeline.json. Uso: python3 gta6/g06/mk.py"""
import json, os, re
here = os.path.dirname(os.path.abspath(__file__))
E = json.load(open(f'{here}/escenas.json'))
FX = {
    'cuarto': [[0.03, 'whoosh'], [0.15, 'tic'], [0.4, 'bip'], [0.7, 'tic']],
    'titulo': [[0.03, 'impacto'], [0.2, 'brillo'], [0.6, 'swish']],
    'calendario': [[0.05, 'pop'], [0.2, 'swish'], [0.5, 'tic'], [0.75, 'ding']],
    'foro': [[0.05, 'bip'], [0.3, 'pop'], [0.4, 'pop'], [0.5, 'pop'], [0.6, 'pop'], [0.75, 'ding']],
    'tv': [[0.03, 'electrico'], [0.2, 'bip'], [0.6, 'brillo']],
    'duo2': [[0.05, 'pop'], [0.15, 'pop'], [0.4, 'brillo'], [0.7, 'swish']],
    'contador': [[0.05, 'whoosh'], [0.2, 'tic'], [0.35, 'tic'], [0.6, 'ding']],
    'titular': [[0.03, 'impacto'], [0.25, 'swish'], [0.6, 'tic']],
    'pantalla': [[0.03, 'bip'], [0.1, 'pop'], [0.45, 'fallo'], [0.8, 'whoosh']],
    'borrar': [[round(0.15 + k * 0.06, 2), 'fallo' if k % 3 == 0 else 'pop'] for k in range(10)],
    'figura': [[0.03, 'whoosh'], [0.3, 'impacto'], [0.6, 'brillo']],
    'red': [[0.05, 'electrico'], [0.3, 'pop'], [0.5, 'pop'], [0.7, 'alarma']],
    'kit': [[round(0.08 + k * 0.14, 2), 'pop'] for k in range(5)] + [[0.85, 'swish']],
    'chat': [[0.05, 'bip'], [0.25, 'pop'], [0.45, 'pop'], [0.65, 'pop'], [0.85, 'pop']],
    'sirena': [[0.03, 'alarma'], [0.35, 'alarma'], [0.7, 'impacto']],
    'dinero': [[0.05, 'clink'], [0.3, 'clink'], [0.45, 'tic'], [0.7, 'ding']],
    'cuarto2': [[0.05, 'tic'], [0.3, 'tic'], [0.55, 'tic'], [0.8, 'swish']],
    'juez': [[0.05, 'impacto'], [0.35, 'impacto'], [0.6, 'tic'], [0.85, 'impacto']],
    'balanza2': [[0.05, 'pop'], [0.4, 'whoosh'], [0.55, 'brillo'], [0.8, 'ding']],
    'lista2': [[round(0.08 + k * 0.18, 2), 'pop'] for k in range(4)] + [[0.85, 'swish']],
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
