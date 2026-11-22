"""v29 · ¿Qué pasaría si fueras invisible por 24 horas? — historia, un plano por frase (motor index29 = index28 + invisibilidad).
Tokens nuevos: '~inv' tras la pose/expresión = personaje invisible (translúcido con brillo); 'fx:espejo', 'fx:tostada', 'fx:examen',
'fx:pelota', 'fx:cuenta' (3·2·1). p.reloj = horas que quedan (chip arriba a la derecha)."""
import json
E = []
def esc(voz, planos, flash=False, reloj=None):
    E.append({'tipo': 'planos', 'titulo': '', 'voz': voz, 'texto': ' '.join(f for _, f in planos),
              'planos': [{'v': v, 'f': f} for v, f in planos], 'p': {'esc': None, 'med': None, 'flash': flash, 'reloj': reloj},
              'sfx': [[0.05, 'whoosh']]})
# 1 GANCHO
esc('susp', [
  ('cuarto;X=normal@0.5;cu', 'Imagina que te despiertas, te miras al espejo…'),
  ('cuarto;fx:espejo', 'y no hay nadie.'),
  ('cuarto;X=sorprendido@0.5~inv;cu', 'Eres invisible.'),
  ('neutro;ui:24 HORAS', 'Solo por veinticuatro horas.'),
  ('neutro;X=pensando@0.5~inv', '¿Qué harías primero?'),
])
esc('narr', [('tit', '¿Qué pasaría si fueras invisible por 24 horas?')], flash=True)
# 2 EL DESPERTAR
esc('narr', [
  ('cuarto;X=normal@0.5', 'Suena la alarma. Te estiras. Vas al baño medio dormido.'),
  ('cuarto;fx:espejo', 'Y en el espejo… solo está la pared.'),
  ('cuarto;X=sorprendido@0.5~inv;cu', 'Te tocas la cara. Sí, ahí está. Pero no se ve.'),
  ('cuarto;X=pensando@0.5~inv', 'Por suerte, la ropa también desapareció. Eso hubiera sido un problema.'),
], reloj='23:59')
esc('narr', [
  ('cuarto;M=normal@0.62!saluda;X=normal@0.28~inv', 'Tu mamá abre la puerta: —¡Arriba, que llegas tarde!'),
  ('cuarto;M=sorprendido@0.5;cu', 'Mira la cama vacía. Mira debajo de la cama.'),
  ('cuarto;M=enojado@0.5;cu', '—¿Ya se fue este niño sin desayunar?'),
  ('cuarto;X=riendo@0.5~inv;cu', 'Estás a medio metro de ella. Aguantas la risa.'),
], reloj='23:40')
esc('narr', [
  ('cocina;P=sorprendido@0.6;X=normal@0.25~inv', 'Pero tu perro no se deja engañar. Te huele.'),
  ('cocina;P=enojado@0.5', 'Le ladra al aire durante cinco minutos seguidos.'),
  ('cocina;M=pensando@0.6;P=enojado@0.3', '—¿Y a este perro qué le pasa? —dice tu mamá.'),
], reloj='23:20')
# 3 LA TOSTADA
esc('narr', [
  ('cocina;X=normal@0.35~inv;fx:tostada', 'Tienes hambre. Agarras una tostada.'),
  ('cocina;H=sorprendido@0.62;X=normal@0.3~inv;fx:tostada', 'Tu hermano levanta la vista y ve una tostada flotando en el aire.'),
  ('cocina;H=sorprendido@0.5;cu', 'Una tostada. Flotando. Mordiéndose sola.'),
  ('cocina;H=llorando@0.4;M=enojado@0.7', '—¡Mamá! ¡La tostada está embrujada! —Deja de inventar y come.'),
  ('cocina;X=riendo@0.5~inv;cu', 'Primer punto para el poder.'),
], reloj='23:05')
# 4 EL CAMINO
esc('narr', [
  ('calle;X=riendo@0.5~inv', 'En la calle te das cuenta de algo: nadie te ve, así que nadie te juzga.'),
  ('calle;X=riendo@0.5~inv;cu', 'Bailas en la acera. Haces caras. Cantas en voz alta.'),
  ('calle;K=sorprendido@0.6;X=riendo@0.25~inv', 'El señor del kiosco escucha una canción que sale de la nada y se persigna.'),
  ('calle;X=riendo@0.5~inv', 'Una paloma camina directo hacia ti, choca con tu zapato y se queda mirándote como si hubiera visto un fantasma.'),
  ('entrada;D=enojado@0.6;X=normal@0.25~inv', 'Llegas al colegio. La directora vigila la puerta como siempre.'),
  ('entrada;X=riendo@0.5~inv;cu', 'Pasas a su lado tarde, sin uniforme completo, y no pasa nada. Nada.'),
], reloj='22:30')
# 5 EL EXAMEN
esc('narr', [
  ('salon;T=normal@0.6;X=normal@0.25~inv', 'En clase el profesor pasa lista. Dice tu nombre. Nadie responde.'),
  ('salon;T=enojado@0.5;cu;ui:AUSENTE', '—Ausente. Otra vez.'),
  ('salon;X=pensando@0.5~inv;fx:examen', 'Y entonces lo ves: sobre su escritorio, las respuestas del examen de mañana.'),
  ('salon;X=pensando@0.5~inv;cu', 'Nadie te vería. Nadie lo sabría nunca.'),
  ('salon;X=normal@0.5~inv', 'Lo piensas un segundo… y te alejas del escritorio.'),
  ('salon;X=riendo@0.5~inv;cu', 'Ser invisible no te convierte en otra persona. Solo hace más fácil que se note quién eres de verdad.'),
], reloj='20:15')
# 5b LA BROMA
esc('narr', [
  ('salon;T=normal@0.6;X=riendo@0.25~inv', 'Claro que no todo es tan noble. Hay que aprovechar un poco.'),
  ('salon;T=sorprendido@0.5;cu', 'Le escondes la tiza al profesor. Él busca en su bolsillo, en el escritorio, debajo de la silla.'),
  ('salon;X=riendo@0.5~inv;cu', 'Se la devuelves justo delante de él, sobre el libro.'),
  ('salon;T=sorprendido@0.6;X=riendo@0.25~inv', 'El profesor la mira, se quita las gafas, se las vuelve a poner… y decide que mejor hoy da clase sin tiza.'),
  ('salon;C=riendo@0.4;MT=riendo@0.72', 'Media clase se ríe sin saber de qué. Y tú te ríes más fuerte que todos, porque nadie te escucha.'),
], reloj='19:30')
# 5c EL COMEDOR
esc('narr', [
  ('comedor;X=normal@0.5~inv', 'En el almuerzo descubres el lado malo: no puedes comprar comida.'),
  ('comedor;X=preocupado@0.5~inv;cu', 'Intentas pedir una pizza. La señora de la cafetería escucha una voz, grita y cierra la ventanilla.'),
  ('comedor;C=normal@0.62;X=normal@0.28~inv', 'Te sientas junto a Camila, como siempre. Ella deja un pedazo de pan en tu lugar vacío, por costumbre.'),
  ('comedor;X=sonrojado@0.5~inv;cu', 'Te lo comes. Ella mira el plato vacío, frunce el ceño… y sonríe como si supiera algo.'),
  ('comedor;C=pensando@0.5;cu', '—Qué raro —dice—. Juraría que hoy estás aquí.'),
], reloj='18:50')
# 6 LO QUE DICEN DE TI
esc('narr', [
  ('pasillo;MT=normal@0.3;C=normal@0.68;X=normal@0.5~inv', 'En el pasillo pasa algo que no esperabas: escuchas lo que dicen de ti cuando no estás.'),
  ('pasillo;MT=riendo@0.5;cu', 'Mateo, el popular, dice: —El de la gorra es buena gente. El otro día me ayudó con mates.'),
  ('pasillo;X=sorprendido@0.5~inv;cu', 'Mateo. Sabe que existes.'),
  ('pasillo;C=preocupado@0.5;cu', 'Camila mira tu silla vacía y dice: —Qué raro que no vino. Le voy a escribir.'),
  ('pasillo;X=sonrojado@0.5~inv', 'Tu celular vibra en tu bolsillo. "¿Estás bien?". Es ella.'),
], reloj='17:40')
# 7 SOFÍA
esc('narr', [
  ('biblio;S=normal@0.62;X=normal@0.28~inv', 'En la biblioteca está Sofía, en la mesa de siempre, dibujando.'),
  ('biblio;X=sonrojado@0.5~inv', 'Te acercas despacio. Por primera vez puedes mirar su cuaderno sin que lo cierre de golpe.'),
  ('neutro;fx:dibujos', 'Es un dibujo tuyo. Con la gorra. Sonriendo.'),
  ('biblio;S=sonrojado@0.5;cu', 'Ella suspira y dice bajito: —Ojalá hubiera venido hoy.'),
  ('biblio;X=sonrojado@0.5~inv;cu', 'Sin pensarlo, respondes: —Aquí estoy.'),
  ('biblio;S=sorprendido@0.5;cu', 'Sofía da un salto, mira a todos lados… y no ve a nadie.'),
  ('biblio;X=preocupado@0.5~inv', 'Sales corriendo antes de arruinarlo más.'),
], reloj='14:20')
# 8 EL MIEDO
esc('susp', [
  ('noche;X=preocupado@0.5~inv', 'Por la tarde, la gracia se acaba.'),
  ('noche;X=pensando@0.5~inv;cu', 'Nadie te habla. Nadie te mira. Comes solo. Caminas solo.'),
  ('noche;X=preocupado@0.5~inv;cu', 'Y empiezas a pensar: ¿y si no vuelvo? ¿Y si me quedo así para siempre?'),
  ('cuarto;M=preocupado@0.5;cu', 'Escuchas a tu mamá llamando a tus amigos, preguntando por ti, con la voz cada vez más nerviosa.'),
  ('cuarto;X=llorando@0.5~inv;cu', 'Le gritas que estás ahí. Que estás bien. Pero ella no te escucha. O no quiere creer lo que escucha.'),
  ('neutro;ui:¿Y SI NO VUELVO?', 'Ser invisible sonaba increíble. Hasta que entiendes que lo mejor de existir es que alguien te vea.'),
], reloj='08:00')
# 9 EL HÉROE
esc('narr', [
  ('calle;H=riendo@0.4;X=normal@0.75~inv', 'De regreso a casa ves a tu hermano jugando con una pelota cerca de la calle.'),
  ('calle;H=riendo@0.5;fx:pelota', 'La pelota rueda hacia la pista. Él corre detrás sin mirar.'),
  ('calle;H=sorprendido@0.5;cu', 'Un carro viene a toda velocidad.'),
  ('calle;X=enojado@0.5~inv;cu', 'No lo piensas. Corres más rápido que nunca y lo jalas hacia la acera.'),
  ('calle;H=llorando@0.5;cu', 'El carro pasa a centímetros. Tu hermano mira alrededor, temblando, sin entender quién lo salvó.'),
  ('calle;H=llorando@0.4;X=llorando@0.7~inv', 'Y dice, bajito: —Gracias… seas quien seas.'),
], reloj='04:10')
# 10 MEDIANOCHE
esc('susp', [
  ('noche;X=pensando@0.5~inv', 'Esa noche te sientas en tu cama a esperar.'),
  ('noche;fx:cuenta', 'Once y cincuenta y nueve. Tres… dos… uno…'),
  ('noche;X=sorprendido@0.5;fx:brillo', 'Un cosquilleo te recorre el cuerpo. Miras tus manos. Ahí están.'),
  ('cuarto;M=llorando@0.62!saluda;X=riendo@0.3', 'Bajas corriendo y abrazas a tu mamá tan fuerte que casi se le cae el café.'),
  ('cocina;P=riendo@0.5', 'Tu perro, por fin, deja de ladrarle al aire.'),
], reloj='00:00')
# 11 CIERRE
esc('narr', [
  ('salon;X=riendo@0.3;C=riendo@0.68', 'Al día siguiente le respondes a Camila. Le das las gracias a Mateo.'),
  ('biblio;X=sonrojado@0.3;S=sonrojado@0.68', 'Y a Sofía le dices: —Ayer sí vine. Solo que no me viste.'),
  ('biblio;S=riendo@0.5;cu', 'Ella se ríe sin entender nada. Pero sonríe.'),
  ('patio;X=riendo@0.5;fx:brillo', 'Porque no necesitas ser invisible para descubrir quién te quiere. Solo necesitas fijarte.'),
  ('neutro;X=pensando@0.5;ui:¿QUÉ HARÍAS TÚ?', 'Y tú, si fueras invisible por veinticuatro horas, ¿qué harías primero? Te leo en los comentarios.'),
])
json.dump(E, open(__file__.replace('guion.py', 'escenas.json'), 'w'), ensure_ascii=False, indent=1)
print(len(E), 'escenas', sum(len(e['planos']) for e in E), 'planos', sum(len(e['texto'].split()) for e in E), 'palabras')
