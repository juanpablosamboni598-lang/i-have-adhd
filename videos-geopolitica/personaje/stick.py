"""Xeno stickman: cabeza negra redonda, ojos blancos grandes, sudadera naranja "?" y gafas amarillas.
Mismas funciones que xeno2.py (head, body). Uso directo: python3 stick.py > hoja_stick.svg"""
BLK, BLK_L, HOOD, HOOD_D, GOG, OUT = '#16161E', '#2A2A36', '#FF7A1A', '#D85F0A', '#FFD23F', '#0B0B10'
SKIN = BLK
HAIR = BLK

def head(exp='normal'):
    s = [f'<circle r="128" fill="{BLK}" stroke="{OUT}" stroke-width="6"/>',
         '<ellipse cx="-50" cy="-70" rx="46" ry="24" fill="#fff" opacity="0.10" transform="rotate(-25 -50 -70)"/>']
    # gafas en la frente
    s.append(f'<path d="M-126 -64 Q0 -92 126 -64" stroke="#3A3A48" stroke-width="16" fill="none"/>')
    for x in (-46, 46):
        s.append(f'<rect x="{x-42}" y="-112" width="84" height="54" rx="24" fill="{GOG}" stroke="{OUT}" stroke-width="6"/>'
                 f'<rect x="{x-30}" y="-102" width="60" height="34" rx="16" fill="#9FE3FF" stroke="{OUT}" stroke-width="4"/>'
                 f'<path d="M{x-20} -95 l16 0" stroke="#fff" stroke-width="6" stroke-linecap="round"/>')
    s.append(f'<rect x="-8" y="-92" width="16" height="14" rx="4" fill="{GOG}" stroke="{OUT}" stroke-width="4"/>')
    def eye(x, rx=34, ry=44, px=0, py=6, pr=12):
        return f'<ellipse cx="{x}" cy="8" rx="{rx}" ry="{ry}" fill="#fff"/><circle cx="{x+px}" cy="{8+py}" r="{pr}" fill="{OUT}"/><circle cx="{x+px-4}" cy="{8+py-5}" r="4" fill="#fff"/>'
    if exp == 'riendo':
        for x in (-48, 48):
            s.append(f'<path d="M{x-28} 16 Q{x} -22 {x+28} 16" stroke="#fff" stroke-width="13" stroke-linecap="round" fill="none"/>')
    elif exp == 'enojado':
        for x in (-48, 48):
            s.append(eye(x, 30, 32, 0, 8, 11))
        s.append(f'<path d="M-90 -40 L-14 -6 L-14 -60 L-90 -60Z M90 -40 L14 -6 L14 -60 L90 -60Z" fill="{BLK}"/>')
    elif exp == 'sorprendido':
        for x in (-48, 48):
            s.append(eye(x, 38, 50, 0, 2, 9))
    elif exp == 'pensando':
        for x in (-48, 48):
            s.append(eye(x, 32, 40, 12, -10, 12))
        s.append(f'<path d="M-82 -26 Q-50 -36 -20 -30" stroke="#fff" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.9"/>')
    elif exp == 'llorando':
        for x in (-48, 48):
            s.append(eye(x, 34, 40, 0, 10, 12))
            s.append(f'<path d="M{x-8} 44 Q{x-20} 96 {x-10} 132 Q{x+6} 96 {x+6} 44Z" fill="#7FD4FF" stroke="{OUT}" stroke-width="4"/>')
    else:
        for x in (-48, 48):
            s.append(eye(x))
    blush = 0.95 if exp in ('sonrojado', 'sorprendido', 'llorando') else 0.6
    for x in (-74, 74):
        s.append(f'<ellipse cx="{x}" cy="62" rx="22" ry="11" fill="#FF6F8F" opacity="{blush}"/>')
    m = {'normal': '<path d="M-24 76 Q0 94 24 76" stroke="#fff" stroke-width="8" stroke-linecap="round" fill="none"/>',
         'sorprendido': '<ellipse cx="0" cy="88" rx="22" ry="28" fill="#5A1A2A" stroke="#fff" stroke-width="5"/><ellipse cx="0" cy="102" rx="12" ry="7" fill="#FF6F7D"/>',
         'sonrojado': '<path d="M-20 84 q10 -10 20 0 q10 10 20 0" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none"/>',
         'riendo': '<path d="M-38 66 Q0 72 38 66 Q32 118 0 120 Q-32 118 -38 66Z" fill="#5A1A2A" stroke="#fff" stroke-width="5"/><ellipse cx="0" cy="106" rx="16" ry="8" fill="#FF6F7D"/>',
         'llorando': '<path d="M-30 98 Q0 70 30 98" stroke="#fff" stroke-width="8" stroke-linecap="round" fill="none"/>',
         'enojado': '<rect x="-30" y="76" width="60" height="24" rx="8" fill="#fff"/><path d="M-30 88 H30 M-10 76 V100 M10 76 V100" stroke="#16161E" stroke-width="4"/>',
         'pensando': '<path d="M-8 88 Q14 80 30 86" stroke="#fff" stroke-width="8" stroke-linecap="round" fill="none"/>'}[exp]
    s.append(m)
    if exp == 'sorprendido':
        s.append(f'<path d="M108 -40 Q128 -10 116 10 Q100 10 102 -14Z" fill="#7FD4FF" stroke="{OUT}" stroke-width="4"/>')
    if exp == 'sonrojado':
        for x in (-74, 74):
            s.append(''.join(f'<path d="M{x-12+k*12} 56 l-6 12" stroke="#fff" stroke-width="3" opacity="0.7"/>' for k in range(3)))
    if exp == 'pensando':
        s.append(f'<circle cx="150" cy="-150" r="10" fill="#fff" stroke="{OUT}" stroke-width="4"/><circle cx="178" cy="-188" r="16" fill="#fff" stroke="{OUT}" stroke-width="4"/><text x="214" y="-216" font-family="Inter,Arial" font-weight="900" font-size="64" fill="{OUT}">?</text>')
    if exp == 'enojado':
        s.append('<path d="M100 -150 l24 0 m-12 -12 l0 24" stroke="#E8344A" stroke-width="10" stroke-linecap="round"/>')
    return ''.join(s)

