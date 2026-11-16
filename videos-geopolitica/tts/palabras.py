"""Tiempos por palabra para voces sin ellos (voz clonada): faster-whisper sobre cada audio2/aNN.wav -> aNN.words.json
[[palabra, inicio_s, dur_s], ...], el mismo formato que andrew.py y que usa prep.py.
Uso: /home/user/tools/stt-venv/bin/python tts/palabras.py <carpeta> [indices...]"""
import sys, os, json, subprocess, numpy as np
from faster_whisper import WhisperModel
folder = sys.argv[1]; out = os.path.join(folder, 'audio2')
esc = json.load(open(os.path.join(folder, 'escenas.json')))
idx = [int(x) for x in sys.argv[2:]] or range(len(esc))
m = WhisperModel('small', compute_type='int8')
for i in idx:
    f = os.path.join(out, f'a{i:02d}.wav'); j = f[:-4] + '.words.json'
    if not os.path.exists(f) or (os.path.exists(j) and os.environ.get('FORCE') != '1'): continue
    a = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True).stdout, np.int16).astype(np.float32) / 32768
    seg, _ = m.transcribe(a, language='es', word_timestamps=True, initial_prompt=esc[i]['texto'], temperature=0)
    w = [[x.word.strip(), round(x.start, 3), round(x.end - x.start, 3)] for s in seg for x in s.words]
    n = len(esc[i]['texto'].split())
    if not (0.8 * n <= len(w) <= 1.15 * n + 1):  # el initial_prompt a veces hace alucinar a whisper (frases inventadas): repetir sin él
        seg, _ = m.transcribe(a, language='es', word_timestamps=True, temperature=0, vad_filter=True, condition_on_previous_text=False)
        w = [[x.word.strip(), round(x.start, 3), round(x.end - x.start, 3)] for s in seg for x in s.words]
        print(i, 'reintento sin initial_prompt', flush=True)
    json.dump(w, open(j, 'w'), ensure_ascii=False)
    print(i, len(w), 'palabras', flush=True)
