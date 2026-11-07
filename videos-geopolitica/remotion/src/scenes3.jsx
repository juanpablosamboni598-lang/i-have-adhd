import React from 'react';
import { C, FONT, cl, lerp, ramp, ease, eo, seg, pop, mod, rng, pathPts, Pill, Ring, Counter } from './lib.jsx';
import { Stage } from './stage.jsx';
import { Shark, Seal, Fish, Surfer, Shadow, Splash, BubbleTrail } from './actors.jsx';

const Txt = ({ x, y, s = 1, size = 60, color = '#fff', children, rot = 0, op = 1 }) => (s <= 0.01 ? null :
  <text transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={size} fill={color} stroke="#000" strokeWidth={size / 9} paintOrder="stroke" opacity={op}>{children}</text>);
const Land = ({ d, label, lx, ly, t }) => <g><path d={d} fill="#c9a86a" stroke="#8b6e3c" strokeWidth={5} /><path d={d} fill="none" stroke="#e8f7ff" strokeWidth={12} opacity={0.25 + 0.15 * Math.sin(t * 2)} />{label && <Txt x={lx} y={ly} size={40}>{label}</Txt>}</g>;
const MapWaves = ({ t, n = 40, seed = 1 }) => { const R = rng(seed); return <g>{[...Array(n)].map((_, k) => { const x = mod(R() * 2400 + t * 20, 2400) - 240, y = R() * 1200; return <path key={k} d={`M${x},${y} q20,-8 40,0 q20,8 40,0`} stroke="#9fd4f5" strokeWidth={3} fill="none" opacity={0.35} />; })}</g>; };

// 32 · No siempre gana: la foca esquiva
const s32 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const a1 = d * 0.3, a2 = d * 0.55, a3 = d * 0.75;
  const seal = t < a1 ? [900, 400, 0] : t < a2 ? [lerp(900, 1250, seg(t, a1, a1 + 0.5)), lerp(400, 300, seg(t, a1, a1 + 0.5)), -360 * seg(t, a1, a1 + 0.6)] : [lerp(1250, 700, seg(t, a2, a2 + 0.6)), lerp(300, 380, seg(t, a2, a2 + 0.6)), -360 - 360 * seg(t, a2, a2 + 0.6)];
  const shk = t < a1 ? [lerp(300, 820, ramp(t, 0.5, a1)), lerp(800, 470, ramp(t, 0.5, a1)), -30] : t < a2 ? [lerp(820, 1150, ramp(t, a1, a2)), lerp(470, 380, ramp(t, a1, a2)), -10] : [lerp(1150, 1500, ramp(t, a2, d)), lerp(380, 520, ramp(t, a2, d)), 20];
  return (
    <Stage {...p} env={{ theme: 'blue', surface: 160 }} cam={{ focus: (tt) => [1000, 420], zamt: 0.8 }}>
      <Seal x={seal[0]} y={seal[1]} rot={seal[2]} s={0.9} t={t} paddle={3} />
      <Shark x={shk[0]} y={shk[1]} rot={shk[2]} s={0.85} t={t} seed={30} speed={1.6} mouth={0.6 + 0.4 * Math.sin(t * 8)} />
      {[a1, a2].map((a, k) => <Ring key={k} x={k ? 1250 : 900} y={k ? 300 : 400} t={t} t0={a} dur={0.6} maxR={160} color="#fff" />)}
      <g transform={`translate(1500 760)`}>
        <circle r={110} fill="#0f2240" stroke="#fff" strokeWidth={4} />
        <path d={`M0,0 L0,-100 A100,100 0 ${eo(ramp(t, a3 - 0.6, a3 + 0.6)) > 0.5 ? 1 : 0},1 ${100 * Math.sin(eo(ramp(t, a3 - 0.6, a3 + 0.6)) * 6.28 * 0.6)},${-100 * Math.cos(eo(ramp(t, a3 - 0.6, a3 + 0.6)) * 6.28 * 0.6)} Z`} fill={C.red} />
        <Txt x={0} y={170} size={30} s={pop(t, a3)}>SIN ÉXITO</Txt>
      </g>
      <Txt x={760} y={720} size={150} color={C.red} rot={-8} s={pop(t, a3, 0.35)}>¡FALLÓ!</Txt>
    </Stage>
  );
};

