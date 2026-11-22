"""g06 (video largo, animación 2D): el adolescente que filtró GTA 6 desde un cuarto de hotel.
Formato de historia (gancho, misterio, giro, final que vuelve al inicio). Sin nombrar a la persona.
Fuentes: Rockstar (comunicado sep 2022), GamesRadar, PC Gamer, NME, CBS News, Engadget, TechRadar,
SecurityWeek (fallo dic 2023), GamesRadar/PC Gamer (jul 2026: el caso sigue). Lo no confirmado se dice como reporte.
Uso: python3 gta6/g06/guion.py && python3 gta6/g06/mk.py"""
import json, os
L, R, B, G, W = 'lime', 'red', 'blue', 'gray', 'text'
S = []
def s(tipo, texto, caps, **p): S.append({'tipo': tipo, 'titulo': f'{len(S)}_{tipo}', 'texto': texto, 'p': p, 'caps': caps})

# --- gancho
s('cuarto', "En dos mil veintidós, un adolescente de diecisiete años estaba encerrado en un cuarto de hotel, vigilado por la policía y sin computador. Desde ese cuarto, logró algo que nadie había logrado. Robó GTA seis. Y lo hizo con el televisor del hotel.",
  [['diecisiete|17', '^r17 AÑOS'], ['hotel', 'UN ^bCUARTO ^bDE ^bHOTEL'], ['computador', '^sCOMPUTADOR'], ['robo', 'ROBÓ ^rGTA ^r6'], ['televisor', 'CON ^lEL ^lTELEVISOR']],
  scr='?', lines=['SEPTIEMBRE 2022'])
s('titulo', "Esta es la historia de la filtración más grande de la historia de los videojuegos. Y de cómo terminó.",
  [['filtracion', 'LA ^rFILTRACIÓN'], ['grande', 'MÁS ^rGRANDE'], ['termino', '¿CÓMO ^lTERMINÓ?']],
  head='LA FILTRACIÓN', sub='GTA 6 · 2022')
# --- el domingo
s('calendario', "Domingo, dieciocho de septiembre de dos mil veintidós. Rockstar llevaba años sin mostrar nada de GTA seis. Ni un tráiler. Ni una imagen. Solo un anuncio de una línea, meses antes, que decía que el juego estaba en desarrollo.",
  [['dieciocho|18', '^b18 ^bSEP ^b2022'], ['nada', '^rNADA'], ['trailer', '^sTRÁILER'], ['desarrollo', '"EN ^lDESARROLLO"']],
  day='18', month='SEP', year='2022')
s('foro', "Esa noche, en un foro de fans muy conocido, apareció una publicación. Un usuario nuevo subió noventa videos. Eran clips cortos, con colores raros y textos de prueba en la pantalla.",
  [['foro', 'UN ^bFORO ^bDE ^bFANS'], ['nuevo', 'UN USUARIO ^rNUEVO'], ['noventa|90', '^r90 ^rVIDEOS'], ['prueba', 'TEXTOS ^lDE ^lPRUEBA']],
  to=90, user='usuario_nuevo', lines=['90 CLIPS', 'VERSIÓN DE PRUEBA'])
s('tv', "En los videos se veía una ciudad con palmeras, letreros de neón y patrullas. La gente la reconoció al instante. Era Vice City.",
  [['palmeras', 'PALMERAS ^bY ^bNEÓN'], ['patrullas', '^rPATRULLAS'], ['instante', 'AL ^lINSTANTE'], ['vice', '^lVICE ^lCITY']],
  scr='VICE', lines=['¿VICE CITY?'])
s('duo2', "Y había algo más. Por primera vez en un GTA moderno, uno de los protagonistas era una mujer. Dos personajes, un hombre y una mujer, robando juntos una cafetería.",
  [['algo', 'ALGO ^bMÁS'], ['mujer', 'UNA ^lPROTAGONISTA'], ['juntos', '^bJUNTOS'], ['cafeteria', 'UN ^rROBO']],
  lines=['2 PROTAGONISTAS'])
s('contador', "Internet explotó. En pocas horas, los clips estaban en todas partes. Los fans no sabían si creer, y muchos pensaron que era falso.",
  [['exploto', 'INTERNET ^rEXPLOTÓ'], ['horas', 'EN ^rHORAS'], ['falso', '¿^bFALSO?']],
  to=90, suffix=' CLIPS', lines=['TODO INTERNET'])
