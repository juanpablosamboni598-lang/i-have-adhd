"""v32 · ¿Qué pasaría si viajaras a la Segunda Guerra Mundial con IQ infinito? — historia con datos reales (motor index32).
Tono respetuoso: sin violencia gráfica ni símbolos. Datos: Blitz (1940-41), refugios en el metro de Londres, Bletchley Park,
Enigma (~159 trillones de trillones de combinaciones, clave nueva cada medianoche), la Bomba de Turing (1940), ~75 % del personal de
Bletchley eran mujeres, los partes del clima como 'pistas', Ultra y los convoyes del Atlántico, Hinsley: ~2 años menos de guerra (estimado).
Tokens: th:TEXTO nube de pensamiento; fx:ecuaciones, fx:enigma, fx:reflectores, fx:mapa, fx:convoy, fx:foto; p.chip = ['IQ','∞','NIVEL']."""
import json
E = []
def esc(voz, planos, flash=False, chip=True):
    E.append({'tipo': 'planos', 'titulo': '', 'voz': voz, 'texto': ' '.join(f for _, f in planos),
              'planos': [{'v': a, 'f': f} for a, f in planos], 'p': {'esc': None, 'med': None, 'flash': flash, 'chip': ['IQ', '∞', 'NIVEL'] if chip else None},
              'sfx': [[0.05, 'whoosh']]})
