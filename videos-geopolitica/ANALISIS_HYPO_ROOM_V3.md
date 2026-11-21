# Análisis Hypo Room V3: plano por plano, primeros 60 s, y por qué v26 salió simple

**Fuente:** los 3 videos que el dueño subió a Dropbox (1280×720, 30 fps), revisados el 21 nov 2026:
- "What If Humans Never Invented Clothes?" (**ropa**)
- "What If You and Your Crush Got Stuck in a Sauna?" (**sauna**)
- "What If You Were the Only Man on an Island of 100 Amazons?" (**amazonas**)

**Comparación:** nuestro v26 "¿Qué pasaría si nunca se hubiera inventado el inodoro?" (**inodoro**).

## Método (todo reproducible)

| Medida | Cómo | Script |
|---|---|---|
| Fotogramas | 1 por segundo con la hora impresa (60 por video, 240 en total), revisados uno a uno en hojas 4×3 | ffmpeg `fps=1` |
| Cortes | Diferencia de fotogramas a 15 fps | `analisis/cuts.py` |
| Movimiento por plano | Zoom en %/s y paneo en px/s (escala 1280×720), entre el inicio y el fin del plano | `analisis/motion.py` |
| Colores por plano | 5 colores dominantes del fotograma central, en HEX | `shotcol.py` |
| Nitidez | Al inicio, al medio y al final de cada plano. Si la del inicio es menor que el 60 % de la del medio, el plano entra desenfocado | `shotcol.py` |
| SFX | Golpes de audio (flujo espectral) en ±150 ms de cada corte, más la subida de agudos tipo whoosh en los 0,4 s previos | `sfxcut.py` |

**Límites:**
- El zoom medido se satura en ±12 % por plano: un valor marcado "≥" puede ser mayor.
- Las fuentes tipográficas son **estimadas por parecido visual**. No tengo los archivos del canal.
- No veo intención de edición, solo píxeles y audio.

**Abreviaturas de plano:** PG = plano general, PM = plano medio, PD = plano detalle, FG = primer plano desenfocado (capa delante de la acción).

---

## 1. Resumen numérico (primeros 60 s)

| Métrica | ropa | sauna | amazonas | **inodoro (v26)** |
|---|---|---|---|---|
| Cortes por minuto | 21,4 | 39,4 | 42,9* | **24,0** |
| Plano mediano | 2,5 s | 1,6 s | 1,1 s* | **2,3 s** |
| Cambio en pantalla (diferencia media de luma por fotograma a 15 fps) | 4,31 | 5,85 | 4,88 | **2,42** |
| Zoom mediano / p90 (%/s) | 2,8 / 4,7 | 4,7 / 8,9 | 2,8 / 12,4 | **1,7 / 2,6** |
| Planos con paneo (más de 3 px/s) | 52 % | 89 % | 61 % | **0 %** |
| Paneo mediano | 17 px/s | 20 px/s | 28 px/s | **0** |
| Planos totalmente quietos | 5 % | 7 % | 21 % | **24 %** |
| Planos que entran desenfocados (blur de transición) | 29 % | 25 % | 7 % | **4 %** |
| Golpes de audio por segundo | 2,00 | 2,13 | 2,10 | **2,57** |
| Cortes con golpe en ±150 ms | 48 % | 32 % | 51 % | **42 %** |
| Capas visibles por plano (media de las tablas de la sección 2) | 7,6 | 8,4 | 8,0 (sin contar la multitud de aprox. 100) | **3,4** |
| Escenarios distintos en 60 s | 17 | 15 | 11 | **6** (cuarto, baño, calle ×4, cajones, fichas, bokeh) |
| Planos (sin contar transiciones) con una animación propia, aparte de la cámara | 19 de 21 (90 %) | 24 de 27 (89 %) | 19 de 24 (79 %) | **5 de 19 (26 %)** |

\* En amazonas, entre 9,6 s y 17,7 s el detector marcó 18 "cortes" que son parpadeo de película en el flashback de tormenta (relámpagos y flicker), no cortes reales. Sin ellos quedan 27 planos en 60 s.

**Lo que dicen estos números:**
- El **ritmo de corte NO es el problema**: ropa corta menos que nosotros (21,4 contra 24).
- El problema está **dentro de cada plano**:
  - Nuestro cambio en pantalla es la mitad (2,4 contra 4,3–5,9).
  - Tenemos 0 % de paneo contra 52–89 %.
  - Tenemos 3,4 capas contra 8.
  - Solo el 26 % de nuestros planos tiene algo que se mueve, contra el 79–90 %.

---

## 2. Tablas plano por plano

**Formato de cada fila:** t = inicio (s) · d = duración (s) · tipo · cámara (zoom %/s, paneo px/s, easing) · fondo y HEX · capas · texto · efectos · transición de entrada.

**Notas para leer las tablas:**
- **Easing:** "ease-out" significa que la escala avanza rápido y frena, según la curva medida en 3 puntos (por ejemplo 1,01 → 1,03 → 1,04).
- **SFX:** en la tabla, ● marca un corte con golpe de audio medido.

**Tipografía (estimada) común a los 3 videos:**

| Elemento | Fuente | Detalle |
|---|---|---|
| Subtítulos | Redondeada gruesa tipo Nunito Black | Blanca, alto aprox. 4,3 % del cuadro, base al 92,8 %, palabra actual en #FACA4F, sombra suave |
| Etiquetas | Tipo Montserrat ExtraBold, mayúsculas, espaciado +2 | Píldora #0E111F al 85 %, borde #E3C584 o de color temático |
| Títulos grandes | Tipo Luckiest Guy | Ejemplos: "BIG MISTAKE.", "DAY 30", "1 SAUNA : 2 PEOPLE" |
| Frases poéticas | Manuscrita tipo Caveat | Aparece palabra a palabra |

