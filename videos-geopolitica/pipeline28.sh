#!/bin/bash
# v28: ¿Qué pasaría si pudieras ver quién está enamorado de ti? (historia, index28, personajes Xeno v2 + Sofía).
cd /home/user/i-have-adhd/videos-geopolitica
F=v28; B=/tmp/claude-0/-home-user-i-have-adhd/b44a631c-aa93-5a06-8553-5375e2a18dfb/scratchpad/b28
log(){ echo "[$(date -u +%H:%M)] $*"; }
N=$(python3 -c "import json;print(len(json.load(open('$F/escenas.json'))))")
until grep -q FIN_TTS $F/tts.log 2>/dev/null; do sleep 30; done
VOZ=marco3 MODEL=1.7B THREADS=4 /home/user/tools/qwen-venv/bin/python tts/mivoz.py $F >> $F/tts.log 2>&1
[ $(ls $F/audio2/a*.wav | wc -l) -ge $N ] || { log "voz incompleta"; exit 1; }
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
log "voz lista, tempo $TEMPO"
TEMPO=$TEMPO LEAD=0.05 TAIL=0.25 python3 prep.py $F
(cd remotion && python3 mkdata_words.py 28)
(cd remotion && timeout 900 npx remotion bundle src/index28.jsx --out-dir $B --log=error)
mkdir -p $F/render28
for pass in 1 2; do for i in $(seq -w 0 $((N-1))); do [ -s $F/render28/e$i.mp4 ] && continue
  (cd remotion && timeout 3600 npx remotion render $B V28-$i ../$F/render28/e$i.mp4 --browser-executable=/opt/pw-browsers/chromium --concurrency=4 --crf=18 --timeout=120000 --log=error >/dev/null 2>../$F/render28/err$i.txt) || { rm -f $F/render28/e$i.mp4; log "escena $i falló"; }
done; done
[ $(ls $F/render28/e*.mp4 | wc -l) -ge $N ] || { log "render incompleto"; exit 1; }
log "render28 listo"
MUSVOL=0.4 SFXREL=1.3 RENDER=render28 VBITRATE=1800k SFXREAL=1 SFXDENS=1.4 SFXVOL=0.8 NOSUBS=1 ./ensamblar_cartoon.sh $F amor_v28.mp4 5 && python3 qc_video.py $F/amor_v28.mp4 $F/timeline.json > $F/qc.txt
log "listo: $(tr '\n' ' ' < $F/qc.txt) duración $(ffprobe -v error -show_entries format=duration -of csv=p=0 $F/amor_v28.mp4) tamaño $(stat -c %s $F/amor_v28.mp4)"
log FINV28
