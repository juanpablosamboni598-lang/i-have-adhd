"""Genera src/dataNN.json desde vNN/timeline.json (o estimado por palabras si aún no hay voz)."""
import json, sys, os
for v in sys.argv[1:]:
    e = json.load(open(f'../v{v}/escenas.json'))
    tlp = f'../v{v}/timeline.json'
    if os.path.exists(tlp):
        t = json.load(open(tlp)); st = [round(s['start'] * 30) for s in t['scenes']] + [round(t['total'] * 30)]
        fr = [st[i + 1] - st[i] for i in range(len(e))]
    else:
        fr = [round((len(x['texto'].split()) / 2.3 + 1.0) * 30) for x in e]
    json.dump([{'tipo': a['tipo'], 'titulo': a['titulo'], 'frames': f} for a, f in zip(e, fr)], open(f'src/data{v}.json', 'w'), ensure_ascii=False)
    print(v, len(e), round(sum(fr) / 30, 1), 's', 'real' if os.path.exists(tlp) else 'estimado')
