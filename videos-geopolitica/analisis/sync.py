"""Sincronía corte-voz: % de cortes (0-60 s) a <=150 ms del inicio de una palabra/frase vs azar; ritmo de habla. Uso: sync.py video.mp4 cortes.json"""
import sys, json, subprocess, numpy as np
from faster_whisper import WhisperModel
v, cj = sys.argv[1], sys.argv[2]
a = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-t', '62', '-i', v, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True).stdout, np.int16).astype(np.float32) / 32768
m = WhisperModel('small', compute_type='int8')
seg, _ = m.transcribe(a, language='en', word_timestamps=True, temperature=0)
seg = list(seg); words = [w for s in seg for w in s.words]
ws = np.array([w.start for w in words]); ss = np.array([s.start for s in seg])
cuts = np.array([t for t in json.load(open(cj))['cortes'] if t < 60])
near = lambda arr, x, tol: np.min(np.abs(arr - x)) <= tol
pw = np.mean([near(ws, c, 0.15) for c in cuts]); pf = np.mean([near(ss, c, 0.25) for c in cuts])
rnd = np.random.uniform(0, 60, 2000); bw = np.mean([near(ws, c, 0.15) for c in rnd]); bf = np.mean([near(ss, c, 0.25) for c in rnd])
dif = [round(float(c - ws[ws <= c + 0.3].max()), 2) if (ws <= c + 0.3).any() else None for c in cuts]
print(f'{v.split("/")[-1]}: palabras {len(words)} en 60 s = {len(words)} ppm | cortes a <=150 ms de una palabra {pw*100:.0f}% (azar {bw*100:.0f}%) | a <=250 ms de inicio de frase {pf*100:.0f}% (azar {bf*100:.0f}%)')
print('  desfase corte - última palabra (s):', dif[:20])
