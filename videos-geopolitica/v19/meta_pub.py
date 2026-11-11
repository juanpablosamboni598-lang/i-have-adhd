"""Escribe publicacion.json (título, descripción con capítulos reales, etiquetas) desde timeline.json."""
import json
t = json.load(open('timeline.json'))['scenes']
ch = [(0, 'Medio cerebro dormido'), (2, 'El problema: respirar a propósito'), (6, 'Dormir con medio cerebro'), (9, 'El ojo cruzado y los turnos'),
      (12, 'Dónde duerme un delfín'), (17, 'Tiburones y frío'), (19, 'El sonar que no se apaga'), (22, 'Las crías'),
      (25, 'Focas, patos, fragatas y ballenas'), (30, '¿Y nosotros? El efecto de la primera noche'), (33, 'Cómo cuidarlos'), (35, 'Resumen')]
fmt = lambda s: f"{int(s // 60)}:{int(s % 60):02d}"
chap = '\n'.join(f"{fmt(t[i]['start']) if i else '0:00'} {n}" for i, n in ch)
desc = f"""¿Cómo duermen los delfines sin ahogarse? Duermen con medio cerebro a la vez, y con un ojo abierto. Aquí lo vemos paso a paso, animado.

El delfín respira de forma voluntaria: tiene que decidir cada respiración. Por eso no puede apagar todo su cerebro. Vas a ver cómo funciona el sueño unihemisférico, por qué se cierra el ojo contrario, dónde y cómo duerme un delfín (flotando como un tronco o nadando en grupo), cómo mantiene encendido su sonar durante días, y qué pasa con las crías recién nacidas.

También otros animales que duermen a medias, como focas, patos, aves fragata y cachalotes, y el efecto de la primera noche: por qué tú también duermes peor en un lugar nuevo.

Capítulos
{chap}

Fuentes y contexto
- Lyamin, O. et al. (2005). Continuous activity in cetaceans after birth. Nature.
- Branstetter, B. et al. (2012). Dolphins can maintain vigilant behavior through echolocation for 15 days. PLoS ONE.
- Rattenborg, N. et al. (1999). Half-awake to the risk of predation. Nature.
- Rattenborg, N. et al. (2016). Evidence that birds sleep in mid-flight. Nature Communications.
- Miller, P. et al. (2008). Stereotypical resting behavior of the sperm whale. Current Biology.
- Tamaki, M. et al. (2016). Night watch in one brain hemisphere during sleep. Current Biology.

Video animado con voz sintética e imágenes generadas por computadora.

#delfines #datoscuriosos #animales"""
tags = ['cómo duermen los delfines', 'delfines', 'sueño unihemisférico', 'medio cerebro', 'datos curiosos de animales',
        'delfín duerme con un ojo abierto', 'curiosidades de animales', 'ciencia animada', 'efecto de la primera noche', 'jxseng']
json.dump({'title': '¿Cómo duermen los delfines? Con medio cerebro (explicado)', 'description': desc, 'tags': tags},
          open('publicacion.json', 'w'), ensure_ascii=False, indent=1)
print(len(desc.split()), 'palabras')
