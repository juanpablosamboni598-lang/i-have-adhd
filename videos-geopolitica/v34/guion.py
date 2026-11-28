"""v34 · ¿Qué pasaría si pudieras ver el MEDIDOR DE AMOR de todos? — historia de crush (motor index34: neón, brillo de borde, gestos).
Fórmula nueva (GANCHO.md): abre en mitad de lo raro + "esto apenas está empezando" -> sting -> "Un rato antes…".
Narración en "tú" (Xeno es "tú"), chiste en casi cada plano, medidores en pantalla (n:K=valor).
Regla del poder: el número encima de cada persona dice cuánto te quiere a ti. Romance sano: Xeno + Sofía. Historia de ficción."""
import json
E = []
def esc(voz, planos, chip=None, sfx=None):
    words = [len(f.split()) for _, f in planos]; tot = sum(words); acc = 0; fx = [[0.0, 'whoosh']] if sfx is None else sfx
    for (v, f), n in zip(planos, words):
        fr = acc / tot
        if 'n:' in v: fx.append([round(min(0.97, fr + 0.02), 3), 'ding'])
        if 'kw:' in v or ';sh' in v or 'fx:impacto' in v: fx.append([round(fr + 0.01, 3), 'impacto'])
        elif 'fx:chat' in v: fx.append([round(fr + 0.02, 3), 'pop'])
        elif acc: fx.append([round(fr, 3), 'swish'])
        acc += n
    E.append({'tipo': 'planos', 'titulo': '', 'voz': voz, 'texto': ' '.join(f for _, f in planos),
              'planos': [{'v': a, 'f': f} for a, f in planos],
              'p': {'esc': None, 'med': None, 'flash': False, 'chip': chip}, 'sfx': fx})
SOF = lambda v: ['♥', v, 'SOFÍA']

