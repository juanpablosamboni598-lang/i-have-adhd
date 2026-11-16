# Análisis de las 11 referencias (16 nov 2026)

Fuente: 11 TikToks del mismo creador, en vertical, de unos 2:30. Solo copiamos el ESTILO, nunca su marca, su logo, sus personajes ni sus diseños.
Los videos no se suben al repositorio porque es público y son de otra persona. Para volver a bajarlos:
`yt-dlp -f "best[ext=mp4]/best" -o "rNN.%(ext)s" https://vt.tiktok.com/<código>/`, con los códigos: ZSpspcDeJ, ZSpssdPAk, ZSpssMe37, ZSpssJXuH, ZSpsp3JDw, ZSpsshK87, ZSpssLth4, ZSpspKpUp, ZSpspo8MU, ZSpssF9sV, ZSpsp3UVT.
Scripts: `referencias/analizar.py` (cortes, movimiento, efectos y sonoridad) y `referencias/transcribir.py` (palabras por minuto, pausas y gancho). Datos crudos: `med.jsonl` y `tr.jsonl`.

## Mediciones por video

| # | Tema | Duración (s) | Palabras/min | Cortes duros | Efectos/s* | % cuadros quietos | LUFS |
|---|---|---|---|---|---|---|---|
| r01 | De la calculadora de tu mochila a la supercomputadora más po | 162.5 | 186.0 | 8 | 2.43 | 15.7 | -17.3 |
| r02 | De la primera foto de la historia a la cámara de tu celular, | 168.8 | 200.7 | 2 | 2.01 | 20.8 | -17.3 |
| r03 | Esa ventanita del tubo de tu estufa NO está de adorno 🔥 🎓 Mi | 160.5 | 204.4 | 0 | 1.89 | 13.8 | -17.3 |
| r04 | Ese triángulo con flecha arriba de la puerta de una casita d | 169.7 | 209.2 | 0 | 2.14 | 19.5 | -17.6 |
| r05 | Del hueso más chiquito de tu cuerpo al tubo más largo que ll | 150.8 | 191.5 | 1 | 2.18 | 29.9 | -17.4 |
| r06 | ``text Esa lucecita que parpadea en tu medidor de luz NO est | 142.0 | 204.0 | 0 | 2.15 | 23.0 | -17.3 |
| r07 | 🏹 Esa varilla larga del arco olímpico NO está de adorno. Con | 143.0 | 208.2 | 4 | 1.69 | 30.2 | -17.5 |
| r08 | Esos tubos de vidrio de tu calentador solar no son tubos: so | 146.4 | 212.9 | 9 | 2.19 | 30.5 | -17.2 |
| r09 | Ese aro de fierro en la punta de la ballesta no está de ador | 140.4 | 213.9 | 0 | 1.81 | 23.6 | -17.4 |
| r10 | Esa manguerita que gotea de tu minisplit NO está de adorno 💧 | 156.0 | 204.2 | 0 | 2.17 | 27.0 | -17.4 |
| r11 | El espermatozoide que te hizo no ganó ninguna carrera 🏁 Lo e | 138.5 | 185.6 | 3 | 2.1 | 12.7 | -17.0 |

*Efectos/s = golpes percusivos detectados con librosa (HPSS + onsets). Incluye algunas consonantes de la voz, así que es aproximado.

## Promedio de las 11 = OBJETIVO para cada video nuevo

| Métrica | Referencias | Lavadora v23 (nuestro) | Objetivo |
|---|---|---|---|
| Duración | 152.6 s | 317.6 s | 140–170 s para reels; el largo de YouTube puede durar más |
| Palabras por minuto | 201.87 | ~185 | **~200** |
| La voz empieza en | 0.11 s | — | **0 s, sin silencio inicial** |
| Pausa máxima entre palabras | 0.68 s | — | **≤ 0.7 s** |
| Palabras por video | 508.27 | — | ~500 en 2:30 |
| Cortes duros | 2.45 por video (casi ninguno) | 31 (1 cada 10 s) | **Una sola toma continua: la cámara viaja de pieza en pieza, sin cortinillas** |
| Efectos por segundo | 2.07 | 1.41 | **~2** |
| % de cuadros quietos | 22.43 % | 1.9 % | Puede haber respiros cortos; nuestro QC de 0 congelados sigue |
| Sonoridad | -17.34 LUFS (típico de TikTok) | -14.1 | -14 para YouTube; -14 a -16 para reels |

## Estructura del guion (de las transcripciones)
- **Gancho (0–3 s):** arranca directo con la fórmula. "Si le metes una manguera a un cilindro de gas…", "Si doblas un palo y le amarras una cuerda…". También usan "De [algo chiquito] a [algo enorme]…" o un dato que contradice lo que crees ("El espermatozoide que te hizo no ganó ninguna carrera").
- **Desarrollo:** la cadena "si pones… pero… así que… ese es el…", sin pausas largas.
- **Cierre fijo:** "**Y con esto ya puedes** [construir / poner / conectar] [el objeto] [en tu casa]." En los videos de datos cierran con una frase que da la vuelta ("El tuyo también llegó tarde").
- Los títulos usan "Esa [pieza] de tu [objeto] **NO está de adorno**".

## Estilo visual (revisando cuadros clave)
- **Look de dibujo, no realista.** 3D con grano de papel y trazos de pincel seco en las superficies, líneas de tinta finas en todos los bordes (no solo en la silueta) y sombreado en 2–3 bandas.
- **Modelos con detalle:** biseles, tuercas hexagonales, roscas, cables con curva, perillas con marcas. Piezas de latón, cobre y aluminio con su color real.
- **Escenario fijo:** pared de azulejo o color pastel, piso de baldosas, luz de sol de lado con sombras largas y nítidas.
- **Rayos X:** la carcasa se vuelve transparente para ver el interior.
- **Medidores dentro del 3D:** tubos de vidrio con líquido verde o rojo y un número que cambia (°C).
- **Texto arriba:** 1–3 palabras sincronizadas, en negro, o en rojo si es un problema.
- **Cámara:** viaja continuamente. Se acerca a la pieza nueva y se aleja para mostrar el conjunto.

## Qué cambiamos en nuestro proceso
1. Voz a ~200 palabras por minuto, sin silencio inicial y con pausas ≤ 0.7 s.
2. Quitar las cortinillas (Wipe) y encadenar las escenas con cámara continua.
3. Estilo dibujado: `Dibujo` y `GranoPapel` en `remotion/src/three/kit.jsx`, a resolución completa (dpr 1).
4. Efectos reales con `sfx_real.py` desde `sfx_lib/`, a ~2 por segundo.
5. Cierre "Y con esto ya puedes…" en los guiones de Facebook.
