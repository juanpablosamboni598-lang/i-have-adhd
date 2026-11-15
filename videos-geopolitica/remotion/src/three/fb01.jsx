import React, { useMemo } from 'react';
import * as THREE from 'three';
import { OL, Part, cl, tw, lerp, drop, INK } from './kit.jsx';

// Video propio de Facebook n.º 1: el candado (vertical 9:16).
export const C = { wall: '#cfe3f5', wall2: '#b4d0ea', wood: '#c9a26b', wood2: '#a8844f', brass: '#e8b43c', brass2: '#c9952a', steel: '#b8c2c9', dark: '#2b2f36',
  keyPin: '#e2483d', drvPin: '#3f6fb0', spring: '#9aa6ad', red: '#e2483d', green: '#2bb36b', yellow: '#ffd23d' };
const BW = 0.5, BH = 0.55, BD = 0.32, Y0 = 0.3, PR = 0.1; // cuerpo; centro y radio del cilindro (eje en z)
const SHEAR = Y0 + PR, TOPC = 0.56, PZ = [-0.12, -0.06, 0, 0.06, 0.12];
const KEYPIN = [0.07, 0.05, 0.08, 0.045, 0.065];            // largo de cada pin de abajo (corte)
const OKCUT = KEYPIN.map((l) => SHEAR - l);                  // altura de cada pico de la llave buena
const BADCUT = [0.02, -0.015, 0.025, 0.0, -0.02].map((e, k) => OKCUT[k] + e);
export const LOCK = { Y0, SHEAR };

export const Lights = () => <>
  <ambientLight intensity={0.85} />
  <directionalLight position={[-2.5, 3.0, 2.6]} intensity={1.9} castShadow shadow-mapSize={[1024, 1024]}
    shadow-camera-left={-2} shadow-camera-right={2} shadow-camera-top={2} shadow-camera-bottom={-1} shadow-camera-near={0.5} shadow-camera-far={10} shadow-bias={-0.0015} />
</>;

export const Shop = () => <group>
  <color attach="background" args={[C.wall]} />
  <mesh position={[0, 1.5, -0.6]} receiveShadow><planeGeometry args={[8, 5]} /><meshToonMaterial color={C.wall} /></mesh>
  {/* tablero de herramientas */}
  <mesh position={[0, 1.05, -0.58]} receiveShadow><boxGeometry args={[1.6, 0.8, 0.02]} /><meshToonMaterial color={C.wall2} /><OL t={0.008} /></mesh>
  {Array.from({ length: 40 }).map((_, k) => <mesh key={k} position={[-0.7 + (k % 10) * 0.155, 0.75 + Math.floor(k / 10) * 0.2, -0.565]}><circleGeometry args={[0.012, 8]} /><meshBasicMaterial color="#8fb2d4" /></mesh>)}
  <mesh position={[-0.45, 1.1, -0.55]} rotation={[0, 0, 0.3]} castShadow><boxGeometry args={[0.05, 0.4, 0.02]} /><meshToonMaterial color={C.red} /><OL t={0.006} /></mesh>
  <mesh position={[0.5, 1.15, -0.55]} rotation={[0, 0, -0.2]} castShadow><boxGeometry args={[0.3, 0.06, 0.02]} /><meshToonMaterial color={C.steel} /><OL t={0.006} /></mesh>
  {/* mesa */}
  <mesh position={[0, -0.03, 0]} receiveShadow castShadow><boxGeometry args={[3, 0.06, 1.6]} /><meshToonMaterial color={C.wood} /><OL t={0.01} /></mesh>
  {Array.from({ length: 6 }).map((_, k) => <mesh key={k} position={[0, 0.001, -0.7 + k * 0.28]}><boxGeometry args={[3, 0.002, 0.006]} /><meshBasicMaterial color={C.wood2} /></mesh>)}
</group>;

const Spring = ({ y0, y1, z, r = 0.012 }) => {
  const n = 6, h = (y1 - y0) / n;
  return <group>{Array.from({ length: n }).map((_, k) => <mesh key={k} position={[0, y0 + h * (k + 0.5), z]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, Math.max(0.3, h / 0.02)]}><torusGeometry args={[r, 0.003, 5, 12]} /><meshBasicMaterial color={C.spring} /></mesh>)}</group>;
};

