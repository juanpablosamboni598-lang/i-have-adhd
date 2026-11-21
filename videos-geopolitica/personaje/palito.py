"""Xeno palito: stickman clásico alto (cabeza 1/6.5), negro, bufanda naranja, cara blanca simple.
Mismas funciones que xeno2.py (head, body). Uso: python3 palito.py > hoja_palito.svg"""
BLK, OUT, HOOD = '#14141A', '#14141A', '#FF7A1A'
SKIN = HAIR = BLK
LW = 46  # grosor de línea

def head(exp='normal'):
    s = [f'<circle r="128" fill="{BLK}"/>']
    W = '#FFFFFF'
    def eye(x, rx=22, ry=30, px=0, py=4, pr=10):
        return f'<ellipse cx="{x}" cy="-6" rx="{rx}" ry="{ry}" fill="{W}"/><circle cx="{x+px}" cy="{-6+py}" r="{pr}" fill="{BLK}"/>'
    if exp == 'riendo':
        for x in (-42, 42):
            s.append(f'<path d="M{x-22} 0 Q{x} -26 {x+22} 0" stroke="{W}" stroke-width="10" stroke-linecap="round" fill="none"/>')
    elif exp == 'sorprendido':
        for x in (-42, 42): s.append(eye(x, 26, 36, 0, 0, 8))
    elif exp == 'pensando':
        for x in (-42, 42): s.append(eye(x, 22, 28, 9, -10, 10))
    elif exp == 'enojado':
        for x in (-42, 42): s.append(eye(x, 22, 24, 0, 4, 10))
        s.append(f'<path d="M-76 -48 L-18 -24 L-18 -60 L-76 -60Z M76 -48 L18 -24 L18 -60 L76 -60Z" fill="{BLK}"/>')
    else:
        for x in (-42, 42): s.append(eye(x))
    if exp == 'llorando':
        for x in (-42, 42):
            s.append(f'<path d="M{x-4} 24 Q{x-12} 64 {x-6} 92 Q{x+6} 64 {x+4} 24Z" fill="#8FD8FF"/>')
    if exp == 'sonrojado':
        for x in (-66, 66):
            s.append(f'<ellipse cx="{x}" cy="34" rx="18" ry="8" fill="#FF5E7E" opacity="0.85"/>')
    m = {'normal': f'<path d="M-22 56 Q0 70 22 56" stroke="{W}" stroke-width="8" stroke-linecap="round" fill="none"/>',
         'sorprendido': f'<ellipse cx="0" cy="66" rx="18" ry="24" fill="{W}"/>',
         'sonrojado': f'<path d="M-16 60 q8 -8 16 0 q8 8 16 0" stroke="{W}" stroke-width="7" stroke-linecap="round" fill="none"/>',
         'riendo': f'<path d="M-32 44 Q0 50 32 44 Q26 86 0 88 Q-26 86 -32 44Z" fill="{W}"/>',
         'llorando': f'<path d="M-24 72 Q0 52 24 72" stroke="{W}" stroke-width="8" stroke-linecap="round" fill="none"/>',
         'enojado': f'<path d="M-24 68 Q0 56 24 68" stroke="{W}" stroke-width="8" stroke-linecap="round" fill="none"/>',
         'pensando': f'<path d="M-6 62 Q14 56 28 60" stroke="{W}" stroke-width="8" stroke-linecap="round" fill="none"/>'}[exp]
    s.append(m)
    if exp == 'sorprendido':
        s.append('<path d="M100 -70 Q118 -42 106 -24 Q90 -24 92 -46Z" fill="#8FD8FF"/>')
    if exp == 'pensando':
        s.append(f'<circle cx="150" cy="-150" r="10" fill="#fff" stroke="{BLK}" stroke-width="4"/><circle cx="178" cy="-188" r="16" fill="#fff" stroke="{BLK}" stroke-width="4"/><text x="214" y="-216" font-family="Inter,Arial" font-weight="900" font-size="64" fill="{BLK}">?</text>')
    return ''.join(s)

def body(pose='normal'):
    L = f'stroke="{BLK}" stroke-width="{LW}" stroke-linecap="round" stroke-linejoin="round" fill="none"'
    s = [f'<path d="M0 80 L4 470" {L}/>',                      # columna
         f'<path d="M4 470 L-80 840 L-118 846" {L}/>',          # pierna izq
         f'<path d="M4 470 L82 840 L120 846" {L}/>']            # pierna der
    if pose == 'saluda':
        s.append(f'<path d="M0 170 Q120 190 150 120 Q168 40 150 -40" {L}/>')
    else:
        s.append(f'<path d="M0 170 Q90 260 70 380 Q64 420 60 430" {L}/>')
    s.append(f'<path d="M0 170 Q-80 230 -70 330 Q-60 360 -20 400" {L}/>')  # mano en la cadera
    # bufanda naranja
    s.append(f'<path d="M-46 112 Q0 140 46 112 L48 140 Q0 168 -48 140Z" fill="{HOOD}" stroke="#B94C08" stroke-width="4"/>')
    s.append(f'<path d="M24 140 L46 250 L18 246 L6 150Z" fill="{HOOD}" stroke="#B94C08" stroke-width="4"/><path d="M28 236 l4 22 M38 234 l6 22" stroke="#B94C08" stroke-width="4"/>')
    return ''.join(s)

if __name__ == '__main__':
    src = open('xeno2.py').read()
    ns = {}
    exec(src.split("if __name__ == '__main__':")[0], ns)
    ns['head'], ns['body'] = head, body
    layout = '\n'.join(l[4:] if l.startswith('    ') else l for l in src.split("if __name__ == '__main__':")[1].split('\n'))
    layout = (layout.replace('XENO 2.0', 'XENO').replace('Personaje oficial de jxseng · gafas de laboratorio + sudadera naranja "?"', 'Personaje oficial de jxseng · stickman clásico + bufanda naranja')
              .replace("char(330, 640, 1.25, 'normal'), char(760, 640, 1.25, 'riendo', 'saluda')", "char(330, 380, 0.84, 'normal'), char(760, 380, 0.84, 'riendo', 'saluda')")
              .replace("(SKIN, '#C98A5A'), (HAIR, '#1B1B24')", "('#14141A', '#14141A'), ('#FFFFFF', '#FFFFFF')")
              .replace("(GOG, '#FFD23F')", "('#B94C08', '#B94C08')").replace("('#9FE3FF', '#9FE3FF')", "('#8FD8FF', '#8FD8FF')")
              .replace('face(1260 + (i % 3) * 360, 470 + (i // 3) * 400, 0.78', 'face(1260 + (i % 3) * 360, 470 + (i // 3) * 400, 0.85'))
    exec(layout, ns)
