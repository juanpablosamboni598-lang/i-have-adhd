import React, { useMemo } from 'react';
import * as THREE from 'three';
import { OL, Part, Flow, Tube, cl, lerp, tw, drop, INK } from './kit.jsx';

export const B = {
  wall: '#f3c9a4', wall2: '#e9b48c', floor: '#d9e4ea', tile: '#b9c9d3', soil: '#c79a6b',
  porcelain: '#fbfbf7', water: '#46a6f0', metal: '#9aa6ad', pipe: '#c9d3d9', float: '#ff8a3d', flap: '#e2483d',
  chain: '#5b6670', gas: '#8fd14f', red: '#e2483d', teal: '#1fb5a5', paper: '#ffffff', wood: '#a0703f',
};

// ---- trayectorias de tubos (x, y, z) ----
const Z = 0.2;
export const PIPE_STRAIGHT = [[0, 0, Z], [0, -0.85, Z], [0.25, -1.1, Z], [1.2, -1.1, Z], [2.9, -1.1, Z]];
export const PIPE_S = [[0, 0, Z], [0, -0.35, Z], [0.05, -0.6, Z], [0.25, -0.7, Z], [0.45, -0.6, Z], [0.5, -0.38, Z], [0.62, -0.28, Z], [0.76, -0.4, Z], [0.8, -0.85, Z], [1.0, -1.1, Z], [2.9, -1.1, Z]];
export const TRAP_WATER = [[0.01, -0.45, Z], [0.05, -0.6, Z], [0.25, -0.7, Z], [0.45, -0.6, Z], [0.49, -0.45, Z]];
const TANK = [0, 0, -0.33];

// ---- escenario: pared, suelo transparente (rayos X del subsuelo), alcantarilla ----
export const Room = ({ t = 0, soil = 1, sewer = 1 }) => {
  const lines = useMemo(() => {
    const a = [];
    for (let i = -7; i <= 7; i++) a.push(<mesh key={'x' + i} position={[i * 0.4, 0.003, 0]}><boxGeometry args={[0.012, 0.002, 2.4]} /><meshBasicMaterial color={B.tile} /></mesh>);
    for (let j = -3; j <= 3; j++) a.push(<mesh key={'z' + j} position={[0, 0.003, j * 0.4]}><boxGeometry args={[6, 0.002, 0.012]} /><meshBasicMaterial color={B.tile} /></mesh>);
    return a;
  }, []);
  return <group>
    <color attach="background" args={[B.wall]} />
    <mesh position={[0, 2, -0.62]}><planeGeometry args={[14, 5]} /><meshToonMaterial color={B.wall} /></mesh>
    <mesh position={[0, 0.06, -0.6]}><boxGeometry args={[14, 0.12, 0.03]} /><meshToonMaterial color={B.wall2} /></mesh>
    {/* suelo: losa fina opaca arriba, subsuelo transparente */}
    <mesh position={[0, -0.015, 0]} receiveShadow><boxGeometry args={[6, 0.03, 2.4]} /><meshToonMaterial color={B.floor} transparent opacity={0.92} /></mesh>
    {lines}
    <mesh position={[0, -0.75, 0]}><boxGeometry args={[6, 1.45, 2.4]} /><meshToonMaterial color={B.soil} transparent opacity={0.28 * soil} depthWrite={false} /></mesh>
    <mesh position={[0, -0.75, 1.2]}><planeGeometry args={[6, 1.45]} /><meshBasicMaterial color={B.soil} transparent opacity={0.15 * soil} depthWrite={false} /></mesh>
    {sewer ? <group position={[3.05, -1.1, Z]}>
      <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.32, 0.32, 0.4, 24]} /><meshToonMaterial color="#6b6f75" /><OL t={0.02} /></mesh>
    </group> : null}
  </group>;
};

