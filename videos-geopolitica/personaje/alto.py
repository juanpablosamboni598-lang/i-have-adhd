"""Xeno alto: proporción de stickman alto (cabeza ~1/6.5), piel blanca con sombreado, pelo negro,
sudadera naranja con capucha, jogger oscuro y zapatillas. Mismas funciones que xeno2.py.
Uso: python3 alto.py > hoja_alto.svg"""
OUT, HOOD, HOOD_D, HOOD_L = '#1A1424', '#FF7A1A', '#C9560A', '#FFB070'
SKIN, SKIN_D, HAIR, HAIR_L, PANT, PANT_L = '#FFFFFF', '#DCD8EA', '#14121C', '#4A4466', '#2B2E3D', '#454A60'
BLK = OUT
DEFS = ('<defs>'
        '<radialGradient id="skA" cx="0.38" cy="0.32" r="0.85"><stop offset="0" stop-color="#FFFFFF"/><stop offset="0.65" stop-color="#F6F4FB"/><stop offset="1" stop-color="#D6D1E6"/></radialGradient>'
        '<linearGradient id="hdA" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E8650E"/><stop offset="0.35" stop-color="#FF8A2E"/><stop offset="0.7" stop-color="#FF7A1A"/><stop offset="1" stop-color="#C24F06"/></linearGradient>'
        '<linearGradient id="ptA" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#22253A"/><stop offset="0.45" stop-color="#3A3F58"/><stop offset="1" stop-color="#1C1E2E"/></linearGradient>'
        '<linearGradient id="hrA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E2A44"/><stop offset="1" stop-color="#0E0C16"/></linearGradient>'
        '</defs>')

