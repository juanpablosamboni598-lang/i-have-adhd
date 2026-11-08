"""Genera voz con Chatterbox multilingüe (español), clonando la voz de referencia.
Uso: chatter.py <carpeta> [indices...]  -> <carpeta>/audio2/aNN.wav"""
import sys, os, json, time
import torch, torchaudio as ta
from chatterbox.mtl_tts import ChatterboxMultilingualTTS
torch.set_num_threads(int(os.environ.get('TTS_THREADS', '4')))
folder = sys.argv[1]
esc = json.load(open(os.path.join(folder, 'escenas.json')))
idx = [int(x) for x in sys.argv[2:]] or range(len(esc))
ref = os.path.join(os.path.dirname(__file__), 'ref_johan.wav')
m = ChatterboxMultilingualTTS.from_pretrained(device='cpu')
os.makedirs(os.path.join(folder, 'audio2'), exist_ok=True)
for i in idx:
    out = os.path.join(folder, 'audio2', f'a{i:02d}.wav')
    if os.path.exists(out) and os.environ.get('FORCE') != '1':
        continue
    t0 = time.time()
    wav = m.generate(esc[i]['texto'], language_id='es', audio_prompt_path=ref, exaggeration=0.5, cfg_weight=0.5)
    ta.save(out, wav, m.sr)
    print(i, round(wav.shape[-1] / m.sr, 1), 's audio en', round(time.time() - t0), 's', flush=True)
