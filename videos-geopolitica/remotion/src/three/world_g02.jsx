// ViceLeakss g02: estilo de las referencias (fondo casi negro, 3D con sombras de semitono, acentos rojo/lima/azul).
// Objetos 100% genéricos y originales: nada de logos, arte, personajes ni mapas del juego.
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { cl, tw, drop, lerp } from './kit.jsx';

export const C = {
  bg: '#0b0b10', text: '#f0ebe4', red: '#f84418', lime: '#d2f834', blue: '#2a42f6', paper: '#efe9e1', lav: '#9b8fe8',
  card: '#1c1e23', card2: '#31373f', white: '#f0ebe4', gray: '#8a8d96', dark: '#23262d', gold: '#e8b730', sea: '#2a42f6', sand: '#efe9e1',
};

// material de semitono: luz difusa + trama de puntos en pantalla donde hay sombra (sin contorno, como las referencias)
const VS = `varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const FS = `uniform vec3 col; uniform float op; uniform float cell; varying vec3 vN;
void main(){
  vec3 L = normalize(vec3(-0.35, 0.55, 0.78));
  float d = max(dot(normalize(vN), L), 0.0);
  float sh = 1.0 - smoothstep(0.1, 0.75, d);
  vec2 g = gl_FragCoord.xy / cell; vec2 f = fract(g) - 0.5;
  float r = smoothstep(0.3, 1.0, sh) * 0.6;
  float dotm = 1.0 - smoothstep(r - 0.06, r + 0.06, length(f));
  vec3 c = col * (0.92 + 0.12 * d);
  c = mix(c, col * 0.36, dotm * step(0.3, sh));
  gl_FragColor = vec4(c, op);
}`;
export const HT = ({ color = C.white, op = 1, cell = 3.2 }) => {
  const u = useMemo(() => ({ col: { value: new THREE.Color(color) }, op: { value: op }, cell: { value: cell } }), [color, cell]);
  u.op.value = op;
  return <shaderMaterial vertexShader={VS} fragmentShader={FS} uniforms={u} transparent depthWrite={op > 0.5} />;
};

// textura de texto (canvas)
const _tx = {};
export const txt = (s, { bg = C.white, fg = C.bg, w = 512, h = 256, size = 120, font = '"Inter Display", Inter, sans-serif', weight = 900 } = {}) => {
  const k = [s, bg, fg, w, h, size, font].join('|');
  if (_tx[k]) return _tx[k];
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d');
  if (bg) { g.fillStyle = bg; g.fillRect(0, 0, w, h); }
  g.fillStyle = fg; g.font = `${weight} ${size}px ${font}`; g.textAlign = 'center'; g.textBaseline = 'middle';
  String(s).split('\n').forEach((line, i, a) => g.fillText(line, w / 2, h / 2 + (i - (a.length - 1) / 2) * size * 1.05));
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  return (_tx[k] = tex);
};

export const B = ({ args, color, pos, rot, op = 1 }) => <mesh position={pos} rotation={rot}><boxGeometry args={args} /><HT color={color} op={op} /></mesh>;

// sombra elíptica difusa en el piso (como la plataforma del contador de la referencia)
let _sh = null;
const shadowTex = () => {
  if (_sh) return _sh;
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 4, 64, 64, 64); gr.addColorStop(0, 'rgba(0,0,0,0.9)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return (_sh = new THREE.CanvasTexture(c));
};
export const Shadow = ({ pos = [0, 0, 0], r = 0.5, op = 0.55 }) => <mesh position={[pos[0], pos[1] + 0.002, pos[2]]} rotation={[-Math.PI / 2, 0, 0]} scale={[r * 2, r * 1.2, 1]}>
  <planeGeometry args={[1, 1]} /><meshBasicMaterial map={shadowTex()} transparent opacity={op} depthWrite={false} /></mesh>;

// plataforma gris elíptica con semitono (base de objetos protagonistas)
export const Plate = ({ pos = [0, 0, 0], r = 0.7 }) => <group position={pos}>
  <mesh position={[0, -0.03, 0]} scale={[1, 1, 0.62]}><cylinderGeometry args={[r, r, 0.04, 48]} /><HT color="#3a3d45" /></mesh>
  <Shadow pos={[0, -0.05, 0]} r={r * 1.1} op={0.6} />
</group>;

// bolita roja puente (transición entre escenas)
export const Bridge = ({ sc = 0, pos = [0, 0.5, 0] }) => sc <= 0.01 ? null : <mesh position={pos} scale={sc}><sphereGeometry args={[0.12, 32, 24]} /><HT color={C.red} /></mesh>;

// partículas de puntos (polvo lento) = capa de movimiento siempre activa
export const Dust = ({ t, n = 40, area = [4, 2.2, 2], y0 = 0, color = C.gray }) => <group>
  {Array.from({ length: n }).map((_, k) => {
    const u = ((t * 0.05 + k * 0.137) % 1);
    return <mesh key={k} position={[((k * 0.618) % 1 - 0.5) * area[0] + Math.sin(t * 0.5 + k) * 0.05, y0 + u * area[1], ((k * 0.371) % 1 - 0.5) * area[2]]}>
      <sphereGeometry args={[0.006 + (k % 3) * 0.003, 6, 4]} /><meshBasicMaterial color={k % 7 === 0 ? C.lime : color} transparent opacity={0.5 * Math.sin(u * Math.PI)} />
    </mesh>;
  })}
</group>;

// etiqueta de precio 3D (tarjeta con texto)
export const PriceTag = ({ pos = [0, 0, 0], text = '$100', color = C.white, fg = C.bg, sc = 1, rot = [0, 0, 0], w = 1.1 }) => sc <= 0.01 ? null : <group position={pos} scale={sc} rotation={rot}>
  <mesh><boxGeometry args={[w, w * 0.45, 0.05]} /><HT color={color} /></mesh>
  <mesh position={[-w * 0.42, 0, 0.027]}><circleGeometry args={[0.04, 16]} /><meshBasicMaterial color={C.bg} /></mesh>
  <mesh position={[0.05, 0, 0.027]}><planeGeometry args={[w * 0.8, w * 0.38]} /><meshBasicMaterial map={txt(text, { bg: color, fg, w: 768, h: 320, size: 190 })} /></mesh>
</group>;

// línea de tachado roja 3D
export const Strike = ({ pos = [0, 0, 0], len = 1.3, u = 1, rot = 0, color = C.red, th = 0.05 }) => u <= 0.01 ? null : <mesh position={[pos[0] - len / 2 * (1 - u), pos[1], pos[2]]} rotation={[0, 0, rot]}>
  <boxGeometry args={[len * u, th, 0.02]} /><meshBasicMaterial color={color} /></mesh>;

export const Coins = ({ pos = [0, 0, 0], n = 8, t = 0, at = 0, color = C.gold }) => <group position={pos}>
  {Array.from({ length: n }).map((_, k) => { const dd = drop(t, at + k * 0.1, 0.4); return <mesh key={k} position={[Math.sin(k) * 0.01, 0.02 + k * 0.04 + (1 - dd) * 1.4, 0]} rotation={[0, k * 0.7 + t, 0]}>
    <cylinderGeometry args={[0.12, 0.12, 0.035, 28]} /><HT color={color} /></mesh>; })}
  <Shadow r={0.2} />
</group>;

// caja de juego genérica
export const Case = ({ pos = [0, 0, 0], rot = [0, 0, 0], color = C.white, label = 'ESTÁNDAR', s = 1, fg = C.bg }) => <group position={pos} rotation={rot} scale={s}>
  <mesh position={[0, 0.3, 0]}><boxGeometry args={[0.46, 0.6, 0.06]} /><HT color={color} /></mesh>
  <mesh position={[0, 0.34, 0.032]}><planeGeometry args={[0.4, 0.16]} /><meshBasicMaterial map={txt(label, { bg: color, fg, size: 74 })} /></mesh>
  <Shadow r={0.3} />
</group>;

// tren genérico (locomotora + 2 vagones) para la metáfora del retraso
export const Train = ({ pos = [0, 0, 0], t = 0, run = 1 }) => <group position={pos}>
  {[0, -0.62, -1.24].map((x, k) => <group key={k} position={[x, 0, 0]}>
    <mesh position={[0, 0.2, 0]}><boxGeometry args={[0.56, 0.26, 0.3]} /><HT color={k === 0 ? C.red : C.white} /></mesh>
    {k === 0 ? <mesh position={[0.16, 0.38, 0]}><boxGeometry args={[0.2, 0.14, 0.26]} /><HT color={C.red} /></mesh> : null}
    {[-0.18, 0.18].map((wx, j) => <mesh key={j} position={[wx, 0.06, 0.16]} rotation={[Math.PI / 2, 0, -t * 6 * run]}><cylinderGeometry args={[0.06, 0.06, 0.03, 16]} /><HT color={C.dark} /></mesh>)}
    {k > 0 ? [-0.14, 0.04, 0.2].map((wx, j) => <mesh key={'w' + j} position={[wx - 0.04, 0.24, 0.152]}><planeGeometry args={[0.1, 0.08]} /><meshBasicMaterial color={C.lime} /></mesh>) : null}
  </group>)}
  <Shadow pos={[-0.62, 0, 0]} r={1.0} op={0.45} />
</group>;

export const Rails = ({ len = 12 }) => <group>
  {[-0.13, 0.13].map((z, k) => <mesh key={k} position={[0, 0.005, z + 0.03]}><boxGeometry args={[len, 0.01, 0.02]} /><meshBasicMaterial color={C.gray} /></mesh>)}
  {Array.from({ length: Math.floor(len / 0.3) }).map((_, k) => <mesh key={'t' + k} position={[-len / 2 + k * 0.3, 0.002, 0.03]}><boxGeometry args={[0.05, 0.004, 0.4]} /><meshBasicMaterial color="#2c2f37" /></mesh>)}
</group>;

// letrero de estación con texto
export const Sign = ({ pos = [0, 0, 0], text = '2025', sc = 1, color = C.white, fg = C.bg }) => sc <= 0.01 ? null : <group position={pos} scale={sc}>
  <mesh position={[0, 0.35, 0]}><boxGeometry args={[0.03, 0.7, 0.03]} /><HT color={C.gray} /></mesh>
  <mesh position={[0, 0.78, 0]}><boxGeometry args={[0.7, 0.26, 0.03]} /><HT color={color} /></mesh>
  <mesh position={[0, 0.78, 0.016]}><planeGeometry args={[0.66, 0.22]} /><meshBasicMaterial map={txt(text, { bg: color, fg, w: 640, h: 220, size: 120 })} /></mesh>
</group>;

// consola genérica (A placa alta, B torre cúbica)
export const Console = ({ pos = [0, 0, 0], kind = 'a', color = C.white, glow = 0, rotY = 0, s = 1, op = 1 }) => <group position={pos} rotation={[0, rotY, 0]} scale={s}>
  {kind === 'a' ? <>
    <mesh position={[0, 0.36, 0]}><boxGeometry args={[0.12, 0.62, 0.42]} /><HT color={color} op={op} /></mesh>
    <mesh position={[-0.08, 0.37, 0]}><boxGeometry args={[0.06, 0.66, 0.46]} /><HT color={C.dark} op={op} /></mesh>
    <mesh position={[0.065, 0.36, 0]}><boxGeometry args={[0.005, 0.5, 0.02]} /><meshBasicMaterial color={glow ? C.lime : C.gray} transparent opacity={op} /></mesh>
  </> : <>
    <mesh position={[0, 0.3, 0]}><boxGeometry args={[0.36, 0.6, 0.36]} /><HT color={color} op={op} /></mesh>
    <mesh position={[0, 0.5, 0.182]}><circleGeometry args={[0.02, 14]} /><meshBasicMaterial color={glow ? C.lime : C.gray} transparent opacity={op} /></mesh>
  </>}
  <Shadow r={0.32} op={0.5 * op} />
</group>;

export const PC = ({ pos = [0, 0, 0], screen = '?', fg = C.red, rotY = 0 }) => <group position={pos} rotation={[0, rotY, 0]}>
  <B args={[0.22, 0.48, 0.44]} pos={[-0.46, 0.24, 0]} color={C.dark} />
  <B args={[0.66, 0.42, 0.04]} pos={[0.12, 0.44, 0]} color={C.dark} />
  <mesh position={[0.12, 0.44, 0.021]}><planeGeometry args={[0.6, 0.36]} /><meshBasicMaterial map={txt(screen, { bg: '#11141c', fg, size: 170 })} /></mesh>
  <B args={[0.05, 0.22, 0.05]} pos={[0.12, 0.12, -0.02]} color={C.gray} />
  <Shadow pos={[-0.1, 0, 0]} r={0.6} />
</group>;

// península abstracta (no es el mapa del juego) sobre mar azul
export const Land = ({ t = 0, rise = 1 }) => {
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    const pts = [[-0.9, 0.9], [0.5, 0.95], [0.75, 0.6], [0.55, 0.1], [0.4, -0.5], [0.15, -0.95], [-0.05, -0.75], [-0.2, -0.2], [-0.5, 0.25], [-0.95, 0.45]];
    s.moveTo(...pts[0]); pts.slice(1).forEach((p) => s.lineTo(...p)); s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.1, bevelEnabled: false }); g.rotateX(-Math.PI / 2); return g;
  }, []);
  return <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}><circleGeometry args={[1.5, 64]} /><HT color={C.blue} /></mesh>
    <mesh geometry={geo} scale={[1, Math.max(0.01, rise), 1]}><HT color={C.paper} /></mesh>
    {Array.from({ length: 18 }).map((_, k) => { const a = k / 18 * Math.PI * 2 + t * 0.25; return <mesh key={k} position={[Math.cos(a) * 1.3, 0.01, Math.sin(a) * 1.3]} rotation={[-Math.PI / 2, 0, a]}><planeGeometry args={[0.16, 0.015]} /><meshBasicMaterial color={C.text} transparent opacity={0.6} /></mesh>; })}
  </group>;
};

export const Pawn = ({ pos = [0, 0, 0], color = C.red, t = 0, s = 1, hop = 0 }) => <group position={[pos[0], pos[1] + Math.abs(Math.sin(t * 3)) * 0.05 * hop, pos[2]]} scale={s}>
  <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.13, 0.15, 0.12, 24]} /><HT color={color} /></mesh>
  <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.06, 0.11, 0.3, 24]} /><HT color={color} /></mesh>
  <mesh position={[0, 0.47, 0]}><sphereGeometry args={[0.1, 24, 16]} /><HT color={color} /></mesh>
</group>;

// pastel con velas (edad)
export const Cake = ({ pos = [0, 0, 0], t = 0, candles = 10 }) => <group position={pos}>
  <mesh position={[0, 0.16, 0]}><cylinderGeometry args={[0.42, 0.44, 0.3, 40]} /><HT color={C.paper} /></mesh>
  <mesh position={[0, 0.33, 0]}><cylinderGeometry args={[0.43, 0.43, 0.04, 40]} /><HT color={C.red} /></mesh>
  {Array.from({ length: Math.min(24, candles) }).map((_, k) => { const n = Math.min(24, candles); const a = k / n * Math.PI * 2; return <group key={k} position={[Math.cos(a) * 0.3, 0.42, Math.sin(a) * 0.3]}>
    <mesh><cylinderGeometry args={[0.012, 0.012, 0.14, 8]} /><HT color={k % 2 ? C.blue : C.lime} /></mesh>
    <mesh position={[0, 0.1 + Math.sin(t * 9 + k) * 0.006, 0]} scale={[1, 1.4 + Math.sin(t * 7 + k) * 0.2, 1]}><sphereGeometry args={[0.018, 8, 6]} /><meshBasicMaterial color={C.lime} /></mesh>
  </group>; })}
  <Shadow r={0.5} />
</group>;

export const Clock = ({ pos = [0, 0, 0], t = 0, spin = 0.5, s = 1 }) => <group position={pos} scale={s}>
  <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.34, 0.34, 0.06, 48]} /><HT color={C.paper} /></mesh>
  {Array.from({ length: 12 }).map((_, k) => { const a = k / 12 * Math.PI * 2; return <mesh key={k} position={[Math.sin(a) * 0.27, Math.cos(a) * 0.27, 0.035]}><boxGeometry args={[0.014, k % 3 ? 0.03 : 0.06, 0.01]} /><meshBasicMaterial color={C.bg} /></mesh>; })}
  <group rotation={[0, 0, -t * spin * 0.3]}><mesh position={[0, 0.08, 0.04]}><boxGeometry args={[0.03, 0.17, 0.01]} /><meshBasicMaterial color={C.bg} /></mesh></group>
  <group rotation={[0, 0, -t * spin * 3]}><mesh position={[0, 0.11, 0.045]}><boxGeometry args={[0.016, 0.23, 0.01]} /><meshBasicMaterial color={C.red} /></mesh></group>
</group>;

export const Disk = ({ pos = [0, 0, 0], fill = 0.5 }) => <group position={pos}>
  <B args={[1.4, 0.3, 0.14]} pos={[0, 0, 0]} color={C.card2} />
  <mesh position={[-0.65 + 0.65 * cl(fill), 0, 0.075]}><boxGeometry args={[1.3 * cl(fill) + 0.001, 0.2, 0.02]} /><meshBasicMaterial color={fill > 0.85 ? C.red : C.lime} /></mesh>
</group>;

// línea de tiempo de lanzamientos: un punto por año; el salto final se resalta en rojo
export const Timeline = ({ years = [], gapFrom, gapTo, u = 1, hi = 0 }) => {
  const y0 = years[0], y1 = years[years.length - 1], X = (y) => -1.5 + (y - y0) / (y1 - y0) * 3;
  return <group>
    <mesh position={[-1.5 + 1.55 * u, 0, 0]}><boxGeometry args={[3.1 * u + 0.001, 0.012, 0.012]} /><meshBasicMaterial color={C.gray} /></mesh>
    {years.map((y, k) => { const s = cl((u - (X(y) + 1.5) / 3 * 0.92) * 8); const last = y === y1; return <group key={k} position={[X(y), 0, 0]} scale={Math.max(0.001, s)}>
      <mesh><sphereGeometry args={[last ? 0.07 : 0.05, 24, 16]} /><HT color={last ? C.red : C.text} /></mesh>
    </group>; })}
    {gapFrom && hi > 0.01 ? <mesh position={[X(gapFrom) + (X(gapTo) - X(gapFrom)) * hi / 2, 0, 0.01]}><boxGeometry args={[(X(gapTo) - X(gapFrom)) * hi, 0.05, 0.03]} /><meshBasicMaterial color={C.red} /></mesh> : null}
  </group>;
};
