"""g03 (video largo): agrega a escenas.json los textos sincronizados (caps) y los SFX. Igual que g02/mk.py.
Uso: python3 gta6/g03/mk.py"""
import json, os, re, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(here, '..', 'g02'))
E = json.load(open(f'{here}/escenas.json'))
CAPS = {
    'gancho': [['cuesta', 'GTA 6 NO CUESTA ^s$100'], ['estándar', '^lESTÁNDAR $79,99'], ['jueves', 'ESTE JUEVES ^r19 ^rNOV'], ['rumor', 'DATO ^lvs ^rRUMOR']],
    'mito': [['internet', 'INTERNET LO REPITIÓ'], ['básico', 'JUEGO BÁSICO: ^r$100'], ['compartido', 'EL RUMOR MÁS COMPARTIDO'], ['cumplió', 'NO SE ^rCUMPLIÓ']],
    'ultimate': [['ultimate', 'ULTIMATE ^b$99,99'], ['veinte|20', '^l+20 DÓLARES'], ['completo', 'ESTÁNDAR = JUEGO ^lCOMPLETO']],
    'cajas': [['historia', 'SOLO LA HISTORIA'], ['importa', '^lESTÁNDAR BASTA'], ['extras', 'ULTIMATE = ^bEXTRAS']],
    'retrasos': [['tren', 'UN TREN CON ^rRETRASO'], ['primero', '^s2025'], ['mayo', '^s26 ^sMAYO ^s2026'], ['pasó', '^l19 ^lNOV ^l2026']],
    'andenes': [['andén', 'EN EL ANDÉN'], ['movió', 'LA FECHA ^lYA ^lNO ^lSE ^lMOVIÓ'], ['jueves', 'LLEGA ESTE ^rJUEVES']],
    'consolas': [['playstation', '^lPLAYSTATION 5'], ['xbox', '^lXBOX SERIES X Y S'], ['pasada', 'GENERACIÓN PASADA: ^rNO']],
    'pc': [['computador', '¿Y EN PC?'], ['anunciado', '^rSIN ANUNCIO'], ['habla', '2027 = ^rRUMOR']],
    'historia_pc': [['parecido', 'YA PASÓ CON GTA 5'], ['consolas', 'CONSOLAS: ^l2013'], ['computador', 'PC: ^r2015']],
    'mapa': [['leonida', 'LEONIDA'], ['inventado', 'ESTADO ^rINVENTADO'], ['florida', 'INSPIRADO EN ^bFLORIDA'], ['vice', '^rVICE CITY']],
    'regiones_a': [['seis|6', '^l6 REGIONES'], ['vice', '1. ^rVICE CITY'], ['keys', '2. ^lLEONIDA KEYS'], ['puentes', 'ISLAS CON PUENTES']],
    'regiones_b': [['grassrivers', '3. ^lGRASSRIVERS'], ['caimanes', 'PANTANOS Y CAIMANES'], ['gellhorn', '4. ^bPORT GELLHORN']],
    'regiones_c': [['ambrosia', '5. AMBROSIA'], ['fábricas', 'FÁBRICAS Y CAMPOS'], ['kalaga', '6. MOUNT KALAGA']],
    'tamano': [['grande', '¿QUÉ TAN GRANDE?'], ['cifra', '^rSIN CIFRA OFICIAL'], ['calcula', '¿×2–3? = ^rESTIMACIÓN']],
    'protas': [['protagonistas', '^lDOS PROTAGONISTAS'], ['lucía', '^rLUCÍA CAMINOS'], ['jason', '^bJASON DUVAL']],
    'trailer1': [['tráiler', 'TRÁILER 1'], ['diciembre', '5 DIC 2023'], ['filtró', 'SE ^rFILTRÓ'], ['inmediato', 'LO PUBLICÓ ^lYA']],
    'vistas': [['primeras', 'EN ^l24 ^lHORAS'], ['vistas', '^l90.421.491 VISTAS'], ['guinness', 'RÉCORD ^lGUINNESS']],
    'record': [['superó', 'SUPERÓ A ^lMRBEAST'], ['cincuenta|59', 'MRBEAST: 59,4 M'], ['bts', 'PERO ^rBTS: 108,2 M']],
    'trailer2': [['segundo', 'TRÁILER 2'], ['setenta|76', '^b~76 M EN 24 H'], ['menos', 'MENOS QUE EL ^lPRIMERO']],
    'filtracion': [['filtración', 'LA FILTRACIÓN ^rMÁS ^rGRANDE'], ['septiembre', 'SEPTIEMBRE 2022'], ['noventa|90', '^r+90 VIDEOS'], ['temprana', 'VERSIÓN TEMPRANA']],
    'costo': [['tribunal', 'ANTE UN TRIBUNAL'], ['cinco|5', '^r$5 MILLONES'], ['horas', 'MILES DE HORAS']],
    'juicio': [['joven', 'UN JOVEN HACKER'], ['lapsus', 'GRUPO ^rLAPSUS$'], ['hospital', 'HOSPITAL DE SEGURIDAD'], ['indefinido', 'TIEMPO ^rINDEFINIDO']],
    'giro': [['raro', 'PERO ESO NO ES ^rLO ^rMÁS ^rRARO'], ['salió', 'GTA 5: ^l2013'], ['nunca', 'NUNCA MÁS DE ^l5 ^lAÑOS'], ['pasaron', 'ESTA VEZ: ^r13 ^rAÑOS']],
    'saltos': [['primer', 'GTA 1: ^l1997'], ['vinieron', 'VICE CITY · SAN ANDREAS · 4 · 5'], ['cada', 'UNO CADA ^l2-3 ^lAÑOS']],
    'edad': [['diez', '^l10 AÑOS CON GTA 5'], ['veintitrés', '^l23 CON GTA 6']],
    'ventas': [['dejó', 'NO DEJÓ DE VENDERSE'], ['doscientos|230', '^l+230 MILLONES'], ['década', 'EL MÁS VENDIDO DE LA ^lDÉCADA']],
    'ritmo': [['trece|13', '13 AÑOS DESPUÉS'], ['millones', '~^l5 ^lMILLONES'], ['meses', 'CADA 3 MESES'], ['prisa', 'SIN ^rPRISA']],
    'dudas': [['confirmado', '^rSIN CONFIRMAR'], ['hora', 'HORA EXACTA'], ['pesa', 'CUÁNTO PESA']],
    'hora': [['medianoche', '¿MEDIANOCHE?'], ['confirmar', '^rNO CONFIRMADO'], ['tienda', 'REVISA LA ^lTIENDA']],
    'peso': [['gigas', '¿200 GB? = ^rRUMOR'], ['enorme', 'UN JUEGO ^lENORME'], ['libera', '^lLIBERA ESPACIO']],
    'spoilers': [['spoilers', 'CUIDADO: ^rSPOILERS'], ['redes', 'LAS REDES SE LLENAN'], ['silencia', '^lSILENCIA PALABRAS'], ['primero', 'JUEGA ^lTÚ PRIMERO']],
    'resumen': [['resumen', 'RESUMEN'], ['playstation', '^lPS5 + XBOX SERIES'], ['estándar', 'ESTÁNDAR ^l$79,99'], ['fecha', 'PC: ^rSIN FECHA']],
    'cierre': [['libera', '^lLIBERA ESPACIO'], ['tienda', 'REVISA TU TIENDA'], ['cifra', 'NO LE CREAS A ^rCUALQUIER ^rCIFRA'], ['cuesta', 'GTA 6 NO CUESTA ^s$100']],
}
G2 = {'gancho': [[0.03, 'pop'], [0.2, 'swish'], [0.42, 'whoosh'], [0.5, 'clink'], [0.55, 'clink'], [0.6, 'clink'], [0.78, 'pop']],
    'mito': [[0.05, 'pop'], [0.12, 'pop'], [0.2, 'pop'], [0.28, 'pop'], [0.8, 'fallo'], [0.86, 'swish']],
    'ultimate': [[0.03, 'impacto'], [0.08, 'impacto'], [0.45, 'tic'], [0.5, 'tic'], [0.55, 'tic'], [0.78, 'ding']],
    'retrasos': [[0.03, 'pop'], [0.06, 'motor'], [0.32, 'fallo'], [0.34, 'pop'], [0.55, 'fallo'], [0.57, 'pop'], [0.86, 'ding']],
    'consolas': [[0.03, 'impacto'], [0.1, 'brillo'], [0.3, 'impacto'], [0.36, 'brillo'], [0.68, 'pop'], [0.8, 'fallo']],
    'pc': [[0.15, 'tic'], [0.18, 'tic'], [0.21, 'tic'], [0.45, 'bip'], [0.68, 'tic'], [0.71, 'tic'], [0.74, 'tic']],
    'mapa': [[0.03, 'whoosh_largo'], [0.25, 'tic'], [0.35, 'pop'], [0.39, 'pop'], [0.43, 'pop'], [0.47, 'pop'], [0.72, 'pop'], [0.8, 'pop']],
    'giro': [[round(0.25 + k * 0.05, 2), 'pop'] for k in range(8)] + [[0.78, 'tension'], [0.82, 'tic'], [0.87, 'tic'], [0.92, 'ding']],
    'edad': [[0.04, 'pop'], [0.38, 'tic'], [0.46, 'tic'], [0.54, 'tic'], [0.62, 'tic'], [0.7, 'tic'], [0.8, 'brillo']],
    'dudas': [[0.05, 'tic'], [0.1, 'tic'], [0.35, 'electrico'], [0.62, 'pop'], [0.68, 'alarma'], [0.85, 'fallo']],
    'cierre': [[0.1, 'swish'], [0.25, 'pop'], [0.3, 'pop'], [0.72, 'pop'], [0.82, 'swish']]}
