// v16 · La mariquita (40 escenas)
import React from 'react';
import { C, FONT, cl, lerp, ramp, ease, eo, seg, pop, mod, rng, pathPts, Pill, Ring, Counter } from './lib.jsx';
import { Stage } from './stage.jsx';
import { Person } from './actors2.jsx';
import { LandBack, Ground, Thermo } from './lands.jsx';
import { Lady, LadySide, Aphid, LadyLarva, Bird, GardenBack, BigLeaf, Microscope } from './actors3.jsx';
import { Txt, land } from './scenes14a.jsx';

const D = (p) => p.frames / 30;
const gar = (extra = {}) => ({ custom: (cam) => <GardenBack cam={cam} t={extra.t || 0} seed={extra.seed || 1} />, rays: false, fish: false, ...extra });
const Aphids = ({ n, t, x0 = 600, y0 = 500, w = 700, h = 200, eaten = 0, seed = 1 }) => { const R = rng(seed); return <g>{[...Array(n)].map((_, k) => { const x = x0 + R() * w, y = y0 + R() * h; return k / n < eaten ? null : <Aphid key={k} x={x} y={y} s={0.8 + R() * 0.5} t={t} seed={k} />; })}</g>; };
const Flower = ({ x, y, s = 1, t, c = '#ff8fb8' }) => <g transform={`translate(${x} ${y}) scale(${s}) rotate(${4 * Math.sin(t + x)})`}><path d="M0,0 L0,200" stroke="#4f9a3a" strokeWidth={10} />{[...Array(6)].map((_, k) => <ellipse key={k} cx={Math.cos(k) * 34} cy={Math.sin(k) * 34} rx={30} ry={18} fill={c} transform={`rotate(${(k * 180) / Math.PI} ${Math.cos(k) * 34} ${Math.sin(k) * 34})`} />)}<circle r={22} fill="#ffd23c" /></g>;

const S = {};
S.apertura = (p) => { const { t } = p; const d = D(p);
  const eaten = ramp(t, d * 0.35, d * 0.95);
  return (
    <Stage {...p} env={gar({ t })} cam={{ keys: [[0, 960, 560, 1.6, -2], [2.6, 960, 560, 1.3, 2], [5.2, 1000, 540, 1.15, -1], [7.8, 1100, 560, 1.4, 1], [d, 960, 560, 1.2, 0]] }}>
      <BigLeaf x={960} y={600} s={1.2} t={t} />
      <Aphids n={40} t={t} x0={500} y0={480} w={900} h={240} eaten={eaten} />
      <Lady x={lerp(500, 1400, eaten)} y={600 + 30 * Math.sin(t * 2)} s={1.3} rot={90} t={t} walk={1} />
      <Counter x={960} y={250} t={t} t0={d * 0.35} t1={d * 0.95} v1={5000} size={80} color={C.red} suffix=" INSECTOS" />
    </Stage>); };

S.titulo = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={gar({ t, seed: 2 })} cam={{ keys: [[0, 960, 520, 1.3, -2], [2.6, 960, 480, 1.05, 1], [5.2, 960, 560, 1.2, -1], [7.8, 1150, 620, 1.45, 2], [d, 960, 560, 1.15, 0]] }}>
      <BigLeaf x={960} y={850} s={1.4} t={t} />
      <LadySide x={lerp(-200, 2100, t / d)} y={620 - 80 * Math.sin(t * 1.5)} s={1} t={t} open={1} />
      <Txt x={960} y={330} size={140} color={C.red} s={pop(t, 0.3)} rot={-3 + 2 * Math.sin(t)}>LA MARIQUITA</Txt>
      {['CAZA', 'DEFENSA', 'COLOR', '1888'].map((n, k) => <Pill key={k} x={480 + k * 320} y={480} text={n} size={30} color={[C.green, C.gold, C.red, C.cyan][k]} s={pop(t, d * 0.35 + k * d * 0.12)} />)}
    </Stage>); };

S.escarabajo = (p) => { const { t } = p; const d = D(p);
  const others = [['MOSCA', 0.15, '#556'], ['ARAÑA', 0.3, '#433']];
  return (
    <Stage {...p} env={gar({ t, seed: 3 })} cam={{ keys: [[0, 960, 560, 1.15, -1], [2.5, 700, 560, 1.4, 2], [5, 1250, 560, 1.5, -2], [d, 960, 560, 1.3, 1]] }}>
      {others.map(([n, fr, c], k) => <g key={k} transform={`translate(${500 + k * 400} 560)`} opacity={1 - ramp(t, d * 0.5, d * 0.6)}><circle r={60} fill={c} />{[...Array(k ? 8 : 6)].map((_, j) => <line key={j} x1={0} y1={0} x2={Math.cos(j * 0.8) * 110} y2={Math.sin(j * 0.8) * 110 + 30} stroke={c} strokeWidth={8} />)}<path d="M-50,-50 L50,50 M50,-50 L-50,50" stroke={C.red} strokeWidth={12} opacity={ramp(t, d * fr + 0.6, d * fr + 0.8)} /><Txt x={0} y={150} size={30}>{n}</Txt></g>)}
      <Lady x={1400} y={540} s={1.4} rot={-20 + 10 * Math.sin(t)} t={t} walk={0.6} />
      <Pill x={1400} y={300} text="¡ES UN ESCARABAJO!" color={C.green} size={32} s={pop(t, d * 0.55)} />
    </Stage>); };

S.alas = (p) => { const { t } = p; const d = D(p);
  const open = seg(t, d * 0.3, d * 0.55);
  return (
    <Stage {...p} env={gar({ t, seed: 4 })} cam={{ keys: [[0, 960, 560, 1.4, 2], [2.6, 960, 540, 1.9, -2], [5.2, 960, 560, 1.6, 1], [7.8, 1000, 560, 2.1, -1], [d, 960, 560, 1.5, 0]] }}>
      <BigLeaf x={960} y={800} s={1.3} t={t} />
      <Lady x={960} y={560} s={2.6} t={t} open={open} walk={0.2} />
      <Pill x={560} y={330} text="ÉLITROS: TAPAS DURAS" color={C.red} size={28} s={pop(t, d * 0.15)} />
      <Pill x={1380} y={330} text="ALAS FINAS PLEGADAS" color={C.cyan} size={28} s={pop(t, d * 0.6)} />
    </Stage>); };

