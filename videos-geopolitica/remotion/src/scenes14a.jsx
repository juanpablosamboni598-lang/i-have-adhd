import React from 'react';
import { C, FONT, cl, lerp, ramp, ease, eo, seg, pop, mod, rng, pathPts, Pill, Ring, Counter } from './lib.jsx';
import { Stage } from './stage.jsx';
import { Shark } from './actors.jsx';
import { Quad, Croc, Snake, Person } from './actors2.jsx';
import { LandBack, Ground, RiverWater, Dust, HeatWaves, Gauge, Thermo } from './lands.jsx';

export const Txt = ({ x, y, s = 1, size = 60, color = '#fff', children, rot = 0, op = 1 }) => (s <= 0.01 ? null :
  <text transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={size} fill={color} stroke="#000" strokeWidth={size / 9} paintOrder="stroke" opacity={op}>{children}</text>);
export const land = (kind, extra = {}) => ({ custom: (cam) => <LandBack cam={cam} t={extra.t || 0} kind={kind} seed={extra.seed || 1} />, rayStrength: 0.5, fish: false, ...extra });
const D = (p) => p.frames / 30;

// 0 · Cocodrilo: mordida brutal… y una cinta
const s0 = (p) => { const { t } = p; const d = D(p);
  const snap = t < d * 0.5 ? Math.max(0, Math.sin(t * 5)) : 0;
  const tape = ramp(t, d * 0.55, d * 0.8);
  const struggle = t > d * 0.8 ? 0.06 * Math.abs(Math.sin(t * 14)) : 0;
  return (
    <Stage {...p} env={land('river', { t })} cam={{ keys: [[0, 1000, 560, 1.3, -2], [2.4, 1150, 520, 1.6, 1.5], [d * 0.55, 1250, 540, 1.9, -1], [d * 0.8, 1180, 560, 1.45, 2], [d, 1100, 560, 1.25, 0]], shake: (tt) => (tt < d * 0.5 ? Math.max(0, Math.sin(tt * 5)) * 0.4 : 0) }}>
      <RiverWater t={t} y={640} lilies />
      <Croc x={820} y={610} s={1.15} t={t} jaw={snap + struggle} tape={tape} />
      {[...Array(3)].map((_, k) => <Ring key={k} x={1250} y={600} t={t} t0={0.3 + k * 1.25} dur={0.5} maxR={140} color="#fff" />)}
      <g transform={`translate(${lerp(1700, 1280, eo(ramp(t, d * 0.5, d * 0.62)))} 520)`} opacity={1 - ramp(t, d * 0.82, d * 0.9)}>
        <path d="M0,0 C30,-10 80,-10 120,10 L120,40 C80,30 30,30 0,30Z" fill="#f0c8a0" stroke="#8a6040" strokeWidth={4} />
        <circle cx={-10} cy={15} r={30} fill="#c8c8c8" stroke="#888" strokeWidth={5} transform={`rotate(${t * 400} -10 15)`} />
      </g>
      <Pill x={1150} y={300} text="MORDIDA BRUTAL" color={C.red} size={34} s={pop(t, 0.6) * (1 - ramp(t, d * 0.5, d * 0.55))} />
      <Pill x={1200} y={300} text="…Y UNA CINTA BASTA" color={C.gold} size={34} s={pop(t, d * 0.75)} />
    </Stage>); };

// 1 · Título + 7 tarjetas
const ANIM = ['cocodrilo', 'guepardo', 'león', 'anaconda', 'oso polar', 'tiburón', 'orca'];
const s1 = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={{ theme: 'deep' }} cam={{ keys: [[0, 960, 420, 1.25, -2], [2.6, 960, 480, 1.05, 1], [5.2, 960, 640, 1.2, -1], [7.8, 1300, 640, 1.5, 2], [10.4, 1250, 600, 1.7, -1.5], [d, 960, 560, 1.15, 0]] }}>
      <Txt x={960} y={300} size={86} s={pop(t, 0.3)} rot={-2 + 2 * Math.sin(t)}>EL PUNTO DÉBIL SECRETO</Txt>
      <Txt x={960} y={400} size={72} color={C.gold} s={pop(t, 0.9)} rot={2 * Math.sin(t + 1)}>DE 7 SÚPER DEPREDADORES</Txt>
      {ANIM.map((a, k) => { const s = pop(t, 2 + k * 0.45, 0.5); const flip = k === 5 ? seg(t, d * 0.6, d * 0.72) : 0; const x = 330 + k * 210, y = 640 + 14 * Math.sin(t * 2 + k);
        return <g key={k} transform={`translate(${x} ${y}) scale(${s * (1 - 2 * flip * (1 - flip) * 2)} ${s})`}>
          <rect x={-90} y={-110} width={180} height={220} rx={20} fill={k === 5 && flip > 0.5 ? '#4a0d14' : '#0f2240'} stroke={k === 5 ? C.red : C.gold} strokeWidth={5} />
          <text y={-40} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={70} fill={C.gold}>{k + 1}</text>
          <text y={60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={k === 4 ? 24 : 28} fill="#fff">{k === 5 && flip > 0.5 ? '¿PRESA?' : a.toUpperCase()}</text>
        </g>; })}
    </Stage>); };

