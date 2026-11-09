#!/bin/bash
# Cadena 2: render+ensamblado de v16 (escenas faltantes, con reintentos) y luego voz+render+ensamblado de v17. Una tarea a la vez.
cd /home/user/i-have-adhd/videos-geopolitica
log(){ echo "[$(date -u +%H:%M)] $*"; }
render_all(){ v=$1; N=$2
  for pass in 1 2 3; do
    for i in $(seq -w 0 $((N-1))); do
      [ -s v$v/render2/e$i.mp4 ] && continue
      (cd remotion && timeout 1800 npx remotion render build$v V$v-$i ../v$v/render2/e$i.mp4 --browser-executable=/opt/pw-browsers/chromium --concurrency=3 --crf=18 --timeout=120000 --log=error >/dev/null 2>../v$v/render2/err$i.txt) || { rm -f v$v/render2/e$i.mp4; log "v$v escena $i falló (pasada $pass)"; }
    done
  done
  [ $(ls v$v/render2/e*.mp4 | wc -l) -ge $N ]
}
assemble(){ v=$1; name=$2; key=$3
  DUR=$(python3 -c "import json;print(json.load(open('v$v/timeline.json'))['total'])")
  BR=$(python3 -c "print(min(1600,int(92e6*8/$DUR/1000)-140))")k
  RENDER=render2 VBITRATE=$BR SFXVOL=0.765 WVOL=0.595 ./ensamblar_cartoon.sh v$v $name.mp4 $key && python3 qc_video.py v$v/$name.mp4 v$v/timeline.json > v$v/qc.txt
  log "v$v ensamblado ($BR): $(cat v$v/qc.txt | tr '\n' ' ')"
}
P17=$(pgrep -f "python tts/chatter.py v17")
[ -n "$P17" ] && kill -STOP $P17
# v16 ya publicado
# voz de v17: reanudar o lanzar
if [ -n "$P17" ]; then kill -CONT $P17; while kill -0 $P17 2>/dev/null; do sleep 20; done; fi
/home/user/tools/tts-venv/bin/python tts/chatter.py v17 >> v17/tts.log 2>&1
log "v17 voz lista"
TEMPO=1.0 python3 prep.py v17
(cd remotion && python3 mkdata.py 17 && timeout 900 npx remotion bundle src/index1517.jsx --out-dir build17 --log=error)
mkdir -p v17/render2
render_all 17 35 && log "v17 render listo" && assemble 17 ajolote 3
log "FIN2"
