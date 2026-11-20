# Ingeniería inversa de Hypo Room, versión 2 (con los videos reales)

Fecha: 20 nov 2026.

**Cómo se hizo:**
- **Material:** 3 videos completos de Hypo Room que el dueño pasó por Dropbox, a 1280x720 y 30 fps.
- **Fotogramas:** saqué un fotograma por cada plano del primer minuto y uno cada 10 s del resto. Los miré todos.
- **Medidas con scripts propios** (están en el scratchpad de la sesión):
  - Cortes: diferencia entre fotogramas a 15 fps.
  - Movimiento de cámara: búsqueda de zoom y desplazamiento entre el inicio y el final de cada plano.
  - Color: percentiles de luma, saturación, temperatura (R−B), viñeta y grano.
  - Sincronía de los cortes con la voz: palabras con tiempo usando faster-whisper.
  - Audio: nivel de la música respecto a la voz y golpes por minuto.

**Lo que no se pudo medir:**
- La fuente exacta: solo se compara contra fuentes parecidas.
- El género de la música y el tipo exacto de cada efecto de sonido.
- Las curvas de animación de los personajes.

Todo eso va marcado como **estimado**.

## PASO 1: selección

Promedio del canal: 270.165 vistas (17 videos, NexLev, 19 nov). Analizados:

| Video | Link | Vistas | Duración | × promedio | Archivo |
|---|---|---|---|---|---|
| What If Humans Never Invented Clothes? | youtube.com/watch?v=KOHG4Ik5Hdk | 1.400.000 | 10:05 | 5,2× | ✅ |
| What If You Were the Only Man on an Island of 100 Amazons? | youtube.com/watch?v=UtXsABU4Cek | 847.000 | 12:15 | 3,1× | ✅ |
| What If You and Your Crush Got Stuck in a Sauna? | youtube.com/watch?v=-ohrNzE3upg | 740.000 | 21:13 | 2,7× | ✅ |

## Números clave medidos

| Medida | Ropa | Amazonas | Sauna | **Nuestro v25** | **Nuestro v24** |
|---|---|---|---|---|---|
| Cortes por minuto (detector) | 27,2 | 34,2* | 30,1 | 16,9 | 2,7 |
| Plano mediano (s) | 2,0 | 1,6* | 1,9 | 3,5 | 13,0 |
| Plano p90 (s) | 4,1 | 3,2 | 3,3 | 6,5 | 47 |
| Planos reales en el primer minuto (contados a ojo) | 25 | ~30 | 30 | 21, pero solo 7 decorados | 2 |
| Cambio en pantalla por segundo (diferencia media de píxeles) | **5,4** | **4,6** | **5,0** | 1,6 | 1,8 |
| Temperatura R−B | **+10** | **+18** | **+30** | **−25 (frío)** | +15 |
| Saturación media | 38% | 47% | 51% | 42% | 13% |
| Luma p2 / p50 / p98 | 12 / 135 / 243 | 13 / 116 / 234 | 18 / 93 / 241 | 16 / 107 / 246 | 38 / 197 / 210 |
| Viñeta (esquinas ÷ centro) | 0,68 | 0,60 | 0,59 | 0,54 | 1,17 (sin viñeta) |
| Grano (residuo de alta frecuencia) | 4,7 | 5,5 | 6,0 | 6,7 | 4,5 |
| Música en las pausas, por debajo de la voz | **−17 dB** | **−20 dB** | **−18 dB** | −12 dB (muy alta) | — |
| Palabras por minuto | 149 | 142 | 179 | ~148 | — |
| Cortes que caen en el inicio de una frase (±250 ms) | 38% (azar 12%) | 16% (azar 11%) | 38% (azar 11%) | — | — |
| Zoom dentro del plano (mediana) | 2,5 %/s | 0,6 %/s | 4,7 %/s | 0,9 %/s | 1,0 %/s |
| Dirección del zoom (planos fiables) | 45% acerca / 45% aleja | 40% acerca / 60% estático | 67% acerca / 33% aleja | 65% acerca / 0% aleja | — |

\*En Amazonas, la tormenta del barco tiene sacudidas de cámara y destellos que el detector cuenta como cortes. Contados a ojo, el primer minuto tiene ~30 planos reales.

Dos medidas que se ven a simple vista:
- **Nuestra cámara cambia 3 veces menos** por segundo que la de ellos (1,6 contra unos 5).
- **Nosotros somos fríos (R−B −25) y ellos cálidos (+10 a +30).**

## PASO 2: desglose plano por plano

Abreviaturas de plano: PG = plano general, PM = plano medio, PP = primer plano, PD = plano de detalle, INF = infografía.

El ángulo de cámara es **siempre normal** (frontal, a la altura de los ojos) salvo donde se indica. En los 85 planos del primer minuto no vi ni picado ni contrapicado marcado.

### Video 1: "Never Invented Clothes", 0:00–1:00

Este video no tiene subtítulos quemados. Usa etiquetas pequeñas y textos manuscritos.