// 2 · Tamaño del cocodrilo: canoa como escala
const s2 = (p) => { const { t } = p; const d = D(p);
  const cx = lerp(-300, 760, eo(ramp(t, 0, d * 0.4)));
  const ruler = eo(ramp(t, d * 0.4, d * 0.6));
  return (
    <Stage {...p} env={land('river', { t, seed: 4 })} cam={{ focus: (tt) => [lerp(500, 1000, ramp(tt, 0, d * 0.5)), 560], zamt: 0.7 }}>
      <RiverWater t={t} y={600} />
      <g transform={`translate(${1250 + 20 * Math.sin(t)} ${598 + 4 * Math.sin(t * 2)}) rotate(${2 * Math.sin(t * 1.5)})`}>
        <path d="M-200,0 Q0,40 200,0 L180,-20 L-180,-20Z" fill="#b5651d" stroke="#5a3010" strokeWidth={4} />
        <Person x={20} y={-30} s={0.5} t={t} arms={Math.abs(Math.sin(t * 2)) * 0.5} hat={false} shirt="#e67e22" />
      </g>
      <Croc x={cx} y={640} s={1} t={t} swim={1.2} />
      <g opacity={ruler}><rect x={cx - 390} y={720} width={780 * ruler} height={26} fill="#f5d000" stroke="#7a6500" strokeWidth={3} />
        <Counter x={cx} y={820} t={t} t0={d * 0.4} t1={d * 0.6} v1={6} size={70} color={C.gold} suffix=" m" /></g>
      <Pill x={cx} y={430} text="MÁS DE UNA TONELADA" color={C.cyan} size={32} s={pop(t, d * 0.7)} />
    </Stage>); };

// 3 · Mordida: caparazón que se parte
const s3 = (p) => { const { t } = p; const d = D(p); const tb = d * 0.45;
  const jaw = t < tb ? lerp(0.9, 0.9, 1) * (1 - ramp(t, tb - 0.4, tb)) : 0.05;
  const crack = ramp(t, tb, tb + 0.4);
  const pres = 3000 * eo(ramp(t, tb - 0.4, tb + 1));
  return (
    <Stage {...p} env={land('river', { t, seed: 6 })} light={(tt) => 1 + 0.3 * Math.max(0, 1 - Math.abs(tt - tb) * 4)} cam={{ keys: [[0, 900, 560, 1.2, 2], [2.5, 1150, 540, 1.6, -1], [tb, 1240, 560, 2.0, 1], [tb + 2, 1100, 540, 1.4, -2], [d, 1000, 560, 1.25, 1]], shake: (tt) => Math.max(0, 1 - Math.abs(tt - tb) * 3) }}>
      <RiverWater t={t} y={680} />
      <Croc x={760} y={610} s={1.1} t={t} jaw={jaw} />
      <g transform={`translate(1230 600)`}>
        <g transform={`translate(${-crack * 30} ${crack * 20}) rotate(${-crack * 25})`}><path d="M-60,0 A60,40 0 0,1 0,-40 L0,10Z" fill="#6b8e23" stroke="#3a4f10" strokeWidth={4} /></g>
        <g transform={`translate(${crack * 30} ${crack * 25}) rotate(${crack * 30})`}><path d="M0,-40 A60,40 0 0,1 60,0 L0,10Z" fill="#6b8e23" stroke="#3a4f10" strokeWidth={4} /></g>
        {crack > 0 && crack < 1 && [...Array(10)].map((_, k) => <line key={k} x1={0} y1={-10} x2={Math.cos(k) * 90 * crack} y2={-10 + Math.sin(k) * 70 * crack} stroke="#fff" strokeWidth={4} />)}
      </g>
      <Gauge x={1500} y={330} v={pres} max={3500} label={`${Math.round(pres).toLocaleString('es-CO').replace(/,/g, '.')} kg`} t={t} size={0.85} />
    </Stage>); };

// 4 · Músculos: el que cierra vs el que abre (corte anatómico)
const s4 = (p) => { const { t } = p; const d = D(p);
  const strong = ramp(t, d * 0.2, d * 0.35), weak = ramp(t, d * 0.55, d * 0.7);
  return (
    <Stage {...p} env={{ theme: 'dark', rays: false, fish: false }} cam={{ keys: [[0, 960, 540, 1.1, 0], [2.4, 900, 520, 1.45, -2], [4.8, 1100, 560, 1.6, 1.5], [d, 960, 540, 1.25, -1]] }}>
      <Croc x={560} y={560} s={1.5} t={t} jaw={0.25 + 0.2 * Math.sin(t * 2)} xray={ramp(t, 0.3, 1)} />
      <g opacity={strong}><path d={`M940,${330 + 20 * Math.sin(t * 6)} l0,90`} stroke={C.red} strokeWidth={22} /><path d="M915,420 l25,40 l25,-40Z" fill={C.red} /><Pill x={940} y={280} text="CERRAR: FUERTÍSIMO" color={C.red} size={30} s={pop(t, d * 0.22)} /></g>
      <g opacity={weak}><path d={`M1180,${700 - 6 * Math.sin(t * 4)} l0,-40`} stroke={C.cyan} strokeWidth={8} /><path d="M1172,662 l8,-14 l8,14Z" fill={C.cyan} /><Pill x={1200} y={790} text="ABRIR: DÉBIL" color={C.cyan} size={30} s={pop(t, d * 0.58)} /></g>
    </Stage>); };

