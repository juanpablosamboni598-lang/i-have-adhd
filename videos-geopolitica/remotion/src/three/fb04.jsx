import React from 'react';
import * as THREE from 'three';
import { OL, Part, cl, lerp } from './kit.jsx';

// Short de objeto n.º 4: la olla a presión (vertical 9:16, estilo dibujado v2).
export const C = { wall: '#fde3c8', tile: '#f1c9a1', stove: '#e9ecee', dark: '#2b2f36', metal: '#c3ccd3', metal2: '#9aa6ad', rubber: '#3a3a42',
  water: '#7cc4ef', red: '#e2483d', green: '#2bb36b', flame: '#3d8bff', bean: '#7a3b22', yellow: '#ffd23d' };
export const POT = { Y: 1.0, R: 0.16, H: 0.2 };   // base de la olla, radio, alto

export const Lights = () => <>
  <ambientLight intensity={0.85} />
  <directionalLight position={[-1.8, 3.0, 2.4]} intensity={1.9} castShadow shadow-mapSize={[1024, 1024]}
    shadow-camera-left={-1.5} shadow-camera-right={1.5} shadow-camera-top={2.5} shadow-camera-bottom={0} shadow-camera-near={0.5} shadow-camera-far={8} shadow-bias={-0.0015} />
</>;

// cocina con estufa y fogón encendido
export const Stove = ({ t = 0, fire = 1 }) => <group>
  <color attach="background" args={[C.wall]} />
  <mesh position={[0, 1.5, -0.4]} receiveShadow><planeGeometry args={[6, 4]} /><meshToonMaterial color={C.wall} transparent /></mesh>
  {Array.from({ length: 12 }).map((_, k) => <mesh key={k} position={[-1.65 + k * 0.3, 1.5, -0.395]}><boxGeometry args={[0.005, 4, 0.002]} /><meshBasicMaterial color={C.tile} transparent /></mesh>)}
  <Part geo={<boxGeometry args={[1.4, 0.06, 0.7]} />} color={C.stove} pos={[0, 0.93, 0]} t={0.006} />
  <Part geo={<boxGeometry args={[1.4, 0.9, 0.66]} />} color="#dfe3e6" pos={[0, 0.45, 0]} t={0.006} />
  {[-0.3, 0.3].map((x) => <mesh key={x} position={[x, 0.75, 0.335]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.035, 0.035, 0.03, 20]} /><meshToonMaterial color={C.dark} transparent /><OL t={0.003} /></mesh>)}
  {/* parrilla y llama */}
  <Part geo={<torusGeometry args={[0.13, 0.008, 6, 32]} />} color={C.dark} pos={[0, 0.965, 0]} rot={[Math.PI / 2, 0, 0]} t={0.002} />
  {fire > 0 ? Array.from({ length: 14 }).map((_, k) => { const a = k / 14 * Math.PI * 2, h = 0.03 + Math.sin(t * 14 + k) * 0.008; return <mesh key={k} position={[Math.cos(a) * 0.08, 0.975 + h / 2, Math.sin(a) * 0.08]} scale={fire}><coneGeometry args={[0.01, h, 6]} /><meshBasicMaterial color={C.flame} transparent opacity={0.85} /></mesh>; }) : null}
</group>;

const Puffs = ({ t, at, n = 8, op = 0.5, dir = [0, 1, 0], spread = 0.03, len = 0.3 }) => <group position={at}>{Array.from({ length: n }).map((_, k) => {
  const u = (t * 1.2 + k / n) % 1;
  return <mesh key={k} position={[dir[0] * u * len + Math.sin(k * 3 + t) * spread, dir[1] * u * len, dir[2] * u * len]} scale={0.012 + u * 0.035}><sphereGeometry args={[1, 10, 8]} /><meshToonMaterial color="#ffffff" transparent opacity={op * (1 - u)} depthWrite={false} /></mesh>;
})}</group>;

