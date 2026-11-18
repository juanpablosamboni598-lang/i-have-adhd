import React, { useMemo } from 'react';
import * as THREE from 'three';
import { OL, Part, cl, tw, lerp } from './kit.jsx';

// Video propio de Facebook n.º 2: la ducha eléctrica (vertical 9:16, estilo dibujado v2).
export const C = { wall: '#d8efe6', grout: '#a9cfc0', white: '#f5f5f2', metal: '#b9c3ca', dark: '#2b2f36', rubber: '#3a3a42', brass: '#e2ae3a',
  water: '#7cc4ef', hot: '#ff8a3d', red: '#e2483d', green: '#2bb36b', copper: '#c8743a', panel: '#cfd3d6' };
const BY = 1.75, BZ = -0.12;           // centro del cuerpo de la ducha
const HEADY = 1.575;                   // regadera
export const POS = { BY, BZ, HEADY };

export const Lights = () => <>
  <ambientLight intensity={0.8} />
  <directionalLight position={[-1.8, 3.2, 2.4]} intensity={2.0} castShadow shadow-mapSize={[1024, 1024]}
    shadow-camera-left={-1.5} shadow-camera-right={1.5} shadow-camera-top={3} shadow-camera-bottom={0} shadow-camera-near={0.5} shadow-camera-far={8} shadow-bias={-0.0015} />
</>;

// baño: pared de azulejos, llave en la pared y piso
export const Bath = ({ tap = 0 }) => <group>
  <color attach="background" args={[C.wall]} />
  <mesh position={[0, 1.6, -0.26]} receiveShadow><planeGeometry args={[6, 4]} /><meshToonMaterial color={C.wall} transparent /></mesh>
  {Array.from({ length: 21 }).map((_, k) => <mesh key={'h' + k} position={[0, 0.2 + k * 0.15, -0.255]}><boxGeometry args={[6, 0.006, 0.002]} /><meshBasicMaterial color={C.grout} transparent /></mesh>)}
  {Array.from({ length: 31 }).map((_, k) => <mesh key={'v' + k} position={[-2.25 + k * 0.15, 1.6, -0.255]}><boxGeometry args={[0.006, 4, 0.002]} /><meshBasicMaterial color={C.grout} transparent /></mesh>)}
  <mesh position={[0, 0.55, 0.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[6, 2]} /><meshToonMaterial color="#e9eef0" transparent /></mesh>
  {/* llave de paso */}
  <group position={[0.34, 1.22, -0.25]}>
    <Part geo={<cylinderGeometry args={[0.045, 0.05, 0.02, 32]} />} color={C.metal} rot={[Math.PI / 2, 0, 0]} pos={[0, 0, 0.01]} t={0.004} />
    <group position={[0, 0, 0.04]} rotation={[0, 0, -tap * Math.PI * 0.75]}>
      <Part geo={<boxGeometry args={[0.11, 0.025, 0.025]} />} color={C.metal} t={0.004} />
      <Part geo={<cylinderGeometry args={[0.018, 0.018, 0.04, 16]} />} color={C.metal} rot={[Math.PI / 2, 0, 0]} t={0.004} />
    </group>
    <Part geo={<cylinderGeometry args={[0.012, 0.012, 0.6, 12]} />} color={C.metal} pos={[0, 0.32, 0.0]} t={0.004} />
  </group>
</group>;

// alambre en espiral (dos tramos)
const helix = (y0, y1, turns, r) => {
  const pts = []; const n = turns * 24;
  for (let i = 0; i <= n; i++) { const a = (i / 24) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * r, lerp(y0, y1, i / n), Math.sin(a) * r)); }
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), n * 2, 0.006, 6, false);
};