// 5 · Investigadores: manos y cinta
const s5 = (p) => { const { t } = p; const d = D(p);
  const tape = ramp(t, d * 0.4, d * 0.75);
  return (
    <Stage {...p} env={land('river', { t, seed: 8 })} cam={{ keys: [[0, 900, 580, 1.2, 1], [2.4, 1150, 560, 1.7, -2], [4.8, 1250, 560, 2.0, 1], [d, 1000, 580, 1.35, -1]] }}>
      <Ground t={t} kind="river" y={700} />
      <Croc x={700} y={650} s={1.05} t={t} swim={0.4} tape={tape} jaw={0.04 * Math.abs(Math.sin(t * 10)) * (1 - tape)} />
      <Person x={1180} y={640} s={1.1} t={t} arms={0.5 + 0.3 * Math.sin(t * 4)} shirt="#16a085" />
      <Person x={500} y={640} s={1.05} t={t} seed={9} arms={0.2} flip shirt="#8e44ad" />
      <Pill x={1100} y={340} text="UNAS VUELTAS DE CINTA" s={pop(t, d * 0.45)} size={32} />
    </Stage>); };

// 6 · Giro de la muerte
const s6 = (p) => { const { t } = p; const d = D(p);
  const rollOn = ramp(t, d * 0.35, d * 0.45);
  const roll = rollOn * t * 7;
  return (
    <Stage {...p} env={land('river', { t, seed: 10 })} cam={{ keys: [[0, 900, 600, 1.2, -2], [2.6, 1000, 640, 1.5, 2], [5.2, 1050, 680, 1.8, -3], [7.8, 1000, 660, 1.4, 3], [10.4, 950, 640, 1.6, -1], [d, 950, 620, 1.25, 0]], shake: (tt) => rollOn * 0.3 }}>
      <RiverWater t={t} y={600} murky />
      <g transform={`rotate(${rollOn * 6 * Math.sin(roll)} 900 700)`}><Croc x={760} y={700} s={1} t={t} roll={roll} jaw={0.1} swim={0.8} /></g>
      {rollOn > 0 && [...Array(4)].map((_, k) => <Ring key={k} x={960} y={600} t={t} t0={d * 0.4 + k * 1.2} dur={1} maxR={300} color="#e8f7ff" />)}
      {rollOn > 0 && [...Array(24)].map((_, k) => { const u = mod(t * 1.5 + k / 24, 1); return <circle key={k} cx={960 + Math.cos(k * 2.6) * u * 300} cy={600 - Math.sin(k * 1.3) * u * 160 + 300 * u * u} r={5 + (k % 3) * 3} fill="#e8f7ff" opacity={1 - u} />; })}
      <Pill x={960} y={330} text="EL GIRO DE LA MUERTE" color={C.red} s={pop(t, d * 0.55)} />
    </Stage>); };

// 7 · Solo en una dirección → el guepardo
const s7 = (p) => { const { t } = p; const d = D(p); const tc = d * 0.45;
  return (
    <Stage {...p} env={land(t < tc ? 'river' : 'savanna', { t, seed: 12 })} cam={{ keys: [[0, 1000, 560, 1.5, 2], [2.5, 1100, 560, 1.25, -1], [tc, 960, 560, 1.0, 0], [tc + 2.6, 960, 600, 1.3, 2], [d, 1100, 620, 1.5, -2]] }}>
      {t < tc && <g><RiverWater t={t} y={680} /><Croc x={760} y={640} s={1.1} t={t} jaw={0.5 + 0.4 * Math.sin(t * 3)} />
        <g transform="translate(1180 420)"><path d="M0,60 L0,-40" stroke={C.green} strokeWidth={14} /><path d="M-24,-30 L0,-64 L24,-30Z" fill={C.green} /><path d="M80,-40 L80,60" stroke={C.red} strokeWidth={14} opacity={0.6} /><path d="M56,50 L80,84 L104,50Z" fill={C.red} opacity={0.6} /><path d="M50,0 l60,40 m0,-40 l-60,40" stroke={C.red} strokeWidth={10} /></g></g>}
      {t >= tc && <g><Ground t={t} kind="savanna" y={780} /><Quad kind="cheetah" x={lerp(-300, 2300, ramp(t, tc, d))} y={680} s={1.2} t={t} speed={1.6} />
        <Dust x={lerp(-300, 2300, ramp(t, tc, d)) - 140} y={770} t={t} /><Pill x={960} y={330} text="EL ARRANQUE MÁS RÁPIDO" color={C.gold} s={pop(t, tc + 0.6)} /></g>}
    </Stage>); };