// ---- tubo del desagüe (recto o con curva en S) ----
export const Drain = ({ s = 0, op = 1, trapWater = 0, siphon = 0, t = 0, clog = 0, down = 0 }) => {
  const pts = s ? PIPE_S : PIPE_STRAIGHT;
  return <group>
    <Tube pts={pts} r={0.09} color="#aebbc3" xr={0.45} />
    {trapWater > 0.01 ? <Tube pts={TRAP_WATER} r={0.075 * trapWater} color={B.water} /> : null}
    {siphon > 0.01 ? <><Tube pts={pts.slice(1, 9)} r={0.075} color={B.water} /><Flow pts={pts.slice(0, 11)} t={t} n={26} speed={0.9} r={0.05} color="#bfe6ff" on={siphon} /></> : null}
    {down > 0.01 ? <Flow pts={pts} t={t} n={14} speed={0.6} r={0.045} color="#8fd0ff" on={down} /> : null}
    {clog > 0.01 ? Array.from({ length: 7 }).map((_, k) => <mesh key={k} position={[0.18 + (k % 3) * 0.1, -0.62 + Math.floor(k / 3) * 0.05, Z + 0.02]} rotation={[k, k * 2, 0]} scale={clog}>
      <boxGeometry args={[0.1, 0.01, 0.1]} /><meshToonMaterial color="#f4f4f4" /><OL t={0.004} />
    </mesh>) : null}
  </group>;
};

// ---- gases que suben (nubes verdes) ----
export const Gas = ({ t = 0, on = 1, x = 0, block = 0 }) => on <= 0.01 ? null : <group>
  {Array.from({ length: 9 }).map((_, k) => {
    const u = ((t * 0.35 + k / 9) % 1);
    const ymax = block ? -0.42 : 1.2;
    const y = -1.0 + u * (ymax + 1.0);
    const xx = x + Math.sin(t * 2 + k) * (y > 0 ? 0.25 * u : 0.03);
    const s = (0.05 + u * (y > 0 ? 0.12 : 0.03)) * on;
    return <mesh key={k} position={[xx, y, Z + Math.cos(k) * 0.04]} scale={s}><sphereGeometry args={[1, 10, 8]} /><meshBasicMaterial color={B.gas} transparent opacity={0.75 * (1 - u * 0.5)} /></mesh>;
  })}
</group>;

export const Flies = ({ t = 0, on = 1, c = [0, 0.4, 0.2] }) => on <= 0.01 ? null : <group>
  {Array.from({ length: 5 }).map((_, k) => {
    const a = t * (2.5 + k * 0.4) + k * 1.3;
    return <group key={k} position={[c[0] + Math.cos(a) * (0.3 + k * 0.05), c[1] + Math.sin(a * 1.7) * 0.15 + k * 0.05, c[2] + Math.sin(a) * 0.3]} scale={on}>
      <mesh><sphereGeometry args={[0.025, 8, 6]} /><meshBasicMaterial color={INK} /></mesh>
      <mesh position={[0, 0.02, 0]} rotation={[0, 0, Math.sin(t * 60) * 0.6]}><boxGeometry args={[0.06, 0.003, 0.02]} /><meshBasicMaterial color="#e8f4ff" /></mesh>
    </group>;
  })}
</group>;

// ---- hoyo ----
export const Hole = ({ on = 1, fill = 0 }) => on <= 0.01 ? null : <group position={[0, 0, Z]} scale={on}>
  <mesh position={[0, -0.25, 0]}><cylinderGeometry args={[0.2, 0.2, 0.5, 24, 1, true]} /><meshToonMaterial color="#5a3d26" side={THREE.DoubleSide} /></mesh>
  <mesh position={[0, -0.5 + fill * 0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.2, 24]} /><meshToonMaterial color="#6e4b2a" /></mesh>
  <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.2, 0.24, 24]} /><meshBasicMaterial color={INK} /></mesh>
</group>;

