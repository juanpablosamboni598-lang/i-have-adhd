#!/bin/bash
# GTA 6 g03 (gta6_no_cuesta_100) con la voz de Marco (requiere su autorización NUEVA para este canal en tts/amigo/ref.wav). Copia de pipeline9.sh.
cd /home/user/i-have-adhd/videos-geopolitica
[ -f tts/amigo/AUTORIZACION_GTA6.txt ] && [ -f tts/amigo/ref_gta6.wav ] || { echo "Falta la autorización nueva de Marco para el canal GTA 6"; exit 1; }
source <(sed -n '/^log()/,/^}$/p;/^assemble()/,/^}$/p' pipeline3.sh)
P=$(pgrep -f "tts/mivoz.py gta6/g03"); if [ -n "$P" ]; then while kill -0 $P 2>/dev/null; do sleep 20; done; fi
VOZ=marco_gta6b THREADS=4 /home/user/tools/qwen-venv/bin/python tts/mivoz.py gta6/g03 >> gta6/g03/tts.log 2>&1
N=$(python3 -c "import json;print(len(json.load(open('gta6/g03/escenas.json'))))")
[ $(ls gta6/g03/audio2/a*.wav | wc -l) -ge $N ] || { log "g03 voz incompleta"; exit 1; }
# recorta silencios del principio y del final de cada frase (una sola vez)
for f in gta6/g03/audio2/a*.wav; do [ -f "$f.trim" ] && continue
  ffmpeg -v error -y -i "$f" -af "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse" "${f%.wav}_t.wav" && mv "${f%.wav}_t.wav" "$f" && touch "$f.trim"; done
/home/user/tools/stt-venv/bin/python tts/palabras.py gta6/g03 >> gta6/g03/tts.log 2>&1
# control: si whisper oye >20% más palabras que el guion, la voz repitió texto de la referencia -> rehacer esa escena
MAL=$(python3 - <<'PY2'
import json
e=json.load(open('gta6/g03/escenas.json'))
print(' '.join(str(i) for i,x in enumerate(e) if len(json.load(open(f'gta6/g03/audio2/a{i:02d}.words.json')))>1.2*len(x['texto'].split())+2))
PY2
)
if [ -n "$MAL" ]; then log "g03 rehaciendo voz de escenas: $MAL"; for i in $MAL; do rm -f gta6/g03/audio2/a$(printf %02d $i).*; done
  VOZ=marco_gta6b THREADS=4 /home/user/tools/qwen-venv/bin/python tts/mivoz.py gta6/g03 $MAL >> gta6/g03/tts.log 2>&1
  for i in $MAL; do f=gta6/g03/audio2/a$(printf %02d $i).wav; ffmpeg -v error -y -i "$f" -af "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse" "${f%.wav}_t.wav" && mv "${f%.wav}_t.wav" "$f" && touch "$f.trim"; done
  /home/user/tools/stt-venv/bin/python tts/palabras.py gta6/g03 >> gta6/g03/tts.log 2>&1
fi
# velocidad: llevar la voz a ~185 palabras por minuto (entre 1.0 y 1.15)
TEMPO=$(python3 - <<'PY'
import json,subprocess,glob
e=json.load(open('gta6/g03/escenas.json')); w=sum(len(x['texto'].split()) for x in e)
d=sum(float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f])) for f in sorted(glob.glob('gta6/g03/audio2/a*.wav')))
print(round(min(1.15,max(1.0,185/(w/d*60))),3))
PY
)
log "g03 voz lista, tempo $TEMPO"
TEMPO=$TEMPO LEAD=0.12 TAIL=0.08 python3 prep.py gta6/g03
python3 gta6/g03/mk.py
(cd remotion && python3 mkdata_words.py g03 && rm -rf buildg03 && timeout 900 npx remotion bundle src/indexg03.jsx --out-dir buildg03 --log=error)
mkdir -p gta6/g03/render2 gta6/g03/vert
for pass in 1 2 3; do
  for i in $(seq -w 0 $((N-1))); do
    [ -s gta6/g03/render2/e$i.mp4 ] && continue
    (cd remotion && timeout 3600 npx remotion render buildg03 G03-$i ../gta6/g03/render2/e$i.mp4 --browser-executable=/opt/pw-browsers/chromium --gl=swangle --concurrency=3 --crf=18 --timeout=120000 --log=error >/dev/null 2>../gta6/g03/render2/err$i.txt) || { rm -f gta6/g03/render2/e$i.mp4; log "g03 escena $i falló (pasada $pass)"; }
  done
done
[ $(ls gta6/g03/render2/e*.mp4 | wc -l) -ge $N ] || { log "g03 render incompleto"; exit 1; }
log "g03 render listo"
D=gta6/g03
if [ ! -s $D/gta6_todo_lo_confirmado.mp4 ]; then
  DUR=$(python3 -c "import json;print(json.load(open('$D/timeline.json'))['total'])")
  BR=$(python3 -c "print(min(1600,int(180e6*8/$DUR/1000)-140))")k
  SFXREAL=1 NOSUBS=1 RENDER=render2 VBITRATE=$BR SFXVOL=0.765 WVOL=0.595 ./ensamblar_cartoon.sh $D gta6_todo_lo_confirmado.mp4 1 && python3 qc_video.py $D/gta6_todo_lo_confirmado.mp4 $D/timeline.json > $D/qc.txt
  log "g03 ensamblado ($BR): $(tr '\n' ' ' < $D/qc.txt)"
fi
(cd remotion && npx remotion still buildg03 THUMB ../gta6/g03/miniatura.jpg --browser-executable=/opt/pw-browsers/chromium --gl=swangle --log=error) || log "g03 miniatura falló"
log "FIN-GTA03"
