import React from 'react';
import { C, FONT, cl, lerp, ramp, ease, eo, seg, pop, mod, rng, pathPts, Pill, Ring, Counter } from './lib.jsx';
import { Stage } from './stage.jsx';
import { Shark, Seal, Fish, Splash, BubbleTrail, Diver } from './actors.jsx';
import { Quad, Croc, Snake, Person } from './actors2.jsx';
import { LandBack, Ground, RiverWater, Dust, HeatWaves, Gauge, Thermo } from './lands.jsx';
import { Txt, land } from './scenes14a.jsx';

const D = (p) => p.frames / 30;
const ICE = '#f4fbff';

// 23 · Riesgo desde dentro
const s23 = (p) => { const { t } = p; const d = D(p);
  const x = ramp(t, d * 0.15, d * 0.3);
  const poke = Math.max(0, Math.sin(t * 5)) * x * (1 - ramp(t, d * 0.7, d * 0.8));
  return (
    <Stage {...p} env={land('swamp', { t, seed: 42 })} light={(tt) => 1 - 0.3 * ramp(tt, d * 0.7, d * 0.85)} cam={{ keys: [[0, 960, 600, 1.2, 1], [2.6, 1000, 620, 1.7, -2], [5.2, 950, 620, 2.0, 2], [7.8, 1050, 600, 1.6, -1], [10.4, 960, 600, 1.35, 1], [d, 960, 580, 1.2, 0]], shake: (tt) => poke * 0.4 }}>
      <Ground t={t} kind="swamp" y={720} />
      <Snake x={1500} y={650} s={1.1} t={t} len={1100} wave={0.15} bulge={0.5} bulgeSize={60} />
      <g opacity={x}><ellipse cx={1500 - 0.5 * 1100 * 1.1} cy={650} rx={110} ry={58} fill="#0b1f33" opacity={0.6} />
        <path d={`M${895},${612 - poke * 40} l-16,-36 l26,26 M${945},${612 - poke * 34} l10,-40 l6,36`} stroke="#f2e6c8" strokeWidth={9} strokeLinecap="round" /></g>
      {poke > 0.5 && <path d="M880,560 l-20,-30 m40,10 l0,-40 m30,40 l20,-30" stroke={C.red} strokeWidth={6} />}
      <Pill x={900} y={360} text="CUERNOS Y GARRAS" color={C.red} size={32} s={pop(t, d * 0.3) * (1 - ramp(t, d * 0.65, d * 0.7))} />
      <Pill x={960} y={360} text="VICTORIA = VULNERABLE" color={C.gold} size={32} s={pop(t, d * 0.75)} />
    </Stage>); };

// 24 · Al lugar más frío: globo que gira al Ártico
const s24 = (p) => { const { t } = p; const d = D(p);
  const rot = t * 40;
  return (
    <Stage {...p} env={{ theme: 'dark', rays: false, fish: false }} cam={{ keys: [[0, 960, 560, 1.0, 0], [2.4, 960, 500, 1.4, -2], [4.6, 960, 420, 1.9, 1], [d, 960, 400, 2.3, -1]] }}>
      {[...Array(50)].map((_, k) => <circle key={k} cx={(k * 211) % 1920} cy={(k * 97) % 1080} r={2} fill="#fff" opacity={0.4 + 0.6 * Math.sin(t * 3 + k)} />)}
      <circle cx={960} cy={560} r={300} fill="#2e86c4" stroke="#9fd4f5" strokeWidth={6} />
      {[...Array(5)].map((_, k) => { const x = 960 + 300 * Math.sin(((rot + k * 72) * Math.PI) / 180); return Math.cos(((rot + k * 72) * Math.PI) / 180) > 0 ? <ellipse key={k} cx={x} cy={500 + (k % 3) * 70} rx={60 + (k % 2) * 30} ry={40} fill="#6fae5a" /> : null; })}
      <ellipse cx={960} cy={300} rx={170} ry={50} fill={ICE} />
      <Pill x={960} y={180} text="EL ÁRTICO" color={C.cyan} size={34} s={pop(t, 1.5)} />
      <Txt x={1350} y={360} size={110} color={C.red} s={pop(t, d * 0.75)} rot={10 * Math.sin(t * 3)}>¿CALOR?</Txt>
    </Stage>); };