S.despegue = (p) => { const { t } = p; const d = D(p);
  const fly = ramp(t, d * 0.3, d * 0.7); const land2 = ramp(t, d * 0.7, d * 0.9);
  const x = lerp(700, 1300, fly), y = lerp(640, 360, Math.sin(fly * Math.PI)) + land2 * 0;
  return (
    <Stage {...p} env={gar({ t, seed: 5 })} cam={{ focus: (tt) => [lerp(700, 1300, ramp(tt, d * 0.3, d * 0.7)), 540], zamt: 0.8 }}>
      <BigLeaf x={500} y={760} s={0.8} t={t} rot={-6} /><BigLeaf x={1500} y={760} s={0.8} t={t} rot={6} seed={3} />
      <LadySide x={x} y={y} s={1.4} t={t} open={fly > 0 && land2 < 1 ? 1 - land2 : seg(t, d * 0.15, d * 0.3)} rot={fly > 0 && fly < 1 ? -10 : 0} />
      {fly > 0 && fly < 1 && [...Array(6)].map((_, k) => <path key={k} d={`M${x - 80 - k * 30},${y + 10 * Math.sin(k)} l-40,0`} stroke="#fff" strokeWidth={4} opacity={0.6} />)}
      <Pill x={960} y={250} text="DESPLIEGA · VUELA · GUARDA" color={C.cyan} size={30} s={pop(t, d * 0.4)} />
    </Stage>); };

S.patas = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={gar({ t, seed: 6 })} cam={{ keys: [[0, 960, 560, 1.2, 0], [2.6, 960, 520, 1.6, -3], [5.2, 1050, 560, 2.0, 2], [7.8, 960, 560, 1.4, -1], [d, 960, 560, 1.3, 1]] }}>
      <rect x={760} y={-100} width={400} height={1300} fill="#dff4ff" fillOpacity={0.5} stroke="#fff" strokeWidth={6} />
      <Lady x={960} y={lerp(900, 300, t / d)} s={1.1} rot={180} t={t} walk={1} />
      <g transform="translate(1450 560)" opacity={ramp(t, d * 0.35, d * 0.45)}><circle r={170} fill="#10223f" stroke={C.gold} strokeWidth={6} />{[...Array(14)].map((_, k) => <g key={k}><path d={`M${-120 + k * 18},-40 l${4 * Math.sin(t * 4 + k)},70`} stroke="#ccc" strokeWidth={4} /><circle cx={-120 + k * 18 + 4 * Math.sin(t * 4 + k)} cy={34} r={6} fill="#f3e9a0" /></g>)}<Txt x={0} y={120} size={24} color={C.gold}>PELITOS PEGAJOSOS</Txt></g>
    </Stage>); };

S.especies = (p) => { const { t } = p; const d = D(p);
  const types = [['#e8322c', 7], ['#f5b82e', 14], ['#f07a2c', 10], ['#1a1a1a', 2], ['#e8322c', 2], ['#f2c9a0', 0]];
  return (
    <Stage {...p} env={gar({ t, seed: 7 })} cam={{ keys: [[0, 960, 560, 1.0, 0], [2.6, 700, 520, 1.4, -2], [5.2, 1250, 600, 1.4, 2], [7.8, 960, 560, 1.15, -1], [d, 960, 560, 1.3, 1]] }}>
      {types.map(([c, sp], k) => <Lady key={k} x={480 + (k % 3) * 480} y={400 + Math.floor(k / 3) * 320} s={1.1 * pop(t, 0.3 + k * 0.5)} rot={20 * Math.sin(t + k)} t={t} seed={k + 9} color={c} spots={sp} walk={0.5} />)}
      <Counter x={960} y={170} t={t} t0={0.5} t1={d * 0.6} v1={6000} size={70} color={C.gold} suffix=" ESPECIES" />
    </Stage>); };

S.nombre = (p) => { const { t } = p; const d = D(p);
  const names = ['CATARINA', 'CHINITA', 'VAQUITA DE SAN ANTONIO', 'SAN ANTONIO'];
  return (
    <Stage {...p} env={gar({ t, seed: 8 })} cam={{ focus: () => [960, 560], zamt: 0.7 }}>
      <Lady x={960} y={560} s={1.6} rot={t * 30} t={t} walk={0.6} />
      {names.map((n, k) => { const a = t * 0.6 + k * 1.57; return <Pill key={k} x={960 + 520 * Math.cos(a)} y={560 + 270 * Math.sin(a)} text={n} size={28} color={[C.gold, C.cyan, C.green, C.purple][k]} s={pop(t, d * (0.15 + k * 0.15))} />; })}
    </Stage>); };

S.origen_nombre = (p) => { const { t } = p; const d = D(p);
  const plague = 1 - ramp(t, d * 0.55, d * 0.85);
  return (
    <Stage {...p} env={land('savanna', { t, seed: 9 })} light={(tt) => 0.85 + 0.15 * ramp(tt, d * 0.5, d * 0.7)} cam={{ keys: [[0, 900, 600, 1.3, -1], [2.6, 960, 560, 1.1, 2], [5.2, 1050, 600, 1.4, -2], [7.8, 960, 620, 1.6, 1], [10.4, 960, 580, 1.25, -1], [d, 960, 560, 1.2, 0]] }}>
      <Ground t={t} kind="savanna" y={800} />
      {[...Array(12)].map((_, k) => <g key={k} transform={`translate(${300 + k * 120} 760)`}><path d="M0,0 L0,-120" stroke="#b8913f" strokeWidth={6} /><ellipse cx={0} cy={-130} rx={12} ry={30} fill="#e0b84a" /></g>)}
      <g opacity={plague}>{[...Array(30)].map((_, k) => <circle key={k} cx={300 + (k * 53) % 1400} cy={620 + (k % 5) * 25 + 6 * Math.sin(t * 6 + k)} r={7} fill="#556b2f" />)}</g>
      <Person x={500} y={800} s={1} t={t} arms={0.9} shirt="#8b5a2b" hat={false} />
      {[...Array(10)].map((_, k) => { const u = ramp(t, d * 0.4 + k * 0.15, d * 0.7 + k * 0.15); return <LadySide key={k} x={lerp(1900, 400 + k * 140, eo(u))} y={lerp(200, 640 + (k % 3) * 30, eo(u))} s={0.35} t={t} seed={k} open={u < 1 ? 1 : 0} />; })}
      <Pill x={1200} y={300} text="«EL PÁJARO DE NUESTRA SEÑORA»" color={C.gold} size={28} s={pop(t, d * 0.15)} />
    </Stage>); };

S.puente_caza = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={gar({ t, seed: 10 })} cam={{ keys: [[0, 960, 560, 1.2, -2], [d * 0.5, 960, 560, 1.6, 2], [d, 1000, 560, 2.0, -1]] }}>
      <BigLeaf x={960} y={700} s={1.1} t={t} />
      <Lady x={960} y={600} s={1.5} rot={90} t={t} walk={0.3} />
      <g transform="translate(960 300)"><circle r={70 * pop(t, 0.5)} fill="#0f2240" stroke={C.gold} strokeWidth={6} /><path d="M-25,-35 L-25,35 M-35,-35 L-35,-5 M-15,-35 L-15,-5 M20,-35 C40,-35 40,-5 20,0 L20,35" stroke="#fff" strokeWidth={6} fill="none" opacity={pop(t, 0.6) > 0.5 ? 1 : 0} /></g>
    </Stage>); };

