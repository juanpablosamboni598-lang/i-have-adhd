"""Escenas genéricas configurables desde escenas.json: mapa_g, nodos, tarjetas."""
import math

GEO = {
    'malaya': [(98.3, 9.5), (98.3, 8.0), (98.4, 7.0), (99.7, 6.4), (100.3, 5.4), (100.6, 4.2), (101.3, 2.8), (102.2, 2.2),
               (103.3, 1.45), (103.6, 1.35), (104.3, 1.45), (103.4, 3.9), (103.4, 4.8), (102.4, 6.1), (101.5, 6.9),
               (100.4, 7.2), (100.2, 8.5), (101.0, 9.5)],
    'sumatra': [(95.2, 5.6), (97.5, 5.2), (98.7, 3.8), (100.3, 2.3), (101.5, 1.75), (102.6, 1.1), (103.7, 0.9),
                (103.8, -1.0), (104.5, -2.0), (105.8, -3.6), (105.8, -5.8), (104.5, -5.9), (102.3, -4.0),
                (100.4, -1.0), (98.8, 1.7), (97.2, 2.9), (95.3, 5.0)],
    'taiwan': [(121.0, 25.3), (121.6, 25.3), (121.9, 25.0), (121.8, 24.3), (121.5, 23.3), (121.0, 22.3), (120.85, 21.9),
               (120.6, 22.3), (120.2, 22.8), (120.1, 23.5), (120.3, 24.3), (120.7, 24.9)],
    'china_sur': [(110, 33), (110, 21.5), (113.5, 22.2), (116.5, 22.9), (117.5, 23.6), (118.2, 24.5), (119.0, 25.4),
                  (119.6, 26.4), (120.3, 27.2), (121.0, 28.3), (121.6, 29.5), (122.0, 30.8), (121.0, 32.0),
                  (120.5, 33)],
    'japon_sur': [(129.5, 33.0), (130.5, 31.2), (131.5, 31.5), (132.0, 33.5), (131.0, 34.4), (129.8, 33.8)],
    'baltico_sur': [(10, 54.5), (13.0, 54.3), (14.2, 53.9), (15.5, 54.2), (16.8, 54.6), (18.0, 54.8), (18.6, 54.4),
                    (19.6, 54.45), (19.9, 54.6), (20.0, 54.95), (21.1, 55.0), (21.3, 55.3), (21.1, 55.7),
                    (21.0, 56.5), (21.6, 57.4), (22.6, 57.75), (23.3, 57.0), (24.3, 57.2), (24.4, 58.3),
                    (23.5, 58.6), (23.5, 59.3), (25.5, 59.5), (28.0, 59.5), (30.5, 59.9), (34, 60), (34, 50), (10, 50)],
    'suecia': [(10, 56.0), (12.8, 55.4), (14.3, 55.6), (14.6, 56.1), (16.0, 56.2), (16.5, 57.0), (16.7, 57.9),
               (16.9, 58.6), (18.0, 59.3), (18.6, 60.2), (17.3, 61.0), (17.4, 62.5), (10, 62.5)],
    'finlandia': [(21.3, 60.6), (22.9, 59.9), (25.0, 60.2), (27.0, 60.5), (28.5, 60.6), (30.0, 61.2), (31.5, 62.5),
                  (34, 63), (34, 65), (21.3, 65), (21.4, 63.0)],
    'bielorrusia': [(23.5, 52.0), (34, 52.0), (34, 55.5), (28.0, 56.1), (26.6, 55.7), (25.8, 54.9), (25.0, 54.2),
                    (23.5, 53.95)],
    'kaliningrado': [(19.6, 54.45), (22.79, 54.36), (22.6, 54.95), (21.4, 55.25), (21.1, 55.0), (20.0, 54.95),
                     (19.9, 54.6)],
}