| Tiempo | Dur. | Plano | Composición | Movimiento (medido) | Fondo | Luz | Texto | Efectos | Transición | Sonido |
|---|---|---|---|---|---|---|---|---|---|---|
| 0:00 | 1,9 s | PG del cuarto | Cama en el tercio izquierdo, ventana al centro | Aleja −2,7 %/s y paneo a la izq. 17 px/s | Ilustración: pared morada #4B3A6E, ventana con atardecer rosa→naranja y ciudad, estante con libros, despertador | Cálida desde la ventana, haz suave | — | Grano y viñeta 0,68 | Corte seco | Alarma (estimado) |
| 0:01.9 | 0,3 s | PG, el mismo cuarto | Personaje sentado en la cama | — | Igual | Igual | — | — | Corte seco | — |
| 0:02.1 | 3,1 s | PM del clóset vacío | Simétrico, centrado | Aleja −3,2 %/s | Madera café #6B4630, clóset abierto con haz de luz cenital | Haz de arriba, fondo oscuro | Etiqueta "EMPTY": píldora con borde dorado, ~2% de la altura | Polvo en el haz | Corte seco | Golpe al abrir (estimado) |
| 0:05.3 | 1,5 s | PD del cajón de medias | Centrado y cenital | Aleja −3,4 %/s, lineal | Cajón de madera con una sola pelusa | Suave | Contador arriba a la der. "SOCKS FOUND 0" (píldora oscura) | — | Corte seco | — |
| 0:06.7 | 3,8 s | PD de un tablero de corcho | Lista en el tercio izquierdo, notas a la derecha | Acerca +2,1 %/s, sale lento al final | Corcho #B88A4E, lista "INVENTIONS" con casillas, notas con cuerda roja | Cálida | Lista manuscrita, sello rojo "NEVER" | Ardilla con bufanda (gag) | Corte seco | Sello (estimado) |
| 0:10.5 | 2,2 s | PG de la calle | Simetría horizontal, multitud de 15 personajes | Acerca +5,5 %/s | Edificios pastel, árboles, bus amarillo, bici | Día, plana | Letreros de tiendas | Personajes caminando | Corte seco | Ambiente de calle (estimado) |
| 0:12.7 | 1,8 s | PM del personaje con audífonos | Centrado | Acerca +5 %/s, sale lento | **Bokeh verde** #A9D18E, todo desenfocado | Suave y difusa | — | Círculos de bokeh | Corte seco | — |
| 0:14.5 | 1,2 s | PM del personaje con periódico | Centrado | Aleja −2,5 %/s | Bokeh crema #EDE6D6 | Difusa | "DAILY NEWS" en el periódico | — | Corte seco | — |
| 0:15.7 | 4,0 s | PM de la ardilla en una baranda | Ardilla en el tercio izquierdo | Acerca +1,3 %/s | Bokeh claro | Difusa | Píldora roja "DRESS CODE: 1 SCARF" | Corazones | Corte seco | — |
| 0:19.7 | 0,3 s | Mano que gira el globo terráqueo | — | Movimiento rápido | Globo | — | — | Desenfoque de movimiento | **Transición de giro** | Swoosh (estimado) |
| 0:20.0 | 4,0 s | INF de la Tierra con reloj de "REWIND" | Centrado | Aleja −2,5 %/s | Espacio azul marino #0F1730 con estrellas | Halo azul | "◀◀ REWIND" arriba a la izq. y contador "YEARS AGO 149,000" | Agujas del reloj girando | Corte seco | Rebobinado (estimado) |
| 0:24.0 | 4,3 s | PG de la Edad de Hielo | Mamuts a la izq., cueva a la der. | Aleja −1,4 %/s | Nieve azul claro #C8D7D5 y montañas | Fría y difusa | Contador "YEARS AGO 170,000" arriba a la der. | Nieve | Corte seco | Viento (estimado) |
| 0:28.3 | 2,6 s | PD de un piojo al microscopio | Lente circular centrada | Acerca (estimado) | Negro alrededor | Luz de microscopio | Etiqueta "HEAD LOUSE" | — | Corte seco | — |
| 0:30.9 | 5,5 s | PD de dos lentes y una "Y" | Simétrico | **Estático** | Negro | — | "HEAD LOUSE" / "BODY LOUSE – LIVES IN CLOTHES" y cita de la fuente en letra mínima abajo | — | Corte seco | — |
| 0:36.5 | 0,3 s | Fundido entre los piojos y la cueva | — | — | — | — | "170,000 YEARS AGO" | Doble exposición | **Fundido cruzado** | — |
| 0:36.7 | 2,2 s | PG de la entrada de la cueva | Arco centrado, mamut y personaje | Aleja −2,7 %/s, sale lento | Cueva café #834B3D con huellas de manos pintadas | Contraluz blanco desde afuera | Manuscrito arriba: "the moment that never c…" | — | Corte seco | — |
| 0:38.9 | 3,7 s | PM del personaje y la piel | Personaje centrado, mamut en un óvalo | Acerca +2,2 %/s | Cueva cálida desenfocada con hojas | Fuego cálido | — | Bokeh cálido | Corte seco | — |
| 0:42.6 | 1,5 s | PG del pasillo de puertas, título | Punto de fuga central | Acerca (estimado) | Pasillo con alfombra roja y puertas de madera | Lámparas cálidas | "THE HYPOTHETICAL ROOM" y título grande blanco con contorno | — | Corte seco | Ambiente (estimado) |
| 0:44.4 | 1,9 s | PG del pasillo, puerta "ROOM 1" | Puerta centrada | Acerca rápido +6 %/s | Igual | Luz blanca que sale de la puerta | "THE COLD" grande en blanco | Partículas | **La puerta se abre (transición)** | Puerta (estimado) |
| 0:46.3 | 3,2 s | INF del termómetro | Termómetro en el tercio izquierdo | Acerca +1,3 %/s | Nieve celeste #C8D7D5 | Difusa | Píldora "BELOW ABOUT 27°C · 81°F" | Nieve | Corte seco | — |
| 0:49.5 | 4,1 s | INF del personaje y la batería | Personaje a la izq., batería a la der. | Acerca +2,5 %/s | Azul marino | Halo cálido en el pecho | "ENERGY SPENT ON HEAT" y batería que baja | Ondas de calor | Corte seco | — |
| 0:53.6 | 2,8 s | INF de la Tierra con la franja tropical | Centrado | Acerca +2,5 %/s | Espacio | Halo | "WARM ENOUGH" y "EARTH'S AVERAGE 15°C" | — | Corte seco | — |
| 0:56.4 | 3,1 s | PM del personaje temblando | Centrado | Acerca +3,9 %/s | Nieve | Fría | — | Vaho de la respiración | Corte seco | Viento (estimado) |
| 0:59.5 | 1,9 s | PD de fibras musculares | Diagonal | Aleja −2,6 %/s | Rojo #C85A4E | — | "TWITCH" en píldora | Chispas amarillas | Corte seco | — |

