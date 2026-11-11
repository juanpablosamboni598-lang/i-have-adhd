// v19 · ¿Cómo duermen los delfines? (38 escenas)
import React from 'react';
import { C, W, H, FONT, cl, lerp, ramp, ease, eo, ei, seg, pop, mod, rng, layerT, Pill, Ring, Counter } from './lib.jsx';
import { Stage } from './stage.jsx';
import { Shark, Seal, Fish, Diver } from './actors.jsx';
import { Person } from './actors2.jsx';
import { Txt } from './scenes14a.jsx';
import { RoomBack } from './actors4.jsx';
import { Dolphin, Brain2, Wave, Duck, Frigate, SpermWhale, Bed, Boat } from './actors5.jsx';

const D = (p) => p.frames / 30;
const sea = (x = {}) => ({ theme: 'blue', ...x });
const night = (x = {}) => ({ theme: 'deep', ...x });
const lab = { theme: 'dark', rays: false, fish: false };
const SkyBack = ({ cam, t }) => <g><defs><linearGradient id="sky19" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a7fd0" /><stop offset="0.75" stopColor="#bfe4ff" /><stop offset="0.76" stopColor="#2a6ea8" /><stop offset="1" stopColor="#123e66" /></linearGradient></defs><rect x={-200} y={-200} width={W + 400} height={H + 400} fill="url(#sky19)" /><g transform={layerT(cam, 0.3)}>{[...Array(9)].map((_, k) => <ellipse key={k} cx={mod(k * 330 - t * 50, 2800) - 400} cy={120 + (k * 137) % 500} rx={160} ry={40} fill="#fff" opacity={0.8} />)}</g></g>;
const sky = (x = {}) => ({ custom: (cam) => <SkyBack cam={cam} t={x.t || 0} />, rays: false, fish: false, ...x });
const room = (x = {}) => ({ custom: (cam) => <RoomBack cam={cam} t={x.t || 0} seed={x.seed || 1} night={1} wall={x.wall || '#c9b8a0'} />, rays: false, fish: false, ...x });
const Eye = ({ x, y, t, open, label, s = 1 }) => <g transform={`translate(${x} ${y}) scale(${s})`}><ellipse rx={90} ry={60} fill="#fff" stroke="#1d2b3a" strokeWidth={8} /><ellipse rx={90} ry={60 * (1 - open)} cy={-60 * open} fill="#6f8fa8" opacity={open < 1 ? 1 : 0} /><circle r={34 * open} fill="#111" /><circle cx={10} cy={-10} r={10 * open} fill="#fff" />{open < 0.2 && <path d="M-90,0 Q0,40 90,0" stroke="#1d2b3a" strokeWidth={8} fill="none" />}{label && <Txt x={0} y={120} size={34}>{label}</Txt>}</g>;
const Clock = ({ x, y, t, label, speed = 3 }) => <g transform={`translate(${x} ${y})`}><circle r={60} fill="#0f2240" stroke="#fff" strokeWidth={5} /><line x1={0} y1={0} x2={44 * Math.sin(t * speed)} y2={-44 * Math.cos(t * speed)} stroke={C.gold} strokeWidth={7} strokeLinecap="round" />{label && <Txt x={0} y={100} size={26}>{label}</Txt>}</g>;

const S = {};
S.apertura = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={night({ seabed: 980 })} light={0.8} cam={{ keys: [[0, 1150, 520, 1.9, -2], [2.6, 1100, 540, 1.5, 2], [5.2, 960, 560, 1.15, -1], [7.8, 1050, 540, 1.4, 1], [d, 960, 560, 1.2, 0]] }}>
      <Dolphin x={900} y={560} s={1.3} t={t} swim={0.3} eye={1} sleep={ramp(t, d * 0.3, d * 0.5)} />
      <g opacity={ramp(t, d * 0.45, d * 0.6)}><Brain2 x={1500} y={330} s={0.55} t={t} sleepL={0} sleepR={1} /></g>
      <Pill x={600} y={250} text="OJO IZQUIERDO: ABIERTO" color={C.gold} size={28} s={pop(t, d * 0.2)} />
      <Pill x={1450} y={620} text="MEDIO CEREBRO DUERME" color={C.cyan} size={28} s={pop(t, d * 0.6)} />
    </Stage>); };

S.titulo = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={sea({ surface: 200, seabed: 960 })} cam={{ keys: [[0, 960, 620, 1.3, -2], [2.6, 960, 520, 1.05, 1], [5.2, 980, 560, 1.2, -1], [7.8, 1150, 640, 1.4, 2], [d, 960, 580, 1.15, 0]] }}>
      <Dolphin x={lerp(200, 1700, t / d)} y={780 + 40 * Math.sin(t)} s={0.7} t={t} swim={1} />
      <Dolphin x={lerp(0, 1500, t / d)} y={860 + 30 * Math.sin(t + 1)} s={0.5} t={t} seed={3} swim={1} />
      <Txt x={960} y={390} size={90} color="#7dfcff" s={pop(t, 0.3)} rot={-2 + 2 * Math.sin(t)}>¿CÓMO DUERMEN</Txt>
      <Txt x={960} y={500} size={110} color="#fff" s={pop(t, 0.6)} rot={2 - 2 * Math.sin(t)}>LOS DELFINES?</Txt>
      {['SIN AHOGARSE', 'SU CEREBRO', 'OTROS ANIMALES'].map((n, k) => <Pill key={k} x={560 + k * 400} y={620} text={n} size={28} color={[C.cyan, C.gold, C.purple][k]} s={pop(t, d * 0.35 + k * d * 0.15)} />)}
    </Stage>); };