S.pulgones = (p) => { const { t } = p; const d = D(p);
  const n = Math.round(lerp(3, 60, ramp(t, d * 0.3, d * 0.9)));
  return (
    <Stage {...p} env={gar({ t, seed: 11 })} cam={{ keys: [[0, 1000, 520, 2.0, 1], [2.6, 960, 560, 1.6, -2], [5.2, 960, 560, 1.2, 2], [7.8, 900, 580, 1.05, -1], [d, 960, 560, 1.2, 0]] }}>
      <path d="M960,1200 Q900,700 980,200" stroke="#4f9a3a" strokeWidth={60} fill="none" />
      {[...Array(5)].map((_, k) => <BigLeaf key={k} x={960 + (k % 2 ? 260 : -260)} y={300 + k * 170} s={0.35} t={t} rot={k % 2 ? -20 : 200} seed={k} />)}
      <Aphids n={n} t={t} x0={850} y0={250} w={240} h={800} seed={3} />
      {[...Array(6)].map((_, k) => { const u = mod(t * 0.8 + k / 6, 1); return <circle key={k} cx={960 + 30 * Math.sin(k)} cy={600 + u * 200} r={6} fill="#c9f0a0" opacity={1 - u} />; })}
      <Pill x={1400} y={300} text="CHUPAN LA SAVIA" color={C.green} size={30} s={pop(t, d * 0.3)} />
    </Stage>); };

S.plaga = (p) => { const { t } = p; const d = D(p);
  const wilt = ramp(t, 0.5, d * 0.8);
  return (
    <Stage {...p} env={gar({ t, seed: 12 })} light={(tt) => 1 - 0.2 * wilt} cam={{ keys: [[0, 960, 560, 1.2, -1], [2.6, 900, 560, 1.5, 2], [5.2, 1050, 560, 1.3, -2], [d, 960, 560, 1.5, 1]] }}>
      {[0, 1, 2].map((k) => <g key={k} transform={`translate(${560 + k * 400} 900) rotate(${wilt * (k - 1) * 12})`}><path d={`M0,0 Q${wilt * 60},-200 ${wilt * 160},${-380 + wilt * 120}`} stroke={wilt > 0.5 ? '#8a8a3a' : '#4f9a3a'} strokeWidth={18} fill="none" /><ellipse cx={wilt * 160} cy={-380 + wilt * 120} rx={60} ry={30} fill={wilt > 0.5 ? '#b0a050' : '#6fc04f'} transform={`rotate(${wilt * 50} ${wilt * 160} ${-380 + wilt * 120})`} /></g>)}
      <Aphids n={50} t={t} x0={420} y0={500} w={1100} h={360} seed={5} />
      <Person x={1600} y={850} s={1} t={t} arms={0.8 + 0.2 * Math.sin(t * 4)} shirt="#7f8c8d" />
      <Pill x={960} y={250} text="UNA PESADILLA PARA EL AGRICULTOR" color={C.red} size={28} s={pop(t, d * 0.4)} />
    </Stage>); };

S.apetito = (p) => { const { t } = p; const d = D(p);
  const eaten = ramp(t, d * 0.15, d * 0.6);
  return (
    <Stage {...p} env={gar({ t, seed: 13 })} cam={{ keys: [[0, 960, 560, 1.3, 2], [2.6, 800, 560, 1.6, -2], [5.2, 1100, 560, 1.4, 1], [7.8, 960, 560, 1.2, -1], [d, 960, 560, 1.3, 0]] }}>
      <BigLeaf x={960} y={620} s={1.2} t={t} />
      <Aphids n={50} t={t} x0={480} y0={520} w={960} h={200} eaten={eaten} seed={7} />
      <Lady x={lerp(480, 1450, eaten)} y={620 + 40 * Math.sin(t * 3)} s={1.1} rot={90 + 20 * Math.sin(t * 3)} t={t} walk={1.4} />
      <Counter x={700} y={260} t={t} t0={d * 0.15} t1={d * 0.6} v1={50} size={64} color={C.gold} suffix=" AL DÍA" />
      <Counter x={1300} y={260} t={t} t0={d * 0.6} t1={d * 0.9} v1={5000} size={64} color={C.red} suffix=" EN SU VIDA" />
    </Stage>); };

S.busca = (p) => { const { t } = p; const d = D(p);
  const x = lerp(400, 1400, ramp(t, 0.5, d * 0.85)); const y = 560 + 80 * Math.sin(t * 2.2);
  return (
    <Stage {...p} env={gar({ t, seed: 14 })} cam={{ focus: (tt) => [lerp(400, 1400, ramp(tt, 0.5, d * 0.85)), 560], zamt: 0.75 }}>
      <BigLeaf x={1400} y={620} s={0.6} t={t} />
      <Aphids n={14} t={t} x0={1300} y0={560} w={200} h={100} seed={8} />
      {[...Array(18)].map((_, k) => { const u = mod(t * 0.5 + k / 18, 1); return <circle key={k} cx={lerp(1400, x, u)} cy={600 + 50 * Math.sin(u * 8 + k)} r={6} fill={C.gold} opacity={0.6 * (1 - u)} />; })}
      <LadySide x={x} y={y} s={1.1} t={t} open={1} />
      <Pill x={x} y={330} text="SIGUE EL OLOR" color={C.gold} size={30} s={pop(t, d * 0.3)} />
    </Stage>); };

S.menu = (p) => { const { t } = p; const d = D(p);
  const items = ['COCHINILLAS', 'ÁCAROS', 'HUEVOS', 'POLEN', 'HONGOS'];
  return (
    <Stage {...p} env={gar({ t, seed: 15 })} cam={{ keys: [[0, 960, 560, 1.15, -1], [2.6, 700, 520, 1.4, 2], [5.2, 1200, 560, 1.4, -2], [d, 960, 560, 1.25, 1]] }}>
      <Lady x={960} y={600} s={1.4} rot={t * 25} t={t} walk={0.4} />
      {items.map((n, k) => { const a = -Math.PI / 2 + k * (Math.PI * 2 / 5) + t * 0.2; const s = pop(t, d * (0.12 + k * 0.14)); return <g key={k}><line x1={960} y1={600} x2={960 + 420 * Math.cos(a)} y2={600 + 270 * Math.sin(a)} stroke="#fff" strokeWidth={3} strokeDasharray="10 8" strokeDashoffset={-t * 40} opacity={0.6 * Math.min(1, s)} /><Pill x={960 + 420 * Math.cos(a)} y={600 + 270 * Math.sin(a)} text={n} size={26} color={[C.cyan, C.red, C.gold, C.green, C.purple][k]} s={s} /></g>; })}
    </Stage>); };

S.puente_larva = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={gar({ t, seed: 16 })} light={(tt) => 1 - 0.25 * ramp(tt, 0.5, d)} cam={{ keys: [[0, 960, 560, 1.2, 2], [d * 0.5, 960, 600, 1.5, -2], [d, 960, 620, 1.9, 1]] }}>
      <BigLeaf x={960} y={700} s={1.2} t={t} />
      <Lady x={700} y={620} s={1} rot={90} t={t} walk={0.3} />
      <g opacity={ramp(t, d * 0.4, d * 0.7)}><LadyLarva x={1250} y={640} s={1.2} t={t} walk={0.4} /></g>
      <Txt x={1250} y={460} size={110} s={pop(t, d * 0.6)}>?</Txt>
    </Stage>); };

