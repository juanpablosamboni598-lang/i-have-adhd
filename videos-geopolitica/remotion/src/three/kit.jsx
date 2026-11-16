import React, { useMemo, useRef, useLayoutEffect } from 'react';
import { Easing } from 'remotion';
import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { useThree } from '@react-three/fiber';

export const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const ease = Easing.bezier(0.33, 0, 0.2, 1);
export const tw = (t, a, b) => ease(cl((t - a) / (b - a)));
export const lerp = (a, b, u) => a + (b - a) * u;
// caída con rebote: 0 (arriba) → 1 (en su sitio)
export const drop = (t, a, d = 0.7) => {
  const u = cl((t - a) / d);
  if (u < 0.7) return (u / 0.7) ** 2;
  return 1 - Math.sin(((u - 0.7) / 0.3) * Math.PI) * 0.08;
};
export const INK = '#141018';

// contorno tipo dibujo (casco invertido), funciona con swangle
export const OL = ({ t = 0.02, color = INK }) => {
  const ref = useRef();
  useLayoutEffect(() => {
    const m = ref.current, par = m && m.parent;
    if (!par || !par.geometry || m.userData.g === par.geometry) return;
    let g = par.geometry.clone();
    if (g.attributes.normal) g.deleteAttribute('normal');
    if (g.attributes.uv) g.deleteAttribute('uv');
    g = mergeVertices(g, 1e-4);
    g.computeVertexNormals();
    m.geometry = g; m.userData.g = par.geometry;
  });
  const c = new THREE.Color(color);
  return <mesh ref={ref} renderOrder={-1}>
    <shaderMaterial side={THREE.BackSide} uniforms={{ th: { value: t * (globalThis.__OLK || 1) }, col: { value: c } }}
      vertexShader={`uniform float th; void main(){ vec3 p = position + normalize(normal) * th; gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0); }`}
      fragmentShader={`uniform vec3 col; void main(){ gl_FragColor = vec4(col,1.0); }`} />
  </mesh>;
};

export const Toon = (p) => <meshToonMaterial {...p} />;

// parte con contorno; xr = transparencia de rayos X (0 opaco → 1 casi invisible)
export const Part = ({ geo, color, pos, rot, scale, t = 0.02, xr = 0, map, children, shadow = true, basic }) => {
  const op = 1 - 0.82 * xr;
  return <mesh position={pos} rotation={rot} scale={scale} castShadow={shadow && xr < 0.3}>
    {geo}
    {basic ? <meshBasicMaterial color={color} transparent opacity={op} />
      : <meshToonMaterial color={color} map={map} transparent opacity={op} depthWrite={xr < 0.5} />}
    {xr < 0.5 && t > 0 ? <OL t={t} /> : null}
    {children}
  </mesh>;
};

// cámara por llaves: [t, x, y, z, tx, ty, tz] (segundos)
export const Cam = ({ t, keys, fov, wob: W = 0.04 }) => {
  const { camera } = useThree();
  let i = 0; while (i < keys.length - 2 && t > keys[i + 1][0]) i++;
  const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)];
  const u = b[0] === a[0] ? 1 : ease(cl((t - a[0]) / (b[0] - a[0])));
  const L = (k) => lerp(a[k], b[k], u);
  const wob = Math.sin(t * 0.9) * W;
  camera.position.set(L(1) + wob, L(2) + wob * 0.5, L(3));
  if (fov && camera.fov !== fov) { camera.fov = fov; camera.updateProjectionMatrix(); }
  camera.lookAt(L(4), L(5), L(6));
  return null;
};

// textura de manchas de jirafa (procedural, determinista)
let _spots = null;
export const spotTex = () => {
  if (_spots) return _spots;
  const c = document.createElement('canvas'); c.width = 512; c.height = 512;
  const g = c.getContext('2d');
  g.fillStyle = '#f7e2b0'; g.fillRect(0, 0, 512, 512);
  let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const pts = []; for (let i = 0; i < 70; i++) pts.push([rnd() * 512, rnd() * 512]);
  const img = g.getImageData(0, 0, 512, 512);
  for (let y = 0; y < 512; y++) for (let x = 0; x < 512; x++) {
    let d1 = 1e9, d2 = 1e9, k = 0;
    for (let i = 0; i < pts.length; i++) for (const [ox, oy] of [[0, 0], [512, 0], [-512, 0], [0, 512], [0, -512]]) {
      const dx = x - pts[i][0] - ox, dy = y - pts[i][1] - oy, d = dx * dx + dy * dy;
      if (d < d1) { d2 = d1; d1 = d; k = i; } else if (d < d2) d2 = d;
    }
    const edge = Math.sqrt(d2) - Math.sqrt(d1);
    const o = (y * 512 + x) * 4;
    if (edge > 7) { const sh = 0.85 + 0.15 * ((k * 37) % 10) / 10; img.data[o] = 196 * sh; img.data[o + 1] = 112 * sh; img.data[o + 2] = 52 * sh; }
  }
  g.putImageData(img, 0, 0);
  _spots = new THREE.CanvasTexture(c);
  _spots.wrapS = _spots.wrapT = THREE.RepeatWrapping;
  _spots.colorSpace = THREE.SRGBColorSpace;
  return _spots;
};