### 2.1 ropa ("What If Humans Never Invented Clothes?")

| # | t | d | Tipo | Cámara | Fondo · HEX | Capas | Texto en pantalla | Efectos y animación | Entrada |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0,00 | 1,87 | PG dormitorio | Zoom −2,7, paneo ← 17, lineal | Pared morada a rayas #4D3952, piso de madera #6C413E, ventana con ciudad al atardecer rosa | 14: pared, ventana con skyline, cortinas teal, plantas colgantes, estante con libros y globo, cama, edredón de cuadros multicolor, almohada, mesita, despertador, ondas de vibración, haz de luz de lámpara, alfombra arcoíris, personaje | — | El personaje se levanta de la cama (0→1 s), el despertador vibra con ondas, haz de luz, grano | Inicio |
| 2 | 1,87 | 0,40 | Transición | — | Mezcla #6A3D32 / #493448 | — | — | Barrido con desenfoque | ● |
| 3 | 2,27 | 2,93 | PM armario | Zoom +2,1, ease-out | Madera oscura #3F281C, #2C1911 | 7: fondo, 2 puertas abiertas, barra con perchas en zigzag, polilla volando, silueta del personaje en FG desenfocada, haz de luz cenital, píldora | "EMPTY" (píldora dorada, aparece en 4 s) | La polilla cruza el cuadro; entra desenfocado (nitidez 2,2 → 5,5) | Blur-in |
| 4 | 5,20 | 1,47 | PD cajón visto desde arriba | Zoom −4,1 | Madera #87583E, #A17957 | 6: cajón, 3 divisiones, bola de pelusa, etiqueta "SOCKS", HUD | HUD "SOCKS FOUND 0" (aparece en 6 s, arriba a la derecha) | La pelusa rueda | Corte |
| 5 | 6,67 | 3,87 | PD tablero de corcho | Zoom +2,1, paneo ← 12, ease-out | Corcho #CE9D58, papel #FBF9ED | 10: corcho, portapapeles con lista de 5, 3 notas con chinche (fuego, rueda, pizza), hilo rojo, ardilla, sello | "INVENTIONS / FIRE / THE WHEEL / WRITING / PIZZA / CLOTHES" y sello rojo "NEVER" | Las casillas se marcan una por una (7–8 s), X roja en CLOTHES, el sello cae (9 s), sale desenfocado (8,3 → 4,1) | Corte ● |
| 6 | 10,53 | 2,20 | PG calle | Zoom +5,5, paneo ↖ 29/7 | Cielo #ABC4C8 y #D9E1DE, fachadas de colores | 13: cielo con nubes, 6 edificios de colores, letreros "BOOKS" y "SUNSCREEN", 3 árboles, 12 personas, autobús amarillo, 2 coches, ciclista, poste en FG desenfocado | — | Coches, autobús y ciclista se desplazan; entra desenfocado (4,0 → 17,3) | Blur-in ● |
| 7 | 12,73 | 1,73 | PM con bokeh | Zoom +4,6, ease-out | Bokeh crema #CDE5C1 / #D8ECCC | 5: bokeh, personaje, taza de café, vapor, maletín | — | El vapor sube | Corte |
| 8 | 14,47 | 1,20 | PM con bokeh | Zoom +3,3 | Bokeh #E3D8C8 | 4: bokeh, personaje con toalla en la cabeza, periódico | "DAILY NEWS" (en el objeto) | El personaje sostiene el periódico | Corte |
| 9 | 15,67 | 4,07 | PM ardilla | Zoom +3,0, paneo → 12 | Bokeh frío #E1DFD6 | 6: bokeh, mesa, ardilla con bufanda a rayas, "?" flotantes, objeto que flota, píldora | "DRESS CODE: 1 SCARF" (píldora roja) | Aparecen "?" sobre la cola (17–19 s), la ardilla cambia de expresión | Corte |
| 10 | 19,73 | 4,27 | PG Tierra | Zoom ≥ +2,8, paneo ↖ 15/7 | Espacio #0E1630 / #040919 | 7: espacio, estrellas, Tierra con sombra, dial de rebobinado, aguja, rayas de velocidad horizontales, contador | "◀◀ REWIND" y "YEARS AGO 106,000 → 167,000 → 170,000" | El contador sube, la aguja gira, las rayas pasan | Corte |
| 11 | 24,00 | 4,33 | PG edad de hielo | Zoom −1,4 | Montañas #A5BACD, nieve #D8E7F0 | 10: cielo, cordillera nevada, llanura, 2 mamuts, 4 personajes (uno con piel), iglú con luz interior, nieve cayendo, HUD, píldora | HUD "YEARS AGO 170,000" (arriba a la derecha) y "FIRST CLOTHES" (aparece en 26 s) | Nieve, mamuts caminando | Blur-in |
| 12 | 28,33 | 2,53 | PD microscopio | Zoom ≥ +4,7 | Negro #030509, círculo #E8E2D6 | 5: fondo negro, círculo, pelos, piojo, globo de diálogo | "HEAD LOUSE" y "hi!" | El círculo crece (28 → 29 s), el piojo saluda | Corte ● |
| 13 | 30,87 | 5,60 | Infografía | Quieta | #030509, #E0D8C6 | 9: 2 círculos, 2 piojos, tela cuadriculada, línea "Y", 3 píldoras, cita | "HEAD LOUSE", "BODY LOUSE · LIVES IN CLOTHES", "SPLIT ABOUT 170,000 YEARS AGO" y la fuente "Toups et al., Molecular Biology and Evolution (2011)" | El segundo círculo aparece (31 s), la línea dorada dibuja la "Y" (33–34 s), el personaje entra por la derecha (36 s) | Corte |
| 14 | 36,47 | 0,27 | Transición | — | — | — | — | Desenfoque | ● |
| 15 | 36,73 | 2,13 | PG desde dentro de la cueva | Zoom −2,8, ease-out | Roca #553A39, nieve #E1E9EF | 7: arco de la cueva, pinturas rupestres (huellas, animal), exterior nevado, mamut, personaje, texto manuscrito | "the moment that never came" (manuscrita, palabra a palabra) | El texto se escribe | Corte |
| 16 | 38,87 | 3,67 | PM interior de la cueva | Zoom +2,2, ease-out | Naranja #9E633B y #5C3627 | 9: pared, hojas en FG desenfocadas (bokeh naranja), óvalo de la entrada, mamut, personaje con piel, hoguera, llamas, título | "THE HYPOTHETICAL ROOM / WHAT IF HUMANS NEVER INVENTED CLOTHES?" (aparece en 42 s) | Llamas, el personaje se cubre, el título entra con fade | Corte |
| 17 | 42,53 | 1,60 | Título | Zoom −3,1 | Pasillo #1C111B | 6: pasillo, alfombra roja, puertas, apliques de luz, letrero, título | "ROOM 1" | Fade | Corte ● |
| 18 | 44,13 | 0,27 | Transición | — | — | — | — | — | ● |
| 19 | 44,40 | 1,87 | PG pasillo de hotel | Zoom +6,4, paneo → 34 | #3A272E, alfombra #70433B | 9: pasillo, 6 puertas laterales, apliques, puerta central, letrero "ROOM 1 THE COLD", texto 3D, luz blanca, partículas | "THE COLD" (3D) | La puerta se abre (45 s) y sale nieve en partículas | Corte |
| 20 | 46,27 | 3,20 | PG bosque nevado, luego termómetro | Zoom +3,8, paneo ↖ 10/10 | Cielo #97B3CE y #BDD2E4 | 8, luego 5: pinos, nieve, mamut, personaje temblando con nieve en la cabeza, texto "BIG MISTAKE." / termómetro, línea punteada, píldora, texto | "BIG MISTAKE." (rotado), "BELOW ABOUT 27°C · 81°F", "a naked body starts burning extra energy" | El personaje tiembla; blur-through en 47 s hacia el termómetro | Corte |
| 21 | 49,47 | 4,13 | PM noche | Zoom +2,2, paneo ← 8 | Azul #131D38 / #182444 | 8: fondo, personaje, glow naranja en el pecho, 8 líneas de temblor, panel, batería, flecha, píldora | "ENERGY SPENT ON HEAT" y "JUST TO STAY WARM" | La batería pasa de verde a rojo (50–52 s), la flecha baja, las líneas vibran | Blur-in |
| 22 | 53,60 | 2,73 | PG Tierra | Zoom +2,6 | #0E1530 | 5: espacio, Tierra con franja de calor amarilla, 2 píldoras | "WARM ENOUGH" y "EARTH'S AVERAGE 15°C" | — | Corte |
| 23 | 56,33 | 3,13 | PG llanura nevada | Zoom +3,2, paneo ← 20 | #AAC1D7 / #D2DFEB | 6: cielo, nieve, personaje, vaho de la boca, panel con llama, flecha | "ENERGY SPENT ON HEAT" | El vaho sale; light leak rojo y blanco en diagonal (59 s) | Blur-in |

