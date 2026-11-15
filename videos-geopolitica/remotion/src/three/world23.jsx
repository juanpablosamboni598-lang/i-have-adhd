import React, { useMemo } from 'react';
import * as THREE from 'three';
import { OL, Part, Tube, cl, lerp, tw, INK } from './kit.jsx';

export const K = {
  wall: '#f3d9b8', wall2: '#e6c39a', floor: '#e4e9ee', tile: '#c9d1d8', shell: '#f6f7f9', metal: '#a7b1b8', dark: '#2b2f36',
  water: '#5ab4ff', water2: '#9fd6ff', dirty: '#9a8f6a', foam: '#ffffff', hot: '#ff5a3c', warm: '#ff9a3c', green: '#2bb36b',
  red: '#e2483d', yellow: '#ffd23d', teal: '#1fb5a5', concrete: '#9b9b94', rubber: '#3a3f45', wood: '#c9a26b', blue: '#3f6fb0',
};
const W = 0.62, H = 0.86, D = 0.6, CY = 0.46, R = 0.24, DL = 0.4; // carcasa, centro y radio del tambor, largo del tambor
export const WS = { W, H, D, CY, R };

export const Lights23 = () => <>
  <ambientLight intensity={0.85} />
  <directionalLight position={[-3.2, 3.4, 3.0]} intensity={1.9} castShadow shadow-mapSize={[1024, 1024]}
    shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-1} shadow-camera-near={0.5} shadow-camera-far={15} shadow-bias={-0.0015} />
</>;

// ---------- cuarto de ropas ----------
export const Laundry = ({ wallZ = -0.8 }) => {
  const tiles = useMemo(() => {
    const a = [];
    for (let i = -8; i <= 8; i++) a.push(<mesh key={'x' + i} position={[i * 0.4, 0.002, 1]}><boxGeometry args={[0.012, 0.002, 6]} /><meshBasicMaterial color={K.tile} /></mesh>);
    for (let j = -2; j <= 12; j++) a.push(<mesh key={'z' + j} position={[0, 0.002, wallZ + j * 0.4]}><boxGeometry args={[8, 0.002, 0.012]} /><meshBasicMaterial color={K.tile} /></mesh>);
    return a;
  }, [wallZ]);
  return <group>
    <color attach="background" args={[K.wall]} />
    <mesh position={[0, 2.5, wallZ]} receiveShadow><planeGeometry args={[16, 5]} /><meshToonMaterial color={K.wall} /></mesh>
    <mesh position={[0, 0.07, wallZ + 0.015]}><boxGeometry args={[16, 0.14, 0.03]} /><meshToonMaterial color={K.wall2} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 2]} receiveShadow><planeGeometry args={[16, 8]} /><meshToonMaterial color={K.floor} /></mesh>
    {tiles}
    {/* llave del agua y desagüe en la pared */}
    <mesh position={[0.55, 1.05, wallZ + 0.03]}><cylinderGeometry args={[0.03, 0.03, 0.06, 12]} /><meshToonMaterial color={K.metal} /><OL t={0.006} /></mesh>
    <mesh position={[0.55, 1.1, wallZ + 0.05]}><boxGeometry args={[0.1, 0.02, 0.02]} /><meshToonMaterial color={K.blue} /></mesh>
    <mesh position={[-0.55, 0.65, wallZ + 0.03]}><cylinderGeometry args={[0.04, 0.04, 0.5, 12]} /><meshToonMaterial color="#d8dde2" /><OL t={0.006} /></mesh>
    {/* repisa con canasta */}
    <mesh position={[-1.5, 1.5, wallZ + 0.15]} castShadow><boxGeometry args={[0.9, 0.04, 0.3]} /><meshToonMaterial color={K.wood} /><OL t={0.008} /></mesh>
    <mesh position={[-1.6, 1.62, wallZ + 0.15]} castShadow><cylinderGeometry args={[0.13, 0.11, 0.2, 14]} /><meshToonMaterial color="#7fc4e8" /><OL t={0.008} /></mesh>
    <mesh position={[-1.25, 1.6, wallZ + 0.15]} castShadow><boxGeometry args={[0.12, 0.16, 0.1]} /><meshToonMaterial color={K.red} /><OL t={0.006} /></mesh>
  </group>;
};

