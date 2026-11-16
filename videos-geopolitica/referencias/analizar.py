"""Mide un video de referencia: cortes/s, onsets percusivos/s (efectos), sonoridad. Uso: analizar.py video.mp4 -> JSON en stdout."""
import sys, json, subprocess, re, tempfile, os
import numpy as np, librosa
v = sys.argv[1]
dur = float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',v]))
# cortes de escena
out = subprocess.run(['ffmpeg','-i',v,'-vf',"select='gt(scene,0.3)',showinfo",'-an','-f','null','-'],capture_output=True,text=True).stderr
cuts = [float(x) for x in re.findall(r'pts_time:([\d.]+)', out)]
# cambio visual medio (movimiento): diferencia entre fotogramas a 2 fps, 90x160 gris
raw = subprocess.run(['ffmpeg','-v','error','-i',v,'-vf','fps=2,scale=90:160,format=gray','-f','rawvideo','-'],capture_output=True).stdout
fr = np.frombuffer(raw,np.uint8).reshape(-1,160,90).astype(np.float32)
diff = np.abs(np.diff(fr,axis=0)).mean(axis=(1,2))
quiet = float((diff < 2.0).mean())
# audio
with tempfile.TemporaryDirectory() as d:
    w = os.path.join(d,'a.wav'); subprocess.run(['ffmpeg','-v','error','-y','-i',v,'-ac','1','-ar','22050',w],check=True)
    y, sr = librosa.load(w, sr=22050)
h, p = librosa.effects.hpss(y, margin=3.0)
env = librosa.onset.onset_strength(y=p, sr=sr)
ons = librosa.onset.onset_detect(onset_envelope=env, sr=sr, units='time', delta=0.25, wait=4)
lufs = subprocess.run(['ffmpeg','-i',v,'-af','ebur128=framelog=quiet','-vn','-f','null','-'],capture_output=True,text=True).stderr
I = re.findall(r'I:\s+(-?[\d.]+) LUFS', lufs); LRA = re.findall(r'LRA:\s+([\d.]+) LU', lufs)
print(json.dumps({'video':os.path.basename(v),'dur':round(dur,1),'cortes':len(cuts),'cortes_por_s':round(len(cuts)/dur,3),
  'seg_por_corte':round(dur/max(1,len(cuts)),2),'cambio_visual_medio':round(float(diff.mean()),2),'pct_quieto':round(quiet*100,1),
  'onsets_perc':len(ons),'onsets_por_s':round(len(ons)/dur,2),'lufs':float(I[-1]) if I else None,'lra':float(LRA[-1]) if LRA else None}))
