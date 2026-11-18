import json
P=lambda *x: [[a,b] for a,b in x]
S=[
("gancho","sin tocar","Una cremallera cierra sin que tú toques un solo diente. Todo el trabajo lo hace la piecita que jalas. Vamos a armarla desde cero.",P((0.03,"impacto"),(0.45,"swish"),(0.85,"whoosh"))),
("abre","dos telas","Si pones dos telas una al lado de la otra, ya tienes una chaqueta. Pero queda abierta, y el viento se te mete por el medio.",P((0.15,"swish"),(0.5,"whoosh"),(0.85,"fallo"))),
("botones","botones","Así que le coses botones. Pero abrocharlos uno por uno toma una eternidad, y con los dedos fríos ni atinas.",P((0.2,"pop"),(0.4,"pop"),(0.6,"pop"),(0.85,"fallo"))),
("dientes","los dientes","Así que a cada lado le pegas una fila de dientitos, pero corridos medio diente, como los dedos cuando cruzas las manos.",P((0.15,"click"),(0.35,"click"),(0.55,"click"),(0.85,"ding"))),
("forma","bolita y hueco","Cada diente tiene una bolita arriba y un huequito abajo. La bolita de un lado entra en el huequito del diente de enfrente, y quedan trabados.",P((0.3,"click"),(0.6,"click"),(0.85,"ding"))),
("mano","uno por uno","Pero trabarlos con los dedos, uno por uno, es peor que los botones.",P((0.3,"click"),(0.75,"fallo"))),
("carro","una Y","Así que le pones encima una pieza en forma de Y que corre por las dos filas. Arriba tiene dos entradas, una para cada lado, y abajo una sola salida.",P((0.15,"mecanismo"),(0.5,"swish"),(0.85,"clink"))),
("cuna","el carro","Al subirla, las paredes de la Y empujan las dos filas hacia el centro, en el ángulo justo, y cada diente cae en el hueco del otro. Ese es el carro, o deslizador.",P((0.15,"swish"),(0.35,"click"),(0.55,"click"),(0.9,"ding"))),
("abrir","la cuñita","Y para abrir, adentro tiene una cuñita en el medio que, al bajar, separa los dientes otra vez, uno por uno.",P((0.25,"swish"),(0.55,"click"),(0.85,"pop"))),
("sale","se sale","Pero si subes demasiado, el carro se sale por la punta y la cremallera se desarma.",P((0.3,"swish"),(0.6,"impacto"),(0.85,"fallo"))),
("topes","los topes","Así que le pones dos topes de metal arriba que lo frenan. Y en las chaquetas, abajo va una cajita con un pin: metes el pin y puedes separar los dos lados del todo. Esos son los topes.",P((0.2,"clink"),(0.5,"clink"),(0.85,"ding"))),
("torcido","un diente torcido","Pero si un diente se tuerce, el de enfrente ya no cae en su hueco, y la cremallera se abre detrás del carro.",P((0.3,"tension"),(0.7,"fallo"))),
("lapiz","grafito","Y si solo está dura, pásale la punta de un lápiz por los dientes. El grafito es resbaloso, y el carro corre mejor.",P((0.25,"swish"),(0.55,"swish"),(0.85,"ding"))),
("tipos","nailon","No todas son iguales. Unas tienen dientes de metal, otras de plástico, y las de las maletas son un espiral de nailon: si se abre a la fuerza, a veces basta con pasar el carro otra vez para que vuelva a cerrar.",P((0.2,"clink"),(0.5,"click"),(0.85,"ding"))),
("historia","1893","La idea tiene más de cien años. En 1893, en Chicago, Whitcomb Judson patentó un cierre de ganchos para zapatos, y en 1913 Gideon Sundback lo convirtió en la cremallera de dientes que usamos hoy.",P((0.15,"pop"),(0.55,"pop"),(0.85,"brillo"))),
("cierre","así funciona","Dos filas de dientes corridos, una pieza en Y que los junta y dos topes. Y con esto ya entiendes la cremallera de tu chaqueta.",P((0.2,"pop"),(0.5,"brillo"),(0.85,"campana"))),
]
json.dump([dict(tipo=a,titulo=b,texto=c,sfx=d) for a,b,c,d in S],open('escenas.json','w'),ensure_ascii=False,indent=1)
n=sum(len(c.split()) for _,_,c,_ in S); print(len(S), n, 'palabras ->', round(n/200*60,1), 's a 200 ppm;', round(n/185*60,1),'s a 185')
