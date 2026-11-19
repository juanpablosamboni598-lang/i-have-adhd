"""Xeno v2: estilo de la referencia (cabeza negra redonda, ojos blancos grandes, buzo), con rasgos propios:
rizo en forma de "?" y buzo mostaza con capucha."""
HEAD, OUT = '#16161C', '#0E0E12'
HOOD, HOODD, STR, PANTS, SHOE, ACC = '#F5B82E', '#D6951A', '#FFF6E0', '#2B2D42', '#FAFAFA', '#E63946'
W = 5

def defs():
    return ('<defs><radialGradient id="hl" gradientUnits="userSpaceOnUse" cx="160" cy="130" r="190">'
            '<stop offset="0" stop-color="#3A3A46"/><stop offset=".45" stop-color="#1C1C24"/><stop offset="1" stop-color="#0E0E12"/>'
            '</radialGradient></defs>')

def eyes(e):
    s = []
    if e == 'feliz':
        for x in (160, 240):
            s.append(f'<path d="M{x-26} 190 Q{x} 154 {x+26} 190 Q{x} 172 {x-26} 190Z" fill="#fff"/>')
        return ''.join(s)
    rx, ry, pr, dx, dy = 30, 38, 12, 0, 2
    if e == 'sorprendido': rx, ry, pr = 34, 44, 8
    if e == 'asustado': rx, ry, pr, dy = 32, 40, 7, 6
    if e == 'pensativo': dx, dy = -10, -14
    if e == 'picaro': ry, dx = 22, 8
    if e == 'enojado': ry = 28
    for x in (160, 240):
        s.append(f'<ellipse cx="{x}" cy="178" rx="{rx}" ry="{ry}" fill="#fff"/>')
        s.append(f'<circle cx="{x+dx}" cy="{180+dy}" r="{pr}" fill="{OUT}"/>')
        s.append(f'<circle cx="{x+dx+4}" cy="{175+dy}" r="{max(3,pr//3)}" fill="#fff"/>')
    if e in ('enojado', 'picaro'):
        for x, sgn in ((160, 1), (240, -1)):
            top = 146 if e == 'enojado' else 150
            a, b = (top, top + 16) if (sgn > 0) == (e == 'enojado') else (top + 16, top)
            s.append(f'<path d="M{x-36} {a} L{x+36} {b} L{x+36} 120 L{x-36} 120Z" fill="url(#hl)"/>')
    return ''.join(s)

def brows(e):
    d = {'neutral': ((134,128,184,124),(216,124,266,128)),
         'feliz': ((134,124,184,116),(216,116,266,124)),
         'sorprendido': ((136,112,184,100),(216,100,264,112)),
         'asustado': ((136,130,184,112),(216,112,264,130)),
         'pensativo': ((136,134,184,130),(216,108,264,116)),
         'picaro': ((136,130,184,128),(216,114,264,124)),
         'enojado': ((136,124,188,144),(212,144,264,124))}[e]
    return ''.join(f'<line x1="{a}" y1="{b}" x2="{c}" y2="{f}" stroke="#5A5A68" stroke-width="9" stroke-linecap="round"/>' for a,b,c,f in d)

def mouth(e):
    return {'neutral': '<path d="M182 252 Q200 262 218 252" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>',
            'feliz': '<path d="M164 240 Q200 296 236 240 Q200 252 164 240Z" fill="#fff"/><path d="M180 262 Q200 286 220 262 Q200 270 180 262Z" fill="#E63946"/>',
            'sorprendido': '<ellipse cx="200" cy="258" rx="15" ry="20" fill="#fff"/><ellipse cx="200" cy="262" rx="9" ry="12" fill="#E63946"/>',
            'asustado': '<path d="M170 258 q7.5 -10 15 0 t15 0 t15 0 t15 0" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>',
            'pensativo': '<path d="M188 258 L218 250" stroke="#fff" stroke-width="6" stroke-linecap="round"/>',
            'picaro': '<path d="M178 250 Q206 270 226 244" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>',
            'enojado': '<path d="M180 262 Q200 246 220 262" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>'}[e]

