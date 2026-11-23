"""Genera publicacion.json de v30 con capítulos sacados de timeline.json. Ejecutar desde v30/."""
import json
tl = json.load(open('timeline.json'))['scenes']
CAP = [(0, 'Seis meses enamorado'), (2, 'La peor mañana'), (3, 'El choque'), (5, 'El cuaderno'), (6, 'Trabajo en pareja'),
       (7, 'Los pulpos tienen 3 corazones'), (8, 'La cafetería'), (10, 'La carta'), (11, 'El casillero'), (12, 'Hola, Sofía')]
fmt = lambda s: f"{int(s // 60)}:{int(s % 60):02d}"
caps = '\n'.join(f"{fmt(0 if i == 0 else tl[i]['start'])} {n}" for i, n in CAP)
desc = f"""🍞 Llevas seis meses enamorado de Sofía… y el día que por fin la ves frente a frente, todo sale mal.
Llegas tarde, con un calcetín de cada color, chocas con ella y lo único que te sale es: "Hola… tostada".

Una historia animada de "¿qué pasaría si…?" sobre el crush, la vergüenza y el valor de ser tú mismo.

⏱️ Capítulos
{caps}

👇 ¿Qué es lo más vergonzoso que te ha pasado frente a tu crush? Te leo en los comentarios.

#quepasariasi #historia #animacion #crush #jxseng"""
pub = {'title': '¿Qué pasaría si te encontraras con tu crush en el PEOR momento? 🍞💘', 'description': desc,
       'tags': ['qué pasaría si', 'historia animada', 'crush', 'qué pasaría si tu crush', 'amor', 'vergüenza', 'animación', 'historias', 'jxseng', 'enamorado']}
json.dump(pub, open('publicacion.json', 'w'), ensure_ascii=False, indent=1)
print(desc)
