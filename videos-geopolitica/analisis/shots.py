"""Fotograma central de cada plano en los primeros 60 s, en collages 4x4 con tiempo. Uso: shots.py video.mp4 cortes.json prefijo"""
import sys, json, subprocess, os
v, cj, pre = sys.argv[1:4]
c = json.load(open(cj)); cuts = [0] + [t for t in c['cortes'] if t < 60]; ends = cuts[1:] + [[t for t in c['cortes'] if t >= 60][0]]
os.makedirs(pre, exist_ok=True)
for k, (a, b) in enumerate(zip(cuts, ends)):
    m = (a + b) / 2
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{m:.2f}', '-i', v, '-frames:v', '1', '-vf',
        f"scale=480:270,drawtext=text='{k} {a:.1f}-{b:.1f}s':x=6:y=6:fontsize=22:fontcolor=yellow:box=1:boxcolor=black@0.7", f'{pre}/s{k:03d}.png'])
n = len(cuts)
for g in range(0, n, 16):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-start_number', str(g), '-i', f'{pre}/s%03d.png', '-frames:v', str(min(16, n - g)), '-vf', 'tile=4x4', '-update', '1', '-frames:v', '1', f'{pre}_c{g // 16}.jpg'])
print(pre, n, 'planos')
