// Escenas de ViceLeakss g03 (video largo). Reusa las escenas de g02 y agrega las nuevas con el mismo kit (sin arte del juego).
import React from 'react';
import { cl, tw, lerp, drop } from './kit.jsx';
import { C, txt, Plate, Dust, PriceTag, Strike, Coins, Case, Train, Rails, Sign, Console, PC, Land, Pawn, Clock, Disk, Timeline, Shadow } from './world_g02.jsx';
import { SG2, Odo, TypeCard } from './scenes_g02.jsx';

const pop = (t, a, d = 0.32) => { const u = cl((t - a) / d); return u <= 0 ? 0 : u < 0.75 ? (u / 0.75) * 1.1 : 1.1 - 0.1 * ((u - 0.75) / 0.25); };
const ORB = (d, c = [0, 0.5, 0], r = 2.6, y = 0.9, a0 = 0.35, a1 = -0.35) => [0, 0.33, 0.66, 1].map((u) => {
  const a = lerp(a0, a1, u); return [d * u, c[0] + Math.sin(a) * r, y + Math.sin(u * 3) * 0.1, c[2] + Math.cos(a) * r, c[0], c[1], c[2]];
});
const Label = ({ pos, s, col = C.text, w = 0.9, h = 0.2, sc = 1, size = 110 }) => sc <= 0.01 ? null : <mesh position={pos} scale={sc}>
  <planeGeometry args={[w, h]} /><meshBasicMaterial map={txt(s, { bg: null, fg: col, w: Math.round(w * 640), h: Math.round(h * 640), size: Math.min(size, Math.round(w * 640 * 1.5 / Math.max(1, String(s).length))) })} transparent /></mesh>;
// columnas que crecen (comparaciones de vistas)
const Bars = ({ t, items, at = 0, maxv, gap = 0.7 }) => <group>
  {items.map(([label, v, col], k) => { const u = tw(t, at + k * 0.5, at + k * 0.5 + 0.9); const h = 1.3 * v / maxv * u + 0.001; const x = (k - (items.length - 1) / 2) * gap;
    return <group key={k} position={[x, 0, 0]}>
      <mesh position={[0, h / 2, 0]}><boxGeometry args={[0.36, h, 0.36]} /><meshBasicMaterial color={col} /></mesh>
      <Label pos={[0, h + 0.14, 0.2]} s={`${(Math.round(v * u * 10) / 10).toFixed(1)}M`} col={col} w={0.7} h={0.18} sc={u > 0.05 ? 1 : 0} />
      <Label pos={[0, -0.12, 0.25]} s={label} w={0.7} h={0.16} size={80} />
      <Shadow r={0.3} />
    </group>; })}
</group>;
// pantalla flotante (videos filtrados / spoilers)
const Screen = ({ pos, rot = [0, 0, 0], s = 1, text = '▶', fg = C.lime, bg = '#11141c' }) => s <= 0.01 ? null : <group position={pos} rotation={rot} scale={s}>
  <mesh><boxGeometry args={[0.5, 0.3, 0.03]} /><meshBasicMaterial color={C.dark} /></mesh>
  <mesh position={[0, 0, 0.016]}><planeGeometry args={[0.46, 0.26]} /><meshBasicMaterial map={txt(text, { bg, fg, size: 120 })} /></mesh>
