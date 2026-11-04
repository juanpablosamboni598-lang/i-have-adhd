"""Motor de animación para videos de geopolítica (1920x1080, 30 fps).

Uso: python3 motor.py <carpeta_video> <indice_escena>
Lee <carpeta>/escenas.json y <carpeta>/timeline.json y escribe <carpeta>/render/eNN.mp4
"""
import json, math, os, random, subprocess, sys
from functools import lru_cache
from PIL import Image, ImageDraw, ImageFont

W, H, FPS = 1920, 1080, 30
INTER = '/usr/share/fonts/opentype/inter/'
BG = (7, 13, 26)
WHITE = (255, 255, 255)
SOFT = (175, 192, 215)
RED = (235, 64, 74)
GOLD = (255, 200, 60)
CYAN = (70, 200, 255)
LAND = (52, 47, 38)
LAND2 = (66, 59, 46)
SEA = (10, 28, 52)


@lru_cache(None)
def font(weight, size):
    return ImageFont.truetype(f'{INTER}Inter-{weight}.otf', max(8, int(size)))


def lerp(a, b, t):
    return a + (b - a) * t


def mix(c1, c2, t):
    t = max(0.0, min(1.0, t))
    return tuple(int(lerp(a, b, t)) for a, b in zip(c1, c2))


def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def ease_out(t):
    t = clamp(t)
    return 1 - (1 - t) ** 3


def ease_back(t):
    t = clamp(t)
    c1, c3 = 1.70158, 2.70158
    return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2


def prog(t, start, dur):
    return clamp((t - start) / dur) if dur > 0 else float(t >= start)


# ---------------------------------------------------------------- fondo
def make_background(seed):
    rnd = random.Random(seed)
    im = Image.new('RGB', (W + 400, H + 400), BG)
    d = ImageDraw.Draw(im)
    for y in range(im.height):
        k = y / im.height
        d.line([(0, y), (im.width, y)], fill=mix((6, 12, 26), (10, 30, 58), k))
    for x in range(0, im.width, 90):
        d.line([(x, 0), (x, im.height)], fill=(16, 34, 60))
    for y in range(0, im.height, 90):
        d.line([(0, y), (im.width, y)], fill=(16, 34, 60))
    for _ in range(140):
        x, y = rnd.randrange(im.width), rnd.randrange(im.height)
        r = rnd.choice([1, 1, 2, 2, 3])
        d.ellipse([x - r, y - r, x + r, y + r], fill=mix(BG, CYAN, rnd.uniform(0.15, 0.45)))
    return im


def background_at(bgimg, t):
    ox = int(200 + 160 * math.sin(t * 0.07))
    oy = int(200 + 120 * math.cos(t * 0.05))
    return bgimg.crop((ox, oy, ox + W, oy + H)).copy()


# ---------------------------------------------------------------- mapa
GULF_SOUTH = [(47, 20), (60, 20), (59.8, 22.5), (58.6, 23.6), (57.0, 24.0), (56.3, 24.8), (56.4, 25.5),
              (56.4, 26.2), (56.3, 26.4), (56.0, 26.0), (55.3, 25.3), (54.0, 24.3), (52.5, 24.2),
              (51.6, 24.6), (51.6, 25.9), (51.0, 26.1), (50.8, 24.8), (50.2, 26.3), (49.6, 27.0),
              (48.5, 28.5), (48.0, 29.5), (48.0, 30.0), (47, 30.0)]
GULF_NORTH = [(47, 30.0), (48.0, 30.0), (48.6, 29.9), (50.0, 30.0), (50.3, 29.2), (51.0, 28.2), (52.5, 27.4),
              (54.0, 26.7), (55.5, 26.6), (56.3, 27.2), (56.9, 27.0), (57.3, 26.0), (57.8, 25.6),
              (59.0, 25.4), (60.0, 25.3), (60, 33), (47, 33)]
ARABIA_WIDE = [(34.5, 28.0), (36.5, 26.0), (38.0, 24.0), (39.5, 21.5), (42.0, 16.0), (43.5, 12.7),
               (45.0, 13.0), (52.0, 16.0), (55.0, 17.5), (57.8, 19.5)] + GULF_SOUTH[2:-1] + \
              [(48.0, 30.0), (44, 32.5), (39, 32.5), (35.0, 31.0), (34.5, 29.5)]