S.problema = (p) => { const { t } = p; const d = D(p); const up = Math.sin(cl(ramp(t, d * 0.4, d * 0.9)) * Math.PI);
  return (
    <Stage {...p} env={sea({ surface: 260, seabed: 980 })} cam={{ keys: [[0, 960, 600, 1.2, -1], [2.6, 800, 520, 1.5, 2], [5.2, 1100, 420, 1.4, -2], [d, 960, 500, 1.25, 1]] }}>
      <Dolphin x={900} y={lerp(640, 300, up)} rot={-25 * up} s={1} t={t} hole={up > 0.9 ? 1 : 0} blow={up > 0.9 ? t : 0} />
      <g transform="translate(1500 700)" opacity={pop(t, d * 0.15) > 0.1 ? 1 : 0}><path d="M-60,-60 C-60,-110 60,-110 60,-60 L50,60 L-50,60Z" fill="#f2a0b0" stroke="#a05a6a" strokeWidth={5} /><Txt x={0} y={130} size={30}>PULMONES</Txt></g>
      <Pill x={600} y={900} text="MAMÍFERO: RESPIRA AIRE" color={C.gold} size={30} s={pop(t, d * 0.25)} />
    </Stage>); };

S.espiraculo = (p) => { const { t } = p; const d = D(p); const h = ramp(t, d * 0.5, d * 0.6) * (1 - ramp(t, d * 0.75, d * 0.85));
  return (
    <Stage {...p} env={sea({ surface: 380 })} cam={{ keys: [[0, 960, 560, 1.2, 1], [2.6, 1100, 420, 1.7, -2], [5.2, 1150, 400, 2.1, 2], [7.8, 1050, 460, 1.5, -1], [d, 960, 520, 1.3, 0]] }}>
      <Dolphin x={900} y={470} s={1.3} t={t} swim={0.4} hole={h} blow={h > 0.5 ? t : 0} />
      <Ring x={1095} y={398} t={t} t0={d * 0.15} dur={1} maxR={90} color={C.gold} />
      <Pill x={1400} y={220} text="ESPIRÁCULO" color={C.gold} size={34} s={pop(t, d * 0.15)} />
      <Pill x={700} y={760} text={h > 0.5 ? 'ABRE CON UN MÚSCULO' : 'RELAJADO: CERRADO'} color={h > 0.5 ? C.green : C.red} size={28} s={pop(t, 0.6)} />
    </Stage>); };

S.voluntario = (p) => { const { t } = p; const d = D(p);
  const ph = mod(t, 3) / 3;
  return (
    <Stage {...p} env={sea({ surface: 300, seabed: 980 })} cam={{ keys: [[0, 960, 560, 1.15, -1], [2.6, 700, 560, 1.5, 2], [5.2, 1250, 520, 1.5, -2], [7.8, 960, 540, 1.2, 1], [d, 960, 540, 1.3, 0]] }}>
      <g transform="translate(480 560)"><circle r={130} fill="#16365a" stroke="#fff" strokeWidth={5} /><Person x={0} y={70} s={0.8} t={t} shirt="#e67e22" hat={false} /><Txt x={0} y={190} size={30}>TÚ: AUTOMÁTICO</Txt></g>
      <Dolphin x={1300} y={lerp(640, 360, Math.sin(ph * Math.PI))} rot={-20 * Math.sin(ph * Math.PI)} s={0.8} t={t} hole={ph > 0.45 && ph < 0.55 ? 1 : 0} blow={ph > 0.45 && ph < 0.6 ? t : 0} />
      <Txt x={1300} y={880} size={30} s={pop(t, d * 0.3)}>ÉL: CADA RESPIRACIÓN ES UNA DECISIÓN</Txt>
    </Stage>); };

S.ahogarse = (p) => { const { t } = p; const d = D(p); const sink = ramp(t, d * 0.3, d * 0.8);
  return (
    <Stage {...p} env={night({ surface: 220 })} light={(tt) => 1 - 0.4 * ramp(tt, d * 0.3, d * 0.8)} cam={{ keys: [[0, 960, 500, 1.2, -1], [2.6, 960, 600, 1.5, 2], [d, 960, 700, 1.8, -2]] }}>
      <Dolphin x={960} y={lerp(450, 760, sink)} rot={8 * sink} s={1} t={t} swim={0.1} eye={0} sleep={1 - sink} />
      {[...Array(8)].map((_, k) => <circle key={k} cx={1120 + 20 * Math.sin(t * 3 + k)} cy={lerp(450, 760, sink) - 60 - mod(t * 80 + k * 40, 300)} r={8} fill="#fff" opacity={0.5} />)}
      <g transform="translate(1450 300)" opacity={pop(t, d * 0.5) > 0.1 ? 1 : 0}><path d="M0,-90 L90,70 L-90,70Z" fill={C.red} stroke="#000" strokeWidth={5} /><Txt x={0} y={50} size={90} color="#fff">!</Txt></g>
      <Pill x={700} y={260} text="SI DURMIERA COMPLETO" color={C.red} size={30} s={pop(t, d * 0.2)} />
    </Stage>); };

S.solucion = (p) => { const { t } = p; const d = D(p); const sp = ramp(t, d * 0.25, d * 0.45);
  return (
    <Stage {...p} env={lab} cam={{ keys: [[0, 960, 540, 1.2, -2], [2.6, 960, 500, 1.45, 2], [5.2, 960, 540, 1.1, -1], [d, 960, 520, 1.35, 1]] }}>
      <g transform={`translate(${-60 * sp} 0)`}><Brain2 x={960 - 40 * sp} y={500} s={1.1} t={t} sleepL={0} sleepR={sp} labels /></g>
      <line x1={960} y1={300} x2={960} y2={700} stroke={C.gold} strokeWidth={6} strokeDasharray="20 14" opacity={sp} />
      <Pill x={960} y={860} text="SUEÑO UNIHEMISFÉRICO" color={C.cyan} size={36} s={pop(t, d * 0.55)} />
    </Stage>); };

