"""Escribe publicacion.json (título, descripción con capítulos reales, etiquetas) desde timeline.json."""
import json
t = json.load(open('timeline.json'))['scenes']
ch = [(0, 'Siempre de pie'), (2, 'El reflejo de enderezamiento'), (6, 'El oído interno'), (9, 'Un cuerpo de goma'),
      (12, 'El misterio de la física'), (16, 'El truco de las dos mitades'), (24, 'La NASA y los gatos sin gravedad'),
      (26, 'El aterrizaje'), (28, 'Caídas desde edificios'), (34, 'Por qué una caída corta es peligrosa'), (36, 'Resumen')]
fmt = lambda s: f"{int(s // 60)}:{int(s % 60):02d}"
chap = '\n'.join(f"{fmt(t[i]['start']) if i else '0:00'} {n}" for i, n in ch)
desc = f"""¿Por qué los gatos siempre caen de pie? En menos de medio segundo un gato gira en el aire sin apoyarse en nada. Aquí lo vemos paso a paso, animado.

Vas a ver cómo funciona el reflejo de enderezamiento del gato: el oído interno que le dice dónde está el suelo, su columna flexible, su clavícula suelta y el truco de las dos mitades que respeta la física. También el experimento fotográfico de 1894, la explicación matemática de 1969, los gatos en vuelos sin gravedad y el famoso estudio de 1987 sobre gatos que cayeron desde edificios en Nueva York, con su gran trampa estadística.

Y lo más importante si tienes gato: por qué una caída desde un primer o segundo piso puede ser muy peligrosa, y cómo proteger ventanas y balcones.

Capítulos
{chap}

Fuentes y contexto
- Marey, É.-J. (1894). Fotografías de un gato cayendo, Academia de Ciencias de París.
- Kane, T. R. y Scher, M. P. (1969). A dynamical explanation of the falling cat phenomenon.
- Whitney, W. O. y Mehlhaff, C. J. (1987). High-rise syndrome in cats. 132 casos, Nueva York.

Video animado con voz sintética e imágenes generadas por computadora.

#gatos #datoscuriosos #ciencia"""
tags = ['por qué los gatos caen de pie', 'gatos caen de pie', 'reflejo de enderezamiento', 'gatos', 'datos curiosos de gatos',
        'física del gato', 'curiosidades de animales', 'ciencia animada', 'síndrome del gato paracaidista', 'jxseng']
json.dump({'title': '¿Por qué los gatos siempre caen de pie? Explicado paso a paso', 'description': desc, 'tags': tags},
          open('publicacion.json', 'w'), ensure_ascii=False, indent=1)
print(desc[:200]); print(len(desc.split()), 'palabras')
