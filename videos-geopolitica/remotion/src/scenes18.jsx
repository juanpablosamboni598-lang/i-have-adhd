// v18 · ¿Por qué los gatos caen de pie? (38 escenas)
import React from 'react';
import { C, W, H, FONT, cl, lerp, ramp, ease, eo, ei, seg, pop, mod, rng, layerT, Pill, Ring, Counter } from './lib.jsx';
import { Stage } from './stage.jsx';
import { Person, Quad } from './actors2.jsx';
import { Txt, land } from './scenes14a.jsx';
import { Ground } from './lands.jsx';
import { Bird } from './actors3.jsx';
import { Cat, RoomBack, CityBack, Building, Street, Ear, Spine, Skater, OldCamera, Plane, Net } from './actors4.jsx';

const D = (p) => p.frames / 30;
const PI = Math.PI;
const room = (x = {}) => ({ custom: (cam) => <RoomBack cam={cam} t={x.t || 0} seed={x.seed || 1} night={x.night || 0} />, rays: false, fish: false, ...x });
const city = (x = {}) => ({ custom: (cam) => <CityBack cam={cam} t={x.t || 0} seed={x.seed || 1} dusk={x.dusk || 0} />, rays: false, fish: false, ...x });
const SkyBack = ({ cam, t }) => <g><defs><linearGradient id="sky18" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a7fd0" /><stop offset="1" stopColor="#bfe4ff" /></linearGradient></defs><rect x={-200} y={-200} width={W + 400} height={H + 400} fill="url(#sky18)" /><g transform={layerT(cam, 0.3)}>{[...Array(9)].map((_, k) => <ellipse key={k} cx={mod(k * 330 - t * 60, 2800) - 400} cy={150 + (k * 137) % 800} rx={160} ry={40} fill="#fff" opacity={0.75} />)}</g></g>;
const sky = (x = {}) => ({ custom: (cam) => <SkyBack cam={cam} t={x.t || 0} />, rays: false, fish: false, ...x });
const paper = { custom: (cam) => <g><rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#efe3c8" /><g transform={layerT(cam, 0.3)}>{[...Array(30)].map((_, k) => <circle key={k} cx={(k * 211) % 2200 - 140} cy={(k * 157) % 1200} r={40 + (k % 5) * 20} fill="#d9c79c" opacity={0.25} />)}</g></g>, rays: false, fish: false };
const lab = { custom: (cam) => <g><rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#0f2240" /><g transform={layerT(cam, 0.3)}>{[...Array(24)].map((_, k) => <path key={k} d={`M${-300 + k * 110},-200 L${-300 + k * 110},1400`} stroke="#1f3a60" strokeWidth={2} />)}{[...Array(14)].map((_, k) => <path key={k} d={`M-300,${-100 + k * 110} L2300,${-100 + k * 110}`} stroke="#1f3a60" strokeWidth={2} />)}</g></g>, rays: false, fish: false };

// Secuencia del giro (u 0..1) partiendo boca arriba: cabeza -> mitad delantera -> mitad trasera -> patas listas
export const twist = (u) => {
  const a = ease(ramp(u, 0, 0.22)), b = ease(ramp(u, 0.2, 0.52)), c = ease(ramp(u, 0.5, 0.82)), d = ramp(u, 0.82, 1);
  return { headRoll: PI * (1 - Math.max(a, b)), rollF: PI * (1 - b) - 0.15 * c * (1 - d), rollB: PI * (1 + 0.12 * b) * (1 - c), tuckF: b > 0 && b < 1 ? 1 : (c > 0 && c < 1 ? 0 : 0.3 * (1 - d)), tuckB: c > 0 && c < 1 ? 1 : 0.2 * (1 - d) };
};
const Floor = ({ y = 880 }) => <rect x={-1500} y={y} width={5000} height={600} fill="#b98a5a" />;
const Arrow = ({ x, y, rot = 0, s = 1, color = C.gold }) => <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}><path d="M-60,-12 L20,-12 L20,-34 L64,0 L20,34 L20,12 L-60,12Z" fill={color} stroke="#000" strokeWidth={4} /></g>;
const Clock = ({ x, y, t, label }) => <g transform={`translate(${x} ${y})`}><circle r={60} fill="#0f2240" stroke="#fff" strokeWidth={5} /><line x1={0} y1={0} x2={44 * Math.sin(t * 3)} y2={-44 * Math.cos(t * 3)} stroke={C.gold} strokeWidth={7} strokeLinecap="round" />{label && <Txt x={0} y={100} size={26}>{label}</Txt>}</g>;

const S = {};
S.apertura = (p) => { const { t } = p; const d = D(p); const t0 = d * 0.25, t1 = t0 + 1.6;
  const u = ramp(t, t0, t1); const tw = twist(u); const fy = lerp(300, 720, ei(ramp(t, t0, t1)));
  return (
    <Stage {...p} env={room({ t })} cam={{ keys: [[0, 900, 420, 1.6, -2], [2.4, 960, 520, 1.3, 2], [t1, 980, 640, 1.5, -1], [t1 + 2.4, 960, 600, 1.2, 1], [d, 1000, 580, 1.35, 0]], shake: (tt) => Math.max(0, 1 - Math.abs(tt - t1) * 5) * 0.5 }}>
      <Person x={700} y={760} s={1.6} t={t} arms={t < t0 ? 0.9 : 0.2} shirt="#8e44ad" />
      <Cat x={960} y={t < t0 ? 300 + 6 * Math.sin(t * 3) : fy} s={0.8} t={t} {...(t < t0 ? { rollF: PI, rollB: PI, headRoll: PI } : tw)} />
      {t > t1 && [0, 1].map((k) => <Ring key={k} x={960} y={800} t={t} t0={t1 + k * 0.2} dur={0.8} maxR={220} color="#fff" />)}
      <Txt x={1400} y={260} size={64} color={C.gold} s={pop(t, t1 + 0.3)} rot={-4}>¿CÓMO?</Txt>
    </Stage>); };

S.titulo = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={room({ t, seed: 2 })} cam={{ keys: [[0, 960, 600, 1.3, -2], [2.6, 960, 520, 1.05, 1], [5.2, 980, 560, 1.2, -1], [7.8, 1150, 640, 1.4, 2], [d, 960, 580, 1.15, 0]] }}>
      <Cat x={lerp(250, 1650, t / d)} y={800} s={0.75} t={t} walk={1} />
      <Txt x={960} y={380} size={86} color="#ffd36a" s={pop(t, 0.3)} rot={-2 + 2 * Math.sin(t)}>¿POR QUÉ LOS GATOS</Txt>
      <Txt x={960} y={490} size={104} color="#fff" s={pop(t, 0.6)} rot={2 - 2 * Math.sin(t)}>CAEN DE PIE?</Txt>
      {['EL GIRO', 'EL CUERPO', 'LAS CAÍDAS'].map((n, k) => <Pill key={k} x={560 + k * 400} y={620} text={n} size={30} color={[C.cyan, C.gold, C.red][k]} s={pop(t, d * 0.35 + k * d * 0.15)} />)}
    </Stage>); };

