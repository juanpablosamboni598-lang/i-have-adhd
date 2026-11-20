"""Color y acabado: paleta HEX, percentiles de luma (sombras/medios/altas), saturación, viñeta, grano. Uso: color.py video.mp4"""
import sys, subprocess, numpy as np, tempfile, glob
from PIL import Image
v = sys.argv[1]
t = tempfile.mkdtemp()
subprocess.run(['ffmpeg', '-v', 'error', '-i', v, '-vf', 'fps=1/6,scale=640:360', f'{t}/f%04d.png'])
fs = sorted(glob.glob(t + '/*.png'))
A = np.stack([np.asarray(Image.open(f).convert('RGB'), np.float32) for f in fs])
Y = A @ np.array([0.299, 0.587, 0.114])
mx, mn = A.max(3), A.min(3); S = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1), 0)
p = np.percentile(Y, [2, 25, 50, 75, 98])
c = np.mean([Y[:, :60, :80].mean(), Y[:, :60, -80:].mean(), Y[:, -60:, :80].mean(), Y[:, -60:, -80:].mean()]); ce = Y[:, 120:240, 220:420].mean()
# grano: desviación del residuo de alta frecuencia en zonas planas
g = Y[:, ::2, ::2]; hp = g - (np.roll(g, 1, 1) + np.roll(g, -1, 1) + np.roll(g, 1, 2) + np.roll(g, -1, 2)) / 4
flat = np.abs(np.roll(g, 3, 1) - g) < 2
px = A.reshape(-1, 3)[np.random.choice(A.shape[0] * 640 * 360, 150000)]
q = Image.fromarray(px.reshape(300, 500, 3).astype(np.uint8)).quantize(10, method=Image.Quantize.MEDIANCUT)
pal = q.getpalette()[:30]; cnt = sorted(q.getcolors(), reverse=True)
warm = ((A[..., 0] - A[..., 2]).mean())
print(f'{v.split("/")[-1]}: luma p2/p25/p50/p75/p98 = {"/".join(str(int(x)) for x in p)} | sat media {S.mean()*100:.0f}% (p90 {np.percentile(S,90)*100:.0f}%) | viñeta esquinas/centro {c/ce:.2f} | grano {hp[flat].std():.2f} | R-B {warm:+.1f}')
print('  paleta:', ' '.join(f'#{pal[i*3]:02X}{pal[i*3+1]:02X}{pal[i*3+2]:02X}({n*100//150000}%)' for n, i in cnt))
