#!/bin/bash
# v23 lavadora con la VOZ CLONADA del dueño (Qwen3, autorizada 15 nov): voz -> recorte de silencios -> tiempos por palabra -> prep -> render -> ensamblado -> QC -> Shorts verticales.
cd /home/user/i-have-adhd/videos-geopolitica
source <(sed -n '/^log()/,/^}$/p;/^assemble()/,/^}$/p' pipeline3.sh)
P=$(pgrep -f "tts/mivoz.py v23"); if [ -n "$P" ]; then while kill -0 $P 2>/dev/null; do sleep 20; done; fi
THREADS=4 /home/user/tools/qwen-venv/bin/python tts/mivoz.py v23 >> v23/tts.log 2>&1
N=$(python3 -c "import json;print(len(json.load(open('v23/escenas.json'))))")
[ $(ls v23/audio2/a*.wav | wc -l) -ge $N ] || { log "v23 voz incompleta"; exit 1; }
# recorta silencios del principio y del final de cada frase (una sola vez)
for f in v23/audio2/a*.wav; do [ -f "$f.trim" ] && continue
  ffmpeg -v error -y -i "$f" -af "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse" "${f%.wav}_t.wav" && mv "${f%.wav}_t.wav" "$f" && touch "$f.trim"; done
/home/user/tools/stt-venv/bin/python tts/palabras.py v23 >> v23/tts.log 2>&1
# velocidad: llevar la voz a ~185 palabras por minuto (entre 1.0 y 1.15)
TEMPO=$(python3 - <<'PY'
import json,subprocess,glob
e=json.load(open('v23/escenas.json')); w=sum(len(x['texto'].split()) for x in e)
d=sum(float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f])) for f in sorted(glob.glob('v23/audio2/a*.wav')))
print(round(min(1.15,max(1.0,185/(w/d*60))),3))
PY
)
log "v23 voz lista, tempo $TEMPO"
TEMPO=$TEMPO LEAD=0.12 TAIL=0.08 python3 prep.py v23
(cd remotion && python3 mkdata_words.py 23 && rm -rf build23 && timeout 900 npx remotion bundle src/index23.jsx --out-dir build23 --log=error)
mkdir -p v23/render2 v23/vert
for pass in 1 2 3; do
  for i in $(seq -w 0 $((N-1))); do
    [ -s v23/render2/e$i.mp4 ] && continue
    (cd remotion && timeout 3600 npx remotion render build23 V23-$i ../v23/render2/e$i.mp4 --browser-executable=/opt/pw-browsers/chromium --gl=swangle --concurrency=3 --crf=18 --timeout=120000 --log=error >/dev/null 2>../v23/render2/err$i.txt) || { rm -f v23/render2/e$i.mp4; log "v23 escena $i falló (pasada $pass)"; }
  done
done
[ $(ls v23/render2/e*.mp4 | wc -l) -ge $N ] || { log "v23 render incompleto"; exit 1; }
log "v23 render listo"
[ -s v23/lavadora.mp4 ] || NOSUBS=1 assemble 23 lavadora 1
(cd remotion && npx remotion still build23 THUMB ../v23/miniatura.jpg --browser-executable=/opt/pw-browsers/chromium --gl=swangle --log=error) || log "v23 miniatura falló"
for i in 21 22 23 24 25 26; do
  [ -s v23/vert/e$i.mp4 ] && continue
  (cd remotion && timeout 3600 npx remotion render build23 VV23-$i ../v23/vert/e$i.mp4 --browser-executable=/opt/pw-browsers/chromium --gl=swangle --concurrency=3 --crf=18 --timeout=120000 --log=error >/dev/null 2>&1) || log "v23 vertical $i falló"
done
mkdir -p shorts23
python3 - <<'PY'
import json, subprocess
t = json.load(open('v23/timeline.json'))['scenes']
seg = lambda ids: [[round(t[i]['start'], 3), round(t[i]['dur'], 3)] for i in ids]
S = [('s1_centrifuga', '¿CÓMO SECA LA ROPA', 'TU LAVADORA?', [23, 24]),
     ('s2_concreto', '¿POR QUÉ PESA TANTO', 'TU LAVADORA?', [25, 26]),
     ('s3_filtro', '¿SABÍAS QUE TU LAVADORA', 'TIENE UN FILTRO?', [21, 22])]
for name, l1, l2, ids in S:
    subprocess.run(['python3', 'shorts13/make_short_v.py', 'v23/lavadora.mp4', f'shorts23/{name}.mp4', l1, l2, json.dumps(seg(ids))] + [f'v23/vert/e{i:02d}.mp4' for i in ids], check=True)
PY
log "v23 shorts: $(for f in shorts23/*.mp4; do echo -n "$f $(ffprobe -v error -show_entries format=duration -of csv=p=0 $f) "; done)"
log "FIN9"
