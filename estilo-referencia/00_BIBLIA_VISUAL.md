# BIBLIA VISUAL · Estilo de referencia (documento principal)

Este documento reúne todas las reglas del estilo, sacadas de los 10 videos analizados.

Archivos de apoyo:
- [01 Acceso](01_acceso.md)
- [02 Plano a plano](02_analisis_plano_a_plano.md)
- [03 Comparación](03_comparacion.md)
- [04 Sistema de reproducción](04_sistema_reproduccion.md)
- [05 Prompts](05_prompts.md)
- [06 Tres pruebas](06_tres_pruebas.md)
- [07 Herramientas](07_herramientas.md)

**Estructura**
- §0 explica la jerarquía de modos.
- §1–§15 son las reglas. Lo marcado **[U]** se aplica a todo; **[A]**, **[B]** y **[C]** aplican solo a ese modo.
- **Modo por defecto del canal: A.** Es la mayoría (5/10), y los videos 6 (Apple) y 7 (Lamborghini) son historias de marcas, como tu canal.

Unidades: px sobre un lienzo de 1080×1920 (9:16). Para 16:9, multiplicar los tamaños por 0,56 y usar 1920×1080. Tiempos en segundos (s). A 30 fps, 1 fotograma = 0,033 s.

---

## §0 · Jerarquía de modos
| Modo | Cuándo | Peso en un video de 30 s |
|---|---|---|
| **A · Editorial 2.5D monocromo** (videos 1, 5, 6, 7, 8) | Siempre, como base | 80–100 % |
| **B · Dopamina** (videos 2, 3) | Solo como golpe en el gancho o en un dato impactante | 0–15 % (máximo 4 s seguidos) |
| **C · Interfaz SaaS** (videos 4, 9, 10) | Escenas donde se muestra una app, una web o un producto digital | 0–20 % |

