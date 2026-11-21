"""Genera publicacion.json de v28 con capítulos sacados de timeline.json. Ejecutar desde v28/."""
import json
tl = json.load(open('timeline.json'))['scenes']
CAP = [(0, 'Un número sobre cada cabeza'), (2, 'El despertar'), (4, 'Camino a clase'), (6, 'Sofía y el número que no aparece'),
       (8, 'El experimento'), (11, 'Camila'), (13, 'La noche'), (15, 'La conversación'), (16, 'La verdad'), (18, 'Final')]
fmt = lambda s: f"{int(s // 60)}:{int(s % 60):02d}"
caps = '\n'.join(f"{fmt(0 if i == 0 else tl[i]['start'])} {n}" for i, n in CAP)
desc = f"""💘 Imagina que mañana te despiertas y ves un número sobre la cabeza de cada persona: cuánto te quiere.
Tu mamá: 100 %. Tu perro: 100 %. Tu hermano: 42 % y bajando… Pero sobre la chica que te gusta solo aparece "???".

Una historia animada de "¿qué pasaría si…?" sobre el amor, la amistad y el valor de decir lo que sientes.

⏱️ Capítulos
{caps}

👇 Si pudieras ver ese número, ¿de quién lo mirarías primero? Te leo en los comentarios.

#quepasariasi #historia #animacion #crush #jxseng"""
pub = {'title': '¿Qué pasaría si pudieras ver quién está enamorado de ti? 💘', 'description': desc,
       'tags': ['qué pasaría si', 'historia animada', 'crush', 'amor', 'quién te ama', 'animación', 'historias', 'jxseng', 'qué pasaría si tu crush', 'superpoder']}
json.dump(pub, open('publicacion.json', 'w'), ensure_ascii=False, indent=1)
print(desc)
