#!/bin/bash
# v18 gatos: voz -> prep -> bundle -> render -> ensamblado -> QC -> 3 Shorts. Una tarea pesada a la vez; reanudable.
cd /home/user/i-have-adhd/videos-geopolitica
source <(sed -n '/^log()/,/^}$/p;/^render_all()/,/^}$/p;/^assemble()/,/^}$/p' pipeline3.sh)
P=$(pgrep -f "python tts/chatter.py v18")
if [ -n "$P" ]; then while kill -0 $P 2>/dev/null; do sleep 20; done; fi
/home/user/tools/tts-venv/bin/python tts/chatter.py v18 >> v18/tts.log 2>&1
[ $(ls v18/audio2/*.wav | wc -l) -ge 38 ] || { log "v18 voz incompleta"; exit 1; }
log "v18 voz lista"
TEMPO=1.0 python3 prep.py v18
(cd remotion && python3 mkdata.py 18 && rm -rf build18 && timeout 900 npx remotion bundle src/index18.jsx --out-dir build18 --log=error)
mkdir -p v18/render2
render_all 18 38 && log "v18 render listo" || { log "v18 render incompleto"; exit 1; }
[ -s v18/gatos.mp4 ] || assemble 18 gatos 1
mkdir -p shorts18
python3 - <<'PY'
import json, subprocess
t = json.load(open('v18/timeline.json'))['scenes']
seg = lambda ids: [[round(t[i]['start'], 2), round(t[i]['dur'], 2)] for i in ids]
S = [('s1_giro', 'ASÍ GIRA UN GATO', 'EN EL AIRE', [17, 18, 20, 21]),
     ('s2_pisos', 'CAEN DE 7 PISOS', 'Y SOBREVIVEN', [29, 30, 31]),
     ('s3_balcon', 'UN 2º PISO', 'ES MÁS PELIGROSO', [34, 35])]
for name, l1, l2, ids in S:
    out = f'shorts18/{name}.mp4'
    subprocess.run(['python3', 'shorts13/make_short.py', 'v18/gatos.mp4', out, l1, l2, json.dumps(seg(ids))], check=True)
PY
rm -f shorts18/*.p*.mp4 shorts18/*.txt shorts18/*.cat.mp4
log "v18 shorts: $(for f in shorts18/*.mp4; do echo -n "$f $(ffprobe -v error -show_entries format=duration -of csv=p=0 $f) "; done)"
log "FIN4"
