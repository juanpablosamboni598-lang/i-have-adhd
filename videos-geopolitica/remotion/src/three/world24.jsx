import React, { useMemo } from 'react';
import * as THREE from 'three';
import { OL, Part, cl, tw, lerp } from './kit.jsx';

// Video largo v24: el microondas (horizontal 16:9, estilo dibujado v2).
export const C = { wall: '#f4dfc3', wall2: '#ead0ac', counter: '#d9dcd8', wood: '#c9a26b', shell: '#f2f2ee', dark: '#2b2f36', metal: '#b9c3ca',
  copper: '#c8743a', red: '#e2483d', green: '#2bb36b', blue: '#3d7ee0', yellow: '#ffd23d', glass: '#9fc6d8', choc: '#5a3825', paper: '#f7f2e4', food: '#f0d9a0' };
export const MW = { W: 0.6, H: 0.36, D: 0.42, Y: 0.18 + 0.9 };  // microondas sobre el mesón (y del centro)

export const Lights = () => <>
  <ambientLight intensity={0.85} />
  <directionalLight position={[-2.5, 3.2, 2.6]} intensity={1.9} castShadow shadow-mapSize={[1024, 1024]}
    shadow-camera-left={-3} shadow-camera-right={3} shadow-camera-top={3} shadow-camera-bottom={-1} shadow-camera-near={0.5} shadow-camera-far={10} shadow-bias={-0.0015} />
</>;

// cocina: pared, mesón con gabinetes
export const Kitchen = () => <group>
  <color attach="background" args={[C.wall]} />
  <mesh position={[0, 1.5, -0.45]} receiveShadow><planeGeometry args={[10, 5]} /><meshToonMaterial color={C.wall} transparent /></mesh>
  {Array.from({ length: 14 }).map((_, k) => <mesh key={k} position={[-3.25 + k * 0.5, 1.35, -0.445]}><boxGeometry args={[0.006, 0.9, 0.002]} /><meshBasicMaterial color={C.wall2} transparent /></mesh>)}
  <Part geo={<boxGeometry args={[4, 0.06, 0.9]} />} color={C.counter} pos={[0, 0.87, 0]} t={0.008} />
  <Part geo={<boxGeometry args={[4, 0.84, 0.85]} />} color={C.wood} pos={[0, 0.42, 0.01]} t={0.008} />
  {[-1.5, -0.5, 0.5, 1.5].map((x) => <group key={x}><mesh position={[x, 0.45, 0.44]}><boxGeometry args={[0.92, 0.74, 0.01]} /><meshToonMaterial color="#d6b07a" transparent /><OL t={0.004} /></mesh>
    <mesh position={[x + 0.36, 0.6, 0.455]}><boxGeometry args={[0.03, 0.12, 0.02]} /><meshToonMaterial color={C.metal} transparent /></mesh></group>)}
</group>;