S.huevos = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={gar({ t, seed: 17 })} cam={{ keys: [[0, 960, 560, 1.3, -1], [2.6, 1000, 600, 1.8, 2], [5.2, 960, 620, 2.2, -2], [d, 960, 600, 1.5, 1]] }}>
      <BigLeaf x={960} y={680} s={1.3} t={t} />
      <Aphids n={12} t={t} x0={1150} y0={620} w={260} h={80} seed={9} />
      <Lady x={850} y={600} s={1.1} rot={90 + 6 * Math.sin(t * 2)} t={t} walk={0.2} />
      {[...Array(16)].map((_, k) => <ellipse key={k} cx={960 + (k % 4) * 26} cy={680 + Math.floor(k / 4) * 24} rx={10 * pop(t, d * 0.25 + k * 0.12)} ry={16 * pop(t, d * 0.25 + k * 0.12)} fill="#f7d34a" stroke="#b39a2a" strokeWidth={2} />)}
      <Pill x={960} y={330} text="JUNTO A LA COMIDA" color={C.gold} size={30} s={pop(t, d * 0.55)} />
    </Stage>); };

S.larva = (p) => { const { t } = p; const d = D(p);
  const crush = ramp(t, d * 0.65, d * 0.75);
  return (
    <Stage {...p} env={gar({ t, seed: 18 })} cam={{ keys: [[0, 960, 600, 1.8, 2], [2.6, 960, 580, 1.4, -2], [5.2, 1050, 560, 1.15, 1], [7.8, 1100, 560, 1.4, -1], [d, 960, 560, 1.25, 0]] }}>
      <BigLeaf x={960} y={680} s={1.3} t={t} />
      <LadyLarva x={lerp(800, 1100, t / d)} y={640} s={1.4} t={t} walk={1} />
      <g opacity={ramp(t, d * 0.25, d * 0.35)}><path d="M300,820 C400,760 600,770 700,820 L700,860 L300,860Z" fill="#5f7a3a" stroke="#3d5224" strokeWidth={4} /><Txt x={500} y={760} size={26} color={C.green}>¿UN CAIMÁN?</Txt></g>
      <g transform={`translate(${1500} ${lerp(-300, 420, ramp(t, d * 0.5, d * 0.65))})`} opacity={1 - ramp(t, d * 0.8, d * 0.9)}><path d="M-60,-200 L-60,40 C-60,90 60,90 60,40 L60,-200Z" fill="#f0c8a0" stroke="#8a6040" strokeWidth={5} /></g>
      <Pill x={1300} y={300} text="¡ES UNA MARIQUITA BEBÉ!" color={C.red} size={30} s={pop(t, d * 0.82)} />
    </Stage>); };

S.larva_come = (p) => { const { t } = p; const d = D(p);
  const eaten = ramp(t, 0.5, d * 0.85);
  return (
    <Stage {...p} env={gar({ t, seed: 19 })} cam={{ focus: (tt) => [lerp(500, 1400, ramp(tt, 0.5, d * 0.85)), 600], zamt: 0.8 }}>
      <BigLeaf x={960} y={680} s={1.3} t={t} />
      <Aphids n={36} t={t} x0={500} y0={600} w={1000} h={120} eaten={eaten} seed={11} />
      <LadyLarva x={lerp(500, 1450, eaten)} y={650} s={1.2} t={t} walk={1.5} />
      <Counter x={960} y={300} t={t} t0={0.5} t1={d * 0.85} v1={400} size={70} color={C.gold} suffix=" PULGONES" />
    </Stage>); };

S.pupa = (p) => { const { t } = p; const d = D(p);
  const pup = ramp(t, d * 0.15, d * 0.35); const hatch = ramp(t, d * 0.65, d * 0.85);
  return (
    <Stage {...p} env={gar({ t, seed: 20 })} cam={{ keys: [[0, 960, 600, 1.3, -1], [2.6, 960, 580, 1.7, 2], [5.2, 980, 560, 2.1, -1], [7.8, 960, 580, 1.6, 2], [d, 960, 580, 1.35, 0]] }}>
      <BigLeaf x={960} y={700} s={1.3} t={t} />
      {pup < 1 && <g opacity={1 - pup}><LadyLarva x={980} y={640} s={1.2} t={t} walk={0.3} /></g>}
      <g opacity={pup * (1 - hatch)} transform={`translate(960 610) scale(${1 + 0.03 * Math.sin(t * 4)})`}><ellipse rx={70} ry={50} fill="#e89a3a" stroke="#6a3a10" strokeWidth={5} />{[...Array(5)].map((_, k) => <circle key={k} cx={-40 + k * 20} cy={-10 + (k % 2) * 20} r={8} fill="#6a3a10" />)}</g>
      {hatch > 0 && <Lady x={960} y={600} s={1.2} t={t} walk={hatch} color={`rgb(${lerp(245, 232, hatch)},${lerp(230, 50, hatch)},${lerp(200, 44, hatch)})`} spots={hatch > 0.6 ? 7 : 0} />}
      <Pill x={960} y={300} text={hatch > 0 ? 'SALE PÁLIDA Y BLANDA' : 'PUPA: TRANSFORMACIÓN TOTAL'} color={C.gold} size={30} s={pop(t, hatch > 0 ? d * 0.68 : d * 0.3)} />
    </Stage>); };

S.color_aparece = (p) => { const { t } = p; const d = D(p);
  const c = ramp(t, 0.3, d * 0.5);
  const stages = ['HUEVO', 'LARVA', 'PUPA', 'ADULTO'];
  return (
    <Stage {...p} env={gar({ t, seed: 21 })} cam={{ keys: [[0, 960, 500, 1.6, 2], [2.6, 960, 560, 1.3, -2], [5.2, 960, 620, 1.1, 1], [d, 960, 600, 1.2, -1]] }}>
      <Lady x={960} y={400} s={1.4} t={t} walk={0.4} color={`rgb(${lerp(245, 232, c)},${lerp(230, 50, c)},${lerp(200, 44, c)})`} spots={Math.round(7 * c)} />
      {stages.map((n, k) => { const a = -Math.PI / 2 + (k * Math.PI) / 2; const s = pop(t, d * 0.45 + k * 0.4); return <g key={k}><circle cx={960 + 300 * Math.cos(a)} cy={760 + 150 * Math.sin(a)} r={50 * s} fill="#0f2240" stroke={C.gold} strokeWidth={5} /><Txt x={960 + 300 * Math.cos(a)} y={770 + 150 * Math.sin(a)} size={20} s={s}>{n}</Txt></g>; })}
      <path d="M960,610 A300,150 0 1,1 959,610" stroke={C.gold} strokeWidth={4} fill="none" strokeDasharray="14 10" strokeDashoffset={-t * 50} opacity={ramp(t, d * 0.5, d * 0.6)} />
      <Pill x={1500} y={300} text="≈ 1 MES" color={C.cyan} size={32} s={pop(t, d * 0.8)} />
    </Stage>); };

