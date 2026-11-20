import json
t = json.load(open('timeline.json'))['scenes']
caps = [(0, '¿Y si mañana no hubiera inodoro?'), (3, 'La calle'), (7, 'El agua'), (11, 'El Gran Hedor'), (15, 'Tu casa'), (19, '¿Quién lo inventó?'), (22, 'El mundo real')]
mm = lambda s: f"{int(s // 60)}:{int(s % 60):02d}"
cap = '\n'.join(f"{mm(t[i]['start'])} {n}" for i, n in caps)
d = f"""🚽 Imagina que mañana te despiertas, vas al baño… y no hay inodoro. Nunca se inventó. ¿Cómo sería tu calle, tu agua y tu casa?

Un "¿qué pasaría si…?" animado, con historia real: las bacinillas de Edimburgo, el mapa del cólera de John Snow, el Gran Hedor de Londres, la esponja romana y el tubo doblado que te salvó la vida.

⚠️ Ojo: esto no es solo un "¿qué pasaría si?". Según la OMS y UNICEF, cerca de 3.500 millones de personas todavía no tienen saneamiento seguro. Algunos detalles históricos (como los tacones o la esponja compartida) son interpretaciones de historiadores, no hechos 100 % comprobados.

⏱️ Capítulos
{cap}

📚 Fuentes
• Rose, C. et al. (2015). The characterization of feces and urine: a review of the literature. Critical Reviews in Environmental Science and Technology, 45(17).
• Snow, J. (1855). On the Mode of Communication of Cholera. Londres.
• UNICEF: enfermedades diarreicas en menores de 5 años (datos globales).
• Halliday, S. (1999). The Great Stink of London: Sir Joseph Bazalgette and the Cleansing of the Victorian Metropolis.
• Koloski-Ostrow, A. O. (2015). The Archaeology of Sanitation in Roman Italy. University of North Carolina Press.
• Harington, J. (1596). A New Discourse of a Stale Subject, called the Metamorphosis of Ajax.
• Cumming, A. Patente británica n.º 1105 (1775), inodoro con sifón en S.
• Hanley, S. B. (1987). Urban Sanitation in Preindustrial Japan. Journal of Interdisciplinary History, 18(1).
• OMS/UNICEF JMP (2023). Progress on household drinking water, sanitation and hygiene 2000–2022.
• Ferriman, A. (2007). BMJ readers choose the "sanitary revolution" as greatest medical advance since 1840. BMJ, 334:111.
• ONU, Resolución A/RES/67/291 (2013): Día Mundial del Retrete; Objetivo de Desarrollo Sostenible 6.2.

👇 ¿Qué invento "aburrido" crees que salvó al mundo? Cuéntamelo en los comentarios.

Video animado. Narración con voz clonada por IA de una persona real que dio su autorización.

#quepasariasi #ciencia #historia #curiosidades #jxseng"""
json.dump({'title': '¿Qué pasaría si nunca se hubiera inventado el inodoro?', 'description': d,
  'tags': ['qué pasaría si', 'inodoro', 'historia del inodoro', 'gran hedor de londres', 'john snow', 'saneamiento', 'curiosidades', 'ciencia', 'jxseng']},
  open('publicacion.json', 'w'), ensure_ascii=False, indent=1)
print(cap, len(d))