def extras(e):
    s = ''
    if e in ('feliz', 'sorprendido', 'picaro', 'neutral'):
        s += '<ellipse cx="124" cy="230" rx="18" ry="10" fill="#FF4D6D" opacity=".75"/><ellipse cx="276" cy="230" rx="18" ry="10" fill="#FF4D6D" opacity=".75"/>'
    if e == 'asustado':
        s += f'<path d="M298 118 q16 26 0 38 q-16 -12 0 -38Z" fill="#7CC8FF" stroke="{OUT}" stroke-width="3"/>'
    if e == 'pensativo':
        s += f'<text x="300" y="96" font-family="Arial Black,Arial" font-weight="900" font-size="60" fill="#FFD23F" stroke="{OUT}" stroke-width="4">?</text>'
    if e == 'sorprendido':
        s += '<g stroke="#FFD23F" stroke-width="8" stroke-linecap="round"><line x1="66" y1="96" x2="90" y2="116"/><line x1="334" y1="96" x2="310" y2="116"/><line x1="200" y1="6" x2="200" y2="28"/></g>'
    if e == 'enojado':
        s += '<path d="M296 104 l14 -14 m-14 0 l14 14" stroke="#E63946" stroke-width="7" stroke-linecap="round"/>'
    return s

def head(e):
    curl = (f'<path d="M170 50 C160 2 250 -4 246 34 C244 54 212 52 208 62" fill="none" stroke="{OUT}" stroke-width="18" stroke-linecap="round"/>')
    return (curl + f'<circle cx="200" cy="188" r="116" fill="url(#hl)" stroke="{OUT}" stroke-width="{W}"/>'
            + brows(e) + eyes(e) + mouth(e) + extras(e))

def arm(x0, y0, x1, y1, x2, y2):
    return (f'<path d="M{x0} {y0} Q{x1} {y1} {x2} {y2}" fill="none" stroke="{OUT}" stroke-width="36" stroke-linecap="round"/>'
            f'<path d="M{x0} {y0} Q{x1} {y1} {x2} {y2}" fill="none" stroke="{HOOD}" stroke-width="25" stroke-linecap="round"/>'
            f'<circle cx="{x2}" cy="{y2}" r="17" fill="url(#hl)" stroke="{OUT}" stroke-width="{W}"/>')

def body(pose):
    arms = {'normal': arm(146, 336, 114, 404, 120, 462) + arm(254, 336, 286, 404, 280, 462),
            'pensando': arm(146, 336, 114, 404, 120, 462) + arm(254, 336, 304, 366, 236, 300),
            'shock': arm(146, 336, 78, 306, 68, 226) + arm(254, 336, 322, 306, 332, 226),
            'explica': arm(146, 336, 114, 404, 120, 462) + arm(254, 336, 332, 336, 362, 272)}[pose]
    legs = ''.join(f'<path d="M{x} 470 L{x} 556" stroke="{OUT}" stroke-width="34" stroke-linecap="round"/>'
                   f'<path d="M{x} 470 L{x} 556" stroke="{PANTS}" stroke-width="22" stroke-linecap="round"/>' for x in (174, 226))
    shoes = ''.join(f'<path d="M{x-30} 578 Q{x-30} 552 {x} 552 Q{x+34} 552 {x+34} 578Z" fill="{SHOE}" stroke="{OUT}" stroke-width="{W}" stroke-linejoin="round"/>'
                    f'<path d="M{x-24} 568 L{x+28} 568" stroke="{ACC}" stroke-width="5"/>' for x in (166, 234))
    torso = (f'<path d="M132 318 Q200 292 268 318 L278 470 Q200 490 122 470 Z" fill="{HOOD}" stroke="{OUT}" stroke-width="{W}" stroke-linejoin="round"/>'
             # capucha detrás del cuello
             f'<path d="M140 316 Q200 270 260 316 Q236 300 200 300 Q164 300 140 316Z" fill="{HOODD}" stroke="{OUT}" stroke-width="{W}" stroke-linejoin="round"/>'
             # cordones
             f'<path d="M186 306 L182 360 M214 306 L218 360" stroke="{STR}" stroke-width="5" stroke-linecap="round"/>'
             f'<circle cx="182" cy="362" r="5" fill="{STR}"/><circle cx="218" cy="362" r="5" fill="{STR}"/>'
             # bolsillo canguro
             f'<path d="M156 410 L244 410 L256 452 L144 452 Z" fill="{HOODD}" stroke="{OUT}" stroke-width="4" stroke-linejoin="round"/>'
             f'<path d="M126 462 Q200 480 274 462" fill="none" stroke="{HOODD}" stroke-width="10"/>')
    return legs + shoes + torso + arms

