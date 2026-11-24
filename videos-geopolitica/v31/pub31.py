"""Genera publicacion.json de v31 con capítulos sacados de timeline.json. Ejecutar desde v31/."""
import json
tl = json.load(open('timeline.json'))['scenes']
CAP = [(0, 'Tu crush escucha todo'), (2, 'El primer pensamiento'), (3, 'La prueba de la pizza'), (5, 'La clase'), (7, 'La exposición'),
       (8, 'Camila lo sabe'), (9, 'Mateo y la fiesta'), (10, 'El abecedario'), (11, 'La huida'), (12, 'La verdad'), (14, 'Final')]
fmt = lambda s: f"{int(s // 60)}:{int(s % 60):02d}"
caps = '\n'.join(f"{fmt(0 if i == 0 else tl[i]['start'])} {n}" for i, n in CAP)
desc = f"""🧠💘 Imagina que la persona que te gusta pudiera escuchar todo lo que piensas. Todo. Y tú piensas en ella… todo el tiempo.
"Qué bonita se ve hoy". "Pizza". "Dile que no a Mateo"… Ella lo escuchó todo.

Una historia animada de "¿qué pasaría si…?" sobre el crush, la vergüenza y el valor de decir lo que sientes en voz alta.

⏱️ Capítulos
{caps}

👇 Si tu crush pudiera escuchar un solo pensamiento tuyo, ¿cuál sería? Te leo en los comentarios.

#quepasariasi #historia #animacion #crush #jxseng"""
pub = {'title': '¿Qué pasaría si tu crush pudiera escuchar tus pensamientos? 🧠💘', 'description': desc,
       'tags': ['qué pasaría si', 'historia animada', 'crush', 'qué pasaría si tu crush', 'escuchar pensamientos', 'leer la mente', 'amor', 'animación', 'historias', 'jxseng']}
json.dump(pub, open('publicacion.json', 'w'), ensure_ascii=False, indent=1)
print(desc)
