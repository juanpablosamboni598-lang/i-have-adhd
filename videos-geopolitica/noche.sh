#!/bin/bash
# Producción encadenada de la noche (18-19 nov): en orden de fecha de publicación. Cada pipeline retoma donde quedó.
cd /home/user/i-have-adhd/videos-geopolitica
run(){ local f=$1 out=$2 sh=$3; [ -s "$f/$out" ] && grep -q "FIN" $f/pipeline.log 2>/dev/null && { echo "[$(date -u +%H:%M)] $f ya listo"; return; }; ./$sh >> $f/pipeline.log 2>&1; }
run fb03 cremallera.mp4 pipelinefb03.sh
run fb02 ducha.mp4 pipelinefb02.sh
run fb04 olla.mp4 pipelinefb04.sh
run v24 microondas.mp4 pipeline24.sh
run fb05 termo.mp4 pipelinefb05.sh
echo "[$(date -u +%H:%M)] NOCHE FIN"