NORTH_WIDE = [(34.5, 31.5), (39, 32.5), (44, 32.5)] + GULF_NORTH[1:-2] + [(62, 25.2), (62, 36), (34.5, 36)]
AFRICA = [(28, 31), (32.3, 31.2), (32.6, 29.9), (33.6, 27.8), (35.5, 24.0), (37.3, 18.5), (39.5, 15.5),
          (43.2, 12.5), (51.2, 11.8), (51, 5), (28, 5)]


class Proj:
    def __init__(self, lon0, lon1, lat0, lat1, box=(0, 0, W, H)):
        self.lon0, self.lon1, self.lat0, self.lat1 = lon0, lon1, lat0, lat1
        self.box = box

    def __call__(self, lon, lat):
        x0, y0, x1, y1 = self.box
        return (x0 + (lon - self.lon0) / (self.lon1 - self.lon0) * (x1 - x0),
                y1 - (lat - self.lat0) / (self.lat1 - self.lat0) * (y1 - y0))


def zoom_proj(base, z, cx, cy):
    """Proyección con zoom z centrado en lon/lat (cx,cy)."""
    hw = (base.lon1 - base.lon0) / 2 / z
    hh = (base.lat1 - base.lat0) / 2 / z
    return Proj(cx - hw, cx + hw, cy - hh, cy + hh, base.box)


def draw_land(d, proj, polys):
    for poly, col in polys:
        pts = [proj(*p) for p in poly]
        d.polygon(pts, fill=col, outline=mix(col, WHITE, 0.25))


def draw_label(d, xy, text, size, col, a=1.0, weight='Bold', anchor='mm', bgc=None):
    f = font(weight, size)
    c = mix(BG if bgc is None else bgc, col, a)
    d.text(xy, text, font=f, fill=c, anchor=anchor)


def pulse_ring(d, xy, t, col, base=14, speed=1.2):
    x, y = xy
    for k in range(2):
        ph = (t * speed + k * 0.5) % 1.0
        r = base + ph * 50
        d.ellipse([x - r, y - r, x + r, y + r], outline=mix(SEA, col, 1 - ph), width=4)
    d.ellipse([x - base * 0.6, y - base * 0.6, x + base * 0.6, y + base * 0.6], fill=col)


def ship(d, x, y, s=1.0, col=(200, 205, 215), facing=1, kind='tanker'):
    L, Hh = 70 * s, 16 * s
    pts = [(x - L / 2, y - Hh / 2), (x + L / 2 - 14 * s, y - Hh / 2), (x + L / 2, y),
           (x + L / 2 - 14 * s, y + Hh / 2), (x - L / 2, y + Hh / 2)]
    if facing < 0:
        pts = [(2 * x - px, py) for px, py in pts]
    d.polygon(pts, fill=col, outline=(30, 30, 40))
    bx = x - facing * L * 0.32
    d.rectangle([bx - 6 * s, y - Hh / 2 - 10 * s, bx + 6 * s, y - Hh / 2], fill=(235, 235, 240))
    if kind == 'lng':
        for k in (-0.12, 0.1):
            cx = x + facing * L * k
            d.ellipse([cx - 8 * s, y - Hh / 2 - 9 * s, cx + 8 * s, y - Hh / 2 + 7 * s], fill=(240, 240, 245))
    if kind == 'war':
        d.polygon([(bx - 14 * s, y - Hh / 2), (bx + 4 * s, y - Hh / 2 - 16 * s), (bx + 14 * s, y - Hh / 2)],
                  fill=(120, 130, 140))


