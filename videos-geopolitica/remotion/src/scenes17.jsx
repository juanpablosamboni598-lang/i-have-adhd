// v17 · El ajolote (33 escenas)
import React from 'react';
import { C, FONT, cl, lerp, ramp, ease, eo, seg, pop, mod, rng, pathPts, Pill, Ring, Counter } from './lib.jsx';
import { Stage } from './stage.jsx';
import { Fish, BubbleTrail } from './actors.jsx';
import { Person } from './actors2.jsx';
import { LandBack, Ground, RiverWater } from './lands.jsx';
import { Axo, Salamander, CanalBack, Mud, Microscope } from './actors3.jsx';
import { Txt, land } from './scenes14a.jsx';

const D = (p) => p.frames / 30;
const canal = (extra = {}) => ({ custom: (cam) => <CanalBack cam={cam} t={extra.t || 0} seed={extra.seed || 1} murky={extra.murky || 0} />, rays: false, fish: false, ...extra });
const lab = { custom: () => <g><rect x={-200} y={-200} width={2400} height={1500} fill="#dfe8ee" /><rect x={-200} y={760} width={2400} height={600} fill="#b9c6cf" /></g>, rays: false, fish: false };
const Tank = ({ x, y, w = 700, h = 420, children }) => <g><rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={16} fill="#9fd4f5" fillOpacity={0.45} stroke="#5a7a8a" strokeWidth={8} />{children}<rect x={x - w / 2} y={y - h / 2} width={w} height={20} fill="#5a7a8a" /></g>;

const S = {};
S.apertura = (p) => { const { t } = p; const d = D(p);
  const regrow = ramp(t, d * 0.15, d * 0.5);
  const organs = [['MÉDULA', 0.5], ['CORAZÓN', 0.62], ['CEREBRO', 0.74], ['OJOS', 0.86]];
  return (
    <Stage {...p} env={canal({ t })} cam={{ keys: [[0, 900, 620, 1.7, -2], [2.6, 900, 600, 1.4, 2], [5.2, 960, 560, 1.15, -1], [7.8, 1000, 560, 1.4, 1], [d, 960, 560, 1.2, 0]] }}>
      <Mud t={t} y={900} />
      <Axo x={900} y={600} s={1.6} t={t} missing={1 - regrow} glow={regrow > 0 && regrow < 1 ? 0.8 : 0} mouth={0.2} />
      {organs.map(([n, fr], k) => <Pill key={k} x={480 + k * 330} y={260} text={n} size={28} color={[C.cyan, C.red, C.purple, C.gold][k]} s={pop(t, d * fr)} />)}
    </Stage>); };

S.titulo = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={canal({ t, seed: 2 })} cam={{ keys: [[0, 960, 620, 1.3, -2], [2.6, 960, 520, 1.05, 1], [5.2, 960, 560, 1.2, -1], [7.8, 1150, 640, 1.45, 2], [d, 960, 580, 1.15, 0]] }}>
      <Mud t={t} y={920} />
      <Axo x={lerp(300, 1500, t / d)} y={720} s={1} t={t} swim={1} />
      <Txt x={960} y={320} size={140} color="#ff9fb8" s={pop(t, 0.3)} rot={-3 + 2 * Math.sin(t)}>EL AJOLOTE</Txt>
      {['SUPERPODER', 'BEBÉ ETERNO', 'EN PELIGRO'].map((n, k) => <Pill key={k} x={560 + k * 400} y={470} text={n} size={30} color={[C.cyan, C.gold, C.red][k]} s={pop(t, d * 0.35 + k * d * 0.15)} />)}
    </Stage>); };

S.anfibio = (p) => { const { t } = p; const d = D(p);
  const fam = ramp(t, d * 0.45, d * 0.6);
  return (
    <Stage {...p} env={canal({ t, seed: 3 })} cam={{ keys: [[0, 960, 560, 1.2, -1], [2.5, 700, 560, 1.5, 2], [5, 1200, 560, 1.4, -2], [d, 960, 560, 1.25, 1]] }}>
      <g opacity={1 - fam}><Fish x={600} y={500} s={2.2} t={t} color="#9ab" /><path d="M480,420 L720,580 M720,420 L480,580" stroke={C.red} strokeWidth={14} opacity={ramp(t, d * 0.2, d * 0.3)} /><Txt x={600} y={680} size={34}>¿PEZ?</Txt></g>
      <Axo x={1150} y={520} s={1} t={t} />
      <g opacity={fam}><Salamander x={560} y={780} s={0.8} t={t} /><g transform="translate(1500 800)"><ellipse rx={70} ry={50} fill="#4f9a3a" stroke="#2d5a22" strokeWidth={4} /><circle cx={-30} cy={-40} r={16} fill="#4f9a3a" /><circle cx={30} cy={-40} r={16} fill="#4f9a3a" /><circle cx={-30} cy={-44} r={6} fill="#111" /><circle cx={30} cy={-44} r={6} fill="#111" /></g>
        <Pill x={960} y={300} text="UN ANFIBIO" color={C.green} size={36} s={pop(t, d * 0.55)} /></g>
    </Stage>); };

S.cuerpo = (p) => { const { t } = p; const d = D(p);
  const parts = [['4 PATAS', -20, 120, 0.2], ['COLA CON ALETA', -300, -60, 0.4], ['SONRISA', 270, 60, 0.6]];
  return (
    <Stage {...p} env={canal({ t, seed: 4 })} cam={{ keys: [[0, 960, 560, 1.15, 1], [2.6, 800, 560, 1.5, -2], [5.2, 1150, 560, 1.6, 2], [d, 960, 560, 1.3, -1]] }}>
      <Axo x={960} y={540} s={1.8} t={t} mouth={0.3} />
      {parts.map(([n, dx, dy, fr], k) => <Pill key={k} x={960 + dx * 1.8} y={540 + dy * 1.8 + (dy > 0 ? 80 : -80)} text={n} size={28} s={pop(t, d * fr)} />)}
    </Stage>); };