// 8 · Guepardo 0 → 100 km/h
const s8 = (p) => { const { t } = p; const d = D(p);
  const v = 98 * eo(ramp(t, d * 0.2, d * 0.55));
  const dist = t * 200 + v * t * 4;
  return (
    <Stage {...p} env={land('savanna', { t, seed: 14 })} cam={{ focus: () => [900, 600], zamt: 0.6 }} hud={() => <Gauge x={1560} y={300} v={v} max={110} label={`${Math.round(v)} km/h`} t={t} size={0.8} />}>
      <g transform={`translate(${-mod(dist, 1600)} 0)`}><Ground t={t} kind="savanna" y={780} x0={-400} x1={4400} />
        {[...Array(8)].map((_, k) => <g key={k} transform={`translate(${k * 520 + 100} 760)`}><path d="M0,0 L0,-60" stroke="#5a3a1a" strokeWidth={8} /><ellipse cx={0} cy={-66} rx={60} ry={14} fill="#6f8a3a" /></g>)}</g>
      <Quad kind="cheetah" x={850} y={680} s={1.35} t={t} speed={0.4 + v / 60} />
      <Dust x={680} y={770} t={t} on={v / 98} n={24} />
      {[...Array(8)].map((_, k) => <line key={k} x1={500 - k * 30} y1={560 + k * 22} x2={500 - k * 30 - v * 3} y2={560 + k * 22} stroke="#fff" strokeWidth={4} opacity={0.5 * v / 98} />)}
      <Counter x={850} y={400} t={t} t0={d * 0.2} t1={d * 0.55} v1={3} size={60} color="#fff" suffix=" SEGUNDOS" />
    </Stage>); };

// 9 · Máquina de correr: columna resorte, cola timón
const s9 = (p) => { const { t } = p; const d = D(p);
  const curve = ramp(t, d * 0.6, d);
  const a = curve * Math.PI * 0.9;
  const x = curve > 0 ? 960 + 420 * Math.sin(a) : lerp(300, 960, eo(ramp(t, 0, d * 0.5))), y = curve > 0 ? 640 - 160 * (1 - Math.cos(a)) : 640;
  return (
    <Stage {...p} env={land('savanna', { t, seed: 16 })} cam={{ keys: [[0, 700, 600, 1.3, -1], [2.6, 960, 580, 1.7, 2], [5.2, 980, 560, 1.4, -2], [7.8, 1150, 520, 1.25, 1], [d, 1200, 480, 1.4, -1]] }}>
      <Ground t={t} kind="savanna" y={780} />
      <Quad kind="cheetah" x={x} y={y} rot={curve > 0 ? -Math.cos(a) * 25 + 25 : 0} s={1.4} t={t} speed={1.4} xray={ramp(t, d * 0.2, d * 0.3) * (1 - ramp(t, d * 0.55, d * 0.6))} heartS={0.8} />
      <Pill x={960} y={330} text="COLUMNA = RESORTE" color={C.cyan} size={30} s={pop(t, d * 0.25) * (1 - ramp(t, d * 0.55, d * 0.6))} />
      {curve > 0 && <g><path d={`M600,700 A420,420 0 0,0 1380,620`} stroke="#fff" strokeWidth={4} strokeDasharray="14 12" fill="none" strokeDashoffset={-t * 60} opacity={0.6} /><Pill x={1300} y={330} text="COLA = TIMÓN" color={C.gold} size={30} s={pop(t, d * 0.65)} /></g>}
    </Stage>); };

// 10 · Se sobrecalienta: termómetro, cronómetro, jadeo
const s10 = (p) => { const { t } = p; const d = D(p); const ts = d * 0.55;
  const run = t < ts; const heat = ramp(t, 0.5, ts);
  const x = run ? lerp(300, 1100, t / ts) : 1100;
  return (
    <Stage {...p} env={land('savanna', { t, seed: 18 })} light={(tt) => 1 + 0.15 * heat} cam={{ keys: [[0, 600, 600, 1.3, 1], [2.6, 800, 600, 1.15, -2], [5.2, 1000, 600, 1.4, 2], [ts, 1100, 620, 1.7, -1], [ts + 2.6, 1080, 640, 1.9, 1], [d, 1050, 620, 1.4, 0]] }}
      hud={() => <g><Thermo x={1700} y={420} v={0.2 + 0.75 * heat} t={t} col={heat > 0.6 ? C.red : '#ff9f43'} /><g transform="translate(1520 160)"><circle r={54} fill="#0f2240" stroke="#fff" strokeWidth={5} /><line x1={0} y1={0} x2={40 * Math.sin(Math.min(t, ts) * 1.4)} y2={-40 * Math.cos(Math.min(t, ts) * 1.4)} stroke={C.gold} strokeWidth={7} strokeLinecap="round" /><text y={92} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill="#fff" stroke="#000" strokeWidth={4} paintOrder="stroke">{Math.round(30 * Math.min(1, t / ts))} s</text></g></g>}>
      <Ground t={t} kind="savanna" y={780} />
      <Quad kind="cheetah" x={x} y={680} s={1.3} t={t} speed={run ? 1.6 : 0.2} run={run} heat={heat * 0.9} tongue={run ? 0 : 1} mouth={run ? 0 : 0.6} />
      <HeatWaves x={x} y={560} t={t} on={heat} w={260} />
      {!run && <Pill x={1100} y={380} text="TIENE QUE PARAR" color={C.red} size={34} s={pop(t, ts + 0.3)} />}
    </Stage>); };

