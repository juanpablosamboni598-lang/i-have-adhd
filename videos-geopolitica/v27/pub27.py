import json
t = json.load(open('../v26/timeline.json'))['scenes']; E = json.load(open('../v26/escenas.json'))
mm = lambda s: f"{int(s // 60)}:{int(s % 60):02d}"
caps = [(0, '¿Y si mañana no hubiera inodoro?')] + [(i, e['planos'][0]['v'].split(':', 2)[2].capitalize()) for i, e in enumerate(E) if e['planos'][0]['v'].startswith('card')]
cap = '\n'.join(f"{mm(t[i]['start'])} {n}" for i, n in caps)
d = f"""🚽 Imagina que mañana te despiertas, vas al baño… y no hay inodoro. Nunca se inventó. ¿Cómo sería tu calle, tu agua y tu casa?

Un "¿qué pasaría si…?" animado, con historia real: las bacinillas de Edimburgo, el mapa del cólera de John Snow, el Gran Hedor de Londres, la esponja romana, el mito de Thomas Crapper, el baño de la Estación Espacial y el inodoro del futuro.

⚠️ Ojo: según la OMS y UNICEF, cerca de 3.500 millones de personas todavía no tienen saneamiento seguro. Algunos detalles históricos (como los tacones o la esponja compartida) son interpretaciones de historiadores, no hechos 100 % comprobados.

⏱️ Capítulos
{cap}

📚 Fuentes
• Rose, C. et al. (2015). The characterization of feces and urine. Critical Reviews in Environmental Science and Technology, 45(17).
• Snow, J. (1855). On the Mode of Communication of Cholera.
• UNICEF: enfermedades diarreicas en menores de 5 años.
• Halliday, S. (1999). The Great Stink of London.
• Koloski-Ostrow, A. O. (2015). The Archaeology of Sanitation in Roman Italy.
• Harington, J. (1596). The Metamorphosis of Ajax.
• Cumming, A. Patente británica n.º 1105 (1775).
• Hanley, S. B. (1987). Urban Sanitation in Preindustrial Japan. Journal of Interdisciplinary History, 18(1).
• OMS/UNICEF JMP (2023). Progress on household drinking water, sanitation and hygiene 2000–2022.
• Ferriman, A. (2007). BMJ, 334:111.
• ONU, Resolución A/RES/67/291 (2013).
• Thomas Crapper & Co.: patentes de mejoras de fontanería (Londres, siglo XIX).
• Joseph Gayetty: "Medicated Paper", Nueva York (1857).
• NASA: transcripciones de la misión Apolo 10 (1969).
• NASA (2023): recuperación de agua en la Estación Espacial Internacional.
• Fundación Bill y Melinda Gates: Reinvent the Toilet Challenge (2011).
• Oficina del Gabinete de Japón: encuesta de consumo de hogares.

👇 ¿Qué invento "aburrido" crees que salvó al mundo? Cuéntamelo en los comentarios.

#quepasariasi #ciencia #historia #curiosidades #jxseng"""
p = json.load(open('publicacion.json')); p['description'] = d
json.dump(p, open('publicacion.json', 'w'), ensure_ascii=False, indent=1)
print(cap); print(len(d))