### Video 2: "Island of 100 Amazons", 0:00–1:00 (planos reales, agrupados a ojo)

Tiene subtítulos: blancos, bold redondeados, con la palabra que suena en ámbar.

| Tiempo | Dur. | Plano | Composición | Movimiento | Fondo | Luz | Texto en pantalla | Efectos | Transición |
|---|---|---|---|---|---|---|---|---|---|
| 0:00 | 1,2 s | PD de un zapato en la orilla | Zapato en el tercio izquierdo | Estático con olas animadas | Arena #E7C598, mar turquesa | Atardecer | — | Espuma | Corte seco |
| 0:01.2 | 0,9 s | PM del protagonista (sudando) | Centrado | Estático (estimado) | Playa desenfocada, cielo rosa→lavanda | Contraluz cálido | Subtítulo | Gota de sudor | Corte seco |
| 0:02.1 | 1,3 s | PG de 16 guerreras en semicírculo | Simétrico | Acerca (estimado) | Playa | Atardecer | Subtítulo | — | Corte seco |
| 0:03.4 | 1,7 s | PM de 3 guerreras | Tercios | Estático | Desenfocado | Cálida | Subtítulo con "warriors" resaltada | — | Corte seco |
| 0:05.1 | 1,6 s | PD de 5 lanzas | Fila horizontal | Estático | Cielo y sol con **destello** | Sol en contraluz y glow | Subtítulo | Brillo en una punta | Corte seco |
| 0:06.7 | 2,7 s | PM del protagonista rodeado de lanzas | Centrado, lanzas en diagonal hacia él | Acerca (estimado) | Guerreras desenfocadas | Cálida | Subtítulo | Destellos de las puntas | Corte seco |
| 0:09.4 | 0,3 s | Flash blanco | — | — | — | — | — | Destello | **Flash blanco** |
| 0:09.7 | 3,7 s | PG del barco en la tormenta (flashback) | Barco inclinado al centro | **Sacudida de cámara** y luego acerca | Todo en **sepia ámbar** #6B4A2E, lluvia, olas | Relámpagos | Píldora "LAST NIGHT" arriba al centro | **Rayas verticales de película vieja**, lluvia, grano fuerte | Corte seco |
| 0:13.4 | 1,3 s | PM del protagonista y la baliza | Tercios | Sacudida | Sepia | — | Subtítulo | Lluvia | Corte seco |
| 0:14.7 | 3,0 s | PD de la mano presionando la baliza | Centrado | Acerca y pulsos de luz | Sepia oscuro | **Glow naranja que late** | Subtítulo | Bloom | Corte seco |
| 0:17.7 | 0,3 s | Flash blanco y fundido | — | — | — | — | Etiqueta del personaje | — | **Fundido desde blanco** |
| 0:18.0 | 1,1 s | PG de la reina y la tribu | Reina al centro | Estático | Playa | Cálida | Píldora con el nombre "QUEEN THALESTRIS" encima del subtítulo | — | Corte seco |
| 0:19.1 | 2,7 s | PM de la reina, la lanza y el protagonista | Tercios | Estático | Desenfocado | Cálida | "QUEEN THALESTRIS" y subtítulo | — | Corte seco |
| 0:21.8 | 1,7 s | PP de la reina | Tercio izquierdo | Acerca (estimado) | Guerreras desenfocadas | Cálida | Subtítulo | — | Corte seco |
| 0:23.5 | 2,4 s | PG de ~40 guerreras | Masa simétrica | Estático | Playa al atardecer | Cálida | Subtítulo | — | Corte seco |
| 0:25.9 | 4,0 s | PM de 6 guerreras votando | Fila | Estático | Desenfocado | Cálida | **Panel arriba al centro "SPEARS RAISED 0/100"** (azul marino translúcido con borde dorado) | Lanzas que suben | Corte seco |
| 0:29.9 | 2,5 s | PM del protagonista con los brazos arriba | Centrado | Estático | Desenfocado | Cálida | **Contador fijo arriba a la der. "0/100"**, desde aquí hasta el final | — | Corte seco |
| 0:32.4 | 2,5 s | PP de una guerrera señalando | Tercios | Estático | Desenfocado | Cálida | Panel "0/100" | — | Corte seco |
| 0:34.9 | 2,0 s | PG del mar con el protagonista en una balsa | Punto central pequeño | Aleja (estimado) | Mar | Día | Subtítulo | Anillos de agua | Corte seco |
| 0:36.9 | 1,1 s | PG de la roca con marcas | Personaje a la izq., roca a la der. | Estático | Selva y arena | Día | Subtítulo | — | Corte seco |
| 0:38.0 | 2,9 s | PD de la roca con 99 marcas | Llena el cuadro | Acerca | Selva | Día | Subtítulo | Una mano señala | Corte seco |
| 0:40.9 | 4,3 s | PD de la roca | Igual | Acerca lento | Igual | Día | Píldora "99 NOTCHES · 1 EMPTY" | Brillo en la marca vacía | Corte seco |
| 0:45.2 | 1,8 s | PM del protagonista junto a la roca | Tercios | Estático | Mar turquesa | Día | Subtítulo | — | Corte seco |
| 0:47.0 | 3,6 s | PD de huellas que llegan al mar | Diagonal | Aleja (estimado) | Arena y mar | Día | Subtítulo | — | Corte seco |
| 0:50.6 | 4,5 s | **Tarjeta de capítulo "DAY 30 / THE VOTE"** | Centrado | Acerca lento | Bokeh morado→ámbar | Glow | Tarjeta oscura con borde dorado, "DAY 30" grande y píldora amarilla "THE VOTE" | Bokeh | Corte seco |
| 0:55.1 | 0,4 s | Barrido de agua | — | Barrido lateral | Agua turquesa | — | — | — | **Barrido de agua** |
| 0:55.5 | 2,2 s | PG de la selva, "DAY 1 THE SHORE" | Camino con punto de fuga | Acerca | Selva verde #3E8E5A, helechos | Haces entre los árboles | "DAY 1" grande en blanco y píldora amarilla "THE SHORE" | Hojas cayendo | Corte seco |
| 0:57.7 | 1,2 s | PM de 3 personajes en la selva | Tercios | Estático | Helechos adelante, desenfocados | Haces de luz | Subtítulo | **Primer plano de helechos desenfocados** | Corte seco |
| 0:58.9 | 2,1 s | PP del protagonista atado | Centrado | Acerca (estimado) | Selva desenfocada | Haz | Subtítulo con "vine" resaltada | — | Corte seco |

