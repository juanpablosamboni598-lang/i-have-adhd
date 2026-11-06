"""Escenas de animales: criatura (pulpo/calamar/tiburon), profundidad, tamano."""
import math


def register(g):
    W, H = g['W'], g['H']
    WHITE, SOFT, RED, GOLD, CYAN, BG = g['WHITE'], g['SOFT'], g['RED'], g['GOLD'], g['CYAN'], g['BG']
    font, lerp, mix, clamp = g['font'], g['lerp'], g['mix'], g['clamp']
    ease_out, ease_back, prog, draw_label = g['ease_out'], g['ease_back'], g['prog'], g['draw_label']
    C = {'red': RED, 'gold': GOLD, 'cyan': CYAN, 'white': WHITE}

    def tentacle(d, x0, y0, ang, length, width, t, phase, col, suckers=True, club=False):
        pts = []
        n = 26
        for i in range(n + 1):
            u = i / n
            wav = math.sin(t * 2.2 + phase + u * 5) * 60 * u
            a = ang + 0.6 * math.sin(t * 1.3 + phase) * u
            x = x0 + math.cos(a) * length * u - math.sin(a) * wav
            y = y0 + math.sin(a) * length * u + math.cos(a) * wav
            pts.append((x, y))
        for i, (x, y) in enumerate(pts):
            u = i / n
            r = width * (1 - 0.85 * u)
            d.ellipse([x - r, y - r, x + r, y + r], fill=col)
            if suckers and i % 3 == 0 and r > 5:
                d.ellipse([x - r * 0.35, y - r * 0.35, x + r * 0.35, y + r * 0.35], fill=mix(col, WHITE, 0.45))
        if club:
            x, y = pts[-1]
            d.ellipse([x - 22, y - 14, x + 22, y + 14], fill=col)

    def pulpo(d, t, cx, cy, s=1.0):
        col = (190, 60, 80)
        for k in range(8):
            ang = math.pi * (0.15 + 0.7 * k / 7)
            tentacle(d, cx + (k - 3.5) * 18 * s, cy + 60 * s, ang, 330 * s, 26 * s, t, k * 0.8, mix(col, (0, 0, 0), 0.1 * (k % 2)))
        bob = 10 * math.sin(t * 1.5)
        d.ellipse([cx - 150 * s, cy - 230 * s + bob, cx + 150 * s, cy + 100 * s + bob], fill=col)
        d.ellipse([cx - 90 * s, cy - 200 * s + bob, cx - 20 * s, cy - 120 * s + bob], fill=mix(col, WHITE, 0.15))
        for ex in (-55, 55):
            d.ellipse([cx + ex * s - 30 * s, cy + 10 * s + bob, cx + ex * s + 30 * s, cy + 55 * s + bob], fill=(250, 235, 200))
            d.rectangle([cx + ex * s - 20 * s, cy + 28 * s + bob, cx + ex * s + 20 * s, cy + 38 * s + bob], fill=(20, 20, 20))

    def calamar(d, t, cx, cy, s=1.0):
        col = (210, 90, 60)
        bob = 12 * math.sin(t * 1.2)
        for k in range(8):
            ang = math.pi * (0.25 + 0.5 * k / 7)
            tentacle(d, cx + (k - 3.5) * 10 * s, cy + 40 * s + bob, ang, 220 * s, 16 * s, t, k, col)
        for k in (-1, 1):
            tentacle(d, cx + k * 20 * s, cy + 40 * s + bob, math.pi / 2 + k * 0.15, 480 * s, 10 * s, t * 0.7, k * 2, mix(col, (0, 0, 0), 0.15),
                     suckers=False, club=True)
        d.polygon([(cx - 70 * s, cy + 50 * s + bob), (cx + 70 * s, cy + 50 * s + bob), (cx + 45 * s, cy - 330 * s + bob),
                   (cx, cy - 420 * s + bob), (cx - 45 * s, cy - 330 * s + bob)], fill=col)
        d.polygon([(cx - 45 * s, cy - 330 * s + bob), (cx - 130 * s, cy - 300 * s + bob), (cx, cy - 420 * s + bob)], fill=mix(col, (0, 0, 0), 0.1))
        d.polygon([(cx + 45 * s, cy - 330 * s + bob), (cx + 130 * s, cy - 300 * s + bob), (cx, cy - 420 * s + bob)], fill=mix(col, (0, 0, 0), 0.1))
        er = 34 * s
        d.ellipse([cx - er, cy - 10 * s + bob - er, cx + er, cy - 10 * s + bob + er], fill=(250, 240, 210))
        d.ellipse([cx - er * 0.55, cy - 10 * s + bob - er * 0.55, cx + er * 0.55, cy - 10 * s + bob + er * 0.55], fill=(15, 15, 25))

    def tiburon(d, t, cx, cy, s=1.0):
        col = (110, 130, 150)
        sw = math.sin(t * 3) * 25 * s
        body = [(cx - 380 * s, cy), (cx - 250 * s, cy - 70 * s), (cx + 120 * s, cy - 90 * s), (cx + 330 * s, cy - 30 * s),
                (cx + 380 * s, cy), (cx + 330 * s, cy + 40 * s), (cx + 100 * s, cy + 80 * s), (cx - 250 * s, cy + 60 * s)]
        d.polygon(body, fill=col)
        d.polygon([(cx + 330 * s, cy + 40 * s), (cx + 100 * s, cy + 80 * s), (cx - 250 * s, cy + 60 * s), (cx - 120 * s, cy + 30 * s),
                   (cx + 300 * s, cy + 10 * s)], fill=(215, 222, 230))
        d.polygon([(cx - 20 * s, cy - 85 * s), (cx + 60 * s, cy - 210 * s), (cx + 110 * s, cy - 88 * s)], fill=mix(col, (0, 0, 0), 0.15))
        d.polygon([(cx - 370 * s, cy), (cx - 520 * s, cy - 150 * s + sw), (cx - 470 * s, cy + sw * 0.3), (cx - 520 * s, cy + 120 * s + sw)],
                  fill=mix(col, (0, 0, 0), 0.15))
        d.polygon([(cx + 40 * s, cy + 60 * s), (cx - 60 * s, cy + 170 * s), (cx + 120 * s, cy + 70 * s)], fill=mix(col, (0, 0, 0), 0.1))
        d.ellipse([cx + 250 * s, cy - 35 * s, cx + 275 * s, cy - 10 * s], fill=(10, 10, 15))
        for k in range(5):
            x = cx + (150 - k * 22) * s
            d.line([(x, cy - 20 * s), (x - 10 * s, cy + 30 * s)], fill=mix(col, (0, 0, 0), 0.3), width=4)
        for k in range(7):
            x = cx + (285 + k * 12) * s
            d.polygon([(x, cy + 22 * s), (x + 6 * s, cy + 34 * s), (x + 12 * s, cy + 22 * s)], fill=WHITE)

    def bubbles(d, t):
        for k in range(18):
            ph = (t * 0.12 + k * 0.137) % 1.0
            x = 900 + 900 * ((k * 0.61) % 1.0) + 20 * math.sin(t + k)
            y = H - ph * (H - 200)
            r = 4 + (k % 4) * 3
            d.ellipse([x - r, y - r, x + r, y + r], outline=mix(BG, CYAN, 0.5), width=2)

    def s_criatura(d, t, dur, sc):
        bubbles(d, t)
        kind = sc.get('kind', 'pulpo')
        a = ease_back(prog(t, 0.2, 0.8))
        s = 0.3 + 0.7 * clamp(a)
        if kind == 'pulpo':
            pulpo(d, t, 1320, 470, s)
        elif kind == 'calamar':
            calamar(d, t, 1320, 540, s * 0.72)
        else:
            tiburon(d, t, 1280, 560, s * 1.1)
        y = 340
        for txt, fr in sc.get('callouts', []):
            p = ease_out(prog(t, dur * fr, 0.5))
            if p <= 0:
                continue
            f = font('Black', 42)
            wdt = d.textlength(txt, font=f) + 50
            x = lerp(-wdt, 110, p)
            d.rounded_rectangle([x, y, x + wdt, y + 76], 20, fill=(20, 40, 70), outline=GOLD, width=3)
            d.text((x + 25, y + 38), txt, font=f, fill=WHITE, anchor='lm')
            y += 120

    ZONAS = [(0, 200, 'ZONA DE LUZ', (30, 120, 190)), (200, 1000, 'ZONA DE PENUMBRA', (16, 60, 120)),
             (1000, 4000, 'ZONA DE MEDIANOCHE', (8, 25, 60)), (4000, 6000, 'ZONA ABISAL', (5, 12, 30)),
             (6000, 11000, 'FOSAS (HADAL)', (2, 5, 14))]

    def s_profundidad(d, t, dur, sc):
        target = sc['objetivo']
        maxd = 11000 if target > 2000 else 1500
        y0, y1, x0, x1 = 230, 880, 700, 1780
        def ymap(m):
            return y0 + (y1 - y0) * (m / maxd) ** (0.5 if maxd > 2000 else 1)
        for a, b, name, col in ZONAS:
            if a >= maxd:
                break
            ya, yb = ymap(a), ymap(min(b, maxd))
            d.rectangle([x0, ya, x1, yb], fill=col)
            if yb - ya > 34:
                draw_label(d, (x1 - 30, (ya + yb) / 2), name, 30, mix(col, WHITE, 0.7), 1, 'ExtraBold', 'rm', bgc=col)
        for m in ([0, 200, 500, 1000, 1500] if maxd <= 1500 else [0, 200, 1000, 4000, 6000, 11000]):
            y = ymap(m)
            d.line([(x0 - 20, y), (x0, y)], fill=SOFT, width=3)
            draw_label(d, (x0 - 30, y), f'{m:,} m'.replace(',', '.'), 28, SOFT, 1, 'Bold', 'rm')
        cur = target * ease_out(prog(t, 1.0, dur * 0.55))
        y = ymap(cur)
        cx = (x0 + x1) / 2 - 150
        d.line([(cx, y0), (cx, y)], fill=(200, 200, 200), width=2)
        d.ellipse([cx - 26, y - 26, cx + 26, y + 26], fill=GOLD)
        d.ellipse([cx - 10, y - 10, cx + 10, y + 10], fill=(40, 40, 40))
        draw_label(d, (cx + 60, y), f'{int(cur):,} m'.replace(',', '.'), 52, WHITE, 1, 'Black', 'lm')

    def s_tamano(d, t, dur, sc):
        items = sc['items']
        mx = max(L for _, L, _ in items)
        scale = 1350 / mx
        y = 360 if len(items) <= 2 else 300
        for k, (name, L, c) in enumerate(items):
            p = ease_out(prog(t, 0.6 + k * dur * 0.2, 1.5))
            if p <= 0:
                continue
            col = C.get(c, WHITE)
            length = L * scale * p
            x0 = 300
            if name.upper().startswith('HUMANO'):
                hh = max(40, L * scale)
                hx = x0 + 10
                d.ellipse([hx - 12, y - 10, hx + 12, y + 14], fill=col)
                d.line([(hx, y + 14), (hx, y + 70)], fill=col, width=8)
                d.line([(hx, y + 70), (hx - 14, y + 110)], fill=col, width=7)
                d.line([(hx, y + 70), (hx + 14, y + 110)], fill=col, width=7)
                d.line([(hx - 20, y + 35), (hx + 20, y + 35)], fill=col, width=6)
                draw_label(d, (hx + 60, y + 55), f'{name} · {L:g} m'.replace('.', ','), 40, WHITE, ease_out(prog(t, 0.6 + k * dur * 0.2, 0.5)), 'Black', 'lm')
            else:
                hgt = 80
                d.rounded_rectangle([x0, y + 10, x0 + length, y + 10 + hgt], 40, fill=col)
                d.polygon([(x0 + 10, y + 50), (x0 - 50, y), (x0 - 50, y + 100)], fill=col)
                if p > 0.9:
                    draw_label(d, (x0 + length - 20, y + 50), f'{name} · ~{L:g} m'.replace('.', ','), 38, WHITE, 1, 'Black', 'rm', bgc=col)
            y += 190
        d.line([(300, 900), (300 + 1350, 900)], fill=SOFT, width=3)
        for m in range(0, int(mx) + 1, 2 if mx <= 12 else 4):
            x = 300 + m * scale
            d.line([(x, 890), (x, 910)], fill=SOFT, width=3)
            draw_label(d, (x, 935), f'{m} m', 24, SOFT, 1, 'Bold')

    g['SCENES'].update({'criatura': s_criatura, 'profundidad': s_profundidad, 'tamano': s_tamano})