// 33 · Muerde y espera
const s33 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const tb = d * 0.25;
  const ang = t > tb + 0.6 ? (t - tb - 0.6) * 0.9 : 0;
  const shx = t < tb ? lerp(200, 880, ramp(t, 0, tb)) : 1100 + Math.cos(ang + Math.PI) * 480 * ramp(t, tb, tb + 1);
  const shy = t < tb ? 560 : 560 + Math.sin(ang + Math.PI) * 240 * ramp(t, tb, tb + 1);
  const weak = ramp(t, tb, d);
  return (
    <Stage {...p} env={{ theme: 'blue', seabed: 950 }} light={(tt) => 1 - 0.15 * weak} cam={{ keys: [[0, 700, 560, 1.4, 2], [tb, 950, 560, 1.7, -2], [tb + 2.4, 1100, 560, 1.15, 1], [tb + 4.8, 1150, 520, 1.45, -1], [d, 1100, 560, 1.25, 1.5]], shake: (tt) => Math.max(0, 1 - Math.abs(tt - tb) * 3) }}>
      <Seal x={1150} y={560 + weak * 40} s={1.6} t={t} seed={5} paddle={lerp(1, 0.2, weak)} color="#6d5b49" />
      {t > tb && [...Array(8)].map((_, k) => { const u = mod(t * 0.3 + k / 8, 1); return <circle key={k} cx={1080 + 30 * Math.sin(k + t)} cy={590 - u * 200} r={6 + u * 14} fill="#c0182a" opacity={0.3 * (1 - u)} />; })}
      <Shark x={shx} y={shy} s={0.8} rot={t > tb ? (ang * 180) / Math.PI + 90 : 0} t={t} seed={31} speed={1} mouth={t < tb ? ramp(t, tb - 0.5, tb) : 0} />
      <g transform="translate(560 260)"><circle r={80} fill="#0f2240" stroke="#fff" strokeWidth={6} /><line x1={0} y1={0} x2={60 * Math.sin(t * 2)} y2={-60 * Math.cos(t * 2)} stroke={C.gold} strokeWidth={8} strokeLinecap="round" /><line x1={0} y1={0} x2={30 * Math.sin(t * 0.2)} y2={-30 * Math.cos(t * 0.2)} stroke="#fff" strokeWidth={8} strokeLinecap="round" /></g>
      <Pill x={560} y={390} text="ESPERA" size={30} s={pop(t, d * 0.55)} />
    </Stage>
  );
};

// 34 · Marca satelital: Nicole 2003
const s34 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const tag = ramp(t, d * 0.35, d * 0.5);
  const sat = [lerp(200, 1700, t / d), 120 + 30 * Math.sin(t)];
  const ping = d * 0.6;
  return (
    <Stage {...p} env={{ theme: 'blue', surface: 330 }} cam={{ keys: [[0, 900, 560, 1.2, -1], [2.6, 960, 560, 1.7, 2], [5.2, 980, 420, 1.3, -2], [7.8, 1100, 300, 1.15, 1], [d, 1000, 480, 1.4, -1]] }}>
      <rect x={-600} y={-400} width={3200} height={720} fill="#06142c" opacity={0.6} />
      {[...Array(40)].map((_, k) => <circle key={k} cx={(k * 211) % 2000} cy={(k * 67) % 300 - 80} r={2} fill="#fff" opacity={0.5 + 0.5 * Math.sin(t * 3 + k)} />)}
      <g transform={`translate(${sat[0]} ${sat[1]}) rotate(${10 * Math.sin(t)})`}><rect x={-30} y={-20} width={60} height={40} fill="#ccc" stroke="#555" strokeWidth={3} /><rect x={-120} y={-12} width={80} height={24} fill="#2e6bd1" /><rect x={40} y={-12} width={80} height={24} fill="#2e6bd1" /></g>
      <g transform="translate(700 320)"><path d="M-160,0 L160,0 L120,60 L-120,60Z" fill="#e67e22" stroke="#6e3a0a" strokeWidth={4} /><rect x={-60} y={-60} width={90} height={60} fill="#fff" stroke="#555" strokeWidth={3} />
        <path d={`M100,0 L${lerp(100, 260, tag)},${lerp(0, 260, tag)}`} stroke="#8b5a2b" strokeWidth={8} /></g>
      <Shark x={960} y={620} s={0.95} t={t} seed={32} speed={0.6} />
      <g transform={`translate(${lerp(960, 945, tag)} ${lerp(420, 455, tag)})`} opacity={ramp(t, d * 0.4, d * 0.45)}><rect x={-18} y={-10} width={36} height={20} rx={5} fill={C.gold} stroke="#000" strokeWidth={2} /><line x1={0} y1={-10} x2={0} y2={-40} stroke="#000" strokeWidth={3} /></g>
      {[0, 1, 2, 3].map((k) => <Ring key={k} x={945} y={430} t={t} t0={ping + k * 0.5} dur={1.2} maxR={300} color={C.gold} />)}
      <line x1={945} y1={420} x2={sat[0]} y2={sat[1]} stroke={C.gold} strokeWidth={4} strokeDasharray="14 10" strokeDashoffset={-t * 80} opacity={ramp(t, ping, ping + 0.3)} />
      <Pill x={960} y={860} text="NICOLE · 2003" size={44} s={pop(t, d * 0.5)} />
    </Stage>
  );
};