S.hemisferios = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={night({ seabed: 980 })} cam={{ keys: [[0, 960, 540, 1.15, 1], [2.6, 700, 520, 1.5, -2], [5.2, 1250, 540, 1.45, 2], [7.8, 960, 540, 1.2, -1], [d, 960, 540, 1.3, 0]] }}>
      <Dolphin x={960} y={700} s={1.1} t={t} swim={0.4} brain={[0, 1]} />
      <Brain2 x={520} y={330} s={0.55} t={t} sleepL={0} sleepR={0} />
      <Brain2 x={1400} y={330} s={0.55} t={t} sleepL={0} sleepR={1} />
      <Txt x={520} y={500} size={30} s={pop(t, d * 0.2)}>TÚ DESPIERTO</Txt>
      <Txt x={1400} y={500} size={30} s={pop(t, d * 0.45)}>DELFÍN: 1 DUERME, 1 VIGILA</Txt>
    </Stage>); };

S.ondas = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={lab} cam={{ keys: [[0, 960, 540, 1.1, -1], [2.6, 760, 420, 1.5, 2], [5.2, 1150, 660, 1.5, -2], [7.8, 960, 540, 1.2, 1], [d, 960, 540, 1.3, 0]] }}>
      <Wave x={560} y={380} w={800} t={t} slow={1} color="#6ab0ff" label="LADO DERECHO: SUEÑO PROFUNDO" />
      <g opacity={ramp(t, d * 0.4, d * 0.5)}><Wave x={560} y={720} w={800} t={t} slow={0} color="#ffd36a" label="LADO IZQUIERDO: DESPIERTO" /></g>
      <Brain2 x={300} y={540} s={0.4} t={t} sleepL={0} sleepR={1} />
    </Stage>); };

S.ojo = (p) => { const { t } = p; const d = D(p); const sw = ramp(t, d * 0.4, d * 0.6);
  return (
    <Stage {...p} env={lab} cam={{ keys: [[0, 960, 540, 1.15, 1], [2.6, 800, 540, 1.45, -2], [5.2, 1150, 540, 1.45, 2], [d, 960, 540, 1.25, -1]] }}>
      <Brain2 x={960} y={330} s={0.7} t={t} sleepL={0} sleepR={1} labels />
      <Eye x={560} y={780} t={t} open={0} label="OJO IZQ." s={0.9} /><Eye x={1360} y={780} t={t} open={1} label="OJO DER." s={0.9} />
      <path d={`M${1030},400 C1000,600 700,600 600,700`} stroke="#6ab0ff" strokeWidth={10} fill="none" strokeDasharray="24 16" strokeDashoffset={-t * 80} opacity={sw} />
      <path d={`M${890},400 C920,600 1220,600 1320,700`} stroke="#ffd36a" strokeWidth={10} fill="none" strokeDasharray="24 16" strokeDashoffset={-t * 80} opacity={sw} />
      <Pill x={960} y={980} text="CONEXIÓN CRUZADA" color={C.gold} size={30} s={pop(t, d * 0.65)} />
    </Stage>); };

S.turnos = (p) => { const { t } = p; const d = D(p); const sw = ease(ramp(t, d * 0.45, d * 0.6));
  return (
    <Stage {...p} env={night({ seabed: 980 })} cam={{ keys: [[0, 960, 560, 1.2, -1], [2.6, 1050, 520, 1.5, 2], [5.2, 900, 560, 1.3, -2], [7.8, 960, 520, 1.5, 1], [d, 960, 540, 1.2, 0]] }}>
      <Brain2 x={960} y={400} s={0.9} t={t} sleepL={sw} sleepR={1 - sw} labels />
      <Clock x={1500} y={300} t={t} speed={4} label="CAMBIO DE TURNO" />
      <Dolphin x={lerp(300, 1600, t / d)} y={840} s={0.6} t={t} swim={0.5} eye={1} />
      <Pill x={500} y={240} text={sw < 0.5 ? 'TURNO 1' : 'TURNO 2'} color={sw < 0.5 ? C.cyan : C.gold} size={32} s={pop(t, 0.4)} />
    </Stage>); };

S.horas = (p) => { const { t } = p; const d = D(p); const fill = ramp(t, 0.5, d * 0.6);
  return (
    <Stage {...p} env={lab} cam={{ keys: [[0, 960, 540, 1.2, 1], [2.6, 800, 540, 1.5, -2], [5.2, 1150, 540, 1.4, 2], [d, 960, 540, 1.3, -1]] }}>
      <g transform="translate(700 540)"><circle r={240} fill="#16365a" stroke="#fff" strokeWidth={6} /><path d={`M0,0 L0,-240 A240,240 0 ${fill > 0.5 * 0.333 * 3 ? 0 : 0} 1 ${240 * Math.sin(fill * 0.333 * 2 * Math.PI)},${-240 * Math.cos(fill * 0.333 * 2 * Math.PI)}Z`} fill="#6ab0ff" /><Txt x={0} y={20} size={70}>1/3</Txt><Txt x={0} y={320} size={32}>DEL DÍA DURMIENDO</Txt></g>
      <Dolphin x={1400} y={560} s={0.8} t={t} swim={0.5} brain={[0, 1]} />
      <Pill x={1400} y={820} text="NUNCA TODO APAGADO" color={C.red} size={30} s={pop(t, d * 0.65)} />
    </Stage>); };