// 11 · Le roban la presa
const s11 = (p) => { const { t } = p; const d = D(p);
  const arrive = eo(ramp(t, d * 0.3, d * 0.6)); const flee = ramp(t, d * 0.65, d);
  return (
    <Stage {...p} env={land('dusk', { t, seed: 20 })} cam={{ keys: [[0, 900, 620, 1.5, -1], [2.6, 1000, 600, 1.2, 2], [5.2, 1150, 600, 1.35, -2], [7.8, 1000, 620, 1.6, 1], [10.4, 800, 600, 1.3, -1], [d, 900, 600, 1.15, 0]] }}>
      <Ground t={t} kind="dusk" y={780} />
      <ellipse cx={1050} cy={760} rx={90} ry={26} fill="#8b3a3a" stroke="#4a1a1a" strokeWidth={4} />
      <Quad kind="cheetah" x={lerp(880, 300, flee)} y={690} s={1.05} t={t} speed={flee > 0 ? 1.2 : 0.2} run={flee > 0} tongue={flee > 0 ? 0 : 1} mouth={0.4} flip={flee > 0} />
      <Quad kind="lion" x={lerp(2100, 1300, arrive)} y={680} s={1.05} t={t} seed={4} speed={1} run={arrive < 1} flip mouth={arrive >= 1 ? 0.6 : 0} />
      <Quad kind="hyena" x={lerp(2300, 1550, arrive)} y={700} s={0.95} t={t} seed={6} speed={1} run={arrive < 1} flip />
      <Quad kind="hyena" x={lerp(2500, 1700, arrive)} y={720} s={0.9} t={t} seed={8} speed={1} run={arrive < 1} flip />
      <Pill x={1100} y={360} text="AGOTADO = SIN DEFENSA" color={C.red} size={32} s={pop(t, d * 0.35)} />
    </Stage>); };

// 12 · Cachorros en peligro
const s12 = (p) => { const { t } = p; const d = D(p);
  const momGone = ramp(t, d * 0.3, d * 0.5);
  const threat = ramp(t, d * 0.5, d * 0.8);
  const icons = 8;
  return (
    <Stage {...p} env={land('savanna', { t, seed: 22 })} light={(tt) => 1 - 0.2 * threat} cam={{ keys: [[0, 900, 640, 1.6, 2], [2.6, 800, 640, 1.3, -1], [5.2, 1000, 620, 1.15, 1], [7.8, 1300, 640, 1.4, -2], [10.4, 1000, 600, 1.25, 1], [d, 960, 560, 1.15, 0]] }}>
      <Ground t={t} kind="savanna" y={780} />
      <Quad kind="cheetah" x={lerp(700, -400, momGone)} y={690} s={1.05} t={t} seed={3} speed={momGone > 0 && momGone < 1 ? 1 : 0.3} run={momGone > 0 && momGone < 1} flip={momGone > 0} />
      {[0, 1, 2].map((k) => <Quad key={k} kind="cub" x={900 + k * 140 + 30 * Math.sin(t * 2 + k)} y={750 - 20 * Math.abs(Math.sin(t * 4 + k))} s={1} t={t} seed={30 + k} speed={0.8} run={false} flip={k === 1} />)}
      <Quad kind="hyena" x={lerp(2300, 1500, threat)} y={720} s={1} t={t} seed={7} speed={0.6} run={false} flip opacity={0.3 + 0.7 * threat} />
      <g transform="translate(960 300)">{[...Array(icons)].map((_, k) => { const lost = k >= 2 && threat > (k - 2) / 6; return <g key={k} transform={`translate(${(k - 3.5) * 90} 0) scale(${pop(t, d * 0.6 + k * 0.1)})`}><circle r={30} fill={lost ? '#555' : C.gold} opacity={lost ? 0.5 : 1} />{lost && <path d="M-20,-20 L20,20 M20,-20 L-20,20" stroke={C.red} strokeWidth={8} />}</g>; })}</g>
    </Stage>); };

// 13 · Más rápido ≠ más fuerte: balanza → rey de la sabana
const s13 = (p) => { const { t } = p; const d = D(p);
  const tilt = 14 * seg(t, 0.8, 2.4);
  return (
    <Stage {...p} env={land('savanna', { t, seed: 24 })} cam={{ keys: [[0, 960, 520, 1.2, -1], [2.6, 960, 480, 1.5, 2], [5.2, 1100, 560, 1.3, -2], [d, 1250, 560, 1.6, 1]] }}>
      <Ground t={t} kind="savanna" y={800} />
      <g transform={`translate(800 500)`}><path d="M0,0 L0,280" stroke="#5a3a1a" strokeWidth={14} /><g transform={`rotate(${-tilt})`}><path d="M-300,0 L300,0" stroke="#5a3a1a" strokeWidth={12} />
        <g transform="translate(-300 0)"><path d="M-80,90 L80,90 L0,0Z" fill="none" stroke="#5a3a1a" strokeWidth={4} /><Quad kind="cheetah" x={0} y={60} s={0.45} t={t} run={false} speed={0.4} /><Txt x={0} y={160} size={30}>VELOCIDAD</Txt></g>
        <g transform="translate(300 0)"><path d="M-80,90 L80,90 L0,0Z" fill="none" stroke="#5a3a1a" strokeWidth={4} /><Quad kind="lion" x={0} y={60} s={0.45} t={t} seed={5} run={false} speed={0.4} /><Txt x={0} y={160} size={30} color={C.gold}>FUERZA</Txt></g></g></g>
      <g transform={`translate(1100 ${lerp(-200, 420, eo(ramp(t, d * 0.55, d * 0.8)))}) rotate(${8 * Math.sin(t * 2)})`}><path d="M-60,0 L-60,-50 L-30,-20 L0,-60 L30,-20 L60,-50 L60,0Z" fill={C.gold} stroke="#8a6500" strokeWidth={4} /></g>
    </Stage>); };

