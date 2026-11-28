"""v33 · ¿Qué pasaría si ganaras $1 cada vez que tu crush te miente? — historia de crush (motor index33, más dinámico).
Gancho flash-forward (0-8 s) -> sting Xseng (se inserta al ensamblar) -> historia. Romance sano: Xeno + Sofía.
Dato real (marcado como estudios): en estudios con diarios (DePaulo y col., 1996) la gente admitió decir en promedio
una o dos mentiras al día, muchas para no herir a otros.
Tokens nuevos de index33: kw:TEXTO palabra que golpea; sh temblor de cámara; fx:moneda (cae una moneda + clink);
fx:monedas (lluvia); fx:impacto (líneas de choque); fx:confeti; lugar 'fiesta'. p.chip = ['$', valor, 'GANADO']."""
import json
E = []
def esc(voz, planos, gan=None, sfx=None):
    words = [len(f.split()) for _, f in planos]; tot = sum(words); acc = 0; fx = [[0.0, 'whoosh']] if sfx is None else sfx
    for (v, f), n in zip(planos, words):
        fr = acc / tot
        if 'fx:moneda' in v: fx.append([round(min(0.97, fr + 0.6 * n / tot), 3), 'clink'])
        if 'fx:monedas' in v: fx += [[round(min(0.97, fr + k * 0.04), 3), 'clink'] for k in range(4)]
        if 'kw:' in v or ';sh' in v or 'fx:impacto' in v: fx.append([round(fr + 0.01, 3), 'impacto'])
        elif acc: fx.append([round(fr, 3), 'swish'])
        acc += n
    E.append({'tipo': 'planos', 'titulo': '', 'voz': voz, 'texto': ' '.join(f for _, f in planos),
              'planos': [{'v': a, 'f': f} for a, f in planos],
              'p': {'esc': None, 'med': None, 'flash': False, 'chip': ['$', gan, 'GANADO'] if gan else None}, 'sfx': fx})

