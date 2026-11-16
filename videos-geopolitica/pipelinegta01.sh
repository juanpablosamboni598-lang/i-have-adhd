#!/bin/bash
# GTA 6 g01 (lanzamiento) con la voz de Marco (requiere su autorización NUEVA para este canal en tts/amigo/ref.wav). Copia de pipeline9.sh.
cd /home/user/i-have-adhd/videos-geopolitica
[ -f tts/amigo/AUTORIZACION_GTA6.txt ] && [ -f tts/amigo/ref.wav ] || { echo "Falta la autorización nueva de Marco para el canal GTA 6"; exit 1; }
source <(sed -n '/^log()/,/^}$/p;/^assemble()/,/^}$/p' pipeline3.sh)
P=$(pgrep -f "tts/mivoz.py gta6/g01"); if [ -n "$P" ]; then while kill -0 $P 2>/dev/null; do sleep 20; done; fi
THREADS=4 /home/user/tools/qwen-venv/bin/python tts/mivoz.py gta6/g01 >> gta6/g01/tts.log 2>&1
N=$(python3 -c "import json;print(len(json.load(open('gta6/g01/escenas.json'))))")
[ $(ls gta6/g01/audio2/a*.wav | wc -l) -ge $N ] || { log "g01 voz incompleta"; exit 1; }
# recorta silencios del principio y del final de cada frase (una sola vez)
for f in gta6/g01/audio2/a*.wav; do [ -f "$f.trim" ] && continue
  ffmpeg -v error -y -i "$f" -af "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse" "${f%.wav}_t.wav" && mv "${f%.wav}_t.wav" "$f" && touch "$f.trim"; done
/home/user/tools/stt-venv/bin/python tts/palabras.py gta6/g01 >> gta6/g01/tts.log 2>&1
# velocidad: llevar la voz a ~185 palabras por minuto (entre 1.0 y 1.15)
TEMPO=$(python3 - <<'PY'
import json,subprocess,glob
e=json.load(open('gta6/g01/escenas.json')); w=sum(len(x['texto'].split()) for x in e)
d=sum(float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f])) for f in sorted(glob.glob('gta6/g01/audio2/a*.wav')))
print(round(min(1.15,max(1.0,185/(w/d*60))),3))
PY
)
log "g01 voz lista, tempo $TEMPO"
TEMPO=$TEMPO LEAD=0.12 TAIL=0.08 python3 prep.py gta6/g01
(cd remotion && python3 mkdata_words.py g01 && rm -rf buildg01 && timeout 900 npx remotion bundle src/indexg01.jsx --out-dir buildg01 --log=error)
mkdir -p gta6/g01/render2 gta6/g01/vert
for pass in 1 2 3; do
  for i in $(seq -w 0 $((N-1))); do
    [ -s gta6/g01/render2/e$i.mp4 ] && continue
    (cd remotion && timeout 3600 npx remotion render buildg01 G01-$i ../gta6/g01/render2/e$i.mp4 --browser-executable=/opt/pw-browsers/chromium --gl=swangle --concurrency=3 --crf=18 --timeout=120000 --log=error >/dev/null 2>../gta6/g01/render2/err$i.txt) || { rm -f gta6/g01/render2/e$i.mp4; log "g01 escena $i falló (pasada $pass)"; }
  done
done
[ $(ls gta6/g01/render2/e*.mp4 | wc -l) -ge $N ] || { log "g01 render incompleto"; exit 1; }
log "g01 render listo"
D=gta6/g01
if [ ! -s $D/lanzamiento.mp4 ]; then
  DUR=$(python3 -c "import json;print(json.load(open('$D/timeline.json'))['total'])")
  BR=$(python3 -c "print(min(1600,int(92e6*8/$DUR/1000)-140))")k
  NOSUBS=1 RENDER=render2 VBITRATE=$BR SFXVOL=0.765 WVOL=0.595 ./ensamblar_cartoon.sh $D lanzamiento.mp4 1 && python3 qc_video.py $D/lanzamiento.mp4 $D/timeline.json > $D/qc.txt
  log "g01 ensamblado ($BR): $(tr '\n' ' ' < $D/qc.txt)"
fi
(cd remotion && npx remotion still buildg01 THUMB ../gta6/g01/miniatura.jpg --browser-executable=/opt/pw-browsers/chromium --gl=swangle --log=error) || log "g01 miniatura falló"
# TODO: índices de escenas verticales y Shorts se fijan cuando esté el guion final (escenas.json)
for i in $VERT; do
  [ -s gta6/g01/vert/e$i.mp4 ] && continue
  (cd remotion && timeout 3600 npx remotion render buildg01 VG01-$i ../gta6/g01/vert/e$i.mp4 --browser-executable=/opt/pw-browsers/chromium --gl=swangle --concurrency=3 --crf=18 --timeout=120000 --log=error >/dev/null 2>&1) || log "g01 vertical $i falló"
done
mkdir -p gta6/shorts01
python3 - <<'PY'
import json, subprocess
t = json.load(open('gta6/g01/timeline.json'))['scenes']
seg = lambda ids: [[round(t[i]['start'], 3), round(t[i]['dur'], 3)] for i in ids]
S = []  # TODO tras el guion: ('s1_hora','¿A QUÉ HORA','SALE GTA 6?',[..]), ('s2_precio','¿CUÁNTO CUESTA','GTA 6?',[..]), ('s3_pc','¿SALE EN PC?','DATO VS RUMOR',[..])
for name, l1, l2, ids in S:
    subprocess.run(['python3', 'shorts13/make_short_v.py', 'gta6/g01/lanzamiento.mp4', f'gta6/shorts01/{name}.mp4', l1, l2, json.dumps(seg(ids))] + [f'gta6/g01/vert/e{i:02d}.mp4' for i in ids], check=True)
PY
log "g01 shorts: $(for f in gta6/shorts01/*.mp4; do echo -n "$f $(ffprobe -v error -show_entries format=duration -of csv=p=0 $f) "; done)"
log "FIN-GTA01"
