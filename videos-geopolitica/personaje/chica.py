"""Sofía (la crush): mismo estilo que Xeno v2. Pelo largo castaño chocolate ondulado con pinza de estrella amarilla,
cárdigan lila sobre camiseta blanca, jeans y zapatillas. Mismas funciones (head, body). Uso: python3 chica.py > hoja_chica.svg"""
from alto2 import DEFS, limb, OUT, SKIN_D
HAIR_C, HAIR_CL, CARD, CARD_D, CARD_L = '#4A2A1E', '#9A5E44', '#B79CFF', '#7E62D6', '#DCCEFF'
HOOD = CARD
EXTRA = ('<defs><linearGradient id="hcB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6A3C2A"/><stop offset="1" stop-color="#2A160E"/></linearGradient>'
         '<linearGradient id="cdB" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9A80F0"/><stop offset="0.4" stop-color="#C6AEFF"/><stop offset="1" stop-color="#7A5ED0"/></linearGradient>'
         '<linearGradient id="jnB" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3C5A92"/><stop offset="0.45" stop-color="#5A7CC0"/><stop offset="1" stop-color="#34507F"/></linearGradient></defs>')

def back_hair():
    return (f'<path d="M-118 -60 Q-150 120 -120 330 Q-100 380 -60 360 Q-80 300 -70 200 L70 200 Q80 300 60 360 Q100 380 120 330 Q150 120 118 -60Z" fill="url(#hcB)" stroke="{OUT}" stroke-width="5"/>'
            f'<path d="M-110 120 q-14 60 0 120 M110 120 q14 60 0 120 M-96 220 q-10 50 6 100" stroke="{HAIR_CL}" stroke-width="5" fill="none" opacity="0.6"/>')

