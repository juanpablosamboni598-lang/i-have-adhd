"""Miniatura v27 estilo primer plano (Xeno 2.0 + inodoro brillante). Uso: python3 mini_v27.py [texto] > x.svg"""
import sys
import os
if os.environ.get("STICK"): from stick import head, body, HOOD, OUT, SKIN
else: from xeno2 import head, body, HOOD, OUT, SKIN
txt = len(sys.argv) > 1
W, H = 1920, 1080
o = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
 '''<defs>
 <radialGradient id="bg" cx="0.62" cy="0.4" r="0.9"><stop offset="0" stop-color="#FFE7A8"/><stop offset="0.45" stop-color="#F7A94B"/><stop offset="1" stop-color="#7A3A6A"/></radialGradient>
 <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#FFF6C8" stop-opacity="1"/><stop offset="0.6" stop-color="#FFD23F" stop-opacity="0.55"/><stop offset="1" stop-color="#FFD23F" stop-opacity="0"/></radialGradient>
 <linearGradient id="por" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="0.6" stop-color="#E9EEF5"/><stop offset="1" stop-color="#B9C4D4"/></linearGradient>
 <filter id="blur"><feGaussianBlur stdDeviation="10"/></filter>
 <filter id="glow"><feGaussianBlur stdDeviation="18"/></filter>
 <filter id="sh"><feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#2A0E2A" flood-opacity="0.45"/></filter>
 </defs>''',
 f'<rect width="{W}" height="{H}" fill="url(#bg)"/>']
# baño desenfocado: azulejos, espejo, lámpara
bgs = ['<g filter="url(#blur)" opacity="0.55">']
for i in range(14):
    for j in range(6):
        bgs.append(f'<rect x="{i*150-20}" y="{j*150+600}" width="140" height="140" rx="10" fill="#FFFFFF" opacity="0.18"/>')
bgs += ['<rect x="80" y="80" width="360" height="460" rx="40" fill="#BFE8F5" opacity="0.6"/>',
        '<circle cx="260" cy="60" r="70" fill="#FFF3C0"/>', '<rect x="1650" y="120" width="200" height="380" rx="30" fill="#7AC7A0" opacity="0.6"/></g>']
o += bgs
# rayos dorados
rays = ''.join(f'<path d="M1290 470 L{1290+1600*__import__("math").cos(a/10)} {470+1600*__import__("math").sin(a/10)} L{1290+1600*__import__("math").cos(a/10+0.12)} {470+1600*__import__("math").sin(a/10+0.12)}Z" fill="#FFF3B0" opacity="0.22"/>' for a in range(0, 63, 3))
o.append(f'<g>{rays}</g>')
o.append('<circle cx="1290" cy="470" r="560" fill="url(#halo)"/>')
# inodoro grande a la derecha
t = ['<g transform="translate(1330 600) rotate(-6) scale(1.85)" filter="url(#sh)">',
 f'<rect x="-95" y="-230" width="190" height="150" rx="24" fill="url(#por)" stroke="{OUT}" stroke-width="5"/>',
 f'<rect x="-110" y="-245" width="220" height="34" rx="14" fill="#fff" stroke="{OUT}" stroke-width="5"/>',
 f'<rect x="40" y="-200" width="34" height="14" rx="7" fill="#C9D2DE" stroke="{OUT}" stroke-width="4"/>',
 f'<path d="M-150 -70 Q-150 -100 -120 -100 L120 -100 Q150 -100 150 -70 Q150 60 40 110 L40 190 L-40 190 L-40 110 Q-150 60 -150 -70Z" fill="url(#por)" stroke="{OUT}" stroke-width="6"/>',
 f'<ellipse cx="0" cy="-72" rx="128" ry="34" fill="#DDE6F0" stroke="{OUT}" stroke-width="5"/>',
 '<ellipse cx="0" cy="-66" rx="96" ry="20" fill="#8FD8F5"/>',
 '<path d="M-110 -40 Q-118 30 -60 80" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.9"/>',
 f'<rect x="-60" y="186" width="120" height="20" rx="8" fill="#C9D2DE" stroke="{OUT}" stroke-width="5"/></g>']
