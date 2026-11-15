"""Escribe publicacion.json (título, descripción con capítulos reales, etiquetas) desde timeline.json."""
import json
t = json.load(open('timeline.json'))['scenes']
ch = [(0, 'Armar una lavadora desde cero'), (1, 'Balde y tabla de frotar'), (4, 'Tambor con huecos y paletas'), (7, 'La cuba'),
      (9, 'Motor, correa y polea'), (11, 'Electroválvula y presostato'), (15, 'La resistencia'), (17, 'El dispensador de jabón'),
      (19, 'Bomba de desagüe y filtro'), (23, 'El centrifugado'), (25, 'Contrapesos de concreto'), (27, 'Resortes y amortiguadores'),
      (29, 'El seguro de la puerta'), (31, 'El fuelle de goma'), (33, 'El cerebro y el ciclo'), (37, 'No la llenes hasta el tope'), (39, 'Repaso')]
fmt = lambda s: f"{int(s // 60)}:{int(s % 60):02d}"
chap = '\n'.join(f"{fmt(t[i]['start']) if i else '0:00'} {n}" for i, n in ch)
desc = f"""¿Cómo funciona una lavadora? La armamos desde cero, en 3D y por prueba y error: cada vez que algo falla, le agregamos una pieza.

Tu lavadora no tiene manos: hace que la ropa suba, caiga y se frote sola miles de veces. Vas a ver el tambor con huecos y paletas, la cuba, el motor con correa, la electroválvula, el presostato, la resistencia, la bomba con su filtro escondido, el centrifugado, los bloques de concreto que la hacen pesar tanto, los amortiguadores y el seguro de la puerta.

Capítulos
{chap}

Contexto
- Lavadora de carga frontal (tambor horizontal). Los modelos varían según la marca.
- Los contrapesos suelen ser de concreto o hierro fundido y se fijan a la cuba para reducir la vibración.
- Revisa el manual de tu lavadora antes de abrir el filtro; ten a mano un recipiente y un trapo porque sale agua.

Video animado en 3D. Narración con voz clonada por IA de una persona real que dio su autorización.

#lavadora #comofunciona #ciencia"""
tags = ['cómo funciona una lavadora', 'lavadora', 'por qué pesa tanto la lavadora', 'filtro de la lavadora', 'centrifugado',
        'contrapesos lavadora', 'cómo funciona', 'ciencia animada', 'animación 3D', 'jxseng']
json.dump({'title': '¿Cómo funciona una lavadora? La armamos pieza por pieza (3D)', 'description': desc, 'tags': tags},
          open('publicacion.json', 'w'), ensure_ascii=False, indent=1)
print(len(desc.split()), 'palabras')
