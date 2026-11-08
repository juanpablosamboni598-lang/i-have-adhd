// v15 · El tardígrado (38 escenas)
import React from 'react';
import { C, FONT, cl, lerp, ramp, ease, eo, seg, pop, mod, rng, pathPts, Pill, Ring, Counter } from './lib.jsx';
import { Stage } from './stage.jsx';
import { Shark, Splash, BubbleTrail, Diver } from './actors.jsx';
import { Person } from './actors2.jsx';
import { Thermo, Gauge, LandBack, Ground } from './lands.jsx';
import { Tardi, MicroBack, Moss, Waterfilm, Microscope } from './actors3.jsx';
import { Txt, land } from './scenes14a.jsx';

const D = (p) => p.frames / 30;
const micro = (extra = {}) => ({ custom: (cam) => <MicroBack cam={cam} t={extra.t || 0} seed={extra.seed || 1} tint={extra.tint} />, rays: false, fish: false, ...extra });
const space = { custom: () => <rect x={-200} y={-200} width={2400} height={1500} fill="#050818" />, rays: false, fish: false };
const Stars = ({ t }) => <g>{[...Array(80)].map((_, k) => <circle key={k} cx={(k * 211) % 1920} cy={(k * 97) % 1080} r={1 + (k % 3)} fill="#fff" opacity={0.4 + 0.6 * Math.abs(Math.sin(t * 2 + k))} />)}</g>;

const S = {};
S.apertura = (p) => { const { t } = p; const d = D(p);
  const ph = Math.min(4, Math.floor((t / d) * 5));
  const env = ph === 0 ? micro({ t }) : ph === 1 ? { theme: 'cold' } : ph === 2 ? land('dusk', { t }) : ph === 3 ? { theme: 'deep' } : space;
  return (
    <Stage {...p} env={env} light={(tt) => 1 + 0.3 * Math.max(0, 1 - mod(tt, d / 5) * 4)} cam={{ keys: [[0, 960, 560, 1.4, -2], [d * 0.2, 960, 540, 1.7, 2], [d * 0.4, 980, 560, 1.3, -1], [d * 0.6, 940, 540, 1.6, 2], [d * 0.8, 960, 520, 1.2, -2], [d, 960, 540, 1.5, 1]], shake: (tt) => Math.max(0, 1 - mod(tt, d / 5) * 3) * 0.4 }}>
      {ph === 4 && <Stars t={t} />}
      <Tardi x={960} y={560} s={1.5} t={t} walk={ph === 0 ? 1 : 0.2} tun={ph > 0 ? 0.8 : 0} rot={ph === 4 ? t * 20 : 0} />
      {ph === 1 && [...Array(14)].map((_, k) => <text key={k} x={(k * 151) % 1920} y={mod(k * 97 + t * 120, 1080)} fontSize={40} fill="#e8f7ff" opacity={0.6}>❄</text>)}
      {ph === 2 && [...Array(10)].map((_, k) => { const u = mod(t + k / 10, 1); return <circle key={k} cx={700 + k * 55} cy={760 - u * 300} r={10 + u * 20} fill="none" stroke="#fff" strokeWidth={4} opacity={1 - u} />; })}
      {ph === 3 && [0, 1].map((k) => <path key={k} d={`M${560 + k * 800},${200 + 30 * Math.sin(t * 6)} l0,180 l-30,-30 m30,30 l30,-30`} stroke={C.cyan} strokeWidth={14} fill="none" transform={`rotate(${k ? -35 : 35} ${560 + k * 800} 300)`} />)}
      <Pill x={960} y={300} text={['0,5 MM', '−273 °C', 'HIRVIENDO', '6× LA PRESIÓN DEL FONDO DEL MAR', 'EL ESPACIO'][ph]} color={[C.green, C.cyan, C.red, C.gold, C.purple][ph]} size={36} s={pop(t, (ph * d) / 5 + 0.1)} />
    </Stage>); };

S.titulo = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={micro({ t, seed: 2 })} cam={{ keys: [[0, 960, 600, 1.3, -2], [2.6, 960, 520, 1.05, 1], [5.2, 960, 560, 1.2, -1], [7.8, 1100, 620, 1.45, 2], [d, 960, 580, 1.15, 0]] }}>
      <Moss t={t} y={900} />
      <Tardi x={lerp(400, 1300, t / d)} y={780} s={0.9} t={t} walk={1} />
      <Txt x={960} y={300} size={130} s={pop(t, 0.3)} rot={-3 + 2 * Math.sin(t)}>EL TARDÍGRADO</Txt>
      <Txt x={960} y={410} size={52} color={C.gold} s={pop(t, 1.2)}>EL ANIMAL MÁS RESISTENTE</Txt>
      <Pill x={1400} y={540} text="¿SU PUNTO DÉBIL?" color={C.red} size={30} s={pop(t, d * 0.7)} />
    </Stage>); };

S.zoom_musgo = (p) => { const { t } = p; const d = D(p);
  const z = seg(t, d * 0.35, d * 0.75);
  return (
    <Stage {...p} env={z < 0.5 ? land('river', { t }) : micro({ t, seed: 3 })} cam={{ keys: [[0, 900, 560, 1.1, 1], [2.6, 1000, 580, 1.4, -2], [d * 0.55, 1100, 600, 2.2, 1], [d * 0.8, 960, 600, 1.3, -1], [d, 960, 620, 1.5, 2]] }}>
      {z < 0.5 ? <g><rect x={500} y={300} width={300} height={600} fill="#8a8a7a" stroke="#555" strokeWidth={4} />
        {[...Array(20)].map((_, k) => <circle key={k} cx={520 + (k % 5) * 60} cy={560 + Math.floor(k / 5) * 40} r={30} fill="#4f9a3a" />)}
        <Person x={1250} y={800} s={1.2} t={t} arms={0.6} shirt="#e67e22" /><Microscope x={1000} y={620} s={1} t={t} /></g>
        : <g><Moss t={t} y={900} /><Tardi x={lerp(1500, 960, eo(ramp(t, d * 0.55, d)))} y={760} s={1.1} t={t} walk={1} flip /></g>}
      <circle cx={960} cy={540} r={lerp(1400, 520, z) * (z < 1 ? 1 : 1)} fill="none" stroke="#000" strokeWidth={lerp(0, 900, z * (1 - z) * 4)} opacity={0.85} />
    </Stage>); };

S.anatomia = (p) => { const { t } = p; const d = D(p);
  const labels = [['8 PATAS', -30, 120, 0.25], ['GARRAS', 180, 170, 0.45], ['SEGMENTOS', -60, -150, 0.6]];
  return (
    <Stage {...p} env={micro({ t, seed: 4 })} cam={{ keys: [[0, 960, 560, 1.15, -1], [2.6, 900, 600, 1.6, 2], [5.2, 1000, 520, 1.4, -2], [7.8, 960, 560, 1.25, 1], [d, 960, 560, 1.4, 0]] }}>
      <Tardi x={960} y={540} s={2.2} t={t} walk={0.6} />
      {labels.map(([n, dx, dy, fr], k) => <g key={k}><line x1={960 + dx * 1.5} y1={540 + dy} x2={960 + dx * 2.6} y2={540 + dy * 1.6} stroke="#fff" strokeWidth={3} opacity={ramp(t, d * fr, d * fr + 0.3)} /><Pill x={960 + dx * 2.6} y={540 + dy * 1.6} text={n} size={28} s={pop(t, d * fr)} /></g>)}
      <Pill x={1450} y={250} text="1773 · «OSITO DE AGUA»" color={C.gold} size={30} s={pop(t, d * 0.78)} />
    </Stage>); };

