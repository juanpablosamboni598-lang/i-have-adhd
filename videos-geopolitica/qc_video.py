"""Control de calidad: fotograma cada 2 s; marca tramos de 3 fotogramas seguidos casi iguales.
Uso: qc_video.py <video> <timeline.json> [umbral]"""
import sys, json, subprocess, tempfile, glob, os
import numpy as np
from PIL import Image
v, tlp = sys.argv[1], sys.argv[2]
thr = float(sys.argv[3]) if len(sys.argv) > 3 else 4.0
tl = json.load(open(tlp))['scenes']
d = tempfile.mkdtemp()
subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', v, '-vf', 'fps=0.5,scale=320:180', f'{d}/f%04d.png'], check=True)
fs = sorted(glob.glob(f'{d}/f*.png'))
a = [np.asarray(Image.open(f).convert('L'), float) for f in fs]
diff = [np.abs(a[i + 1] - a[i]).mean() for i in range(len(a) - 1)]
scene_of = lambda s: max(i for i, x in enumerate(tl) if x['start'] <= s)
bad = [(k * 2, scene_of(k * 2)) for k in range(len(diff) - 1) if diff[k] < thr and diff[k + 1] < thr]
print(f'{len(fs)} fotogramas, diferencia media {np.mean(diff):.1f}, mínima {min(diff):.1f}')
print('tramos casi iguales:', len(bad), bad)