S.branquias = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={canal({ t, seed: 5 })} cam={{ keys: [[0, 960, 560, 1.2, -1], [2.6, 1200, 460, 1.9, 2], [5.2, 1250, 440, 2.3, -1], [7.8, 1150, 480, 1.6, 1], [d, 1000, 520, 1.3, 0]] }}>
      <Axo x={840} y={560} s={1.8} t={t} gill={t > d * 0.3 ? '#e2405a' : '#a33'} />
      {[...Array(18)].map((_, k) => { const u = mod(t * 0.6 + k / 18, 1); return <circle key={k} cx={lerp(1700, 1160, u)} cy={420 + (k % 6 - 3) * 30} r={8} fill={C.cyan} opacity={u < 0.95 ? 1 : 0} />; })}
      <Pill x={1300} y={240} text="3 BRANQUIAS A CADA LADO" color={C.red} size={28} s={pop(t, d * 0.35)} />
    </Stage>); };

S.pulmones = (p) => { const { t } = p; const d = D(p);
  const up = Math.sin(Math.min(1, ramp(t, 0.5, d * 0.6)) * Math.PI);
  return (
    <Stage {...p} env={canal({ t, seed: 6, surface: 180 })} cam={{ keys: [[0, 960, 640, 1.2, 1], [2.6, 960, 420, 1.5, -2], [5.2, 960, 300, 1.8, 2], [7.8, 960, 500, 1.3, -1], [d, 960, 600, 1.2, 0]] }}>
      <Mud t={t} y={920} />
      <Axo x={960} y={lerp(760, 250, up)} rot={-up * 60} s={1.2} t={t} swim={1} mouth={up > 0.9 ? 0.6 : 0} />
      {up > 0.9 && [0, 1, 2].map((k) => <Ring key={k} x={1050} y={180} t={t} t0={d * 0.35 + k * 0.3} dur={0.8} maxR={80} color="#fff" />)}
      <g transform="translate(1450 600)"><ellipse rx={50 + 10 * Math.sin(t * 2)} ry={80} fill="#f2a0b0" stroke="#a05a6a" strokeWidth={4} transform="translate(-40 0)" /><ellipse rx={50 + 10 * Math.sin(t * 2)} ry={80} fill="#f2a0b0" stroke="#a05a6a" strokeWidth={4} transform="translate(40 0)" /><Txt x={0} y={140} size={28}>PULMONES</Txt></g>
      <Pill x={500} y={420} text="Y RESPIRA POR LA PIEL" color={C.cyan} size={28} s={pop(t, d * 0.7)} />
    </Stage>); };

S.colores = (p) => { const { t } = p; const d = D(p);
  const cols = [['#5a6b4a', '#a33', 'SALVAJE'], ['#f3c1c9', '#e2405a', 'LEUCÍSTICO'], ['#f4e6a0', '#e8a0a0', 'DORADO'], ['#2a2a2a', '#5a2a3a', 'MELÁNICO']];
  return (
    <Stage {...p} env={canal({ t, seed: 7 })} cam={{ keys: [[0, 960, 560, 1.1, -1], [2.6, 700, 520, 1.4, 2], [5.2, 1250, 600, 1.4, -2], [7.8, 960, 560, 1.2, 1], [d, 960, 560, 1.3, 0]] }}>
      <Mud t={t} y={940} />
      {cols.map(([c, g, n], k) => <g key={k} opacity={pop(t, 0.3 + k * d * 0.15) > 0.1 ? 1 : 0}><Axo x={520 + (k % 2) * 760} y={380 + Math.floor(k / 2) * 330} s={0.75} t={t} seed={k} color={c} gill={g} wild={k === 0} /><Txt x={520 + (k % 2) * 760} y={480 + Math.floor(k / 2) * 330} size={28} color={k === 0 ? C.green : '#fff'}>{n}</Txt></g>)}
    </Stage>); };

S.caza = (p) => { const { t } = p; const d = D(p); const ts = d * 0.55;
  const fx = lerp(1600, 1180, ramp(t, 0.5, ts)), suck = ramp(t, ts, ts + 0.3);
  return (
    <Stage {...p} env={canal({ t, seed: 8 })} cam={{ keys: [[0, 900, 620, 1.3, -1], [2.6, 1000, 600, 1.6, 2], [ts, 1100, 600, 2.0, -1], [ts + 2, 1000, 600, 1.4, 2], [d, 960, 600, 1.25, 0]], shake: (tt) => Math.max(0, 1 - Math.abs(tt - ts) * 5) * 0.4 }}>
      <Mud t={t} y={900} />
      <Axo x={850} y={720} s={1.2} t={t} swim={0.1} mouth={suck > 0 && suck < 1 ? 1 : 0} />
      {suck < 1 && <g transform={`translate(${lerp(fx, 1150, suck)} ${lerp(640, 700, suck)}) scale(${1 - suck})`}><path d={`M0,0 q20,-${10 + 6 * Math.sin(t * 8)} 40,0 q20,${10 + 6 * Math.sin(t * 8)} 40,0`} stroke="#c97a5a" strokeWidth={10} fill="none" strokeLinecap="round" /></g>}
      {suck > 0 && suck < 1 && [...Array(8)].map((_, k) => <path key={k} d={`M${1300},${620 + k * 15} L${1160},${700}`} stroke="#fff" strokeWidth={3} opacity={0.6} />)}
      <Pill x={960} y={330} text="COMO UNA ASPIRADORA" color={C.gold} size={30} s={pop(t, ts + 0.2)} />
    </Stage>); };