S.escala = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={micro({ t, seed: 5, tint: '#6f8fa0' })} cam={{ keys: [[0, 960, 560, 1.0, 0], [2.6, 820, 560, 1.4, -2], [5.2, 1150, 560, 1.6, 2], [7.8, 960, 520, 1.3, -1], [d, 960, 560, 1.2, 1]] }}>
      <rect x={250} y={250} width={560} height={560} rx={30} fill="#f4f4f0" stroke="#bbb" strokeWidth={6} transform={`rotate(${8 + 2 * Math.sin(t)} 530 530)`} />
      {[0, 1, 2].map((k) => <Tardi key={k} x={420 + (k % 2) * 200} y={420 + Math.floor(k / 2) * 230 + k * 40} s={0.45} t={t} seed={k + 3} walk={0.8} />)}
      <Txt x={530} y={890} size={36} s={pop(t, 0.6)}>UN GRANO DE SAL</Txt>
      <rect x={1100} y={100} width={150} height={880} rx={70} fill="#6b4a2a" opacity={0.85} transform={`rotate(${-6} 1175 540)`} />
      <Tardi x={1400} y={560} s={0.55} t={t} seed={8} walk={0.8} />
      <Txt x={1300} y={890} size={36} s={pop(t, d * 0.4)}>UN CABELLO</Txt>
      {[['CEREBRO', 0.6], ['MÚSCULOS', 0.7], ['OJOS', 0.8]].map(([n, fr], k) => <Pill key={k} x={1600} y={300 + k * 110} text={n} size={26} color={C.cyan} s={pop(t, d * fr)} />)}
    </Stage>); };

S.come = (p) => { const { t } = p; const d = D(p);
  const pierce = Math.max(0, Math.sin(t * 2.5)) * ramp(t, d * 0.3, d * 0.4);
  return (
    <Stage {...p} env={micro({ t, seed: 6 })} cam={{ keys: [[0, 960, 560, 1.2, 1], [2.6, 1150, 520, 1.7, -2], [5.2, 1250, 540, 2.1, 1], [7.8, 1050, 560, 1.4, -1], [d, 960, 560, 1.25, 0]] }}>
      {[...Array(6)].map((_, k) => { const empt = k === 2 ? ramp(t, d * 0.45, d * 0.8) : 0; return <g key={k}><rect x={1300 + (k % 3) * 150} y={300 + Math.floor(k / 3) * 220} width={140} height={200} rx={24} fill="#7fd36a" stroke="#3d7a2a" strokeWidth={5} /><ellipse cx={1370 + (k % 3) * 150} cy={400 + Math.floor(k / 3) * 220} rx={40 * (1 - empt)} ry={50 * (1 - empt)} fill="#2e8a3a" /></g>; })}
      <Tardi x={1000} y={480} s={1.3} t={t} walk={0.3} />
      <path d={`M1195,${495} l${60 + pierce * 120},${-10}`} stroke="#5a4a32" strokeWidth={5} /><path d={`M1195,${505} l${60 + pierce * 120},${0}`} stroke="#5a4a32" strokeWidth={5} />
      {pierce > 0.3 && [...Array(6)].map((_, k) => { const u = mod(t * 1.5 + k / 6, 1); return <circle key={k} cx={lerp(1440, 1200, u)} cy={500 + 6 * Math.sin(k)} r={6} fill="#2e8a3a" />; })}
      <Pill x={1000} y={260} text="ESTILETES: DOS AGUJAS" color={C.gold} size={30} s={pop(t, d * 0.25)} />
    </Stage>); };

S.respira = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={micro({ t, seed: 7 })} cam={{ keys: [[0, 960, 560, 1.2, -2], [2.5, 900, 540, 1.6, 2], [5, 1050, 580, 1.4, -1], [d, 960, 560, 1.3, 1]] }}>
      <Tardi x={960} y={560} s={2} t={t} walk={0.4} />
      {[...Array(24)].map((_, k) => { const a = k * 0.26, u = mod(t * 0.5 + k / 24, 1); const r = lerp(520, 160, u); return <g key={k} opacity={u < 0.9 ? 1 : 0}><circle cx={960 + Math.cos(a) * r} cy={560 + Math.sin(a) * r * 0.6} r={9} fill={C.cyan} /><text x={960 + Math.cos(a) * r - 9} y={560 + Math.sin(a) * r * 0.6 + 5} fontSize={11} fontFamily={FONT} fontWeight={900} fill="#0f2240">O₂</text></g>; })}
      <g transform="translate(400 260)"><path d="M0,10 C-30,-14 -14,-34 0,-18 C14,-34 30,-14 0,10Z" fill={C.red} transform="scale(2.2)" /><path d="M-50,-50 L50,50 M50,-50 L-50,50" stroke="#fff" strokeWidth={10} opacity={pop(t, d * 0.2) > 0.5 ? 1 : 0} /></g>
      <Pill x={960} y={240} text="RESPIRA POR LA PIEL" color={C.cyan} size={32} s={pop(t, d * 0.45)} />
    </Stage>); };

S.muda = (p) => { const { t } = p; const d = D(p);
  const out = ramp(t, d * 0.15, d * 0.45);
  return (
    <Stage {...p} env={micro({ t, seed: 8 })} cam={{ keys: [[0, 900, 560, 1.3, 1], [2.6, 1000, 560, 1.6, -2], [5.2, 1150, 580, 1.4, 2], [7.8, 900, 560, 1.7, -1], [d, 960, 560, 1.3, 0]] }}>
      <Tardi x={800} y={560} s={1.6} t={t} walk={0} color="#efe6d0" opacity={0.45} />
      {[0, 1, 2, 3].map((k) => <ellipse key={k} cx={760 + (k % 2) * 60} cy={560 + Math.floor(k / 2) * 30} rx={20 * pop(t, d * 0.55 + k * 0.2)} ry={16 * pop(t, d * 0.55 + k * 0.2)} fill="#f6e7a8" stroke="#b39a52" strokeWidth={3} />)}
      <Tardi x={lerp(800, 1350, out)} y={560} s={1.6} t={t} walk={out > 0 && out < 1 ? 1 : 0.3} />
      <Pill x={800} y={300} text="LA PIEL VIEJA = CUNA" color={C.gold} size={30} s={pop(t, d * 0.6)} />
    </Stage>); };

S.crias = (p) => { const { t } = p; const d = D(p);
  const n = Math.min(12, 1 + Math.floor(ramp(t, d * 0.3, d) * 11));
  return (
    <Stage {...p} env={micro({ t, seed: 9 })} cam={{ keys: [[0, 960, 560, 1.6, -1], [2.6, 960, 560, 1.3, 2], [5.2, 960, 540, 1.1, -2], [d, 960, 560, 1.0, 1]] }}>
      <Moss t={t} y={940} />
      {[...Array(n)].map((_, k) => { const a = k * 2.4, r = 60 + k * 30; return <Tardi key={k} x={960 + Math.cos(a) * r * 1.6} y={560 + Math.sin(a) * r * 0.6} s={k === 0 ? 0.8 : 0.4 * pop(t, d * 0.3 + k * 0.4)} t={t} seed={k} walk={0.8} flip={k % 2 === 1} />; })}
      <Pill x={960} y={260} text="SIN NECESIDAD DE MACHOS" color={C.purple} size={30} s={pop(t, d * 0.35)} />
    </Stage>); };

