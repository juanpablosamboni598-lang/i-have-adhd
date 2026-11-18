import React, { useMemo } from 'react';
import * as THREE from 'three';
import { OL, Part, cl, tw, lerp } from './kit.jsx';

// Short de objeto n.º 3: la cremallera (vertical 9:16, estilo dibujado v2).
export const C = { bg: '#f6e3c8', table: '#e9cfa6', fabric: '#3f6fb0', fabric2: '#345d96', tape: '#2b2f36', metal: '#c9ced3', brass: '#e2ae3a',
  red: '#e2483d', green: '#2bb36b', button: '#f2efe6', pencil: '#ffd23d', wood: '#f0c38a', graphite: '#3a3a40' };
const SP = 0.032;                     // paso entre dientes de un mismo lado
const NT = 34;                        // dientes por lado
const Y0 = 0.55;                      // primer diente (abajo)
export const ZIP = { SP, NT, Y0, TOP: Y0 + NT * SP };

export const Lights = () => <>
  <ambientLight intensity={0.85} />
  <directionalLight position={[-1.6, 2.6, 2.2]} intensity={1.9} castShadow shadow-mapSize={[1024, 1024]}
    shadow-camera-left={-1.5} shadow-camera-right={1.5} shadow-camera-top={2.5} shadow-camera-bottom={0} shadow-camera-near={0.5} shadow-camera-far={8} shadow-bias={-0.0015} />
</>;

// mesa / fondo
export const Desk = () => <group>
  <color attach="background" args={[C.bg]} />
  <mesh position={[0, 1.2, -0.12]} receiveShadow><planeGeometry args={[6, 4]} /><meshToonMaterial color={C.bg} transparent /></mesh>
</group>;

// diente: cuerpo + bolita arriba (lado izq/der)
const Tooth = ({ pos, rot = 0, col = C.metal, big = 1 }) => <group position={pos} rotation={[0, 0, rot]} scale={big}>
  <mesh castShadow><boxGeometry args={[0.03, 0.016, 0.012]} /><meshToonMaterial color={col} transparent /><OL t={0.0025} /></mesh>
  <mesh position={[0, 0.007, 0]}><sphereGeometry args={[0.005, 10, 8]} /><meshToonMaterial color={col} transparent /></mesh>
</group>;

// abertura: cuánto se separa cada lado (en x) para un diente a la altura y, con el carro en ys
const sep = (y, ys, open) => open * Math.max(0, (y - ys)) * 0.55 + (y > ys ? 0.004 : 0);