S.huevos = (p) => { const { t } = p; const d = D(p);
  const hatch = ramp(t, d * 0.45, d * 0.65);
  return (
    <Stage {...p} env={canal({ t, seed: 9 })} cam={{ keys: [[0, 960, 600, 1.2, -1], [2.6, 1050, 620, 1.7, 2], [5.2, 1100, 640, 2.0, -2], [7.8, 960, 600, 1.4, 1], [d, 960, 600, 1.25, 0]] }}>
      <Mud t={t} y={900} />
      <Axo x={700} y={640} s={1} t={t} />
      {[...Array(14)].map((_, k) => { const x = 1050 + (k % 5) * 50, y = 720 + Math.floor(k / 5) * 40; const s = pop(t, d * 0.1 + k * 0.12); return hatch < 0.5 ? <circle key={k} cx={x} cy={y} r={14 * s} fill="#f4f1ea" fillOpacity={0.7} stroke="#bbb" strokeWidth={2} /> : <Axo key={k} x={x + hatch * 60 * Math.cos(k)} y={y - hatch * 50 * Math.sin(k)} s={0.12} t={t} seed={k} swim={1} />; })}
      <g transform="translate(1600 260)"><circle r={60} fill="#0f2240" stroke="#fff" strokeWidth={5} /><line x1={0} y1={0} x2={44 * Math.sin(t * 2)} y2={-44 * Math.cos(t * 2)} stroke={C.gold} strokeWidth={7} strokeLinecap="round" /><Txt x={0} y={100} size={26}>2 SEMANAS</Txt></g>
      <Pill x={960} y={300} text="VIVE 10 A 15 AÑOS" color={C.cyan} size={30} s={pop(t, d * 0.8)} />
    </Stage>); };

S.puente_bebe = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={canal({ t, seed: 10 })} cam={{ keys: [[0, 960, 560, 1.2, 2], [d * 0.5, 960, 560, 1.5, -2], [d, 980, 560, 1.9, 1]] }}>
      <Axo x={960} y={600} s={1.4} t={t} mouth={0.3} />
      <g transform="translate(1260 360)" opacity={pop(t, d * 0.4)}><path d="M-30,-30 C-30,-60 30,-60 30,-30 L30,20 L-30,20Z" fill="#f2c9a0" stroke="#8a6040" strokeWidth={4} /><circle cy={-40} r={10} fill="#fff" stroke="#8a6040" strokeWidth={3} /></g>
      <Txt x={960} y={300} size={70} s={pop(t, d * 0.3)}>¿UN BEBÉ ETERNO?</Txt>
    </Stage>); };

S.metamorfosis = (p) => { const { t } = p; const d = D(p);
  const m = seg(t, d * 0.3, d * 0.7);
  return (
    <Stage {...p} env={m < 0.5 ? canal({ t, seed: 11 }) : land('river', { t, seed: 11 })} cam={{ keys: [[0, 960, 600, 1.2, -1], [2.6, 960, 600, 1.5, 2], [5.2, 1000, 620, 1.3, -2], [7.8, 1100, 640, 1.6, 1], [d, 1050, 620, 1.3, 0]] }}>
      {m >= 0.5 && <Ground t={t} kind="river" y={800} />}
      <Axo x={lerp(900, 1000, m)} y={lerp(600, 720, m)} s={1.2} t={t} opacity={1 - m} wild={false} color="#4a4a4a" />
      <Salamander x={lerp(900, 1100, m)} y={760} s={1.1} t={t} />
      <g opacity={1 - Math.abs(m - 0.5) * 2}>{[...Array(10)].map((_, k) => <circle key={k} cx={960 + Math.cos(k + t * 3) * 200} cy={640 + Math.sin(k + t * 3) * 120} r={8} fill={C.gold} />)}</g>
      <Pill x={960} y={300} text="LA METAMORFOSIS" color={C.gold} size={32} s={pop(t, d * 0.3)} />
    </Stage>); };

S.neotenia = (p) => { const { t } = p; const d = D(p);
  const grow = ramp(t, d * 0.3, d * 0.75);
  return (
    <Stage {...p} env={canal({ t, seed: 12 })} cam={{ keys: [[0, 900, 600, 1.4, 1], [2.6, 960, 580, 1.2, -2], [5.2, 1000, 560, 1.05, 2], [7.8, 960, 560, 1.3, -1], [d, 960, 560, 1.15, 0]] }}>
      <Mud t={t} y={920} />
      <Axo x={lerp(500, 1000, grow)} y={640} s={lerp(0.5, 1.5, grow)} t={t} />
      {grow > 0.9 && [0, 1, 2].map((k) => <Axo key={k} x={1400 + k * 90} y={780} s={0.15} t={t} seed={k} swim={1} />)}
      <Pill x={960} y={300} text="NEOTENIA: ADULTO CON CUERPO DE BEBÉ" color={C.purple} size={28} s={pop(t, d * 0.6)} />
    </Stage>); };

S.tiroides = (p) => { const { t } = p; const d = D(p);
  const drop = ramp(t, d * 0.5, d * 0.6); const m = ramp(t, d * 0.65, d * 0.9);
  return (
    <Stage {...p} env={lab} cam={{ keys: [[0, 960, 560, 1.15, -1], [2.6, 900, 520, 1.5, 2], [5.2, 1000, 560, 1.35, -2], [7.8, 960, 580, 1.6, 1], [d, 960, 560, 1.25, 0]] }}>
      <Tank x={960} y={580}><Axo x={900} y={600} s={0.8} t={t} opacity={1 - m} /><Salamander x={960} y={680} s={0.6 * m} t={t} /></Tank>
      <g transform={`translate(1100 ${lerp(200, 330, drop)})`}><rect x={-14} y={-80} width={28} height={80} fill="#fff" stroke="#555" strokeWidth={3} /><circle cy={10 + drop * 120} r={10} fill={C.gold} opacity={drop > 0 && drop < 1 ? 1 : 0} /></g>
      <Pill x={500} y={300} text="POCA HORMONA" color={C.gold} size={30} s={pop(t, d * 0.2)} />
      <Pill x={1450} y={300} text="CON HORMONA: SE TRANSFORMA" color={C.red} size={26} s={pop(t, d * 0.75)} />
    </Stage>); };