def register(g):
    W, H = g['W'], g['H']
    WHITE, SOFT, RED, GOLD, CYAN, BG = g['WHITE'], g['SOFT'], g['RED'], g['GOLD'], g['CYAN'], g['BG']
    LAND, LAND2 = g['LAND'], g['LAND2']
    font, lerp, mix, clamp = g['font'], g['lerp'], g['mix'], g['clamp']
    ease_out, ease_back, prog = g['ease_out'], g['ease_back'], g['prog']
    draw_label, pulse_ring, arrow_path, Proj, zoom_proj = (g['draw_label'], g['pulse_ring'], g['arrow_path'],
                                                          g['Proj'], g['zoom_proj'])
    C = {'red': RED, 'gold': GOLD, 'cyan': CYAN, 'white': WHITE, 'sand': (230, 215, 185), 'land': LAND,
         'land2': LAND2, 'dark': (40, 36, 30), 'blue': (40, 80, 150), 'gray': (90, 90, 110), 'ice': (225, 238, 248)}
    FILL = dict(C, red=(150, 40, 45))

    def col(name):
        return C.get(name, WHITE) if isinstance(name, str) else tuple(name)

    def base_proj(sc):
        lon_c, lat_c, span = sc['vista']
        box = (0, 150, W, H)
        bw, bh = box[2] - box[0], box[3] - box[1]
        lat_span = span * math.cos(math.radians(lat_c)) * bh / bw
        return Proj(lon_c - span / 2, lon_c + span / 2, lat_c - lat_span / 2, lat_c + lat_span / 2, box)

    def s_mapa_g(d, t, dur, sc):
        base = base_proj(sc)
        z0, z1 = sc.get('zoom', [1.0, 1.0])
        z = lerp(z0, z1, ease_out(t / max(dur, 0.1)))
        cx, cy = sc.get('centro', sc['vista'][:2])
        pr = zoom_proj(base, z, cx, cy)
        for key, c in sc['tierras']:
            fc = FILL.get(c, LAND)
            d.polygon([pr(*p) for p in GEO[key]], fill=fc, outline=mix(fc, WHITE, 0.3))
        if sc.get('linea'):
            p = ease_out(prog(t, dur * sc.get('linea_t', 0.5), 1.8))
            if p > 0:
                P = [pr(*q) for q in sc['linea']]
                segs = [math.dist(P[i], P[i + 1]) for i in range(len(P) - 1)]
                rem = sum(segs) * p
                out = [P[0]]
                for i, L in enumerate(segs):
                    if rem >= L:
                        out.append(P[i + 1]); rem -= L
                    else:
                        f = rem / L if L else 0
                        out.append((lerp(P[i][0], P[i + 1][0], f), lerp(P[i][1], P[i + 1][1], f)))
                        break
                d.line(out, fill=RED, width=9, joint='curve')
                ex, ey = out[-1]
                d.ellipse([ex - 10, ey - 10, ex + 10, ey + 10], fill=RED)
                if p >= 1 and sc.get('medida'):
                    mx = (P[0][0] + P[-1][0]) / 2
                    my = min(P[0][1], P[-1][1]) - 50
                    draw_label(d, (mx, my), sc['medida'], 54, RED, ease_back(prog(t, dur * sc.get('linea_t', 0.5) + 1.8, 0.5)), 'Black')
        for txt, lon, lat, fr, c in sc.get('etiquetas', []):
            a = ease_out(prog(t, dur * fr, 0.6))
            if a > 0:
                x, y = pr(lon, lat)
                d.text((x, y), txt, font=font('Black', 44), fill=mix(BG, col(c), a), anchor='mm',
                       stroke_width=4, stroke_fill=(0, 0, 0))
        if sc.get('pulso') and t > dur * 0.3:
            pulse_ring(d, pr(*sc['pulso']), t, RED, 14)

    def s_nodos(d, t, dur, sc):
        N = sc['nodos']
        for i, j, bend, fr, c in sc.get('flechas', []):
            p = ease_out(prog(t, dur * fr, 1.4))
            a, b = N[i], N[j]
            arrow_path(d, (a[1], a[2]), (b[1], b[2]), bend, p, col(c), 8)
        for k, (label, x, y, c) in enumerate(N):
            q = ease_back(prog(t, 0.3 + k * 0.4, 0.5))
            if q <= 0:
                continue
            r = 20 * clamp(q)
            d.ellipse([x - r, y - r, x + r, y + r], fill=col(c))
            d.text((x, y - 55), label, font=font('Black', 42), fill=mix(BG, WHITE, clamp(q)), anchor='mm',
                   stroke_width=4, stroke_fill=(0, 0, 0))
        if sc.get('nota'):
            txt, fr, c = sc['nota']
            draw_label(d, (W / 2, 880), txt, 54, col(c), ease_out(prog(t, dur * fr, 0.5)), 'Black')

    def s_tarjetas(d, t, dur, sc):
        cx, cy = W / 2, 610
        r = 110 + 4 * math.sin(t * 3)
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(25, 45, 80), outline=GOLD, width=5)
        draw_label(d, (cx, cy), sc['centro'], 44, WHITE, 1, 'Black', bgc=(25, 45, 80))
        for label, c, x, y, fr, nota in sc['tarjetas']:
            p = ease_back(prog(t, dur * fr, 0.5))
            if p <= 0:
                continue
            fc = FILL.get(c, col(c))
            d.rounded_rectangle([x - 190, y - 60, x + 190, y + 60], 20, fill=fc, outline=WHITE, width=3)
            fs = 46
            while fs > 24 and d.textlength(label, font=font('Black', fs)) > 340:
                fs -= 2
            draw_label(d, (x, y), label, fs * (0.6 + 0.4 * clamp(p)), WHITE, 1, 'Black', bgc=fc)
            sx = x + (200 if x < cx else -200)
            arrow_path(d, (sx, y), (cx + (-125 if x < cx else 125), cy + (-40 if y < cy else 40)), 30,
                       ease_out(prog(t, dur * fr + 0.3, 0.8)), GOLD, 6)
            if nota:
                draw_label(d, (x, y + 95), nota, 30, GOLD, ease_out(prog(t, dur * fr + 0.5, 0.5)), 'ExtraBold')

    g['SCENES'].update({'mapa_g': s_mapa_g, 'nodos': s_nodos, 'tarjetas': s_tarjetas})