### Video 3: "Stuck in a Sauna", 0:00–1:00

| Tiempo | Dur. | Plano | Composición | Movimiento | Fondo | Luz | Texto en pantalla | Efectos | Transición |
|---|---|---|---|---|---|---|---|---|---|
| 0:00 | 2,1 s | PM del protagonista sudando | Centrado, puerta a la izq. | Acerca +4,7 %/s (estimado) | Sauna de madera #A96940, termómetro y ventana | Cálida, naranja | Subtítulo con "crush" resaltada | Gotas de sudor y vapor | Corte seco |
| 0:02.1 | 1,8 s | PG de los dos personajes | Uno a cada lado | Acerca | Sauna, reloj de arena, cubeta | Cálida | Subtítulo | — | Corte seco |
| 0:03.9 | 1,0 s | PP de ella enojada | Tercio derecho | Acerca | Sauna | Cálida | "problem." | — | Corte seco |
| 0:04.9 | 2,0 s | PP de ella | Igual | Acerca | Igual | Cálida | Subtítulo | — | Corte seco |
| 0:06.9 | 2,0 s | PM de ella con su nombre | Tercio derecho | Acerca | Igual | Cálida | Píldora con el nombre "NAMI" y subtítulo | — | Corte seco |
| 0:08.9 | 2,5 s | PP de él | Centrado | Acerca | Igual | Cálida | "NAMI" y subtítulo | — | Corte seco |
| 0:11.4 | 2,1 s | PD de la manija de la puerta | Diagonal | Estático | Madera | Cálida | Píldora roja "SWOLLEN" y flechas amarillas | Vapor | Corte seco |
| 0:13.5 | 1,6 s | PG del carro que se va por la nieve | Punto de fuga | Acerca | Nieve de noche, luna y pinos | Fría con luna | Subtítulo | Nieve | Corte seco |
| 0:15.1 | 3,1 s | PD del termómetro "98°C" | Centrado | Acerca | Madera | Cálida | El número del termómetro | — | Corte seco |
| 0:18.2 | 1,7 s | PD del panel "HEATER 2:14:08" | Centrado | Acerca | Madera | Glow rojo | Temporizador rojo | — | Corte seco |
| 0:19.9 | 1,4 s | PD de las piedras calientes | Centrado | Acerca | Madera | **Glow naranja** | Subtítulo | Vapor | Corte seco |
| 0:21.3 | 1,8 s | PG de los dos en la nieve | Centrado | Estático | Nieve | Fría | Subtítulo | — | Corte seco |
| 0:23.1 | 3,6 s | PM en interior con primer plano desenfocado | Personaje a la der., otro desenfocado adelante a la izq. | Acerca | Sala con estantes y ventana con nieve | Cálida | Subtítulo | **Primer plano desenfocado** | Corte seco |
| 0:26.7 | 0,3 s | Fundido a la cabaña | — | — | — | — | — | Doble exposición | **Fundido cruzado** |
| 0:26.9 | 3,2 s | PG de la cabaña de noche | Centrado | Acerca | Noche azul #262F4B, luna y pinos | Luz cálida en la puerta | "◀◀" de rebobinar | Nieve | Corte seco |
| 0:30.1 | 2,0 s | PG de las cabañas | Tercios | Paneo | Nieve | Día frío | "Three hours earlier." | — | Corte seco |
| 0:32.1 | 1,2 s | INF del mapa de Finlandia | Centrado | Acerca | Azul con rejilla | Glow cian | Pin "LAPLAND", "FINLAND" y "ARCTIC CIRCLE" | — | Corte seco |
| 0:33.3 | 4,4 s | PG de 5 amigos | Fila | Acerca | Noche | Luz de la puerta | Ícono de temperatura "-30°C" arriba | Respiración visible | Corte seco |
| 0:37.7 | 5,0 s | PG del lago congelado y las cabañas | Panorámica | Paneo | Noche | Ventanas cálidas | **Contador fijo "-30°C" arriba a la der.** | — | Corte seco |
| 0:42.7 | 6,0 s | INF "1 sauna : 2 personas" | Iconos en fila | Estático | Azul marino | — | Cita de la fuente en letra mínima: "Statistics Finland; Guinness World Records" | — | Corte seco |
| 0:48.7 | 1,3 s | PM del protagonista con celular "NO SIGNAL" | Tercio izquierdo | Acerca | Noche | — | Píldora roja "NO SIGNAL" | — | Corte seco |
| 0:50.0 | 2,4 s | PG de 3 amigos | Tercios | Acerca | Nieve | — | Subtítulo | — | Corte seco |
| 0:52.4 | 1,7 s | PM de ella | Centrado | Acerca | Nieve | — | Subtítulo | — | Corte seco |
| 0:54.1 | 2,2 s | PG del pueblo al otro lado del lago | Horizonte bajo | Paneo | Noche | Luces | Subtítulo | — | Corte seco |
| 0:56.3 | 3,8 s | PG de la heladería en verano (flashback) | Simétrico | Acerca | **Colores pastel saturados**, puerto | Sol | Letrero "JÄÄTELÖ · ICE CREAM" | Banderines | **Corte a color cálido** |

