#!/bin/bash
# v21 inodoro (3D): voz -> prep -> bundle -> render (swangle) -> ensamblado -> QC -> 3 Shorts. Reanudable.
cd /home/user/i-have-adhd/videos-geopolitica
source <(sed -n '/^log()/,/^}$/p;/^assemble()/,/^}$/p' pipeline3.sh)
P=$(pgrep -f "tts/chatter.py v21")
if [ -n "$P" ]; then while kill -0 $P 2>/dev/null; do sleep 20; done; fi
/home/user/tools/tts-venv/bin/python tts/chatter.py v21 >> v21/tts.log 2>&1
[ $(ls v21/audio2/*.wav | wc -l) -ge 38 ] || { log "v21 voz incompleta"; exit 1; }
log "v21 voz lista"
TEMPO=1.0 python3 prep.py v21
(cd remotion && python3 mkdata.py 21 && rm -rf build21 && timeout 900 npx remotion bundle src/index21.jsx --out-dir build21 --log=error)
mkdir -p v21/render2
for pass in 1 2 3; do
  for i in $(seq -w 0 37); do
    [ -s v21/render2/e$i.mp4 ] && continue
    (cd remotion && timeout 3600 npx remotion render build21 V21-$i ../v21/render2/e$i.mp4 --browser-executable=/opt/pw-browsers/chromium --gl=swangle --concurrency=3 --crf=18 --timeout=120000 --log=error >/dev/null 2>../v21/render2/err$i.txt) || { rm -f v21/render2/e$i.mp4; log "v21 escena $i falló (pasada $pass)"; }
  done
done
[ $(ls v21/render2/e*.mp4 | wc -l) -ge 38 ] || { log "v21 render incompleto"; exit 1; }
log "v21 render listo"
[ -s v21/inodoro.mp4 ] || assemble 21 inodoro 1
mkdir -p shorts21
python3 - <<'PY'
import json, subprocess
t = json.load(open('v21/timeline.json'))['scenes']
seg = lambda ids: [[round(t[i]['start'], 2), round(t[i]['dur'], 2)] for i in ids]
S = [('s1_agua', '¿POR QUÉ SIEMPRE HAY', 'AGUA EN LA TAZA?', [4, 6, 7]),
     ('s2_flotador', '¿CÓMO SABE EL TANQUE', 'CUÁNDO PARAR?', [12, 13, 14]),
     ('s3_glup', 'EL SECRETO DEL', '¡GLUP! FINAL', [24, 25, 26])]
for name, l1, l2, ids in S:
    subprocess.run(['python3', 'shorts13/make_short.py', 'v21/inodoro.mp4', f'shorts21/{name}.mp4', l1, l2, json.dumps(seg(ids))], check=True)
PY
rm -f shorts21/*.p*.mp4 shorts21/*.txt shorts21/*.cat.mp4
log "v21 shorts: $(for f in shorts21/*.mp4; do echo -n "$f $(ffprobe -v error -show_entries format=duration -of csv=p=0 $f) "; done)"
log "FIN7"