// gotas de agua que caen de la regadera (determinista)
const Drops = ({ t, flow, warm = 0, n = 70 }) => {
  if (flow <= 0.02) return null;
  const col = new THREE.Color(C.water).lerp(new THREE.Color('#ffd2b0'), warm * 0.5);
  return <group>{Array.from({ length: Math.round(n * flow) }).map((_, k) => {
    const a = (k * 2.399) % (Math.PI * 2), r = 0.02 + ((k * 0.61803) % 1) * 0.085;
    const u = (t * 1.7 + k * 0.137) % 1; const y = HEADY - 0.02 - u * u * 1.0;
    return <mesh key={k} position={[Math.cos(a) * r * (1 + u * 0.6), y, BZ + Math.sin(a) * r * (1 + u * 0.6)]}><cylinderGeometry args={[0.004, 0.004, 0.035 + u * 0.03, 5]} /><meshBasicMaterial color={col} transparent opacity={0.85} /></mesh>;
  })}</group>;
};

// vapor o humo
const Puffs = ({ t, y, col, n = 8, spread = 0.12, rise = 0.35, op = 0.5 }) => <group>{Array.from({ length: n }).map((_, k) => {
  const u = (t * 0.6 + k / n) % 1, x = Math.sin(k * 3.1 + t) * spread;
  return <mesh key={k} position={[x, y + u * rise, BZ + Math.cos(k * 1.7) * 0.05]} scale={0.03 + u * 0.05}><sphereGeometry args={[1, 10, 8]} /><meshToonMaterial color={col} transparent opacity={op * (1 - u)} depthWrite={false} /></mesh>;
})}</group>;

// chispas (zigzag)
const Sparks = ({ t, at, n = 6, col = C.red, r = 0.15 }) => <group position={at}>{Array.from({ length: n }).map((_, k) => {
  const a = k / n * Math.PI * 2 + t * 3; const on = Math.sin(t * 25 + k * 2) > 0;
  return on ? <mesh key={k} position={[Math.cos(a) * r, Math.sin(a * 1.3) * 0.05, Math.sin(a) * r * 0.5]} rotation={[0, 0, a]}><boxGeometry args={[0.05, 0.008, 0.008]} /><meshBasicMaterial color={col} transparent /></mesh> : null;
})}</group>;

// cable recto entre dos puntos
const Wire = ({ a, b, r = 0.009, col = C.dark }) => {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), mid = A.clone().add(B).multiplyScalar(0.5), dir = B.clone().sub(A);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  return <mesh position={mid} quaternion={q}><cylinderGeometry args={[r, r, dir.length(), 10]} /><meshToonMaterial color={col} transparent /><OL t={0.003} /></mesh>;
};

// medidor de vidrio con líquido (temperatura del agua, 0–1)
export const Gauge = ({ v = 0, pos = [-0.24, 1.5, -0.12] }) => {
  const col = v < 0.5 ? new THREE.Color('#5aa9e6').lerp(new THREE.Color('#ffb02e'), cl(v * 2)) : new THREE.Color('#ffb02e').lerp(new THREE.Color(C.red), cl(v * 2 - 1));
  return <group position={pos}>
    <mesh><cylinderGeometry args={[0.035, 0.035, 0.32, 24, 1, true]} /><meshToonMaterial color="#ffffff" transparent opacity={0.35} depthWrite={false} side={THREE.DoubleSide} /><OL t={0.004} /></mesh>
    <mesh position={[0, -0.16 + 0.155 * cl(v), 0]}><cylinderGeometry args={[0.03, 0.03, 0.31 * Math.max(0.03, cl(v)), 24]} /><meshToonMaterial color={col} transparent /></mesh>
    <mesh position={[0, -0.175, 0]}><sphereGeometry args={[0.04, 16, 12]} /><meshToonMaterial color={col} transparent /><OL t={0.004} /></mesh>
  </group>;
};