s('titular', "Pero al día siguiente, Rockstar habló. Confirmó que alguien había entrado sin permiso a su red y se había llevado información confidencial, incluidos esos videos. Dijo que estaba extremadamente decepcionada.",
  [['rockstar', 'ROCKSTAR ^bHABLÓ'], ['permiso', 'ENTRÓ ^rSIN ^rPERMISO'], ['confidencial', 'INFORMACIÓN ^rCONFIDENCIAL'], ['decepcionada', '"^rEXTREMADAMENTE ^rDECEPCIONADA"']],
  head='ES REAL', sub='ROCKSTAR CONFIRMA EL ACCESO')
s('pantalla', "Los videos eran reales. Pero eran de una versión muy temprana del juego. Rockstar aclaró que eso no iba a retrasar el desarrollo, y pidió que la gente esperara el juego de verdad.",
  [['reales', '^lERAN ^lREALES'], ['temprana', 'VERSIÓN ^rTEMPRANA'], ['retrasar', '^sRETRASO'], ['verdad', 'EL JUEGO ^lDE ^lVERDAD']],
  scr='BETA', lines=['VERSIÓN TEMPRANA', 'NO ES EL FINAL'])
s('borrar', "Take Two, la dueña de Rockstar, empezó a pedir que se borraran los clips de todas partes. Pero ya era tarde. Ya se habían visto millones de veces.",
  [['take', '^bTAKE-TWO'], ['borraran', 'BORRAR ^rTODO'], ['tarde', 'YA ERA ^rTARDE'], ['millones', '^rMILLONES ^rDE ^rVECES']],
  n=9)
# --- quién
s('figura', "Entonces vino la pregunta que todos se hacían. ¿Quién había sido? ¿Un empleado molesto? ¿Un grupo de hackers profesionales? La respuesta era mucho más rara.",
  [['quien', '^r¿QUIÉN?'], ['empleado', '¿UN ^bEMPLEADO?'], ['profesionales', '¿^bPROFESIONALES?'], ['rara', 'MUCHO ^lMÁS ^lRARA']],
  tag='?')
s('figura', "Era un adolescente británico de diecisiete años. Formaba parte de Lapsus, un grupo que ya había atacado a empresas enormes de tecnología.",
  [['adolescente', 'UN ^rADOLESCENTE'], ['diecisiete|17', '^r17 AÑOS'], ['lapsus', 'GRUPO ^bLAPSUS$'], ['enormes', 'EMPRESAS ^lENORMES']],
  tag='17')
s('red', "Y aquí viene lo increíble. Cuando entró a Rockstar, ya lo habían arrestado antes por otros ataques. Estaba en libertad bajo fianza, y le habían quitado su computador portátil.",
  [['increible', 'LO ^lINCREÍBLE'], ['arrestado', 'YA LO HABÍAN ^rARRESTADO'], ['fianza', 'BAJO ^bFIANZA'], ['portatil', 'SIN ^rPORTÁTIL']],
  labels=['NVIDIA', 'BT / EE', 'ROCKSTAR'])
s('cuarto', "Por su seguridad, la policía lo había alojado en un hotel cerca de Oxford, en Inglaterra. Sin computador, en teoría no podía hacer nada.",
  [['seguridad', 'POR SU ^bSEGURIDAD'], ['oxford', 'CERCA DE ^bOXFORD'], ['teoria', 'EN ^rTEORÍA'], ['nada', '^rNADA']],
  scr=' ', lines=['HOTEL', 'BAJO PROTECCIÓN'])
s('kit', "Pero según se contó en el juicio, usó lo que tenía a mano. Un dispositivo de streaming, de esos que se conectan al televisor. Un teclado. Un mouse. Y un celular.",
  [['juicio', 'SEGÚN ^bEL ^bJUICIO'], ['streaming', 'UN ^lSTICK ^lDE ^lTV'], ['teclado', '^lTECLADO'], ['celular', '^lCELULAR']],
  items=['TV', 'STICK', 'TECLADO', 'MOUSE', 'CELULAR'])
s('chat', "Con eso, entró a la aplicación de mensajes interna de Rockstar, donde trabajan sus empleados. Y desde adentro, sacó los videos.",
  [['mensajes', 'EL ^bCHAT ^bINTERNO'], ['empleados', 'DE LOS ^bEMPLEADOS'], ['adentro', 'DESDE ^rADENTRO']],
  msgs=[['equipo', 'subí el clip nuevo'], ['equipo', 'revisen la build'], ['???', 'hola'], ['???', 'tengo los videos']])
