# Análisis de los 5 videos de referencia (estilo "explicador 3D oscuro")

Analizados el 16 nov 2026. Los 5 son del mismo canal o del mismo estilo:
- **Formato:** vertical 9:16, 576×1024 px, 30 fps, estéreo 44,1 kHz, de 2:06 a 2:31.
- **Videos:** 1 Contraseñas/plastilina (150,8 s), 2 Pensar en sexo cada 7 s (126,3 s), 3 Espermatozoide (138,5 s), 4 Cubo de Rubik (143,7 s), 5 Minecraft Far Lands (142,6 s).

**Método:**
- Visual: fotograma a 1 fps del video completo (todos revisados), tiras a 10 fps en 6 momentos clave y 6 fotogramas en resolución completa.
- Audio: transcripción con tiempos por palabra (faster-whisper small), detección de cortes (ffmpeg scdet), transientes en alta frecuencia (>2 kHz) y en graves (60–250 Hz), loudness EBU R128 y un espectrograma.
- Colores: k-means sobre los fotogramas y muestreo de píxeles saturados.

**Qué es seguro y qué no:**
- Seguro: lo visual, el texto en pantalla, los tiempos de voz y los colores.
- Estimado: el tipo de cada SFX (por forma de onda, no de oído), el BPM y el tono de voz.
- No identificado: el nombre exacto de las tipografías.

---

## Guía de estilo resumida (para replicarlo)

### 1. Estética general
- Explicador de ciencia o datos en **3D estilizado con sombreado de semitono (halftone)**. Los objetos parecen render 3D, pero las sombras son puntos de trama de cómic o serigrafía, no degradados. Se ve claro en el contador rojo (video 2), el óvulo (3), las caras del Rubik (4) y la Tierra (5).
- **Contraste muy alto:** fondo casi negro y objetos de colores saturados y planos.
- **Saturación:** alta en los acentos y nula en el fondo.
- **Grano:** el fondo tiene una textura de ruido o trama muy sutil, no es negro liso. En el video 4 (30–36 s y 90 s) el ruido gris granulado se usa como escena.
- **Iluminación:** luz principal suave y frontal-superior. Las sombras se resuelven con trama de puntos. Los objetos proyectan una sombra elíptica difusa en el piso (plataforma del contador, video 2).

### 2. Paleta (HEX medidos)
| Uso | HEX | Notas |
|---|---|---|
| Fondo principal | **#0B0B10** (medido #080810–#0D0D11) | Negro azulado, del 36 al 59 % de los píxeles |
| Texto principal | **#F0EBE4** (medido #F0E8E0–#F0E8E8) | Blanco roto cálido, no blanco puro |
| Acento rojo-naranja | **#F84418** (medido #F84018–#F84820) | Palabra clave de alerta, objetos protagonistas |
| Acento lima | **#D2F834** (medido #D0F830–#D0F838) | Palabra clave positiva, contadores, selección, cursores de terminal |
| Acento azul cobalto | **#2A42F6** (medido #2840F0–#3048F8) | "Incorrecto", sellos, cursores de mouse, segunda categoría |
| Papel / escena clara | **#EFE9E1** (medido #ECE9E1–#F0E8E0) | Escenas de documentos, encuestas, blogs |
| Lavanda | ≈ #9B8FE8 (aprox., sin medir con precisión) | Segunda categoría en gráficos de puntos (video 2) y gel (video 3) |
| Gris tarjetas | ≈ #1C1E23 a #31373F | Recuadros UI, tarjetas oscuras |

Regla: **un solo acento por palabra**. El resto del texto va en blanco roto.

