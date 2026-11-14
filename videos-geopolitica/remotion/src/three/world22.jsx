import React, { useMemo } from 'react';
import * as THREE from 'three';
import { OL, Part, Flow, Tube, cl, lerp, tw, INK } from './kit.jsx';

export const K = {
  wall: '#bfe3d9', wall2: '#9fcfc2', floor: '#e9e4da', tile: '#cfc8bb', shell: '#f4f6f8', inner: '#ffffff',
  foam: '#f2d16b', gasket: '#3a3f45', metal: '#9aa6ad', black: '#2b2f36', cold: '#5ab4ff', cold2: '#bfe6ff',
  hot: '#ff5a3c', warm: '#ff9a3c', green: '#59b947', milk: '#ffffff', meat: '#d9534f', ice: '#cdeeff', red: '#e2483d', teal: '#1fb5a5',
};
const W = 0.75, H = 1.75, D = 0.68;
export const FR = { W, H, D };

// ---------- luces con sombras largas ----------
export const Lights22 = () => <>
  <ambientLight intensity={0.85} />
  <directionalLight position={[-3.5, 3.2, 3.0]} intensity={1.9} castShadow shadow-mapSize={[1024, 1024]}
    shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-1} shadow-camera-near={0.5} shadow-camera-far={15} shadow-bias={-0.0015} />
</>;

// ---------- cocina ----------
export const Kitchen = ({ wallZ = -1.0 }) => {
  const tiles = useMemo(() => {
    const a = [];
    for (let i = -8; i <= 8; i++) a.push(<mesh key={'x' + i} position={[i * 0.5, 0.002, 1]}><boxGeometry args={[0.012, 0.002, 6]} /><meshBasicMaterial color={K.tile} /></mesh>);
    for (let j = -2; j <= 9; j++) a.push(<mesh key={'z' + j} position={[0, 0.002, wallZ + j * 0.5]}><boxGeometry args={[8, 0.002, 0.012]} /><meshBasicMaterial color={K.tile} /></mesh>);
    return a;
  }, [wallZ]);
  return <group>
    <color attach="background" args={[K.wall]} />
    <mesh position={[0, 2.5, wallZ]} receiveShadow><planeGeometry args={[16, 5]} /><meshToonMaterial color={K.wall} /></mesh>
    <mesh position={[0, 0.07, wallZ + 0.015]}><boxGeometry args={[16, 0.14, 0.03]} /><meshToonMaterial color={K.wall2} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 2]} receiveShadow><planeGeometry args={[16, 8]} /><meshToonMaterial color={K.floor} /></mesh>
    {tiles}
    {/* puerta de la cocina, a la izquierda */}
    <mesh position={[-2.2, 1.0, wallZ + 0.02]} receiveShadow><boxGeometry args={[0.8, 2.0, 0.04]} /><meshToonMaterial color="#3f6fb0" /><OL t={0.012} /></mesh>
    <mesh position={[-1.9, 1.0, wallZ + 0.06]}><sphereGeometry args={[0.035]} /><meshToonMaterial color={K.metal} /></mesh>
  </group>;
};

