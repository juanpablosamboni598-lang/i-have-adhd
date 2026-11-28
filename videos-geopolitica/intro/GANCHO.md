# Gancho + sting Xseng

**Regla:** nunca abrir con logo. Los primeros segundos son para el gancho; el sting va después.

## Orden de los primeros 9 s

| Tiempo | Qué pasa | Para qué |
| --- | --- | --- |
| 0–1,5 s | **Flash-forward:** el momento más loco de la historia, sin explicar | Que no deslice |
| 1,5–4 s | **La regla rara** del poder, en una frase | Entender el juego |
| 4–7 s | **Giro + pregunta abierta** que solo se responde al final | Que se quede hasta el final |
| 7–8,6 s | **Sting Xseng** (`sting_xseng.mp4`, 1,6 s) | Marca sin perder gente |

## Reglas del gancho
- La primera palabra ya es historia ("Gané…", "Ella…"). Nada de "Hola" ni "En este video".
- Movimiento desde el fotograma 1: cámara, rayo, monedas, texto que entra.
- Que coincida con la miniatura: lo que promete la miniatura sale en los primeros 3 s.
- La pregunta abierta se paga al final de verdad (gancho honesto).

## Ejemplo: "¿Qué pasaría si ganaras $1 cada vez que tu crush te miente?"
1. **0–1,5 s:** lluvia de monedas sobre Xeno, Sofía en shock.
   "Gané 3.000 dólares en un solo día… y todos venían de ella."
2. **1,5–4 s:** monedita que cae con *clink*.
   "La regla: cada vez que mi crush me miente, me cae un dólar."
3. **4–7 s:** Sofía dice "te quiero"… *clink*. Zoom a la moneda.
   "Todo era divertido… hasta que me dijo 'te quiero'. Y cayó una moneda."
4. **7–8,6 s:** sting → empieza la historia.

## Archivos
- `sting_xseng.mp4`: 1,6 s, 1920x1080, 30 fps, con sonido (whoosh + carga + golpe, sfx_lib CC0).
- `sting_xseng.anima`: proyecto editable de RaveAnima.
- `sting.mjs`: lo regenera (`node intro/sting.mjs <carpeta_svg>`).
- `partes_xeno.py`: saca a Xeno de `chars28.json` como SVG para RaveAnima.

## Miniatura que funciona (crush, nov 2026)
Vista en los "¿Qué pasaría si…?" de crush con más vistas (ImaginaX 967K, Zack Mils 706K):
- Las dos caras **enormes y juntas**, llenando el cuadro (nada de personajes chiquitos y lejos).
- Etiquetas **"TÚ"** (blanco) y **"TU CRUSH"** (rosa) con flechas a cada cara.
- Él en pánico (ojos enormes, gota de sudor), ella sonrojada y tranquila.
- **Un solo objeto** que cuenta el poder (38 %, -30 °C, la moneda "+$1").
- Colores saturados de noche/neón. Casi nada de texto aparte de las etiquetas.
- Sin camas, pijamas ni poses sugerentes: romance sano.
Plantilla: composición `THUMB2` en `remotion/src/index33.jsx`.
