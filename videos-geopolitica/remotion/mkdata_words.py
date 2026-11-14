"""dataNN.json con frames y tiempos de palabras (relativos a la escena) para textos sincronizados."""
import json, sys, os
v = sys.argv[1]
e = json.load(open(f'../v{v}/escenas.json'))
tlp = f'../v{v}/timeline.json'
out = []
if os.path.exists(tlp):
    t = json.load(open(tlp)); st = [round(s['start'] * 30) for s in t['scenes']] + [round(t['total'] * 30)]
    for i, a in enumerate(e):
        out.append({'tipo': a['tipo'], 'titulo': a['titulo'], 'frames': st[i + 1] - st[i], 'words': [[w, round(tt, 2)] for w, tt in t['scenes'][i]['words']]})
else:
    for a in e:
        ws = a['texto'].split(); dur = len(ws) / 3.2 + 0.5
        out.append({'tipo': a['tipo'], 'titulo': a['titulo'], 'frames': round(dur * 30), 'words': [[w, round(0.15 + k / 3.2, 2)] for k, w in enumerate(ws)]})
json.dump(out, open(f'src/data{v}.json', 'w'), ensure_ascii=False)
print(v, len(out), round(sum(x['frames'] for x in out) / 30, 1), 's')
