#!/bin/bash
# Uso: ensamblar_cartoon.sh <carpeta> <salida.mp4> <transposicion_musica>
set -e
cd "$1"
python3 ../subtitulos_ass.py .
N=$(python3 -c "import json;print(len(json.load(open('escenas.json'))))")
TOTAL=$(python3 -c "import json;print(json.load(open('timeline.json'))['total'])")
mkdir -p vonly
for i in $(seq 0 $((N-1))); do f=$(printf "%s/e%02d.mp4" ${RENDER:-render} $i); ffmpeg -y -loglevel error -i $f -an -c copy $(printf "vonly/e%02d.mp4" $i); printf "file 'vonly/e%02d.mp4'\n" $i; done > vlist.txt
ffmpeg -y -loglevel error -f concat -safe 0 -i vlist.txt -c copy crudo.mp4
VF="ass=subs.ass:fontsdir=/usr/share/fonts/opentype/inter"
if [ -n "$VBITRATE" ]; then
  ffmpeg -y -loglevel error -i crudo.mp4 -vf "$VF" -c:v libx264 -preset slow -b:v $VBITRATE -pass 1 -passlogfile x264pass -pix_fmt yuv420p -an -f mp4 /dev/null
  ffmpeg -y -loglevel error -i crudo.mp4 -vf "$VF" -c:v libx264 -preset slow -b:v $VBITRATE -pass 2 -passlogfile x264pass -pix_fmt yuv420p -an mudo.mp4
else
  ffmpeg -y -loglevel error -i crudo.mp4 -vf "$VF" -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p -an mudo.mp4
fi
python3 ../musica.py $TOTAL musica.wav $3
python3 ../sfx.py .
python3 - <<'PY'
import json,subprocess
tl=json.load(open('timeline.json'))
starts=[s['start'] for s in tl['scenes'][1:]]
filt=[f"[0:a]atrim=0:0.5,asetpts=PTS-STARTPTS,highpass=f=800,lowpass=f=4000,afade=t=in:d=0.15,afade=t=out:st=0.2:d=0.3,volume=0.5,adelay={int(st*1000)}|{int(st*1000)}[w{i}]" for i,st in enumerate(starts)]
fc=';'.join(filt)+';'+''.join(f'[w{i}]' for i in range(len(starts)))+f"amix=inputs={len(starts)}:normalize=0[out]"
subprocess.run(['ffmpeg','-y','-loglevel','error','-f','lavfi','-i','anoisesrc=d=1:c=pink:a=0.6','-filter_complex',fc,'-map','[out]','-ac','2','-ar','44100','whoosh.wav'],check=True)
PY
ffmpeg -y -loglevel error -i mudo.mp4 -i narracion.wav -i musica.wav -i whoosh.wav -i sfx.wav -filter_complex "[1:a]asplit=3[v][sc][sc2];[2:a]volume=0.45[m];[m][sc]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[md];[3:a]volume=${WVOL:-0.7}[w];[4:a]volume=${SFXVOL:-0.9}[fx];[fx][sc2]sidechaincompress=threshold=0.05:ratio=3:attack=10:release=300[fxd];[v][md][w][fxd]amix=inputs=4:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -movflags +faststart "$2"
ffprobe -v error -show_entries format=duration,size -of default=nw=1 "$2"