// ---------- ropa ----------
const CLOTH = ['#e2483d', '#3f6fb0', '#ffd23d', '#2bb36b', '#ff8fc0', '#7a5cd6', '#ffffff', '#1fb5a5'];
// mode: 0 quieta abajo, 1 da vueltas (sube y cae), 2 pegada a la pared (centrifugado)
export const Clothes = ({ t = 0, mode = 1, ang = 0, n = 8, dirt = 0, r = R - 0.05, len = DL - 0.08, slip = 0 }) => <group>
  {Array.from({ length: n }).map((_, k) => {
    let x, y;
    if (mode === 2) { const a = ang + k * Math.PI * 2 / n; x = Math.cos(a) * r; y = Math.sin(a) * r; }
    else if (mode === 1 && !slip) {
      const u = ((t * 0.55 + k / n) % 1);
      if (u < 0.6) { const a = -Math.PI / 2 - (u / 0.6) * 2.3; x = Math.cos(a) * r * 0.95; y = Math.sin(a) * r * 0.95; }
      else { const v = (u - 0.6) / 0.4; const a0 = -Math.PI / 2 - 2.3; const x0 = Math.cos(a0) * r * 0.95; x = lerp(x0, x0 * 0.2, v); y = lerp(Math.sin(a0) * r * 0.95, -r * 0.8, v * v); }
    } else { x = (k / (n - 1) - 0.5) * r * 1.2 + (slip ? Math.sin(t * 3 + k) * 0.03 : 0); y = -r * 0.78 + (k % 2) * 0.03; }
    const z = ((k * 0.37) % 1 - 0.5) * len;
    const c = dirt > 0.5 && k % 2 ? '#8a7a55' : CLOTH[k % CLOTH.length];
    return <mesh key={k} position={[x, y, z]} rotation={[t * 1.3 + k, t * 0.9 + k * 2, 0]} castShadow><boxGeometry args={[0.09, 0.05, 0.08]} /><meshToonMaterial color={c} /><OL t={0.005} /></mesh>;
  })}
</group>;

// tambor con huecos y paletas (eje en z)
const Drum = ({ ang = 0, holes = 1, paddles = 0, xr = 0 }) => {
  const holeList = useMemo(() => {
    const a = [];
    for (let i = 0; i < 18; i++) for (let j = 0; j < 4; j++) a.push([(i / 18) * Math.PI * 2 + (j % 2) * 0.17, (j / 3 - 0.5) * (DL - 0.08)]);
    return a;
  }, []);
  return <group rotation={[0, 0, ang]}>
    <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[R, R, DL, 36, 1, true]} /><meshToonMaterial color="#d6dde3" transparent opacity={0.45 - 0.2 * xr} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    <mesh position={[0, 0, -DL / 2]}><circleGeometry args={[R, 36]} /><meshToonMaterial color="#c3ccd3" transparent opacity={0.7} side={THREE.DoubleSide} /></mesh>
    {/* aros */}
    {[-DL / 2, DL / 2].map((z, k) => <mesh key={k} position={[0, 0, z]}><torusGeometry args={[R, 0.008, 6, 40]} /><meshBasicMaterial color={INK} /></mesh>)}
    {holes ? holeList.map(([a, z], k) => <mesh key={k} position={[Math.cos(a) * (R + 0.001), Math.sin(a) * (R + 0.001), z]} rotation={[0, 0, a]}><boxGeometry args={[0.004, 0.018, 0.018]} /><meshBasicMaterial color={INK} /></mesh>) : null}
    {paddles ? [0, 1, 2].map((k) => { const a = k * Math.PI * 2 / 3; return <mesh key={k} position={[Math.cos(a) * (R - 0.035), Math.sin(a) * (R - 0.035), 0]} rotation={[0, 0, a]} scale={paddles} castShadow><boxGeometry args={[0.07, 0.05, DL - 0.06]} /><meshToonMaterial color={K.metal} /><OL t={0.006} /></mesh>; }) : null}
  </group>;
};