### 2.2 sauna ("What If You and Your Crush Got Stuck in a Sauna?")

| # | t | d | Tipo | Cámara | Fondo · HEX | Capas | Texto | Efectos y animación | Entrada |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0,00 | 2,07 | PM junto a la puerta | Zoom +5,8, paneo ↗ 8/8, ease-out | Madera roja #893E1F / #AC7F55 | 11: pared de listones, puerta con ventana (nieve afuera), manija, manómetro, reloj, piedras, cubo, valla de madera, personaje, toalla, gotas | Subtítulo (desde 1 s) | Gotas de sudor caen, luz roja | Inicio |
| 2 | 2,07 | 1,73 | PG interior | Zoom +5,8, paneo ← 37 / ↓ 18 | #7B4123 / #9B5B38 | 10: pared, letrero "SAUNA", reloj de arena, lámpara, ramas de abedul, banco, rejilla, 2 personajes, gota | Subtítulo | Paneo amplio | Corte ● |
| 3 | 3,80 | 1,07 | PM | Zoom +11,3, paneo → 15 | #804426 | 7: pared, reloj de arena, lámpara, ramas, personaje (gorro naranja, ropa amarilla), cara enojada | — | Empuje rápido | Corte |
| 4 | 4,87 | 2,00 | PM | Zoom +6,0, paneo ← 24 | #9D5A34 | 8: como el 3 más el personaje A entrando por la izquierda | — | La cara pasa de enojada a asco verde (6 s) | Corte |
| 5 | 6,87 | 2,00 | PM | Zoom +4,0, paneo ↘ 16/8 | #995531 | 8 | Píldora "NAMI" (7 s) | La expresión cambia | Corte |
| 6 | 8,87 | 2,53 | PM | Zoom +4,3, paneo ← 13 | #8A5231 | 8: pared, rejilla, letrero, reloj de arena, personaje A, toalla, gotas, píldora | "NAMI" | Gotas caen | Corte |
| 7 | 11,40 | 2,07 | PD puerta | Zoom +5,8, paneo ↗ 16/16 | #8D3415 / #B3683C | 6: puerta, junta, 2 manijas, 4 flechas, píldora | "SWOLLEN" (píldora roja #D33) | Las flechas amarillas laten; entra con desenfoque y sale desenfocada (13 s) | Blur-in |
| 8 | 13,47 | 1,60 | PG carretera de noche | Zoom +7,5, paneo ↖ 40/20 | Cielo #0D1B39, nieve #EEF3F8 | 8: cielo, luna, pinos nevados (FG izquierda), carretera, postes, coche rojo, nieve, huellas | — | El coche se aleja | Corte |
| 9 | 15,07 | 0,27 | Transición | — | — | — | — | Desenfoque | |
| 10 | 15,33 | 2,87 | PD termómetro | Zoom +4,2, ease-out | #A94F25 / #B36F42 | 6: pared, dial, aguja, número, cubo con cucharón en FG desenfocado, vapor | "91°C → 98°C" | La aguja sube y el número cambia | Corte |
| 11 | 18,20 | 1,60 | PM calentador | Zoom +3,8, paneo ↗ 20/10 | #472B24 / #64312A | 6: pared, 2 manómetros, calentador, display, ventana | "2:14:08 → 2:14:07" (display rojo) | La cuenta regresiva avanza | Corte |
| 12 | 19,80 | 1,47 | PD piedras | Zoom +8,2, paneo ↘ 11/22 | #813315 | 5: pared, calentador, piedras incandescentes, vapor, rejilla | — | El vapor sube | Corte |
| 13 | 21,27 | 1,73 | PG tundra con niebla | Zoom −5,2 | #CBD3D8 / #EDF3F8 | 6: niebla, montañas, pinos, 2 personajes abrigados, nieve | — | Los personajes caminan | Corte ● |
| 14 | 23,00 | 3,67 | PM sala | Zoom −2,7, paneo → 17 | #B3A99E / #9A6259 | 10: ventana con pinos nevados, estantería con libros, sofá, personaje B, personaje A en FG desenfocado (rojo), cortina roja, cojines | — | Expresión | Corte |
| 15 | 26,67 | 3,33 | PG cabaña de sauna de noche | Zoom ≥ +3,6, paneo ↘ 10/5 | #19284D, nieve #E8EFF9 | 9: cielo, luna, pinos, cabaña de troncos, techo nevado, chimenea con humo, leña, puerta iluminada, icono "◀◀" | "◀◀" (rebobinar, arriba a la derecha) | Humo, nieve | Corte |
| 16 | 30,00 | 0,27 | Transición | — | — | — | — | — | ● |
| 17 | 30,27 | 1,80 | PG casas rojas | Zoom −5,6, paneo ← 36 / ↓ 18 | #484779 / #D0DBEA | 9: cielo, pinos en FG, 2 casas con ventanas encendidas, coche, nieve, árbol | — | Desplazamiento | Corte |
| 18 | 32,33 | 0,93 | Mapa | Zoom +12,9, paneo ↓ 34 | #1A2858 / #1B3266 | 5: fondo con cuadrícula, contorno neón de Finlandia, 2 píldoras, texto | "LAPLAND", "FINLAND", "ARCTIC CIRCLE" | Empuje rápido y glow neón | Corte |
| 19 | 33,27 | 2,00 | PM porche | Zoom +5,0, paneo ← 32 / ↓ 16 | #344470 / #C5D3E3 | 12: puerta verde, valla, leña, 5 personajes abrigados, cabaña al fondo, lago, icono de termómetro | "-30°C OUTSIDE" | Expresiones, vaho | Corte |
| 20 | 35,27 | 2,33 | PM | Zoom +3,0, paneo ← 14 | #6A696D | 9 | "-30°C" | Max levanta los brazos | Corte |
| 21 | 37,60 | 2,60 | PG casa con lago | Zoom +3,5, paneo → 6 | #191C34 / #D4DEEC | 11: cielo, luna, casa roja, sauna, chimenea con humo, leña, muñeco de nieve, hueco en el hielo, escalera, HUD | HUD "🌡 -30°C" | Humo | Corte |
| 22 | 40,20 | 2,53 | PG pueblo | Zoom +4,7, ease-out | #D5DFEA / #374489 | 9: cielo, luna, 8 casas rojas, nieve, humo | — | Humo | Corte |
| 23 | 42,73 | 6,00 | Infografía | Zoom +2,0, paneo ↘ 8/5 | Degradado #262340 → #151B36 | 8, luego 9: mapa de puntos, contador, 2 píldoras, fuente / 3 iconos de casa con vapor, 6 personas, texto | "2,000,000+", "SAUNAS IN FINLAND", "more than two million", "1 SAUNA : 2 PEOPLE" y la fuente "Statistics Finland; Guinness World Records" | Los puntos se encienden; los grupos aparecen uno tras otro (45, 46 y 47 s) | Corte |
| 24 | 48,73 | 1,20 | PM | Zoom +10, paneo ← 53 | #DCE2E9 / #404C88 | 7: cielo, casa, personaje, móvil, píldora | "NO SIGNAL" (roja) | Brazo arriba con el móvil | Corte ● |
| 25 | 49,93 | 2,47 | PM | Zoom +3,7, paneo ← 20 | #D5DCE4 | 10: puerta, leña, 3 personajes, palas, cabaña, HUD | HUD "-30°C" | Palas | Corte |
| 26 | 52,40 | 1,67 | PM | Quieta | #303D6F | 7: casa, personaje B, leña, nieve, HUD | — | Blur-through (52 s) | Blur-in |
| 27 | 54,33 | 1,93 | PG pueblo al otro lado del lago | Zoom +6,2, paneo ← 25 | #D2DAE3 / #13203E | 7: cielo, lago helado, iglesia, casitas de colores, árboles, HUD | — | — | Corte |
| 28 | 56,60 | 1,27 | PG verano | Zoom −0,8 | #F4EDDC / #F5D5B3 | 14: puesto de helados con toldo rosa, letrero "JÄÄTELÖ · ICE CREAM", menú, Nami, reloj de calle, banderines, puerto, casas de colores, barcos, 4 personajes, flores | Menú "1 SCOOP 3€…" | Barcos y banderines | Blur-in |
| 29 | 57,87 | 2,13 | PM muelle | Quieta | #D4C09E / #6E8B9F | 9: cielo, banderines, reloj, mar, barcos, casas, muelle, personaje | — | El personaje mira | Corte |