o += t
# destellos
import math, random
random.seed(4)
def star(x, y, r, c='#FFFFFF'):
    return f'<path d="M{x} {y-r} Q{x} {y} {x+r} {y} Q{x} {y} {x} {y+r} Q{x} {y} {x-r} {y} Q{x} {y} {x} {y-r}Z" fill="{c}"/>'
for k in range(16):
    a = random.uniform(0, 6.28); d = random.uniform(320, 560)
    o.append(star(1290 + d*math.cos(a), 470 + d*math.sin(a)*0.8, random.uniform(14, 34), random.choice(['#FFFFFF', '#FFF3B0', '#FFD23F'])))
# corazón
o.append('<g transform="translate(1640 200) rotate(14) scale(2.2)"><path d="M0 18 C-30 -6 -24 -34 0 -22 C24 -34 30 -6 0 18Z" fill="#FF4F7B" stroke="#1A1220" stroke-width="4"/><circle cx="-10" cy="-16" r="5" fill="#fff" opacity="0.8"/></g>')
# Xeno 2.0 primerísimo plano (cabeza enorme + hombros), mejilla contra el inodoro
o.append(f'<g transform="translate(640 650) rotate(8) scale(3.1)" filter="url(#sh)"><g transform="translate(0 40)">{body()}</g>{head("sorprendido")}</g>')
# mano abrazando el inodoro
o.append(f'<g transform="translate(1000 760) rotate(-20)"><path d="M-160 60 Q-40 40 40 -10" stroke="{OUT}" stroke-width="130" stroke-linecap="round" fill="none"/><path d="M-160 60 Q-40 40 40 -10" stroke="{HOOD}" stroke-width="112" stroke-linecap="round" fill="none"/><ellipse cx="70" cy="-30" rx="70" ry="58" fill="{SKIN}" stroke="{OUT}" stroke-width="12"/></g>')
# frasco de pastillas cayendo
o.append(f'<g transform="translate(330 900) rotate(-28)" filter="url(#sh)"><rect x="-60" y="-90" width="120" height="170" rx="18" fill="#FF8A3D" opacity="0.92" stroke="{OUT}" stroke-width="8"/><rect x="-70" y="-120" width="140" height="44" rx="10" fill="#fff" stroke="{OUT}" stroke-width="8"/><rect x="-48" y="-40" width="96" height="70" rx="8" fill="#fff" stroke="{OUT}" stroke-width="5"/><path d="M-20 -6 H20 M0 -26 V14" stroke="#E8344A" stroke-width="12" stroke-linecap="round"/></g>')
for (x, y, r) in [(200, 820, 18), (250, 1000, 14), (430, 1030, 16)]:
    o.append(f'<g transform="translate({x} {y}) rotate(30)"><rect x="{-r*1.6}" y="{-r*0.7}" width="{r*3.2}" height="{r*1.4}" rx="{r*0.7}" fill="#fff" stroke="{OUT}" stroke-width="5"/><rect x="0" y="{-r*0.7}" width="{r*1.6}" height="{r*1.4}" rx="{r*0.5}" fill="#E8344A"/></g>')
# !!! rojos
for k in range(3):
    o.append(f'<g transform="translate({120+k*70} {150+k*-20}) rotate({-18+k*8})"><rect x="-16" y="-80" width="32" height="110" rx="14" fill="#E8344A" stroke="{OUT}" stroke-width="7"/><circle cx="0" cy="62" r="18" fill="#E8344A" stroke="{OUT}" stroke-width="7"/></g>')
if txt:
    o.append(f'<g transform="translate(1250 1000) rotate(-3)" font-family="Inter,Arial" font-weight="900" text-anchor="middle" paint-order="stroke"><text y="-10" font-size="104" fill="#FFD23F" stroke="{OUT}" stroke-width="22">¿SALVÓ MÁS VIDAS?</text></g>')
# viñeta
o.append('<rect width="1920" height="1080" fill="none" stroke="#2A0E2A" stroke-width="90" opacity="0.18" filter="url(#glow)"/>')
o.append('</svg>')
print(''.join(o))