// partículas que viajan por una polilínea (flujo de sangre)
export const Flow = ({ pts, t, n = 12, speed = 0.4, color = '#e2483d', r = 0.05, on = 1 }) => {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))), [JSON.stringify(pts)]);
  if (on <= 0.01) return null;
  return <group>{Array.from({ length: n }).map((_, k) => {
    const u = ((t * speed + k / n) % 1 + 1) % 1;
    const p = curve.getPoint(u);
    return <mesh key={k} position={p} scale={on}><sphereGeometry args={[r, 10, 8]} /><meshBasicMaterial color={color} /></mesh>;
  })}</group>;
};

export const Tube = ({ pts, r = 0.05, color, xr = 0, t = 0.012 }) => {
  const geo = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))), 40, r, 10, false), [JSON.stringify(pts), r]);
  return <mesh geometry={geo}><meshToonMaterial color={color} transparent opacity={1 - 0.6 * xr} /></mesh>;
};

// ===== Estilo "dibujado" (referencias 16 nov): grano de papel + trazos de acuarela en todas las superficies =====
let _paper = null;
export const paperTex = () => {
  if (_paper) return _paper;
  const N = 512, c = document.createElement('canvas'); c.width = N; c.height = N;
  const g = c.getContext('2d'); let s = 11; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, N, N);
  // trazos largos verticales casi transparentes (pincel seco)
  for (let k = 0; k < 900; k++) {
    const x = rnd() * N, y = rnd() * N, h = 20 + rnd() * 120, w = 0.6 + rnd() * 2.2, a = 0.05 + rnd() * 0.1;
    g.fillStyle = `rgba(60,55,70,${a})`; g.fillRect(x, y, w, h); g.fillRect(x, y - N, w, h);
  }
  // grano fino
  const img = g.getImageData(0, 0, N, N), d = img.data;
  for (let p = 0; p < d.length; p += 4) { const v = (rnd() - 0.5) * 26; d[p] += v; d[p + 1] += v; d[p + 2] += v; }
  g.putImageData(img, 0, 0);
  _paper = new THREE.CanvasTexture(c); _paper.wrapS = _paper.wrapT = THREE.RepeatWrapping; _paper.repeat.set(2, 2);
  _paper.colorSpace = THREE.SRGBColorSpace; return _paper;
};
let _grad = null;
const gradTex = () => {  // 3 bandas de sombra, como cel-shading suave
  if (_grad) return _grad;
  const d = new Uint8Array([90, 90, 90, 255, 175, 175, 175, 255, 255, 255, 255, 255]);
  _grad = new THREE.DataTexture(d, 3, 1, THREE.RGBAFormat); _grad.minFilter = _grad.magFilter = THREE.NearestFilter; _grad.needsUpdate = true; return _grad;
};
// recorre la escena en cada cuadro y aplica papel + bandas a los materiales toon que no tengan textura propia
const _edgeCache = new Map();
const _edgeMat = new THREE.LineBasicMaterial({ color: 0x1a1620, transparent: true, opacity: 0.85 });
export const Dibujo = ({ edges = true, ang = 28 }) => {
  const { scene } = useThree();
  const todo = [];
  scene.traverse((o) => {
    const m = o.material; if (!m || Array.isArray(m)) return;
    if (m.isMeshToonMaterial && !m.userData.dib) { if (!m.map) m.map = paperTex(); m.gradientMap = gradTex(); m.needsUpdate = true; m.userData.dib = 1; }
    // líneas de tinta finas en los bordes (pliegues > ang grados), una vez por geometría
    if (edges && o.isMesh && m.isMeshToonMaterial && o.geometry && !o.userData.isEdge) todo.push(o);
  });
  for (const o of todo) {
    let e = o.userData.edgeObj;
    if (!e || e.userData.src !== o.geometry) {
      // caché por tipo + parámetros: las geometrías que React recrea con los mismos args reutilizan sus líneas
      const g = o.geometry, key = g.parameters ? g.type + JSON.stringify(g.parameters) + ang : null;
      let eg = key && _edgeCache.get(key);
      if (!eg) { eg = new THREE.EdgesGeometry(g, ang); if (key) { if (_edgeCache.size > 4000) _edgeCache.clear(); _edgeCache.set(key, eg); } }
      if (e) { o.remove(e); if (!e.userData.cached) e.geometry.dispose(); }
      e = new THREE.LineSegments(eg, _edgeMat.clone());
      e.userData.isEdge = 1; e.userData.src = g; e.userData.cached = !!key; e.raycast = () => {}; o.add(e); o.userData.edgeObj = e;
    }
    e.material.opacity = 0.85 * (o.material.opacity ?? 1); e.visible = o.visible && o.material.opacity > 0.12;
  }
  return null;
};
// capa de grano encima de todo (HTML), multiplicada
export const GranoPapel = ({ op = 0.16 }) => <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity: op, pointerEvents: 'none' }}>
  <filter id="gp"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="4" /><feColorMatrix type="saturate" values="0" /></filter>
  <rect width="100%" height="100%" filter="url(#gp)" />
</svg>;