### 2.3 amazonas ("What If You Were the Only Man on an Island of 100 Amazons?")

**Común a todo el video:** paleta de película antigua, rayas y polvo, viñeta fuerte.

| # | t | d | Tipo | Cámara | Fondo · HEX | Capas | Texto | Efectos y animación | Entrada |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0,00 | 1,20 | PD orilla | Quieta | Arena #97826B, agua #ACCFCA | 4: arena, mar, ola con espuma, zapatilla | — | La ola y la espuma avanzan | Inicio |
| 2 | 1,20 | 0,87 | PG playa al atardecer | Quieta | #CEA58B / #E4BFA8 | 5: cielo rosa, mar, línea de árboles, arena, personaje enterrado | Subtítulo | El personaje parpadea | Corte ● |
| 3 | 2,07 | 1,27 | PG | Zoom +4,7, paneo ↗ 25/13 | #C1A68F | 22: cielo, mar, arena, 18 guerreras con escudo y lanza, personaje | Subtítulo | Desplazamiento | Corte ● |
| 4 | 3,33 | 1,73 | PM | Zoom −5,8, paneo ↙ 28/18 | #917566 | 8: fondo desenfocado, 3 guerreras, 3 escudos, 3 lanzas | Subtítulo | Caras enojadas, blur-in | Blur-in |
| 5 | 5,07 | 1,67 | PD lanzas | Zoom +0,6 | #CBB3A4 / #F1D2B9 | 4: cielo, sol, mar, 7 puntas de lanza | — | Las lanzas suben a cuadro, destellos ✦ | Corte ● |
| 6 | 6,73 | 2,67 | PM | Zoom +2,6, ease-out | #9E7E6C | 9: fondo, guerreras desenfocadas, personaje, gota de sudor, 6 lanzas, destellos | — | Las lanzas entran apuntando | Corte |
| 7 | 9,40 | 0,27 | Transición | — | Flash sepia | — | — | Flash | ● |
| 8 | 9,67 | 8,06 | Flashback sepia (3 planos internos) | Saltos con zoom −17 y paneos de 80–120 px/s en los cortes del parpadeo | Sepia #1F1304 → #A57946 | 8–9: cielo de tormenta, lluvia, olas, velero, personaje, burbujas, baliza, botón, píldora | "LAST NIGHT" (píldora) | Flicker (18 saltos de luz), lluvia, el barco se inclina; planos: velero (9,7–12,4), PM personaje con baliza (13–14,8), PD baliza con botón rojo (15–17,7) | Flash ● |
| 9 | 17,73 | 0,27 | Transición | — | Flash blanco | — | — | — | ● |
| 10 | 18,00 | 1,07 | PG | Zoom −9,4, paneo ↑ 15 | #9A826F | 12: playa, reina (corona, capa roja, armadura), 6 guerreras, escudos, personaje, píldora | "QUEEN THALESTRIS" | — | Corte |
| 11 | 19,07 | 2,73 | PM | Quieta | #CEBDAA | 6: playa, mar, lanza clavada, reina señalando, personaje en FG | "QUEEN THALESTRIS" | La reina señala | Corte |
| 12 | 21,80 | 1,67 | PM | Quieta | #8A7B73 | 8: reina en FG grande, guerreras desenfocadas detrás | — | — | Corte ● |
| 13 | 23,47 | 2,47 | PG multitud | Zoom +4,5, paneo ← 20 | #967465 | Más de 100: aprox. 100 guerreras, palmeras, cielo, personaje | — | — | Corte |
| 14 | 25,93 | 4,00 | PM fila | Zoom −1,3, paneo ↘ 8/4 | #8F776A | 10: fondo, 6 guerreras, lanzas, escudos, HUD grande, HUD pequeño | "SPEARS RAISED 0/100" (28 s, centro arriba) y mini HUD "0/100" arriba a la derecha | El HUD aparece | Corte |
| 15 | 29,93 | 2,47 | PM | Zoom +0,8 | #9F8782 | 6: playa, personaje, burbuja de pensamiento con escena, HUD | HUD | La burbuja aparece; brazos arriba (31 s) | Corte |
| 16 | 32,40 | 2,40 | PM | Zoom −2,5, paneo ↑ 7 | #5C4948 | 8: guerrera en FG con lanza, otras desenfocadas, HUD | HUD | Expresión | Corte ● |
| 17 | 34,80 | 2,00 | PG | Zoom −5,0, paneo ↙ 32/16 | #8D7E78 | 9: mar, ondas, balsa, personaje, 6 guerreras, HUD | HUD | La balsa se aleja con ondas | Corte |
| 18 | 36,80 | 1,13 | PG selva | Zoom +10,6, paneo ↙ 57/28 | Arena #F2E4B8, verde #3E9844 | 6: helechos, palmeras, arena, roca con muescas, personaje, HUD | HUD | — | Corte ● |
| 19 | 37,93 | 3,00 | PD roca | Zoom −3,3, paneo ↘ 21/11 | #5A6A58 | 5: selva desenfocada, roca, 99 muescas, mano | — | La mano recorre las muescas | Corte |
| 20 | 40,93 | 4,27 | PM roca | Quieta | #97A58C / #EFE2BA | 6: selva, roca, muescas, hueco brillante, píldora, HUD | "99 NOTCHES · 1 EMPTY" | El hueco brilla | Corte |
| 21 | 45,20 | 1,73 | PM | Zoom +6,9, paneo ↙ 37/18 | Mar turquesa #7FBABF | 6: mar, palmeras, roca, personaje, HUD | — | — | Corte |
| 22 | 46,93 | 3,60 | PG playa | Zoom −2,2, paneo ↑ 9 | #74CFC9 / #E1D3AC | 5: mar, espuma, arena, huellas que se alejan, roca | — | La espuma | Corte |
| 23 | 50,80 | 4,27 | Tarjeta | Zoom +2,1, ease-out | Bokeh morado-naranja #462532 / #874D3A | 5: bokeh, tarjeta, icono de lanza, título, píldora | "DAY 30" y "THE VOTE" | Destello en el icono | Corte |
| 24 | 55,07 | 0,33 | Transición | — | Turquesa #1C9FB5 | — | — | Barrido de ola con espuma | ● |
| 25 | 55,40 | 2,33 | PG camino en la selva | Quieta | #2B412B / #3A6F3A | 9: árboles, helechos en FG, camino, 4 guerreras, personaje, tarjeta, confeti | "DAY 1" y "THE SHORE" | Confeti | Wipe |
| 26 | 57,73 | 1,13 | PM | Zoom +10,6, paneo ↘ 14/14 | #4F783B | 7 | — | Caminan | Corte |
| 27 | 58,87 | 1,13 | PM | Zoom +5,3, paneo ↖ 31/16 | #4E7441 | 5: selva, personaje con manos atadas con liana | — | — | Corte |

