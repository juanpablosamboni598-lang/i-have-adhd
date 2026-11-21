"""v26 · ¿Qué pasaría si nunca se hubiera inventado el inodoro? — guion con un plano por frase.
Formato: cada escena es una lista de (visual, frase). El texto de la escena para la voz es la unión de las frases.
Visual = 'plantilla:arg1:arg2'. Plantillas: pg (lugar), pp (primer plano con bokeh), pd (objeto), inf (número o dato), card (capítulo), ficha (fuente histórica), tit (título)."""
import json
E = []
def esc(voz, esc_t, planos, med=None, flash=False):
    E.append({'tipo': 'planos', 'titulo': esc_t or '', 'voz': voz, 'texto': ' '.join(f for _, f in planos),
              'planos': [{'v': v, 'f': f} for v, f in planos], 'p': {'esc': esc_t, 'med': med, 'flash': flash},
              'sfx': [[0.05, 'whoosh']]})
# ---------- GANCHO ----------
esc('narr', None, [
  ('pg:cuarto:despierta', 'Imagina que mañana te despiertas,'),
  ('pd:baño_vacio', 'vas al baño… y no hay inodoro.'),
  ('pp:sorprendido:azul', '¿Dónde está?'),
  ('pd:hueco', 'No hay tubo, no hay cisterna, no hay nada.'),
  ('pg:calle_sucia', 'Porque en este mundo, nadie lo inventó.'),
])
esc('narr', None, [
  ('pg:calle_ventanas', 'Las ciudades huelen tan mal que la gente camina con pañuelos en la nariz.'),
  ('pd:bacteria', 'Las enfermedades se esparcen por el agua.'),
  ('pp:preocupado:verde', 'Y tú tienes una sola pregunta:'),
  ('pd:rollo', '¿cómo sobrevive la humanidad sin algo tan simple?'),
  ('pp:pensativo:ambar', 'Al final del video vas a saber por qué este invento salvó más vidas que casi cualquier medicina.'),
])
esc('narr', None, [('tit', '¿Qué pasaría si nunca se hubiera inventado el inodoro?')], flash=True)
# ---------- ESCENARIO 1 ----------
E1 = 'ESCENARIO 1 · LA CALLE'
esc('narr', E1, [('card:1:LA CALLE', 'Escenario uno: la calle.')], med=40, flash=True)
esc('narr', E1, [
  ('pg:calle_sucia', 'Sin inodoros, todo lo que tu cuerpo desecha tiene que ir a alguna parte.'),
  ('inf:130 g:al día', 'Una persona produce unos ciento treinta gramos al día.'),
  ('inf:50 kg:al año', 'Casi cincuenta kilos al año.'),
  ('pg:multitud', 'Multiplica eso por los millones que viven en una ciudad.'),
  ('pp:asustado:verde', 'Exacto.'),
], med=55)
esc('dato', E1, [
  ('ficha:edimburgo', 'Esto no es fantasía. En la Edimburgo del siglo dieciocho, la gente vaciaba sus bacinillas por la ventana.'),
  ('pd:bacinilla', 'Antes gritaban "gardyloo", del francés:'),
  ('pp:sorprendido:ambar', '"¡Cuidado con el agua!".'),
  ('pg:calle_ventanas', 'Si no te movías rápido, te caía encima.'),
], med=70)
esc('narr', E1, [
  ('pd:zapatos', 'Los zapatos de tacón no nacieron solo por moda:'),
  ('pg:calle_sucia', 'servían para no hundir los pies en la mugre de la calle.'),
  ('pp:esceptico:ambar', 'Bueno, eso dicen. Los historiadores todavía discuten.'),
  ('inf:OLOR:insoportable', 'Lo que no se discute es el olor.'),
], med=80)
# ---------- ESCENARIO 2 ----------
E2 = 'ESCENARIO 2 · EL AGUA'
esc('narr', E2, [('card:2:EL AGUA', 'Escenario dos: el agua.')], med=80, flash=True)
esc('narr', E2, [
  ('pg:rio', 'El problema no es solo el olor.'),
  ('pd:gota', 'Es lo que llega al agua que tomas.'),
  ('pd:bacteria', 'Ahí viven bacterias como la del cólera.'),
  ('pp:preocupado:azul', 'Y nadie sabía que estaban ahí.'),
], med=85)
esc('dato', E2, [
  ('ficha:snow', 'Londres, mil ochocientos cincuenta y cuatro. Un médico llamado John Snow marca en un mapa cada casa con muertos por cólera.'),
  ('pd:mapa_puntos', 'Los puntos se amontonan alrededor de una sola bomba de agua.'),
  ('pd:bomba', 'Snow convence a las autoridades de quitarle la manija.'),
  ('inf:↓:los casos bajan', 'Y los casos empiezan a bajar.'),
], med=85)
esc('narr', E2, [
  ('pp:pensativo:azul', 'En nuestro mundo sin inodoros, ese mapa nunca deja de llenarse.'),
  ('inf:1.000+:niños al día', 'Hoy, incluso con inodoros, las enfermedades diarreicas matan a más de mil niños al día en el mundo.'),
  ('pg:aldea', 'Casi siempre donde no hay saneamiento.'),
], med=90)
# ---------- ESCENARIO 3 ----------
E3 = 'ESCENARIO 3 · EL GRAN HEDOR'
esc('narr', E3, [('card:3:EL GRAN HEDOR', 'Escenario tres: el gran hedor.')], med=90, flash=True)
esc('dato', E3, [
  ('ficha:hedor', 'Verano de mil ochocientos cincuenta y ocho. El río Támesis está tan lleno de desechos que Londres no aguanta el olor.'),
  ('pg:parlamento', 'En el Parlamento cuelgan cortinas empapadas en químicos para poder trabajar.'),
  ('pp:asustado:ambar', 'Lo llamaron el Gran Hedor.'),
], med=100)
esc('dato', E3, [
  ('pd:planos', 'Y por fin los políticos aprueban algo enorme:'),
  ('pg:tunel', 'un ingeniero, Joseph Bazalgette, construye cientos de kilómetros de alcantarillas.'),
  ('inf:1.800 km:de alcantarillas', 'Más de mil ochocientos kilómetros de tubos bajo las calles.'),
  ('pp:sonrisa:ambar', 'El cólera desaparece de Londres pocos años después.'),
], med=60)
esc('narr', E3, [
  ('pp:esceptico:azul', 'Pero en nuestro mundo no hay inodoros que conectar.'),
  ('pd:tubo', 'Sin inodoro, el alcantarillado no tiene sentido.'),
  ('pg:calle_sucia', 'Así que el Gran Hedor… nunca termina.'),
], med=95)
# ---------- ESCENARIO EXTRA: TU CASA ----------
EC = 'ESCENARIO 4 · TU CASA'
esc('narr', EC, [('card:4:TU CASA', 'Escenario cuatro: tu casa.')], med=95, flash=True)
esc('narr', EC, [
  ('pg:cuarto_noche', 'Son las tres de la mañana y tienes que ir al baño.'),
  ('pd:bacinilla', 'Tu opción: una bacinilla debajo de la cama.'),
  ('pp:preocupado:ambar', 'Y por la mañana, alguien tiene que vaciarla.'),
], med=95)
esc('dato', EC, [
  ('ficha:gong', 'En la Inglaterra de los Tudor existía un oficio para eso: los gong farmers, que limpiaban los pozos negros de noche.'),
  ('pg:noche_trabajo', 'Trabajaban de noche porque nadie soportaba verlos, ni olerlos, de día.'),
  ('inf:$$:oficio bien pagado', 'Dicen que pagaban bien… por razones obvias.'),
], med=95)
esc('dato', EC, [
  ('ficha:edo', 'Y en el Japón del período Edo, los desechos se vendían como abono para los cultivos.'),
  ('pd:cultivo', 'Los dueños de las casas cobraban por ellos.'),
  ('pp:sorprendido:verde', 'Sí: había gente que hacía negocio con lo que tú tiras.'),
], med=90)
# ---------- ESCENARIO 4 ----------
E4 = 'ESCENARIO 5 · ¿QUIÉN LO INVENTÓ?'
esc('narr', E4, [('card:5:¿QUIÉN LO INVENTÓ?', 'Escenario cinco: ¿quién lo inventó?')], med=95, flash=True)
esc('dato', E4, [
  ('ficha:roma', 'Los romanos ya tenían letrinas públicas con agua corriendo por debajo.'),
  ('pd:esponja', 'Y en vez de papel, usaban una esponja en un palo.'),
  ('pp:asustado:verde', 'Varios historiadores creen que era compartida.'),
], med=90)
esc('dato', E4, [
  ('ficha:harington', 'En mil quinientos noventa y seis, John Harington diseña un inodoro con descarga para la reina Isabel primera.'),
  ('pd:sifon', 'Y en mil setecientos setenta y cinco, Alexander Cumming patenta la curva en forma de S.'),
  ('pd:inodoro_corte', 'Esa curva deja un poco de agua siempre adentro, que bloquea el olor de la alcantarilla.'),
  ('pp:sorprendido:ambar', 'Un tubo doblado. Eso fue todo.'),
], med=50)
# ---------- ESCENARIO 5 ----------
E5 = 'ESCENARIO 6 · EL MUNDO REAL'
esc('narr', E5, [('card:6:EL MUNDO REAL', 'Escenario seis: el mundo real.')], med=50, flash=True)
esc('dato', E5, [
  ('pp:serio:azul', 'Aquí viene lo incómodo:'),
  ('inf:3.500 millones:sin saneamiento seguro', 'cerca de tres mil quinientos millones de personas no tienen saneamiento seguro.'),
  ('inf:400+ millones:al aire libre', 'Y más de cuatrocientos millones todavía hacen sus necesidades al aire libre.'),
  ('pg:aldea', 'Para ellas, este video no es un "¿qué pasaría si?". Es su día a día.'),
], med=70)
esc('dato', E5, [
  ('ficha:bmj', 'En dos mil siete, lectores de una revista médica británica votaron el mayor avance médico desde mil ochocientos cuarenta.'),
  ('pd:trofeo', 'Ganó por encima de los antibióticos y las vacunas:'),
  ('pd:inodoro', 'el saneamiento. El inodoro y el agua limpia.'),
], med=30)
esc('dato', E5, [
  ('inf:19 NOV:Día Mundial del Retrete', 'Por cierto: desde dos mil trece, la ONU celebra cada diecinueve de noviembre el Día Mundial del Retrete.'),
  ('pp:serio:azul', 'Suena a chiste, pero no lo es.'),
  ('pg:aldea', 'La meta de la ONU es que todo el mundo tenga un baño seguro para el año dos mil treinta.'),
  ('pp:pensativo:ambar', 'Y al ritmo actual, esa meta no se va a cumplir.'),
], med=20)
# ---------- ESCENARIO 7 ----------
E7 = 'ESCENARIO 7 · LOS MITOS'
esc('narr', E7, [('card:7:LOS MITOS', 'Escenario siete: los mitos.')], med=20, flash=True)
esc('dato', E7, [
  ('ficha:crapper', 'Seguro escuchaste que el inodoro lo inventó un tal Thomas Crapper.'),
  ('pp:esceptico:ambar', 'Falso.'),
  ('pd:patentes', 'Crapper fue un plomero de Londres que mejoró piezas del inodoro y lo vendió muchísimo, pero no lo inventó.'),
  ('pp:sonrisa:ambar', 'Y la palabra en inglés "crap" ya existía antes que él.'),
], med=20)
esc('dato', E7, [
  ('pd:mazorca', 'Otro dato: el papel higiénico es mucho más nuevo que el inodoro.'),
  ('ficha:gayetty', 'En mil ochocientos cincuenta y siete, Joseph Gayetty empezó a vender en Estados Unidos el primer papel higiénico empacado.'),
  ('pd:catalogo', 'Antes, en muchas casas rurales se usaban mazorcas de maíz, periódicos viejos o páginas de catálogos.'),
  ('pp:asustado:ambar', 'Sí. Páginas de catálogos.'),
], med=20)
# ---------- ESCENARIO 8 ----------
E8 = 'ESCENARIO 8 · EL ESPACIO'
esc('narr', E8, [('card:8:EL ESPACIO', 'Escenario ocho: el espacio.')], med=20, flash=True)
esc('dato', E8, [
  ('pg:nave', 'Ahora imagina ir al baño sin gravedad.'),
  ('ficha:apolo', 'En las misiones Apolo, los astronautas usaban bolsas de plástico pegadas al cuerpo.'),
  ('pp:sorprendido:azul', 'Y en una de ellas, la tripulación encontró algo flotando dentro de la cápsula.'),
  ('pd:flotando', 'Nadie quiso admitir que era suyo. Quedó grabado en las transcripciones de la NASA.'),
], med=30)
esc('dato', E8, [
  ('pd:inodoro_espacial', 'Hoy, en la Estación Espacial Internacional, el inodoro funciona con aire que succiona en vez de agua.'),
  ('pd:reciclaje', 'Y la orina se recicla: se filtra y se convierte otra vez en agua para beber.'),
  ('inf:98 %:del agua se recupera', 'En dos mil veintitrés, la NASA logró recuperar cerca del noventa y ocho por ciento del agua a bordo.'),
  ('pp:sonrisa:azul', 'El café de mañana es el café de ayer.'),
], med=20)
# ---------- ESCENARIO 9 ----------
E9 = 'ESCENARIO 9 · EL FUTURO'
esc('narr', E9, [('card:9:EL FUTURO', 'Escenario nueve: el futuro.')], med=10, flash=True)
esc('dato', E9, [
  ('pp:pensativo:azul', 'El problema es que construir alcantarillas en todo el planeta cuesta una fortuna.'),
  ('ficha:gates', 'Por eso, en dos mil once, la Fundación Gates lanzó un reto: reinventar el inodoro.'),
  ('pd:inodoro_futuro', 'Inodoros que no necesitan alcantarilla: tratan los desechos ahí mismo y los convierten en agua limpia y abono.'),
  ('pp:sorprendido:verde', 'Ya existen prototipos. El reto ahora es que sean baratos.'),
], med=10)
esc('dato', E9, [
  ('pd:washlet', 'Y en Japón, el inodoro ya es casi una computadora: asiento caliente, chorro de agua, secador y hasta música para disimular ruidos.'),
  ('inf:80 %+:de los hogares en Japón', 'Según encuestas del gobierno japonés, más del ochenta por ciento de los hogares tiene uno.'),
  ('pp:esceptico:ambar', 'Mientras tanto, la mitad del mundo todavía espera un baño seguro.'),
], med=10)
# ---------- CIERRE ----------
esc('narr', None, [
  ('pg:baño_moderno', 'Así que la próxima vez que bajes la cadena,'),
  ('pp:sonrisa:ambar', 'acuérdate de que ese tubo doblado te salvó la vida.'),
  ('pd:rollo', 'Y cuéntame en los comentarios:'),
  ('pp:explica:ambar', '¿qué invento "aburrido" crees que salvó al mundo?'),
], med=0)
json.dump(E, open('escenas.json', 'w'), ensure_ascii=False, indent=1)
print(len(E), 'escenas', sum(len(e['planos']) for e in E), 'planos', sum(len(e['texto'].split()) for e in E), 'palabras')