// la cremallera completa. ys = altura del carro (fracción 0–1 a lo largo), open = cuánto se abre arriba del carro
export const Zipper = ({ t = 0, ys = 0, open = 1, slider = 1, xr = 0, teeth = 1, twisted = -1, pencil = -1, stops = 1, fabric = 1, bottomBox = 1, offTop = 0, gap = 0 }) => {
  const yS = Y0 + ys * NT * SP;
  const L = [], R = [];
  for (let k = 0; k < NT; k++) {
    if (k / NT > teeth) break;
    const yl = Y0 + k * SP, yr = Y0 + k * SP + SP / 2;
    const sl = sep(yl, yS, open) + (gap && yl > yS - 0.25 && yl < yS ? gap * 0.03 : 0);
    const sr = sep(yr, yS, open) + (gap && yr > yS - 0.25 && yr < yS ? gap * 0.03 : 0);
    const tw_ = k === twisted ? 0.6 : 0;
    L.push(<Tooth key={'l' + k} pos={[-0.009 - sl, yl, 0]} rot={tw_} col={k === twisted ? C.red : C.metal} />);
    R.push(<Tooth key={'r' + k} pos={[0.009 + sr, yr, 0]} col={C.metal} />);
  }
  const ang = Math.atan(open * 0.55);
  return <group>
    {/* cinta y tela de cada lado (se abren en V arriba del carro) */}
    {[-1, 1].map((s) => <group key={s}>
      <mesh position={[s * 0.035, (Y0 + yS) / 2 - 0.02, -0.004]}><boxGeometry args={[0.04, Math.max(0.01, yS - Y0 + 0.06), 0.004]} /><meshToonMaterial color={C.tape} transparent /></mesh>
      {fabric ? <mesh position={[s * 0.25, (Y0 + yS) / 2 - 0.02, -0.006]} receiveShadow><boxGeometry args={[0.38, Math.max(0.01, yS - Y0 + 0.06), 0.006]} /><meshToonMaterial color={s < 0 ? C.fabric : C.fabric2} transparent /><OL t={0.004} /></mesh> : null}
      <group position={[0, yS, 0]} rotation={[0, 0, -s * ang]}>
        <mesh position={[s * 0.035, (ZIP.TOP - yS) / 2 + 0.02, -0.004]}><boxGeometry args={[0.04, Math.max(0.01, ZIP.TOP - yS + 0.04), 0.004]} /><meshToonMaterial color={C.tape} transparent /></mesh>
        {fabric ? <mesh position={[s * 0.25, (ZIP.TOP - yS) / 2 + 0.02, -0.006]} receiveShadow><boxGeometry args={[0.38, Math.max(0.01, ZIP.TOP - yS + 0.04), 0.006]} /><meshToonMaterial color={s < 0 ? C.fabric : C.fabric2} transparent /><OL t={0.004} /></mesh> : null}
      </group>
    </group>)}
    {L}{R}
    {/* topes arriba y cajita con pin abajo */}
    {stops ? <group>
      {[-1, 1].map((s) => <mesh key={s} position={[s * (0.012 + sep(ZIP.TOP, yS, open)), ZIP.TOP + 0.01, 0.002]}><boxGeometry args={[0.02, 0.012, 0.014]} /><meshToonMaterial color={C.brass} transparent /><OL t={0.0025} /></mesh>)}
    </group> : null}
    {bottomBox ? <mesh position={[0, Y0 - 0.03, 0.002]}><boxGeometry args={[0.05, 0.03, 0.016]} /><meshToonMaterial color={C.brass} transparent /><OL t={0.003} /></mesh> : null}
    {/* carro (deslizador) en forma de Y */}
    {slider ? <group position={[0, yS + 0.035 + offTop * 0.25, 0.012]} rotation={[0, 0, offTop * 0.8]}>
      <mesh castShadow><boxGeometry args={[0.07, 0.09, 0.02]} /><meshToonMaterial color={C.metal} transparent opacity={1 - 0.8 * xr} depthWrite={xr < 0.5} />{xr < 0.5 ? <OL t={0.004} /> : null}</mesh>
      {xr > 0.3 ? <group position={[0, 0, 0.012]}>
        {/* canales en Y y cuñita central */}
        {[-1, 1].map((s) => <mesh key={s} position={[s * 0.018, 0.022, 0]} rotation={[0, 0, s * 0.35]}><boxGeometry args={[0.012, 0.05, 0.004]} /><meshBasicMaterial color={C.red} transparent /></mesh>)}
        <mesh position={[0, -0.022, 0]}><boxGeometry args={[0.014, 0.04, 0.004]} /><meshBasicMaterial color={C.red} transparent /></mesh>
        <mesh position={[0, 0.03, 0.001]} rotation={[0, 0, Math.PI / 4]}><boxGeometry args={[0.016, 0.016, 0.004]} /><meshBasicMaterial color={C.green} transparent /></mesh>
      </group> : null}
      {/* jalador */}
      <group position={[0, -0.03, 0.016]} rotation={[0.5 + Math.sin(t * 2) * 0.1, 0, 0]}>
        <mesh position={[0, -0.04, 0]}><boxGeometry args={[0.03, 0.08, 0.006]} /><meshToonMaterial color={C.metal} transparent /><OL t={0.003} /></mesh>
      </group>
    </group> : null}
    {/* lápiz que pasa por los dientes */}
    {pencil >= 0 ? <group position={[0.05, Y0 + pencil * NT * SP, 0.03]} rotation={[0, 0, -0.9]}>
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.012, 0.012, 0.22, 6]} /><meshToonMaterial color={C.pencil} transparent /><OL t={0.003} /></mesh>
      <mesh position={[0, -0.005, 0]}><coneGeometry args={[0.012, 0.03, 6]} /><meshToonMaterial color={C.wood} transparent /><OL t={0.003} /></mesh>
      <mesh position={[0, -0.024, 0]}><coneGeometry args={[0.004, 0.01, 6]} /><meshToonMaterial color={C.graphite} transparent /></mesh>
    </group> : null}
  </group>;
};

// chaqueta abierta con botones (escenas del principio)
export const Buttons = ({ n = 0, t = 0 }) => <group>
  {Array.from({ length: 5 }).map((_, k) => k < n ? <group key={k} position={[0.02, Y0 + 0.1 + k * 0.2, 0.01]}>
    <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.01, 24]} /><meshToonMaterial color={C.button} transparent /><OL t={0.003} /></mesh>
    {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], j) => <mesh key={j} position={[a * 0.008, b * 0.008, 0.006]}><circleGeometry args={[0.003, 8]} /><meshBasicMaterial color="#8a8070" transparent /></mesh>)}
  </group> : null)}
</group>;

// viento (líneas que pasan)
export const Wind = ({ t, on = 1 }) => on ? <group>{Array.from({ length: 10 }).map((_, k) => {
  const u = (t * 0.8 + k * 0.1) % 1;
  return <mesh key={k} position={[lerp(-0.8, 0.8, u), Y0 + 0.15 + (k % 5) * 0.2, 0.2 - (k % 3) * 0.1]}><boxGeometry args={[0.18, 0.004, 0.004]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.9 * Math.sin(u * Math.PI)} /></mesh>;
})}</group> : null;