def personaje(e='neutral', pose='normal'):
    b = body(pose)
    if pose == 'pensando':
        split = b.rfind('<path d="M254 336')
        return b[:split] + head(e) + b[split:]
    return b + head(e)

def svg(inner, w=400, h=600, vb='0 0 400 600'):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="{vb}">{defs()}{inner}</svg>'

if __name__ == '__main__':
    import os
    os.makedirs('svg', exist_ok=True)
    EXP = ['neutral', 'feliz', 'sorprendido', 'asustado', 'pensativo', 'picaro', 'enojado']
    POSES = [('normal', 'neutral'), ('explica', 'feliz'), ('pensando', 'pensativo'), ('shock', 'asustado')]
    for e in EXP: open(f'svg/cara_{e}.svg', 'w').write(svg(head(e), 400, 330, '60 -10 280 330'))
    for p, e in POSES: open(f'svg/pose_{p}.svg', 'w').write(svg(personaje(e, p)))
    g = ['<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5B2EFF"/><stop offset="1" stop-color="#FF4FA3"/></linearGradient></defs>',
         '<rect width="1920" height="1080" fill="#FFF8EC"/>',
         '<rect x="30" y="30" width="560" height="1020" rx="40" fill="url(#bg)"/>',
         f'<text x="640" y="90" font-family="Arial Black,Arial" font-weight="900" font-size="64" fill="{OUT}">XENO</text>',
         '<text x="640" y="132" font-family="Arial" font-size="28" fill="#555">Personaje de jxseng · ¿Qué pasaría si…?</text>',
         f'<g transform="translate(30,190) scale(1.4)">{personaje("picaro", "explica")}</g>']
    for i, e in enumerate(EXP):
        x, y = 640 + (i % 4) * 190, 160 + (i // 4) * 235
        g.append(f'<g transform="translate({x},{y}) scale(.55)"><g transform="translate(-60,10)">{head(e)}</g></g>')
        g.append(f'<text x="{x+77}" y="{y+215}" text-anchor="middle" font-family="Arial" font-weight="700" font-size="22" fill="{OUT}">{e}</text>')
    for i, (p, e) in enumerate(POSES):
        x = 640 + i * 180
        g.append(f'<g transform="translate({x},655) scale(.6)">{personaje(e, p)}</g>')
        g.append(f'<text x="{x+120}" y="1040" text-anchor="middle" font-family="Arial" font-weight="700" font-size="22" fill="{OUT}">{p}</text>')
    for i, (c, n) in enumerate([(HEAD, 'cabeza'), (HOOD, 'buzo'), (HOODD, 'capucha'), (PANTS, 'pantalón'), (ACC, 'acento'), ('#FF4D6D', 'cachetes')]):
        y = 190 + i * 110
        g.append(f'<rect x="1440" y="{y}" width="80" height="80" rx="14" fill="{c}" stroke="{OUT}" stroke-width="4"/>')
        g.append(f'<text x="1540" y="{y+36}" font-family="Arial" font-weight="700" font-size="26" fill="{OUT}">{n}</text>')
        g.append(f'<text x="1540" y="{y+68}" font-family="monospace" font-size="24" fill="#555">{c}</text>')
    open('hoja_personaje.svg', 'w').write(svg(''.join(g), 1920, 1080, '0 0 1920 1080'))
    print('ok')