def body(pose='normal'):
    s = []
    # piernas de palito
    for x in (-34, 34):
        s.append(f'<path d="M{x} 250 L{x*1.3} 420" stroke="{BLK}" stroke-width="34" stroke-linecap="round"/>')
        s.append(f'<ellipse cx="{x*1.3+(8 if x>0 else -8)}" cy="432" rx="40" ry="20" fill="#fff" stroke="{OUT}" stroke-width="6"/><path d="M{x*1.3-30} 438 H{x*1.3+44}" stroke="{HOOD}" stroke-width="6"/>')
    # brazos
    arm_r = 'M80 120 Q160 100 186 -6' if pose == 'saluda' else 'M84 120 Q124 200 110 266'
    hand_r = (190, -26) if pose == 'saluda' else (110, 280)
    for d, (hx, hy) in ((arm_r, hand_r), ('M-84 120 Q-124 200 -110 266', (-110, 280))):
        s.append(f'<path d="{d}" stroke="{OUT}" stroke-width="58" stroke-linecap="round" fill="none"/><path d="{d}" stroke="{HOOD}" stroke-width="46" stroke-linecap="round" fill="none"/><circle cx="{hx}" cy="{hy}" r="24" fill="{BLK}" stroke="{OUT}" stroke-width="5"/>')
    s.append(f'<path d="M-92 110 Q-106 200 -84 266 L84 266 Q106 200 92 110 Q56 90 0 90 Q-56 90 -92 110Z" fill="{HOOD}" stroke="{OUT}" stroke-width="7"/>')
    s.append(f'<path d="M-70 98 Q0 150 70 98" fill="{HOOD_D}" stroke="{OUT}" stroke-width="6"/><path d="M-84 248 H84" stroke="{HOOD_D}" stroke-width="14"/>')
    s.append('<path d="M-22 120 L-26 180 M22 120 L26 180" stroke="#fff" stroke-width="6" stroke-linecap="round"/><circle cx="-26" cy="184" r="6" fill="#fff"/><circle cx="26" cy="184" r="6" fill="#fff"/>')
    s.append(f'<text x="0" y="222" text-anchor="middle" font-family="Inter,Arial" font-weight="900" font-size="72" fill="#fff" stroke="{OUT}" stroke-width="3">?</text>')
    return ''.join(s)

if __name__ == '__main__':
    import xeno2
    xeno2.head, xeno2.body, xeno2.SKIN, xeno2.HAIR = head, body, SKIN, HAIR
    import runpy, sys, io
    src = open('xeno2.py').read()
    src = src.replace("from xeno2 import", "#").replace('XENO 2.0', 'XENO STICK').replace("(SKIN, '#C98A5A'), (HAIR, '#1B1B24')", "(SKIN, '#16161E'), ('#FF6F8F', '#FF6F8F')").replace('gafas de laboratorio + sudadera naranja', 'stickman · gafas de laboratorio + sudadera naranja')
    g = {'__name__': '__main__'}
    exec(compile(src, 'xeno2', 'exec'), g) if False else None
    # reutiliza el maquetado de la hoja
    ns = {}
    exec(src.split("if __name__ == '__main__':")[0], ns)
    ns['head'], ns['body'], ns['SKIN'], ns['HAIR'] = head, body, SKIN, HAIR
    layout = src.split("if __name__ == '__main__':")[1]
    layout = '\n'.join(l[4:] if l.startswith('    ') else l for l in layout.split('\n'))
    exec(layout, ns)