// 25 · Oso polar: olfato a más de 1 km
const s25 = (p) => { const { t } = p; const d = D(p);
  const bx = lerp(300, 1000, ramp(t, d * 0.4, d));
  const R = rng(25);
  return (
    <Stage {...p} env={land('arctic', { t, seed: 44 })} cam={{ keys: [[0, 600, 620, 1.4, -1], [2.6, 800, 600, 1.2, 2], [5.2, 1200, 600, 1.15, -1], [7.8, 1500, 640, 1.5, 1.5], [10.4, 1100, 620, 1.3, -2], [d, 1000, 600, 1.2, 0]] }}>
      <Ground t={t} kind="arctic" y={780} />
      <Quad kind="bear" x={bx} y={670} s={1.15} t={t} seed={61} speed={0.9} run={false} />
      <g transform="translate(1650 800)"><ellipse rx={110} ry={30} fill="#dbeef8" /><Seal x={0} y={10} s={0.55} t={t} opacity={0.6} /></g>
      {[...Array(20)].map((_, k) => { const u = mod(t * 0.4 + k / 20, 1); return <circle key={k} cx={lerp(1650, bx + 130, u)} cy={780 - 60 * Math.sin(u * Math.PI) + 15 * Math.sin(k + t * 3)} r={5} fill={C.gold} opacity={0.8 * (1 - Math.abs(u - 0.5) * 1.2)} />; })}
      <Counter x={1250} y={560} t={t} t0={d * 0.2} t1={d * 0.6} v1={1} size={70} color={C.gold} suffix=" KM" />
      <Pill x={bx} y={420} text="600 KG" color={C.cyan} size={32} s={pop(t, 0.8)} />
    </Stage>); };

// 26 · Capas: piel negra, grasa, pelaje
const s26 = (p) => { const { t } = p; const d = D(p);
  const layers = [['PIEL NEGRA', '#1a1a1a', 0.15], ['CAPA DE GRASA', '#f2d08a', 0.35], ['PELAJE DENSO', '#f4f1ea', 0.55]];
  return (
    <Stage {...p} env={land('arctic', { t, seed: 46 })} cam={{ keys: [[0, 960, 560, 1.15, -2], [2.4, 1000, 540, 1.5, 1], [4.8, 960, 560, 1.3, -1], [d, 900, 560, 1.6, 2]] }}>
      {[...Array(8)].map((_, k) => { const u = mod(t * 0.6 + k / 8, 1); return <line key={k} x1={1500 + k * 30 - u * 400} y1={150 + u * 300} x2={1470 + k * 30 - u * 400} y2={190 + u * 300} stroke="#fff2a0" strokeWidth={6} opacity={1 - u} />; })}
      {layers.map(([n, c, fr], k) => { const s = eo(ramp(t, d * fr, d * fr + 0.6)); return <g key={k} transform={`translate(${lerp(-400, 0, s)} 0)`}>
        <rect x={500} y={700 - k * 110} width={900} height={110} fill={c} stroke="#333" strokeWidth={3} />
        {k === 2 && [...Array(30)].map((_, j) => <path key={j} d={`M${520 + j * 30},${480} q${6 * Math.sin(t * 3 + j)},-40 0,-70`} stroke="#e4e0d4" strokeWidth={5} fill="none" />)}
        <Txt x={950} y={770 - k * 110} size={36} color={k === 0 ? '#fff' : '#333'} s={s}>{n}</Txt></g>; })}
    </Stage>); };

// 27 · Si corre, se sobrecalienta
const s27 = (p) => { const { t } = p; const d = D(p); const ts = d * 0.6;
  const heat = ramp(t, 0.5, ts); const x = t < ts ? lerp(300, 1100, t / ts) : 1100;
  return (
    <Stage {...p} env={land('arctic', { t, seed: 48 })} cam={{ focus: (tt) => [(tt < ts ? lerp(300, 1100, tt / ts) : 1100) + 80, 600], zamt: 0.8 }} hud={() => <Thermo x={1700} y={430} v={0.15 + 0.8 * heat} t={t} col={heat > 0.6 ? C.red : '#ff9f43'} />}>
      <Ground t={t} kind="arctic" y={780} />
      <Quad kind="bear" x={x} y={670} s={1.15} t={t} seed={62} speed={t < ts ? 1.4 : 0.2} run={t < ts} heat={heat * 0.8} tongue={t < ts ? 0 : 1} mouth={t < ts ? 0 : 0.5} />
      <HeatWaves x={x} y={540} t={t} on={heat} w={280} />
      <Dust x={x - 120} y={780} t={t} col="#ffffff" on={t < ts ? 1 : 0} />
    </Stage>); };

// 28 · Caza esperando junto al agujero (corte bajo el hielo)
const s28 = (p) => { const { t } = p; const d = D(p); const tg = d * 0.7;
  const sy = lerp(1000, 640, ramp(t, 1, tg));
  const swipe = ramp(t, tg, tg + 0.4);
  return (
    <Stage {...p} env={land('arctic', { t, seed: 50 })} cam={{ keys: [[0, 960, 600, 1.2, 1], [2.4, 960, 780, 1.4, -2], [4.8, 1000, 680, 1.6, 2], [d, 1000, 600, 1.9, -1]], shake: (tt) => Math.max(0, 1 - Math.abs(tt - tg - 0.2) * 4) * 0.6 }}>
      <rect x={-600} y={660} width={3200} height={800} fill="#2e6fa0" />
      <path d="M-600,600 L870,600 L870,660 L-600,660Z M1050,600 L2600,600 L2600,660 L1050,660Z" fill={ICE} stroke="#b9d9ea" strokeWidth={4} />
      <Quad kind="bear" x={760} y={530} s={0.95} t={t} seed={63} speed={0.3} run={false} mouth={swipe * 0.6} />
      <Seal x={960} y={sy} s={0.8} t={t} rot={-80} paddle={2} />
      <BubbleTrail t={t} pts={(u, k) => [960 + 10 * Math.sin(k), sy + 80 + u * 200]} n={10} />
      <path d={`M900,${560 + swipe * 60} l80,${-30 + swipe * 60}`} stroke="#fff" strokeWidth={6} opacity={swipe > 0 && swipe < 1 ? 1 : 0} />
      <Pill x={960} y={330} text="PACIENCIA, NO VELOCIDAD" color={C.cyan} size={30} s={pop(t, d * 0.3)} />
    </Stage>); };