def arrow_path(d, p0, p1, bend, t, col, width=6):
    """Dibuja una curva cuadrática de p0 a p1 hasta la fracción t, con punta."""
    if t <= 0:
        return
    mx, my = (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2
    nx, ny = -(p1[1] - p0[1]), (p1[0] - p0[0])
    nl = math.hypot(nx, ny) or 1
    c = (mx + nx / nl * bend, my + ny / nl * bend)
    pts = []
    n = 40
    for i in range(int(n * t) + 1):
        u = i / n
        pts.append(((1 - u) ** 2 * p0[0] + 2 * (1 - u) * u * c[0] + u * u * p1[0],
                    (1 - u) ** 2 * p0[1] + 2 * (1 - u) * u * c[1] + u * u * p1[1]))
    if len(pts) > 1:
        d.line(pts, fill=col, width=width, joint='curve')
        (ax, ay), (bx, by) = pts[-2], pts[-1]
        ang = math.atan2(by - ay, bx - ax)
        hl = 22
        d.polygon([(bx, by), (bx - hl * math.cos(ang - 0.45), by - hl * math.sin(ang - 0.45)),
                   (bx - hl * math.cos(ang + 0.45), by - hl * math.sin(ang + 0.45))], fill=col)


# ---------------------------------------------------------------- capas comunes
def header(d, sc, t, dur):
    a = ease_out(prog(t, 0.15, 0.5))
    x = lerp(-500, 110, a)
    d.rectangle([x - 20, 92, x - 10, 92 + 56 * a], fill=RED)
    draw_label(d, (x, 96), sc['kicker'].upper(), 34, RED, a, 'ExtraBold', 'la')
    words = sc['titulo'].split()
    f = font('Black', 64)
    cx = 110
    for i, w in enumerate(words):
        p = ease_back(prog(t, 0.35 + i * 0.12, 0.45))
        if p <= 0:
            break
        size = 64 * (0.6 + 0.4 * p)
        draw_label(d, (cx, 140 + (1 - p) * 30), w, size, WHITE, clamp(p), 'Black', 'la')
        cx += d.textlength(w + ' ', font=f)


def progress_bar(d, gt, total):
    d.rectangle([0, 0, W, 8], fill=(20, 30, 50))
    d.rectangle([0, 0, W * gt / total, 8], fill=RED)


def captions(d, words_t, t):
    """Subtítulos por bloques de ~6 palabras con resaltado de la palabra actual."""
    if not words_t:
        return
    idx = 0
    for i, (w, ts) in enumerate(words_t):
        if ts <= t:
            idx = i
    block = idx // 6
    seg = words_t[block * 6:block * 6 + 6]
    if t < words_t[0][1] - 0.2:
        return
    f = font('ExtraBold', 50)
    texts = [w for w, _ in seg]
    total_w = sum(d.textlength(w + ' ', font=f) for w in texts)
    x = (W - total_w) / 2
    y = H - 150
    pad = 22
    d.rounded_rectangle([x - pad, y - 14, x + total_w + pad - 14, y + 66], 18, fill=(0, 0, 0))
    for j, w in enumerate(texts):
        gi = block * 6 + j
        col = GOLD if gi == idx else (WHITE if gi < idx else (200, 200, 200))
        if gi == idx:
            d.text((x, y - 3), w, font=f, fill=col, stroke_width=2, stroke_fill=(0, 0, 0))
        else:
            d.text((x, y), w, font=f, fill=col)
        x += d.textlength(w + ' ', font=f)


def transition(im, t):
    """Barrido rojo al inicio de cada escena."""
    if t > 0.45:
        return
    p = ease_out(t / 0.45)
    d = ImageDraw.Draw(im)
    x = lerp(0, W + 300, p)
    d.polygon([(x - 300, 0), (W + 600, 0), (W + 600, H), (x - 600, H)], fill=RED)
    d.polygon([(x - 600, 0), (x - 300, 0), (x - 600, H), (x - 900, H)], fill=(255, 255, 255))


# ---------------------------------------------------------------- escenas
BASE_GULF = Proj(46.5, 61.5, 21.0, 31.5, (0, 150, W, H))
HORMUZ = (56.35, 26.6)


def scene_map(d, t, dur, z0=1.0, z1=1.6, center=HORMUZ, wide=False):
    z = lerp(z0, z1, ease_out(t / max(dur, 0.1)))
    if wide:
        base = Proj(31, 64, 10, 36, (0, 150, W, H))
        pr = zoom_proj(base, z, *center)
        draw_land(d, pr, [(AFRICA, LAND), (ARABIA_WIDE, LAND2), (NORTH_WIDE, LAND)])
    else:
        pr = zoom_proj(BASE_GULF, z, *center)
        draw_land(d, pr, [(GULF_SOUTH, LAND2), (GULF_NORTH, LAND)])
    return pr


def s_barriles(d, t, dur, sc):
    for i in range(5):
        p = ease_back(prog(t, 0.8 + i * 0.35, 0.4))
        if p <= 0:
            continue
        cx, cy = 560 + i * 200, 600
        hgt = 230 * p
        col = RED if i == 2 and t > 3.2 else (90, 100, 120)
        d.rounded_rectangle([cx - 70, cy - hgt / 2, cx + 70, cy + hgt / 2], 24, fill=col)
        for k in (-0.3, 0.3):
            yy = cy + hgt * k
            d.line([cx - 70, yy, cx + 70, yy], fill=mix(col, (0, 0, 0), 0.4), width=6)
    if t > 3.2:
        a = ease_out(prog(t, 3.2, 0.5))
        draw_label(d, (W / 2, 820), '20% DEL PETRÓLEO DEL MUNDO', 54, GOLD, a, 'Black')
    n = int(33 * ease_out(prog(t, 6.5, 2.5)))
    if t > 6.5:
        draw_label(d, (W / 2, 390), f'{n} km', 90, WHITE, ease_out(prog(t, 6.5, 0.4)), 'Black')


def s_titulo(d, t, dur, sc):
    word = 'ORMUZ'
    f = font('Black', 260)
    total = d.textlength(word, font=f)
    x = (W - total) / 2
    for i, ch in enumerate(word):
        p = ease_back(prog(t, 0.2 + i * 0.12, 0.5))
        y = lerp(-300, 470, p)
        shake = 6 * math.sin(t * 40) * max(0, 1 - (t - 1.0) * 3) if t > 0.9 else 0
        d.text((x + shake, y), ch, font=f, fill=WHITE, anchor='lm', stroke_width=6, stroke_fill=RED)
        x += d.textlength(ch, font=f)
    a = ease_out(prog(t, 1.4, 0.6))
    draw_label(d, (W / 2, 650), 'EL PUNTO MÁS PELIGROSO DEL PLANETA', 52, GOLD, a, 'ExtraBold')
    d.rectangle([W / 2 - 400 * a, 700, W / 2 + 400 * a, 708], fill=RED)


def s_mapa(d, t, dur, sc):
    pr = scene_map(d, t, dur, 1.0, 1.7)
    labs = [('IRÁN', (55.0, 28.0), 0.8), ('OMÁN', (56.6, 25.2), 2.5), ('EAU', (54.3, 23.4), 4.5),
            ('GOLFO PÉRSICO', (53.6, 26.0), 7.5)]
    for txt, ll, st in labs:
        draw_label(d, pr(*ll), txt, 46, (230, 215, 185), ease_out(prog(t, st, 0.6)), 'Black')
    a, b = pr(56.25, 26.45), pr(56.45, 26.95)
    p = ease_out(prog(t, 9.0, 1.5))
    if p > 0:
        d.line([a, (lerp(a[0], b[0], p), lerp(a[1], b[1], p))], fill=RED, width=8)
        draw_label(d, (b[0] + 120, (a[1] + b[1]) / 2), f'{int(33 * p)} km', 52, RED, 1, 'Black')
    if t > 11:
        pulse_ring(d, pr(*HORMUZ), t, RED)


def s_paises(d, t, dur, sc):
    pr = scene_map(d, t, dur, 1.0, 1.15, center=(52.5, 26.5))
    cs = [('ARABIA SAUDITA', (47.8, 25.0)), ('IRAK', (47.6, 31.0)), ('KUWAIT', (47.9, 29.3)),
          ('CATAR', (51.2, 25.3)), ('EAU', (54.5, 23.8)), ('IRÁN', (53.5, 29.0))]
    for i, (n, ll) in enumerate(cs):
        st = 1.2 + i * 1.25
        p = ease_back(prog(t, st, 0.5))
        if p <= 0:
            continue
        x, y = pr(*ll)
        r = 16 * p
        d.ellipse([x - r, y - r, x + r, y + r], fill=GOLD)
        draw_label(d, (x, y - 44 if y > 280 else y + 44), n, 40 * (0.7 + 0.3 * p), WHITE, clamp(p), 'Black')
    if t > 10:
        pulse_ring(d, pr(*HORMUZ), t, RED, 18)
        draw_label(d, pr(57.6, 27.8), 'UNA SOLA SALIDA', 46, RED, ease_out(prog(t, 10.5, 0.5)), 'Black')


def s_carriles(d, t, dur, sc):
    d.rectangle([0, 230, W, 300], fill=LAND)
    d.rectangle([0, 860, W, 930], fill=LAND2)
    draw_label(d, (W - 160, 265), 'IRÁN', 36, (230, 215, 185), 1, 'Black')
    draw_label(d, (W - 160, 895), 'OMÁN', 36, (230, 215, 185), 1, 'Black')
    p = ease_out(prog(t, 1.0, 1.2))
    lanes = [(470, 1, 'ENTRADA'), (690, -1, 'SALIDA')]
    for y, dirn, name in lanes:
        d.rectangle([0, y - 55, W * p, y + 55], fill=(18, 52, 92))
        for x in range(0, int(W * p), 140):
            ax = x + (t * 60 * dirn) % 140
            d.polygon([(ax, y - 10), (ax + 30 * dirn, y), (ax, y + 10)], fill=(40, 90, 140))
        draw_label(d, (150, y - 80 if dirn > 0 else y + 80), name, 32, CYAN, p, 'ExtraBold', 'lm')
    if t > 2:
        d.rectangle([0, 545, W * p, 615], fill=(14, 26, 44))
        draw_label(d, (W / 2, 580), 'ZONA DE SEGURIDAD', 30, SOFT, ease_out(prog(t, 2, 0.5)), 'SemiBold')
    for k in range(4):
        x = ((t - 2) * 110 + k * 520) % (W + 300) - 150
        if t > 2:
            ship(d, x, 470, 1.3, facing=1)
            ship(d, W - x, 690, 1.3, facing=-1, col=(215, 180, 120))
    pb = ease_out(prog(t, 5, 0.8))
    if pb > 0:
        x = 1700
        d.line([x, 415, x, 525], fill=GOLD, width=5)
        d.line([x - 15, 415, x + 15, 415], fill=GOLD, width=5)
        d.line([x - 15, 525, x + 15, 525], fill=GOLD, width=5)
        draw_label(d, (x - 30, 380), '~3 km', 46, GOLD, pb, 'Black', 'mm')


def s_barcos(d, t, dur, sc):
    pr = scene_map(d, t, dur, 1.6, 1.9)
    hx, hy = pr(*HORMUZ)
    for k in range(6):
        u = ((t * 0.08 + k / 6) % 1.0)
        x0, y0 = pr(52.5, 26.8)
        x1, y1 = pr(59.5, 24.6)
        x, y = lerp(x0, x1, u), lerp(y0, y1, u) + 30 * math.sin(u * 6)
        kind = 'lng' if k % 3 == 0 and t > 5 else 'tanker'
        ship(d, x, y, 1.1, kind=kind, col=(200, 205, 215) if kind == 'tanker' else (150, 200, 230))
    chips = [('CRUDO', 1.5, (90, 90, 90)), ('REFINADOS', 3.0, (120, 90, 60)), ('GAS NATURAL LICUADO', 6.0, (40, 120, 170))]
    y = 330
    for txt, st, col in chips:
        p = ease_back(prog(t, st, 0.5))
        if p <= 0:
            continue
        f = font('Black', 40)
        wdt = d.textlength(txt, font=f) + 60
        x = lerp(-wdt, 110, p)
        d.rounded_rectangle([x, y, x + wdt, y + 70], 35, fill=col)
        d.text((x + 30, y + 35), txt, font=f, fill=WHITE, anchor='lm')
        y += 95
    if t > 8:
        draw_label(d, pr(51.2, 25.4), 'CATAR', 48, GOLD, ease_out(prog(t, 8, 0.5)), 'Black')
        pulse_ring(d, pr(51.2, 25.9), t, GOLD, 12)


def s_flechas(d, t, dur, sc):
    hz = (330, 640)
    pulse_ring(d, hz, t, RED, 18)
    draw_label(d, (hz[0], hz[1] + 70), 'ORMUZ', 44, RED, 1, 'Black')
    dests = [('INDIA', (900, 760), 1.2, -80), ('CHINA', (1330, 420), 2.0, -160),
             ('JAPÓN', (1720, 360), 2.8, -220), ('COREA DEL SUR', (1600, 560), 3.6, -120)]
    for name, xy, st, bend in dests:
        p = ease_out(prog(t, st, 1.2))
        arrow_path(d, hz, xy, bend, p, GOLD, 8)
        if p >= 1:
            q = ease_back(prog(t, st + 1.2, 0.4))
            r = 16 * q
            d.ellipse([xy[0] - r, xy[1] - r, xy[0] + r, xy[1] + r], fill=CYAN)
            draw_label(d, (xy[0], xy[1] - 50), name, 44, WHITE, q, 'Black')
    if t > 8:
        draw_label(d, (W / 2, 870), 'LA VENA ENERGÉTICA DE ASIA', 54, GOLD, ease_out(prog(t, 8, 0.6)), 'Black')


def s_grafico(d, t, dur, sc):
    x0, y0, x1, y1 = 220, 330, 1700, 820
    d.line([x0, y1, x1, y1], fill=SOFT, width=4)
    d.line([x0, y0, x0, y1], fill=SOFT, width=4)
    draw_label(d, (x0 - 20, y0 - 30), 'PRECIO DEL PETRÓLEO', 32, SOFT, 1, 'ExtraBold', 'lm')
    rnd = random.Random(4)
    pts = []
    n = 60
    for i in range(n):
        v = 0.35 + 0.05 * math.sin(i * 0.7) + rnd.uniform(-0.03, 0.03)
        if i > 38:
            v += 0.4 * (1 - math.exp(-(i - 38) / 3))
        pts.append((lerp(x0, x1, i / (n - 1)), lerp(y1, y0, v)))
    p = prog(t, 0.6, dur * 0.6)
    k = max(2, int(len(pts) * p))
    col = RED if k > 40 else CYAN
    d.line(pts[:k], fill=col, width=8, joint='curve')
    hx, hy = pts[k - 1]
    d.ellipse([hx - 12, hy - 12, hx + 12, hy + 12], fill=col)
    if k > 40:
        a = ease_back(prog(t, 0.6 + dur * 0.6 * 40 / 60, 0.5))
        x, y = pts[40]
        d.rounded_rectangle([x - 140, y - 150, x + 140, y - 80], 14, fill=RED)
        draw_label(d, (x, y - 115), '¡TENSIÓN!', 40 * (0.6 + 0.4 * clamp(a)), WHITE, clamp(a), 'Black')
    if t > dur * 0.75:
        draw_label(d, (W / 2, 875), 'BASTA CON EL MIEDO', 56, GOLD, ease_out(prog(t, dur * 0.75, 0.5)), 'Black')


def s_anios(d, t, dur, sc):
    yr = int(lerp(1980, 1988, ease_out(prog(t, 0.5, 4.5))))
    draw_label(d, (W / 2, 420), str(yr), 220, WHITE, ease_out(prog(t, 0.2, 0.5)), 'Black')
    draw_label(d, (W / 2, 560), 'IRÁN  vs  IRAK', 60, RED, ease_out(prog(t, 1.5, 0.5)), 'Black')
    rnd = random.Random(7)
    for k in range(7):
        x = 250 + k * 240
        y = 760 + rnd.randint(-30, 30)
        ship(d, x, y, 1.2, facing=1 if k % 2 else -1)
        st = 5 + k * 1.3
        if t > st:
            ph = ((t - st) % 2.5) / 2.5
            r = 20 + ph * 90
            d.ellipse([x - r, y - r, x + r, y + r], outline=mix(BG, (255, 140, 40), 1 - ph), width=8)
            if ph < 0.3:
                d.ellipse([x - 30, y - 30, x + 30, y + 30], fill=(255, 170, 60))
    if t > dur * 0.7:
        draw_label(d, (W / 2, 870), 'CIENTOS DE BARCOS ATACADOS', 54, GOLD, ease_out(prog(t, dur * 0.7, 0.5)), 'Black')


def s_escolta(d, t, dur, sc):
    for k, y in enumerate((520, 760)):
        x = lerp(-300, W + 300, ((t * 0.06) + k * 0.35) % 1.0)
        ship(d, x, y, 2.4, col=(215, 180, 120))
        ship(d, x - 260, y + 50, 1.6, col=(120, 130, 140), kind='war')
        ship(d, x + 240, y - 50, 1.6, col=(120, 130, 140), kind='war')
        draw_label(d, (x, y - 70), 'PETROLERO', 28, WHITE, 1, 'ExtraBold')
    a = ease_out(prog(t, 3, 0.6))
    draw_label(d, (W / 2, 330), 'OPERACIÓN DE ESCOLTA · 1987–1988', 46, CYAN, a, 'Black')
    if t > dur * 0.65:
        draw_label(d, (W / 2, 870), 'AMENAZA: CERRAR ORMUZ', 56, RED, ease_out(prog(t, dur * 0.65, 0.5)), 'Black')


def bullets(d, t, items, y0=320):
    y = y0
    for i, (txt, st) in enumerate(items):
        p = ease_back(prog(t, st, 0.5))
        if p <= 0:
            continue
        x = lerp(-900, 160, ease_out(prog(t, st, 0.5)))
        r = 42 * clamp(p)
        d.ellipse([x - r, y + 45 - r, x + r, y + 45 + r], fill=RED)
        draw_label(d, (x, y + 45), str(i + 1), 44, WHITE, 1, 'Black', bgc=RED)
        draw_label(d, (x + 80, y + 45), txt, 50, WHITE, clamp(p), 'ExtraBold', 'lm')
        y += 150


def s_puntos(d, t, dur, sc):
    bullets(d, t, [('Irán también exporta por ahí', dur * 0.30),
                   ('Respuesta militar inmediata', dur * 0.55),
                   ('Enfadaría a China, su gran cliente', dur * 0.75)])


def s_riesgos(d, t, dur, sc):
    icons = [('MINAS', 1.5), ('ATAQUES', 3.0), ('AMENAZAS', 4.5)]
    for i, (txt, st) in enumerate(icons):
        p = ease_back(prog(t, st, 0.5))
        if p <= 0:
            continue
        cx, cy = 420 + i * 540, 430
        r = 90 * clamp(p)
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(60, 20, 26), outline=RED, width=6)
        if i == 0:
            for a in range(8):
                ang = a * math.pi / 4 + t
                d.line([cx, cy, cx + math.cos(ang) * r * 0.8, cy + math.sin(ang) * r * 0.8], fill=RED, width=8)
            d.ellipse([cx - r * 0.45, cy - r * 0.45, cx + r * 0.45, cy + r * 0.45], fill=RED)
        elif i == 1:
            d.polygon([(cx - r * 0.2, cy - r * 0.7), (cx + r * 0.3, cy - r * 0.1), (cx, cy), (cx + r * 0.2, cy + r * 0.7),
                       (cx - r * 0.3, cy + r * 0.05), (cx, cy)], fill=GOLD)
        else:
            draw_label(d, (cx, cy), '!', 120 * clamp(p), RED, 1, 'Black')
        draw_label(d, (cx, cy + 140), txt, 44, WHITE, clamp(p), 'Black')
    chain = [('SEGURO ↑', 7.5), ('PETRÓLEO ↑', 10.0), ('TODO ↑', 12.5)]
    for i, (txt, st) in enumerate(chain):
        p = ease_back(prog(t, st, 0.5))
        if p <= 0:
            continue
        cx = 420 + i * 540
        d.rounded_rectangle([cx - 200, 760, cx + 200, 850], 20, fill=RED)
        draw_label(d, (cx, 805), txt, 48 * (0.6 + 0.4 * clamp(p)), WHITE, 1, 'Black', bgc=RED)
        if i > 0:
            arrow_path(d, (cx - 520 + 210, 805), (cx - 210, 805), 0, ease_out(prog(t, st - 0.3, 0.4)), GOLD, 6)


