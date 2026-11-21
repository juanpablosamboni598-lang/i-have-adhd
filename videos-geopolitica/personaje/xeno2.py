"""Genera la hoja de personaje de Xeno 2.0 (SVG). Uso: python3 xeno2.py > hoja.svg"""
SKIN, SKIN_D, HAIR, HOOD, HOOD_D, GOG, OUT = '#C98A5A', '#A86E44', '#1B1B24', '#FF7A1A', '#D85F0A', '#FFD23F', '#1A1220'

def head(exp='normal'):
    s = []
    # orejas
    s.append(f'<ellipse cx="-118" cy="10" rx="20" ry="28" fill="{SKIN}" stroke="{OUT}" stroke-width="6"/>')
    s.append(f'<ellipse cx="118" cy="10" rx="20" ry="28" fill="{SKIN}" stroke="{OUT}" stroke-width="6"/>')
    # cara
    s.append(f'<path d="M-112 -40 Q-118 70 -60 108 Q0 140 60 108 Q118 70 112 -40 Q100 -120 0 -124 Q-100 -120 -112 -40Z" fill="{SKIN}" stroke="{OUT}" stroke-width="7"/>')
    # pelo
    s.append(f'<path d="M-122 -20 Q-140 -110 -60 -142 Q-10 -172 50 -150 Q120 -140 128 -40 Q110 -70 96 -66 Q100 -96 70 -100 Q40 -80 0 -92 Q-40 -76 -70 -96 Q-90 -70 -100 -60 Q-112 -50 -122 -20Z" fill="{HAIR}" stroke="{OUT}" stroke-width="6"/>')
    s.append(f'<path d="M10 -150 Q30 -210 70 -200 Q40 -190 38 -150Z" fill="{HAIR}" stroke="{OUT}" stroke-width="6"/>')
    # gafas de laboratorio en la frente
    s.append(f'<path d="M-124 -70 Q0 -96 124 -70" stroke="#3A3A48" stroke-width="16" fill="none"/>')
    for x in (-50, 50):
        s.append(f'<rect x="{x-44}" y="-112" width="88" height="58" rx="26" fill="{GOG}" stroke="{OUT}" stroke-width="6"/>')
        s.append(f'<rect x="{x-32}" y="-102" width="64" height="38" rx="18" fill="#9FE3FF" stroke="{OUT}" stroke-width="4"/>')
        s.append(f'<path d="M{x-22} -96 l18 0" stroke="#fff" stroke-width="7" stroke-linecap="round"/>')
    s.append(f'<rect x="-8" y="-92" width="16" height="16" rx="4" fill="{GOG}" stroke="{OUT}" stroke-width="4"/>')
    # rubor
    blush = 0.9 if exp in ('sonrojado', 'sorprendido', 'llorando') else 0.45
    for x in (-66, 66):
        s.append(f'<ellipse cx="{x}" cy="52" rx="22" ry="12" fill="#FF6F7D" opacity="{blush}"/>')
        if exp == 'sonrojado':
            for k in range(3):
                s.append(f'<path d="M{x-14+k*12} 46 l-6 12" stroke="#E04858" stroke-width="3"/>')
    # cejas
    br = {'normal': (-8, 0), 'sorprendido': (-22, 0), 'sonrojado': (-6, 6), 'riendo': (-14, 0),
          'llorando': (-4, 12), 'enojado': (6, -16), 'pensando': (-16, 10)}[exp]
    s.append(f'<path d="M-82 {-30+br[0]} Q-56 {-46+br[0]-br[1]} -28 {-34+br[0]+br[1]}" stroke="{OUT}" stroke-width="12" stroke-linecap="round" fill="none"/>')
    rb = br if exp != 'pensando' else (-26, -4)
    s.append(f'<path d="M28 {-34+rb[0]+rb[1]} Q56 {-46+rb[0]-rb[1]} 82 {-30+rb[0]}" stroke="{OUT}" stroke-width="12" stroke-linecap="round" fill="none"/>')
    # ojos
    def eye(x, pupil=1.0, look=0):
        return (f'<ellipse cx="{x}" cy="6" rx="30" ry="36" fill="#fff" stroke="{OUT}" stroke-width="6"/>'
                f'<ellipse cx="{x+look}" cy="10" rx="{18*pupil}" ry="{22*pupil}" fill="#B9772E"/>'
                f'<ellipse cx="{x+look}" cy="12" rx="{10*pupil}" ry="{13*pupil}" fill="{OUT}"/>'
                f'<circle cx="{x+look-7*pupil}" cy="{2}" r="{7*pupil}" fill="#fff"/>'
                f'<circle cx="{x+look+8*pupil}" cy="{22}" r="{3.5*pupil}" fill="#fff"/>')
    if exp == 'riendo':
        for x in (-55, 55):
            s.append(f'<path d="M{x-26} 14 Q{x} -16 {x+26} 14" stroke="{OUT}" stroke-width="10" stroke-linecap="round" fill="none"/>')
    elif exp == 'enojado':
        for x in (-55, 55):
            s.append(eye(x, 0.8))
        s.append(f'<path d="M-90 -14 L-24 4 L-24 -40 L-90 -40Z M90 -14 L24 4 L24 -40 L90 -40Z" fill="{SKIN}"/>')
    elif exp == 'sorprendido':
        for x in (-55, 55):
            s.append(f'<ellipse cx="{x}" cy="6" rx="34" ry="40" fill="#fff" stroke="{OUT}" stroke-width="6"/><circle cx="{x}" cy="8" r="9" fill="{OUT}"/>')
    elif exp == 'pensando':
        for x in (-55, 55):
            s.append(eye(x, 0.95, look=10))
            s[-1] = s[-1].replace('cy="10"', 'cy="-2"', 1)
    else:
        for x in (-55, 55):
            s.append(eye(x, 1.05 if exp in ('sonrojado', 'llorando') else 1.0))
    if exp == 'llorando':
        for x in (-55, 55):
            s.append(f'<path d="M{x-6} 40 Q{x-18} 90 {x-10} 130 Q{x+4} 90 {x+6} 40Z" fill="#7FD4FF" stroke="{OUT}" stroke-width="4"/>')
    # boca
    m = {
        'normal': f'<path d="M-26 72 Q0 92 26 72" stroke="{OUT}" stroke-width="8" stroke-linecap="round" fill="none"/>',
        'sorprendido': f'<ellipse cx="0" cy="84" rx="24" ry="30" fill="#5A1A2A" stroke="{OUT}" stroke-width="7"/><ellipse cx="0" cy="98" rx="14" ry="9" fill="#FF6F7D"/>',
        'sonrojado': f'<path d="M-20 80 q10 -10 20 0 q10 10 20 0" stroke="{OUT}" stroke-width="7" stroke-linecap="round" fill="none"/>',
        'riendo': f'<path d="M-40 64 Q0 70 40 64 Q34 120 0 122 Q-34 120 -40 64Z" fill="#5A1A2A" stroke="{OUT}" stroke-width="7"/><path d="M-36 66 Q0 72 36 66 L34 78 Q0 84 -34 78Z" fill="#fff"/><ellipse cx="0" cy="108" rx="18" ry="9" fill="#FF6F7D"/>',
        'llorando': f'<path d="M-34 96 Q0 64 34 96 Q0 84 -34 96Z" fill="#5A1A2A" stroke="{OUT}" stroke-width="7"/>',
        'enojado': f'<rect x="-34" y="72" width="68" height="28" rx="10" fill="#fff" stroke="{OUT}" stroke-width="7"/><path d="M-34 86 H34 M-12 72 V100 M12 72 V100" stroke="{OUT}" stroke-width="4"/>',
        'pensando': f'<path d="M-10 84 Q14 76 30 82" stroke="{OUT}" stroke-width="8" stroke-linecap="round" fill="none"/>',
    }[exp]
    s.append(m)
    if exp == 'sorprendido':
        s.append(f'<path d="M104 -60 Q124 -30 112 -10 Q96 -10 98 -34Z" fill="#7FD4FF" stroke="{OUT}" stroke-width="4"/>')
        for k, (a, b) in enumerate([(-150, -150), (-170, -110), (-130, -180)]):
            s.append(f'<path d="M{a} {b} l-24 -22" stroke="#E8344A" stroke-width="12" stroke-linecap="round"/>')
    if exp == 'pensando':
        s.append(f'<circle cx="150" cy="-150" r="10" fill="#fff" stroke="{OUT}" stroke-width="4"/><circle cx="178" cy="-188" r="16" fill="#fff" stroke="{OUT}" stroke-width="4"/><text x="214" y="-216" font-family="Inter,Arial" font-weight="900" font-size="64" fill="{OUT}">?</text>')
    if exp == 'enojado':
        s.append(f'<path d="M96 -150 l24 0 l-12 -12 m12 12 l-12 12 M120 -126 l0 24" stroke="#E8344A" stroke-width="9" stroke-linecap="round" fill="none"/>')
    return ''.join(s)

