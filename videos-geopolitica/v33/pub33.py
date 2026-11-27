"""Genera publicacion.json de v33 con capítulos sacados de timeline.json (+1,6 s del sting tras el gancho). Ejecutar desde v33/."""
import json
tl = json.load(open('timeline.json'))['scenes']; STING = 1.6
CAP = [(0, 'La regla'), (1, 'El primer dólar'), (2, 'El experimento'), (3, 'El plan millonario'), (4, 'El viernes raro'),
       (6, 'El error'), (7, 'El sábado'), (8, 'El balcón'), (9, 'La verdad')]
fmt = lambda s: f"{int(s // 60)}:{int(s % 60):02d}"
caps = '\n'.join(f"{fmt(0 if i == 0 else tl[i]['start'] + STING)} {n}" for i, n in CAP)
desc = f"""💰 Cada vez que tu crush te miente, te cae un dólar del cielo. Suena genial… hasta que un viernes te caen 47 dólares en un solo día. Y todos vienen de ella.

Una historia animada de "¿qué pasaría si…?" con Xeno y Sofía.

⏱️ Capítulos
{caps}

📚 Dato real del video
• En estudios con diarios (DePaulo y colaboradores, 1996), la gente admitió decir en promedio una o dos mentiras al día, muchas de ellas para no herir a otros.
La historia de Xeno y Sofía es ficción.

👇 Si ganaras $1 cada vez que tu crush te miente, ¿le dirías o te harías millonario? Te leo en los comentarios.

#quepasariasi #crush #historiasanimadas #animacion #jxseng"""
pub = {'title': '¿Qué pasaría si ganaras $1 cada vez que tu crush te miente? 💰', 'description': desc,
       'tags': ['qué pasaría si', 'crush', 'mi crush', 'historia animada', 'animación', 'historias de amor', 'mentiras', 'xeno', 'sofía', 'jxseng']}
json.dump(pub, open('publicacion.json', 'w'), ensure_ascii=False, indent=1)
print(desc)