def s_oleoductos(d, t, dur, sc):
    pr = scene_map(d, t, dur, 1.0, 1.1, center=(47.5, 24.0), wide=True)
    pipes = [('Arabia Saudita → mar Rojo', [(49.8, 26.0), (46.0, 25.0), (42.0, 24.5), (38.1, 24.1)], 2.0, GOLD, (60, 50)),
             ('Emiratos → Fujairah', [(54.0, 24.0), (55.3, 24.6), (56.3, 25.1)], 7.5, CYAN, (40, 60)),
             ('Irán → Jask', [(50.3, 29.2), (53.5, 28.4), (56.0, 27.0), (57.8, 25.6)], 12.0, (255, 140, 90), (110, -45))]
    for name, pts, st, col, off in pipes:
        p = ease_out(prog(t, st, 2.0))
        if p <= 0:
            continue
        P = [pr(*q) for q in pts]
        seglen = [math.dist(P[i], P[i + 1]) for i in range(len(P) - 1)]
        tot = sum(seglen) * p
        out = [P[0]]
        for i, L in enumerate(seglen):
            if tot >= L:
                out.append(P[i + 1]); tot -= L
            else:
                f = tot / L
                out.append((lerp(P[i][0], P[i + 1][0], f), lerp(P[i][1], P[i + 1][1], f)))
                break
        d.line(out, fill=col, width=10, joint='curve')
        ex, ey = out[-1]
        d.ellipse([ex - 14, ey - 14, ex + 14, ey + 14], fill=col)
        if p >= 1:
            draw_label(d, (ex + off[0], ey + off[1]), name, 34, col, ease_out(prog(t, st + 2, 0.5)), 'Black')
    pulse_ring(d, pr(*HORMUZ), t, RED, 12)
    draw_label(d, pr(39.0, 20.0), 'MAR ROJO', 34, CYAN, 1, 'Bold')