// onda senoidal (cinta) que avanza
const Wave = ({ t, from, to, amp = 0.03, k = 18, col = C.red, speed = 4, op = 1 }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  const A = new THREE.Vector3(...from), B = new THREE.Vector3(...to), dir = B.clone().sub(A), L = dir.length(); dir.normalize();
  const up = Math.abs(dir.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
  const n = 80, pts = [];
  for (let i = 0; i <= n; i++) { const u = i / n; pts.push(A.clone().addScaledVector(dir, u * L).addScaledVector(up, Math.sin(u * k - t * speed) * amp)); }
  geo.setFromPoints(pts);
  return <line geometry={geo}><lineBasicMaterial color={col} transparent opacity={op} linewidth={2} /></line>;
};

// molécula de agua (O rojo + 2 H blancos) que se voltea
export const Water = ({ pos = [0, 0, 0], rot = 0, s = 1 }) => <group position={pos} rotation={[0, 0, rot]} scale={s}>
  <mesh><sphereGeometry args={[0.05, 20, 16]} /><meshToonMaterial color={C.red} transparent /><OL t={0.004} /></mesh>
  {[-1, 1].map((q) => <mesh key={q} position={[q * 0.045, -0.035, 0]}><sphereGeometry args={[0.03, 16, 12]} /><meshToonMaterial color="#ffffff" transparent /><OL t={0.003} /></mesh>)}
</group>;

// comida en un plato: domo con capas (rojo afuera = caliente, azul adentro = frío) y corte opcional
export const Food = ({ pos = [0, 0, 0], heat = 0, depth = 0.25, cut = 0, r = 0.11, spin = 0 }) => {
  const outer = new THREE.Color(C.food).lerp(new THREE.Color('#ff6a2a'), cl(heat));
  const inner = new THREE.Color('#7fb3e6').lerp(new THREE.Color('#ffb26b'), cl(heat - depth));
  return <group position={pos} rotation={[0, spin, 0]}>
    <Part geo={<cylinderGeometry args={[r * 1.5, r * 1.3, 0.015, 40]} />} color="#ffffff" pos={[0, 0.008, 0]} t={0.004} />
    <mesh position={[0, 0.015, 0]} rotation={[0, cut > 0 ? Math.PI : 0, 0]} castShadow><sphereGeometry args={[r, 32, 16, 0, Math.PI * 2 - cut * Math.PI, 0, Math.PI / 2]} /><meshToonMaterial color={outer} transparent side={THREE.DoubleSide} /><OL t={0.004} /></mesh>
    {cut > 0 ? <group>
      {/* corte: capa exterior caliente y centro frío */}
      <mesh position={[0, 0.015, 0.001]}><circleGeometry args={[r, 32, 0, Math.PI]} /><meshToonMaterial color={outer} transparent side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.016, 0.003]}><circleGeometry args={[r * 0.62, 32, 0, Math.PI]} /><meshToonMaterial color={inner} transparent side={THREE.DoubleSide} /></mesh>
    </group> : null}
  </group>;
};