### 3. Fondo
- Sólido casi negro con grano sutil en el 80–90 % del tiempo. No hay degradados.
- Se interrumpe con **escenas de papel crema** (#EFE9E1) cuando se cita un estudio, un documento o un blog:
  - Video 2, 24–41 s: encuesta.
  - Video 3, 19–30 s: libro de texto.
  - Video 4, 37–55 s: hoja rayada con margen perforado.
  - Video 5, 26–38 s: blog.
- Ocasionalmente es un **escenario 3D completo** que llena el cuadro (pared azul y terreno lima del video 5) o un **patrón de semitono animado** (ruido de Perlin del video 5, 60–70 s; fondo azul con ondas del video 2, 122–123 s).
- Profundidad: casi siempre se ve el objeto sobre el vacío negro. Cuando hay escenario, se usa perspectiva isométrica.

### 4. Composición y encuadre
- Vertical 9:16. El objeto protagonista va **centrado**, ocupando del 30 al 60 % del ancho.
- **Texto:**
  - Videos 2 a 5: arriba, entre el 3 y el 17 % de la altura.
  - Video 1: abajo, entre el 75 y el 85 %.
  - Siempre centrado horizontalmente, de 1 a 2 líneas, dentro del 80 % central del ancho.
- **UI y contadores:** en las esquinas superiores (barra de contraseña arriba a la izquierda, contador monoespaciado arriba a la izquierda) o justo encima o debajo del objeto.
- Las tarjetas de dato (nombre, institución, año) van arriba a la izquierda o centradas arriba.
- Los márgenes laterales del texto son de unos 30 a 40 px a 576 px de ancho (unos 60–70 px a 1080).

### 5. Texto en pantalla
- **Titular:** sans grotesca **extra negrita, algo ancha**, tipo "Archivo Expanded Black" o "Neue Haas Grotesk Display Bold". **No identifico la fuente exacta.**
  - Videos 2 a 5: TODO EN MAYÚSCULAS.
  - Video 1: minúsculas.
  - Altura de mayúscula de unos 22 a 30 px a 576 px de ancho (unos 50–60 px a 1080).
- **Secundaria:** monoespaciada (parecida a JetBrains Mono o IBM Plex Mono, sin certeza), pequeña, en mayúsculas, para datos, citas, años y subtítulos. Ejemplos: "TODOS LOS DÍAS O VARIAS VECES AL DÍA", "LA PUNTA DE LA CABEZA", "«CAMINAR HASTA ALLÁ…»".
- **Pixel:** solo para "FAR LANDS" (video 5).
- **Color:** blanco roto, con la palabra clave en rojo, lima o azul.
- **Tachado:** una línea recta horizontal del mismo color o en rojo sobre la palabra que el narrador desmiente ("SEXO", "HOMBRE O MUJER", "tu contraseña", "LAS MÁS REVUELTAS").
- **Contorno:** no tiene. Lleva una sombra oscura muy suave para separarlo del fondo.
- **Entrada:** **palabra por palabra, sincronizada con la voz.**
  - Cada palabra aparece cuando se dice. Sube unos pocos px desde abajo, entra un poco más pequeña y con desenfoque, y se asienta en unos 0,15–0,2 s.
  - Ejemplo (video 2): "NO" a 1,0 s, "PIENSAN EN" a 1,1, "SEXO" a 1,2. En 1,3 la frase está completa.
- **Salida:** desenfoque horizontal y fundido a gris en unos 0,2–0,3 s. Se ve en "función hash" (video 1, 64 s), "una" (9 s) y "las vetas" (55 s).
- **Duración en pantalla:** lo que dura la frase hablada, entre 1,5 y 4 s.
- **Densidad:** solo la idea clave (2 a 6 palabras), no la frase completa.
- **Tarjetas de dato:**
  - Video 3: recuadro negro con barra roja vertical a la izquierda y texto monoespaciado blanco.
  - Videos 2 y 4: papel blanco con borde rojo a la izquierda.
  - En ambos casos el texto se **teclea letra por letra** con cursor de bloque (lima o azul), como "NOTCH█".
- **Números:** contadores tipo **odómetro con dígitos que ruedan** y desenfoque de movimiento vertical. Los ceros a la izquierda van en gris tenue ("00" + "18") y la tipografía es monoespaciada lima o blanca.

### 6. Personajes y objetos
- **Nunca hay personas.** Todo se explica con objetos metáfora: plastilina, contador de mano, espermatozoides, cubos, bloques.
- Estilo: 3D render estilizado con semitono y bordes limpios. En las escenas de papel, ilustración de grabado en blanco y negro.
- Los objetos **siempre se mueven:** rotan despacio, rebotan con cada acción (el contador salta en cada clic), se amasan, se multiplican, explotan en copias o se desintegran en partículas.
- Los "actores" son íconos UI: cursor de mouse azul (el hacker), barra de contraseña con puntos de colores, botones píldora.

### 7. Animación y cámara
- La cámara es **continua y sin cortes:** zoom in o out suaves, órbitas lentas alrededor del objeto, travelling hacia otra zona (video 5, hasta la pared).
- En momentos de énfasis hay un **zoom fuerte** de golpe: video 2 a los 9–10 s ("UN CLIC"), video 3 a los 4 s.
- Easing suave (ease-in-out). Los rebotes son cortos, con overshoot en elementos que aparecen.
- Una **sacudida** solo se ve junto con los glitches.
- Velocidad: cambio visible cada 1 a 2 s. El cambio medio de imagen entre segundos va de 14 a 25 sobre 255.

### 8. Transiciones
Casi no hay cortes duros: solo 0 a 3 por video, detectados en 109,9 s (v1), 18,2 y 33,0 (v3), 117,9 (v4) y 49,0 (v5). Las transiciones son de estos tipos:
- **Transformación del objeto** (la más común): la pila de tiras se amasa en bola, el rectángulo azul se vuelve hoja blanca y crece hasta llenar la pantalla (video 2, 23,0–23,7 s), el cubo explota en copias, las partículas se reagrupan en otra forma.
- **Objeto puente:** una bolita roja sola en el centro marca el cambio de tema (video 2, 41 s; video 3, 74 s) y un cubo lima sólido (video 4, 123 s).
- **Desintegración en partículas:** un texto u objeto se deshace en polvo de píxeles (video 5: "FAR LANDS" a los 23 s y el contador a los 88 s; video 1, bola incorrecta a los 59 s).
- **Glitch** de 2 a 4 fotogramas: separación RGB y desplazamiento de líneas horizontales (video 1, 57,4 s; video 5, 11 s, 108 s y 123 s).
- **Cambio a papel:** la escena oscura da paso a la escena crema.
- **Loop final:** el último plano es el mismo que el primero. La narración termina en una frase que empalma con la primera ("Y cuando una página lo hace bien…" lleva a "TikTok no tiene guardada tu contraseña").

### 9. Efectos visuales
- Sombreado de semitono en objetos, fondos y nubes químicas.
- Partículas: confeti de puntos, polvo de desintegración, lluvia de líneas, nubes de puntos que forman gráficos.
- Anillos de selección lima alrededor de un objeto, cuadros lima de selección, líneas lima de conexión entre elementos.
- Flechas curvas lima para indicar giro (Rubik). Flechas rectas blancas para indicar presión (prensa del video 4).
- Sellos inclinados azules ("INSTITUTO KINSEY", "multó a Meta"). Etiquetas píldora con números.
- Rayitas lima de "impacto" alrededor de una acción (clic del contador).
- Glitch RGB y viñeta circular (microscopio, video 3).
- Gráficos de datos hechos con objetos: cuadrículas 10×10 de círculos, histogramas de bolitas o cubos, contadores.
- No usa emojis, ni líneas de velocidad clásicas, ni lens flares.

### 10. Ritmo y estructura (igual en los 5)
1. **Gancho (0–5 s):** una afirmación que desmiente un mito o sorprende, dicha en la primera frase sin introducción. Ejemplos: "TikTok no tiene guardada tu contraseña", "Los hombres no piensan en sexo cada 7 segundos", "El espermatozoide que te hizo no ganó ninguna carrera", "Los mundos de Minecraft no son infinitos".
2. **Metáfora cotidiana** que lo explica: la bola de plastilina, el contador de golf, "como tú caminas hacia el olor de unos tacos".
3. **Datos con fuente:** año + nombre + oficio + institución, en tarjeta tecleada. Ejemplos: "En 2012 Terri Fisher, psicóloga de la Universidad Estatal de Ohio…", "En 2019 Brian Krebs…".
4. **Giro a mitad del video (~65–75 % de la duración):** "Pero eso no es lo más raro / lo más preocupante" (v1 96 s, v2 94 s, v3 103 s, v4 108 s, v5 99 s).
5. **Dato final sorprendente** y **cierre que vuelve al inicio** (loop).
- Cambio visual cada 1–3 s, texto nuevo cada 2–4 s y cambio de escena grande cada 8–15 s.

### 11. Efectos de sonido
- **Mucha densidad:** entre 108 y 130 eventos detectados por video, unos 0,8 por segundo.
- **Tipos más frecuentes** (clasificación heurística):
  - "Pop / golpe medio" corto: del 40 al 55 %. Acompaña la aparición de cada objeto o palabra y cada clic.
  - "Whoosh / swish": del 30 al 43 %. En movimientos de cámara, transformaciones y entradas de tarjetas.
  - Algunos "ding / tono" (2 a 6 por video): en revelaciones de datos y selecciones lima.
  - "Golpe grave / impacto": pocos, de 1 a 8.
  - "Click / tic" seco: en contadores y en el tecleo de tarjetas. Probablemente hay más de los que el detector separa, porque muchos quedan encima de la voz.
- En el espectrograma se ven líneas verticales finas casi continuas (ticks y clicks) y ráfagas de ruido de banda ancha (whooshes, como la de 7,0–7,4 s en el video 1).
- Los SFX suenan **por debajo de la voz**, que siempre manda.
- El segundo exacto de cada evento está en las tablas de abajo.

### 12. Música
- **Muy discreta.** En el espectrograma del video 1 hay **notas de sub-bajo (20–110 Hz) cada ~2 s** (2,75 / 6,0 / 8,0 / 10,0 / 12,05 / 14,0 s) y poco contenido melódico audible por encima de la voz.
- Parece electrónica ambiental o minimal de fondo. **El género exacto no lo puedo confirmar.**
- **BPM:** la autocorrelación dio 95, 120, 120, 80 y 80 según el video, así que no es fiable. El patrón de bajo cada 2 s es compatible con unos 120 BPM (un compás de 4/4 = 2 s) o 60 BPM.
- **Volumen:** muy por debajo de la voz.
- **Loudness total:** de -16,9 a -17,1 LUFS en los videos 1 a 4, y -20,1 en el 5.
- No se ve una sincronía clara entre la música y los cortes, porque casi no hay cortes.

### 13. Voz
- **Narrador único**, tono **conversacional y seguro**, como quien cuenta un dato curioso a un amigo. Habla de tú ("tu contraseña", "el que te hizo", "si caminas").
- **Velocidad:** de 170 a 189 palabras por minuto de media sobre la duración total, así que la velocidad real hablando es algo mayor.
- **Pausas:** de 10 a 21 de más de 0,4 s en 2+ minutos, casi siempre de 0,4 a 0,8 s y solo entre bloques de idea.
- **Frases:** cortas, de 6 a 15 palabras.
- **Tono:** F0 mediana estimada de 167 a 181 Hz. **No confirmo el género ni la identidad de la voz.**
- **Procesamiento:** suena limpia y cercana (compresión y EQ de voz típica). No detecto efectos como reverb notoria, pitch o robot.
- Los números y fechas se dicen completos ("12 millones y medio de bloques", "En 2020").

### 14. Subtítulos
- **No hay subtítulos de la frase completa.** Hay **texto clave** de 2 a 6 palabras sincronizado palabra por palabra, como se describe en el punto 5.
- **Resaltado:** una palabra en rojo (#F84418), lima (#D2F834) o azul (#2A42F6), o tachada.
- **Animación por palabra:** entra desde abajo con fundido y desenfoque, y sale con desenfoque y fundido a gris.

### Cómo replicarlo con nuestro kit (Remotion + three.js)
- Fondo #0B0B10 con grano sutil (un plano con ruido animado). Materiales toon con **trama de semitono** en lugar del contorno OL (shader de puntos en la sombra).
- Texto: titular grotesco extra negrito; secundario monoespaciado; entrada palabra por palabra (translateY 12 px → 0, blur 6 px → 0, opacidad 0 → 1 en 0,18 s); salida con blur y gris.
- Contadores odómetro monoespaciados lima con ceros grises. Tarjetas de dato tecleadas con cursor de bloque.
- Transiciones sin cortes: transformar objetos, objeto puente (bolita roja), desintegración en partículas, glitch de 2–4 fotogramas como máximo.
- SFX: un pop por cada aparición, un whoosh por cada movimiento o transformación, un ding en cada revelación, tics al teclear, unos 0,8 por segundo y siempre bajo la voz. Música de sub-bajo mínima.
- Guion: mito en la primera frase, metáfora, dato con nombre + año + institución, "pero eso no es lo más raro", y cierre que empalma con el inicio.


---

# Desglose segundo a segundo

Columnas: **Visual** (desde la hoja de contacto a 1 fps; "↳" = sigue el mismo plano), **Voz** (palabras que empiezan en ese segundo, faster-whisper; puede haber errores de transcripción en nombres propios), **SFX** (transientes detectados automáticamente y clasificados por heurística: tiempo exacto, tipo probable, si cae entre palabras o encima de la voz). Los tipos de SFX son estimaciones por forma de onda, no confirmados de oído.


## Video 1: Contraseñas / plastilina (150.8 s)

- Voz: 450 palabras, **179.1 ppm** de media sobre la duración total; pausas >0,4 s: 11 (33.8s (0.5s), 37.6s (0.44s), 48.3s (0.44s), 81.1s (0.46s), 96.0s (0.58s), 97.4s (0.44s), 106.3s (0.8s), 117.0s (0.42s), 119.1s (0.44s), 131.6s (0.58s), 139.1s (0.68s)).
- Loudness integrado: **-17.0 LUFS**. F0 mediana estimada: 174.9 Hz (estimación automática, no concluyente). BPM estimado por autocorrelación: 95.2 (poco fiable, ver guía).
- Cortes duros detectados (scdet umbral 12): [109.93]. Todo lo demás son transformaciones o movimientos de cámara continuos.
- SFX detectados: 125 (≈0.83 por segundo).

| s | Visual | Voz | SFX |
|---|---|---|---|
| 0 | **[0–1]** Anillo de tiras de plastilina (rojo, amarillo, azul, verde, morado) gira alrededor de una bola marmolada central. Arriba: barra UI de contraseña con etiqueta "TikTok" y 8 puntos de colores. Texto abajo: "no tiene guardada tu contraseña" (blanco, minúsculas). | TikTok no tiene | 0.07 pop / golpe medio (sobre voz); 0.29 pop / golpe medio (sobre voz); 0.90 whoosh / swish (sobre voz) |
| 1 | ↳ | guardada tu contraseña. |  |
| 2 | **[2–2]** La cámara se aleja y aparece una cuadrícula de tarjetas con bolas. "tu contraseña" queda tachado con una línea azul. | Tiene guardada | 2.28 pop / golpe medio; 2.57 whoosh / swish (sobre voz) |
| 3 | **[3–4]** Cuadrícula 5×3 de bolas marmoladas en tarjetas redondeadas y etiqueta inclinada "guardada" (lima tenue, en recuadro). Texto: "una bola de" (blanco) / "plastilina revuelta" (rojo #f84418). | una bola de plastilina |  |
| 4 | ↳ | revuelta. |  |
| 5 | **[5–6]** Zoom a una sola bola que gira. El texto se mantiene. | Y con esa bola | 5.25 pop / golpe medio |
| 6 | ↳ | le basta para dejarte |  |
| 7 | **[7–9]** La bola se encoge a un ícono arriba a la derecha. La barra de contraseña queda vacía con cursor. Entran tiras horizontales que se apilan (rojo, amarillo…). La palabra "una" sale con desenfoque. | entrar. Cada letra | 7.68 pop / golpe medio |
| 8 | ↳ | de tu contraseña |  |
| 9 | ↳ | es una tira de plastilina | 9.13 pop / golpe medio (sobre voz) |
| 10 | **[10–12]** Pila de 8 tiras (rojo, amarillo, azul, azul, verde, naranja, morado, rosa). Texto: "una tira de plastilina". | de un color distinto. |  |
| 11 | ↳ | La red |  |
| 12 | ↳ | social junta las | 12.08 pop / golpe medio (sobre voz) |
| 13 | **[13–17]** Contador monoespaciado lima arriba a la izquierda: 00→02→04→06→08 (dobleces). La pila se amasa en una esfera rayada que se vuelve marmolada. Texto: "los mismos dobleces". | tiras y las amasa siempre | 13.97 pop / golpe medio (sobre voz) |
| 14 | ↳ | con los mismos | 14.88 pop / golpe medio (sobre voz) |
| 15 | ↳ | dobleces y en el |  |
| 16 | ↳ | mismo orden, hasta | 16.09 pop / golpe medio (sobre voz) |
| 17 | ↳ | que sale una bola veteada |  |
| 18 | **[18–19]** Contador "10". Bola girando. Texto pequeño: "bola veteada como mármol". | como mármol. | 18.15 ding / campana (tono) (sobre voz); 18.45 whoosh / swish (sobre voz) |
| 19 | ↳ | Esa bola guardada |  |
| 20 | **[20–26]** Un gancho colgado de un hilo intenta estirar la bola, que se deforma como una gota y vuelve. Texto: "no se puede desamasar". En 26 el gancho se suelta hacia arriba. | no se puede |  |
| 21 | ↳ | desamasar. | 21.97 pop / golpe medio |
| 22 | ↳ | Revolver la plastilina | 22.20 whoosh / swish (sobre voz) |
| 23 | ↳ | toma un segundo, | 23.97 pop / golpe medio |
| 24 | ↳ | pero separar otra |  |
| 25 | ↳ | vez cada color | 25.52 pop / golpe medio (sobre voz) |
| 26 | ↳ | es imposible. | 26.17 pop / golpe medio (sobre voz) |
| 27 | **[27–29]** Entra un cursor de mouse azul (flecha #2a42f6, el hacker) y arrastra la bola. Dos bolas lado a lado. Texto: "un mármol". | Si un hacker se |  |
| 28 | ↳ | roba la bola, |  |
| 29 | ↳ | se lleva un mármol, |  |
| 30 | **[30–31]** Sobre la bola, una fila de puntos de contraseña tachada. Se mantiene "un mármol". | no tu contraseña. | 30.46 pop / golpe medio (sobre voz) |
| 31 | ↳ | Si mañana vuelves |  |
| 32 | **[32–38]** Barra de contraseña, caja vacía, bola y pila de tiras. Texto: "perro123" (blanco). Contador 04→09. En 37 el texto se desvanece y la bola pasa a amarilla. | a escribir perro123, | 32.78 whoosh / swish (sobre voz) |
| 33 | ↳ |  | 33.98 pop / golpe medio |
| 34 | ↳ | los mismos dobleces | 34.29 bombo (música?) |
| 35 | ↳ | dan el mismo | 35.43 whoosh / swish (sobre voz) |
| 36 | ↳ | mármol, beta | 36.70 pop / golpe medio |
| 37 | ↳ | por beta. | 37.53 ding / campana (tono) (sobre voz); 37.97 pop / golpe medio |
| 38 | ↳ | Pero si escribes perro124, | 38.87 whoosh / swish (sobre voz) |
| 39 | **[39–41]** Dos pilas de tiras lado a lado. Texto: "perro124". Contador 01→03 con dos bolas separadas por una línea vertical. |  |  |
| 40 | ↳ | cambia una sola | 40.39 whoosh / swish (sobre voz) |
| 41 | ↳ | tira y como | 41.81 pop / golpe medio (sobre voz) |
| 42 | **[42–47]** Dos bolas se amasan en paralelo, contador 05→10. Texto: "una sola tira". | cada doblez arrastra | 42.23 pop / golpe medio (sobre voz) |
| 43 | ↳ | a todos los que | 43.59 whoosh / swish (sobre voz) |
| 44 | ↳ | siguen, el mármol | 44.72 whoosh / swish |
| 45 | ↳ | sale distinto de | 45.22 ding / campana (tono) (sobre voz); 45.95 whoosh / swish (sobre voz) |
| 46 | ↳ | punta a punta. | 46.97 pop / blip (sobre voz) |
| 47 | ↳ | Así es como entras. |  |
| 48 | **[48–49]** Mini cuadrícula 2×3 de bolas. Las tiras vuelan hacia la barra. Texto: "así es como entras". | La red | 48.73 whoosh / swish |
| 49 | ↳ | social amasa lo | 49.97 whoosh / swish (sobre voz) |
| 50 | **[50–52]** Bola rayada que pasa a marmolada junto a la cuadrícula pequeña; luego dos bolas. | que acabas de escribir, |  |
| 51 | ↳ | pone la bola nueva |  |
| 52 | ↳ | junto a la guardada y |  |
| 53 | **[53–55]** Las dos bolas se acercan y se superponen para compararse. Texto: "compara las vetas" (entra palabra por palabra, ver tira a 10 fps). | compara las betas. | 53.97 whoosh / swish (sobre voz) |
| 54 | ↳ | Si coinciden, | 54.28 pop / golpe medio; 54.44 whoosh / swish (sobre voz) |
| 55 | ↳ | entras. | 55.36 whoosh / swish (sobre voz); 55.97 bombo (música?) |
| 56 | **[56–59]** Las tiras vuelan en diagonal. La bola nueva se vuelve azul sólida con un glitch RGB de 2 fotogramas (57,4–57,5 s). Texto "incorrecta" en azul. En 59 se desintegra en partículas de colores. | Si no, la contraseña | 56.70 whoosh / swish |
| 57 | ↳ | es incorrecta | 57.97 whoosh / swish (sobre voz) |
| 58 | ↳ | y la red social nunca | 58.17 whoosh / swish (sobre voz) |
| 59 | ↳ | supo cuál era |  |
| 60 | **[60–61]** Bola grande sola, girando. | la correcta. Los programadores |  |
| 61 | ↳ | le llaman |  |
| 62 | **[62–64]** Texto "función hash". Fila de bolitas con letras sobre la bola y flechas circulares de rotación alrededor (63). En 64 el texto sale con desenfoque. | función hash a |  |
| 63 | ↳ | esa amasada y | 63.06 whoosh / swish (sobre voz); 63.97 bombo (música?) (sobre voz) |
| 64 | ↳ | a la bola, | 64.95 whoosh / swish |
| 65 | **[65–65]** Bola con anillo de selección lima. Texto: "el hash" (lima). | el hash. Cuando | 65.47 pop / golpe medio |
| 66 | **[66–69]** Cuadrícula 6×5 de bolas, una seleccionada con cuadro lima. Entran varios cursores azules que se llevan bolas y forman una pila triangular abajo. Texto: "los hashes" / "de todas las cuentas". | haquean una página, | 66.20 whoosh / swish (sobre voz); 66.63 pop / golpe medio (sobre voz) |
| 67 | ↳ | los hackers se llevan |  |
| 68 | ↳ | los hashes de todas | 68.97 whoosh / swish (sobre voz) |
| 69 | ↳ | las cuentas. | 69.97 whoosh / swish |
| 70 | **[70–71]** Un cursor toma una bola y la corta con una línea. | Como un hash no se |  |
| 71 | ↳ | puede revertir, | 71.97 pop / golpe medio |
| 72 | **[72–77]** Arriba, máquina con dos rodillos (picadora) a la que entran bolitas de letras. Contador monoespaciado: 0,000,000,001→0,010,125,555. Abajo, pila triangular de bolas. Textos "12345" y "123456". En 77 una línea lima une una bola con la pila (coincidencia). | hachean millones de | 72.73 whoosh / swish (sobre voz) |
| 73 | ↳ | contraseñas comunes |  |
| 74 | ↳ | como 123456 |  |
| 75 | ↳ | y | 75.97 pop / golpe medio (sobre voz) |
| 76 | ↳ | buscan cuál | 76.27 whoosh / swish (sobre voz) |
| 77 | ↳ | les da el mismo hash. |  |
| 78 | **[78–79]** Dos barras de contraseña y dos bolas con anillos lima que se superponen. | Para frenarlos, |  |
| 79 | ↳ | las páginas serias | 79.60 pop / golpe medio (sobre voz); 79.72 pop / golpe medio (sobre voz); 79.97 whoosh / swish (sobre voz) |
| 80 | **[80–86]** Texto "sal" (lima) arriba. Las bolas se aplanan en bloques rayados, caen partículas lima (la sal), los bloques se marcan con recuadro punteado y se vuelven a amasar. | le agregan sal. |  |
| 81 | ↳ | Una pizca | 81.47 pop / golpe medio; 81.72 pop / golpe medio (sobre voz); 81.87 whoosh / swish (sobre voz) |
| 82 | ↳ | de color al azar, | 82.60 pop / golpe medio (sobre voz) |
| 83 | ↳ | distinta para cada | 83.23 bombo (música?); 83.97 pop / golpe medio (sobre voz) |
| 84 | ↳ | cuenta, que entra | 84.47 pop / golpe medio (sobre voz); 84.73 pop / golpe medio; 84.97 whoosh / swish (sobre voz) |
| 85 | ↳ | a la función hash |  |
| 86 | ↳ | junto con tu contraseña. | 86.66 pop / golpe medio (sobre voz) |
| 87 | **[87–89]** Dos bolas distintas. Una bolita azul con cursor. | Así, | 87.47 pop / golpe medio; 87.97 pop / golpe medio |
| 88 | ↳ | dos personas con la | 88.21 pop / golpe medio (sobre voz) |
| 89 | ↳ | misma contraseña | 89.47 whoosh / swish (sobre voz) |
| 90 | **[90–92]** Contadores "0,010,699,555" y "0,000,000,039". Texto: "empezar de cero". | tienen hashes distintos |  |
| 91 | ↳ | y los hackers tienen | 91.08 pop / golpe medio (sobre voz); 91.47 pop / golpe medio (sobre voz); 91.72 pop / golpe medio (sobre voz) |
| 92 | ↳ | que empezar de cero | 92.38 ding / campana (tono) (sobre voz) |
| 93 | **[93–93]** Bola grande sola. | con cada una. | 93.97 pop / golpe medio (sobre voz) |
| 94 | **[94–99]** Zoom out a una cuadrícula enorme de bolas en tarjetas, con cuadro lima en una. Abajo a la izquierda, tarjeta tipo terminal "2019 / Brian Krebs" que se escribe letra por letra con cursor. | Pero eso no es |  |
| 95 | ↳ | lo más preocupante. | 95.97 whoosh / swish (sobre voz) |
| 96 | ↳ | En 2019, | 96.65 pop / golpe medio (sobre voz); 96.96 pop / golpe medio (sobre voz) |
| 97 | ↳ | el periodista | 97.71 pop / golpe medio; 97.86 whoosh / swish (sobre voz) |
| 98 | ↳ | Brian Krebs |  |
| 99 | ↳ | reveló que Facebook | 99.80 pop / golpe medio (sobre voz) |
| 100 | **[100–101]** Texto "Facebook" (blanco, arriba) sobre la cuadrícula. | llevaba años guardando | 100.65 whoosh / swish (sobre voz) |
| 101 | ↳ | cientos de | 101.87 whoosh / swish (sobre voz) |
| 102 | **[102–106]** Pantalla llena de cápsulas/píldoras de colores con texto (contraseñas en texto plano). Contador lima 446,481,219→603,687,666. Textos: "cientos de millones", "sin hashear". | millones de contraseñas |  |
| 103 | ↳ | sin hachear, | 103.97 bombo (música?) (sobre voz) |
| 104 | ↳ | en archivos que podían | 104.50 pop / blip (sobre voz) |
| 105 | ↳ | leer miles de |  |
| 106 | ↳ |  |  |
| 107 | **[107–109]** Las cápsulas llenan todo el cuadro y se desordenan. | Cinco años después, | 107.97 pop / golpe medio (sobre voz) |
| 108 | ↳ | el regulador de | 108.38 pop / golpe medio |
| 109 | ↳ | datos de Irlanda multó |  |
| 110 | **[110–112]** Etiqueta-sello azul inclinada "multó a Meta". Texto: "solo por" / "no hashearlas" (lima). | a Meta, la dueña | 110.15 pop / golpe medio (sobre voz); 110.41 pop / golpe medio (sobre voz) |
| 111 | ↳ | de Facebook, solo | 111.76 whoosh / swish; 111.97 whoosh / swish (sobre voz) |
| 112 | ↳ | por no hachearlas. |  |
| 113 | **[113–113]** Rectángulo azul oscuro (archivo). Hay un corte duro en 109,93 s. | De ahí sale | 113.35 pop / golpe medio; 113.97 pop / golpe medio (sobre voz) |
| 114 | **[114–119]** Calendario 3D blanco con encabezado azul y un día en rojo. Fila de puntos de colores abajo. Etiqueta "cada tres meses". Se multiplica en 4 calendarios. | un play -talk, |  |
| 115 | ↳ | cambiar la contraseña | 115.10 whoosh / swish (sobre voz) |
| 116 | ↳ | cada tres meses. | 116.18 pop / golpe medio (sobre voz) |
| 117 | ↳ | Muchos bancos | 117.34 pop / golpe medio; 117.64 pop / blip (sobre voz) |
| 118 | ↳ | y oficinas lo exigen. |  |
| 119 | ↳ | El NIST, | 119.35 bombo (música?); 119.54 pop / golpe medio (sobre voz) |
| 120 | **[120–127]** Documento "NIST" (papel con borde rojo a la izquierda) y "2017" en rojo. Líneas del documento resaltadas en lima. | el Instituto de Normas | 120.25 pop / golpe medio |
| 121 | ↳ | de Estados Unidos, | 121.97 pop / golpe medio |
| 122 | ↳ | dice desde 2017 | 122.26 pop / golpe medio (sobre voz) |
| 123 | ↳ | que solo |  |
| 124 | ↳ | se cambie cuando alguien | 124.32 pop / golpe medio (sobre voz); 124.99 whoosh / swish (sobre voz) |
| 125 | ↳ | pudo ver las | 125.97 whoosh / swish (sobre voz) |
| 126 | ↳ | tiras, como en Facebook. |  |
| 127 | ↳ | Si no, | 127.34 pop / golpe medio; 127.97 bombo (música?) |
| 128 | **[128–131]** Bola marmolada, tiras dispersas y cursor. Texto: "perro125" (lima). | cambiar la no protege. | 128.13 whoosh / swish |
| 129 | ↳ | Y la gente |  |
| 130 | ↳ | acaba usando perro |  |
| 131 | ↳ | 125. | 131.97 whoosh / swish |
| 132 | **[132–136]** Botón píldora blanca "olvidé mi contraseña". La bola se rodea de un anillo punteado y se vuelve azul. | Cuando le das a Olvidemi | 132.97 pop / golpe medio (sobre voz) |
| 133 | ↳ | Contraseña, |  |
| 134 | ↳ | una página seria | 134.62 pop / golpe medio (sobre voz) |
| 135 | ↳ | no te la puede |  |
| 136 | ↳ | mandar. Te manda | 136.51 pop / golpe medio; 136.75 whoosh / swish (sobre voz) |
| 137 | **[137–137]** Botón lima pequeño (el enlace). | un enlace para crear |  |
| 138 | **[138–139]** Anillo de tiras alrededor de una bola rayada. Texto: "una contraseña nueva". | una contraseña nueva. |  |
| 139 | ↳ | Si alguna | 139.77 pop / blip |
| 140 | **[140–143]** Sobre de email blanco del que sale una pila de tiras. En 143 se tacha con línea azul. | te manda tu contraseña |  |
| 141 | ↳ | de vuelta, esa | 141.96 pop / golpe medio (sobre voz) |
| 142 | ↳ | página nunca la | 142.60 pop / golpe medio (sobre voz) |
| 143 | ↳ | hacheó. Y por | 143.74 whoosh / swish |
| 144 | **[144–147]** Pila de tiras con cursor y lista de 4 barras de contraseña iguales con contorno lima. Texto: "la misma contraseña / en todos los sitios" ("misma" en lima). | eso no es recomendable |  |
| 145 | ↳ | usar la misma contraseña | 145.12 ding / campana (tono) (sobre voz) |
| 146 | ↳ | en todos |  |
| 147 | ↳ | los sitios. | 147.86 pop / golpe medio |
| 148 | **[148–150]** Anillos de tiras rodean la barra y vuelve el plano inicial (anillo + bola + barra "TikTok"): loop perfecto. | Y cuando una página lo | 148.07 whoosh / swish (sobre voz) |
| 149 | ↳ | hace bien... |  |
| 150 | ↳ |  |  |

## Video 2: Pensar en sexo cada 7 segundos (126.3 s)

- Voz: 397 palabras, **188.7 ppm** de media sobre la duración total; pausas >0,4 s: 12 (2.9s (0.48s), 6.3s (0.42s), 8.6s (0.44s), 11.1s (0.42s), 18.9s (0.52s), 23.2s (0.44s), 72.0s (0.74s), 89.4s (0.42s), 90.9s (0.62s), 106.6s (0.82s), 117.4s (0.42s), 119.4s (0.52s)).
- Loudness integrado: **-17.1 LUFS**. F0 mediana estimada: 166.7 Hz (estimación automática, no concluyente). BPM estimado por autocorrelación: 120.0 (poco fiable, ver guía).
- Cortes duros detectados (scdet umbral 12): ninguno. Todo lo demás son transformaciones o movimientos de cámara continuos.
- SFX detectados: 108 (≈0.86 por segundo).

| s | Visual | Voz | SFX |
|---|---|---|---|
| 0 | **[0–5]** Contador de mano rojo (ilustración 3D con sombreado de semitono) sobre una plataforma gris elíptica. Rebota en cada clic, los dígitos ruedan 0001→0011 y saltan bolitas rojas al suelo. Texto MAYÚSCULAS arriba: "NO PIENSAN EN SEXO" ("SEXO" tachado) / "CADA 7 SEGUNDOS". | Los hombres no piensan |  |
| 1 | ↳ | en sexo cada | 1.02 pop / golpe medio (sobre voz) |
| 2 | ↳ | 7 segundos. |  |
| 3 | ↳ | Piensan en sexo |  |
| 4 | ↳ | casi las mismas | 4.20 pop / golpe medio (sobre voz) |
| 5 | ↳ | veces al día que en | 5.14 pop / golpe medio (sobre voz); 5.79 whoosh / swish (sobre voz) |
| 6 | **[6–8]** Aparece un segundo contador blanco/gris más pequeño (comida). Texto: "CASI LAS MISMAS VECES / QUE EN COMER". | comer. Y eso |  |
| 7 | ↳ | se midió con un contador |  |
| 8 | ↳ | de mano. | 8.99 pop / golpe medio |
| 9 | **[9–11]** Zoom fuerte al contador (0018–0019). Texto: "UN CLIC" ("CLIC" lima). Rayitas lima de impacto alrededor del botón. En 10, primer plano extremo del display verde. | Un clic con el pulgar | 9.21 pop / golpe medio (sobre voz); 9.38 pop / golpe medio (sobre voz) |
| 10 | ↳ | por cada pensamiento. |  |
| 11 | ↳ | 7 segundos |  |
| 12 | **[12–19]** Contador azul (0000→0018) junto al rojo en 0019. Abajo, una línea de tiempo se llena de marcas azules. Texto: "CASI 20 VECES". | entre un pensamiento |  |
| 13 | ↳ | y otro significa que, | 13.97 whoosh / swish (sobre voz) |
| 14 | ↳ | en lo que dura | 14.58 whoosh / swish |
| 15 | ↳ | este video, | 15.97 whoosh / swish |
| 16 | ↳ | un hombre ya habría pensado |  |
| 17 | ↳ | en sexo casi | 17.82 whoosh / swish (sobre voz); 17.97 pop / blip (sobre voz) |
| 18 | ↳ | 20 veces. | 18.23 whoosh / swish (sobre voz) |
| 19 | ↳ | En un día de 16 | 19.17 whoosh / swish; 19.38 whoosh / swish (sobre voz) |
| 20 | **[20–21]** Texto "16 HORAS DESPIERTO" sobre un rectángulo azul marino con líneas (hoja). | horas despierto, |  |
| 21 | ↳ | serían más de |  |
| 22 | **[22–22]** Texto "MÁS DE / 7.99…" con número azul rodando. Rectángulo azul. | 8 mil veces. |  |
| 23 | **[23–23]** El rectángulo azul se vuelve una hoja blanca que crece hasta llenar la pantalla (transición de unos 0,7 s). | La frase |  |
| 24 | **[24–31]** Fondo crema #efe9e1. Hoja de encuesta con casillas que se marcan. Sello azul "INSTITUTO KINSEY" estampado e inclinado. "ENCUESTA" se escribe a máquina. | de los 7 segundos |  |
| 25 | ↳ | suele atribuirse |  |
| 26 | ↳ | al Instituto Kinsi, | 26.52 pop / golpe medio (sobre voz); 26.67 pop / golpe medio (sobre voz) |
| 27 | ↳ | el centro de Estados | 27.28 pop / golpe medio |
| 28 | ↳ | Unidos que estudia sexualidad. |  |
| 29 | ↳ | Pero | 29.91 whoosh / swish (sobre voz) |
| 30 | ↳ | una encuesta del propio |  |
| 31 | ↳ | instituto dice | 31.87 pop / golpe medio (sobre voz) |
| 32 | **[32–40]** Cuadrícula 10×10 de círculos que se rellenan de rojo hasta 54. Textos: "54 DE CADA 100 HOMBRES" y, en monoespaciada pequeña, "TODOS LOS DÍAS O VARIAS VECES AL DÍA"; luego "VARIAS VECES, NO" + "8.0"→"8.000" en azul. | que unos 54 | 32.10 whoosh / swish (sobre voz) |
| 33 | ↳ | de cada 100 | 33.58 pop / golpe medio (sobre voz) |
| 34 | ↳ | hombres piensan | 34.68 pop / golpe medio (sobre voz) |
| 35 | ↳ | en sexo todos los | 35.62 pop / golpe medio (sobre voz) |
| 36 | ↳ | días o varias veces | 36.94 whoosh / swish (sobre voz) |
| 37 | ↳ | al día. Varias | 37.85 golpe grave / impacto (sobre voz) |
| 38 | ↳ | veces, no |  |
| 39 | ↳ | 8 mil. Y esa | 39.54 pop / golpe medio; 39.81 whoosh / swish (sobre voz) |
| 40 | ↳ | encuesta se contestaba |  |
| 41 | **[41–41]** Una bolita roja sola sobre crema (transición). | de memoria. Terry |  |
| 42 | **[42–47]** Fondo negro. Tarjeta de papel con borde rojo "TERRI FISHER / UNIVERSIDAD ESTATAL DE OHIO / 2012", que se escribe. Contador rojo 0000→0003. | Fisher, una psicóloga | 42.72 golpe grave / impacto |
| 43 | ↳ | de la Universidad |  |
| 44 | ↳ | Estatal de Ohio, |  |
| 45 | ↳ | sí llevó la cuenta. | 45.97 whoosh / swish (sobre voz) |
| 46 | ↳ | En 2012 le | 46.39 whoosh / swish (sobre voz) |
| 47 | ↳ | dio a 283 | 47.97 whoosh / swish (sobre voz) |
| 48 | **[48–50]** Nube de puntos rojos y lavanda que se ordena. "283" rodando y "ESTUDIANTES". Quedan dos bloques de puntos: rojo = hombres, lavanda = mujeres. | estudiantes |  |
| 49 | ↳ | universitarios |  |
| 50 | ↳ | un contador de golf, |  |
| 51 | **[51–54]** Texto: "CONTADOR DE GOLF". | el que sirve para |  |
| 52 | ↳ | contarlos golpes, |  |
| 53 | ↳ | y les pidió apretarlo | 53.90 pop / golpe medio (sobre voz) |
| 54 | ↳ | durante una | 54.80 whoosh / swish (sobre voz) |
| 55 | **[55–57]** Texto "UNA SEMANA" con mini barras. Los bloques se redistribuyen. | semana. A unos |  |
| 56 | ↳ | les tocó apretarlo |  |
| 57 | ↳ | cada vez que pensaban | 57.32 ding / campana (tono) (sobre voz); 57.77 pop / golpe medio (sobre voz) |
| 58 | **[58–62]** Tres filas: SEXO (tachado), COMIDA, DORMIR, con íconos (bolitas, plato, luna) y bloques de puntos. | en sexo. A |  |
| 59 | ↳ | otros en comida, | 59.77 whoosh / swish (sobre voz) |
| 60 | ↳ | y a otros | 60.04 pop / golpe medio (sobre voz) |
| 61 | ↳ | en dormir. Les | 61.11 whoosh / swish (sobre voz); 61.89 whoosh / swish |
| 62 | ↳ | dijeron que el estudio era | 62.35 pop / golpe medio (sobre voz); 62.98 pop / golpe medio (sobre voz) |
| 63 | **[63–65]** Tarjeta inclinada tipo sello: "SOBRE / SALUD / A PROPÓSITO". | sobre salud, para |  |
| 64 | ↳ | que nadie pintara | 64.15 pop / golpe medio (sobre voz); 64.87 whoosh / swish (sobre voz) |
| 65 | ↳ | en sexo a propósito. | 65.97 pop / golpe medio (sobre voz) |
| 66 | **[66–68]** Hoja azul marino grande. | Un hombre típico |  |
| 67 | ↳ | apretó el contador de |  |
| 68 | ↳ | sexo unas 19 |  |
| 69 | **[69–74]** "19" rojo grande y "10" lavanda, con puntos dispersos sobre la hoja oscura. Los números se achican. | veces al día, | 69.53 whoosh / swish (sobre voz) |
| 70 | ↳ | y una mujer típica, |  |
| 71 | ↳ | unas 10. | 71.47 whoosh / swish; 71.97 whoosh / swish (sobre voz) |
| 72 | ↳ | Las veces | 72.47 pop / golpe medio |
| 73 | ↳ | que el mito le pone | 73.70 pop / golpe medio (sobre voz) |
| 74 | ↳ | a un hombre en lo que |  |
| 75 | **[75–76]** Texto "…LO QUE DURA ESTE VIDEO" con línea de marcas. | dura este video, | 75.97 whoosh / swish |
| 76 | ↳ | el estudio las midió | 76.12 whoosh / swish (sobre voz) |
| 77 | **[77–80]** Una línea diagonal azul cruza y se vuelve vertical. Contadores rojo y blanco arriba. Texto: "CASI IGUAL". | en un día entero. | 77.17 pop / blip (sobre voz) |
| 78 | ↳ | Y el contador |  |
| 79 | ↳ | de comida de los hombres |  |
| 80 | ↳ | quedó casi igual. | 80.52 ding / campana (tono) (sobre voz) |
| 81 | **[81–81]** Los puntos caen. | Los hombres apretaron |  |
| 82 | **[82–90]** Gráfico de puntos con eje vertical: SEXO 19/10, COMIDA 18/15, DORMIR 11/8,5 (números en rojo y lavanda). | el de comida unas |  |
| 83 | ↳ | 18 veces |  |
| 84 | ↳ | al día, y las |  |
| 85 | ↳ | mujeres, 15. En | 85.47 pop / golpe medio; 85.61 pop / golpe medio (sobre voz); 85.97 pop / golpe medio (sobre voz) |
| 86 | ↳ | sueño, | 86.33 pop / golpe medio (sobre voz); 86.97 whoosh / swish |
| 87 | ↳ | ellos llegaron a 11 | 87.09 whoosh / swish (sobre voz); 87.97 pop / golpe medio (sobre voz) |
| 88 | ↳ | y ellas a 8 |  |
| 89 | ↳ | y media. Fisher | 89.47 whoosh / swish |
| 90 | ↳ | lo resumió así. | 90.97 whoosh / swish |
| 91 | **[91–93]** Tarjeta "LOS HOMBRES PENSARON MÁS EN TODO". Texto: "NO SOLO EN SEXO" ("SEXO" tachado). | Los hombres pensaron | 91.36 pop / golpe medio; 91.47 pop / golpe medio; 91.97 pop / golpe medio (sobre voz) |
| 92 | ↳ | más en todo, | 92.71 pop / golpe medio (sobre voz) |
| 93 | ↳ | no solo. | 93.47 golpe grave / impacto; 93.97 pop / golpe medio |
| 94 | **[94–94]** Las filas de puntos se separan. | Pero eso | 94.23 pop / golpe medio; 94.47 whoosh / swish (sobre voz); 94.95 pop / golpe medio (sobre voz) |
| 95 | **[95–103]** Los puntos forman un anillo que gira. Textos: "PERO ESO NO ES LO MÁS RARO" y "NO ERA SER HOMBRE O MUJER" (tachado). | no es lo más raro. |  |
| 96 | ↳ | Al juntar a | 96.23 pop / golpe medio; 96.47 pop / golpe medio |
| 97 | ↳ | todos los estudiantes, | 97.12 pop / golpe medio (sobre voz); 97.97 pop / golpe medio (sobre voz) |
| 98 | ↳ | lo que mejor predecía | 98.23 pop / golpe medio; 98.44 pop / golpe medio (sobre voz); 98.97 pop / golpe medio (sobre voz) |
| 99 | ↳ | cuantas veces |  |
| 100 | ↳ | iba a apretar alguien |  |
| 101 | ↳ | el contador de sexo, | 101.72 pop / golpe medio (sobre voz); 101.97 pop / golpe medio (sobre voz) |
| 102 | ↳ | no era ser hombre |  |
| 103 | ↳ | o mujer. | 103.72 pop / golpe medio; 103.97 bombo (música?) |
| 104 | **[104–111]** Los puntos caen a un eje lima y forman un histograma que crece. Textos: "QUÉ TAN A GUSTO" + "CON SU PROPIA SEXUALIDAD" (monoespaciada, tachada) y "CUESTIONARIO" con una hoja. | Era ¿qué tan a gusto se | 104.47 pop / golpe medio (sobre voz); 104.97 pop / golpe medio (sobre voz) |
| 105 | ↳ | sentía cada quien | 105.61 pop / golpe medio (sobre voz) |
| 106 | ↳ | con su propio? | 106.73 pop / golpe medio; 106.97 whoosh / swish |
| 107 | ↳ | Algo que | 107.23 pop / golpe medio; 107.47 pop / golpe medio (sobre voz); 107.72 whoosh / swish (sobre voz) |
| 108 | ↳ | Fisher midió con un | 108.19 pop / golpe medio (sobre voz) |
| 109 | ↳ | cuestionario, y | 109.72 pop / golpe medio; 109.92 whoosh / swish (sobre voz) |
| 110 | ↳ | hubo un hombre que apretó |  |
| 111 | ↳ | más que nadie. | 111.97 whoosh / swish (sobre voz) |
| 112 | **[112–114]** Contador rojo grande con desenfoque de movimiento (zoom in) y luego un reloj de 24 h con luna y sol. | Ese estudiante | 112.39 whoosh / swish (sobre voz) |
| 113 | ↳ | apretó el contador | 113.14 pop / golpe medio (sobre voz) |
| 114 | ↳ | de sexo 388 | 114.47 whoosh / swish (sobre voz); 114.97 pop / blip (sobre voz) |
| 115 | **[115–121]** Contador pequeño arriba a la izquierda y "288"→"388" rojo grande. Puntos rojos llenan el reloj, la aguja gira y aparece un anillo lima. Textos: "EN UN SOLO DÍA", "EL RÉCORD" (lima). | veces | 115.47 pop / golpe medio (sobre voz) |
| 116 | ↳ | en un solo |  |
| 117 | ↳ | día, el récord | 117.80 whoosh / swish |
| 118 | ↳ | de todo el | 118.69 whoosh / swish (sobre voz) |
| 119 | ↳ | estudio. Y |  |
| 120 | ↳ | ese récord se acercó |  |
| 121 | ↳ | a las 8 .000 |  |
| 122 | **[122–123]** El fondo cambia a azul con patrón de semitono y ondas concéntricas. Tarjeta "7.999"→"8.000 / VECES DEL MITO" en azul. | veces del mito. | 122.15 pop / golpe medio (sobre voz); 122.76 ding / campana (tono) (sobre voz) |
| 123 | ↳ | Porque, contado, | 123.43 pop / blip (sobre voz) |
| 124 | **[124–125]** Vuelve el contador solo en 0002 sobre la plataforma: loop al inicio. | clic por clic. | 124.47 pop / blip; 124.93 pop / golpe medio (sobre voz) |
| 125 | ↳ |  | 125.18 pop / golpe medio |
| 126 |  |  |  |

## Video 3: El espermatozoide no ganó una carrera (138.5 s)

- Voz: 425 palabras, **184.2 ppm** de media sobre la duración total; pausas >0,4 s: 10 (12.6s (0.5s), 17.4s (0.56s), 19.0s (0.7s), 25.4s (0.54s), 32.2s (0.42s), 41.9s (0.44s), 73.5s (0.44s), 74.5s (0.46s), 104.2s (0.6s), 135.5s (0.44s)).
- Loudness integrado: **-17.0 LUFS**. F0 mediana estimada: 168.4 Hz (estimación automática, no concluyente). BPM estimado por autocorrelación: 120.0 (poco fiable, ver guía).
- Cortes duros detectados (scdet umbral 12): [18.2, 33.0, 33.03]. Todo lo demás son transformaciones o movimientos de cámara continuos.
- SFX detectados: 130 (≈0.94 por segundo).

| s | Visual | Voz | SFX |
|---|---|---|---|
| 0 | **[0–3]** Óvulo (esfera rojo-naranja #f54a20 con semitono) rodeado de una corona de células blancas como piedritas con contorno, y filamentos rojos. Cientos de espermatozoides blancos (uno lima) nadan hacia arriba. Texto: "NO GANÓ / NINGUNA CARRERA". | El espermatozoide que | 0.13 pop / golpe medio (sobre voz) |
| 1 | ↳ | te hizo no ganó | 1.12 pop / golpe medio (sobre voz) |
| 2 | ↳ | ninguna carrera, | 2.18 pop / golpe medio (sobre voz) |
| 3 | ↳ | lo escogió el |  |
| 4 | **[4–5]** Zoom extremo a la superficie punteada del óvulo. Texto: "LO ESCOGIÓ / EL ÓVULO" (rojo). | óvulo. Alrededor | 4.66 whoosh / swish (sobre voz) |
| 5 | ↳ | del óvulo hay un | 5.72 whoosh / swish (sobre voz) |
| 6 | **[6–11]** La cámara se aleja. Textos: "UNOS" (rojo) / "OTROS" (blanco) / "SEGÚN DE QUIÉN VENGAN". | líquido que jala a | 6.14 pop / golpe medio (sobre voz); 6.39 pop / golpe medio (sobre voz); 6.94 whoosh / swish (sobre voz) |
| 7 | ↳ | unos espermatozoides más |  |
| 8 | ↳ | que a otros, | 8.97 whoosh / swish |
| 9 | ↳ | según de quién vengan. | 9.80 pop / golpe medio (sobre voz) |
| 10 | ↳ | Los libros de | 10.45 pop / golpe medio |
| 11 | ↳ | texto lo cuentan como | 11.06 pop / golpe medio (sobre voz) |
| 12 | **[12–17]** Carriles verticales tipo pista (líneas azules) con espermatozoides en fila. Contador 101,337,920→200,000,000. Texto: "EL MÁS RÁPIDO" (azul). | una carrera. |  |
| 13 | ↳ | 200 millones de | 13.17 pop / golpe medio (sobre voz) |
| 14 | ↳ | espermatozoides salen |  |
| 15 | ↳ | juntos y el | 15.52 ding / campana (tono) (sobre voz); 15.85 whoosh / swish (sobre voz) |
| 16 | ↳ | más rápido llega | 16.59 pop / golpe medio (sobre voz) |
| 17 | ↳ | primero. En | 17.21 pop / golpe medio (sobre voz); 17.47 whoosh / swish; 17.97 whoosh / swish (sobre voz) |
| 18 | **[18–18]** Transición: la pista se vuelve papel crema (corte en 18,2 s). | 1991, | 18.09 whoosh / swish (sobre voz) |
| 19 | **[19–30]** Ilustración de libro de texto en crema (grabado blanco y negro) con meta a cuadros. Tarjeta terminal negra "1991 / EMILY MARTIN / SIGNS". Zoom in. Etiquetas: "EL HOMBRE CONQUISTA" / "LA MUJER ESPERA QUIETA" / "MAL DIBUJADA". | la antropóloga | 19.24 whoosh / swish; 19.48 golpe grave / impacto; 19.62 whoosh / swish |
| 20 | ↳ | Emily Martin | 20.43 whoosh / swish (sobre voz) |
| 21 | ↳ | escribió en | 21.31 pop / golpe medio (sobre voz); 21.93 whoosh / swish (sobre voz) |
| 22 | ↳ | la revista Saints que |  |
| 23 | ↳ | ese relato | 23.20 pop / golpe medio (sobre voz); 23.96 pop / golpe medio (sobre voz) |
| 24 | ↳ | copiaba los papeles de | 24.78 whoosh / swish (sobre voz) |
| 25 | ↳ | siempre. El | 25.47 whoosh / swish; 25.94 whoosh / swish (sobre voz) |
| 26 | ↳ | hombre conquista y |  |
| 27 | ↳ | la mujer espera quieta. | 27.03 pop / golpe medio (sobre voz); 27.59 pop / golpe medio (sobre voz); 27.81 whoosh / swish (sobre voz) |
| 28 | ↳ | Y la carrera | 28.67 pop / golpe medio (sobre voz) |
| 29 | ↳ | está mal dibujada |  |
| 30 | ↳ | hasta incomodada | 30.29 ding / campana (tono) (sobre voz) |
| 31 | **[31–32]** Viñeta circular crema con un espermatozoide azul que se menea. | los espermatozoides. |  |
| 32 | ↳ | Desde 1677, |  |
| 33 | **[33–39]** Microscopio antiguo de latón (ilustrado) con un espermatozoide en el ocular. Arriba "1677"; abajo "ANTONIE VAN LEEUWENHOEK" (monoespaciada). |  |  |
| 34 | ↳ | cuando el holandés | 34.34 pop / golpe medio |
| 35 | ↳ | Antoni van Levenjuk | 35.34 pop / golpe medio (sobre voz); 35.53 pop / golpe medio (sobre voz) |
| 36 | ↳ | los vio en su |  |
| 37 | ↳ | microscopio, | 37.97 whoosh / swish |
| 38 | ↳ | los espermatozoides se | 38.45 whoosh / swish (sobre voz) |
| 39 | ↳ | dibujan meneando la | 39.45 whoosh / swish (sobre voz) |
| 40 | **[40–41]** Espermatozoide azul en la viñeta. Texto: "DE LADO A LADO". | cola de lado a lado. |  |
| 41 | ↳ | En 2020, | 41.37 pop / golpe medio (sobre voz); 41.63 pop / golpe medio (sobre voz) |
| 42 | **[42–49]** Dos círculos tipo placa oscura de microscopio con espermatozoides blancos. Textos: "2020", "UNAM / UNIVERSIDAD DE BRISTOL", "TRES DIMENSIONES" y "HACIA UN LADO" con flecha curva azul. | un equipo de la UNAM | 42.02 pop / golpe medio |
| 43 | ↳ | y de la Universidad |  |
| 44 | ↳ | de Bristol los grabó |  |
| 45 | ↳ | en tres dimensiones. | 45.22 pop / golpe medio (sobre voz); 45.46 pop / golpe medio (sobre voz) |
| 46 | ↳ | La cola del |  |
| 47 | ↳ | espermatozoide solo | 47.97 whoosh / swish (sobre voz) |
| 48 | ↳ | se dobla hacia un |  |
| 49 | ↳ | lado. Para no | 49.71 whoosh / swish (sobre voz) |
| 50 | **[50–59]** El espermatozoide gira como sacacorchos con un anillo rojo alrededor. Textos: "SACACORCHOS" y "VISTO DESDE ARRIBA" (dos vistas). | nadar en círculos, |  |
| 51 | ↳ | gira todo el cuerpo | 51.39 whoosh / swish (sobre voz); 51.97 pop / golpe medio (sobre voz) |
| 52 | ↳ | como un sacacorchos. | 52.55 whoosh / swish (sobre voz) |
| 53 | ↳ | Y visto desde arriba, | 53.38 pop / golpe medio (sobre voz) |
| 54 | ↳ | en un microscopio | 54.36 pop / golpe medio |
| 55 | ↳ | normal, ese giro | 55.70 pop / golpe medio; 55.97 whoosh / swish (sobre voz) |
| 56 | ↳ | parece un meneo. | 56.72 whoosh / swish (sobre voz) |
| 57 | ↳ | Importa menos | 57.40 pop / golpe medio (sobre voz) |
| 58 | ↳ | qué tan rápido mueve | 58.23 pop / golpe medio (sobre voz) |
| 59 | ↳ | la cola que cómo | 59.70 pop / golpe medio (sobre voz); 59.97 whoosh / swish (sobre voz) |
| 60 | **[60–61]** Espermatozoide solo. Texto: "CÓMO LA MUEVE". En 61 caen cabezas grandes a cuadros y rojas (transición). | la mueve. Y |  |
| 61 | ↳ | el rumbo de los espermatozoides | 61.97 whoosh / swish (sobre voz) |
| 62 | **[62–73]** Vuelve el óvulo: "LO DECIDE / EL ÓVULO" (rojo). En 66–68, zoom a la corona con una nube química roja de semitono y el texto "SEÑALES QUÍMICAS". En 72 el óvulo se abre como un tazón. Texto: "EL OLOR DE UNOS TACOS". | lo decide |  |
| 63 | ↳ | el óvulo. | 63.15 whoosh / swish (sobre voz); 63.97 whoosh / swish |
| 64 | ↳ | El óvulo sale del ovario |  |
| 65 | ↳ | envuelto en ese | 65.33 pop / golpe medio (sobre voz); 65.97 whoosh / swish (sobre voz) |
| 66 | ↳ | líquido que suelta señales | 66.62 whoosh / swish (sobre voz) |
| 67 | ↳ | químicas. Y | 67.62 pop / blip (sobre voz); 67.97 whoosh / swish (sobre voz) |
| 68 | ↳ | los espermatozoides | 68.10 whoosh / swish (sobre voz) |
| 69 | ↳ | nadan hacia donde la |  |
| 70 | ↳ | señal es más fuerte, | 70.55 pop / golpe medio (sobre voz) |
| 71 | ↳ | como tú caminas | 71.35 whoosh / swish; 71.97 whoosh / swish (sobre voz) |
| 72 | ↳ | hacia el olor de |  |
| 73 | ↳ | unos tacos. En | 73.91 pop / golpe medio (sobre voz) |
| 74 | **[74–74]** Bolita roja sola con "2020" (transición). | 2020, el | 74.39 ding / campana (tono) (sobre voz); 74.85 pop / golpe medio |
| 75 | **[75–87]** Tarjeta "2020 / JOHN FITZPATRICK / UNIVERSIDAD DE ESTOCOLMO" que se escribe. Laberinto en Y (tubos) con una esfera roja y una azul arriba y una cámara abajo con espermatozoides. Textos: "SU PAREJA" / "OTRA MUJER". Contadores "414" y "549" en recuadros; las partículas suben por cada lado. | biólogo John Fitzpatrick | 75.44 pop / golpe medio (sobre voz) |
| 76 | ↳ | de la Universidad |  |
| 77 | ↳ | de Estocolmo puso | 77.97 golpe grave / impacto (sobre voz) |
| 78 | ↳ | los espermatozoides |  |
| 79 | ↳ | de hombres en tratamiento |  |
| 80 | ↳ | de fertilidad frente |  |
| 81 | ↳ | al líquido del óvulo | 81.97 whoosh / swish (sobre voz) |
| 82 | ↳ | de su pareja y |  |
| 83 | ↳ | al de otra mujer, | 83.46 pop / golpe medio (sobre voz); 83.97 pop / golpe medio |
| 84 | ↳ | y contó cuántos | 84.23 pop / golpe medio |
| 85 | ↳ | nadaban hacia cada uno. |  |
| 86 | ↳ | El líquido | 86.57 whoosh / swish (sobre voz) |
| 87 | ↳ | de cada mujer jaló | 87.28 pop / golpe medio (sobre voz); 87.97 whoosh / swish (sobre voz) |
| 88 | **[88–99]** Cuadrícula 4×4 de módulos (tarjetas con bolitas roja, azul y blanca). Textos: "CIERTOS HOMBRES", "NO SIEMPRE FUE SU PAREJA" y "PAREJAS SANAS" (fila de 4). | más a los espermatozoides |  |
| 89 | ↳ | de ciertos |  |
| 90 | ↳ | hombres, y el favorito |  |
| 91 | ↳ | no siempre |  |
| 92 | ↳ | fue su pareja. |  |
| 93 | ↳ | Que el líquido prefiere |  |
| 94 | ↳ | a otro hombre, podría | 94.09 pop / golpe medio (sobre voz) |
| 95 | ↳ | explicar por qué |  |
| 96 | ↳ | algunas parejas sanas |  |
| 97 | ↳ | les cuesta | 97.97 pop / golpe medio (sobre voz) |
| 98 | ↳ | embarazarse. Eso | 98.13 ding / campana (tono) (sobre voz); 98.99 pop / golpe medio (sobre voz) |
| 99 | ↳ | sí, el equipo lo | 99.64 pop / golpe medio; 99.97 pop / golpe medio (sobre voz) |
| 100 | **[100–101]** Placa circular con cuadrícula. Texto monoespaciado "EN UN LAB" y "NO DENTRO DEL…" que se desvanece. | midió en un laboratorio, | 100.50 pop / golpe medio (sobre voz) |
| 101 | ↳ | no dentro | 101.49 golpe grave / impacto; 101.97 pop / golpe medio (sobre voz) |
| 102 | **[102–104]** Óvulo otra vez. Texto: "NO ES LO MÁS RARO". | del cuerpo. Pero | 102.73 whoosh / swish |
| 103 | ↳ | eso no es lo más raro. |  |
| 104 | ↳ | Al | 104.23 pop / golpe medio; 104.47 pop / golpe medio; 104.73 pop / golpe medio; 104.84 whoosh / swish (sobre voz) |
| 105 | **[105–133]** Zoom a la corona: células blancas con semitono y gel lavanda. Espermatozoides con cabeza roja pegados y uno azul. Textos y eventos en orden: "NO ENTRAN" (azul); partículas lima (químicos) con "LA PUNTA DE LA CABEZA" (monoespaciada); "LOS QUE VIENEN DETRÁS"; "UNOS CUANTOS CIENTOS"; entra un espermatozoide lima; "LLEGA TARDE" (lima); "EL ÓVULO LO DEJA PASAR" (rojo). | óvulo lo envuelve una |  |
| 106 | ↳ | corona de células pegadas |  |
| 107 | ↳ | con una especie | 107.04 whoosh / swish (sobre voz); 107.47 whoosh / swish (sobre voz) |
| 108 | ↳ | de gel, y | 108.73 pop / golpe medio; 108.97 pop / golpe medio (sobre voz) |
| 109 | ↳ | los primeros espermatozoides | 109.72 pop / golpe medio (sobre voz) |
| 110 | ↳ | que llegan no |  |
| 111 | ↳ | entran. Sueltan | 111.72 pop / golpe medio; 111.97 pop / blip (sobre voz) |
| 112 | ↳ | los químicos que traen |  |
| 113 | ↳ | en la punta de la cabeza, | 113.67 pop / golpe medio (sobre voz); 113.97 pop / golpe medio (sobre voz) |
| 114 | ↳ | disuelven | 114.97 ding / campana (tono) (sobre voz) |
| 115 | ↳ | ese gel y se gastan | 115.72 pop / golpe medio (sobre voz) |
| 116 | ↳ | ahí, abriéndoles | 116.57 pop / golpe medio; 116.73 whoosh / swish |
| 117 | ↳ | paso a los que vienen | 117.47 pop / blip (sobre voz) |
| 118 | ↳ | detrás. De | 118.47 whoosh / swish (sobre voz); 118.73 whoosh / swish |
| 119 | ↳ | los 200 millones de | 119.47 whoosh / swish (sobre voz) |
| 120 | ↳ | espermatozoides, |  |
| 121 | ↳ | al óvulo llegan | 121.23 pop / golpe medio; 121.47 pop / golpe medio (sobre voz) |
| 122 | ↳ | unos cuantos cientos, |  |
| 123 | ↳ | y casi todos | 123.36 pop / golpe medio; 123.56 pop / golpe medio (sobre voz) |
| 124 | ↳ | terminan trabajando para |  |
| 125 | ↳ | uno solo. | 125.97 pop / golpe medio (sobre voz) |
| 126 | ↳ | El que entra casi | 126.23 pop / golpe medio; 126.97 pop / golpe medio (sobre voz) |
| 127 | ↳ | nunca es de los |  |
| 128 | ↳ | primeros. Llega | 128.73 pop / golpe medio |
| 129 | ↳ | tarde, cuando los | 129.47 pop / golpe medio (sobre voz) |
| 130 | ↳ | demás ya le abrieron el |  |
| 131 | ↳ | camino y el óvulo |  |
| 132 | ↳ | lo deja pasar. |  |
| 133 | ↳ | En esto, llegar primero | 133.01 whoosh / swish; 133.75 pop / golpe medio |
| 134 | **[134–137]** Zoom out al plano inicial. Texto: "LLEGAR PRIMERO". Loop. | no sirve |  |
| 135 | ↳ | de nada. El | 135.86 pop / golpe medio |
| 136 | ↳ | tuyo también llegó | 136.07 pop / golpe medio (sobre voz); 136.43 pop / golpe medio (sobre voz) |
| 137 | ↳ | tarde. |  |
| 138 |  |  |  |

## Video 4: Cubo de Rubik: número de Dios (143.7 s)

- Voz: 406 palabras, **169.5 ppm** de media sobre la duración total; pausas >0,4 s: 21 (3.2s (0.44s), 11.0s (0.46s), 16.8s (0.44s), 19.2s (0.56s), 24.4s (0.44s), 38.0s (0.78s), 42.3s (0.56s), 46.8s (0.46s), 48.6s (0.44s), 53.9s (0.52s), 55.3s (0.44s), 60.4s (0.52s), 61.4s (0.46s), 62.3s (0.5s), 74.4s (0.64s), 76.7s (0.5s), 79.4s (0.5s), 84.8s (0.46s), 95.8s (0.56s), 99.9s (0.52s), 103.8s (0.52s)).
- Loudness integrado: **-16.9 LUFS**. F0 mediana estimada: 175.8 Hz (estimación automática, no concluyente). BPM estimado por autocorrelación: 80.0 (poco fiable, ver guía).
- Cortes duros detectados (scdet umbral 12): [117.93]. Todo lo demás son transformaciones o movimientos de cámara continuos.
- SFX detectados: 122 (≈0.85 por segundo).

| s | Visual | Voz | SFX |
|---|---|---|---|
| 0 | **[0–6]** Cubo de Rubik 3D con colores clásicos y caras sombreadas con semitono; las caras giran. Contador monoespaciado lima abajo 02→18→20 (el 20 en rojo). Texto: "20" rojo grande / "MOVIMIENTOS O MENOS". En 6 el cubo pasa a gris desaturado con halo. | Cualquier cubo de Rubik | 0.43 pop / golpe medio (sobre voz) |
| 1 | ↳ | se arma en 20 | 1.89 pop / golpe medio (sobre voz) |
| 2 | ↳ | movimientos o menos, |  |
| 3 | ↳ | por más |  |
| 4 | ↳ | revuelto que este tu cubo | 4.43 pop / golpe medio (sobre voz); 4.56 pop / golpe medio (sobre voz) |
| 5 | ↳ | siempre hay un |  |
| 6 | ↳ | camino así, y | 6.08 whoosh / swish (sobre voz) |
| 7 | **[7–11]** Cubo armado. Flechas curvas lima indican el giro. Textos: "UN CUARTO DE VUELTA" (lima) y "MEDIA VUELTA" (lima). En 11 el cubo explota en copias. | un movimiento es girar | 7.97 pop / golpe medio (sobre voz) |
| 8 | ↳ | una sola cara, |  |
| 9 | ↳ | un cuarto de vuelta |  |
| 10 | ↳ | o media vuelta. |  |
| 11 | ↳ | Si armas el |  |
| 12 | **[12–24]** Tres cubos sobre un camino curvo en forma de 8 (cinta de cubos), con etiquetas píldora y contadores (azul 100, azul 50, rojo 20). Textos: "CAPA POR CAPA", "CAMPEONES DE VELOCIDAD", "EL CAMINO MÁS CORTO", "CASI TREINTA AÑOS". En 24, una cara blanca 3×3 plana y "30" rojo. | cubo capa por capa |  |
| 13 | ↳ | como enseña el instructivo, | 13.97 pop / golpe medio (sobre voz) |
| 14 | ↳ | usas | 14.18 ding / campana (tono) (sobre voz) |
| 15 | ↳ | unos 100 movimientos |  |
| 16 | ↳ | o más. | 16.17 pop / golpe medio (sobre voz) |
| 17 | ↳ | Los campeones de velocidad | 17.50 whoosh / swish (sobre voz) |
| 18 | ↳ | usan unos 50, |  |
| 19 | ↳ | pero demostrar | 19.76 whoosh / swish (sobre voz) |
| 20 | ↳ | que el camino más |  |
| 21 | ↳ | corto nunca pasa | 21.95 pop / golpe medio (sobre voz) |
| 22 | ↳ | de 20 tomó | 22.11 ding / campana (tono) (sobre voz); 22.94 whoosh / swish (sobre voz) |
| 23 | ↳ | casi 30 años. |  |
| 24 | ↳ | La razón | 24.42 pop / golpe medio |
| 25 | **[25–29]** Cubo central rodeado de un anillo de cubos que se vuelve una nube radial de miles (partículas). Número largo lima rodando: 43.252.003.274.489.856.000. Texto: "43 TRILLONES DE POSICIONES". En 29, fondo con patrón de semitono. | es el tamaño. | 25.36 pop / golpe medio (sobre voz); 25.97 whoosh / swish (sobre voz) |
| 26 | ↳ | Un cubo de |  |
| 27 | ↳ | Rubik tiene 43 | 27.21 pop / golpe medio (sobre voz) |
| 28 | ↳ | trillones |  |
| 29 | ↳ | de posiciones distintas. |  |
| 30 | **[30–36]** Fondo gris granulado (ruido o semitono) y barra azul de progreso con puntos lima. Textos: "UNA POSICIÓN CADA SEGUNDO", "CIEN VECES LA EDAD DEL UNIVERSO". | Si vieras |  |
| 31 | ↳ | una posición cada | 31.93 whoosh / swish (sobre voz) |
| 32 | ↳ | segundo, tardarías | 32.72 whoosh / swish; 32.84 whoosh / swish (sobre voz) |
| 33 | ↳ | unas 100 veces |  |
| 34 | ↳ | la edad del universo |  |
| 35 | ↳ | en ver todas las | 35.44 pop / golpe medio (sobre voz); 35.73 whoosh / swish (sobre voz) |
| 36 | ↳ | posiciones. En |  |
| 37 | **[37–55]** Papel crema rayado con margen perforado (puntos). El año rueda hasta "1981". Tarjeta "MORWEN THISTLETHWAITE / MATEMÁTICO BRITÁNICO". Cubo con órbitas azules (anillos dibujados), "52" en recuadro azul tipo sello con gotas y flecha roja. Texto: "EL NÚMERO DE DIOS". | 1981, | 37.89 pop / blip (sobre voz) |
| 38 | ↳ | el matemático | 38.06 whoosh / swish; 38.20 whoosh / swish; 38.50 pop / golpe medio; 38.70 whoosh / swish |
| 39 | ↳ | británico Morgan | 39.88 pop / golpe medio (sobre voz) |
| 40 | ↳ | Tieselsoet encontró | 40.36 ding / campana (tono) (sobre voz) |
| 41 | ↳ | otro camino, | 41.08 pop / golpe medio (sobre voz) |
| 42 | ↳ | un método |  |
| 43 | ↳ | que arma cualquier |  |
| 44 | ↳ | posición en 52 | 44.03 whoosh / swish (sobre voz); 44.84 whoosh / swish (sobre voz) |
| 45 | ↳ | movimientos |  |
| 46 | ↳ | o menos. |  |
| 47 | ↳ | Al número más | 47.29 whoosh / swish (sobre voz) |
| 48 | ↳ | chico posible, |  |
| 49 | ↳ | el que le bastaría a | 49.03 pop / golpe medio; 49.17 pop / golpe medio (sobre voz) |
| 50 | ↳ | quien siempre conoce |  |
| 51 | ↳ | el camino más corto, | 51.97 pop / golpe medio (sobre voz) |
| 52 | ↳ | los matemáticos | 52.44 whoosh / swish (sobre voz) |
| 53 | ↳ | le pusieron nombre, | 53.97 whoosh / swish |
| 54 | ↳ | el número de | 54.23 pop / golpe medio; 54.39 pop / golpe medio |
| 55 | ↳ | Dios. Durante | 55.47 click / tic |
| 56 | **[56–70]** Fondo negro. Una banda gris granulada entre una barra azul arriba y una roja abajo se comprime como una prensa: 52→42→29→22. Flechas blancas. Texto: "MÁS DE 20" (20 en rojo). En 70, "21" azul. | casi 30 años, | 56.47 whoosh / swish (sobre voz) |
| 57 | ↳ | ese límite de | 57.45 whoosh / swish |
| 58 | ↳ | 52 fue |  |
| 59 | ↳ | bajando, 42, | 59.47 pop / golpe medio (sobre voz); 59.72 whoosh / swish |
| 60 | ↳ | 29, | 60.76 whoosh / swish; 60.93 pop / golpe medio (sobre voz) |
| 61 | ↳ | 22. | 61.47 whoosh / swish; 61.69 golpe grave / impacto; 61.86 ding / campana (tono) (sobre voz) |
| 62 | ↳ | Nadie | 62.47 pop / golpe medio; 62.73 whoosh / swish |
| 63 | ↳ | encontraba una posición |  |
| 64 | ↳ | que pidiera más | 64.47 whoosh / swish (sobre voz) |
| 65 | ↳ | de 20 movimientos, | 65.22 pop / golpe medio (sobre voz); 65.97 pop / golpe medio (sobre voz) |
| 66 | ↳ | pero nadie podía | 66.18 golpe grave / impacto; 66.32 whoosh / swish (sobre voz); 66.65 ding / campana (tono) (sobre voz) |
| 67 | ↳ | asegurar que entre | 67.81 whoosh / swish (sobre voz) |
| 68 | ↳ | los 43 trillones | 68.97 whoosh / swish (sobre voz) |
| 69 | ↳ | no hubiera una | 69.47 pop / golpe medio (sobre voz); 69.83 whoosh / swish (sobre voz) |
| 70 | ↳ | de 21. |  |
| 71 | **[71–74]** Partículas blancas forman 4 bloques. Texto: "2010". | En 2010, | 71.11 whoosh / swish (sobre voz); 71.97 pop / golpe medio |
| 72 | ↳ | cuatro personas revisaron |  |
| 73 | ↳ | todas las posiciones. | 73.97 whoosh / swish (sobre voz) |
| 74 | ↳ |  | 74.46 pop / blip; 74.72 pop / golpe medio |
| 75 | **[75–84]** Cuatro tarjetas de papel con borde rojo: "TOMAS ROKICKI / UN PROGRAMADOR", "HERBERT KOCIEMBA / UN MAESTRO DE MATEMÁTICAS", "MORLEY DAVIDSON / UN MATEMÁTICO", "JOHN DETHRIDGE / UN INGENIERO DE GOOGLE". En 84 se dispersan. | Tomas Rokiki, | 75.08 whoosh / swish (sobre voz); 75.97 pop / golpe medio |
| 76 | ↳ | un programador, | 76.73 golpe grave / impacto |
| 77 | ↳ | Herbert Kotsiemba, | 77.15 pop / golpe medio |
| 78 | ↳ | un maestro de matemáticas, | 78.29 golpe grave / impacto |
| 79 | ↳ | Morley | 79.35 ding / campana (tono) (sobre voz); 79.89 golpe grave / impacto |
| 80 | ↳ | Davidson, | 80.73 pop / golpe medio |
| 81 | ↳ | un matemático, | 81.92 whoosh / swish |
| 82 | ↳ | y John Detrich, un | 82.36 pop / golpe medio (sobre voz); 82.73 whoosh / swish |
| 83 | ↳ | ingeniero de Google. Su | 83.97 whoosh / swish (sobre voz) |
| 84 | ↳ | truco? |  |
| 85 | **[85–89]** Un cubo y luego cubos en anillo con reflejos (líneas lima de espejo). Textos: "GIRADO / VISTO EN UN ESPEJO", "EL MISMO NÚMERO DE MOVIMIENTOS". | Un cubo girado |  |
| 86 | ↳ | o visto en un espejo |  |
| 87 | ↳ | se arma con el |  |
| 88 | ↳ | mismo número de movimientos, | 88.47 whoosh / swish (sobre voz) |
| 89 | ↳ | así | 89.85 whoosh / swish (sobre voz); 89.97 whoosh / swish (sobre voz) |
| 90 | **[90–103]** Desde el fondo granulado aparece un hexágono de cubos isométricos (azul, rojo, naranja, blanco) que se repite en mosaico. Un cubo central se ilumina lima y ondas lima pintan el mosaico. Textos: "MILLONES DE GRUPOS", "SEGUNDOS", "35 AÑOS", "SEMANAS". | que juntaron las posiciones |  |
| 91 | ↳ | en unos 56 |  |
| 92 | ↳ | millones de |  |
| 93 | ↳ | grupos. Cada grupo | 93.47 pop / golpe medio; 93.75 pop / golpe medio (sobre voz) |
| 94 | ↳ | tardaba unos 20 | 94.52 whoosh / swish (sobre voz) |
| 95 | ↳ | segundos. | 95.08 whoosh / swish (sobre voz); 95.85 whoosh / swish; 95.97 pop / golpe medio |
| 96 | ↳ | En una sola computadora | 96.29 pop / golpe medio |
| 97 | ↳ | todo habría | 97.76 whoosh / swish (sobre voz); 97.97 golpe grave / impacto (sobre voz) |
| 98 | ↳ | tomado 35 |  |
| 99 | ↳ | años. | 99.97 whoosh / swish |
| 100 | ↳ | Google les prestó | 100.28 whoosh / swish |
| 101 | ↳ | sus computadoras | 101.97 pop / blip (sobre voz) |
| 102 | ↳ | y en unas semanas tuvieron |  |
| 103 | ↳ | la respuesta. | 103.97 bombo (música?) |
| 104 | **[104–107]** Todo naranja. Recuadro oscuro: "NINGUNA POSICIÓN / PIDE MÁS DE / 20 / MOVIMIENTOS". | Ninguna posición |  |
| 105 | ↳ | pide más de | 105.97 whoosh / swish (sobre voz) |
| 106 | ↳ | 20 movimientos, |  |
| 107 | ↳ | pero eso no |  |
| 108 | **[108–122]** Los cubos naranja caen y forman un histograma de barras. "18 MOVIMIENTOS O MENOS" (rojo). Marcador "20" con círculo. Partículas tipo salto al hiperespacio. "UNA DE CADA 90 MIL MILLONES" con barra lima. Cajón 3D con un cubo: "EN UN CAJÓN". | es lo más raro. |  |
| 109 | ↳ | Casi todas las posiciones | 109.15 pop / golpe medio; 109.97 pop / golpe medio (sobre voz) |
| 110 | ↳ | se arman en |  |
| 111 | ↳ | 18 movimientos | 111.56 pop / blip (sobre voz) |
| 112 | ↳ | o menos. Las | 112.14 pop / golpe medio (sobre voz) |
| 113 | ↳ | que piden los 20 | 113.92 whoosh / swish (sobre voz) |
| 114 | ↳ | completos son rarísimas, |  |
| 115 | ↳ | una | 115.97 golpe grave / impacto (sobre voz) |
| 116 | ↳ | de cada 90 |  |
| 117 | ↳ | mil millones. | 117.97 pop / golpe medio |
| 118 | ↳ | El cubo que tienes guardado | 118.27 pop / golpe medio (sobre voz) |
| 119 | ↳ | en un cajón casi | 119.97 whoosh / swish (sobre voz) |
| 120 | ↳ | seguro está | 120.87 whoosh / swish (sobre voz) |
| 121 | ↳ | a 18 movimientos |  |
| 122 | ↳ | o menos de armarse. | 122.57 whoosh / swish (sobre voz) |
| 123 | **[123–123]** Cubo lima sólido (transición). | Uno esperaría | 123.47 pop / golpe medio |
| 124 | **[124–143]** Cubo revuelto girando. Textos: "LAS MÁS REVUELTAS" (tachado rojo), "SUPERFLIP" (rojo, letras que saltan), "CADA PIEZA ESTÁ EN SU LUGAR", "DOCE PIEZAS DE DOS COLORES", "VOLTEADAS" (lima) con aristas resaltadas, y "EL LÍMITE EXACTO". En 143, contador "00": loop. | que las rarísimas | 124.97 golpe grave / impacto (sobre voz) |
| 125 | ↳ | posiciones de 20 | 125.91 whoosh / swish (sobre voz) |
| 126 | ↳ | movimientos fueran |  |
| 127 | ↳ | las más revueltas, |  |
| 128 | ↳ | con los colores hechos | 128.95 pop / blip (sobre voz) |
| 129 | ↳ | un caos. | 129.34 pop / golpe medio (sobre voz) |
| 130 | ↳ | La más famosa se llama | 130.09 whoosh / swish (sobre voz) |
| 131 | ↳ | Super Flip y | 131.21 whoosh / swish (sobre voz) |
| 132 | ↳ | es el cubo con el que empezó | 132.92 pop / golpe medio (sobre voz) |
| 133 | ↳ | este video. Cada | 133.91 whoosh / swish |
| 134 | ↳ | pieza está en su | 134.05 whoosh / swish (sobre voz) |
| 135 | ↳ | lugar, solo que las |  |
| 136 | ↳ | 12 piezas de dos | 136.16 pop / golpe medio (sobre voz) |
| 137 | ↳ | colores están volteadas. |  |
| 138 | ↳ | Se ve | 138.08 pop / golpe medio (sobre voz) |
| 139 | ↳ | a un paso de estar | 139.16 pop / golpe medio (sobre voz) |
| 140 | ↳ | armado y está |  |
| 141 | ↳ | en el límite exacto | 141.67 pop / golpe medio (sobre voz) |
| 142 | ↳ | de la regla. |  |
| 143 | ↳ |  |  |

## Video 5: Minecraft: las Far Lands (142.6 s)

- Voz: 436 palabras, **183.5 ppm** de media sobre la duración total; pausas >0,4 s: 18 (2.4s (0.44s), 6.5s (0.42s), 18.0s (0.5s), 26.6s (0.52s), 30.5s (0.48s), 35.3s (0.48s), 44.9s (0.44s), 65.9s (0.48s), 84.6s (0.7s), 96.4s (0.42s), 102.0s (0.62s), 108.1s (0.44s), 115.9s (0.46s), 117.9s (0.58s), 119.6s (0.42s), 120.5s (0.62s), 126.6s (0.56s), 134.9s (0.54s)).
- Loudness integrado: **-20.1 LUFS**. F0 mediana estimada: 180.8 Hz (estimación automática, no concluyente). BPM estimado por autocorrelación: 80.0 (poco fiable, ver guía).
- Cortes duros detectados (scdet umbral 12): [48.97]. Todo lo demás son transformaciones o movimientos de cámara continuos.
- SFX detectados: 124 (≈0.87 por segundo).

| s | Visual | Voz | SFX |
|---|---|---|---|
| 0 | **[0–1]** Un cubo de bloques voxel (naranja con tapa lima) se arma con bloques que caen. | Los mundos de Minecraft | 0.82 whoosh / swish (sobre voz) |
| 1 | ↳ | no son infinitos. |  |
| 2 | **[2–7]** El terreno voxel se extiende con torres naranjas en picos. Contador lima 00,000,01→12,500,000. Textos: "NO SON INFINITOS", "12 MILLONES Y MEDIO DE BLOQUES". | Si |  |
| 3 | ↳ | caminas en línea recta | 3.03 whoosh / swish (sobre voz) |
| 4 | ↳ | 12 millones y | 4.22 pop / golpe medio (sobre voz) |
| 5 | ↳ | medio de bloques desde el | 5.11 whoosh / swish (sobre voz); 5.66 pop / golpe medio (sobre voz) |
| 6 | ↳ | centro, el suelo | 6.82 pop / golpe medio |
| 7 | ↳ | se vuelve una pared |  |
| 8 | **[8–11]** La cámara viaja hasta una pared azul gigante (#2840f0) llena de túneles. Texto: "UNA PARED GIGANTE". En 11, glitch con barras horizontales rojas. | gigante, llena |  |
| 9 | ↳ | de túneles, que | 9.95 pop / golpe medio |
| 10 | ↳ | sube hasta el cielo. |  |
| 11 | ↳ | Mucha gente cree | 11.51 pop / blip (sobre voz); 11.88 whoosh / swish (sobre voz) |
| 12 | **[12–18]** Terreno pequeño sobre una cuadrícula de líneas finas en negro; la sección se genera por partes. Texto: "INVENTA EL TERRENO". | que sí lo son, |  |
| 13 | ↳ | porque el juego inventa | 13.91 whoosh / swish (sobre voz) |
| 14 | ↳ | el terreno conforme |  |
| 15 | ↳ | caminas. Pero | 15.80 whoosh / swish (sobre voz) |
| 16 | ↳ | el lugar donde el suelo se |  |
| 17 | ↳ | rompe, existe. | 17.37 pop / golpe medio (sobre voz); 17.59 pop / golpe medio; 17.95 whoosh / swish (sobre voz) |
| 18 | ↳ | Se llama Far | 18.71 pop / golpe medio (sobre voz) |
| 19 | **[19–22]** Texto pixelado blanco "FAR LANDS" con subtítulo monoespaciado lima "LAS TIERRAS LEJANAS". | Lands, las tierras | 19.82 pop / golpe medio; 19.95 whoosh / swish (sobre voz) |
| 20 | ↳ | lejanas, |  |
| 21 | ↳ | y lo describió el creador |  |
| 22 | ↳ | del juego, Marcus Persson, |  |
| 23 | **[23–25]** "FAR LANDS" se desintegra en partículas. Etiqueta en caja negra "MARKUS PERSSON" y "NOTCH█" en monoespaciada lima con cursor de bloque. | al que todos | 23.61 pop / golpe medio; 23.75 whoosh / swish (sobre voz); 23.94 whoosh / swish (sobre voz) |
| 24 | ↳ | conocen como Notch. | 24.95 whoosh / swish (sobre voz) |
| 25 | ↳ | En marzo | 25.57 whoosh / swish (sobre voz) |
| 26 | **[26–38]** Papel crema (blog): "MARZO DE 2011" tecleado y "Terrain generation, Part 1". Bloques en escalera creciente que terminan en torres azules (los errores). Textos: "NO SON INFINITOS", "MÁS ERRORES" (azul) y la cita monoespaciada "«CAMINAR HASTA ALLÁ VA A TARDAR MUCHÍSIMO»" tecleada. | de 2011, | 26.60 pop / golpe medio (sobre voz); 26.98 bombo (música?) |
| 27 | ↳ | Notch escribió en su blog | 27.09 pop / golpe medio |
| 28 | ↳ | que los mapas de Minecraft | 28.30 whoosh / swish (sobre voz) |
| 29 | ↳ | no son |  |
| 30 | ↳ | infinitos. Entre | 30.36 ding / campana (tono) (sobre voz) |
| 31 | ↳ | más te alejas del | 31.01 pop / golpe medio (sobre voz); 31.61 pop / golpe medio (sobre voz) |
| 32 | ↳ | centro, más errores |  |
| 33 | ↳ | salen. Y | 33.92 pop / golpe medio (sobre voz) |
| 34 | ↳ | de las Far Lands escribió, |  |
| 35 | ↳ | caminar | 35.75 whoosh / swish |
| 36 | ↳ | hasta allá va a |  |
| 37 | ↳ | tardar muchísimo. |  |
| 38 | ↳ | Cada bloque del |  |
| 39 | **[39–40]** Un bloque solo con una regla. Texto: "UN METRO". | juego mide 1 |  |
| 40 | ↳ | metro, así que | 40.69 pop / golpe medio (sobre voz) |
| 41 | **[41–45]** Terreno con casitas y agua azul oscura. Contador lima 00,001→1,338. Texto: "12,550 KILÓMETROS". | las Far Lands están | 41.95 pop / golpe medio (sobre voz) |
| 42 | ↳ | a 12 .550 | 42.14 pop / golpe medio (sobre voz) |
| 43 | ↳ | kilómetros | 43.95 whoosh / swish (sobre voz) |
| 44 | ↳ | del centro. |  |
| 45 | ↳ | Casi lo que mide la | 45.18 bombo (música?); 45.34 pop / golpe medio (sobre voz); 45.70 pop / golpe medio (sobre voz) |
| 46 | **[46–48]** La Tierra como disco con semitono y una línea lima que la atraviesa. Texto: "LA TIERRA". | tierra si la atraviesas |  |
| 47 | ↳ | de lado a lado. | 47.95 pop / golpe medio |
| 48 | ↳ | Ese mismo mes, | 48.29 pop / golpe medio (sobre voz) |
| 49 | **[49–59]** Vista aérea del terreno lima con vetas naranjas. Etiqueta "KURT J." y un personaje pequeño (bolita) caminando. Texto: "SIN TRUCOS". | un youtuber llamado |  |
| 50 | ↳ | Kurt Jaimak |  |
| 51 | ↳ | empezó a caminar hacia | 51.03 pop / golpe medio (sobre voz) |
| 52 | ↳ | allá. Kurt camina |  |
| 53 | ↳ | sin trucos, y | 53.52 pop / golpe medio (sobre voz); 53.95 pop / blip (sobre voz) |
| 54 | ↳ | en cada episodio | 54.75 whoosh / swish (sobre voz) |
| 55 | ↳ | junta donaciones para |  |
| 56 | ↳ | beneficencia. |  |
| 57 | ↳ | Cada bloque que pisa, | 57.19 pop / golpe medio; 57.87 pop / golpe medio (sobre voz) |
| 58 | ↳ | lo calcule el juego |  |
| 59 | ↳ | con una receta llamada |  |
| 60 | **[60–70]** Fondo de semitono lima sobre negro que se mueve (el ruido de Perlin). Texto "RUIDO DE PERLIN" (lima). Manchas rojas con "TIERRA" y "AIRE". En 70 se convierte en terreno 3D. | Ruido de Pearly. |  |
| 61 | ↳ | Da números | 61.45 pop / golpe medio; 61.69 whoosh / swish (sobre voz) |
| 62 | ↳ | al azar, pero los | 62.78 whoosh / swish (sobre voz) |
| 63 | ↳ | de puntos vecinos se |  |
| 64 | ↳ | parecen, como las alturas |  |
| 65 | ↳ | de unas colinas. | 65.03 whoosh / swish (sobre voz); 65.95 whoosh / swish |
| 66 | ↳ | Un número alto |  |
| 67 | ↳ | pone tierra, | 67.95 whoosh / swish |
| 68 | ↳ | y uno bajo pone aire. |  |
| 69 | ↳ | Eso funciona | 69.45 pop / golpe medio |
| 70 | ↳ | mientras el juego pueda | 70.20 whoosh / swish (sobre voz) |
| 71 | **[71–73]** Texto: "GUARDAR BIEN / LA CUENTA" (lima). Torre roja. | guardar bien la cuenta. | 71.94 pop / golpe medio (sobre voz) |
| 72 | ↳ | Antes de usar | 72.45 pop / golpe medio |
| 73 | ↳ | la receta, el juego | 73.45 pop / golpe medio (sobre voz); 73.67 pop / golpe medio; 73.79 pop / golpe medio; 73.95 bombo (música?) (sobre voz) |
| 74 | **[74–88]** Contadores tipo odómetro lima: "DISTANCIA AL CENTRO, EN BLOQUES" 02,320→12,550,821, "×171" y "2,147,483,647" en recuadro lima. Texto: "EL NÚMERO MÁS GRANDE QUE CABE" (lima). En 88 todo se desintegra en partículas azules. | multiplica la distancia | 74.62 pop / golpe medio (sobre voz) |
| 75 | ↳ | al centro, | 75.45 pop / golpe medio (sobre voz); 75.95 pop / golpe medio |
| 76 | ↳ | en bloques, por 171. | 76.71 pop / golpe medio |
| 77 | ↳ |  | 77.95 pop / golpe medio |
| 78 | ↳ | A 12 .550 | 78.45 whoosh / swish (sobre voz) |
| 79 | ↳ | .821 | 79.45 pop / golpe medio (sobre voz) |
| 80 | ↳ |  | 80.33 pop / blip (sobre voz) |
| 81 | ↳ | bloques, esa | 81.70 pop / golpe medio (sobre voz); 81.84 pop / golpe medio (sobre voz); 81.95 pop / blip (sobre voz) |
| 82 | ↳ | cuenta llega a 2 |  |
| 83 | ↳ | .147 |  |
| 84 | ↳ | millones. | 84.73 whoosh / swish; 84.96 pop / golpe medio |
| 85 | ↳ | El número más | 85.33 whoosh / swish (sobre voz) |
| 86 | ↳ | grande que cabe donde |  |
| 87 | ↳ | el juego la guarda. | 87.95 pop / golpe medio |
| 88 | ↳ | De ahí en adelante, | 88.16 whoosh / swish |
| 89 | **[89–99]** Las partículas azules caen como lluvia de líneas sobre el terreno y forman la pared azul. Textos: "PAREDES Y TÚNELES" (lima), "LA CUENTA ROTA". | la cuenta se atora. | 89.04 pop / golpe medio |
| 90 | ↳ | El ruido da | 90.21 pop / golpe medio; 90.45 whoosh / swish |
| 91 | ↳ | números gigantes | 91.65 whoosh / swish (sobre voz) |
| 92 | ↳ | y el terreno se estira |  |
| 93 | ↳ | en paredes y |  |
| 94 | ↳ | túneles. Nadie |  |
| 95 | ↳ | construyó las Far |  |
| 96 | ↳ | Lands. Son la | 96.45 whoosh / swish; 96.71 whoosh / swish |
| 97 | ↳ | cuenta rota, | 97.95 whoosh / swish |
| 98 | ↳ | convertida en suelo. |  |
| 99 | ↳ | Pero la cuenta rota | 99.28 whoosh / swish (sobre voz) |
| 100 | **[100–113]** Terreno en V con una línea vertical que compara versiones. Textos: "SEPTIEMBRE DE 2011", "MOJANG", "VERSIONES NUEVAS", "LA VERSIÓN VIEJA". Barra blanca de glitch en 108. | no es lo más |  |
| 101 | ↳ | raro de esta historia. |  |
| 102 | ↳ | En septiembre | 102.68 whoosh / swish (sobre voz) |
| 103 | ↳ | de 2011, | 103.94 whoosh / swish |
| 104 | ↳ | 6 meses después | 104.20 pop / blip; 104.65 whoosh / swish (sobre voz) |
| 105 | ↳ | de que Kurt arrancó, |  |
| 106 | ↳ | Moyang, |  |
| 107 | ↳ | la empresa de Minecraft, | 107.21 whoosh / swish; 107.42 pop / golpe medio (sobre voz); 107.95 whoosh / swish (sobre voz) |
| 108 | ↳ | borró las |  |
| 109 | ↳ | Far Lands de las versiones | 109.95 whoosh / swish (sobre voz) |
| 110 | ↳ | nuevas. Kurt |  |
| 111 | ↳ | se quedó en la versión | 111.40 whoosh / swish (sobre voz); 111.95 pop / blip (sobre voz) |
| 112 | ↳ | vieja para no perder | 112.95 pop / golpe medio (sobre voz) |
| 113 | ↳ | su destino. | 113.95 pop / golpe medio |
| 114 | **[114–125]** Terreno y pared azul. Textos: "CATORCE AÑOS Y MEDIO", "4 DE OCTUBRE DE 2025". Letrero de papel en un poste: "KURT LLEGÓ". Glitch rojo en 123. | Caminó 14 | 114.59 pop / golpe medio (sobre voz); 114.95 ding / campana (tono) (sobre voz) |
| 115 | ↳ | años y medio. | 115.95 pop / golpe medio |
| 116 | ↳ | El 4 de octubre | 116.21 pop / golpe medio; 116.31 pop / golpe medio; 116.95 whoosh / swish (sobre voz) |
| 117 | ↳ | de 2025, |  |
| 118 | ↳ | en una transmisión | 118.45 pop / golpe medio |
| 119 | ↳ | en vivo, | 119.95 pop / golpe medio |
| 120 | ↳ | Kurt llegó. | 120.95 pop / golpe medio |
| 121 | ↳ | Frente a él, | 121.95 pop / golpe medio |
| 122 | ↳ | el suelo se volvía a |  |
| 123 | ↳ | paredes llenas de | 123.45 whoosh / swish (sobre voz) |
| 124 | ↳ | túneles. Y las | 124.02 whoosh / swish (sobre voz); 124.45 pop / blip (sobre voz) |
| 125 | ↳ | Far Lands tampoco son | 125.95 whoosh / swish (sobre voz) |
| 126 | **[126–137]** Texto "TAMPOCO SON EL FINAL". Línea diagonal punteada lima con marcas. Texto: "2,500 AÑOS" (lima). | el final. | 126.95 pop / golpe medio |
| 127 | ↳ | El borde de verdad, | 127.19 pop / golpe medio (sobre voz); 127.45 whoosh / swish (sobre voz) |
| 128 | ↳ | donde el juego se cierra | 128.27 pop / golpe medio |
| 129 | ↳ | solo, está | 129.98 pop / golpe medio (sobre voz) |
| 130 | ↳ | tan lejos que, |  |
| 131 | ↳ | al paso de Kurt, | 131.32 pop / golpe medio; 131.54 pop / golpe medio (sobre voz) |
| 132 | ↳ | llegar tomaría | 132.45 pop / golpe medio; 132.78 whoosh / swish (sobre voz) |
| 133 | ↳ | unos 2 .500 | 133.48 pop / golpe medio (sobre voz) |
| 134 | ↳ | años. | 134.48 pop / golpe medio (sobre voz) |
| 135 | ↳ | Kurt sigue |  |
| 136 | ↳ | grabando su serie |  |
| 137 | ↳ | más allá de las Far |  |
| 138 | **[138–142]** Terreno visto desde arriba que se reconstruye en el cubo de bloques del inicio. Texto: "LO QUE NOTCH ESCRIBIÓ". Loop. | Lands, y comprobó | 138.69 pop / golpe medio (sobre voz) |
| 139 | ↳ | mejor que nadie | 139.24 pop / golpe medio (sobre voz); 139.61 pop / golpe medio (sobre voz) |
| 140 | ↳ | lo que Notch escribió |  |
| 141 | ↳ | en su blog. |  |
| 142 | ↳ |  |  |
