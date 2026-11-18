# 03 · Comparación de los 10 videos

## Medidas objetivas por video
Cómo se midió:
- Muestreo a 2 fps.
- "Claro" = fotogramas con luminancia media > 170/255; "oscuro" = luminancia media < 60/255.
- "Saturados" = píxeles con saturación > 0,45 y valor > 0,35.

| # | Modo | Fondo dominante (HEX, % del borde) | % claro / oscuro | Saturación media | Píxeles saturados | Acento medido | Duración media del plano* |
|---|---|---|---|---|---|---|---|
| 1 | A | #F8F8F8 58 % · #080808 19 % | 72 / 17 | 0,17 | 0,2 % | Amarillo marcador, naranja #D88C1C | 2,1 s (composición) |
| 2 | B | #F8F8F8 38 % · #080808 23 % | 43 / 29 | 0,22 | 12,2 % | Multicolor: rojo #BA0E16, verde #16C49B | 0,68 s |
| 3 | B | #F8F8F8 23 % · #080808 15 % | 28 / 31 | 0,25 | 18,1 % | Multicolor y térmico | 0,61 s |
| 4 | C | #080808 54 % · #F8F8F8 25 % | 25 / 60 | 0,28 | 9,3 % | Naranja #D34F21, rojo #D4001D | 1,7 s |
| 5 | A | #121212 · #181818 78 % | 0 / 57 | 0,06 | 4,5 % | Dorado #F7E508, naranja #F16322 | 2,0 s |
| 6 | A | #FFFFFF 59 % | 69 / 11 | 0,05 | 0,9 % | Rojo #E10E28 | 2,1 s |
| 7 | A | #DEDEDE en el centro, #333132 en la viñeta | gris medio | 0,02 | 0,2 % | Dorado del logo #8F7431 | 7,7 s entre cortes (todo continuo); composición cada ~2,5 s |
| 8 | A | #EFEFEF 96 % | 92 / 0 | 0,06 | 1,6 % | Morado #592668 / #3E2147 | Un solo plano continuo; composición cada ~1,8 s |
| 9 | C | #000408 70 % | 17 / 70 | 0,44 | 0,9 % | Magenta y azul en las UI | 0,76 s |
| 10 | C | #FFFFFF 70 % · #0F0F0F 24 % | 72 / 28 | 0,02 | 0,7 % | Azul #67ABDE | 4,9 s entre cortes; composición cada ~2 s |

\* Duración del video dividida entre los cortes detectados más uno. En los Modos A y C muchas transiciones son morphs sin corte, así que también indico cada cuánto cambia la composición, medido a ojo en las hojas de 1 fps.

## Rasgos que se repiten (en cuántos de los 10 videos)
| Rasgo | Videos | Total |
|---|---|---|
| Composición centrada en el eje vertical | 1–10 | **10/10** |
| Fondo plano blanco, gris claro o negro (no fotográfico) como base | 1–10 | **10/10** |
| Texto de 1 a 4 palabras por pantalla, que entra palabra por palabra al ritmo de la voz | 1–10 | **10/10** |
| Entrada de texto de desenfocado a nítido (0,125–0,25 s) | 1–10 | **10/10** |
| Desenfoque de movimiento en objetos y transiciones | 1–10 | **10/10** |
| Sin subtítulos en la franja inferior: el texto ES el diseño | 1–10 | **10/10** |
| Mezcla de tamaños: palabra pequeña + palabra grande en el mismo bloque | 1, 2, 3, 5, 6, 7, 8, 10 | **8/10** |
| Un solo color de acento sobre una base B/N | 1, 4, 5\*, 6, 7, 8, 10 | **7/10** (\*el 5 usa dorado + naranja) |
| Tarjetas redondeadas con sombra suave | 1, 2, 4, 6, 8, 9, 10 | **7/10** |
| Serif cursiva condensada para la palabra clave | 1, 3, 5, 6, 7 | **5/10** |
| Objetos 3D o PNG recortados en B/N con sombra suave, entrando desde las esquinas | 1, 5, 6, 7, 10 | **5/10** |
| Personas reales como foto recortada B/N | 1, 6, 7, 8 | 4/10 |
| Líneas decorativas (cintas 3D, trazos de pincel, arcos discontinuos, onda) | 1, 4, 5, 6, 7, 8 | **6/10** |
| Cuadrícula fina, patrón de puntos o guías discontinuas | 4, 5, 6, 7, 8 | 5/10 |
| Mockups de interfaz (reproductor, modal macOS, chat, línea de tiempo) | 1, 4, 6, 9, 10 | 5/10 |
| Viñeta radial | 2, 3, 5, 7, 10 | 5/10 |
| Push-in lento constante | 1, 2, 3, 5, 6, 7, 9 | 7/10 |
| Zoom-through (atravesar un objeto para entrar a la escena siguiente) | 1, 8, 9 | 3/10 |
| Estrobo de imágenes a 2–4 fotogramas | 2, 3, 9 | 3/10 |
| Colores térmicos o arcoíris, medio tono | 2, 3 | 2/10 |
| Glitch RGB o aberración cromática | 7, 9 | 2/10 |

## Diferencias
| Eje | Modo A (1, 5, 6, 7, 8) | Modo B (2, 3) | Modo C (4, 9, 10) |
|---|---|---|---|
| Formato | 9:16 | 9:16 | 16:9 |
| Paleta | B/N con 1 acento; saturación media 0,02–0,17 | Multicolor saturado y térmico; 12–18 % de píxeles saturados | B/N con un acento de marca (naranja o azul) |
| Imágenes | Objetos 3D recortados y fotos B/N recortadas | Fotos y videos a color a pantalla completa, rostros, rayos X | Capturas de interfaz, tarjetas, espacio |
| Tipografía | Sans pequeña + serif cursiva condensada o sans-K | Sans bold diminuta (24–40 px) + palabras gigantes con degradado | Sans neutra (tipo SF Pro) de 30–50 px, sin serif |
| Ritmo | Morph continuo; composición cada 1,8–2,5 s | Cortes cada 0,6–0,7 s; estrobo de 0,07–0,13 s | Composición cada 1,7–2 s; en el video 9, cortes cada 0,76 s |
| Cámara | Push-in, paralaje, órbita en objetos 3D | Push-in sobre fotos; casi nada en 3D | Cámara 3D sobre tarjetas, inclinación, barril |
| Transiciones | Morph, barrido con desenfoque, máscara circular, whip | Corte seco, estrobo | Zoom-through, flash, glitch de bloques, fundido por luminancia |

## Qué hace que parezcan del mismo universo
1. **Lienzo vacío y centrado.** Siempre hay un fondo plano y un solo foco en el centro. Nunca hay más de 1 objeto principal + 2–4 decorativos en las esquinas.
2. **La tipografía es la protagonista.** Hay de 1 a 4 palabras, que entran palabra por palabra pasando de desenfocadas a nítidas. Por eso nunca hay subtítulos clásicos.
3. **Profundidad falsa (2.5D).** Se consigue con sombras suaves, desenfoque de profundidad en las capas cercanas y desenfoque de movimiento en todo lo que entra.
4. **Control del color.** Base B/N y un solo acento. El Modo B rompe esta regla a propósito.
5. **Nada se queda quieto.** Hay un push-in o una flotación constante, y algo nuevo aparece cada 0,2–0,5 s.