S.reflejo = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={room({ t, seed: 3 })} cam={{ keys: [[0, 960, 560, 1.2, -1], [2.5, 820, 560, 1.5, 2], [5, 1100, 540, 1.4, -2], [d, 960, 560, 1.25, 1]] }}>
      <Cat x={900} y={780} s={1.1} t={t} look={Math.sin(t)} />
      <g transform={`translate(1350 520) rotate(${8 * Math.sin(t * 2)})`} opacity={pop(t, d * 0.4)}><rect x={-170} y={-110} width={340} height={220} rx={20} fill="#c9a06a" stroke="#6a4a2a" strokeWidth={6} /><path d="M-170,-40 L170,-40" stroke="#6a4a2a" strokeWidth={6} /><Txt x={0} y={40} size={34} color="#3a2412">DE FÁBRICA</Txt></g>
      <Pill x={960} y={260} text="REFLEJO DE ENDEREZAMIENTO" color={C.cyan} size={36} s={pop(t, d * 0.15)} />
    </Stage>); };

S.velocidad = (p) => { const { t } = p; const d = D(p); const t0 = d * 0.3; const u = ramp(t, t0, t0 + 1.2);
  return (
    <Stage {...p} env={room({ t, seed: 4 })} cam={{ keys: [[0, 960, 520, 1.3, 1], [2.6, 900, 480, 1.6, -2], [5.2, 1000, 560, 1.3, 2], [7.8, 960, 520, 1.5, -1], [d, 960, 540, 1.2, 0]] }}>
      <Cat x={800} y={lerp(260, 640, ei(u))} s={0.75} t={t} {...twist(u)} />
      <g transform="translate(1350 480)"><circle r={130} fill="#fff" stroke="#333" strokeWidth={8} /><path d={`M0,0 L0,-110 A110,110 0 ${u > 0.5 ? 1 : 0} 1 ${110 * Math.sin(u * 2 * PI * 0.999)},${-110 * Math.cos(u * 2 * PI * 0.999)}Z`} fill={C.red} opacity={0.8} /><Txt x={0} y={200} size={44}>0,3 s</Txt></g>
      <g transform="translate(1350 820)" opacity={pop(t, d * 0.65)}><ellipse rx={70} ry={36 * Math.abs(Math.cos(t * 4))} fill="#fff" stroke="#333" strokeWidth={5} /><circle r={18 * Math.abs(Math.cos(t * 4))} fill="#4a3a2a" /></g>
      <Pill x={700} y={240} text="UN PARPADEO" color={C.gold} size={32} s={pop(t, d * 0.6)} />
    </Stage>); };

S.gatitos = (p) => { const { t } = p; const d = D(p); const k1 = d * 0.2, k2 = d * 0.6;
  const u1 = ramp(t, k1, k1 + 1.4), u2 = ramp(t, k2, k2 + 1.0);
  const clumsy = twist(u1);
  return (
    <Stage {...p} env={room({ t, seed: 5 })} cam={{ keys: [[0, 960, 640, 1.2, -1], [2.6, 700, 640, 1.5, 2], [5.2, 1250, 640, 1.5, -2], [7.8, 960, 640, 1.3, 1], [d, 960, 620, 1.2, 0]] }}>
      <rect x={480} y={820} width={360} height={60} rx={20} fill="#d47a8a" /><rect x={1080} y={820} width={360} height={60} rx={20} fill="#7ab0d4" />
      <Cat x={660} y={lerp(420, 740, ei(u1))} s={0.42} t={t} kit={1} {...clumsy} rot={u1 > 0.9 ? 25 * Math.sin(t * 6) : 0} />
      <Cat x={1260} y={lerp(420, 740, ei(u2))} s={0.55} t={t} {...twist(u2)} seed={4} />
      <Txt x={660} y={400} size={44} s={pop(t, 0.3)}>3-4 SEMANAS</Txt><Txt x={1260} y={400} size={44} s={pop(t, k2 - 0.3)}>7 SEMANAS</Txt>
      <Pill x={660} y={960} text="TORPE" color={C.red} size={28} s={pop(t, k1 + 1.4)} /><Pill x={1260} y={960} text="CASI PERFECTO" color={C.green} size={28} s={pop(t, k2 + 1)} />
    </Stage>); };

S.arboles = (p) => { const { t } = p; const d = D(p); const ts = d * 0.35; const u = ramp(t, ts, ts + 1.3);
  return (
    <Stage {...p} env={land('savanna', { t, seed: 6 })} cam={{ keys: [[0, 960, 500, 1.2, -1], [2.6, 1100, 420, 1.5, 2], [ts + 1.3, 1100, 640, 1.5, -2], [ts + 3.5, 960, 560, 1.2, 1], [d, 960, 560, 1.3, 0]] }}>
      <Ground t={t} kind="savanna" y={860} />
      <g transform="translate(1100 860)"><path d="M0,0 L-20,-560" stroke="#6a4a2a" strokeWidth={60} /><path d="M-14,-380 L240,-460" stroke="#6a4a2a" strokeWidth={26} /><ellipse cx={-20} cy={-620} rx={300} ry={120} fill="#5f8a3a" /><ellipse cx={180} cy={-500} rx={160} ry={60} fill="#6f9a46" /></g>
      <Quad kind="cub" x={t < ts ? 1260 : 1260} y={t < ts ? 410 : lerp(410, 840, ei(u))} s={0.8} t={t} run={false} rot={t < ts ? 0 : lerp(180, 0, ease(ramp(u, 0.2, 0.8)))} />
      {[0, 1, 2].map((k) => <Quad key={k} kind="cub" x={500 + k * 120} y={850} s={0.5 * pop(t, d * 0.65 + k * 0.3)} t={t} seed={k + 3} />)}
      <Pill x={960} y={200} text="SOBREVIVÍAN LOS QUE CAÍAN MEJOR" color={C.gold} size={28} s={pop(t, d * 0.55)} />
    </Stage>); };

S.oido = (p) => { const { t } = p; const d = D(p); const z = ramp(t, d * 0.15, d * 0.45);
  return (
    <Stage {...p} env={lab} cam={{ keys: [[0, 960, 540, 1.1, -1], [2.6, 860, 500, 1.4, 2], [5.2, 1000, 540, 1.6, -2], [d, 960, 540, 1.3, 1]] }}>
      <g opacity={1 - z}><Cat x={960} y={660} s={1.4} t={t} /></g>
      <g opacity={z} transform={`translate(0 ${30 * Math.sin(t)})`}><Ear x={900} y={520} s={1.3} t={t} tilt={0.3 * Math.sin(t * 1.3)} hair={0.4} /></g>
      <Ring x={1100} y={560} t={t} t0={d * 0.1} dur={1} maxR={200} />
      <Pill x={960} y={180} text="SISTEMA VESTIBULAR" color={C.cyan} size={36} s={pop(t, d * 0.45)} />
      <Pill x={1450} y={880} text="TUBOS CON LÍQUIDO" color={C.gold} size={28} s={pop(t, d * 0.7)} />
    </Stage>); };

