"""Compara voces de Marco: modelo 0.6B/1.7B con la referencia vieja y las nuevas. Uso: python prueba_v2.py <modelo> <salida_prefijo>"""
import sys, os, time, torch, soundfile as sf
from qwen_tts import Qwen3TTSModel
torch.set_num_threads(4)
here = os.path.dirname(os.path.abspath(__file__))
REFS = {
 'vieja': ('ref.wav', 'Si pones una caja con hielo en la cocina, ya tienes una nevera. Pero el hielo se derrite en dos días, así que le metes un tubo con gas que se lleva el calor para afuera. Ese es el compresor.'),
 'narr': ('ref_narr.wav', '¿Qué pasaría si mañana te despiertas y han pasado mil años? Abres los ojos, todo está en silencio, tu celular no prende, sales a la calle y… ¿Qué es eso? ¿Un bus que vuela?'),
 'dato': ('ref_dato.wav', 'Pero hay un dato que sí lo es. La Luna se aleja de la Tierra casi cuatro centímetros cada año. En mil años, esos son treinta y ocho metros… ¡treinta y ocho metros! Nadie lo notaría, excepto tú.'),
 'susp': ('ref_susp.wav', 'Y lo peor todavía no ha pasado, porque alguien te dejó congelado. A propósito. Al final del video vas a saber quién fue. Y no lo vas a creer.'),
}
TXT = ('Te congelaron por una noche. Pero cuando abres los ojos, ya pasaron mil años. Tus cien dólares del banco ahora valen '
       'más que todo el planeta. Suena genial, ¿verdad? Pues no. Porque una pizza cuesta catorce millones… y alguien te dejó aquí a propósito.')
model, pref = sys.argv[1], sys.argv[2]
m = Qwen3TTSModel.from_pretrained(f'Qwen/Qwen3-TTS-12Hz-{model}-Base', device_map='cpu', dtype=torch.float32, attn_implementation='eager')
for k in sys.argv[3:]:
    ref, rt = REFS[k]; t0 = time.time()
    w, sr = m.generate_voice_clone(text=TXT, language='Spanish', ref_audio=os.path.join(here, ref), ref_text=rt, x_vector_only_mode=False)
    sf.write(f'{pref}_{model}_{k}.wav', w[0], sr); print(model, k, round(len(w[0]) / sr, 1), 's en', round(time.time() - t0), 's', flush=True)