// el microondas. xr = rayos X; door 0 cerrado → 1 abierto
export const Microwave = ({ t = 0, xr = 0, on = 0, door = 0, mag = 0, guide = 0, waves = 0, spots = 0, plate = 1, spin = 0, food = 1, heat = 0, depth = 0.25, cut = 0, grid = 0, mesh = 0, fork = 0, egg = -1, cup = -1, broken = 0, stirrer = 0 }) => {
  const { W, H, D, Y } = MW; const op = 1 - 0.85 * xr; const cy = Y; const cx = -0.08;
  return <group>
    {/* carcasa */}
    <mesh position={[0, cy, 0]} castShadow={xr < 0.3}><boxGeometry args={[W, H, D]} /><meshToonMaterial color={C.shell} transparent opacity={op} depthWrite={xr < 0.5} />{xr < 0.6 ? <OL t={0.008} /> : null}</mesh>
    {/* panel de control */}
    <mesh position={[W / 2 - 0.08, cy, D / 2 + 0.002]}><boxGeometry args={[0.14, H - 0.04, 0.006]} /><meshToonMaterial color="#d9dde0" transparent opacity={op} /></mesh>
    <mesh position={[W / 2 - 0.08, cy + 0.11, D / 2 + 0.006]}><boxGeometry args={[0.1, 0.035, 0.004]} /><meshBasicMaterial color={on ? '#2bd36b' : '#1d2a22'} transparent opacity={op} /></mesh>
    {/* puerta con vidrio (y rejilla) — gira en la bisagra izquierda */}
    {door < 0.99 ? <group position={[-W / 2, cy, D / 2 + 0.01]} rotation={[0, -door * 1.6 - broken * 0.15, 0]}>
      <mesh position={[(W - 0.15) / 2, 0, 0]}><boxGeometry args={[W - 0.15, H - 0.02, 0.02]} /><meshToonMaterial color={C.dark} transparent opacity={op * 0.9} /><OL t={0.004} /></mesh>
      <mesh position={[(W - 0.15) / 2, 0, 0.012]}><boxGeometry args={[W - 0.25, H - 0.1, 0.004]} /><meshToonMaterial color={C.glass} transparent opacity={0.55 * op + 0.1} /></mesh>
      {grid > 0 ? <group position={[(W - 0.15) / 2, 0, 0.016]}>{Array.from({ length: 13 }).map((_, i) => Array.from({ length: 7 }).map((_, j) => <mesh key={i + '-' + j} position={[-0.17 + i * 0.028, -0.09 + j * 0.03, 0]}><circleGeometry args={[0.008 * grid, 10]} /><meshBasicMaterial color="#1a1d22" transparent /></mesh>))}</group> : null}
    </group> : null}
    {/* interior */}
    {xr > 0.3 || door > 0.3 ? <group position={[cx, cy - H / 2 + 0.03, 0]}>
      {plate ? <group rotation={[0, spin, 0]}><Part geo={<cylinderGeometry args={[0.16, 0.16, 0.01, 48]} />} color={C.glass} t={0.004} />
        <mesh position={[0.12, 0.007, 0]}><boxGeometry args={[0.02, 0.003, 0.02]} /><meshBasicMaterial color={C.red} transparent /></mesh></group> : null}
      {food ? <Food pos={[0, 0.01, 0]} heat={heat} depth={depth} cut={cut} spin={spin} /> : null}
      {fork ? <group position={[0.02, 0.03, 0]} rotation={[0, 0.4, Math.PI / 2]}>
        <Part geo={<boxGeometry args={[0.012, 0.14, 0.004]} />} color={C.metal} t={0.002} />
        {[-1, 0, 1].map((q) => <Part key={q} geo={<boxGeometry args={[0.003, 0.05, 0.003]} />} color={C.metal} pos={[q * 0.005, 0.09, 0]} t={0.0015} />)}
        {Math.sin(t * 30) > 0.2 ? <mesh position={[0, 0.125, 0.01]}><sphereGeometry args={[0.012, 8, 6]} /><meshBasicMaterial color="#9fd8ff" transparent /></mesh> : null}
      </group> : null}
      {egg >= 0 ? <group position={[0, 0.05, 0]} scale={[0.04 * (1 + egg * 0.4), 0.055 * (1 + egg * 0.4), 0.04 * (1 + egg * 0.4)]}>
        {egg < 0.95 ? <mesh><sphereGeometry args={[1, 20, 16]} /><meshToonMaterial color="#f4ead6" transparent /><OL t={0.06} /></mesh>
          : Array.from({ length: 10 }).map((_, k) => <mesh key={k} position={[Math.cos(k) * 2.5, Math.sin(k * 2) * 1.5 + 1, Math.sin(k) * 2.5]}><boxGeometry args={[0.6, 0.4, 0.1]} /><meshToonMaterial color={k % 2 ? '#f4ead6' : C.yellow} transparent /></mesh>)}
      </group> : null}
      {cup >= 0 ? <group position={[0, 0.005, 0]}>
        <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.04, 0.035, 0.1, 24, 1, true]} /><meshToonMaterial color="#ffffff" transparent opacity={0.9} side={THREE.DoubleSide} /><OL t={0.003} /></mesh>
        <mesh position={[0, 0.045, 0]}><cylinderGeometry args={[0.037, 0.034, 0.08, 24]} /><meshToonMaterial color="#7cc4ef" transparent opacity={0.8} /></mesh>
        {cup > 0.5 ? Array.from({ length: 12 }).map((_, k) => { const u = cl((cup - 0.5) * 2); return <mesh key={k} position={[Math.cos(k * 2.1) * 0.05 * u, 0.1 + u * 0.12 * (1 + (k % 3)) / 2, Math.sin(k * 2.1) * 0.05 * u]}><sphereGeometry args={[0.008, 8, 6]} /><meshBasicMaterial color="#7cc4ef" transparent /></mesh>; }) : null}
      </group> : null}
      {/* puntos calientes / fríos (ondas estacionarias) */}
      {spots > 0 ? Array.from({ length: 5 }).map((_, i) => Array.from({ length: 4 }).map((_, j) => { const hot = (i + j) % 2 === 0; return <mesh key={i + '-' + j} position={[-0.2 + i * 0.1, 0.04, -0.15 + j * 0.1]} scale={0.03 * cl(spots)}><sphereGeometry args={[1, 12, 8]} /><meshToonMaterial color={hot ? C.red : C.blue} transparent opacity={0.6} depthWrite={false} /></mesh>; })) : null}
      {/* ventilador de metal (agitador) en el techo */}
      {stirrer ? <group position={[0, H - 0.07, 0]} rotation={[0, t * 3, 0]}>{[0, 1, 2, 3].map((k) => <mesh key={k} rotation={[0, k * Math.PI / 2, 0.3]} position={[Math.cos(k * Math.PI / 2) * 0.05, 0, -Math.sin(k * Math.PI / 2) * 0.05]}><boxGeometry args={[0.1, 0.004, 0.03]} /><meshToonMaterial color={C.metal} transparent /></mesh>)}</group> : null}
    </group> : null}
    {/* magnetrón (con aletas) detrás del panel y guía de onda */}
    {mag > 0 && (xr > 0.3) ? <group position={[W / 2 - 0.08, cy - 0.02, -0.05]} scale={cl(mag)}>
      <Part geo={<cylinderGeometry args={[0.045, 0.045, 0.09, 24]} />} color={C.copper} t={0.003} />
      {Array.from({ length: 6 }).map((_, k) => <mesh key={k} position={[0, -0.04 + k * 0.016, 0]}><boxGeometry args={[0.12, 0.004, 0.12]} /><meshToonMaterial color={C.metal} transparent /></mesh>)}
      {on ? <mesh position={[0, 0.06, 0]}><sphereGeometry args={[0.012 + Math.sin(t * 20) * 0.003, 10, 8]} /><meshBasicMaterial color={C.yellow} transparent /></mesh> : null}
    </group> : null}
    {guide > 0 && xr > 0.3 ? <group>
      <mesh position={[W / 2 - 0.08 - 0.13 * cl(guide), cy + 0.12, -0.05]}><boxGeometry args={[0.26 * cl(guide), 0.04, 0.08]} /><meshToonMaterial color={C.metal} transparent opacity={0.7} /><OL t={0.003} /></mesh>
    </group> : null}
    {waves > 0 && xr > 0.3 ? <group>
      <Wave t={t} from={[W / 2 - 0.08, cy + 0.12, -0.05]} to={[cx, cy + 0.12, -0.05]} amp={0.015} k={14} op={cl(waves)} />
      {[-0.1, 0, 0.1].map((z, k) => <Wave key={k} t={t + k} from={[cx - 0.2, cy + 0.12 - k * 0.04, z]} to={[cx + 0.2, cy - 0.1 + k * 0.03, z]} amp={0.02} k={16} op={cl(waves) * 0.8} />)}
    </group> : null}
  </group>;
};