// 35 · Ruta Sudáfrica → Australia → regreso
const s35 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const a = [620, 700], b = [1500, 640];
  const u = ramp(t, d * 0.1, d * 0.9);
  const leg = u < 0.5 ? u * 2 : (u - 0.5) * 2;
  const P = (v, up) => { const x = up ? lerp(a[0], b[0], v) : lerp(b[0], a[0], v); const y = lerp(up ? a[1] : b[1], up ? b[1] : a[1], v) + (up ? 160 : 260) * Math.sin(v * Math.PI); return [x, y]; };
  const pts1 = [...Array(41)].map((_, k) => P(Math.min(k / 40, u < 0.5 ? leg : 1), true));
  const pts2 = u > 0.5 ? [...Array(41)].map((_, k) => P(Math.min(k / 40, leg), false)) : [];
  const pos = u < 0.5 ? P(leg, true) : P(leg, false);
  return (
    <Stage {...p} env={{ theme: 'map', rays: false, ridges: false, fish: false }} cam={{ focus: () => [pos[0], pos[1] - 40], zamt: 0.5, zadd: 0.15 }}>
      <MapWaves t={t} seed={35} />
      <Land t={t} d="M300,-200 L800,-200 C860,100 820,300 760,420 C700,560 680,680 620,740 C560,700 520,560 470,420 C380,300 300,200 300,-200Z" label="ÁFRICA" lx={560} ly={200} />
      <Land t={t} d="M1380,520 C1450,470 1600,470 1700,520 C1760,600 1720,720 1600,760 C1500,780 1420,720 1380,640Z" label="AUSTRALIA" lx={1560} ly={620} />
      <Land t={t} d="M-200,1000 C400,960 1400,960 2200,1000 L2200,1300 L-200,1300Z" label="" />
      <path d={pathPts(pts1)} stroke={C.gold} strokeWidth={8} fill="none" strokeDasharray="22 14" />
      {pts2.length > 0 && <path d={pathPts(pts2)} stroke={C.cyan} strokeWidth={8} fill="none" strokeDasharray="22 14" />}
      <Shark x={pos[0]} y={pos[1]} s={0.22} t={t} seed={33} speed={1.4} flip={u > 0.5} />
      <g transform={`translate(${pos[0]} ${pos[1] - 120})`}><Counter x={0} y={0} t={t} t0={d * 0.1} t1={d * 0.9} v1={20000} size={58} color={C.gold} suffix=" km" /></g>
      <Pill x={1000} y={170} text={`MES ${Math.min(9, Math.floor(u * 9) + 1)} DE 9`} color={C.cyan} size={34} s={pop(t, 0.6)} />
    </Stage>
  );
};

// 36 · El café del tiburón blanco
const s36 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const z = [980, 520];
  const R = rng(36);
  const sharks = [...Array(12)].map((_, k) => { const from = k % 2 ? [200 + R() * 150, 200 + R() * 700] : [1650 + R() * 100, 600 + R() * 300]; const u = ease(ramp(t, d * 0.15 + k * 0.15, d * 0.6 + k * 0.1)); const x = lerp(from[0], z[0] + 90 * Math.cos(t + k), u), y = lerp(from[1], z[1] + 60 * Math.sin(t + k), u); return <Shark key={k} x={x} y={y} s={0.12} t={t} seed={40 + k} speed={1.2} flip={from[0] > z[0] && u < 0.95} />; });
  return (
    <Stage {...p} env={{ theme: 'map', rays: false, ridges: false, fish: false }} cam={{ keys: [[0, 700, 520, 1.0, 0], [2.6, 600, 560, 1.3, -2], [5.2, 980, 520, 1.15, 1], [7.8, 980, 520, 1.8, -1], [10.4, 1050, 560, 1.5, 2], [d, 980, 520, 1.25, 0]] }}>
      <MapWaves t={t} seed={36} />
      <Land t={t} d="M-300,-200 L380,-200 C400,100 340,300 420,460 C470,560 380,700 300,900 L-300,1300Z" label="MÉXICO" lx={120} ly={300} />
      {[[1600, 640, 14], [1640, 660, 10], [1670, 690, 18], [1720, 720, 22]].map(([x, y, r], k) => <circle key={k} cx={x} cy={y} r={r} fill="#c9a86a" stroke="#8b6e3c" strokeWidth={3} />)}
      <Txt x={1680} y={790} size={36}>HAWÁI</Txt>
      <circle cx={z[0]} cy={z[1]} r={170 + 10 * Math.sin(t * 2)} fill={C.gold} opacity={0.12} stroke={C.gold} strokeWidth={5} strokeDasharray="20 12" strokeDashoffset={t * 40} />
      {sharks}
      <g transform={`translate(${z[0]} ${z[1] - 260}) scale(${pop(t, d * 0.65)})`}>
        <path d="M-50,-40 L50,-40 L40,40 L-40,40Z" fill="#fff" stroke="#333" strokeWidth={4} /><path d="M50,-20 C80,-20 80,20 45,20" stroke="#333" strokeWidth={6} fill="none" />
        {[0, 1, 2].map((k) => <path key={k} d={`M${-20 + k * 20},-50 c-10,-20 10,-30 0,-${50 + 10 * Math.sin(t * 3 + k)}`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.7} />)}
      </g>
      <Pill x={z[0]} y={z[1] + 250} text="«CAFÉ DEL TIBURÓN BLANCO»" size={36} s={pop(t, d * 0.7)} />
    </Stage>
  );
};