def head(exp='normal'):
    s = [DEFS]
    # orejas
    for x in (-108, 108):
        s.append(f'<ellipse cx="{x}" cy="14" rx="18" ry="26" fill="url(#skA)" stroke="{OUT}" stroke-width="5"/>')
    # cara
    s.append(f'<path d="M-106 -30 Q-110 64 -54 104 Q0 130 54 104 Q110 64 106 -30 Q96 -118 0 -122 Q-96 -118 -106 -30Z" fill="url(#skA)" stroke="{OUT}" stroke-width="6"/>')
    s.append(f'<path d="M60 -60 Q104 -10 92 50 Q76 92 40 110 Q86 60 70 -20Z" fill="{SKIN_D}" opacity="0.55"/>')
    # pelo: base + mechones + brillo
    s.append(f'<path d="M-118 -10 Q-136 -100 -70 -140 Q-10 -176 56 -156 Q128 -132 124 -20 Q112 -58 96 -64 L104 -26 Q84 -60 70 -72 Q70 -40 54 -36 Q48 -70 30 -86 Q18 -56 -6 -50 Q0 -78 -14 -92 Q-34 -60 -60 -56 Q-52 -80 -60 -92 Q-80 -64 -100 -52 Q-104 -30 -118 -10Z" fill="url(#hrA)" stroke="{OUT}" stroke-width="5"/>')
    s.append(f'<path d="M-30 -150 Q10 -200 60 -186 Q30 -180 22 -150Z M52 -152 Q96 -176 120 -140 Q90 -150 80 -132Z" fill="url(#hrA)" stroke="{OUT}" stroke-width="5"/>')
    s.append(f'<path d="M-80 -118 Q-30 -150 30 -140" stroke="{HAIR_L}" stroke-width="9" fill="none" stroke-linecap="round" opacity="0.9"/><path d="M-60 -104 Q-30 -122 0 -118" stroke="{HAIR_L}" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.6"/>')
    # cejas
    br = {'normal': (0, 0), 'sorprendido': (-16, -4), 'sonrojado': (2, 8), 'riendo': (-8, 0), 'llorando': (4, 14), 'enojado': (10, -18), 'pensando': (-10, 10)}[exp]
    s.append(f'<path d="M-80 {-40+br[0]} Q-56 {-54+br[0]-br[1]} -26 {-44+br[0]+br[1]}" stroke="{HAIR}" stroke-width="10" stroke-linecap="round" fill="none"/>')
    rb = br if exp != 'pensando' else (-20, -6)
    s.append(f'<path d="M26 {-44+rb[0]+rb[1]} Q56 {-54+rb[0]-rb[1]} 80 {-40+rb[0]}" stroke="{HAIR}" stroke-width="10" stroke-linecap="round" fill="none"/>')
    # ojos estilo anime
    def eye(x, s_=1.0, look=0, up=0):
        return (f'<ellipse cx="{x}" cy="4" rx="{28*s_}" ry="{34*s_}" fill="#fff" stroke="{OUT}" stroke-width="4"/>'
                f'<ellipse cx="{x+look}" cy="{8+up}" rx="{19*s_}" ry="{25*s_}" fill="#2E2556"/>'
                f'<ellipse cx="{x+look}" cy="{14+up}" rx="{14*s_}" ry="{14*s_}" fill="#5A4AA0" opacity="0.8"/>'
                f'<ellipse cx="{x+look}" cy="{8+up}" rx="{9*s_}" ry="{12*s_}" fill="#0C0A16"/>'
                f'<circle cx="{x+look-7*s_}" cy="{-2+up}" r="{7*s_}" fill="#fff"/><circle cx="{x+look+7*s_}" cy="{18+up}" r="{3.5*s_}" fill="#fff"/>'
                f'<path d="M{x-30*s_} {-6} Q{x} {-40*s_} {x+32*s_} {-8}" stroke="{OUT}" stroke-width="8" fill="none" stroke-linecap="round"/>')
    if exp == 'riendo':
        for x in (-52, 52):
            s.append(f'<path d="M{x-26} 10 Q{x} -18 {x+26} 10" stroke="{OUT}" stroke-width="9" stroke-linecap="round" fill="none"/>')
    elif exp == 'sorprendido':
        for x in (-52, 52):
            s.append(f'<ellipse cx="{x}" cy="4" rx="30" ry="38" fill="#fff" stroke="{OUT}" stroke-width="5"/><ellipse cx="{x}" cy="6" rx="9" ry="11" fill="#2E2556"/><circle cx="{x-3}" cy="2" r="3" fill="#fff"/>')
    elif exp == 'enojado':
        for x in (-52, 52):
            s.append(eye(x, 0.9))
        s.append(f'<path d="M-90 -30 L-20 -2 L-20 -50 L-90 -50Z M90 -30 L20 -2 L20 -50 L90 -50Z" fill="url(#skA)"/>')
        s.append(f'<path d="M-84 -26 L-22 0 M84 -26 L22 0" stroke="{OUT}" stroke-width="7" stroke-linecap="round"/>')
    elif exp == 'pensando':
        for x in (-52, 52):
            s.append(eye(x, 0.95, 8, -8))
    else:
        for x in (-52, 52):
            s.append(eye(x, 1.04 if exp in ('sonrojado', 'llorando') else 1.0))
    if exp == 'llorando':
        for x in (-52, 52):
            s.append(f'<path d="M{x-6} 36 Q{x-16} 84 {x-8} 118 Q{x+6} 84 {x+4} 36Z" fill="#8FD8FF" stroke="{OUT}" stroke-width="3"/>')
    blush = 0.95 if exp in ('sonrojado', 'sorprendido', 'llorando') else 0.5
    for x in (-66, 66):
        s.append(f'<ellipse cx="{x}" cy="50" rx="22" ry="11" fill="#FF7E93" opacity="{blush}"/>')
        if exp in ('sonrojado', 'sorprendido'):
            s.append(''.join(f'<path d="M{x-12+k*11} 44 l-5 11" stroke="#E04868" stroke-width="3"/>' for k in range(3)))
    # nariz
    s.append(f'<path d="M4 44 q6 8 -2 12" stroke="{SKIN_D}" stroke-width="4" fill="none" stroke-linecap="round"/>')
    m = {'normal': f'<path d="M-22 74 Q0 88 22 74" stroke="{OUT}" stroke-width="6" stroke-linecap="round" fill="none"/>',
         'sorprendido': f'<path d="M-18 70 Q0 62 18 70 Q24 106 0 110 Q-24 106 -18 70Z" fill="#5A1A2A" stroke="{OUT}" stroke-width="5"/><ellipse cx="0" cy="98" rx="11" ry="7" fill="#FF7E93"/>',
         'sonrojado': f'<path d="M-16 78 q8 -8 16 0 q8 8 16 0" stroke="{OUT}" stroke-width="5" stroke-linecap="round" fill="none"/>',
         'riendo': f'<path d="M-34 64 Q0 70 34 64 Q28 108 0 110 Q-28 108 -34 64Z" fill="#5A1A2A" stroke="{OUT}" stroke-width="5"/><path d="M-30 66 Q0 72 30 66 L28 76 Q0 82 -28 76Z" fill="#fff"/><ellipse cx="0" cy="98" rx="14" ry="7" fill="#FF7E93"/>',
         'llorando': f'<path d="M-28 90 Q0 66 28 90 Q0 80 -28 90Z" fill="#5A1A2A" stroke="{OUT}" stroke-width="5"/>',
         'enojado': f'<path d="M-26 84 Q0 70 26 84" stroke="{OUT}" stroke-width="6" stroke-linecap="round" fill="none"/>',
         'pensando': f'<path d="M-8 80 Q12 74 26 78" stroke="{OUT}" stroke-width="6" stroke-linecap="round" fill="none"/>'}[exp]
    s.append(m)
    if exp == 'sorprendido':
        s.append(f'<path d="M98 -66 Q116 -38 104 -20 Q88 -20 90 -42Z" fill="#8FD8FF" stroke="{OUT}" stroke-width="3"/>')
    if exp == 'pensando':
        s.append(f'<circle cx="150" cy="-150" r="10" fill="#fff" stroke="{OUT}" stroke-width="4"/><circle cx="178" cy="-188" r="16" fill="#fff" stroke="{OUT}" stroke-width="4"/><text x="214" y="-216" font-family="Inter,Arial" font-weight="900" font-size="64" fill="{OUT}">?</text>')
    if exp == 'enojado':
        s.append('<path d="M104 -150 l26 0 m-13 -13 l0 26" stroke="#E8344A" stroke-width="10" stroke-linecap="round"/>')
    return ''.join(s)