def body(pose='normal'):
    s = []
    # piernas
    s.append(f'<path d="M-62 250 L-70 430 L-20 430 L-8 290 L8 290 L20 430 L70 430 L62 250Z" fill="#3B3F4C" stroke="{OUT}" stroke-width="6"/>')
    for x in (-46, 46):
        s.append(f'<path d="M{x-40} 420 Q{x-44} 456 {x} 456 Q{x+50} 456 {x+44} 430 L{x+28} 420Z" fill="#fff" stroke="{OUT}" stroke-width="6"/><path d="M{x-40} 444 H{x+44}" stroke="#E04858" stroke-width="5"/>')
    # brazos
    if pose == 'saluda':
        s.append(f'<path d="M84 120 Q170 90 190 -10" stroke="{OUT}" stroke-width="62" stroke-linecap="round" fill="none"/><path d="M84 120 Q170 90 190 -10" stroke="{HOOD}" stroke-width="50" stroke-linecap="round" fill="none"/>')
        s.append(f'<circle cx="192" cy="-30" r="30" fill="{SKIN}" stroke="{OUT}" stroke-width="6"/>')
    else:
        s.append(f'<path d="M86 116 Q130 200 112 262" stroke="{OUT}" stroke-width="62" stroke-linecap="round" fill="none"/><path d="M86 116 Q130 200 112 262" stroke="{HOOD}" stroke-width="50" stroke-linecap="round" fill="none"/><circle cx="112" cy="276" r="26" fill="{SKIN}" stroke="{OUT}" stroke-width="6"/>')
    s.append(f'<path d="M-86 116 Q-130 200 -112 262" stroke="{OUT}" stroke-width="62" stroke-linecap="round" fill="none"/><path d="M-86 116 Q-130 200 -112 262" stroke="{HOOD}" stroke-width="50" stroke-linecap="round" fill="none"/><circle cx="-112" cy="276" r="26" fill="{SKIN}" stroke="{OUT}" stroke-width="6"/>')
    # sudadera
    s.append(f'<path d="M-96 110 Q-110 200 -88 270 L88 270 Q110 200 96 110 Q60 88 0 88 Q-60 88 -96 110Z" fill="{HOOD}" stroke="{OUT}" stroke-width="7"/>')
    s.append(f'<path d="M-70 96 Q0 150 70 96" fill="{HOOD_D}" stroke="{OUT}" stroke-width="6"/>')
    s.append(f'<path d="M-88 250 H88" stroke="{HOOD_D}" stroke-width="14"/>')
    s.append(f'<path d="M-60 214 H60 L50 250 H-50Z" fill="{HOOD_D}" opacity="0.6"/>')
    s.append(f'<path d="M-22 120 L-26 180 M22 120 L26 180" stroke="#fff" stroke-width="6" stroke-linecap="round"/><circle cx="-26" cy="184" r="6" fill="#fff"/><circle cx="26" cy="184" r="6" fill="#fff"/>')
    s.append(f'<text x="0" y="222" text-anchor="middle" font-family="Inter,Arial" font-weight="900" font-size="72" fill="#fff" stroke="{OUT}" stroke-width="3">?</text>')
    # cuello
    s.append(f'<rect x="-26" y="78" width="52" height="30" fill="{SKIN_D}"/>')
    return ''.join(s)

