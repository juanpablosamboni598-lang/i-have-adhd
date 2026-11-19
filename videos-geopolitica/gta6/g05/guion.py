"""g05 (video largo, 19 nov 2026): GTA 6 sacó 99 en Metacritic. Reseñas, quejas, ventas y guía de la primera hora.
Genera escenas.json (tipo, texto, p, caps). Uso: python3 gta6/g05/guion.py && python3 gta6/g05/mk.py
Fuentes (19 nov 2026): Metacritic vía Notebookcheck, Insider Gaming, Dot Esports, Al Jazeera; quejas y elogios vía
The Statesman, The National, Deadline, GamingBible; 30 fps: Marc Chambers (Rockstar) a Kotaku; GTA V: Guinness;
proyección: Piper Sandler; guías del día 1: TechRadar, GTABase, Gamenguide; online: GGRecon/Gfinity (sin fecha oficial)."""
import json, os
L, R, B, G, W = 'lime', 'red', 'blue', 'gray', 'text'
S = []
def s(tipo, texto, caps, **p): S.append({'tipo': tipo, 'titulo': f'{len(S)}_{tipo}', 'texto': texto, 'p': p, 'caps': caps})

s('nota', "GTA seis sacó noventa y nueve en Metacritic. Es la nota más alta que existe, la misma que tiene Ocarina of Time. Pero, ¿de verdad es tan bueno? Hoy te cuento qué dicen las reseñas, qué no les gustó a los críticos, y qué hacer en tu primera hora.",
  [['noventa|99', '^l99 EN METACRITIC'], ['alta', 'LA NOTA ^lMÁS ^lALTA'], ['verdad', '¿DE VERDAD ES ^rTAN ^rBUENO?'], ['primera', 'TU ^lPRIMERA ^lHORA']],
  tag='99', to=99, digits=2, suffix='/100', lines=['METACRITIC', '19 NOV 2026'])
s('barras', "Primero, el número. Metacritic junta las reseñas de la prensa y saca un promedio. Con más de ciento cuarenta reseñas, GTA seis está en noventa y nueve. Y cuando salieron las reseñas, ninguna era mixta ni negativa.",
  [['promedio', 'UN ^bPROMEDIO'], ['ciento|140', '^l+140 RESEÑAS'], ['negativa', '^l0 ^lMIXTAS, ^l0 ^lNEGATIVAS']],
  items=[['POSITIVAS', 140, L], ['MIXTAS', 0, G], ['NEGATIVAS', 0, R]], maxv=160, unit='')
s('lista', "Piénsalo como un restaurante con ciento cuarenta críticos. Que todos le pongan nota alta no significa que el plato sea perfecto. Significa que casi nadie salió decepcionado.",
  [['restaurante', 'UN ^bRESTAURANTE'], ['perfecto', 'NO ES ^rPERFECTO'], ['decepcionado', 'NADIE ^lDECEPCIONADO']],
  items=[['9.5', L], ['10', L], ['9', L], ['10', L], ['9.5', L]], lines=['140 CRÍTICOS'])
s('barras', "Ahora, el empate. Ocarina of Time también tiene noventa y nueve, pero con veintidós reseñas. GTA seis lo logró con unas siete veces más críticos. Por eso algunos lo ponen primero, aunque la nota que se ve es la misma.",
  [['empate', '^bEMPATE ^bEN ^b99'], ['veintidós|22', 'OCARINA: ^b22 RESEÑAS'], ['siete', '^l~7 ^lVECES MÁS'], ['misma', 'LA ^lMISMA NOTA']],
  items=[['OCARINA', 22, G], ['GTA 6', 150, L]], maxv=170, unit='')
s('barras', "Y dentro de la propia casa, también es un récord. GTA cuatro tenía noventa y ocho, y GTA cinco, noventa y siete. Ningún juego de la saga había llegado tan alto.",
  [['récord|record', 'RÉCORD ^lDE ^lROCKSTAR'], ['cuatro', 'GTA IV: 98'], ['cinco', 'GTA V: 97'], ['alto', '^lNINGUNO TAN ALTO']],
  items=[['GTA IV', 98, G], ['GTA V', 97, G], ['GTA 6', 99, L]], maxv=100, unit='', base=90)