S.puente_regen = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={canal({ t, seed: 13 })} light={(tt) => 1 + 0.25 * Math.max(0, Math.sin(tt * 3))} cam={{ keys: [[0, 960, 560, 1.2, -2], [d * 0.5, 960, 560, 1.6, 2], [d, 960, 560, 2.0, -1]] }}>
      <Axo x={960} y={580} s={1.5} t={t} glow={0.6 + 0.4 * Math.sin(t * 3)} />
      <Txt x={960} y={300} size={90} color={C.cyan} s={pop(t, d * 0.3)}>REGENERACIÓN</Txt>
    </Stage>); };

S.pata = (p) => { const { t } = p; const d = D(p);
  const cut = ramp(t, d * 0.1, d * 0.2); const bl = ramp(t, d * 0.35, d * 0.55);
  return (
    <Stage {...p} env={canal({ t, seed: 14 })} cam={{ keys: [[0, 960, 560, 1.2, 1], [2.6, 820, 620, 1.8, -2], [5.2, 760, 640, 2.4, 2], [7.8, 800, 620, 1.7, -1], [d, 900, 600, 1.4, 0]] }}>
      <Axo x={960} y={560} s={1.6} t={t} missing={cut} />
      {bl > 0 && <g transform="translate(864 614)"><circle r={30 * bl} fill={C.cyan} opacity={0.7} filter="url(#glow)" />{[...Array(10)].map((_, k) => <circle key={k} cx={Math.cos(k + t * 2) * 22 * bl} cy={Math.sin(k + t * 2) * 22 * bl} r={6} fill="#fff" />)}</g>}
      <Pill x={700} y={320} text="BLASTEMA: CÉLULAS QUE «OLVIDAN»" color={C.cyan} size={26} s={pop(t, d * 0.45)} />
    </Stage>); };

S.reconstruye = (p) => { const { t } = p; const d = D(p);
  const g = ramp(t, 0.5, d * 0.7);
  return (
    <Stage {...p} env={canal({ t, seed: 15 })} cam={{ keys: [[0, 800, 620, 2.0, -1], [2.6, 860, 620, 1.6, 2], [5.2, 960, 600, 1.3, -2], [7.8, 960, 580, 1.15, 1], [d, 960, 580, 1.25, 0]] }}>
      <Axo x={960} y={560} s={1.6} t={t} missing={1 - g} glow={g < 1 ? 0.5 : 0} />
      {['HUESOS', 'MÚSCULOS', 'NERVIOS', 'PIEL'].map((n, k) => <Pill key={k} x={420 + k * 360} y={260} text={n} size={26} color={[C.gold, C.red, C.purple, C.green][k]} s={pop(t, 0.6 + k * d * 0.15)} />)}
      <Pill x={1350} y={820} text="¡SIN CICATRIZ!" color={C.cyan} size={32} s={pop(t, d * 0.8)} />
    </Stage>); };

S.organos = (p) => { const { t } = p; const d = D(p);
  const parts = [['COLA', -380, 0, 0.15], ['MÉDULA', -150, -40, 0.3], ['CORAZÓN', 60, 20, 0.45], ['CEREBRO', 300, -30, 0.6], ['OJOS', 380, -40, 0.72]];
  return (
    <Stage {...p} env={{ theme: 'dark', rays: false, fish: false }} cam={{ keys: [[0, 960, 560, 1.15, -1], [2.6, 700, 560, 1.5, 2], [5.2, 1150, 540, 1.6, -2], [7.8, 1300, 540, 1.4, 1], [d, 960, 560, 1.2, 0]] }}>
      <Axo x={900} y={560} s={1.7} t={t} opacity={0.55} />
      {parts.map(([n, dx, dy, fr], k) => { const on = ramp(t, d * fr, d * fr + 0.4); return <g key={k}><circle cx={900 + dx * 1.7} cy={560 + dy * 1.7} r={30 + 8 * Math.sin(t * 4 + k)} fill={C.cyan} opacity={0.6 * on} filter="url(#glow)" /><Pill x={900 + dx * 1.7} y={560 + dy * 1.7 - 110 - (k % 2) * 60} text={n} size={26} s={pop(t, d * fr)} /></g>; })}
    </Stage>); };

S.humano = (p) => { const { t } = p; const d = D(p);
  const scar = ramp(t, d * 0.15, d * 0.35);
  return (
    <Stage {...p} env={lab} cam={{ keys: [[0, 700, 560, 1.4, 1], [2.6, 700, 520, 1.7, -2], [5.2, 1200, 560, 1.4, 2], [7.8, 960, 560, 1.15, -1], [10.4, 1100, 540, 1.35, 1], [d, 960, 560, 1.2, 0]] }}>
      <g transform="translate(600 560)"><path d="M-200,-60 C-200,-110 200,-110 220,-60 L220,60 C200,110 -200,110 -200,60Z" fill="#f0c8a0" stroke="#8a6040" strokeWidth={5} /><path d={`M-80,0 L${-80 + 160 * scar},0`} stroke="#c0605a" strokeWidth={14} strokeLinecap="round" /><Txt x={0} y={160} size={28} s={pop(t, d * 0.3)}>CICATRIZ</Txt></g>
      <Tank x={1320} y={560} w={560} h={360}><Axo x={1320} y={580} s={0.8} t={t} glow={0.5} /></Tank>
      <Microscope x={1700} y={760} s={0.6} t={t} /><Person x={1600} y={880} s={0.8} t={t} arms={0.5} shirt="#fff" hat={false} />
      <Pill x={960} y={220} text="¿PODREMOS CURARNOS ASÍ?" color={C.cyan} size={30} s={pop(t, d * 0.7)} />
    </Stage>); };

