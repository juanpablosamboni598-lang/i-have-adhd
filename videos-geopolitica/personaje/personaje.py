"""Xeno v3 (serio): silueta negra estilo referencia con proporciones de adulto, ojos almendrados,
chaqueta bomber gris azulado, camiseta blanca, jean oscuro. Sello discreto: pin "?" en el pecho."""
OUT = '#0E0E12'
JACK, JACKD, TEE, PANTS, SHOE, PIN = '#3A4A63', '#2A374B', '#ECEFF3', '#1F2430', '#E9E9E9', '#F2B134'
BROW = '#11141B'
W = 4

def defs():
    return ('<defs><radialGradient id="hl" gradientUnits="userSpaceOnUse" cx="178" cy="78" r="120">'
            '<stop offset="0" stop-color="#5A6680"/><stop offset=".55" stop-color="#2E3646"/><stop offset="1" stop-color="#1A1F2A"/>'
            '</radialGradient></defs>')

def almond(x, y, w, h, lid=0):
    return f'M{x-w} {y} Q{x} {y-h-lid} {x+w} {y} Q{x} {y+h*0.85} {x-w} {y}Z'

def eyes(e):
    cfg = {'neutral': (21, 12, 6, 0, 0), 'serio': (21, 10, 6, 0, 0), 'esceptico': (21, 11, 6, 2, 0),
           'sorprendido': (22, 16, 5, 0, 0), 'preocupado': (21, 13, 5, 0, 2), 'pensativo': (21, 12, 6, -6, -3),
           'sonrisa': (21, 10, 6, 0, 0)}[e]
    w, h, pr, dx, dy = cfg
    s = ''
    for i, x in enumerate((172, 228)):
        hh = h - 3 if (e == 'esceptico' and i == 0) else h
        s += f'<path d="{almond(x, 112, w, hh)}" fill="#F4F4F6"/>'
        s += f'<circle cx="{x+dx}" cy="{112+dy}" r="{pr}" fill="{OUT}"/>'
        s += f'<circle cx="{x+dx+2}" cy="{110+dy}" r="1.8" fill="#fff"/>'
    return s

def brows(e):
    d = {'neutral': ((152,94,190,92),(210,92,248,94)),
         'serio': ((152,96,190,100),(210,100,248,96)),
         'esceptico': ((152,98,190,98),(210,86,248,92)),
         'sorprendido': ((152,84,190,80),(210,80,248,84)),
         'preocupado': ((152,98,190,88),(210,88,248,98)),
         'pensativo': ((152,98,190,96),(210,88,248,92)),
         'sonrisa': ((152,94,190,92),(210,92,248,94))}[e]
    return ''.join(f'<path d="M{a} {b} L{c} {f}" stroke="{BROW}" stroke-width="7" stroke-linecap="round"/>' for a, b, c, f in d)

def mouth(e):
    c = '#E6E6EA'
    return {'neutral': f'<path d="M188 150 L212 150" stroke="{c}" stroke-width="4" stroke-linecap="round"/>',
            'serio': f'<path d="M186 152 Q200 149 214 152" fill="none" stroke="{c}" stroke-width="4" stroke-linecap="round"/>',
            'esceptico': f'<path d="M186 152 Q202 150 216 146" fill="none" stroke="{c}" stroke-width="4" stroke-linecap="round"/>',
            'sorprendido': f'<ellipse cx="200" cy="153" rx="6" ry="8" fill="{c}"/>',
            'preocupado': f'<path d="M186 154 Q200 147 214 154" fill="none" stroke="{c}" stroke-width="4" stroke-linecap="round"/>',
            'pensativo': f'<path d="M190 152 L214 149" stroke="{c}" stroke-width="4" stroke-linecap="round"/>',
            'sonrisa': f'<path d="M184 148 Q202 160 218 146" fill="none" stroke="{c}" stroke-width="4" stroke-linecap="round"/>'}[e]

def head(e):
    hair = (f'<path d="M126 92 Q128 30 200 28 Q266 28 276 86 Q262 58 222 52 Q236 62 232 70 Q206 50 160 60 Q138 68 126 92Z" '
            f'fill="#11141B" stroke="{OUT}" stroke-width="{W}" stroke-linejoin="round"/>')
    ears = ''.join(f'<ellipse cx="{x}" cy="116" rx="9" ry="15" fill="url(#hl)" stroke="{OUT}" stroke-width="{W}"/>' for x in (122, 278))
    face = f'<ellipse cx="200" cy="108" rx="78" ry="86" fill="url(#hl)" stroke="{OUT}" stroke-width="{W}"/>'
    return ears + face + hair + brows(e) + eyes(e) + mouth(e)

def arm(x0, y0, x1, y1, x2, y2):
    return (f'<path d="M{x0} {y0} Q{x1} {y1} {x2} {y2}" fill="none" stroke="{OUT}" stroke-width="32" stroke-linecap="round"/>'
            f'<path d="M{x0} {y0} Q{x1} {y1} {x2} {y2}" fill="none" stroke="{JACK}" stroke-width="23" stroke-linecap="round"/>'
            f'<ellipse cx="{x2}" cy="{y2}" rx="11" ry="13" fill="#262D3B" stroke="{OUT}" stroke-width="{W}"/>')