s('pantalla', "Ojo con algo. Esa nota es de la prensa, que jugó antes y con tiempo. La nota de los jugadores todavía no aparece, porque casi nadie ha alcanzado a jugarlo. Y el número de la prensa todavía se puede mover.",
  [['prensa', 'NOTA DE LA ^bPRENSA'], ['jugadores', '¿Y LOS ^rJUGADORES?'], ['mover', 'PUEDE ^rMOVERSE']],
  scr='?', lines=['NOTA DE USUARIOS:', 'AÚN SIN DATOS'])
s('duo', "Pasemos a lo que más elogiaron. Casi todas las reseñas hablan de Jason y Lucía. Dicen que su historia de pareja es lo más maduro que ha hecho Rockstar en esta saga.",
  [['elogiaron', 'LO MÁS ^lELOGIADO'], ['lucia', '^rJASON ^bY ^bLUCÍA'], ['maduro', 'LO MÁS ^lMADURO']],
  lines=['JASON + LUCÍA'])
s('etiqueta', "En The Guardian escribieron que el juego los emocionó más de lo que esperaban. Y Worthplaying le dio nueve y medio sobre diez, destacando justo esa relación.",
  [['guardian', '^bTHE ^bGUARDIAN'], ['emociono', 'MÁS ^lEMOCIONANTE'], ['nueve', '^l9.5 ^l/ ^l10']],
  tag='9.5', color=L, lines=['WORTHPLAYING', '9.5 / 10'])
s('mapa', "Lo segundo es el mundo. The Guardian lo llamó el mundo virtual más detallado que hemos visto. Y Leonida no es solo Vice City: tiene cayos, pantanos, pueblos y montaña.",
  [['segundo', 'LO SEGUNDO: ^lEL ^lMUNDO'], ['detallado', 'EL ^lMÁS ^lDETALLADO'], ['leonida', '^bLEONIDA'], ['montana', 'CAYOS, PANTANOS, ^lMONTAÑA']],
  pins=[['VICE CITY', R], ['LEONIDA KEYS', L], ['GRASSRIVERS', L], ['PORT GELLHORN', B], ['AMBROSIA', 'gold'], ['MT. KALAGA', W]])
s('pantalla', "Y el tono es distinto al de Red Dead Redemption dos. Uno de los críticos describió Leonida como un parque de fiesta y exceso, muy lejos del oeste duro de Red Dead.",
  [['tono', 'OTRO ^bTONO'], ['fiesta', '^lFIESTA ^lY ^lEXCESO'], ['oeste', 'LEJOS DEL ^rOESTE']],
  scr='SOL', lines=['LEONIDA ≠', 'RED DEAD 2'])
s('estrellas', "Lo tercero, la policía. TechRadar elogió el sistema de búsqueda, y Game Informer dijo que hasta las actividades de todos los días se sienten tan bien como los grandes golpes.",
  [['tercero', 'LO TERCERO: ^bLA ^bPOLICÍA'], ['busqueda', 'SISTEMA ^lDE ^lBÚSQUEDA'], ['golpes', 'TAN BUENO COMO ^lLOS ^lGOLPES']],
  n=5, lines=['TECHRADAR', 'GAME INFORMER'])
s('fps', "Ahora, lo que no les gustó. La queja número uno: el juego corre a treinta cuadros por segundo en todas las consolas. Incluso en PS cinco Pro. No hay modo de sesenta.",
  [['gusto', 'LO QUE ^rNO ^rGUSTÓ'], ['treinta', '^r30 FPS'], ['pro', 'INCLUSO ^rPS5 ^rPRO'], ['sesenta', '^sMODO ^s60']],
  a='60', b='30', lines=['TODAS LAS CONSOLAS', '30 FPS'])
