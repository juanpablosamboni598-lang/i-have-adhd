#!/bin/bash
# Lavadora (v23) completa con efectos REALES CC0: voz separada con Demucs del mp4 publicado + música regenerada (igual que antes)
# + sfx_real.py (whoosh en cada corte, clic en palabras clave, ~2/s), efectos 15 % más bajos que el mix anterior. No publica nada.
set -e
cd "$(dirname "$0")"; V=../v23/lavadora.mp4
TOTAL=$(python3 -c "import json;print(json.load(open('timeline.json'))['total'])")
python3 ../sfx.py . >/dev/null && mv sfx.wav sfx_viejo.wav
CUTWHOOSH=1 python3 ../sfx_real.py . 2.0
[ -s sep/htdemucs/completo/vocals.wav ] || { ffmpeg -v error -y -i $V -vn -ac 2 -ar 44100 completo.wav; /home/user/tools/qwen-venv/bin/python -m demucs --two-stems=vocals -n htdemucs -o sep completo.wav >/dev/null 2>&1; }
ffmpeg -v error -y -i sep/htdemucs/completo/vocals.wav -ar 44100 -ac 2 voz.wav
[ -s musica.wav ] || python3 ../musica.py $TOTAL musica.wav 1 >/dev/null
G=$(python3 -c "
import subprocess,re
l=lambda f: float(re.findall(r'I:\s+(-?[0-9.]+) LUFS',subprocess.run(['ffmpeg','-i',f,'-af','ebur128','-f','null','-'],capture_output=True,text=True).stderr)[-1])
print(round(10**((l('sfx_viejo.wav')-l('sfx.wav'))/20)*0.85,4))")
echo "ganancia efectos: $G"
ffmpeg -v error -y -i voz.wav -i musica.wav -i sfx.wav -filter_complex "[0:a]asplit=3[v][sc][sc2];[1:a]volume=0.45[m];[m][sc]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[md];[2:a]volume=$(python3 -c "print(0.765*$G)")[fx];[fx][sc2]sidechaincompress=threshold=0.05:ratio=3:attack=10:release=300[fxd];[v][md][fxd]amix=inputs=3:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11[a]" -map "[a]" -ar 44100 mezcla.wav
ffmpeg -v error -y -i $V -i mezcla.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart lavadora_sfx_reales.mp4
ffprobe -v error -show_entries format=duration,size -of default=nw=1 lavadora_sfx_reales.mp4
echo "LUFS $(ffmpeg -i lavadora_sfx_reales.mp4 -af ebur128 -f null - 2>&1 | grep -o 'I: *-[0-9.]* LUFS' | tail -1)"
