"""Xeno adulto: silueta negra, proporción 1:6, ojos rasgados con párpado, sudadera naranja con capucha.
Mismas funciones que xeno2.py (head, body). Uso: python3 adulto.py > hoja_adulto.svg"""
BLK, OUT, HOOD, HOOD_D, HOOD_L = '#121218', '#07070A', '#F26A12', '#B94C08', '#FF9A4D'
SKIN = HAIR = BLK

def head(exp='normal'):
    s = ['<defs><radialGradient id="hg" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#3A3A48"/><stop offset="0.5" stop-color="#16161E"/><stop offset="1" stop-color="#07070A"/></radialGradient></defs>',
         # cabeza ovalada + mandíbula
         f'<path d="M-104 -30 Q-108 -128 0 -132 Q108 -128 104 -30 Q100 70 40 112 Q0 132 -40 112 Q-100 70 -104 -30Z" fill="url(#hg)" stroke="{OUT}" stroke-width="5"/>',
         # pelo corto con volumen
         f'<path d="M-108 -36 Q-122 -120 -40 -150 Q30 -176 92 -128 Q124 -96 110 -40 Q96 -84 60 -96 Q70 -70 40 -78 Q10 -112 -30 -96 Q-60 -86 -80 -100 Q-96 -70 -108 -36Z" fill="#0A0A0E" stroke="{OUT}" stroke-width="5"/>',
         '<path d="M-60 -126 Q-10 -150 50 -134" stroke="#4A4A5A" stroke-width="6" fill="none" opacity="0.7"/>']
    # ojos rasgados: almendra blanca, pupila pequeña, párpado superior según emoción
    lid = {'normal': 0.35, 'sorprendido': 0.0, 'sonrojado': 0.45, 'riendo': 1, 'llorando': 0.3, 'enojado': 0.5, 'pensando': 0.4}[exp]
    tilt = {'enojado': 14, 'llorando': -12, 'pensando': -6, 'sonrojado': -4}.get(exp, 0)
    for side in (-1, 1):
        x = 44 * side
        w, h = (34, 26) if exp != 'sorprendido' else (34, 34)
        if exp == 'riendo':
            s.append(f'<path d="M{x-30} 4 Q{x} -18 {x+30} 4" stroke="#fff" stroke-width="9" stroke-linecap="round" fill="none"/>')
            continue
        s.append(f'<g transform="rotate({tilt*side} {x} 0)">'
                 f'<path d="M{x-w} 0 Q{x} {-h*1.3} {x+w} 0 Q{x} {h*1.1} {x-w} 0Z" fill="#F4F4F8"/>'
                 f'<circle cx="{x + (8 if exp == "pensando" else 0)}" cy="{-2 if exp=="pensando" else 2}" r="{9 if exp=="sorprendido" else 11}" fill="{OUT}"/>'
                 f'<circle cx="{x-3}" cy="-3" r="3.5" fill="#fff"/>'
                 f'<path d="M{x-w} 0 Q{x} {-h*1.3} {x+w} 0 Q{x} {-h*1.3 + 2.2*h*lid} {x-w} 0Z" fill="#2A2A36"/>'
                 f'<path d="M{x-w-3} 1 Q{x} {-h*1.32} {x+w+3} 1" stroke="{OUT}" stroke-width="5" fill="none" stroke-linecap="round"/>'
                 '</g>')
        # ceja
        by = {'sorprendido': -58, 'enojado': -36, 'llorando': -44, 'pensando': -50}.get(exp, -46)
        bt = {'enojado': 16, 'llorando': -14, 'pensando': -10 if side < 0 else 8, 'sorprendido': -6}.get(exp, 0)
        s.append(f'<path d="M{x-30*side} {by - bt*0.4} L{x+30*side} {by + bt*0.6}" stroke="#F4F4F8" stroke-width="7" stroke-linecap="round" opacity="0.85" transform="scale({1})"/>')
    if exp == 'llorando':
        for x in (-44, 44):
            s.append(f'<path d="M{x-4} 22 Q{x-12} 64 {x-6} 96 Q{x+6} 64 {x+4} 22Z" fill="#8FD8FF" opacity="0.9"/>')
    if exp == 'sonrojado':
        for x in (-62, 62):
            s.append(f'<ellipse cx="{x}" cy="40" rx="20" ry="8" fill="#FF5E7E" opacity="0.75"/>')
    m = {'normal': '<path d="M-18 70 Q4 80 22 66" stroke="#F4F4F8" stroke-width="6" stroke-linecap="round" fill="none"/>',
         'sorprendido': '<path d="M-16 64 Q0 58 16 64 Q20 96 0 100 Q-20 96 -16 64Z" fill="#3A0F1A" stroke="#F4F4F8" stroke-width="4"/>',
         'sonrojado': '<path d="M-14 72 Q0 66 16 72" stroke="#F4F4F8" stroke-width="5" stroke-linecap="round" fill="none"/>',
         'riendo': '<path d="M-34 58 Q0 64 34 58 Q28 100 0 102 Q-28 100 -34 58Z" fill="#3A0F1A" stroke="#F4F4F8" stroke-width="4"/><path d="M-30 60 Q0 66 30 60 L28 70 Q0 76 -28 70Z" fill="#F4F4F8"/>',
         'llorando': '<path d="M-22 82 Q0 64 22 82" stroke="#F4F4F8" stroke-width="6" stroke-linecap="round" fill="none"/>',
         'enojado': '<path d="M-24 78 Q0 68 24 78" stroke="#F4F4F8" stroke-width="6" stroke-linecap="round" fill="none"/>',
         'pensando': '<path d="M-6 76 Q14 70 28 74" stroke="#F4F4F8" stroke-width="6" stroke-linecap="round" fill="none"/>'}[exp]
    s.append(m)
    if exp == 'sorprendido':
        s.append('<path d="M96 -70 Q112 -44 102 -28 Q88 -28 90 -48Z" fill="#8FD8FF"/>')
    return ''.join(s)

