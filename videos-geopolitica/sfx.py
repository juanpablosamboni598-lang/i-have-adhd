"""Efectos de sonido y pista sfx.wav + ambiente.
Uso: sfx.py <carpeta>   (lee escenas.json[*].sfx y timeline.json)
Fuente de cada efecto, en orden:
  1) caché local assets/sfx_cache/<nombre>.wav
  2) Freesound API v2 (si existe la variable FREESOUND_API_KEY): busca el preview MP3, SOLO licencia
     Creative Commons 0 (uso comercial libre, sin atribución), lo convierte a WAV y lo guarda en la caché
  3) el generador sintético de este archivo (siempre disponible, sin red)."""
import json, os, sys, wave, subprocess, tempfile
import numpy as np

SR = 44100
rng = np.random.default_rng(7)


def t(d):
    return np.arange(int(round(SR * d))) / SR


def env(n, a=0.005, r=None):
    e = np.ones(n)
    na = max(1, int(round(SR * a)))
    e[:na] = np.linspace(0, 1, na)
    if r is None:
        e *= np.exp(-np.linspace(0, 6, n))
    else:
        nr = min(n, int(round(SR * r)))
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


def noise(d):
    return rng.standard_normal(int(round(SR * d)))


def lp(x, k):  # media móvil simple (paso bajo)
    k = max(1, int(k))
    return np.convolve(x, np.ones(k) / k, mode='same')


def hp(x, k):
    return x - lp(x, k)


def sweep(f0, f1, d, wave_=np.sin):
    tt = t(d)
    f = np.linspace(f0, f1, len(tt))
    return wave_(2 * np.pi * np.cumsum(f) / SR)


def whoosh(d=0.6):
    n = noise(d)
    x = lp(n, 6) * np.sin(np.linspace(0, np.pi, len(n))) ** 2
    return 0.5 * x


def whoosh_largo():
    return whoosh(1.3) * 1.2


def splash():
    d = 1.2
    x = hp(noise(d), 4) * env(int(round(SR * d)), 0.003)
    drops = np.zeros_like(x)
    for _ in range(25):
        p = rng.integers(int(round(SR * 0.1)), len(x) - 2000)
        drops[p:p + 1500] += 0.3 * np.sin(2 * np.pi * rng.uniform(900, 2500) * t(1500 / SR)) * np.exp(-np.linspace(0, 8, 1500))
    return 0.6 * x + drops


def impacto():
    d = 0.8
    b = np.sin(2 * np.pi * np.cumsum(np.linspace(120, 40, int(round(SR * d)))) / SR) * env(int(round(SR * d)), 0.002)
    return 0.9 * b + 0.3 * lp(noise(d), 3) * env(int(round(SR * d)), 0.001) ** 3


def pop():
    return 0.6 * sweep(300, 900, 0.09) * env(int(round(SR * 0.09)), 0.002)


def ding():
    tt = t(1.0)
    return 0.4 * (np.sin(2 * np.pi * 1320 * tt) + 0.4 * np.sin(2 * np.pi * 2640 * tt)) * np.exp(-tt * 5)


def campana():
    tt = t(1.6)
    return 0.4 * sum(a * np.sin(2 * np.pi * f * tt) for f, a in ((880, 1), (1760, .5), (2350, .3))) * np.exp(-tt * 3)


def brillo():
    tt = t(0.8)
    return 0.25 * sum(np.sin(2 * np.pi * f * tt) * np.exp(-((tt - k * 0.08) * 20) ** 2) for k, f in enumerate((1760, 2093, 2637, 3136, 3520)))


def agua_flujo():
    d = 2.0
    x = lp(noise(d), 30) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.7 * t(d)))
    return 1.4 * x * env(int(round(SR * d)), 0.3, 0.6)


def burbujas():
    d = 1.5
    x = np.zeros(int(round(SR * d)))
    for _ in range(18):
        p = rng.integers(0, len(x) - 3000)
        n = rng.integers(1200, 3000)
        y = 0.3 * sweep(rng.uniform(300, 600), rng.uniform(900, 1600), n / SR)
        x[p:p + len(y)] += y * np.exp(-np.linspace(0, 5, len(y)))
    return x


def zoom():
    return 0.35 * sweep(200, 1200, 0.5) * np.sin(np.linspace(0, np.pi, int(round(SR * 0.5)))) + 0.3 * whoosh(0.5)


def alarma():
    tt = t(1.2)
    f = np.where((tt * 4).astype(int) % 2 == 0, 880, 660)
    return 0.25 * np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * env(len(tt), 0.01, 0.1)