# 1 GANCHO
esc('susp', [
  ('noche;X=sorprendido@0.5;fx:reflectores', 'Imagina que abres los ojos y suenan sirenas. Es Londres. Año mil novecientos cuarenta y uno.'),
  ('londres;X=sorprendido@0.5;cu', 'Estás en plena Segunda Guerra Mundial.'),
  ('neutro;X=pensando@0.5;fx:ecuaciones', 'Pero hay algo más: tu cerebro funciona distinto. Ves todo como números. Ecuaciones. Patrones.'),
  ('neutro;X=normal@0.5;cu;th:IQ = ∞', 'Tienes un IQ infinito.'),
  ('neutro;X=pensando@0.5;ui:¿QUÉ HARÍAS?', '¿Podrías cambiar la historia? ¿Y deberías?'),
], chip=False)
esc('narr', [('tit', '¿Qué pasaría si viajaras a la Segunda Guerra Mundial con IQ infinito?')], flash=True, chip=False)
# 2 EL BLITZ
esc('narr', [
  ('londres;X=preocupado@0.5', 'Las calles están llenas de sacos de arena. En el cielo flotan globos gigantes para estorbar a los aviones.'),
  ('londres;M=preocupado@0.62;H=llorando@0.78;X=normal@0.25', 'La gente corre hacia el metro. Durante el Blitz, miles de londinenses dormían en las estaciones para protegerse.'),
  ('londres;X=pensando@0.5;cu;th:refugio más cercano: 340 m', 'Tu cerebro calcula en un segundo la ruta más rápida al refugio.'),
  ('londres;X=enojado@0.4;M=preocupado@0.7', 'Ves a una mamá con su hijo, perdidos. Los tomas de la mano y los guías entre el humo.'),
  ('refugio;M=llorando@0.62;H=riendo@0.78;X=sonrojado@0.28', 'Llegan al andén justo a tiempo. La señora te da las gracias llorando.'),
  ('refugio;H=riendo@0.5;cu', 'Bajo tierra, cientos de personas comparten mantas, té y canciones para no escuchar las explosiones de arriba.'),
  ('refugio;X=pensando@0.5;cu;th:nadie aquí se rinde…', 'Nadie llora en voz alta. Los niños juegan a las cartas. Y tú piensas que eso también es una forma de valentía.'),
])
# 3 EL SOSPECHOSO
esc('narr', [
  ('refugio;K=enojado@0.62;X=preocupado@0.28', 'Pero un policía te mira raro. Gorra rara, sudadera rara, hablas raro.'),
  ('refugio;K=enojado@0.5;cu', '—Usted viene conmigo. Puede ser un espía.'),
  ('neutro;X=pensando@0.5;fx:ecuaciones', 'En la comisaría, para demostrar quién eres, resuelves en un minuto un problema de matemáticas que llevaba semanas en un periódico.'),
  ('neutro;K=sorprendido@0.5;cu', 'El policía hace una llamada. Y esa misma noche, un auto negro te lleva fuera de Londres.'),
])
# 4 BLETCHLEY
esc('narr', [
  ('bletchley;X=sorprendido@0.5', 'Te llevan a Bletchley Park, una mansión rodeada de barracas de madera.'),
  ('bletchley;D=normal@0.62;X=normal@0.28;ui:ALTO SECRETO', 'La comandante te explica en voz baja: aquí se intentan leer los mensajes secretos del enemigo.'),
  ('neutro;fx:enigma', 'Esos mensajes se cifran con una máquina llamada Enigma. Cada letra que escribes se convierte en otra.'),
  ('neutro;fx:enigma;ui:159 TRILLONES DE TRILLONES', 'Tiene unos ciento cincuenta y nueve trillones de trillones de combinaciones posibles. Y la clave cambia cada medianoche.'),
  ('bletchley;T=pensando@0.62;X=normal@0.28', 'Ahí conoces a Alan Turing, un matemático que en mil novecientos cuarenta construyó una máquina enorme para probar combinaciones: la Bomba.'),
])
# 5 EL CEREBRO
esc('narr', [
  ('bletchley;X=pensando@0.5;cu;th:las teclas nunca se cifran a sí mismas…', 'Miras un mensaje cifrado y tu cerebro empieza a girar como mil Bombas al mismo tiempo.'),
  ('neutro;X=pensando@0.5;fx:ecuaciones', 'Encuentras patrones que nadie ve. Descartas millones de combinaciones por segundo.'),
  ('bletchley;X=riendo@0.5;cu', 'En diez minutos tienes la clave del día.'),
  ('bletchley;T=sorprendido@0.62;X=riendo@0.28', 'Turing te mira, se quita los lentes y pregunta despacio: —¿Cómo lo hizo?'),
  ('bletchley;X=sonrojado@0.5;cu', 'No puedes decirle que vienes del futuro. Así que dices lo único que se te ocurre: —Intuición.'),
  ('bletchley;T=riendo@0.5;cu', 'Turing sonríe. Él también sabe lo que es pensar distinto a los demás. Desde ese día te deja sentarte a su lado.'),
])
# 6 SOFÍA
esc('narr', [
  ('bletchley;S=enojado@0.62;X=normal@0.28', 'En la barraca hay una joven que no se impresiona. Se llama Sofía.'),
  ('bletchley;S=enojado@0.5;cu;ui:3 DE CADA 4', 'Dato real: cerca de tres de cada cuatro personas que trabajaban en Bletchley eran mujeres.'),
  ('bletchley;S=pensando@0.5;cu', 'Sofía lleva meses descifrando mensajes a mano. Y no le gusta que un recién llegado presuma.'),
  ('bletchley;X=riendo@0.3;S=enojado@0.68', 'Te reta: —Si eres tan listo, descifra este. Es de un barco en el Atlántico.'),
  ('bletchley;X=pensando@0.5;cu;th:no hay patrón…', 'Por primera vez, tu cerebro se traba. El mensaje es demasiado corto.'),
  ('bletchley;S=riendo@0.5;cu', 'Sofía sonríe y te pasa un papel: —Los barcos siempre mandan el parte del clima a la misma hora. Empieza por ahí.'),
  ('bletchley;X=sorprendido@0.5;cu;th:¡el clima! ¡claro!', 'Era verdad. En Bletchley usaban esas frases repetidas como pistas. Lo que tú no viste, ella lo sabía por experiencia.'),
])
# 7 EL DILEMA
esc('susp', [
  ('noche;X=pensando@0.5', 'Esa noche no duermes. Con tu cerebro podrías inventar armas, aviones, cosas que todavía no existen.'),
  ('noche;X=preocupado@0.5;cu;th:¿y si lo empeoro todo?', 'Pero también sabes cómo termina la guerra. Y si cambias demasiado… la historia podría salir peor.'),
  ('noche;X=pensando@0.5;cu', 'Decides algo difícil: no vas a jugar a ser un superhéroe. Vas a ayudar en silencio, como todos los demás aquí.'),
])
# 8 EL CONVOY
esc('narr', [
  ('bletchley;S=sorprendido@0.62;X=preocupado@0.28', 'Una madrugada llega un mensaje urgente. Lo descifran juntos: tú los cálculos, Sofía las pistas.'),
  ('neutro;fx:mapa', 'Submarinos esperando a un convoy de barcos con comida y medicinas en medio del Atlántico.'),
  ('bletchley;D=preocupado@0.5;cu', 'La comandante pasa el aviso. Los barcos cambian de ruta en plena noche.'),
  ('neutro;fx:convoy', 'Este tipo de información secreta, llamada Ultra, ayudó de verdad a desviar convoyes y salvar miles de vidas.'),
  ('bletchley;X=riendo@0.3;S=riendo@0.68;fx:brillo', 'Al amanecer llega la noticia: el convoy llegó a salvo. Sofía te abraza sin pensarlo. Luego se suelta, roja como un tomate.'),
])
# 9 LA LECCIÓN
esc('narr', [
  ('bletchley;X=sonrojado@0.5;cu', 'Y entiendes algo que ningún IQ infinito te había enseñado.'),
  ('bletchley;T=riendo@0.3;S=riendo@0.55;D=riendo@0.8', 'La guerra no la ganó un genio solo. La ganaron miles de personas comunes, trabajando juntas, en secreto, sin recibir ningún aplauso.'),
  ('neutro;ui:~2 AÑOS MENOS', 'Algunos historiadores calculan que descifrar Enigma acortó la guerra unos dos años. Es una estimación, pero son millones de vidas.'),
])
# 10 EL REGRESO
esc('susp', [
  ('noche;X=pensando@0.5;fx:reflectores', 'Una noche, mientras miras los reflectores en el cielo, todo se vuelve blanco.'),
  ('cuarto;X=sorprendido@0.5', 'Despiertas en tu cuarto. Año dos mil veintiséis. Tu cerebro vuelve a ser normal.'),
  ('museo;X=normal@0.5', 'Meses después visitas el museo de Bletchley Park. Hay una foto de mil novecientos cuarenta y uno colgada en la pared.'),
  ('museo;fx:foto', 'Un grupo de descifradores sonriendo. Una chica con una pinza de estrella. Y a su lado, un chico con una gorra muy rara.'),
  ('museo;X=sorprendido@0.5;cu', 'Esa gorra es la tuya.'),
], chip=False)
# 11 CIERRE
esc('narr', [
  ('museo;X=sonrojado@0.5;cu', 'Ser el más inteligente no sirve de mucho si no sabes escuchar a los demás.'),
  ('neutro;X=pensando@0.5;ui:¿A QUÉ ÉPOCA IRÍAS?', 'Y tú, si tuvieras un IQ infinito, ¿a qué época de la historia viajarías primero? Te leo en los comentarios.'),
], chip=False)
json.dump(E, open(__file__.replace('guion.py', 'escenas.json'), 'w'), ensure_ascii=False, indent=1)
print(len(E), 'escenas', sum(len(e['planos']) for e in E), 'planos', sum(len(e['texto'].split()) for e in E), 'palabras')