// agua dentro (nivel 0..1 respecto del tambor)
const Water = ({ level = 0, dirty = 0, foam = 0, t = 0, spin = 0 }) => {
  if (level <= 0.01) return null;
  const h = level * R * 1.3;
  const y = -R * 0.98 + h / 2;
  const half = Math.sqrt(Math.max(0, R * R - (y + h / 2) * (y + h / 2) * 0.5));
  const col = '#' + new THREE.Color(K.water).lerp(new THREE.Color(K.dirty), dirty).getHexString();
  return <group>
    <mesh position={[0, y, 0]} rotation={[0, 0, Math.sin(t * 2.4) * 0.06 * (1 - spin)]}><boxGeometry args={[Math.min(R * 1.9, half * 2 + 0.1), h, DL + 0.04]} /><meshToonMaterial color={col} transparent opacity={0.55} depthWrite={false} /></mesh>
    {foam > 0.01 ? Array.from({ length: 14 }).map((_, k) => <mesh key={k} position={[((k * 0.29) % 1 - 0.5) * R * 1.4, y + h / 2 + 0.01 + Math.sin(t * 3 + k) * 0.008, ((k * 0.53) % 1 - 0.5) * DL]} scale={foam * (0.025 + (k % 3) * 0.008)}><sphereGeometry args={[1, 8, 6]} /><meshToonMaterial color={K.foam} /></mesh>) : null}
  </group>;
};

// chorros que salen por los huecos (centrifugado o tambor sin tina)
const Jets = ({ t = 0, on = 0, n = 16, reach = 0.25 }) => on <= 0.01 ? null : <group>
  {Array.from({ length: n }).map((_, k) => {
    const u = ((t * 1.6 + k / n) % 1); const a = k * 2.399;
    const rr = R + u * reach;
    return <mesh key={k} position={[Math.cos(a) * rr, Math.sin(a) * rr - u * u * 0.15, ((k * 0.41) % 1 - 0.5) * DL]} scale={on * 0.016 * (1 - u * 0.5)}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color={K.water} /></mesh>;
  })}
</group>;

