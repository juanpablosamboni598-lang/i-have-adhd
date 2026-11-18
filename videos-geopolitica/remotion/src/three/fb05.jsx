import React from 'react';
import * as THREE from 'three';
import { OL, Part, cl, lerp } from './kit.jsx';

// Short de objeto n.º 5: el termo (vertical 9:16, estilo dibujado v2). El termo se ve en corte (media botella) para ver las dos paredes.
export const C = { bg: '#dbe9f2', table: '#c9a26b', outer: '#3f6fb0', steel: '#c3ccd3', silver: '#e9eef2', coffee: '#6b3f22', red: '#e2483d', blue: '#3d7ee0',
  green: '#2bb36b', cork: '#c99a62', glass: '#cfe6ef', ice: '#e6f6ff', yellow: '#ffd23d' };
export const TH = { Y: 0.92, R1: 0.11, R2: 0.085, H: 0.42 };   // base, radio externo, radio interno, alto

export const Lights = () => <>
  <ambientLight intensity={0.85} />
  <directionalLight position={[-1.8, 3.0, 2.4]} intensity={1.9} castShadow shadow-mapSize={[1024, 1024]}
    shadow-camera-left={-1.5} shadow-camera-right={1.5} shadow-camera-top={2.5} shadow-camera-bottom={0} shadow-camera-near={0.5} shadow-camera-far={8} shadow-bias={-0.0015} />
</>;

export const Table = () => <group>
  <color attach="background" args={[C.bg]} />
  <mesh position={[0, 1.5, -0.45]} receiveShadow><planeGeometry args={[6, 4]} /><meshToonMaterial color={C.bg} transparent /></mesh>
  <Part geo={<boxGeometry args={[2.2, 0.05, 1.0]} />} color={C.table} pos={[0, 0.895, 0]} t={0.006} />
  {Array.from({ length: 6 }).map((_, k) => <mesh key={k} position={[0, 0.921, -0.4 + k * 0.16]}><boxGeometry args={[2.2, 0.002, 0.005]} /><meshBasicMaterial color="#a8844f" transparent /></mesh>)}
</group>;

// flechas de calor que se escapan (rojas) — tipo: 0 tocando (cortas), 1 aire (suben), 2 luz (onduladas)
const Arrows = ({ t, n = 6, y0, r, kind = 0, op = 1, col = C.red, back = 0 }) => <group>{Array.from({ length: n }).map((_, k) => {
  const a = k / n * Math.PI * 2 + 0.3, u = (t * 0.8 + k * 0.17) % 1, dist = back ? r + 0.08 * (1 - u) : r + 0.08 * u;
  const y = y0 + (k % 3) * 0.1 + (kind === 1 ? u * 0.15 : 0);
  return <group key={k} position={[Math.cos(a) * dist, y, Math.sin(a) * dist]} rotation={[0, -a, kind === 1 ? 0.7 : 0]}>
    <mesh rotation={[0, 0, back ? Math.PI / 2 : -Math.PI / 2]} position={[0, kind === 2 ? Math.sin(u * 20) * 0.006 : 0, 0]}><coneGeometry args={[0.01, 0.03, 8]} /><meshBasicMaterial color={col} transparent opacity={op * Math.sin(u * Math.PI)} /></mesh>
  </group>;
})}</group>;