S.puente_como = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={sea({ surface: 240, seabed: 960 })} cam={{ keys: [[0, 960, 560, 1.2, 2], [d * 0.5, 960, 560, 1.5, -2], [d, 980, 560, 1.8, 1]] }}>
      <Dolphin x={960} y={620} s={1} t={t} swim={0.6} />
      {['CAMA', 'CUEVA', 'NIDO'].map((e, k) => <g key={k} opacity={pop(t, 0.5 + k * 0.4) > 0.1 ? 1 : 0}><circle cx={560 + k * 400} cy={380} r={70} fill="#0f2240" stroke="#fff" strokeWidth={5} /><text x={560 + k * 400} y={392} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={30} fill="#fff">{e}</text><line x1={510 + k * 400} y1={330} x2={610 + k * 400} y2={430} stroke={C.red} strokeWidth={10} /></g>)}
      <Txt x={960} y={900} size={50} s={pop(t, d * 0.6)}>2 OPCIONES</Txt>
    </Stage>); };

S.tronco = (p) => { const { t } = p; const d = D(p); const fog = ramp(t, d * 0.5, d * 0.7);
  return (
    <Stage {...p} env={sea({ surface: 460 })} cam={{ keys: [[0, 960, 480, 1.4, -1], [2.6, 1000, 460, 1.7, 2], [5.2, 960, 460, 1.1, -2], [7.8, 900, 470, 1.3, 1], [d, 960, 470, 1.15, 0]] }}>
      <g opacity={1 - fog}><Dolphin x={960} y={490} s={1} t={t} swim={0.05} eye={1} hole={mod(t, 4) < 0.6 ? 1 : 0} blow={mod(t, 4) < 0.6 ? t : 0} /></g>
      <g opacity={fog} transform={`translate(960 ${470 + 4 * Math.sin(t)})`}><rect x={-280} y={-40} width={560} height={80} rx={40} fill="#7a5a3a" stroke="#3a2a1a" strokeWidth={6} /><ellipse cx={280} cy={0} rx={20} ry={40} fill="#c9a06a" stroke="#3a2a1a" strokeWidth={5} /></g>
      <Txt x={960} y={250} size={60} color="#7a5a3a" s={pop(t, d * 0.6)}>LOGGING</Txt>
      <Pill x={960} y={780} text="QUIETO EN LA SUPERFICIE" color={C.cyan} size={30} s={pop(t, d * 0.2)} />
    </Stage>); };

S.nadando = (p) => { const { t } = p; const d = D(p); const ph = mod(t / 5, 1);
  return (
    <Stage {...p} env={sea({ surface: 260, seabed: 980 })} cam={{ focus: (tt) => [lerp(500, 1400, tt / d), 600], zamt: 0.8 }}>
      <Dolphin x={lerp(400, 1500, t / d)} y={lerp(700, 330, Math.max(0, Math.sin(ph * Math.PI * 2)) ** 3)} rot={-20 * Math.cos(ph * Math.PI * 2) * (Math.sin(ph * Math.PI * 2) > 0 ? 1 : 0)} s={0.9} t={t} swim={0.3} eye={1} sleep={0.6} />
      <Txt x={lerp(400, 1500, t / d)} y={900} size={34}>PILOTO AUTOMÁTICO</Txt>
    </Stage>); };

S.grupo = (p) => { const { t } = p; const d = D(p); const a = t * 0.25;
  return (
    <Stage {...p} env={night({ seabed: 980 })} cam={{ focus: (tt) => [960, 560], zamt: 0.8 }}>
      {[0, 1, 2, 3, 4].map((k) => { const ang = a + k * 1.256; return <Dolphin key={k} x={960 + 420 * Math.cos(ang)} y={560 + 170 * Math.sin(ang)} s={0.5 + 0.1 * Math.sin(ang)} t={t} seed={k} swim={0.4} flip={Math.sin(ang) > 0} rot={0} eye={1} />; })}
      <Pill x={960} y={180} text="DUERMEN EN GRUPO" color={C.cyan} size={32} s={pop(t, d * 0.2)} />
    </Stage>); };

S.ojo_grupo = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={night({ seabed: 980 })} cam={{ keys: [[0, 960, 540, 1.2, -1], [2.6, 800, 500, 1.5, 2], [5.2, 1150, 600, 1.5, -2], [d, 960, 560, 1.3, 1]] }}>
      <Dolphin x={900} y={420} s={0.8} t={t} swim={0.3} eye={1} /><Dolphin x={1000} y={680} s={0.8} t={t} seed={2} swim={0.3} eye={1} />
      <path d={`M1065,414 L1065,600`} stroke={C.gold} strokeWidth={6} strokeDasharray="14 10" />
      <path d={`M1165,674 L1500,800`} stroke={C.red} strokeWidth={6} strokeDasharray="14 10" opacity={ramp(t, d * 0.55, d * 0.65)} />
      <Pill x={500} y={200} text="UN OJO HACIA EL GRUPO" color={C.gold} size={28} s={pop(t, d * 0.2)} />
      <Pill x={1500} y={880} text="OTRO HACIA EL PELIGRO" color={C.red} size={28} s={pop(t, d * 0.6)} />
    </Stage>); };