// laboratorio 1945: banco, magnetrón grande, antena de radar, barra de chocolate
export const Lab = ({ t = 0, melt = 0, on = 0 }) => <group>
  <color attach="background" args={['#dfe6d6']} />
  <mesh position={[0, 1.5, -0.45]} receiveShadow><planeGeometry args={[10, 5]} /><meshToonMaterial color="#dfe6d6" transparent /></mesh>
  <Part geo={<boxGeometry args={[2.4, 0.06, 0.8]} />} color="#8a6d4a" pos={[0, 0.87, 0]} t={0.008} />
  <Part geo={<boxGeometry args={[0.08, 0.84, 0.7]} />} color="#6f5638" pos={[-1.1, 0.42, 0]} t={0.006} />
  <Part geo={<boxGeometry args={[0.08, 0.84, 0.7]} />} color="#6f5638" pos={[1.1, 0.42, 0]} t={0.006} />
  <group position={[-0.25, 1.0, -0.05]}>
    <Part geo={<cylinderGeometry args={[0.09, 0.09, 0.18, 24]} />} color={C.copper} t={0.004} />
    {Array.from({ length: 8 }).map((_, k) => <mesh key={k} position={[0, -0.08 + k * 0.022, 0]}><boxGeometry args={[0.24, 0.006, 0.24]} /><meshToonMaterial color={C.metal} transparent /><OL t={0.002} /></mesh>)}
    {on ? <mesh position={[0, 0.12, 0]}><sphereGeometry args={[0.02 + Math.sin(t * 20) * 0.005, 10, 8]} /><meshBasicMaterial color={C.yellow} transparent /></mesh> : null}
  </group>
  <group position={[0.75, 1.35, -0.2]} rotation={[0.3, -0.5 + Math.sin(t * 0.6) * 0.3, 0]}>
    <mesh><sphereGeometry args={[0.32, 32, 12, 0, Math.PI * 2, 0, 0.9]} /><meshToonMaterial color={C.metal} transparent side={THREE.DoubleSide} /><OL t={0.005} /></mesh>
  </group>
  <Part geo={<cylinderGeometry args={[0.02, 0.03, 0.45, 12]} />} color={C.dark} pos={[0.75, 1.1, -0.2]} t={0.003} />
  {/* barra de chocolate que se derrite */}
  <group position={[0.15, 0.92, 0.15]}>
    <mesh scale={[1 + melt * 0.5, 1 - melt * 0.7, 1 + melt * 0.3]}><boxGeometry args={[0.14, 0.025, 0.06]} /><meshToonMaterial color={C.choc} transparent /><OL t={0.003} /></mesh>
    <mesh position={[0, 0.016 - melt * 0.012, 0]} scale={[1, 1, 1]}><boxGeometry args={[0.13, 0.008, 0.05]} /><meshToonMaterial color={melt > 0.5 ? C.choc : '#c0392b'} transparent /></mesh>
    {melt > 0.3 ? <mesh position={[0.04, -0.012, 0.04]} scale={[1, 0.2, 1]}><sphereGeometry args={[0.04 * melt, 16, 8]} /><meshToonMaterial color={C.choc} transparent /></mesh> : null}
  </group>