// el termo en corte. gap: 'air' | 'vac' | 'solid'; mirror 0–1; wall: 'single'|'double'
export const Flask = ({ t = 0, wall = 'double', gap = 'air', mirror = 0, cap = 1, neck = 0, level = 0.8, hot = 1, ice = 0, glass = 1, broken = 0, steel = 0, heat = 0, rad = 0, conv = 0, rinse = 0, cut = 1 }) => {
  const { Y, R1, R2, H } = TH; const th = cut ? Math.PI * 1.25 : Math.PI * 2; const ts = cut ? Math.PI * 0.375 : 0;
  const outerCol = steel ? C.steel : glass ? C.glass : C.outer;
  const inR = wall === 'single' ? R1 : R2;
  const lvl = H * 0.9 * level;
  return <group>
    {/* pared externa (corte) */}
    <mesh position={[0, Y + H / 2, 0]} castShadow><cylinderGeometry args={[R1, R1, H, 48, 1, true, ts, th]} /><meshToonMaterial color={outerCol} transparent opacity={glass && !steel ? 0.55 : 1} side={THREE.DoubleSide} /><OL t={0.004} /></mesh>
    <Part geo={<cylinderGeometry args={[R1, R1, 0.012, 48]} />} color={outerCol} pos={[0, Y + 0.006, 0]} t={0.003} />
    {/* pared interna con espejo */}
    {wall === 'double' ? <mesh position={[0, Y + H / 2 + 0.01, 0]}><cylinderGeometry args={[R2, R2, H - 0.02, 48, 1, true, ts, th]} /><meshToonMaterial color={new THREE.Color(C.glass).lerp(new THREE.Color(C.silver), mirror)} emissive={new THREE.Color('#ffffff')} emissiveIntensity={mirror * 0.25} transparent opacity={0.6 + mirror * 0.4} side={THREE.DoubleSide} /><OL t={0.003} /></mesh> : null}
    {broken ? Array.from({ length: 8 }).map((_, k) => <mesh key={k} position={[Math.cos(k) * 0.03, Y + 0.03 + (k % 3) * 0.01, Math.sin(k) * 0.03]} rotation={[k, k * 2, 0]}><boxGeometry args={[0.03, 0.002, 0.02]} /><meshToonMaterial color={C.silver} transparent /></mesh>) : null}
    {/* moléculas de aire en el espacio entre paredes */}
    {wall === 'double' && gap === 'air' ? Array.from({ length: 30 }).map((_, k) => { const a = ts + ((k * 0.37) % 1) * th, rr = (R1 + R2) / 2 + Math.sin(t * 6 + k) * 0.006; return <mesh key={k} position={[Math.cos(a) * rr, Y + 0.03 + ((k * 0.61 + t * 0.2) % 1) * (H - 0.06), -Math.sin(a) * rr]}><sphereGeometry args={[0.005, 8, 6]} /><meshBasicMaterial color={C.blue} transparent /></mesh>; }) : null}
    {/* café o hielo */}
    {level > 0 ? <mesh position={[0, Y + 0.02 + lvl / 2, 0]}><cylinderGeometry args={[inR * 0.97, inR * 0.97, lvl, 40, 1, false, ts, th]} /><meshToonMaterial color={ice ? '#bfe3f7' : C.coffee} transparent opacity={0.92} side={THREE.DoubleSide} /></mesh> : null}
    {ice ? Array.from({ length: 5 }).map((_, k) => <mesh key={k} position={[Math.cos(k * 1.3) * 0.035, Y + 0.05 + k * 0.06, Math.sin(k * 1.3) * 0.035]} rotation={[k, k, 0]}><boxGeometry args={[0.035 * ice, 0.035 * ice, 0.035 * ice]} /><meshToonMaterial color={C.ice} transparent opacity={0.9} /><OL t={0.002} /></mesh>) : null}
    {rinse > 0 ? <mesh position={[0, Y + 0.02 + H * 0.4 * rinse, 0]}><cylinderGeometry args={[inR * 0.96, inR * 0.96, H * 0.8 * rinse, 40, 1, false, ts, th]} /><meshToonMaterial color="#7cc4ef" transparent opacity={0.6} side={THREE.DoubleSide} /></mesh> : null}
    {/* cuello y tapa */}
    <mesh position={[0, Y + H + 0.02, 0]}><cylinderGeometry args={[R2 * 0.75, R1, 0.04, 40, 1, true, ts, th]} /><meshToonMaterial color={neck ? C.red : outerCol} transparent side={THREE.DoubleSide} /><OL t={0.003} /></mesh>
    {cap ? <group position={[0, Y + H + 0.06 + (cap < 1 ? (1 - cap) * 0.2 : 0), 0]}>
      <Part geo={<cylinderGeometry args={[R2 * 0.72, R2 * 0.68, 0.05, 32]} />} color={C.cork} t={0.003} />
      <Part geo={<cylinderGeometry args={[R1 * 1.02, R1 * 1.02, 0.05, 40]} />} color={steel ? C.steel : C.outer} pos={[0, 0.045, 0]} t={0.003} />
    </group> : null}
    {/* calor que se escapa */}
    {heat > 0 ? <Arrows t={t} y0={Y + 0.1} r={wall === 'single' ? R1 : R1 * 1.02} op={heat} /> : null}
    {conv > 0 ? <Arrows t={t + 0.3} y0={Y + 0.15} r={R1} kind={1} op={conv} /> : null}
    {rad > 0 ? <Arrows t={t + 0.6} y0={Y + 0.12} r={R1} kind={2} op={rad} col={C.yellow} back={mirror > 0.5 ? 1 : 0} /> : null}
    {neck ? <Arrows t={t} y0={Y + H + 0.02} r={R2 * 0.8} n={4} op={0.9} /> : null}
    {/* vapor del café */}
    {hot && level > 0 && cap === 0 ? Array.from({ length: 6 }).map((_, k) => { const u = (t * 0.6 + k / 6) % 1; return <mesh key={k} position={[Math.sin(k * 2 + t) * 0.03, Y + H + 0.05 + u * 0.25, 0]} scale={0.015 + u * 0.03}><sphereGeometry args={[1, 10, 8]} /><meshToonMaterial color="#ffffff" transparent opacity={0.5 * (1 - u)} depthWrite={false} /></mesh>; }) : null}
  </group>;
};

// mano que toca el termo (esfera + dedos simples)
export const Hand = ({ x = 0.2 }) => <group position={[x, 1.12, 0.02]} rotation={[0, 0, 0.2]}>
  <mesh><boxGeometry args={[0.08, 0.1, 0.03]} /><meshToonMaterial color="#e8b98f" transparent /><OL t={0.003} /></mesh>
  {[0, 1, 2, 3].map((k) => <mesh key={k} position={[-0.055, 0.035 - k * 0.022, 0]} rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.009, 0.035, 4, 8]} /><meshToonMaterial color="#e8b98f" transparent /></mesh>)}
</group>;
