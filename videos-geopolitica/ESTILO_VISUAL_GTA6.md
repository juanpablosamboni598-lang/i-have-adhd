# ESTILO VISUAL — ViceLeakss (canal no oficial de GTA 6)

Todo lo de abajo sale del código real: remotion/src/indexg02.jsx, indexg03.jsx, three/world_g02.jsx, scenes_g02.jsx, scenes_g03.jsx, gta6/g0X/mk.py, pipelinegta03.sh y referencias/ANALISIS_REFERENCIAS.md. Videos de muestra: gta6/g02/gta6_no_cuesta_100.mp4 (1:36) y gta6/g03/gta6_todo_lo_confirmado.mp4 (4:48).

## 1. Estética general
- Explicador de datos en 3D estilizado, con fondo casi negro y sombras de semitono (puntos de trama tipo cómic o serigrafía, no degradados). Sin contornos.
- Mood: dato contra rumor, claro y rápido, sin sensacionalismo. Transmite: "te cuento qué es verdad y qué no".
- Referencia: los 5 videos de referencia del dueño (explicadores 3D oscuros; ver referencias/ANALISIS_REFERENCIAS.md). Se copia el estilo, no la marca ni los diseños.
- 100 % objetos genéricos y originales hechos con código (three.js): etiquetas de precio, cajas de juego genéricas, consolas genéricas (placa alta / torre cúbica), PC, tren, letreros, reloj, pastel, monedas, barras, una península abstracta (NO es el mapa del juego), fichas tipo peón para los personajes.
- Formato: horizontal 1920×1080 a 30 fps para los videos largos. Los Shorts son 1080×1920.

## 2. Paleta (hex exactos del código, objeto C)
- Fondo: #0B0B10
- Texto: #F0EBE4
- Rojo (acento, tachados, rumor, transición): #F84418
- Lima (dato confirmado, cifras buenas, cursor): #D2F834
- Azul (mar, segundo acento): #2A42F6
- Papel (tarjetas claras, tierra): #EFE9E1
- Dorado (Ultimate, monedas): #E8B730
- Gris (partículas, texto apagado): #8A8D96
- Oscuro (objetos oscuros): #23262D
- Plataforma: #3A3D45
- Tarjeta: #1C1E23 · tarjeta 2: #31373F · lavanda: #9B8FE8 (casi sin uso)
- Texto saliendo / apagado: #6B6B70 · ceros a la izquierda del contador: #4A4C55 · fondo de la tarjeta tecleada: #111216 · pantallas: #11141C
- Regla de color: lima = confirmado, rojo = rumor o falso, azul = neutro.

## 3. Tipografía y texto en pantalla
- Titulares: "Inter Display" (respaldo Inter), peso 900, 78 px, arriba y centrados (top 70 px), estirados scaleX(1.06), letterSpacing 1, sombra 0 4px 14px rgba(0,0,0,0.6).
- Entran palabra por palabra al ritmo exacto de la voz: cada palabra arranca 0,11 s después de la anterior y dura 0,18 s, subiendo 16 px, escalando de 0,9 a 1 y pasando de blur 6 px a nítido.
- Salen en 0,22 s: blur hasta 10 px, todo en gris #6B6B70 y opacidad ×0,1.
- Marcado de color por palabra: ^r rojo, ^l lima, ^b azul, ^s tachado (barra roja de 8 px que se dibuja de izquierda a derecha). Ejemplo: "GTA 6 NO CUESTA ^s$100".
- Cada texto aparece cuando la voz dice su palabra disparadora (tiempos de faster-whisper) y dura hasta el siguiente.
- Textos cortos, en mayúsculas, de 2 a 6 palabras.
- Tarjeta tecleada: "JetBrains Mono" peso 700, 42 px, fondo #111216 (o papel #EFE9E1 con texto #141018), borde izquierdo rojo de 6 px, se escribe a 30 caracteres por segundo con un cursor de bloque lima que parpadea. Se usa para fechas, listas cortas, "SIN CONFIRMAR", etc.
- Contador odómetro: JetBrains Mono 800, de 64 a 90 px, la última cifra rueda con blur de 1,5 px, ceros a la izquierda en gris #4A4C55, sufijo tipo "AÑOS", "VISTAS" o "MILLONES".
- Etiquetas 3D: canvas con Inter Display 900, y JetBrains Mono 800 para los años.

## 4. Miniaturas (1280×720, composición THUMB)
- Fondo #0B0B10 con grano. Un solo objeto 3D a la izquierda sobre la plataforma gris: una etiqueta de precio grande (g02: "$100" tachado en rojo; g03: "19 NOV" en lima), con un leve giro.
- Texto a la derecha, alineado a la derecha, Inter Display 900, interlineado 0,98, apilado en 3 o 4 líneas:
  - líneas 1–2 en #F0EBE4 a 96 px (ej.: "GTA 6" / "NO CUESTA" o "TODO LO");
  - línea clave en rojo #F84418, a 140 px en g02 ("$100") y 84 px en g03 ("CONFIRMADO", achicada para no pisar la etiqueta);
  - remate en JetBrains Mono lima a 46 px: "DATO vs RUMOR".