// 37 · Misterio en las profundidades
const s37 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const depth = Math.round(lerp(200, 900, t / d));
  const R = rng(37);
  return (
    <Stage {...p} env={{ theme: 'dark' }} light={(tt) => 0.9 - 0.3 * (tt / d)} cam={{ focus: (tt) => [960, lerp(400, 900, tt / d)], zamt: 0.7 }}
      hud={() => <g transform="translate(1720 300)"><rect x={-70} y={-40} width={140} height={500} rx={20} fill="#0f2240" stroke="#fff" strokeWidth={3} /><rect x={-20} y={-20 + 440 * (t / d)} width={40} height={20} fill={C.cyan} /><text x={0} y={510} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#fff">{depth} m</text></g>}>
      <Shark x={lerp(700, 1150, t / d)} y={lerp(450, 1000, t / d)} s={0.75} rot={22} t={t} seed={34} speed={0.6} opacity={1 - 0.6 * (t / d)} />
      {[...Array(40)].map((_, k) => <circle key={k} cx={R() * 1920} cy={300 + R() * 1000} r={3 + R() * 4} fill={k % 2 ? '#5ff' : '#9f9'} opacity={0.3 + 0.7 * Math.abs(Math.sin(t * 2 + k))} filter="url(#glow)" />)}
      {[...Array(6)].map((_, k) => <Txt key={k} x={300 + k * 260} y={lerp(1000, 400, ramp(t, k * 0.8, k * 0.8 + 5)) + 30 * Math.sin(t + k)} size={70 + (k % 3) * 30} s={pop(t, k * 0.8)} rot={10 * Math.sin(t + k)} op={0.6}>?</Txt>)}
      {[0, 1, 2, 3].map((k) => <Ring key={k} x={960} y={lerp(450, 950, t / d)} t={t} t0={1 + k * 2} dur={1.6} maxR={600} color={C.cyan} w={3} />)}
      <Pill x={960} y={lerp(260, 700, t / d)} text="¿COMIDA O PAREJA?" color={C.cyan} size={36} s={pop(t, d * 0.4)} />
    </Stage>
  );
};

// 38 · Llegan las orcas
const s38 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const fear = ramp(t, d * 0.4, d * 0.7);
  return (
    <Stage {...p} env={{ theme: 'deep' }} light={(tt) => 1 - 0.35 * ramp(tt, 0.5, d * 0.6)} cam={{ keys: [[0, 800, 560, 1.4, -2], [2.2, 1100, 560, 1.15, 2], [4, 700, 560, 1.6, -1], [d, 800, 560, 1.3, 1]], shake: (tt) => Math.max(0, 1 - Math.abs(tt - d * 0.6) * 3) }}>
      <rect x={-600} y={-400} width={3200} height={2000} fill="#4a0000" opacity={0.18 * fear} />
      <Shark x={lerp(700, 400, fear)} y={600} s={0.8} t={t} seed={35} speed={1 + fear * 2} flip={fear > 0.5} />
      <Shark kind="orca" x={lerp(2200, 1250, eo(ramp(t, 0.3, d * 0.6)))} y={420} s={0.95} t={t} seed={36} speed={0.8} flip />
      <Shark kind="orca" x={lerp(2400, 1450, eo(ramp(t, 0.6, d * 0.7)))} y={760} s={0.85} t={t} seed={37} speed={0.8} flip />
      <Txt x={960} y={220} size={130} color={C.red} s={pop(t, d * 0.6, 0.3)}>ORCAS</Txt>
    </Stage>
  );
};