// la ducha eléctrica
export const Shower = ({ t = 0, xr = 0, coil = 0, heat = 0, mode = 'inv', burn = 0, flow = 0, warm = 0, lift = 0, knob = 0,
  ground = 0, leak = 0, panel = 1, lever = 1, cable = 1, steam = 0 }) => {
  const hA = useMemo(() => helix(BY - 0.085, BY - 0.005, 4, 0.048), []);
  const hB = useMemo(() => helix(BY + 0.005, BY + 0.06, 3, 0.048), []);
  const glowA = heat * (mode === 'inv' || mode === 'all' ? 1 : 0.15), glowB = heat * (mode === 'ver' || mode === 'inv' || mode === 'all' ? 1 : 0.15);
  const cw = (g) => new THREE.Color(C.copper).lerp(new THREE.Color(burn > 0.5 ? '#3a1d10' : '#ff5a1f'), cl(g + burn * 0.5));
  const op = 1 - 0.85 * xr;
  return <group>
    {/* tubo de entrada desde la pared */}
    <Part geo={<cylinderGeometry args={[0.018, 0.018, 0.22, 16]} />} color={C.metal} pos={[0, BY + 0.26, BZ]} t={0.005} />
    <Part geo={<cylinderGeometry args={[0.018, 0.018, 0.15, 16]} />} color={C.metal} pos={[0, BY + 0.36, BZ - 0.07]} rot={[Math.PI / 2, 0, 0]} t={0.005} />
    {/* cuerpo (carcasa) */}
    <mesh position={[0, BY, BZ]} castShadow={xr < 0.3}><boxGeometry args={[0.26, 0.3, 0.15]} /><meshToonMaterial color={C.white} transparent opacity={op} depthWrite={xr < 0.5} />{xr < 0.6 ? <OL t={0.008} /> : null}</mesh>
    {/* perilla invierno / verano */}
    <group position={[0.075, BY + 0.06, BZ + 0.078]} rotation={[0, 0, -knob]}>
      <Part geo={<cylinderGeometry args={[0.03, 0.032, 0.02, 32]} />} color={C.dark} rot={[Math.PI / 2, 0, 0]} t={0.004} />
      <mesh position={[0, 0.017, 0.011]}><boxGeometry args={[0.006, 0.022, 0.003]} /><meshBasicMaterial color="#ffffff" transparent /></mesh>
    </group>
    <mesh position={[0.04, BY + 0.098, BZ + 0.076]}><circleGeometry args={[0.008, 16]} /><meshBasicMaterial color="#3d7ee0" transparent /></mesh>
    <mesh position={[0.11, BY + 0.098, BZ + 0.076]}><circleGeometry args={[0.008, 16]} /><meshBasicMaterial color={C.red} transparent /></mesh>
    {/* regadera */}
    <Part geo={<cylinderGeometry args={[0.03, 0.04, 0.06, 24]} />} color={C.white} pos={[0, BY - 0.18, BZ]} t={0.005} />
    <Part geo={<cylinderGeometry args={[0.12, 0.1, 0.03, 48]} />} color={C.white} pos={[0, HEADY, BZ]} t={0.006} />
    {Array.from({ length: 24 }).map((_, k) => { const a = k * 2.399, r = 0.02 + (k % 6) * 0.015; return <mesh key={k} position={[Math.cos(a) * r, HEADY - 0.016, BZ + Math.sin(a) * r]} rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[0.005, 8]} /><meshBasicMaterial color="#8a949b" transparent side={THREE.DoubleSide} /></mesh>; })}
    {/* interior: cámara de agua, resistencia, diafragma y contactos */}
    {xr > 0.3 ? <group position={[0, 0, BZ]}>
      <mesh position={[0, BY - 0.02, 0]}><cylinderGeometry args={[0.065, 0.065, 0.2, 32, 1, true]} /><meshToonMaterial color="#ffffff" transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} /><OL t={0.003} /></mesh>
      {flow > 0.05 ? <mesh position={[0, BY - 0.03, 0]}><cylinderGeometry args={[0.06, 0.06, 0.17 * cl(flow * 1.5), 32]} /><meshToonMaterial color={new THREE.Color(C.water).lerp(new THREE.Color('#ffc59a'), warm * 0.6)} transparent opacity={0.45} depthWrite={false} /></mesh> : null}
      {coil > 0 ? <group scale={[1, cl(coil), 1]} position={[0, (1 - cl(coil)) * BY, 0]}>
        <mesh geometry={hA}><meshToonMaterial color={cw(glowA)} emissive={new THREE.Color('#ff3a00')} emissiveIntensity={glowA * 0.6} transparent /></mesh>
        <mesh geometry={hB}><meshToonMaterial color={cw(glowB)} emissive={new THREE.Color('#ff3a00')} emissiveIntensity={glowB * 0.6} transparent /></mesh>
      </group> : null}
      {/* diafragma de caucho y puente de contacto */}
      <mesh position={[0, BY + 0.09 + lift * 0.022, 0]}><cylinderGeometry args={[0.06, 0.06, 0.012, 32]} /><meshToonMaterial color={C.rubber} transparent /><OL t={0.003} /></mesh>
      <mesh position={[0, BY + 0.105 + lift * 0.022, 0]}><boxGeometry args={[0.1, 0.008, 0.02]} /><meshToonMaterial color={C.brass} transparent /><OL t={0.003} /></mesh>
      {[-1, 1].map((s) => <mesh key={s} position={[s * 0.045, BY + 0.132, 0]}><boxGeometry args={[0.03, 0.01, 0.022]} /><meshToonMaterial color={C.brass} transparent /><OL t={0.003} /></mesh>)}
      {lift > 0.95 && heat > 0.05 ? <Sparks t={t} at={[0, BY + 0.128, 0]} n={4} r={0.03} col="#ffd23d" /> : null}
    </group> : null}
    {/* agua, vapor, humo */}
    <Drops t={t} flow={flow} warm={warm} />
    {steam > 0 ? <Puffs t={t} y={HEADY - 0.45} col="#ffffff" op={0.35 * steam} spread={0.15} rise={0.4} /> : null}
    {burn > 0 ? <Puffs t={t} y={BY + 0.12} col="#4a4a4a" op={0.6 * burn} spread={0.06} rise={0.45} n={10} /> : null}
    {leak > 0 ? <Sparks t={t} at={[0, HEADY - 0.05, BZ]} n={8} r={0.16} /> : null}
    {/* cable de luz al breaker */}
    {cable ? <Wire a={[0.1, BY + 0.15, BZ - 0.04]} b={[0.42, 2.09, -0.235]} /> : null}
    {/* breaker en la pared */}
    {panel > 0 ? <group position={[0.42, 2.2, -0.24]} scale={cl(panel)}>
      <Part geo={<boxGeometry args={[0.16, 0.22, 0.04]} />} color={C.panel} t={0.005} />
      <Part geo={<boxGeometry args={[0.05, 0.1, 0.02]} />} color="#f2f2f2" pos={[0, 0, 0.03]} t={0.003} />
      <group position={[0, 0, 0.045]} rotation={[lever > 0.5 ? -0.5 : 0.5, 0, 0]}><Part geo={<boxGeometry args={[0.025, 0.045, 0.02]} />} color={lever > 0.5 ? C.green : C.red} pos={[0, 0.015, 0]} t={0.003} /></group>
    </group> : null}
    {/* polo a tierra: cable verde a la pared */}
    {ground > 0 ? <group>
      <mesh position={[-0.22, BY + 0.02, BZ - 0.06]} rotation={[0, 0, Math.PI / 2 - 0.15]} scale={[1, cl(ground), 1]}><cylinderGeometry args={[0.008, 0.008, 0.22, 10]} /><meshToonMaterial color={C.green} transparent /><OL t={0.003} /></mesh>
      {ground > 0.95 ? <group position={[-0.34, BY + 0.04, -0.245]}>
        <Part geo={<boxGeometry args={[0.07, 0.07, 0.012]} />} color="#f2f2f2" t={0.003} />
        {[0, 1, 2].map((k) => <mesh key={k} position={[0, -0.005 - k * 0.012, 0.008]}><boxGeometry args={[0.04 - k * 0.012, 0.005, 0.002]} /><meshBasicMaterial color={C.green} transparent /></mesh>)}
      </group> : null}
    </group> : null}
  </group>;
};