S.genoma = (p) => { const { t } = p; const d = D(p);
  const g = ramp(t, d * 0.3, d * 0.75);
  return (
    <Stage {...p} env={{ theme: 'dark', rays: false, fish: false }} cam={{ keys: [[0, 960, 560, 1.15, 1], [2.6, 600, 560, 1.5, -2], [5.2, 1200, 560, 1.4, 2], [7.8, 1300, 540, 1.2, -1], [d, 960, 560, 1.15, 0]] }}>
      <g transform="translate(500 560)"><rect x={-60} y={-40} width={120} height={80} rx={10} fill={C.cyan} /><Txt x={0} y={100} size={30}>HUMANO</Txt></g>
      <g transform="translate(1250 560)"><rect x={-60 - 340 * g} y={-40 - 160 * g} width={120 + 680 * g} height={80 + 320 * g} rx={14} fill="#ff9fb8" /><Txt x={0} y={100 + 160 * g} size={30}>AJOLOTE</Txt></g>
      <Txt x={1250} y={570} size={110} color="#0f2240" s={pop(t, d * 0.75)}>×10</Txt>
    </Stage>); };

S.puente_hogar = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={canal({ t, seed: 16, murky: 1 })} light={(tt) => 1 - 0.3 * ramp(tt, 0.5, d)} cam={{ keys: [[0, 960, 560, 1.2, 2], [d * 0.5, 960, 600, 1.5, -2], [d, 960, 600, 1.9, 1]] }}>
      <Mud t={t} y={900} />
      <Axo x={960} y={640} s={1.3} t={t} />
      <g transform="translate(960 300)"><path d="M-80,40 L0,-40 L80,40 L80,100 L-80,100Z" fill="#c9a86a" stroke="#8b6e3c" strokeWidth={5} transform={`scale(${pop(t, d * 0.4)})`} /></g>
    </Stage>); };

S.xochimilco = (p) => { const { t } = p; const d = D(p);
  const z = seg(t, d * 0.3, d * 0.7);
  return (
    <Stage {...p} env={{ theme: 'map', rays: false, ridges: false, fish: false }} cam={{ keys: [[0, 960, 540, 1.0, 0], [2.6, 960, 560, 1.3, -2], [d * 0.6, 1100, 640, 2.4, 1], [d * 0.85, 1120, 650, 2.9, -1], [d, 1100, 640, 2.4, 0]] }}>
      <path d="M300,200 C700,120 1400,150 1700,300 C1800,500 1600,850 1200,900 C800,950 400,800 300,600Z" fill="#c9a86a" stroke="#8b6e3c" strokeWidth={6} />
      <Txt x={900} y={360} size={44}>MÉXICO</Txt>
      <circle cx={1100} cy={600} r={60} fill="#8a8a7a" opacity={0.6} /><Txt x={1100} y={540} size={22} s={pop(t, d * 0.3)}>CIUDAD DE MÉXICO</Txt>
      <g opacity={z}>{[...Array(8)].map((_, k) => <path key={k} d={`M${1060 + k * 12},${630} q10,20 0,40`} stroke="#3f7fa6" strokeWidth={4} fill="none" />)}<Pill x={1120} y={700} text="XOCHIMILCO" color={C.cyan} size={16} s={pop(t, d * 0.65)} /></g>
    </Stage>); };

S.chinampas = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={land('river', { t, seed: 17 })} cam={{ keys: [[0, 960, 560, 1.1, -1], [2.6, 800, 600, 1.4, 2], [5.2, 1150, 620, 1.3, -2], [7.8, 960, 700, 1.6, 1], [d, 960, 600, 1.2, 0]] }}>
      <RiverWater t={t} y={640} />
      {[0, 1, 2].map((k) => <g key={k} transform={`translate(${400 + k * 560} 650)`}><rect x={-200} y={-30} width={400} height={60} fill="#6b4a2a" /><rect x={-200} y={-50} width={400} height={24} fill="#4f9a3a" />{[...Array(6)].map((_, j) => <path key={j} d={`M${-170 + j * 64},-50 q${6 * Math.sin(t * 2 + j)},-30 0,-60`} stroke="#3f8a3a" strokeWidth={8} fill="none" />)}</g>)}
      <g transform={`translate(${lerp(300, 1600, (t / d))} 640)`}><path d="M-140,0 L140,0 L110,40 L-110,40Z" fill="#e8322c" stroke="#7a1a14" strokeWidth={4} /><rect x={-100} y={-60} width={200} height={14} fill="#f5d02e" /></g>
      <Axo x={lerp(1400, 600, t / d)} y={860} s={0.6} t={t} swim={1} />
      <Pill x={960} y={300} text="CHINAMPAS" color={C.green} size={32} s={pop(t, d * 0.2)} />
    </Stage>); };

S.ciudad = (p) => { const { t } = p; const d = D(p);
  const grow = ramp(t, 0.5, d * 0.8);
  return (
    <Stage {...p} env={land('river', { t, seed: 18 })} light={(tt) => 1 - 0.25 * grow} cam={{ keys: [[0, 960, 580, 1.15, 1], [2.6, 700, 560, 1.4, -2], [5.2, 1200, 560, 1.3, 2], [d, 960, 600, 1.45, -1]] }}>
      <RiverWater t={t} y={700} murky={grow > 0.4} />
      {[...Array(14)].map((_, k) => { const h = (120 + (k * 37) % 220) * ramp(t, 0.5 + k * 0.2, 1.2 + k * 0.2); return <rect key={k} x={100 + k * 130} y={690 - h} width={110} height={h} fill={['#b0a090', '#9a8a7a', '#c0b0a0'][k % 3]} stroke="#555" strokeWidth={3} />; })}
      {[...Array(10)].map((_, k) => { const u = mod(t * 0.3 + k / 10, 1); return <circle key={k} cx={200 + k * 170} cy={760 + u * 100} r={10} fill="#5a4a2a" opacity={grow * (1 - u)} />; })}
      <Pill x={960} y={260} text="LA CIUDAD CRECE" color={C.red} size={32} s={pop(t, d * 0.4)} />
    </Stage>); };