S.en_todas_partes = (p) => { const { t } = p; const d = D(p);
  const places = [['HIMALAYA', 380, 380], ['FONDO DEL MAR', 760, 720], ['ANTÁRTIDA', 1100, 860], ['SELVAS', 1300, 520], ['TU JARDÍN', 1550, 420]];
  return (
    <Stage {...p} env={{ theme: 'map', rays: false, ridges: false, fish: false }} cam={{ keys: [[0, 700, 540, 1.3, -1], [2.5, 900, 600, 1.15, 2], [5, 1200, 560, 1.4, -2], [7.5, 1100, 560, 1.1, 1], [d, 960, 560, 1.25, 0]] }}>
      <path d="M200,300 C400,200 700,250 800,400 C850,500 700,600 600,560 C450,520 250,450 200,300Z M1000,350 C1200,250 1600,300 1700,450 C1650,600 1300,650 1150,560 C1050,500 980,430 1000,350Z M700,820 C900,780 1300,800 1500,860 L1500,950 L700,950Z" fill="#c9a86a" stroke="#8b6e3c" strokeWidth={5} />
      {places.map(([n, x, y], k) => { const s = pop(t, d * (0.12 + k * 0.15)); return <g key={k}><g transform={`translate(${x} ${y}) scale(${s})`}><circle r={20} fill={C.red} /><Tardi x={0} y={-60} s={0.25} t={t} seed={k} walk={1} /></g><Pill x={x} y={y + 60} text={n} size={22} s={s} /></g>; })}
      <Counter x={960} y={170} t={t} t0={d * 0.75} t1={d * 0.95} v1={1300} size={64} color={C.gold} suffix="+ ESPECIES" />
    </Stage>); };

S.nombre = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={micro({ t, seed: 10 })} cam={{ focus: (tt) => [lerp(500, 1300, tt / d), 640], zamt: 0.7 }}>
      <Moss t={t} y={900} />
      <Tardi x={lerp(500, 1300, t / d)} y={760} s={1.2} t={t} walk={0.5} rot={4 * Math.sin(t * 3)} />
      {[...Array(8)].map((_, k) => <ellipse key={k} cx={500 + k * 110} cy={830} rx={16} ry={6} fill="#2d5a32" opacity={t / d > k / 8 ? 0.8 : 0} />)}
      <Pill x={lerp(500, 1300, t / d)} y={420} text="«EL QUE CAMINA DESPACIO»" color={C.gold} size={30} s={pop(t, 0.6)} />
    </Stage>); };

S.agua = (p) => { const { t } = p; const d = D(p);
  const dry = ramp(t, d * 0.55, d * 0.9);
  return (
    <Stage {...p} env={micro({ t, seed: 11, tint: dry > 0.5 ? '#8f7a4a' : undefined })} light={(tt) => 1 + 0.3 * dry} cam={{ keys: [[0, 960, 600, 1.3, -1], [2.6, 960, 620, 1.6, 2], [5.2, 1000, 600, 1.4, -2], [7.8, 960, 620, 1.7, 1], [d, 960, 600, 1.3, 0]] }}>
      <ellipse cx={960} cy={760} rx={lerp(700, 120, dry)} ry={lerp(140, 20, dry)} fill="#8fd6ff" opacity={0.7} stroke="#e6fbff" strokeWidth={6} />
      <Tardi x={960} y={680} s={1.2} t={t} walk={lerp(1, 0.1, dry)} />
      <Waterfilm t={t} y={800} on={1 - dry} />
      <Pill x={960} y={330} text={dry > 0.4 ? 'EL CHARCO SE SECA…' : 'NECESITA UNA CAPA DE AGUA'} color={dry > 0.4 ? C.red : C.cyan} size={32} s={pop(t, dry > 0.4 ? d * 0.6 : 0.6)} />
    </Stage>); };

S.barril = (p) => { const { t } = p; const d = D(p);
  const tun = seg(t, d * 0.2, d * 0.6);
  return (
    <Stage {...p} env={micro({ t, seed: 12, tint: '#8f7a4a' })} cam={{ keys: [[0, 960, 560, 1.2, -2], [2.5, 960, 560, 1.7, 2], [5, 1000, 540, 2.1, -1], [7.5, 960, 560, 1.5, 1], [d, 960, 560, 1.3, 0]] }}>
      <Tardi x={960} y={560} s={1.8} t={t} walk={1 - tun} tun={tun} />
      {[...Array(10)].map((_, k) => { const u = mod(t * 0.8 + k / 10, 1) * (tun > 0 && tun < 1 ? 1 : 0); return <circle key={k} cx={960 + Math.cos(k) * (100 + u * 300)} cy={560 + Math.sin(k) * (60 + u * 200)} r={8} fill="#8fd6ff" opacity={1 - u} />; })}
      <Pill x={960} y={260} text="«TUN»: UN BARRIL" color={C.gold} size={34} s={pop(t, d * 0.65)} />
    </Stage>); };

S.metabolismo = (p) => { const { t } = p; const d = D(p);
  const water = lerp(100, 3, ramp(t, 0.5, d * 0.45)); const meta = lerp(100, 0.01, ramp(t, d * 0.45, d * 0.75));
  return (
    <Stage {...p} env={micro({ t, seed: 13, tint: '#6f6a5a' })} light={(tt) => 1 - 0.3 * ramp(tt, d * 0.5, d * 0.8)} cam={{ keys: [[0, 960, 560, 1.15, 1], [2.6, 700, 560, 1.4, -2], [5.2, 1200, 560, 1.4, 2], [7.8, 960, 560, 1.6, -1], [d, 960, 560, 1.25, 0]] }}>
      <Tardi x={960} y={560} s={1.5} t={t} walk={0} tun={1} />
      <g transform="translate(450 760)"><rect x={-60} y={-400} width={120} height={400} rx={14} fill="#0f2240" stroke="#fff" strokeWidth={4} /><rect x={-50} y={-390 * (water / 100)} width={100} height={390 * (water / 100)} fill="#8fd6ff" /><Txt x={0} y={60} size={30}>AGUA {Math.round(water)}%</Txt></g>
      <g transform="translate(1470 560)"><circle r={120} fill="#0f2240" stroke="#fff" strokeWidth={5} /><path d={`M0,0 L${100 * Math.cos(-Math.PI / 2 + (meta / 100) * 6)},${100 * Math.sin(-Math.PI / 2 + (meta / 100) * 6)}`} stroke={C.red} strokeWidth={9} strokeLinecap="round" /><Txt x={0} y={180} size={30}>METABOLISMO</Txt></g>
      <Pill x={960} y={260} text="LA VIDA EN PAUSA" color={C.purple} size={34} s={pop(t, d * 0.8)} />
    </Stage>); };