</group>;

// hoja de patente
export const Patent = ({ op = 1 }) => <group position={[0.05, 0.95, 0.05]} rotation={[-1.2, 0, 0.1]}>
  <Part geo={<boxGeometry args={[0.42, 0.56, 0.003]} />} color={C.paper} t={0.003} />
  {Array.from({ length: 12 }).map((_, k) => <mesh key={k} position={[0, 0.2 - k * 0.035, 0.003]}><boxGeometry args={[0.34 - (k % 3) * 0.05, 0.006, 0.001]} /><meshBasicMaterial color="#6d6658" transparent /></mesh>)}
  <mesh position={[-0.1, -0.2, 0.003]}><circleGeometry args={[0.05, 24]} /><meshBasicMaterial color="#c0392b" transparent /></mesh>
</group>;

// Radarange 1947: gabinete alto junto a una silueta de persona
export const Radarange = ({ show = 1, person = 1 }) => show ? <group position={[0, 0, -0.1]}>
  <color attach="background" args={['#e6e1d6']} />
  <mesh position={[0, 1.5, -0.45]} receiveShadow><planeGeometry args={[10, 5]} /><meshToonMaterial color="#e6e1d6" transparent /></mesh>
  <mesh position={[0, 0, 0.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[10, 3]} /><meshToonMaterial color="#cdbfa8" transparent /></mesh>
  <Part geo={<boxGeometry args={[0.7, 1.8, 0.6]} />} color="#c9cfd4" pos={[0, 0.9 + 0.0, 0]} t={0.008} />
  <mesh position={[0, 1.3, 0.305]}><boxGeometry args={[0.5, 0.4, 0.01]} /><meshToonMaterial color={C.dark} transparent /><OL t={0.004} /></mesh>
  {Array.from({ length: 6 }).map((_, k) => <mesh key={k} position={[-0.15 + k * 0.06, 0.8, 0.306]}><circleGeometry args={[0.018, 12]} /><meshBasicMaterial color={k % 2 ? C.red : '#555'} transparent /></mesh>)}
  {person ? <group position={[0.75, 0, 0.1]}>
    <mesh position={[0, 0.85, 0]}><capsuleGeometry args={[0.16, 0.9, 8, 16]} /><meshToonMaterial color="#5d7fa8" transparent /><OL t={0.005} /></mesh>
    <mesh position={[0, 1.55, 0]}><sphereGeometry args={[0.13, 20, 16]} /><meshToonMaterial color="#e8b98f" transparent /><OL t={0.005} /></mesh>
  </group> : null}
</group> : null;
