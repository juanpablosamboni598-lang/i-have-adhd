// Escenas de ViceLeakss g02 (estilo de las referencias). Los textos sincronizados (caps) viven en gta6/g02/escenas.json.
import React from 'react';
import { cl, tw, lerp, drop } from './kit.jsx';
import { C, txt, Plate, Dust, PriceTag, Strike, Coins, Case, Train, Rails, Sign, Console, PC, Land, Pawn, Cake, Clock, Disk, Timeline, Shadow } from './world_g02.jsx';

const pop = (t, a, d = 0.32) => { const u = cl((t - a) / d); return u <= 0 ? 0 : u < 0.75 ? (u / 0.75) * 1.1 : 1.1 - 0.1 * ((u - 0.75) / 0.25); };
const ORB = (d, c = [0, 0.5, 0], r = 2.6, y = 0.9, a0 = 0.35, a1 = -0.35) => [0, 0.33, 0.66, 1].map((u) => {
  const a = lerp(a0, a1, u); return [d * u, c[0] + Math.sin(a) * r, y + Math.sin(u * 3) * 0.1, c[2] + Math.cos(a) * r, c[0], c[1], c[2]];
});
const Year = ({ x, y, z = 0, s = '2013', col = C.text, sc = 1 }) => sc <= 0.01 ? null : <mesh position={[x, y, z]} scale={sc}>
  <planeGeometry args={[0.62, 0.22]} /><meshBasicMaterial map={txt(s, { bg: null, fg: col, w: 500, h: 180, size: 120, font: '"JetBrains Mono", monospace', weight: 800 })} transparent /></mesh>;

