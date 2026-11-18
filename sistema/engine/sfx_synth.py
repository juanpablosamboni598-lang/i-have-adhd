"""Efectos de sonido sintetizados (sin derechos) para objetos concretos del Modo A.
Uso: python3 sfx_synth.py eventos.json total_seg salida.wav
eventos.json: [[tiempo, "tipo", volumen], ...]
Tipos: skate, squeak, coins, clink, impact, whoosh, tape, ticks, punch, shutter, swoosh, pop, thud, scribble, stamp, slot, riser, bubbles
"""
import json, sys
import numpy as np
from scipy.io import wavfile
from scipy.signal import lfilter

SR = 44100
rng = np.random.default_rng(7)


def t_(d): return np.arange(int(d * SR)) / SR
def env(d, a=0.005, k=8.0):
    t = t_(d); e = np.exp(-k * t); n = int(a * SR)
    if n: e[:n] *= np.linspace(0, 1, n)
    return e
def noise(d): return rng.standard_normal(int(d * SR))
def lp(x, a): return lfilter([a], [1, a - 1], x)  # paso bajo de 1 polo
def hp(x, a): return x - lp(x, a)
def norm(x, g=1.0): m = np.max(np.abs(x)) or 1; return x / m * g
def lp_var(x, a):  # paso bajo con coeficiente variable (barridos)
    y = np.empty_like(x); s = 0.0
    for i in range(len(x)): s += a[i] * (x[i] - s); y[i] = s
    return y


def skate():
    d = 0.55; t = t_(d)
    roll = lp(noise(d), 0.04) * (0.6 + 0.4 * np.sin(2 * np.pi * 18 * t)) * np.minimum(1, t * 6) * np.exp(-2.5 * t)
    pop_ = np.zeros_like(t); i = int(0.32 * SR)
    c = norm(hp(noise(0.04), 0.3)) * env(0.04, 0.001, 90); pop_[i:i + len(c)] += c * 0.9
    wood = np.sin(2 * np.pi * 420 * t_(0.12)) * env(0.12, 0.001, 35); pop_[i:i + len(wood)] += wood * 0.6
    return norm(norm(roll) * 0.7 + pop_)

def squeak():
    d = 0.18; t = t_(d); f = 2100 + 900 * t / d + 60 * np.sin(2 * np.pi * 40 * t)
    return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) ** 2)

def clink(f0=None):
    d = 0.35; t = t_(d); f0 = f0 or rng.uniform(2600, 3400)
    s = sum(np.sin(2 * np.pi * f0 * r * t) * np.exp(-k * t) for r, k in [(1, 14), (1.52, 18), (2.31, 24), (3.07, 30)])
    return norm(s * env(d, 0.0005, 3))

def coins():
    out = np.zeros(int(0.9 * SR))
    for k in range(7):
        c = clink() * rng.uniform(0.4, 1.0); i = int((0.03 + k * rng.uniform(0.06, 0.11)) * SR)
        out[i:i + len(c)] += c[:len(out) - i]
    return norm(out)

def impact():
    d = 0.6; t = t_(d); f = 120 * np.exp(-6 * t) + 45
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(d, 0.002, 6)
    click = norm(lp(noise(d), 0.3)) * env(d, 0.001, 40)
    return norm(body + 0.35 * click)

def whoosh(d=0.35):
    t = t_(d); a = 0.02 + 0.25 * np.sin(np.pi * t / d) ** 2
    return norm(lp_var(noise(d), a) * np.sin(np.pi * t / d) ** 1.5)

def tape():
    out = np.zeros(int(0.4 * SR))
    for tt, g in [(0.0, 1.0), (0.09, 0.6), (0.2, 0.8)]:
        c = norm(hp(noise(0.03), 0.2)) * env(0.03, 0.0005, 120) * g
        r = np.sin(2 * np.pi * 900 * t_(0.05)) * env(0.05, 0.0005, 60) * g * 0.5
        i = int(tt * SR); out[i:i + len(c)] += c; out[i:i + len(r)] += r
    return norm(out)