s('consola', "Rockstar explicó por qué. Según Marc Chambers, de Rockstar, en una entrevista con Kotaku, el procesador de la PS cinco Pro es apenas un poco mejor que el de la normal, y no aguanta toda la simulación del juego a más velocidad.",
  [['explico', 'LA ^bRESPUESTA ^bDE ^bROCKSTAR'], ['procesador', 'EL ^rPROCESADOR'], ['simulacion', 'DEMASIADA ^rSIMULACIÓN']],
  lines=['ROCKSTAR A KOTAKU:', 'LA CPU NO ALCANZA'])
s('fps', "¿Va a cambiar con un parche? Rockstar no ha anunciado ningún modo de sesenta cuadros. Así que, por ahora, asume que vas a jugar a treinta.",
  [['parche', '¿UN ^bPARCHE?'], ['anunciado', '^rNO ^rANUNCIADO'], ['ahora', 'POR AHORA: ^r30']],
  a='60 ?', b='30', lines=['MODO 60 FPS:', 'NO ANUNCIADO'])
s('reloj', "La queja número dos es el ritmo. La historia pasa mucho tiempo en la vida diaria de Jason y Lucía antes de llegar a los golpes grandes. A varios críticos, los primeros capítulos se les hicieron lentos.",
  [['dos', 'QUEJA ^r#2'], ['ritmo', 'EL ^rRITMO'], ['lentos', 'INICIO ^rLENTO']],
  tag='LENTO', lines=['PRIMEROS CAPÍTULOS', '= LENTOS'])
s('lista', "La tercera son los controles. Algunos dicen que los combates se sienten torpes, que la rueda de armas es incómoda, y que a veces una misión falla sin que quede claro por qué.",
  [['tercera', 'QUEJA ^r#3'], ['controles', 'LOS ^rCONTROLES'], ['armas', 'LA ^rRUEDA ^rDE ^rARMAS'], ['claro', 'FALLA ^rSIN ^rEXPLICAR']],
  items=[['COMBATE TORPE', R], ['RUEDA DE ARMAS', R], ['FALLOS CONFUSOS', R]])
s('lista', "Y hay detalles más chicos. Algunas misiones se sienten repetitivas, varios chistes no envejecieron bien, las motos se manejan rígidas, y no se pueden repetir las misiones que ya terminaste.",
  [['chicos', 'DETALLES ^bMÁS ^bCHICOS'], ['repetitivas', '^rREPETITIVO'], ['motos', 'MOTOS ^rRÍGIDAS'], ['repetir', '^rSIN ^rREPETIR MISIONES']],
  items=[['REPETITIVO', G], ['CHISTES VIEJOS', G], ['MOTOS RÍGIDAS', G], ['SIN REPETIR', R]])
s('balanza', "Entonces, ¿es el mejor juego de la historia? Eso no lo decide un número. Lo que sí dice el noventa y nueve es que casi nadie en la prensa salió decepcionado. Pero los treinta cuadros y el inicio lento son reales, y te pueden molestar.",
  [['historia', '¿EL ^lMEJOR ^lDE ^lLA ^lHISTORIA?'], ['numero', 'NO LO DECIDE ^rUN ^rNÚMERO'], ['reales', 'PERO ^rSON ^rREALES']],
  a='99', b='30 FPS')
s('pantalla', "Pero eso no es lo más raro. Lo más raro es que, con toda esta expectativa, todavía no hay cifras oficiales de ventas. Ni Rockstar ni Take-Two las han publicado.",
  [['raro', 'PERO ESO NO ES ^rLO ^rMÁS ^rRARO'], ['ventas', '^r¿VENTAS?'], ['publicado', 'SIN ^rCIFRAS ^rOFICIALES']],
  scr='?', lines=['VENTAS OFICIALES:', 'SIN PUBLICAR'])