def s_barras(d, t, dur, sc):
    rows = [('LO QUE PASA POR ORMUZ', 1.0, RED, 0.8), ('LO QUE PUEDEN DESVIAR LOS OLEODUCTOS', 0.3, GOLD, 2.5)]
    y = 380
    for name, frac, col, st in rows:
        p = ease_out(prog(t, st, 1.6))
        draw_label(d, (160, y - 40), name, 38, WHITE, ease_out(prog(t, st, 0.4)), 'Black', 'lm')
        d.rounded_rectangle([160, y, 160 + 1560 * frac * p + 1, y + 90], 20, fill=col)
        y += 230
    p = ease_back(prog(t, 7.5, 0.5))
    if p > 0:
        d.rounded_rectangle([160, 760, 1100, 850], 20, fill=(30, 40, 60))
        draw_label(d, (630, 805), 'Kuwait · Catar · Irak: sin alternativa', 40, WHITE, clamp(p), 'ExtraBold',
                   bgc=(30, 40, 60))
    draw_label(d, (W - 160, 1000 - 40), 'Ilustrativo', 24, SOFT, 0.8, 'Medium', 'rm')


def s_cierre(d, t, dur, sc):
    pr = scene_map(d, t, dur, 2.6, 0.9)
    pulse_ring(d, pr(*HORMUZ), t, RED, 16)
    a = ease_back(prog(t, 3.0, 0.6))
    draw_label(d, (W / 2, 520), '33 KM', 200 * (0.6 + 0.4 * clamp(a)), WHITE, clamp(a), 'Black')
    draw_label(d, (W / 2, 660), 'QUE MUEVEN EL MUNDO', 60, GOLD, ease_out(prog(t, 4.5, 0.5)), 'Black')