def head(exp='normal'):
    s = [DEFS, EXTRA]
    s.append(f'<path d="M-100 -30 Q-104 60 -50 100 Q0 124 50 100 Q104 60 100 -30 Q92 -114 0 -118 Q-92 -114 -100 -30Z" fill="url(#skA)" stroke="{OUT}" stroke-width="6"/>')
    s.append(f'<path d="M56 -56 Q98 -8 86 48 Q72 86 38 104 Q80 56 64 -18Z" fill="{SKIN_D}" opacity="0.5"/>')
    # flequillo largo de lado + mechones que caen junto a la cara
    s.append(f'<path d="M-112 -10 Q-130 -110 -40 -144 Q40 -168 100 -120 Q128 -84 116 -10 Q104 -60 84 -78 Q60 -40 20 -36 Q50 -70 44 -96 Q0 -50 -50 -46 Q-20 -70 -24 -92 Q-60 -60 -92 -50 Q-100 -30 -112 -10Z" fill="url(#hcB)" stroke="{OUT}" stroke-width="5" stroke-linejoin="round"/>')
    s.append(f'<path d="M-112 -20 Q-128 60 -110 130 Q-96 90 -92 40 Q-90 0 -96 -30Z M112 -20 Q128 60 110 130 Q96 90 92 40 Q90 0 96 -30Z" fill="url(#hcB)" stroke="{OUT}" stroke-width="5"/>')
    s.append(f'<path d="M-70 -122 Q-10 -150 50 -134" stroke="{HAIR_CL}" stroke-width="9" fill="none" stroke-linecap="round" opacity="0.85"/>')
    # pinza estrella
    s.append(f'<g transform="translate(78 -92) rotate(15)"><path d="M0 -22 L6 -7 L22 -7 L9 3 L14 19 L0 9 L-14 19 L-9 3 L-22 -7 L-6 -7Z" fill="#FFD23F" stroke="{OUT}" stroke-width="4"/></g>')
    # cejas finas
    br = {'normal': (0, 0), 'sorprendido': (-14, -4), 'sonrojado': (2, 8), 'riendo': (-6, 0), 'llorando': (4, 12), 'enojado': (8, -16), 'pensando': (-10, 8)}[exp]
    s.append(f'<path d="M-76 {-38+br[0]} Q-54 {-48+br[0]-br[1]} -28 {-40+br[0]+br[1]}" stroke="{HAIR_C}" stroke-width="6" stroke-linecap="round" fill="none"/>')
    s.append(f'<path d="M28 {-40+br[0]+br[1]} Q54 {-48+br[0]-br[1]} 76 {-38+br[0]}" stroke="{HAIR_C}" stroke-width="6" stroke-linecap="round" fill="none"/>')
    def eye(x, s_=1.0, look=0, up=0):
        side = -1 if x < 0 else 1
        return (f'<ellipse cx="{x}" cy="6" rx="{27*s_}" ry="{33*s_}" fill="#fff" stroke="{OUT}" stroke-width="4"/>'
                f'<ellipse cx="{x+look}" cy="{10+up}" rx="{19*s_}" ry="{25*s_}" fill="#5A3A20"/>'
                f'<ellipse cx="{x+look}" cy="{16+up}" rx="{14*s_}" ry="{13*s_}" fill="#B07A3A" opacity="0.8"/>'
                f'<ellipse cx="{x+look}" cy="{10+up}" rx="{9*s_}" ry="{12*s_}" fill="#140C08"/>'
                f'<circle cx="{x+look-7*s_}" cy="{0+up}" r="{7*s_}" fill="#fff"/><circle cx="{x+look+7*s_}" cy="{20+up}" r="{3.5*s_}" fill="#fff"/>'
                f'<path d="M{x-30*s_} -4 Q{x} {-38*s_} {x+31*s_} -6" stroke="{OUT}" stroke-width="9" fill="none" stroke-linecap="round"/>'
                f'<path d="M{x+side*28*s_} -6 l{side*12} -10 M{x+side*22*s_} -14 l{side*10} -12" stroke="{OUT}" stroke-width="5" stroke-linecap="round"/>')
    if exp == 'riendo':
        for x in (-50, 50):
            s.append(f'<path d="M{x-24} 12 Q{x} -14 {x+24} 12" stroke="{OUT}" stroke-width="8" stroke-linecap="round" fill="none"/><path d="M{x+(-1 if x<0 else 1)*22} 4 l{(-1 if x<0 else 1)*10} -8" stroke="{OUT}" stroke-width="5" stroke-linecap="round"/>')
    elif exp == 'sorprendido':
        for x in (-50, 50):
            s.append(f'<ellipse cx="{x}" cy="6" rx="28" ry="36" fill="#fff" stroke="{OUT}" stroke-width="5"/><ellipse cx="{x}" cy="8" rx="9" ry="11" fill="#5A3A20"/><circle cx="{x-3}" cy="4" r="3" fill="#fff"/>')
    elif exp == 'enojado':
        for x in (-50, 50): s.append(eye(x, 0.9))
        s.append(f'<path d="M-86 -28 L-20 0 L-20 -48 L-86 -48Z M86 -28 L20 0 L20 -48 L86 -48Z" fill="url(#skA)"/><path d="M-80 -24 L-22 2 M80 -24 L22 2" stroke="{OUT}" stroke-width="7" stroke-linecap="round"/>')
    elif exp == 'pensando':
        for x in (-50, 50): s.append(eye(x, 0.95, -8, -8))
    else:
        for x in (-50, 50): s.append(eye(x, 1.04 if exp in ('sonrojado', 'llorando') else 1.0))
    if exp == 'llorando':
        for x in (-50, 50):
            s.append(f'<path d="M{x-6} 38 Q{x-16} 84 {x-8} 116 Q{x+6} 84 {x+4} 38Z" fill="#8FD8FF" stroke="{OUT}" stroke-width="3"/>')
    blush = 0.95 if exp in ('sonrojado', 'sorprendido', 'riendo') else 0.55
    for x in (-62, 62):
        s.append(f'<ellipse cx="{x}" cy="50" rx="20" ry="10" fill="#FF7E93" opacity="{blush}"/>')
        if exp == 'sonrojado':
            s.append(''.join(f'<path d="M{x-11+k*10} 45 l-5 10" stroke="#E04868" stroke-width="3"/>' for k in range(3)))
    m = {'normal': f'<path d="M-18 72 Q0 84 18 72" stroke="{OUT}" stroke-width="5" stroke-linecap="round" fill="none"/>',
         'sorprendido': f'<ellipse cx="0" cy="80" rx="13" ry="17" fill="#5A1A2A" stroke="{OUT}" stroke-width="4"/>',
         'sonrojado': f'<path d="M-12 76 Q0 82 12 76" stroke="{OUT}" stroke-width="5" stroke-linecap="round" fill="none"/>',
         'riendo': f'<path d="M-28 64 Q0 70 28 64 Q22 100 0 102 Q-22 100 -28 64Z" fill="#5A1A2A" stroke="{OUT}" stroke-width="4"/><path d="M-24 66 Q0 72 24 66 L22 74 Q0 79 -22 74Z" fill="#fff"/><ellipse cx="0" cy="92" rx="11" ry="6" fill="#FF7E93"/>',
         'llorando': f'<path d="M-22 86 Q0 68 22 86" stroke="{OUT}" stroke-width="5" stroke-linecap="round" fill="none"/>',
         'enojado': f'<path d="M-20 82 Q0 72 20 82" stroke="{OUT}" stroke-width="5" stroke-linecap="round" fill="none"/>',
         'pensando': f'<path d="M-20 76 Q-6 72 8 76" stroke="{OUT}" stroke-width="5" stroke-linecap="round" fill="none"/>'}[exp]
    s.append(m)
    if exp == 'sonrojado':
        s.append(f'<path d="M110 -150 C96 -168 76 -150 110 -126 C144 -150 124 -168 110 -150Z" fill="#FF4F7B" stroke="{OUT}" stroke-width="4"/>')
    if exp == 'pensando':
        s.append(f'<circle cx="-150" cy="-150" r="10" fill="#fff" stroke="{OUT}" stroke-width="4"/><circle cx="-178" cy="-188" r="16" fill="#fff" stroke="{OUT}" stroke-width="4"/><text x="-232" y="-216" font-family="Inter,Arial" font-weight="900" font-size="64" fill="{OUT}">?</text>')
    if exp == 'enojado':
        s.append('<path d="M110 -150 l26 0 m-13 -13 l0 26" stroke="#E8344A" stroke-width="10" stroke-linecap="round"/>')
    return ''.join(s)

