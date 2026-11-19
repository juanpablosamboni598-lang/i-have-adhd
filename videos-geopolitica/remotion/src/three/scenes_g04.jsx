// Escenas de ViceLeakss g04 (errores del día 1). Escenas genéricas: los textos vienen de escenas.json (campo p).
import React from 'react';
import { cl, tw, lerp, drop } from './kit.jsx';
import { C, Plate, Dust, PriceTag, Strike, Case, Console, PC, Clock, Disk, Shadow, txt } from './world_g02.jsx';
import { SG3 } from './scenes_g03.jsx';
import { TypeCard } from './scenes_g02.jsx';

const pop = (t, a, d = 0.32) => { const u = cl((t - a) / d); return u <= 0 ? 0 : u < 0.75 ? (u / 0.75) * 1.1 : 1.1 - 0.1 * ((u - 0.75) / 0.25); };
const P = (v) => Math.max(0.001, v);
const ORB = (d, c = [0, 0.5, 0], r = 2.6, y = 0.9, a0 = 0.35, a1 = -0.35) => [0, 0.33, 0.66, 1].map((u) => {
  const a = lerp(a0, a1, u); return [d * u, c[0] + Math.sin(a) * r, y + Math.sin(u * 3) * 0.1, c[2] + Math.cos(a) * r, c[0], c[1], c[2]];
});
const Card = ({ t, d, lines, paper }) => lines && lines.length ? <TypeCard t={t} at={d * 0.12} lines={lines} x={110} y={760} paper={paper} /> : null;
const Slot = ({ pos, s, on, k }) => s <= 0.01 ? null : <group position={pos} scale={s}>
  <mesh><boxGeometry args={[0.55, 0.16, 0.04]} /><meshBasicMaterial color={on ? C.lime : C.card2} /></mesh>
  <mesh position={[0, 0, 0.021]}><planeGeometry args={[0.5, 0.12]} /><meshBasicMaterial map={txt(`RANURA ${k + 1}`, { bg: on ? C.lime : C.card2, fg: on ? C.bg : C.text, w: 600, h: 140, size: 80 })} /></mesh>
</group>;

export const SG4 = {
  pantalla: ({ t, d, p }) => ({
    keys: ORB(d, [0, 0.45, 0], 2.0, 0.75, 0.9, -0.9),
    three: <><Shadow r={1} op={0.3} /><Dust t={t} n={70} />
      <group rotation={[0, Math.sin(t * 0.9) * 0.25, 0]} position={[0, Math.sin(t * 1.6) * 0.02, 0]}>
        <PC screen={Math.floor(t * 2) % 2 ? p.scr : ' '} fg={C.red} /></group>
      {Array.from({ length: 6 }).map((_, k) => { const u = ((t * 0.35 + k / 6) % 1); return <mesh key={k} position={[Math.cos(k * 1.05) * 0.9, 0.2 + u, Math.sin(k * 1.05) * 0.5 - 0.2]}><sphereGeometry args={[0.03, 12, 8]} /><meshBasicMaterial color={k % 2 ? C.red : C.lime} transparent opacity={Math.sin(u * Math.PI)} /></mesh>; })}</>,
    ov: <Card t={t} d={d} lines={p.lines} />,
  }),
  reloj: ({ t, d, p }) => ({
    keys: [[0, 0.5, 0.8, 2.1, 0, 0.75, 0], [d * 0.5, -0.5, 0.75, 1.9, 0, 0.75, 0], [d, 0.4, 0.85, 2.2, 0, 0.75, 0]],
    three: <><Dust t={t} n={60} /><Clock pos={[-0.25, 0.8, 0]} t={t} spin={2} s={P(pop(t, 0.2) * 1.4)} />
      <group position={[0.75, 0.4, 0.25]} rotation={[0, -0.3, 0]}><PriceTag text={p.tag} w={0.7} sc={pop(t, d * 0.25)} /></group></>,
    ov: <Card t={t} d={d} lines={p.lines} paper />,
  }),
  disco: ({ t, d, p }) => {
    const [a, b] = p.fill || [0.2, 0.9];
    return {
      keys: [[0, 0.6, 0.9, 2.5, 0, 0.6, 0], [d * 0.5, -0.6, 0.8, 2.3, 0, 0.6, 0], [d, 0.5, 0.95, 2.5, 0, 0.6, 0]],
      three: <><Dust t={t} n={60} /><Disk pos={[0, 0.95, 0]} fill={lerp(a, b, tw(t, 0.3, d * 0.75))} />
        <group position={[0, 0.45, 0.1]} rotation={[0, Math.sin(t * 0.8) * 0.2, 0]}><PriceTag text={p.tag} w={0.8} sc={pop(t, 0.3)} /></group></>,
      ov: <Card t={t} d={d} lines={p.lines} />,
    };
  },
  consola: ({ t, d, p }) => ({
    keys: ORB(d, [0, 0.4, 0], 2.1, 0.85, 1.0, -1.0),
    three: <><Plate r={1.1} /><Dust t={t} />
      <Console pos={[-0.4, (1 - drop(t, 0.2, 0.5)) * 1.5, 0]} kind="a" glow={p.strike === 'a' ? (Math.floor(t * 3) % 2) : 1} rotY={0.3} />
      <Console pos={[0.4, (1 - drop(t, 0.5, 0.5)) * 1.5, 0]} kind="b" color={C.dark} glow={p.strike === 'b' ? 0 : 1} rotY={-0.3} />
      {p.strike ? <Strike pos={[p.strike === 'a' ? -0.4 : 0.4, 0.4, 0.3]} len={0.7} u={tw(t, d * 0.4, d * 0.5)} rot={-0.5} /> : null}</>,
    ov: <Card t={t} d={d} lines={p.lines} />,
  }),
  ranuras: ({ t, d, p }) => {
    const on = Math.min(4, Math.floor(tw(t, d * 0.3, d * 0.8) * 5));
    return {
      keys: [[0, 0.5, 0.8, 2.3, 0, 0.6, 0], [d * 0.5, -0.5, 0.75, 2.1, 0, 0.6, 0], [d, 0.4, 0.85, 2.3, 0, 0.6, 0]],
      three: <><Dust t={t} n={60} />{[0, 1, 2, 3, 4].map((k) => <Slot key={k} k={k} pos={[Math.sin(t + k) * 0.03, 0.95 - k * 0.2, 0]} s={pop(t, 0.2 + k * 0.12)} on={k < on} />)}</>,
      ov: <Card t={t} d={d} lines={p.lines} paper />,
    };
  },
  caja: ({ t, d, p }) => ({
    keys: ORB(d, [0, 0.35, 0], 1.9, 0.7, -0.7, 0.7),
    three: <><Plate r={0.9} /><Dust t={t} />
      <Case pos={[0, 0, 0]} rot={[0, Math.sin(t * 0.8) * 0.3, 0]} label={p.label} s={P(pop(t, 0.2) * 1.3)} />
      {p.strike ? <Strike pos={[0, 0.42, 0.1]} len={0.7} u={tw(t, d * 0.35, d * 0.45)} rot={-0.4} th={0.05} /> : null}</>,
    ov: <Card t={t} d={d} lines={p.lines} />,
  }),
  spoilers: (a) => SG3.spoilers(a),
};
