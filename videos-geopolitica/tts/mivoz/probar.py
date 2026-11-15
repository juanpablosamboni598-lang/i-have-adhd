import sys, time, torch, soundfile as sf
from qwen_tts import Qwen3TTSModel
torch.set_num_threads(4)
m = Qwen3TTSModel.from_pretrained('Qwen/Qwen3-TTS-12Hz-0.6B-Base', device_map='cpu', dtype=torch.float32, attn_implementation='eager')
REF='tts/mivoz/ref.wav'
REFTXT='Autorizo clonar mi propia voz y usarla en todos los videos de mis canales, YouTube jxseng y Facebook Quatoom. Largos, shorts y reels, sin pedirme permiso cada vez.'
text=('Si metes la ropa sucia en un balde con agua y jabón, ya tienes una lavadora. Pero la mugre no se suelta sola, '
      'así que le pones unas aspas que la revuelven de un lado a otro. Ese es el agitador.')
for modo,xv in [('a',True),('b',False)]:
    t=time.time()
    kw=dict(text=text, language='Spanish', ref_audio=REF, x_vector_only_mode=xv)
    if not xv: kw['ref_text']=REFTXT
    w,sr=m.generate_voice_clone(**kw)
    sf.write(f'tts/mivoz/prueba_{modo}.wav', w[0], sr); print(modo, round(len(w[0])/sr,1),'s en',round(time.time()-t),'s',flush=True)