s('barras', "Lo que hay son estimaciones. El banco Piper Sandler calculó que podría vender más de cuarenta y cinco millones de copias el primer día. Pero eso es una proyección, no un dato.",
  [['estimaciones', 'SOLO ^bESTIMACIONES'], ['cuarenta', '^b+45 ^bMILLONES?'], ['proyeccion', '^rPROYECCIÓN, ^rNO ^rDATO']],
  items=[['GTA V', 11.2, G], ['PROYECCIÓN', 45, B]], maxv=50, unit='M')
s('nota', "Para comparar, GTA cinco vendió once punto dos millones de copias en sus primeras veinticuatro horas, y facturó ochocientos quince millones de dólares. Ese récord lo registró Guinness.",
  [['comparar', 'PARA ^bCOMPARAR'], ['once', '^l11.2 ^lMILLONES'], ['ochocientos', '^l$815 ^lMILLONES'], ['guinness', 'RÉCORD ^bGUINNESS']],
  tag='GTA V', to=11210000, digits=8, suffix='COPIAS', lines=['GUINNESS:', 'GTA V EN 24 H'])
s('pantalla', "Y algo importante. Las reseñas se hicieron antes del lanzamiento, sin servidores llenos ni errores del día uno. Si te pasó alguno, en el canal ya hay un video sobre los errores y cómo arreglarlos.",
  [['importante', 'ALGO ^bIMPORTANTE'], ['antes', 'RESEÑAS ^bANTES ^bDEL ^bLANZAMIENTO'], ['errores', 'ERRORES ^rDEL ^rDÍA ^r1']],
  scr='!', lines=['VIDEO EN EL CANAL:', 'ERRORES DEL DÍA 1'])
s('reloj', "Ahora, lo práctico. Si vas a empezar hoy, esto es lo que recomiendan las primeras guías para tu primera hora. Algunas cosas pueden cambiar con parches, así que tómalo como punto de partida.",
  [['practico', '^lLO ^lPRÁCTICO'], ['primera', 'TU ^lPRIMERA ^lHORA'], ['parches', 'PUEDE ^rCAMBIAR']],
  tag='1 H', lines=['GUÍA:', 'PRIMERA HORA'])
s('disco', "Uno, el espacio. Según reportes, la descarga ronda los doscientos doce gigas, depende de la consola. Rockstar no publicó la cifra exacta por plataforma, así que libera de sobra.",
  [['uno', '^l#1 ESPACIO'], ['doscientos', '^b~212 ^bGB'], ['sobra', 'LIBERA ^lDE ^lSOBRA']],
  tag='~212 GB', fill=[0.3, 0.95], lines=['NO OFICIAL', 'POR CONSOLA'])
s('pantalla', "Dos, el brillo. Muchas escenas pasan de noche. Usa la calibración de brillo del menú antes de empezar, para no perderte nada en las zonas oscuras.",
  [['dos', '^l#2 BRILLO'], ['noche', 'ESCENAS ^bDE ^bNOCHE'], ['calibracion', '^lCALIBRA ^lEL ^lBRILLO']],
  scr='LUZ', lines=['AJUSTES >', 'BRILLO'])
s('consola', "Tres, los controles. Según varias guías, en los ajustes hay un esquema clásico, parecido al de GTA cinco. Si vienes de ahí, te va a resultar más fácil.",
  [['tres', '^l#3 CONTROLES'], ['clasico', 'ESQUEMA ^lCLÁSICO'], ['cinco', 'COMO ^bGTA ^bV']],
  lines=['AJUSTES >', 'CONTROLES: CLÁSICO'])
s('mapa', "Cuatro, empieza por la historia. Las primeras misiones te enseñan los controles y te abren el mapa. Si sales a pasear sin plan, lo normal es terminar sin auto, con estrellas, y sin dinero.",
  [['cuatro', '^l#4 HISTORIA ^lPRIMERO'], ['mapa', 'ABREN ^lEL ^lMAPA'], ['plan', '^rSIN ^rPLAN...']],
  pins=[['VICE CITY', R], ['LEONIDA KEYS', L]])