S.invasores = (p) => { const { t } = p; const d = D(p);
  const eat = ramp(t, d * 0.45, d * 0.75);
  return (
    <Stage {...p} env={canal({ t, seed: 19, murky: 1 })} cam={{ keys: [[0, 960, 600, 1.15, -1], [2.6, 1100, 620, 1.5, 2], [5.2, 1000, 640, 1.8, -2], [7.8, 960, 620, 1.4, 1], [d, 960, 600, 1.2, 0]] }}>
      <Mud t={t} y={900} />
      {[...Array(8)].map((_, k) => k / 8 < eat ? null : <circle key={k} cx={900 + (k % 4) * 40} cy={850 + Math.floor(k / 4) * 30} r={12} fill="#f4f1ea" fillOpacity={0.7} stroke="#bbb" strokeWidth={2} />)}
      <Fish x={lerp(1800, 1000, ramp(t, 0.3, d * 0.45)) + eat * 40 * Math.sin(t * 6)} y={820} s={2.6} t={t} color="#c9a36a" wag={1.4} flip />
      <Fish x={lerp(2000, 1300, ramp(t, 0.6, d * 0.5))} y={700} s={2.2} t={t} seed={3} color="#8a9aa8" wag={1.4} flip />
      <Axo x={500} y={640} s={0.9} t={t} swim={0.3} />
      <Pill x={1300} y={450} text="CARPAS Y TILAPIAS" color={C.red} size={30} s={pop(t, d * 0.3)} />
    </Stage>); };

S.censo = (p) => { const { t } = p; const d = D(p);
  const yr = Math.round(lerp(1998, 2014, ramp(t, d * 0.2, d * 0.85)));
  const n = Math.round(lerp(6000, 36, Math.pow(ramp(t, d * 0.2, d * 0.85), 0.5)));
  const dots = Math.round(n / 60);
  return (
    <Stage {...p} env={canal({ t, seed: 20 })} light={(tt) => 1 - 0.25 * ramp(tt, d * 0.3, d * 0.85)} cam={{ keys: [[0, 960, 560, 1.15, -1], [2.6, 960, 600, 1.4, 2], [5.2, 960, 560, 1.25, -2], [d, 960, 560, 1.5, 1]] }}>
      <rect x={560} y={260} width={800} height={560} fill="#0f2240" fillOpacity={0.5} stroke="#fff" strokeWidth={4} />
      {[...Array(100)].map((_, k) => k < dots ? <circle key={k} cx={600 + (k % 10) * 80} cy={300 + Math.floor(k / 10) * 52} r={14} fill="#ff9fb8" /> : null)}
      <Txt x={960} y={200} size={70} color="#fff">{yr}</Txt>
      <Txt x={960} y={920} size={50} color={C.gold}>{n.toLocaleString('es-CO').replace(/,/g, '.')} POR KM²</Txt>
    </Stage>); };

S.peligro = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={lab} cam={{ keys: [[0, 600, 560, 1.4, -1], [2.6, 960, 560, 1.15, 2], [5.2, 1300, 560, 1.4, -2], [d, 960, 560, 1.25, 1]] }}>
      <g transform="translate(560 560)"><rect x={-300} y={-220} width={600} height={440} fill="#5f9a7a" stroke="#333" strokeWidth={6} /><Axo x={0} y={0} s={0.5} t={t} opacity={0.4} /><Txt x={0} y={280} size={30}>EN XOCHIMILCO</Txt></g>
      <g transform="translate(1350 560)">{[...Array(9)].map((_, k) => <Tank key={k} x={(k % 3) * 170 - 170} y={Math.floor(k / 3) * 140 - 140} w={150} h={110}><Axo x={(k % 3) * 170 - 170} y={Math.floor(k / 3) * 140 - 140} s={0.12} t={t} seed={k} color="#f3c1c9" gill="#e2405a" wild={false} /></Tank>)}<Txt x={0} y={280} size={30}>EN ACUARIOS</Txt></g>
      <g transform={`translate(560 360) rotate(-10) scale(${pop(t, d * 0.3)})`}><rect x={-230} y={-40} width={460} height={80} rx={10} fill={C.red} /><text y={16} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#fff">PELIGRO CRÍTICO</text></g>
    </Stage>); };

S.puente_cultura = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={land('dusk', { t, seed: 21 })} cam={{ keys: [[0, 960, 560, 1.2, -2], [d * 0.5, 960, 540, 1.5, 2], [d, 960, 520, 1.8, -1]] }}>
      <Ground t={t} kind="dusk" y={820} />
      <path d="M660,820 L760,560 L1160,560 L1260,820Z M720,560 L800,380 L1120,380 L1200,560Z M780,380 L840,260 L1080,260 L1140,380Z" fill="#b08a5a" stroke="#6a4a2a" strokeWidth={5} />
      <Axo x={960} y={200} s={0.6 * pop(t, d * 0.4)} t={t} />
    </Stage>); };

S.xolotl = (p) => { const { t } = p; const d = D(p);
  const forms = ramp(t, d * 0.25, d * 0.75);
  const stage = Math.floor(forms * 3.99);
  return (
    <Stage {...p} env={land('dusk', { t, seed: 22 })} light={(tt) => 1 + 0.2 * Math.max(0, Math.sin(tt * 4))} cam={{ keys: [[0, 960, 560, 1.15, -1], [2.6, 960, 540, 1.5, 2], [5.2, 1000, 560, 1.3, -2], [7.8, 960, 620, 1.6, 1], [10.4, 960, 600, 1.3, -1], [d, 960, 600, 1.2, 0]] }}>
      <Ground t={t} kind="dusk" y={820} />
      {stage === 0 && <g transform="translate(960 600)"><path d="M-60,200 L-40,0 L40,0 L60,200Z" fill="#2a1a3a" /><circle cy={-40} r={50} fill="#4a2a5a" /><path d="M-70,-80 L-40,-140 L0,-90 L40,-140 L70,-80Z" fill={C.gold} /><Txt x={0} y={-180} size={36} color={C.gold}>XÓLOTL</Txt></g>}
      {stage === 1 && <g transform="translate(960 700)"><ellipse rx={90} ry={40} fill="#e8b84a" /><path d="M-30,-30 L0,-110 L30,-30Z" fill="#4f9a3a" /></g>}
      {stage === 2 && <g transform="translate(960 700)"><ellipse rx={110} ry={50} fill="#c9a36a" stroke="#6a4a2a" strokeWidth={4} /><path d="M-60,-30 l-20,-60 M60,-30 l20,-60" stroke="#c9a36a" strokeWidth={14} /></g>}
      {stage === 3 && <g><RiverWater t={t} y={700} /><Axo x={960} y={780} s={1} t={t} /></g>}
      <circle cx={960} cy={620} r={260} fill="none" stroke={C.purple} strokeWidth={8} opacity={Math.abs(Math.sin(forms * Math.PI * 4))} />
      <Pill x={960} y={250} text="«MONSTRUO DE AGUA»" color={C.purple} size={30} s={pop(t, d * 0.8)} />
    </Stage>); };

