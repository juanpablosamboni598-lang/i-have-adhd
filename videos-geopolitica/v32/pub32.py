"""Genera publicacion.json de v32 con capítulos sacados de timeline.json. Ejecutar desde v32/."""
import json
tl = json.load(open('timeline.json'))['scenes']
CAP = [(0, 'Londres, 1941'), (2, 'El Blitz'), (3, 'El sospechoso'), (4, 'Bletchley Park y Enigma'), (5, 'Más rápido que la Bomba'),
       (6, 'Sofía y el parte del clima'), (7, 'El dilema'), (8, 'El convoy'), (9, 'La lección'), (10, 'La foto')]
fmt = lambda s: f"{int(s // 60)}:{int(s % 60):02d}"
caps = '\n'.join(f"{fmt(0 if i == 0 else tl[i]['start'])} {n}" for i, n in CAP)
desc = f"""🧠 Abres los ojos en Londres, 1941. Suenan sirenas. Y tu cerebro tiene un IQ infinito.
Terminas en Bletchley Park, junto a Alan Turing, intentando descifrar la máquina Enigma… pero descubres que ningún genio gana una guerra solo.

Una historia animada de "¿qué pasaría si…?" con hechos reales de la Segunda Guerra Mundial.

⏱️ Capítulos
{caps}

📚 Datos reales del video
• Durante el Blitz (1940-1941), miles de londinenses durmieron en las estaciones del metro.
• Enigma tenía unos 159 trillones de trillones de combinaciones y la clave cambiaba cada medianoche.
• Alan Turing diseñó la Bomba (1940) para acelerar la búsqueda de claves.
• Cerca de 3 de cada 4 personas que trabajaban en Bletchley Park eran mujeres.
• Los partes del clima se usaban como "pistas" para descifrar mensajes.
• La inteligencia Ultra ayudó a desviar convoyes en el Atlántico.
• El historiador Harry Hinsley estimó que descifrar Enigma acortó la guerra unos 2 años (estimación).
La historia de Xeno y Sofía es ficción.

👇 Si tuvieras un IQ infinito, ¿a qué época viajarías primero? Te leo en los comentarios.

#quepasariasi #historia #segundaguerramundial #animacion #jxseng"""
pub = {'title': '¿Qué pasaría si viajaras a la Segunda Guerra Mundial con IQ infinito? 🧠', 'description': desc,
       'tags': ['qué pasaría si', 'iq infinito', 'segunda guerra mundial', 'enigma', 'alan turing', 'bletchley park', 'historia animada', 'animación', 'historia', 'jxseng']}
json.dump(pub, open('publicacion.json', 'w'), ensure_ascii=False, indent=1)
print(desc)
