"""Escenas genéricas y de los videos 2 (Panamá) y 3 (Groenlandia)."""
import math
import random


def register(g):
    W, H = g['W'], g['H']
    WHITE, SOFT, RED, GOLD, CYAN, BG = g['WHITE'], g['SOFT'], g['RED'], g['GOLD'], g['CYAN'], g['BG']
    LAND, LAND2, SEA = g['LAND'], g['LAND2'], g['SEA']
    font, lerp, mix, clamp = g['font'], g['lerp'], g['mix'], g['clamp']
    ease_out, ease_back, prog = g['ease_out'], g['ease_back'], g['prog']
    draw_label, pulse_ring, ship, arrow_path = g['draw_label'], g['pulse_ring'], g['ship'], g['arrow_path']
    Proj, zoom_proj, draw_land, bullets = g['Proj'], g['zoom_proj'], g['draw_land'], g['bullets']
    COL = {'red': RED, 'gold': GOLD, 'cyan': CYAN, 'white': WHITE}
    ICE = (225, 238, 248)

    def fit_font(d, text, weight, size, maxw):
        while size > 20 and d.textlength(text, font=font(weight, size)) > maxw:
            size -= 6
        return size

    # ------------------------------------------------ genéricas
    def s_gran_titulo(d, t, dur, sc):
        word = sc['grande']
        size = fit_font(d, word, 'Black', 240, W - 200)
        f = font('Black', size)
        x = (W - d.textlength(word, font=f)) / 2
        for i, ch in enumerate(word):
            p = ease_back(prog(t, 0.2 + i * 0.07, 0.5))
            y = lerp(-300, 470, p)
            shake = 6 * math.sin(t * 40) * max(0, 1 - (t - 1.2) * 3) if t > 1.1 else 0
            if ch.strip():
                d.text((x + shake, y), ch, font=f, fill=WHITE, anchor='lm', stroke_width=6, stroke_fill=RED)
            x += d.textlength(ch, font=f)
        a = ease_out(prog(t, 1.4, 0.6))
        draw_label(d, (W / 2, 650), sc['sub'], 52, GOLD, a, 'ExtraBold')
        d.rectangle([W / 2 - 420 * a, 700, W / 2 + 420 * a, 708], fill=RED)

    def fmt(n):
        return f'{n:,}'.replace(',', '.')

    def s_contador(d, t, dur, sc):
        a0, a1 = sc['desde'], sc['hasta']
        p = ease_out(prog(t, 0.5, min(4.0, dur * 0.5)))
        val = int(round(lerp(a0, a1, p)))
        txt = (fmt(val) if a1 >= 10000 else str(val)) + sc.get('sufijo', '')
        pop = 1 + 0.06 * math.sin(t * 8) * (1 - p)
        draw_label(d, (W / 2, 480), txt, 230 * pop, WHITE, ease_out(prog(t, 0.2, 0.4)), 'Black')
        q = ease_out(prog(t, 0.5 + min(4.0, dur * 0.5), 0.5))
        draw_label(d, (W / 2, 650), sc['etiqueta'], 52, GOLD, q, 'Black')
        d.rectangle([W / 2 - 380 * q, 700, W / 2 + 380 * q, 708], fill=RED)

    def s_lista(d, t, dur, sc):
        items = sc['items']
        n = len(items)
        bullets(d, t, [(it, dur * (0.15 + 0.6 * k / max(1, n - 1))) for k, it in enumerate(items)])

    def s_barras_g(d, t, dur, sc):
        y = 380
        for k, (name, frac, col) in enumerate(sc['barras']):
            st = 0.8 + k * 2.0
            p = ease_out(prog(t, st, 1.6))
            draw_label(d, (160, y - 40), name, 38, WHITE, ease_out(prog(t, st, 0.4)), 'Black', 'lm')
            d.rounded_rectangle([160, y, 160 + 1560 * frac * p + 1, y + 90], 20, fill=COL[col])
            y += 230
        if sc.get('ilustrativo'):
            draw_label(d, (W - 160, 860), 'Ilustrativo', 24, SOFT, 0.8, 'Medium', 'rm')

    def s_cadena(d, t, dur, sc):
        n = len(sc['cadena'])
        for i, txt in enumerate(sc['cadena']):
            st = 1.0 + i * dur * 0.22
            p = ease_back(prog(t, st, 0.5))
            if p <= 0:
                continue
            cx = W / 2 + (i - (n - 1) / 2) * 560
            d.rounded_rectangle([cx - 220, 470, cx + 220, 590], 24, fill=RED if i == n - 1 else (30, 50, 85))
            draw_label(d, (cx, 530), txt, 50 * (0.6 + 0.4 * clamp(p)), WHITE, 1, 'Black',
                       bgc=RED if i == n - 1 else (30, 50, 85))
            if i > 0:
                arrow_path(d, (cx - 560 + 230, 530), (cx - 230, 530), 0, ease_out(prog(t, st - 0.3, 0.4)), GOLD, 8)

    def s_chips_g(d, t, dur, sc):
        cols = [(200, 60, 160), (110, 130, 150), (150, 80, 50), (60, 60, 70), (40, 140, 110)]
        for i, txt in enumerate(sc['items']):
            st = 0.8 + i * dur * 0.13
            p = ease_back(prog(t, st, 0.5))
            if p <= 0:
                continue
            cx = 330 + (i % 4) * 420
            cy = 520 + (i // 4) * 200
            r = 120 * clamp(p)
            pts = [(cx + r * math.cos(a * math.pi / 3 + 0.5), cy + r * math.sin(a * math.pi / 3 + 0.5)) for a in range(6)]
            d.polygon(pts, fill=cols[i % len(cols)], outline=WHITE)
            draw_label(d, (cx, cy + 165), txt, 42, WHITE, clamp(p), 'Black')
        a = ease_out(prog(t, dur * 0.65, 0.5))
        draw_label(d, (W / 2, 860), 'BATERÍAS · MOTORES · TELÉFONOS · ARMAS', 44, GOLD, a, 'Black')

    def s_suscribete_g(d, t, dur, sc):
        p = ease_back(prog(t, 0.5, 0.6))
        press = 0.92 if 2.5 < t < 2.8 else 1.0
        s = clamp(p) * press
        cx, cy = W / 2, 470
        subscribed = t > 2.7
        col = (90, 90, 90) if subscribed else (230, 30, 40)
        d.rounded_rectangle([cx - 260 * s, cy - 65 * s, cx + 260 * s, cy + 65 * s], int(30 * s) + 1, fill=col)
        draw_label(d, (cx, cy), 'SUSCRITO ✓' if subscribed else 'SUSCRÍBETE', 56 * max(s, 0.2), WHITE, 1, 'Black', bgc=col)
        if t > 3.2:
            ang = 0.4 * math.sin(t * 25) * max(0, 1 - (t - 3.2) / 1.5)
            bx, by = cx + 360, cy
            pts = [(-30, 30), (-24, -10), (0, -34), (24, -10), (30, 30)]
            rp = [(bx + x * math.cos(ang) - y * math.sin(ang), by + x * math.sin(ang) + y * math.cos(ang)) for x, y in pts]
            d.polygon(rp, fill=GOLD)
        a = ease_out(prog(t, 4.0, 0.6))
        draw_label(d, (W / 2, 700), sc['kicker'].upper(), 40, SOFT, a, 'ExtraBold')
        size = fit_font(d, sc['proximo'], 'Black', 64, W - 200)
        draw_label(d, (W / 2, 780), sc['proximo'], size, GOLD, a, 'Black')

    # ------------------------------------------------ Panamá
    PANAMA = [(-84.5, 10.4), (-83.4, 9.9), (-82.6, 9.5), (-82.2, 9.0), (-81.6, 8.85), (-81.0, 8.9), (-80.4, 9.1),
              (-79.9, 9.35), (-79.5, 9.6), (-79.0, 9.55), (-78.4, 9.4), (-77.8, 8.95), (-77.3, 8.6), (-76.8, 8.6),
              (-76.0, 8.5), (-76.0, 6.0), (-77.3, 6.0), (-77.5, 7.5), (-78.0, 7.9), (-78.4, 8.4), (-78.9, 8.7),
              (-79.53, 8.97), (-80.0, 8.5), (-80.2, 8.1), (-80.4, 7.6), (-80.0, 7.4), (-80.4, 7.2), (-81.0, 7.5),
              (-81.2, 8.0), (-82.0, 8.2), (-82.9, 8.05), (-83.5, 8.5), (-84.5, 8.9)]
    CANAL = [(-79.92, 9.36), (-79.9, 9.27), (-79.85, 9.17), (-79.72, 9.1), (-79.65, 9.03), (-79.57, 8.95)]
    PAN_BASE = Proj(-83.5, -76.5, 6.6, 10.4, (0, 150, W, H))

    def s_mapa_panama(d, t, dur, sc):
        z = lerp(1.0, 2.6, ease_out(prog(t, dur * 0.45, dur * 0.5)))
        pr = zoom_proj(PAN_BASE, z, -79.75, 9.15)
        draw_land(d, pr, [(PANAMA, (70, 110, 70))])
        lx, ly = pr(-79.8, 9.17)
        r = 0.09 / (PAN_BASE.lon1 - PAN_BASE.lon0) * z * W
        d.ellipse([lx - r * 1.4, ly - r, lx + r * 1.4, ly + r], fill=(40, 110, 170))
        labs = [('MAR CARIBE', (-79.2, 9.85), 0.8, CYAN), ('OCÉANO PACÍFICO', (-80.3, 7.0), 2.2, CYAN),
                ('PANAMÁ', (-81.6, 8.45), 4.0, (230, 215, 185))]
        for txt, ll, st, col in labs:
            draw_label(d, pr(*ll), txt, 46, col, ease_out(prog(t, st, 0.6)), 'Black')
        p = ease_out(prog(t, dur * 0.4, 2.0))
        if p > 0:
            P = [pr(*q) for q in CANAL]
            k = max(2, int(len(P) * p + 1))
            d.line(P[:k], fill=RED, width=10, joint='curve')
            if p >= 1:
                draw_label(d, (P[0][0] + 160, P[0][1] - 40), '~80 km', 52, RED, ease_out(prog(t, dur * 0.4 + 2, 0.5)), 'Black')
                pulse_ring(d, P[0], t, GOLD, 10)
                pulse_ring(d, P[-1], t, GOLD, 10)

    def s_esclusas(d, t, dur, sc):
        base = 860
        steps = [(0, 0), (260, 0), (260, 1), (420, 1), (420, 2), (580, 2), (580, 3), (1340, 3), (1340, 2), (1500, 2),
                 (1500, 1), (1660, 1), (1660, 0), (W, 0)]
        sh = 90
        water = [(x, base - lvl * sh - 40) for x, lvl in steps]
        d.polygon([(0, H)] + [(x, base - lvl * sh) for x, lvl in steps] + [(W, H)], fill=LAND)
        d.polygon([(0, base)] + [(x, y + 40 - 40) for x, y in water] + [(W, base)], fill=(30, 100, 170))
        for x, lvl in steps:
            d.line([(x, base - lvl * sh - 50), (x, base - lvl * sh + 6)], fill=(200, 200, 210), width=6)
        draw_label(d, (960, base - 3 * sh - 90), 'LAGO GATÚN', 40, CYAN, 1, 'Black')
        draw_label(d, (130, base - 80), 'ATLÁNTICO', 30, SOFT, 1, 'ExtraBold')
        draw_label(d, (W - 130, base - 80), 'PACÍFICO', 30, SOFT, 1, 'ExtraBold')
        u = clamp((t - 1.0) / max(1, dur - 2.5))
        x = lerp(80, W - 80, u)
        lvl = 0
        for i in range(len(steps) - 1):
            (x0, l0), (x1, l1) = steps[i], steps[i + 1]
            if x0 <= x <= x1:
                lvl = l0 if x0 != x1 else l1
        ship(d, x, base - lvl * sh - 52, 1.6, col=(220, 180, 110))
        a = ease_out(prog(t, 1.5, 0.5))
        d.line([(1780, base), (1780, base - 3 * sh)], fill=GOLD, width=5)
        draw_label(d, (1780, base - 3 * sh - 30), '26 m', 44, GOLD, a, 'Black')

    def s_gotas(d, t, dur, sc):
        lx0, lx1, ly = 360, 1560, 820
        lvl = lerp(1.0, 0.75, ease_out(prog(t, 2, dur - 3)))
        d.rounded_rectangle([lx0, 380, lx1, ly], 30, outline=SOFT, width=4)
        top = ly - (ly - 400) * lvl
        d.rounded_rectangle([lx0 + 6, top, lx1 - 6, ly - 6], 26, fill=(30, 100, 170))
        draw_label(d, ((lx0 + lx1) / 2, top + 50), 'LAGO GATÚN', 44, WHITE, 1, 'Black', bgc=(30, 100, 170))
        rnd = random.Random(2)
        for k in range(14):
            ph = (t * 0.6 + rnd.random()) % 1.0
            x = lerp(lx1 - 40, W - 120, (k % 7) / 6)
            y = lerp(top, 900, ph)
            d.ellipse([x - 10, y - 16, x + 10, y + 10], fill=(70, 160, 230))
        draw_label(d, (W - 200, 330), '→ AL MAR', 40, CYAN, ease_out(prog(t, 2, 0.5)), 'Black')
        if t > dur * 0.6:
            ry = 260
            for k in range(10):
                x = 420 + k * 120
                ph = (t * 1.5 + k * 0.37) % 1.0
                y = ry + ph * 110
                d.line([(x, y), (x - 8, y + 30)], fill=(150, 200, 255), width=4)
            draw_label(d, (W / 2, 240), 'LLUVIA = RECARGA', 46, GOLD, ease_out(prog(t, dur * 0.6, 0.5)), 'Black')

    def s_nivel_lago(d, t, dur, sc):
        sx, sy = 1500, 380
        rr = 80 + 6 * math.sin(t * 3)
        d.ellipse([sx - rr, sy - rr, sx + rr, sy + rr], fill=(255, 190, 60))
        for k in range(12):
            a = k * math.pi / 6 + t * 0.3
            d.line([(sx + math.cos(a) * 110, sy + math.sin(a) * 110), (sx + math.cos(a) * 150, sy + math.sin(a) * 150)],
                   fill=(255, 190, 60), width=8)
        draw_label(d, (sx, sy + 210), 'EL NIÑO', 48, GOLD, ease_out(prog(t, 2, 0.5)), 'Black')
        gx, gy0, gy1 = 420, 360, 860
        d.rounded_rectangle([gx - 80, gy0, gx + 80, gy1], 20, outline=SOFT, width=5)
        lvl = lerp(0.92, 0.55, ease_out(prog(t, 1.5, dur * 0.6)))
        top = gy1 - (gy1 - gy0) * lvl
        d.rounded_rectangle([gx - 72, top, gx + 72, gy1 - 8], 16, fill=mix((30, 100, 170), RED, 1 - lvl))
        draw_label(d, (gx + 120, top), 'NIVEL DEL LAGO', 36, WHITE, 1, 'Black', 'lm')
        d.polygon([(gx + 120, top + 40), (gx + 150, top + 90), (gx + 90, top + 90)], fill=RED)
        if t > dur * 0.7:
            draw_label(d, (W / 2 + 100, 860), 'LÍMITE AL PASO DE BARCOS', 54, RED, ease_out(prog(t, dur * 0.7, 0.5)), 'Black')

    def s_cola_barcos(d, t, dur, sc):
        for k in range(24):
            r, c = divmod(k, 6)
            st = 0.5 + k * 0.15
            p = ease_out(prog(t, st, 0.4))
            if p <= 0:
                continue
            x = 330 + c * 230 + (r % 2) * 60
            y = 400 + r * 110 + 4 * math.sin(t * 2 + k)
            ship(d, lerp(x + 400, x, p), y, 1.4, col=(220, 180, 110) if k % 3 else (200, 205, 215))
        days = int(lerp(0, 21, ease_out(prog(t, 2, 5))))
        draw_label(d, (W / 2, 300), f'{days} DÍAS DE ESPERA', 60, WHITE, ease_out(prog(t, 2, 0.4)), 'Black')
        p = ease_back(prog(t, dur * 0.4, 0.5))
        if p > 0:
            d.rounded_rectangle([W / 2 - 340, 850, W / 2 + 340, 940], 20, fill=RED)
            draw_label(d, (W / 2, 895), 'SUBASTAS DE MILLONES $', 46 * (0.6 + 0.4 * clamp(p)), WHITE, 1, 'Black', bgc=RED)

    def node(d, xy, label, col, a=1.0, r=18):
        x, y = xy
        d.ellipse([x - r, y - r, x + r, y + r], fill=col)
        draw_label(d, (x, y - 48), label, 40, WHITE, a, 'Black')

    def s_rutas_alt(d, t, dur, sc):
        asia, usa, pan = (300, 560), (1650, 420), (1000, 560)
        suez, mag = (1000, 250), (1000, 950)
        node(d, asia, 'ASIA', CYAN)
        node(d, usa, 'COSTA ESTE EE. UU.', CYAN)
        node(d, pan, 'PANAMÁ', (120, 120, 120))
        draw_label(d, (pan[0], pan[1] + 50), 'LENTO', 34, RED, 1, 'Black')
        p1 = ease_out(prog(t, 1.0, 2.0))
        arrow_path(d, asia, suez, -60, p1, GOLD, 8)
        if p1 >= 1:
            arrow_path(d, suez, usa, -60, ease_out(prog(t, 3.0, 1.5)), GOLD, 8)
            node(d, suez, 'SUEZ', GOLD)
        p2 = ease_out(prog(t, dur * 0.4, 2.0))
        arrow_path(d, asia, mag, 80, p2, RED, 8)
        if p2 >= 1:
            arrow_path(d, mag, usa, 120, ease_out(prog(t, dur * 0.4 + 2, 1.5)), RED, 8)
            node(d, (mag[0], mag[1] - 40), 'MAGALLANES / HORNOS', RED, r=14)
        if t > dur * 0.8:
            draw_label(d, (1480, 790), '+ DÍAS  + COMBUSTIBLE  + COSTO', 44, GOLD, ease_out(prog(t, dur * 0.8, 0.5)), 'Black')

    def s_rutas_comp(d, t, dur, sc):
        items = [('CANAL DE PANAMÁ', (60, 120, 70), 0.5), ('CORREDOR EN MÉXICO', (150, 90, 40), dur * 0.25),
                 ('RUTAS DEL ÁRTICO', (60, 110, 160), dur * 0.5)]
        for i, (txt, col, st) in enumerate(items):
            p = ease_back(prog(t, st, 0.5))
            if p <= 0:
                continue
            cx = 380 + i * 580
            d.rounded_rectangle([cx - 240, 430 + (1 - clamp(p)) * 60, cx + 240, 650], 26, fill=col)
            draw_label(d, (cx, 540), txt, 40, WHITE, clamp(p), 'Black', bgc=col)
            if i == 0 and t > dur * 0.75:
                d.line([(cx - 200, 470), (cx + 200, 620)], fill=RED, width=10)
        if t > dur * 0.75:
            draw_label(d, (W / 2, 820), 'YA NO ES LA ÚNICA OPCIÓN', 58, GOLD, ease_out(prog(t, dur * 0.75, 0.5)), 'Black')

    def s_dilema(d, t, dur, sc):
        ang = 0.12 * math.sin(t * 1.4)
        cx, cy = W / 2, 430
        d.polygon([(cx - 30, 820), (cx + 30, 820), (cx, cy)], fill=SOFT)
        L = 520
        p1 = (cx - L * math.cos(ang), cy - L * math.sin(ang))
        p2 = (cx + L * math.cos(ang), cy + L * math.sin(ang))
        d.line([p1, p2], fill=SOFT, width=10)
        for (x, y), txt, col in ((p1, 'BARCOS', (220, 180, 110)), (p2, 'PERSONAS', CYAN)):
            d.line([(x, y), (x, y + 140)], fill=SOFT, width=4)
            d.rounded_rectangle([x - 170, y + 140, x + 170, y + 240], 20, fill=(25, 45, 80))
            draw_label(d, (x, y + 190), txt, 46, col, ease_out(prog(t, 1.0, 0.5)), 'Black', bgc=(25, 45, 80))
        a = ease_out(prog(t, 2, 0.5))
        draw_label(d, (W / 2, 330), '¿PARA QUIÉN ES EL AGUA?', 56, GOLD, a, 'Black')
        x = W / 2
        d.polygon([(x, 600 - 60), (x - 40, 600), (x + 40, 600)], fill=(70, 160, 230))
        d.ellipse([x - 40, 570, x + 40, 650], fill=(70, 160, 230))

    # ------------------------------------------------ Groenlandia
    GREEN = [(-73, 78), (-66, 81), (-55, 82.3), (-40, 83.5), (-25, 83), (-18, 81.5), (-12, 81), (-18, 77), (-20, 74),
             (-22, 70.5), (-26, 68.5), (-32, 68), (-38, 65.5), (-43, 60), (-46, 60.8), (-50, 64), (-53, 66.5),
             (-54, 69.5), (-56, 72.5), (-61, 76), (-68, 76.5)]
    CANADA = [(-120, 50), (-120, 69), (-110, 69), (-95, 68), (-90, 69), (-82, 67), (-80, 63), (-77, 60), (-70, 59),
              (-64, 60), (-60, 55), (-55, 52), (-55, 50)]
    BAFFIN = [(-80, 73.5), (-72, 72), (-62, 67), (-65, 62.5), (-75, 64), (-80, 68), (-90, 72)]
    ARCHI = [(-120, 72), (-110, 77), (-95, 79), (-80, 82), (-65, 82.5), (-75, 78), (-85, 75), (-100, 73), (-118, 70)]
    ICELAND = [(-24, 65.5), (-22, 66.4), (-16, 66.5), (-13.5, 65.2), (-18, 63.4), (-22.5, 63.8)]
    NORWAY = [(5, 58), (5, 62), (12, 66), (16, 69), (22, 70.5), (30, 71), (40, 69), (40, 58)]
    UK = [(-6, 50), (-3, 58.6), (-1.5, 57.5), (1.7, 52.5), (1, 50.8)]
    GBASE = Proj(-105, 30, 48, 86, (0, 150, W, H))

    def gl_map(d, t, dur, z0, z1, center=(-42, 72)):
        z = lerp(z0, z1, ease_out(t / max(dur, 0.1)))
        pr = zoom_proj(GBASE, z, *center)
        draw_land(d, pr, [(CANADA, LAND), (BAFFIN, LAND), (ARCHI, LAND), (ICELAND, LAND2), (NORWAY, LAND2), (UK, LAND2)])
        pts = [pr(*q) for q in GREEN]
        d.polygon(pts, fill=ICE, outline=WHITE)
        return pr

    def s_mapa_groenlandia(d, t, dur, sc):
        pr = gl_map(d, t, dur, 1.0, 1.3)
        labs = [('GROENLANDIA', (-41, 74), 0.6, (40, 60, 90)), ('CANADÁ', (-100, 60), 2.0, (230, 215, 185)),
                ('EUROPA', (15, 62), 3.5, (230, 215, 185)), ('ISLANDIA', (-18, 63), 4.5, (230, 215, 185)),
                ('OCÉANO ATLÁNTICO', (-35, 55), 6.0, CYAN)]
        for txt, ll, st, col in labs:
            draw_label(d, pr(*ll), txt, 46, col, ease_out(prog(t, st, 0.6)), 'Black', bgc=ICE if col == (40, 60, 90) else None)
        if t > dur * 0.65:
            a = ease_back(prog(t, dur * 0.65, 0.5))
            x, y = pr(-40, 70)
            d.rounded_rectangle([x - 150, y + 40, x + 150, y + 120], 18, fill=RED)
            draw_label(d, (x, y + 80), '80% HIELO', 44 * (0.6 + 0.4 * clamp(a)), WHITE, 1, 'Black', bgc=RED)

    def polar_base(d, t, cx=W / 2, cy=560, R=330):
        d.ellipse([cx - R, cy - R, cx + R, cy + R], fill=(14, 40, 75), outline=(60, 100, 150), width=4)
        conts = [('RUSIA', -90, 1.25), ('NORTEAMÉRICA', 150, 1.3), ('EUROPA', 20, 1.25)]
        for name, ang, k in conts:
            a = math.radians(ang)
            x, y = cx + math.cos(a) * R * 0.9, cy + math.sin(a) * R * 0.9
            d.ellipse([x - 170, y - 100, x + 170, y + 100], fill=LAND)
            draw_label(d, (cx + math.cos(a) * R * k, cy + math.sin(a) * R * k), name, 40, (230, 215, 185), 1, 'Black')
        gx, gy = cx + 70, cy + 130
        d.polygon([(gx - 60, gy - 90), (gx + 50, gy - 100), (gx + 80, gy + 10), (gx + 10, gy + 120), (gx - 50, gy + 30)], fill=ICE)
        d.ellipse([cx - 8, cy - 8, cx + 8, cy + 8], fill=WHITE)
        return (gx, gy)

    def s_polar(d, t, dur, sc):
        g_ = polar_base(d, t)
        draw_label(d, (g_[0] + 170, g_[1] + 10), 'GROENLANDIA', 36, ICE, ease_out(prog(t, 1.5, 0.5)), 'Black')
        p = ease_out(prog(t, dur * 0.4, 2.5))
        arrow_path(d, (W / 2, 260), (W / 2 - 300, 860), -120, p, RED, 8)
        if p >= 1:
            pulse_ring(d, g_, t, RED, 16)
            draw_label(d, (W / 2 + 520, 320), 'RUTA MÁS CORTA', 44, RED, ease_out(prog(t, dur * 0.4 + 2.5, 0.5)), 'Black')

    def s_radar(d, t, dur, sc):
        cx, cy, R = W / 2, 590, 300
        for k in (1, 2, 3):
            d.ellipse([cx - R * k / 3, cy - R * k / 3, cx + R * k / 3, cy + R * k / 3], outline=(40, 160, 90), width=3)
        d.line([(cx - R, cy), (cx + R, cy)], fill=(40, 120, 70), width=2)
        d.line([(cx, cy - R), (cx, cy + R)], fill=(40, 120, 70), width=2)
        a = t * 2.2
        for k in range(18):
            aa = a - k * 0.04
            d.line([(cx, cy), (cx + math.cos(aa) * R, cy + math.sin(aa) * R)], fill=mix(BG, (60, 255, 120), 1 - k / 18), width=6)
        rnd = random.Random(5)
        for k in range(5):
            ang = rnd.uniform(0, 2 * math.pi)
            rr = rnd.uniform(0.3, 0.9) * R
            diff = (a - ang) % (2 * math.pi)
            if diff < 2.5:
                c = mix(BG, (255, 80, 80), 1 - diff / 2.5)
                x, y = cx + math.cos(ang) * rr, cy + math.sin(ang) * rr
                d.ellipse([x - 12, y - 12, x + 12, y + 12], fill=c)
        draw_label(d, (cx, cy + R + 60), 'PITUFFIK (ANTES THULE)', 46, GOLD, ease_out(prog(t, 1, 0.5)), 'Black')
        draw_label(d, (cx + R + 220, cy - 120), 'DESDE 1951', 44, WHITE, ease_out(prog(t, 2, 0.5)), 'Black')

    def s_deshielo(d, t, dur, sc):
        cx, cy, R = W / 2, 600, 380
        d.ellipse([cx - R, cy - R, cx + R, cy + R], fill=(14, 40, 75), outline=(60, 100, 150), width=4)
        ice = lerp(0.85, 0.45, ease_out(prog(t, 1.0, dur * 0.5)))
        rnd = random.Random(9)
        pts = []
        for k in range(36):
            a = k * 2 * math.pi / 36
            rr = R * ice * (0.85 + 0.15 * rnd.random())
            pts.append((cx + math.cos(a) * rr, cy + math.sin(a) * rr))
        d.polygon(pts, fill=ICE)
        p = ease_out(prog(t, dur * 0.45, 2.0))
        arrow_path(d, (cx - R * 0.95, cy + 100), (cx + R * 0.95, cy + 140), 120 - 0, p, GOLD, 8)
        arrow_path(d, (cx + R * 0.95, cy - 120), (cx - R * 0.95, cy - 60), 160, ease_out(prog(t, dur * 0.55, 2.0)), CYAN, 8)
        draw_label(d, (cx + R + 220, cy + 150), 'NUEVAS RUTAS', 44, GOLD, ease_out(prog(t, dur * 0.6, 0.5)), 'Black')
        draw_label(d, (cx - R - 200, cy - 200), 'HIELO MARINO ↓', 40, ICE, ease_out(prog(t, 1.0, 0.5)), 'Black')

    def s_potencias(d, t, dur, sc):
        cx, cy = W / 2, 600
        d.polygon([(cx - 60, cy - 100), (cx + 60, cy - 110), (cx + 95, cy + 10), (cx + 15, cy + 130), (cx - 60, cy + 30)], fill=ICE)
        draw_label(d, (cx, cy + 180), 'GROENLANDIA', 40, ICE, 1, 'Black')
        items = [('EE. UU.', (40, 70, 140), (420, 380), 0.8), ('CHINA', (190, 30, 40), (W - 420, 380), dur * 0.45),
                 ('RUSIA', (90, 90, 110), (W - 420, 840), dur * 0.7)]
        for txt, col, (x, y), st in items:
            p = ease_back(prog(t, st, 0.5))
            if p <= 0:
                continue
            d.rounded_rectangle([x - 170, y - 60, x + 170, y + 60], 20, fill=col)
            draw_label(d, (x, y), txt, 50 * (0.6 + 0.4 * clamp(p)), WHITE, 1, 'Black', bgc=col)
            arrow_path(d, (x + (150 if x < cx else -150), y), (cx + (-110 if x < cx else 110), cy), 40,
                       ease_out(prog(t, st + 0.3, 0.8)), GOLD, 6)
        if t > 2.5:
            draw_label(d, (420, 480), '2019: OFERTA DE COMPRA', 30, GOLD, ease_out(prog(t, 2.5, 0.5)), 'ExtraBold')
        if t > dur * 0.5:
            draw_label(d, (W - 420, 480), '"ESTADO CASI ÁRTICO"', 30, GOLD, ease_out(prog(t, dur * 0.5, 0.5)), 'ExtraBold')

    def s_cierre_g(d, t, dur, sc):
        pr = gl_map(d, t, dur, 1.6, 0.9)
        pulse_ring(d, pr(-42, 72), t, RED, 16)
        a = ease_back(prog(t, 2.0, 0.6))
        if a > 0:
            d.rounded_rectangle([W / 2 - 520, 450, W / 2 + 520, 750], 30, fill=(0, 0, 0))
        draw_label(d, (W / 2, 560), 'MUCHO MÁS', 160 * (0.6 + 0.4 * clamp(a)), WHITE, clamp(a), 'Black')
        draw_label(d, (W / 2, 690), 'QUE HIELO', 90, GOLD, ease_out(prog(t, 3.0, 0.5)), 'Black')

    g['SCENES'].update({
        'gran_titulo': s_gran_titulo, 'contador': s_contador, 'lista': s_lista, 'barras_g': s_barras_g,
        'cadena': s_cadena, 'chips_g': s_chips_g, 'suscribete_g': s_suscribete_g,
        'mapa_panama': s_mapa_panama, 'esclusas': s_esclusas, 'gotas': s_gotas, 'nivel_lago': s_nivel_lago,
        'cola_barcos': s_cola_barcos, 'rutas_alt': s_rutas_alt, 'rutas_comp': s_rutas_comp, 'dilema': s_dilema,
        'mapa_groenlandia': s_mapa_groenlandia, 'polar': s_polar, 'radar': s_radar, 'deshielo': s_deshielo,
        'potencias': s_potencias, 'cierre_g': s_cierre_g,
    })