// 29 · Pelo transparente y hueco
const s29 = (p) => { const { t } = p; const d = D(p);
  const z = ramp(t, 0.3, 1.5);
  return (
    <Stage {...p} env={land('arctic', { t, seed: 52 })} cam={{ keys: [[0, 960, 560, 1.1, 0], [2.4, 960, 540, 1.5, -2], [4.8, 1000, 560, 1.8, 1.5], [d, 960, 560, 1.35, -1]] }}>
      <g opacity={z}>
        <rect x={300} y={700} width={1300} height={100} fill="#1a1a1a" />
        {[...Array(6)].map((_, k) => <g key={k} transform={`translate(${420 + k * 210} 700) rotate(${-8 + 4 * Math.sin(t * 2 + k)})`}>
          <rect x={-22} y={-420} width={44} height={420} rx={22} fill="#e8f4fb" fillOpacity={0.35} stroke="#bcd9ea" strokeWidth={4} />
          <rect x={-8} y={-410} width={16} height={400} rx={8} fill="#0b1f33" opacity={0.25} />
          {(() => { const u = mod(t * 0.7 + k * 0.17, 1); return <circle cx={12 * Math.sin(u * 20)} cy={-420 + u * 420} r={8} fill="#fff2a0" filter="url(#glow)" />; })()}
        </g>)}
        <Pill x={960} y={240} text="TRANSPARENTE Y HUECO" color={C.cyan} size={32} s={pop(t, d * 0.25)} />
        <Pill x={960} y={860 - 40} text="PIEL NEGRA ATRAPA EL SOL" size={28} s={pop(t, d * 0.6)} />
      </g>
    </Stage>); };

// 30 · Sin hielo no come: témpano que se derrite
const s30 = (p) => { const { t } = p; const d = D(p);
  const melt = ramp(t, d * 0.2, d * 0.85);
  const w = lerp(700, 170, melt);
  const fat = 1 - 0.7 * ramp(t, d * 0.6, d);
  const month = ['MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO'][Math.min(5, Math.floor(melt * 6))];
  return (
    <Stage {...p} env={land('arctic', { t, seed: 54 })} light={(tt) => 1 + 0.1 * melt} cam={{ keys: [[0, 960, 600, 1.0, 0], [2.6, 900, 620, 1.3, -2], [5.2, 960, 640, 1.6, 2], [7.8, 1000, 640, 1.9, -1], [10.4, 960, 620, 1.5, 1], [d, 960, 600, 1.25, 0]] }}
      hud={() => <g><g transform="translate(1620 220)"><rect x={-90} y={-60} width={180} height={120} rx={14} fill="#fff" stroke="#333" strokeWidth={4} /><text y={22} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill="#222">{month}</text></g>
        <g transform="translate(300 220)"><rect x={-110} y={-26} width={220} height={52} rx={12} fill="#0f2240" stroke="#fff" strokeWidth={4} /><rect x={-102} y={-18} width={204 * fat} height={36} rx={8} fill={fat > 0.5 ? C.gold : C.red} /><text y={70} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={26} fill="#fff" stroke="#000" strokeWidth={4} paintOrder="stroke">RESERVA DE GRASA</text></g></g>}>
      <rect x={-600} y={680} width={3200} height={800} fill="#2e6fa0" />
      {[...Array(24)].map((_, k) => <rect key={k} x={-600 + mod(k * 170 + t * 30, 3200)} y={700 + (k % 4) * 20} width={60} height={4} fill="#e8f7ff" opacity={0.4} />)}
      <path d={`M${960 - w},680 L${960 + w},680 L${960 + w * 0.85},720 L${960 - w * 0.85},720Z`} fill={ICE} stroke="#b9d9ea" strokeWidth={4} />
      {[...Array(8)].map((_, k) => { const u = mod(t * 0.5 + k / 8, 1); return <circle key={k} cx={960 - w + (k / 7) * 2 * w} cy={720 + u * 60} r={4} fill="#e8f7ff" opacity={1 - u} />; })}
      <Quad kind="bear" x={960} y={580} s={0.9} t={t} seed={64} speed={0.4} run={false} mouth={0.2} />
    </Stage>); };