S.puente_1888 = (p) => { const { t } = p; const d = D(p);
  const yr = Math.round(lerp(2026, 1888, eo(ramp(t, 0.3, d * 0.8))));
  return (
    <Stage {...p} env={{ theme: 'dusk', rays: false, fish: false }} cam={{ keys: [[0, 960, 540, 1.1, -2], [d * 0.5, 960, 540, 1.5, 2], [d, 960, 540, 1.9, -1]] }}>
      <g transform={`translate(960 540) rotate(${-t * 90})`}><circle r={260} fill="none" stroke={C.gold} strokeWidth={10} strokeDasharray="30 20" /></g>
      <Txt x={960} y={580} size={150} color="#fff">{yr}</Txt>
    </Stage>); };

S.california = (p) => { const { t } = p; const d = D(p);
  const dry = ramp(t, d * 0.3, d * 0.85);
  return (
    <Stage {...p} env={land('savanna', { t, seed: 23 })} light={(tt) => 1 - 0.2 * dry} cam={{ keys: [[0, 960, 600, 1.15, 0], [2.6, 800, 600, 1.4, -2], [5.2, 1150, 580, 1.5, 2], [7.8, 1000, 600, 1.7, -1], [10.4, 960, 600, 1.3, 1], [d, 960, 600, 1.2, 0]] }}>
      <Ground t={t} kind="savanna" y={820} />
      {[0, 1, 2, 3].map((k) => <g key={k} transform={`translate(${420 + k * 360} 800)`}><path d="M0,0 L0,-160" stroke="#6a4a2a" strokeWidth={22} /><circle cy={-240} r={130} fill={dry > 0.5 ? '#8a8a4a' : '#3f8a3a'} />{[...Array(6)].map((_, j) => <circle key={j} cx={Math.cos(j) * 80} cy={-240 + Math.sin(j) * 70 + dry * 120 * (j % 2)} r={18} fill="#f39c34" opacity={1 - dry * 0.7} />)}{[...Array(10)].map((_, j) => <circle key={'c' + j} cx={Math.cos(j * 1.7) * 100 * dry} cy={-240 + Math.sin(j * 1.3) * 90 * dry} r={12 * dry} fill="#f4f1ea" stroke="#ccc" strokeWidth={2} />)}</g>)}
      <Person x={1700} y={830} s={1} t={t} arms={0.9} shirt="#7f8c8d" />
      <Pill x={960} y={250} text="COCHINILLA ALGODONOSA" color={C.red} size={30} s={pop(t, d * 0.25)} />
    </Stage>); };

S.viaje = (p) => { const { t } = p; const d = D(p);
  const u = ramp(t, 0.5, d * 0.65);
  const x = lerp(400, 1500, u), y = 560 - 200 * Math.sin(u * Math.PI);
  return (
    <Stage {...p} env={{ theme: 'map', rays: false, ridges: false, fish: false }} cam={{ focus: (tt) => { const uu = ramp(tt, 0.5, d * 0.65); return [lerp(400, 1500, uu), 560 - 200 * Math.sin(uu * Math.PI)]; }, zamt: 0.6 }}>
      <path d="M100,300 C250,250 400,350 420,500 C400,650 250,700 150,620Z" fill="#c9a86a" stroke="#8b6e3c" strokeWidth={5} /><Txt x={280} y={480} size={32}>CALIFORNIA</Txt>
      <path d="M1400,620 C1500,560 1700,560 1780,640 C1800,740 1650,800 1520,780 C1440,760 1390,700 1400,620Z" fill="#c9a86a" stroke="#8b6e3c" strokeWidth={5} /><Txt x={1600} y={700} size={32}>AUSTRALIA</Txt>
      <path d={pathPts([...Array(41)].map((_, k) => { const v = (k / 40) * u; return [lerp(400, 1500, v), 560 - 200 * Math.sin(v * Math.PI)]; }))} stroke={C.gold} strokeWidth={6} fill="none" strokeDasharray="18 12" />
      <g transform={`translate(${x} ${y})`}><path d="M-60,0 L60,0 L40,30 L-40,30Z" fill="#8b5a2b" /><rect x={-4} y={-70} width={8} height={70} fill="#555" /><path d="M4,-66 L50,-30 L4,-20Z" fill="#fff" /></g>
      {u >= 1 && <g><Lady x={1600} y={560} s={0.7 * pop(t, d * 0.68)} t={t} walk={0.6} /><Pill x={1600} y={440} text="LA VEDALIA" color={C.red} size={30} s={pop(t, d * 0.7)} /></g>}
    </Stage>); };

S.salvados = (p) => { const { t } = p; const d = D(p);
  const heal = ramp(t, d * 0.35, d * 0.8);
  return (
    <Stage {...p} env={land('savanna', { t, seed: 25 })} light={(tt) => 0.85 + 0.2 * heal} cam={{ keys: [[0, 960, 560, 1.3, -2], [2.6, 900, 600, 1.15, 2], [5.2, 1100, 600, 1.45, -1], [7.8, 960, 600, 1.2, 1], [10.4, 960, 580, 1.4, -1], [d, 960, 580, 1.15, 0]] }}>
      <Ground t={t} kind="savanna" y={820} />
      {[0, 1, 2, 3].map((k) => <g key={k} transform={`translate(${420 + k * 360} 800)`}><path d="M0,0 L0,-160" stroke="#6a4a2a" strokeWidth={22} /><circle cy={-240} r={130} fill={heal > 0.5 ? '#3f8a3a' : '#8a8a4a'} />{[...Array(6)].map((_, j) => <circle key={j} cx={Math.cos(j) * 80} cy={-240 + Math.sin(j) * 70} r={18} fill="#f39c34" opacity={0.3 + 0.7 * heal} />)}{[...Array(10)].map((_, j) => <circle key={'c' + j} cx={Math.cos(j * 1.7) * 100} cy={-240 + Math.sin(j * 1.3) * 90} r={12 * (1 - heal)} fill="#f4f1ea" />)}</g>)}
      {[...Array(14)].map((_, k) => { const u = ramp(t, 0.3 + k * 0.1, d * 0.35 + k * 0.1); return <LadySide key={k} x={lerp(960, 300 + k * 110, u)} y={lerp(900, 520 + (k % 3) * 40, u)} s={0.3} t={t} seed={k} open={u < 1 ? 1 : 0} />; })}
      <Txt x={960} y={230} size={80} color={C.gold} s={pop(t, 0.4)}>1888</Txt>
      <Pill x={960} y={330} text="CONTROL BIOLÓGICO" color={C.green} size={32} s={pop(t, d * 0.75)} />
    </Stage>); };