def char(x, y, sc, exp='normal', pose='normal'):
    return f'<g transform="translate({x} {y}) scale({sc})">{body(pose)}<g transform="translate(0 -40)">{head(exp)}</g></g>'

def face(x, y, sc, exp, label):
    return (f'<g transform="translate({x} {y})"><rect x="-150" y="-170" width="300" height="340" rx="28" fill="#fff" stroke="#E6DCEF" stroke-width="4"/>'
            f'<g transform="translate(0 0) scale({sc})">{head(exp)}</g>'
            f'<text x="0" y="150" text-anchor="middle" font-family="Inter,Arial" font-weight="800" font-size="26" fill="#3A2E48">{label}</text></g>')

if __name__ == '__main__':
    W, H = 2400, 1350
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
           '<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF4E6"/><stop offset="1" stop-color="#F3E6FF"/></linearGradient></defs>',
           f'<rect width="{W}" height="{H}" fill="url(#bg)"/>',
           f'<text x="60" y="100" font-family="Inter,Arial" font-weight="900" font-size="72" fill="{OUT}">XENO 2.0</text>',
           f'<text x="60" y="150" font-family="Inter,Arial" font-weight="700" font-size="30" fill="#6A5A7A">Personaje oficial de jxseng · gafas de laboratorio + sudadera naranja "?"</text>',
           char(330, 640, 1.25, 'normal'), char(760, 640, 1.25, 'riendo', 'saluda'),
           '<text x="330" y="1290" text-anchor="middle" font-family="Inter,Arial" font-weight="800" font-size="28" fill="#3A2E48">FRENTE</text>',
           '<text x="760" y="1290" text-anchor="middle" font-family="Inter,Arial" font-weight="800" font-size="28" fill="#3A2E48">SALUDO</text>']
    labels = [('sorprendido', 'SORPRENDIDO'), ('sonrojado', 'SONROJADO'), ('riendo', 'RIENDO'),
              ('llorando', 'LLORANDO'), ('enojado', 'ENOJADO'), ('pensando', 'PENSANDO')]
    for i, (e, l) in enumerate(labels):
        out.append(face(1260 + (i % 3) * 360, 470 + (i // 3) * 400, 0.78, e, l))
    # paleta
    for i, (c, n) in enumerate([(HOOD, '#FF7A1A'), (GOG, '#FFD23F'), (SKIN, '#C98A5A'), (HAIR, '#1B1B24'), ('#9FE3FF', '#9FE3FF')]):
        out.append(f'<circle cx="{1140 + i*230}" cy="1250" r="34" fill="{c}" stroke="{OUT}" stroke-width="4"/><text x="{1186 + i*230}" y="1260" font-family="Inter,Arial" font-weight="700" font-size="24" fill="#3A2E48">{n}</text>')
    out.append('</svg>')
    print(''.join(out))