// 31 · El número seis y el interruptor
const s31 = (p) => { const { t } = p; const d = D(p);
  const sw = seg(t, d * 0.6, d * 0.7);
  return (
    <Stage {...p} env={{ theme: 'deep' }} cam={{ keys: [[0, 960, 540, 1.2, -2], [2.4, 900, 520, 1.5, 2], [4.6, 1100, 560, 1.35, -1], [d, 1150, 560, 1.6, 1]] }}>
      <Shark x={lerp(-400, 2400, t / d)} y={760} s={0.6} t={t} seed={71} speed={0.7} opacity={0.6} />
      <Txt x={760} y={600} size={360} color={C.gold} s={pop(t, 0.2, 0.6)} rot={-6 + 4 * Math.sin(t * 1.5)}>6</Txt>
      <g transform={`translate(1250 480) scale(${pop(t, d * 0.4)})`}><rect x={-70} y={-130} width={140} height={260} rx={24} fill="#ddd" stroke="#555" strokeWidth={6} />
        <rect x={-36} y={lerp(-100, 10, sw)} width={72} height={90} rx={14} fill={sw > 0.5 ? C.red : C.green} /><Txt x={0} y={190} size={36}>INTERRUPTOR</Txt></g>
    </Stage>); };

// 32 · Tiburón blanco: 3 insignias
const s32 = (p) => { const { t } = p; const d = D(p);
  const badges = [['6 METROS', C.cyan], ['300 DIENTES', '#fff'], ['DETECTA UN LATIDO', C.purple]];
  return (
    <Stage {...p} env={{ theme: 'blue', seabed: 940 }} cam={{ focus: (tt) => [lerp(400, 1300, tt / d), 560], zamt: 0.75 }}>
      <Shark x={lerp(300, 1300, t / d)} y={560} s={1.1} t={t} seed={72} speed={0.9} ampGlow={ramp(t, d * 0.7, d * 0.8)} mouth={t > d * 0.45 && t < d * 0.65 ? 0.5 : 0} />
      {badges.map(([n, c], k) => { const a = t * 0.8 + k * 2.1; return <Pill key={k} x={lerp(300, 1300, t / d) + 420 * Math.cos(a)} y={560 + 230 * Math.sin(a)} text={n} color={c} size={30} s={pop(t, d * (0.2 + k * 0.25))} />; })}
    </Stage>); };

// 33 · Inmovilidad tónica: lo voltean y entra en trance
const s33 = (p) => { const { t } = p; const d = D(p);
  const flip = seg(t, d * 0.15, d * 0.35); const sleep = ramp(t, d * 0.35, d * 0.55);
  return (
    <Stage {...p} env={{ theme: 'blue' }} light={(tt) => 1 - 0.2 * sleep} cam={{ keys: [[0, 960, 560, 1.2, 0], [2.6, 960, 540, 1.5, -3], [5.2, 1000, 560, 1.8, 2], [7.8, 960, 560, 1.4, -2], [10.4, 1050, 560, 1.7, 2], [d, 960, 560, 1.3, 0]] }}>
      <g transform={`translate(960 560) rotate(${flip * 180 + 3 * Math.sin(t)}) translate(-960 -560)`}><Shark x={960} y={560} s={1.3} t={t} seed={73} speed={lerp(0.8, 0.05, sleep)} eyeRoll={sleep} /></g>
      {sleep > 0 && [0, 1, 2].map((k) => { const u = mod(t * 0.4 + k / 3, 1); return <Txt key={k} x={1150 + u * 120} y={420 - u * 160} size={40 + u * 30} op={(1 - u) * sleep}>Z</Txt>; })}
      <g transform="translate(400 300)"><circle r={60} fill="#0f2240" stroke="#fff" strokeWidth={5} /><line x1={0} y1={0} x2={44 * Math.sin(t * sleep)} y2={-44 * Math.cos(t * sleep)} stroke={C.gold} strokeWidth={7} strokeLinecap="round" /></g>
      <Pill x={960} y={260} text="INMOVILIDAD TÓNICA" color={C.cyan} size={34} s={pop(t, d * 0.75)} />
    </Stage>); };

// 34 · Los científicos lo examinan… y la orca también lo sabe
const s34 = (p) => { const { t } = p; const d = D(p);
  const orca = ramp(t, d * 0.55, d * 0.85);
  return (
    <Stage {...p} env={{ theme: 'blue', surface: 220 }} cam={{ keys: [[0, 900, 520, 1.4, 1], [2.6, 1000, 520, 1.6, -2], [5.2, 1100, 520, 1.25, 1], [d, 1300, 500, 1.4, -1]] }}>
      <g transform={`translate(800 ${215 + 4 * Math.sin(t * 2)})`}><path d="M-200,0 L200,0 L160,60 L-160,60Z" fill="#ecf0f1" stroke="#555" strokeWidth={4} /></g>
      <g transform="translate(860 520) rotate(180) translate(-860 -520)"><Shark x={860} y={520} s={0.9} t={t} seed={74} speed={0.05} eyeRoll={1} /></g>
      <Diver x={620} y={560} s={0.9} t={t} point={0.6} />
      <Diver x={1100} y={430} s={0.8} t={t} seed={9} point={0.3 + 0.3 * Math.sin(t)} />
      <Shark kind="orca" x={lerp(2300, 1500, orca)} y={760} s={0.8} t={t} seed={75} speed={0.6} flip opacity={orca} />
      <Pill x={1500} y={600} text="LA ORCA TAMBIÉN LO SABE" color={C.red} size={30} s={pop(t, d * 0.75)} />
    </Stage>); };

