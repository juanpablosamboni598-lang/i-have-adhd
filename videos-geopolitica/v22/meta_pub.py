"""Escribe publicacion.json (título, descripción con capítulos reales, etiquetas) desde timeline.json."""
import json
t = json.load(open('timeline.json'))['scenes']
ch = [(0, 'Armar una nevera desde cero'), (2, 'El bloque de hielo'), (4, 'El truco del sudor: el evaporador'), (8, 'Circuito cerrado y compresor'),
      (12, 'La rejilla de atrás: el condensador'), (15, 'El tubo capilar'), (17, 'El termostato y el zumbido'), (20, 'Aislante y empaque con imán'),
      (25, 'El foco con botón'), (27, 'Congelador, escarcha y no frost'), (32, 'Cajón, puerta y comida caliente'), (35, 'El gas y la capa de ozono'),
      (36, 'Dónde ponerla'), (39, 'Repaso')]
fmt = lambda s: f"{int(s // 60)}:{int(s % 60):02d}"
chap = '\n'.join(f"{fmt(t[i]['start']) if i else '0:00'} {n}" for i, n in ch)
desc = f"""¿Cómo funciona una nevera? La armamos desde cero, en 3D y por prueba y error: cada vez que algo falla, le agregamos una pieza.

Tu nevera no fabrica frío: le saca el calor a tu comida y lo tira por la espalda. Vas a ver el líquido que hierve bajo cero en los tubos de adentro, el compresor que lo aprieta, la rejilla de atrás que suelta el calor, el tubo capilar, el termostato que hace que zumbe a ratos, la espuma aislante, el empaque con imán y por qué cuesta abrirla justo después de cerrarla.

Capítulos
{chap}

Fuentes y contexto
- Ciclo de refrigeración por compresión de vapor (evaporador, compresor, condensador y expansión).
- Protocolo de Montreal (1987): eliminación de los gases CFC que dañaban la capa de ozono.
- Recomendaciones generales de seguridad alimentaria: no dejar comida cocinada más de unas 2 horas a temperatura ambiente.

Video animado en 3D con voz sintética e imágenes generadas por computadora.

#nevera #comofunciona #ciencia"""
tags = ['cómo funciona una nevera', 'nevera', 'refrigerador', 'compresor', 'por qué la nevera está caliente atrás', 'por qué zumba la nevera',
        'cómo funciona', 'ciencia animada', 'animación 3D', 'jxseng']
json.dump({'title': '¿Cómo funciona una nevera? La armamos pieza por pieza (3D)', 'description': desc, 'tags': tags},
          open('publicacion.json', 'w'), ensure_ascii=False, indent=1)
print(len(desc.split()), 'palabras')