// ---------- recorrido del gas (en coordenadas de la nevera) ----------
const zb = -D / 2;
export const LOOP = {
  evap: [[-0.28, 1.62, zb + 0.05], [0.28, 1.62, zb + 0.05], [0.28, 1.54, zb + 0.05], [-0.28, 1.54, zb + 0.05], [-0.28, 1.46, zb + 0.05], [0.28, 1.46, zb + 0.05], [0.28, 1.38, zb + 0.05], [-0.28, 1.38, zb + 0.05]],
  suction: [[-0.28, 1.38, zb + 0.05], [-0.3, 1.3, zb - 0.02], [-0.32, 0.9, zb - 0.08], [-0.1, 0.3, zb - 0.14], [0.12, 0.2, zb - 0.16]],
  hotline: [[0.24, 0.24, zb - 0.16], [0.32, 0.32, zb - 0.07], [0.3, 0.42, zb - 0.06]],
  cond: [[0.3, 0.42, zb - 0.06], [-0.3, 0.42, zb - 0.06], [-0.3, 0.6, zb - 0.06], [0.3, 0.6, zb - 0.06], [0.3, 0.78, zb - 0.06], [-0.3, 0.78, zb - 0.06], [-0.3, 0.96, zb - 0.06], [0.3, 0.96, zb - 0.06], [0.3, 1.14, zb - 0.06], [-0.3, 1.14, zb - 0.06], [-0.3, 1.32, zb - 0.06], [0.3, 1.32, zb - 0.06]],
  capil: [[0.3, 1.32, zb - 0.06], [0.33, 1.5, zb - 0.03], [0.3, 1.66, zb + 0.02], [0.26, 1.64, zb + 0.05], [-0.28, 1.62, zb + 0.05]],
};
// polilínea con esquinas firmes (para zigzags)
const Zig = ({ pts, r = 0.016, color, op = 1 }) => {
  const geo = useMemo(() => {
    const path = new THREE.CurvePath();
    for (let i = 0; i < pts.length - 1; i++) path.add(new THREE.LineCurve3(new THREE.Vector3(...pts[i]), new THREE.Vector3(...pts[i + 1])));
    return new THREE.TubeGeometry(path, pts.length * 12, r, 8, false);
  }, [JSON.stringify(pts), r]);
  return <mesh geometry={geo} castShadow><meshToonMaterial color={color} transparent opacity={op} /></mesh>;
};
const ZigFlow = ({ pts, t, n = 12, speed = 0.3, color, r = 0.022, on = 1 }) => {
  const path = useMemo(() => {
    const p = new THREE.CurvePath();
    for (let i = 0; i < pts.length - 1; i++) p.add(new THREE.LineCurve3(new THREE.Vector3(...pts[i]), new THREE.Vector3(...pts[i + 1])));
    return p;
  }, [JSON.stringify(pts)]);
  if (on <= 0.01) return null;
  return <group>{Array.from({ length: n }).map((_, k) => {
    const u = ((t * speed + k / n) % 1 + 1) % 1;
    const p = path.getPointAt(u);
    const c = typeof color === 'function' ? color(u) : color;
    return <mesh key={k} position={p} scale={on}><sphereGeometry args={[r, 8, 6]} /><meshBasicMaterial color={c} /></mesh>;
  })}</group>;
};
const mix = (a, b, u) => '#' + new THREE.Color(a).lerp(new THREE.Color(b), cl(u)).getHexString();

// ---------- comida ----------
export const Food = ({ t = 0, spoil = 0, frozen = 0, wilt = 0 }) => <group>
  <group position={[-0.18, 0.92, 0.02]}>
    <Part geo={<boxGeometry args={[0.1, 0.2, 0.1]} />} color={frozen > 0.5 ? K.ice : K.milk} pos={[0, 0.1, 0]} t={0.008} />
    <Part geo={<boxGeometry args={[0.1, 0.035, 0.1]} />} color="#3f7fe0" pos={[0, 0.215, 0]} t={0.006} />
  </group>
  <Part geo={<sphereGeometry args={[0.1, 14, 10]} />} color={wilt > 0.5 ? '#9db352' : K.green} pos={[0.12, 0.2, 0.04]} scale={[1, 0.8 - wilt * 0.25, 1]} t={0.01} />
  <Part geo={<cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />} color={spoil > 0.5 ? '#8a6a4a' : K.meat} pos={[0.12, 0.88, 0.0]} t={0.008} />
  {spoil > 0.05 ? Array.from({ length: 5 }).map((_, k) => {
    const u = ((t * 0.4 + k / 5) % 1);
    return <mesh key={k} position={[0.12 + Math.sin(t * 3 + k) * 0.05, 0.92 + u * 0.35, 0]} scale={spoil * (0.03 + u * 0.03)}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#8fd14f" transparent opacity={0.7 * (1 - u)} /></mesh>;
  }) : null}
</group>;