</group>;
const REG = [['VICE CITY', C.red, [0.25, 0.45]], ['LEONIDA KEYS', C.lime, [0.1, 0.95]], ['GRASSRIVERS', C.lime, [-0.2, 0.15]], ['PORT GELLHORN', C.blue, [-0.7, -0.4]], ['AMBROSIA', C.gold, [0.3, -0.5]], ['MT. KALAGA', C.text, [-0.3, -0.75]]];
const regiones = (from) => ({ t, d }) => ({
  keys: [[0, 0.8, 2.6, 1.8, 0, 0, 0], [d * 0.5, -0.6, 2.2, 1.9, 0, 0.05, 0], [d, 0.5, 2.0, 2.1, 0, 0.1, 0]],
  three: <><Land t={t} rise={1} /><Dust t={t} />
    {REG.slice(0, from + 2).map(([n, col, [x, z]], k) => { const old = k < from, at = old ? -1 : (k - from) * d * 0.45 + 0.3; return <group key={k} position={[x, 0.1, z]}>
      <mesh position={[0, 0.12 + Math.sin(t * 2 + k) * 0.02, 0]} scale={old ? 0.7 : Math.max(0.001, pop(t, at))}><sphereGeometry args={[0.06, 20, 14]} /><meshBasicMaterial color={col} /></mesh>
      <Label pos={[0, 0.32, 0]} s={n} col={old ? C.gray : col} w={0.9} h={0.18} sc={old ? 0.8 : pop(t, at + 0.15)} />
    </group>; })}</>,
});
const tl2 = (years, hiFrom, hiTo, colors) => ({ t, d }) => {
  const u = tw(t, 0.3, d * 0.6), hi = hiFrom ? tw(t, d * 0.6, d * 0.85) : 0, X = (y) => -1.5 + (y - years[0]) / (years[years.length - 1] - years[0]) * 3;
  return {
    keys: [[0, -0.6, 0.4, 4.0, -0.3, 0.2, 0], [d * 0.5, 0, 0.5, 3.8, 0, 0.2, 0], [d, 0.6, 0.45, 3.9, 0.3, 0.2, 0]],
    three: <><Dust t={t} /><group position={[0, 0.2, 0]} scale={1.25}><Timeline years={years} gapFrom={hiFrom} gapTo={hiTo} u={u} hi={hi} />
      {years.map((y, k) => <Label key={k} pos={[X(y), k % 2 ? 0.2 : -0.2, 0]} s={String(y)} col={colors[y] || C.text} w={0.62} h={0.22} sc={cl((u - (X(y) + 1.5) / 3 * 0.92) * 8) * 0.75} />)}</group></>,
  };
};