S.tiburon = (p) => { const { t } = p; const d = D(p); const tr = d * 0.6; const flee = ramp(t, tr, tr + 1.2);
  return (
    <Stage {...p} env={night({ seabed: 980 })} light={(tt) => 0.7 + 0.5 * Math.max(0, 1 - Math.abs(tt - tr) * 3)} cam={{ keys: [[0, 960, 560, 1.2, -1], [2.6, 700, 560, 1.5, 2], [tr, 1000, 560, 1.4, -2], [tr + 2, 1200, 560, 1.2, 1], [d, 1100, 560, 1.3, 0]], shake: (tt) => Math.max(0, 1 - Math.abs(tt - tr) * 4) * 0.5 }}>
      <Shark x={lerp(-200, 700, ramp(t, 0, tr))} y={700} s={0.8} t={t} speed={1} />
      <Dolphin x={lerp(1100, 1700, ease(flee))} y={lerp(450, 380, flee)} s={0.8} t={t} swim={0.3 + 2 * flee} eye={1} brain={[0, 1]} />
      <Pill x={1400} y={240} text="REACCIONA AL INSTANTE" color={C.gold} size={28} s={pop(t, tr + 0.2)} />
    </Stage>); };

S.frio = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={{ theme: 'cold', seabed: 980 }} cam={{ keys: [[0, 960, 540, 1.15, 1], [2.6, 800, 560, 1.5, -2], [5.2, 1150, 540, 1.4, 2], [7.8, 960, 540, 1.2, -1], [d, 960, 540, 1.3, 0]] }}>
      <Dolphin x={900} y={560} s={1} t={t} swim={0.4} eye={1} />
      <ellipse cx={860} cy={560} rx={360} ry={130} fill="#ff7a3a" opacity={0.18 + 0.08 * Math.sin(t * 3)} />
      {[...Array(10)].map((_, k) => { const u = mod(t * 0.4 + k / 10, 1); return <path key={k} d={`M${560 + k * 60},${520 - u * 300} l12,-20 l12,20`} stroke="#bfe8ff" strokeWidth={4} fill="none" opacity={1 - u} />; })}
      <g transform="translate(1500 560)"><rect x={-24} y={-180} width={48} height={300} rx={24} fill="#fff" stroke="#333" strokeWidth={5} /><rect x={-14} y={lerp(100, -120, 0.6 + 0.1 * Math.sin(t))} width={28} height={200} fill={C.red} /><circle cy={130} r={40} fill={C.red} stroke="#333" strokeWidth={5} /></g>
      <Pill x={960} y={220} text="MOVERSE = CALOR" color="#ff7a3a" size={32} s={pop(t, d * 0.4)} />
    </Stage>); };

S.sonar = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={night({ seabed: 980 })} cam={{ keys: [[0, 900, 540, 1.3, -1], [2.6, 1100, 520, 1.5, 2], [5.2, 1250, 560, 1.3, -2], [d, 1050, 540, 1.2, 1]] }}>
      <Dolphin x={600} y={540} s={0.9} t={t} swim={0.4} eye={0} sleep={0.6} click={1} />
      <Fish x={1500} y={540 + 30 * Math.sin(t)} s={1} t={t} />
      {[0, 1, 2].map((k) => { const u = mod(t * 1.5 + k / 3 + 0.5, 1); return <path key={k} d={`M${1450 - u * 500},${470 - u * 40} Q${1420 - u * 520},540 ${1450 - u * 500},${610 + u * 40}`} stroke={C.gold} strokeWidth={5} fill="none" opacity={(1 - u) * 0.8} />; })}
      <Pill x={960} y={220} text="SONAR ENCENDIDO MIENTRAS DUERME" color={C.cyan} size={28} s={pop(t, d * 0.4)} />
    </Stage>); };

S.experimento = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={sea({ surface: 200, seabed: 960 })} cam={{ keys: [[0, 960, 560, 1.15, -1], [2.6, 760, 560, 1.5, 2], [5.2, 1200, 560, 1.45, -2], [7.8, 960, 560, 1.2, 1], [d, 960, 560, 1.3, 0]] }}>
      <Txt x={500} y={300} size={70} color={C.gold} s={pop(t, 0.3)}>2012</Txt>
      <Dolphin x={700} y={620} s={0.65} t={t} swim={0.4} click={1} /><Dolphin x={700} y={820} s={0.55} t={t} seed={4} swim={0.4} click={1} />
      {[0, 1, 2].map((k) => <g key={k} transform={`translate(${1350 + k * 120} ${600 + 60 * Math.sin(t + k)})`}><circle r={34} fill={mod(t * 2 + k, 3) < 0.6 ? C.green : '#d9e4ea'} stroke="#333" strokeWidth={4} /></g>)}
      <Pill x={1400} y={300} text="5 DÍAS SIN PARAR" color={C.cyan} size={30} s={pop(t, d * 0.55)} />
    </Stage>); };

S.resultado = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={lab} cam={{ keys: [[0, 960, 540, 1.2, 1], [2.6, 760, 520, 1.5, -2], [5.2, 1200, 560, 1.45, 2], [7.8, 960, 540, 1.2, -1], [d, 960, 540, 1.3, 0]] }}>
      <Counter x={620} y={560} t={t} t0={0.4} t1={d * 0.35} v1={5} size={120} color={C.cyan} suffix=" DÍAS" />
      <g opacity={ramp(t, d * 0.45, d * 0.55)}><Counter x={1320} y={560} t={t} t0={d * 0.45} t1={d * 0.8} v1={15} size={120} color={C.gold} suffix=" DÍAS" /></g>
      {[...Array(15)].map((_, k) => <circle key={k} cx={500 + k * 66} cy={800} r={18} fill={k < 15 * ramp(t, 0.4, d * 0.8) ? C.green : '#2a4a6a'} />)}
      <Pill x={960} y={220} text="CASI SIN ERRORES" color={C.green} size={32} s={pop(t, d * 0.3)} />
    </Stage>); };

