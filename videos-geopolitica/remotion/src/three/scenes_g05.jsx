// Escenas de ViceLeakss g05 (99 en Metacritic + guía de la primera hora). Genéricas: los textos vienen de escenas.json (campo p).
import React from 'react';
import { cl, tw, lerp, drop } from './kit.jsx';
import { C, txt, Plate, Dust, PriceTag, Strike, Coins, Sign, Land, Pawn, Clock, PC, Shadow } from './world_g02.jsx';
import { Odo, TypeCard } from './scenes_g02.jsx';
import { SG4 } from './scenes_g04.jsx';

const pop = (t, a, d = 0.32) => { const u = cl((t - a) / d); return u <= 0 ? 0 : u < 0.75 ? (u / 0.75) * 1.1 : 1.1 - 0.1 * ((u - 0.75) / 0.25); };
const P = (v) => Math.max(0.001, v);
const K = (c) => C[c] || c || C.text;
const ORB = (d, c = [0, 0.5, 0], r = 2.6, y = 0.9, a0 = 0.35, a1 = -0.35) => [0, 0.33, 0.66, 1].map((u) => {
  const a = lerp(a0, a1, u); return [d * u, c[0] + Math.sin(a) * r, y + Math.sin(u * 3) * 0.1, c[2] + Math.cos(a) * r, c[0], c[1], c[2]];
});
const Card = ({ t, d, lines, paper, x = 110, y = 760 }) => lines && lines.length ? <TypeCard t={t} at={d * 0.12} lines={lines} x={x} y={y} paper={paper} /> : null;
const Label = ({ pos, s, col = C.text, w = 0.9, h = 0.2, sc = 1, size = 110 }) => sc <= 0.01 ? null : <mesh position={pos} scale={sc}>
  <planeGeometry args={[w, h]} /><meshBasicMaterial map={txt(s, { bg: null, fg: col, w: Math.round(w * 640), h: Math.round(h * 640), size: Math.min(size, Math.round(w * 640 * 1.5 / Math.max(1, String(s).length))) })} transparent /></mesh>;
const Bars = ({ t, items, at = 0, maxv, unit = '', base = 0, gap = 0.8 }) => <group>
  {items.map(([label, v, col], k) => {
    const u = tw(t, at + k * 0.5, at + k * 0.5 + 0.9); const h = 1.0 * Math.max(0, v - base) / (maxv - base) * u + 0.02; const x = (k - (items.length - 1) / 2) * gap;
    const shown = v % 1 ? (v * u).toFixed(1) : Math.round(v * u);
    return <group key={k} position={[x, 0, 0]}>
      <mesh position={[0, h / 2, 0]}><boxGeometry args={[0.38, h, 0.38]} /><meshBasicMaterial color={K(col)} /></mesh>
      <Label pos={[0, h + 0.15, 0.2]} s={`${shown}${unit}`} col={K(col)} w={0.7} h={0.18} sc={u > 0.05 ? 1 : 0} />
      <Label pos={[0, -0.13, 0.25]} s={label} w={0.75} h={0.16} size={80} />
      <Shadow r={0.3} />
    </group>;
  })}
</group>;
const Tile = ({ pos, s, text, col, on = 1 }) => s <= 0.01 ? null : <group position={pos} scale={s}>
  <mesh><boxGeometry args={[0.9, 0.17, 0.04]} /><meshBasicMaterial color={on ? K(col) : C.card2} /></mesh>
  <mesh position={[0, 0, 0.021]}><planeGeometry args={[0.86, 0.13]} /><meshBasicMaterial map={txt(text, { bg: on ? K(col) : C.card2, fg: col === 'gray' || col === 'red' || !on ? C.text : C.bg, w: 900, h: 136, size: Math.min(86, Math.round(1500 / Math.max(4, text.length))) })} /></mesh>