S.puente_rojo = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={gar({ t, seed: 26 })} cam={{ keys: [[0, 960, 560, 1.3, -2], [d * 0.5, 960, 560, 1.7, 2], [d, 960, 560, 2.1, -1]] }}>
      <BigLeaf x={960} y={700} s={1.2} t={t} />
      <Lady x={960} y={600} s={1.6} t={t} walk={0.3} />
      <circle cx={960} cy={600} r={180 + 20 * Math.sin(t * 4)} fill="none" stroke={C.red} strokeWidth={8} opacity={0.6} />
      <Txt x={960} y={300} size={70} s={pop(t, d * 0.4)}>¿POR QUÉ ROJA?</Txt>
    </Stage>); };

S.aviso = (p) => { const { t } = p; const d = D(p);
  const back = ramp(t, d * 0.45, d * 0.7);
  return (
    <Stage {...p} env={gar({ t, seed: 27 })} cam={{ keys: [[0, 960, 560, 1.15, 1], [2.4, 800, 560, 1.4, -2], [4.8, 1150, 560, 1.4, 2], [d, 960, 560, 1.25, -1]] }}>
      <BigLeaf x={960} y={760} s={1.1} t={t} />
      <Lady x={960} y={680} s={1.1} t={t} walk={0.2} />
      <Bird x={lerp(1500, 1250, ramp(t, 0.3, d * 0.4)) + back * 200} y={420} s={1.1} t={t} flip />
      <g transform={`translate(960 430) scale(${pop(t, d * 0.3)})`}><path d="M0,-80 L80,60 L-80,60Z" fill={C.gold} stroke="#111" strokeWidth={6} /><text y={45} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={80} fill="#111">!</text></g>
      <Pill x={700} y={260} text="NO ME COMAS" color={C.red} size={32} s={pop(t, d * 0.4)} />
    </Stage>); };

S.sangrado = (p) => { const { t } = p; const d = D(p);
  const bleed = ramp(t, d * 0.2, d * 0.45); const dead = ramp(t, d * 0.6, d * 0.7);
  return (
    <Stage {...p} env={gar({ t, seed: 28 })} cam={{ keys: [[0, 960, 560, 1.3, -1], [2.6, 960, 560, 1.9, 2], [5.2, 1000, 580, 2.2, -2], [7.8, 960, 580, 1.5, 1], [d, 960, 580, 1.3, 0]] }}>
      <BigLeaf x={960} y={760} s={1.2} t={t} />
      <g transform={`translate(960 640) rotate(${dead * 180}) translate(-960 -640)`}><Lady x={960} y={640} s={1.4} t={t} walk={1 - dead} bleed={bleed} /></g>
      <Pill x={1450} y={330} text="LÍQUIDO AMARGO" color={C.gold} size={30} s={pop(t, d * 0.3)} />
      <Pill x={500} y={330} text="SE HACE LA MUERTA" color={C.purple} size={30} s={pop(t, d * 0.65)} />
    </Stage>); };

S.aprende = (p) => { const { t } = p; const d = D(p);
  const peck = ramp(t, d * 0.15, d * 0.3) * (1 - ramp(t, d * 0.3, d * 0.35)); const spit = ramp(t, d * 0.35, d * 0.55);
  return (
    <Stage {...p} env={gar({ t, seed: 29 })} cam={{ keys: [[0, 1000, 520, 1.5, 2], [2.6, 1050, 500, 1.8, -2], [5.2, 900, 560, 1.3, 1], [d, 960, 560, 1.15, -1]], shake: (tt) => Math.max(0, 1 - Math.abs(tt - d * 0.4) * 4) * 0.3 }}>
      <Bird x={950} y={500} s={1.6} t={t} peck={peck} spit={spit} />
      {spit > 0.3 && <Lady x={lerp(1150, 1500, spit)} y={lerp(470, 820, spit)} s={0.6} rot={spit * 400} t={t} walk={1} />}
      {spit > 0.6 && <g transform="translate(700 260)"><path d="M0,0 C-40,-60 40,-90 60,-30 C80,30 20,40 0,0Z" fill="#fff" stroke="#111" strokeWidth={4} /><path d="M-10,-30 l30,0 m-15,-15 l0,30" stroke={C.red} strokeWidth={6} /></g>}
      {[...Array(5)].map((_, k) => <Lady key={k} x={1300 + k * 90} y={800} s={0.4} t={t} seed={k} walk={0.4} opacity={ramp(t, d * 0.7, d * 0.8)} />)}
      <Pill x={960} y={250} text="APRENDE LA LECCIÓN" color={C.green} size={32} s={pop(t, d * 0.65)} />
    </Stage>); };

S.puntos = (p) => { const { t } = p; const d = D(p);
  const sp = [2, 7, 22, 0];
  return (
    <Stage {...p} env={gar({ t, seed: 30 })} cam={{ keys: [[0, 960, 560, 1.2, -2], [2.6, 700, 560, 1.5, 2], [5.2, 1250, 560, 1.5, -1], [7.8, 960, 560, 1.15, 1], [d, 960, 560, 1.3, 0]] }}>
      <g opacity={1 - ramp(t, d * 0.35, d * 0.45)}><Lady x={960} y={560} s={1.6} t={t} walk={0.3} /><Txt x={960} y={300} size={60} s={pop(t, 0.4)}>¿PUNTOS = EDAD?</Txt><path d="M760,250 L1160,330 M1160,250 L760,330" stroke={C.red} strokeWidth={14} opacity={ramp(t, d * 0.2, d * 0.25)} /></g>
      {sp.map((n, k) => <g key={k} opacity={ramp(t, d * 0.45 + k * 0.3, d * 0.5 + k * 0.3)}><Lady x={420 + k * 360} y={560} s={1} t={t} seed={k + 2} spots={n} color={n === 22 ? '#f5d02e' : '#e8322c'} walk={0.5} /><Txt x={420 + k * 360} y={760} size={36}>{n}</Txt></g>)}
    </Stage>); };

S.feromonas = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={land('savanna', { t, seed: 31 })} cam={{ keys: [[0, 960, 560, 1.15, 1], [2.6, 900, 600, 1.4, -2], [5.2, 1100, 620, 1.6, 2], [d, 1000, 620, 1.3, -1]] }}>
      <Ground t={t} kind="savanna" y={820} />
      <ellipse cx={1100} cy={800} rx={160} ry={70} fill="#7d7468" stroke="#4a443c" strokeWidth={5} />
      {[...Array(20)].map((_, k) => { const u = mod(t * 0.4 + k / 20, 1); return <circle key={k} cx={1100 + Math.cos(k) * u * 600} cy={760 - u * 200 + 40 * Math.sin(k + t)} r={8} fill={C.purple} opacity={0.7 * (1 - u)} />; })}
      {[...Array(9)].map((_, k) => { const u = ramp(t, 0.5 + k * 0.4, d * 0.6 + k * 0.4); return <LadySide key={k} x={lerp(k % 2 ? 1900 : 0, 1040 + (k % 3) * 50, eo(u))} y={lerp(200 + k * 50, 760 + Math.floor(k / 3) * 20, eo(u))} s={0.3} t={t} seed={k} open={u < 1 ? 1 : 0} />; })}
      <Pill x={960} y={300} text="SE LLAMAN CON OLORES" color={C.purple} size={30} s={pop(t, d * 0.3)} />
    </Stage>); };