S.crias = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={sea({ surface: 220, seabed: 980 })} cam={{ focus: (tt) => [lerp(600, 1300, tt / d), 560], zamt: 0.8 }}>
      <Dolphin x={lerp(400, 1500, t / d)} y={560} s={0.9} t={t} swim={0.8} eye={1} />
      <Dolphin x={lerp(380, 1480, t / d) + 40} y={680 + 10 * Math.sin(t * 3)} s={0.42} t={t} seed={5} swim={1.6} eye={1} color="#8aa6bc" />
      <Txt x={lerp(400, 1500, t / d)} y={300} size={60} color={C.gold} s={pop(t, 0.3)}>2005</Txt>
      <Pill x={lerp(400, 1500, t / d)} y={900} text="PRIMER MES: CASI SIN PAUSAS" color={C.cyan} size={28} s={pop(t, d * 0.5)} />
    </Stage>); };

S.crias_debate = (p) => { const { t } = p; const d = D(p); const ph = mod(t / 2.2, 1);
  return (
    <Stage {...p} env={sea({ surface: 240, seabed: 980 })} cam={{ keys: [[0, 960, 560, 1.2, -1], [2.6, 800, 500, 1.5, 2], [5.2, 1150, 560, 1.4, -2], [7.8, 960, 560, 1.2, 1], [d, 960, 560, 1.3, 0]] }}>
      <Dolphin x={700} y={600} s={0.9} t={t} swim={0.8} />
      <Dolphin x={760} y={lerp(720, 300, Math.sin(ph * Math.PI))} s={0.42} t={t} seed={5} swim={1.6} color="#8aa6bc" hole={ph > 0.45 && ph < 0.55 ? 1 : 0} />
      <g transform="translate(1450 520)"><Txt x={-120} y={0} size={90} color={C.green} s={pop(t, d * 0.55)}>?</Txt><Txt x={120} y={0} size={90} color={C.red} s={pop(t, d * 0.65)}>?</Txt></g>
      <Pill x={1450} y={300} text="DEBATE ABIERTO" color={C.purple} size={32} s={pop(t, d * 0.7)} />
    </Stage>); };

S.rem = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={night({ seabed: 980 })} light={0.85} cam={{ keys: [[0, 960, 540, 1.2, 1], [2.6, 760, 500, 1.5, -2], [5.2, 1200, 560, 1.4, 2], [d, 960, 540, 1.3, -1]] }}>
      <Dolphin x={760} y={640} s={0.9} t={t} swim={0.3} sleep={1} eye={0} />
      <g transform={`translate(1100 330) scale(${pop(t, 0.6)})`}><ellipse rx={260} ry={130} fill="#fff" opacity={0.9} /><circle cx={-200} cy={150} r={30} fill="#fff" opacity={0.9} /><circle cx={-250} cy={210} r={16} fill="#fff" opacity={0.9} /><Txt x={0} y={20} size={80} color="#3a4a8a">¿?</Txt></g>
      <Pill x={1400} y={760} text="CASI SIN FASE REM" color={C.purple} size={30} s={pop(t, d * 0.6)} />
    </Stage>); };

S.puente_otros = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={sky({ t })} cam={{ keys: [[0, 960, 560, 1.2, -2], [d * 0.5, 960, 560, 1.5, 2], [d, 980, 560, 1.8, -1]] }}>
      <Duck x={600} y={850} s={1} t={t} /><Frigate x={1200} y={300} s={0.7} t={t} /><Seal x={1400} y={900} s={0.5} t={t} />
      <Txt x={960} y={560} size={70} s={pop(t, d * 0.3)}>NO SON LOS ÚNICOS</Txt>
    </Stage>); };

S.focas = (p) => { const { t } = p; const d = D(p); const water = ramp(t, d * 0.4, d * 0.55);
  return (
    <Stage {...p} env={water < 0.5 ? sky({ t }) : sea({ surface: 300, seabed: 980 })} cam={{ keys: [[0, 960, 560, 1.2, -1], [2.6, 900, 600, 1.5, 2], [d * 0.45, 960, 560, 1.3, -2], [d * 0.45 + 2.6, 1000, 540, 1.5, 1], [d, 960, 560, 1.2, 0]] }}>
      {water < 0.5 ? <g><rect x={-400} y={780} width={2800} height={500} fill="#8a7a6a" /><Seal x={960} y={760} s={0.9} t={t} paddle={0} /><Brain2 x={960} y={330} s={0.45} t={t} sleepL={1} sleepR={1} /><Pill x={960} y={980} text="EN TIERRA: TODO EL CEREBRO" color={C.cyan} size={28} s={pop(t, 0.5)} /></g>
        : <g><Seal x={960} y={560} s={0.9} t={t} paddle={0.6} rot={-90} /><Brain2 x={1450} y={330} s={0.45} t={t} sleepL={0} sleepR={1} /><Pill x={960} y={900} text="EN EL AGUA: MODO DELFÍN" color={C.gold} size={28} s={pop(t, d * 0.55)} /></g>}
    </Stage>); };

