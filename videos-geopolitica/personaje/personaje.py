"""Xeno: personaje original de jxseng (monigote 2D). Genera SVGs por expresión y pose."""
SKIN, OUT, HAIR = '#FFD9B3', '#1E1E24', '#3B2A20'
HOOD, HOOD2, MARK, PANTS, SHOE = '#2EC4B6', '#1FA396', '#FFD23F', '#1D3557', '#F4F1EA'
W = 6  # grosor de contorno

def eyes(e):
    s = []
    if e == 'feliz':
        for x in (158, 242):
            s.append(f'<path d="M{x-24} 172 Q{x} 140 {x+24} 172" fill="none" stroke="{OUT}" stroke-width="9" stroke-linecap="round"/>')
        return ''.join(s)
    rx, ry, pr, dx, dy = 27, 33, 13, 0, 0
    if e == 'sorprendido': rx, ry, pr = 31, 39, 9
    if e == 'asustado': rx, ry, pr, dy = 30, 36, 8, 4
    if e == 'pensativo': dx, dy = -8, -12
    if e == 'enojado': ry = 26
    for x in (158, 242):
        s.append(f'<ellipse cx="{x}" cy="168" rx="{rx}" ry="{ry}" fill="#fff" stroke="{OUT}" stroke-width="{W}"/>')
        s.append(f'<circle cx="{x+dx}" cy="{170+dy}" r="{pr}" fill="{OUT}"/>')
        s.append(f'<circle cx="{x+dx+4}" cy="{165+dy}" r="{max(3,pr//3)}" fill="#fff"/>')
    if e == 'enojado':  # párpado superior
        for x, sgn in ((158, 1), (242, -1)):
            s.append(f'<path d="M{x-30} {142 if sgn>0 else 158} L{x+30} {158 if sgn>0 else 142} L{x+30} 130 L{x-30} 130 Z" fill="{SKIN}"/>')
    return ''.join(s)

def brows(e):
    d = {'neutral': ((132,126,184,124),(216,124,268,126)),
         'feliz': ((132,118,184,112),(216,112,268,118)),
         'sorprendido': ((134,108,184,98),(216,98,266,108)),
         'asustado': ((134,124,184,108),(216,108,266,124)),
         'pensativo': ((134,128,184,126),(216,104,266,112)),
         'enojado': ((134,120,186,140),(214,140,266,120))}[e]
    return ''.join(f'<line x1="{a}" y1="{b}" x2="{c}" y2="{f}" stroke="{OUT}" stroke-width="10" stroke-linecap="round"/>' for a,b,c,f in d)

def mouth(e):
    m = {'neutral': f'<path d="M180 238 Q200 250 220 238" fill="none" stroke="{OUT}" stroke-width="7" stroke-linecap="round"/>',
         'feliz': f'<path d="M166 228 Q200 282 234 228 Z" fill="#7A1F2B" stroke="{OUT}" stroke-width="{W}" stroke-linejoin="round"/><path d="M184 254 Q200 264 216 254 Q200 248 184 254Z" fill="#FF7A8A"/>',
         'sorprendido': f'<ellipse cx="200" cy="246" rx="16" ry="22" fill="#7A1F2B" stroke="{OUT}" stroke-width="{W}"/>',
         'asustado': f'<path d="M168 246 q8 -10 16 0 t16 0 t16 0 t16 0" fill="none" stroke="{OUT}" stroke-width="7" stroke-linecap="round"/>',
         'pensativo': f'<path d="M186 244 L218 238" stroke="{OUT}" stroke-width="7" stroke-linecap="round"/>',
         'enojado': f'<path d="M178 250 Q200 232 222 250" fill="none" stroke="{OUT}" stroke-width="7" stroke-linecap="round"/>'}[e]
    return m

def extras(e):
    s = ''
    if e in ('feliz', 'neutral', 'sorprendido'):
        s += f'<ellipse cx="128" cy="212" rx="16" ry="9" fill="#FF8FA3" opacity=".55"/><ellipse cx="272" cy="212" rx="16" ry="9" fill="#FF8FA3" opacity=".55"/>'
    if e == 'asustado':
        s += f'<path d="M292 120 q14 22 0 34 q-14 -12 0 -34Z" fill="#7CC8FF" stroke="{OUT}" stroke-width="4"/>'
    if e == 'pensativo':
        s += f'<text x="300" y="92" font-family="Arial Black,Arial" font-weight="900" font-size="56" fill="{MARK}" stroke="{OUT}" stroke-width="4">?</text>'
    if e == 'sorprendido':
        s += f'<g stroke="{MARK}" stroke-width="7" stroke-linecap="round"><line x1="70" y1="90" x2="92" y2="110"/><line x1="330" y1="90" x2="308" y2="110"/><line x1="200" y1="10" x2="200" y2="30"/></g>'
    return s

def head(e):
    # rizo en forma de "?" (sello del personaje)
    curl = (f'<path d="M178 70 C170 30 236 22 236 52 C236 74 204 74 204 92" fill="none" stroke="{HAIR}" stroke-width="15" stroke-linecap="round"/>'
            f'<circle cx="204" cy="76" r="0" />')
    ears = (f'<ellipse cx="88" cy="182" rx="18" ry="24" fill="{SKIN}" stroke="{OUT}" stroke-width="{W}"/>'
            f'<ellipse cx="312" cy="182" rx="18" ry="24" fill="{SKIN}" stroke="{OUT}" stroke-width="{W}"/>')
    return (ears + f'<circle cx="200" cy="178" r="112" fill="{SKIN}" stroke="{OUT}" stroke-width="{W}"/>' + curl
            + brows(e) + eyes(e) + mouth(e) + extras(e))

