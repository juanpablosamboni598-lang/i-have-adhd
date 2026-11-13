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
    <shaderMaterial side={THREE.BackSide} uniforms={{ th: { value: t }, col: { value: c } }}
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