// la olla. press 0–1 (flechas de vapor empujando), boil 0–1, lid 0 abierta→1 cerrada
export const Pot = ({ t = 0, xr = 0, lid = 1, lidUp = 0, boil = 0, press = 0, gasket = 1, weight = 1, jiggle = 0, safety = 1, popped = 0, leakEdge = 0, clog = 0, blast = 0, lock = 0, fill = 0.5, line = 0, beans = 0, foam = 0, swell = 0 }) => {
  const { Y, R, H } = POT; const op = 1 - 0.85 * xr; const wl = Y + 0.02 + H * 0.9 * fill;
  const lift = jiggle > 0 ? Math.max(0, Math.sin(t * 9)) * 0.012 * jiggle : 0;
  return <group scale={[1 + swell * 0.06, 1 + swell * 0.04, 1 + swell * 0.06]} position={[0, -swell * 0.02, 0]}>
    {/* cuerpo */}
    <mesh position={[0, Y + H / 2, 0]} castShadow={xr < 0.3}><cylinderGeometry args={[R, R * 0.97, H, 48, 1, xr > 0.3]} /><meshToonMaterial color={C.metal} transparent opacity={op} side={THREE.DoubleSide} depthWrite={xr < 0.5} />{xr < 0.6 ? <OL t={0.006} /> : null}</mesh>
    <Part geo={<cylinderGeometry args={[R * 0.97, R * 0.97, 0.01, 48]} />} color={C.metal2} pos={[0, Y + 0.005, 0]} t={0.003} />
    <Part geo={<boxGeometry args={[0.22, 0.025, 0.04]} />} color={C.dark} pos={[R + 0.1, Y + H - 0.03, 0]} t={0.003} />
    {/* agua, frijoles, burbujas, espuma */}
    {xr > 0.3 ? <group>
      <mesh position={[0, (Y + 0.01 + wl) / 2, 0]}><cylinderGeometry args={[R * 0.95, R * 0.95, wl - Y - 0.01, 40]} /><meshToonMaterial color={C.water} transparent opacity={0.5} depthWrite={false} /></mesh>
      {beans > 0 ? Array.from({ length: 22 }).map((_, k) => <mesh key={k} position={[Math.cos(k * 2.4) * (0.03 + (k % 5) * 0.022), Y + 0.025 + (k % 3) * 0.02 + Math.sin(t * 3 + k) * 0.004 * boil, Math.sin(k * 2.4) * (0.03 + (k % 5) * 0.022)]} rotation={[k, k * 2, 0]} scale={[1, 0.65, 0.65].map((v) => v * (1 + swell * 0.4))}><sphereGeometry args={[0.014, 10, 8]} /><meshToonMaterial color={C.bean} transparent /></mesh>) : null}
      {boil > 0 ? Array.from({ length: 16 }).map((_, k) => { const u = (t * 1.5 * boil + k / 16) % 1; return <mesh key={k} position={[Math.cos(k * 1.9) * R * 0.7 * ((k % 4) / 4 + 0.2), Y + 0.02 + u * (wl - Y - 0.02), Math.sin(k * 1.9) * R * 0.7 * ((k % 4) / 4 + 0.2)]} scale={0.006 + u * 0.008}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.8} /></mesh>; }) : null}
      {foam > 0 ? <mesh position={[0, wl + 0.02 * foam, 0]}><cylinderGeometry args={[R * 0.94, R * 0.94, 0.04 * foam, 32]} /><meshToonMaterial color="#f3ead8" transparent opacity={0.9} /></mesh> : null}
      {line ? <mesh position={[0, Y + H * 0.66, R * 0.96]}><boxGeometry args={[0.08, 0.004, 0.002]} /><meshBasicMaterial color={C.red} transparent /></mesh> : null}
      {/* flechas de presión: el vapor empuja el agua hacia abajo */}
      {press > 0 ? Array.from({ length: 5 }).map((_, k) => <mesh key={k} position={[-0.1 + k * 0.05, wl + 0.06 - (t * 0.3 % 0.03), 0]} rotation={[Math.PI, 0, 0]} scale={cl(press)}><coneGeometry args={[0.012, 0.035, 8]} /><meshBasicMaterial color={C.red} transparent /></mesh>) : null}
    </group> : null}
    {/* tapa */}
    {lid > 0 ? <group position={[0, Y + H + 0.012 + lidUp * 0.25, 0]} rotation={[0, lock * 0.3, lidUp * 0.4]}>
      <mesh><cylinderGeometry args={[R * 1.04, R * 1.04, 0.022, 48]} /><meshToonMaterial color={C.metal} transparent opacity={op} /><OL t={0.004} /></mesh>
      <mesh position={[0, 0.011 - R * 0.95 * Math.cos(0.35), 0]}><sphereGeometry args={[R * 0.95, 32, 8, 0, Math.PI * 2, 0, 0.35]} /><meshToonMaterial color={C.metal} transparent opacity={op} /><OL t={0.003} /></mesh>
      {gasket ? <mesh position={[0, -0.012, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[R * 0.99, 0.007, 8, 48]} /><meshToonMaterial color={C.rubber} transparent /></mesh> : null}
      <Part geo={<boxGeometry args={[0.2, 0.022, 0.035]} />} color={C.dark} pos={[-(R + 0.09), 0.015, 0]} t={0.003} />
      {/* tubito y pesita (válvula reguladora) */}
      <Part geo={<cylinderGeometry args={[0.007, 0.007, 0.045, 12]} />} color={C.metal2} pos={[0, 0.06, 0]} t={0.002} />
      {weight ? <group position={[0, 0.095 + lift, 0]}><Part geo={<cylinderGeometry args={[0.022, 0.026, 0.03, 20]} />} color={C.dark} t={0.003} /></group> : null}
      {clog ? <mesh position={[0, 0.03, 0]}><sphereGeometry args={[0.009, 8, 6]} /><meshToonMaterial color={C.bean} transparent /></mesh> : null}
      {/* válvula de seguridad */}
      {safety ? <group position={[0.07, 0.035 + popped * 0.15, 0.03]}><Part geo={<cylinderGeometry args={[0.011, 0.011, 0.018, 12]} />} color={C.red} t={0.002} /></group> : null}
      {lock ? <mesh position={[R * 0.7, 0.03, 0.05]}><boxGeometry args={[0.025, 0.02, 0.02]} /><meshToonMaterial color={C.yellow} transparent /><OL t={0.002} /></mesh> : null}
    </group> : null}
    {/* vapor */}
    {jiggle > 0 && lift > 0.004 ? <Puffs t={t} at={[0, Y + H + 0.12, 0]} n={6} op={0.6} /> : null}
    {leakEdge > 0 ? <><Puffs t={t} at={[R, Y + H + 0.01, 0]} dir={[1, 0.4, 0]} op={0.5 * leakEdge} /><Puffs t={t + 0.3} at={[-R, Y + H + 0.01, 0]} dir={[-1, 0.4, 0]} op={0.5 * leakEdge} /></> : null}
    {popped > 0.5 ? <Puffs t={t} at={[0.07, Y + H + 0.06, 0.03]} n={10} op={0.7} len={0.4} /> : null}
    {blast > 0 ? <Puffs t={t} at={[0, Y + H, 0]} n={16} op={0.8 * blast} spread={0.12} len={0.6} /> : null}
    {boil > 0 && lid === 0 ? <Puffs t={t} at={[0, Y + H, 0]} n={8} op={0.4 * boil} spread={0.06} /> : null}
  </group>;
};

// termómetro de vidrio (medidor), v en °C 80–125
export const Thermo = ({ v = 20, pos = [0.32, 1.12, 0.05] }) => {
  const u = cl((v - 20) / 110); const col = new THREE.Color('#5aa9e6').lerp(new THREE.Color(C.red), cl((v - 60) / 60));
  return <group position={pos}>
    <mesh><cylinderGeometry args={[0.025, 0.025, 0.3, 20, 1, true]} /><meshToonMaterial color="#ffffff" transparent opacity={0.35} depthWrite={false} side={THREE.DoubleSide} /><OL t={0.003} /></mesh>
    <mesh position={[0, -0.15 + 0.15 * u, 0]}><cylinderGeometry args={[0.02, 0.02, 0.3 * Math.max(0.03, u), 20]} /><meshToonMaterial color={col} transparent /></mesh>
    <mesh position={[0, -0.165, 0]}><sphereGeometry args={[0.03, 14, 10]} /><meshToonMaterial color={col} transparent /><OL t={0.003} /></mesh>
  </group>;
};
