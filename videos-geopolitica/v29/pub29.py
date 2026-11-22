"""Genera publicacion.json de v29 con capítulos sacados de timeline.json. Ejecutar desde v29/."""
import json
tl = json.load(open('timeline.json'))['scenes']
CAP = [(0, 'El espejo vacío'), (2, 'El despertar'), (5, 'La tostada embrujada'), (6, 'Camino al colegio'), (7, 'El examen'),
       (9, 'El comedor'), (10, 'Lo que dicen de ti'), (11, 'Sofía'), (12, '¿Y si no vuelvo?'), (13, 'El héroe invisible'), (14, 'Medianoche')]
fmt = lambda s: f"{int(s // 60)}:{int(s % 60):02d}"
caps = '\n'.join(f"{fmt(0 if i == 0 else tl[i]['start'])} {n}" for i, n in CAP)
desc = f"""👻 Imagina que te despiertas, te miras al espejo… y no hay nadie. Eres invisible. Solo por 24 horas.
Tu mamá no te ve, tu hermano ve una tostada flotando, tu perro le ladra al aire… y en el colegio escuchas lo que dicen de ti cuando no estás.

Una historia animada de "¿qué pasaría si…?" sobre la amistad, la honestidad y lo que de verdad importa.

⏱️ Capítulos
{caps}

👇 Si fueras invisible por 24 horas, ¿qué harías primero? Te leo en los comentarios.

#quepasariasi #historia #animacion #invisible #jxseng"""
pub = {'title': '¿Qué pasaría si fueras invisible por 24 horas? 👻', 'description': desc,
       'tags': ['qué pasaría si', 'historia animada', 'invisible', 'qué pasaría si fueras invisible', 'animación', 'historias', 'superpoder', 'jxseng', 'crush', '24 horas']}
json.dump(pub, open('publicacion.json', 'w'), ensure_ascii=False, indent=1)
print(desc)
