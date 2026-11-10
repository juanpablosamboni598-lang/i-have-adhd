"""Short vertical desde el video largo: segmentos -> fondo desenfocado + clip centrado + título arriba + CTA abajo."""
import subprocess, sys, json
src, out, l1, l2, segs = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], json.loads(sys.argv[5])
F = '/usr/share/fonts/opentype/inter/Inter-Black.otf'
parts = []
for k, (a, d) in enumerate(segs):
    a, d = a + 0.36, d - 0.66
    p = f'{out}.p{k}.mp4'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', str(a), '-t', str(d), '-i', src, '-c:v', 'libx264', '-preset', 'fast', '-crf', '18', '-c:a', 'aac', '-b:a', '192k', p], check=True)
    parts.append(p)
open(f'{out}.txt', 'w').write(''.join(f"file '{p.split('/')[-1]}'\n" for p in parts))
cat = f'{out}.cat.mp4'
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', f'{out}.txt', '-c', 'copy', cat], check=True)
esc = lambda s: s.replace(':', r'\:').replace("'", r"\'")
vf = (f"[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=24:2,eq=brightness=-0.12[bg];"
      f"[0:v]scale=1080:-2[fg];[bg][fg]overlay=0:(H-h)/2+40[v];"
      f"[v]drawtext=fontfile={F}:text='{esc(l1)}':fontsize=70:fontcolor=white:borderw=8:bordercolor=black:x=(w-text_w)/2:y=300,"
      f"drawtext=fontfile={F}:text='{esc(l2)}':fontsize=78:fontcolor=0xFFC83C:borderw=8:bordercolor=black:x=(w-text_w)/2:y=410,"
      f"drawtext=fontfile={F}:text='VIDEO COMPLETO EN EL CANAL':fontsize=46:fontcolor=white:borderw=5:bordercolor=black:box=1:boxcolor=0xE61E28@0.9:boxborderw=18:x=(w-text_w)/2:y=1520[o]")
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', cat, '-filter_complex', vf, '-map', '[o]', '-map', '0:a', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', out], check=True)
print(out, subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', out]).decode().strip())