def s_suscribete(d, t, dur, sc):
    p = ease_back(prog(t, 0.5, 0.6))
    press = 0.92 if 2.5 < t < 2.8 else 1.0
    s = clamp(p) * press
    cx, cy = W / 2, 470
    wdt, hgt = 520 * s, 130 * s
    subscribed = t > 2.7
    col = (90, 90, 90) if subscribed else (230, 30, 40)
    d.rounded_rectangle([cx - wdt / 2, cy - hgt / 2, cx + wdt / 2, cy + hgt / 2], int(30 * s) + 1, fill=col)
    draw_label(d, (cx, cy), 'SUSCRITO ✓' if subscribed else 'SUSCRÍBETE', 56 * max(s, 0.2), WHITE, 1, 'Black', bgc=col)
    if t > 3.2:
        ang = 0.4 * math.sin(t * 25) * max(0, 1 - (t - 3.2) / 1.5)
        bx, by = cx + 360, cy
        pts = [(-30, 30), (-24, -10), (0, -34), (24, -10), (30, 30)]
        rp = [(bx + x * math.cos(ang) - y * math.sin(ang), by + x * math.sin(ang) + y * math.cos(ang)) for x, y in pts]
        d.polygon(rp, fill=GOLD)
        d.ellipse([bx - 8, by + 30, bx + 8, by + 46], fill=GOLD)
    a = ease_out(prog(t, 4.0, 0.6))
    draw_label(d, (W / 2, 700), 'PRÓXIMO VIDEO', 40, SOFT, a, 'ExtraBold')
    draw_label(d, (W / 2, 780), 'EL CANAL QUE SE QUEDA SIN AGUA', 64, GOLD, a, 'Black')


