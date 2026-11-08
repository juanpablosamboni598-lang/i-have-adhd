#!/bin/bash
# Cadena automática: ensambla v14, luego voz -> render -> ensamblado de v15, v16, v17.
cd /home/user/i-have-adhd/videos-geopolitica
log(){ echo "[$(date -u +%H:%M)] $*"; }
# voz en cadena (v16 y v17 cuando termine la anterior)
( while pgrep -f "chatter.py v15" >/dev/null; do sleep 30; done
  /home/user/tools/tts-venv/bin/python tts/chatter.py v16 > v16/tts.log 2>&1
  /home/user/tools/tts-venv/bin/python tts/chatter.py v17 > v17/tts.log 2>&1 ) &
# v14
while [ $(ls v14/render2/e*.mp4 2>/dev/null | wc -l) -lt 46 ] || pgrep -f "build14 T" >/dev/null; do sleep 30; done
log "v14 render listo"
RENDER=render2 VBITRATE=1450k ./ensamblar_cartoon.sh v14 depredadores.mp4 1 && python3 qc_video.py v14/depredadores.mp4 v14/timeline.json > v14/qc.txt
log "v14 ensamblado: $(cat v14/qc.txt | tr '\n' ' ')"
declare -A NAME=( [15]=tardigrado [16]=mariquitas [17]=ajolote ) ; declare -A KEY=( [15]=2 [16]=-1 [17]=3 )
for v in 15 16 17; do
  N=$(python3 -c "import json;print(len(json.load(open('v$v/escenas.json'))))")
  while [ $(ls v$v/audio2/a*.wav 2>/dev/null | wc -l) -lt $N ] || pgrep -f "chatter.py v$v" >/dev/null; do sleep 60; done
  log "v$v voz lista"
  TEMPO=1.0 python3 prep.py v$v
  (cd remotion && python3 mkdata.py $v && timeout 900 npx remotion bundle src/index1517.jsx --out-dir build$v --log=error)
  mkdir -p v$v/render2
  for i in $(seq -w 0 $((N-1))); do
    (cd remotion && timeout 1800 npx remotion render build$v V$v-$i ../v$v/render2/e$i.mp4 --browser-executable=/opt/pw-browsers/chromium --concurrency=4 --crf=18 --log=error >/dev/null 2>../v$v/render2/err$i.txt) || log "v$v escena $i FALLÓ"
  done
  log "v$v render listo"
  DUR=$(python3 -c "import json;print(json.load(open('v$v/timeline.json'))['total'])")
  BR=$(python3 -c "print(min(1600,int(92e6*8/$DUR/1000)-140))")k
  RENDER=render2 VBITRATE=$BR SFXVOL=0.765 WVOL=0.595 ./ensamblar_cartoon.sh v$v ${NAME[$v]}.mp4 ${KEY[$v]} && python3 qc_video.py v$v/${NAME[$v]}.mp4 v$v/timeline.json > v$v/qc.txt
  log "v$v ensamblado ($BR): $(cat v$v/qc.txt | tr '\n' ' ')"
done
log "FIN"