</group>;
const Phone = ({ pos, s = 1, text = '', fg = C.lime, rot = [0, 0, 0] }) => s <= 0.01 ? null : <group position={pos} rotation={rot} scale={s}>
  <mesh><boxGeometry args={[0.34, 0.62, 0.04]} /><meshBasicMaterial color={C.dark} /></mesh>
  <mesh position={[0, 0, 0.021]}><planeGeometry args={[0.3, 0.54]} /><meshBasicMaterial map={txt(text, { bg: '#11141c', fg, w: 300, h: 540, size: Math.min(90, Math.round(420 / Math.max(3, text.length))) })} /></mesh>
</group>;
const Star = ({ pos, s, on, t }) => s <= 0.01 ? null : <mesh position={pos} scale={s} rotation={[0, t * 1.5, Math.PI / 4]}>
  <octahedronGeometry args={[0.11, 0]} /><meshBasicMaterial color={on ? (Math.floor(t * 4) % 2 ? C.red : C.blue) : C.card2} /></mesh>;

export const SG5 = {
  ...SG4,
  // pantalla con más vida: texto fijo que late, chispas grandes que suben y orbitan
  pantalla: ({ t, d, p }) => ({
    keys: ORB(d, [0, 0.45, 0], 2.0, 0.75, 0.9, -0.9),
    three: <><Shadow r={1} op={0.3} /><Dust t={t} n={70} />
      <group rotation={[0, Math.sin(t * 0.9) * 0.25, 0]} position={[0, Math.sin(t * 1.6) * 0.02, 0]} scale={1 + Math.sin(t * 2.3) * 0.04}>
        <PC screen={Math.sin(t * 5.3) > -0.85 ? p.scr : ' '} fg={C.red} /></group>
      {Array.from({ length: 10 }).map((_, k) => { const u = ((t * 0.27 + k / 10) % 1); const a = k * 0.63 + t * 0.6; return <mesh key={k} position={[Math.cos(a) * 1.0, 0.1 + u * 1.2, Math.sin(a) * 0.6 - 0.1]}><sphereGeometry args={[0.05, 12, 8]} /><meshBasicMaterial color={k % 2 ? C.red : C.lime} transparent opacity={Math.sin(u * Math.PI)} /></mesh>; })}</>,
    ov: <Card t={t} d={d} lines={p.lines} />,
  }),
  // consola: la misma de g04 más chispas que orbitan, para que no quede oscura y quieta
  consola: (a) => { const s = SG4.consola(a), t = a.t;
    return { ...s, three: <>{s.three}{Array.from({ length: 10 }).map((_, k) => { const u = ((t * 0.27 + k / 10) % 1); const g = k * 0.63 + t * 0.6; return <mesh key={`s${k}`} position={[Math.cos(g) * 1.0, 0.1 + u * 1.1, Math.sin(g) * 0.6]}><sphereGeometry args={[0.05, 12, 8]} /><meshBasicMaterial color={k % 2 ? C.red : C.lime} transparent opacity={Math.sin(u * Math.PI)} /></mesh>; })}</> }; },
  nota: ({ t, d, p }) => ({
    keys: ORB(d, [0, 0.5, 0], 2.9, 0.75, 0.6, -0.6),
    three: <><Plate r={1.0} /><Dust t={t} n={70} />
      <group rotation={[0, Math.sin(t * 0.7) * 0.25, 0]}><Sign pos={[0, 0, 0]} text={p.tag} color={C.lime} fg={C.bg} sc={pop(t, 0.2) * 1.05} /></group>
      <Coins pos={[-0.75, 0, 0.25]} n={7} t={t} at={0.6} color={C.lime} /><Coins pos={[0.75, 0, 0.25]} n={7} t={t} at={0.9} color={C.gold} /></>,
    ov: <><Odo t={t} at={d * 0.15} dur={d * 0.35} from={0} to={p.to || 0} digits={p.digits || 2} suffix={p.suffix || ''} x={960} y={840} size={86} color={C.lime} />
      <Card t={t} d={d} lines={p.lines} x={110} y={190} paper /></>,
  }),
  barras: ({ t, d, p }) => ({
    keys: [[0, -0.7, 0.75, 3.3, 0, 0.5, 0], [d * 0.5, 0.1, 0.85, 3.1, 0, 0.5, 0], [d, 0.8, 0.8, 3.3, 0, 0.5, 0]],
    three: <><Dust t={t} n={70} /><Bars t={t} at={0.3} items={p.items} maxv={p.maxv} unit={p.unit} base={p.base || 0} gap={p.items.length > 2 ? 0.8 : 1.0} /></>,
    ov: <Card t={t} d={d} lines={p.lines} />,
  }),
  lista: ({ t, d, p }) => {
    const n = p.items.length, step = Math.min(0.24, 1.1 / n);
    return {
      keys: [[0, 0.5, 0.8, 2.4, 0, 0.6, 0], [d * 0.5, -0.5, 0.75, 2.2, 0, 0.6, 0], [d, 0.4, 0.85, 2.4, 0, 0.6, 0]],
      three: <><Dust t={t} n={60} />{p.items.map(([text, col], k) => <Tile key={k} text={text} col={col} pos={[Math.sin(t + k) * 0.03, 0.5 + (n - 1) * step / 2 - k * step, 0]} s={pop(t, 0.3 + k * Math.min(0.6, d * 0.6 / n))} />)}</>,
      ov: <Card t={t} d={d} lines={p.lines} paper />,
    };
  },
  etiqueta: ({ t, d, p }) => ({
    keys: ORB(d, [0, 0.5, 0], 2.2, 0.8, -0.6, 0.6),
    three: <><Plate r={1.0} /><Dust t={t} />
      <group position={[0, 0.55, 0]} rotation={[0, Math.sin(t * 0.9) * 0.3, Math.sin(t * 1.3) * 0.05]}><PriceTag text={p.tag} color={K(p.color)} w={0.85} sc={pop(t, 0.25) * 1.2} /></group>
      <Coins pos={[-0.6, 0, 0.2]} n={6} t={t} at={d * 0.4} color={C.lime} /><Clock pos={[0.9, 0.7, -0.4]} t={t} spin={2} s={P(pop(t, d * 0.3) * 0.5)} /></>,
    ov: <Card t={t} d={d} lines={p.lines} />,
  }),
  mapa: ({ t, d, p }) => ({
    keys: [[0, 0.8, 2.9, 2.4, 0, -0.1, 0], [d * 0.5, -0.6, 2.6, 2.5, 0, -0.05, 0], [d, 0.5, 2.5, 2.6, 0, 0, 0]],
    three: <><Land t={t} rise={1} /><Dust t={t} />
      {p.pins.map(([n, col], k) => { const XZ = [[0.25, 0.45], [0.1, 0.95], [-0.2, 0.15], [-0.7, -0.4], [0.3, -0.5], [-0.3, -0.75]][k % 6]; const at = 0.3 + k * Math.min(0.9, d * 0.7 / p.pins.length);
        return <group key={k} position={[XZ[0], 0.1, XZ[1]]}>
          <mesh position={[0, 0.12 + Math.sin(t * 2 + k) * 0.02, 0]} scale={P(pop(t, at))}><sphereGeometry args={[0.06, 20, 14]} /><meshBasicMaterial color={K(col)} /></mesh>
          <Label pos={[0, 0.32, 0]} s={n} col={K(col)} w={0.9} h={0.18} sc={pop(t, at + 0.15)} />
        </group>; })}</>,
  }),
  estrellas: ({ t, d, p }) => {
    const n = p.n || 5, on = Math.floor(tw(t, d * 0.2, d * 0.7) * (n + 0.99));
    return {
      keys: ORB(d, [0, 0.5, 0], 2.2, 0.8, 0.7, -0.7),
      three: <><Plate r={1.0} /><Dust t={t} />
        <Pawn pos={[0, 0, 0.1]} color={C.gray} t={t} s={P(1.2 * pop(t, 0.2))} hop={1} />
        {Array.from({ length: n }).map((_, k) => <Star key={k} t={t} pos={[(k - (n - 1) / 2) * 0.3, 1.0 + Math.sin(t * 2 + k) * 0.03, 0]} s={pop(t, 0.3 + k * 0.12)} on={k < on} />)}</>,
      ov: <Card t={t} d={d} lines={p.lines} />,
    };
  },
  fps: ({ t, d, p }) => ({
    keys: ORB(d, [0, 0.45, 0], 2.7, 0.8, 0.6, -0.6),
    three: <><Shadow r={1} op={0.3} /><Dust t={t} n={60} />
      <group rotation={[0, Math.sin(t * 0.8) * 0.2, 0]}><PC screen={Math.floor(t * 2) % 2 ? p.b : ' '} fg={C.red} /></group>
      <group position={[-0.85, 0.6, 0.2]} rotation={[0, 0.3, 0]}><PriceTag text={`${p.a} FPS`} color={C.gray} fg={C.text} w={0.7} sc={pop(t, 0.3)} />
        <Strike pos={[0, 0, 0.04]} len={0.8} u={tw(t, d * 0.35, d * 0.5)} rot={-0.15} /></group>
      <group position={[0.85, 0.3, 0.2]} rotation={[0, -0.3, 0]}><PriceTag text={`${p.b} FPS`} color={C.red} fg={C.text} w={0.7} sc={pop(t, d * 0.25)} /></group></>,
    ov: <Card t={t} d={d} lines={p.lines} />,
  }),
  balanza: ({ t, d, p }) => {
    const tilt = Math.sin(t * 1.2) * 0.18 * (1 - tw(t, d * 0.75, d)) + 0.04;
    return {
      keys: ORB(d, [0, 0.6, 0], 2.4, 0.85, -0.5, 0.5),
      three: <><Plate r={1.0} /><Dust t={t} />
        <mesh position={[0, 0.45, 0]}><boxGeometry args={[0.06, 0.9, 0.06]} /><meshBasicMaterial color={C.gray} /></mesh>
        <group position={[0, 0.92, 0]} rotation={[0, 0, tilt]} scale={P(pop(t, 0.2))}>
          <mesh><boxGeometry args={[1.8, 0.04, 0.06]} /><meshBasicMaterial color={C.text} /></mesh>
          <group position={[-0.8, -0.05, 0]} rotation={[0, 0, -tilt]}><PriceTag text={p.a} color={C.lime} w={0.6} sc={pop(t, 0.4)} pos={[0, -0.15, 0]} /></group>
          <group position={[0.8, -0.05, 0]} rotation={[0, 0, -tilt]}><PriceTag text={p.b} color={C.red} fg={C.text} w={0.6} sc={pop(t, d * 0.4)} pos={[0, -0.15, 0]} /></group>
        </group></>,
    };
  },
  duo: ({ t, d, p }) => ({
    keys: ORB(d, [0, 0.35, 0], 1.9, 0.7, 0.6, -0.6),
    three: <><Plate r={0.9} /><Dust t={t} />
      <Pawn pos={[-0.3, 0, 0]} color={C.red} t={t} s={P(1.3 * pop(t, 0.3))} hop={1} />
      <Pawn pos={[0.3, 0, 0]} color={C.blue} t={t + 0.6} s={P(1.3 * pop(t, d * 0.3))} hop={1} />
      <mesh position={[0, 0.72 + Math.sin(t * 2) * 0.04, 0]} scale={P(pop(t, d * 0.5) * (1 + Math.sin(t * 6) * 0.08))}><sphereGeometry args={[0.07, 20, 14]} /><meshBasicMaterial color={C.lime} /></mesh></>,
    ov: <Card t={t} d={d} lines={p.lines} />,
  }),
  dinero: ({ t, d, p }) => ({
    keys: ORB(d, [0, 0.45, 0], 2.1, 0.8, 0.7, -0.7),
    three: <><Plate r={1.0} /><Dust t={t} />
      {[-0.6, -0.35].map((x, k) => <Coins key={k} pos={[x, 0, 0.1 * k]} n={6 + k * 2} t={t} at={0.3 + k * 0.3} color={C.gold} />)}
      <Phone pos={[0.45, 0.55, 0]} rot={[0, -0.25 + Math.sin(t) * 0.1, 0]} s={pop(t, d * 0.35) * 1.4} text={p.scr} /></>,
    ov: <Card t={t} d={d} lines={p.lines} />,
  }),
};