def ticks(n=4, gap=0.25):
    out = np.zeros(int((n * gap + 0.1) * SR))
    for k in range(n):
        f = 3200 if k % 2 == 0 else 2500
        c = (np.sin(2 * np.pi * f * t_(0.03)) + 0.5 * norm(hp(noise(0.03), 0.4))) * env(0.03, 0.0005, 160)
        i = int(k * gap * SR); out[i:i + len(c)] += c
    return norm(out)

def punch():
    a = impact(); s = norm(hp(noise(0.12), 0.25)) * env(0.12, 0.0005, 30)
    out = a.copy(); out[:len(s)] += s * 0.5
    return norm(out)

def shutter():
    out = np.zeros(int(0.25 * SR))
    for tt, g in [(0.0, 1.0), (0.07, 0.8)]:
        c = norm(hp(noise(0.035), 0.15)) * env(0.035, 0.0005, 110) * g
        m = np.sin(2 * np.pi * 1600 * t_(0.04)) * env(0.04, 0.0005, 90) * g * 0.4
        i = int(tt * SR); out[i:i + len(c)] += c; out[i:i + len(m)] += m
    return norm(out)

def swoosh(): return whoosh(0.45)

def pop(f=900):
    d = 0.12; t = t_(d); fr = f * (1 + 1.2 * np.exp(-40 * t))
    return norm(np.sin(2 * np.pi * np.cumsum(fr) / SR) * env(d, 0.001, 30))

def thud():
    d = 0.7; t = t_(d); body = np.sin(2 * np.pi * np.cumsum(70 * np.exp(-3 * t) + 38) / SR) * env(d, 0.002, 7)
    grit = norm(lp(noise(d), 0.12)) * env(d, 0.001, 18)
    return norm(body + 0.6 * grit)

def scribble():
    d = 0.45; t = t_(d); x = hp(noise(d), 0.35) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 9 * t)))
    return norm(lp(x, 0.5) * np.sin(np.pi * t / d))

def stamp():
    w = whoosh(0.13); th = thud(); out = np.zeros(len(w) + len(th))
    out[:len(w)] += w * 0.6; j = len(w) - 400; out[j:j + len(th)] += th
    return norm(out)

def slot():
    out = np.zeros(int(0.6 * SR))
    for k in range(10):
        c = (np.sin(2 * np.pi * 2800 * t_(0.02)) + 0.4 * norm(hp(noise(0.02), 0.4))) * env(0.02, 0.0005, 200)
        i = int((k * 0.045 + k * k * 0.0015) * SR); out[i:i + len(c)] += c
    return norm(out)

def riser():
    d = 0.4; t = t_(d); f = 200 + 1800 * (t / d) ** 2
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.3
    return norm((tone + whoosh(d) * 0.8) * (t / d))

def bubbles():
    out = np.zeros(int(1.4 * SR))
    for k in range(9):
        p = pop(rng.uniform(700, 1500)) * rng.uniform(0.3, 0.8); i = int((k * 0.13 + rng.uniform(0, 0.04)) * SR)
        out[i:i + len(p)] += p
    return norm(out)

GEN = dict(skate=skate, squeak=squeak, coins=coins, clink=clink, impact=impact, whoosh=whoosh, tape=tape, ticks=ticks,
           punch=punch, shutter=shutter, swoosh=swoosh, pop=pop, thud=thud, scribble=scribble, stamp=stamp, slot=slot,
           riser=riser, bubbles=bubbles)

if __name__ == "__main__":
    ev = json.load(open(sys.argv[1])); total = float(sys.argv[2])
    out = np.zeros(int((total + 1.5) * SR))
    for e in ev:
        tt, kind, vol = e[0], e[1], e[2]
        s = GEN[kind]() * vol; i = int(max(0, tt) * SR)
        out[i:i + len(s)] += s[:len(out) - i]
    out = out[:int(total * SR)]
    out = out / max(1.0, np.max(np.abs(out)) / 0.9)
    wavfile.write(sys.argv[3], SR, (out * 32767).astype(np.int16))
    print("ok", len(ev), "eventos")
