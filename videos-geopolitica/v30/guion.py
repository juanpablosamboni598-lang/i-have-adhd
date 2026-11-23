"""v30 · ¿Qué pasaría si te encontraras con tu crush en el PEOR momento? — historia (motor index30 = index29 + efectos nuevos).
Efectos nuevos: fx:alarma, fx:choque, fx:tostada, fx:chocolate, fx:carta, fx:lluvia, fx:dibujos, fx:calcetines. p.chip = ['VERGÜENZA', 'NN%']."""
import json
E = []
def esc(voz, planos, flash=False, v=None):
    E.append({'tipo': 'planos', 'titulo': '', 'voz': voz, 'texto': ' '.join(f for _, f in planos),
              'planos': [{'v': a, 'f': f} for a, f in planos], 'p': {'esc': None, 'med': None, 'flash': flash, 'chip': ['VERGÜENZA', f'{v}%'] if v is not None else None},
              'sfx': [[0.05, 'whoosh']]})
# 1 GANCHO
esc('susp', [
  ('biblio;S=normal@0.62;X=sonrojado@0.28', 'Imagina esto. Llevas seis meses enamorado de Sofía.'),
  ('biblio;X=sonrojado@0.5;cu', 'Seis meses mirándola de lejos en la biblioteca. Seis meses ensayando un "hola" que nunca dices.'),
  ('biblio;S=normal@0.5;cu', 'Sabes qué libros lee. Sabes que se sienta junto a la ventana. Sabes que dibuja cuando cree que nadie la ve.'),
  ('neutro;X=normal@0.5', 'Y hoy, por fin, la vas a ver frente a frente.'),
  ('neutro;X=sorprendido@0.5;cu', 'El problema es que hoy… todo te va a salir mal.'),
], v=0)
esc('narr', [('tit', '¿Qué pasaría si te encontraras con tu crush en el peor momento?')], flash=True)
# 2 LA MAÑANA
esc('narr', [
  ('cuarto;X=normal@0.5;fx:alarma', 'Suena la alarma. Son las siete y cuarenta. Tu clase empieza a las ocho.'),
  ('cuarto;X=sorprendido@0.5;cu', 'Saltas de la cama como si el piso quemara.'),
  ('cuarto;X=normal@0.5', 'Te pones lo primero que encuentras: la gorra de siempre, la sudadera verde…'),
  ('neutro;fx:calcetines', 'y un calcetín de cada color.'),
  ('cocina;X=normal@0.4;fx:tostada', 'Sales corriendo con una tostada en la boca, como en las películas.'),
  ('cocina;P=enojado@0.6;X=sorprendido@0.25', 'Solo que en las películas no te muerde un perro la mochila.'),
], v=10)
# 3 EL CHOQUE
esc('narr', [
  ('calle;X=sorprendido@0.4', 'Doblas la esquina a toda velocidad y…'),
  ('calle;fx:choque', '¡pum! Chocas con alguien. Libros por el suelo.'),
  ('calle;fx:tostada', 'Tu tostada vuela en cámara lenta… y aterriza, con la mantequilla hacia abajo, sobre un zapato blanco.'),
  ('calle;S=sorprendido@0.5;cu', 'Levantas la mirada. Pinza de estrella. Pelo largo. Cárdigan lila.'),
  ('calle;S=sorprendido@0.5', 'Es Sofía.'),
], v=35)
esc('narr', [
  ('calle;X=sorprendido@0.5;cu', 'Tu cerebro, que ensayó este momento quinientas veces, decide apagarse.'),
  ('calle;X=sonrojado@0.5;cu', 'Lo único que sale de tu boca es: —Hola… tostada.'),
  ('calle;S=pensando@0.62;X=sonrojado@0.28', 'Ella te mira. Tú miras la tostada.'),
  ('neutro;fx:tostada', 'La tostada no dice nada.'),
], v=55)
# 4 EL CUADERNO
esc('narr', [
  ('calle;X=preocupado@0.3;S=sorprendido@0.68', 'Te agachas para recoger sus libros. Ella también. Sus cabezas chocan.'),
  ('calle;S=sonrojado@0.5;cu', '—¡Perdón! —¡No, perdón tú! —No, yo dije perdón primero…'),
  ('neutro;fx:dibujos', 'Y ahí, entre los libros, ves algo: un cuaderno con dibujos. Muy buenos. De un chico con gorra.'),
  ('calle;X=pensando@0.5;cu', 'No le ves la cara al dibujo. Pero la gorra… se parece mucho a la tuya.'),
  ('calle;S=sonrojado@0.5;cu', 'Antes de que puedas preguntar, ella lo guarda rapidísimo, roja como un tomate, y se va.'),
  ('calle;X=pensando@0.5;fx:tostada', 'Tú te quedas en la acera con media tostada y una sola pregunta: ¿era yo?'),
], v=60)
# 5 LA CLASE
esc('narr', [
  ('salon;T=enojado@0.6;X=preocupado@0.25', 'Llegas tarde a clase. Todos te miran.'),
  ('salon;T=normal@0.5;cu', 'El profesor dice: —Hoy hacemos el trabajo en parejas. Y como llegaste tarde, te toca con la única que queda libre.'),
  ('salon;S=normal@0.5;cu', 'Te das la vuelta. Es Sofía.'),
  ('salon;X=preocupado@0.3;S=normal@0.68', 'Te sientas a su lado. Tu pierna empieza a temblar sola.'),
  ('salon;X=preocupado@0.5;cu', 'Tu mano suda tanto que el lápiz se te resbala tres veces.'),
  ('salon;S=riendo@0.5;cu', 'Ella te pasa un pañuelo sin decir nada. Y sonríe un poquito.'),
  ('salon;X=sonrojado@0.5;fx:brillo', 'Ese "poquito" te dura toda la semana.'),
], v=65)
# 6 EL DESASTRE
esc('narr', [
  ('salon;X=riendo@0.4', 'Para impresionarla, decides hablar de algo interesante.'),
  ('salon;X=riendo@0.5;cu;ui:3 CORAZONES', 'Te acuerdas de un video de ciencia y empiezas a explicar, muy seguro, cómo los pulpos tienen tres corazones.'),
  ('salon;X=riendo@0.5;cu', 'Hablas tan rápido y tan emocionado que no te das cuenta de que estás gritando.'),
  ('salon;T=enojado@0.6;X=sorprendido@0.25', 'Toda la clase se queda en silencio. El profesor te mira: —¿Terminaste?'),
  ('salon;MT=riendo@0.5;cu', 'Y desde el fondo alguien grita: —¡Se le nota que le gusta!'),
  ('salon;X=llorando@0.5;cu', 'Quieres que la Tierra te trague.'),
  ('salon;S=riendo@0.5;cu', 'Pero miras a Sofía… y no se está riendo de ti. Está tapándose la boca para no reírse contigo.'),
], v=90)
# 7 LA CAFETERÍA
esc('narr', [
  ('comedor;X=normal@0.5', 'Para terminar el trabajo, quedan en la cafetería de la esquina.'),
  ('comedor;X=pensando@0.5;cu', 'Llegas veinte minutos antes. Practicas cómo sentarte. Cómo sostener la taza. Cómo parecer normal.'),
  ('comedor;S=normal@0.62;X=sorprendido@0.3;fx:chocolate', 'Ella llega, se sienta, y lo primero que haces es tirar tu chocolate caliente encima de la mesa.'),
  ('comedor;X=llorando@0.5;cu', 'Encima de tus apuntes. Encima de tu dignidad.'),
  ('comedor;S=sorprendido@0.5;cu', 'Pero en vez de enojarse, Sofía saca su cuaderno para salvar la hoja… y sin querer lo deja abierto.'),
  ('neutro;fx:dibujos', 'Ahí están otra vez: la biblioteca, el parque, el chico de la gorra comiendo una tostada.'),
], v=95)
esc('narr', [
  ('comedor;X=sorprendido@0.5;cu', '—¿Ese… soy yo? —preguntas.'),
  ('comedor;S=sonrojado@0.5;cu', 'Ella cierra el cuaderno de golpe: —Es… un personaje. Inventado. Muy feo.'),
  ('comedor;X=riendo@0.5;cu', '—Ah. Bueno. Tiene buena gorra.'),
  ('comedor;X=riendo@0.3;S=riendo@0.68;fx:brillo', 'Por primera vez se ríen los dos al mismo tiempo.'),
  ('comedor;S=riendo@0.5;cu', 'Y descubres que a ella también le gustan los documentales de animales raros, que odia las aceitunas y que también ensaya conversaciones en el espejo.'),
  ('comedor;X=sonrojado@0.5', 'Por un rato se te olvida que estás nervioso.'),
], v=40)
# 8 EL MALENTENDIDO
esc('susp', [
  ('patio;S=normal@0.62;MT=sonrojado@0.3', 'A la salida, la ves hablando con Mateo, el capitán del equipo de fútbol.'),
  ('patio;MT=sonrojado@0.5;fx:carta;cu', 'Él le da una carta.'),
  ('patio;X=llorando@0.5;cu', 'Tu corazón se cae al piso.'),
  ('calle;X=llorando@0.5;fx:lluvia', 'Decides que ya está. Que no tienes oportunidad.'),
  ('calle;X=preocupado@0.5;fx:lluvia', 'Te pones los audífonos y caminas a casa bajo una lluvia que empezó justo en ese momento, porque claro, el universo también quiere drama.'),
], v=70)
# 9 LA SORPRESA
esc('narr', [
  ('pasillo;X=preocupado@0.5', 'Al día siguiente encuentras algo dentro de tu casillero. Una hoja doblada.'),
  ('neutro;fx:dibujos', 'Un dibujo. Un chico con gorra, con una tostada en la boca, chocando con una chica con pinza de estrella.'),
  ('pasillo;X=sorprendido@0.5;fx:carta;cu', 'Abajo dice: "La carta de Mateo era para mi amiga. Él es muy tímido. Como tú."'),
  ('pasillo;X=riendo@0.5;cu', '"Posdata: los pulpos sí tienen tres corazones. Lo busqué."'),
], v=30)
# 10 EL VALOR
esc('narr', [
  ('biblio;S=normal@0.65;X=normal@0.28', 'Esta vez no ensayas nada. La buscas en la biblioteca, en la mesa de siempre.'),
  ('biblio;X=sonrojado@0.5;cu', 'Te sientas frente a ella. Respiras. Y dices, por fin, bien clarito: —Hola, Sofía.'),
  ('biblio;S=riendo@0.5;cu', 'Ella levanta la vista, sonríe y responde: —Hola… tostada.'),
  ('biblio;X=riendo@0.3;S=riendo@0.68;fx:brillo', 'Los dos se ríen tan fuerte que la bibliotecaria los manda a callar.'),
  ('biblio;D=enojado@0.5;cu', '—¡Shhh!'),
], v=5)
# 11 CIERRE
esc('narr', [
  ('patio;X=riendo@0.32;S=riendo@0.68;fx:brillo', 'Y así, el peor día de tu vida se convirtió en el mejor.'),
  ('patio;X=sonrojado@0.5;cu', 'Porque a veces la persona que te gusta no necesita que seas perfecto. Solo necesita que seas tú…'),
  ('neutro;fx:calcetines', 'aunque llegues tarde, con un calcetín de cada color y sin tostada.'),
  ('neutro;X=pensando@0.5;ui:¿TU PEOR MOMENTO?', '¿Y tú? ¿Qué es lo más vergonzoso que te ha pasado frente a tu crush? Te leo en los comentarios.'),
], v=0)
json.dump(E, open(__file__.replace('guion.py', 'escenas.json'), 'w'), ensure_ascii=False, indent=1)
print(len(E), 'escenas', sum(len(e['planos']) for e in E), 'planos', sum(len(e['texto'].split()) for e in E), 'palabras')