### 2.4 inodoro (nuestro v26, mismo método)

| # | t | d | Tipo | Cámara | Fondo · HEX | Capas | Texto | Animación | Entrada |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0,00 | 2,07 | PG cuarto | Zoom +2,9, sin paneo | Pared #6E4E60, piso #87636B | 6: pared, ventana con casas, repisa con libros, reloj, cama rectangular, Xeno | Subtítulo | Parpadeo de Xeno | Inicio |
| 2 | 2,07 | 3,07 | PG baño vacío | Quieta | Gris #BBC4C9 | 3: fondo, "?", hueco | Subtítulo | — | Corte |
| 3 | 5,13 | 1,27 | PP Xeno | Zoom +1,6 | Bokeh azul #5B688A | 2 | Subtítulo | — | Corte |
| 4 | 6,40 | 2,80 | PD hueco | Zoom −0,7 | Bokeh crema #BBA57E | 3: bokeh, hueco, 3 moscas | Subtítulo | Moscas | Corte |
| 5 | 9,20 | 2,33 | PG calle | Quieta | #F0CF9B | 4: cielo, 4 edificios, 5 personas, suelo | Subtítulo | — | Corte |
| 6 | 11,53 | 2,53 | PG calle (mismo decorado) | Zoom −2,4 | #E8BF8C | 5: + ventana con bacinilla | Subtítulo | La bacinilla gira | Corte |
| 7 | 14,07 | 2,47 | Calle (mismo decorado) | Zoom +2,4 | #E6BC89 | 5 | Subtítulo | — | Corte |
| 8 | 16,53 | 3,07 | PD bacterias | Zoom −2,6 | Negro #14110E, círculo #E0E5BF | 3: fondo, círculo, 7 bacterias | "VIBRIO CHOLERAE" | Las colas se mueven | Corte |
| 9 | 19,60 | 2,27 | PP Xeno | Quieta | Bokeh verde #76A28E | 2 | Subtítulo | — | Corte |
| 10 | 21,87 | 3,00 | PD rollo de papel | Zoom −1,0 | Bokeh rosa #C28280 | 2 | Subtítulo | — | Corte |
| 11 | 24,87 | 5,73 | PP Xeno pensativo (3 subplanos del mismo dibujo) | Zoom ±1–2 | Bokeh ámbar #A46E41 | 2 | Subtítulo | — | Corte |
| 12 | 30,87 | 3,13 | Título con cajones | Zoom +2,2 | #211819 / #94643F | 3 | "ARCHIVO ¿Y SI?…" | — | Flash |
| 13 | 34,27 | 1,60 | Tarjeta | Zoom −1,9 | #BE817F | 3 | "ESCENARIO 1 LA CALLE" | — | Flash |
| 14 | 35,87 | 4,87 | Calle ×2 (mismo decorado) | 0 / −2,4 | #F1D29F | 4 | Subtítulo | — | Corte |
| 15 | 40,73 | 6,20 | Cifra | Zoom −1,6 | Bokeh azul #5D6B8F | 3 | "130 g AL DÍA" → "50 kg AL AÑO" | Cambio de número | Corte |
| 16 | 46,93 | 3,33 | Multitud en la calle (mismo decorado) | +2,4 / 0 | #EECD9C | 5 | Subtítulo | — | Corte |
| 17 | 50,27 | 0,93 | PP Xeno | Zoom +2,1 | Bokeh verde | 2 | Subtítulo | — | Corte |
| 18 | 51,20 | 7,07 | Ficha sepia (3 subplanos de la misma imagen) | ±2,5 | #B59E79 | 4: marco, imagen fija de la calle, título, subtítulo | "EDIMBURGO · SIGLO XVIII" | — | Corte |
| 19 | 58,27 | 1,73 | PD taza | Quieta | Bokeh ámbar #9D693F | 3 | Subtítulo | Vapor | Corte |