SCENES = {'barriles': s_barriles, 'titulo': s_titulo, 'mapa_estrecho': s_mapa, 'paises': s_paises,
          'carriles': s_carriles, 'barcos': s_barcos, 'flechas': s_flechas, 'grafico': s_grafico,
          'anios': s_anios, 'escolta': s_escolta, 'puntos': s_puntos, 'riesgos': s_riesgos,
          'oleoductos': s_oleoductos, 'barras': s_barras, 'cierre': s_cierre, 'suscribete': s_suscribete}


def render_scene(folder, i):
    escenas = json.load(open(os.path.join(folder, 'escenas.json')))
    tl = json.load(open(os.path.join(folder, 'timeline.json')))
    sc, seg = escenas[i], tl['scenes'][i]
    dur, gstart, total = seg['dur'], seg['start'], tl['total']
    words_t = seg['words']
    bgimg = make_background(i)
    os.makedirs(os.path.join(folder, 'render'), exist_ok=True)
    out = os.path.join(folder, 'render', f'e{i:02d}.mp4')
    n = int(round(dur * FPS))
    ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24',
                           '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast',
                           '-crf', '20', '-pix_fmt', 'yuv420p', out], stdin=subprocess.PIPE)
    fn = SCENES[sc['tipo']]
    for f in range(n):
        t = f / FPS
        im = background_at(bgimg, gstart + t)
        d = ImageDraw.Draw(im)
        fn(d, t, dur, sc)
        if sc['tipo'] not in ('titulo',):
            header(d, sc, t, dur)
        captions(d, words_t, t)
        progress_bar(d, gstart + t, total)
        draw_label(d, (W - 40, H - 40), 'jxseng · geopolítica', 24, SOFT, 0.7, 'Medium', 'rm')
        if i > 0:
            transition(im, t)
        ff.stdin.write(im.tobytes())
    ff.stdin.close()
    ff.wait()
    return out


if __name__ == '__main__':
    render_scene(sys.argv[1], int(sys.argv[2]))
