import json
P=lambda *x: [[a,b] for a,b in x]
S=[
("abre","candado","Esto es un candado. Solo se abre con su llave, y adentro tiene unos pernitos cortados que hacen todo el truco. Vamos a armarlo desde cero.",P((0.05,"impacto"),(0.35,"click"),(0.7,"mecanismo"))),
("gancho","un gancho","Si pones un gancho de metal que entra en una caja, ya tienes un candado. Pero cualquiera lo jala, y se abre.",P((0.15,"clink"),(0.45,"impacto"),(0.8,"fallo"))),
("pestillo","un pestillo","Así que le metes adentro un pestillo con un resorte, que se mete en una muesca del gancho y lo traba. Pero cualquiera lo empuja con un clavo por el hueco.",P((0.15,"click"),(0.45,"tension"),(0.8,"fallo"))),
("cilindro","un cilindro","Así que escondes el pestillo, y solo se mueve si giras un cilindro que va por dentro. Pero el cilindro gira con cualquier cosa. Con un destornillador, lo abres.",P((0.15,"mecanismo"),(0.5,"swish"),(0.85,"fallo"))),
("pines","unos pernitos","Así que le atraviesas unos pernitos, de la caja hasta el cilindro, empujados por resortes. Como cruzan los dos, el cilindro ya no puede girar. Esos son los pines.",P((0.15,"click"),(0.35,"click"),(0.55,"click"),(0.85,"ding"))),
("nadie","ni tú","Pero ahora no lo abre nadie. Ni siquiera tú.",P((0.3,"tension"),(0.7,"fallo"))),
("corte","cortas los pines","Así que cortas cada pin en dos pedazos, a alturas distintas. Si los cortes quedan justo en el borde del cilindro, todos a la vez, el cilindro gira. Esa es la línea de corte.",P((0.15,"swish"),(0.45,"click"),(0.75,"mecanismo"),(0.9,"ding"))),
("llave","la llave","Y la llave es una lámina con picos de alturas distintas. Al meterla, cada pico sube su pin justo hasta esa línea. Por eso cada llave tiene su propia forma.",P((0.15,"clink"),(0.4,"click"),(0.6,"click"),(0.85,"ding"))),
("otra","otra llave","Pero si metes otra llave, un pin queda muy alto o muy bajo, cruzando la línea, y el cilindro no se mueve.",P((0.2,"clink"),(0.5,"tension"),(0.85,"fallo"))),
("combina","miles de llaves","Con cinco pines y seis alturas posibles, salen miles de llaves diferentes. Por eso es difícil que la tuya abra el candado del vecino.",P((0.2,"pop"),(0.45,"pop"),(0.7,"brillo"))),
("arco","acero duro","Pero un ladrón no busca la llave: corta el gancho con una sierra. Así que lo haces de acero endurecido, que la sierra casi no muerde. Ese es el arco.",P((0.2,"tension"),(0.45,"swish"),(0.75,"impacto"),(0.9,"ding"))),
("cierre","así funciona","Gancho, pestillo, cilindro, pines cortados y una llave con picos. Así funciona un candado. Síguenos para ver qué armamos mañana.",P((0.2,"pop"),(0.5,"brillo"),(0.85,"campana"))),
]
json.dump([dict(tipo=a,titulo=b,texto=c,sfx=d) for a,b,c,d in S],open('escenas.json','w'),ensure_ascii=False,indent=1)
print(len(S), sum(len(c.split()) for _,_,c,_ in S))