// ---------- lavadora ----------
// on: {shell, panel, door, drum, holes, paddles, tub, motor, belt, valve, hose, press, heater, disp, pump, filter, weights, springs, lock, gasket}
export const Washer = ({ pos = [0, 0, 0], rotY = 0, t = 0, on = {}, xr = 0, ang = 0, mode = 1, level = 0, dirty = 0, foam = 0, heat = 0,
  inflow = 0, drain = 0, jets = 0, shake = 0, open = 0, locked = 0, knob = 0, clothes = 1, dirtCl = 0, slip = 0, press = 0, coin = 0, clog = 0, leak = 0, filterOpen = 0, softener = 0 }) => {
  const sx = shake * Math.sin(t * 38) * 0.03, sz = shake * Math.cos(t * 31) * 0.02;
  const shellOp = 1 - 0.82 * xr;
  const wall = (p, a, k) => <mesh key={k} position={p} castShadow receiveShadow><boxGeometry args={a} /><meshToonMaterial color={K.shell} transparent opacity={shellOp} depthWrite={xr < 0.5} />{xr < 0.5 ? <OL t={0.01} /> : null}</mesh>;
  const tubShake = (on.weights ? 0.25 : 1) * shake;
  return <group position={pos} rotation={[0, rotY, 0]}>
    <group position={[sx * (on.springs ? 0.15 : 1), Math.abs(sx) * (on.springs ? 0.1 : 1.2), sz * (on.springs ? 0.15 : 1)]}>
      {/* patas */}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], k) => <mesh key={k} position={[a * (W / 2 - 0.05), 0.015, b * (D / 2 - 0.05)]}><cylinderGeometry args={[0.022, 0.022, 0.03, 8]} /><meshToonMaterial color={K.dark} /></mesh>)}
      {on.shell ? <>
        {wall([0, H / 2 + 0.03, -D / 2 + 0.015], [W, H, 0.03], 'b')}
        {wall([-W / 2 + 0.015, H / 2 + 0.03, 0], [0.03, H, D], 'l')}
        {wall([W / 2 - 0.015, H / 2 + 0.03, 0], [0.03, H, D], 'r')}
        {wall([0, H + 0.015, 0], [W, 0.03, D], 't')}
        {wall([0, 0.045, 0], [W, 0.03, D], 'f')}
        {/* frente con hueco: cuatro piezas alrededor de la puerta */}
        {wall([0, H - 0.04, D / 2 - 0.015], [W, 0.14, 0.03], 'f1')}
        {wall([0, 0.1, D / 2 - 0.015], [W, 0.14, 0.03], 'f2')}
        {wall([-W / 2 + 0.03, CY, D / 2 - 0.015], [0.06, 0.58, 0.03], 'f3')}
        {wall([W / 2 - 0.03, CY, D / 2 - 0.015], [0.06, 0.58, 0.03], 'f4')}
      </> : null}
      {/* panel con perilla y cajoncito */}
      {on.panel ? <group position={[0, H - 0.05, D / 2 + 0.005]}>
        <mesh><boxGeometry args={[W - 0.04, 0.09, 0.012]} /><meshToonMaterial color="#e9edf1" /></mesh>
        <group position={[0.17, 0, 0.012]} rotation={[0, 0, -knob * 5]}><Part geo={<cylinderGeometry args={[0.032, 0.032, 0.025, 18]} />} color={K.dark} rot={[Math.PI / 2, 0, 0]} t={0.005} />
          <mesh position={[0, 0.022, 0.014]}><boxGeometry args={[0.006, 0.02, 0.004]} /><meshBasicMaterial color={K.yellow} /></mesh></group>
        {[0, 1, 2, 3, 4].map((k) => <mesh key={k} position={[0.03 + k * 0.02, 0.025, 0.008]}><sphereGeometry args={[0.005, 6, 4]} /><meshBasicMaterial color={k <= Math.floor(knob * 5) ? K.green : '#9aa'} /></mesh>)}
      </group> : null}
      {on.disp ? <group position={[-0.17, H - 0.05, D / 2 - 0.05 + open * 0]}>
        <mesh position={[0, 0, 0.06]} castShadow><boxGeometry args={[0.18, 0.06, 0.12]} /><meshToonMaterial color="#dfe5ea" transparent opacity={0.9} /><OL t={0.005} /></mesh>
        <mesh position={[-0.04, 0.01, 0.06]}><boxGeometry args={[0.07, 0.03, 0.08]} /><meshToonMaterial color="#7fc4e8" /></mesh>
        <mesh position={[0.05, 0.01, 0.06]}><boxGeometry args={[0.05, 0.03, 0.08]} /><meshToonMaterial color="#ff8fc0" transparent opacity={softener ? 1 : 0.5} /></mesh>
      </group> : null}
      {/* cuba (tina cerrada) + tambor + agua + ropa */}
      <group position={[sx * tubShake * 2, CY + sx * tubShake, sz * tubShake]}>
        {on.tub ? <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[R + 0.035, R + 0.035, DL + 0.06, 36, 1, true]} /><meshToonMaterial color="#cfd6dc" transparent opacity={0.35} side={THREE.DoubleSide} depthWrite={false} /></mesh> : null}
        {on.tub ? <mesh position={[0, 0, -DL / 2 - 0.03]}><circleGeometry args={[R + 0.035, 36]} /><meshToonMaterial color="#b9c2c9" side={THREE.DoubleSide} /><OL t={0.006} /></mesh> : null}
        {on.drum ? <group position={[0, 0, 0.02]}><Drum ang={ang} holes={on.holes !== 0} paddles={on.paddles || 0} xr={xr} /></group> : null}
        <group position={[0, 0, 0.02]}><Water level={level} dirty={dirty} foam={foam} t={t} spin={mode === 2 ? 1 : 0} /></group>
        {clothes ? <group position={[0, 0, 0.02]}><Clothes t={t} mode={mode} ang={ang} dirt={dirtCl} slip={slip} /></group> : null}
        <group position={[0, 0, 0.02]}><Jets t={t} on={jets} reach={on.tub ? 0.03 : 0.3} /></group>
        {/* resistencia */}
        {on.heater ? <group position={[0, -R - 0.012, 0.02]}>
          {Array.from({ length: 5 }).map((_, k) => <mesh key={k} position={[0, 0, (k - 2) * 0.06]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.012, 0.005, 6, 10]} /><meshBasicMaterial color={'#' + new THREE.Color('#7a7f86').lerp(new THREE.Color('#ff5a2a'), heat).getHexString()} /></mesh>)}
          {heat > 0.3 ? Array.from({ length: 6 }).map((_, k) => { const u = ((t * 0.9 + k / 6) % 1); return <mesh key={'b' + k} position={[Math.sin(k * 2) * 0.06, u * 0.12, (k - 2.5) * 0.05]} scale={0.008 * (1 - u)}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color="#ffffff" /></mesh>; }) : null}
        </group> : null}
        {/* polea grande atrás del tambor */}
        {on.belt ? <group position={[0, 0, -DL / 2 - 0.06]} rotation={[0, 0, ang]}>
          <mesh><torusGeometry args={[0.2, 0.012, 6, 36]} /><meshToonMaterial color={K.metal} /></mesh>
          {[0, 1, 2].map((k) => <mesh key={k} rotation={[0, 0, k * 2.09]}><boxGeometry args={[0.4, 0.02, 0.01]} /><meshToonMaterial color={K.metal} /></mesh>)}
        </group> : null}
        {/* contrapesos */}
        {on.weights ? <>
          <mesh position={[0, R + 0.09, 0.05]} castShadow><boxGeometry args={[0.34, 0.08, 0.14]} /><meshToonMaterial color={K.concrete} /><OL t={0.008} /></mesh>
          <mesh position={[0, -R - 0.07, 0.17]} castShadow><boxGeometry args={[0.3, 0.06, 0.08]} /><meshToonMaterial color={K.concrete} /><OL t={0.008} /></mesh>
        </> : null}
      </group>
      {/* resortes arriba y amortiguadores abajo */}
      {on.springs ? <>
        {[-1, 1].map((s) => <group key={s} position={[s * 0.2, H - 0.12, 0]}>
          {Array.from({ length: 6 }).map((_, k) => <mesh key={k} position={[0, -k * 0.022 - sx * 0.3 * k, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.018, 0.004, 6, 12]} /><meshToonMaterial color={K.metal} /></mesh>)}
        </group>)}
        {[-1, 1].map((s) => <group key={'a' + s} position={[s * 0.16, 0.1, 0.05]} rotation={[0, 0, s * 0.35]}>
          <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.016, 0.016, 0.1, 10]} /><meshToonMaterial color={K.dark} /><OL t={0.004} /></mesh>
          <mesh position={[0, 0.1 + sx * 0.6, 0]}><cylinderGeometry args={[0.007, 0.007, 0.08, 8]} /><meshToonMaterial color={K.metal} /></mesh>
        </group>)}
      </> : null}
      {/* motor y correa */}
      {on.motor ? <group position={[0.12, 0.13, -0.12]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[Math.sin(t * 80) * 0.001, 0, 0]} castShadow><cylinderGeometry args={[0.055, 0.055, 0.13, 18]} /><meshToonMaterial color={K.dark} /><OL t={0.006} /></mesh>
        <group position={[0, 0, -0.13]} rotation={[0, 0, ang * 8]}><mesh><cylinderGeometry args={[0.02, 0.02, 0.03, 10]} /><meshToonMaterial color={K.metal} /></mesh><mesh><boxGeometry args={[0.035, 0.006, 0.032]} /><meshBasicMaterial color={INK} /></mesh></group>
      </group> : null}
      {on.belt && on.motor ? <Tube pts={[[0.12, 0.15, -0.25], [0.06, 0.42, -0.31], [0.0, CY + 0.2, -0.3], [-0.2, CY, -0.3], [-0.05, CY - 0.2, -0.3], [0.1, 0.12, -0.25]]} r={0.009} color={K.rubber} /> : null}
      {/* válvula y manguera de entrada */}
      {on.valve ? <group position={[0.22, H - 0.08, -D / 2 + 0.06]}>
        <mesh castShadow><boxGeometry args={[0.06, 0.05, 0.05]} /><meshToonMaterial color={K.blue} /><OL t={0.005} /></mesh>
        <mesh position={[0, 0.04, 0]}><boxGeometry args={[0.02, 0.03, 0.02]} /><meshToonMaterial color={inflow > 0.3 ? K.green : K.red} /></mesh>
      </group> : null}
      {on.hose ? <><Tube pts={[[0.22, H - 0.08, -D / 2 + 0.04], [0.3, H, -D / 2 - 0.1], [0.45, 1.0, -0.7], [0.55, 1.05, -0.75]]} r={0.014} color="#5a6470" />
        <Tube pts={[[0.2, H - 0.07, -D / 2 + 0.08], [0.0, H - 0.04, 0.0], [-0.17, H - 0.06, D / 2 - 0.04]]} r={0.01} color="#bfc8cf" />
        {inflow > 0.01 ? Array.from({ length: 8 }).map((_, k) => { const u = ((t * 0.8 + k / 8) % 1); return <mesh key={k} position={[lerp(0.22, -0.17, u), H - 0.07, lerp(-D / 2 + 0.06, D / 2 - 0.04, u)]} scale={inflow * 0.014}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color={K.water} /></mesh>; }) : null}
        {inflow > 0.01 ? Array.from({ length: 6 }).map((_, k) => { const u = ((t * 1.2 + k / 6) % 1); return <mesh key={'f' + k} position={[-0.17 + Math.sin(k) * 0.02, H - 0.1 - u * 0.25, D / 2 - 0.08]} scale={inflow * 0.014}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color={K.water} /></mesh>; }) : null}</> : null}
      {/* presostato: tubito del fondo hasta un interruptor arriba */}
      {on.press ? <group>
        <Tube pts={[[-0.05, CY - R - 0.04, -0.05], [-0.2, CY - 0.1, -0.15], [-0.22, H - 0.12, -0.2]]} r={0.006} color="#e8f0ff" />
        <mesh position={[-0.22, H - 0.1, -0.2]} castShadow><cylinderGeometry args={[0.035, 0.035, 0.03, 16]} /><meshToonMaterial color="#ffffff" /><OL t={0.005} /></mesh>
        <mesh position={[-0.22, H - 0.08 + press * 0.012, -0.2]}><cylinderGeometry args={[0.012, 0.012, 0.012, 10]} /><meshToonMaterial color={press > 0.5 ? K.green : K.red} /></mesh>
        {press > 0.05 ? Array.from({ length: 4 }).map((_, k) => <mesh key={k} position={[lerp(-0.05, -0.22, (k + 1) / 5), lerp(CY - R - 0.04, H - 0.12, (k + 1) / 5), lerp(-0.05, -0.2, (k + 1) / 5)]} scale={0.008 + press * 0.006}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color="#ffffff" /></mesh>) : null}
      </group> : null}
      {/* bomba, filtro y manguera de salida */}
      {on.pump ? <group position={[-0.17, 0.12, 0.12]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.05, 0.05, 0.07, 16]} /><meshToonMaterial color="#5a6470" /><OL t={0.005} /></mesh>
        <group position={[0, 0, -0.04]} rotation={[0, 0, t * 25 * (drain > 0.1 ? 1 : 0)]}>{[0, 1, 2, 3].map((k) => <mesh key={k} rotation={[0, 0, k * 0.785]}><boxGeometry args={[0.07, 0.008, 0.01]} /><meshToonMaterial color={K.metal} /></mesh>)}</group>
        {clog > 0.5 ? <mesh position={[0, 0.03, -0.04]} rotation={[0, 0, t]}><cylinderGeometry args={[0.018, 0.018, 0.004, 14]} /><meshToonMaterial color={K.yellow} /><OL t={0.003} /></mesh> : null}
      </group> : null}
      {on.pump ? <><Tube pts={[[0, CY - R - 0.04, 0.05], [-0.1, 0.18, 0.1], [-0.17, 0.12, 0.12]]} r={0.016} color="#7d8790" />
        <Tube pts={[[-0.17, 0.12, 0.08], [-0.26, 0.2, -0.1], [-0.3, 0.7, -0.4], [-0.55, 0.85, -0.75]]} r={0.014} color="#7d8790" />
        {drain > 0.01 ? Array.from({ length: 9 }).map((_, k) => { const u = ((t * 0.9 + k / 9) % 1); const p = u < 0.3 ? [lerp(0, -0.17, u / 0.3), lerp(CY - R - 0.04, 0.12, u / 0.3), 0.1] : [lerp(-0.17, -0.55, (u - 0.3) / 0.7), lerp(0.12, 0.85, Math.sqrt((u - 0.3) / 0.7)), lerp(0.08, -0.75, (u - 0.3) / 0.7)]; return <mesh key={k} position={p} scale={drain * 0.016}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color={K.dirty} /></mesh>; }) : null}</> : null}
      {on.filter ? <group position={[-0.2, 0.1, D / 2 + 0.002]}>
        <group position={[0.045, 0, 0]} rotation={[0, -filterOpen * 1.8, 0]}><mesh position={[-0.045, 0, 0.004]}><boxGeometry args={[0.09, 0.08, 0.008]} /><meshToonMaterial color="#dfe4e8" /><OL t={0.004} /></mesh></group>
        {filterOpen > 0.3 ? <mesh position={[0, 0, 0.03 + filterOpen * 0.06]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.025, 0.025, 0.08, 12]} /><meshToonMaterial color="#e8e8e8" /><OL t={0.004} /></mesh> : null}
      </group> : null}
      {/* moneda viajando hacia la bomba */}
      {coin > 0.01 ? <mesh position={[lerp(0, -0.17, coin), lerp(CY - 0.12, 0.14, coin), lerp(0.05, 0.1, coin)]} rotation={[t * 4, t * 3, 0]} castShadow><cylinderGeometry args={[0.022, 0.022, 0.005, 16]} /><meshToonMaterial color={K.yellow} /><OL t={0.003} /></mesh> : null}
      {/* fuga por la puerta o por los huecos */}
      {leak > 0.01 ? <>
        <mesh position={[0, 0.006, D / 2 + 0.25 * leak]} rotation={[-Math.PI / 2, 0, 0]} scale={leak}><circleGeometry args={[0.35, 24]} /><meshToonMaterial color="#8fd0ff" transparent opacity={0.8} /></mesh>
        {Array.from({ length: 6 }).map((_, k) => { const u = ((t * 1.1 + k / 6) % 1); return <mesh key={k} position={[-0.12 + k * 0.05, CY - 0.2 - u * 0.25, D / 2 + 0.03]} scale={leak * 0.012}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color={K.water} /></mesh>; })}
      </> : null}
      {/* fuelle de goma */}
      {on.gasket ? <mesh position={[0, CY, D / 2 - 0.05]}><torusGeometry args={[R + 0.01, 0.03, 10, 40]} /><meshToonMaterial color={K.rubber} /></mesh> : null}
      {/* puerta redonda con bisagra a la izquierda */}
      {on.door ? <group position={[-R - 0.03, CY, D / 2 + 0.005]} rotation={[0, -open * 1.9, 0]}>
        <group position={[R + 0.03, 0, 0.02]}>
          <mesh><torusGeometry args={[R + 0.005, 0.03, 10, 40]} /><meshToonMaterial color="#dfe4ea" /><OL t={0.006} /></mesh>
          <mesh><circleGeometry args={[R, 36]} /><meshToonMaterial color="#9fd8f0" transparent opacity={0.28} depthWrite={false} /></mesh>
          <mesh position={[R + 0.02, 0, 0.02]}><boxGeometry args={[0.03, 0.08, 0.025]} /><meshToonMaterial color={K.dark} /><OL t={0.004} /></mesh>
        </group>
      </group> : null}
      {on.lock ? <group position={[R + 0.06, CY, D / 2 + 0.01]}>
        <mesh><boxGeometry args={[0.035, 0.05, 0.02]} /><meshToonMaterial color={locked > 0.5 ? K.red : '#c8cdd2'} /><OL t={0.004} /></mesh>
        <mesh position={[-0.02 - locked * 0.015, 0, 0.005]}><boxGeometry args={[0.02 + locked * 0.02, 0.012, 0.012]} /><meshToonMaterial color={K.metal} /></mesh>
      </group> : null}
    </group>
  </group>;
};