// 39 · Orcas cazan tiburones: el hígado
const s39 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const flip = seg(t, d * 0.35, d * 0.6);
  const liv = ramp(t, d * 0.6, d * 0.7);
  return (
    <Stage {...p} env={{ theme: 'deep' }} cam={{ keys: [[0, 960, 560, 1.1, 0], [2.6, 800, 540, 1.4, -2], [5.2, 960, 560, 1.7, 2], [7.8, 960, 560, 2.0, -1], [10.4, 1000, 560, 1.6, 1], [d, 960, 560, 1.3, 0]] }}>
      <Txt x={960} y={180} size={60} color="#fff" s={pop(t, 0.6)}>2017</Txt>
      <Shark kind="orca" x={lerp(-300, 620, eo(ramp(t, 0, d * 0.35)))} y={430 + 20 * Math.sin(t * 2)} s={0.8} rot={15} t={t} seed={38} speed={1.2} />
      <Shark kind="orca" x={lerp(2200, 1320, eo(ramp(t, 0.4, d * 0.4)))} y={700 + 20 * Math.sin(t * 2 + 1)} s={0.8} rot={-15} t={t} seed={39} speed={1.2} flip />
      <g transform={`translate(960 560) rotate(${flip * 180}) translate(-960 -560)`}><Shark x={960} y={560} s={0.75} t={t} seed={40} speed={1.5 - flip} /></g>
      <g transform={`translate(950 ${560 + 10}) scale(${liv})`}>
        <path d="M-120,-20 C-90,-70 40,-70 110,-40 C140,-10 110,40 40,50 C-40,60 -110,30 -120,-20Z" fill="#8b3a3a" stroke={C.gold} strokeWidth={6} />
        {[...Array(10)].map((_, k) => { const a = t * 2 + k * 0.63; return <circle key={k} cx={Math.cos(a) * (150 + 20 * Math.sin(t * 3 + k))} cy={Math.sin(a) * 90} r={6} fill={C.gold} filter="url(#glow)" />; })}
      </g>
      <Pill x={960} y={860} text="HÍGADO: PURA ENERGÍA" s={pop(t, d * 0.68)} />
    </Stage>
  );
};

// 40 · Los tiburones abandonan la zona (mapa)
const s40 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const R = rng(40);
  const go = ramp(t, d * 0.25, d * 0.75);
  const dots = [...Array(26)].map((_, k) => { const x0 = 900 + (R() - 0.5) * 500, y0 = 640 + (R() - 0.5) * 260, a = Math.atan2(y0 - 640, x0 - 900) + (R() - 0.5) * 0.5; const g = ease(ramp(t, d * 0.25 + R() * d * 0.2, d * 0.75)); return <Shark key={k} x={x0 + Math.cos(a) * 1100 * g} y={y0 + Math.sin(a) * 700 * g} s={0.1} rot={(a * 180) / Math.PI} t={t} seed={60 + k} speed={1.5} />; });
  return (
    <Stage {...p} env={{ theme: 'map', rays: false, ridges: false, fish: false }} cam={{ keys: [[0, 900, 600, 1.6, 1], [2.5, 900, 600, 1.3, -2], [5, 900, 580, 1.0, 1], [7.5, 1000, 600, 1.25, -1], [d, 900, 620, 1.45, 2]] }}>
      <MapWaves t={t} seed={40} />
      <Land t={t} d="M-300,-200 L2200,-200 L2200,320 C1700,380 1400,300 1100,420 C900,500 700,420 400,460 C200,490 0,430 -300,460Z" label="SUDÁFRICA" lx={900} ly={200} />
      <circle cx={900} cy={640} r={330} fill={C.red} opacity={0.25 * (1 - go)} />
      {dots}
      <Txt x={900} y={660} size={56} s={pop(t, d * 0.75)} color={C.soft}>ZONA VACÍA</Txt>
      <Pill x={1500} y={900} text={`MES ${Math.min(6, Math.floor(go * 6) + 1)}`} color={C.cyan} size={34} s={pop(t, d * 0.3)} />
    </Stage>
  );
};

