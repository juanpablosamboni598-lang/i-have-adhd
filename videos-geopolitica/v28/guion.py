"""v28 · ¿Qué pasaría si pudieras ver quién está enamorado de ti? — historia, un plano por frase.
Visual: 'lugar;tok;tok…'. Tokens: X/S/C/M/H/P/T/D/MT/K = personaje (Xeno, Sofía, Camila, mamá, hermano, perro, profe, directora, Mateo, kiosquero)
con '=expresión@x' (x 0..1) y '!pose' opcional; 'n:X=95' corazón con número; 'n:S=?' interrogación; 'cu' primer plano; 'ui:TEXTO' rótulo;
'fx:nombre' efecto (caida, choque, poema, chat, lluvia, brillo)."""
import json
E = []
def esc(voz, planos, flash=False, titulo=''):
    E.append({'tipo': 'planos', 'titulo': titulo, 'voz': voz, 'texto': ' '.join(f for _, f in planos),
              'planos': [{'v': v, 'f': f} for v, f in planos], 'p': {'esc': titulo or None, 'med': None, 'flash': flash},
              'sfx': [[0.05, 'whoosh']]})
# 1 GANCHO
esc('susp', [
  ('cuarto;X=normal@0.5;cu', 'Imagina que mañana te despiertas'),
  ('calle;M=normal@0.25;K=normal@0.75;n:M=?;n:K=?', 'y, sobre la cabeza de cada persona, ves un número.'),
  ('neutro;ui:corazon;n:0=73', 'Un corazoncito con un porcentaje.'),
  ('neutro;X=sorprendido@0.5;cu', 'Ese número dice cuánto te quiere esa persona.'),
  ('salon;S=normal@0.62;X=sonrojado@0.3', 'Suena genial…'),
  ('salon;S=normal@0.55;n:S=?;cu', 'hasta que ves el número de la chica que te gusta.'),
])
esc('narr', [('tit', '¿Qué pasaría si pudieras ver quién está enamorado de ti?')], flash=True)
# 2 EL DESPERTAR
esc('narr', [
  ('cuarto;X=pensando@0.5', 'Abres los ojos. Te frotas la cara.'),
  ('cocina;M=riendo@0.62!saluda;X=normal@0.25', 'Bajas a la cocina y ahí está tu mamá, haciendo el desayuno.'),
  ('cocina;M=riendo@0.5;n:M=100;cu', 'Sobre su cabeza flota un corazón rosado que dice: cien por ciento.'),
  ('cocina;X=sorprendido@0.5;cu', 'Parpadeas. Sigue ahí.'),
  ('cocina;P=riendo@0.55;n:P=100', 'Tu perro entra corriendo: cien por ciento.'),
  ('cocina;H=riendo@0.4;X=enojado@0.72;n:H=42', 'Tu hermano menor te roba la última galleta: cuarenta y dos por ciento. Y bajando.'),
])
esc('narr', [
  ('cocina;X=sorprendido@0.3;M=normal@0.68', '—Mamá… ¿tú ves eso?'),
  ('cocina;M=riendo@0.5;cu', '—¿Ver qué, mi amor? Come, que llegas tarde.'),
  ('cocina;X=pensando@0.5;cu', 'Vale. Solo lo ves tú.'),
])
# 3 EL CAMINO A CLASE
esc('narr', [
  ('calle;K=riendo@0.6;X=normal@0.25;n:K=71', 'En la calle es todavía más raro. El señor del puesto de periódicos: setenta y uno.'),
  ('calle;M=riendo@0.55!saluda;n:M=80', 'La vecina que siempre te saluda: ochenta.'),
  ('calle;MT=enojado@0.6;X=preocupado@0.25;n:MT=3', 'El chico que te empujó en tercer grado: tres.'),
  ('calle;X=pensando@0.5;cu', 'Te das cuenta de que este poder es peligroso.'),
  ('calle;X=preocupado@0.5', 'Porque ahora vas a saber la verdad sobre todo el mundo.'),
])
esc('narr', [
  ('entrada;K=sonrojado@0.3;M=sonrojado@0.7;n:K=99;n:M=51', 'En la entrada del colegio es un festival de números. La pareja que se besa en las escaleras: él, noventa y nueve; ella, cincuenta y uno. Uy.'),
  ('entrada;MT=normal@0.6;X=preocupado@0.25;n:MT=0', 'El chico popular, Mateo, pasa a tu lado sin mirarte: cero.'),
  ('entrada;X=pensando@0.5;cu', 'No es odio. Es que ni sabe que existes.'),
  ('entrada;D=enojado@0.6;n:D=40', 'La directora te mira por encima de las gafas: cuarenta.'),
  ('entrada;X=riendo@0.5;cu', 'Bastante bien para alguien que te ha castigado tres veces.'),
  ('entrada;X=sonrojado@0.5;fx:brillo', 'Y solo hay una persona cuyo número te importa de verdad.'),
])
# 4 SOFÍA
esc('narr', [
  ('salon;S=normal@0.6;X=sonrojado@0.22', 'Llegas al salón. Ella está junto a la ventana, como siempre, dibujando en su cuaderno.'),
  ('salon;S=sonrojado@0.5;cu', 'Pinza de estrella. Cárdigan lila.'),
  ('salon;X=normal@0.5;cu', 'Respiras. Miras encima de su cabeza.'),
  ('salon;S=normal@0.5;n:S=?;cu', 'Y el número… no se ve.'),
  ('salon;S=normal@0.5;n:S=?', 'En vez de un porcentaje hay unos signos de interrogación que parpadean.'),
  ('salon;X=sorprendido@0.5;cu', 'Como si el sistema se hubiera trabado.'),
])
esc('narr', [
  ('salon;T=enojado@0.6;X=pensando@0.25;n:T=12', 'Te frotas los ojos. Miras a tu profesor: doce por ciento, qué novedad.'),
  ('salon;S=normal@0.5;n:S=?;cu', 'Miras otra vez a Sofía. Interrogación. Interrogación. Interrogación.'),
  ('salon;X=preocupado@0.5;cu', '¿Qué significa eso? ¿Que no le importas?'),
  ('salon;X=pensando@0.5', '¿Que el poder está roto?'),
])
# 5 EL EXPERIMENTO
esc('narr', [
  ('salon;X=pensando@0.5;ui:EXPERIMENTO', 'Decides investigar como un científico.'),
  ('salon;X=normal@0.5;ui:HIPÓTESIS', 'Si el número cambia según lo que hace la gente, tal vez puedas hacerlo aparecer.'),
  ('salon;X=sonrojado@0.3;S=sorprendido@0.68;n:S=?;ui:PRUEBA 1', 'Prueba uno: le prestas un lápiz. Interrogación.'),
  ('salon;X=riendo@0.3;S=riendo@0.68;n:S=?;ui:PRUEBA 2', 'Prueba dos: le cuentas tu mejor chiste. Ella se ríe un poquito.'),
  ('salon;S=riendo@0.5;n:S=?;cu', 'El símbolo parpadea más rápido… pero no cambia.'),
])
esc('narr', [
  ('pasillo;X=normal@0.4;ui:PRUEBA 3', 'Prueba tres: intentas hacerte el interesante apoyándote en la pared…'),
  ('pasillo;X=sorprendido@0.5;fx:caida', 'y la pared resulta ser una puerta que alguien abre. Te caes al pasillo delante de todo el mundo.'),
  ('pasillo;C=riendo@0.25;MT=riendo@0.75;n:C=+;n:MT=+', 'El número de media clase sube. De pura risa.'),
  ('salon;S=normal@0.5;n:S=?;cu', 'El de Sofía sigue sin aparecer.'),
])
esc('narr', [
  ('salon;X=sonrojado@0.5;fx:poema;ui:PRUEBA 4', 'Prueba cuatro, la desesperada: le escribes un poema en una servilleta.'),
  ('neutro;fx:poema', 'Rimas "Sofía" con "todavía", "alegría" y, sin saber por qué, "lavandería".'),
  ('salon;S=sonrojado@0.5;cu', 'Ella lo lee. Lo dobla con cuidado. Y lo guarda dentro de su cuaderno.'),
  ('salon;S=sonrojado@0.5;n:S=?!;cu', 'Interrogación. Pero esta vez, por un segundo, juras que viste un número asomarse antes de esconderse otra vez.'),
])
# 6 CAMILA
esc('narr', [
  ('comedor;C=riendo@0.62;X=normal@0.3', 'En el almuerzo se sienta a tu lado Camila, tu amiga desde el kínder.'),
  ('comedor;C=riendo@0.5;cu', 'La que te presta los apuntes. La que se acuerda de tu cumpleaños antes que tú.'),
  ('comedor;C=normal@0.5;n:C=?', 'Miras sobre su cabeza por pura costumbre.'),
  ('comedor;C=normal@0.5;n:C=95;cu', 'Noventa y cinco por ciento.'),
  ('comedor;X=sorprendido@0.5;cu', 'Te atragantas con el jugo.'),
])
esc('narr', [
  ('comedor;X=sorprendido@0.3;C=riendo@0.68;n:C=95', '¿Noventa y cinco? ¿Camila? Ella sigue hablando de un videojuego como si nada.'),
  ('comedor;X=pensando@0.5;cu', 'Y de repente lo entiendes: esta persona lleva años queriéndote… y nunca te diste cuenta.'),
  ('comedor;X=preocupado@0.5', 'Ahora tienes un problema mucho más grande que un número que no aparece.'),
])
# 7 EL DILEMA
esc('susp', [
  ('noche;X=pensando@0.5', 'Esa noche no duermes. Miras al techo.'),
  ('neutro;S=normal@0.3;C=riendo@0.7;n:S=?;n:C=95', 'Por un lado está Sofía, con su misterio. Por el otro está Camila, que te quiere de verdad.'),
  ('noche;X=preocupado@0.5;cu', 'Y entiendes algo incómodo: has pasado todo el día tratando de cambiar lo que otros sienten por ti…'),
  ('noche;X=pensando@0.5;cu', 'en vez de ser honesto con lo que sientes tú.'),
])
esc('narr', [
  ('noche;X=pensando@0.5;fx:chat', 'Abres el chat de Sofía y escribes "hola". Lo borras.'),
  ('neutro;fx:chat', 'Escribes "¿estás despierta?". Lo borras. Escribes un párrafo entero. Lo borras también.'),
  ('noche;X=sorprendido@0.5;fx:chat', 'A las tres de la mañana te llega un mensaje. Es de ella:'),
  ('neutro;fx:chat', '"¿Mañana me ayudas con el trabajo de ciencias? Tú explicas bonito".'),
  ('noche;X=sonrojado@0.5;cu', 'Lees "explicas bonito" catorce veces.'),
  ('noche;X=normal@0.5', 'Decides hacer dos cosas difíciles mañana.'),
])
# 8 CAMILA, LA CONVERSACIÓN
esc('narr', [
  ('patio;X=normal@0.3;C=normal@0.68', 'Primero hablas con Camila.'),
  ('patio;X=preocupado@0.5;cu', 'Le dices la verdad, con cuidado: que es tu mejor amiga, que es increíble,'),
  ('patio;X=sonrojado@0.5;cu', 'y que tu corazón está con otra persona.'),
  ('patio;C=llorando@0.5;n:C=95;cu', 'Ella baja la mirada. El número no baja. Sigue en noventa y cinco.'),
  ('patio;C=riendo@0.5;cu', '—Ya lo sabía, tonto —dice sonriendo—. Se te nota desde lejos. Ve a hablarle.'),
  ('patio;X=pensando@0.3;C=riendo@0.68', 'Y ahí entiendes que querer a alguien no siempre significa tenerlo.'),
  ('patio;C=riendo@0.5!saluda', 'A veces significa empujarlo hacia lo que lo hace feliz.'),
])
# 9 LA VERDAD
esc('narr', [
  ('biblio;S=normal@0.65;X=normal@0.28', 'Encuentras a Sofía en la biblioteca. Esta vez no haces trucos.'),
  ('biblio;X=sonrojado@0.5;cu', 'Te sientas y le dices: —Me gustas. Desde hace meses.'),
  ('biblio;X=preocupado@0.5;cu', 'Y no sé si yo te gusto, pero quería que lo supieras.'),
  ('biblio;S=sonrojado@0.5;cu', 'Silencio. Ella cierra el cuaderno. Te lo pasa.'),
  ('neutro;fx:dibujos', 'Está lleno de dibujos tuyos: en clase, en el pasillo, cayéndote por la puerta.'),
])
esc('susp', [
  ('biblio;S=pensando@0.5;n:S=?;cu', '—Mi número no te salía, ¿verdad? —pregunta ella.'),
  ('biblio;X=sorprendido@0.5;cu', 'Te quedas helado.'),
  ('biblio;S=sonrojado@0.5;cu', '—Es que yo tampoco sabía qué sentía —dice—. Hasta hoy.'),
  ('biblio;S=sonrojado@0.5;n:S=glitch;cu', 'Miras sobre su cabeza. Los signos de interrogación tiemblan… y se convierten en un número.'),
  ('biblio;S=riendo@0.62!saluda;X=sorprendido@0.3', 'Pero antes de que puedas leerlo, ella te tapa los ojos con las manos.'),
  ('biblio;S=riendo@0.5;cu', '—Algunas cosas —dice— es mejor descubrirlas sin poderes.'),
])
# 10 CIERRE
esc('narr', [
  ('cuarto;X=normal@0.5', 'A la mañana siguiente te despiertas. Los números ya no están. El poder desapareció.'),
  ('calle;X=riendo@0.5', 'Pero no lo necesitas.'),
  ('patio;X=riendo@0.32;S=riendo@0.68;fx:brillo', 'Porque ahora sabes que lo importante no es cuánto te quieren los demás…'),
  ('patio;X=sonrojado@0.5;cu', 'sino tener el valor de decir lo que sientes.'),
  ('neutro;X=pensando@0.5;ui:¿DE QUIÉN LO MIRARÍAS?', 'Y tú, si pudieras ver ese número, ¿de quién lo mirarías primero? Te leo en los comentarios.'),
])
json.dump(E, open(__file__.replace('guion.py', 'escenas.json'), 'w'), ensure_ascii=False, indent=1)
print(len(E), 'escenas', sum(len(e['planos']) for e in E), 'planos', sum(len(e['texto'].split()) for e in E), 'palabras')