def hand(x, y):
    return f'<ellipse cx="{x}" cy="{y}" rx="19" ry="22" fill="url(#skA)" stroke="{OUT}" stroke-width="5"/>'

def body(pose='normal'):
    s = [DEFS, EXTRA, f'<g transform="translate(0 -40)">{back_hair()}</g>']
    for d, fx in (('M-20 430 L-52 790', -56), ('M20 430 L52 790', 56)):
        s.append(limb(d, 46, 'url(#jnB)', hl='#8AA8E0'))
        s.append(f'<path d="M{fx-40} 816 Q{fx-42} 782 {fx} 780 Q{fx+48} 784 {fx+50} 818Z" fill="#F4F4FA" stroke="{OUT}" stroke-width="5"/><path d="M{fx-40} 808 H{fx+50}" stroke="{CARD_D}" stroke-width="6"/>')
    if pose == 'saluda':
        ra, rh = 'M64 150 Q140 140 156 60 Q162 10 156 -30', (156, -50)
    elif pose == 'manos':  # manos juntas al frente (tímida)
        ra, rh = 'M64 150 Q96 250 20 330', (14, 336)
    else:
        ra, rh = 'M66 150 Q102 260 88 390', (88, 408)
    la, lh = ('M-64 150 Q-96 250 -20 330', (-14, 336)) if pose == 'manos' else ('M-66 150 Q-102 260 -88 390', (-88, 408))
    # camiseta blanca + cárdigan abierto
    s.append(f'<path d="M-72 120 Q-82 280 -68 440 L68 440 Q82 280 72 120 Q40 104 0 104 Q-40 104 -72 120Z" fill="#FAFAFE" stroke="{OUT}" stroke-width="6"/>')
    s.append(f'<path d="M-28 106 Q0 128 28 106" stroke="{OUT}" stroke-width="5" fill="none"/>')
    s.append(f'<path d="M-74 118 Q-86 280 -72 444 L-26 444 Q-34 300 -24 110Z" fill="url(#cdB)" stroke="{OUT}" stroke-width="5"/><path d="M74 118 Q86 280 72 444 L26 444 Q34 300 24 110Z" fill="url(#cdB)" stroke="{OUT}" stroke-width="5"/>')
    s.append(''.join(f'<circle cx="-30" cy="{200+k*70}" r="7" fill="#FFD23F" stroke="{OUT}" stroke-width="3"/>' for k in range(3)))
    s.append(f'<path d="M-72 424 H-26 M26 424 H72" stroke="{CARD_D}" stroke-width="10"/>')
    s.append(f'<path d="M-18 86 L-18 108 L18 108 L18 86Z" fill="url(#skA)"/>')
    s.append(limb(la, 40, 'url(#cdB)', hl=CARD_L)); s.append(hand(*lh))
    s.append(limb(ra, 40, 'url(#cdB)', hl=CARD_L)); s.append(hand(*rh))
    return ''.join(s)

if __name__ == '__main__':
    src = open('xeno2.py').read()
    ns = {}
    exec(src.split("if __name__ == '__main__':")[0], ns)
    ns['head'], ns['body'] = head, body
    layout = '\n'.join(l[4:] if l.startswith('    ') else l for l in src.split("if __name__ == '__main__':")[1].split('\n'))
    layout = (layout.replace('XENO 2.0', 'SOFÍA (LA CRUSH)').replace('Personaje oficial de jxseng · gafas de laboratorio + sudadera naranja "?"', 'Personaje de jxseng · pelo largo con pinza de estrella + cárdigan lila')
              .replace("char(330, 640, 1.25, 'normal'), char(760, 640, 1.25, 'riendo', 'saluda')", "char(330, 400, 0.86, 'normal'), char(760, 400, 0.86, 'sonrojado', 'manos')")
              .replace("(HOOD, '#FF7A1A'), (GOG, '#FFD23F'), (SKIN, '#C98A5A'), (HAIR, '#1B1B24'), ('#9FE3FF', '#9FE3FF')", "('#B79CFF', '#B79CFF'), ('#FFD23F', '#FFD23F'), ('#4A2A1E', '#4A2A1E'), ('#5A7CC0', '#5A7CC0'), ('#FAFAFE', '#FAFAFE')")
              .replace('>SALUDO<', '>TÍMIDA<')
              .replace('face(1260 + (i % 3) * 360, 470 + (i // 3) * 400, 0.78', 'face(1260 + (i % 3) * 360, 470 + (i // 3) * 400, 0.82'))
    exec(layout, ns)