S.nivel = (p) => { const { t } = p; const d = D(p); const tilt = Math.sin(t * 1.1) * cl(ramp(t, 0.5, 1.5));
  const sig = ramp(t, d * 0.55, d * 0.75);
  return (
    <Stage {...p} env={lab} cam={{ keys: [[0, 960, 540, 1.2, 1], [2.6, 700, 520, 1.5, -2], [5.2, 1250, 520, 1.4, 2], [7.8, 960, 540, 1.2, -1], [d, 960, 540, 1.3, 0]] }}>
      <g transform={`translate(560 380) rotate(${tilt * 18})`}><rect x={-240} y={-50} width={480} height={100} rx={20} fill="#f4c542" stroke="#8a6a1a" strokeWidth={6} /><rect x={-80} y={-30} width={160} height={60} rx={30} fill="#bdf0a0" /><ellipse cx={tilt * 50} cy={0} rx={30} ry={20} fill="#fff" /></g>
      <Ear x={600} y={780} s={0.9} t={t} tilt={tilt} hair={1} />
      <path d="M900,780 C1100,780 1150,520 1360,520" stroke={C.gold} strokeWidth={12} fill="none" strokeDasharray="30 20" strokeDashoffset={-t * 160} opacity={sig} />
      <g transform="translate(1450 500)" opacity={pop(t, d * 0.6) > 0.1 ? 1 : 0}><ellipse rx={150} ry={110} fill="#f2a8b8" stroke="#a05a6a" strokeWidth={6} />{[...Array(6)].map((_, k) => <path key={k} d={`M${-110 + k * 40},-60 q20,60 0,120`} stroke="#a05a6a" strokeWidth={5} fill="none" />)}<circle r={40 + 20 * Math.sin(t * 10)} fill={C.gold} opacity={0.4 * sig} /></g>
      <Pill x={1450} y={760} text="ARRIBA / ABAJO" color={C.cyan} size={30} s={pop(t, d * 0.75)} />
    </Stage>); };

S.ojos = (p) => { const { t } = p; const d = D(p); const ts = d * 0.55; const u = ramp(t, ts, ts + 1.3);
  return (
    <Stage {...p} env={room({ t, seed: 7 })} cam={{ keys: [[0, 960, 520, 1.4, -1], [2.6, 1100, 480, 1.7, 2], [ts, 960, 520, 1.2, -2], [ts + 2.4, 960, 620, 1.4, 1], [d, 960, 600, 1.2, 0]] }}>
      <Floor />
      <Cat x={960} y={t < ts ? 360 + 8 * Math.sin(t * 2) : lerp(360, 760, ei(u))} s={0.85} t={t} {...(t < ts ? { rollF: PI, rollB: PI, headRoll: PI } : twist(u))} />
      {t > ts * 0.6 && <g transform={`translate(1100 ${t < ts ? 330 : lerp(330, 730, ei(u))})`}><rect x={-20} y={-60} width={70} height={30} rx={10} fill="#222" opacity={0.9} /></g>}
      <Txt x={520} y={300} size={40} s={pop(t, d * 0.2)}>VISTA = MÁS RÁPIDO</Txt>
      <Pill x={1400} y={300} text="OJOS TAPADOS: IGUAL LO LOGRA" color={C.green} size={26} s={pop(t, ts + 1)} />
    </Stage>); };

S.puente_cuerpo = (p) => { const { t } = p; const d = D(p);
  const sq = 1 + 0.25 * Math.sin(t * 3);
  return (
    <Stage {...p} env={room({ t, seed: 8 })} cam={{ keys: [[0, 960, 560, 1.2, 2], [d * 0.5, 960, 560, 1.5, -2], [d, 980, 560, 1.8, 1]] }}>
      <g transform={`translate(960 640) scale(${sq} ${1 / sq})`}><Cat x={0} y={0} s={1.1} t={t} arch={0.5 + 0.5 * Math.sin(t * 3)} /></g>
      <Txt x={960} y={360} size={72} s={pop(t, d * 0.25)}>UN CUERPO DE GOMA</Txt>
    </Stage>); };

S.columna = (p) => { const { t } = p; const d = D(p); const tw = 0.5 + 0.5 * Math.sin(t * 1.4);
  return (
    <Stage {...p} env={lab} cam={{ keys: [[0, 960, 540, 1.1, -1], [2.6, 760, 520, 1.5, 2], [5.2, 1200, 540, 1.5, -2], [7.8, 960, 540, 1.2, 1], [d, 960, 540, 1.3, 0]] }}>
      <Spine x={960} y={420} s={1} t={t} twist={tw} />
      <Cat x={960} y={800} s={0.9} t={t} rollF={tw * PI * 0.8} rollB={0} headRoll={tw * PI * 0.8} />
      <Pill x={560} y={200} text="DISCOS ELÁSTICOS" color="#e86a7a" size={30} s={pop(t, d * 0.3)} />
      <Pill x={1380} y={200} text="TUERCE MEDIO CUERPO" color={C.cyan} size={30} s={pop(t, d * 0.6)} />
    </Stage>); };

S.clavicula = (p) => { const { t } = p; const d = D(p); const ts = d * 0.55; const u = ramp(t, ts, ts + 2.5);
  return (
    <Stage {...p} env={room({ t, seed: 9 })} cam={{ keys: [[0, 960, 540, 1.2, 1], [2.6, 860, 460, 1.7, -2], [ts, 1000, 620, 1.3, 2], [ts + 2.6, 1150, 660, 1.6, -1], [d, 1000, 620, 1.3, 0]] }}>
      <g opacity={1 - ramp(t, ts - 0.5, ts)}><g transform="translate(960 480)"><rect x={-200} y={-150} width={400} height={300} rx={150} fill="#f0a24a" opacity={0.25} /><path d={`M-40,-40 q40,${-10 + 8 * Math.sin(t * 3)} 80,0`} stroke="#f4efe3" strokeWidth={18} strokeLinecap="round" fill="none" /><circle cx={-110} cy={30} r={40} fill="#f4efe3" /><circle cx={110} cy={30} r={40} fill="#f4efe3" /></g>
        <Pill x={960} y={240} text="CLAVÍCULA DIMINUTA Y SUELTA" color={C.gold} size={30} s={pop(t, d * 0.15)} /></g>
      {t > ts - 0.5 && <g><rect x={1260} y={360} width={60} height={520} fill="#8a5a2a" /><rect x={1440} y={360} width={60} height={520} fill="#8a5a2a" />
        <Cat x={lerp(800, 1700, u)} y={780} s={0.7} t={t} walk={1} /><Pill x={1380} y={300} text="CABE LA CABEZA, CABE TODO" color={C.cyan} size={26} s={pop(t, ts + 1.2)} /></g>}
    </Stage>); };

S.problema = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={{ theme: 'dark', rays: false, fish: false }} light={(tt) => 0.75 + 0.15 * Math.sin(tt * 2)} cam={{ keys: [[0, 960, 540, 1.3, -1], [2.6, 900, 520, 1.6, 2], [5.2, 1040, 560, 1.3, -2], [d, 960, 540, 1.45, 1]] }}>
      <Cat x={960} y={520 + 20 * Math.sin(t * 1.2)} s={0.9} t={t} rollF={PI} rollB={PI} headRoll={PI} rot={6 * Math.sin(t)} />
      {[...Array(5)].map((_, k) => <Txt key={k} x={960 + 380 * Math.cos(k * 1.26 + t * 0.5)} y={540 + 260 * Math.sin(k * 1.26 + t * 0.5)} size={90} color={C.gold} s={pop(t, 0.4 + k * 0.4)}>?</Txt>)}
      <Pill x={960} y={180} text="¿DE DÓNDE SACA EL IMPULSO?" color={C.red} size={34} s={pop(t, d * 0.45)} />
    </Stage>); };