def limb(d, w, fill, out=OUT, hl=None):
    s = f'<path d="{d}" stroke="{out}" stroke-width="{w+12}" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="{d}" stroke="{fill}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
    if hl:
        s += f'<path d="{d}" stroke="{hl}" stroke-width="{w*0.22}" stroke-linecap="round" fill="none" opacity="0.55" transform="translate({-w*0.22} 0)"/>'
    return s

def hand(x, y):
    return f'<ellipse cx="{x}" cy="{y}" rx="22" ry="25" fill="url(#skA)" stroke="{OUT}" stroke-width="5"/>'

def body(pose='normal'):
    s = [DEFS]
    # piernas (jogger) + zapatillas
    for d, fx in (('M-22 440 L-64 800', -70), ('M22 440 L64 800', 70)):
        s.append(limb(d, 50, 'url(#ptA)', hl=PANT_L))
        s.append(f'<path d="M{fx-44} 826 Q{fx-46} 790 {fx} 788 Q{fx+52} 792 {fx+56} 828Z" fill="#F4F4FA" stroke="{OUT}" stroke-width="5"/><path d="M{fx-44} 818 H{fx+56}" stroke="{HOOD}" stroke-width="7"/><path d="M{fx-38} 828 H{fx+52}" stroke="#C9C6D8" stroke-width="6"/>')
        s.append(f'<path d="M{fx-26} 788 h52" stroke="#2B2E3D" stroke-width="10" stroke-linecap="round"/>')
    # brazos
    if pose == 'saluda':
        ra, rh = 'M70 150 Q150 140 168 60 Q176 0 168 -40', (168, -62)
    elif pose == 'abraza':
        ra, rh = 'M70 150 Q190 120 300 220', (312, 228)
    else:
        ra, rh = 'M72 150 Q112 260 96 400', (96, 418)
    la, lh = (('M-70 150 Q100 300 310 330', (322, 332)) if pose == 'abraza' else ('M-72 150 Q-118 250 -84 360 Q-70 386 -40 400', (-36, 404)))
    # torso sudadera
    s.append(f'<path d="M-62 100 Q0 70 62 100 L66 130 Q0 112 -66 130Z" fill="{HOOD_D}" stroke="{OUT}" stroke-width="5"/>')
    s.append(f'<path d="M-80 124 Q-92 280 -76 450 L76 450 Q92 280 80 124 Q46 106 0 106 Q-46 106 -80 124Z" fill="url(#hdA)" stroke="{OUT}" stroke-width="6"/>')
    s.append(f'<path d="M-76 420 H76 L74 452 H-74Z" fill="{HOOD_D}" stroke="{OUT}" stroke-width="5"/>')
    s.append(f'<path d="M-50 330 H50 L44 390 H-44Z" fill="{HOOD_D}" opacity="0.5"/><path d="M-40 330 Q0 320 40 330" stroke="{HOOD_L}" stroke-width="4" fill="none" opacity="0.6"/>')
    s.append(f'<path d="M-60 200 Q-40 260 -54 320" stroke="{HOOD_D}" stroke-width="5" fill="none" opacity="0.6"/><path d="M48 180 Q62 240 50 300" stroke="{HOOD_L}" stroke-width="6" fill="none" opacity="0.5"/>')
    s.append(f'<path d="M-16 126 L-20 196 M16 126 L20 196" stroke="#fff" stroke-width="5" stroke-linecap="round"/><path d="M-22 196 l0 14 M22 196 l0 14" stroke="#C9C6D8" stroke-width="7" stroke-linecap="round"/>')
    s.append(f'<text x="0" y="292" text-anchor="middle" font-family="Inter,Arial" font-weight="900" font-size="66" fill="#fff" stroke="{OUT}" stroke-width="3">?</text>')
    s.append(f'<path d="M-20 86 L-20 110 L20 110 L20 86Z" fill="url(#skA)"/><path d="M-20 100 Q0 112 20 100" stroke="{SKIN_D}" stroke-width="6" fill="none"/>')
    s.append(limb(ra, 46, 'url(#hdA)', hl=HOOD_L)); s.append(hand(*rh))
    s.append(limb(la, 46, 'url(#hdA)', hl=HOOD_L)); s.append(hand(*lh))
    return ''.join(s)

