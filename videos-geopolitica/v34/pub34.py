"""Genera publicacion.json de v34 con capítulos sacados de timeline.json (+1,6 s del sting tras el gancho). Ejecutar desde v34/."""
import json
tl = json.load(open('timeline.json'))['scenes']; STING = 1.6
CAP = [(0, 'Los números'), (1, 'Un rato antes'), (2, 'Los ??? de Sofía'), (3, 'Los experimentos'), (5, 'El plan de Mateo'),
       (6, 'El mensaje'), (7, 'La biblioteca'), (8, 'El error'), (9, 'La lluvia'), (10, 'La verdad')]
fmt = lambda s: f"{int(s // 60)}:{int(s % 60):02d}"
caps = '\n'.join(f"{fmt(0 if i == 0 else tl[i]['start'] + STING)} {n}" for i, n in CAP)
desc = f"""❤️ Encima de la cabeza de cada persona hay un número que dice cuánto te quiere. Tu mamá: 1000 %. Tu mejor amigo: 90 %. La profe de mate: 2 %. Y la chica que te gusta desde hace dos años… solo tiene signos de pregunta.

Una historia animada de "¿qué pasaría si…?" con Xeno y Sofía. La historia es ficción.

⏱️ Capítulos
{caps}

👇 Si pudieras ver el medidor de amor de todos, ¿lo mirarías o preferirías no saber? Te leo en los comentarios.

#quepasariasi #crush #historiasanimadas #animacion #jxseng"""
pub = {'title': '¿Qué pasaría si pudieras ver el MEDIDOR DE AMOR de todos? ❤️', 'description': desc,
       'tags': ['qué pasaría si', 'crush', 'mi crush', 'medidor de amor', 'historia animada', 'animación', 'historias de amor', 'xeno', 'sofía', 'jxseng']}
json.dump(pub, open('publicacion.json', 'w'), ensure_ascii=False, indent=1)
print(desc)