S.azucar = (p) => { const { t } = p; const d = D(p);
  const glass = ramp(t, d * 0.35, d * 0.7);
  return (
    <Stage {...p} env={micro({ t, seed: 14, tint: '#5a7a9a' })} cam={{ keys: [[0, 960, 560, 1.1, -1], [2.5, 960, 560, 1.5, 2], [5, 1000, 540, 1.8, -2], [d, 960, 560, 1.3, 1]] }}>
      <circle cx={960} cy={560} r={330} fill="#e8f4fb" fillOpacity={0.25} stroke="#bcd9ea" strokeWidth={8} />
      {[...Array(20)].map((_, k) => { const a = k * 0.9 + (1 - glass) * t * 2; const r = 80 + (k % 5) * 45; return <g key={k} transform={`translate(${960 + Math.cos(a) * r} ${560 + Math.sin(a) * r}) rotate(${(1 - glass) * t * 100 + k * 20})`}><path d="M-22,0 C-10,-20 10,20 22,0" stroke={k % 2 ? C.purple : C.gold} strokeWidth={9} fill="none" strokeLinecap="round" /></g>; })}
      <circle cx={960} cy={560} r={320} fill="#cfefff" opacity={0.35 * glass} />
      {[...Array(6)].map((_, k) => <path key={k} d={`M${760 + k * 70},${300} l40,520`} stroke="#fff" strokeWidth={6} opacity={0.4 * glass} />)}
      <Pill x={960} y={180} text="UNA FUNDA DE «VIDRIO»" color={C.cyan} size={32} s={pop(t, d * 0.55)} />
    </Stage>); };

S.revivir = (p) => { const { t } = p; const d = D(p);
  const wet = ramp(t, 0.4, d * 0.4); const tun = 1 - seg(t, d * 0.35, d * 0.7);
  return (
    <Stage {...p} env={micro({ t, seed: 15 })} light={(tt) => 0.8 + 0.3 * wet} cam={{ keys: [[0, 960, 560, 1.6, -2], [2.6, 960, 560, 1.3, 2], [5.2, 1050, 580, 1.15, -1], [d, 1200, 600, 1.3, 1]] }}>
      {[...Array(30)].map((_, k) => <circle key={k} cx={(k * 131) % 1920} cy={lerp(-50, 300 + (k % 7) * 100, ramp(t, k * 0.04, k * 0.04 + 1.2))} r={10} fill="#8fd6ff" opacity={0.6 * (1 - ramp(t, 2, 3))} />)}
      <ellipse cx={960} cy={720} rx={700 * wet} ry={120 * wet} fill="#8fd6ff" opacity={0.5} />
      <Tardi x={lerp(960, 1300, ramp(t, d * 0.7, d))} y={620} s={1.4} t={t} tun={tun} walk={1 - tun} glow={ramp(t, d * 0.35, d * 0.55) * (1 - ramp(t, d * 0.75, d))} />
      <Pill x={960} y={260} text="¡VUELVE A CAMINAR!" color={C.green} size={34} s={pop(t, d * 0.72)} />
    </Stage>); };

S.puente_frio = (p) => { const { t } = p; const d = D(p);
  const tests = ['FRÍO', 'CALOR', 'PRESIÓN', 'RADIACIÓN', 'ESPACIO'];
  return (
    <Stage {...p} env={{ theme: 'dark', rays: false, fish: false }} cam={{ keys: [[0, 960, 540, 1.2, -2], [2.4, 760, 540, 1.5, 2], [4.8, 1200, 540, 1.3, -1], [d, 960, 560, 1.15, 1]] }}>
      <rect x={260} y={420} width={1400} height={260} rx={30} fill="#0f2240" stroke="#9fd4f5" strokeWidth={5} />
      {tests.map((n, k) => <g key={k} transform={`translate(${400 + k * 280} 550) scale(${pop(t, 0.4 + k * 0.3)})`}><rect x={-110} y={-80} width={220} height={160} rx={18} fill={k === 0 ? '#16507a' : '#1a2f4a'} stroke={k === 0 ? C.cyan : '#4a6a8a'} strokeWidth={5} /><Txt x={0} y={14} size={30} color={k === 0 ? C.cyan : '#fff'}>{n}</Txt></g>)}
      <Tardi x={lerp(300, 400, ramp(t, d * 0.5, d))} y={840} s={0.6} t={t} walk={1} tun={ramp(t, d * 0.7, d)} />
    </Stage>); };

S.frio = (p) => { const { t } = p; const d = D(p);
  const temp = lerp(20, -273, eo(ramp(t, 0.4, d * 0.7)));
  return (
    <Stage {...p} env={{ theme: 'cold', rays: false, fish: false }} light={(tt) => 1 + 0.2 * ramp(tt, 1, d * 0.7)} cam={{ keys: [[0, 960, 560, 1.15, -1], [2.6, 900, 560, 1.5, 2], [5.2, 1100, 540, 1.3, -2], [d, 960, 560, 1.6, 1]] }}
      hud={() => <Thermo x={1650} y={480} v={cl((temp + 273) / 300)} t={t} col={C.cyan} label={`${Math.round(temp)} °C`} />}>
      {[...Array(30)].map((_, k) => <text key={k} x={(k * 167) % 1920} y={mod(k * 89 + t * 80, 1080)} fontSize={30 + (k % 3) * 14} fill="#e8f7ff" opacity={0.6} transform={`rotate(${t * 40 + k * 20} ${(k * 167) % 1920} ${mod(k * 89 + t * 80, 1080)})`}>❄</text>)}
      <g transform="translate(900 560)"><rect x={-260} y={-200} width={520} height={400} rx={30} fill="#d8f0ff" fillOpacity={0.5 * ramp(t, 1, d * 0.7)} stroke="#fff" strokeWidth={6} /></g>
      <Tardi x={900} y={560} s={1.4} t={t} tun={1} walk={0} color="#cfdde6" />
      <Pill x={900} y={240} text="CASI EL CERO ABSOLUTO" color={C.cyan} size={32} s={pop(t, d * 0.6)} />
    </Stage>); };

S.calor = (p) => { const { t } = p; const d = D(p);
  const temp = lerp(20, 151, eo(ramp(t, 0.3, d * 0.7)));
  return (
    <Stage {...p} env={{ theme: 'dusk', rays: false, fish: false }} light={(tt) => 1 + 0.25 * ramp(tt, 0.5, d * 0.7)} cam={{ keys: [[0, 900, 600, 1.4, 2], [2.4, 960, 580, 1.15, -1], [4.8, 1000, 600, 1.5, 2], [d, 960, 600, 1.3, -1]] }}
      hud={() => <Thermo x={1650} y={480} v={cl(temp / 160)} t={t} col={C.red} label={`${Math.round(temp)} °C`} />}>
      <path d="M560,820 L1360,820 L1300,980 L620,980Z" fill="#555" stroke="#222" strokeWidth={6} />
      {[...Array(8)].map((_, k) => <path key={k} d={`M${620 + k * 90},1000 q20,-${40 + 20 * Math.sin(t * 8 + k)} 0,-${80 + 30 * Math.sin(t * 6 + k)}`} stroke={k % 2 ? '#ff7b39' : C.gold} strokeWidth={12} fill="none" strokeLinecap="round" />)}
      {[...Array(14)].map((_, k) => { const u = mod(t * 0.8 + k / 14, 1); return <circle key={k} cx={700 + (k * 53) % 520} cy={800 - u * 400} r={10 + u * 26} fill="none" stroke="#fff" strokeWidth={4} opacity={1 - u} />; })}
      <Tardi x={960} y={720} s={1.1} t={t} tun={1} walk={0} />
      <Pill x={960} y={330} text="MÁS QUE EL AGUA HIRVIENDO" color={C.red} size={30} s={pop(t, d * 0.55)} />
    </Stage>); };