---

## 3. La fórmula de Hypo Room (promedio de los 3 videos, primeros 60 s)

1. **Capas por plano:** 8,0 en promedio (ropa 7,6, sauna 8,4, amazonas 8,0).
   - Un plano general tiene de 9 a 22 capas; un plano detalle o infografía, de 4 a 9.
   - Nunca baja de 4.
2. **Algo cambia en pantalla cada 0,8–1,2 s**, además del corte:
   - Hay un corte cada 1,4–2,7 s.
   - Dentro de cada plano hay 1 o 2 eventos animados: contador, casilla, sello, puerta, batería, ola, vapor, gotas, coche, personaje que gesticula.
3. **Escenario nuevo cada 3,5–5,5 s:** 11 a 17 decorados distintos en 60 s. Un decorado se repite, como mucho, en 2–3 planos seguidos con otro encuadre.
4. **Cámara:**
   - Zoom mediano de 2,8–4,7 %/s, con picos de 9–13 %/s (empujes cortos de aprox. 1 s).
   - Paneo en el 52–89 % de los planos, de 17–28 px/s (en 1280; equivale a 25–42 px/s en 1920), casi siempre diagonal.
   - Easing ease-out: el 60 % de las curvas son crecientes y planas al final.
   - Solo el 5–21 % de los planos están quietos.