### Resto de cada video: un fotograma cada 10 s

Revisé **242 fotogramas**: 54 de Ropa, 67 de Amazonas y 121 de Sauna. La tabla completa va solo para Ropa. Para Amazonas y Sauna resumo lo que se repite, con conteos.

**Ropa, de 1:00 a 9:50**, en orden:
- **1:00–2:00:**
  - Rueda de hámster en la nieve.
  - Sabana.
  - La Tierra con un cinturón.
  - Mapa "RETURN TO SENDER".
  - Mapa de Europa con una lupa.
  - Mapa mundi.
  - Playa con multitud y contador "44,812".
- **2:10–3:20:**
  - Fogata de noche con bokeh.
  - Cartel "THE PLAN" en un poste.
  - Muro de pasto.
  - Playa con una barra de "sunscreen".
  - Pasillo desenfocado.
  - La Tierra con un techo de franjas.
  - Tienda "SPF BAR".
  - Aula con pizarra.
  - Ventana con el personaje.
  - Ciudad de noche "JUST LIFE".
  - Interior con botella de bloqueador.
- **4:00, el capítulo "ROOM 2 · THE OFFICE":**
  - Puerta en el pasillo.
  - Iconos de estatus "BLING / PAINT / HAIR".
  - Oficina "BUSINESS CASUAL".
  - Foto de equipo enmarcada.
  - Estadio con hinchas pintados.
  - Fondo rojo vacío.
  - Boda en el parque con el letrero "CONFIDENCE".
  - Parque.
  - Escaleras con alfombra roja.
  - Hospital con casilleros.
  - Brújula.
  - Cena con velas y bokeh.
- **6:00–7:30:**
  - Cuarto con espejo.
  - Calle de noche con paraguas.
  - Boda con ~30 personajes.
  - La Tierra con rutas.
  - Rejilla de iconos de personas.
  - Calle de pueblo.
  - Barco de remos.
  - Patente con sello de cera.
  - Tren de vapor en un puente.
  - Línea de tiempo 1700–1900.
- **7:40–9:50:**
  - Pasarela "UMBRELLA WEEK" con niebla.
  - Lanzamiento de un cohete con checklist.
  - Robot "BRAVE VOLUNTEERS".
  - Pantalla dividida en 3 trabajos.
  - El Everest.
  - Puerta de "ROOM" con contraluz.
  - Oficina con pantallas.
  - Pasillo final.
  - Siberia.
  - "YEAR 9" con iconos.
  - Puerta "EXIT".
  - Chimenea.
  - Mosaico de medias.
  - La ardilla en una banca con "MYSTERY SOLVED?".

| Tipo de fotograma (cada 10 s) | Ropa (54) | Amazonas (67) | Sauna (121) |
|---|---|---|---|
| **Decorado nuevo**, distinto del fotograma anterior | 52 (96%) | 49 (73%) | 93 (77%) |
| Infografía, mapa o diagrama con etiquetas | 14 | 8 | 19 |
| **Ficha de fuente histórica** (foto o grabado en sepia, panel azul marino, cita) | 1 | 7 | 4 |
| Tarjeta de capítulo ("DAY N", "ROOM N") | 4 | 3 | 5 |
| Contador o HUD fijo visible | 6 | 67 (siempre "N/100") | 110 (siempre "-30°C" o similar) |
| Escena de noche, con glow o bokeh | 11 | 18 | 46 |
| Multitud (más de 8 personajes) | 9 | 22 | 14 |

