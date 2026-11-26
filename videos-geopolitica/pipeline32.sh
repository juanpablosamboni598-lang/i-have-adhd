#!/bin/bash
# v32: ¿Qué pasaría si viajaras a la Segunda Guerra Mundial con IQ infinito? (historia, index32, voz marco3).
cd /home/user/i-have-adhd/videos-geopolitica
F=v32; B=/tmp/claude-0/-home-user-i-have-adhd/b44a631c-aa93-5a06-8553-5375e2a18dfb/scratchpad/b32
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
(cd remotion && python3 mkdata_words.py 32)
(cd remotion && timeout 900 npx remotion bundle src/index32.jsx --out-dir $B --log=error)
mkdir -p $F/render32
for pass in 1 2; do for i in $(seq -w 0 $((N-1))); do [ -s $F/render32/e$i.mp4 ] && continue
  (cd remotion && timeout 3600 npx remotion render $B V32-$i ../$F/render32/e$i.mp4 --browser-executable=/opt/pw-browsers/chromium --concurrency=3 --crf=18 --timeout=120000 --log=error >/dev/null 2>../$F/render32/err$i.txt) || { rm -f $F/render32/e$i.mp4; log "escena $i falló"; }
done; done
[ $(ls $F/render32/e*.mp4 | wc -l) -ge $N ] || { log "render incompleto"; exit 1; }
log "render32 listo"
MUSVOL=0.4 SFXREL=1.3 RENDER=render32 VBITRATE=1800k SFXREAL=1 SFXDENS=1.4 SFXVOL=0.8 NOSUBS=1 ./ensamblar_cartoon.sh $F iq_ww2_v32.mp4 5 && python3 qc_video.py $F/iq_ww2_v32.mp4 $F/timeline.json > $F/qc.txt
log "listo: $(tr '\n' ' ' < $F/qc.txt) duración $(ffprobe -v error -show_entries format=duration -of csv=p=0 $F/iq_ww2_v32.mp4) tamaño $(stat -c %s $F/iq_ww2_v32.mp4)"
rm -rf $F/vonly; rm -f $F/crudo.mp4 $F/mudo.mp4 $F/x264pass-0.log*
log FINV32