S.presion = (p) => { const { t } = p; const d = D(p);
  const press = ramp(t, 0.5, d * 0.7);
  return (
    <Stage {...p} env={{ theme: 'deep' }} cam={{ keys: [[0, 960, 560, 1.15, 0], [2.5, 960, 600, 1.5, -2], [5, 960, 560, 1.8, 2], [d, 960, 560, 1.3, -1]], shake: (tt) => press * 0.2 }}>
      <rect x={760} y={lerp(100, 300, press)} width={400} height={60} fill="#7f8c8d" stroke="#2c3e50" strokeWidth={6} /><rect x={930} y={-200} width={60} height={lerp(300, 500, press)} fill="#7f8c8d" />
      <rect x={760} y={760} width={400} height={60} fill="#7f8c8d" stroke="#2c3e50" strokeWidth={6} />
      <Tardi x={960} y={lerp(560, 640, press)} s={lerp(1.2, 0.9, press)} t={t} tun={1} walk={0} />
      {[...Array(6)].map((_, k) => <path key={k} d={`M${660 + k * 120},${200 + press * 100} l0,90 l-20,-20 m20,20 l20,-20`} stroke={C.cyan} strokeWidth={8} fill="none" opacity={press} />)}
      <Shark x={lerp(-300, 400, t / d)} y={900} s={0.3} t={t} seed={1} speed={0.6} opacity={0.6} />
      <Pill x={1450} y={300} text="6× LA FOSA DE LAS MARIANAS" color={C.gold} size={28} s={pop(t, d * 0.6)} />
    </Stage>); };

S.radiacion = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={{ theme: 'dark', rays: false, fish: false }} light={(tt) => 1 + 0.25 * Math.abs(Math.sin(tt * 6)) * ramp(tt, 1, 2)} cam={{ keys: [[0, 960, 560, 1.2, 2], [2.4, 1000, 560, 1.6, -2], [4.8, 900, 560, 1.4, 1], [d, 960, 560, 1.25, 0]] }}>
      <g transform={`translate(400 300) rotate(${t * 60})`}>{[0, 1, 2].map((k) => <path key={k} d="M0,0 L80,-46 A92,92 0 0,1 80,46Z" fill={C.gold} transform={`rotate(${k * 120})`} />)}<circle r={22} fill="#111" stroke={C.gold} strokeWidth={6} /></g>
      {[...Array(18)].map((_, k) => { const u = mod(t * 1.2 + k / 18, 1); return <line key={k} x1={lerp(450, 960, u)} y1={lerp(330, 560, u) + (k - 9) * 14} x2={lerp(450, 960, u) - 40} y2={lerp(330, 560, u) + (k - 9) * 14 - 18} stroke={C.green} strokeWidth={5} opacity={1 - u} />; })}
      <Tardi x={960} y={580} s={1.3} t={t} tun={1} walk={0} glow={0.6} />
      <Person x={1450} y={760} s={1} t={t} shirt="#888" /><Txt x={1450} y={880} size={34} color={C.red} s={pop(t, d * 0.5)}>×1000</Txt>
    </Stage>); };

S.puente_espacio = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={space} cam={{ keys: [[0, 960, 900, 1.3, -1], [d * 0.5, 960, 560, 1.1, 1], [d, 960, 300, 1.4, -2]] }}>
      <Stars t={t} />
      <circle cx={960} cy={1500} r={700} fill="#2e86c4" stroke="#9fd4f5" strokeWidth={10} />
      <g transform={`translate(960 ${lerp(900, 250, eo(t / d))})`}><path d="M-30,60 L-30,-60 L0,-110 L30,-60 L30,60Z" fill="#ecf0f1" stroke="#555" strokeWidth={4} /><path d={`M-20,60 L0,${110 + 20 * Math.sin(t * 30)} L20,60Z`} fill={C.gold} /></g>
    </Stage>); };

S.espacio = (p) => { const { t } = p; const d = D(p);
  const day = Math.min(10, 1 + Math.floor(ramp(t, d * 0.35, d * 0.9) * 10));
  return (
    <Stage {...p} env={space} cam={{ keys: [[0, 960, 540, 1.2, -2], [2.6, 1000, 540, 1.5, 2], [5.2, 960, 560, 1.8, -1], [7.8, 900, 540, 1.4, 2], [d, 960, 540, 1.25, 0]] }}>
      <Stars t={t} />
      <path d="M-200,1100 Q960,800 2200,1100 L2200,1400 L-200,1400Z" fill="#2e86c4" />
      <g transform={`translate(960 540) rotate(${t * 5})`}><circle r={150} fill="#c0c4cc" stroke="#555" strokeWidth={6} /><rect x={-330} y={-26} width={160} height={52} fill="#2e6bd1" /><rect x={170} y={-26} width={160} height={52} fill="#2e6bd1" />
        <circle r={90} fill="#0b0f18" stroke={C.gold} strokeWidth={4} />{[0, 1, 2].map((k) => <Tardi key={k} x={-40 + k * 40} y={-20 + (k % 2) * 40} s={0.12} t={t} tun={1} walk={0} seed={k} />)}</g>
      <g transform="translate(1600 220)"><rect x={-90} y={-60} width={180} height={120} rx={14} fill="#fff" stroke="#333" strokeWidth={4} /><text y={22} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill="#222">DÍA {day}</text></g>
      <Pill x={480} y={260} text="2007 · VACÍO DEL ESPACIO" color={C.purple} size={30} s={pop(t, 0.8)} />
    </Stage>); };

S.regreso = (p) => { const { t } = p; const d = D(p);
  const water = ramp(t, d * 0.25, d * 0.4); const wake = ramp(t, d * 0.4, d * 0.65);
  return (
    <Stage {...p} env={micro({ t, seed: 16 })} cam={{ keys: [[0, 960, 400, 1.4, 1], [2.6, 960, 560, 1.2, -2], [5.2, 960, 600, 1.5, 2], [7.8, 1100, 600, 1.3, -1], [d, 960, 580, 1.2, 0]] }}>
      <path d={`M960,${lerp(-200, 300, eo(ramp(t, 0, d * 0.25)))} m-60,0 a60,90 0 1,0 120,0 a60,90 0 1,0 -120,0`} fill="#d35400" opacity={1 - water} />
      <ellipse cx={960} cy={760} rx={700 * water} ry={110 * water} fill="#8fd6ff" opacity={0.6} />
      {[0, 1, 2, 3, 4].map((k) => { const w = k < 3 ? wake : 0; return <Tardi key={k} x={560 + k * 200} y={650} s={0.5} t={t} seed={k} tun={1 - w} walk={w} opacity={k < 3 ? 1 : 0.5} color={k < 3 ? '#d9c7a3' : '#8a7f6a'} />; })}
      {[0, 1].map((k) => <ellipse key={k} cx={610 + k * 200} cy={720} rx={14 * pop(t, d * 0.75 + k * 0.3)} ry={10 * pop(t, d * 0.75 + k * 0.3)} fill="#f6e7a8" stroke="#b39a52" strokeWidth={3} />)}
      <Pill x={960} y={270} text="¡MUCHOS DESPERTARON!" color={C.green} size={32} s={pop(t, d * 0.5)} />
    </Stage>); };