S.fisica = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={sky({ t })} cam={{ keys: [[0, 960, 540, 1.15, 1], [2.6, 760, 540, 1.4, -2], [5.2, 1200, 540, 1.4, 2], [7.8, 960, 540, 1.2, -1], [d, 960, 540, 1.3, 0]] }}>
      <g transform={`translate(560 ${420 + 40 * Math.sin(t)})`}><rect x={-80} y={-80} width={160} height={160} rx={12} fill="#c9a06a" stroke="#6a4a2a" strokeWidth={6} /><Txt x={0} y={150} size={30}>NO GIRA SOLA</Txt></g>
      <Person x={1350} y={560 + 30 * Math.sin(t * 1.5)} s={1.4} t={t} arms={0.5 + 0.5 * Math.sin(t * 4)} shirt="#e67e22" />
      <g transform="translate(1350 260)" opacity={pop(t, d * 0.5)}><circle r={70} fill="none" stroke={C.red} strokeWidth={12} /><line x1={-50} y1={-50} x2={50} y2={50} stroke={C.red} strokeWidth={12} /></g>
      <Pill x={960} y={900} text="EN TEORÍA: IMPOSIBLE" color={C.red} size={34} s={pop(t, d * 0.65)} />
    </Stage>); };

S.marey = (p) => { const { t } = p; const d = D(p);
  const shots = Math.floor(cl(ramp(t, d * 0.3, d * 0.85)) * 12);
  return (
    <Stage {...p} env={paper} cam={{ keys: [[0, 700, 600, 1.3, -1], [2.6, 800, 560, 1.1, 2], [5.2, 1100, 420, 1.3, -2], [7.8, 1300, 420, 1.5, 1], [d, 1100, 480, 1.2, 0]] }}>
      <OldCamera x={340} y={640} s={1.1} t={t} flash={mod(t * 3, 1)} />
      <Txt x={340} y={360} size={70} color="#5a3a1a" s={pop(t, 0.3)}>1894</Txt>
      {[...Array(shots)].map((_, k) => { const col = k % 6, row = Math.floor(k / 6); const u = k / 11; return <g key={k} transform={`translate(${720 + col * 190} ${300 + row * 260})`}><rect x={-85} y={-110} width={170} height={220} fill="#2a2420" stroke="#5a3a1a" strokeWidth={4} /><g transform="translate(0 0)"><Cat x={0} y={-20 + u * 50} s={0.32} t={t} {...twist(u)} color="#b8a890" stripe="#6a5a4a" belly="#e8e0d0" /></g></g>; })}
      <Pill x={1200} y={880} text="12 FOTOS POR SEGUNDO" color={C.gold} size={30} s={pop(t, d * 0.6)} />
    </Stage>); };

S.academia = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={paper} cam={{ keys: [[0, 960, 560, 1.2, 1], [2.6, 800, 600, 1.5, -2], [5.2, 1150, 600, 1.4, 2], [d, 960, 560, 1.3, -1]], shake: (tt) => (tt > d * 0.4 && tt < d * 0.6 ? 0.4 : 0) }}>
      <g transform="translate(960 300)"><path d="M-400,0 L0,-140 L400,0Z" fill="#d9c79c" stroke="#5a3a1a" strokeWidth={6} />{[...Array(6)].map((_, k) => <rect key={k} x={-360 + k * 140} y={10} width={40} height={300} fill="#e8dcc0" stroke="#5a3a1a" strokeWidth={4} />)}</g>
      {[...Array(5)].map((_, k) => <Person key={k} x={420 + k * 270} y={880} s={1.1} t={t} seed={k} arms={t > d * 0.4 ? 0.6 + 0.4 * Math.sin(t * 6 + k) : 0} shirt={['#2c3e50', '#34495e', '#4a3a2a', '#2c3e50', '#5a2a2a'][k]} />)}
      <g transform="translate(960 560)"><rect x={-130} y={-90} width={260} height={180} fill="#2a2420" stroke="#5a3a1a" strokeWidth={6} /><Cat x={0} y={0} s={0.4} t={t} {...twist(mod(t * 0.4, 1))} color="#b8a890" stripe="#6a5a4a" belly="#e8e0d0" /></g>
      <Txt x={960} y={160} size={56} color={C.red} s={pop(t, d * 0.45)} rot={-3}>¡ESCÁNDALO!</Txt>
    </Stage>); };

S.puente_truco = (p) => { const { t } = p; const d = D(p); const sp = ramp(t, d * 0.4, d * 0.6);
  return (
    <Stage {...p} env={sky({ t })} cam={{ keys: [[0, 960, 560, 1.2, -2], [d * 0.5, 960, 560, 1.5, 2], [d, 980, 560, 1.8, -1]] }}>
      <Cat x={960} y={560 + 20 * Math.sin(t * 2)} s={1.1} t={t} rollF={PI * 0.3 * sp} rollB={-PI * 0.1 * sp} />
      <line x1={950} y1={300} x2={950} y2={820} stroke={C.gold} strokeWidth={8} strokeDasharray="20 14" opacity={sp} />
      <Pill x={720} y={260} text="MITAD 1" color={C.cyan} size={32} s={pop(t, d * 0.55)} /><Pill x={1200} y={260} text="MITAD 2" color={C.red} size={32} s={pop(t, d * 0.65)} />
    </Stage>); };

S.paso1 = (p) => { const { t } = p; const d = D(p); const u = ramp(t, d * 0.2, d * 0.6);
  return (
    <Stage {...p} env={sky({ t })} cam={{ keys: [[0, 960, 540, 1.2, -1], [2.6, 1100, 500, 1.6, 2], [5.2, 1150, 500, 1.9, -2], [d, 1000, 540, 1.3, 1]] }}>
      <Cat x={900} y={560 + 10 * Math.sin(t * 2)} s={1.2} t={t} rollF={PI} rollB={PI} headRoll={PI * (1 - ease(u))} />
      <path d={`M1180,380 A120,120 0 0 1 1180,${380 + 240 * ease(u)}`} stroke={C.gold} strokeWidth={10} fill="none" />
      <Arrow x={1180} y={380 + 240 * ease(u)} rot={180} s={0.7} />
      <Pill x={960} y={200} text="1 · LA CABEZA" color={C.gold} size={40} s={pop(t, 0.3)} />
      <Txt x={960} y={940} size={34} s={pop(t, d * 0.65)}>EL CUERPO LA SIGUE</Txt>
    </Stage>); };

S.paso2 = (p) => { const { t } = p; const d = D(p); const u = ease(ramp(t, d * 0.2, d * 0.75));
  return (
    <Stage {...p} env={sky({ t })} cam={{ keys: [[0, 960, 540, 1.2, 1], [2.6, 1100, 540, 1.6, -2], [5.2, 800, 540, 1.6, 2], [7.8, 960, 540, 1.3, -1], [d, 960, 540, 1.2, 0]] }}>
      <Cat x={960} y={560 + 10 * Math.sin(t * 2)} s={1.25} t={t} headRoll={0} rollF={PI * (1 - u)} rollB={PI * (1 + 0.15 * u)} tuckF={1} tuckB={0} />
      <path d={`M1180,360 A120,120 0 0 1 1180,${360 + 240 * u}`} stroke={C.cyan} strokeWidth={14} fill="none" />
      <path d={`M700,420 a60,60 0 0 0 0,${60 * u}`} stroke={C.red} strokeWidth={8} fill="none" />
      <Pill x={1260} y={220} text="ENCOGIDA: GIRA RÁPIDO" color={C.cyan} size={28} s={pop(t, d * 0.25)} />
      <Pill x={640} y={220} text="ESTIRADA: CASI NO SE MUEVE" color={C.red} size={28} s={pop(t, d * 0.5)} />
      <Pill x={960} y={940} text="2 · MITAD DELANTERA" color={C.gold} size={36} s={pop(t, 0.3)} />
    </Stage>); };

