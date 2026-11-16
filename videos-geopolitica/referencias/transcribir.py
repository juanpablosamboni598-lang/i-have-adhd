"""Transcribe un video con faster-whisper (small) -> palabras/min, gancho (0-3 s), texto. Uso: transcribir.py video.mp4"""
import sys, json, subprocess, numpy as np, os
from faster_whisper import WhisperModel
v = sys.argv[1]
a = np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',v,'-ac','1','-ar','16000','-f','s16le','-'],capture_output=True).stdout,np.int16).astype(np.float32)/32768
m = WhisperModel('small', device='cpu', compute_type='int8', cpu_threads=4)
segs, _ = m.transcribe(a, language='es', word_timestamps=True, vad_filter=True)
W = [(w.word.strip(), float(w.start), float(w.end)) for s in segs for w in s.words]
txt = ' '.join(x[0] for x in W)
t0, t1 = W[0][1], W[-1][2]
pausas = [W[i+1][1]-W[i][2] for i in range(len(W)-1)]
print(json.dumps({'video':os.path.basename(v),'palabras':len(W),'ppm':round(len(W)/((t1-t0)/60),1),'voz_inicia_s':round(t0,2),
  'pausas_mayores_0.4s':int(sum(p>0.4 for p in pausas)),'pausa_max':round(max(pausas),2),
  'gancho_0_3s':' '.join(x[0] for x in W if x[1]<3.0),'texto':txt}, ensure_ascii=False))