export const Lid = ({ y = 0, tilt = 0 }) => <group position={[0, 0.03 + y, Z]} rotation={[tilt, 0, 0]}>
  <Part geo={<cylinderGeometry args={[0.26, 0.26, 0.04, 24]} />} color={B.wood} t={0.012} />
  <Part geo={<boxGeometry args={[0.12, 0.05, 0.04]} />} color={B.metal} pos={[0, 0.04, 0]} t={0.008} />
</group>;

// ---- taza (con agua y bolas de papel) ----
export const Bowl = ({ y = 0, xr = 0, water = 0.3, swirl = 0, paper = 0, paperY = 0, t = 0, dye = 0 }) => {
  const prof = useMemo(() => [[0.0, 0], [0.17, 0], [0.15, 0.08], [0.14, 0.2], [0.2, 0.3], [0.27, 0.36], [0.29, 0.42], [0.0, 0.42]].map(([a, b]) => new THREE.Vector2(a, b)), []);
  return <group position={[0, y, Z]} scale={[1, 1, 1.25]}>
    <mesh castShadow><latheGeometry args={[prof, 40]} /><meshToonMaterial color={B.porcelain} side={THREE.DoubleSide} transparent opacity={1 - 0.75 * xr} depthWrite={xr < 0.5} />{xr < 0.5 ? <OL t={0.014} /> : null}</mesh>
    {water > 0.01 ? <mesh position={[0, water + 0.04, 0]} rotation={[-Math.PI / 2, 0, swirl]}><circleGeometry args={[0.13 + water * 0.2, 32]} /><meshToonMaterial color={dye > 0.5 ? '#ff6fa8' : B.water} transparent opacity={0.9} /></mesh> : null}
    {swirl ? <mesh position={[0, water + 0.046, 0]} rotation={[-Math.PI / 2, 0, swirl * 1.6]}><ringGeometry args={[0.06, 0.1, 24, 1, 0, Math.PI * 1.3]} /><meshBasicMaterial color="#d8f0ff" /></mesh> : null}
    {paper > 0.01 ? [0, 1, 2].map((k) => <mesh key={k} position={[Math.cos(k * 2.1) * 0.06, water + 0.07 + paperY + Math.sin(t * 2 + k) * 0.01, Math.sin(k * 2.1) * 0.05]} rotation={[t + k, k, 0]} scale={paper}>
      <icosahedronGeometry args={[0.045, 0]} /><meshToonMaterial color={B.paper} flatShading /><OL t={0.005} />
    </mesh>) : null}
    <mesh position={[0, 0.435, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[0.235, 0.035, 12, 40]} /><meshToonMaterial color="#ffffff" transparent opacity={1 - 0.6 * xr} />{xr < 0.5 ? <OL t={0.008} /> : null}</mesh>
  </group>;
};

// ---- tanque con todas sus piezas ----
// on: {valve, float, overflow, hole, flap, lever, supply, tap}
export const Tank = ({ y = 0, xr = 0.85, level = 0, on = {}, flap = 0, handle = 0, t = 0, spill = 0, dye = 0, tapOpen = 0, fillFlow = 0, floatStuck = 0 }) => {
  const inner = { w: 0.46, h: 0.34, d: 0.17, y0: 0.53 };
  const wy = inner.y0 + 0.01;
  const lv = Math.min(level, 1.08);
  const wh = Math.max(0.004, inner.h * 0.92 * lv);
  const fy = floatStuck ? 0.74 : wy + Math.max(wh, 0.04) + 0.02;
  const out = flap > 0.3 && level > 0.06;
  return <group position={[TANK[0], TANK[1] + y, TANK[2]]}>
    <mesh position={[0, 0.72, 0]} castShadow>
      <boxGeometry args={[0.52, 0.42, 0.22]} />
      <meshToonMaterial color={B.porcelain} transparent opacity={1 - 0.85 * xr} depthWrite={xr < 0.5} />
      {xr < 0.5 ? <OL t={0.012} /> : null}
    </mesh>
    {xr > 0.05 ? <lineSegments position={[0, 0.72, 0]}><edgesGeometry args={[new THREE.BoxGeometry(0.52, 0.42, 0.22)]} /><lineBasicMaterial color={INK} /></lineSegments> : null}
    {/* agua */}
    {level > 0.005 ? <mesh position={[0, wy + wh / 2, 0]}><boxGeometry args={[inner.w, wh, inner.d]} /><meshToonMaterial color={dye > 0.5 ? '#ff6fa8' : B.water} transparent opacity={0.75} /></mesh> : null}
    {/* desborde */}
    {spill > 0.01 ? Array.from({ length: 12 }).map((_, k) => {
      const u = ((t * 0.9 + k / 12) % 1);
      return <mesh key={k} position={[-0.22 + (k % 6) * 0.09, 0.93 - u * 0.95, 0.13 + u * 0.12]} scale={spill}><sphereGeometry args={[0.02, 8, 6]} /><meshBasicMaterial color="#8fd0ff" /></mesh>;
    }) : null}
    {/* llave de paso y tubo de entrada */}
    {on.supply ? <><Tube pts={[[-0.5, -0.33, 0.0], [-0.5, 0.2, 0.0], [-0.3, 0.45, 0.0], [-0.17, 0.53, 0.0]]} r={0.02} color={B.metal} />
      <group position={[-0.5, 0.15, 0.06]} rotation={[0, 0, tapOpen * Math.PI]}><Part geo={<torusGeometry args={[0.05, 0.012, 8, 16]} />} color={B.red} t={0.006} /><Part geo={<boxGeometry args={[0.1, 0.012, 0.012]} />} color={B.red} t={0} /></group></> : null}
    {/* válvula de llenado */}
    {on.valve ? <Part geo={<cylinderGeometry args={[0.022, 0.022, 0.3, 16]} />} color={B.metal} pos={[-0.17, 0.68, 0]} t={0.006} /> : null}
    {fillFlow > 0.01 ? <mesh position={[-0.17, 0.66, 0.04]} scale={[1, fillFlow, 1]}><cylinderGeometry args={[0.009, 0.009, 0.24, 8]} /><meshBasicMaterial color="#cfeeff" /></mesh> : null}
    {/* flotador */}
    {on.float ? <>
      <mesh position={[-0.08, (0.83 + fy) / 2, 0]} rotation={[0, 0, Math.atan2(0.83 - fy, -0.18) + Math.PI]}><boxGeometry args={[Math.hypot(0.18, 0.83 - fy), 0.012, 0.012]} /><meshToonMaterial color={B.chain} /></mesh>
      <Part geo={<sphereGeometry args={[0.055, 24, 16]} />} color={B.float} pos={[0.01, fy, 0]} t={0.006} />
    </> : null}
    {/* rebose */}
    {on.overflow ? <Part geo={<cylinderGeometry args={[0.018, 0.018, 0.3, 16]} />} color={B.metal} pos={[0.13, 0.7, 0]} t={0.005} /> : null}
    {on.overflow && level > 0.95 ? <Flow pts={[[0.13, 0.85, 0], [0.13, 0.55, 0], [0.1, 0.45, 0.2], [0, 0.42, 0.45]]} t={t} n={6} speed={0.8} r={0.016} color="#8fd0ff" on={1} /> : null}
    {/* agujero de salida */}
    {on.hole ? <mesh position={[0.02, 0.535, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.035, 0.055, 20]} /><meshBasicMaterial color={INK} /></mesh> : null}
    {/* compuerta */}
    {on.flap ? <group position={[-0.03, 0.555, 0]} rotation={[0, 0, flap * 1.1]}>
      <Part geo={<cylinderGeometry args={[0.055, 0.05, 0.03, 24]} />} color={B.flap} pos={[0.05, 0, 0]} t={0.006} />
    </group> : null}
    {/* cadena y palanca */}
    {on.lever ? <>
      <mesh position={[0.02, 0.69 + flap * 0.03, 0]}><boxGeometry args={[0.006, 0.24 - flap * 0.06, 0.006]} /><meshToonMaterial color={B.chain} /></mesh>
      <group position={[-0.24, 0.86, 0.12]} rotation={[0, 0, -handle * 0.5]}><Part geo={<boxGeometry args={[0.12, 0.024, 0.03]} />} color={B.metal} pos={[0.05, 0, 0]} t={0.005} /></group>
      <mesh position={[-0.1, 0.86, 0.05]}><boxGeometry args={[0.26, 0.008, 0.008]} /><meshToonMaterial color={B.chain} /></mesh>
    </> : null}
    {/* salida hacia la taza */}
    {out ? <Flow pts={[[0.02, 0.54, 0], [0.02, 0.45, 0.15], [0, 0.42, 0.42]]} t={t} n={12} speed={1.1} r={0.022} color="#8fd0ff" on={1} /> : null}
  </group>;
};

// ---- balde ----
export const Bucket = ({ pos = [-0.7, 0, 0.3], tilt = 0, water = 1, t = 0, pour = 0 }) => <group position={pos}>
  <group rotation={[0, 0, -tilt]}>
    <mesh position={[0, 0.17, 0]}><cylinderGeometry args={[0.16, 0.12, 0.34, 24, 1, true]} /><meshToonMaterial color="#5f8fb8" side={THREE.DoubleSide} /><OL t={0.01} /></mesh>
    <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.12, 24]} /><meshToonMaterial color="#4c7aa0" /></mesh>
    {water > 0.05 ? <mesh position={[0, 0.3 * water, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.12 + 0.035 * water, 24]} /><meshToonMaterial color={B.water} /></mesh> : null}
    <mesh position={[0, 0.34, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.16, 0.008, 6, 24, Math.PI]} /><meshToonMaterial color={B.chain} /></mesh>
  </group>
  {pour > 0.01 ? <Flow pts={[[0.18, 0.32, 0], [0.45, 0.25, -0.05], [0.65, 0.05, -0.1]]} t={t} n={14} speed={1.2} r={0.03} color="#8fd0ff" on={pour} /> : null}