S.ultravioleta = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={space} light={(tt) => 1 + 0.2 * Math.abs(Math.sin(tt * 4))} cam={{ keys: [[0, 900, 540, 1.2, 2], [2.6, 1000, 540, 1.5, -2], [5.2, 960, 560, 1.3, 1], [d, 960, 540, 1.5, -1]] }}>
      <Stars t={t} />
      <circle cx={300} cy={300} r={170} fill="#fff2a0" filter="url(#glow)" />
      {[...Array(14)].map((_, k) => { const u = mod(t * 1.3 + k / 14, 1); return <line key={k} x1={lerp(380, 1100, u)} y1={lerp(360, 600, u) + (k - 7) * 18} x2={lerp(380, 1100, u) - 60} y2={lerp(360, 600, u) + (k - 7) * 18 - 20} stroke="#b388ff" strokeWidth={6} opacity={1 - u} />; })}
      {[0, 1, 2, 3, 4].map((k) => <Tardi key={k} x={1000 + (k % 3) * 220} y={500 + Math.floor(k / 3) * 220} s={0.5} t={t} seed={k} tun={1} walk={0} color={k === 2 ? '#d9c7a3' : '#6a5f4a'} opacity={k === 2 ? 1 : 0.5} glow={k === 2 ? 0.6 : 0} />)}
      <Pill x={1200} y={260} text="SOLO UNOS POCOS SOBREVIVIERON" color={C.purple} size={28} s={pop(t, d * 0.55)} />
    </Stage>); };

S.luna = (p) => { const { t } = p; const d = D(p); const tc = d * 0.45;
  const u = ramp(t, 0.3, tc);
  return (
    <Stage {...p} env={space} light={(tt) => 1 + 0.4 * Math.max(0, 1 - Math.abs(tt - tc) * 3)} cam={{ keys: [[0, 700, 400, 1.2, -2], [2.6, 900, 600, 1.4, 2], [tc, 1100, 760, 1.7, -2], [tc + 2.6, 1050, 760, 1.4, 1], [d, 1000, 720, 1.2, 0]], shake: (tt) => Math.max(0, 1 - Math.abs(tt - tc) * 3) * 0.6 }}>
      <Stars t={t} />
      <circle cx={1000} cy={1600} r={900} fill="#bfc3c8" stroke="#8a8f96" strokeWidth={8} />
      {[...Array(8)].map((_, k) => <circle key={k} cx={500 + k * 150} cy={760 + (k % 3) * 40} r={20 + (k % 4) * 14} fill="#a3a8ae" />)}
      {t < tc ? <g transform={`translate(${lerp(300, 1100, u)} ${lerp(200, 720, u)}) rotate(40)`}><rect x={-40} y={-30} width={80} height={60} fill="#ddd" stroke="#555" strokeWidth={4} /><path d="M-40,30 l-30,40 M40,30 l30,40" stroke="#555" strokeWidth={5} /></g>
        : <g>{[...Array(20)].map((_, k) => { const v = t - tc; return <circle key={k} cx={1100 + Math.cos(k) * v * 300} cy={740 - Math.abs(Math.sin(k)) * v * 200 + v * v * 200} r={8} fill="#999" opacity={Math.max(0, 1 - v / 2)} />; })}<Tardi x={1180} y={760} s={0.25} t={t} tun={1} walk={0} /></g>}
      <Pill x={700} y={300} text="2019 · CHOQUE EN LA LUNA" color={C.gold} size={30} s={pop(t, 0.6)} />
    </Stage>); };

S.canon = (p) => { const { t } = p; const d = D(p);
  const shots = [[d * 0.25, 0.6, true], [d * 0.5, 0.9, true], [d * 0.72, 1.3, false]];
  return (
    <Stage {...p} env={{ theme: 'dark', rays: false, fish: false }} cam={{ keys: [[0, 700, 560, 1.3, -1], [2.6, 960, 560, 1.15, 2], [5.2, 1300, 560, 1.5, -2], [7.8, 1300, 540, 1.8, 1], [d, 1100, 560, 1.3, 0]], shake: (tt) => shots.reduce((a, [ts]) => a + Math.max(0, 1 - Math.abs(tt - ts) * 5), 0) * 0.5 }}>
      <rect x={200} y={500} width={500} height={110} rx={20} fill="#555" stroke="#222" strokeWidth={6} />
      <rect x={1500} y={380} width={60} height={360} fill="#8a6a4a" stroke="#3a2a1a" strokeWidth={5} />
      {shots.map(([ts, v, ok], k) => { const u = (t - ts) / 0.35; if (u < 0) return null; const x = lerp(700, 1500, Math.min(1, u)); return <g key={k}>{u < 1 ? <Tardi x={x} y={555} s={0.2} t={t} tun={1} walk={0} /> : ok ? <Tardi x={1440} y={555 + (k ? 60 : -60)} s={0.25} t={t} tun={1 - ramp(t, ts + 0.8, ts + 2)} walk={ramp(t, ts + 0.8, ts + 2)} /> : [...Array(10)].map((_, j) => <circle key={j} cx={1480 - (t - ts - 0.35) * 200 * Math.cos(j)} cy={555 + (t - ts - 0.35) * 200 * Math.sin(j)} r={5} fill="#d9c7a3" opacity={Math.max(0, 1 - (t - ts))} />)}</g>; })}
      <Gauge x={960} y={300} v={t < shots[2][0] ? (t < shots[1][0] ? 1500 : 3000) : 3600} max={4000} label={t < shots[2][0] ? (t < shots[1][0] ? '1.500 km/h' : '3.000 km/h ✓') : '+3.000 km/h ✗'} t={t} size={0.7} />
    </Stage>); };

S.puente_dna = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={micro({ t, seed: 17, tint: '#4a5a8a' })} cam={{ keys: [[0, 960, 560, 1.1, -2], [d * 0.5, 960, 560, 1.8, 2], [d, 960, 560, 2.4, -1]] }}>
      <Tardi x={960} y={560} s={1.6} t={t} walk={0.4} opacity={1 - ramp(t, d * 0.4, d * 0.7)} />
      <g opacity={ramp(t, d * 0.4, d * 0.7)}>{[...Array(24)].map((_, k) => { const y = 260 + k * 25, a = t * 2 + k * 0.5; return <g key={k}><circle cx={960 + 120 * Math.sin(a)} cy={y} r={10} fill={C.cyan} /><circle cx={960 - 120 * Math.sin(a)} cy={y} r={10} fill={C.purple} /><line x1={960 + 120 * Math.sin(a)} y1={y} x2={960 - 120 * Math.sin(a)} y2={y} stroke="#fff" strokeWidth={3} opacity={0.6} /></g>; })}</g>
    </Stage>); };

S.dsup = (p) => { const { t } = p; const d = D(p);
  const wrap = ramp(t, d * 0.25, d * 0.6);
  return (
    <Stage {...p} env={micro({ t, seed: 18, tint: '#4a5a8a' })} light={(tt) => 1 + 0.2 * Math.abs(Math.sin(tt * 5)) * ramp(tt, d * 0.6, d * 0.7)} cam={{ keys: [[0, 960, 560, 1.2, 1], [2.6, 900, 540, 1.6, -2], [5.2, 1050, 560, 1.4, 2], [d, 960, 560, 1.3, -1]] }}>
      {[...Array(24)].map((_, k) => { const y = 260 + k * 25, a = t * 1.5 + k * 0.5; return <g key={k}><circle cx={960 + 120 * Math.sin(a)} cy={y} r={10} fill={C.cyan} /><circle cx={960 - 120 * Math.sin(a)} cy={y} r={10} fill={C.purple} /><line x1={960 + 120 * Math.sin(a)} y1={y} x2={960 - 120 * Math.sin(a)} y2={y} stroke="#fff" strokeWidth={3} opacity={0.6} /></g>; })}
      <rect x={800} y={lerp(1100, 230, wrap)} width={320} height={640 * wrap} rx={60} fill={C.gold} fillOpacity={0.25} stroke={C.gold} strokeWidth={8} />
      {[...Array(12)].map((_, k) => { const u = mod(t * 1.1 + k / 12, 1); const hit = u > 0.5 && wrap > 0.9; return <line key={k} x1={lerp(200, 790, Math.min(u, 0.5) * 2)} y1={300 + k * 45} x2={lerp(200, 790, Math.min(u, 0.5) * 2) - 50} y2={300 + k * 45 - 20} stroke={C.green} strokeWidth={6} opacity={hit ? 0 : 1 - u} />; })}
      <Pill x={960} y={170} text="PROTEÍNA «DSUP»: UN ESCUDO" color={C.gold} size={32} s={pop(t, d * 0.4)} />
    </Stage>); };