export const SG3 = {
  ...SG2,
  cajas: ({ t, d }) => ({
    keys: ORB(d, [0, 0.35, 0], 2.0, 0.7, -0.5, 0.5),
    three: <><Plate r={1.0} /><Dust t={t} />
      <Case pos={[0, 0, 0.1]} rot={[0, Math.sin(t * 0.8) * 0.3, 0]} label="ESTÁNDAR" s={Math.max(0.001, pop(t, 0.2) * 1.2)} />
      <mesh position={[0, 0.36, 0.15]} rotation={[0, 0, t]} scale={tw(t, d * 0.3, d * 0.45) + 0.001}><torusGeometry args={[0.55, 0.014, 8, 64]} /><meshBasicMaterial color={C.lime} /></mesh>
      <Case pos={[0.75, 0, -0.4]} rot={[0, -0.4, 0]} label="ULTIMATE" color={C.gold} s={Math.max(0.001, pop(t, d * 0.6) * 0.8)} /></>,
    ov: <TypeCard t={t} at={d * 0.15} lines={['ESTÁNDAR', '= HISTORIA COMPLETA']} x={110} y={760} />,
  }),
  andenes: ({ t, d }) => ({
    keys: [[0, -1.2, 0.8, 2.6, -0.6, 0.4, 0], [d * 0.5, 0.2, 0.7, 2.3, 0, 0.4, 0], [d, 1.1, 0.85, 2.5, 0.5, 0.4, 0]],
    three: <><Rails len={10} /><Dust t={t} area={[8, 2, 2]} />
      <Train pos={[lerp(-1.6, 0.4, tw(t, d * 0.55, d * 0.9)), 0, 0]} t={t} run={t > d * 0.55 && t < d * 0.9 ? 1 : 0} />
      <Clock pos={[-0.9, 1.15, -0.6]} t={t} spin={1.2} s={Math.max(0.001, pop(t, 0.3) * 0.8)} />
      <Sign pos={[1.4, 0, -0.55]} text="19 NOV 2026" color={C.lime} sc={pop(t, d * 0.5)} />
      <Case pos={[-0.3, 0, 0.55]} rot={[0, 0.3, 0]} label="MALETA" color={C.paper} s={0.6} /></>,
  }),
  historia_pc: tl2([2013, 2014, 2015], 2013, 2015, { 2013: C.lime, 2015: C.red }),
  regiones_a: regiones(0),
  regiones_b: regiones(2),
  regiones_c: regiones(4),
  tamano: ({ t, d }) => {
    const s = lerp(1, 1.6, tw(t, d * 0.4, d * 0.7));
    return {
      keys: [[0, 0, 3.2, 2.2, 0, 0, 0], [d * 0.5, 1.0, 3.0, 2.6, 0, 0, 0], [d, -0.8, 3.4, 2.4, 0, 0, 0]],
      three: <><group scale={[s, 1, s]}><Land t={t} rise={1} /></group><Dust t={t} area={[4, 2, 4]} />
        <group position={[0, 1.0, 0.6]} rotation={[-0.6, 0, 0]}><PriceTag text="×2–3 ?" w={0.9} sc={pop(t, d * 0.4)} /><Strike pos={[0, 0, 0.05]} len={1.0} u={tw(t, d * 0.75, d * 0.85)} rot={-0.12} /></group></>,
      ov: <TypeCard t={t} at={d * 0.72} lines={['ESTIMACIÓN DE FANS', 'NO ES DATO OFICIAL']} x={110} y={760} paper />,
    };
  },
  protas: ({ t, d }) => ({
    keys: ORB(d, [0, 0.35, 0], 1.9, 0.7, 0.6, -0.6),
    three: <><Plate r={0.9} /><Dust t={t} />
      <Pawn pos={[-0.3, 0, 0]} color={C.red} t={t} s={Math.max(0.001, 1.3 * pop(t, 0.3))} hop={1} />
      <Pawn pos={[0.3, 0, 0]} color={C.blue} t={t + 0.6} s={Math.max(0.001, 1.3 * pop(t, d * 0.35))} hop={1} /></>,
  }),
  trailer1: ({ t, d }) => ({
    keys: ORB(d, [0, 0.45, 0], 2.0, 0.75, 0.7, -0.5),
    three: <><Shadow r={1} op={0.3} /><Dust t={t} n={60} />
      <group rotation={[0, Math.sin(t * 0.8) * 0.2, 0]}><PC screen={t < d * 0.55 ? '▶' : '!'} fg={t < d * 0.55 ? C.lime : C.red} /></group>
      <Clock pos={[1.1, 0.9, -0.3]} t={t} spin={2} s={Math.max(0.001, pop(t, d * 0.45) * 0.6)} /></>,
    ov: <TypeCard t={t} at={d * 0.1} lines={['TRÁILER 1', '5 DIC 2023']} x={110} y={170} />,
  }),
  vistas: ({ t, d }) => ({
    keys: [[0, 0, 0.8, 3.0, 0, 0.6, 0], [d * 0.5, 0.7, 0.9, 2.8, 0, 0.6, 0], [d, -0.6, 0.85, 2.9, 0, 0.6, 0]],
    three: <><Plate r={1.1} /><Dust t={t} /><Coins pos={[-0.9, 0, 0.2]} n={10} t={t} at={0.5} color={C.lime} />
      <Screen pos={[0.2, 0.7, 0]} rot={[0, -0.2 + Math.sin(t) * 0.1, 0]} s={pop(t, 0.2) * 2.2} text="24 H" fg={C.text} /></>,
    ov: <><Odo t={t} at={d * 0.15} dur={d * 0.45} from={0} to={90421491} digits={8} x={960} y={820} size={86} color={C.lime} suffix="VISTAS" />
      <TypeCard t={t} at={d * 0.7} lines={['GUINNESS:', 'REVELACIÓN MÁS VISTA', 'EN 24 HORAS']} x={1250} y={170} paper /></>,
  }),
  record: ({ t, d }) => ({
    keys: [[0, -0.8, 0.9, 3.0, 0, 0.6, 0], [d * 0.5, 0, 1.0, 2.8, 0, 0.6, 0], [d, 0.8, 0.95, 3.0, 0, 0.6, 0]],
    three: <><Dust t={t} /><Bars t={t} at={0.3} maxv={108.2} items={[['MRBEAST', 59.4, C.gray], ['GTA 6', 90.4, C.lime], ['BTS', 108.2, C.red]]} /></>,
  }),
  trailer2: ({ t, d }) => ({
    keys: [[0, 0.6, 0.9, 2.6, 0, 0.6, 0], [d * 0.5, -0.4, 1.0, 2.5, 0, 0.6, 0], [d, 0.3, 0.95, 2.7, 0, 0.6, 0]],
    three: <><Dust t={t} /><Bars t={t} at={0.3} maxv={90.4} gap={0.9} items={[['TRÁILER 1', 90.4, C.lime], ['TRÁILER 2', 75.9, C.blue]]} /></>,
    ov: <TypeCard t={t} at={d * 0.1} lines={['TRÁILER 2', 'MAYO 2025']} x={110} y={170} />,
  }),
  filtracion: ({ t, d }) => ({
    keys: ORB(d, [0, 0.6, 0], 2.6, 0.9, 0.5, -0.5),
    three: <><Dust t={t} n={60} /><Disk pos={[0, 0.15, 0]} fill={0.6 + 0.1 * Math.sin(t)} />
      {Array.from({ length: 18 }).map((_, k) => { const at = d * 0.35 + k * 0.12, u = tw(t, at, at + 1.2), a = k * 2.4;
        return <Screen key={k} pos={[Math.cos(a) * (0.2 + u * 1.2), 0.3 + u * (0.4 + (k % 4) * 0.25), Math.sin(a) * u * 0.6]} rot={[0, -Math.cos(a) * 0.4, Math.sin(k) * 0.2]} s={pop(t, at) * 0.7} text="▶" fg={k % 3 ? C.text : C.red} />; })}</>,
    ov: <><TypeCard t={t} at={d * 0.1} lines={['SEPTIEMBRE 2022']} x={110} y={170} />
      <Odo t={t} at={d * 0.45} dur={1.2} from={0} to={90} digits={2} prefix="+" suffix="VIDEOS" x={1400} y={820} size={80} color={C.red} /></>,
  }),
  costo: ({ t, d }) => ({
    keys: [[0, 0.5, 0.9, 2.6, 0, 0.45, 0], [d * 0.5, -0.5, 0.8, 2.4, 0, 0.45, 0], [d, 0.4, 0.9, 2.5, 0, 0.45, 0]],
    three: <><Plate r={1.1} /><Dust t={t} />
      {[-0.5, -0.17, 0.17, 0.5].map((x, k) => <Coins key={k} pos={[x, 0, (k % 2) * 0.2]} n={6 + k * 2} t={t} at={0.3 + k * 0.4} />)}
      <Clock pos={[-1.05, 0.7, -0.4]} t={t} spin={3} s={Math.max(0.001, pop(t, d * 0.55) * 0.7)} /></>,
    ov: <><Odo t={t} at={d * 0.1} dur={d * 0.35} from={0} to={5000000} digits={7} prefix="$" x={960} y={820} size={86} color={C.gold} />
      <TypeCard t={t} at={d * 0.55} lines={['+ MILES DE HORAS', 'DE TRABAJO']} x={1320} y={170} /></>,
  }),
  juicio: ({ t, d }) => ({
    keys: [[0, -0.5, 0.8, 2.6, 0, 0.45, 0], [d * 0.5, 0.4, 0.75, 2.4, 0, 0.45, 0], [d, -0.2, 0.9, 2.7, 0, 0.45, 0]],
    three: <><Plate r={1.0} /><Dust t={t} />
      <Pawn pos={[0, 0, 0]} color={C.gray} t={0} s={Math.max(0.001, 1.2 * pop(t, 0.3))} />
      <Sign pos={[-0.85, 0, -0.3]} text="LONDRES" color={C.paper} sc={pop(t, d * 0.4)} />
      {[-0.35, -0.12, 0.12, 0.35].map((x, k) => <mesh key={k} position={[x, 0.45, 0.35]} scale={[1, tw(t, d * 0.6 + k * 0.1, d * 0.6 + k * 0.1 + 0.3) + 0.001, 1]}><boxGeometry args={[0.03, 0.9, 0.03]} /><meshBasicMaterial color={C.text} /></mesh>)}</>,
    ov: <TypeCard t={t} at={d * 0.1} lines={['GRUPO: LAPSUS$']} x={110} y={170} />,
  }),
  saltos: tl2([1997, 1999, 2001, 2002, 2004, 2008, 2013], null, null, { 1997: C.lime, 2013: C.lime }),
  ventas: ({ t, d }) => ({
    keys: ORB(d, [0, 0.5, 0], 2.4, 0.85, -0.4, 0.4),
    three: <><Plate r={1.2} /><Dust t={t} />
      {Array.from({ length: 8 }).map((_, k) => <Case key={k} pos={[((k % 4) - 1.5) * 0.36, Math.floor(k / 4) * 0.45, -0.2 + (k % 2) * 0.05]} label="GTA 5" s={Math.max(0.001, drop(t, 0.2 + k * 0.15, 0.4) * 0.7)} />)}</>,
    ov: <><Odo t={t} at={d * 0.15} dur={d * 0.35} from={0} to={230} digits={3} prefix="+" suffix="MILLONES" x={960} y={820} size={86} color={C.lime} />
      <TypeCard t={t} at={d * 0.6} lines={['EL MÁS VENDIDO', 'DE LA DÉCADA']} x={1350} y={170} paper /></>,
  }),
  ritmo: ({ t, d }) => ({
    keys: [[0, 0.4, 0.85, 2.4, 0, 0.45, 0], [d * 0.5, -0.5, 0.8, 2.3, 0, 0.45, 0], [d, 0.5, 0.9, 2.5, 0, 0.45, 0]],
    three: <><Plate r={1.0} /><Dust t={t} /><Clock pos={[-0.55, 0.75, 0]} t={t} spin={4} s={Math.max(0.001, pop(t, 0.2))} />
      {[0, 1, 2, 3].map((k) => <Coins key={k} pos={[0.25 + k * 0.25, 0, 0]} n={5} t={t} at={d * 0.3 + k * d * 0.12} color={C.lime} />)}</>,
    ov: <TypeCard t={t} at={d * 0.25} lines={['~5 MILLONES', 'CADA 3 MESES']} x={1300} y={170} />,
  }),
  hora: ({ t, d }) => ({
    keys: [[0, 0.3, 0.8, 2.0, 0, 0.75, 0], [d * 0.5, -0.4, 0.75, 1.8, 0, 0.75, 0], [d, 0.3, 0.85, 2.1, 0, 0.75, 0]],
    three: <><Dust t={t} /><Clock pos={[0, 0.75, 0]} t={t} spin={1.5} s={Math.max(0.001, pop(t, 0.2) * 1.6)} />
      <group position={[0.9, 0.35, 0.2]}><PriceTag text="00:00 ?" w={0.7} sc={pop(t, d * 0.25)} /></group></>,
    ov: <TypeCard t={t} at={d * 0.55} lines={['SIN CONFIRMAR', '→ REVISA TU TIENDA']} x={110} y={760} paper />,
  }),
  peso: ({ t, d }) => ({
    keys: [[0, 0.5, 0.9, 2.4, 0, 0.6, 0], [d * 0.5, -0.5, 0.8, 2.2, 0, 0.6, 0], [d, 0.4, 0.95, 2.4, 0, 0.6, 0]],
    three: <><Dust t={t} /><Disk pos={[0, 0.95, 0]} fill={lerp(0.3, 0.97, tw(t, 0.3, d * 0.7))} />
      <group position={[0, 0.45, 0.1]}><PriceTag text="200 GB" w={0.8} sc={pop(t, 0.3)} /><Strike pos={[0, 0, 0.04]} len={0.9} u={tw(t, d * 0.3, d * 0.42)} rot={-0.12} /></group></>,
    ov: <TypeCard t={t} at={d * 0.6} lines={['LIBERA ESPACIO', 'ANTES DEL JUEVES']} x={110} y={760} />,
  }),
  spoilers: ({ t, d }) => ({
    keys: ORB(d, [0, 0.6, 0], 2.4, 0.85, 0.4, -0.4),
    three: <><Dust t={t} n={60} />
      {Array.from({ length: 9 }).map((_, k) => { const x = (k % 3 - 1) * 0.65, y = 0.25 + Math.floor(k / 3) * 0.4; const off = tw(t, d * 0.55 + k * 0.08, d * 0.55 + k * 0.08 + 0.3);
        return <Screen key={k} pos={[x, y + Math.sin(t * 2 + k) * 0.02, 0]} s={pop(t, 0.2 + k * 0.1)} text={off > 0.5 ? 'MUTE' : 'SPOILER'} fg={off > 0.5 ? C.gray : C.red} />; })}</>,
    ov: <TypeCard t={t} at={d * 0.5} lines={['· SILENCIA PALABRAS', '· JUEGA TÚ PRIMERO']} x={110} y={760} paper />,
  }),
  resumen: ({ t, d }) => ({
    keys: ORB(d, [0, 0.45, 0], 2.5, 0.85, 0.5, -0.5),
    three: <><Plate r={1.3} /><Dust t={t} />
      <Sign pos={[0, 0, -0.3]} text="19 NOV" color={C.red} fg={C.text} sc={pop(t, 0.3)} />
      <Console pos={[-0.7, 0, 0.1]} kind="a" glow={1} rotY={0.3} s={Math.max(0.001, pop(t, d * 0.2))} />
      <Console pos={[0.7, 0, 0.1]} kind="b" color={C.dark} glow={1} rotY={-0.3} s={Math.max(0.001, pop(t, d * 0.25))} />
      <group position={[0, 0.3, 0.5]}><PriceTag text="$79.99" color={C.lime} w={0.7} sc={pop(t, d * 0.55)} /></group>
      <group position={[1.3, 0.35, -0.4]}><PriceTag text="PC ?" w={0.55} sc={pop(t, d * 0.8)} /></group></>,
  }),
};