// 35 · Orcas voltean al tiburón: el cazador cazado
const s35 = (p) => { const { t } = p; const d = D(p);
  const flip = seg(t, d * 0.3, d * 0.5); const liv = ramp(t, d * 0.55, d * 0.65); const swap = seg(t, d * 0.72, d * 0.85);
  return (
    <Stage {...p} env={{ theme: 'deep' }} light={(tt) => 1 - 0.2 * flip} cam={{ keys: [[0, 960, 560, 1.15, -2], [2.6, 900, 540, 1.5, 2], [5.2, 960, 560, 1.8, -1], [7.8, 1000, 560, 1.4, 2], [d, 960, 560, 1.25, 0]], shake: (tt) => Math.max(0, 1 - Math.abs(tt - d * 0.4) * 3) * 0.5 }}>
      <Shark kind="orca" x={lerp(200, 640, eo(ramp(t, 0, d * 0.3)))} y={440} s={0.75} rot={20} t={t} seed={76} speed={1.2} />
      <Shark kind="orca" x={lerp(1800, 1300, eo(ramp(t, 0, d * 0.3)))} y={700} s={0.75} rot={-15} t={t} seed={77} speed={1.2} flip />
      <g transform={`translate(960 570) rotate(${flip * 180}) translate(-960 -570)`}><Shark x={960} y={570} s={0.8} t={t} seed={78} speed={1 - flip} eyeRoll={flip} /></g>
      <ellipse cx={960} cy={580} rx={90 * liv} ry={44 * liv} fill="#8b3a3a" stroke={C.gold} strokeWidth={5} />
      <g transform="translate(960 250)" opacity={ramp(t, d * 0.7, d * 0.75)}><Txt x={lerp(-260, 260, swap)} y={0} size={46} color={C.red}>CAZADOR</Txt><Txt x={lerp(260, -260, swap)} y={0} size={46} color={C.cyan}>PRESA</Txt></g>
    </Stage>); };

// 36 · El número siete: lupa sobre la orca
const s36 = (p) => { const { t } = p; const d = D(p);
  const lx = 960 + 340 * Math.cos(t * 0.9), ly = 560 + 120 * Math.sin(t * 1.3);
  return (
    <Stage {...p} env={{ theme: 'blue' }} cam={{ keys: [[0, 960, 560, 1.15, 1], [2.6, 1000, 540, 1.5, -2], [5.2, 900, 560, 1.3, 2], [d, 960, 560, 1.6, -1]] }}>
      <Txt x={360} y={380} size={240} color={C.gold} s={pop(t, 0.2, 0.6)} rot={6 * Math.sin(t)}>7</Txt>
      <Shark kind="orca" x={1000} y={580} s={1.2} t={t} seed={79} speed={0.6} />
      <g transform={`translate(${lx} ${ly})`}><circle r={110} fill="#fff" fillOpacity={0.12} stroke={C.gold} strokeWidth={12} /><line x1={78} y1={78} x2={170} y2={170} stroke={C.gold} strokeWidth={22} strokeLinecap="round" /></g>
      <Txt x={1500} y={330} size={120} color="#fff" s={pop(t, d * 0.55)}>?</Txt>
    </Stage>); };

// 37 · Rey del océano: pirámide alimenticia
const s37 = (p) => { const { t } = p; const d = D(p);
  const lv = [['PLANCTON', '#7ee081'], ['PECES', C.cyan], ['FOCAS · TIBURONES', '#ff9f43'], ['ORCA', C.red]];
  const jump = ramp(t, d * 0.65, d * 0.95);
  return (
    <Stage {...p} env={{ theme: 'blue', surface: 180 }} cam={{ keys: [[0, 960, 760, 1.3, -1], [2.6, 960, 640, 1.2, 2], [5.2, 960, 480, 1.4, -2], [7.8, 1000, 340, 1.3, 1], [d, 960, 360, 1.2, 0]] }}>
      {lv.map(([n, c], k) => { const s = eo(ramp(t, 0.4 + k * d * 0.15, 1 + k * d * 0.15)); const w = 900 - k * 210; return <g key={k} opacity={s}><rect x={960 - w / 2} y={860 - k * 130 - s * 0} width={w} height={110} rx={12} fill={c} opacity={0.85} /><Txt x={960} y={928 - k * 130} size={34} color="#0f2240" s={s}>{n}</Txt></g>; })}
      <Shark kind="orca" x={lerp(700, 1300, jump)} y={jump > 0 ? 300 - 280 * Math.sin(jump * Math.PI) : 380} rot={lerp(-40, 40, jump)} s={0.7} t={t} seed={80} speed={1.2} />
      <Splash x={760} y={180} t={t} t0={d * 0.68} power={0.8} seed={37} />
      <Pill x={1450} y={430} text="NADIE LA CAZA" color={C.gold} size={32} s={pop(t, d * 0.6)} />
    </Stage>); };