// 14 · Rugido que se oye a 8 km
const s14 = (p) => { const { t } = p; const d = D(p); const tr = d * 0.25;
  return (
    <Stage {...p} env={land('dusk', { t, seed: 26 })} cam={{ keys: [[0, 700, 600, 1.5, 2], [tr + 0.8, 760, 560, 1.7, -2], [5, 1100, 520, 1.1, 1], [d, 1300, 540, 1.3, -1]], shake: (tt) => Math.max(0, 1 - Math.abs(tt - tr - 0.4) * 2) * 0.6 }}>
      <Ground t={t} kind="dusk" y={790} />
      <Quad kind="lion" x={600} y={690} s={1.3} t={t} seed={11} run={false} speed={0.5} mouth={ramp(t, tr, tr + 0.3) * (1 - ramp(t, tr + 2.2, tr + 2.6))} />
      {[...Array(6)].map((_, k) => <Ring key={k} x={780} y={600} t={t} t0={tr + k * 0.35} dur={2.5} maxR={1500} color="#ffd9a0" w={6} />)}
      <line x1={780} y1={760} x2={lerp(780, 1750, eo(ramp(t, tr + 1, tr + 3)))} y2={760} stroke={C.gold} strokeWidth={5} strokeDasharray="16 10" />
      <Counter x={1300} y={720} t={t} t0={tr + 1} t1={tr + 3} v1={8} size={70} color={C.gold} suffix=" km" />
      <Pill x={600} y={380} text="+200 KG" color={C.cyan} size={34} s={pop(t, d * 0.65)} />
    </Stage>); };

// 15 · Corazón pequeño (rayos X) + batería
const s15 = (p) => { const { t } = p; const d = D(p);
  const bat = 1 - 0.75 * ramp(t, d * 0.5, d * 0.9);
  return (
    <Stage {...p} env={land('savanna', { t, seed: 28 })} light={(tt) => 1 - 0.25 * ramp(tt, 1, 2)} cam={{ keys: [[0, 960, 600, 1.15, 1], [2.6, 1050, 580, 1.6, -2], [5.2, 1080, 600, 2.0, 1.5], [d, 1000, 600, 1.4, -1]] }}
      hud={() => <g transform="translate(1600 250)"><rect x={-70} y={-40} width={140} height={80} rx={10} fill="#0f2240" stroke="#fff" strokeWidth={5} /><rect x={70} y={-15} width={12} height={30} fill="#fff" /><rect x={-60} y={-30} width={120 * bat} height={60} rx={6} fill={bat > 0.4 ? C.green : C.red} /><text y={90} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={28} fill="#fff" stroke="#000" strokeWidth={4} paintOrder="stroke">RESISTENCIA</text></g>}>
      <Ground t={t} kind="savanna" y={800} />
      <Quad kind="lion" x={900} y={680} s={1.6} t={t} seed={13} run={false} speed={0.4} xray={ramp(t, 0.6, 1.4)} heartS={0.55} />
      <Pill x={1050} y={330} text="CORAZÓN PEQUEÑO" color={C.red} s={pop(t, d * 0.3)} size={34} />
    </Stage>); };

// 16 · Salto explosivo y se cansa
const s16 = (p) => { const { t } = p; const d = D(p);
  const u = ramp(t, 0.4, d * 0.5); const x = lerp(400, 1300, eo(u)); const jump = Math.sin(Math.min(1, u * 2.5) * Math.PI) * 120 * (u < 0.4 ? 1 : 0);
  const tired = ramp(t, d * 0.5, d * 0.65);
  return (
    <Stage {...p} env={land('savanna', { t, seed: 30 })} cam={{ focus: (tt) => [lerp(400, 1300, eo(ramp(tt, 0.4, d * 0.5))) + 60, 600], zamt: 0.8, shake: (tt) => Math.max(0, 1 - Math.abs(tt - 0.8) * 3) * 0.5 }}>
      <Ground t={t} kind="savanna" y={790} />
      <Quad kind="lion" x={x} y={680 - jump} s={1.25} t={t} seed={15} speed={lerp(2, 0.2, tired)} run={tired < 1} tongue={tired} mouth={tired * 0.6} />
      <Quad kind="gazelle" x={lerp(900, 2300, ramp(t, 0.6, d))} y={690} s={1.1} t={t} seed={9} speed={1.8} />
      <Dust x={x - 120} y={780} t={t} on={1 - tired} />
      <Pill x={1300} y={380} text="¡SE CANSA ENSEGUIDA!" color={C.red} size={32} s={pop(t, d * 0.6)} />
    </Stage>); };

