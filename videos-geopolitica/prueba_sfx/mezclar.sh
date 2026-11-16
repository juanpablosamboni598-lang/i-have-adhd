#!/bin/bash
# Mezcla de prueba: voz (Demucs desde lavadora.mp4) + música (musica.py, igual que antes) + efectos REALES (sfx_real.py),
# con los efectos un 15 % más bajos que el mix anterior (igualados en sonoridad a los sintéticos y luego x0.85).
set -e
cd "$(dirname "$0")"; V=../v23/lavadora.mp4; T0=74.7; D=15
# 1) efectos viejos (sintéticos) solo como referencia de volumen
python3 ../sfx.py . >/dev/null && mv sfx.wav sfx_viejo.wav
# 2) efectos reales nuevos
python3 ../sfx_real.py . 2.25
# 3) voz separada con Demucs (2 s de margen a cada lado)
ffmpeg -v error -y -ss $(python3 -c "print($T0-2)") -t $((D+4)) -i $V -vn -ac 2 -ar 44100 seg.wav
/home/user/tools/qwen-venv/bin/python -m demucs --two-stems=vocals -n htdemucs -o sep seg.wav >/dev/null 2>&1
ffmpeg -v error -y -ss 2 -t $D -i sep/htdemucs/seg/vocals.wav -ar 44100 -ac 2 voz.wav
# 4) música regenerada igual que en el video (transposición 1) y recortada al tramo
TOTAL=$(python3 -c "import json;print(json.load(open('../v23/timeline.json'))['total'])")
[ -s musica_full.wav ] || python3 ../musica.py $TOTAL musica_full.wav 1 >/dev/null
ffmpeg -v error -y -ss $T0 -t $D -i musica_full.wav musica.wav
# 5) nivel: efectos nuevos con la misma sonoridad que los viejos, y luego 15 % más bajos
G=$(python3 - <<'PY'
import subprocess,re
def lufs(f):
    p=subprocess.run(['ffmpeg','-i',f,'-af','ebur128','-f','null','-'],capture_output=True,text=True).stderr
    return float(re.findall(r'I:\s+(-?[0-9.]+) LUFS',p)[-1])
o,n=lufs('sfx_viejo.wav'),lufs('sfx.wav'); g=10**((o-n)/20)*0.85
print(f'{g:.4f}')
PY
)
echo "ganancia efectos nuevos: $G (igualados al mix viejo x0.85)"
# 6) misma cadena de mezcla que ensamblar_cartoon.sh (sin el whoosh sintético: los cortes ya llevan whoosh real)
ffmpeg -v error -y -i voz.wav -i musica.wav -i sfx.wav -filter_complex "[0:a]asplit=3[v][sc][sc2];[1:a]volume=0.45[m];[m][sc]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[md];[2:a]volume=$(python3 -c "print(0.765*$G)")[fx];[fx][sc2]sidechaincompress=threshold=0.05:ratio=3:attack=10:release=300[fxd];[v][md][fxd]amix=inputs=3:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11[a]" -map "[a]" -ar 44100 mezcla.wav
# 7) video: la imagen original del tramo + audio nuevo; y el original "antes" para comparar
ffmpeg -v error -y -ss $T0 -t $D -i $V -i mezcla.wav -map 0:v -map 1:a -c:v libx264 -crf 20 -preset veryfast -c:a aac -b:a 192k -shortest lavadora_15s_sfx_nuevos.mp4
ffmpeg -v error -y -ss $T0 -t $D -i $V -c:v libx264 -crf 20 -preset veryfast -c:a aac -b:a 192k lavadora_15s_antes.mp4
ls -la lavadora_15s_*.mp4
