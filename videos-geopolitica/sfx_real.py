"""Pista de efectos con sonidos REALES (librería CC0 en sfx_lib/) + densidad objetivo.
Uso: sfx_real.py <carpeta> [densidad_por_s=2.0]
Lee escenas.json[*].sfx ([[posición 0-1, nombre], ...]) y timeline.json (con tiempos por palabra).
- Cada nombre de sfx.py se traduce a una categoría de la librería (y palabras clave preferidas).
- Los que no tienen equivalente real (calor, tensión, misterio...) se siguen sintetizando con sfx.py.
- Rellena con golpecitos suaves en palabras importantes hasta llegar a la densidad objetivo (referencias: ~2/s).
Escribe <carpeta>/sfx.wav (estéreo 44.1 kHz), el mismo archivo que usa ensamblar_cartoon.sh."""
import json, os, sys, wave, random
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sfx as SYN  # efectos sintéticos de respaldo

SR = 44100
LIB = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sfx_lib')
IDX = json.load(open(os.path.join(LIB, 'indice.json')))
# nombre (sfx.py) -> (categoría, palabras clave preferidas, volumen)
MAP = {
    'whoosh': ('whoosh', ['whoosh', 'air'], 0.55), 'whoosh_largo': ('whoosh', ['whoosh', 'air'], 0.55),
    'swish': ('whoosh', ['swish', 'swing'], 0.5), 'zoom': ('whoosh', ['air', 'whoosh'], 0.45),
    'pop': ('pop', ['pop'], 0.6), 'ding': ('ui', ['confirm', 'select', 'question'], 0.45), 'campana': ('ui', ['confirm'], 0.45),
    'brillo': ('ui', ['select', 'maximize'], 0.4), 'bip': ('ui', ['select', 'rollover'], 0.4),
    'fallo': ('ui', ['error', 'glitch', 'back'], 0.55), 'alarma': ('ui', ['error'], 0.55),
    'click': ('clic', ['click', 'switch'], 0.55), 'tic': ('clic', ['tick', 'click'], 0.45),
    'impacto': ('golpe', ['slam', 'hit', 'impact'], 0.6), 'corte': ('golpe', ['hit'], 0.55), 'mordida': ('golpe', ['hit', 'slap'], 0.5),
    'agua_flujo': ('agua', ['tap_water', 'pour', 'water'], 0.5), 'chapoteo': ('agua', ['splash'], 0.55),
    'gota': ('agua', ['drip', 'drop', 'splash'], 0.5), 'onda': ('agua', ['splash', 'water'], 0.45),
    'burbujas': ('burbuja', ['bubble'], 0.5), 'mecanismo': ('mecanico', ['lock', 'machine', 'chain', 'spring'], 0.55),
    'motor': ('mecanico', ['engine', 'machine'], 0.5), 'clink': ('metal', ['metal', 'glass', 'coin'], 0.5),
    'electrico': ('electrico', ['electric', 'zap', 'spark'], 0.45),
}
_cache = {}


def load(rel):
    if rel in _cache: return _cache[rel]
    with wave.open(os.path.join(LIB, rel)) as w:
        x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    _cache[rel] = x; return x


def pick(cat, keys, rnd, last):
    files = IDX.get(cat, [])
    pref = [f for f in files if any(k in f for k in keys)] or files
    choices = [f for f in pref if f != last.get(cat)] or pref  # no repetir el mismo dos veces seguidas
    f = rnd.choice(choices); last[cat] = f; return f


def write(path, x):
    x = np.clip(x, -1, 1); st = (np.stack([x, x], 1) * 32767).astype(np.int16)
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes())


def main():
    folder = sys.argv[1]; dens = float(sys.argv[2]) if len(sys.argv) > 2 else 2.0
    esc = json.load(open(os.path.join(folder, 'escenas.json')))
    tl = json.load(open(os.path.join(folder, 'timeline.json'))); total = tl['total']
    out = np.zeros(int(SR * (total + 4))); rnd = random.Random(7); last = {}; ev = []
    def put(x, at, vol):
        p = int(SR * at); out[p:p + len(x)] += vol * x[:max(0, len(out) - p)]; ev.append(at)
    for sc, s in zip(esc, tl['scenes']):
        for frac, name in sc.get('sfx', []):
            at = s['start'] + frac * s['dur']
            if name in MAP:
                cat, keys, vol = MAP[name]
                if IDX.get(cat): put(load(pick(cat, keys, rnd, last)), at, vol); continue
            f = SYN.FX.get(name)
            if f: put(f(), at, 0.8)
    # relleno: golpecitos suaves en palabras importantes (>=5 letras) donde no haya otro efecto cerca
    need = int(dens * total) - len(ev)
    cand = [s['start'] + w[1] for s in tl['scenes'] for w in s.get('words', []) if len(w[0].strip('.,¿?¡!')) >= 4]
    rnd.shuffle(cand); evs = sorted(ev)
    for at in cand:
        if need <= 0: break
        if any(abs(at - e) < 0.3 for e in evs): continue
        cat = rnd.choice(['papel', 'clic', 'pop', 'whoosh'])
        put(load(pick(cat, [], rnd, last)), at, 0.22 if cat != 'whoosh' else 0.18); evs.append(at); evs.sort(); need -= 1
    # si aún falta, llenar huecos largos (>0.9 s) por la mitad
    while need > 0:
        b = [0.0] + evs + [total]; gaps = [(b[k + 1] - b[k], b[k]) for k in range(len(b) - 1)]
        g, a = max(gaps)
        if g < 0.9: break
        at = a + g / 2; cat = rnd.choice(['papel', 'clic', 'pop'])
        put(load(pick(cat, [], rnd, last)), at, 0.2); evs.append(at); evs.sort(); need -= 1
    out = out[:int(round(SR * total))]
    pk = np.abs(out).max(); out *= 0.6 / pk if pk > 0.6 else 1
    write(os.path.join(folder, 'sfx.wav'), out)
    print(f'sfx real ok {total:.1f} s; efectos {len(ev)} ({len(ev) / total:.2f}/s)')


if __name__ == '__main__':
    main()
