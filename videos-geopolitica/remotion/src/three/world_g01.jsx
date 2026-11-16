// ViceLeakss (GTA 6, canal no oficial): objetos 3D 100% originales y genéricos.
// Nada de logos, arte, personajes, mapas ni tipografía del juego.
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { OL, cl, tw, drop, lerp, INK } from './kit.jsx';

export const P = {
  wall: '#ffe1c2', wall2: '#f4c9a0', floor: '#d3ece8', tile: '#b5d9d3', teal: '#1fb5a5', teal2: '#147f75', orange: '#ff8a3c',
  red: '#e2483d', green: '#2bb36b', yellow: '#ffd23d', white: '#f6f7f9', dark: '#23262d', metal: '#a7b1b8', sea: '#5ab4ff',
  sand: '#f3d79c', purple: '#7a5cd6', blue: '#3f6fb0', pink: '#ff8fc0',
};

// textura de texto (canvas, determinista)
const _tx = {};
export const txt = (s, { bg = P.white, fg = INK, w = 512, h = 256, size = 120, weight = 900 } = {}) => {
  const k = [s, bg, fg, w, h, size, weight].join('|');
  if (_tx[k]) return _tx[k];
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d');
  if (bg) { g.fillStyle = bg; g.fillRect(0, 0, w, h); }
  g.fillStyle = fg; g.font = `${weight} ${size}px "Inter Display", Inter, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
  String(s).split('\n').forEach((line, i, a) => g.fillText(line, w / 2, h / 2 + (i - (a.length - 1) / 2) * size * 1.05));
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  return (_tx[k] = tex);
};

const M = ({ color, op = 1, map }) => <meshToonMaterial color={color} map={map} transparent opacity={op} />;
const B = ({ args, color, pos, rot, ol = 0.01, map, cast = true, op = 1 }) => <mesh position={pos} rotation={rot} castShadow={cast}>
  <boxGeometry args={args} /><M color={color} map={map} op={op} />{ol ? <OL t={ol} /> : null}</mesh>;

export const LightsG = () => <>
  <ambientLight intensity={0.85} />
  <directionalLight position={[-3.4, 3.6, 3.0]} intensity={1.9} castShadow shadow-mapSize={[1024, 1024]}
    shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-1} shadow-camera-near={0.5} shadow-camera-far={16} shadow-bias={-0.0015} />
</>;

// escenario fijo: pared clara + piso de baldosas turquesa
export const Studio = ({ wallZ = -1.2 }) => {
  const tiles = useMemo(() => {
    const a = [];
    for (let i = -10; i <= 10; i++) a.push(<mesh key={'x' + i} position={[i * 0.5, 0.002, 1.5]}><boxGeometry args={[0.014, 0.002, 8]} /><meshBasicMaterial color={P.tile} /></mesh>);
    for (let j = -2; j <= 14; j++) a.push(<mesh key={'z' + j} position={[0, 0.002, wallZ + j * 0.5]}><boxGeometry args={[10, 0.002, 0.014]} /><meshBasicMaterial color={P.tile} /></mesh>);
    return a;
  }, [wallZ]);
  return <group>
    <color attach="background" args={[P.wall]} />
    <mesh position={[0, 3, wallZ]} receiveShadow><planeGeometry args={[20, 6]} /><meshToonMaterial color={P.wall} /></mesh>
    <mesh position={[0, 0.08, wallZ + 0.02]}><boxGeometry args={[20, 0.16, 0.04]} /><meshToonMaterial color={P.wall2} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 2.5]} receiveShadow><planeGeometry args={[20, 10]} /><meshToonMaterial color={P.floor} /></mesh>
    {tiles}
  </group>;
};

// partículas de ambiente (confeti lento) = capa de movimiento siempre activa
export const Confetti = ({ t, n = 26, area = [3, 1.6, 1.5], y0 = 0.3, colors = [P.yellow, P.teal, P.orange, P.pink, P.white] }) => <group>
  {Array.from({ length: n }).map((_, k) => {
    const u = ((t * 0.12 + k * 0.137) % 1);
    const x = ((k * 0.618) % 1 - 0.5) * area[0] + Math.sin(t * 0.8 + k) * 0.08;
    const z = ((k * 0.371) % 1 - 0.5) * area[2];
    return <mesh key={k} position={[x, y0 + (1 - u) * area[1], z]} rotation={[t * 2 + k, t * 1.3 + k * 2, 0]}>
      <planeGeometry args={[0.035, 0.022]} /><meshBasicMaterial color={colors[k % colors.length]} side={THREE.DoubleSide} />
    </mesh>;
  })}
</group>;

export const Palm = ({ pos = [0, 0, 0], s = 1, t = 0 }) => {
  const sway = Math.sin(t * 1.4 + pos[0]) * 0.06;
  return <group position={pos} scale={s}>
    {Array.from({ length: 6 }).map((_, k) => <mesh key={k} position={[sway * k * 0.3, 0.12 + k * 0.2, 0]} rotation={[0, 0, sway * 0.4]} castShadow>
      <cylinderGeometry args={[0.045 - k * 0.003, 0.055 - k * 0.003, 0.2, 10]} /><M color={k % 2 ? '#b98b55' : '#a87a47'} /><OL t={0.006} /></mesh>)}
    <group position={[sway * 1.8, 1.28, 0]}>
      {Array.from({ length: 7 }).map((_, k) => <mesh key={k} rotation={[0, (k / 7) * Math.PI * 2, -0.55 - Math.sin(t * 2 + k) * 0.05]} position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.07, 0.015, 0.55]} /><M color={k % 2 ? P.green : '#24995b'} /><OL t={0.005} />
      </mesh>)}
    </group>
  </group>;
};

export const Building = ({ pos, w = 0.4, h = 1, d = 0.4, color = P.white, rise = 1, win = '#7fc4e8' }) => {
  const hh = Math.max(0.001, h * rise);
  const rows = Math.max(1, Math.floor(h / 0.18));
  return <group position={pos}>
    <mesh position={[0, hh / 2, 0]} castShadow receiveShadow><boxGeometry args={[w, hh, d]} /><M color={color} /><OL t={0.01} /></mesh>
    {rise > 0.95 ? Array.from({ length: rows }).map((_, r) => <mesh key={r} position={[0, 0.12 + r * 0.18, d / 2 + 0.002]}><planeGeometry args={[w * 0.75, 0.07]} /><meshBasicMaterial color={win} /></mesh>) : null}
  </group>;
};

export const City = ({ t, rise = 1, pos = [0, 0, -0.6] }) => {
  const B2 = [[-1.5, 0.5, 1.3, P.white], [-1.0, 0.45, 1.9, P.pink], [-0.5, 0.5, 1.5, P.yellow], [0.0, 0.42, 2.3, P.white], [0.5, 0.5, 1.6, P.teal], [1.0, 0.45, 2.0, P.orange], [1.5, 0.5, 1.2, P.white]];
  return <group position={pos}>{B2.map(([x, w, h, c], k) => <Building key={k} pos={[x, 0, 0]} w={w} h={h} color={c} rise={rise * drop(t, 0.1 + k * 0.12, 0.6)} />)}</group>;
};

export const Car = ({ pos = [0, 0, 0], rotY = 0, color = P.red, t = 0, roll = 1 }) => <group position={pos} rotation={[0, rotY, 0]}>
  <B args={[0.62, 0.13, 0.28]} pos={[0, 0.12, 0]} color={color} />
  <B args={[0.3, 0.1, 0.24]} pos={[-0.04, 0.23, 0]} color={'#cfe9ff'} ol={0.008} />
  <B args={[0.04, 0.04, 0.24]} pos={[0.31, 0.13, 0]} color={P.yellow} ol={0} />
  {[[-0.2, 0.14], [0.2, 0.14], [-0.2, -0.14], [0.2, -0.14]].map(([x, z], k) => <mesh key={k} position={[x, 0.065, z]} rotation={[Math.PI / 2, 0, -t * 8 * roll]} castShadow>
    <cylinderGeometry args={[0.065, 0.065, 0.05, 14]} /><M color={P.dark} /><OL t={0.006} /></mesh>)}
</group>;

// consola genérica: placa alta (modelo A) o torre cúbica (modelo B)
export const Console = ({ pos = [0, 0, 0], kind = 'a', color = P.white, glow = 0, t = 0, rotY = 0, s = 1 }) => <group position={pos} rotation={[0, rotY, 0]} scale={s}>
  {kind === 'a' ? <>
    <B args={[0.12, 0.62, 0.42]} pos={[0, 0.36, 0]} color={color} />
    <B args={[0.06, 0.66, 0.46]} pos={[-0.08, 0.37, 0]} color={P.dark} ol={0.008} />
    <B args={[0.26, 0.04, 0.3]} pos={[0, 0.02, 0]} color={P.dark} ol={0.006} />
    <mesh position={[0.065, 0.36, 0]}><boxGeometry args={[0.005, 0.5, 0.02]} /><meshBasicMaterial color={glow ? '#7fd3ff' : '#9aa3aa'} /></mesh>
  </> : <>
    <B args={[0.36, 0.6, 0.36]} pos={[0, 0.3, 0]} color={color} />
    <mesh position={[0, 0.605, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.13, 24]} /><meshBasicMaterial color={P.dark} /></mesh>
    <mesh position={[0, 0.5, 0.182]}><circleGeometry args={[0.02, 14]} /><meshBasicMaterial color={glow ? P.green : '#9aa3aa'} /></mesh>
  </>}
  {glow ? <pointLight position={[0.2, 0.4, 0.3]} intensity={0.6 * glow * (0.8 + 0.2 * Math.sin(t * 4))} distance={1.5} color="#bfe8ff" /> : null}
</group>;

export const Pad = ({ pos = [0, 0, 0], rot = [0, 0, 0], color = P.dark, s = 1 }) => <group position={pos} rotation={rot} scale={s}>
  <B args={[0.24, 0.05, 0.12]} pos={[0, 0, 0]} color={color} ol={0.007} />
  {[-0.13, 0.13].map((x, k) => <mesh key={k} position={[x, -0.005, 0.04]} rotation={[0.5, 0, 0]} castShadow><capsuleGeometry args={[0.04, 0.06, 4, 10]} /><M color={color} /><OL t={0.006} /></mesh>)}
  {[-0.05, 0.05].map((x, k) => <mesh key={k} position={[x, 0.035, 0.02]}><cylinderGeometry args={[0.02, 0.02, 0.02, 12]} /><M color={P.metal} /></mesh>)}
  {[[0.09, -0.02, P.green], [0.11, 0, P.red], [0.07, 0, P.blue], [0.09, 0.02, P.yellow]].map(([x, z, c], k) => <mesh key={'b' + k} position={[x, 0.03, z - 0.02]}><sphereGeometry args={[0.009, 8, 6]} /><meshBasicMaterial color={c} /></mesh>)}
</group>;

// calendario de mesa con hoja (textura de texto) que se voltea
export const csz = (l) => Math.max(...String(l).split('\n').map((x) => x.length)) > 5 ? 78 : 110;
export const Calendar = ({ pos = [0, 0, 0], label = '19\nNOV', next, flip = 0, red = 0, s = 1, rotY = 0 }) => <group position={pos} scale={s} rotation={[0, rotY, 0]}>
  <B args={[0.62, 0.66, 0.06]} pos={[0, 0.36, -0.04]} color={P.dark} ol={0.01} />
  <mesh position={[0, 0.33, 0.0]}><planeGeometry args={[0.56, 0.52]} /><meshToonMaterial map={txt(next || label, { bg: P.white, fg: red ? P.red : INK, size: csz(next || label) })} /></mesh>
  {flip > 0 && flip < 1 ? <group position={[0, 0.6, 0.005]} rotation={[-flip * Math.PI, 0, 0]}>
    <mesh position={[0, -0.27, 0]}><planeGeometry args={[0.56, 0.52]} /><meshToonMaterial map={txt(label, { bg: P.white, fg: INK, size: csz(label) })} side={THREE.DoubleSide} /></mesh>
  </group> : null}
  <B args={[0.62, 0.1, 0.07]} pos={[0, 0.66, -0.03]} color={P.red} ol={0.008} />
  {[-0.18, 0, 0.18].map((x, k) => <mesh key={k} position={[x, 0.68, 0.02]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.025, 0.007, 6, 14]} /><M color={P.metal} /></mesh>)}
</group>;

export const Coins = ({ pos = [0, 0, 0], n = 8, t = 0, at = 0, color = P.yellow }) => <group position={pos}>
  {Array.from({ length: n }).map((_, k) => { const dd = drop(t, at + k * 0.12, 0.45); return <mesh key={k} position={[Math.sin(k) * 0.01, 0.02 + k * 0.035 + (1 - dd) * 1.2, 0]} rotation={[0, k * 0.7 + t, 0]} castShadow>
    <cylinderGeometry args={[0.1, 0.1, 0.03, 22]} /><M color={color} /><OL t={0.005} /></mesh>; })}
</group>;

// caja de juego genérica (estuche) con etiqueta de texto
export const Case = ({ pos = [0, 0, 0], rot = [0, 0, 0], color = P.teal, label = 'ESTÁNDAR', s = 1, gold = 0 }) => <group position={pos} rotation={rot} scale={s}>
  <B args={[0.4, 0.52, 0.05]} pos={[0, 0.26, 0]} color={gold ? '#e8b730' : color} />
  <mesh position={[0, 0.3, 0.026]}><planeGeometry args={[0.34, 0.2]} /><meshToonMaterial map={txt(label, { bg: P.white, fg: INK, size: 80 })} /></mesh>
  {gold ? <mesh position={[0, 0.12, 0.026]}><circleGeometry args={[0.05, 5]} /><meshBasicMaterial color={P.white} /></mesh> : null}
</group>;

export const Tag = ({ pos = [0, 0, 0], text = '$79.99', color = P.white, fg = INK, sc = 1, rot = [0, 0, 0] }) => <group position={pos} scale={Math.max(0.001, sc)} rotation={rot}>
  <mesh castShadow><boxGeometry args={[0.5, 0.2, 0.02]} /><M color={color} /><OL t={0.006} /></mesh>
  <mesh position={[0, 0, 0.011]}><planeGeometry args={[0.46, 0.17]} /><meshToonMaterial map={txt(text, { bg: color, fg, size: 120, w: 640, h: 240 })} /></mesh>
</group>;

// sello rojo tipo "RUMOR"
export const Stamp = ({ pos = [0, 0, 0], text = 'RUMOR', sc = 1, color = P.red, rot = [0, 0, -0.2] }) => sc <= 0.01 ? null : <group position={pos} rotation={rot} scale={sc}>
  <mesh><planeGeometry args={[0.7, 0.26]} /><meshBasicMaterial map={txt(text, { bg: null, fg: color, size: 150, w: 700, h: 260 })} transparent /></mesh>
</group>;

export const PC = ({ pos = [0, 0, 0], t = 0, screen = '?', fg = P.red, rotY = 0 }) => <group position={pos} rotation={[0, rotY, 0]}>
  <B args={[0.22, 0.48, 0.44]} pos={[-0.42, 0.24, 0]} color={P.dark} />
  <mesh position={[-0.42, 0.36, 0.222]}><circleGeometry args={[0.025, 12]} /><meshBasicMaterial color={P.teal} /></mesh>
  <B args={[0.62, 0.4, 0.04]} pos={[0.1, 0.42, 0]} color={P.dark} />
  <mesh position={[0.1, 0.42, 0.021]}><planeGeometry args={[0.56, 0.34]} /><meshBasicMaterial map={txt(screen, { bg: '#0f1a22', fg, size: 180 })} /></mesh>
  <B args={[0.05, 0.2, 0.05]} pos={[0.1, 0.12, -0.02]} color={P.metal} ol={0.005} />
  <B args={[0.5, 0.02, 0.16]} pos={[0.1, 0.01, 0.22]} color={P.metal} ol={0.005} />
</group>;

export const Clock = ({ pos = [0, 0, 0], t = 0, h = 12, m = 0, spin = 0, s = 1 }) => {
  const mm = m + spin * t * 60, hh = h + mm / 60;
  return <group position={pos} scale={s}>
    <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.32, 0.32, 0.06, 40]} /><M color={P.white} /><OL t={0.01} /></mesh>
    {Array.from({ length: 12 }).map((_, k) => { const a = k / 12 * Math.PI * 2; return <mesh key={k} position={[Math.sin(a) * 0.26, Math.cos(a) * 0.26, 0.035]}><boxGeometry args={[0.015, k % 3 ? 0.03 : 0.06, 0.01]} /><meshBasicMaterial color={INK} /></mesh>; })}
    <group rotation={[0, 0, -hh / 12 * Math.PI * 2]}><mesh position={[0, 0.08, 0.04]}><boxGeometry args={[0.03, 0.17, 0.01]} /><meshBasicMaterial color={INK} /></mesh></group>
    <group rotation={[0, 0, -mm / 60 * Math.PI * 2]}><mesh position={[0, 0.11, 0.045]}><boxGeometry args={[0.018, 0.23, 0.01]} /><meshBasicMaterial color={P.red} /></mesh></group>
    <mesh position={[0, 0, 0.05]}><circleGeometry args={[0.025, 12]} /><meshBasicMaterial color={INK} /></mesh>
  </group>;
};

// barra de almacenamiento (disco) que se llena
export const Disk = ({ pos = [0, 0, 0], fill = 0.5, s = 1 }) => {
  const c = fill > 0.85 ? P.red : fill > 0.6 ? P.orange : P.green;
  return <group position={pos} scale={s}>
    <B args={[1.3, 0.3, 0.12]} pos={[0, 0, 0]} color={P.dark} />
    <mesh position={[-0.6 + 0.6 * cl(fill), 0, 0.065]}><boxGeometry args={[1.2 * cl(fill) + 0.001, 0.2, 0.02]} /><meshToonMaterial color={c} /></mesh>
  </group>;
};

export const Phone = ({ pos = [0, 0, 0], rot = [0, 0, 0], screen = '!', fg = P.red, s = 1 }) => <group position={pos} rotation={rot} scale={s}>
  <B args={[0.32, 0.62, 0.035]} pos={[0, 0, 0]} color={P.dark} />
  <mesh position={[0, 0, 0.019]}><planeGeometry args={[0.28, 0.54]} /><meshBasicMaterial map={txt(screen, { bg: '#fff6ee', fg, size: 150, w: 256, h: 512 })} /></mesh>
</group>;

export const Shield = ({ pos = [0, 0, 0], t = 0, sc = 1 }) => sc <= 0.01 ? null : <group position={pos} scale={sc * (1 + Math.sin(t * 4) * 0.03)}>
  <mesh><sphereGeometry args={[0.55, 28, 18, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshToonMaterial color={P.teal} transparent opacity={0.28} side={THREE.DoubleSide} depthWrite={false} /></mesh>
  <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.55, 0.012, 6, 48]} /><meshBasicMaterial color={P.teal2} /></mesh>
</group>;

// burbujas de notificación que vuelan hacia el teléfono (spoilers)
export const Pings = ({ t, n = 8, on = 1, target = [0, 0.6, 0], color = P.red }) => on <= 0.01 ? null : <group>
  {Array.from({ length: n }).map((_, k) => {
    const u = ((t * 0.45 + k / n) % 1); const a = k * 2.399;
    const x = lerp(Math.cos(a) * 1.4, target[0], u), y = lerp(0.4 + (k % 3) * 0.35, target[1], u), z = lerp(Math.sin(a) * 0.8, target[2], u);
    return <mesh key={k} position={[x, y, z]} scale={0.6 + 0.4 * Math.sin(u * Math.PI)}><boxGeometry args={[0.16, 0.08, 0.02]} /><meshBasicMaterial color={k % 2 ? color : P.orange} /></mesh>;
  })}
</group>;

// península genérica (no es un mapa del juego): forma abstracta
export const Land = ({ pos = [0, 0, 0], t = 0, rise = 1 }) => {
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    const pts = [[-0.9, 0.9], [0.5, 0.95], [0.75, 0.6], [0.55, 0.1], [0.4, -0.5], [0.15, -0.95], [-0.05, -0.75], [-0.2, -0.2], [-0.5, 0.25], [-0.95, 0.45]];
    s.moveTo(...pts[0]); pts.slice(1).forEach((p) => s.lineTo(...p)); s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.08, bevelEnabled: false }); g.rotateX(-Math.PI / 2); return g;
  }, []);
  return <group position={pos}>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow><circleGeometry args={[1.5, 48]} /><meshToonMaterial color={P.sea} /></mesh>
    <mesh geometry={geo} scale={[1, Math.max(0.01, rise), 1]} castShadow receiveShadow><meshToonMaterial color={P.sand} /><OL t={0.01} /></mesh>
    {Array.from({ length: 14 }).map((_, k) => { const a = k / 14 * Math.PI * 2 + t * 0.3; return <mesh key={k} position={[Math.cos(a) * 1.25, 0.012, Math.sin(a) * 1.25]} rotation={[-Math.PI / 2, 0, a]}><planeGeometry args={[0.18, 0.02]} /><meshBasicMaterial color="#ffffff" /></mesh>; })}
  </group>;
};

// ficha genérica (peón) para representar "dos protagonistas" sin recrear a nadie
export const Pawn = ({ pos = [0, 0, 0], color = P.purple, t = 0, s = 1, hop = 0 }) => <group position={[pos[0], pos[1] + Math.abs(Math.sin(t * 3)) * 0.05 * hop, pos[2]]} scale={s}>
  <mesh position={[0, 0.06, 0]} castShadow><cylinderGeometry args={[0.13, 0.15, 0.12, 20]} /><M color={color} /><OL t={0.008} /></mesh>
  <mesh position={[0, 0.25, 0]} castShadow><cylinderGeometry args={[0.06, 0.11, 0.3, 20]} /><M color={color} /><OL t={0.008} /></mesh>
  <mesh position={[0, 0.47, 0]} castShadow><sphereGeometry args={[0.1, 20, 14]} /><M color={color} /><OL t={0.008} /></mesh>
</group>;