// 38 · Su arma: la familia (formación + árbol familiar)
const s38 = (p) => { const { t } = p; const d = D(p);
  const pod = [[0, 0, 1], [-260, -120, 0.8], [-260, 130, 0.8], [-480, -40, 0.65], [-500, 190, 0.55]];
  const bx = lerp(700, 1300, t / d);
  return (
    <Stage {...p} env={{ theme: 'blue' }} cam={{ focus: (tt) => [lerp(700, 1300, tt / d) - 200, 560], zamt: 0.8 }}>
      {pod.map(([dx, dy, s], k) => <Shark key={k} kind="orca" x={bx + dx} y={560 + dy + 10 * Math.sin(t * 2 + k)} s={s * 0.7} t={t} seed={81 + k} speed={0.8} />)}
      {pod.slice(1).map(([dx, dy], k) => <line key={k} x1={bx} y1={560} x2={bx + dx} y2={560 + dy} stroke={C.gold} strokeWidth={4} strokeDasharray="12 10" strokeDashoffset={-t * 40} opacity={ramp(t, d * 0.4, d * 0.5)} />)}
      <Pill x={bx} y={380} text="LA MATRIARCA" color={C.gold} size={30} s={pop(t, d * 0.45)} />
      <Pill x={bx - 300} y={800} text="APRENDEN DE GENERACIÓN EN GENERACIÓN" size={26} s={pop(t, d * 0.7)} />
    </Stage>); };

// 39 · Las abuelas guían en años difíciles (mapa)
const s39 = (p) => { const { t } = p; const d = D(p);
  const u = ramp(t, d * 0.2, d * 0.9);
  const path = (v) => [lerp(300, 1600, v), 600 + 200 * Math.sin(v * 5)];
  const [px, py] = path(u);
  return (
    <Stage {...p} env={{ theme: 'map', rays: false, ridges: false, fish: false }} cam={{ focus: () => [px, py], zamt: 0.6 }}>
      {[...Array(30)].map((_, k) => <path key={k} d={`M${(k * 173) % 2000},${(k * 97) % 1100} q20,-8 40,0 q20,8 40,0`} stroke="#9fd4f5" strokeWidth={3} fill="none" opacity={0.4} />)}
      <path d={pathPts([...Array(41)].map((_, k) => path((k / 40) * u)))} stroke={C.gold} strokeWidth={8} fill="none" strokeDasharray="22 14" />
      {[...Array(14)].map((_, k) => <Fish key={k} x={1600 + 50 * Math.cos(k * 2 + t)} y={600 + 40 * Math.sin(k * 1.7 + t) + 200 * Math.sin(5)} s={0.6} t={t} seed={k} color="#c0c8d0" />)}
      <Shark kind="orca" x={px} y={py} s={0.45} t={t} seed={86} speed={1} />
      <Shark kind="orca" x={px - 120} y={py + 40} s={0.32} t={t} seed={87} speed={1} />
      <Shark kind="orca" x={px - 130} y={py - 50} s={0.3} t={t} seed={88} speed={1} />
      <Pill x={px} y={py - 160} text="LA ABUELA SABE EL CAMINO" color={C.gold} size={28} s={pop(t, d * 0.35)} />
      <g transform="translate(400 300)" opacity={0.7}>{[...Array(6)].map((_, k) => <path key={k} d={`M${k * 30},0 l-10,40`} stroke="#9fd4f5" strokeWidth={4} transform={`translate(0 ${mod(t * 200 + k * 30, 80)})`} />)}<ellipse cx={80} cy={-20} rx={110} ry={40} fill="#556" /></g>
    </Stage>); };

// 40 · Un solo menú: salmones que desaparecen, hambre
const s40 = (p) => { const { t } = p; const d = D(p);
  const left = Math.max(0, 8 - Math.floor(ramp(t, d * 0.35, d * 0.8) * 8));
  const hunger = 1 - left / 8;
  return (
    <Stage {...p} env={{ theme: 'blue' }} light={(tt) => 1 - 0.2 * hunger} cam={{ keys: [[0, 900, 540, 1.2, -1], [2.6, 800, 520, 1.5, 2], [5.2, 1100, 560, 1.3, -2], [7.8, 1000, 560, 1.6, 1], [d, 960, 560, 1.25, 0]] }}>
      <g transform="translate(560 520)"><rect x={-200} y={-260} width={400} height={520} rx={20} fill="#fff8e7" stroke="#8a6500" strokeWidth={6} />
        <text y={-190} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill="#8a6500">MENÚ</text>
        {[...Array(8)].map((_, k) => <g key={k} opacity={k < left ? 1 : 0.15}><Fish x={-120 + (k % 2) * 160} y={-110 + Math.floor(k / 2) * 90} s={1} t={t} seed={k} color="#f08080" /></g>)}
        <path d="M-150,-150 l300,300" stroke={C.red} strokeWidth={0} /></g>
      <Shark kind="orca" x={1350} y={560 + 10 * Math.sin(t * 2)} s={0.9} t={t} seed={89} speed={lerp(0.9, 0.3, hunger)} flip />
      <g transform="translate(1350 300)"><rect x={-130} y={-24} width={260} height={48} rx={10} fill="#0f2240" stroke="#fff" strokeWidth={4} /><rect x={-122} y={-16} width={244 * (1 - hunger)} height={32} rx={6} fill={hunger > 0.5 ? C.red : C.green} /><Txt x={0} y={70} size={28}>ENERGÍA</Txt></g>
    </Stage>); };

