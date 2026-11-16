"""g02: agrega a escenas.json los textos sincronizados (caps) y los SFX.
Los SFX de objetos van en fracciones fijas de la escena; los de los textos se calculan con los tiempos por palabra
de timeline.json si ya existe. Uso: python3 gta6/g02/mk.py"""
import json, os, re
here = os.path.dirname(os.path.abspath(__file__))
E = json.load(open(f'{here}/escenas.json'))
CAPS = {
    'gancho': [['cuesta', 'GTA 6 NO CUESTA ^s$100'], ['estándar', '^lESTÁNDAR $79,99'], ['jueves', 'ESTE JUEVES ^r19 ^rNOV']],
    'mito': [['internet', 'INTERNET LO REPITIÓ'], ['cien', 'JUEGO BÁSICO: ^r$100'], ['compartido', 'EL RUMOR MÁS COMPARTIDO'], ['cumplió', 'NO SE ^rCUMPLIÓ']],
    'ultimate': [['ultimate', 'ULTIMATE ^b$99,99'], ['veinte', '^l+20 DÓLARES'], ['completo', 'ESTÁNDAR = JUEGO ^lCOMPLETO']],
    'retrasos': [['tren', 'UN TREN CON ^rRETRASO'], ['veinticinco', '^s2025'], ['mayo', '^s26 ^sMAYO ^s2026'], ['pasó', '^l19 ^lNOV ^l2026']],
    'consolas': [['playstation', '^lPLAYSTATION 5'], ['xbox', '^lXBOX SERIES X Y S'], ['pasada', 'GENERACIÓN PASADA: ^rNO']],
    'pc': [['computador', '¿Y EN PC?'], ['anunciado', '^rSIN ANUNCIO'], ['rumor', '2027 = ^rRUMOR'], ['medio', 'GTA 5: PC ^lAÑO ^lY ^lMEDIO DESPUÉS']],
    'mapa': [['leonida', 'LEONIDA'], ['florida', 'INSPIRADO EN ^bFLORIDA'], ['vice', 'VICE CITY'], ['protagonistas', '^rDOS PROTAGONISTAS']],
    'giro': [['raro', 'PERO ESO NO ES ^rLO ^rMÁS ^rRARO'], ['salió', 'GTA 5: ^l2013'], ['nunca', 'NUNCA MÁS DE ^l5 ^lAÑOS'], ['pasaron', 'ESTA VEZ: ^r13 ^rAÑOS']],
    'edad': [['diez', '^l10 AÑOS CON GTA 5'], ['veintitrés', '^l23 CON GTA 6']],
    'dudas': [['confirmado', '^rSIN CONFIRMAR'], ['hora', 'HORA EXACTA'], ['pesa', 'CUÁNTO PESA'], ['doscientos', '¿200 GB? = ^rRUMOR']],
    'cierre': [['libera', '^lLIBERA ESPACIO'], ['tienda', 'REVISA TU TIENDA'], ['cifra', 'NO LE CREAS A ^rCUALQUIER ^rCIFRA'], ['cuesta', 'GTA 6 NO CUESTA ^s$100']],
}
# SFX de objetos: [fracción de la escena, nombre en sfx.py]
FX = {
    'gancho': [[0.03, 'pop'], [0.2, 'swish'], [0.42, 'whoosh'], [0.5, 'clink'], [0.55, 'clink'], [0.6, 'clink'], [0.78, 'pop']],
    'mito': [[0.05, 'pop'], [0.12, 'pop'], [0.2, 'pop'], [0.28, 'pop'], [0.8, 'fallo'], [0.86, 'swish']],
    'ultimate': [[0.03, 'impacto'], [0.08, 'impacto'], [0.45, 'tic'], [0.5, 'tic'], [0.55, 'tic'], [0.78, 'ding']],
    'retrasos': [[0.03, 'pop'], [0.06, 'motor'], [0.32, 'fallo'], [0.34, 'pop'], [0.55, 'fallo'], [0.57, 'pop'], [0.86, 'ding']],
    'consolas': [[0.03, 'impacto'], [0.1, 'brillo'], [0.3, 'impacto'], [0.36, 'brillo'], [0.68, 'pop'], [0.8, 'fallo']],
    'pc': [[0.15, 'tic'], [0.18, 'tic'], [0.21, 'tic'], [0.45, 'bip'], [0.68, 'tic'], [0.71, 'tic'], [0.74, 'tic']],
    'mapa': [[0.03, 'whoosh_largo'], [0.25, 'tic'], [0.35, 'pop'], [0.39, 'pop'], [0.43, 'pop'], [0.47, 'pop'], [0.72, 'pop'], [0.8, 'pop']],
    'giro': [[round(0.25 + k * 0.05, 2), 'pop'] for k in range(8)] + [[0.78, 'tension'], [0.82, 'tic'], [0.87, 'tic'], [0.92, 'ding']],
    'edad': [[0.04, 'pop'], [0.38, 'tic'], [0.46, 'tic'], [0.54, 'tic'], [0.62, 'tic'], [0.7, 'tic'], [0.8, 'brillo']],
    'dudas': [[0.05, 'tic'], [0.1, 'tic'], [0.35, 'electrico'], [0.62, 'pop'], [0.68, 'alarma'], [0.85, 'fallo']],
    'cierre': [[0.1, 'swish'], [0.25, 'pop'], [0.3, 'pop'], [0.72, 'pop'], [0.82, 'swish']],
}
def norm(s):
    s = s.lower()
    for a, b in zip('áéíóú', 'aeiou'): s = s.replace(a, b)
    return re.sub(r'[^a-zñ0-9]', '', s)
tl = json.load(open(f'{here}/timeline.json')) if os.path.exists(f'{here}/timeline.json') else None
for i, e in enumerate(E):
    e['caps'] = CAPS[e['tipo']]
    fx = list(FX[e['tipo']])
    if tl:  # un "click" en cada texto que aparece, en el segundo exacto de la palabra disparadora
        sc = tl['scenes'][i]
        for trig, _ in e['caps']:
            w = next((x for x in sc['words'] if norm(trig) in norm(x[0])), None)
            if w: fx.append([round(w[1] / sc['dur'], 3), 'click'])
    e['sfx'] = sorted(fx)
json.dump(E, open(f'{here}/escenas.json', 'w'), ensure_ascii=False, indent=1)
print('escenas', len(E), 'sfx total', sum(len(e['sfx']) for e in E), 'con tiempos' if tl else 'sin timeline')