// 41 · Riesgo real: barras con íconos animados
const s41 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const rows = [['RAYOS', 0.85, C.gold, 0.4], ['ACCIDENTES EN CASA', 1, '#ff9f43', 0.6], ['TIBURONES', 0.025, C.red, 0.8]];
  return (
    <Stage {...p} env={{ theme: 'blue', rays: true }} cam={{ keys: [[0, 960, 540, 1.1, 0], [2.6, 960, 560, 1.3, -2], [5.2, 800, 420, 1.5, 1], [7.8, 900, 600, 1.4, -1], [10, 600, 760, 1.7, 2], [d, 960, 560, 1.2, 0]] }}>
      <Shark x={lerp(2300, -400, t / d)} y={250} s={0.4} t={t} seed={41} speed={0.6} flip opacity={0.6} />
      {rows.map(([n, f, c, fr], k) => {
        const g = eo(ramp(t, d * fr - 0.3, d * fr + 0.7)); const y = 380 + k * 200;
        return <g key={k}>
          <Txt x={420} y={y - 30} size={40} s={pop(t, d * fr - 0.3)}>{n}</Txt>
          <rect x={300} y={y} width={Math.max(14, 1250 * f) * g} height={80} rx={14} fill={c} />
          <g transform={`translate(${260} ${y + 40}) scale(${pop(t, d * fr - 0.3)})`}>
            {k === 0 && <path d="M8,-40 L-16,4 L2,4 L-8,40 L20,-6 L2,-6Z" fill={C.gold} opacity={Math.sin(t * 9) > 0 ? 1 : 0.5} />}
            {k === 1 && <g><path d="M-30,10 L0,-25 L30,10 L30,40 L-30,40Z" fill="#ff9f43" /><line x1={-40} y1={40} x2={-40 + 30 * Math.sin(t * 2)} y2={-20} stroke="#fff" strokeWidth={5} /></g>}
            {k === 2 && <path d="M-30,10 C-10,-30 20,-30 30,10Z" fill={C.red} transform={`rotate(${10 * Math.sin(t * 4)})`} />}
          </g>
        </g>;
      })}
      <Txt x={1500} y={930} size={22} color={C.soft}>Ilustrativo</Txt>
    </Stage>
  );
};

// 42 · Surfista vs foca: siluetas desde abajo
const s42 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const cmp = ramp(t, d * 0.45, d * 0.6);
  return (
    <Stage {...p} env={{ theme: 'light', surface: 200, fish: false }} lightX={() => 900 + 200 * Math.sin(t * 0.4)} cam={{ keys: [[0, 700, 600, 1.3, 2], [2.5, 750, 360, 1.6, -2], [4.8, 1100, 330, 1.4, 1], [7, 960, 330, 1.75, -1], [d, 960, 450, 1.25, 1]] }}>
      <Surfer x={lerp(500, 700, t / d)} y={220} s={1.2} t={t} />
      <Seal x={lerp(1200, 1350, t / d)} y={245} s={1.3} t={t} silhouette />
      <g opacity={cmp}><ellipse cx={lerp(500, 700, t / d)} cy={225} rx={230} ry={50} fill="none" stroke={C.gold} strokeWidth={6} strokeDasharray="18 10" strokeDashoffset={t * 40} />
        <ellipse cx={lerp(1200, 1350, t / d)} cy={245} rx={230} ry={60} fill="none" stroke={C.gold} strokeWidth={6} strokeDasharray="18 10" strokeDashoffset={t * 40} /></g>
      <Txt x={(lerp(500, 700, t / d) + lerp(1200, 1350, t / d)) / 2} y={260} size={120} color={C.gold} s={pop(t, d * 0.55)}>≈</Txt>
      <rect x={-600} y={760} width={3200} height={800} fill="#020a18" opacity={0.6} />
      <Shark x={lerp(500, 900, t / d)} y={880} s={0.8} rot={-25} t={t} seed={42} speed={0.6} tint="#2a3846" />
      <Txt x={1150} y={720} size={90} s={pop(t, d * 0.7)}>?</Txt>
    </Stage>
  );
};

// 43 · Los humanos: pesca y aletas
const s43 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const bx = lerp(-200, 900, ramp(t, 0, d * 0.5));
  const pull = ramp(t, d * 0.55, d * 0.9);
  return (
    <Stage {...p} env={{ theme: 'blue', surface: 260 }} light={(tt) => 1 - 0.25 * ramp(tt, d * 0.5, d)} cam={{ keys: [[0, 700, 420, 1.3, -1], [2.6, 900, 380, 1.15, 2], [5.2, 1000, 500, 1.5, -2], [7.8, 1100, 600, 1.3, 1], [10.4, 1200, 520, 1.6, -1], [d, 1100, 500, 1.25, 0]] }}>
      <g transform={`translate(${bx} ${245 + 6 * Math.sin(t * 2)}) rotate(${2 * Math.sin(t * 1.5)})`}>
        <path d="M-220,0 L220,0 L170,70 L-170,70Z" fill="#c0392b" stroke="#5a1a14" strokeWidth={5} /><rect x={-120} y={-70} width={120} height={70} fill="#fff" stroke="#555" strokeWidth={3} /><line x1={60} y1={0} x2={60} y2={-150} stroke="#555" strokeWidth={6} />
        <path d={`M200,30 L${700 - bx + 300},${700}`} stroke="#ddd" strokeWidth={3} />
      </g>
      {[...Array(5)].map((_, k) => { const x = 900 + k * 180, y = lerp(820, 420 + k * 30, pull); return <g key={k}><line x1={x} y1={300} x2={x} y2={y} stroke="#ddd" strokeWidth={2} /><Shark x={x} y={y + 40} s={0.18} rot={-80} t={t} seed={70 + k} speed={2} /></g>; })}
      <g transform="translate(1320 820)"><Counter x={0} y={0} t={t} t0={d * 0.25} t1={d * 0.85} v1={70000000} size={84} color={C.red} /><Txt x={0} y={70} size={36} s={pop(t, d * 0.4)}>TIBURONES AL AÑO</Txt><Txt x={0} y={115} size={22} color={C.soft} s={pop(t, d * 0.5)}>estimación: decenas de millones</Txt></g>
    </Stage>
  );
};

