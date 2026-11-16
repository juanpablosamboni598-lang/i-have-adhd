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
    'dueno': (os.path.join(here, 'mivoz', 'ref.wav'),
              'Autorizo clonar mi propia voz y usarla en todos los videos de mis canales, YouTube jxseng y Facebook Quatoom. '
              'Largos, shorts y reels, sin pedirme permiso cada vez.'),
}
REF, REFTXT = VOCES[os.environ.get('VOZ', 'marco')]
out = os.path.join(folder, 'audio2'); os.makedirs(out, exist_ok=True)
m = Qwen3TTSModel.from_pretrained('Qwen/Qwen3-TTS-12Hz-0.6B-Base', device_map='cpu', dtype=torch.float32, attn_implementation='eager')
for i in idx:
    f = os.path.join(out, f'a{i:02d}.wav')
    if os.path.exists(f) and os.environ.get('FORCE') != '1': continue
    t0 = time.time()
    w, sr = m.generate_voice_clone(text=esc[i]['texto'], language='Spanish', ref_audio=REF, ref_text=REFTXT, x_vector_only_mode=False)
    sf.write(f, w[0], sr)
    print(i, round(len(w[0]) / sr, 1), 's en', round(time.time() - t0), 's', flush=True)