S.patinadora = (p) => { const { t } = p; const d = D(p); const arms = 0.5 + 0.5 * Math.sin(t * 0.9 - 1.2);
  const ang = t * lerp(4, 16, arms);
  return (
    <Stage {...p} env={{ custom: (cam) => <g><rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#cfe9f7" /><g transform={layerT(cam, 0.3)}>{[...Array(12)].map((_, k) => <rect key={k} x={-300 + k * 220} y={300} width={120} height={500} fill="#a8cfe6" />)}</g><ellipse cx={960} cy={900} rx={1400} ry={260} fill="#eef8fd" /></g>, rays: false, fish: false }} cam={{ keys: [[0, 960, 560, 1.2, -1], [2.6, 800, 540, 1.5, 2], [5.2, 1150, 560, 1.4, -2], [d, 960, 560, 1.3, 1]] }}>
      <Skater x={960} y={640} s={1.6} t={t} arms={arms} spin={ang} />
      {[0, 1, 2].map((k) => <path key={k} d={`M${960 - 300 - k * 30},${700 + k * 20} a${300 + k * 30},80 0 0 0 ${600 + k * 60},0`} stroke="#9ab" strokeWidth={4} fill="none" strokeDasharray={`${20 + arms * 60} 30`} strokeDashoffset={-t * 200 * (0.3 + arms)} />)}
      <Pill x={520} y={240} text={arms > 0.5 ? 'BRAZOS PEGADOS: RÁPIDO' : 'BRAZOS ABIERTOS: LENTO'} color={arms > 0.5 ? C.cyan : C.red} size={28} s={pop(t, 0.4)} />
    </Stage>); };

S.paso3 = (p) => { const { t } = p; const d = D(p); const u = ease(ramp(t, d * 0.2, d * 0.75));
  return (
    <Stage {...p} env={sky({ t })} cam={{ keys: [[0, 960, 540, 1.2, -1], [2.6, 800, 540, 1.6, 2], [5.2, 1100, 540, 1.5, -2], [7.8, 960, 540, 1.3, 1], [d, 960, 540, 1.2, 0]] }}>
      <Cat x={960} y={560 + 10 * Math.sin(t * 2)} s={1.25} t={t} headRoll={0} rollF={-0.15 * u} rollB={PI * 1.15 * (1 - u)} tuckF={0} tuckB={1} />
      <path d={`M720,360 A120,120 0 0 0 720,${360 + 240 * u}`} stroke={C.red} strokeWidth={14} fill="none" />
      <Pill x={960} y={220} text="AHORA AL REVÉS" color={C.cyan} size={30} s={pop(t, d * 0.25)} />
      <Pill x={960} y={940} text="3 · MITAD TRASERA" color={C.gold} size={36} s={pop(t, 0.3)} />
    </Stage>); };

S.cero = (p) => { const { t } = p; const d = D(p); const u = ramp(t, 0.3, d * 0.6);
  return (
    <Stage {...p} env={sky({ t })} cam={{ keys: [[0, 960, 480, 1.3, 1], [2.6, 960, 560, 1.1, -2], [5.2, 1000, 620, 1.4, 2], [7.8, 960, 600, 1.2, -1], [d, 960, 580, 1.3, 0]] }}>
      <Cat x={960} y={lerp(340, 600, u)} s={0.95} t={t} {...twist(u)} />
      <g transform="translate(1450 400)"><Txt x={0} y={0} size={60} color={C.cyan} s={pop(t, d * 0.3)}>+ GIRO</Txt><Txt x={0} y={80} size={60} color={C.red} s={pop(t, d * 0.4)}>− GIRO</Txt><line x1={-120} y1={110} x2={120} y2={110} stroke="#fff" strokeWidth={6} opacity={pop(t, d * 0.5)} /><Txt x={0} y={190} size={90} color={C.gold} s={pop(t, d * 0.55)}>= 0</Txt></g>
      <Pill x={500} y={900} text="SOLO CAMBIA SU FORMA" color={C.green} size={30} s={pop(t, d * 0.75)} />
    </Stage>); };

S.otros = (p) => { const { t } = p; const d = D(p);
  const fall = (k) => { const t0 = 0.5 + k * d * 0.18; return ramp(t, t0, t0 + 1.4); };
  return (
    <Stage {...p} env={room({ t, seed: 10 })} cam={{ keys: [[0, 960, 560, 1.2, -1], [2.6, 600, 600, 1.4, 2], [5.2, 1300, 600, 1.4, -2], [d, 960, 600, 1.2, 1]] }}>
      <Floor />
      <g transform={`translate(420 ${lerp(300, 820, ei(fall(0)))}) rotate(${lerp(180, 30, fall(0))})`}><ellipse rx={70} ry={50} fill="#ddd" stroke="#555" strokeWidth={4} /><ellipse cx={50} cy={-60} rx={14} ry={50} fill="#ddd" stroke="#555" strokeWidth={4} /><circle cx={60} cy={-10} r={6} fill="#222" /></g>
      <g transform={`translate(820 ${lerp(300, 840, ei(fall(1)))}) rotate(${lerp(180, 50, fall(1))})`}><ellipse rx={56} ry={30} fill="#8a8a8a" stroke="#444" strokeWidth={4} /><path d="M-56,0 q-60,20 -100,-10" stroke="#c9a" strokeWidth={6} fill="none" /><circle cx={40} cy={-8} r={5} fill="#222" /></g>
      <g transform={`translate(1220 ${lerp(300, 850, ei(fall(2)))}) rotate(${lerp(180, 20, fall(2))})`}><path d="M-80,0 Q0,-30 80,0 Q0,30 -80,0Z" fill="#6aa04a" stroke="#2a5a2a" strokeWidth={4} /><path d="M-80,0 q-60,10 -110,-20" stroke="#6aa04a" strokeWidth={10} fill="none" /></g>
      <Cat x={1620} y={lerp(300, 760, ei(fall(3)))} s={0.6} t={t} {...twist(fall(3))} />
      <Pill x={1620} y={240} text="EL MEJOR" color={C.gold} size={32} s={pop(t, d * 0.8)} />
    </Stage>); };

S.cola = (p) => { const { t } = p; const d = D(p); const ts = d * 0.45; const u = ramp(t, ts, ts + 1.4);
  return (
    <Stage {...p} env={room({ t, seed: 11 })} cam={{ keys: [[0, 900, 600, 1.4, -1], [2.6, 700, 620, 1.7, 2], [ts, 960, 560, 1.2, -2], [ts + 2.4, 1000, 640, 1.4, 1], [d, 960, 620, 1.2, 0]] }}>
      <Floor />
      <Cat x={700} y={760} s={0.9} t={t} />
      <circle cx={430} cy={700} r={90} fill="none" stroke={C.gold} strokeWidth={8} opacity={1 - ramp(t, ts - 0.5, ts)} />
      <g><Cat x={1350} y={lerp(300, 760, ei(u))} s={0.8} t={t} {...twist(u)} color="#e8e4dc" stripe="#9a948a" belly="#fff" seed={6} /><rect x={1350 - 260} y={lerp(300, 760, ei(u)) - 120} width={0} height={0} /></g>
      <Pill x={700} y={300} text="AYUDA UN POCO" color={C.gold} size={30} s={pop(t, d * 0.2)} />
      <Pill x={1350} y={200} text="SIN COLA: TAMBIÉN CAE DE PIE" color={C.green} size={28} s={pop(t, ts + 1.2)} />
    </Stage>); };

S.kane = (p) => { const { t } = p; const d = D(p);
  const eq = ['L = I₁ω₁ + I₂ω₂ = 0', 'I₁ ≪ I₂  →  ω₁ ≫ ω₂', 'Δθ ≠ 0'];
  return (
    <Stage {...p} env={lab} cam={{ keys: [[0, 960, 540, 1.15, -1], [2.6, 760, 480, 1.5, 2], [5.2, 1200, 600, 1.5, -2], [7.8, 960, 540, 1.2, 1], [d, 960, 540, 1.3, 0]] }}>
      <Txt x={560} y={200} size={70} color={C.gold} s={pop(t, 0.3)}>1969</Txt>
      {eq.map((e, k) => <text key={k} x={560} y={340 + k * 90} textAnchor="middle" fontFamily="monospace" fontSize={44} fill="#9fe0ff" opacity={ramp(t, 0.6 + k * 0.6, 1 + k * 0.6)}>{e}</text>)}
      <Cat x={560} y={760} s={0.6} t={t} {...twist(mod(t * 0.35, 1))} />
      <g transform={`translate(1420 ${520 + 30 * Math.sin(t)}) rotate(${t * 40})`} opacity={pop(t, d * 0.5) > 0.1 ? 1 : 0}><circle r={70} fill="#fff" stroke="#bbb" strokeWidth={6} /><rect x={-50} y={-30} width={100} height={50} rx={18} fill="#2a4a7a" /><rect x={-40} y={60} width={80} height={130} rx={20} fill="#fff" stroke="#bbb" strokeWidth={6} /></g>
      <Pill x={1420} y={260} text="NASA: ASTRONAUTAS" color={C.cyan} size={30} s={pop(t, d * 0.55)} />
    </Stage>); };

S.gravedad_cero = (p) => { const { t } = p; const d = D(p);
  const inside = ramp(t, d * 0.35, d * 0.45);
  return (
    <Stage {...p} env={inside < 0.5 ? sky({ t }) : { custom: (cam) => <g><rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#d8dee4" /><g transform={layerT(cam, 0.4)}>{[...Array(8)].map((_, k) => <rect key={k} x={-200 + k * 300} y={100} width={160} height={100} rx={40} fill="#7fc4ef" stroke="#8a9aa8" strokeWidth={6} />)}</g><rect x={-400} y={900} width={2800} height={400} fill="#9aa4ae" /></g>, rays: false, fish: false }} cam={{ keys: [[0, 960, 540, 1.1, -1], [2.6, 1000, 500, 1.3, 2], [d * 0.4, 960, 540, 1.6, -2], [d * 0.4 + 2.6, 900, 540, 1.3, 2], [d, 960, 540, 1.4, -1]] }}>
      {inside < 0.5 ? <g><path d="M200,800 Q960,100 1720,800" stroke="#fff" strokeWidth={6} fill="none" strokeDasharray="20 16" /><Plane x={lerp(300, 1300, t / (d * 0.4))} y={800 - 700 * Math.sin(PI * cl(t / (d * 0.4)) * 0.75)} s={0.7} rot={lerp(-30, 10, t / (d * 0.4))} t={t} /></g>
        : <g>{[0, 1].map((k) => <Cat key={k} x={760 + k * 420 + 60 * Math.sin(t * 0.7 + k)} y={480 + 80 * Math.sin(t * 0.9 + k * 2)} s={0.7} t={t} seed={k + 2} rot={t * 50 * (k ? -1 : 1)} rollF={t * (1.5 + k)} rollB={t * (1.2 + k) + 1} tuckF={0.5 + 0.5 * Math.sin(t * 3)} />)}
          {[0, 1, 2].map((k) => <Txt key={k} x={700 + k * 260} y={260 + 30 * Math.sin(t * 2 + k)} size={70} color={C.gold} s={pop(t, d * 0.5 + k * 0.3)}>?</Txt>)}</g>}
      <Pill x={960} y={960} text={inside < 0.5 ? 'VUELO SIN GRAVEDAD' : 'SIN "ABAJO": CONFUNDIDOS'} color={C.purple} size={30} s={pop(t, inside < 0.5 ? 0.5 : d * 0.55)} />
    </Stage>); };

S.aterrizaje = (p) => { const { t } = p; const d = D(p); const tl = d * 0.35;
  const u = ramp(t, 0.4, tl); const sq = t > tl ? Math.exp(-(t - tl) * 4) * Math.sin((t - tl) * 18) : 0;
  return (
    <Stage {...p} env={room({ t, seed: 12 })} cam={{ keys: [[0, 960, 420, 1.3, -1], [tl, 960, 640, 1.5, 2], [tl + 2.6, 1000, 700, 1.9, -2], [tl + 5.2, 960, 640, 1.4, 1], [d, 960, 620, 1.25, 0]], shake: (tt) => Math.max(0, 1 - Math.abs(tt - tl) * 5) * 0.6 }}>
      <Floor />
      <g transform={`translate(960 ${lerp(300, 770, ei(u))}) scale(${1 + 0.12 * sq} ${1 - 0.15 * sq})`}><Cat x={0} y={0} s={1} t={t} arch={t < tl ? 0.8 : 0.4 * Math.max(0, sq)} tuckF={0} tuckB={0} /></g>
      {t > tl && [70, 100, -80, -100].map((lx, k) => <circle key={k} cx={960 + lx} cy={880} r={20 + 40 * ramp(t, tl, tl + 0.5)} fill="none" stroke={C.gold} strokeWidth={6} opacity={1 - ramp(t, tl, tl + 0.8)} />)}
      <Pill x={560} y={260} text="PATAS = RESORTES" color={C.cyan} size={30} s={pop(t, tl + 0.3)} />
      <Pill x={1380} y={260} text="ALMOHADILLAS = COJINES" color="#e57386" size={28} s={pop(t, d * 0.7)} />
    </Stage>); };

S.altura = (p) => { const { t } = p; const d = D(p); const ts = d * 0.3; const u = ramp(t, ts, ts + 1.2);
  return (
    <Stage {...p} env={room({ t, seed: 13 })} cam={{ keys: [[0, 960, 600, 1.2, 1], [2.6, 800, 620, 1.5, -2], [5.2, 1150, 640, 1.5, 2], [d, 960, 620, 1.3, -1]] }}>
      <Floor />
      <g transform="translate(560 880)"><rect x={-20} y={-330} width={40} height={330} fill="#f4c542" stroke="#8a6a1a" strokeWidth={4} />{[...Array(7)].map((_, k) => <path key={k} d={`M20,${-k * 50} l30,0`} stroke="#8a6a1a" strokeWidth={4} />)}<Txt x={0} y={-370} size={46} color={C.gold}>30 CM</Txt></g>
      <Cat x={960} y={lerp(560, 780, ei(u))} s={0.7} t={t} {...twist(u)} />
      <Clock x={1450} y={420} t={t} label="TIEMPO JUSTO" />
      <Pill x={960} y={240} text="MENOS: NO ALCANZA A GIRAR" color={C.red} size={28} s={pop(t, d * 0.7)} />
    </Stage>); };

S.puente_alto = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={city({ t, seed: 2 })} cam={{ keys: [[0, 960, 700, 1.1, -2], [d * 0.5, 960, 400, 1.3, 2], [d, 960, 200, 1.6, -1]] }}>
      <Building x={960} top={-1400} bottom={1000} floors={9} t={t} />
      <Cat x={1080} y={-1400 + 2400 / 9 * 0 + 120 + 1450} s={0.4} t={t} look={Math.sin(t * 2)} />
      <Txt x={560} y={300} size={60} s={pop(t, d * 0.3)} rot={-3}>¿DESDE UN EDIFICIO?</Txt>
    </Stage>); };

S.estudio = (p) => { const { t } = p; const d = D(p);
  const n = Math.floor(cl(ramp(t, 0.6, d * 0.65)) * 132);
  return (
    <Stage {...p} env={{ custom: (cam) => <g><rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#eaf4f4" /><g transform={layerT(cam, 0.3)}>{[...Array(10)].map((_, k) => <rect key={k} x={-300 + k * 260} y={120} width={160} height={260} fill="#d4e6e6" />)}</g><rect x={-400} y={880} width={2800} height={400} fill="#c8d8d8" /></g>, rays: false, fish: false }} cam={{ keys: [[0, 960, 560, 1.2, -1], [2.6, 700, 520, 1.5, 2], [5.2, 1200, 540, 1.4, -2], [7.8, 960, 560, 1.2, 1], [d, 960, 560, 1.3, 0]] }}>
      <Txt x={500} y={200} size={60} color="#2a6a8a" s={pop(t, 0.3)}>NUEVA YORK · 1987</Txt>
      <Person x={260} y={820} s={1.2} t={t} shirt="#fff" hat={false} /><Person x={420} y={820} s={1.2} t={t} shirt="#fff" hat={false} seed={3} flip />
      {[...Array(n)].map((_, k) => <circle key={k} cx={720 + (k % 22) * 50} cy={330 + Math.floor(k / 22) * 60} r={18} fill={k % 10 === 9 ? '#9aa' : C.green} />)}
      <Counter x={1300} y={820} t={t} t0={0.6} t1={d * 0.65} v1={132} size={90} color="#2a6a8a" suffix=" GATOS" />
      <Pill x={960} y={960} text="~90 % SOBREVIVIÓ" color={C.green} size={34} s={pop(t, d * 0.75)} />
    </Stage>); };

S.raro = (p) => { const { t } = p; const d = D(p);
  const bars = [[2, 0.45], [4, 0.75], [6, 1], [8, 0.6], [10, 0.5]];
  return (
    <Stage {...p} env={lab} cam={{ keys: [[0, 960, 560, 1.15, 1], [2.6, 800, 600, 1.5, -2], [5.2, 1250, 560, 1.5, 2], [7.8, 960, 560, 1.2, -1], [d, 960, 560, 1.3, 0]] }}>
      <line x1={420} y1={820} x2={1560} y2={820} stroke="#fff" strokeWidth={5} /><Txt x={990} y={900} size={30}>PISOS</Txt><Txt x={300} y={500} size={30} rot={-90}>LESIONES</Txt>
      {bars.map(([fl, v], k) => { const h = 420 * v * eo(ramp(t, 0.5 + k * 0.4, 1.2 + k * 0.4)); return <g key={k}><rect x={500 + k * 210} y={820 - h} width={130} height={h} fill={fl >= 8 ? C.green : fl === 6 ? C.red : C.cyan} /><Txt x={565 + k * 210} y={790 - h} size={30} op={h > 10 ? 1 : 0}>{fl}</Txt></g>; })}
      <Arrow x={1360} y={300} rot={30} s={1} color={C.green} />
      <Pill x={960} y={220} text="+7 PISOS: MENOS LESIONES" color={C.gold} size={32} s={pop(t, d * 0.65)} />
    </Stage>); };

S.paracaidas = (p) => { const { t } = p; const d = D(p); const relax = ramp(t, d * 0.5, d * 0.65);
  const v = Math.round(100 * Math.min(1, 1 - Math.exp(-t * 0.8)));
  return (
    <Stage {...p} env={city({ t, seed: 3 })} cam={{ keys: [[0, 960, 540, 1.2, -1], [2.6, 900, 520, 1.5, 2], [5.2, 1050, 560, 1.3, -2], [7.8, 960, 540, 1.6, 1], [d, 960, 540, 1.3, 0]], shake: () => 0.15 }}>
      {[...Array(14)].map((_, k) => <line key={k} x1={500 + k * 70} y1={mod(-t * 1400 + k * 170, 1300) - 100} x2={500 + k * 70} y2={mod(-t * 1400 + k * 170, 1300) + 60} stroke="#fff" strokeWidth={4} opacity={0.6} />)}
      <Cat x={960} y={520 + 14 * Math.sin(t * 6)} s={1.1} t={t} spread={relax} tuckF={0.6 * (1 - relax)} tuckB={0.6 * (1 - relax)} arch={0.6 * (1 - relax)} />
      <g transform="translate(1520 260)"><rect x={-170} y={-70} width={340} height={140} rx={20} fill="#0f2240" stroke="#fff" strokeWidth={4} /><text x={0} y={22} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={62} fill={C.gold}>{v} km/h</text></g>
      <Pill x={500} y={860} text="MODO ARDILLA VOLADORA" color={C.green} size={30} s={pop(t, d * 0.6)} />
    </Stage>); };

S.frena = (p) => { const { t } = p; const d = D(p); const tl = d * 0.5; const u = ramp(t, 0.3, tl);
  return (
    <Stage {...p} env={city({ t, seed: 4 })} cam={{ keys: [[0, 960, 400, 1.3, 1], [2.6, 960, 520, 1.5, -2], [tl, 960, 760, 1.4, 2], [tl + 2.4, 1000, 780, 1.7, -1], [d, 960, 720, 1.3, 0]], shake: (tt) => Math.max(0, 1 - Math.abs(tt - tl) * 5) * 0.5 }}>
      <Street t={0} y={900} />
      {[...Array(10)].map((_, k) => <path key={k} d={`M${760 + k * 45},${lerp(200, 700, u) - 140} l0,-${60 + 30 * Math.sin(t * 9 + k)}`} stroke="#fff" strokeWidth={4} opacity={t < tl ? 0.7 : 0} />)}
      <Cat x={960} y={lerp(250, 840, ease(u))} s={0.9} t={t} spread={t < tl ? 1 : 1 - ramp(t, tl, tl + 0.6)} />
      {t > tl && <ellipse cx={960} cy={900} rx={260 * ramp(t, tl, tl + 0.4)} ry={30} fill={C.gold} opacity={0.5 * (1 - ramp(t, tl, tl + 1))} />}
      <Pill x={500} y={240} text="MÁS SUPERFICIE = FRENA" color={C.cyan} size={30} s={pop(t, d * 0.2)} />
      <Pill x={1400} y={240} text="GOLPE REPARTIDO" color={C.gold} size={30} s={pop(t, tl + 0.3)} />
    </Stage>); };

S.sesgo = (p) => { const { t } = p; const d = D(p); const hide = ramp(t, d * 0.4, d * 0.6);
  return (
    <Stage {...p} env={lab} cam={{ keys: [[0, 960, 540, 1.2, -1], [2.6, 760, 540, 1.5, 2], [5.2, 1200, 540, 1.5, -2], [7.8, 960, 540, 1.2, 1], [d, 960, 540, 1.35, 0]] }}>
      <g transform="translate(1300 520)"><path d="M-220,240 L-220,-80 L0,-200 L220,-80 L220,240Z" fill="#eaf4f4" stroke="#fff" strokeWidth={6} /><rect x={-30} y={-150} width={60} height={20} fill={C.red} /><rect x={-10} y={-170} width={20} height={60} fill={C.red} /><Txt x={0} y={60} size={34} color="#2a6a8a">VETERINARIO</Txt></g>
      {[...Array(10)].map((_, k) => { const lost = k >= 7; const x = lerp(300, 1180, mod(t * 0.12 + k / 10, 1)); return <g key={k} opacity={lost ? 1 - hide : 1}><circle cx={lost ? 420 + (k - 7) * 90 : x} cy={lost ? 760 : 640 + (k % 3) * 40} r={22} fill={lost ? '#9aa' : C.green} /></g>; })}
      <g transform="translate(560 300)"><Txt x={0} y={0} size={96} color={C.gold} s={pop(t, 0.4)}>90 %</Txt><line x1={-140} y1={-20} x2={140} y2={-20} stroke={C.red} strokeWidth={12} opacity={hide} /><Txt x={0} y={100} size={40} color={C.red} s={pop(t, d * 0.65)}>EN REALIDAD: MENOS</Txt></g>
      <Pill x={960} y={960} text="LOS QUE MURIERON NO SE CONTARON" color={C.red} size={28} s={pop(t, d * 0.45)} />
    </Stage>); };

S.corto = (p) => { const { t } = p; const d = D(p); const ts = d * 0.35; const u = ramp(t, ts, ts + 0.9);
  const tw = twist(u * 0.55);
  return (
    <Stage {...p} env={city({ t, seed: 5 })} light={(tt) => (tt > ts + 0.9 ? 0.75 : 1)} cam={{ keys: [[0, 960, 420, 1.2, -1], [2.6, 1000, 380, 1.5, 2], [ts + 0.9, 960, 700, 1.5, -2], [ts + 3.4, 960, 680, 1.25, 1], [d, 980, 660, 1.4, 0]], shake: (tt) => Math.max(0, 1 - Math.abs(tt - ts - 0.9) * 4) * 0.7 }}>
      <Building x={700} top={60} bottom={900} floors={2} t={t} mark={2} />
      <Street t={0} y={900} />
      <Cat x={1060} y={t < ts ? 380 : lerp(380, 830, ei(u))} s={0.55} t={t} {...(t < ts ? {} : tw)} rot={t > ts + 0.9 ? 30 : 0} />
      <Pill x={1400} y={260} text="SIN TIEMPO DE GIRAR" color={C.red} size={30} s={pop(t, ts + 1)} />
      <g transform="translate(1500 600)" opacity={pop(t, d * 0.6) > 0.1 ? 1 : 0}><path d="M0,-90 L90,70 L-90,70Z" fill={C.gold} stroke="#000" strokeWidth={5} /><Txt x={0} y={50} size={90} color="#000">!</Txt></g>
    </Stage>); };

S.balcon = (p) => { const { t } = p; const d = D(p); const net = ramp(t, d * 0.15, d * 0.4);
  return (
    <Stage {...p} env={room({ t, seed: 14 })} cam={{ keys: [[0, 1300, 420, 1.3, -1], [2.6, 1500, 360, 1.6, 2], [5.2, 1200, 480, 1.3, -2], [7.8, 1000, 560, 1.2, 1], [d, 1100, 520, 1.35, 0]] }}>
      <Floor />
      <g transform={layerT({ x: 960, y: 540, z: 1, r: 0 }, 1)}><Net x={1500} y={330} w={460} h={380} on={net} /></g>
      <Bird x={1500 + 100 * Math.sin(t)} y={200 + 30 * Math.sin(t * 2)} s={0.6} t={t} />
      <Cat x={1150} y={780} s={0.9} t={t} look={0.5 + 0.5 * Math.sin(t * 2)} arch={0.3 + 0.3 * Math.sin(t * 5)} />
      <Pill x={700} y={260} text="PON UNA MALLA" color={C.green} size={36} s={pop(t, d * 0.3)} />
      <Pill x={700} y={380} text="CAER DE PIE ≠ NO LASTIMARSE" color={C.red} size={28} s={pop(t, d * 0.7)} />
    </Stage>); };

S.resumen = (p) => { const { t } = p; const d = D(p);
  const tags = ['OÍDO INTERNO', 'COLUMNA DE GOMA', 'HOMBROS LIBRES', 'TRUCO DE 2 MITADES'];
  return (
    <Stage {...p} env={sky({ t })} cam={{ focus: (tt) => [960, 560], zamt: 0.7 }}>
      <Cat x={960} y={560} s={0.9} t={t} {...twist(mod(t * 0.3, 1))} />
      {tags.map((n, k) => { const a = k * 1.57 + t * 0.4; return <Pill key={k} x={960 + 560 * Math.cos(a)} y={540 + 300 * Math.sin(a)} text={n} size={28} color={[C.cyan, C.red, C.gold, C.green][k]} s={pop(t, d * (0.12 + k * 0.15))} />; })}
    </Stage>); };

S.cierre = (p) => { const { t } = p; const d = D(p); const tc = d * 0.3;
  const pressed = t > tc;
  const ring = t > d * 0.4 ? 18 * Math.sin((t - d * 0.4) * 22) * Math.exp(-(t - d * 0.4) * 1.5) : 0;
  return (
    <Stage {...p} env={room({ t, seed: 15 })} cam={{ keys: [[0, 960, 520, 1.2, -2], [2.5, 1000, 470, 1.45, 1], [5, 960, 560, 1.1, -1], [d, 960, 560, 1.25, 0]] }}>
      <Cat x={lerp(300, 1600, t / d)} y={820} s={0.55} t={t} walk={1} />
      <g transform={`translate(860 450) scale(${pressed ? 1 - 0.08 * Math.max(0, 1 - (t - tc) * 6) : pop(t, 0.2)})`}><rect x={-270} y={-70} width={540} height={140} rx={34} fill={pressed ? '#5a5a5a' : '#e61e28'} /><text x={0} y={22} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={58} fill="#fff">{pressed ? 'SUSCRITO ✓' : 'SUSCRÍBETE'}</text></g>
      <g transform={`translate(1240 450) rotate(${ring})`}><path d="M-40,30 C-40,-40 -25,-60 0,-60 C25,-60 40,-40 40,30 L50,40 L-50,40Z" fill={C.gold} /><circle cy={52} r={11} fill={C.gold} /></g>
      <g transform={`translate(${lerp(1500, 1010, ease(ramp(t, 0.5, tc)))} ${lerp(900, 460, ease(ramp(t, 0.5, tc)))})`}><path d="M0,0 L0,60 L16,46 L28,72 L38,66 L26,42 L46,40Z" fill="#fff" stroke="#000" strokeWidth={3} /></g>
      <Txt x={960} y={250} size={50} color={C.gold} s={pop(t, d * 0.5)}>¿QUÉ SUPERPODER SIGUE?</Txt>
    </Stage>); };

export const ORDER18 = ['apertura', 'titulo', 'reflejo', 'velocidad', 'gatitos', 'arboles', 'oido', 'nivel', 'ojos', 'puente_cuerpo', 'columna', 'clavicula', 'problema', 'fisica', 'marey', 'academia', 'puente_truco', 'paso1', 'paso2', 'patinadora', 'paso3', 'cero', 'otros', 'cola', 'kane', 'gravedad_cero', 'aterrizaje', 'altura', 'puente_alto', 'estudio', 'raro', 'paracaidas', 'frena', 'sesgo', 'corto', 'balcon', 'resumen', 'cierre'];
export const S18 = S;