## PASO 3: detalles finos

1. **Grano:** residuo de 4,7 a 6,0, constante en todo el video. En los flashbacks de Amazonas se nota más.
2. **Viñeta:** las esquinas quedan al 59–68% del brillo del centro. Es oscura y suave, con un radio de ~75%.
3. **Aberración cromática:** no se ve.
4. **Desenfoque del fondo:**
   - En los PM y PP el fondo va siempre muy desenfocado (bokeh de 20–40 px a 720p, estimado).
   - En los PG el fondo va nítido.
   - Hay primeros planos desenfocados (helechos, otro personaje) en ~10% de los planos.
5. **Glow y bloom:** en fuentes de luz (sol, baliza, fuego, piedras) con un halo amplio de 150–300 px a 720p (estimado). Los haces de luz son volumétricos y suaves.
6. **Curva de color:**
   - Sombras p2 = 12–18: el negro no se levanta mucho.
   - Medios p50 = 93–135.
   - Altas p98 = 234–243: no queman.
   - Temperatura cálida, R−B de +10 a +30.
   - Saturación del 38–51%, con picos (p90) del 70–78%.
7. **Paleta propia de los flashbacks:** monocromo ámbar (#6B4A2E a #E3C584), con rayas verticales de película y lluvia.
8. **Easing:**
   - Zoom con salida lenta (*ease-out*) en la mayoría de los planos fiables, por ejemplo +5 %/s que frena al final. Algunos son lineales.
   - Las etiquetas aparecen con "pop" de escala (estimado: 0,8 → 1,05 → 1,0 en ~0,25 s).
9. **Ritmo:**
   - Un plano cada 1,6–2,0 s (mediana).
   - El 90% dura menos de 3,2–4,1 s.
   - Sale un plano de 0,3 s (flash, fundido o barrido) cada 15–20 s.
   - Algo cambia en pantalla todo el tiempo: diferencia de píxeles de 4,6–5,4, contra 1,6 en lo nuestro.
10. **Sincronía con la voz:**
    - El 38% de los cortes cae a ±250 ms del inicio de una frase, contra 11–12% al azar.
    - El corte suele llegar **0,1–0,3 s antes** de la palabra (la imagen se adelanta al audio).
    - La voz va a 142–179 palabras por minuto.
11. **Música:** queda a **17–20 dB por debajo de la voz** en las pausas. Los golpes son 62–77 por minuto (voz más efectos). El tempo estimado es de 117–172 BPM, así que la música es animada.
12. **Formato:**
    - 16:9, a 1280x720 en estos archivos.
    - Subtítulos con la base a ~92,8% de la altura y ancho del 38–71% del cuadro (frases enteras de 5 a 8 palabras).
    - HUD a ~2,5% de margen desde el borde.
13. **Subtítulos (medidos en Sauna a las 0:21):**
    - Alto del texto 31 px a 720p, es decir **4,3% de la altura** (unos 46 px a 1080p).
    - Palabra resaltada en **#FACA4F**, el resto en blanco con sombra oscura suave. No hay contorno grueso.
14. **Etiquetas y HUD:**
    - Píldoras azul marino (#0E111F al 85%) con borde fino dorado (#E3C584) y texto en mayúsculas de ~1,8–2,2% de la altura.
    - Contador fijo arriba a la derecha durante todo el video.
15. **Calidad de imagen:** ilustración vectorial limpia, render nítido y sin artefactos. Podría ser After Effects o similar (estimado).

## PASO 4: nuestros videos frente a la referencia

### Nuestro v25 "Congelado 1.000 años", 0:00–1:00

| Tiempo | Dur. | Plano | Movimiento | Fondo | Texto |
|---|---|---|---|---|---|
| 0:00–7:30 | 4 planos | PG del laboratorio, **el mismo encuadre repetido** | Acerca 0,9 %/s y saltos de zoom | Laboratorio frío | Subtítulos de 4 palabras a 5,6% de la altura |
| 0:07.3 | 3,8 s | PP de la cabeza | Acerca | Azul marino | — |
| 0:11.1–18.5 | 3 planos | PG de Bogotá 3026, **el mismo decorado** | Saltos de zoom | Ciudad | "AÑO 3026" |
| 0:18.5 | 4,9 s | PM pensativo | Lento | Azul marino con "?" | — |
| 0:23.4–29.3 | 2 planos | El mismo papel | — | Azul marino | — |
| 0:29.3–38.7 | 3 planos | PG de la fachada del laboratorio, **el mismo decorado** | Saltos | Ladrillo | — |
| 0:38.7–45.7 | 2 planos | Laboratorio | — | Frío | — |
| … | | | | | |

**En un minuto hay 21 planos, pero solo 7 decorados distintos.** Los demás son el mismo decorado con otro zoom. La referencia usa ~25 decorados o encuadres distintos por minuto.

### Nuestro v24 "Microondas" (3D)

- 2 planos en un minuto: 0:00–10:07 y 10:07–65:80, con un plano mediano de 13 s.
- Fondo gris claro #CFC9BD, sin viñeta (1,17), saturación del 13%.
- No se parece en nada a la referencia.

### Diferencias, de mayor a menor impacto en el parecido

1. **Pocos decorados distintos.**
   - Nosotros: 7 por minuto, repetidos con saltos de zoom.
   - Ellos: un decorado o encuadre nuevo en cada plano (96% de los fotogramas cada 10 s son distintos).
   - Cómo corregirlo: cada frase lleva su propio plano. Una escena de 6 s se divide en 3 planos de ~2 s con contenidos distintos, por ejemplo PG del lugar → PD del objeto del que se habla → PP de la reacción de Xeno.
2. **Ritmo lento.**
   - Nosotros: 3,5 s por plano y 1,6 de cambio en pantalla.
   - Ellos: 1,6–2,0 s por plano y ~5 de cambio.
   - Cómo corregirlo: cortar en cada inicio de frase, 0,15 s antes de la palabra. Duración objetivo: mediana de 2,0 s y nunca más de 4,5 s. Agregar animación constante (partículas, personajes que se mueven, elementos que entran).
3. **Temperatura fría.**
   - Nosotros: R−B −25, con azul marino dominante.
   - Ellos: de +10 a +30.
   - Cómo corregirlo:
     - Cambiar el fondo base de #0D172A a café o morado cálido (#2A1F2E).
     - Usar el tono cálido #FFB46B al 12–15% en la mayoría de las escenas.
     - Dejar el frío solo en escenas de nieve o de noche, y aun ahí con luces cálidas.
4. **Faltan PP con bokeh.**
   - Nosotros: Xeno pequeño en un PG casi siempre.
   - Ellos: ~35% de PM o PP con el fondo totalmente desenfocado.
   - Cómo corregirlo: plantilla "PP_bokeh", con Xeno al 60–80% de la altura sobre un fondo desenfocado de 10–14 px y círculos de bokeh.
5. **Subtítulos.**
   - Nosotros: 5,6% de la altura, 4 palabras por bloque y contorno grueso de 9 px.
   - Ellos: 4,3%, la frase entera y sombra suave.
   - Cómo corregirlo: fuente de 46 px a 1080p, bloque = frase (hasta 8 palabras, máximo 2 líneas), sombra difusa, palabra resaltada en #FACA4F y base al 92,8% de la altura.
6. **Música demasiado alta.**
   - Nosotros: −12 dB respecto a la voz.
   - Ellos: −17 a −20 dB.
   - Cómo corregirlo: bajar la música 6–8 dB (volumen 0,45 → ~0,2 en la mezcla) y mantener el compresor que la baja cuando habla la voz.
7. **Zoom débil y siempre hacia adentro.**
   - Nosotros: 0,9 %/s y solo acercando.
   - Ellos: 2,5–4,7 %/s, alternando acercar y alejar, con salida lenta.
   - Cómo corregirlo: zoom de 2,5–4 %/s, con dirección que alterna en cada plano y salida lenta. Un 20% de planos estáticos.
8. **Faltan transiciones especiales.**
   - Ellos cada 15–20 s usan flash blanco, fundido cruzado, barrido o una puerta que se abre.
   - Cómo corregirlo: una transición especial cada ~4 escenas y una tarjeta de capítulo en cada escenario.
9. **Tarjetas de capítulo.**
   - Ellos: tarjeta oscura con borde dorado, "DAY 30" grande y píldora amarilla con el subtítulo, sobre bokeh, de 4–5 s.
   - Nosotros: solo una píldora en la esquina.
10. **Ficha de fuente histórica.** Ellos usan una imagen de archivo en sepia dentro de un panel azul marino con la cita ("HERODOTUS · HISTORIES 4.110"). Nosotros tenemos fichas de "DATO REAL" solo con texto.
11. **Flashbacks.** Ellos usan monocromo ámbar con rayas de película y grano fuerte. Nosotros no tenemos flashbacks.
12. **Glow y haces de luz.** Ellos tienen fuentes de luz con halo grande. Nosotros tenemos haces débiles y solo en algunas escenas.
13. **Personajes.** Ellos usan cuerpos de tubo de color, cabeza negra y patas finas, y casi nunca brazos. Xeno es más detallado, lo que está bien porque es nuestra identidad. Lo que hay que copiar son las multitudes de 15–40 personajes.

## PASO 5: guía para replicarlo

### Fórmula visual

Un plano por frase (~2 s) → cada plano es un decorado o encuadre distinto → la cámara siempre se mueve (2,5–4 %/s, alternando, con salida lenta) → PG para situar, PD para el objeto de la frase, PP con bokeh para la reacción → colores cálidos con viñeta, grano y glow → contador fijo del objetivo → tarjeta de capítulo en cada escenario → un dato real con ficha de fuente cada 60–90 s.

### Planos (medidos en el primer minuto de los 3 videos)

| Plano | % |
|---|---|
| PG (decorado completo, multitudes) | 35% |
| PM o PP del personaje con bokeh | 30% |
| PD (objeto o insert) | 18% |
| Infografía, mapa o diagrama | 10% |
| Transición especial o tarjeta | 7% |

| Movimiento | % (estimado con los planos fiables) |
|---|---|
| Acercar 2,5–5 %/s con salida lenta | 45% |
| Alejar 2,5–3,5 %/s con salida lenta | 30% |
| Estático (solo anima lo que hay en escena) | 20% |
| Sacudida (acción) | 5% |

### Paleta (HEX medidos)

- **Cálidos base:** #A96940, #884125, #BE9165, #9C6542, #C8AD89, #E7C598, #EEDBB2
- **Verdes y aguamarinas:** #8DC7B6, #638A84, #85A4A0, #899C81
- **Oscuros:** #0E111F, #171627, #262F4B, #382329, #523530
- **Claros:** #F3F1E6, #F1E8CB, #C8D7D5
- **Acento de subtítulo:** #FACA4F
- **Píldoras:** fondo #0E111F al 85%, borde #E3C584

### Fuentes (equivalentes gratis)

Las fuentes exactas no se pueden identificar con certeza (estimado):

| Uso | Fuente | Tamaño a 1080p |
|---|---|---|
| Subtítulos | **Nunito ExtraBold 800** o Baloo 2 Bold | 46 px |
| Títulos y tarjetas | **Luckiest Guy** o Lilita One | 110–160 px |
| Etiquetas y HUD | **Montserrat ExtraBold** en mayúsculas, espaciado 0,12em | 20–26 px |
| Manuscrito | **Caveat** o Kalam | 40 px |

### Ajustes de color aproximados (en Remotion/SVG o en CapCut)

- **Temperatura:** +15 hacia cálido. Capa #FFB46B en "soft light" al 14%.
- **Contraste:** medio. Negros en p2 ≈ 14 (sin levantar más de +4) y blancos p98 ≈ 238 (−2% de altas luces).
- **Saturación:** +8% (meta media del 45%).
- **Viñeta:** −35% en las esquinas, radio del 75%, borde suave.
- **Grano:** 5–6% de ruido monocromo, en "overlay".
- **Glow:** en cada fuente de luz, un círculo de radio 220 px con degradado radial #FFE3A3 al 45% → 0, en "screen".

### Plantilla de estructura (10–12 min)

| Tiempo | Bloque | Planos |
|---|---|---|
| 0:00–0:35 | Gancho: regla del mundo, 3 consecuencias rápidas y "al final vas a saber…" | 15–18 planos de 1,5–2 s, con mucho PD y PP |
| 0:35–0:45 | Tarjeta de título: "EL CUARTO DE LAS HIPÓTESIS" (nuestra versión) y el título del video | Pasillo con puertas y zoom hacia la puerta 1 |
| Escenarios 1 a 5 (~1:50 cada uno) | Tarjeta de capítulo de 4 s → explicación con 1 dato real y ficha de fuente → gag recurrente → cierre del escenario con transición especial | ~50 planos por escenario |
| Final (0:40) | Resolución, el gag que vuelve y pregunta para comentarios | 15 planos |

### Herramientas

Todo se puede hacer en Remotion, con nuestro propio código:

| Efecto | Componente |
|---|---|
| Bokeh | Capa de fondo con `feGaussianBlur` de 12–14 px y 20–30 círculos de radio 20–60 px con opacidad 0,15–0,35 |
| Glow | Degradado radial en modo "screen" |
| Haces de luz | Trapecio con degradado lineal en "screen" |
| Partículas (polvo, nieve, hojas) | 30–60 puntos animados con seno |
| Flash blanco | Rectángulo blanco con opacidad 0 → 1 → 0 en 9 fotogramas |
| Fundido cruzado | 9 fotogramas de mezcla entre los dos planos |
| Barrido | Máscara que avanza 1920 px en 12 fotogramas |
| Puerta que se abre | Rotación en Y de 0 a 85° en 15 fotogramas, con salida lenta |
| Flashback | Sepia (`feColorMatrix` matrizSepia), rayas verticales animadas (6 líneas de 2 px al 30%) y grano al 12% |
| Easing | `Easing.out(Easing.cubic)` para el zoom y `Easing.out(Easing.back(1.6))` para el "pop" de las etiquetas |

**Prompt de IA** para miniatura o fondos, si se generan imágenes:

```
flat vector cartoon illustration, warm cinematic lighting, soft volumetric light rays, shallow depth of field with bokeh background, film grain, subtle vignette, pastel saturated palette (amber #A96940, cream #F3F1E6, teal #8DC7B6), clean shapes, no outlines on background, 16:9
```

### Checklist de 15 puntos antes de publicar

1. Plano mediano ≤ 2,2 s y p90 ≤ 4,5 s (medir con `cuts.py`).
2. Ningún plano dura más de 6 s, salvo las infografías (máximo 6 s).
3. ≥ 20 decorados o encuadres distintos por minuto.
4. Cambio en pantalla por segundo ≥ 4 (`cuts.py`, "cambio_medio_por_seg").
5. Temperatura R−B ≥ +8 en todo el video (`color.py`).
6. Saturación media del 40–50%.
7. Viñeta (esquinas ÷ centro) entre 0,55 y 0,70.
8. Grano entre 4,5 y 6,5.
9. Música 16–20 dB por debajo de la voz en las pausas (`audio.py`).
10. Subtítulos de 4,0–4,5% de la altura, base al 92–93%, palabra resaltada en #FACA4F y bloques por frase.
11. Contador o HUD del objetivo visible desde el primer escenario hasta el final.
12. Una tarjeta de capítulo por escenario y una transición especial cada 15–25 s.
13. ≥ 30% de PM o PP con bokeh.
14. Un dato real con ficha de fuente cada 60–90 s.
15. Cortes 0,1–0,3 s antes del inicio de cada frase (revisar 10 cortes al azar).
