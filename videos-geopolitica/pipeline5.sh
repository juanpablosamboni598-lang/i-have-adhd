#!/bin/bash
# v19 delfines: voz -> prep -> bundle -> render -> ensamblado -> QC -> 3 Shorts. Una tarea pesada a la vez; reanudable.
cd /home/user/i-have-adhd/videos-geopolitica
source <(sed -n '/^log()/,/^}$/p;/^assemble()/,/^}$/p' pipeline3.sh)
P=$(pgrep -f "python tts/chatter.py v19")
if [ -n "$P" ]; then while kill -0 $P 2>/dev/null; do sleep 20; done; fi
/home/user/tools/tts-venv/bin/python tts/chatter.py v19 >> v19/tts.log 2>&1
[ $(ls v19/audio2/*.wav | wc -l) -ge 38 ] || { log "v19 voz incompleta"; exit 1; }
log "v19 voz lista"
TEMPO=1.0 python3 prep.py v19
(cd remotion && python3 mkdata.py 19 && rm -rf build19 && timeout 900 npx remotion bundle src/index19.jsx --out-dir build19 --log=error)
mkdir -p v19/render2
render_all 19 38 && log "v19 render listo" || { log "v19 render incompleto"; exit 1; }
[ -s v19/delfines.mp4 ] || assemble 19 delfines 1
mkdir -p shorts19
python3 - <<'PY'
import json, subprocess
t = json.load(open('v19/timeline.json'))['scenes']
seg = lambda ids: [[round(t[i]['start'], 2), round(t[i]['dur'], 2)] for i in ids]
S = [('s1_medio', 'DUERME CON', 'MEDIO CEREBRO', [0, 7, 9]),
     ('s2_alerta', '15 DÍAS ALERTA', 'SIN DESCANSAR', [19, 20, 21]),
     ('s3_hotel', 'EN UN HOTEL', 'DUERMES A MEDIAS', [30, 31])]
for name, l1, l2, ids in S:
    out = f'shorts19/{name}.mp4'
    subprocess.run(['python3', 'shorts13/make_short.py', 'v19/delfines.mp4', out, l1, l2, json.dumps(seg(ids))], check=True)
PY
rm -f shorts19/*.p*.mp4 shorts19/*.txt shorts19/*.cat.mp4
log "v19 shorts: $(for f in shorts19/*.mp4; do echo -n "$f $(ffprobe -v error -show_entries format=duration -of csv=p=0 $f) "; done)"
log "FIN4"