// 17 · Cazar en grupo (vista cenital) + intentos fallidos
const s17 = (p) => { const { t } = p; const d = D(p);
  const enc = eo(ramp(t, 0.5, d * 0.5));
  const herd = [...Array(9)].map((_, k) => [1000 + (k % 3) * 60 + 20 * Math.sin(t * 2 + k), 520 + Math.floor(k / 3) * 50]);
  return (
    <Stage {...p} env={{ custom: () => <rect x={-200} y={-200} width={2400} height={1500} fill="#c9a35a" />, rays: false, fish: false }} cam={{ keys: [[0, 1050, 560, 1.0, 0], [2.6, 1060, 560, 1.4, -3], [5.2, 1050, 560, 1.7, 2], [7.8, 900, 600, 1.3, -1], [d, 960, 560, 1.15, 1]] }}>
      {[...Array(40)].map((_, k) => <circle key={k} cx={(k * 197) % 1920} cy={(k * 131) % 1080} r={18} fill="#b08a44" opacity={0.5} />)}
      {herd.map(([x, y], k) => <ellipse key={k} cx={x + (t > d * 0.5 ? (t - d * 0.5) * 120 * Math.cos(k) : 0)} cy={y + (t > d * 0.5 ? (t - d * 0.5) * 100 * Math.sin(k) : 0)} rx={24} ry={12} fill="#6b4a2a" />)}
      {[0, 1, 2, 3, 4].map((k) => { const a = k * 1.25 + 0.4; const r = lerp(600, 230, enc); return <g key={k} transform={`translate(${1060 + Math.cos(a) * r} ${570 + Math.sin(a) * r * 0.7}) rotate(${(a * 180) / Math.PI + 180})`}><ellipse rx={40} ry={16} fill="#d2a056" stroke="#2b1d10" strokeWidth={3} /><circle cx={40} cy={0} r={13} fill="#d2a056" stroke="#2b1d10" strokeWidth={3} /></g>; })}
      <g transform="translate(400 300)">{[...Array(5)].map((_, k) => { const ok = k === 2; return <g key={k} transform={`translate(0 ${k * 90}) scale(${pop(t, d * 0.55 + k * 0.25)})`}><circle r={32} fill={ok ? C.green : '#444'} />{ok ? <path d="M-14,0 L-4,12 L16,-12" stroke="#fff" strokeWidth={7} fill="none" /> : <path d="M-14,-14 L14,14 M14,-14 L-14,14" stroke={C.red} strokeWidth={7} />}</g>; })}</g>
      <Pill x={1060} y={240} text="LA MAYORÍA FRACASA" color={C.red} s={pop(t, d * 0.7)} size={32} />
    </Stage>); };

// 18 · Las leonas cazan; el macho come primero; 20 h de descanso
const s18 = (p) => { const { t } = p; const d = D(p);
  const maleIn = eo(ramp(t, d * 0.35, d * 0.55)); const night = ramp(t, d * 0.7, d * 0.85);
  return (
    <Stage {...p} env={land(night > 0.5 ? 'dusk' : 'savanna', { t, seed: 32 })} light={(tt) => 1 - 0.45 * night} cam={{ keys: [[0, 900, 620, 1.4, 1], [2.6, 1000, 620, 1.2, -2], [5.2, 1200, 600, 1.4, 2], [7.8, 1100, 620, 1.6, -1], [10.4, 1000, 600, 1.3, 1], [d, 960, 600, 1.2, 0]] }}>
      <Ground t={t} kind="savanna" y={790} />
      <Quad kind="lioness" x={lerp(300, 900, ramp(t, 0, d * 0.3))} y={700} s={1.05} t={t} seed={41} speed={1.4} run={t < d * 0.3} sleep={night} />
      <Quad kind="lioness" x={lerp(150, 760, ramp(t, 0, d * 0.3))} y={720} s={1} t={t} seed={42} speed={1.4} run={t < d * 0.3} sleep={night} />
      <ellipse cx={1050} cy={770} rx={80} ry={22} fill="#8b3a3a" />
      <Quad kind="lion" x={lerp(2200, 1250, maleIn)} y={690} s={1.15} t={t} seed={43} speed={0.8} run={maleIn > 0 && maleIn < 1} flip sleep={night} mouth={maleIn >= 1 && night < 0.5 ? 0.5 + 0.3 * Math.sin(t * 6) : 0} />
      <Pill x={800} y={360} text="ELLAS CAZAN" color={C.gold} size={32} s={pop(t, 1) * (1 - ramp(t, d * 0.4, d * 0.45))} />
      <Pill x={1250} y={360} text="ÉL COME PRIMERO" color={C.red} size={32} s={pop(t, d * 0.5) * (1 - ramp(t, d * 0.68, d * 0.72))} />
      <Counter x={960} y={340} t={t} t0={d * 0.72} t1={d * 0.95} v1={20} size={80} color="#fff" suffix=" H DURMIENDO" />
    </Stage>); };

// 19 · Ocupada comiendo: pantano, ojo que emerge
const s19 = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={land('swamp', { t, seed: 34 })} cam={{ keys: [[0, 960, 560, 1.1, 0], [2.6, 1100, 620, 1.6, -2], [5.2, 1150, 640, 2.1, 1], [d, 1050, 620, 1.5, -1]] }}>
      <RiverWater t={t} y={620} murky lilies />
      <g transform={`translate(1150 ${lerp(700, 612, eo(ramp(t, 1, 3)))})`}><ellipse rx={50} ry={22} fill="#4f6b2a" stroke="#26360f" strokeWidth={4} /><circle cx={18} cy={-8} r={9} fill="#e8d36a" /><ellipse cx={18} cy={-8} rx={2.5} ry={7} fill="#111" /></g>
      {[0, 1, 2].map((k) => <Ring key={k} x={1150} y={620} t={t} t0={1 + k * 0.8} dur={1.4} maxR={180} color="#e8f7ff" />)}
      <g transform={`translate(800 ${380}) scale(${pop(t, d * 0.55)})`}><circle r={60} fill="#0f2240" stroke={C.gold} strokeWidth={5} /><path d="M-20,-30 L-20,30 M-30,-30 L-30,-5 M-10,-30 L-10,-5 M20,-30 C40,-30 40,0 20,5 L20,30" stroke="#fff" strokeWidth={6} fill="none" /></g>
    </Stage>); };