// 44 · Vida lenta: línea de tiempo y crías a los 30
const s44 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const yr = 70 * ramp(t, 0.6, d * 0.9);
  const x = lerp(260, 1660, yr / 70);
  return (
    <Stage {...p} env={{ theme: 'blue', seabed: 950 }} cam={{ focus: () => [x, 560], zamt: 0.7 }}>
      <line x1={260} y1={700} x2={1660} y2={700} stroke="#fff" strokeWidth={8} />
      {[0, 10, 20, 30, 40, 50, 60, 70].map((v) => <g key={v}><line x1={lerp(260, 1660, v / 70)} y1={680} x2={lerp(260, 1660, v / 70)} y2={720} stroke="#fff" strokeWidth={5} /><Txt x={lerp(260, 1660, v / 70)} y={770} size={34} color={yr >= v ? C.gold : C.soft}>{v}</Txt></g>)}
      <Shark x={x} y={560} s={0.25 + 0.55 * (yr / 70)} t={t} seed={43} speed={0.8} />
      {yr > 30 && [0, 1, 2].map((k) => <Shark key={k} x={lerp(260, 1660, 30 / 70) + 60 + k * 70 + 20 * Math.sin(t * 2 + k)} y={460 + k * 30} s={0.1 * pop(t, d * 0.55 + k * 0.2)} t={t} seed={80 + k} speed={1.5} />)}
      <Pill x={lerp(260, 1660, 30 / 70)} y={360} text="≈ 30 AÑOS: PRIMERAS CRÍAS" s={pop(t, d * 0.5)} size={32} />
      <Pill x={1500} y={300} text="VIVE ≈ 70 AÑOS" color={C.cyan} s={pop(t, d * 0.85)} size={32} />
      <Txt x={x} y={420} size={44} color="#fff">{Math.round(yr)} años</Txt>
    </Stage>
  );
};

// 45 · Resumen: diseño perfecto (partes que se encienden)
const s45 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const a = t * 0.5;
  const shx = 960 + 420 * Math.cos(a), shy = 560 + 160 * Math.sin(a);
  const tags = ['OLFATO', 'OÍDO', 'LÍNEA LATERAL', 'VISTA', 'ELECTRICIDAD', '300 DIENTES'];
  return (
    <Stage {...p} env={{ theme: 'blue', seabed: 960 }} cam={{ focus: (tt) => [960 + 420 * Math.cos(tt * 0.5), 560 + 160 * Math.sin(tt * 0.5)], zamt: 0.7 }}>
      {(() => { const h = Math.atan2(160 * Math.cos(a), -420 * Math.sin(a)); const left = Math.cos(h) < 0; const deg = (h * 180) / Math.PI;
        return <Shark x={shx} y={shy} rot={left ? deg - 180 : deg} flip={left} s={0.85} t={t} seed={44} speed={1.1}
          lateralGlow={t > d * 0.45 ? t : 0} ampGlow={ramp(t, d * 0.65, d * 0.75)} glowParts={{ nose: t > d * 0.25, eye: t > d * 0.55 }} mouth={t > d * 0.8 ? 0.6 : 0} />; })()}
      {tags.map((n, k) => { const s = pop(t, d * (0.2 + k * 0.11)); const b = k * 1.05 + t * 0.3; return <Pill key={k} x={shx + 470 * Math.cos(b)} y={shy + 250 * Math.sin(b)} text={n} size={28} s={s} />; })}
      <Shadow x={shx} groundY={960} y={shy} size={300} />
    </Stage>
  );
};