5. **Profundidad:**
   - Capa en FG desenfocada en el 30–40 % de los planos: poste, personaje, hojas, cubo, guerrera, pinos.
   - Fondo desenfocado en los planos medios.
6. **Transiciones:**
   - Corte seco en el 70 %.
   - Entrada desenfocada (blur-through) en el 7–29 %.
   - Además: flash blanco o sepia al entrar o salir de un flashback, barrido de ola con espuma, light leak diagonal rojo y blanco, puerta que se abre con luz.
7. **Texto:**
   - Subtítulo por frase.
   - Etiqueta en el mundo (píldora) cada 5–8 s: "EMPTY", "SWOLLEN", "NO SIGNAL", "QUEEN THALESTRIS"…
   - HUD contador temático fijo en la esquina: "SOCKS FOUND", "YEARS AGO", "-30°C", "SPEARS RAISED 0/100".
   - Cita de la fuente científica en letra mínima abajo, cuando hay un dato.
8. **Infografías animadas que se construyen:**
   - Lista con casillas y sello.
   - Contador que sube.
   - Línea que se dibuja.
   - Batería que se vacía.
   - Mapa de puntos que se enciende.
   - Iconos que aparecen en grupos.
9. **Paleta por escena, muy distinta entre escenas:**

| Escena | HEX |
|---|---|
| Dormitorio morado | #4D3952 |
| Noche | #0E1630 / #131D38 |
| Hielo | #A5BACD |
| Microscopio negro | #030509 |
| Madera de sauna | #893E1F |
| Flashback sepia | #1F1304 → #A57946 |
| Selva | #2B412B |
| Turquesa | #74CFC9 |

   - El tono general es cálido o frío según la escena, no siempre beige.
   - Saturación media: 39–43 %.
10. **El personaje actúa dentro del decorado** en más del 70 % de los planos: se levanta, sostiene un café, lee, tiembla, señala, levanta los brazos, vende helados.

---

## 4. Diferencias concretas: qué hice, qué hace la referencia y cómo lo corrijo

