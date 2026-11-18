import json
P=lambda *x: [[a,b] for a,b in x]
S=[
("gancho","91 grados","En Bogotá, el agua hierve a unos noventa y un grados, no a cien. Por eso los fríjoles tardan una eternidad, y por eso existe la olla a presión.",P((0.03,"impacto"),(0.45,"burbujas"),(0.85,"whoosh"))),
("abre","una olla","Si pones agua en una olla con tapa, encima del fogón, ya tienes una olla. Pero el agua hierve, y por más fuego que le metas, no pasa de cien grados. Y arriba en la montaña, ni siquiera llega a eso.",P((0.1,"impacto"),(0.45,"burbujas"),(0.85,"fallo"))),
("aire","el aire","Eso pasa porque el aire empuja la superficie del agua. Mientras menos aire tenga encima, más fácil se escapa como vapor, y hierve más frío.",P((0.2,"whoosh"),(0.55,"burbujas"),(0.85,"ding"))),
("tapa","la tapa","Así que le pones una tapa que cierre duro, para que el vapor no se escape. El vapor se acumula, empuja el agua desde arriba, y ahora el agua tiene que calentarse más para poder hervir.",P((0.15,"clink"),(0.5,"burbujas"),(0.85,"ding"))),
("grados","120 grados","Con una atmósfera de presión de más, el agua hierve a unos ciento veinte grados. Y esos veinte grados de más cocinan los fríjoles en mucho menos tiempo.",P((0.25,"burbujas"),(0.6,"brillo"),(0.85,"ding"))),
("fuga","se escapa","Pero la tapa no queda perfecta, y el vapor se escapa silbando por los bordes.",P((0.3,"whoosh"),(0.75,"fallo"))),
("empaque","el empaque","Así que le pones un anillo de caucho alrededor de la tapa, que se aplasta y sella. Ese es el empaque.",P((0.25,"click"),(0.6,"mecanismo"),(0.85,"ding"))),
("revienta","puede reventar","Pero si el vapor se sigue acumulando sin salida, la presión sube y sube, y la olla puede reventar.",P((0.25,"tension"),(0.6,"alarma"),(0.85,"impacto"))),
("pito","el pito","Así que le pones arriba un tubito con una pesita encima. Cuando la presión llega al punto justo, levanta la pesita, sale un chorrito de vapor, y la pesita baja. Por eso la olla hace chu chu chu. Esa es la válvula reguladora, o el pito.",P((0.2,"mecanismo"),(0.45,"whoosh"),(0.65,"whoosh"),(0.9,"ding"))),
("tapado","se tapa","Pero si un fríjol o un pedazo de cáscara tapa ese tubito, el vapor ya no tiene por dónde salir.",P((0.3,"pop"),(0.75,"tension"))),
("seguridad","la de seguridad","Así que le pones una segunda salida, un tapón que se dispara si la presión pasa del límite. Esa es la válvula de seguridad.",P((0.3,"tension"),(0.6,"impacto"),(0.85,"ding"))),
("abrir","no la abras","Pero si alguien abre la tapa con la olla llena de presión, el agua a ciento veinte grados se vuelve vapor de golpe y sale disparada.",P((0.3,"click"),(0.6,"whoosh"),(0.85,"alarma"))),
("seguro","el seguro","Así que la tapa tiene un seguro: mientras hay presión adentro, no deja girarla. Primero dejas que se enfríe o sacas el vapor por la válvula, y luego abres.",P((0.25,"mecanismo"),(0.55,"whoosh"),(0.85,"ding"))),
("llena","la rayita","Y nunca la llenes hasta arriba. Los granos crecen y hacen espuma, y pueden tapar las válvulas. Por eso adentro tiene una rayita que marca hasta dónde llenar.",P((0.25,"burbujas"),(0.6,"fallo"),(0.85,"ding"))),
("cierre","así funciona","Una tapa que encierra el vapor, un empaque que sella, una pesita que regula y una válvula de seguridad. Y con esto ya entiendes la olla a presión de tu casa.",P((0.2,"pop"),(0.5,"brillo"),(0.85,"campana"))),
]
json.dump([dict(tipo=a,titulo=b,texto=c,sfx=d) for a,b,c,d in S],open('escenas.json','w'),ensure_ascii=False,indent=1)
n=sum(len(c.split()) for _,_,c,_ in S); print(len(S), n, 'palabras ->', round(n/190*60,1), 's a 190')