S.patos = (p) => { const { t } = p; const d = D(p); const edge = ramp(t, d * 0.45, d * 0.6);
  return (
    <Stage {...p} env={{ custom: (cam) => <g><rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#bfe4ff" /><g transform={layerT(cam, 0.3)}><path d="M-300,620 Q400,500 1000,600 T2300,580 L2300,700 L-300,700Z" fill="#7fb06a" /></g><rect x={-400} y={680} width={2800} height={700} fill="#4f8fbf" /></g>, rays: false, fish: false }} cam={{ keys: [[0, 960, 640, 1.15, -1], [2.6, 560, 660, 1.6, 2], [5.2, 1360, 660, 1.6, -2], [d, 960, 640, 1.2, 1]] }}>
      {[0, 1, 2, 3].map((k) => <Duck key={k} x={600 + k * 240} y={700} s={0.9} t={t} seed={k} eye={k === 0 || k === 3 ? (edge > 0.5 ? 1 : 0) : 0} flip={k === 0} />)}
      {edge > 0.5 && <g><path d="M520,650 L250,560" stroke={C.gold} strokeWidth={6} strokeDasharray="14 10" /><path d="M1380,650 L1650,560" stroke={C.gold} strokeWidth={6} strokeDasharray="14 10" /></g>}
      <Pill x={960} y={250} text="LAS ORILLAS VIGILAN HACIA AFUERA" color={C.gold} size={28} s={pop(t, d * 0.55)} />
    </Stage>); };

S.fragatas = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={sky({ t })} cam={{ focus: (tt) => [960 + 200 * Math.sin(tt * 0.3), 480], zamt: 0.8 }}>
      <Frigate x={960 + 200 * Math.sin(t * 0.3)} y={420 + 40 * Math.sin(t * 0.8)} s={1.3} t={t} eye={mod(t, 2) < 1 ? 1 : 0} />
      <Brain2 x={1550} y={250} s={0.35} t={t} sleepL={mod(t, 2) < 1 ? 0 : 1} sleepR={mod(t, 2) < 1 ? 1 : 0} />
      <Counter x={640} y={330} t={t} t0={0.6} t1={d * 0.6} v1={42} size={80} color="#fff" suffix=" MIN/DÍA" />
      <Pill x={960} y={900} text="SIESTAS DE SEGUNDOS EN PLENO VUELO" color={C.cyan} size={28} s={pop(t, d * 0.35)} />
    </Stage>); };

S.ballenas = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={night({ surface: 120 })} light={0.85} cam={{ keys: [[0, 960, 500, 1.2, -1], [2.6, 800, 560, 1.5, 2], [5.2, 1150, 520, 1.4, -2], [d, 960, 540, 1.25, 1]] }}>
      {[0, 1, 2].map((k) => <SpermWhale key={k} x={600 + k * 380} y={560 + k * 30} s={0.55 - k * 0.05} t={t} seed={k} rot={-90} />)}
      <Clock x={1550} y={300} t={t} speed={1.5} label="10-15 MIN" />
      <Pill x={960} y={980} text="DUERMEN DE PIE, EN VERTICAL" color={C.purple} size={28} s={pop(t, d * 0.4)} />
    </Stage>); };

S.humanos = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={room({ t })} light={0.75} cam={{ keys: [[0, 960, 600, 1.2, 1], [2.6, 800, 560, 1.5, -2], [5.2, 1100, 600, 1.4, 2], [7.8, 960, 600, 1.2, -1], [d, 960, 600, 1.3, 0]] }}>
      <Bed x={900} y={760} s={1.3} t={t} hotel />
      <g opacity={ramp(t, d * 0.45, d * 0.6)}><Brain2 x={640} y={380} s={0.5} t={t} sleepL={0.4} sleepR={1} /></g>
      <Pill x={1400} y={300} text="¿TÚ TAMBIÉN?" color={C.gold} size={36} s={pop(t, d * 0.2)} />
    </Stage>); };

S.primera_noche = (p) => { const { t } = p; const d = D(p); const ring = ramp(t, d * 0.45, d * 0.5);
  return (
    <Stage {...p} env={room({ t, seed: 2 })} light={0.75} cam={{ keys: [[0, 960, 600, 1.2, -1], [2.6, 760, 560, 1.5, 2], [d * 0.45, 960, 600, 1.3, -2], [d * 0.45 + 2.4, 800, 560, 1.6, 1], [d, 960, 600, 1.25, 0]], shake: (tt) => Math.max(0, 1 - Math.abs(tt - d * 0.47) * 4) * 0.4 }}>
      <Bed x={960} y={780} s={1.3} t={t} hotel eyeL={ring > 0.5 && ring < 1 ? 1 : 0} />
      <Brain2 x={620} y={360} s={0.5} t={t} sleepL={0.3} sleepR={1} labels />
      {ring > 0 && [0, 1, 2].map((k) => <Ring key={k} x={1500} y={420} t={t} t0={d * 0.45 + k * 0.25} dur={0.9} maxR={160} color={C.gold} />)}
      <Txt x={1300} y={240} size={50} color={C.gold} s={pop(t, 0.4)}>2016</Txt>
      <Pill x={1300} y={980} text="EFECTO DE LA PRIMERA NOCHE" color={C.purple} size={28} s={pop(t, d * 0.2)} />
    </Stage>); };

S.evolucion = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={sea({ surface: 520 })} cam={{ focus: (tt) => [960, 560], zamt: 0.75 }}>
      <Dolphin x={560} y={760} s={0.6} t={t} swim={0.5} brain={[0, 1]} /><Seal x={1360} y={800} s={0.55} t={t} />
      <Duck x={760} y={500} s={0.8} t={t} eye={1} /><Frigate x={1250} y={250} s={0.6} t={t} />
      <Txt x={960} y={150} size={50} s={pop(t, d * 0.5)}>LA MISMA IDEA</Txt>
    </Stage>); };

S.cuidado = (p) => { const { t } = p; const d = D(p); const wake = ramp(t, d * 0.45, d * 0.6);
  return (
    <Stage {...p} env={sea({ surface: 460 })} cam={{ keys: [[0, 960, 480, 1.2, -1], [2.6, 800, 460, 1.5, 2], [d * 0.45, 1050, 480, 1.4, -2], [d, 960, 480, 1.25, 1]] }}>
      <Boat x={lerp(-200, 900, ramp(t, 0, d * 0.5))} y={430} s={0.9} t={t} />
      <Dolphin x={lerp(1200, 1700, ease(wake))} y={lerp(490, 620, wake)} rot={10 * wake} s={0.8} t={t} swim={0.1 + 2 * wake} eye={1} sleep={1 - wake} />
      <Pill x={1300} y={240} text="LOS DESPIERTA Y LOS AGOTA" color={C.red} size={28} s={pop(t, d * 0.6)} />
    </Stage>); };

