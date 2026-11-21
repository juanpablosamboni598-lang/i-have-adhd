#!/bin/bash
# v27: rehecho visual de v26 (misma narración y tiempos) con index27 (fórmula Hypo Room V3).
cd /home/user/i-have-adhd/videos-geopolitica
F=v26; B=/tmp/claude-0/-home-user-i-have-adhd/b44a631c-aa93-5a06-8553-5375e2a18dfb/scratchpad/b27
log(){ echo "[$(date -u +%H:%M)] $*"; }
N=$(python3 -c "import json;print(len(json.load(open('$F/escenas.json'))))")
(cd remotion && timeout 900 npx remotion bundle src/index27.jsx --out-dir $B --log=error)
mkdir -p $F/render27 v27
for pass in 1 2; do for i in $(seq -w 0 $((N-1))); do [ -s $F/render27/e$i.mp4 ] && continue
  (cd remotion && timeout 3600 npx remotion render $B V27-$i ../$F/render27/e$i.mp4 --browser-executable=/opt/pw-browsers/chromium --concurrency=4 --crf=18 --timeout=120000 --log=error >/dev/null 2>../$F/render27/err$i.txt) || { rm -f $F/render27/e$i.mp4; log "escena $i falló"; }
done; done
[ $(ls $F/render27/e*.mp4 | wc -l) -ge $N ] || { log "render incompleto"; exit 1; }
log "render27 listo"
MUSVOL=0.2 RENDER=render27 VBITRATE=2200k SFXREAL=1 SFXDENS=1.6 SFXVOL=0.8 NOSUBS=1 ./ensamblar_cartoon.sh $F inodoro_v27.mp4 3 && mv $F/inodoro_v27.mp4 v27/inodoro_v27.mp4 && python3 qc_video.py v27/inodoro_v27.mp4 $F/timeline.json > v27/qc.txt
log "listo: $(tr '\n' ' ' < v27/qc.txt) duración $(ffprobe -v error -show_entries format=duration -of csv=p=0 v27/inodoro_v27.mp4) tamaño $(stat -c %s v27/inodoro_v27.mp4)"
log FINV27