// llave (hoja a lo largo de z, entra por el frente)
export const Key = ({ cut = OKCUT, z = 0, rot = 0, col = C.steel }) => {
  const geo = useMemo(() => {
    const s = new THREE.Shape(); const zs = [...PZ].reverse();
    s.moveTo(0.22, Y0 - PR * 0.75); s.lineTo(-0.17, Y0 - PR * 0.75);
    s.lineTo(-0.17, cut[0] - 0.01);
    PZ.forEach((pz, k) => { s.lineTo(pz - 0.02, cut[k] - 0.012); s.lineTo(pz, cut[k]); s.lineTo(pz + 0.02, cut[k] - 0.012); });
    s.lineTo(0.17, cut[4] - 0.012); s.lineTo(0.22, cut[4] - 0.012); s.lineTo(0.22, Y0 - PR * 0.75);
    return new THREE.ExtrudeGeometry(s, { depth: 0.018, bevelEnabled: false });
  }, [JSON.stringify(cut)]);
  return <group position={[0, 0, z]}>
    <group position={[0, Y0, 0]} rotation={[0, 0, rot]}><group position={[0, -Y0, 0]}>
      <mesh geometry={geo} rotation={[0, -Math.PI / 2, 0]} position={[0.009, 0, 0]} castShadow><meshToonMaterial color={col} /><OL t={0.004} /></mesh>
      <mesh position={[0, Y0 - 0.02, 0.34]} rotation={[0, 0, 0]} castShadow><boxGeometry args={[0.03, 0.2, 0.2]} /><meshToonMaterial color={col} /><OL t={0.006} /></mesh>
      <mesh position={[0, Y0 + 0.03, 0.38]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.035, 0.012, 8, 20]} /><meshToonMaterial color={C.dark} /></mesh>
    </group></group>
  </group>;
};

