# 01 · Acceso: qué videos se vieron

Los 10 videos se descargaron completos (yt-dlp) y se analizaron fotograma a fotograma:
- hoja de contactos a 1 fps de cada video (todos los segundos);
- tiras a 8 fps (cada 0,125 s) en 2 ventanas de 1,5 s por video, elegidas en transiciones;
- detector de cortes de ffmpeg (umbral de escena 0,25);
- medición de color HEX por muestreo de píxeles.

| # | Enlace | Creador | Duración | Formato | ¿Visto completo? |
|---|---|---|---|---|---|
| 1 | vt.tiktok.com/ZSpvuP2r1 | @clean.creator | 37,5 s | 1080×1920 (9:16) | Sí |
| 2 | vt.tiktok.com/ZSpvuPKBM | @editcraft09 | 29,2 s | 1080×1920 (9:16) | Sí |
| 3 | vt.tiktok.com/ZSpvuDBpJ | @editcraft09 | 35,3 s | 1080×1920 (9:16) | Sí |
| 4 | vt.tiktok.com/ZSpvu2vAu | @hatsu6961 | 24,2 s | 1280×720 (16:9) | Sí |
| 5 | vt.tiktok.com/ZSpvuNUkp | @clean.creator | 19,8 s | 1080×1920 (9:16) | Sí |
| 6 | vt.tiktok.com/ZSpvuj8ye | @clean.creator | 31,0 s | 1080×1920 (9:16) | Sí |
| 7 | vt.tiktok.com/ZSpvu8Dnw | @clean.creator | 38,7 s | 720×1280 (9:16) | Sí |
| 8 | vt.tiktok.com/ZSpvuBmTe | @danushkmotion | 18,3 s | 720×1280 (9:16) | Sí |
| 9 | vt.tiktok.com/ZSpvuGHwm | @hilbert.studio8 | 60,0 s | 1280×720 (16:9) | Sí |
| 10 | vt.tiktok.com/ZSpvusePG | @nucman.fx | 34,3 s | 1024×576 (16:9) | Sí |

## Límites honestos del análisis
- Con 8 fps veo la forma de cada transición, pero no la curva de easing exacta. Las duraciones tienen un margen de ±0,06 s.
- Las fuentes se identifican a ojo; no tengo los archivos de proyecto. Doy la fuente más parecida, no la confirmada.
- Los tamaños en px están medidos sobre el fotograma y convertidos a un lienzo de 1080×1920 (±10 %).
- Analicé solo la imagen. El audio no entra en este análisis.

## Hallazgo clave antes de empezar
Los 10 videos son de **6 creadores distintos** y forman **3 familias visuales**:
- **Modo A · Editorial 2.5D monocromo** (videos 1, 5, 6, 7, 8): 5 de 10. Cuatro son de @clean.creator. El 6 (Apple) y el 7 (Lamborghini) son historias de marcas, el mismo tema que tu canal.
- **Modo B · Dopamina de alto contraste** (videos 2, 3): de @editcraft09.
- **Modo C · Anuncio SaaS / interfaz** (videos 4, 9, 10): horizontales.

Que los 10 parezcan "del mismo creador" a la vez no es posible, porque entre sí no lo parecen. La biblia define:
1. las reglas que comparten los 10, que se aplican siempre;
2. el Modo A como estilo principal del canal (mayoría y mismo tema);
3. los Modos B y C como variantes exactas, para escenas puntuales.
