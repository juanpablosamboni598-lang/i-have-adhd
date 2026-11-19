#!/bin/bash
# v25 largo 16:9 estilo Xeno 2D: "¿Qué pasaría si te congelaran 1.000 años?" (voz Marco 1.7B, muestras por tono).
cd /home/user/i-have-adhd/videos-geopolitica
F=v25; ID=V25; OUT=congelado.mp4
log(){ echo "[$(date -u +%H:%M)] $*"; }
P=$(pgrep -f "tts/mivoz.py $F"); if [ -n "$P" ]; then log "esperando voz"; while kill -0 $P 2>/dev/null; do sleep 20; done; fi
VOZ=marco2 MODEL=1.7B THREADS=4 /home/user/tools/qwen-venv/bin/python tts/mivoz.py $F >> $F/tts.log 2>&1
N=$(python3 -c "import json;print(len(json.load(open('$F/escenas.json'))))")
[ $(ls $F/audio2/a*.wav | wc -l) -ge $N ] || { log "$F voz incompleta"; exit 1; }
for f in $F/audio2/a*.wav; do [ -f "$f.trim" ] && continue
  ffmpeg -v error -y -i "$f" -af "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse" "${f%.wav}_t.wav" && mv "${f%.wav}_t.wav" "$f" && touch "$f.trim"; done
/home/user/tools/stt-venv/bin/python tts/palabras.py $F >> $F/tts.log 2>&1
TEMPO=$(python3 - <<PY
import json,subprocess,glob
e=json.load(open('$F/escenas.json')); w=sum(len(x['texto'].split()) for x in e)
d=sum(float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f])) for f in sorted(glob.glob('$F/audio2/a*.wav')))
print(round(min(1.1,max(0.88,150/(w/d*60))),3))
PY
)
log "$F voz lista, tempo $TEMPO"
TEMPO=$TEMPO LEAD=0.05 TAIL=0.25 python3 prep.py $F
(cd remotion && python3 mkdata_words.py 25 && rm -rf build25 && timeout 900 npx remotion bundle src/index25.jsx --out-dir build25 --log=error)
mkdir -p $F/render2
for pass in 1 2; do
  for i in $(seq -w 0 $((N-1))); do
    [ -s $F/render2/e$i.mp4 ] && continue
    (cd remotion && timeout 3600 npx remotion render build25 $ID-$i ../$F/render2/e$i.mp4 --browser-executable=/opt/pw-browsers/chromium --concurrency=4 --crf=18 --timeout=120000 --log=error >/dev/null 2>../$F/render2/err$i.txt) || { rm -f $F/render2/e$i.mp4; log "$F escena $i falló (pasada $pass)"; }
  done
done
[ $(ls $F/render2/e*.mp4 | wc -l) -ge $N ] || { log "$F render incompleto"; exit 1; }
log "$F render listo"
RENDER=render2 VBITRATE=2000k SFXREAL=1 SFXDENS=1.6 SFXVOL=0.8 NOSUBS=1 ./ensamblar_cartoon.sh $F $OUT 3 && python3 qc_video.py $F/$OUT $F/timeline.json > $F/qc.txt
log "$F listo: $(tr '\n' ' ' < $F/qc.txt) duración $(ffprobe -v error -show_entries format=duration -of csv=p=0 $F/$OUT)"
log "FIN$ID"