S.billete = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={{ theme: 'dark', rays: false, fish: false }} cam={{ keys: [[0, 960, 560, 1.15, -2], [2.6, 900, 540, 1.5, 2], [5.2, 1100, 560, 1.3, -1], [d, 960, 560, 1.2, 1]] }}>
      <g transform={`translate(960 500) rotate(${-8 + 6 * Math.sin(t)}) scale(${pop(t, 0.3)})`}><rect x={-420} y={-200} width={840} height={400} rx={20} fill="#c97aa0" stroke="#6a2a4a" strokeWidth={8} /><text x={-360} y={-120} fontFamily={FONT} fontWeight={900} fontSize={90} fill="#fff">50</text><Axo x={80} y={20} s={0.9} t={t} color="#f3c1c9" gill="#e2405a" wild={false} /></g>
      {[...Array(5)].map((_, k) => <g key={k} transform={`translate(${300 + k * 330} ${900 - ramp(t, d * 0.4 + k * 0.3, d) * 80}) scale(${pop(t, d * 0.4 + k * 0.3)})`}><rect x={-80} y={-60} width={160} height={120} rx={14} fill="#fff" stroke="#0f2240" strokeWidth={4} /><text y={10} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={22} fill="#0f2240">{['MURALES', 'JUGUETES', 'JUEGOS', 'PELUCHES', 'MEMES'][k]}</text></g>)}
    </Stage>); };

S.refugios = (p) => { const { t } = p; const d = D(p);
  const clean = ramp(t, d * 0.3, d * 0.7);
  return (
    <Stage {...p} env={canal({ t, seed: 23, murky: clean < 0.5 ? 1 : 0 })} light={(tt) => 0.85 + 0.25 * clean} cam={{ keys: [[0, 960, 600, 1.15, -1], [2.6, 800, 600, 1.4, 2], [5.2, 1150, 600, 1.5, -2], [7.8, 960, 620, 1.3, 1], [10.4, 960, 600, 1.45, -1], [d, 960, 600, 1.2, 0]] }}>
      <Mud t={t} y={920} />
      <rect x={1380} y={200} width={30} height={760} fill="#8a6a4a" /><g>{[...Array(12)].map((_, k) => <line key={k} x1={1380} y1={220 + k * 60} x2={1410} y2={250 + k * 60} stroke="#555" strokeWidth={4} />)}</g>
      <Fish x={1600} y={700} s={2.2} t={t} color="#c9a36a" flip wag={1.5} />
      <Axo x={lerp(500, 900, t / d)} y={700} s={0.9} t={t} swim={0.8} />
      {[0, 1].map((k) => <Axo key={k} x={600 + k * 300} y={820} s={0.2 * pop(t, d * 0.7 + k * 0.3)} t={t} seed={k + 5} swim={1} />)}
      <Pill x={700} y={300} text="FILTROS + BARRERAS" color={C.cyan} size={30} s={pop(t, d * 0.25)} />
      <Pill x={1100} y={420} text="SELLO DE CULTIVO LIMPIO" color={C.green} size={26} s={pop(t, d * 0.65)} />
    </Stage>); };

S.ayudar = (p) => { const { t } = p; const d = D(p);
  const stop = ramp(t, d * 0.55, d * 0.7);
  return (
    <Stage {...p} env={land('river', { t, seed: 24 })} cam={{ keys: [[0, 960, 600, 1.15, -1], [2.6, 800, 600, 1.4, 2], [5.2, 1150, 620, 1.5, -2], [d, 960, 600, 1.25, 1]] }}>
      <RiverWater t={t} y={720} />
      <Person x={700} y={700} s={1.1} t={t} arms={0.4 + 0.3 * Math.sin(t * 2)} shirt="#16a085" />
      <g transform={`translate(${lerp(860, 1050, ramp(t, d * 0.3, d * 0.5)) - stop * 180} 560)`}><rect x={-70} y={-50} width={140} height={100} rx={10} fill="#9fd4f5" fillOpacity={0.6} stroke="#5a7a8a" strokeWidth={5} /><Axo x={0} y={10} s={0.2} t={t} color="#f3c1c9" gill="#e2405a" wild={false} /></g>
      <g transform="translate(1250 460)" opacity={ramp(t, d * 0.6, d * 0.7)}><circle r={80} fill="none" stroke={C.red} strokeWidth={14} /><line x1={-56} y1={-56} x2={56} y2={56} stroke={C.red} strokeWidth={14} /></g>
      <Pill x={960} y={260} text="NUNCA LO SUELTES EN UN RÍO" color={C.red} size={30} s={pop(t, d * 0.65)} />
    </Stage>); };

S.resumen = (p) => { const { t } = p; const d = D(p);
  const tags = ['BRANQUIAS', 'BEBÉ ETERNO', 'REGENERA', 'SOLO EN XOCHIMILCO'];
  return (
    <Stage {...p} env={canal({ t, seed: 25 })} cam={{ focus: (tt) => [960 + 300 * Math.cos(tt * 0.45), 600], zamt: 0.7 }}>
      <Mud t={t} y={920} />
      <Axo x={960 + 300 * Math.cos(t * 0.45)} y={640} s={1} t={t} swim={1} flip={Math.sin(t * 0.45) > 0} glow={0.3} />
      {tags.map((n, k) => { const a = k * 1.57 + t * 0.4; return <Pill key={k} x={960 + 520 * Math.cos(a)} y={480 + 220 * Math.sin(a)} text={n} size={28} color={[C.red, C.gold, C.cyan, C.green][k]} s={pop(t, d * (0.15 + k * 0.15))} />; })}
    </Stage>); };

