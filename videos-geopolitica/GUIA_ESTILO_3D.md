# Guía de estilo: videos 3D "prueba y error" (canal jxseng + página de Facebook Quatoom)

Actualizada el 14 nov 2026. Es el estilo obligatorio para TODOS los videos nuevos (largos y Shorts/Reels).
Referencia que pidió el dueño: los videos de un perfil de Facebook (no copiar su marca ni sus diseños; solo el estilo).

## 1. Reglas del dueño (no negociables)
- PROHIBIDO subir o publicar sin autorización. No programar fuera del plan autorizado.
- No borrar ni modificar videos publicados sin preguntar. No inventar datos ni métricas.
- Plan autorizado vigente: 1 video largo diario + 3 Shorts, en YouTube (Zernio) y Facebook (Buffer, página Quatoom).
- Horario (hora de Colombia): largo 3:00 pm; Shorts 3:30 pm, 8:00 pm y 8:00 am del día siguiente. Nunca 2 a la misma hora.
- Programar automáticamente solo lo que pase el control de calidad (QC) y avisar con enlaces.
- Responder en español, formato TDAH: acción primero, listas cortas, un "Siguiente paso".

## 2. Cómo se cuenta (lo más importante): la fórmula
Transcribí el video de referencia. TODO el video es una sola cadena:
1. "Si pones [algo simple]… ya tienes [objeto]."
2. "PERO [problema que se siente]…"
3. "ASÍ QUE [solución con verbos de manos]…"
4. "ESE ES EL [nombre de la pieza]."
5. Otra vez "PERO…" (la solución trae el siguiente problema). Repetir hasta armar el objeto completo.

Ejemplo real de la referencia: "Si pones un tanque de lámina lleno de agua sobre un quemador de gas, ya tienes un boiler, pero
la flama solo calienta el fondo y casi todo su calor se va por los lados, así que le metes un tubo por en medio… Ese es el tubo de humos."

Reglas del guion:
- SIN introducción ("hoy vamos a ver"), sin título hablado, sin "suscríbete" largo. Empieza directo en la primera pieza.
- Habla de TÚ: "si pones", "le metes", "lo forras", "tú escoges".
- Frases cortas encadenadas con comas. Verbos de manos: meter, forrar, bajar un tubo, juntar, tapar.
- Problemas que se SIENTEN: "se infla como una olla express", "sale quemando", "el tubo truena", "te marea, te duerme".
- El porqué en UNA frase simple ("la caliente, que pesa menos, se queda arriba").
- Casi sin números ni fechas ni historia. El nombre técnico llega al final de cada paso, como premio.
- Objetos de la vida diaria (regadera, tanque, cerillo, olla). Cada paso dura 10–15 s.
- Datos siempre verdaderos (si hay un dato, verificarlo; fuentes en la descripción).

## 3. La voz
Medido en la referencia vs. la nuestra:
- Velocidad: referencia ~208 palabras/min; la nuestra ~160 → acelerar hasta ~200 ppm.
- Pausas: referencia casi sin pausas (una sola cadena); la nuestra tenía 45 pausas en 2,5 min (hasta 1,8 s)
  → pausas entre escenas de 0,2 s máximo.
- Energía: la nuestra es más grave y plana → subir expresividad (Chatterbox: exaggeration ~0.7, cfg_weight ~0.3).
- Voz: Chatterbox multilingüe en /home/user/tools/tts-venv, script tts/chatter.py (clona tts/ref_johan.wav).
- Transcribir referencias: faster-whisper en /home/user/tools/stt-venv (modelo "small"; leer el wav con numpy).

## 4. La imagen
- 3D con colores planos (toon) y contorno negro (casco invertido, componente OL en remotion/src/three/kit.jsx).
- Un escenario fijo y limpio (pared de color + piso de baldosas) que se mantiene todo el video.
- Luz fuerte de lado con SOMBRAS LARGAS en la pared (da profundidad; vale el costo de render).
- Rayos X: carcasas transparentes para ver el interior (agua, humo, tubos). Los materiales deben ser SIEMPRE
  `transparent` (si se cambia a mitad de escena, three.js no lo actualiza).
- Algo se mueve SIEMPRE: humo, burbujas, agua que cambia de color, piezas que caen/deslizan. Cambio visible cada 1–2 s.
- Empieza mostrando el objeto terminado, luego se desarma y se vuelve a armar pieza por pieza.
- Medidores dentro del 3D (tubos de vidrio con líquido y número que cambia en vivo, con sombra), no pegados en 2D.
- Texto arriba: 1–3 palabras clave SINCRONIZADAS con la voz (aparecen cuando las dice), minúsculas, negrita.
  Negro = normal, ROJO = problema/fallo. SIN subtítulos abajo (recarga la imagen).
- Formato: Shorts/Reels en VERTICAL nativo 9:16 (no recortar el horizontal). Largo de YouTube 16:9.
- Sonido: un efecto en cada pieza que cae, cada texto que aparece y cada fallo (la referencia tiene ~2 golpes por segundo).
  Efectos 15% más bajos que antes (SFXVOL 0.765, WVOL 0.595). Música suave de fondo.
- No copiar la marca/logo/diseños de la referencia. Marca propia: jxseng.

## 5. Técnica (cómo lo hacemos aquí)
- Remotion 4.0.250 + @remotion/three (three 0.169). Código en videos-geopolitica/remotion/src/three/
  (kit.jsx, world20/21.jsx, scenes20/21.jsx) e index20/21.jsx.
- Render: `--gl=swangle` (angle/egl no funcionan en este servidor). `dpr={0.5}` en ThreeCanvas y antialias off
  (≈0,5–0,7 s por fotograma). Textos HTML encima quedan nítidos.
- Pipeline: vNN/mk.py → escenas.json → voz (chatter.py) → prep.py → mkdata.py → bundle → render por escena →
  ensamblar_cartoon.sh → qc_video.py (0 tramos quietos obligatorio) → shorts13/make_short.py → publicar.
  Ver pipeline6.sh / pipeline7.sh.
- QC: hoja de contactos (composición SHEET) antes de renderizar; después qc_video.py debe dar 0 tramos casi iguales.
  Si falla: más movimiento de cámara (llaves de cámara cada ~1/3 de escena) y animación constante.
- Videos <100 MB; se publican desde GitHub raw (rama videos-geopolitica).
- YouTube: Zernio call_tool → posts_create_post (cuenta 6ae95d70993b6de3f0101d16, categoryId 27,
  containsSyntheticMedia true, madeForKids false, timezone America/Bogota).
- Facebook: Buffer create_post, canal 6af68dae62b70b94b0146956 (org 6aebf8952a050bbf040f37de),
  largo = type "post" con video; Shorts = type "reel"; dueAt con -05:00. Límite gratis: 10 programados a la vez.
- Ganchos de Shorts honestos (nada que el video no cumpla). Descripción con capítulos reales y fuentes.

## 6. Estado (14 nov 2026)
- Programados en YouTube y Facebook: v20 jirafa (14 nov) y v21 inodoro (15 nov), cada uno con 3 Shorts/Reels.
- Siguiente: v22 con la fórmula "si pones… pero… así que… ese es el…" + voz rápida + mejoras de imagen.
