#!/bin/bash
# v22 nevera (3D, fórmula "si pones... pero... así que... ese es el..."): voz expresiva -> prep sin pausas -> render -> ensamblado sin subtítulos -> QC -> Shorts verticales nativos.
cd /home/user/i-have-adhd/videos-geopolitica
source <(sed -n '/^log()/,/^}$/p;/^assemble()/,/^}$/p' pipeline3.sh)
P=$(pgrep -f "tts/chatter.py v22")
if [ -n "$P" ]; then while kill -0 $P 2>/dev/null; do sleep 20; done; fi
EXAG=0.7 CFG=0.3 /home/user/tools/tts-venv/bin/python tts/chatter.py v22 >> v22/tts.log 2>&1
N=$(python3 -c "import json;print(len(json.load(open('v22/escenas.json'))))")
[ $(ls v22/audio2/*.wav | wc -l) -ge $N ] || { log "v22 voz incompleta"; exit 1; }
log "v22 voz lista"
TEMPO=1.0 LEAD=0.12 TAIL=0.08 python3 prep.py v22
(cd remotion && python3 mkdata_words.py 22 && rm -rf build22 && timeout 900 npx remotion bundle src/index22.jsx --out-dir build22 --log=error)
mkdir -p v22/render2 v22/vert
for pass in 1 2 3; do
  for i in $(seq -w 0 $((N-1))); do
    [ -s v22/render2/e$i.mp4 ] && continue
    (cd remotion && timeout 3600 npx remotion render build22 V22-$i ../v22/render2/e$i.mp4 --browser-executable=/opt/pw-browsers/chromium --gl=swangle --concurrency=3 --crf=18 --timeout=120000 --log=error >/dev/null 2>../v22/render2/err$i.txt) || { rm -f v22/render2/e$i.mp4; log "v22 escena $i falló (pasada $pass)"; }
  done
done
[ $(ls v22/render2/e*.mp4 | wc -l) -ge $N ] || { log "v22 render incompleto"; exit 1; }
log "v22 render listo"
[ -s v22/nevera.mp4 ] || NOSUBS=1 assemble 22 nevera 1
# Shorts verticales nativos
for i in 10 11 12 13 18 19 23 24; do
  [ -s v22/vert/e$i.mp4 ] && continue
  (cd remotion && timeout 3600 npx remotion render build22 VV22-$i ../v22/vert/e$i.mp4 --browser-executable=/opt/pw-browsers/chromium --gl=swangle --concurrency=3 --crf=18 --timeout=120000 --log=error >/dev/null 2>&1) || log "v22 vertical $i falló"
done
mkdir -p shorts22
python3 - <<'PY'
import json, subprocess
t = json.load(open('v22/timeline.json'))['scenes']
seg = lambda ids: [[round(t[i]['start'], 3), round(t[i]['dur'], 3)] for i in ids]
S = [('s1_atras', '¿POR QUÉ LA NEVERA', 'ESTÁ CALIENTE ATRÁS?', [10, 11, 12, 13]),
     ('s2_zumba', '¿POR QUÉ TU NEVERA', 'ZUMBA A RATOS?', [18, 19]),
     ('s3_cuesta', '¿POR QUÉ CUESTA', 'ABRIRLA OTRA VEZ?', [23, 24])]
for name, l1, l2, ids in S:
    subprocess.run(['python3', 'shorts13/make_short_v.py', 'v22/nevera.mp4', f'shorts22/{name}.mp4', l1, l2, json.dumps(seg(ids))] + [f'v22/vert/e{i:02d}.mp4' for i in ids], check=True)
PY
log "v22 shorts: $(for f in shorts22/*.mp4; do echo -n "$f $(ffprobe -v error -show_entries format=duration -of csv=p=0 $f) "; done)"
log "FIN8"
