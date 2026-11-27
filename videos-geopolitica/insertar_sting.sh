#!/bin/bash
# Uso: insertar_sting.sh <video.mp4> <timeline.json> <sting.mp4> <salida.mp4>
# Mete el sting de marca justo después de la escena 0 (el gancho). Recodifica en 2 pasadas para seguir bajo 100 MB.
set -e
V=$1; TL=$2; S=$3; O=$4; BR=${VBITRATE:-1700k}
T1=$(python3 -c "import json;print(json.load(open('$TL'))['scenes'][1]['start'])")
FC="[0:v]trim=0:$T1,setpts=PTS-STARTPTS,fps=30,format=yuv420p[v0];[0:a]atrim=0:$T1,asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo[a0];\
[1:v]fps=30,scale=1920:1080,format=yuv420p,setpts=PTS-STARTPTS[v1];[1:a]aresample=48000,aformat=channel_layouts=stereo,asetpts=PTS-STARTPTS[a1];\
[0:v]trim=start=$T1,setpts=PTS-STARTPTS,fps=30,format=yuv420p[v2];[0:a]atrim=start=$T1,asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo[a2];\
[v0][a0][v1][a1][v2][a2]concat=n=3:v=1:a=1[v][a]"
P=$(dirname $O)/xs
ffmpeg -y -loglevel error -i $V -i $S -filter_complex "$FC" -map "[v]" -an -c:v libx264 -preset slow -b:v $BR -pass 1 -passlogfile $P -f mp4 /dev/null
ffmpeg -y -loglevel error -i $V -i $S -filter_complex "$FC" -map "[v]" -map "[a]" -c:v libx264 -preset slow -b:v $BR -pass 2 -passlogfile $P -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart $O
echo "sting insertado en $T1 s"
