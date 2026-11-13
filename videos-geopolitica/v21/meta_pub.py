"""Escribe publicacion.json (título, descripción con capítulos reales, etiquetas) desde timeline.json."""
import json
t = json.load(open('timeline.json'))['scenes']
ch = [(0, 'Construir un inodoro desde cero'), (2, 'Un hoyo y un tubo'), (4, 'Los gases y el sello de agua'), (8, 'Empujar con agua: balde y tanque'),
      (11, 'La llave y el desborde'), (13, 'El flotador'), (16, 'El tubo de rebose'), (18, 'Compuerta y palanca'), (23, 'Primera prueba'),
      (24, 'El sifón y el ¡glup!'), (27, 'El tubo de ventilación'), (28, 'Quién lo inventó'), (30, 'Cuánta agua gasta'), (32, 'Fugas y toallitas'), (34, 'Repaso')]
fmt = lambda s: f"{int(s // 60)}:{int(s % 60):02d}"
chap = '\n'.join(f"{fmt(t[i]['start']) if i else '0:00'} {n}" for i, n in ch)
desc = f"""¿Cómo funciona un inodoro? Lo construimos desde cero, en 3D y por prueba y error: cada vez que algo falla, agregamos una pieza nueva.

Primero un hoyo, que huele mal. Luego un tubo, que deja subir los gases. Después la curva con sello de agua, el tanque, el flotador que lo cierra solo, el tubo de rebose por si falla, la compuerta con su palanca, y al final el sifón que se lleva todo con el famoso ¡glup!

Capítulos
{chap}

Fuentes y contexto
- Alexander Cumming, patente británica de 1775 del sifón en forma de S (sello de agua).
- John Harington, The Metamorphosis of Ajax (1596): primer inodoro con descarga documentado.
- Thomas Crapper: fabricante londinense del siglo XIX; no inventó el inodoro.
- Consumo típico: inodoros antiguos de más de 12 L por descarga; modernos de unos 6 L; doble descarga de unos 3/6 L.

Video animado en 3D con voz sintética e imágenes generadas por computadora.

#inodoro #comofunciona #ciencia"""
tags = ['cómo funciona un inodoro', 'inodoro', 'sifón', 'sello de agua', 'flotador del tanque', 'por qué el inodoro hace glup',
        'cómo funciona', 'ciencia animada', 'animación 3D', 'jxseng']
json.dump({'title': '¿Cómo funciona un inodoro? Lo armamos por prueba y error (3D)', 'description': desc, 'tags': tags},
          open('publicacion.json', 'w'), ensure_ascii=False, indent=1)
print(len(desc.split()), 'palabras')
