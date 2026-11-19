# 08 · Transiciones de la referencia (spec ad "Granola", @__mcvisuals__)

Video analizado completo: 1920×1080, 60 fps, 10,85 s (651 cuadros). Lo revisé a 10 fps de principio a fin y a 30 fps alrededor de cada cambio. Los números con "f" son cuadros del original a 60 fps. Solo se copian las **transiciones**; no se copian objetos, textos ni diseños.

## Principio general
Casi no hay cortes. Un **mismo contenedor redondeado se transforma** (morph) de un objeto al siguiente. Cada transición tiene:
- un **pico de desenfoque** a mitad del cambio;
- muchas veces un **pico de brillo blanco** justo antes de que aparezca el nuevo objeto;
- el **fondo fundiéndose con desenfoque** al mismo tiempo que el morph;
- una **cámara que siempre empuja hacia adentro** (2–4 % por segundo) en los momentos de espera.

No hay rebotes ni sacudidas.

## Cambio por cambio
| # | Cuadros | Duración | Objeto → objeto | Fondo | Easing | Cámara |
|---|---|---|---|---|---|---|
| 1 | f0–f28 | 28 f (0,47 s) | Una fila de íconos **sube desde abajo**, pasando de desenfocada a nítida | Fade desde negro | Ease-out expo (rápido y frena suave) | Fija y luego push-in lento hasta f57 |
| 2 | f59–f71 | 12 f (0,20 s) | **Morph**: el ícono central crece y se **estira en horizontal** hasta volverse un widget-pastilla. Los demás íconos se desvanecen. | Fundido con desenfoque al fondo B | Ease-out | Empuja hacia el ícono elegido |
| 2b | f71–f79 | 8 f | El texto del widget entra con desenfoque (de borroso a nítido) | — | Ease-out | Push-in lento |
| — | f79–f99 | 20 f de espera | | | | Push-in |
| 3 | f99–f111 | 12 f | **Morph vertical**: la pastilla crece en alto y se vuelve una tarjeta alta. El contenido viejo se apaga y el nuevo aparece. | Fundido con desenfoque a fondo oscuro (f105–f111) | Ease-in-out | — |
| 4 | f111–f142 | 31 f | **Texto letra por letra**: 25 letras en unos 31 cuadros (≈ 1 letra cada 1,25 cuadros) | — | Lineal | Push-in y leve paneo hacia arriba |
| 5 | ~f180–f210 | ~30 f | Paneo de cámara hacia abajo, hasta el interruptor | — | Ease-in-out | Paneo vertical |
| 6 | ~f210–f240 | ~15 f | **Reemplazo en el mismo lugar**: el contenido sale borroso y entra borroso; una barra resaltada se desliza | — | Ease-out | Push-in |
| 7 | ~f240–f300 | — | Paneo y zoom hacia la lista; los ítems aparecen escalonados | — | Ease-out | Paneo |
| 8 | f309–f325 | 16 f | **Morph de encogido**: la tarjeta se desenfoca y se encoge hasta ser una pastilla pequeña. **Destello blanco** en f321–f323 y luego la pastilla se aclara con su contenido. | Mismo fondo oscuro | Ease-in-out con pico de brillo | Fija |
| — | f325–f367 | 42 f | Espera; el contenido de la pastilla anima (onda) | | | Push-in |
| 9 | f367–f389 | 22 f | La pastilla **brilla hasta volverse blanca** (f373–f377) y se **divide en 3 botones** que se deslizan desde el centro hacia los lados (f379–f389) | — | Ease-out | — |
| — | f389–f416 | 27 f | Espera | | | Push-in |
| 10 | f416–f434 | 18 f | **Zoom hacia atrás que revela**: los botones bajan y se achican; arriba aparece una cuadrícula que pasa de borrosa a nítida | — | Ease-out | Zoom out + inclinación hacia arriba |
| — | f434–f462 | 28 f | Espera | | | Push-in |
| 11 | f462–f478 | 16 f | **Morph de colapso**: la cuadrícula se desenfoca y se cierra en una pastilla vertical estrecha. El contenido nuevo (ícono + onda) entra en f470–f478. | Fundido a fondo teñido con el color de marca | Ease-in-out | — |
| — | f478–f504 | 26 f | Espera con la onda animada | | | Push-in |
| 12 | f504–f520 | 16 f | La pastilla se reduce a una barra que brilla; de ese **punto de luz nace el logo**, que entra con desenfoque hacia la derecha | — | Ease-out | — |
| — | f520–f552 | 32 f | Espera del logo | | | Push-in mínimo |
| 13 | f552–f558 | 6 f | **Fundido cruzado rápido** del logo a un texto pequeño | — | Lineal | — |

## Reglas para replicarlo
- Morphs de 12–18 cuadros a 60 fps (0,2–0,3 s). El desenfoque llega a 16–24 px a mitad del cambio.
- El destello aparece en el último tercio del morph y dura 4 cuadros.
- El fondo se funde siempre en el mismo intervalo que el morph.
- Esperas de 20–42 cuadros entre transiciones.
- Texto letra por letra a ≈ 48 letras por segundo; los reemplazos son en el mismo sitio y con desenfoque.
- Easing ease-out (expo o quint). Nunca hay rebote.
