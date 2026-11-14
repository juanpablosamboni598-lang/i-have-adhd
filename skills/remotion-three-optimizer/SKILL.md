---
name: remotion-three-optimizer
description: Use when building or rendering 3D video scenes with Remotion + @remotion/three (three.js) on a CPU-only Linux container (no GPU), e.g. the jxseng 3D "prueba y error" explainer videos in videos-geopolitica/. Rules for fast, clean software rendering with --gl=swangle: MatCap materials, outlines that actually render, .glb models from remotion/public/models/, light and shadow limits, render settings and QC.
---

# Remotion + three.js en CPU (sin GPU)

Reglas probadas en este contenedor (4 CPU, sin GPU, Chromium de Playwright). Síguelas tal cual.

## 1. Render
- Siempre `--gl=swangle`. `angle`, `egl` y `swiftshader` NO crean contexto WebGL aquí.
- `<ThreeCanvas ... dpr={0.5} gl={{ antialias: false }}>`: render 3D a media resolución; los textos HTML
  encima se quedan nítidos. Rinde ~0,5–0,7 s por fotograma a 1920×1080.
- `--concurrency=3` en `npx remotion render`; no correr el render a la vez que la voz (compiten por CPU).
- Revisar antes con una hoja de contactos (composición SHEET, `--sequence --scale=0.25`) y después con
  `qc_video.py`: 0 tramos casi iguales es obligatorio.

## 2. Materiales
- Objetos: `MeshMatcapMaterial` con textura MatCap procedural (Canvas 2D en memoria, sin archivos):
  usa `Matcap`, `MatcapMesh` o `MatcapModel` de `remotion/src/three/MatcapModel.jsx`. No calcula luces → barato.
- Superficies que deben RECIBIR sombra (piso, pared): `meshToonMaterial` (MatCap no recibe sombras).
- Si una pieza cambia de opaca a rayos X a mitad de escena, su material debe ser `transparent` desde el
  inicio (three.js no recompila al cambiar `transparent`; el cambio no se ve).

## 3. Contornos
- Usar el casco invertido `OL` de `remotion/src/three/kit.jsx` (por defecto en MatcapModel, `outline="hull"`).
- `<Outlines>` de `@react-three/drei` NO se dibuja con `--gl=swangle` en nuestras pruebas; solo como opción
  (`outline="drei"`) si algún día se renderiza con GPU.

## 4. Modelos .glb
- Guardarlos en `videos-geopolitica/remotion/public/models/` y cargarlos con
  `<MatcapModel file="nombre.glb" />` (usa `useGLTF(staticFile('models/...'))` dentro de `<Suspense>`).
- Solo modelos con licencia que permita uso comercial (CC0 o propia). Ajustar escala y apoyarlos en el piso.
- Mantenerlos ligeros (< ~20k triángulos por modelo); cada malla duplica su costo con el contorno.

## 5. Luces y sombras
- PROHIBIDO: `PointLight` y `SpotLight` con sombras (multiplican el costo por fotograma).
- Permitido: `ambientLight` + UNA `directionalLight` con `castShadow` y `shadow-mapSize` 1024 — da las
  sombras largas en la pared que pide el estilo del canal. Un `pointLight` SIN sombras para un foco puntual
  está bien.
- Limitar `castShadow` a las piezas principales.

## 6. Movimiento (QC)
- Algo debe moverse siempre: llaves de cámara cada ~1/3 de escena, balanceo `wob` ≈ 0.12–0.14,
  partículas (humo, burbujas, flujo), piezas que caen o se deslizan. Fondos lisos bajan la diferencia
  entre fotogramas y el QC marca "tramos casi iguales".

## 7. Archivos de referencia
- `remotion/src/three/kit.jsx` (OL, Part, Cam, Flow, Tube), `world22.jsx` / `scenes22.jsx` (último video),
  `index22.jsx` (textos sincronizados con la voz, compos verticales VV22-NN), `MatcapModel.jsx`.
- Guía del canal: `videos-geopolitica/GUIA_ESTILO_3D.md`.