// ---------- termómetro 3D ----------
export const Thermo = ({ pos = [0.45, 0.8, 0.5], v = 4, min = -20, max = 30, s = 1 }) => {
  const u = cl((v - min) / (max - min));
  const col = v > 10 ? K.hot : v > 0 ? K.teal : K.cold;
  return <group position={pos} scale={s}>
    <mesh position={[0, 0.25, 0]} castShadow><cylinderGeometry args={[0.03, 0.03, 0.5, 14]} /><meshToonMaterial color="#e8f6ff" transparent opacity={0.45} /><OL t={0.006} /></mesh>
    <mesh position={[0, 0.02 + u * 0.24, 0]}><cylinderGeometry args={[0.018, 0.018, 0.04 + u * 0.48, 10]} /><meshBasicMaterial color={col} /></mesh>
    <mesh position={[0, 0, 0]} castShadow><sphereGeometry args={[0.05, 14, 10]} /><meshBasicMaterial color={col} /></mesh>
    {[0, 0.25, 0.5, 0.75, 1].map((k) => <mesh key={k} position={[0.036, 0.02 + k * 0.46, 0]}><boxGeometry args={[0.02, 0.006, 0.006]} /><meshBasicMaterial color={INK} /></mesh>)}
  </group>;
};

// ---------- nevera ----------
// on: {shell, door, evap, comp, cond, capil, thermo, foam, gasket, light, freezer, shelves, fan, drawer, tray, food}
export const Fridge = ({ pos = [0, 0, 0], rotY = 0, t = 0, on = {}, xr = 0, open = 0, flow = 0, comp = 0, frost = 0, lit = 0, knob = 0.5, cut = 0, heat = 0, foodP = {}, ice = 0, melt = 0, shake = 0 }) => {
  const sx = shake * Math.sin(t * 60) * 0.004;
  const cols = {
    evap: (u) => mix(K.cold, K.cold2, u),
    suction: K.cold2,
    hot: K.hot,
    cond: (u) => mix(K.hot, K.cold, u),
    capil: K.cold,
  };
  const shellOp = 1 - 0.8 * xr;
  const wall = (p, a) => <mesh position={p} castShadow receiveShadow><boxGeometry args={a} /><meshToonMaterial color={K.shell} transparent opacity={shellOp} depthWrite={xr < 0.5} />{xr < 0.5 ? <OL t={0.012} /> : null}</mesh>;
  return <group position={pos} rotation={[0, rotY, 0]}>
    <group position={[sx, 0, 0]}>
      {/* patas */}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], k) => <mesh key={k} position={[a * (W / 2 - 0.05), 0.02, b * (D / 2 - 0.06)]}><cylinderGeometry args={[0.025, 0.025, 0.04, 8]} /><meshToonMaterial color={K.black} /></mesh>)}
      {/* carcasa: atrás, lados, techo, piso */}
      {on.shell !== 0 ? <>
        {wall([0, H / 2 + 0.04, -D / 2 + 0.02], [W, H, 0.04])}
        {wall([-W / 2 + 0.02, H / 2 + 0.04, 0], [0.04, H, D])}
        {wall([W / 2 - 0.02, H / 2 + 0.04, 0], [0.04, H, D])}
        {wall([0, H + 0.02, 0], [W, 0.04, D])}
        {wall([0, 0.06, 0], [W, 0.04, D])}
      </> : null}
      {/* espuma aislante en corte */}
      {on.foam ? <>
        <mesh position={[-W / 2 + 0.05, H / 2 + 0.04, 0]}><boxGeometry args={[0.05, H - 0.1, D - 0.08]} /><meshToonMaterial color={K.foam} transparent opacity={0.85 * on.foam} /></mesh>
        <mesh position={[W / 2 - 0.05, H / 2 + 0.04, 0]}><boxGeometry args={[0.05, H - 0.1, D - 0.08]} /><meshToonMaterial color={K.foam} transparent opacity={0.85 * on.foam} /></mesh>
        <mesh position={[0, H - 0.03, 0]}><boxGeometry args={[W - 0.1, 0.05, D - 0.08]} /><meshToonMaterial color={K.foam} transparent opacity={0.85 * on.foam} /></mesh>
        {Array.from({ length: 24 }).map((_, k) => <mesh key={k} position={[(k % 2 ? 1 : -1) * (W / 2 - 0.05) + Math.sin(k * 3.1) * 0.012, 0.15 + (k * 0.067) % 1.5, Math.cos(k * 1.7) * 0.25]}><sphereGeometry args={[0.012, 6, 4]} /><meshBasicMaterial color="#fff6cf" /></mesh>)}
      </> : null}
      {/* congelador y repisas */}
      {on.freezer ? <Part geo={<boxGeometry args={[W - 0.1, 0.05, D - 0.12]} />} color="#e4ecf2" pos={[0, 1.27, 0.02]} t={0.008} xr={xr * 0.5} /> : null}
      {on.shelves ? [0.5, 0.85].map((y, k) => <mesh key={k} position={[0, y, 0.02]}><boxGeometry args={[W - 0.1, 0.012, D - 0.14]} /><meshToonMaterial color="#cfeaff" transparent opacity={0.55} /></mesh>) : null}
      {on.drawer ? <mesh position={[0, 0.2, 0.04]}><boxGeometry args={[W - 0.14, 0.24, D - 0.18]} /><meshToonMaterial color="#d9f0ff" transparent opacity={0.4} /><OL t={0.006} /></mesh> : null}
      {on.food ? <Food t={t} {...foodP} /> : null}
      {/* hielo */}
      {ice > 0.01 ? <group>
        <mesh position={[0, 0.9 - melt * 0.08, 0]} scale={[1, Math.max(0.05, 1 - melt * 0.9), 1]} castShadow><boxGeometry args={[0.28, 0.2, 0.22]} /><meshToonMaterial color={K.ice} transparent opacity={0.85} /><OL t={0.008} /></mesh>
        {melt > 0.05 ? <mesh position={[0, 0.087, 0.03]} rotation={[-Math.PI / 2, 0, 0]} scale={melt}><circleGeometry args={[0.26, 24]} /><meshToonMaterial color="#8fd0ff" transparent opacity={0.85} /></mesh> : null}
        {melt > 0.05 && melt < 0.95 ? Array.from({ length: 4 }).map((_, k) => { const u = ((t * 0.8 + k / 4) % 1); return <mesh key={k} position={[-0.1 + k * 0.07, 0.8 - u * 0.7, 0.1]}><sphereGeometry args={[0.012, 6, 4]} /><meshBasicMaterial color="#8fd0ff" /></mesh>; }) : null}
      </group> : null}
      {/* evaporador */}
      {on.evap ? <>
        <Zig pts={LOOP.evap} r={0.014 + frost * 0.03} color={frost > 0.3 ? '#f4fbff' : K.metal} />
        <ZigFlow pts={LOOP.evap} t={t} n={14} speed={0.25 * flow} color={cols.evap} on={flow} />
      </> : null}
      {on.evap && flow > 0.05 ? Array.from({ length: 10 }).map((_, k) => { const u = ((t * 0.35 + k / 10) % 1); return <mesh key={'c' + k} position={[-0.25 + (k % 5) * 0.12, 1.36 - u * 1.1, -0.1 + Math.sin(k) * 0.12]} scale={0.02 + u * 0.03}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color={K.cold2} transparent opacity={0.6 * (1 - u) * flow} /></mesh>; }) : null}
      {/* ventilador */}
      {on.fan ? <group position={[0, 1.48, zb + 0.1]} rotation={[0, 0, t * 20 * (on.fan > 0.5 ? 1 : 0)]}>
        {[0, 1, 2].map((k) => <mesh key={k} rotation={[0, 0, k * 2.09]} position={[0, 0, 0]}><boxGeometry args={[0.14, 0.035, 0.008]} /><meshToonMaterial color={K.metal} /></mesh>)}
      </group> : null}
      {/* compresor */}
      {on.comp ? <group position={[0.17, 0.2, zb - 0.16]}>
        <mesh castShadow scale={[1, 0.85, 0.85]} position={[0, 0, Math.sin(t * 70) * 0.003 * comp]}><sphereGeometry args={[0.11, 20, 14]} /><meshToonMaterial color={K.black} /><OL t={0.01} /></mesh>
        {on.tray ? <mesh position={[0, 0.12, 0]}><boxGeometry args={[0.24, 0.02, 0.16]} /><meshToonMaterial color="#d0d6da" /><OL t={0.006} /></mesh> : null}
        {comp > 0.3 ? Array.from({ length: 4 }).map((_, k) => <mesh key={k} position={[0, 0, 0]} scale={0.13 + ((t * 2 + k / 4) % 1) * 0.12}><torusGeometry args={[1, 0.02, 4, 24]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.25 * (1 - ((t * 2 + k / 4) % 1))} /></mesh>) : null}
      </group> : null}
      {on.comp ? <><Tube pts={LOOP.suction} r={0.012} color={K.metal} /><ZigFlow pts={LOOP.suction} t={t} n={6} speed={0.5 * flow} color={cols.suction} r={0.018} on={flow} />
        <Tube pts={LOOP.hotline} r={0.012} color={K.metal} /><ZigFlow pts={LOOP.hotline} t={t} n={3} speed={0.8 * flow * comp} color={K.hot} r={0.02} on={flow * comp} /></> : null}
      {/* condensador */}
      {on.cond ? <><Zig pts={LOOP.cond} r={0.014} color={K.black} />
        <ZigFlow pts={LOOP.cond} t={t} n={18} speed={0.2 * flow} color={cols.cond} on={flow} />
        {heat > 0.01 ? Array.from({ length: 12 }).map((_, k) => { const u = ((t * 0.5 + k / 12) % 1); return <mesh key={'h' + k} position={[-0.28 + (k % 6) * 0.11, 0.45 + u * 1.2, zb - 0.12 - u * 0.25 * (1 - (on.wallBlock || 0))]} scale={(0.025 + u * 0.03) * heat}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color={K.warm} transparent opacity={0.55 * (1 - u)} /></mesh>; }) : null}</> : null}
      {on.capil ? <><Tube pts={LOOP.capil} r={0.006} color="#c9a26b" /><ZigFlow pts={LOOP.capil} t={t} n={6} speed={0.6 * flow} color={K.cold} r={0.014} on={flow} /></> : null}
      {/* termostato */}
      {on.thermo ? <group position={[W / 2 - 0.1, 1.2, 0.1]}>
        <Part geo={<boxGeometry args={[0.06, 0.08, 0.06]} />} color="#ffffff" t={0.006} />
        <group position={[0, 0, 0.035]} rotation={[0, 0, -knob * 4]}><Part geo={<cylinderGeometry args={[0.025, 0.025, 0.02, 14]} />} color={K.red} rot={[Math.PI / 2, 0, 0]} t={0.005} /></group>
      </group> : null}
      {/* foco */}
      {on.light ? <>
        <mesh position={[0, 1.2, 0.05]}><sphereGeometry args={[0.035, 12, 8]} /><meshBasicMaterial color={lit > 0.5 ? '#fff3a0' : '#c8c8c8'} /></mesh>
        {lit > 0.5 ? <pointLight position={[0, 1.15, 0.1]} intensity={0.8} distance={1.2} color="#fff3c4" /> : null}
        <mesh position={[W / 2 - 0.03, 1.0, D / 2 - 0.01]}><boxGeometry args={[0.02, 0.04, 0.02 + (1 - lit) * 0.01]} /><meshToonMaterial color={K.red} /></mesh>
      </> : null}
      {/* puerta */}
      {on.door ? <group position={[-W / 2, 0.04, D / 2]} rotation={[0, -open * 1.85, 0]}>
        <mesh position={[W / 2, H / 2, 0.03]} castShadow><boxGeometry args={[W, H, 0.06]} /><meshToonMaterial color={K.shell} transparent opacity={1 - 0.8 * xr} depthWrite={xr < 0.5} />{xr < 0.5 ? <OL t={0.012} /> : null}</mesh>
        <mesh position={[W - 0.06, H / 2 + 0.1, 0.07]}><boxGeometry args={[0.03, 0.4, 0.03]} /><meshToonMaterial color={K.metal} /><OL t={0.006} /></mesh>
        <mesh position={[W / 2, 1.25, 0.065]}><boxGeometry args={[W - 0.02, 0.01, 0.005]} /><meshBasicMaterial color="#d4dadf" /></mesh>
        {on.gasket ? <group position={[W / 2, H / 2, -0.005]}>
          {[[0, H / 2 - 0.02, W - 0.04, 0.03], [0, -H / 2 + 0.02, W - 0.04, 0.03]].map(([x, y, w, h], k) => <mesh key={k} position={[x, y, 0]}><boxGeometry args={[w, h, 0.025]} /><meshToonMaterial color={K.gasket} /></mesh>)}
          {[[-W / 2 + 0.02], [W / 2 - 0.02]].map(([x], k) => <mesh key={'v' + k} position={[x, 0, 0]}><boxGeometry args={[0.03, H - 0.04, 0.025]} /><meshToonMaterial color={K.gasket} /></mesh>)}
        </group> : null}
        {/* repisas de la puerta con botellas */}
        {on.food ? [0.5, 0.95].map((y, k) => <group key={k} position={[W / 2, y, -0.06]}>
          <mesh><boxGeometry args={[W - 0.12, 0.08, 0.06]} /><meshToonMaterial color="#d9f0ff" transparent opacity={0.6} /></mesh>
          {[-0.2, -0.05, 0.12].map((x, j) => <mesh key={j} position={[x, 0.1, 0]}><cylinderGeometry args={[0.025, 0.03, 0.2, 10]} /><meshToonMaterial color={['#e2483d', '#2bb36b', '#ffd23d'][j]} /><OL t={0.005} /></mesh>)}
        </group>) : null}
      </group> : null}
    </group>
  </group>;
};

