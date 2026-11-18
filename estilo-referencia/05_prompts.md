# 05 · Prompts reutilizables

Variables: **[TEMA]**, **[PERSONAJE]**, **[ACCIÓN]**, [OBJETO], [ACENTO_HEX], [VARIANTE].
- Los prompts de imagen van en inglés, porque los modelos responden mejor así.
- Los de plano van en español, porque los lee el motor o tú.

## 1 · Personaje (consistente en todas las escenas)
**Figura genérica (estilo del video 5):**
```
[PERSONAJE], full body 3D figure, white matte clay material (#F2F2F2), smooth sculpted surfaces,
no facial details, minimal features, [ACCIÓN], isolated on pure white background, soft studio light
from top-left at 45 degrees, soft contact shadow below, subtle rim light, high-key, product render,
85mm lens, centered, 4k, monochrome
seed: [SEMILLA_FIJA]
```

**Persona real (estilo de los videos 1, 6 y 8)** — tratamiento, no generación:
```
Foto de [PERSONAJE] → rembg (recorte) → saturación 0 % → contraste +20 % → sombra suave
0/3 %/40 px/35 % → tarjeta redondeada (radio 10 %) o directamente sobre el fondo.
```

## 2 · Objeto 3D (el asset que más se usa)
```
a single [OBJETO] related to [TEMA], photorealistic 3D render, black and white, desaturated,
brushed silver / glossy black / matte white material, isolated on pure white background,
soft studio lighting from top-left, soft drop shadow, slight 3/4 angle, sharp focus, minimal,
editorial product shot, centered, no text, 4k
```
Variante con acento (el único objeto a color de la escena):
```
... same as above, but the [OBJETO] is in polished gold / red [ACENTO_HEX], everything else monochrome
```

## 3 · Escenario
**Fondo del Modo A (se construye en HTML, no se genera):**
```
[VARIANTE]: A-claro = #F4F2FC plano + bokeh #CACAC7 ; A-gris = #DEDEDE + viñeta radial a #333132 + cuadrícula 1px #BDBDBD cada 90px ;
A-oscuro = #121212 + 2 curvas #3A3A3A en X ; A-morado = #EFEFEF + puntos #DADADA paso 24px + arcos discontinuos #9A9A9A
grano 3 %
```
**Plano fotorrealista de ambientación (máximo 30 % del video):**
```
cinematic photo of [TEMA] setting in [AÑO/ÉPOCA], interior/exterior, dark moody warm grade,
low-key lighting, tungsten practicals, film grain, shallow depth of field, 35mm, vertical 9:16,
no people facing camera, no text, realistic
```

## 4 · Plano (instrucción completa de una composición)
```
PLANO [n] · [inicio]–[fin] s · Modo A · [VARIANTE]
Objeto principal: [OBJETO] 3D B/N, centro (x 50 %, y 52 %), ancho 55 %, entra desde [esquina] en 0,35 s con desenfoque de movimiento, luego flota ±2 %.
Esquinas: [OBJETO_2] arriba-der (cortado 45 %) y abajo-izq (cortado 50 %), paralaje ×1,6.
Cámara: push-in 1,00→1,04.
Texto (tercio superior, y 18–26 %): "[palabra pequeña]" Inter Display 52 px #111 + "[PALABRA CLAVE]" Instrument Serif Italic 130 px [#111 | ACENTO_HEX].
Cada palabra entra de desenfocada a nítida en 0,18 s al tiempo de words.json.
Sombra: 0/3 %/40 px/35 %. Grano: 3 %.
Salida: [morph | barrido negro 0,25 s | whip 0,13 s | máscara circular 0,3 s | zoom-through 0,5 s].
Tema de la escena: [TEMA]. Acción: [ACCIÓN].
```

## 5 · Prompt negativo (para todas las imágenes generadas)
```
cartoon, anime, flat vector, clipart, illustration, painting, watercolor, neon, colorful background,
gradient background, busy background, multiple objects, clutter, text, letters, watermark, logo
(unless requested), lens flare, bokeh lights in color, oversaturated, HDR, fisheye, dutch angle,
low quality, blurry subject, deformed, extra limbs, distorted face, plastic toy look, glossy
cartoon shading, harsh shadows, dramatic colored lighting, frame, border
```

## 6 · Prompt negativo de edición (para el motor y para ti)
```
NO: subtítulos abajo, karaoke de colores, rebote elástico, más de 6 palabras en pantalla, más de 1 acento,
fondos de color en Modo A, fundidos > 0,6 s, transiciones de plantilla 3D, emojis en texto, contornos gruesos,
planos quietos > 0,6 s, texto en el 15 % inferior.
```
