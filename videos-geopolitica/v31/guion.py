"""v31 · ¿Qué pasaría si tu crush pudiera escuchar tus pensamientos? — historia (motor index31 = index30 + pensamientos).
Tokens nuevos: 'th:TEXTO' = nube de pensamiento de Xeno; 'fx:rayo' = rayo de luz rosa de la cabeza de Xeno a Sofía (estilo IFNation).
p.chip = ['PENSAMIENTOS', 'N', 'OÍDOS']."""
import json
E = []
def esc(voz, planos, flash=False, n=None):
    E.append({'tipo': 'planos', 'titulo': '', 'voz': voz, 'texto': ' '.join(f for _, f in planos),
              'planos': [{'v': a, 'f': f} for a, f in planos], 'p': {'esc': None, 'med': None, 'flash': flash, 'chip': ['PENSAMIENTOS', str(n), 'OÍDOS'] if n is not None else None},
              'sfx': [[0.05, 'whoosh']]})
# 1 GANCHO
esc('susp', [
  ('salon;X=normal@0.3;S=normal@0.68', 'Imagina que la persona que te gusta pudiera escuchar todo lo que piensas.'),
  ('salon;X=sorprendido@0.5;cu', 'Todo. Cada pensamiento. Cada uno.'),
  ('salon;X=sonrojado@0.3;S=sorprendido@0.68;fx:rayo', 'El problema es que tú piensas en ella… todo el tiempo.'),
  ('neutro;X=preocupado@0.5;cu;th:no pienses en ella…', 'Y no hay forma de apagarlo.'),
])
esc('narr', [('tit', '¿Qué pasaría si tu crush pudiera escuchar tus pensamientos?')], flash=True)
# 2 EL PRIMER PENSAMIENTO
esc('narr', [
  ('entrada;X=normal@0.5', 'Es un lunes normal. Llegas al colegio medio dormido, con la gorra torcida.'),
  ('entrada;S=riendo@0.62;X=sonrojado@0.28', 'Y ahí está Sofía, en la entrada, riéndose con sus amigas.'),
  ('entrada;X=sonrojado@0.5;cu;th:qué bonita se ve hoy…', 'Y piensas, sin querer: "Qué bonita se ve hoy".'),
  ('entrada;S=sorprendido@0.62;X=sorprendido@0.28;fx:rayo', 'Sofía se da la vuelta de golpe. Te mira. Se pone roja como un tomate.'),
  ('entrada;S=sonrojado@0.5;cu', '—¿Qué dijiste?'),
  ('entrada;X=sorprendido@0.5;cu', 'Tú no dijiste nada. Ni una palabra.'),
], n=1)
# 3 LA PRUEBA
esc('narr', [
  ('salon;X=pensando@0.5', 'En clase decides hacer una prueba. Te sientas detrás de ella y piensas, muy fuerte, una sola palabra.'),
  ('salon;X=pensando@0.5;cu;th:PIZZA', 'Pizza.'),
  ('salon;S=pensando@0.5;cu', 'Sofía se da la vuelta y susurra: —¿Pizza?'),
  ('salon;X=sorprendido@0.5;cu', 'Ay, no.'),
  ('salon;X=preocupado@0.3;S=normal@0.68;fx:rayo', 'Ella puede escuchar tus pensamientos. Solo ella. Y solo los tuyos.'),
], n=2)
esc('narr', [
  ('salon;X=preocupado@0.5;cu', 'Entras en pánico. Intentas no pensar en nada.'),
  ('salon;X=preocupado@0.5;cu;th:no pienses en su pelo…', 'Pero cuando intentas no pensar en algo… es lo único en lo que piensas.'),
  ('salon;X=llorando@0.5;cu;th:ni en su pinza de estrella…', 'No pienses en su pelo. No pienses en su pinza de estrella. No pienses en cómo se ríe.'),
  ('salon;S=riendo@0.5;cu', 'Sofía se tapa la boca para no reírse.'),
], n=5)
# 4 LA CLASE
esc('narr', [
  ('salon;T=normal@0.6;X=pensando@0.25', 'El profesor explica fracciones. Tú intentas concentrarte.'),
  ('salon;X=pensando@0.5;cu;th:su pinza brilla… como ella', 'Pero tu cerebro decide hacer poesía: "Su pinza de estrella brilla… como ella".'),
  ('salon;S=riendo@0.5;cu', 'Sofía suelta una carcajada en plena clase.'),
  ('salon;T=enojado@0.5;cu', '—Señorita, ¿le parecen graciosas las fracciones?'),
  ('salon;S=sonrojado@0.62;X=sonrojado@0.28', '—No, profe… perdón.'),
], n=7)
esc('narr', [
  ('salon;X=pensando@0.5;cu;th:ojalá me hablara…', 'Te hundes en tu silla y piensas, triste: "Ojalá algún día me hablara".'),
  ('salon;S=normal@0.62;X=normal@0.28;fx:carta', 'Dos segundos después, un papelito cae sobre tu pupitre.'),
  ('neutro;fx:carta', 'Dice: "Te estoy hablando, tonto".'),
  ('salon;X=sorprendido@0.5;cu', 'Tu cerebro se apaga por completo. Y por primera vez en todo el día, no piensas en nada.'),
], n=9)
# 4b LA EXPOSICIÓN
esc('narr', [
  ('salon;T=normal@0.5;cu', 'Y como el universo tiene sentido del humor, el profesor anuncia: —Hoy hay exposiciones. Empieza… usted.'),
  ('salon;X=sorprendido@0.5;cu', 'Te toca a ti. Delante de toda la clase. Delante de ella.'),
  ('salon;X=preocupado@0.5;ui:EXPOSICIÓN', 'Te paras frente al pizarrón. Te tiemblan las piernas.'),
  ('salon;X=preocupado@0.5;cu;th:no la mires, no la mires…', 'Y tu cabeza no ayuda: "No la mires, no la mires, no la mires…".'),
  ('salon;S=riendo@0.5;cu', 'La miras. Ella te levanta el pulgar.'),
  ('salon;X=riendo@0.5;cu;th:¡me levantó el pulgar!', 'Y de repente, la exposición te sale perfecta. Sacas la mejor nota de la clase.'),
], n=11)
# 4c CAMILA
esc('narr', [
  ('comedor;C=pensando@0.62;X=normal@0.28', 'Tu mejor amiga, Camila, te mira con los ojos entrecerrados.'),
  ('comedor;C=pensando@0.5;cu', '—Hoy estás rarísimo. Y Sofía no deja de mirarte. ¿Qué está pasando?'),
  ('comedor;X=sonrojado@0.5;cu;th:no le digas, no le digas…', 'Piensas: "No le digas, no le digas". Pero Camila te conoce desde el kínder.'),
  ('comedor;C=riendo@0.5;cu', '—Ay, por fin. Ya era hora de que ella se diera cuenta. Llevas meses suspirando como una novela.'),
], n=12)
# 5 MATEO
esc('narr', [
  ('patio;MT=riendo@0.3;S=normal@0.68', 'En el recreo, Mateo, el capitán del equipo, se acerca a Sofía.'),
  ('patio;MT=sonrojado@0.5;cu', '—Oye, el sábado hay una fiesta en mi casa. ¿Quieres venir?'),
  ('patio;X=enojado@0.5;cu;th:dile que no…', 'Y tú, desde lejos, piensas sin poder evitarlo: "Dile que no, dile que no, dile que no".'),
  ('patio;X=preocupado@0.5;cu;th:…o mejor que sea feliz', 'Y luego, más bajito: "No… mejor que haga lo que la haga feliz".'),
  ('patio;S=pensando@0.62;X=preocupado@0.28;fx:rayo', 'Sofía escuchó las dos cosas.'),
  ('patio;S=riendo@0.5;cu', 'Le sonríe a Mateo y le dice: —Gracias, pero el sábado ya tengo planes.'),
], n=13)
# 6 LA CAFETERÍA
esc('narr', [
  ('comedor;X=normal@0.5', 'En la cafetería se te ocurre un plan genial para esconder tus pensamientos.'),
  ('comedor;X=riendo@0.5;cu;th:A, B, C, D, E…', 'Cantas el abecedario en tu cabeza. Una y otra vez.'),
  ('comedor;S=riendo@0.62;X=riendo@0.28', 'Sofía pasa junto a tu mesa y te susurra: —Te saltaste la eme.'),
  ('comedor;X=llorando@0.5;cu', 'Ya está. Lo sabe. Sabe que puedes saber que ella sabe.'),
], n=15)
# 7 LA HUIDA
esc('susp', [
  ('pasillo;X=llorando@0.5', 'Sales corriendo del colegio.'),
  ('calle;X=preocupado@0.5;fx:lluvia', 'Caminas a casa repasando todo lo que pensaste hoy. Lo bonita que se ve. Lo de la pizza. Lo de Mateo.'),
  ('calle;X=llorando@0.5;cu;fx:lluvia', 'Cada pensamiento te da más vergüenza que el anterior. Si pudieras, te mudarías a otro país. A otro planeta.'),
  ('cocina;M=preocupado@0.62;X=llorando@0.28', 'Tu mamá te ve entrar empapado y te pregunta qué te pasó. Le dices que nada. Ella no te cree, pero te prepara chocolate caliente igual.'),
  ('noche;X=llorando@0.5;cu;th:ya arruiné todo…', 'Te tiras en la cama y piensas: "Ya arruiné todo".'),
  ('noche;X=pensando@0.5;cu', 'Pero entonces se te ocurre algo. Si ella puede escuchar lo que piensas… también puede escuchar la verdad completa.'),
], n=16)
# 8 LA VERDAD
esc('narr', [
  ('biblio;S=normal@0.65;X=normal@0.28', 'Al día siguiente la encuentras en la biblioteca. Te sientas frente a ella.'),
  ('biblio;X=sonrojado@0.5;cu', 'No dices ni una palabra. Solo la miras… y piensas.'),
  ('biblio;X=sonrojado@0.5;cu;th:desde la primera vez que te vi…', 'Piensas en la primera vez que la viste dibujando junto a la ventana.'),
  ('biblio;X=sonrojado@0.3;S=sonrojado@0.68;fx:rayo', 'En los seis meses que pasaste ensayando un "hola". En lo mucho que te gusta cómo se ríe.'),
  ('biblio;S=llorando@0.5;cu', 'Sofía baja la mirada. Tiene los ojos brillantes.'),
  ('biblio;S=sonrojado@0.5;cu', 'Y entonces te pregunta: —¿Quieres saber qué estoy pensando yo?'),
], n=17)
esc('susp', [
  ('biblio;X=sorprendido@0.5;cu', 'Por un segundo, todo se queda en silencio.'),
  ('biblio;S=sonrojado@0.5;cu;th:por fin…', 'Y por primera vez, eres tú quien escucha un pensamiento que no es tuyo: "Por fin".'),
  ('biblio;X=riendo@0.3;S=riendo@0.68;fx:brillo', 'Los dos se ríen tan fuerte que la bibliotecaria los manda a callar.'),
], n=18)
# 9 CIERRE
esc('narr', [
  ('cuarto;X=normal@0.5', 'A la mañana siguiente, el poder desaparece. Sofía ya no escucha lo que piensas.'),
  ('patio;X=riendo@0.32;S=riendo@0.68;fx:brillo', 'Pero ya no hace falta. Porque ahora se lo dices en voz alta.'),
  ('patio;S=riendo@0.5;cu', 'Ella te cuenta que también ensayaba "holas" en el espejo. Que también dibujaba pensando en ti. Que también tenía miedo.'),
  ('patio;X=sonrojado@0.5;cu', 'A veces lo que más miedo nos da decir… es justo lo que la otra persona necesita escuchar.'),
  ('neutro;X=pensando@0.5;ui:¿QUÉ PENSARÍAS?', 'Y tú, si tu crush pudiera escuchar un solo pensamiento tuyo, ¿cuál sería? Te leo en los comentarios.'),
], n=0)
json.dump(E, open(__file__.replace('guion.py', 'escenas.json'), 'w'), ensure_ascii=False, indent=1)
print(len(E), 'escenas', sum(len(e['planos']) for e in E), 'planos', sum(len(e['texto'].split()) for e in E), 'palabras')
