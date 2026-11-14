---
name: remotion-three-optimizer
description: Optimiza escenas 3D de Remotion + Three.js para renderizado rápido en CPU (--gl=swangle) con estética documental de contornos técnicos y modelos .glb.
---

# Reglas Obligatorias para Escenas 3D en Remotion (Entorno Headless CPU)

Este proyecto renderiza en un contenedor Linux sin GPU utilizando `--gl=swangle` (SwiftShader). Para evitar renders de 12 horas y geometría amateur, sigue estas reglas en todo archivo dentro de `videos-geopolitica/remotion/src/three/`:

1. **Prohibido usar luces dinámicas y sombras en tiempo real:**
   - NO uses `castShadow`, `receiveShadow`, `PointLight`, `SpotLight` ni `MeshStandardMaterial` / `MeshPhysicalMaterial` en escenas complejas. SwiftShader calcula PBR por CPU y multiplica el tiempo de render.
   - USA SIEMPRE `<meshMatcapMaterial />` con textura MatCap (o el componente `<MatcapModel />` / `<Matcap />` de `src/three/MatcapModel.jsx`, que la genera en memoria), que simula iluminación de estudio mediante textura esférica sin costo de GPU. Un `meshMatcapMaterial` SIN textura `matcap` se ve plano: usa siempre el de `MatcapModel.jsx`.
   - Si una escena necesita la sombra larga en la pared (estilo de la referencia), simúlala con un plano oscuro semitransparente (sombra falsa), no con `castShadow`.

2. **Contornos estilo técnico / documental:**
   - Aplica contorno negro (`#0a0a0a`, grosor ≈ 0.015–0.025) a cada `<mesh>` protagonista para lograr el estilo de ilustración técnica de alto contraste.
   - Usa el contorno de casco invertido `OL` de `src/three/kit.jsx` (`<OL t={0.02} color="#0a0a0a" />`), que es el que usa `MatcapModel` por defecto.
   - NO uses `<Outlines>` de `@react-three/drei` en este entorno: verificado el 14 nov 2026 con `--gl=swangle`, no dibuja ningún contorno (prueba `MATCAPTEST` en `src/index3d.jsx`). Solo serviría si algún día se renderiza con GPU (`outline="drei"` en `MatcapModel`).

3. **Modelos 3D reales (.glb) antes que primitivas:**
   - Antes de construir objetos complejos uniendo cubos y cilindros, verifica si existe un archivo `.glb` en `remotion/public/models/`.
   - Cárgalo usando `<MatcapModel modelPath="/models/archivo.glb" />` (o `file="archivo.glb"`), que usa `useGLTF` de `@react-three/drei` con `staticFile()` dentro de `<Suspense>`.
   - Solo modelos con licencia de uso comercial (CC0 o propios).
   - Si debes usar primitivas para diagramas esquemáticos, agrúpalas con `MeshMatcapMaterial` + contorno (`<MatcapMesh>`).

4. **Verificación previa al render:**
   - Antes de ejecutar `pipeline*.sh`, valida que no existan rutas rotas en `staticFile()` y ejecuta una prueba de 1 frame con `npx remotion still ... --gl=swangle` para confirmar tiempo de render menor a 3 segundos por frame.
   - Render siempre con `--gl=swangle`, `dpr={0.5}` y `antialias: false` en `<ThreeCanvas>`; materiales que cambian a transparente a mitad de escena deben ser `transparent` desde el inicio.