</group>;

// ---- casa con tubo de ventilación ----
export const House = ({ t = 0, air = 0 }) => <group>
  <mesh position={[0, 1.2, 0]}><boxGeometry args={[4, 2.4, 2.5]} /><meshToonMaterial color="#f6e3c7" transparent opacity={0.35} depthWrite={false} /></mesh>
  <lineSegments position={[0, 1.2, 0]}><edgesGeometry args={[new THREE.BoxGeometry(4, 2.4, 2.5)]} /><lineBasicMaterial color={INK} /></lineSegments>
  <mesh position={[0, 2.95, 0]} rotation={[0, 0, 0]} scale={[2.4, 0.9, 1.45]}><coneGeometry args={[1, 1, 4]} /><meshToonMaterial color="#d36b4a" /><OL t={0.02} /></mesh>
  <Tube pts={[[-0.8, 0.4, 0.3], [-0.8, -0.4, 0.3], [-0.6, -0.6, 0.3], [2.6, -0.6, 0.3]]} r={0.08} color={B.pipe} />
  <Tube pts={[[0.8, 0.8, 0.3], [0.8, -0.6, 0.3]]} r={0.06} color={B.pipe} />
  <Tube pts={[[1.4, -0.6, 0.3], [1.4, 3.6, 0.3]]} r={0.07} color={B.teal} />
  <Part geo={<boxGeometry args={[0.5, 0.15, 0.4]} />} color={B.porcelain} pos={[0.8, 0.9, 0.3]} t={0.012} />
  <group position={[-0.8, 0, 0.3]} scale={0.8}><Bowl y={0.05} /></group>
  {air > 0.01 ? <Flow pts={[[1.4, 3.8, 0.3], [1.4, -0.5, 0.3]]} t={t} n={10} speed={0.5} r={0.05} color="#ffffff" on={air} /> : null}