def calor():
    d = 1.5
    return 0.6 * lp(noise(d), 12) * env(int(round(SR * d)), 0.4, 0.5) + 0.15 * np.sin(2 * np.pi * 70 * t(d)) * env(int(round(SR * d)), 0.4, 0.5)


def olfatear():
    out = []
    for _ in range(3):
        n = hp(noise(0.12), 3) * np.sin(np.linspace(0, np.pi, int(round(SR * 0.12))))
        out += [0.5 * n, np.zeros(int(round(SR * 0.06)))]
    return np.concatenate(out)


def gota():
    return 0.5 * sweep(1800, 500, 0.12) * env(int(round(SR * 0.12)), 0.001)


def chapoteo():
    return 0.7 * splash()[:int(round(SR * 0.6))] * env(int(round(SR * 0.6)), 0.002, 0.2)


def onda():
    tt = t(1.0)
    return 0.4 * np.sin(2 * np.pi * 180 * tt + 3 * np.sin(2 * np.pi * 4 * tt)) * np.exp(-tt * 3)


def electrico():
    d = 0.7
    x = np.sign(np.sin(2 * np.pi * 120 * t(d))) * 0.2 + hp(noise(d), 2) * 0.25 * (rng.random(int(round(SR * d))) > 0.7)
    return x * env(int(round(SR * d)), 0.005, 0.2)


def mordida():
    return 0.9 * impacto()[:int(round(SR * 0.4))] + 0.4 * hp(noise(0.4), 2) * env(int(round(SR * 0.4)), 0.001) ** 2


def corte():
    return 0.5 * hp(noise(0.25), 2) * np.exp(-np.linspace(0, 10, int(round(SR * 0.25))))


def clink():
    tt = t(0.5)
    return 0.35 * (np.sin(2 * np.pi * 3200 * tt) + np.sin(2 * np.pi * 4700 * tt)) * np.exp(-tt * 14)


def mecanismo():
    out = []
    for _ in range(5):
        out += [clink()[:2500] * 0.8, np.zeros(int(round(SR * 0.09)))]
    return np.concatenate(out) + 0.0


def tic():
    tt = t(0.05)
    return 0.4 * np.sin(2 * np.pi * 2000 * tt) * np.exp(-tt * 120)


def click():
    return tic() * 1.2


def swish():
    return whoosh(0.3)


def motor():
    d = 2.0
    f = np.linspace(60, 200, int(round(SR * d)))
    x = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR))
    return 0.15 * lp(x, 8) * env(int(round(SR * d)), 0.2, 0.5)


def fallo():
    return 0.4 * sweep(500, 120, 0.8, lambda a: np.sign(np.sin(a))) * env(int(round(SR * 0.8)), 0.01, 0.3) * 0.6


def bip():
    tt = t(0.15)
    return 0.3 * np.sin(2 * np.pi * 1000 * tt) * env(len(tt), 0.005, 0.03)


def misterio():
    tt = t(3.0)
    return 0.18 * (np.sin(2 * np.pi * 110 * tt) + np.sin(2 * np.pi * 116.5 * tt) + 0.5 * np.sin(2 * np.pi * 164.8 * tt)) * env(len(tt), 0.8, 1.2)


def tension():
    tt = t(2.5)
    return 0.22 * np.sin(2 * np.pi * np.cumsum(np.linspace(55, 90, len(tt))) / SR) * env(len(tt), 0.5, 0.4) + 0.08 * lp(noise(2.5), 20)


def latido():
    one = np.sin(2 * np.pi * 55 * t(0.12)) * np.exp(-np.linspace(0, 6, int(round(SR * 0.12))))
    beat = np.concatenate([one, np.zeros(int(round(SR * 0.1))), 0.7 * one, np.zeros(int(round(SR * 0.5)))])
    return 0.9 * np.tile(beat, 3)


def ambiente():
    d = 3.0
    return 0.5 * lp(noise(d), 60) * env(int(round(SR * d)), 0.8, 1.0)


FX = {k: v for k, v in globals().items() if callable(v) and k not in ('t', 'env', 'noise', 'lp', 'hp', 'sweep', 'main', 'write')}


def write(path, x):
    x = np.clip(x, -1, 1)
    st = (np.stack([x, x], 1) * 32767).astype(np.int16)
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes())