// ---------- extras ----------
export const Arm = ({ t = 0, wind = 0, sweat = 1 }) => <group position={[0, 1.0, 0.3]}>
  <mesh rotation={[0, 0, Math.PI / 2]} castShadow><capsuleGeometry args={[0.09, 0.9, 8, 16]} /><meshToonMaterial color="#f0bf94" /><OL t={0.012} /></mesh>
  {Array.from({ length: 8 }).map((_, k) => { const u = wind ? ((t * 0.6 + k / 8) % 1) : 0; return <mesh key={k} position={[-0.4 + k * 0.11, 0.09 + u * 0.3, Math.sin(k) * 0.03]} scale={sweat * (1 - u) * 0.025}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color={wind ? K.cold2 : '#9fd8f0'} transparent opacity={0.9 - u * 0.8} /></mesh>; })}
  {wind > 0.01 ? Array.from({ length: 6 }).map((_, k) => { const u = ((t * 0.9 + k / 6) % 1); return <mesh key={'w' + k} position={[-0.9 + u * 1.8, 0.25 + (k % 3) * 0.12, 0.05]}><boxGeometry args={[0.25, 0.012, 0.012]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.8 * Math.sin(u * Math.PI)} /></mesh>; }) : null}
</group>;

export const Piston = ({ t = 0, squeeze = 0, hot = 0 }) => {
  const y = 0.9 - squeeze * 0.45;
  return <group position={[0, 0, 0.3]}>
    <mesh position={[0, 0.6, 0]}><cylinderGeometry args={[0.25, 0.25, 1.0, 28, 1, true]} /><meshToonMaterial color="#e8f6ff" transparent opacity={0.35} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.26, 0.26, 0.04, 28]} /><meshToonMaterial color={K.metal} /><OL t={0.008} /></mesh>
    <mesh position={[0, y, 0]} castShadow><cylinderGeometry args={[0.24, 0.24, 0.06, 28]} /><meshToonMaterial color={K.black} /><OL t={0.008} /></mesh>
    <mesh position={[0, y + 0.35, 0]}><cylinderGeometry args={[0.03, 0.03, 0.7, 10]} /><meshToonMaterial color={K.metal} /></mesh>
    {Array.from({ length: 26 }).map((_, k) => {
      const yy = 0.15 + ((Math.sin(t * 3 + k * 7.1) + 1) / 2) * (y - 0.2);
      return <mesh key={k} position={[Math.sin(k * 2.4 + t * 2) * 0.18, yy, Math.cos(k * 1.7 + t * 2.3) * 0.18]}><sphereGeometry args={[0.025, 8, 6]} /><meshBasicMaterial color={mix(K.cold2, K.hot, hot)} /></mesh>;
    })}
  </group>;
};