- No hay caras, personajes, flechas ni círculos. Máximo unas 5 palabras. El texto nunca debe tapar el objeto.

## 5. Edición y ritmo
- Voz: Marco, clonada con Qwen3-TTS (voz marco_gta6b) con su autorización grabada solo para este canal. Objetivo de unas 185 palabras por minuto; se acelera entre ×1,0 y ×1,15 si hace falta. Se recortan los silencios de cada frase, con 0,12 s de entrada y 0,08 s de cola.
- Guion con fórmula fija:
  1. Arranca desmintiendo un mito ("GTA seis no cuesta cien dólares").
  2. Sigue una metáfora (el tren que avisa retraso).
  3. Luego un dato con fuente (Rockstar, Guinness, Take-Two, tribunal de Londres).
  4. Gira con "Pero eso no es lo más raro…".
  5. Cierra repitiendo la primera frase, para que el video haga loop.
  - Cada rumor se dice como rumor.
- Una escena por idea, de 5 a 12 s. La cámara se mueve siempre (fov 40, keyframes interpolados, órbitas, vaivén senoidal) y siempre hay partículas de polvo flotando.
- Control de calidad obligatorio: 0 tramos de 3 fotogramas casi iguales al muestrear cada 2 s (qc_video.py). Si una escena queda quieta, se agrega órbita, un reloj girando o partículas.
- Transición única, la "bolita puente": toda la escena se encoge en 0,3 s hasta una bolita roja #F84418, y la siguiente nace de ella.
- Animaciones de entrada: "pop" (sube a 110 % y baja a 100 % en 0,32 s), "drop" (cae desde arriba) y el tachado que se dibuja.
- No hay zooms digitales ni cortes duros dentro de una escena: el movimiento lo hace la cámara 3D.
- Subtítulos clásicos: no hay. Los títulos sincronizados cumplen esa función (NOSUBS=1).
- Grano: feTurbulence (baseFrequency 0,9, 2 octavas), modo screen, opacidad 0,07, cambia cada fotograma.
- Sonido: efectos reales CC0 (librería sfx_lib/ de OpenGameArt), con una densidad de unos 2 por segundo. Va uno en cada corte (whoosh), en cada aparición (pop/click), en cada movimiento y en cada palabra clave; los efectos van un 15 % más bajos que la mezcla anterior. Música de fondo de musica.py, final en −14 LUFS.
- Render de Remotion 4.0.250 + @remotion/three: --gl=swangle, dpr 0,5, --crf 18.

## 6. Gráficos y elementos que se repiten
- Plataforma elíptica gris con sombra difusa bajo el objeto protagonista.
- Etiqueta de precio 3D con agujero y texto.
- Tachado rojo 3D.
- Letreros de estación con fechas.
- Línea de tiempo con puntos por año y el salto final resaltado en rojo.
- Columnas que crecen para comparar cifras.
- Contador odómetro y tarjeta tecleada (ver punto 3).
- Material de semitono (shader propio): luz desde (−0,35, 0,55, 0,78), puntos en pantalla de 3,2 px en las zonas de sombra, color de sombra = color × 0,36.
- No hay logo de canal en el video.
- La descripción siempre lleva: "Video animado en 3D. Voz clonada por IA con autorización. Canal no oficial, sin relación con Rockstar Games."

## 7. Prompts de imágenes o clips
- No se usó ningún prompt de IA de imagen ni de video para los videos ni para las miniaturas: todo se genera con código (three.js / Remotion).
- Los únicos prompts de imagen fueron los de la foto de perfil y la portada del canal. Esos textos no están guardados en el repo, así que no se copian aquí.

## 8. Lo que NO se debe hacer
- Usar clips, capturas, logos, música, personajes, mapas o tipografías de GTA o Rockstar, o cualquier cosa que haga parecer oficial al canal.
- Presentar un rumor como dato. Siempre se marca como rumor: mapa ×2–3, 200 GB, PC en 2027, desbloqueo a medianoche. Nada de clickbait.
- Hacer escenas quietas (el control de calidad las rechaza).
- Poner sellos o etiquetas que tapen los títulos (se quitaron en g01 porque se cortaban y se encimaban), o textos 3D más anchos que su caja (se auto-ajustan al largo del texto).
- Repetir el estilo viejo de g01 (cartoon claro). El estilo actual es el de g02/g03.
- Usar efectos de ElevenLabs del plan gratis en videos comerciales; solo efectos CC0.
- Subir las grabaciones de voz de Marco al repo (están en .gitignore).
- Publicar o programar sin la autorización explícita del dueño.