s('chat', "Según la fiscalía, no se quedó ahí. Escribió en los canales de la empresa, y amenazó con publicar también el código del juego si no le respondían.",
  [['fiscalia', 'SEGÚN ^bLA ^bFISCALÍA'], ['canales', 'ESCRIBIÓ ^rADENTRO'], ['codigo', 'EL ^rCÓDIGO ^rDEL ^rJUEGO']],
  msgs=[['???', 'respondan'], ['???', 'o publico el código'], ['sistema', 'acceso cerrado']])
s('sirena', "Unos días después de la filtración, la policía de Londres lo arrestó otra vez en Oxfordshire. Esta vez, la cosa iba en serio.",
  [['dias', 'DÍAS DESPUÉS'], ['londres', 'POLICÍA ^bDE ^bLONDRES'], ['otra', '^rOTRA ^rVEZ'], ['serio', 'EN ^rSERIO']],
  lines=['SEPTIEMBRE 2022', 'ARRESTO'])
# --- el costo
s('dinero', "¿Cuánto le costó a Rockstar? En el juicio, la empresa dijo que el ataque le costó unos cinco millones de dólares, y miles de horas de trabajo de su equipo.",
  [['costo', '¿CUÁNTO ^rCOSTÓ?'], ['cinco|5', '^r~US$5 ^rMILLONES'], ['horas', '^rMILES ^rDE ^rHORAS']],
  to=5, suffix=' M US$', lines=['SEGÚN ROCKSTAR', 'EN EL JUICIO'])
s('cuarto2', "Y hay un costo que no se mide en dinero. Durante años, cada persona del equipo trabajó sabiendo que su juego había salido a la luz antes de tiempo, en su peor versión.",
  [['dinero', 'NO ^bSE ^bMIDE'], ['equipo', 'EL ^bEQUIPO'], ['peor', 'SU ^rPEOR ^rVERSIÓN']],
  lines=['AÑOS DE TRABAJO'])
# --- el juicio
s('juez', "Llegó el juicio. Pero antes, los médicos dijeron que no estaba en condiciones de enfrentarlo, por un diagnóstico de autismo. Así que el jurado no decidía si era culpable. Solo si había hecho los actos.",
  [['juicio', 'EL ^bJUICIO'], ['condiciones', 'NO ^rAPTO'], ['culpable', '^sCULPABLE'], ['actos', 'SOLO ^lLOS ^lACTOS']],
  text='¿LO HIZO?', lines=['2023'])
s('juez', "En agosto de dos mil veintitrés, el jurado decidió que sí. Él había hecho los ataques, incluido el de Rockstar.",
  [['agosto', '^bAGOSTO ^b2023'], ['si', '^lSÍ'], ['rockstar', 'INCLUIDO ^rROCKSTAR']],
  text='SÍ', lines=['AGOSTO 2023'])
s('juez', "Y en diciembre llegó la decisión final. El juez dijo que seguía siendo un riesgo, porque había dicho que quería volver a hackear apenas pudiera. Lo envió a un hospital seguro, sin fecha de salida, hasta que los médicos dijeran lo contrario.",
  [['diciembre', '^bDICIEMBRE ^b2023'], ['riesgo', 'UN ^rRIESGO'], ['hackear', 'VOLVER ^rA ^rHACKEAR'], ['hospital', 'HOSPITAL ^bSEGURO'], ['fecha', '^rSIN ^rFECHA']],
  text='∞', lines=['DICIEMBRE 2023'])
s('calendario', "Pero la historia no terminó ahí. Según reportes de este año, salió de ese hospital, y su caso volvió a los tribunales. Mientras hago este video, ese proceso sigue.",
  [['termino', 'NO ^rTERMINÓ'], ['reportes', 'SEGÚN ^bREPORTES'], ['tribunales', 'VOLVIÓ ^bA ^bTRIBUNALES'], ['sigue', '^lSIGUE']],
  day='?', month='2026', year='EN PROCESO')
# --- después
s('figura', "Y las filtraciones siguieron persiguiendo a Rockstar. En octubre de dos mil veinticinco, la empresa despidió a más de treinta empleados en Reino Unido y Canadá. Rockstar dijo que habían compartido información confidencial en un foro público.",
  [['persiguiendo', 'LAS FILTRACIONES ^rSIGUIERON'], ['octubre', '^bOCTUBRE ^b2025'], ['treinta|30', '^r+30 ^rDESPEDIDOS'], ['confidencial', 'SEGÚN ROCKSTAR: ^rFILTRARON']],
  tag='+30')