S.respeto = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={sea({ surface: 520 })} cam={{ keys: [[0, 960, 500, 1.2, 1], [2.6, 1100, 520, 1.5, -2], [5.2, 800, 520, 1.4, 2], [d, 960, 520, 1.25, -1]] }}>
      <Person x={300} y={500} s={1.1} t={t} shirt="#16a085" arms={0.2} />
      <rect x={-400} y={500} width={600} height={80} fill="#c9a06a" />
      <Dolphin x={1300} y={545} s={0.6} t={t} swim={0.1} sleep={1} /><Dolphin x={1550} y={560} s={0.5} t={t} seed={4} swim={0.1} sleep={1} />
      <path d="M420,440 L1150,440" stroke="#fff" strokeWidth={5} strokeDasharray="20 16" opacity={pop(t, d * 0.4) > 0.1 ? 0.8 : 0} />
      <Pill x={800} y={300} text="MIRA DE LEJOS" color={C.green} size={36} s={pop(t, d * 0.45)} />
    </Stage>); };

S.resumen = (p) => { const { t } = p; const d = D(p);
  const tags = ['RESPIRA A PROPÓSITO', 'MEDIO CEREBRO', 'OJO CONTRARIO', 'SONAR ENCENDIDO'];
  return (
    <Stage {...p} env={night({ seabed: 980 })} cam={{ focus: (tt) => [960, 560], zamt: 0.7 }}>
      <Dolphin x={960 + 200 * Math.cos(t * 0.45)} y={560 + 60 * Math.sin(t * 0.9)} s={0.8} t={t} swim={0.6} flip={Math.sin(t * 0.45) > 0} brain={[0, 1]} />
      {tags.map((n, k) => { const a = k * 1.57 + t * 0.4; return <Pill key={k} x={960 + 560 * Math.cos(a)} y={540 + 300 * Math.sin(a)} text={n} size={28} color={[C.cyan, C.gold, C.red, C.green][k]} s={pop(t, d * (0.12 + k * 0.15))} />; })}
    </Stage>); };

S.pregunta = (p) => { const { t } = p; const d = D(p);
  return (
    <Stage {...p} env={room({ t, seed: 3 })} light={0.8} cam={{ keys: [[0, 960, 600, 1.2, -1], [d * 0.5, 960, 580, 1.5, 2], [d, 960, 560, 1.8, -1]] }}>
      <Bed x={960} y={760} s={1.3} t={t} eyeL={1} eyeR={1} />
      <Txt x={960} y={330} size={60} color={C.gold} s={pop(t, d * 0.3)}>¿PODRÍAS DORMIR?</Txt>
    </Stage>); };

S.cierre = (p) => { const { t } = p; const d = D(p); const tc = d * 0.3;
  const pressed = t > tc;
  const ring = t > d * 0.4 ? 18 * Math.sin((t - d * 0.4) * 22) * Math.exp(-(t - d * 0.4) * 1.5) : 0;
  return (
    <Stage {...p} env={sea({ surface: 180, seabed: 980 })} cam={{ keys: [[0, 960, 520, 1.2, -2], [2.5, 1000, 470, 1.45, 1], [5, 960, 560, 1.1, -1], [d, 960, 560, 1.25, 0]] }}>
      <Dolphin x={lerp(300, 1600, t / d)} y={830} s={0.5} t={t} swim={1} />
      <g transform={`translate(860 450) scale(${pressed ? 1 - 0.08 * Math.max(0, 1 - (t - tc) * 6) : pop(t, 0.2)})`}><rect x={-270} y={-70} width={540} height={140} rx={34} fill={pressed ? '#5a5a5a' : '#e61e28'} /><text x={0} y={22} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={58} fill="#fff">{pressed ? 'SUSCRITO ✓' : 'SUSCRÍBETE'}</text></g>
      <g transform={`translate(1240 450) rotate(${ring})`}><path d="M-40,30 C-40,-40 -25,-60 0,-60 C25,-60 40,-40 40,30 L50,40 L-50,40Z" fill={C.gold} /><circle cy={52} r={11} fill={C.gold} /></g>
      <g transform={`translate(${lerp(1500, 1010, ease(ramp(t, 0.5, tc)))} ${lerp(900, 460, ease(ramp(t, 0.5, tc)))})`}><path d="M0,0 L0,60 L16,46 L28,72 L38,66 L26,42 L46,40Z" fill="#fff" stroke="#000" strokeWidth={3} /></g>
      <Txt x={960} y={270} size={50} color={C.gold} s={pop(t, d * 0.5)}>¿QUÉ ANIMAL SIGUE?</Txt>
    </Stage>); };

export const ORDER19 = ['apertura', 'titulo', 'problema', 'espiraculo', 'voluntario', 'ahogarse', 'solucion', 'hemisferios', 'ondas', 'ojo', 'turnos', 'horas', 'puente_como', 'tronco', 'nadando', 'grupo', 'ojo_grupo', 'tiburon', 'frio', 'sonar', 'experimento', 'resultado', 'crias', 'crias_debate', 'rem', 'puente_otros', 'focas', 'patos', 'fragatas', 'ballenas', 'humanos', 'primera_noche', 'evolucion', 'cuidado', 'respeto', 'resumen', 'pregunta', 'cierre'];
export const S19 = S;
