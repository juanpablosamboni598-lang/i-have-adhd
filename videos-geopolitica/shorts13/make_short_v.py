"""Short vertical nativo: une clips verticales ya renderizados + audio del video largo + gancho arriba.
Uso: make_short_v.py <video_largo.mp4> <salida.mp4> "<linea1>" "<linea2>" '<[[ini,dur],...]>' clip1.mp4 clip2.mp4 ..."""
import sys, json, subprocess, os, tempfile
src, out, l1, l2, segs = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], json.loads(sys.argv[5])
clips = sys.argv[6:]
tmp = tempfile.mkdtemp()
lst = os.path.join(tmp, 'v.txt'); open(lst, 'w').write(''.join(f"file '{os.path.abspath(c)}'\n" for c in clips))
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-an', '-c', 'copy', f'{tmp}/v.mp4'], check=True)
fa = ''.join(f"[0:a]atrim={s}:{s + d},asetpts=PTS-STARTPTS[a{i}];" for i, (s, d) in enumerate(segs))
fa += ''.join(f'[a{i}]' for i in range(len(segs))) + f'concat=n={len(segs)}:v=0:a=1,afade=t=out:st={sum(d for _, d in segs) - 0.4}:d=0.4[a]'
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', src, '-filter_complex', fa, '-map', '[a]', '-c:a', 'pcm_s16le', f'{tmp}/a.wav'], check=True)
F = '/usr/share/fonts/opentype/inter/InterDisplay-Black.otf'
esc = lambda s: s.replace(':', r'\:').replace("'", r"\'")
vf = (f"drawtext=fontfile={F}:text='{esc(l1)}':fontsize=70:fontcolor=white:borderw=7:bordercolor=0x141018:x=(w-tw)/2:y=70,"
      f"drawtext=fontfile={F}:text='{esc(l2)}':fontsize=80:fontcolor=0xffd23d:borderw=7:bordercolor=0x141018:x=(w-tw)/2:y=150,"
      f"drawtext=fontfile={F}:text='VIDEO COMPLETO EN EL CANAL':fontsize=40:fontcolor=white:box=1:boxcolor=0xe2483d:boxborderw=14:x=(w-tw)/2:y=h-200")
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f'{tmp}/v.mp4', '-i', f'{tmp}/a.wav', '-vf', vf, '-c:v', 'libx264', '-preset', 'medium', '-crf', '21',
                '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], check=True)
print(out)