// 41 · Contaminación que sube por la cadena
const s41 = (p) => { const { t } = p; const d = D(p);
  const lv = [[300, 'PLANCTON'], [700, 'PECES'], [1100, 'FOCAS'], [1500, 'ORCA']];
  return (
    <Stage {...p} env={{ theme: 'deep' }} cam={{ keys: [[0, 500, 560, 1.4, -1], [2.6, 800, 560, 1.25, 2], [5.2, 1150, 560, 1.4, -2], [7.8, 1450, 560, 1.6, 1], [d, 1300, 560, 1.3, 0]] }}>
      {lv.map(([x, n], k) => { const s = pop(t, k * d * 0.18); const dots = 3 + k * 5; return <g key={k}>
        <circle cx={x} cy={560} r={90 + k * 15} fill="#0f2240" stroke="#9fd4f5" strokeWidth={4} opacity={Math.min(1, s)} />
        {k === 3 ? <Shark kind="orca" x={x} y={560} s={0.32} t={t} seed={90} speed={0.6} /> : k === 2 ? <Seal x={x} y={560} s={0.45} t={t} /> : k === 1 ? <Fish x={x} y={560} s={1.2} t={t} seed={3} color="#c0c8d0" /> : <circle cx={x} cy={560} r={20} fill="#7ee081" opacity={0.8} />}
        {[...Array(dots)].map((_, j) => <circle key={j} cx={x + (60 + k * 10) * Math.cos(j * 2.4 + t)} cy={560 + (60 + k * 10) * Math.sin(j * 2.4 + t)} r={3 + k} fill="#a05cff" opacity={ramp(t, k * d * 0.18 + 0.3, k * d * 0.18 + 0.8)} />)}
        <Txt x={x} y={720} size={28} s={s}>{n}</Txt>
        {k < 3 && <path d={`M${x + 110},560 L${x + 280},560`} stroke="#a05cff" strokeWidth={6} strokeDasharray="14 10" strokeDashoffset={-t * 60} opacity={ramp(t, (k + 1) * d * 0.18, (k + 1) * d * 0.18 + 0.4)} />}
      </g>; })}
      <Shark kind="orca" x={1600} y={850} s={0.22} t={t} seed={91} speed={0.6} opacity={pop(t, d * 0.8)} />
      <Pill x={1500} y={330} text="SE ACUMULA EN SU GRASA" color={C.purple} size={28} s={pop(t, d * 0.7)} />
    </Stage>); };

// 42 · Lo que comparten: los 7 en fila + tres íconos
const s42 = (p) => { const { t } = p; const d = D(p);
  const icons = [['CRECEN DESPACIO', 0.35], ['POCAS CRÍAS', 0.55], ['MUCHO TERRITORIO', 0.75]];
  return (
    <Stage {...p} env={land('savanna', { t, seed: 56 })} cam={{ keys: [[0, 600, 640, 1.4, 1], [2.6, 960, 640, 1.1, -2], [5.2, 1300, 620, 1.35, 2], [7.8, 960, 520, 1.25, -1], [10.4, 960, 460, 1.5, 1], [d, 960, 540, 1.15, 0]] }}>
      <Ground t={t} kind="savanna" y={800} />
      <Croc x={260} y={760} s={0.35} t={t} swim={0.4} /><Quad kind="cheetah" x={560} y={730} s={0.55} t={t} run={false} speed={0.4} />
      <Quad kind="lion" x={820} y={720} s={0.55} t={t} seed={5} run={false} speed={0.4} /><Snake x={1180} y={770} s={0.35} t={t} len={700} wave={0.6} />
      <Quad kind="bear" x={1330} y={720} s={0.5} t={t} seed={6} run={false} speed={0.4} />
      <g transform="translate(1600 700)"><Shark x={0} y={0} s={0.25} t={t} seed={8} speed={0.6} /></g><g transform="translate(1780 740)"><Shark kind="orca" x={0} y={0} s={0.22} t={t} seed={9} speed={0.6} /></g>
      {icons.map(([n, fr], k) => <Pill key={k} x={480 + k * 480} y={360 + 10 * Math.sin(t * 2 + k)} text={n} size={28} color={[C.cyan, C.gold, C.green][k]} s={pop(t, d * fr)} />)}
    </Stage>); };