def body(pose):
    A = {'normal': arm(140, 222, 120, 300, 128, 382) + arm(260, 222, 280, 300, 272, 382),
         'explica': arm(140, 222, 120, 300, 128, 382) + arm(260, 222, 320, 262, 336, 210),
         'pensando': arm(140, 222, 120, 300, 128, 382) + arm(260, 222, 290, 260, 222, 166),
         'brazos': arm(140, 222, 150, 300, 238, 292) + arm(260, 222, 250, 300, 162, 290)}[pose]
    legs = ''.join(f'<path d="M{x} 396 L{x+dx} 560" stroke="{OUT}" stroke-width="34" stroke-linecap="round"/>'
                   f'<path d="M{x} 396 L{x+dx} 560" stroke="{PANTS}" stroke-width="25" stroke-linecap="round"/>' for x, dx in ((182, -4), (218, 4)))
    shoes = ''.join(f'<path d="M{x-24} 580 Q{x-22} 556 {x+2} 556 Q{x+30} 558 {x+32} 580Z" fill="{SHOE}" stroke="{OUT}" stroke-width="{W}" stroke-linejoin="round"/>'
                    f'<path d="M{x-22} 573 L{x+30} 573" stroke="#9AA0AA" stroke-width="3"/>' for x in (172, 228))
    neck = f'<rect x="186" y="186" width="28" height="22" fill="#262D3B" stroke="{OUT}" stroke-width="{W}"/>'
    tee = f'<path d="M176 204 L224 204 L230 390 L170 390Z" fill="{TEE}" stroke="{OUT}" stroke-width="{W}"/>'
    jacket = (f'<path d="M136 214 Q200 194 264 214 L270 398 Q238 404 222 400 L216 212 L184 212 L178 400 Q162 404 130 398Z" '
              f'fill="{JACK}" stroke="{OUT}" stroke-width="{W}" stroke-linejoin="round"/>'
              f'<path d="M184 210 L172 246 L190 232Z M216 210 L228 246 L210 232Z" fill="{JACKD}" stroke="{OUT}" stroke-width="3" stroke-linejoin="round"/>'
              f'<path d="M130 384 Q150 392 178 390 M222 390 Q250 392 270 384" fill="none" stroke="{JACKD}" stroke-width="9"/>'
              f'<path d="M150 300 L172 296 M228 296 L250 300" stroke="{JACKD}" stroke-width="4" stroke-linecap="round"/>'
              f'<circle cx="246" cy="250" r="10" fill="{PIN}" stroke="{OUT}" stroke-width="3"/>'
              f'<text x="246" y="256" text-anchor="middle" font-family="Arial Black,Arial" font-weight="900" font-size="15" fill="{OUT}">?</text>')
    return legs + shoes + neck + tee + jacket + A

def personaje(e='neutral', pose='normal'):
    b = body(pose)
    if pose == 'pensando':
        k = b.rfind('<path d="M260 222')
        return b[:k] + head(e) + b[k:]
    return b + head(e)

def svg(inner, w=400, h=600, vb='0 0 400 600'):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="{vb}">{defs()}{inner}</svg>'

if __name__ == '__main__':
    import os
    os.makedirs('svg', exist_ok=True)
    EXP = ['neutral', 'serio', 'esceptico', 'pensativo', 'sorprendido', 'preocupado', 'sonrisa']
    POSES = [('normal', 'neutral'), ('explica', 'sonrisa'), ('pensando', 'pensativo'), ('brazos', 'esceptico')]
    for f in os.listdir('svg'): os.remove(os.path.join('svg', f))
    for e in EXP: open(f'svg/cara_{e}.svg', 'w').write(svg(head(e), 300, 240, '100 10 200 200'))
    for p, e in POSES: open(f'svg/pose_{p}.svg', 'w').write(svg(personaje(e, p)))
    g = ['<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E2A3A"/><stop offset="1" stop-color="#0F1620"/></linearGradient></defs>',
         '<rect width="1920" height="1080" fill="#F3F1EC"/>',
         '<rect x="30" y="30" width="560" height="1020" rx="28" fill="url(#bg)"/>',
         f'<text x="640" y="90" font-family="Arial Black,Arial" font-weight="900" font-size="64" fill="{OUT}">XENO</text>',
         '<text x="640" y="132" font-family="Arial" font-size="28" fill="#555">Personaje de jxseng · ¿Qué pasaría si…?</text>',
         f'<g transform="translate(-10,130) scale(1.55)">{personaje("serio", "brazos")}</g>']
    for i, e in enumerate(EXP):
        x, y = 640 + (i % 4) * 190, 165 + (i // 4) * 230
        g.append(f'<g transform="translate({x},{y}) scale(.9)"><g transform="translate(-100,-10)">{head(e)}</g></g>')
        g.append(f'<text x="{x+90}" y="{y+205}" text-anchor="middle" font-family="Arial" font-weight="700" font-size="22" fill="{OUT}">{e}</text>')
    for i, (p, e) in enumerate(POSES):
        x = 630 + i * 185
        g.append(f'<g transform="translate({x},640) scale(.63)">{personaje(e, p)}</g>')
        g.append(f'<text x="{x+126}" y="1040" text-anchor="middle" font-family="Arial" font-weight="700" font-size="22" fill="{OUT}">{p}</text>')
    for i, (c, n) in enumerate([('#2E3646', 'cabeza'), (JACK, 'chaqueta'), (TEE, 'camiseta'), (PANTS, 'jean'), (PIN, 'pin ?'), (BROW, 'cejas')]):
        y = 190 + i * 110
        g.append(f'<rect x="1440" y="{y}" width="80" height="80" rx="14" fill="{c}" stroke="{OUT}" stroke-width="4"/>')
        g.append(f'<text x="1540" y="{y+36}" font-family="Arial" font-weight="700" font-size="26" fill="{OUT}">{n}</text>')
        g.append(f'<text x="1540" y="{y+68}" font-family="monospace" font-size="24" fill="#555">{c}</text>')
    open('hoja_personaje.svg', 'w').write(svg(''.join(g), 1920, 1080, '0 0 1920 1080'))
    print('ok')
