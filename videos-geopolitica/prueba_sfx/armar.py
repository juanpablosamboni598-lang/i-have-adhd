"""Prueba de 15 s de efectos reales sobre la lavadora (v23, 74.7–89.7 s): escenas motor, llenar y válvula.
Crea escenas.json/timeline.json recortados, agrega whoosh real en cada corte y clic en cada palabra clave (caps de scenes23.jsx)."""
import json, re, os
H = os.path.dirname(os.path.abspath(__file__)); V = os.path.join(H, '..', 'v23')
T0, DUR = 74.7, 15.0
E = json.load(open(f'{V}/escenas.json')); TL = json.load(open(f'{V}/timeline.json'))['scenes']
src = open(os.path.join(H, '..', 'remotion/src/three/scenes23.jsx')).read()
def caps(tipo):
    m = re.search(r'\n  ' + tipo + r': \(\{ t, d \}\) => .*?caps: \[(.*?)\]\s*,?\s*\n\s*\}', src, re.S)
    return re.findall(r"\['([^']+)'", m.group(1)) if m else []
norm = lambda s: re.sub(r'[^a-zñ0-9]', '', s.lower().translate(str.maketrans('áéíóú', 'aeiou')))
esc, scenes = [], []
for e, s in zip(E, TL):
    a, b = max(s['start'], T0), min(s['start'] + s['dur'], T0 + DUR)
    if b <= a: continue
    dur = b - a; off = a - s['start']
    sfx = [[(f * s['dur'] - off) / dur, n] for f, n in e.get('sfx', []) if 0 <= f * s['dur'] - off <= dur]
    words = [[w, t - off] for w, t in s['words'] if 0 <= t - off <= dur]
    if s['start'] >= T0: sfx.append([0.0, 'whoosh'])            # corte de escena -> whoosh real
    for trig in caps(e['tipo']):                                    # palabra clave del texto en pantalla -> clic
        w = next((x for x in words if norm(trig) in norm(x[0])), None)
        if w: sfx.append([w[1] / dur, 'click'])
    esc.append({**e, 'sfx': sorted(sfx)}); scenes.append({'start': a - T0, 'dur': dur, 'words': words})
json.dump(esc, open(f'{H}/escenas.json', 'w'), ensure_ascii=False, indent=1)
json.dump({'scenes': scenes, 'total': DUR}, open(f'{H}/timeline.json', 'w'), ensure_ascii=False)
for e, s in zip(esc, scenes): print(e['tipo'], round(s['start'], 2), round(s['dur'], 2), e['sfx'])