| # | Qué hice en v26 | Qué hace Hypo Room | Corrección para v27 |
|---|---|---|---|
| 1 | 3,4 capas por plano | 8,0 | Mínimo 6 capas por plano. Los planos generales con 10 o más objetos y la infografía con 5 o más |
| 2 | 6 decorados en 60 s; la misma calle en 5 de 19 planos (0:09–0:16, 0:36–0:40, 0:47–0:50) | 11–17 decorados distintos | Un decorado distinto por idea: unos 14 en el primer minuto. Repetir uno solo en planos seguidos con otro encuadre |
| 3 | 26 % de los planos con animación propia | 79–90 % | Cada plano con al menos 1 evento animado ligado a la frase |
| 4 | Paneo 0 % | 52–89 %, mediana de 17–28 px/s, diagonal | Paneo en el 70 % de los planos, 25–45 px/s en 1920, dirección alternada |
| 5 | Zoom mediano 1,7 %/s, p90 2,6 | 2,8–4,7 %/s, p90 4,7–12,4 | Zoom de 3–5 %/s con ease-out y un empuje rápido de 10–12 %/s cada 4–5 planos |
| 6 | 24 % de planos quietos | 5–21 % | Quietos solo en tarjetas o en una infografía de 4 s o más (unos 12 %) |
| 7 | 4 % de planos entran desenfocados | 7–29 % | Blur-through (desenfoque de 18 px a 0 en 8 fotogramas) en el 20 % de los cortes |
| 8 | Sin capa FG desenfocada | 30–40 % | FG desenfocado (blur de 10 px, oscuro) en el 35 % de los planos: poste, bacinilla, gente, cortina |
| 9 | 7 planos de "PP Xeno sobre bokeh" solo, sin acción (37 % del tiempo de los primeros 60 s) | El bokeh solo aparece 3 veces (ropa 7–9) y siempre con el personaje haciendo algo (café, periódico) | Máximo 1 primer plano en bokeh cada 20 s, y siempre con objeto y acción |
| 10 | Datos como cifra grande sobre bokeh (130 g, 50 kg), estática, 6,2 s | Infografía que se construye con iconos, contador animado y fuente citada | "130 g" con báscula y aguja que sube; "50 kg" con 50 bolsas que se apilan en tandas; fuente en letra mínima |
| 11 | Ficha sepia = foto fija de la calle dentro de un marco, 7 s | Flashback sepia animado a pantalla completa con flicker, lluvia y acción, píldora "LAST NIGHT" | Edimburgo como flashback animado: bacinilla que se vacía, gente que se cubre, píldora "EDIMBURGO · 1750"; flicker y rayas |
| 12 | HUD "OLORÓMETRO" casi ilegible (aprox. 1 % del alto) | HUD de aprox. 3,5 % del alto, número grande | HUD de 64 px de alto con número grande. Contador temático: "DÍAS SIN INODORO" y "MUERTES HOY" en la parte del cólera |
| 13 | Píldoras en el mundo: 1 en 60 s ("VIBRIO CHOLERAE") | 4–6 por minuto | Una píldora por plano informativo, de 5 a 7 por minuto |
| 14 | Paleta beige y café casi todo el minuto | 6–8 paletas distintas por minuto | Paleta por escena: amanecer frío, calle sucia ámbar, noche azul #131D38 para el cólera, sepia para historia, verde enfermizo para el agua |
| 15 | Xeno quieto de pie en la calle | El personaje actúa en más del 70 % | Xeno se tapa la nariz, esquiva la bacinilla, salta un charco, mira el mapa |
| 16 | Transición con flash blanco en cada escenario | Flash solo para flashbacks; puerta, ola o light leak para los cambios de capítulo | Puerta de baño que se abre con luz como cambio de escenario (equivale a la puerta "ROOM 1"); light leak al salir de una tarjeta |
| 17 | Cortes y SFX | Igual que nosotros: 2,0–2,1 golpes por segundo y 32–51 % de cortes con golpe | **Sin cambio** (aquí estamos bien: 2,57 por segundo y 42 %) |
| 18 | Ritmo de cortes de 24 por minuto | 21–43 por minuto | **Sin cambio necesario**: el corte no es la diferencia |

---

## 5. Por qué v26 salió simple

1. **Optimicé la métrica equivocada.** En V2 medí cortes por minuto y duración de plano, y los igualé.
   - Pero ropa corta menos que nosotros (21,4 contra 24) y se ve mucho más rica.
   - La riqueza está **dentro** del plano: capas, animación y paneo. Eso no lo medí antes de producir.
2. **Gramática de plantillas reutilizables.** Hice 11 lugares y 17 objetos para 82 planos, o sea unos 7 usos por pieza.
   - Por eso la calle sale 5 veces en un minuto.
   - Hypo Room dibuja un decorado nuevo para casi cada idea.
3. **Los subplanos eran el mismo dibujo con otro zoom.** Dividir una frase en 3 "planos" del mismo PP de Xeno sube los cortes por minuto, pero no cambia lo que se ve: el cambio en pantalla queda en 2,4 contra 4,3–5,9.
4. **Cámara solo con zoom centrado.** Todo el movimiento era escala: 0 % de paneo y 0 % de profundidad. En la referencia, el paneo diagonal y la capa FG desenfocada dan la sensación de cámara real.
5. **Nada se mueve dentro del plano.** En 14 de 19 planos lo único que se mueve es la cámara. En la referencia, cada frase trae su evento: el sello cae, la batería se vacía, el contador sube.
6. **El dato era texto, no imagen.** "130 g" en grande sobre bokeh. La referencia convierte cada dato en una escena con objetos: batería, mapa de puntos, iconos de personas.

---

## 6. Especificación para rehacer el video (v27, misma narración de v26)

**Mínimos por plano** (lo verifica `check27.py` sobre el JSON de planos antes del render):
- Capas de 6 o más (las tarjetas, 5 o más).
- 1 o más eventos animados con tiempo ligado a la palabra.
- Paneo en el 70 % de los planos ±10 %.
- Zoom mediano de 3–5 %/s.
- FG desenfocado en el 35 % de los planos.
- Blur-in en el 20 % de los cortes.
- Píldora en los planos con dato.
- Decorado distinto cuando cambia la idea.

**Aceptación (paso 7):** hojas de fotogramas lado a lado (referencia | v27) cada 2 s, y repetir todas las medidas de la sección 1.

| Métrica | Meta |
|---|---|
| Cambio en pantalla | 4,0 o más |
| Planos con paneo | 50 % o más |
| Zoom mediano | 2,8 %/s o más |
| Capas medias | 7 o más |
| Planos con animación | 80 % o más |
| Decorados distintos por minuto | 11 o más |