s('chat', "Pero un sindicato británico dice otra cosa. Según el sindicato, ese foro era un grupo privado donde hablaban de sus condiciones de trabajo, y llevó el caso a los tribunales. Las dos versiones siguen enfrentadas.",
  [['sindicato', 'EL ^bSINDICATO'], ['privado', 'UN GRUPO ^bPRIVADO'], ['condiciones', 'CONDICIONES ^lDE ^lTRABAJO'], ['enfrentadas', 'DOS ^rVERSIONES']],
  msgs=[['rockstar', 'filtraron información'], ['sindicato', 'era un chat privado'], ['sistema', 'caso en tribunales']])
s('calendario', "Mientras tanto, el juego se retrasó dos veces. Primero, de dos mil veinticinco a mayo de dos mil veintiséis. Y después, al diecinueve de noviembre de dos mil veintiséis, el día en que por fin salió.",
  [['retraso', 'SE ^rRETRASÓ'], ['mayo', '^s2025 → ^sMAYO ^s2026'], ['diecinueve|19', '^l19 ^lNOV ^l2026'], ['salio', 'POR FIN ^lSALIÓ']],
  day='19', month='NOV', year='2026')
# --- el giro
s('tv', "Ahora, lo curioso. Aquellos clips de dos mil veintidós, que muchos creyeron falsos, mostraban justo lo que después confirmó el tráiler. Vice City. Y una pareja protagonista, Jason y Lucía.",
  [['curioso', 'LO ^lCURIOSO'], ['falsos', '^sFALSOS'], ['trailer', 'EL ^bTRÁILER'], ['vice', '^lVICE ^lCITY'], ['lucia', '^rJASON ^bY ^bLUCÍA']],
  scr='2022', lines=['LO QUE SE VIO', 'ERA REAL'])
s('contador', "Y hasta el primer tráiler, en diciembre de dos mil veintitrés, se filtró. Una copia apareció en redes horas antes, y Rockstar lo tuvo que publicar antes de tiempo. Aun así, rompió récords de vistas en su primer día.",
  [['primer', 'EL ^bPRIMER ^bTRÁILER'], ['filtro', 'TAMBIÉN ^rSE ^rFILTRÓ'], ['antes', '^rANTES ^rDE ^rTIEMPO'], ['records|record', '^lRÉCORD ^lDE ^lVISTAS']],
  to=90, suffix=' M', lines=['~90 M DE VISTAS', 'EN 24 H (REPORTADO)'])
s('balanza2', "Y aquí está el giro. Rockstar dijo en dos mil veintidós que la filtración no cambiaría nada. Y, a su manera, tuvo razón: el juego salió completo, cuatro años después, y la crítica le dio noventa y nueve.",
  [['giro', 'EL ^lGIRO'], ['nada', '"NO CAMBIA ^lNADA"'], ['completo', '^lCOMPLETO'], ['noventa|99', '^l99 EN METACRITIC']],
  a='2022', b='2026')
s('lista2', "La lección es simple. Lo que se filtra casi nunca es el juego final. Son piezas sueltas, sin terminar, sacadas de contexto. Por eso, cuando veas una filtración, tómala como lo que es: un rumor, hasta que el estudio lo confirme.",
  [['leccion', 'LA ^bLECCIÓN'], ['final', '^sJUEGO ^sFINAL'], ['contexto', 'SIN ^rCONTEXTO'], ['rumor', 'FILTRACIÓN = ^rRUMOR'], ['confirme', 'HASTA QUE ^lSE ^lCONFIRME']],
  items=[['PIEZAS SUELTAS', R], ['SIN TERMINAR', R], ['SIN CONTEXTO', R], ['= RUMOR', L]])
s('cuarto', "Cuéntame en los comentarios: ¿tú viste esos clips en dos mil veintidós? Porque todo empezó con un adolescente de diecisiete años, encerrado en un cuarto de hotel, frente a un televisor.",
  [['comentarios', '^bCOMENTARIOS'], ['viste', '¿TÚ ^lLOS ^lVISTE?'], ['diecisiete|17', '^r17 AÑOS'], ['televisor', 'FRENTE A ^lUN ^lTELEVISOR']],
  scr='?', lines=['¿LOS VISTE?'])

here = os.path.dirname(os.path.abspath(__file__))
json.dump(S, open(f'{here}/escenas.json', 'w'), ensure_ascii=False, indent=1)
print('escenas', len(S), 'palabras', sum(len(x['texto'].split()) for x in S))