S.invierno = (p) => { const { t } = p; const d = D(p);
  const n = Math.round(lerp(5, 70, ramp(t, 0.5, d * 0.85)));
  const R = rng(32);
  return (
    <Stage {...p} env={land('arctic', { t, seed: 32 })} cam={{ keys: [[0, 960, 560, 1.15, -1], [2.6, 960, 600, 1.4, 2], [5.2, 1000, 640, 1.8, -2], [7.8, 960, 640, 1.5, 1], [d, 960, 620, 1.3, 0]] }}>
      <Ground t={t} kind="arctic" y={820} />
      <path d="M600,830 C620,600 1300,600 1320,830Z" fill="#7d7468" stroke="#4a443c" strokeWidth={6} />
      {[...Array(n)].map((_, k) => <Lady key={k} x={700 + R() * 520} y={700 + R() * 110} s={0.28} rot={R() * 360} t={t} seed={k} walk={0.05} />)}
      {[...Array(20)].map((_, k) => <text key={k} x={(k * 151) % 1920} y={mod(k * 97 + t * 60, 1080)} fontSize={28} fill="#fff" opacity={0.7}>❄</text>)}
      <Pill x={960} y={330} text="CIENTOS O MILES JUNTAS" color={C.cyan} size={30} s={pop(t, d * 0.35)} />
    </Stage>); };

S.masas = (p) => { const { t } = p; const d = D(p);
  const spring = ramp(t, d * 0.5, d * 0.7);
  const R = rng(33);
  return (
    <Stage {...p} env={land(spring > 0.5 ? 'river' : 'arctic', { t, seed: 33 })} light={(tt) => 0.9 + 0.2 * spring} cam={{ keys: [[0, 960, 600, 1.0, 0], [2.6, 960, 620, 1.3, -2], [5.2, 1050, 600, 1.15, 2], [d, 960, 480, 1.3, -1]] }}>
      <Ground t={t} kind={spring > 0.5 ? 'river' : 'arctic'} y={840} />
      <path d="M300,850 L600,520 L900,700 L1200,480 L1600,850Z" fill="#7d7468" stroke="#4a443c" strokeWidth={6} />
      {[...Array(120)].map((_, k) => { const bx = 400 + R() * 1100, by = 600 + R() * 230; const u = ramp(t, d * 0.6 + R() * 1.5, d * 0.95); return <circle key={k} cx={lerp(bx, bx + (R() - 0.5) * 800, u)} cy={lerp(by, by - 500 * R(), u)} r={9} fill="#e8322c" stroke="#3a0a0a" strokeWidth={2} opacity={1 - u * 0.3} />; })}
      <Pill x={960} y={260} text={spring > 0.5 ? 'PRIMAVERA: ¡A VOLAR!' : 'ROCAS CUBIERTAS DE ROJO'} color={spring > 0.5 ? C.green : C.red} size={30} s={pop(t, spring > 0.5 ? d * 0.6 : 0.6)} />
    </Stage>); };

S.puente_asiatica = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={gar({ t, seed: 34 })} light={(tt) => 1 - 0.3 * ramp(tt, 0.5, d)} cam={{ keys: [[0, 960, 560, 1.2, 2], [d * 0.5, 960, 560, 1.5, -2], [d, 1000, 560, 1.9, 1]] }}>
      <BigLeaf x={960} y={700} s={1.2} t={t} />
      <Lady x={960} y={600} s={1.6} t={t} walk={0.3} color="#f07a2c" spots={16} />
      <Txt x={960} y={330} size={90} color={C.red} s={pop(t, d * 0.5)} rot={-6}>¡PROBLEMA!</Txt>
    </Stage>); };

S.asiatica = (p) => { const { t } = p; const d = D(p);
  const eat = ramp(t, d * 0.55, d * 0.8);
  return (
    <Stage {...p} env={gar({ t, seed: 35 })} cam={{ keys: [[0, 900, 560, 1.15, -1], [2.6, 700, 560, 1.4, 2], [5.2, 1100, 560, 1.6, -2], [7.8, 1000, 580, 1.4, 1], [d, 960, 560, 1.25, 0]] }}>
      <path d="M200,300 C300,200 500,250 550,350 C520,450 330,450 250,400Z" fill="#c9a86a" opacity={0.6} /><path d="M1300,280 C1500,200 1700,280 1720,400 C1600,480 1400,450 1330,380Z" fill="#c9a86a" opacity={0.6} />
      <LadySide x={lerp(1500, 450, ramp(t, 0.3, d * 0.4))} y={lerp(330, 360, ramp(t, 0.3, d * 0.4)) - 80 * Math.sin(ramp(t, 0.3, d * 0.4) * Math.PI)} s={0.5} t={t} open={1} color="#f07a2c" />
      <BigLeaf x={960} y={800} s={1.1} t={t} />
      <Lady x={lerp(800, 1050, eat)} y={720} s={1.5} t={t} walk={1} color="#f07a2c" spots={16} rot={90} />
      {eat < 1 && <Lady x={1120} y={720} s={0.8 * (1 - eat)} t={t} seed={4} walk={0.5} rot={90} />}
      <Pill x={1450} y={560} text="MÁS GRANDE Y AGRESIVA" color={C.red} size={28} s={pop(t, d * 0.45)} />
    </Stage>); };

S.nativas = (p) => { const { t } = p; const d = D(p);
  const drop = ramp(t, d * 0.2, d * 0.8);
  return (
    <Stage {...p} env={gar({ t, seed: 36 })} cam={{ keys: [[0, 960, 560, 1.2, -1], [2.6, 960, 600, 1.5, 2], [5.2, 960, 560, 1.3, -2], [d, 960, 560, 1.45, 1]] }}>
      <line x1={400} y1={800} x2={1550} y2={800} stroke="#fff" strokeWidth={5} /><line x1={400} y1={800} x2={400} y2={260} stroke="#fff" strokeWidth={5} />
      <path d={pathPts([...Array(21)].map((_, k) => [400 + k * 55, 320 + 420 * Math.min(1, Math.max(0, (k / 20 - 0.3) * 1.6))]).filter((_, k) => k / 20 <= drop))} stroke={C.red} strokeWidth={8} fill="none" />
      <path d={pathPts([...Array(21)].map((_, k) => [400 + k * 55, 760 - 420 * Math.min(1, Math.max(0, (k / 20 - 0.3) * 1.6))]).filter((_, k) => k / 20 <= drop))} stroke="#f07a2c" strokeWidth={8} fill="none" />
      <Lady x={1650} y={360} s={0.6} t={t} walk={0.4} /><Lady x={1650} y={720} s={0.6} t={t} walk={0.4} color="#f07a2c" spots={16} />
      <Pill x={960} y={200} text="LAS NATIVAS DISMINUYEN" color={C.red} size={30} s={pop(t, d * 0.4)} />
    </Stage>); };

