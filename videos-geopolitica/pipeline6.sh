#!/bin/bash
# v20 jirafa (3D): voz -> prep -> bundle -> render (swangle) -> ensamblado -> QC -> 3 Shorts. Reanudable.
cd /home/user/i-have-adhd/videos-geopolitica
source <(sed -n '/^log()/,/^}$/p;/^assemble()/,/^}$/p' pipeline3.sh)
P=$(pgrep -f "tts/chatter.py v20")
if [ -n "$P" ]; then while kill -0 $P 2>/dev/null; do sleep 20; done; fi
/home/user/tools/tts-venv/bin/python tts/chatter.py v20 >> v20/tts.log 2>&1
[ $(ls v20/audio2/*.wav | wc -l) -ge 38 ] || { log "v20 voz incompleta"; exit 1; }
log "v20 voz lista"
TEMPO=1.0 python3 prep.py v20
(cd remotion && python3 mkdata.py 20 && rm -rf build20 && timeout 900 npx remotion bundle src/index20.jsx --out-dir build20 --log=error)
mkdir -p v20/render2
for pass in 1 2 3; do
  for i in $(seq -w 0 37); do
    [ -s v20/render2/e$i.mp4 ] && continue
    (cd remotion && timeout 3600 npx remotion render build20 V20-$i ../v20/render2/e$i.mp4 --browser-executable=/opt/pw-browsers/chromium --gl=swangle --concurrency=3 --crf=18 --timeout=120000 --log=error >/dev/null 2>../v20/render2/err$i.txt) || { rm -f v20/render2/e$i.mp4; log "v20 escena $i falló (pasada $pass)"; }
  done
done
[ $(ls v20/render2/e*.mp4 | wc -l) -ge 38 ] || { log "v20 render incompleto"; exit 1; }
log "v20 render listo"
[ -s v20/jirafa.mp4 ] || assemble 20 jirafa 1
mkdir -p shorts20
python3 - <<'PY'
import json, subprocess
t = json.load(open('v20/timeline.json'))['scenes']
seg = lambda ids: [[round(t[i]['start'], 2), round(t[i]['dur'], 2)] for i in ids]
S = [('s1_presion', 'LA SANGRE SUBE', '2 METROS', [0, 8, 9]),
     ('s2_beber', '¿POR QUÉ NO SE MAREA', 'AL BEBER?', [13, 15, 16]),
     ('s3_piernas', 'SU PIEL FUNCIONA', 'COMO UNA MEDIA', [22, 23])]
for name, l1, l2, ids in S:
    subprocess.run(['python3', 'shorts13/make_short.py', 'v20/jirafa.mp4', f'shorts20/{name}.mp4', l1, l2, json.dumps(seg(ids))], check=True)
PY
rm -f shorts20/*.p*.mp4 shorts20/*.txt shorts20/*.cat.mp4
log "v20 shorts: $(for f in shorts20/*.mp4; do echo -n "$f $(ffprobe -v error -show_entries format=duration -of csv=p=0 $f) "; done)"
log "FIN6"
