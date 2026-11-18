# 04 · Sistema de reproducción: de un guion a un video con este estilo

Proceso en 10 pasos. Cada paso indica qué entra, qué sale y con qué herramienta (ver [07](07_herramientas.md)).

## Paso 1 · Guion adaptado al estilo
- Entra: el tema. Sale: un guion de 70–110 palabras (18–39 s con la voz a 1,2).
- Frases de 3 a 8 palabras. Cada frase debe tener **1 palabra clave** (la que irá en serif-it grande o en acento).
- Marca la palabra clave con asteriscos: `Apple dejó de *VENDERLE* a todo el mundo`.
- Estructura: gancho (0–3 s, con una cifra o una contradicción) → 3–5 bloques de datos → cierre con una frase "pequeña + GRANDE".

## Paso 2 · Voz y tiempos
1. ElevenLabs, voz Will (bIHbv24MWmeRgasZH58o), velocidad 1.2, modelo eleven_flash_v2_5, idioma "es".
2. Transcribir con faster-whisper con marcas de tiempo por palabra y guardarlo en `words.json` como `[[inicio, fin, "palabra"], …]`.
3. Corregir los números que whisper parte en dos ("2" + ".000" → "2.000").

## Paso 3 · Bloques y composiciones
- Agrupa las palabras en **composiciones de 1,8–2,5 s**, cortando en las pausas de la voz (silencios > 0,18 s).
- A cada composición asígnale:
  - una variante de luz (A-claro, A-gris, A-oscuro o A-morado);
  - 1 objeto principal y 0–4 objetos de esquina;
  - el texto, con su rol (sans-ch, serif-it, sans-K, lista o pastilla);
  - la transición de salida (según la tabla de §12).
- Regla de alternancia: después de 2–4 composiciones claras, 1–2 oscuras (patrón del video 1).

## Paso 4 · Lista de recursos (assets)
Cada objeto se produce una sola vez y se reutiliza:
| Tipo | Cómo se obtiene | Tratamiento |
|---|---|---|
| Objeto 3D B/N (candado, reloj, globo, moneda) | Generación de imagen con la plantilla de [05](05_prompts.md) §2, fondo blanco | Recorte con rembg → PNG con transparencia |
| Persona real | Foto con licencia o de dominio público | Recorte con rembg, saturación 0, contraste +20 % |
| Persona genérica constante | Figura 3D blanca mate: misma plantilla, misma semilla, mismo texto de personaje | Recorte |
| Logo de marca | SVG o PNG oficial (solo para uso informativo) | Versión 3D o sobre círculo negro con anillo punteado |
| Plano fotorrealista de época | Generación de imagen ("1997 office, dark warm…") o b-roll de Pixabay | Etalonaje cálido y oscuro, grano del 5 % |
| Interfaz | Se maqueta en HTML (modal, reproductor, línea de tiempo, tarjetas) | Sombras según §6 |

**Consistencia de personajes:** guarda en `personajes.json` el texto exacto del personaje, la semilla y la vista de referencia. Genera todas las poses en una sola sesión con la misma semilla. Si la herramienta lo permite, usa la imagen de referencia como "image prompt".

## Paso 5 · Plan de escena (JSON)
Cada composición se describe así (la lee el motor de render):
```json
{"start": 2.48, "end": 4.94, "bg": "A-claro",
 "main": {"asset": "candado.png", "x": 0.5, "y": 0.52, "w": 0.55, "enter": "from-bottom-right", "float": true},
 "corners": [{"asset": "reloj.png", "corner": "tr", "crop": 0.45}, {"asset": "reloj.png", "corner": "bl", "crop": 0.5, "flip": true}],
 "text": [{"t": 2.48, "w": "más de", "role": "sans-ch"}, {"t": 2.86, "w": "2.000", "role": "sans-K", "accent": true}],
 "block_pos": "top", "exit": "wipe-black"}
```

## Paso 6 · Cámara y animación
Se aplica de forma automática a cada composición:
- push-in de 1,00 a 1,04;
- objetos de esquina con paralaje ×1,6;
- objeto principal con flotación (seno, 2–4 s, ±2 %);
- entradas de 0,25–0,5 s con desenfoque de movimiento;
- palabras con desenfoque 16 px → 0 en 0,18 s, sincronizadas con `words.json`.

## Paso 7 · Iluminación y sombras
- PNG: `drop-shadow(0 3% 40px rgba(0,0,0,.35))`.
- Logos: sombra larga a 45°.
- Grano global del 3 % y viñeta según la variante.

## Paso 8 · Efectos y transiciones
- Se aplican desde la tabla de §11 y §12, sin inventar otros.
- Máximo 1 efecto especial (glitch, tachado, marcador o flecha) cada 6–8 s.

## Paso 9 · Render
- 1080×1920, 30 fps, H.264, CRF 18.
- Desenfoque de movimiento real: el motor renderiza 4–8 subfotogramas por fotograma y los promedia, o aplica el desenfoque CSS durante las entradas.
- Audio: voz con loudnorm, música al 12–15 % con ducking, efectos de sonido suaves; −14 LUFS.

## Paso 10 · Control de calidad (antes de publicar)
1. Hoja de contactos a 1 fps junto a la hoja del video 1 o 6 de referencia: ¿parecen la misma serie?
2. Revisar la lista de §15 (consistencia).
3. Medir la saturación media (≤ 0,17) y el porcentaje de píxeles de acento (≤ 5 %) con el script de medición que se usó en el análisis.
4. Ninguna pantalla puede tener más de 6 palabras ni texto en el 15 % inferior.
