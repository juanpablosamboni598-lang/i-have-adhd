"""Cortes por diferencia de fotogramas (todas las imágenes a 15 fps, 160x90) + estadísticas. Uso: cuts.py video.mp4 salida.json"""
import sys, subprocess, json, numpy as np
v, out = sys.argv[1], sys.argv[2]
W, H, FPS = 160, 90, 15
p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', v, '-vf', f'fps={FPS},scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
prev = None; diffs = []; hist = []; lum = []; sat = []
while True:
    b = p.stdout.read(W * H * 3)
    if len(b) < W * H * 3: break
    f = np.frombuffer(b, np.uint8).reshape(H, W, 3).astype(np.float32)
    g = f.mean(2)
    if prev is not None:
        d = np.abs(g - prev).mean()
        h1 = np.histogram(g, 32, (0, 255))[0]; h0 = np.histogram(prev, 32, (0, 255))[0]
        diffs.append(d); hist.append(np.abs(h1 - h0).sum() / (W * H))
    prev = g
    mx, mn = f.max(2), f.min(2); lum.append(g.mean()); sat.append(np.where(mx > 0, (mx - mn) / np.maximum(mx, 1), 0).mean())
diffs = np.array(diffs); hist = np.array(hist)
# corte: salto grande de diferencia respecto a la mediana local, o cambio de histograma fuerte
med = np.array([np.median(diffs[max(0, i - 15):i + 15]) for i in range(len(diffs))])
cut = (diffs > np.maximum(18, med * 3.5)) | (hist > 0.45)
times = [round((i + 1) / FPS, 3) for i in np.where(cut)[0]]
merged = []
for t in times:
    if not merged or t - merged[-1] > 0.25: merged.append(t)
dur = len(lum) / FPS
b = [0] + merged + [dur]; L = np.diff(b)
res = {'dur': round(dur, 2), 'cortes': merged, 'n': len(merged), 'por_min': round(len(merged) / dur * 60, 1),
       'plano_medio': round(float(L.mean()), 2), 'p10': round(float(np.percentile(L, 10)), 2), 'p50': round(float(np.median(L)), 2), 'p90': round(float(np.percentile(L, 90)), 2),
       'cortes_60s': [t for t in merged if t < 60], 'lum_media': round(float(np.mean(lum)) / 2.55, 1), 'sat_media': round(float(np.mean(sat)) * 100, 1),
       'cambio_medio_por_seg': round(float(diffs.mean()), 2)}
json.dump(res, open(out, 'w'))
print(json.dumps({k: v for k, v in res.items() if k != 'cortes'}))