// ---- HTML: contador odómetro y tarjeta tecleada (como las referencias) ----
export const Odo = ({ t, at = 0, dur = 1, from = 0, to = 100, digits = 3, x = 960, y = 200, size = 64, color = C.lime, suffix = '', prefix = '' }) => {
  if (t < at - 0.05) return null;
  const v = lerp(from, to, tw(t, at, at + dur));
  const s = String(Math.floor(v)).padStart(digits, '0');
  const frac = v % 1;
  const firstSig = s.search(/[1-9]/);
  return <div style={{ position: 'absolute', left: x, top: y, transform: 'translateX(-50%)', fontFamily: '"JetBrains Mono", monospace', fontWeight: 800, fontSize: size, color, display: 'flex', opacity: cl((t - at) / 0.15) }}>
    <span>{prefix}</span>
    {s.split('').map((ch, k) => {
      const rolling = k === s.length - 1 && t < at + dur;
      return <span key={k} style={{ display: 'inline-block', color: firstSig === -1 || k < firstSig ? '#4a4c55' : color, transform: rolling ? `translateY(${-frac * 30}%)` : 'none', filter: rolling ? 'blur(1.5px)' : 'none' }}>{ch}</span>;
    })}
    <span style={{ marginLeft: 12 }}>{suffix}</span>
  </div>;
};
export const TypeCard = ({ t, at = 0, lines = [], x = 120, y = 150, paper = false, cps = 30, out }) => {
  if (t < at || (out && t > out + 0.3)) return null;
  const all = lines.join('\n'); const n = Math.floor((t - at) * cps); const shown = all.slice(0, n);
  const o = out ? 1 - cl((t - out) / 0.3) : 1;
  return <div style={{ position: 'absolute', left: x, top: y, padding: '14px 22px 14px 26px', background: paper ? C.paper : '#111216', borderLeft: `6px solid ${C.red}`, fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, fontSize: 42, lineHeight: 1.3, color: paper ? '#141018' : C.text, whiteSpace: 'pre', opacity: o, transform: `translateY(${(1 - cl((t - at) / 0.2)) * 12}px)`, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
    {shown}<span style={{ background: C.lime, color: C.lime, opacity: Math.floor(t * 3) % 2 ? 1 : 0.2 }}>█</span>
  </div>;
};

export const SG2 = {
  gancho: ({ t, d }) => {
    const a = d * 0.42, r1 = tw(t, a, a + 0.35) * Math.PI / 2, r2 = (1 - tw(t, a + 0.35, a + 0.7)) * -Math.PI / 2;
    return {
      keys: [[0, 0, 0.9, 3.2, 0, 0.6, 0], [d * 0.4, 0.5, 0.85, 2.5, 0, 0.6, 0], [d * 0.75, -0.6, 0.8, 2.4, 0.2, 0.6, 0], [d, 0.2, 0.95, 2.9, 0.2, 0.6, 0]],
      three: <><Plate r={1.2} /><Dust t={t} />
        <group position={[0, 0.65, 0]} rotation={[0, t < a + 0.35 ? r1 : r2, 0]}>
          {t < a + 0.35 ? <PriceTag text="$100" sc={pop(t, 0.2)} /> : <PriceTag text="$79.99" color={C.lime} sc={1} />}
          {t < a + 0.35 ? <Strike pos={[0, 0, 0.06]} len={1.25} u={tw(t, d * 0.15, d * 0.3)} rot={-0.12} th={0.07} /> : null}
        </group>
        <Coins pos={[1.25, 0, 0.2]} n={8} t={t} at={a + 0.6} />
        <Sign pos={[-1.35, 0, -0.2]} text="19 NOV" color={C.red} fg={C.text} sc={pop(t, d * 0.78)} /></>,
    };
  },
  mito: ({ t, d }) => {
    const gray = tw(t, d * 0.78, d * 0.9);
    return {
      keys: [[0, 0, 0.7, 3.6, 0, 0.7, 0], [d * 0.5, 0.6, 0.9, 3.2, 0, 0.7, 0], [d, -0.5, 0.75, 3.4, 0, 0.7, 0]],
      three: <><Dust t={t} />
        {Array.from({ length: 20 }).map((_, k) => { const cx = (k % 5) - 2, cy = Math.floor(k / 5); const dist = Math.hypot(cx, cy - 1.5);
          return <group key={k} position={[cx * 0.62, 0.15 + cy * 0.36 + Math.sin(t * 1.5 + k) * 0.02, 0]}>
            <PriceTag text="$100" w={0.5} color={gray > 0.5 ? '#4a4c55' : C.text} sc={pop(t, 0.2 + dist * 0.35) * 0.95} rot={[0, 0, Math.sin(k * 3) * 0.08]} />
          </group>; })}
        <Strike pos={[0, 0.7, 0.1]} len={3.4} u={tw(t, d * 0.82, d * 0.95)} rot={-0.05} th={0.08} /></>,
    };
  },
  ultimate: ({ t, d }) => ({
    keys: [[0, 0.3, 0.75, 2.4, 0, 0.35, 0], [d * 0.45, -0.7, 0.7, 2.1, 0.1, 0.35, 0], [d, 0.6, 0.8, 2.3, -0.1, 0.35, 0]],
    three: <><Plate r={1.0} /><Dust t={t} />
      <Case pos={[-0.4, 0, 0]} rot={[0, 0.25 + Math.sin(t) * 0.05, 0]} label="ESTÁNDAR" s={drop(t, 0.15, 0.5)} />
      <Case pos={[0.4, 0, 0]} rot={[0, -0.25 - Math.sin(t) * 0.05, 0]} label="ULTIMATE" color={C.gold} s={drop(t, 0.5, 0.5)} />
      <mesh position={[-0.4, 0.3, 0.05]} scale={tw(t, d * 0.75, d * 0.85)}><torusGeometry args={[0.45, 0.012, 8, 64]} /><meshBasicMaterial color={C.lime} /></mesh></>,
    ov: <><Odo t={t} at={d * 0.42} dur={0.8} from={0} to={20} digits={2} prefix="+$" x={1190} y={250} color={C.lime} /></>,
  }),
  retrasos: ({ t, d }) => {
    const a1 = d * 0.32, a2 = d * 0.55, a3 = d * 0.86;
    const X = t < a1 ? lerp(-4, -2.2, tw(t, 0, a1)) : t < a2 ? lerp(-2.2, 0.2, tw(t, a1 + 0.5, a2)) : lerp(0.2, 2.6, tw(t, a2 + 0.6, a3));
    const run = (t > a1 && t < a1 + 0.5) || (t > a2 && t < a2 + 0.6) ? 0 : 1;
    return {
      keys: [[0, X - 0.5, 0.9, 2.6, X - 0.4, 0.4, 0], [d * 0.3, X - 0.2, 0.8, 2.4, X - 0.3, 0.4, 0], [d * 0.6, X + 0.2, 0.85, 2.5, X - 0.2, 0.4, 0], [d, X + 0.4, 0.9, 2.6, X - 0.1, 0.4, 0]].map((k, i, arr) => k),
      three: <><Rails len={14} /><Dust t={t} area={[10, 2, 2]} />
        <Train pos={[X, 0, 0]} t={t * run + (run ? 0 : a1)} run={run} />
        <Sign pos={[-1.8, 0, -0.55]} text="2025" sc={pop(t, 0.3)} /><Strike pos={[-1.8, 0.78, -0.52]} len={0.8} u={tw(t, a1, a1 + 0.3)} rot={-0.15} />
        <Sign pos={[0.6, 0, -0.55]} text={'26 MAY 2026'} sc={pop(t, a1 + 0.2)} /><Strike pos={[0.6, 0.78, -0.52]} len={0.8} u={tw(t, a2, a2 + 0.3)} rot={-0.15} />
        <Sign pos={[3.0, 0, -0.55]} text={'19 NOV 2026'} color={C.lime} sc={pop(t, a2 + 0.2)} /></>,
    };
  },
  consolas: ({ t, d }) => ({
    keys: ORB(d, [0, 0.4, 0], 2.3, 0.85, 0.5, -0.5),
    three: <><Plate r={1.1} /><Dust t={t} />
      <Console pos={[-0.4, (1 - drop(t, 0.2, 0.5)) * 1.5, 0]} kind="a" glow={tw(t, 0.8, 1.0)} rotY={0.3} />
      <Console pos={[0.4, (1 - drop(t, d * 0.3, 0.5)) * 1.5, 0]} kind="b" color={C.dark} glow={tw(t, d * 0.35, d * 0.4)} rotY={-0.3} />
      <group position={[1.6, 0, -0.3]} scale={pop(t, d * 0.68) * 0.8}><Console kind="b" color="#5a5d66" op={0.6} /><Strike pos={[0, 0.35, 0.25]} len={0.7} u={tw(t, d * 0.78, d * 0.88)} rot={-0.5} /></group></>,
  }),
  pc: ({ t, d }) => ({
    keys: [[0, 0.8, 0.8, 2.3, 0, 0.42, 0], [d * 0.45, -0.3, 0.6, 1.8, 0, 0.42, 0], [d, -0.9, 0.75, 2.1, 0, 0.42, 0]],
    three: <><Shadow r={1} op={0.3} /><Dust t={t} /><PC pos={[0, 0, 0]} screen={t < d * 0.45 ? '?' : '2027?'} fg={C.red} /></>,
    ov: <><TypeCard t={t} at={d * 0.15} lines={['PC', 'SIN ANUNCIO OFICIAL']} x={110} y={170} out={d * 0.6} />
      <TypeCard t={t} at={d * 0.68} lines={['GTA 5', 'CONSOLAS: 2013', 'PC:       2015']} x={1400} y={170} paper /></>,
  }),
  mapa: ({ t, d }) => ({
    keys: [[0, 0, 3.0, 1.6, 0, 0, 0], [d * 0.4, 0.9, 2.2, 1.8, 0, 0.05, 0], [d * 0.75, -0.7, 1.4, 2.0, 0.1, 0.15, 0], [d, 0.3, 1.1, 1.9, 0, 0.25, 0.1]],
    three: <><Land t={t} rise={tw(t, 0.2, 1.0)} /><Dust t={t} />
      <group position={[0.2, 0.1, -0.35]}>{[[-0.15, 0.6, C.red], [0, 0.95, C.text], [0.15, 0.7, C.blue], [0.3, 0.5, C.lime]].map(([x, h, c], k) => { const u = drop(t, d * 0.35 + k * 0.12, 0.5); return <mesh key={k} position={[x, h * 0.25 * u, 0]}><boxGeometry args={[0.1, h * 0.5 * u + 0.001, 0.1]} /><meshBasicMaterial color={c} /></mesh>; })}</group>
      <Pawn pos={[-0.25, 0.1, 0.5]} color={C.red} t={t} s={0.6 * pop(t, d * 0.72)} hop={1} />
      <Pawn pos={[0.15, 0.1, 0.58]} color={C.blue} t={t + 0.5} s={0.6 * pop(t, d * 0.8)} hop={1} /></>,
    ov: <TypeCard t={t} at={d * 0.25} lines={['LEONIDA', 'ESTADO INVENTADO']} x={110} y={170} />,
  }),
  giro: ({ t, d }) => {
    const Y = [1997, 1999, 2001, 2002, 2004, 2008, 2013, 2026], X = (y) => -1.5 + (y - 1997) / 29 * 3;
    const u = tw(t, d * 0.25, d * 0.62), hi = tw(t, d * 0.78, d * 0.92);
    return {
      keys: [[0, -0.3, 0.35, 4.3, 0, 0.2, 0], [d * 0.5, 0.2, 0.45, 4.1, 0, 0.2, 0], [d * 0.8, 0.6, 0.4, 3.6, 0.4, 0.2, 0], [d, 0.8, 0.5, 3.7, 0.5, 0.2, 0]],
      three: <><Dust t={t} /><group position={[0, 0.2, 0]} scale={1.25}><Timeline years={Y} gapFrom={2013} gapTo={2026} u={u} hi={hi} />
        {Y.map((y, k) => <Year key={k} x={X(y)} y={k % 2 ? 0.2 : -0.2} s={String(y)} col={y === 2026 ? C.red : y === 2013 ? C.lime : C.text} sc={cl((u - (X(y) + 1.5) / 3 * 0.92) * 8) * 0.75} />)}</group></>,
      ov: <Odo t={t} at={d * 0.8} dur={0.9} from={0} to={13} digits={2} suffix="AÑOS" x={1180} y={640} color={C.red} size={80} />,
    };
  },
  edad: ({ t, d }) => {
    const v = Math.floor(lerp(10, 23, tw(t, d * 0.35, d * 0.8)));
    return {
      keys: [[0, 0, 1.3, 2.0, 0, 0.3, 0], [d * 0.5, 0.7, 1.0, 1.7, 0, 0.3, 0], [d, -0.6, 1.1, 1.8, 0, 0.3, 0]],
      three: <><Plate r={0.8} /><Dust t={t} /><Cake t={t} candles={v} /></>,
      ov: <Odo t={t} at={d * 0.35} dur={d * 0.45} from={10} to={23} digits={2} suffix="AÑOS" x={1560} y={420} color={C.lime} size={90} />,
    };
  },
  dudas: ({ t, d }) => ({
    keys: [[0, 0.5, 0.9, 2.6, 0, 0.6, 0], [d * 0.5, -0.5, 0.8, 2.3, 0, 0.6, 0], [d, 0.4, 0.95, 2.5, 0, 0.6, 0]],
    three: <><Dust t={t} /><Clock pos={[-0.75, 0.75, 0]} t={t} spin={0.8} s={pop(t, 0.2)} />
      <Disk pos={[0.7, 0.75, 0]} fill={lerp(0.3, 0.97, tw(t, d * 0.35, d * 0.7))} />
      <group position={[0.7, 0.3, 0.1]}><PriceTag text="200 GB" w={0.7} color={C.text} sc={pop(t, d * 0.62)} /><Strike pos={[0, 0, 0.04]} len={0.8} u={tw(t, d * 0.82, d * 0.92)} rot={-0.12} /></group></>,
    ov: <TypeCard t={t} at={d * 0.1} lines={['SIN CONFIRMAR:', '· HORA EXACTA', '· CUÁNTO PESA']} x={110} y={170} />,
  }),
  cierre: ({ t, d }) => {
    const a = d * 0.72;
    return {
      keys: [[0, 0.6, 0.9, 2.8, 0, 0.55, 0], [d * 0.5, -0.4, 0.85, 2.6, 0, 0.6, 0], [d, 0, 0.9, 3.2, 0, 0.6, 0]],
      three: <><Plate r={1.2} /><Dust t={t} />
        {t < a ? <><Disk pos={[0, 0.9, -0.3]} fill={lerp(0.97, 0.35, tw(t, 0.3, d * 0.3))} /><Console pos={[-0.5, 0, 0]} kind="a" glow={1} rotY={0.3} s={pop(t, d * 0.25)} /><Console pos={[0.5, 0, 0]} kind="b" color={C.dark} glow={1} rotY={-0.3} s={pop(t, d * 0.3)} /></>
          : <group position={[0, 0.65, 0]}><PriceTag text="$100" sc={pop(t, a)} /><Strike pos={[0, 0, 0.06]} len={1.25} u={tw(t, a + 0.5, a + 0.8)} rot={-0.12} th={0.07} /></group>}</>,
    };
  },
};
