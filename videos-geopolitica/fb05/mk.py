import json
P=lambda *x: [[a,b] for a,b in x]
S=[
("gancho","con nada","Un termo mantiene el café caliente todo el día, y la limonada fría también. Y lo hace con nada. Literalmente, con vacío.",P((0.03,"impacto"),(0.5,"swish"),(0.85,"whoosh"))),
("abre","una botella","Si pones café caliente en una botella de vidrio, ya tienes dónde llevarlo. Pero en una hora está tibio.",P((0.2,"agua_flujo"),(0.5,"clink"),(0.85,"fallo"))),
("tres","tres maneras","El calor se escapa de tres maneras: tocando, de molécula en molécula; moviéndose con el aire, que sube caliente y se lo lleva; y como luz invisible, que sale para todos lados.",P((0.2,"pop"),(0.5,"pop"),(0.8,"pop"))),
("doble","pared doble","Así que haces la botella doble, una adentro de otra, con un espacio entre las dos.",P((0.3,"clink"),(0.75,"ding"))),
("aire","el aire","Pero ese espacio tiene aire, y el aire todavía pasa calor de una pared a la otra.",P((0.3,"whoosh"),(0.75,"fallo"))),
("vacio","el vacío","Así que le sacas el aire a ese espacio. Sin moléculas, no hay nada que lleve el calor, ni tocando ni moviéndose. Ese es el vacío.",P((0.2,"whoosh"),(0.55,"mecanismo"),(0.88,"ding"))),
("luz","luz invisible","Pero el calor todavía se escapa como luz invisible, la misma que sientes en la cara cuando te acercas a una brasa.",P((0.3,"electrico"),(0.75,"fallo"))),
("espejo","el espejo","Así que plateas las paredes por dentro, como un espejo, y esa luz rebota de vuelta hacia el café. Por eso los termos de vidrio brillan por dentro.",P((0.25,"brillo"),(0.55,"swish"),(0.85,"ding"))),
("prueba","tócalo","Haz la prueba: con el café hirviendo adentro, toca el termo por fuera. Está casi a la temperatura del cuarto. Ese calor que tu mano no siente es justo el que se quedó adentro.",P((0.3,"click"),(0.6,"tension"),(0.85,"ding"))),
("cuello","el cuello","Pero las dos paredes tienen que unirse en algún lado, en el cuello. Y por ahí el calor sí pasa, tocando.",P((0.3,"tension"),(0.75,"fallo"))),
("tapa","la tapa","Así que haces el cuello delgado, y lo tapas con un corcho o un tapón de plástico, que pasan muy poco calor. Aun así, por la tapa es por donde más se enfría.",P((0.25,"pop"),(0.55,"click"),(0.85,"ding"))),
("frio","al revés","Y como al termo no le importa si el calor quiere salir o entrar, funciona al revés: el hielo de adentro tarda muchísimo en derretirse.",P((0.3,"clink"),(0.6,"clink"),(0.85,"ding"))),
("fragil","frágil","Pero el vidrio al vacío es frágil. Si se cae y se rompe la pared de adentro, oyes un tintineo, y deja de servir. Por eso hoy la mayoría son de acero inoxidable doble, también al vacío, que aguanta los golpes.",P((0.2,"impacto"),(0.45,"clink"),(0.85,"ding"))),
("historia","1892","El invento es de 1892. El químico escocés James Dewar lo diseñó para guardar gases muy fríos en su laboratorio. Años después, una empresa alemana lo vendió para el café, con el nombre Thermos.",P((0.15,"pop"),(0.55,"pop"),(0.85,"brillo"))),
("truco","el truco","Un truco: antes de servir, échale agua caliente un minuto y bótala. Así las paredes no le roban calor al café.",P((0.3,"agua_flujo"),(0.6,"chapoteo"),(0.85,"ding"))),
("cierre","así funciona","Dos paredes, vacío en medio, espejo por dentro y una buena tapa. Y con esto ya entiendes cómo funciona tu termo.",P((0.2,"pop"),(0.5,"brillo"),(0.85,"campana"))),
]
json.dump([dict(tipo=a,titulo=b,texto=c,sfx=d) for a,b,c,d in S],open('escenas.json','w'),ensure_ascii=False,indent=1)
n=sum(len(c.split()) for _,_,c,_ in S); print(len(S), n, 'palabras ->', round(n/190*60,1), 's a 190')
