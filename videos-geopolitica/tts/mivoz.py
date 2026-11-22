"""Voz del canal (Qwen3-TTS 0.6B Base, modo con texto de referencia). VOZ=marco (por defecto, elegida por el dueño 15 nov) o VOZ=dueno.
Ambos dieron permiso grabado con su propia voz el 15 nov 2026.
Uso (igual que chatter.py/andrew.py): /home/user/tools/qwen-venv/bin/python tts/mivoz.py <carpeta> [indices...]
Salida: <carpeta>/audio2/aNN.wav. Los tiempos por palabra los saca después tts/palabras.py (faster-whisper). FORCE=1 rehace."""
import sys, os, json, time, torch, soundfile as sf
from qwen_tts import Qwen3TTSModel
torch.set_num_threads(int(os.environ.get('THREADS', '4')))
folder = sys.argv[1]
esc = json.load(open(os.path.join(folder, 'escenas.json')))
idx = [int(x) for x in sys.argv[2:]] or range(len(esc))
here = os.path.dirname(os.path.abspath(__file__))
VOCES = {
    'marco': (os.path.join(here, 'amigo', 'ref.wav'),
              'Si pones una caja con hielo en la cocina, ya tienes una nevera. Pero el hielo se derrite en dos días, así que le metes '
              'un tubo con gas que se lleva el calor para afuera. Ese es el compresor.'),
    # Solo para el canal ViceLeakss (GTA 6): autorización grabada el 16 nov 2026 (ver amigo/AUTORIZACION_GTA6.txt).
    'marco_gta6': (os.path.join(here, 'amigo', 'ref_gta6.wav'),
              'El GTA seis saldrá en diecinueve de noviembre y será uno de los lanzamientos más grandes de la historia del gaming '
              'y de los videojuegos.'),
    # ViceLeakss, grabación 2 (16 nov 2026, 17 s, texto leído para el canal)
    'marco_gta6b': (os.path.join(here, 'amigo', 'ref_gta6b.wav'),
              '¿Sabías que GTA seis sale de este jueves? Llevamos años esperando y por fin hay fecha. Pero ojo, no todo lo que ves '
              'en internet es verdad, hay datos confirmados y hay puros rumores. Así que hoy te cuento cuál es cuál, rapidito y sin enredos. ¡Vamos!'),
    # Marco, grabación 2 (19 nov 2026, 56 s, texto leído para el estilo "¿Qué pasaría si…?"): una muestra por tono.
    'marco_narr': (os.path.join(here, 'amigo', 'ref_narr.wav'),
              '¿Qué pasaría si mañana te despiertas y han pasado mil años? Abres los ojos, todo está en silencio, tu celular no prende, sales a la calle y… ¿Qué es eso? ¿Un bus que vuela?'),
    'marco_dato': (os.path.join(here, 'amigo', 'ref_dato.wav'),
              'Pero hay un dato que sí lo es. La Luna se aleja de la Tierra casi cuatro centímetros cada año. En mil años, esos son treinta y ocho metros… ¡treinta y ocho metros! Nadie lo notaría, excepto tú.'),
    'marco_susp': (os.path.join(here, 'amigo', 'ref_susp.wav'),
              'Y lo peor todavía no ha pasado, porque alguien te dejó congelado. A propósito. Al final del video vas a saber quién fue. Y no lo vas a creer.'),
    # Marco, grabación 3 (22 nov 2026, 6:39 min de entrenamiento, texto_entrenamiento_marco.md): muestras más limpias por tono.
    'marco3_narr': (os.path.join(here, 'amigo', 'ref3_narr.wav'),
              'Imagina que mañana te despiertas y todo es diferente. La luz entra por la ventana, el café huele igual que siempre, pero algo no encaja. Bajas a la cocina. Tu mamá está preparando el desayuno, como cada mañana. Tu perro mueve la cola. Tu hermano te roba la última galleta. Todo parece normal. Pero no lo es.'),
    'marco3_dato': (os.path.join(here, 'amigo', 'ref3_dato.wav'),
              'Una persona parpadea unas quince o veinte veces por minuto. Eso son más de veinte mil parpadeos al día. El corazón late, en promedio, unas cien mil veces al día y bombea cerca de siete mil litros de sangre. La Tierra está a ciento cincuenta millones de kilómetros del Sol. La luz tarda ocho minutos y veinte segundos en llegar hasta aquí.'),
    'marco3_susp': (os.path.join(here, 'amigo', 'ref3_susp.wav'),
              'Esa noche no pudiste dormir. Algo se movía en el pasillo. Escuchaste pasos. Uno… dos… tres. Luego, silencio. La puerta de tu cuarto se abrió apenas un centímetro. Contuviste la respiración. Y entonces, desde la oscuridad, alguien dijo tu nombre.'),
    'dueno': (os.path.join(here, 'mivoz', 'ref.wav'),
              'Autorizo clonar mi propia voz y usarla en todos los videos de mis canales, YouTube jxseng y Facebook Quatoom. '
              'Largos, shorts y reels, sin pedirme permiso cada vez.'),
}
VOZ = os.environ.get('VOZ', 'marco')  # VOZ=marco2: cada escena elige su muestra con el campo "voz" (narr/dato/susp)
def ref_de(sc):
    if VOZ in ('marco2', 'marco3'):
        return VOCES[f"{'marco' if VOZ == 'marco2' else 'marco3'}_{sc.get('voz', 'narr')}"]
    return VOCES[VOZ]
out = os.path.join(folder, 'audio2'); os.makedirs(out, exist_ok=True)
m = Qwen3TTSModel.from_pretrained(f"Qwen/Qwen3-TTS-12Hz-{os.environ.get('MODEL', '0.6B')}-Base", device_map='cpu', dtype=torch.float32, attn_implementation='eager')
for i in idx:
    f = os.path.join(out, f'a{i:02d}.wav')
    if os.path.exists(f) and os.environ.get('FORCE') != '1': continue
    t0 = time.time()
    REF, REFTXT = ref_de(esc[i])
    w, sr = m.generate_voice_clone(text=esc[i]['texto'], language='Spanish', ref_audio=REF, ref_text=REFTXT, x_vector_only_mode=False)
    sf.write(f, w[0], sr)
    print(i, round(len(w[0]) / sr, 1), 's en', round(time.time() - t0), 's', flush=True)