# 0 GANCHO: en mitad de lo raro
esc('susp', [
  ('pasillo;X=sorprendido@0.25;C=normal@0.55;MT=riendo@0.82;n:C=12;n:MT=90;sh', 'Encima de la cabeza de cada persona hay un número. Y solo tú puedes verlo.'),
  ('cocina;M=riendo@0.5;cu;n:M=1000;kw:1000%', 'El de tu mamá dice mil por ciento.'),
  ('patio;S=normal@0.5;cu;n:S=?', 'Y el de la chica que te gusta desde hace dos años… dice signos de interrogación.'),
  ('patio;X=pensando@0.5;cu;th:¿por qué el suyo no?', 'Todos tienen número. Menos ella. Y esto apenas está empezando.'),
], sfx=[[0.0, 'impacto']])
# 1 UN RATO ANTES
esc('narr', [
  ('cuarto;X=normal@0.5;cu', 'Un rato antes, todo era normal. Bueno, normal para ti. Te despertaste tarde, con el pelo como si te hubiera atacado un pájaro.'),
  ('cuarto;X=sorprendido@0.5;P=normal@0.75;n:P=100', 'Y ahí lo viste. Encima de tu perro flotaba un número rosado: cien por ciento.'),
  ('cuarto;X=pensando@0.5;cu;th:¿perro… al cien?', 'Pensaste: bueno, el perro me quiere. Aunque también quiere al cartero. Y a cualquiera con un sándwich.'),
  ('cocina;M=riendo@0.6;X=sorprendido@0.3;n:M=1000', 'Bajaste a desayunar y tu mamá tenía uno gigante: mil por ciento. Ni siquiera cabía en el corazón.'),
  ('cocina;M=normal@0.5;cu', 'Mamá, ¿me quieres mucho? Ella te miró raro. Claro, mijo. ¿Rompiste algo?'),
  ('cocina;X=riendo@0.5;cu;kw:1000%', 'No habías roto nada. Pero ahora tenías un poder. Cada número decía cuánto te quiere esa persona a ti.'),
])
# 2 LA ESCUELA
esc('narr', [
  ('calle;X=sorprendido@0.5;n:0=?!', 'Saliste corriendo al colegio y todo el camino fue una lluvia de números.'),
  ('pasillo;MT=riendo@0.5;cu;n:MT=90', 'Mateo, tu mejor amigo: noventa por ciento. Te saludó con un abrazo y te robó la mitad del jugo. Noventa, sí, cien no.'),
  ('salon;T=normal@0.5;cu;n:T=2;kw:2%', 'La profe de mate: dos por ciento. Y eso que todavía no te había visto el examen.'),
  ('pasillo;C=normal@0.5;cu;n:C=12', 'Camila, la que se sienta atrás: doce. Te pidió un lápiz y nunca te lo devolvió. Doce es generoso.'),
  ('patio;S=riendo@0.5;cu;n:S=?', 'Y entonces apareció Sofía. Te sonrió, te dijo hola… y encima de su cabeza solo había tres signos de pregunta.'),
  ('patio;X=sorprendido@0.5;cu;sh;kw:¿¿¿???', 'Ni un número. Ni un cero. Nada. Solo preguntas.'),
], chip=SOF('???'))
# 3 LOS EXPERIMENTOS
esc('narr', [
  ('patio;MT=pensando@0.3;X=pensando@0.7', 'En el recreo se lo contaste a Mateo. Él lo pensó muy en serio y dijo: hermano, eso es un error del sistema. Reinicia.'),
  ('patio;X=pensando@0.5;cu;th:¿reiniciar… a ella?', 'No sabías cómo reiniciar a una persona. Así que hiciste experimentos.'),
  ('salon;S=normal@0.6;X=sonrojado@0.3;n:S=?', 'Experimento uno: decirle algo bonito. Me gusta tu mochila. Ella dijo: gracias, es de mi hermano. Signos de pregunta.'),
  ('salon;X=preocupado@0.5;cu', 'Experimento dos: hacerla reír. Le contaste tu mejor chiste. El del pingüino. Nadie entiende el del pingüino.'),
  ('salon;S=riendo@0.5;cu;n:S=glitch;sh', 'Pero ella se rió. Y por un segundo el medidor parpadeó como una tele vieja.'),
  ('salon;X=sorprendido@0.5;cu;kw:¿¡QUÉ!?', '¿Cuarenta y siete? ¿Noventa y nueve? No alcanzaste a leerlo. Y volvieron las preguntas.'),
], chip=SOF('???'))
# 4 LOS NÚMEROS SE MUEVEN
esc('narr', [
  ('pasillo;C=sorprendido@0.5;X=preocupado@0.3;n:C=12', 'Esa tarde descubriste otra regla. Los números se mueven.'),
  ('pasillo;C=riendo@0.5;cu;n:C=3', 'Te tropezaste frente a Camila y su número bajó a tres. Tres. Por un tropezón.'),
  ('pasillo;X=normal@0.3;H=normal@0.7;n:H=+', 'Ayudaste a un niño de primero a recoger sus libros y el suyo subió. Una flechita verde.'),
  ('pasillo;X=riendo@0.5;cu;th:puedo hacerlos subir', 'Si los números suben… entonces se pueden subir. Y tú querías subir uno solo.'),
], chip=SOF('???'))
# 5 EL PLAN DE MATEO
esc('narr', [
  ('comedor;MT=riendo@0.5;cu;kw:PLAN', 'Mateo armó un plan en una servilleta. Paso uno: ser misterioso.'),
  ('comedor;X=pensando@0.5;cu', 'Te pusiste lentes oscuros dentro del salón. Chocaste con la puerta. Dos veces.'),
  ('comedor;MT=pensando@0.5;cu', 'Paso dos: hablar de cosas profundas. Le preguntaste a Sofía si los peces tienen sueños.'),
  ('comedor;S=riendo@0.5;cu;n:S=?', 'Ella se quedó pensando de verdad. Y luego dijo: yo creo que sueñan con no ser comida. Seguían las preguntas.'),
  ('comedor;MT=riendo@0.3;X=preocupado@0.7', 'Paso tres decía: rezar. Mateo dijo que ese era el más importante.'),
], chip=SOF('???'))
# 6 EL MENSAJE
esc('narr', [
  ('noche;X=normal@0.5;cu', 'Esa noche, cuando ya te estabas durmiendo, vibró tu celular.'),
  ('noche;fx:chat;chat:¿Mañana me acompañas|a la biblioteca? 📚', 'Era Sofía. ¿Mañana me acompañas a la biblioteca?'),
  ('noche;X=sonrojado@0.5;cu;sh', 'Leíste el mensaje catorce veces. Escribiste sí con tres signos de exclamación. Lo borraste. Escribiste sí, normal.'),
  ('noche;X=riendo@0.5;cu;th:¡¿ME INVITÓ?!', 'Y luego no pudiste dormir. Mirabas el techo como si el techo supiera la respuesta.'),
], chip=SOF('???'))
# 7 LA BIBLIOTECA
esc('narr', [
  ('biblio;S=normal@0.6;X=normal@0.3;n:S=?', 'En la biblioteca no estudiaron casi nada. Ella te preguntó cosas raras.'),
  ('biblio;S=pensando@0.5;cu', '¿Tú crees que hay gente que puede ver cosas que los demás no ven?'),
  ('biblio;X=sorprendido@0.5;cu;sh', 'Casi se te cae el libro. ¿Como qué? Ella se encogió de hombros. No sé. Cosas.'),
  ('biblio;S=sonrojado@0.5;cu;n:S=glitch', 'Cuando te acercaste a ver su tarea, el medidor volvió a parpadear. Más fuerte esta vez.'),
  ('biblio;X=pensando@0.5;cu;th:¿y si es cero?', 'Y por primera vez sentiste miedo. ¿Y si las preguntas eran para no decirte que era un cero?'),
], chip=SOF('???'))
# 8 EL ERROR
esc('narr', [
  ('pasillo;X=pensando@0.5;C=normal@0.8;n:C=3', 'Los días siguientes te volviste un poco raro. Solo mirabas números.'),
  ('pasillo;C=preocupado@0.5;cu;n:C=3', 'Camila te pidió ayuda con una tarea y le dijiste que no. Total, solo tenía tres.'),
  ('noche;fx:chat;chat:¿Vienes a ver la lluvia?|te estoy esperando ☔', 'Y el viernes, Sofía te escribió: ¿vienes a ver la lluvia? Te estoy esperando.'),
  ('noche;X=preocupado@0.5;cu;kw:VISTO', 'Lo dejaste en visto. No porque no quisieras ir. Sino porque tenías miedo de ver un cero.'),
  ('noche;X=llorando@0.5;cu;th:soy un tonto', 'Y te diste cuenta de algo feo: el poder te estaba haciendo tratar a la gente como si fuera un número.'),
], chip=SOF('???'))
# 9 LA LLUVIA
esc('narr', [
  ('patio;X=preocupado@0.5;fx:lluvia', 'Saliste corriendo bajo la lluvia. Sin paraguas. Sin plan. Sin Mateo.'),
  ('patio;S=normal@0.5;fx:lluvia;n:S=?', 'Ella seguía ahí, en el techito del patio. Toda mojada y con dos chocolates calientes. Uno ya frío. Era el tuyo.'),
  ('patio;X=sonrojado@0.5;fx:lluvia;cu', 'Perdón. Tenía miedo. Ella te miró. ¿Miedo de qué?'),
  ('patio;X=pensando@0.5;fx:lluvia;cu', 'Y le contaste todo. Los números, el perro al cien, tu mamá al mil, la profe al dos.'),
  ('patio;S=sorprendido@0.5;fx:lluvia;cu;sh;kw:YO TAMBIÉN', 'Ella abrió los ojos enormes. Y dijo bajito: yo también veo números.'),
], chip=SOF('???'))
# 10 LA VERDAD
esc('narr', [
  ('patio;S=sonrojado@0.5;fx:lluvia;cu', 'Desde hace un año. Y el tuyo, encima de tu cabeza, también dice signos de pregunta.'),
  ('patio;X=sorprendido@0.3;S=sonrojado@0.7;fx:lluvia;n:X=?;n:S=?', 'Se quedaron mirándose. Dos personas con el mismo poder… y no se podían leer.'),
  ('patio;S=riendo@0.5;cu;th:nunca supimos', 'Entonces nunca supimos nada, dijo ella. Y se rió. Un año preguntándole cosas raras a la gente por tu culpa.'),
  ('patio;X=sonrojado@0.5;cu', 'Ahí entendiste. Si el medidor no lo puede decir… hay que decirlo con palabras.'),
  ('patio;X=sonrojado@0.5;cu;kw:ME GUSTAS', 'Sofía… me gustas. Desde hace dos años. Y desde el pingüino.'),
  ('patio;S=sonrojado@0.5;cu;n:S=glitch;fx:brillo', 'El medidor de ella parpadeó una vez más. Y esta vez no volvieron las preguntas.'),
  ('patio;X=riendo@0.3;S=riendo@0.7;fx:brillo', 'Apareció un corazón. Sin número. Solo un corazón. Y ella dijo: a mí también. Desde antes del pingüino.'),
], chip=SOF('♥'))
# 11 CIERRE
esc('narr', [
  ('pasillo;C=riendo@0.5;X=normal@0.3;n:C=+', 'El lunes le ayudaste a Camila con la tarea. Su número subió. Pero ya casi no lo miraste.'),
  ('pasillo;X=pensando@0.5;cu;th:los números no hablan', 'Porque aprendiste que los números dicen mucho… pero las palabras dicen lo importante.'),
  ('neutro;X=pensando@0.5;ui:¿QUÉ HARÍAS TÚ?', 'Y tú, si pudieras ver el medidor de amor de todos, ¿lo mirarías… o preferirías no saber? Te leo en los comentarios.'),
], chip=SOF('♥'))
json.dump(E, open(__file__.replace('guion.py', 'escenas.json'), 'w'), ensure_ascii=False, indent=1)
print(len(E), 'escenas', sum(len(e['planos']) for e in E), 'planos', sum(len(e['texto'].split()) for e in E), 'palabras')