✅ Elegir 1 variante de luz del Modo A por video: **A-claro** (fondo #F4F2FC o #FFFFFF, videos 1 y 6), **A-gris** (#DEDEDE con viñeta, video 7), **A-oscuro** (#121212, video 5) o **A-claro morado** (#EFEFEF con puntos, video 8). Se puede alternar claro y oscuro en bloques (video 1: 72 % claro, 17 % oscuro).
❌ No mezclar más de 2 modos en un video. No usar el Modo B en más del 15 % de la duración.

---

## §1 · Dirección artística [U]
- Lienzo plano y sin textura fotográfica en el 60–90 % de la duración. Un foco principal centrado en x = 50 %, entre y = 40 % y 65 %.
- Jerarquía fija por pantalla: **1 objeto principal + 0–4 objetos decorativos en las esquinas + 1 bloque de texto**.
- El objeto principal mide entre el 35 % y el 75 % del ancho. Los decorativos, entre el 25 % y el 45 % del ancho, y deben quedar cortados por el borde del cuadro entre un 30 % y un 60 %.
- Las imágenes "reales" (fotos, video) ocupan como máximo el 30 % de la duración en el Modo A y van desaturadas.

✅ Dejar aire: el bloque de texto + el objeto ocupan como máximo el 55 % del área. Los objetos decorativos siempre entran por las esquinas (arriba a la derecha y abajo a la izquierda es la pareja más usada: videos 1, 5, 6).
❌ Collages saturados, más de 5 elementos visibles, fondos con fotos de stock a pantalla completa en el Modo A, ilustraciones planas tipo "flat vector" o clipart.

## §2 · Animación [U]
| Acción | Duración | Easing | Notas |
|---|---|---|---|
| Entrada de palabra | 0,125–0,25 s | ease-out (cúbica) | De desenfoque 12–20 px a 0, de opacidad 0 a 1 y de escala 1,06 a 1 |
| Palabra "futura" ya visible | — | — | Gris #9E9E9E sobre claro o #5A5A5A sobre oscuro; pasa a color final al sonar (videos 1, 6) |
| Entrada de objeto | 0,25–0,5 s | ease-out fuerte (expo) | Desde fuera del cuadro, con desenfoque de movimiento (180° de obturador) y rotación de 5–20° |
| Flotación del objeto | continua | seno | Desplazamiento de 1–3 % del alto en 2–4 s; rotación ±2° |
| Anillo punteado | continuo | lineal | 30–60°/s (videos 1 y 6) |
| Lista (pastillas o ítems) | 1 ítem cada 0,6–1,2 s | ease-out | La lista sube la altura de 1 ítem (videos 1, 5, 8) |
| Morph de forma | 0,4–0,5 s | ease-in-out | Pastilla → tarjeta (video 8) |
| Contador o año | 0,3–0,6 s por valor | ease-out | Desenfoque vertical tipo rodillo (video 7) |

✅ Algo nuevo en pantalla cada 0,2–0,5 s (una palabra, un objeto o un ítem).
❌ Rebote elástico (overshoot > 3 %), squash and stretch de dibujos animados, aparición sin desenfoque, animaciones de más de 0,6 s para entrar.

## §3 · Personajes [U]
Lo que se vio: en ningún video hay un personaje animado propio y constante. Las "personas" aparecen de 4 formas:
1. **Foto real recortada B/N** con sombra suave (videos 1, 6, 7, 8): Zuckerberg, Jobs, Johnny Sins.
2. **Figura 3D blanca mate**, tipo escultura de arcilla sin rasgos (video 5: madre e hijo, mano que señala).
3. **Figura B/N de época** recortada (video 5: hombre de cuerda con maletín).
4. **Emoji o esfera 3D** (video 1: esfera negra triste; video 8: emoji 3D con laptop).

Reglas:
- Fotos reales: saturación 0 % (salvo un objeto acento, como la manzana roja de Jobs en el video 6), contraste +15–25 %, recorte limpio, sombra suave debajo.
- Para una persona genérica que se repite en varias escenas: **figura 3D blanca mate** (material #F2F2F2, rugosidad alta, sin cara detallada), siempre con la misma descripción y la misma semilla (ver 04 y 05).

✅ El mismo tratamiento en todas las escenas: B/N, recorte y sombra con desplazamiento y = 3 % y desenfoque de 40 px al 35 %.
❌ Personajes de caricatura, avatares de IA hablando con labios sincronizados, mezclar una figura blanca mate y una foto a color en la misma escena, cambiar el estilo de la figura a mitad del video.

## §4 · Escenarios [U]
| Variante | Fondo | Elementos permitidos |
|---|---|---|
| A-claro | #F4F2FC o #FFFFFF plano | Bokeh gris #CACAC7 (Ø 30–90 px, desenfoque del 40–60 %), cintas o trazos 3D negros y grises en las esquinas, cuadrícula fina |
| A-gris | #DEDEDE en el centro, viñeta radial a #333132 en las esquinas (radio 70 %) | Cuadrícula fina #BDBDBD de 1 px cada 90 px, trazos de tinta negros |
| A-oscuro | #121212 / #080808, viñeta | 2 líneas curvas finas #3A3A3A cruzadas en X, cuadrícula tenue #1E1E1E |
| A-claro morado | #EFEFEF + patrón de puntos #DADADA (paso de 24 px, Ø 2 px) | Arcos discontinuos #9A9A9A de 2 px (trazo de 10 px y hueco de 8 px) en las esquinas |
| Escena fotorrealista (máximo 30 %) | Foto o render de época, oscuro y cálido | Solo como plano de ambientación (video 6 a los 0–8 s; video 7 a los 7,9–15 s) |

✅ El fondo del Modo A nunca lleva degradados de color: solo plano, viñeta neutra y patrón fino.
❌ Escenarios 3D completos (habitaciones, ciudades) construidos en 3D, fondos de colores vivos en el Modo A, texturas de papel arrugado.

## §5 · Texturas [U]
- Grano de película: intensidad 2–4 % (A-gris y escenas fotorrealistas: 4–6 %).
- Medio tono (puntos): solo en el Modo B o en un objeto concreto del Modo A (mano del video 2, luz volumétrica de los videos 2 y 3).
- Materiales de los objetos 3D: metal plateado cepillado, plástico negro brillante, blanco mate, oro pulido (solo para el acento).

✅ Grano uniforme en toda la imagen, incluido el texto.
❌ Texturas de papel, lienzo, polvo, rayones o VHS.

## §6 · Iluminación [U]
- Objetos 3D: luz principal desde arriba a la izquierda (≈ 45°), relleno suave y luz de borde blanca.
- Sombra de contacto suave: desplazamiento y = 2–4 % del alto del objeto, desenfoque de 30–60 px, opacidad del 25–45 %, color #000.
- Excepción: sombra dura larga en diagonal (45°, longitud del 50–80 % del objeto) para logos y objetos icónicos (manzanas del video 6).
- Resplandor solo en el color de acento: serif-it dorada con brillo de 12–20 px al 40 % (video 5); resplandor naranja exterior en tarjetas del Modo C (video 4, 30–60 px).

✅ Todo iluminado de forma coherente desde la misma dirección.
❌ Luces de colores en el Modo A, sombras duras en objetos pequeños, lens flares.

## §7 · Paleta (HEX) [U]
Base (todos los modos):
| Uso | HEX |
|---|---|
| Fondo claro | #F4F2FC / #FFFFFF / #EFEFEF |
| Fondo gris | #DEDEDE (centro) → #333132 (viñeta) |
| Fondo oscuro | #121212 / #080808 |
| Texto principal sobre claro | #111111 |
| Texto principal sobre oscuro | #FFFFFF |
| Palabra futura (claro / oscuro) | #9E9E9E / #5A5A5A |
| Pastilla oscura | #282828 |
| Bokeh y elementos grises | #CACAC7 |

Acentos (**1 por video**, elegir uno):
| Acento | HEX | Visto en |
|---|---|---|
| Dorado con resplandor | #F7E508 | Video 5 |
| Naranja | #F16322 / #D34F21 | Videos 5 y 4 |
| Rojo | #E10E28 / #D4001D / #BA0E16 | Videos 6, 4, 2 |
| Morado | #592668 → #3E2147 (degradado) | Video 8 |
| Azul | #67ABDE | Video 10 |
| Oro de objeto 3D | #8F7431 | Video 7 |
| Amarillo marcador (resaltado) | similar a #F7E508 | Video 1 |

Proporciones: el acento ocupa el 0,2–5 % de los píxeles (medido: entre 0,2 % y 4,5 % en el Modo A). La saturación media del fotograma debe quedar ≤ 0,17.

✅ Usar el acento solo en 1 palabra clave por frase o en 1 objeto.
❌ Dos acentos en la misma pantalla en el Modo A, o texto completo en color de acento.

## §8 · Composición [U]
| Elemento | Posición (lienzo 1080×1920) |
|---|---|
| Bloque de texto con objeto | Tercio superior: y = 15–28 % (centrado o alineado a la izquierda en x = 10–15 %) |
| Texto sin objeto | Centro: y = 45–55 % |
| Objeto principal | Centro: y = 40–65 % |
| Texto secundario o remate | y = 70–80 % |
| Objetos decorativos | Esquinas, cortados por el borde entre un 30 % y un 60 % |
| Etiqueta de metadato (año) | Borde derecho, vertical, caja de 1 px, 14–18 px (video 7) |
| Margen de seguridad | 8 % lateral; 12 % superior; 15 % inferior (interfaz de TikTok) |

✅ La palabra pequeña va pegada a la grande: interlineado del 0,8–0,9 entre ellas y alineadas por la izquierda o por el centro.
❌ Texto en el 15 % inferior, texto sobre caras o texto que toque el borde.

## §9 · Cámara [U]
| Movimiento | Valor | Modo |
|---|---|---|
| Push-in constante | Escala de 1,00 a 1,04 en cada composición de 2 s (≈ 2–3 %/s) | Todos |
| Paralaje | Capa delantera ×1,6 y trasera ×0,6 respecto al medio | A |
| Órbita de un objeto 3D | 10–25°/s en Y | A (video 7) |
| Inclinación 3D de la interfaz | Rotación en X de 10–20° | C (video 10) |
| Zoom-through | Escala ×3–6 en 0,3–0,75 s hasta llenar el cuadro | A, C |
| Ángulos | 90 % frontal; 10 % picado de 3/4 en objetos 3D (coches, teléfono) | — |

✅ La cámara nunca se detiene del todo.
❌ Paneos rápidos sin motivo, cámara en mano o temblor en el Modo A, contrapicados extremos.

## §10 · Movimiento de los objetos [U]
- Todo lo que entra lo hace desde fuera del cuadro o desde un desenfoque al 100 % (rack focus de 0,5 s, video 5).
- Desenfoque de movimiento obligatorio en los desplazamientos de más de 15 % del ancho por segundo.
- Estela de profundidad: los objetos cercanos llevan un desenfoque gaussiano del 20–40 %.

✅ Las trayectorias son diagonales o curvas.
❌ Movimiento lineal horizontal plano sin desenfoque.

## §11 · Efectos [U]
| Efecto | Parámetros | Modo / video |
|---|---|---|
| Desenfoque de entrada (texto) | 12–20 px → 0 en 0,125–0,25 s | U |
| Desenfoque de movimiento | Obturador 180°, 16 muestras | U |
| Desenfoque de profundidad | 20–40 % en las capas cercanas | A |
| Censura con desenfoque | Desenfoque gaussiano de 40 px sobre el objeto oculto | A (video 1) |
| Tachado animado | Línea de 3 px que se dibuja de izquierda a derecha en 0,2 s | A (video 1) |
| Resaltado tipo marcador | Rectángulo amarillo bajo la palabra, se dibuja de izquierda a derecha en 0,2 s | A (video 1) |
| Trazo o flecha dibujada | Grosor de 4–8 px, se dibuja en 0,3–0,5 s | A (videos 6, 7) |
| Glitch RGB | Desplazamiento rojo/cian de 6–12 px, 2–4 fotogramas | A, de forma puntual (video 7) |
| Barril / ojo de pez | 10–20 % | C (video 4) |
| Resplandor exterior | 30–60 px en el color de acento | C (video 4) |
| Mapa térmico o arcoíris | Sobre fotos de cerebro o personas | Solo en B |
| Estrobo | 2–4 fotogramas por imagen, 6–25 imágenes | Solo en B (videos 2, 3) |
| Grano | 2–6 % | U |

❌ Partículas de fuego, humo de colores, destellos de lente, luces de neón en el Modo A, efectos de "cámara lenta".

## §12 · Transiciones [U]
Frecuencia medida en el Modo A: entre el 70 % y el 90 % de los cambios son morphs o transformaciones sin corte.
| Transición | Duración | Uso |
|---|---|---|
| Morph / reemplazo dentro del mismo elemento | 0,3–0,5 s | Principal (A) |
| Barrido de color sólido con borde desenfocado (negro o blanco) | 0,25 s | Al cambiar de claro a oscuro (video 1) |
| Whip con desenfoque de movimiento horizontal | 0,12–0,15 s | Cambio de idea |
| Máscara circular (un círculo negro crece) | 0,3 s | A (video 1) |
| Zoom-through | 0,3–0,75 s | A, C |
| Zoom-blur | 0,25 s | A (video 8) |
| Fundido de blanco a imagen real | 0,4–0,5 s | Entrada a un plano fotográfico (video 7) |
| Corte seco | 0 s | Entre fotos reales; estrobo en B |
| Flash blanco + glitch de bloques | 0,1–0,25 s | Solo C (video 9) |

❌ Fundidos cruzados largos (> 0,6 s), wipes con formas de estrella o corazón, transiciones de plantilla 3D (cubo, página que pasa).

## §13 · Ritmo de edición [U]
| Parámetro | Modo A | Modo B | Modo C |
|---|---|---|---|
| Composición nueva cada | 1,8–2,5 s | 0,6–0,7 s | 1,7–2 s |
| Nuevo elemento en pantalla cada | 0,2–0,5 s | 0,07–0,5 s | 0,3–0,6 s |
| Palabras visibles a la vez | 1–6 (la frase se va acumulando) | 1 | 1–6 |
| Duración total | 18–39 s | 29–35 s | 24–60 s |

El gancho (0–3 s) siempre lleva palabra pequeña + palabra grande y un objeto 3D centrado (videos 1, 5, 6, 7).

✅ Sincronizar cada palabra con su sonido. El tiempo de cada palabra sale de la voz (ver 04).
❌ Planos estáticos de más de 0,6 s sin ningún cambio.

## §14 · Texto y subtítulos [U]
No hay subtítulos clásicos en ningún video: el texto en pantalla ES el subtítulo, y aparece palabra por palabra.

| Rol | Fuente (identificación visual → equivalente gratuito) | Tamaño | Color | Notas |
|---|---|---|---|---|
| Palabra pequeña (sans-ch) | Grotesca neutra tipo Helvetica Now / SF Pro → **Inter Display SemiBold/Bold** | 40–68 px | #111 / #FFF | Interletraje −1 % |
| Palabra clave (serif-it) | Serif cursiva condensada de alto contraste → **Instrument Serif Italic** (o Playfair Display Italic al 85 % de ancho) | 90–150 px (2,2–3,3× la pequeña) | #111 / #FFF / acento | Mayúsculas condensadas para el énfasis máximo (video 6: "VENDERLE", "ENFOCARSE", "QUÉ ELIMINAR"), interletraje −3 % |
| Número o palabra de impacto (sans-K) | Grotesca Black → **Inter Display Black** | 150–300 px | #111 / #FFF | "1997", "15", "3" |
| Ítem de lista | serif-it | 44 px | — | Precedido de un rombo blanco de 18 px o de un número en rombo |
| Palabra en pastilla | sans bold cursiva blanca sobre pastilla de color acento | 40 px | — | Radio = alto/2 (video 8) |
| Texto del Modo B | **Montserrat Bold** | 24–40 px (¡diminuto!) en y = 50 % | #111 sobre blanco / #FFF sobre foto | Las palabras clave van gigantes (150–600 px) con relleno de degradado o de video |
| Texto del Modo C | **Inter / SF Pro Medium** | 30–50 px | — | Sin serif |

Animación del texto: palabra por palabra, de desenfocada a nítida (0,125–0,25 s). La frase se acumula y luego desaparece entera con desenfoque en 0,15 s, o la reemplaza la siguiente composición.

✅ En cada bloque, una palabra pequeña + UNA grande. Máximo 6 palabras visibles.
❌ Subtítulos en la franja inferior, karaoke de colores, contornos gruesos (> 2 px) en el Modo A, emojis en el texto, rebotes o saltos en las palabras.

## §15 · Consistencia [U]
Lista de control de cada video:
1. Un solo modo base (A) y una sola variante de luz por bloque.
2. Un solo acento HEX en todo el video.
3. Las mismas 2 familias tipográficas (Inter Display + Instrument Serif Italic).
4. El mismo tratamiento de todos los objetos: recorte, B/N o material 3D, sombra suave con los mismos valores.
5. La misma dirección de luz (arriba a la izquierda).
6. El mismo grano (3 %) y la misma viñeta en toda la pieza.
7. Push-in constante en todas las composiciones.
8. Cada palabra sincronizada con su sonido en la voz (±1 fotograma).
9. Cierre que resuelve visualmente, con la frase final como "palabra pequeña + PALABRA GRANDE".

❌ Cambiar de fuente, de acento o de tratamiento de imagen a mitad del video.