# 0 GANCHO (flash-forward)
esc('susp', [
  ('noche;X=sorprendido@0.5;fx:monedas;sh', 'Me cayeron cuarenta y siete dólares en un solo día.'),
  ('noche;S=pensando@0.5;cu;kw:TODOS DE ELLA', 'Y todos venían de ella.'),
  ('neutro;X=pensando@0.5;fx:moneda', 'La regla era simple: cada vez que mi crush me miente, me cae un dólar.'),
  ('balcon;S=sonrojado@0.5;cu', 'Todo era divertido… hasta que me dijo: te quiero… como amigo.'),
  ('balcon;X=sorprendido@0.5;cu;fx:moneda;sh', 'Y cayó una moneda.'),
], sfx=[[0.0, 'impacto']])
# 1 EL PODER
esc('narr', [
  ('cuarto;X=normal@0.5', 'Todo empezó un lunes cualquiera. Me desperté, me puse mi gorra de siempre y fui a la escuela.'),
  ('pasillo;S=normal@0.62;X=normal@0.3', 'En el pasillo me encontré con Sofía. Pelo largo, pinza de estrella, la sonrisa que me arruina la concentración.'),
  ('pasillo;X=sonrojado@0.5;cu', 'Le pregunté, nervioso: ¿te gusta mi gorra nueva?'),
  ('pasillo;S=riendo@0.5;cu', 'Ella dijo: ¡me encanta!'),
  ('pasillo;X=sorprendido@0.4;S=riendo@0.7;fx:moneda;kw:+$1', 'Y de la nada, ¡clink! Una moneda de un dólar cayó justo en mi cabeza.'),
  ('pasillo;X=pensando@0.5;cu;th:¿de dónde salió?', 'Miré al techo. Nada. Sofía no vio nada. Nadie vio nada.'),
], gan='$1')
# 2 LAS PRUEBAS
esc('narr', [
  ('patio;X=pensando@0.5;th:¿y si…?', 'En el recreo hice un experimento.'),
  ('patio;X=normal@0.3;S=normal@0.7', '¿Hiciste la tarea de mate? Sí, toda.'),
  ('patio;X=sorprendido@0.4;S=normal@0.7;fx:moneda', 'Clink. Otra moneda.'),
  ('patio;S=riendo@0.5;cu', '¿Te gustó mi chiste de ayer? Jajaja, buenísimo.'),
  ('patio;X=riendo@0.5;cu;fx:moneda;sh', 'Clink. Tres dólares.'),
  ('patio;M=normal@0.6;X=pensando@0.3', 'Probé con mi mamá, con mi hermano, con el profe. Nada. Solo funcionaba con ella.'),
  ('patio;X=sorprendido@0.35;S=normal@0.7;kw:1 O 2 AL DÍA;ui:1 O 2 AL DÍA', 'Y ojo, que esto no es tan raro. En estudios con diarios, la gente admitió decir en promedio una o dos mentiras al día.'),
  ('neutro;X=pensando@0.5;cu;th:casi todas pequeñitas', 'Casi todas pequeñas. Para no herir a nadie. Pero yo no lo veía así. Yo veía dinero.'),
], gan='$3')
# 3 EL NEGOCIO
esc('narr', [
  ('biblio;X=riendo@0.5;kw:PLAN MILLONARIO', 'Así que armé un plan millonario.'),
  ('biblio;X=riendo@0.3;S=normal@0.7', '¿Te gusta el brócoli? ¿Te encanta madrugar? ¿Mi peinado se ve bien?'),
  ('biblio;S=sonrojado@0.7;X=riendo@0.3;fx:monedas', 'Clink, clink, clink. Las monedas caían como lluvia.'),
  ('biblio;X=riendo@0.5;cu;th:$12 en una hora', 'En una hora ya llevaba doce dólares. Me imaginaba comprando una consola, unos tenis, una pizza gigante.'),
  ('biblio;S=enojado@0.5;cu', 'Pero Sofía empezó a mirarme raro. ¿Por qué me haces tantas preguntas tontas?'),
  ('biblio;S=preocupado@0.62;X=preocupado@0.3', 'Y se fue a otra mesa. Sola. Con los audífonos puestos.'),
  ('comedor;C=enojado@0.62;X=normal@0.3', 'Mi amiga Camila me jaló del brazo.'),
  ('comedor;C=enojado@0.5;cu;kw:ESO ES TÓXICO', 'Oye, la estás poniendo incómoda a propósito. Eso es tóxico.'),
  ('comedor;X=preocupado@0.5;cu;th:…tiene razón', 'Me dolió. Porque tenía razón. Dejé de preguntarle tonterías.'),
], gan='$12')
# 4 EL VIERNES RARO
esc('narr', [
  ('pasillo;X=normal@0.3;S=preocupado@0.7;kw:VIERNES', 'Pero el viernes pasó algo raro.'),
  ('pasillo;S=preocupado@0.5;cu;fx:moneda', 'Le dije hola. Ella dijo: no estoy haciendo nada raro. Clink.'),
  ('patio;S=preocupado@0.7;X=pensando@0.3;fx:moneda', 'No tengo planes el sábado. Clink.'),
  ('patio;S=sonrojado@0.5;cu;fx:moneda', 'No sé ni cuándo es tu cumpleaños. Clink.'),
  ('patio;X=sorprendido@0.5;fx:monedas;sh', 'Para la salida ya llevaba cuarenta y siete dólares. Todos de ella. En un solo día.'),
  ('calle;MT=riendo@0.7;S=riendo@0.45;X=preocupado@0.15', 'Y entonces la vi. Secreteándose con Mateo. Riéndose. Escondiendo algo en la mochila.'),
  ('calle;X=llorando@0.5;cu;th:me está mintiendo por él…', 'Sentí el estómago en el piso. Me estaba mintiendo todo el día… ¿por él?'),
], gan='$59')
# 5 EL PESO
esc('susp', [
  ('cuarto;X=llorando@0.5;fx:lluvia', 'Esa noche puse las cuarenta y siete monedas sobre la cama.'),
  ('cuarto;X=preocupado@0.5;cu', 'Tenía más dinero que nunca. Y nunca me había sentido tan mal.'),
  ('cuarto;X=pensando@0.5;cu;th:no quiero ganar así', 'Entendí algo: no quería ganar dinero con sus mentiras. Quería que me dijera la verdad.'),
], gan='$59')
# 5b EL ERROR
esc('narr', [
  ('cuarto;X=enojado@0.5;fx:chat', 'Y entonces hice algo de lo que todavía me arrepiento. Le escribí: ya sé que me estás mintiendo.'),
  ('cuarto;X=enojado@0.5;cu;fx:moneda', 'Ella respondió: no te estoy mintiendo, te lo juro. Clink.'),
  ('cuarto;X=enojado@0.5;cu;kw:VISTO', 'Me dio tanta rabia que la dejé en visto.'),
  ('cuarto;X=preocupado@0.5;cu;th:¿y si me equivoco?', 'Ella me mandó tres mensajes más. No abrí ninguno. Apagué el celular y me quedé mirando el techo hasta las dos de la mañana.'),
], gan='$60')
# 6 EL SÁBADO
esc('narr', [
  ('cuarto;M=riendo@0.62;X=normal@0.28', 'El sábado mi mamá me pidió que la acompañara a casa de una vecina. Raro, pero fui.'),
  ('entrada;X=normal@0.5', 'Toqué el timbre. Las luces estaban apagadas.'),
  ('fiesta;S=riendo@0.5;MT=riendo@0.78;C=riendo@0.22;fx:confeti;sh;kw:¡SORPRESA!', 'Y de pronto: ¡sorpresa!'),
  ('fiesta;X=sorprendido@0.5;cu', 'Era mi cumpleaños. Se me había olvidado por completo.'),
  ('fiesta;S=sonrojado@0.62;X=sorprendido@0.3', 'Sofía lo había organizado todo. Mateo la ayudó con el pastel. Camila con los globos.'),
  ('fiesta;X=pensando@0.5;cu;th:47 mentiras = 47 sorpresas', 'Las cuarenta y siete mentiras del viernes… eran para que yo no descubriera nada.'),
  ('fiesta;X=preocupado@0.5;cu;th:soy un idiota', 'Y yo la había dejado en visto. Me sentí el peor amigo del mundo.'),
  ('fiesta;X=preocupado@0.3;S=normal@0.7', 'Me acerqué y le dije: perdón por lo de anoche. Pensé que me escondías algo malo.'),
  ('fiesta;S=riendo@0.5;cu', 'Ella se rió: te escondía algo, sí. Pero era bonito.'),
  ('fiesta;X=riendo@0.3;S=riendo@0.7;fx:confeti', 'Cantamos, comimos pastel y por primera vez en toda la semana me olvidé de las monedas.'),
], gan='$60')
# 7 EL BALCÓN
esc('narr', [
  ('balcon;X=sonrojado@0.3;S=sonrojado@0.7', 'Más tarde salimos al balcón. Hacía frío y se veían las estrellas.'),
  ('balcon;X=sonrojado@0.5;cu', 'Le pregunté: ¿por qué hiciste todo esto por mí?'),
  ('balcon;S=sonrojado@0.5;cu', 'Ella miró al suelo y dijo: porque te quiero… como amigo.'),
  ('balcon;X=sorprendido@0.5;cu;fx:moneda;sh;kw:CLINK', 'Clink.'),
  ('balcon;X=riendo@0.5;cu;th:¡¿era MENTIRA?!', 'Una moneda rodó entre los dos. Y yo sabía exactamente lo que significaba.'),
  ('balcon;X=pensando@0.5;cu;th:si es mentira…', 'Si decir te quiero como amigo era mentira… entonces ella no me quería como amigo. Me quería más.'),
], gan='$61')
# 8 LA VERDAD
esc('narr', [
  ('balcon;S=sorprendido@0.7;X=sonrojado@0.3', 'Ella vio la moneda. ¿De dónde salió eso?'),
  ('balcon;X=riendo@0.5;cu', 'Y le conté todo. Lo de las monedas, lo del plan millonario, lo del viernes. Hasta lo del brócoli.'),
  ('balcon;S=riendo@0.5;cu;kw:JAJAJA', 'Ella se rió tanto que tuvo que agarrarse del barandal. Así que por eso me preguntabas tantas tonterías.'),
  ('balcon;X=sonrojado@0.5;cu', 'Junté todo el valor que tenía y le dije: Sofía, yo no te quiero como amigo.'),
  ('balcon;S=sonrojado@0.5;cu', 'Ella se puso roja como un tomate. Y dijo bajito: yo tampoco.'),
  ('balcon;X=riendo@0.3;S=riendo@0.7;fx:brillo;kw:0 MONEDAS', 'Esperé el clink. Pero no cayó nada. Ninguna moneda.'),
  ('balcon;X=sonrojado@0.3;S=riendo@0.7;fx:brillo', 'Era verdad. Y valía más que los sesenta y un dólares juntos.'),
], gan='$61')
# 9 CIERRE
esc('narr', [
  ('cuarto;X=normal@0.5;cu', 'Esa noche entendí que no todas las mentiras son malas. Algunas esconden una fiesta.'),
  ('cuarto;X=pensando@0.5;cu;th:la verdad cuesta valor', 'Pero la verdad, la de verdad, siempre necesita un poco de valor.'),
  ('neutro;X=pensando@0.5;ui:¿QUÉ HARÍAS TÚ?', 'Y tú, si ganaras un dólar cada vez que tu crush te miente, ¿le dirías o te harías millonario? Te leo en los comentarios.'),
])
json.dump(E, open(__file__.replace('guion.py', 'escenas.json'), 'w'), ensure_ascii=False, indent=1)
print(len(E), 'escenas', sum(len(e['planos']) for e in E), 'planos', sum(len(e['texto'].split()) for e in E), 'palabras')