// pins: 0 ninguno, 1 enteros, 2 cortados. key: null | 'ok' | 'bad' | 'driver'
export const Padlock = ({ t = 0, xr = 0, up = 0, latch = 0, plug = 0, pins = 0, keyIn = 0, key = null, rot = 0, nail = 0, saw = 0, hard = 0, cutDone = 0, shake = 0 }) => {
  const cut = key === 'ok' ? OKCUT : key === 'bad' ? BADCUT : null;
  const keyZ = lerp(0.42, 0, keyIn);
  // altura del fondo de cada pin de abajo
  const base = PZ.map((pz, k) => {
    const rest = Y0 - PR * 0.55;
    if (!cut || keyIn < 0.05) return rest;
    const reach = cl((PZ[4] + 0.02 - (pz - keyZ)) / 0.06); // la llave avanza y va subiendo pines
    return lerp(rest, cut[k], keyIn > 0.95 ? 1 : reach * keyIn);
  });
  const sx = shake * Math.sin(t * 40) * 0.01;
  const op = 1 - 0.8 * xr;
  const body = (p, a, k) => <mesh key={k} position={p} castShadow receiveShadow><boxGeometry args={a} /><meshToonMaterial color={C.brass} transparent opacity={op} depthWrite={xr < 0.5} />{xr < 0.5 ? <OL t={0.01} /> : null}</mesh>;
  const shY = up * 0.12;
  return <group position={[sx, 0, 0]}>
    {/* cuerpo */}
    {body([0, BH / 2 + 0.05, 0], [BW, BH, BD], 'b')}
    {/* arco (gancho) */}
    <group position={[0, shY, 0]}>
      <mesh position={[0, BH + 0.2, 0]} castShadow><torusGeometry args={[0.15, 0.035, 12, 32, Math.PI]} /><meshToonMaterial color={hard ? '#8f9ba3' : C.steel} /><OL t={0.008} /></mesh>
      <mesh position={[0.15, BH + 0.08, 0]} castShadow><cylinderGeometry args={[0.035, 0.035, 0.24, 16]} /><meshToonMaterial color={hard ? '#8f9ba3' : C.steel} /><OL t={0.008} /></mesh>
      <mesh position={[-0.15, BH + 0.08, 0]} castShadow><cylinderGeometry args={[0.035, 0.035, 0.24, 16]} /><meshToonMaterial color={hard ? '#8f9ba3' : C.steel} /><OL t={0.008} /></mesh>
      {/* muesca del lado izquierdo */}
      <mesh position={[-0.12, BH, 0]}><boxGeometry args={[0.02, 0.03, 0.05]} /><meshBasicMaterial color={INK} /></mesh>
      {cutDone > 0.01 ? <mesh position={[0.15, BH + 0.18, 0.036]}><boxGeometry args={[0.075, 0.006 + cutDone * 0.02, 0.004]} /><meshBasicMaterial color={INK} /></mesh> : null}
    </group>
    {/* pestillo con resorte */}
    {latch ? <group>
      <mesh position={[lerp(-0.03, -0.1, latch), BH, 0]} castShadow><boxGeometry args={[0.08, 0.03, 0.05]} /><meshToonMaterial color={C.dark} /><OL t={0.004} /></mesh>
      {Array.from({ length: 5 }).map((_, k) => <mesh key={k} position={[0.03 + k * 0.016 + latch * 0.0, BH, 0]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.012, 0.003, 5, 10]} /><meshBasicMaterial color={C.spring} /></mesh>)}
    </group> : null}
    {/* clavo por el hueco */}
    {nail > 0.01 ? <mesh position={[lerp(-0.45, -0.15, nail), BH, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.008, 0.008, 0.3, 8]} /><meshToonMaterial color={C.steel} /><OL t={0.003} /></mesh> : null}
    {/* cilindro + pines de abajo (giran juntos) */}
    {plug ? <group position={[0, Y0, 0]} rotation={[0, 0, rot]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[PR, PR, BD + 0.004, 32]} /><meshToonMaterial color={C.brass2} transparent opacity={0.55} depthWrite={false} /></mesh>
      <mesh position={[0, 0, BD / 2 + 0.003]}><ringGeometry args={[PR - 0.004, PR, 32]} /><meshBasicMaterial color={INK} /></mesh>
      <mesh position={[0, -0.02, BD / 2 + 0.004]}><boxGeometry args={[0.02, 0.1, 0.002]} /><meshBasicMaterial color={INK} /></mesh>
      {pins ? PZ.map((pz, k) => {
        const kl = pins === 2 ? KEYPIN[k] : KEYPIN[k] + 0.06;
        return <mesh key={k} position={[0, base[k] - Y0 + kl / 2, pz]}><cylinderGeometry args={[0.014, 0.014, kl, 12]} /><meshToonMaterial color={pins === 2 ? C.keyPin : '#b07a3a'} /><OL t={0.003} /></mesh>;
      }) : null}
    </group> : null}
    {/* pines de arriba + resortes (no giran) */}
    {plug && pins === 2 ? PZ.map((pz, k) => {
      const top = base[k] + KEYPIN[k];
      const dl = 0.06;
      return <group key={k}>
        <mesh position={[0, top + dl / 2, pz]}><cylinderGeometry args={[0.014, 0.014, dl, 12]} /><meshToonMaterial color={C.drvPin} /><OL t={0.003} /></mesh>
        <Spring y0={top + dl} y1={TOPC} z={pz} />
      </group>;
    }) : null}
    {plug && pins === 1 ? PZ.map((pz, k) => <Spring key={k} y0={base[k] + KEYPIN[k] + 0.06} y1={TOPC} z={pz} />) : null}
    {/* línea de corte */}
    {pins === 2 ? <mesh position={[0, SHEAR, 0]}><boxGeometry args={[0.002, 0.003, BD + 0.06]} /><meshBasicMaterial color={C.green} /></mesh> : null}
    {/* llave o destornillador */}
    {keyIn > 0.001 && cut ? <Key cut={cut} z={keyZ} rot={rot} col={key === 'bad' ? '#c7a24a' : C.steel} /> : null}
    {key === 'driver' && keyIn > 0.001 ? <group position={[0, Y0 - 0.02, lerp(0.6, 0.25, keyIn)]} rotation={[0, 0, rot]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.12]} castShadow><cylinderGeometry args={[0.035, 0.035, 0.22, 12]} /><meshToonMaterial color={C.red} /><OL t={0.005} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.06]}><cylinderGeometry args={[0.008, 0.008, 0.2, 8]} /><meshToonMaterial color={C.steel} /></mesh>
    </group> : null}
    {/* sierra */}
    {saw > 0.01 ? <group position={[0.15 + Math.sin(t * 9) * 0.12, BH + 0.2 + shY, 0.05]} rotation={[0, 0, 0]} scale={saw}>
      <mesh castShadow><boxGeometry args={[0.5, 0.05, 0.006]} /><meshToonMaterial color={C.steel} /><OL t={0.003} /></mesh>
      <mesh position={[0.3, 0.06, 0]} castShadow><boxGeometry args={[0.12, 0.15, 0.03]} /><meshToonMaterial color={C.red} /><OL t={0.005} /></mesh>
      {hard ? Array.from({ length: 6 }).map((_, k) => { const u = ((t * 2 + k / 6) % 1); return <mesh key={k} position={[-0.1 + Math.sin(k * 3) * 0.1 * u, -0.02 + u * 0.1, 0.02 + u * 0.08]} scale={0.008 * (1 - u)}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color={C.yellow} /></mesh>; }) : null}
    </group> : null}
  </group>;
};
export { OKCUT, BADCUT };
