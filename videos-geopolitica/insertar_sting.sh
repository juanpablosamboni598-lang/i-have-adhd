#!/bin/bash
# Uso: insertar_sting.sh <video.mp4> <timeline.json> <sting.mp4> <salida.mp4>
# Mete el sting de marca justo después de la escena 0 (el gancho). Recodifica en 2 pasadas para seguir bajo 100 MB.
# El video se abre dos veces (-t y -ss) para que ffmpeg no guarde fotogramas en memoria.
set -e
V=$1; TL=$2; S=$3; O=$4; BR=${VBITRATE:-1700k}
T1=$(python3 -c "import json;print(json.load(open('$TL'))['scenes'][1]['start'])")
AF="aresample=48000,aformat=channel_layouts=stereo,asetpts=PTS-STARTPTS"
VF="fps=30,scale=1920:1080,format=yuv420p,setpts=PTS-STARTPTS"
FC="[0:v]$VF[v0];[0:a]$AF[a0];[1:v]$VF[v1];[1:a]$AF[a1];[2:v]$VF[v2];[2:a]$AF[a2];[v0][a0][v1][a1][v2][a2]concat=n=3:v=1:a=1[v][a]"
IN="-t $T1 -i $V -i $S -ss $T1 -i $V"
P=$(dirname $O)/xs
ffmpeg -y -loglevel error $IN -filter_complex "$FC" -map "[v]" -map "[a]" -c:a aac -c:v libx264 -preset slow -threads 2 -b:v $BR -pass 1 -passlogfile $P -f mp4 /dev/null
ffmpeg -y -loglevel error $IN -filter_complex "$FC" -map "[v]" -map "[a]" -c:v libx264 -preset slow -threads 2 -b:v $BR -pass 2 -passlogfile $P -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart $O
echo "sting insertado en $T1 s"
