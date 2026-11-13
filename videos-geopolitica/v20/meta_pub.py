"""Escribe publicacion.json (título, descripción con capítulos reales, etiquetas) desde timeline.json."""
import json
t = json.load(open('timeline.json'))['scenes']
ch = [(0, 'Dos metros de cuello'), (2, 'El animal más alto y sus 7 vértebras'), (4, 'El problema: la gravedad'), (6, 'Un corazón de más de 10 kilos'),
      (8, 'La presión: el doble que la tuya'), (12, 'Bajar a beber sin desmayarse'), (15, 'Las válvulas de la yugular'), (17, 'La red de vasos'),
      (18, 'Subir la cabeza sin marearse'), (21, 'Piernas con medias de compresión'), (26, 'Lo que dicen sus genes'), (29, 'La lengua y las acacias'),
      (31, 'Dormir de pie'), (33, 'En peligro'), (35, 'Resumen')]
fmt = lambda s: f"{int(s // 60)}:{int(s % 60):02d}"
chap = '\n'.join(f"{fmt(t[i]['start']) if i else '0:00'} {n}" for i, n in ch)
desc = f"""¿Cómo le llega la sangre al cerebro a una jirafa, si su cabeza está casi dos metros por encima del corazón? La armamos pieza por pieza en 3D, con rayos X, para ver cómo funciona por dentro.

Vas a ver su corazón de más de 10 kilos con paredes gruesas, por qué su presión es más o menos el doble que la tuya, cómo las válvulas de su vena yugular la protegen cuando baja a beber, por qué no se marea al subir la cabeza, y cómo la piel apretada de sus patas funciona como una media de compresión.

Capítulos
{chap}

Fuentes y contexto
- Hargens, A. et al. (1987). Gravitational haemodynamics and oedema prevention in the giraffe. Nature.
- Mitchell, G. y Skinner, J. (2009). An allometric analysis of the giraffe cardiovascular system. Comparative Biochemistry and Physiology A.
- Smerup, M. et al. (2016). The thick left ventricular wall of the giraffe heart normalises wall tension. Journal of Experimental Biology.
- Agaba, M. et al. (2016). Giraffe genome sequence reveals clues to its unique morphology and physiology. Nature Communications.
- Giraffe Conservation Foundation: estimación de población en libertad (aprox. 117.000).
- UICN, Lista Roja: Giraffa camelopardalis, vulnerable.

Video animado en 3D con voz sintética e imágenes generadas por computadora.

#jirafas #datoscuriosos #animales"""
tags = ['jirafa', 'cómo funciona el corazón de la jirafa', 'presión arterial jirafa', 'por qué la jirafa no se desmaya', 'datos curiosos de animales',
        'curiosidades de animales', 'ciencia animada', 'animación 3D', 'cuello de la jirafa', 'jxseng']
json.dump({'title': '¿Cómo le llega la sangre al cerebro a una jirafa? (en 3D)', 'description': desc, 'tags': tags},
          open('publicacion.json', 'w'), ensure_ascii=False, indent=1)
print(len(desc.split()), 'palabras')
