"""publicacion.json del largo v24 (capítulos reales desde timeline.json)."""
import json
t = json.load(open('timeline.json'))['scenes']; e = json.load(open('escenas.json')); idx = {x['tipo']: i for i, x in enumerate(e)}
ch = [('gancho', 'El mito del centro helado'), ('anio', '1945: Percy Spencer y el chocolate'), ('patente', 'La patente y el primer Radarange'),
      ('caja', 'Cómo funciona: magnetrón y guía de onda'), ('agua', 'Por qué se calienta el agua'), ('frecuencia', 'Otro mito: la frecuencia del agua'),
      ('profundo', 'El mito: de adentro hacia afuera'), ('puntos', 'Puntos fríos y el plato que gira'), ('puerta', 'La rejilla, el tenedor y el huevo'),
      ('debate', '¿Es peligroso? Los dos lados'), ('nutrientes', '¿Destruye los nutrientes?'), ('repaso', 'Repaso')]
fmt = lambda s: f"{int(s // 60)}:{int(s % 60):02d}"
chap = '\n'.join(f"{fmt(t[idx[k]]['start']) if idx[k] else '0:00'} {n}" for k, n in ch)
desc = f"""🍲 ¿Por qué tu comida sale hirviendo por fuera y helada por dentro? Porque el microondas NO calienta de adentro hacia afuera.

📜 La historia empieza en 1945 con Percy Spencer, un ingeniero de Raytheon que trabajaba con magnetrones de radar. Luego armamos el microondas pieza por pieza en 3D, vemos los dos lados del debate sobre si es peligroso y desmentimos dos mitos.

🔎 Datos clave
• Spencer pidió la patente el 8 de octubre de 1945 (US 2,495,429, aprobada en 1950).
• El primer Radarange (1947) pesaba unos 340 kg y costaba alrededor de 5.000 dólares.
• Las microondas de un horno doméstico trabajan a unos 2,45 GHz y depositan casi toda su energía en los primeros 1 a 3 cm de la comida; el centro se calienta por conducción.
• 2,45 GHz no es la "frecuencia natural del agua": es una banda permitida para hornos y equipos industriales.
• En EE. UU. un horno no puede dejar escapar más de 5 mW/cm² a 5 cm en toda su vida útil (1 mW/cm² cuando es nuevo).

⏱️ Capítulos
{chap}

📚 Fuentes
• Spencer, P. L. (1950). Method of Treating Foodstuffs. Patente de EE. UU. 2,495,429.
• Davis, T. (2016). "A Brief History of the Microwave Oven". IEEE Spectrum.
• U.S. Food and Drug Administration (FDA). "Microwave Ovens" (Resources for You: Radiation-Emitting Products).
• Code of Federal Regulations, 21 CFR 1030.10 — Microwave ovens (performance standard).
• Vadivambal, R. y Jayas, D. S. (2010). "Non-uniform Temperature Distribution During Microwave Heating of Food Materials — A Review". Food and Bioprocess Technology, 3, 161–171.

💬 ¿Qué otro mito de la cocina quieres que pongamos a prueba? Escríbelo en los comentarios.

Video animado en 3D. Narración con voz clonada por IA de una persona real que dio su autorización.

#microondas #ciencia #mitos #historia #comofunciona"""
tags = ['microondas', 'cómo funciona el microondas', 'mitos del microondas', 'Percy Spencer', 'historia del microondas', 'magnetrón', 'ciencia', 'curiosidades', 'jxseng']
json.dump({'title': 'El microondas NO calienta la comida de adentro hacia afuera', 'description': desc, 'tags': tags}, open('publicacion.json', 'w'), ensure_ascii=False, indent=1)
print(len(desc), 'caracteres')
