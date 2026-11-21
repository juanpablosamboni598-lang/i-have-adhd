"""Exporta los personajes de v28 como fragmentos SVG para Remotion (remotion/src/chars28.json).
Cada personaje: h[expresión] (cabeza centrada en 0,0) y b[pose] (cuerpo; la cabeza va en translate(0 -40))."""
import json, re, importlib
EXPS = ['normal', 'sorprendido', 'sonrojado', 'riendo', 'llorando', 'enojado', 'pensando']

def suf(svg, k):
    return re.sub(r'(id="|url\(#)(\w+)', lambda m: f'{m.group(1)}{m.group(2)}_{k}', svg)

def recolor(svg, mp):
    for a, b in mp.items():
        svg = svg.replace(a, b)
    return svg

def build(mod, k, poses, mp=None):
    m = importlib.import_module(mod)
    h = {e: m.head(e) for e in EXPS}
    h['preocupado'] = re.sub(r'<path[^>]*fill="#8FD8FF"[^>]*/>', '', h['llorando'])
    b = {p: m.body(p) for p in poses}
    out = {'h': h, 'b': b}
    for part in ('h', 'b'):
        for key in out[part]:
            s = out[part][key]
            if mp: s = recolor(s, mp)
            out[part][key] = suf(s, k)
    return out

C = {}
C['X'] = build('alto2', 'X', ['normal', 'saluda', 'abraza'])
C['S'] = build('chica', 'S', ['normal', 'saluda', 'manos'])
# Camila: pelo rojizo, cárdigan verde azulado
C['C'] = build('chica', 'C', ['normal', 'saluda', 'manos'], {'#6A3C2A': '#D0482C', '#2A160E': '#6E1E12', '#9A5E44': '#FF8A6A', '#4A2A1E': '#7A2A18',
             '#9A80F0': '#2E9C9A', '#C6AEFF': '#5CCBC6', '#7A5ED0': '#1E7472', '#B79CFF': '#4FBDB8', '#7E62D6': '#1E7472', '#DCCEFF': '#A8EEEA', '#FFD23F': '#FF8AB0'})
# Mamá / vecina: pelo castaño claro, cárdigan coral
C['M'] = build('chica', 'M', ['normal', 'saluda', 'manos'], {'#6A3C2A': '#9A6A40', '#2A160E': '#4A3018', '#9A80F0': '#E8735C', '#C6AEFF': '#FF9A84', '#7A5ED0': '#B8503C', '#B79CFF': '#F08A72', '#7E62D6': '#B8503C', '#DCCEFF': '#FFC9BC'})
# Directora: pelo gris, cárdigan azul marino
C['D'] = build('chica', 'D', ['normal', 'saluda', 'manos'], {'#6A3C2A': '#B8B8C4', '#2A160E': '#6A6A78', '#9A5E44': '#E8E8F0', '#4A2A1E': '#5A5A66', '#9A80F0': '#2E3A6A', '#C6AEFF': '#4A5A94', '#7A5ED0': '#1E2648', '#B79CFF': '#3A4A80', '#7E62D6': '#1E2648', '#DCCEFF': '#8A9AD0'})
# Hermano: Xeno v1 con sudadera azul (sin gorra)
C['H'] = build('alto', 'H', ['normal', 'saluda'], {'#E8650E': '#2E6FD8', '#FF8A2E': '#4C8EF0', '#FF7A1A': '#3A7CE8', '#C24F06': '#1E4EA8', '#C9560A': '#1E4EA8', '#FFB070': '#9CC2FF'})
# Mateo: sudadera roja universitaria
C['MT'] = build('alto', 'MT', ['normal', 'saluda'], {'#E8650E': '#C8283A', '#FF8A2E': '#E84A5A', '#FF7A1A': '#D8384A', '#C24F06': '#8A1424', '#C9560A': '#8A1424', '#FFB070': '#FF9AA6'})
# Profesor: suéter marrón
C['T'] = build('alto', 'T', ['normal', 'saluda'], {'#E8650E': '#7A5A3E', '#FF8A2E': '#9A7656', '#FF7A1A': '#8A6848', '#C24F06': '#4E3824', '#C9560A': '#4E3824', '#FFB070': '#C8A888'})
# Kiosquero: suéter gris
C['K'] = build('alto', 'K', ['normal', 'saluda'], {'#E8650E': '#6A7484', '#FF8A2E': '#8A94A4', '#FF7A1A': '#7A8494', '#C24F06': '#424A58', '#C9560A': '#424A58', '#FFB070': '#B8C2D0'})

# Perro (simple, mismo trazo)
O = '#1A1424'
def dog_head(e):
    eyes = ('<path d="M-46 -6 Q-30 -24 -14 -6 M14 -6 Q30 -24 46 -6" stroke="#1A1424" stroke-width="8" fill="none" stroke-linecap="round"/>' if e == 'riendo'
            else '<circle cx="-30" cy="-8" r="13" fill="#1A1424"/><circle cx="30" cy="-8" r="13" fill="#1A1424"/><circle cx="-34" cy="-13" r="4" fill="#fff"/><circle cx="26" cy="-13" r="4" fill="#fff"/>')
    return (f'<path d="M-96 -60 Q-140 20 -100 80 Q-78 40 -70 -10Z M96 -60 Q140 20 100 80 Q78 40 70 -10Z" fill="#8A5A3A" stroke="{O}" stroke-width="5"/>'
            f'<ellipse cx="0" cy="0" rx="92" ry="84" fill="#E8B07A" stroke="{O}" stroke-width="6"/><ellipse cx="0" cy="40" rx="50" ry="36" fill="#FFF1DE"/>'
            f'{eyes}<ellipse cx="0" cy="22" rx="16" ry="11" fill="#1A1424"/>'
            f'<path d="M-18 44 Q0 58 18 44" stroke="{O}" stroke-width="5" fill="none"/>' + ('<path d="M-12 50 Q0 84 12 50Z" fill="#FF7E93" stroke="#1A1424" stroke-width="3"/>' if e in ('riendo', 'normal') else ''))
C['P'] = {'h': {e: dog_head(e) for e in EXPS + ['preocupado']},
          'b': {'normal': f'<g transform="translate(0 200)"><path d="M120 -40 Q200 -100 220 -150" stroke="{O}" stroke-width="30" stroke-linecap="round" fill="none"/><path d="M120 -40 Q200 -100 220 -150" stroke="#E8B07A" stroke-width="20" stroke-linecap="round" fill="none"/>'
                          f'<ellipse cx="40" cy="0" rx="150" ry="90" fill="#E8B07A" stroke="{O}" stroke-width="6"/>'
                          + ''.join(f'<rect x="{x}" y="50" width="34" height="110" rx="16" fill="#E8B07A" stroke="{O}" stroke-width="5"/>' for x in (-80, -30, 80, 130)) + '</g>'}}
C['P']['b']['saluda'] = C['P']['b']['normal']
json.dump(C, open('../remotion/src/chars28.json', 'w'), ensure_ascii=False)
print({k: (len(v['h']), list(v['b'])) for k, v in C.items()})