// 46 · Cierre: latido, ondas, salto al atardecer
const s46 = (p) => {
  const { t } = p; const d = p.frames / 30; const tb = d * 0.58;
  const u = cl((t - tb + 1) / 2.6);
  const x = lerp(700, 1200, u), y = 640 - 560 * Math.sin(u * Math.PI) + 120, rot = lerp(-65, 55, u);
  return (
    <Stage {...p} env={{ custom: () => <g><defs><linearGradient id="sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff9a5a" /><stop offset="0.45" stopColor="#ffcf7a" /><stop offset="0.46" stopColor="#1d5d8f" /><stop offset="1" stopColor="#03142a" /></linearGradient></defs><rect x={-200} y={-200} width={2400} height={1500} fill="url(#sun)" /></g>, surface: 620, fish: false }}
      lightX={() => 1300} cam={{ keys: [[0, 600, 760, 1.5, 2], [2.6, 800, 700, 1.2, -2], [5.2, 960, 560, 1.1, 1], [tb + 0.5, 1000, 420, 1.35, -2], [d, 960, 520, 1.15, 0]], shake: (tt) => Math.max(0, 1 - Math.abs(tt - tb - 1.3) * 3) * 0.5 }}>
      <circle cx={1300} cy={420} r={130} fill="#fff2c4" opacity={0.85} />
      <Fish x={480} y={830} s={1.4} t={t} seed={13} color="#ffb347" />
      {[0, 1, 2, 3].map((k) => <Ring key={k} x={480} y={830} t={t} t0={0.4 + k * 0.6} dur={1.2} maxR={260} color={C.purple} />)}
      {[0, 1, 2].map((k) => <Ring key={'s' + k} x={480} y={830} t={t} t0={2.8 + k * 0.7} dur={1.6} maxR={700} color={C.cyan} w={3} />)}
      {u > 0 && u < 1 && <Shark x={x} y={y} s={0.9} rot={rot} t={t} seed={45} speed={1.6} tint="#24313f" />}
      <Splash x={760} y={620} t={t} t0={tb - 0.8} power={1.1} seed={46} />
      <Splash x={1180} y={620} t={t} t0={tb + 1.6} power={0.9} seed={47} />
      <Txt x={960} y={980} size={64} color={C.gold} s={pop(t, d * 0.75)}>PROTEJAMOS AL TIBURÓN BLANCO</Txt>
    </Stage>
  );
};

// 47 · Suscríbete
const s47 = (p) => {
  const { t } = p; const d = p.frames / 30; const tc = d * 0.3;
  const cur = [lerp(1500, 1010, ease(ramp(t, 0.5, tc))), lerp(900, 470, ease(ramp(t, 0.5, tc)))];
  const pressed = t > tc;
  const ring = t > d * 0.4 ? 18 * Math.sin((t - d * 0.4) * 22) * Math.exp(-(t - d * 0.4) * 1.5) : 0;
  const animals = ['🐙', '🦈', '🐊', '🦅', '🐋'];
  return (
    <Stage {...p} env={{ theme: 'blue' }} cam={{ keys: [[0, 960, 520, 1.2, -2], [2.5, 1000, 470, 1.5, 1], [5, 960, 560, 1.1, -1], [7.5, 960, 640, 1.3, 2], [d, 960, 560, 1.15, 0]] }}>
      <Shark x={lerp(-400, 2300, t / d)} y={820} s={0.6} t={t} seed={47} speed={0.8} />
      <g transform={`translate(860 470) scale(${pressed ? 1 - 0.08 * Math.max(0, 1 - (t - tc) * 6) : pop(t, 0.2)})`}>
        <rect x={-270} y={-70} width={540} height={140} rx={34} fill={pressed ? '#5a5a5a' : '#e61e28'} />
        <text x={0} y={22} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill="#fff">{pressed ? 'SUSCRITO ✓' : 'SUSCRÍBETE'}</text>
      </g>
      <g transform={`translate(1240 470) rotate(${ring})`}>
        <path d="M-40,30 C-40,-40 -25,-60 0,-60 C25,-60 40,-40 40,30 L50,40 L-50,40Z" fill={C.gold} /><circle cy={52} r={11} fill={C.gold} />
        {Math.abs(ring) > 2 && [0, 1].map((k) => <path key={k} d={`M${60 + k * 18},-30 Q${74 + k * 18},0 ${60 + k * 18},30`} stroke={C.gold} strokeWidth={5} fill="none" />)}
      </g>
      <g transform={`translate(${cur[0]} ${cur[1]})`}><path d="M0,0 L0,60 L16,46 L28,72 L38,66 L26,42 L46,40Z" fill="#fff" stroke="#000" strokeWidth={3} /></g>
      {pressed && <Ring x={1010} y={470} t={t} t0={tc} dur={0.6} maxR={120} color="#fff" />}
      {[...Array(5)].map((_, k) => { const s = pop(t, d * 0.55 + k * 0.25); const y = 760 - ramp(t, d * 0.55 + k * 0.25, d) * 160; return <g key={k} transform={`translate(${520 + k * 220} ${y}) scale(${s})`}><path d="M-60,-40 H60 V30 H-10 L-30,52 L-30,30 H-60Z" fill="#fff" stroke="#0f2240" strokeWidth={4} /><text x={0} y={8} textAnchor="middle" fontSize={44}>{animals[k]}</text></g>; })}
      <Txt x={960} y={260} size={54} color={C.gold} s={pop(t, d * 0.5)}>¿QUÉ ANIMAL QUIERES VER?</Txt>
    </Stage>
  );
};

export const S3 = [s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47];