S.celulas_humanas = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={micro({ t, seed: 19, tint: '#8a5a6a' })} cam={{ keys: [[0, 960, 560, 1.15, -1], [2.6, 700, 560, 1.5, 2], [5.2, 1250, 560, 1.5, -2], [7.8, 960, 520, 1.3, 1], [d, 960, 560, 1.2, 0]] }}>
      {[0, 1].map((k) => { const x = k ? 1300 : 620; const prot = k === 1; const dmg = ramp(t, d * 0.35, d * 0.7) * (prot ? 0.25 : 1); return <g key={k}><circle cx={x} cy={560} r={230} fill="#f2c4cf" stroke="#a05a6a" strokeWidth={6} /><circle cx={x} cy={560} r={90} fill="#c27a8f" />{prot && <circle cx={x} cy={560} r={100} fill="none" stroke={C.gold} strokeWidth={8} opacity={pop(t, d * 0.2)} />}
        {[...Array(Math.round(dmg * 10))].map((_, j) => <path key={j} d={`M${x - 70 + j * 14},${520 + (j % 3) * 30} l12,12 m0,-12 l-12,12`} stroke="#5a0010" strokeWidth={5} />)}
        <Txt x={x} y={850} size={30} color={prot ? C.gold : '#fff'} s={pop(t, 0.6 + k * 0.4)}>{prot ? 'CON DSUP' : 'SIN DSUP'}</Txt></g>; })}
      {[...Array(10)].map((_, k) => { const u = mod(t * 1.2 + k / 10, 1); return <line key={k} x1={960} y1={160 + u * 300} x2={(k % 2 ? 1300 : 620) + 20 * Math.sin(k)} y2={360 + u * 100} stroke={C.green} strokeWidth={4} opacity={(1 - u) * ramp(t, d * 0.3, d * 0.35)} />; })}
      <Pill x={960} y={170} text="ASTRONAUTAS · MEDICINA" color={C.cyan} size={28} s={pop(t, d * 0.75)} />
    </Stage>); };

S.treinta_anos = (p) => { const { t } = p; const d = D(p);
  const yr = Math.round(lerp(1983, 2014, ramp(t, d * 0.2, d * 0.55)));
  const thaw = ramp(t, d * 0.55, d * 0.75);
  return (
    <Stage {...p} env={{ theme: 'cold', rays: false, fish: false }} light={(tt) => 1 + 0.15 * thaw} cam={{ keys: [[0, 960, 560, 1.2, -1], [2.6, 900, 560, 1.5, 2], [5.2, 1000, 560, 1.3, -2], [7.8, 960, 580, 1.7, 1], [d, 960, 560, 1.3, 0]] }}>
      <rect x={560} y={260} width={800} height={600} rx={30} fill="#e8f4fb" stroke="#9fc6dc" strokeWidth={8} />
      <rect x={600} y={300} width={720} height={520} rx={20} fill="#9fd4f5" opacity={0.4 * (1 - thaw)} />
      <Moss t={t * (thaw > 0 ? 1 : 0)} y={760} x0={600} x1={1320} />
      {[0, 1].map((k) => <Tardi key={k} x={820 + k * 260} y={620} s={0.55} t={t} seed={k} tun={1 - thaw} walk={thaw} glow={thaw > 0 && thaw < 1 ? 1 : 0} />)}
      <ellipse cx={1150} cy={700} rx={12 * pop(t, d * 0.85)} ry={9 * pop(t, d * 0.85)} fill="#f6e7a8" stroke="#b39a52" strokeWidth={3} />
      <Txt x={960} y={200} size={90} color={C.cyan}>{yr}</Txt>
      <Pill x={1550} y={300} text="30 AÑOS CONGELADOS" color={C.gold} size={28} s={pop(t, d * 0.45)} />
    </Stage>); };

S.puente_debil = (p) => { const { t } = p; const d = D(p);
  const crack = ramp(t, d * 0.5, d * 0.8);
  return (
    <Stage {...p} env={micro({ t, seed: 20 })} cam={{ keys: [[0, 960, 560, 1.15, -2], [2.4, 960, 560, 1.4, 2], [d, 960, 560, 1.7, -1]] }}>
      <Tardi x={960} y={600} s={1.4} t={t} walk={0.5} />
      <g transform="translate(960 300)"><path d="M-80,-30 L-50,-80 L-20,-40 L0,-90 L20,-40 L50,-80 L80,-30 L80,10 L-80,10Z" fill={C.gold} stroke="#8a6500" strokeWidth={5} /><path d={`M-10,-90 L5,${-40 + crack * 20} L-8,${-10 + crack * 30} L6,${10}`} stroke="#111" strokeWidth={6 * crack} fill="none" /></g>
      <Txt x={960} y={180} size={60} color="#fff" s={pop(t, 0.5)}>¿INMORTAL?</Txt>
      <Txt x={1350} y={520} size={70} color={C.red} s={pop(t, d * 0.8)} rot={-8}>NO</Txt>
    </Stage>); };

S.activo = (p) => { const { t } = p; const d = D(p);
  const hot = ramp(t, d * 0.45, d * 0.85);
  return (
    <Stage {...p} env={micro({ t, seed: 21, tint: hot > 0.5 ? '#9a6a4a' : undefined })} light={(tt) => 1 - 0.2 * hot} cam={{ keys: [[0, 900, 560, 1.3, 1], [2.6, 1000, 560, 1.15, -2], [5.2, 960, 580, 1.5, 2], [7.8, 960, 600, 1.8, -1], [d, 960, 580, 1.4, 0]] }}
      hud={() => <g><Thermo x={1650} y={480} v={0.2 + 0.4 * hot} t={t} col={hot > 0.5 ? C.red : '#ff9f43'} label="37 °C" /><g transform="translate(260 220)"><circle r={60} fill="#0f2240" stroke="#fff" strokeWidth={5} /><line x1={0} y1={0} x2={44 * Math.sin(t * 2)} y2={-44 * Math.cos(t * 2)} stroke={C.gold} strokeWidth={7} strokeLinecap="round" /><Txt x={0} y={100} size={26}>24 H</Txt></g></g>}>
      <Moss t={t} y={920} />
      <Tardi x={960} y={720} s={1.2} t={t} walk={lerp(1, 0.05, hot)} rot={hot * 10} opacity={1 - 0.5 * ramp(t, d * 0.85, d)} />
      <Pill x={960} y={330} text="DESPIERTO ES FRÁGIL" color={C.red} size={32} s={pop(t, d * 0.3)} />
    </Stage>); };