s('reloj', "Y ten paciencia. El inicio es lento a propósito. Si una misión nueva no aparece, búscala en la lista de misiones, en la pantalla del mapa.",
  [['paciencia', '^bPACIENCIA'], ['proposito', 'LENTO ^bA ^bPROPÓSITO'], ['lista', 'LISTA ^lDE ^lMISIONES']],
  tag='MAPA', lines=['MAPA >', 'LISTA DE MISIONES'])
s('dinero', "Cinco, tu dinero. Según las guías, si te matan o te arrestan, pierdes el efectivo que llevas encima. Deposítalo en el banco desde la app del teléfono.",
  [['cinco', '^l#5 TU ^lDINERO'], ['pierdes', '^rPIERDES ^rEL ^rEFECTIVO'], ['banco', '^lDEPOSÍTALO']],
  scr='BANCO', lines=['EFECTIVO →', 'BANCO'])
s('estrellas', "Seis, la policía tiene memoria. Según las guías, recuerda tu ropa y tu auto. Si te persiguen, cambiarte de ropa o de vehículo te ayuda a perderlos.",
  [['seis', '^l#6 LA ^lPOLICÍA'], ['memoria', 'TIENE ^rMEMORIA'], ['ropa', 'CAMBIA ^lROPA ^lY ^lAUTO']],
  n=3, lines=['ROPA + AUTO', '= TE RECONOCEN'])
s('ranuras', "Siete, guarda a mano. Hay confusión con el autoguardado, y hay reportes de cierres. Guarda en varias ranuras, sobre todo antes de una misión larga.",
  [['siete', '^l#7 GUARDA ^lA ^lMANO'], ['autoguardado', '^r¿AUTOGUARDADO?'], ['ranuras', '^lVARIAS ^lRANURAS']],
  lines=['ANTES DE UNA', 'MISIÓN LARGA'])
s('pantalla', "Y ocho, no busques el modo online todavía. Según varios medios, el juego salió solo con la historia, y Rockstar no ha dado fecha para el online. Cualquier fecha que veas, por ahora, es rumor.",
  [['ocho', '^l#8 ONLINE'], ['todavia', '^rTODAVÍA ^rNO'], ['fecha', '^rSIN ^rFECHA'], ['rumor', 'FECHAS = ^rRUMOR']],
  scr='OFF', lines=['ONLINE:', 'SIN FECHA OFICIAL'])
s('lista', "Resumen. La prensa le dio noventa y nueve. Lo mejor: la historia, el mundo, y la policía. Lo peor: los treinta cuadros, el inicio lento, y unos controles que no convencen a todos.",
  [['resumen', '^bRESUMEN'], ['mejor', '^lLO ^lMEJOR'], ['peor', '^rLO ^rPEOR']],
  items=[['HISTORIA', L], ['MUNDO', L], ['POLICÍA', L], ['30 FPS', R], ['INICIO LENTO', R]])
s('spoilers', "Y si todavía no empiezas, cuidado con los spoilers. Hoy medio internet está subiendo videos del final. Silencia palabras clave, y juega tú primero.",
  [['spoilers', 'CUIDADO: ^rSPOILERS'], ['silencia', '^lSILENCIA ^lPALABRAS'], ['primero', 'JUEGA ^lTÚ ^lPRIMERO']])
s('nota', "Cuéntame en los comentarios: ¿tú le pondrías noventa y nueve? Porque GTA seis sacó noventa y nueve en Metacritic, pero la última palabra la tienen los que lo juegan.",
  [['comentarios', '^bCOMENTARIOS'], ['pondrias', '¿LE PONDRÍAS ^l99?'], ['palabra', 'LA ^lÚLTIMA ^lPALABRA: ^lTÚ']],
  tag='99 ?', to=99, digits=2, suffix='/100', lines=['¿Y TU NOTA?'])

here = os.path.dirname(os.path.abspath(__file__))
json.dump(S, open(f'{here}/escenas.json', 'w'), ensure_ascii=False, indent=1)
print('escenas', len(S), 'palabras', sum(len(x['texto'].split()) for x in S))
