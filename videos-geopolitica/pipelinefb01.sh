#!/bin/bash
# Facebook propio n.º 1: el candado (vertical 9:16, ~2 min) con la voz clonada del dueño. Corre después de v23 para no pelear la CPU.
cd /home/user/i-have-adhd/videos-geopolitica
log(){ echo "[$(date -u +%H:%M)] $*"; }
until grep -q "FIN9\|v23 render incompleto\|v23 voz incompleta" v23/pipeline.log 2>/dev/null; do sleep 60; done
THREADS=4 /home/user/tools/qwen-venv/bin/python tts/mivoz.py fb01 >> fb01/tts.log 2>&1
N=$(python3 -c "import json;print(len(json.load(open('fb01/escenas.json'))))")
[ $(ls fb01/audio2/a*.wav | wc -l) -ge $N ] || { log "fb01 voz incompleta"; exit 1; }
for f in fb01/audio2/a*.wav; do [ -f "$f.trim" ] && continue
  ffmpeg -v error -y -i "$f" -af "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse" "${f%.wav}_t.wav" && mv "${f%.wav}_t.wav" "$f" && touch "$f.trim"; done
/home/user/tools/stt-venv/bin/python tts/palabras.py fb01 >> fb01/tts.log 2>&1
TEMPO=$(grep -o "tempo [0-9.]*" v23/pipeline.log | tail -1 | cut -d' ' -f2); TEMPO=${TEMPO:-1.05}
TEMPO=$TEMPO LEAD=0.12 TAIL=0.08 python3 prep.py fb01
(cd remotion && python3 mkdata_words.py fb01 && rm -rf buildfb01 && timeout 900 npx remotion bundle src/indexfb01.jsx --out-dir buildfb01 --log=error)
mkdir -p fb01/render2
for pass in 1 2 3; do
  for i in $(seq -w 0 $((N-1))); do
    [ -s fb01/render2/e$i.mp4 ] && continue
    (cd remotion && timeout 3600 npx remotion render buildfb01 FB01-$i ../fb01/render2/e$i.mp4 --browser-executable=/opt/pw-browsers/chromium --gl=swangle --concurrency=3 --crf=18 --timeout=120000 --log=error >/dev/null 2>../fb01/render2/err$i.txt) || { rm -f fb01/render2/e$i.mp4; log "fb01 escena $i falló"; }
  done
done
[ $(ls fb01/render2/e*.mp4 | wc -l) -ge $N ] || { log "fb01 render incompleto"; exit 1; }
RENDER=render2 VBITRATE=6000k SFXVOL=0.765 WVOL=0.595 NOSUBS=1 ./ensamblar_cartoon.sh fb01 candado.mp4 2 && python3 qc_video.py fb01/candado.mp4 fb01/timeline.json > fb01/qc.txt
log "fb01 listo: $(tr '\n' ' ' < fb01/qc.txt)"
log "FINFB01"