FX = dict(G2,
    cajas=[[0.03, 'pop'], [0.3, 'brillo'], [0.6, 'pop']],
    andenes=[[0.05, 'tic'], [0.1, 'tic'], [0.5, 'pop'], [0.56, 'motor'], [0.9, 'ding']],
    historia_pc=[[0.1, 'tic'], [0.3, 'pop'], [0.45, 'pop'], [0.58, 'pop'], [0.7, 'swish']],
    regiones_a=[[0.05, 'pop'], [0.35, 'pop'], [0.5, 'pop']], regiones_b=[[0.05, 'pop'], [0.35, 'pop'], [0.5, 'pop']], regiones_c=[[0.05, 'pop'], [0.35, 'pop'], [0.5, 'pop']],
    tamano=[[0.4, 'pop'], [0.5, 'whoosh'], [0.75, 'fallo'], [0.8, 'swish']],
    protas=[[0.1, 'impacto'], [0.35, 'impacto'], [0.6, 'brillo']],
    trailer1=[[0.08, 'bip'], [0.1, 'tic'], [0.45, 'pop'], [0.55, 'alarma'], [0.8, 'whoosh']],
    vistas=[[0.06, 'pop'], [0.15, 'tic'], [0.25, 'tic'], [0.35, 'tic'], [0.45, 'tic'], [0.6, 'ding'], [0.7, 'brillo']],
    record=[[0.08, 'whoosh'], [0.2, 'whoosh'], [0.32, 'whoosh'], [0.6, 'ding'], [0.85, 'fallo']],
    trailer2=[[0.08, 'whoosh'], [0.2, 'whoosh'], [0.7, 'swish']],
    filtracion=[[0.05, 'tension'], [0.35, 'electrico'], [0.45, 'pop'], [0.5, 'pop'], [0.55, 'pop'], [0.6, 'pop'], [0.65, 'pop'], [0.7, 'alarma']],
    costo=[[0.08, 'clink'], [0.16, 'clink'], [0.24, 'clink'], [0.32, 'clink'], [0.55, 'tic'], [0.6, 'tic']],
    juicio=[[0.05, 'impacto'], [0.4, 'pop'], [0.6, 'impacto'], [0.65, 'impacto'], [0.7, 'impacto']],
    saltos=[[round(0.1 + k * 0.07, 2), 'pop'] for k in range(7)] + [[0.8, 'swish']],
    ventas=[[round(0.05 + k * 0.05, 2), 'pop'] for k in range(10)] + [[0.6, 'ding']],
    ritmo=[[0.05, 'tic'], [0.3, 'clink'], [0.42, 'clink'], [0.54, 'clink'], [0.66, 'clink'], [0.85, 'swish']],
    hora=[[0.05, 'tic'], [0.12, 'tic'], [0.25, 'pop'], [0.55, 'fallo']],
    peso=[[0.08, 'pop'], [0.3, 'fallo'], [0.5, 'electrico'], [0.6, 'pop']],
    spoilers=[[round(0.05 + k * 0.04, 2), 'pop'] for k in range(9)] + [[0.55, 'swish'], [0.62, 'click'], [0.7, 'click']],
    resumen=[[0.05, 'pop'], [0.2, 'impacto'], [0.25, 'impacto'], [0.55, 'ding'], [0.8, 'pop']])
def norm(s):
    s = s.lower()
    for a, b in zip('áéíóú', 'aeiou'): s = s.replace(a, b)
    return re.sub(r'[^a-zñ0-9$]', '', s)
tl = json.load(open(f'{here}/timeline.json')) if os.path.exists(f'{here}/timeline.json') else None
for i, e in enumerate(E):
    for trig, _ in CAPS[e['tipo']]:
        assert norm(trig.split('|')[0]) in norm(e['texto']), (e['tipo'], trig)
    e['caps'] = CAPS[e['tipo']]
    fx = list(FX[e['tipo']])
    if tl:
        sc = tl['scenes'][i]
        for trig, _ in e['caps']:
            w = next((x for x in sc['words'] if any(norm(a) in norm(x[0]) for a in trig.split('|'))), None)
            if w: fx.append([round(w[1] / sc['dur'], 3), 'click'])
    e['sfx'] = sorted(fx)
json.dump(E, open(f'{here}/escenas.json', 'w'), ensure_ascii=False, indent=1)
print('escenas', len(E), 'sfx total', sum(len(e['sfx']) for e in E), 'con tiempos' if tl else 'sin timeline')
