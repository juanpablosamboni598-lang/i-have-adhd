import time, torch, soundfile as sf
from qwen_tts import Qwen3TTSModel
torch.set_num_threads(2)
m = Qwen3TTSModel.from_pretrained('Qwen/Qwen3-TTS-12Hz-0.6B-Base', device_map='cpu', dtype=torch.float32, attn_implementation='eager')
REFTXT = 'Si pones una caja con hielo en la cocina, ya tienes una nevera. Pero el hielo se derrite en dos días, así que le metes un tubo con gas que se lleva el calor para afuera. Ese es el compresor.'
text = ('Si metes la ropa sucia en un balde con agua y jabón, ya tienes una lavadora. Pero la mugre no se suelta sola, '
        'así que le pones unas aspas que la revuelven de un lado a otro. Ese es el agitador.')
t = time.time()
w, sr = m.generate_voice_clone(text=text, language='Spanish', ref_audio='tts/amigo/ref.wav', ref_text=REFTXT, x_vector_only_mode=False)
sf.write('tts/amigo/prueba.wav', w[0], sr); print(round(len(w[0]) / sr, 1), 's en', round(time.time() - t), 's')
