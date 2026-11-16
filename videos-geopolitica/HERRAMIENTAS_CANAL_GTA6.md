# Canal nuevo de GTA 6: herramientas (copia exacta de las que usa jxseng)

Este canal usa el mismo kit que jxseng. No se agregan herramientas nuevas que no sirvan, y no se salta ningún paso.

## 0. Reglas del dueño (obligatorias)

1. **PROHIBIDO subir o publicar sin autorización del dueño.** No programes publicaciones sin su permiso, y no borres ni cambies videos publicados sin consultarle.
2. Puedes investigar, preparar y optimizar borradores.
3. No inventes datos. Tampoco afirmes haber visto métricas a las que no tienes acceso.
4. Nunca pidas secretos (claves, contraseñas) por el chat. Mantén privado el correo del dueño.
5. Responde en español, en formato TDAH: la acción primero, listas cortas y un "Siguiente paso".
6. Haz commit y push en la rama `videos-geopolitica`. El canal va en la carpeta `videos-geopolitica/gta6/`.

## 1. Derechos de autor (GTA 6 es de Rockstar Games / Take-Two)

- **No uses** clips, capturas, tráilers, música, logos, la fuente oficial ni el arte de GTA 6. Tampoco recrees personajes, mapas ni escenas del juego.
- **Todo el material visual debe ser original**, hecho con el kit 3D de abajo: autos genéricos, ciudad genérica, mandos, consolas, monedas, gráficas.
- El canal no puede parecer oficial. No uses "Rockstar" ni el logo de GTA en el nombre o el avatar.
- Nombrar el juego como tema de noticias y análisis sí está permitido.
- Antes de cada guion, verifica con búsqueda web los datos: fecha de salida, precio, plataformas y tráilers. Si algo es rumor, dilo como rumor. Sin clickbait.

## 2. Voz: Qwen3-TTS con clonación (la misma de jxseng)

- **Motor:** Qwen3-TTS 0.6B Base (paquete `qwen-tts` 0.1.1, modelo `Qwen/Qwen3-TTS-12Hz-0.6B-Base`).
- **Script:** `tts/mivoz.py <carpeta>`. Genera `<carpeta>/audio2/aNN.wav`, una por escena, con `generate_voice_clone(text, language='Spanish', ref_audio, ref_text, x_vector_only_mode=False)`. Variables:
  - `VOZ=marco` (predeterminada) o `VOZ=dueno`
  - `THREADS=4`
  - `FORCE=1` para rehacer
- **Instalación:**
  ```bash
  python3 -m venv /home/user/tools/qwen-venv
  /home/user/tools/qwen-venv/bin/pip install qwen-tts
  ```
- **Consentimiento:** Marco autorizó su voz SOLO para jxseng (YouTube) y Quatoom (Facebook). Para este canal hace falta una **autorización nueva grabada** en la que nombre el canal de GTA 6.
- **Grabación de referencia:** no está en el repositorio (está en .gitignore a propósito). Pídele al dueño que suba en la sesión el audio de Marco con la autorización nueva. Recórtalo a 10–15 s de habla limpia y guárdalo como `tts/amigo/ref.wav`. Pon en `VOCES['marco']` en `tts/mivoz.py` la transcripción exacta de ese recorte. **Nunca subas ese audio al repositorio.**
- **Voces prohibidas:** no clones ninguna otra voz (ElevenLabs, Will, Luis Vega, gente famosa). No uses cuentas temporales para conseguir créditos gratis.
- **Recorte de silencios:** ffmpeg `silenceremove` al inicio y al final de cada frase. Ver `pipeline9.sh`.

## 3. Tiempos por palabra: faster-whisper

- **Script:** `tts/palabras.py <carpeta>`. Usa el modelo "small", `word_timestamps=True` e `initial_prompt` con el texto de la escena. Escribe `aNN.words.json`.
- **Instalación:**
  ```bash
  python3 -m venv /home/user/tools/stt-venv
  /home/user/tools/stt-venv/bin/pip install faster-whisper
  ```
- **Velocidad:** apunta a unas 185 palabras por minuto. TEMPO automático entre 1.0 y 1.15 (ver `pipeline9.sh`).
- **Unión de la narración:** `prep.py <carpeta>`, con `LEAD=0.12 TAIL=0.08`.

