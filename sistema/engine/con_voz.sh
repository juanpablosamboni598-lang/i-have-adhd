#!/bin/bash
# Uso: con_voz.sh <video.json> <voz.mp3> <musica.mp3> <salida.mp4>
# Ajusta los tiempos de las escenas a la duracion de la voz, renderiza y mezcla voz + musica (baja, con ducking) + whooshes.
set -e
J="$1"; V="$2"; M="$3"; OUT="$4"; W=$(dirname "$OUT")/tmp_$$; mkdir -p "$W"
VD=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V")
python3 -I - "$J" "$VD" "$W/video.json" <<'PY'
import json,sys
j=json.load(open(sys.argv[1])); vd=float(sys.argv[2]); old=j['duration']
end=[s for s in j['scenes'] if s['type']=='end']
body_old=end[0]['start'] if end else old
import os
f=1.0 if os.environ.get('NOSCALE')=='1' else (vd+0.4)/body_old
for s in j['scenes']:
    s['start']=round(s['start']*f,2)
    if 'end' in s: s['end']=round(s['end']*f,2)
j['duration']=round(vd+0.4+2.0,2)
json.dump(j,open(sys.argv[3],'w'),ensure_ascii=False)
print('factor',round(f,3),'duracion',j['duration'])
PY
node "$(dirname "$0")/render.js" "$W/video.json" "$W/base.mp4"
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$W/base.mp4")
ffmpeg -y -loglevel error -i "$W/base.mp4" -i "$V" -stream_loop -1 -i "$M" -filter_complex \
 "[1:a]loudnorm=I=-16:TP=-1.5,asplit=2[v][sc];[2:a]atrim=0:$D,afade=t=in:d=1,afade=t=out:st=$(python3 -c "print($D-2)"):d=2,volume=0.22[m];[m][sc]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[md];[0:a][v][md]amix=inputs=3:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5[a]" \
 -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -movflags +faststart "$OUT"
rm -rf "$W"; echo "listo $OUT"