S.vida_corta = (p) => { const { t } = p; const d = D(p);
  const u = ramp(t, 0.5, d * 0.9);
  return (
    <Stage {...p} env={micro({ t, seed: 22 })} cam={{ focus: () => [lerp(300, 1600, u), 560], zamt: 0.6 }}>
      <line x1={200} y1={700} x2={1700} y2={700} stroke="#fff" strokeWidth={8} />
      {[...Array(10)].map((_, k) => { const paused = k % 3 === 1; return <rect key={k} x={200 + k * 150} y={680} width={150} height={40} fill={paused ? C.purple : C.green} opacity={u * 10 > k ? 0.9 : 0.2} />; })}
      <Tardi x={lerp(250, 1650, u)} y={600} s={0.6} t={t} walk={Math.floor(u * 10) % 3 === 1 ? 0 : 1} tun={Math.floor(u * 10) % 3 === 1 ? 1 : 0} />
      <Pill x={600} y={360} text="ACTIVO: MESES" color={C.green} size={30} s={pop(t, 0.6)} />
      <Pill x={1300} y={360} text="PAUSA: NO CUENTA" color={C.purple} size={30} s={pop(t, d * 0.5)} />
    </Stage>); };

S.lento = (p) => { const { t } = p; const d = D(p);
  const bite = ramp(t, d * 0.55, d * 0.7);
  return (
    <Stage {...p} env={micro({ t, seed: 23 })} cam={{ keys: [[0, 960, 600, 1.3, -1], [2.6, 800, 600, 1.6, 2], [5.2, 1100, 600, 1.4, -2], [d, 960, 600, 1.3, 1]], shake: (tt) => Math.max(0, 1 - Math.abs(tt - d * 0.6) * 4) * 0.4 }}>
      <Moss t={t} y={940} />
      <Tardi x={lerp(800, 900, bite)} y={760} s={0.9} t={t} walk={0.4} opacity={1 - bite} />
      <g transform={`translate(${lerp(1700, 1000, eo(ramp(t, 0.5, d * 0.6)))} 740)`}>{[...Array(10)].map((_, k) => <circle key={k} cx={k * 34} cy={14 * Math.sin(t * 5 + k * 0.7)} r={26 - k} fill="#c97a8a" stroke="#7a3a4a" strokeWidth={3} />)}<path d={`M-30,0 L-6,${-14 * (1 + bite)} M-30,0 L-6,${14 * (1 + bite)}`} stroke="#7a3a4a" strokeWidth={6} /></g>
      <Pill x={960} y={330} text="LENTO Y DIMINUTO" color={C.red} size={32} s={pop(t, 0.8)} />
    </Stage>); };

S.cierre_idea = (p) => { const { t } = p; const d = D(p);
  const cyc = (Math.sin(t * 1.2) + 1) / 2;
  return (
    <Stage {...p} env={micro({ t, seed: 24, tint: cyc > 0.5 ? '#8f7a4a' : undefined })} cam={{ keys: [[0, 960, 560, 1.2, -2], [2.6, 960, 560, 1.5, 2], [5.2, 960, 560, 1.3, -1], [d, 960, 560, 1.6, 1]] }}>
      <Tardi x={960} y={600} s={1.5} t={t} tun={cyc} walk={1 - cyc} />
      <g transform={`translate(960 ${280}) scale(${pop(t, d * 0.4)})`}><circle r={70} fill="#0f2240" stroke={C.gold} strokeWidth={6} /><path d="M-20,-30 L-20,30 M20,-30 L20,30" stroke="#fff" strokeWidth={14} strokeLinecap="round" opacity={cyc > 0.5 ? 1 : 0} /><path d="M-18,-32 L30,0 L-18,32Z" fill="#fff" opacity={cyc > 0.5 ? 0 : 1} /></g>
      <Pill x={960} y={860} text="SABER ESPERAR" color={C.gold} size={36} s={pop(t, d * 0.6)} />
    </Stage>); };

S.resumen = (p) => { const { t } = p; const d = D(p);
  const tags = ['0,5 MM', '8 PATAS', 'BARRIL', 'ESCUDO DE VIDRIO', 'DSUP'];
  return (
    <Stage {...p} env={micro({ t, seed: 25 })} cam={{ focus: (tt) => [960 + 300 * Math.cos(tt * 0.4), 560], zamt: 0.7 }}>
      <Moss t={t} y={940} />
      <Tardi x={960 + 300 * Math.cos(t * 0.4)} y={700} s={1.1} t={t} walk={1} flip={Math.sin(t * 0.4) > 0} />
      {tags.map((n, k) => { const a = k * 1.25 + t * 0.4; return <Pill key={k} x={960 + 480 * Math.cos(a)} y={480 + 200 * Math.sin(a)} text={n} size={28} color={[C.green, C.gold, C.purple, C.cyan, C.red][k]} s={pop(t, d * (0.12 + k * 0.12))} />; })}
    </Stage>); };

S.cierre = (p) => { const { t } = p; const d = D(p); const tc = d * 0.3;
  const pressed = t > tc;
  const ring = t > d * 0.4 ? 18 * Math.sin((t - d * 0.4) * 22) * Math.exp(-(t - d * 0.4) * 1.5) : 0;
  return (
    <Stage {...p} env={micro({ t, seed: 26 })} cam={{ keys: [[0, 960, 520, 1.2, -2], [2.5, 1000, 470, 1.45, 1], [5, 960, 560, 1.1, -1], [d, 960, 560, 1.25, 0]] }}>
      <Tardi x={lerp(300, 1600, t / d)} y={820} s={0.6} t={t} walk={1} />
      <g transform={`translate(860 450) scale(${pressed ? 1 - 0.08 * Math.max(0, 1 - (t - tc) * 6) : pop(t, 0.2)})`}><rect x={-270} y={-70} width={540} height={140} rx={34} fill={pressed ? '#5a5a5a' : '#e61e28'} /><text x={0} y={22} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={58} fill="#fff">{pressed ? 'SUSCRITO ✓' : 'SUSCRÍBETE'}</text></g>
      <g transform={`translate(1240 450) rotate(${ring})`}><path d="M-40,30 C-40,-40 -25,-60 0,-60 C25,-60 40,-40 40,30 L50,40 L-50,40Z" fill={C.gold} /><circle cy={52} r={11} fill={C.gold} /></g>
      <g transform={`translate(${lerp(1500, 1010, ease(ramp(t, 0.5, tc)))} ${lerp(900, 460, ease(ramp(t, 0.5, tc)))})`}><path d="M0,0 L0,60 L16,46 L28,72 L38,66 L26,42 L46,40Z" fill="#fff" stroke="#000" strokeWidth={3} /></g>
      <Txt x={960} y={250} size={50} color={C.gold} s={pop(t, d * 0.5)}>¿QUÉ ANIMAL SIGUE?</Txt>
    </Stage>); };

export const ORDER15 = ['apertura', 'titulo', 'zoom_musgo', 'anatomia', 'escala', 'come', 'respira', 'muda', 'crias', 'en_todas_partes', 'nombre', 'agua', 'barril', 'metabolismo', 'azucar', 'revivir', 'puente_frio', 'frio', 'calor', 'presion', 'radiacion', 'puente_espacio', 'espacio', 'regreso', 'ultravioleta', 'luna', 'canon', 'puente_dna', 'dsup', 'celulas_humanas', 'treinta_anos', 'puente_debil', 'activo', 'vida_corta', 'lento', 'cierre_idea', 'resumen', 'cierre'];
export const S15 = S;