def body(pose='normal'):
    s = []
    # piernas largas
    for x in (-30, 30):
        s.append(f'<path d="M{x*1.1} 300 L{x*1.5} 640" stroke="#1E2230" stroke-width="58" stroke-linecap="round"/>')
        s.append(f'<path d="M{x*1.5-34} 650 Q{x*1.5-30} 620 {x*1.5+10} 622 Q{x*1.5+50} 626 {x*1.5+50} 656Z" fill="#EDEDF2" stroke="{OUT}" stroke-width="5"/>')
    # brazos largos
    arm_r = 'M78 130 Q150 70 160 -40' if pose == 'saluda' else 'M80 130 Q118 250 100 360'
    hr = (162, -58) if pose == 'saluda' else (100, 376)
    for d, (hx, hy) in ((arm_r, hr), ('M-80 130 Q-118 250 -100 360', (-100, 376))):
        s.append(f'<path d="{d}" stroke="{OUT}" stroke-width="50" stroke-linecap="round" fill="none"/><path d="{d}" stroke="{HOOD}" stroke-width="40" stroke-linecap="round" fill="none"/><ellipse cx="{hx}" cy="{hy}" rx="18" ry="22" fill="{BLK}" stroke="{OUT}" stroke-width="4"/>')
    # sudadera larga con capucha detrás del cuello
    s.append(f'<path d="M-70 96 Q0 60 70 96 L60 120 Q0 100 -60 120Z" fill="{HOOD_D}" stroke="{OUT}" stroke-width="5"/>')
    s.append(f'<path d="M-84 116 Q-96 230 -78 316 L78 316 Q96 230 84 116 Q50 100 0 100 Q-50 100 -84 116Z" fill="{HOOD}" stroke="{OUT}" stroke-width="6"/>')
    s.append(f'<path d="M-84 116 Q-96 230 -78 316 L-40 316 Q-60 220 -50 112Z" fill="{HOOD_D}" opacity="0.35"/><path d="M60 120 Q70 200 64 300" stroke="{HOOD_L}" stroke-width="8" opacity="0.5" fill="none"/>')
    s.append(f'<path d="M-50 250 H50 L44 290 H-44Z" fill="{HOOD_D}" opacity="0.55"/><path d="M-78 300 H78" stroke="{HOOD_D}" stroke-width="12"/>')
    s.append('<path d="M-16 120 L-18 176 M16 120 L18 176" stroke="#F4F4F8" stroke-width="5" stroke-linecap="round"/>')
    s.append(f'<text x="0" y="230" text-anchor="middle" font-family="Inter,Arial" font-weight="900" font-size="50" fill="#F4F4F8" opacity="0.95">?</text>')
    s.append(f'<rect x="-18" y="84" width="36" height="24" fill="{BLK}"/>')
    return ''.join(s)

if __name__ == '__main__':
    src = open('xeno2.py').read()
    ns = {}
    exec(src.split("if __name__ == '__main__':")[0], ns)
    ns['head'], ns['body'] = head, body
    layout = '\n'.join(l[4:] if l.startswith('    ') else l for l in src.split("if __name__ == '__main__':")[1].split('\n'))
    layout = (layout.replace('XENO 2.0', 'XENO').replace('Personaje oficial de jxseng · gafas de laboratorio + sudadera naranja "?"', 'Personaje oficial de jxseng · silueta adulta + sudadera naranja con capucha')
              .replace("char(330, 640, 1.25, 'normal'), char(760, 640, 1.25, 'riendo', 'saluda')", "char(330, 520, 1.0, 'normal'), char(760, 520, 1.0, 'riendo', 'saluda')")
              .replace("(SKIN, '#C98A5A'), (HAIR, '#1B1B24')", "('#121218', '#121218'), ('#1E2230', '#1E2230')")
              .replace("(GOG, '#FFD23F')", "('#B94C08', '#B94C08')").replace("('#9FE3FF', '#9FE3FF')", "('#F4F4F8', '#F4F4F8')")
              .replace('face(1260 + (i % 3) * 360, 470 + (i // 3) * 400, 0.78', 'face(1260 + (i % 3) * 360, 470 + (i // 3) * 400, 0.9'))
    exec(layout, ns)