// 43 · Fuertes como individuos, frágiles como especie
const s43 = (p) => { const { t } = p; const d = D(p);
  const crack = ramp(t, d * 0.45, d * 0.75);
  return (
    <Stage {...p} env={land('dusk', { t, seed: 58 })} light={(tt) => 1 - 0.3 * crack} cam={{ keys: [[0, 700, 600, 1.4, -1], [2.6, 960, 600, 1.15, 2], [5.2, 1250, 560, 1.4, -2], [7.8, 1100, 600, 1.6, 1], [d, 960, 580, 1.25, 0]] }}>
      <Ground t={t} kind="dusk" y={790} />
      <Quad kind="lion" x={600} y={690} s={1.3} t={t} seed={17} run={false} speed={0.5} mouth={0.3 + 0.2 * Math.sin(t * 2)} />
      <Pill x={600} y={400} text="FUERTE" color={C.gold} size={36} s={pop(t, 0.6)} />
      <g transform="translate(1300 520)">{[...Array(10)].map((_, k) => { const gone = k >= 3 && crack > (k - 3) / 7; return <rect key={k} x={-250 + k * 50} y={-60} width={40} height={120} rx={8} fill={gone ? '#555' : C.green} opacity={gone ? 0.3 : 1} transform={gone ? `translate(0 ${30 * crack})` : ''} />; })}
        <Txt x={0} y={140} size={34} s={pop(t, d * 0.4)}>FRÁGILES COMO ESPECIE</Txt></g>
    </Stage>); };

// 44 · Su mayor punto débil: nosotros (sombra → manos que protegen)
const s44 = (p) => { const { t } = p; const d = D(p);
  const shadow = ramp(t, 0.3, d * 0.4) * (1 - ramp(t, d * 0.55, d * 0.65));
  const hands = eo(ramp(t, d * 0.6, d * 0.85));
  return (
    <Stage {...p} env={land('savanna', { t, seed: 60 })} light={(tt) => 1 - 0.45 * shadow} cam={{ keys: [[0, 960, 600, 1.15, 0], [2.4, 960, 560, 1.4, -2], [4.8, 960, 600, 1.2, 2], [7, 960, 620, 1.5, -1], [d, 960, 600, 1.3, 1]] }}>
      <Ground t={t} kind="savanna" y={800} />
      <Quad kind="cheetah" x={700} y={720} s={0.7} t={t} run={false} speed={0.4} /><Quad kind="cub" x={900} y={760} s={1} t={t} seed={33} run={false} speed={0.6} />
      <Quad kind="bear" x={1180} y={720} s={0.6} t={t} seed={34} run={false} speed={0.4} />
      <g opacity={shadow}><ellipse cx={960} cy={700} rx={700} ry={260} fill="#000" opacity={0.45} /><Person x={960} y={420} s={3.2} t={t} shirt="#111" hat={false} /></g>
      <g transform={`translate(0 ${lerp(300, 0, hands)})`} opacity={hands}>
        <path d="M420,860 C480,700 640,640 760,700 L760,860Z" fill="#f0c8a0" stroke="#8a6040" strokeWidth={5} />
        <path d="M1500,860 C1440,700 1280,640 1160,700 L1160,860Z" fill="#f0c8a0" stroke="#8a6040" strokeWidth={5} />
      </g>
      <Pill x={960} y={300} text={hands > 0.3 ? 'Y PODEMOS PROTEGERLOS' : 'SOMOS NOSOTROS'} color={hands > 0.3 ? C.green : C.red} size={36} s={pop(t, 1.2)} />
    </Stage>); };

// 45 · Cierre: tarjeta del video del tiburón + comentarios
const s45 = (p) => { const { t } = p; const d = D(p);
  const ar = 20 * Math.sin(t * 6);
  return (
    <Stage {...p} env={{ theme: 'blue' }} cam={{ keys: [[0, 960, 520, 1.15, -1], [2.5, 1100, 500, 1.4, 2], [5, 960, 560, 1.2, -2], [7.5, 800, 620, 1.4, 1], [d, 960, 560, 1.15, 0]] }}>
      <g transform={`translate(1150 470) scale(${pop(t, 0.4)}) rotate(${-2 + 2 * Math.sin(t)})`}>
        <rect x={-260} y={-150} width={520} height={300} rx={18} fill="#0b3d6b" stroke="#fff" strokeWidth={6} />
        <Shark x={20} y={-10} s={0.5} t={t} seed={95} speed={0.8} />
        <text x={0} y={120} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={C.gold}>CÓMO CAZA EL TIBURÓN BLANCO</text>
      </g>
      <g transform={`translate(${720 + ar} 470)`}><path d="M0,-30 L80,-30 L80,-60 L140,0 L80,60 L80,30 L0,30Z" fill={C.gold} stroke="#000" strokeWidth={4} /></g>
      {[...Array(4)].map((_, k) => { const s = pop(t, d * 0.45 + k * 0.3); const y = 820 - ramp(t, d * 0.45 + k * 0.3, d) * 120; return <g key={k} transform={`translate(${520 + k * 300} ${y}) scale(${s})`}><path d="M-80,-44 H80 V30 H-10 L-30,54 L-30,30 H-80Z" fill="#fff" stroke="#0f2240" strokeWidth={4} /><text y={10} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={26} fill="#0f2240">{['¿HIENA?', '¿LOBO?', '¿ÁGUILA?', '¿JAGUAR?'][k]}</text></g>; })}
      <Txt x={960} y={230} size={54} color={C.gold} s={pop(t, d * 0.4)}>¿QUÉ DEPREDADOR SIGUE?</Txt>
    </Stage>); };

export const SB = [s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45];
