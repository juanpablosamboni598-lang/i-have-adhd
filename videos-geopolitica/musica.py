"""Genera una pista instrumental cinematográfica (sin derechos de autor) con numpy."""
import numpy as np, sys, wave
SR = 44100
dur = float(sys.argv[1]); out = sys.argv[2]
N = int(SR * dur); t = np.arange(N) / SR
bpm = 92; beat = 60 / bpm; bar = beat * 4
rng = np.random.default_rng(3)
mix = np.zeros((N, 2))

def note(m): return 440 * 2 ** ((m - 69) / 12)
def onepole(x, a):
    y = np.empty_like(x); acc = 0.0
    # vectorizado por bloques con lfilter manual
    for i in range(0, len(x), 4096):
        seg = x[i:i+4096]
        out = np.empty_like(seg)
        for j, v in enumerate(seg):
            acc += a * (v - acc); out[j] = acc
        y[i:i+4096] = out
    return y
def lp(x, fc):
    # filtro paso bajo rápido por FFT
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / np.sqrt(1 + (f / fc) ** 4)
    return np.fft.irfft(X, len(x))

# progresión: Am - F - C - G (2 compases cada acorde)
prog = [[57, 60, 64], [53, 57, 60], [48, 55, 64], [55, 59, 62]]
roots = [45, 41, 48, 43]
chord_len = bar * 2
def chord_at(tt): return int(tt // chord_len) % 4

# secciones (intensidad 0..1 para arp y batería)
def section(tt):
    p = tt / dur
    if p < 0.08: return 0.0, 0.0
    if p < 0.25: return 1.0, 0.0
    if p < 0.55: return 1.0, 1.0
    if p < 0.65: return 0.6, 0.0
    if p < 0.93: return 1.0, 1.0
    return 0.4, 0.0

# --- pad: sierras desafinadas
pad = np.zeros(N)
nseg = int(np.ceil(dur / chord_len))
for k in range(nseg):
    s0 = int(k * chord_len * SR); s1 = min(N, int((k + 1) * chord_len * SR))
    if s0 >= N: break
    tt = t[s0:s1] - t[s0]
    seg = np.zeros(s1 - s0)
    for m in prog[k % 4]:
        for det in (-0.12, 0.0, 0.12):
            f = note(m + det)
            seg += 2 * ((tt * f) % 1.0) - 1
    env = np.minimum(1, tt / 0.8) * np.minimum(1, (tt[-1] - tt + 1e-3) / 0.6)
    pad[s0:s1] = seg * env
pad = lp(pad, 900) * 0.035
pad *= 0.8 + 0.2 * np.sin(2 * np.pi * t / (bar * 4))

# --- bajo con pulso (corcheas)
bass = np.zeros(N)
eighth = beat / 2
for k in range(int(dur / eighth)):
    st = k * eighth; s0 = int(st * SR); L = int(eighth * SR)
    if s0 + L > N: break
    tt = np.arange(L) / SR
    f = note(roots[chord_at(st)] - 12)
    bass[s0:s0+L] += (np.sin(2*np.pi*f*tt) + 0.3*np.sin(2*np.pi*2*f*tt)) * np.exp(-tt * 6)
bass *= 0.18

# --- arpegio pluck (semicorcheas)
arp = np.zeros(N); six = beat / 4
pattern = [0, 1, 2, 1, 2, 0, 1, 2]
for k in range(int(dur / six)):
    st = k * six; a, _ = section(st)
    if a == 0: continue
    s0 = int(st * SR); L = int(0.35 * SR)
    if s0 + L > N: break
    ch = prog[chord_at(st)]
    m = ch[pattern[k % 8]] + 12
    tt = np.arange(L) / SR; f = note(m)
    v = (np.sin(2*np.pi*f*tt) + 0.4*np.sin(2*np.pi*2*f*tt) + 0.15*np.sin(2*np.pi*3*f*tt)) * np.exp(-tt * 9)
    arp[s0:s0+L] += v * a * (0.8 if k % 4 == 0 else 0.55)
arp *= 0.05

# --- batería: bombo, caja suave, hi-hat
kick = np.zeros(N); snare = np.zeros(N); hat = np.zeros(N)
for k in range(int(dur / beat)):
    st = k * beat; _, dr = section(st)
    if dr == 0: continue
    s0 = int(st * SR)
    if k % 4 in (0, 2):
        L = int(0.4 * SR); tt = np.arange(L) / SR
        if s0 + L <= N:
            f = 50 + 90 * np.exp(-tt * 30)
            kick[s0:s0+L] += np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-tt * 7)
    if k % 4 in (1, 3):
        L = int(0.25 * SR); tt = np.arange(L) / SR
        if s0 + L <= N:
            snare[s0:s0+L] += rng.standard_normal(L) * np.exp(-tt * 18) * 0.6 + np.sin(2*np.pi*190*tt)*np.exp(-tt*25)*0.4
    for h in (0, 0.5):
        hs = int((st + h * beat) * SR); L = int(0.06 * SR)
        if hs + L <= N:
            hat[hs:hs+L] += rng.standard_normal(L) * np.exp(-np.arange(L)/SR * 60)
hat = hat - lp(hat, 7000)
kick *= 0.30; snare = lp(snare, 5000) * 0.10; hat *= 0.035

# --- impactos graves al inicio de cada sección
boom = np.zeros(N)
for p in (0.08, 0.25, 0.65):
    s0 = int(p * dur * SR); L = int(2.5 * SR); tt = np.arange(L) / SR
    if s0 + L <= N:
        boom[s0:s0+L] += np.sin(2*np.pi*(40 + 30*np.exp(-tt*4))*tt) * np.exp(-tt * 1.6)
boom *= 0.25

mono_low = pad + bass + kick + boom
mix[:, 0] = mono_low + arp * 0.8 + hat * 1.0 + snare
mix[:, 1] = mono_low + arp * 1.2 + hat * 0.7 + snare
# reverb simple (ecos)
for d, g in ((0.11, 0.25), (0.23, 0.18), (0.37, 0.12)):
    s = int(d * SR)
    mix[s:, 0] += mix[:-s, 1] * g * 0.5
    mix[s:, 1] += mix[:-s, 0] * g * 0.5
fade = np.ones(N); fi = int(3 * SR); fo = int(4 * SR)
fade[:fi] = np.linspace(0, 1, fi); fade[-fo:] = np.linspace(1, 0, fo)
mix *= fade[:, None]
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 0.9
data = (mix * 32767).astype(np.int16)
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(data.tobytes())
print('ok', out)
