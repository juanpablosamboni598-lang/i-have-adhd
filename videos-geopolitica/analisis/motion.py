"""Movimiento de cámara por plano (primeros 60 s): zoom (%/s) y paneo (px/s en 1280x720) entre inicio y fin del plano, y curva de easing (5 puntos).
Uso: motion.py video.mp4 cortes.json salida.json"""
import sys, json, subprocess, numpy as np
from PIL import Image
v, cj, out = sys.argv[1], sys.argv[2], sys.argv[3]
c = json.load(open(cj)); cuts = [0] + [t for t in c['cortes'] if t < 61] 
nxt = [t for t in c['cortes'] if t >= 61][:1]
bounds = list(zip(cuts, cuts[1:] + nxt))
W, H = 320, 180
def frame(t):
    b = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{t:.3f}', '-i', v, '-frames:v', '1', '-vf', f'scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], capture_output=True).stdout
    return np.frombuffer(b, np.uint8).reshape(H, W).astype(np.float32) if len(b) == W * H else None
def best(a, b):  # b ≈ a escalado s y desplazado (dx,dy): búsqueda en rejilla gruesa+fina
    bestv = (1e9, 1, 0, 0)
    for s in np.arange(0.90, 1.121, 0.01):
        im = Image.fromarray(a).resize((int(W * s), int(H * s)), Image.BILINEAR); A = np.asarray(im, np.float32)
        ox, oy = (A.shape[1] - W) // 2, (A.shape[0] - H) // 2
        for dx in range(-24, 25, 4):
            for dy in range(-12, 13, 4):
                x0, y0 = ox + dx, oy + dy
                if s < 1:  # cuando es menor, comparar el centro
                    cx, cy = (W - A.shape[1]) // 2 - dx, (H - A.shape[0]) // 2 - dy
                    if cx < 0 or cy < 0 or cx + A.shape[1] > W or cy + A.shape[0] > H: continue
                    e = np.abs(b[cy:cy + A.shape[0], cx:cx + A.shape[1]] - A).mean()
                else:
                    if x0 < 0 or y0 < 0 or x0 + W > A.shape[1] or y0 + H > A.shape[0]: continue
                    e = np.abs(A[y0:y0 + H, x0:x0 + W] - b).mean()
                if e < bestv[0]: bestv = (e, s, dx, dy)
    return bestv
res = []
for a, bnd in bounds:
    d = bnd - a
    if d < 0.5: res.append({'t': round(a, 2), 'dur': round(d, 2), 'mov': 'muy corto'}); continue
    ts = np.linspace(a + 0.08, bnd - 0.08, 5); fr = [frame(t) for t in ts]
    if any(f is None for f in fr): continue
    e, s, dx, dy = best(fr[0], fr[-1])
    curve = [round(best(fr[0], fr[k])[1], 3) for k in (1, 2, 3)]
    static = np.abs(fr[-1] - fr[0]).mean()
    res.append({'t': round(a, 2), 'dur': round(d, 2), 'zoom_total_%': round((s - 1) * 100, 1), 'zoom_%s': round((s - 1) * 100 / d, 2),
                'pan_px_s': [round(-dx * 4 / d, 1), round(-dy * 4 / d, 1)], 'curva_zoom': curve, 'resid': round(float(e), 1), 'dif_ini_fin': round(float(static), 1)})
json.dump(res, open(out, 'w'))
for r in res: print(r)