if __name__ == '__main__':
    src = open('xeno2.py').read()
    ns = {}
    exec(src.split("if __name__ == '__main__':")[0], ns)
    ns['head'], ns['body'] = head, body
    layout = '\n'.join(l[4:] if l.startswith('    ') else l for l in src.split("if __name__ == '__main__':")[1].split('\n'))
    layout = (layout.replace('XENO 2.0', 'XENO').replace('Personaje oficial de jxseng · gafas de laboratorio + sudadera naranja "?"', 'Personaje oficial de jxseng · alto, piel blanca, sudadera naranja con capucha')
              .replace("char(330, 640, 1.25, 'normal'), char(760, 640, 1.25, 'riendo', 'saluda')", "char(330, 380, 0.88, 'normal'), char(760, 380, 0.88, 'riendo', 'saluda')")
              .replace("(SKIN, '#C98A5A'), (HAIR, '#1B1B24')", "('#FFFFFF', '#FFFFFF'), ('#14121C', '#14121C')")
              .replace("(GOG, '#FFD23F')", "('#2B2E3D', '#2B2E3D')").replace("('#9FE3FF', '#9FE3FF')", "('#2E2556', '#2E2556')")
              .replace('face(1260 + (i % 3) * 360, 470 + (i // 3) * 400, 0.78', 'face(1260 + (i % 3) * 360, 470 + (i // 3) * 400, 0.82'))
    exec(layout, ns)