S.pesticidas = (p) => { const { t } = p; const d = D(p);
  const spray = ramp(t, 0.5, d * 0.45) * (1 - ramp(t, d * 0.5, d * 0.55));
  return (
    <Stage {...p} env={land('savanna', { t, seed: 37 })} cam={{ keys: [[0, 960, 600, 1.2, 1], [2.6, 800, 600, 1.5, -2], [5.2, 1150, 580, 1.3, 2], [7.8, 960, 600, 1.6, -1], [d, 960, 600, 1.25, 0]] }}>
      <Ground t={t} kind="river" y={820} />
      <Person x={400} y={830} s={1.1} t={t} arms={0.7} shirt="#f39c34" />
      {spray > 0 && [...Array(30)].map((_, k) => { const u = mod(t * 1.2 + k / 30, 1); return <circle key={k} cx={480 + u * 600} cy={660 + (k % 6 - 3) * 20 * u} r={6 + u * 10} fill="#c8e86a" opacity={(1 - u) * 0.7} />; })}
      {[0, 1, 2].map((k) => <Lady key={k} x={1000 + k * 160} y={760} s={0.5} t={t} seed={k} walk={spray > 0 ? 0 : 0.5} rot={spray > 0 ? 180 : 90} opacity={spray > 0 ? 0.5 : 1} />)}
      <g opacity={ramp(t, d * 0.55, d * 0.65)}><path d="M1300,600 L1500,600 L1450,780 L1350,780Z" fill="#6fc04f" stroke="#3d7a2a" strokeWidth={4} /><Txt x={1400} y={560} size={26} color={C.green}>SIN QUÍMICOS</Txt></g>
    </Stage>); };

S.ayudar = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={gar({ t, seed: 38 })} cam={{ keys: [[0, 960, 600, 1.2, -2], [2.6, 900, 580, 1.5, 2], [5.2, 1100, 600, 1.35, -1], [7.8, 960, 600, 1.6, 1], [d, 960, 580, 1.25, 0]] }}>
      {[...Array(6)].map((_, k) => <Flower key={k} x={360 + k * 250} y={lerp(1100, 560 + (k % 2) * 60, eo(ramp(t, 0.3 + k * 0.3, 1.5 + k * 0.3)))} s={1} t={t} c={['#ff8fb8', '#ffd23c', '#b388ff', '#ff9f43', '#7ee0ff', '#ff8fb8'][k]} />)}
      <LadyLarva x={lerp(700, 1100, t / d)} y={880} s={0.9} t={t} walk={1} />
      {[0, 1, 2].map((k) => <LadySide key={k} x={lerp(1900, 600 + k * 500, ramp(t, d * 0.4 + k * 0.4, d * 0.7 + k * 0.4))} y={480 + 60 * Math.sin(t * 2 + k)} s={0.45} t={t} seed={k} open={1} />)}
      <Pill x={960} y={250} text="FLORES · SIN INSECTICIDAS" color={C.green} size={30} s={pop(t, d * 0.3)} />
    </Stage>); };

S.resumen = (p) => { const { t } = p; const d = D(p);
  const tags = ['ALAS SECRETAS', 'MILES DE PULGONES', 'LARVA CAIMÁN', 'COLOR DE AVISO'];
  return (
    <Stage {...p} env={gar({ t, seed: 39 })} cam={{ focus: (tt) => [960 + 300 * Math.cos(tt * 0.5), 560 + 100 * Math.sin(tt * 0.5)], zamt: 0.7 }}>
      <LadySide x={960 + 300 * Math.cos(t * 0.5)} y={560 + 100 * Math.sin(t * 0.5)} s={1} t={t} open={1} />
      {tags.map((n, k) => { const a = k * 1.57 + t * 0.4; return <Pill key={k} x={960 + 520 * Math.cos(a)} y={560 + 260 * Math.sin(a)} text={n} size={28} color={[C.cyan, C.green, C.gold, C.red][k]} s={pop(t, d * (0.15 + k * 0.15))} />; })}
    </Stage>); };

S.cierre = (p) => { const { t } = p; const d = D(p); const tc = d * 0.3;
  const pressed = t > tc;
  const ring = t > d * 0.4 ? 18 * Math.sin((t - d * 0.4) * 22) * Math.exp(-(t - d * 0.4) * 1.5) : 0;
  return (
    <Stage {...p} env={gar({ t, seed: 40 })} cam={{ keys: [[0, 960, 520, 1.2, -2], [2.5, 1000, 470, 1.45, 1], [5, 960, 560, 1.1, -1], [d, 960, 560, 1.25, 0]] }}>
      <LadySide x={lerp(-200, 2100, t / d)} y={820 - 60 * Math.sin(t * 2)} s={0.7} t={t} open={1} />
      <g transform={`translate(860 450) scale(${pressed ? 1 - 0.08 * Math.max(0, 1 - (t - tc) * 6) : pop(t, 0.2)})`}><rect x={-270} y={-70} width={540} height={140} rx={34} fill={pressed ? '#5a5a5a' : '#e61e28'} /><text x={0} y={22} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={58} fill="#fff">{pressed ? 'SUSCRITO ✓' : 'SUSCRÍBETE'}</text></g>
      <g transform={`translate(1240 450) rotate(${ring})`}><path d="M-40,30 C-40,-40 -25,-60 0,-60 C25,-60 40,-40 40,30 L50,40 L-50,40Z" fill={C.gold} /><circle cy={52} r={11} fill={C.gold} /></g>
      <g transform={`translate(${lerp(1500, 1010, ease(ramp(t, 0.5, tc)))} ${lerp(900, 460, ease(ramp(t, 0.5, tc)))})`}><path d="M0,0 L0,60 L16,46 L28,72 L38,66 L26,42 L46,40Z" fill="#fff" stroke="#000" strokeWidth={3} /></g>
      <Txt x={960} y={250} size={50} color={C.gold} s={pop(t, d * 0.5)}>¿QUÉ INSECTO SIGUE?</Txt>
    </Stage>); };

export const ORDER16 = ['apertura', 'titulo', 'escarabajo', 'alas', 'despegue', 'patas', 'especies', 'nombre', 'origen_nombre', 'puente_caza', 'pulgones', 'plaga', 'apetito', 'busca', 'menu', 'puente_larva', 'huevos', 'larva', 'larva_come', 'pupa', 'color_aparece', 'puente_1888', 'california', 'viaje', 'salvados', 'puente_rojo', 'aviso', 'sangrado', 'aprende', 'puntos', 'invierno', 'feromonas', 'masas', 'puente_asiatica', 'asiatica', 'nativas', 'pesticidas', 'ayudar', 'resumen', 'cierre'];
export const S16 = S;