def arm(x0, y0, x1, y1, x2, y2):
    return (f'<path d="M{x0} {y0} Q{x1} {y1} {x2} {y2}" fill="none" stroke="{OUT}" stroke-width="34" stroke-linecap="round"/>'
            f'<path d="M{x0} {y0} Q{x1} {y1} {x2} {y2}" fill="none" stroke="{HOOD}" stroke-width="22" stroke-linecap="round"/>'
            f'<circle cx="{x2}" cy="{y2}" r="17" fill="{SKIN}" stroke="{OUT}" stroke-width="{W}"/>')

def body(pose):
    arms = {'normal': arm(146, 330, 112, 400, 118, 462) + arm(254, 330, 288, 400, 282, 462),
            'pensando': arm(146, 330, 112, 400, 118, 462) + arm(254, 330, 300, 360, 236, 290),
            'shock': arm(146, 330, 80, 300, 70, 220) + arm(254, 330, 320, 300, 330, 220),
            'explica': arm(146, 330, 112, 400, 118, 462) + arm(254, 330, 330, 330, 360, 268)}[pose]
    legs = ''.join(f'<path d="M{x} 470 L{x} 560" stroke="{OUT}" stroke-width="32" stroke-linecap="round"/>'
                   f'<path d="M{x} 470 L{x} 560" stroke="{PANTS}" stroke-width="20" stroke-linecap="round"/>' for x in (172, 228))
    shoes = ''.join(f'<ellipse cx="{x}" cy="572" rx="30" ry="15" fill="{SHOE}" stroke="{OUT}" stroke-width="{W}"/>' for x in (164, 236))
    torso = (f'<path d="M140 300 Q200 280 260 300 L272 470 Q200 488 128 470 Z" fill="{HOOD}" stroke="{OUT}" stroke-width="{W}" stroke-linejoin="round"/>'
             f'<path d="M150 440 L250 440 L248 466 Q200 476 152 466Z" fill="{HOOD2}"/>'
             f'<text x="200" y="420" text-anchor="middle" font-family="Arial Black,Arial" font-weight="900" font-size="78" fill="{MARK}" stroke="{OUT}" stroke-width="4">?</text>')
    return legs + shoes + torso + arms

def personaje(e='neutral', pose='normal'):
    # el brazo de "pensando" va delante de la cara
    if pose == 'pensando':
        b = body(pose); split = b.rfind('<path d="M254 330')
        return b[:split] + head(e) + b[split:]
    return body(pose) + head(e)

def svg(inner, w=400, h=600, vb='0 0 400 600'):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="{vb}">{inner}</svg>'

if __name__ == '__main__':
    import os
    os.makedirs('svg', exist_ok=True)
    EXP = ['neutral', 'feliz', 'sorprendido', 'asustado', 'pensativo', 'enojado']
    POSES = [('normal','neutral'), ('explica','feliz'), ('pensando','pensativo'), ('shock','asustado')]
    for e in EXP: open(f'svg/cara_{e}.svg','w').write(svg(head(e), 400, 330, '60 -10 280 330'))
    for p, e in POSES: open(f'svg/pose_{p}.svg','w').write(svg(personaje(e, p)))
    # hoja de personaje
    g = [f'<rect width="1920" height="1080" fill="#FFF8EC"/>',
         f'<text x="60" y="90" font-family="Arial Black,Arial" font-weight="900" font-size="64" fill="{OUT}">XENO</text>',
         f'<text x="60" y="135" font-family="Arial" font-size="28" fill="#555">Personaje de jxseng · ¿Qué pasaría si…?</text>',
         f'<g transform="translate(40,170) scale(1.4)">{personaje("neutral")}</g>']
    for i, e in enumerate(EXP):
        x, y = 640 + (i % 3) * 230, 150 + (i // 3) * 250
        g.append(f'<g transform="translate({x},{y}) scale(.62)"><g transform="translate(-60,10)">{head(e)}</g></g>')
        g.append(f'<text x="{x+87}" y="{y+235}" text-anchor="middle" font-family="Arial" font-weight="700" font-size="24" fill="{OUT}">{e}</text>')
    for i, (p, e) in enumerate(POSES):
        x = 640 + i * 175
        g.append(f'<g transform="translate({x},660) scale(.6)">{personaje(e, p)}</g>')
        g.append(f'<text x="{x+120}" y="1040" text-anchor="middle" font-family="Arial" font-weight="700" font-size="22" fill="{OUT}">{p}</text>')
    for i, (c, n) in enumerate([(SKIN,'piel'),(HOOD,'buzo'),(MARK,'signo'),(PANTS,'pantalón'),(HAIR,'rizo'),(OUT,'contorno')]):
        y = 190 + i * 110
        g.append(f'<rect x="1400" y="{y}" width="80" height="80" rx="14" fill="{c}" stroke="{OUT}" stroke-width="4"/>')
        g.append(f'<text x="1500" y="{y+36}" font-family="Arial" font-weight="700" font-size="26" fill="{OUT}">{n}</text>')
        g.append(f'<text x="1500" y="{y+68}" font-family="monospace" font-size="24" fill="#555">{c}</text>')
    open('hoja_personaje.svg','w').write(svg(''.join(g), 1920, 1080, '0 0 1920 1080'))
    print('ok')