</group>;

// ---- extras ----
export const Crown = ({ pos = [0, 1, 0], s = 1, t = 0 }) => <group position={pos} scale={s} rotation={[0, t * 0.6, 0]}>
  <mesh><cylinderGeometry args={[0.3, 0.3, 0.2, 24, 1, true]} /><meshToonMaterial color="#ffd23d" side={THREE.DoubleSide} /><OL t={0.012} /></mesh>
  {Array.from({ length: 6 }).map((_, k) => <mesh key={k} position={[Math.cos(k * Math.PI / 3) * 0.3, 0.18, Math.sin(k * Math.PI / 3) * 0.3]}><coneGeometry args={[0.06, 0.18, 8]} /><meshToonMaterial color="#ffd23d" /></mesh>)}
  {Array.from({ length: 6 }).map((_, k) => <mesh key={'g' + k} position={[Math.cos(k * Math.PI / 3 + 0.5) * 0.31, 0, Math.sin(k * Math.PI / 3 + 0.5) * 0.31]}><sphereGeometry args={[0.035]} /><meshBasicMaterial color={k % 2 ? B.red : B.teal} /></mesh>)}
</group>;

export const Bottles = ({ n = 12, pos = [0, 0, 0.6], t = 0, grow = 1 }) => <group position={pos}>
  {Array.from({ length: n }).map((_, k) => {
    const s = cl(grow * n - k);
    return <group key={k} position={[(k - (n - 1) / 2) * 0.18, 0, 0]} scale={s}>
      <Part geo={<cylinderGeometry args={[0.06, 0.06, 0.26, 14]} />} color={B.water} pos={[0, 0.13, 0]} t={0.006} />
      <Part geo={<cylinderGeometry args={[0.025, 0.04, 0.06, 10]} />} color={B.water} pos={[0, 0.29, 0]} t={0.004} />
    </group>;
  })}