S.cierre = (p) => { const { t } = p; const d = D(p); const tc = d * 0.3;
  const pressed = t > tc;
  const ring = t > d * 0.4 ? 18 * Math.sin((t - d * 0.4) * 22) * Math.exp(-(t - d * 0.4) * 1.5) : 0;
  return (
    <Stage {...p} env={canal({ t, seed: 26 })} cam={{ keys: [[0, 960, 520, 1.2, -2], [2.5, 1000, 470, 1.45, 1], [5, 960, 560, 1.1, -1], [d, 960, 560, 1.25, 0]] }}>
      <Axo x={lerp(300, 1600, t / d)} y={830} s={0.6} t={t} swim={1} />
      <g transform={`translate(860 450) scale(${pressed ? 1 - 0.08 * Math.max(0, 1 - (t - tc) * 6) : pop(t, 0.2)})`}><rect x={-270} y={-70} width={540} height={140} rx={34} fill={pressed ? '#5a5a5a' : '#e61e28'} /><text x={0} y={22} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={58} fill="#fff">{pressed ? 'SUSCRITO ✓' : 'SUSCRÍBETE'}</text></g>
      <g transform={`translate(1240 450) rotate(${ring})`}><path d="M-40,30 C-40,-40 -25,-60 0,-60 C25,-60 40,-40 40,30 L50,40 L-50,40Z" fill={C.gold} /><circle cy={52} r={11} fill={C.gold} /></g>
      <g transform={`translate(${lerp(1500, 1010, ease(ramp(t, 0.5, tc)))} ${lerp(900, 460, ease(ramp(t, 0.5, tc)))})`}><path d="M0,0 L0,60 L16,46 L28,72 L38,66 L26,42 L46,40Z" fill="#fff" stroke="#000" strokeWidth={3} /></g>
      <Txt x={960} y={250} size={50} color={C.gold} s={pop(t, d * 0.5)}>¿QUÉ ANIMAL SIGUE?</Txt>
    </Stage>); };

S.nocturno = (p) => { const { t } = p; const d = D(p);
  const night = ramp(t, d * 0.4, d * 0.6);
  return (
    <Stage {...p} env={canal({ t, seed: 27 })} light={(tt) => 1 - 0.5 * ramp(tt, d * 0.4, d * 0.6)} cam={{ keys: [[0, 900, 680, 1.4, -1], [2.6, 960, 660, 1.2, 2], [5.2, 1050, 640, 1.5, -2], [7.8, 1100, 620, 1.3, 1], [d, 1000, 640, 1.2, 0]] }}>
      <Mud t={t} y={900} />
      <Axo x={lerp(820, 1300, ramp(t, d * 0.6, d))} y={lerp(860, 700, ramp(t, d * 0.6, d * 0.75))} s={0.9} t={t} swim={night} opacity={0.5 + 0.5 * night} />
      {[...Array(8)].map((_, k) => <path key={k} d={`M${700 + k * 40},900 q${10 * Math.sin(t + k)},-80 0,-160`} stroke="#3f7a3a" strokeWidth={12} fill="none" />)}
      <circle cx={1600 - 200 * night} cy={lerp(400, 140, night)} r={60} fill={night > 0.5 ? '#e8eef7' : '#fff2c4'} opacity={0.6} />
      <Pill x={960} y={300} text={night > 0.5 ? 'SALE DE NOCHE' : 'ESCONDIDO DE DÍA'} color={night > 0.5 ? C.purple : C.gold} size={30} s={pop(t, night > 0.5 ? d * 0.6 : 0.5)} />
    </Stage>); };

S.macrofagos = (p) => { const { t } = p; const d = D(p);
  const removed = ramp(t, d * 0.55, d * 0.65);
  return (
    <Stage {...p} env={{ theme: 'dark', rays: false, fish: false }} cam={{ keys: [[0, 900, 600, 1.4, -1], [2.6, 860, 620, 1.9, 2], [5.2, 960, 600, 1.4, -2], [7.8, 1100, 600, 1.6, 1], [d, 1000, 600, 1.3, 0]] }}>
      <Axo x={960} y={560} s={1.6} t={t} missing={removed > 0.5 ? 1 : 1 - ramp(t, 1, d * 0.5)} opacity={0.8} />
      {[...Array(8)].map((_, k) => { const a = k * 0.8 + t; return <g key={k} opacity={1 - removed}><circle cx={864 + Math.cos(a) * 60} cy={614 + Math.sin(a) * 40} r={16} fill="#7ee081" stroke="#2a6a3a" strokeWidth={3} /><circle cx={864 + Math.cos(a) * 60 + 4} cy={614 + Math.sin(a) * 40 - 4} r={5} fill="#2a6a3a" /></g>; })}
      {removed > 0.5 && <path d="M830,620 L900,620" stroke="#c0605a" strokeWidth={14} strokeLinecap="round" />}
      <Pill x={700} y={300} text="MACRÓFAGOS" color={C.green} size={32} s={pop(t, d * 0.15)} />
      <Pill x={1250} y={300} text="SIN ELLOS: CICATRIZ" color={C.red} size={30} s={pop(t, d * 0.68)} />
    </Stage>); };

export const ORDER17 = ['apertura', 'titulo', 'anfibio', 'cuerpo', 'branquias', 'pulmones', 'colores', 'caza', 'huevos', 'nocturno', 'puente_bebe', 'metamorfosis', 'neotenia', 'tiroides', 'puente_regen', 'pata', 'reconstruye', 'macrofagos', 'organos', 'humano', 'genoma', 'puente_hogar', 'xochimilco', 'chinampas', 'ciudad', 'invasores', 'censo', 'peligro', 'puente_cultura', 'xolotl', 'billete', 'refugios', 'ayudar', 'resumen', 'cierre'];
export const S17 = S;
