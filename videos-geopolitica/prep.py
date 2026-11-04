"""Ajusta las voces (tempo, pausas), calcula tiempos de palabras y une la narración."""
import json, subprocess, os, sys
folder = sys.argv[1]
esc = json.load(open(f'{folder}/escenas.json'))
os.makedirs(f'{folder}/audio3', exist_ok=True)
scenes, start, parts = [], 0.0, []
for i, sc in enumerate(esc):
    src, dst = f'{folder}/audio2/a{i:02d}.wav', f'{folder}/audio3/b{i:02d}.wav'
    lead = 0.35 if i > 0 else 0.15; tail = 0.55
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', src, '-af',
                    f'atempo=0.95,adelay={int(lead*1000)}|{int(lead*1000)},apad=pad_dur={tail}',
                    '-ar', '44100', '-ac', '2', dst], check=True)
    dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', dst]))
    speech = dur - lead - tail
    words = sc['texto'].split(); w = [len(x) + 3 for x in words]; tot = sum(w); acc = 0; wt = []
    for word, ww in zip(words, w):
        wt.append((word, lead + speech * acc / tot)); acc += ww
    scenes.append({'start': start, 'dur': dur, 'words': wt}); start += dur; parts.append(dst)
json.dump({'scenes': scenes, 'total': start}, open(f'{folder}/timeline.json', 'w'), ensure_ascii=False)
open(f'{folder}/audio3/list.txt', 'w').write(''.join(f"file '{os.path.basename(p)}'\n" for p in parts))
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', f'{folder}/audio3/list.txt',
                '-c:a', 'pcm_s16le', f'{folder}/narracion.wav'], check=True)
print(folder, 'total', round(start, 1), 's')