// ---------- extras ----------
export const Bucket = ({ pos = [0, 0, 0], t = 0, level = 0.7, foam = 0, dirt = 0, cloth = 1, slosh = 0 }) => <group position={pos}>
  <mesh position={[0, 0.17, 0]} castShadow><cylinderGeometry args={[0.24, 0.19, 0.34, 28, 1, true]} /><meshToonMaterial color="#59a7e0" transparent opacity={0.55} side={THREE.DoubleSide} depthWrite={false} /></mesh>
  <mesh position={[0, 0.005, 0]}><cylinderGeometry args={[0.19, 0.19, 0.01, 28]} /><meshToonMaterial color="#3f86c4" /></mesh>
  <mesh position={[0, 0.34, 0]}><torusGeometry args={[0.24, 0.012, 6, 32]} /><meshBasicMaterial color={INK} /></mesh>
  <mesh position={[0, 0.02 + level * 0.15, 0]} rotation={[Math.sin(t * 3) * 0.08 * slosh, 0, 0]}><cylinderGeometry args={[0.18 + level * 0.04, 0.185, level * 0.3, 28]} /><meshToonMaterial color={'#' + new THREE.Color(K.water).lerp(new THREE.Color(K.dirty), dirt).getHexString()} transparent opacity={0.6} depthWrite={false} /></mesh>
  {cloth ? [0, 1, 2].map((k) => <mesh key={k} position={[Math.sin(k * 2 + t * 0.3) * 0.08, 0.05 + level * 0.25 + Math.sin(t * 1.5 + k) * 0.01, Math.cos(k * 2) * 0.08]} rotation={[0.3 * k, t * 0.2, 0]}><boxGeometry args={[0.13, 0.03, 0.1]} /><meshToonMaterial color={dirt > 0.5 && k !== 1 ? '#8a7a55' : CLOTH[k]} /><OL t={0.004} /></mesh>) : null}
  {foam > 0.01 ? Array.from({ length: 10 }).map((_, k) => <mesh key={'f' + k} position={[((k * 0.37) % 1 - 0.5) * 0.3, 0.05 + level * 0.3, ((k * 0.61) % 1 - 0.5) * 0.3]} scale={foam * (0.02 + (k % 3) * 0.01)}><sphereGeometry args={[1, 8, 6]} /><meshToonMaterial color="#ffffff" /></mesh>) : null}