## 4. Música: `musica.py` (generada con numpy, sin derechos de autor)

- **Uso:** `python3 musica.py <duración_s> musica.wav <transposición>`.
- Prohibido usar música comercial o la banda sonora de GTA.

## 5. Efectos de sonido: `sfx.py` (sintetizados con numpy)

- Lee la lista `sfx` de cada escena en `escenas.json`. Formato: `[[posición 0–1, "nombre"], ...]`, con nombres como impacto, whoosh, pop, mecanismo, chapoteo, fallo…
- Revisa `sfx.py` para ver los nombres que existen.
- El whoosh de transición lo genera `ensamblar_cartoon.sh`.

## 6. Imagen: Remotion 4.0.250 + three.js (`remotion/`)

- **Instalación:** `cd remotion && npm install`. Chromium ya viene instalado en `/opt/pw-browsers/chromium`.
- **Estilo:** ver `GUIA_ESTILO_3D.md`.
  - 3D con contorno `OL` de `remotion/src/three/kit.jsx`.
  - Materiales toon, sombras y fondo liso.
  - Textos sincronizados con la voz, sin subtítulos quemados (`NOSUBS=1`).
  - Cámara que se acerca a cada elemento.
- **Plantillas a copiar:** `src/index23.jsx`, `src/three/world23.jsx` y `src/three/scenes23.jsx` (largo + verticales `VV`). Para un reel vertical, `src/indexfb01.jsx`.
- **Datos:** `remotion/mkdata_words.py <id>` genera `dataNN.json`.
- **Render:** `npx remotion render buildNN ID salida.mp4 --browser-executable=/opt/pw-browsers/chromium --gl=swangle --concurrency=3 --crf=18`. Usa `ThreeCanvas dpr={0.5}` y antialias apagado en las escenas, y materiales siempre `transparent`.
- **Hoja de contacto:** composición `SHEET`, para revisar encuadres antes de renderizar todo.

## 7. Ensamblado y control de calidad

- **Ensamblado:** `NOSUBS=1 ./ensamblar_cartoon.sh <carpeta> <salida.mp4> <transp>`, o la función `assemble` de `pipeline3.sh`. Mezcla voz + música + whoosh + sfx, con sidechain y `loudnorm` a -14 LUFS.
- **QC:** `python3 qc_video.py <video> <timeline.json>`. Debe dar **0 tramos casi iguales** (nada congelado).
- **Miniatura:** composición `THUMB` (1280x720). Honesta: debe mostrar algo que el video sí cuenta.
- **Shorts:** `shorts13/make_short_v.py`, verticales nativos 9:16.
- **Pipeline completo de referencia:** `pipeline9.sh`. Copiarlo como `pipelinegta01.sh` y cambiar las rutas.
- Los trabajos largos van como tarea Bash en segundo plano (`run_in_background`, timeout de hasta 2 h). Las pipelines se saltan lo que ya está hecho.

## 8. Publicación (solo con autorización del dueño)

- **YouTube:** con Zernio (`posts_create_post`).
  - El dueño debe crear el canal nuevo en YouTube y conectarlo en Zernio. Claude no puede crear canales.
  - Busca el `accountId` nuevo con `accounts_list`. Nunca uses el de jxseng.
  - `categoryId` 20 (Videojuegos) o 24, `containsSyntheticMedia: true`, `madeForKids: false`, `timezone: America/Bogota`.
- **Alojamiento de archivos:** enlaces raw de GitHub en la rama `videos-geopolitica`, con archivos de menos de 100 MB.
- **Facebook (si se pide):** Buffer, tipo `reel`, de **90 s máximo**.
- **Descripción:** debe decir "Video animado en 3D. Voz clonada por IA con autorización. Canal no oficial, sin relación con Rockstar Games."

## 9. Lo que NO se usa (no sirve o no hay créditos)

- ElevenLabs (sin créditos), Speko (saldo negativo) y voces de edge-tts para el canal.
- Clips o imágenes del juego, música con derechos y generadores de video con IA que copien el estilo de GTA.