# ---------- efectos reales (Freesound, CC0) con caché ----------
CACHE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets', 'sfx_cache')
QUERIES = {  # nombre interno -> búsqueda en Freesound
    'whoosh': 'whoosh', 'whoosh_largo': 'whoosh long', 'splash': 'water splash', 'impacto': 'impact hit', 'pop': 'pop',
    'ding': 'ding', 'campana': 'bell ring', 'brillo': 'sparkle', 'agua_flujo': 'water flow', 'burbujas': 'bubbles',
    'zoom': 'zoom swoosh', 'alarma': 'alarm beep', 'calor': 'sizzle', 'olfatear': 'sniff', 'gota': 'water drop',
    'chapoteo': 'water splash small', 'onda': 'sonar ping', 'electrico': 'electric zap', 'mordida': 'bite crunch',
    'corte': 'cut slice', 'clink': 'metal clink', 'mecanismo': 'mechanism click', 'tic': 'clock tick', 'click': 'click',
    'swish': 'swish', 'motor': 'motor hum', 'fallo': 'fail buzzer', 'bip': 'beep', 'misterio': 'mystery sting',
    'tension': 'tension riser', 'latido': 'heartbeat',
}
_mem = {}


def _read_wav(path):
    with wave.open(path) as w:
        a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
        if w.getnchannels() == 2:
            a = a.reshape(-1, 2).mean(1)
    return a


def freesound(name):
    """Devuelve el efecto real (np.array) o None. Nunca falla: cualquier error -> None (se usa el sintético)."""
    if name in _mem:
        return _mem[name]
    path = os.path.join(CACHE, name + '.wav')
    x = None
    if os.path.exists(path):
        x = _read_wav(path)
    elif os.environ.get('FREESOUND_API_KEY') and name in QUERIES:
        try:
            import requests
            key = os.environ['FREESOUND_API_KEY']
            r = requests.get('https://freesound.org/apiv2/search/text/', timeout=20, params={
                'query': QUERIES[name], 'filter': 'license:"Creative Commons 0" duration:[0.1 TO 4]',
                'fields': 'id,name,previews,license,duration', 'sort': 'rating_desc', 'page_size': 5, 'token': key})
            r.raise_for_status()
            res = [h for h in r.json().get('results', []) if 'creativecommons.org/publicdomain/zero' in h.get('license', '')]
            if res:
                url = res[0]['previews']['preview-hq-mp3']
                mp3 = requests.get(url, timeout=30, params={'token': key})
                mp3.raise_for_status()
                os.makedirs(CACHE, exist_ok=True)
                with tempfile.NamedTemporaryFile(suffix='.mp3') as tmp:
                    tmp.write(mp3.content); tmp.flush()
                    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', tmp.name, '-t', '3', '-ac', '1', '-ar', str(SR),
                                    '-af', 'afade=t=out:st=2.6:d=0.4,loudnorm=I=-20:TP=-3', path], check=True)
                json.dump({'name': name, 'freesound_id': res[0]['id'], 'title': res[0]['name'], 'license': res[0]['license']},
                          open(path + '.json', 'w'), ensure_ascii=False)
                x = _read_wav(path)
        except Exception as e:
            print('freesound', name, 'falló, uso sintético:', type(e).__name__, file=sys.stderr)
    if x is not None:
        x = x * (0.55 / max(1e-6, float(np.abs(x).max())))  # nivel parecido al sintético
    _mem[name] = x
    return x


def main():
    folder = sys.argv[1]
    esc = json.load(open(os.path.join(folder, 'escenas.json')))
    tl = json.load(open(os.path.join(folder, 'timeline.json')))
    total = tl['total']
    out = np.zeros(int(SR * (total + 4)))
    missing = set()
    for sc, s in zip(esc, tl['scenes']):
        for frac, name in sc.get('sfx', []):
            x = freesound(name)
            if x is None:
                f = FX.get(name)
                if not f:
                    missing.add(name); continue
                x = f()
            p = int(SR * (s['start'] + frac * s['dur']))
            out[p:p + len(x)] += x[:len(out) - p]
    # ambiente submarino continuo: ruido grave + burbujas ocasionales
    n = len(out)
    amb = lp(noise(n / SR), 120) * 1.2
    amb *= 0.75 + 0.25 * np.sin(2 * np.pi * 0.1 * np.arange(n) / SR)
    for p in rng.integers(0, n - SR * 2, int(total / 4)):
        b = burbujas() * 0.25
        amb[p:p + len(b)] += b
    out += 0.35 * amb
    out = out[:int(round(SR * total))]
    out *= 0.6 / max(1e-6, np.abs(out).max()) if np.abs(out).max() > 0.6 else 1
    write(os.path.join(folder, 'sfx.wav'), out)
    print('sfx ok', round(total, 1), 's; faltan:', sorted(missing))


if __name__ == '__main__':
    main()