</group>;

export const DualButton = ({ pos = [0, 0.96, -0.33], press = 0 }) => <group position={pos}>
  <Part geo={<cylinderGeometry args={[0.07, 0.07, 0.02, 24, 1, false, 0, Math.PI]} />} color={B.metal} pos={[0, 0.01 - (press === 1 ? 0.008 : 0), 0]} t={0.005} />
  <Part geo={<cylinderGeometry args={[0.07, 0.07, 0.02, 24, 1, false, Math.PI, Math.PI]} />} color="#c6d0d6" pos={[0, 0.01 - (press === 2 ? 0.008 : 0), 0]} t={0.005} />
</group>;

export const Wipes = ({ t = 0, on = 1 }) => on <= 0.01 ? null : <group>
  {Array.from({ length: 6 }).map((_, k) => {
    const u = cl((t * 0.4 - k * 0.12) % 1.4);
    return <mesh key={k} position={[0.05 * Math.sin(k), 0.8 - u * 0.9, Z + 0.03 * Math.cos(k)]} rotation={[t + k, k, t * 0.5]}>
      <boxGeometry args={[0.12, 0.006, 0.1]} /><meshToonMaterial color="#f4f4f4" /><OL t={0.004} />
    </mesh>;
  })}
</group>;

export const Drops = ({ t = 0, on = 1, pos = [0, 1.25, -0.33] }) => on <= 0.01 ? null : <group position={pos}>
  {Array.from({ length: 5 }).map((_, k) => {
    const u = ((t * 0.7 + k / 5) % 1);
    return <mesh key={k} position={[Math.sin(k) * 0.08, -u * 0.55, Math.cos(k) * 0.04]} scale={[1, 1.4, 1]}><sphereGeometry args={[0.022, 10, 8]} /><meshBasicMaterial color="#ff2f7a" /></mesh>;
  })}
</group>;
