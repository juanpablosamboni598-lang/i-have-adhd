# 07 · Herramientas para reproducir este estilo

Cada herramienta se justifica por lo que se vio en los videos. Estado: ✅ ya funciona en esta sesión · ⬜ hay que instalarla o conectarla · 💲 es de pago.

## Lo que usan los creadores de referencia (deducido de lo que se ve)
| Herramienta | Por qué (evidencia) | Acceso |
|---|---|---|
| **Adobe After Effects** 💲 | Cámara 3D sobre capas 2D (tarjetas en Z del video 4), desenfoque de movimiento real, morphs de forma (video 8), anillos punteados que giran. El video 4 lleva el hashtag #aftereffectsedits. | adobe.com/products/aftereffects, unos 23 USD al mes |
| **Deep Glow** (plugin de AE) 💲 | Resplandor naranja exterior de las tarjetas del video 4 y brillo de la serif dorada del video 5 | aescripts.com/deep-glow |
| **Motion Tools Pro / Flow** (AE) | Easing ease-out fuerte en todas las entradas (0,25–0,5 s) | aescripts.com (Motion Tools es gratis; Flow es de pago) |
| **Element 3D / Cinema 4D** 💲 | Objetos 3D B/N con órbita (coches sobre la elipse del video 7, monedas del video 5) | videocopilot.net / maxon.net |
| **CapCut** | Aparece su icono en el video 3, y los estrobos y textos con degradado del Modo B son plantillas típicas suyas | Gratis: capcut.com |

## Lo que usaré yo para producir los videos (en esta sesión, sin pagar más)
| Herramienta | Función en el estilo | Estado / instalación |
|---|---|---|
| **Motor HTML + CSS 3D + GSAP + Playwright** (mi motor `player2.html` + `render.js`) | Fondos A, tarjetas redondeadas, sombras, desenfoque de entrada, push-in, paralaje, CSS 3D para la órbita y la inclinación, anillos punteados y pastillas. Desenfoque de movimiento promediando 4–8 subfotogramas. | ✅ ya existe en `tiktok-marcas/engine`. GSAP: `npm i gsap`, o desde CDN. |
| **Remotion** (alternativa en React) | Lo mismo con un modelo por componentes, muy cómodo para las plantillas "palabra pequeña + GRANDE" | ⬜ `npx create-video@latest`. Existe la skill `ecc:remotion-video-creation`. |
| **ElevenLabs** (voz Will a 1.2) | Voz del canal | ✅ conectado (plan gratis, a veces "busy") |
| **ElevenLabs Image** (`creative_generate_image`) | Objetos 3D B/N y figuras blancas mate con las plantillas de 05 §1–2 | ✅ conectado (gasta créditos) |
| **rembg** | Recorte de objetos y personas, para conseguir el aspecto "PNG con sombra" de los videos 1, 6, 7 y 8 | ⬜ `pip install "rembg[cpu]"` |
| **faster-whisper** | Tiempo de cada palabra, para sincronizar el texto palabra por palabra | ✅ instalado |
| **ffmpeg** | Grano, viñeta, mezcla de audio, glitch RGB, control de calidad | ✅ |
| **Pixabay API** (PIXABAY_KEY) | B/N real para los planos fotorrealistas (máximo 30 %) | ✅ |
| **Fuentes** | Inter Display (Bold/Black) ✅ · Instrument Serif Italic ✅ (descargada) · Montserrat Bold ✅ (Modo B) | En `tiktok-marcas/fonts` |
| **Script de medición** | Comprueba saturación ≤ 0,17 y acento ≤ 5 % antes de publicar | ✅ (el que se usó en este análisis) |
| **Buffer** | Publicación en TikTok @juavxf | ✅ conectado |

## Opcionales (mejoran el resultado)
| Herramienta | Para qué | Acceso |
|---|---|---|
| **Nano Banana / Flux** | Objetos 3D más consistentes con imagen de referencia, para los personajes repetidos | Gemini (gratis con límites) / fal.ai 💲. Hay skills `social-media-skills:nano-banana` y `flux`. |
| **Blender** (gratis) | Si quieres objetos 3D reales con órbita perfecta, como los coches del video 7 | `apt install blender`, o blender.org |
| **vidIQ / NexLev MCP** | Analizar más referencias del mismo creador (`watch_tiktok_video_and_ask`) | ✅ conectados |

## Advertencias
- Este estilo copia la técnica; no reutiliza los gráficos, las fotos ni los proyectos de los creadores.
- Las fotos de personas reales y los logos de marcas: úsalos en un contexto informativo. El riesgo de derechos de imagen lo asumes tú, igual que con la música.