</group>;

export const Board = ({ pos = [0, 0, 0], rot = [0, 0, 0] }) => <group position={pos} rotation={rot}>
  <mesh castShadow><boxGeometry args={[0.32, 0.55, 0.03]} /><meshToonMaterial color={K.wood} /><OL t={0.006} /></mesh>
  {Array.from({ length: 9 }).map((_, k) => <mesh key={k} position={[0, -0.18 + k * 0.035, 0.018]}><boxGeometry args={[0.26, 0.012, 0.012]} /><meshToonMaterial color="#d8dde2" /></mesh>)}
</group>;

export const Hands = ({ pos = [0, 0, 0], t = 0, rub = 1, tired = 0, rot = [0, 0, 0] }) => {
  const y = Math.sin(t * (9 - tired * 6)) * 0.08 * rub;
  return <group position={pos} rotation={rot}>
    {[-1, 1].map((s) => <group key={s} position={[s * 0.09, y, 0]}>
      <mesh rotation={[Math.PI / 2 - 0.4, 0, 0]} position={[0, -0.02, 0.18]} castShadow><capsuleGeometry args={[0.035, 0.32, 6, 12]} /><meshToonMaterial color="#f0bf94" /><OL t={0.008} /></mesh>
      <mesh position={[0, 0.02, 0.0]} castShadow><sphereGeometry args={[0.05, 12, 8]} /><meshToonMaterial color="#f0bf94" /><OL t={0.008} /></mesh>
    </group>)}
    {tired > 0.3 ? Array.from({ length: 4 }).map((_, k) => { const u = ((t * 0.7 + k / 4) % 1); return <mesh key={k} position={[-0.1 + k * 0.07, 0.1 - u * 0.25, 0.1]} scale={0.012}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color="#9fd8f0" /></mesh>; }) : null}
  </group>;
};
