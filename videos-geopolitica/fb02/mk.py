import json
P=lambda *x: [[a,b] for a,b in x]
S=[
("gancho","una tapita","Tu ducha eléctrica tiene adentro una tapita de caucho que decide si te bañas con agua caliente o helada. Vamos a armarla desde cero.",P((0.03,"impacto"),(0.4,"click"),(0.8,"whoosh"))),
("abre","una ducha","Si pones un tubo de agua fría y a la punta le enroscas una regadera, ya tienes una ducha. Pero el agua sale helada, y bañarse así duele.",P((0.1,"agua_flujo"),(0.5,"gota"),(0.85,"fallo"))),
("resistencia","la resistencia","Así que le metes adentro un alambre enrollado que se calienta con la electricidad, como el de una estufa. El agua pasa pegada a él y se calienta. Esa es la resistencia.",P((0.15,"electrico"),(0.45,"agua_flujo"),(0.85,"ding"))),
("seca","se quema","Pero si alguien prende la ducha sin agua, el alambre se calienta sin nada que lo enfríe, y en segundos se quema.",P((0.2,"electrico"),(0.55,"tension"),(0.85,"fallo"))),
("diafragma","el diafragma","Así que le pones una tapita de caucho que el agua empuja hacia arriba. Solo cuando corre el agua, la tapita junta dos contactos y deja pasar la corriente. Por eso suena clac al abrir la llave, y se apaga sola al cerrarla. Ese es el diafragma.",P((0.15,"agua_flujo"),(0.45,"click"),(0.65,"click"),(0.9,"ding"))),
("presion","poca presión","Pero si en tu casa el agua llega con muy poca presión, la tapita no alcanza a subir. Sale un chorrito, y la ducha nunca se prende.",P((0.25,"gota"),(0.55,"tension"),(0.85,"fallo"))),
("tibia","sale tibia","Y en tierra fría, a veces el agua apenas sale tibia.",P((0.3,"agua_flujo"),(0.8,"fallo"))),
("poca","menos agua","Así que cierras un poco la llave. Pasa menos agua por el mismo alambre, y cada gota se lleva más calor. Ojo: si la cierras demasiado, la tapita baja y la ducha se apaga.",P((0.2,"mecanismo"),(0.5,"gota"),(0.85,"click"))),
("perilla","la perilla","Pero en tierra caliente sale hirviendo. Así que el alambre tiene dos tramos, y una perilla escoge por dónde pasa la corriente: uno calienta más para el invierno, y otro menos para el verano.",P((0.15,"fallo"),(0.45,"click"),(0.7,"mecanismo"),(0.9,"ding"))),
("cal","el sarro","Con los meses, el agua deja una costra blanca en los huequitos de la regadera, y el chorro sale torcido. Es sarro, y se quita dejando la regadera en vinagre.",P((0.2,"gota"),(0.55,"fallo"),(0.85,"burbujas"))),
("tierra","peligro","Pero agua y electricidad juntas son peligrosas. Si un cable se pela, la regadera puede quedar con corriente.",P((0.25,"electrico"),(0.55,"tension"),(0.85,"alarma"))),
("polo","polo a tierra","Así que le pones un cable verde que va directo a la tierra. Si algo falla, la corriente se va por ahí y no por ti. Ese es el polo a tierra.",P((0.2,"swish"),(0.55,"electrico"),(0.9,"ding"))),
("breaker","su breaker","Y como gasta tanto como cuarenta bombillos viejos, va con su propio breaker. Por eso una ducha de cinco minutos gasta la mitad de luz que una de diez.",P((0.3,"pop"),(0.6,"click"),(0.85,"ding"))),
("cambio","el repuesto","Y cuando el alambre por fin se quema, no hay que botar la ducha: la resistencia se vende sola y se cambia en minutos, siempre con el breaker abajo.",P((0.25,"mecanismo"),(0.6,"click"),(0.9,"ding"))),
("cierre","así funciona","Un alambre que calienta, una tapita que lo prende, una perilla y un polo a tierra. Y con esto ya entiendes la ducha eléctrica de tu casa.",P((0.2,"pop"),(0.5,"brillo"),(0.85,"campana"))),
]
json.dump([dict(tipo=a,titulo=b,texto=c,sfx=d) for a,b,c,d in S],open('escenas.json','w'),ensure_ascii=False,indent=1)
n=sum(len(c.split()) for _,_,c,_ in S); print(len(S), n, 'palabras ->', round(n/200*60,1), 's a 200 ppm;', round(n/185*60,1),'s a 185')