// 20 · La anaconda caza: sale del agua y se enrolla
const s20 = (p) => { const { t } = p; const d = D(p);
  const coil = seg(t, d * 0.35, d * 0.6);
  return (
    <Stage {...p} env={land('swamp', { t, seed: 36 })} cam={{ keys: [[0, 900, 620, 1.3, 2], [2.6, 1000, 600, 1.6, -1], [5.2, 1100, 640, 1.9, 2], [7.8, 1080, 620, 1.5, -2], [d, 1000, 600, 1.3, 0]] }}>
      <Ground t={t} kind="swamp" y={700} x0={900} />
      <RiverWater t={t} y={680} murky x1={1000} />
      <Quad kind="capybara" x={1150} y={680} s={1.2} t={t} seed={51} run={false} speed={coil > 0 ? 2 : 0.3} opacity={1} />
      <Snake x={lerp(700, 1150 - 0, coil) + lerp(0, 60, coil)} y={lerp(720, 640, coil)} s={1} t={t} len={900} wave={lerp(1, 0.3, coil)} coil={coil} cx={0} cy={20} r={110} jaw={ramp(t, d * 0.28, d * 0.34) * (1 - coil)} />
      {coil > 0.9 && [0, 1, 2].map((k) => <path key={k} d={`M${1150 + 160 * Math.cos(k * 2.1)},${660 + 90 * Math.sin(k * 2.1)} l${-30 * Math.cos(k * 2.1)},${-20 * Math.sin(k * 2.1)}`} stroke={C.red} strokeWidth={8} opacity={0.5 + 0.5 * Math.sin(t * 6)} />)}
      <Pill x={1150} y={380} text="APRIETA CON CADA RESPIRACIÓN" size={28} s={pop(t, d * 0.65)} />
    </Stage>); };

// 21 · Traga entera: mandíbula elástica y bulto
const s21 = (p) => { const { t } = p; const d = D(p);
  const jaw = seg(t, 0.5, 2) * (1 - seg(t, d * 0.5, d * 0.6));
  const b = ramp(t, d * 0.5, d);
  return (
    <Stage {...p} env={land('swamp', { t, seed: 38 })} cam={{ keys: [[0, 1300, 560, 1.7, -2], [2.6, 1250, 560, 2.0, 1], [5.2, 1000, 560, 1.3, -1], [d, 800, 580, 1.2, 2]] }}>
      <Ground t={t} kind="swamp" y={720} />
      <Snake x={1350} y={620} s={1.1} t={t} len={1000} wave={0.2} jaw={jaw * 1.4} bulge={b > 0 ? b * 0.8 + 0.05 : -1} bulgeSize={b > 0 ? 40 : 0} />
      {b <= 0 && <Quad kind="capybara" x={1530} y={630} s={0.7} t={t} seed={52} run={false} speed={0.2} rot={-10} flip />}
      {[0, 1, 2].map((k) => <Pill key={k} x={600 + k * 330} y={330} text={['CAPIBARAS', 'CIERVOS', 'CAIMANES'][k]} size={28} color={C.cyan} s={pop(t, d * 0.25 + k * 0.5)} />)}
    </Stage>); };

// 22 · Días sin moverse: ciclo día/noche y calendario
const s22 = (p) => { const { t } = p; const d = D(p);
  const days = Math.floor(lerp(1, 30, ramp(t, 1, d * 0.9)));
  const dn = (Math.sin(t * 2.2) + 1) / 2;
  return (
    <Stage {...p} env={land('swamp', { t, seed: 40 })} light={() => 0.55 + 0.45 * dn} cam={{ keys: [[0, 960, 600, 1.2, 1], [2.6, 900, 640, 1.5, -2], [5.2, 1100, 620, 1.3, 2], [7.8, 1000, 640, 1.7, -1], [d, 960, 600, 1.25, 0]] }}
      hud={() => <g><circle cx={960 + 700 * Math.cos(t * 2.2)} cy={500 - 380 * Math.sin(t * 2.2)} r={60} fill="#fff2c4" opacity={0.9} /><circle cx={960 - 700 * Math.cos(t * 2.2)} cy={500 + 380 * Math.sin(t * 2.2)} r={45} fill="#e8eef7" opacity={0.9} />
        <g transform="translate(1620 230)"><rect x={-80} y={-70} width={160} height={150} rx={14} fill="#fff" stroke="#333" strokeWidth={4} /><rect x={-80} y={-70} width={160} height={40} rx={14} fill={C.red} /><text y={50} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill="#222">{days}</text><text y={-38} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={24} fill="#fff">DÍA</text></g></g>}>
      <Ground t={t} kind="swamp" y={720} />
      <Snake x={1300} y={680} s={1.05} t={t} len={1000} wave={0.05} bulge={0.45} bulgeSize={46} />
      <Pill x={960} y={360} text="LENTA Y PESADA" color={C.cyan} size={32} s={pop(t, d * 0.3)} />
    </Stage>); };

export const SA = [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22];
