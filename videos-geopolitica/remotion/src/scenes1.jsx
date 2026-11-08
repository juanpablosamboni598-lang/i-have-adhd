import React from 'react';
import { C, FONT, cl, lerp, ramp, ease, eo, seg, pop, mod, rng, pathPts, Pill, Ring, Counter } from './lib.jsx';
import { Stage } from './stage.jsx';
import { Shark, Seal, Fish, Diver, Shadow, Splash, BubbleTrail } from './actors.jsx';

const Txt = ({ x, y, s = 1, size = 60, color = '#fff', children, anchor = 'middle', rot = 0, op = 1 }) => (s <= 0.01 ? null :
  <text transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} textAnchor={anchor} fontFamily={FONT} fontWeight={900} fontSize={size} fill={color} stroke="#000" strokeWidth={size / 9} paintOrder="stroke" opacity={op}>{children}</text>);

// 0 · Sudáfrica: foca en superficie, algo observa desde abajo
const s00 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const sx = lerp(250, 1350, t / d);
  const shx = lerp(500, 1150, t / d), shy = lerp(860, 730, t / d);
  const watch = ramp(t, d * 0.55, d * 0.65);
  return (
    <Stage {...p} env={{ theme: 'dusk', surface: 230 }} light={(tt) => 1 - 0.3 * ramp(tt, d * 0.5, d * 0.7)}
      cam={{ keys: [[0, sx * 0 + 520, 360, 1.35, -1], [2.6, 820, 420, 1.15, 1.5], [5.2, 900, 600, 1.05, 0], [7.8, shx + 120, shy - 20, 1.7, -2.5], [d, shx + 230, shy - 40, 2.3, 1]] }}>
      <Seal x={sx} y={262} s={0.9} t={t} />
      <path d={`M${sx},300 L${shx + 230},${shy - 30}`} stroke={C.gold} strokeWidth={4} strokeDasharray="14 12" opacity={0.7 * ramp(t, 3, 4.5)} strokeDashoffset={-t * 40} />
      <Pill x={(sx + shx) / 2 + 80} y={(300 + shy) / 2} text="20 METROS" s={pop(t, 3.6)} />
      <Shark x={shx} y={shy} s={0.85} t={t} seed={3} speed={0.5} opacity={0.55 + 0.35 * watch} tint="#3c4f62" glowParts={{ eye: watch > 0 }} />
      <BubbleTrail t={t} pts={(u, k) => [sx - 80 - k * 6, 290]} n={10} />
    </Stage>
  );
};

// 1 · Emboscada vertical y salto
const s01 = (p) => {
  const { t } = p; const d = p.frames / 30; const tb = 2.6;
  let x, y, rot, mouth;
  if (t < tb) { const u = ei2(t / tb); x = lerp(800, 1000, u); y = lerp(1250, 360, u); rot = -72; mouth = ramp(t, tb - 0.6, tb); }
  else if (t < tb + 1.4) { const u = (t - tb) / 1.4; x = lerp(1000, 1150, u); y = 360 - 520 * Math.sin(u * Math.PI * 0.62); rot = lerp(-72, -10, u); mouth = 1; }
  else { const u = cl((t - tb - 1.4) / 1.6); x = lerp(1150, 1300, u); y = lerp(-90, 600, ease(u)); rot = lerp(-10, 75, u); mouth = 1 - u * 0.5; }
  const caught = t > tb;
  return (
    <Stage {...p} env={{ theme: 'dusk', surface: 360 }} light={(tt) => 1 + 0.5 * Math.max(0, 1 - Math.abs(tt - tb) * 3)}
      cam={{ keys: [[0, 900, 760, 1.4, 2], [1.6, 960, 560, 1.2, -1], [tb, 1000, 380, 1.5, 0], [tb + 1.2, 1080, 220, 1.25, -3], [tb + 3, 1200, 420, 1.6, 2], [d, 1180, 470, 1.3, -1]], shake: (tt) => Math.max(0, 1 - Math.abs(tt - tb) * 2) + Math.max(0, 1 - Math.abs(tt - tb - 2.9) * 2.5) * 0.7 }}>
      {!caught && <Seal x={1010 + 30 * Math.sin(t)} y={385} s={0.85} t={t} />}
      <g>
        <Shark x={x} y={y} s={0.95} rot={rot} t={t} seed={5} speed={1.8} mouth={mouth} />
        {caught && <Seal x={x + Math.cos((rot * Math.PI) / 180) * 290} y={y + Math.sin((rot * Math.PI) / 180) * 290} s={0.6} rot={rot + 90} t={t} paddle={3} />}
      </g>
      <Splash x={1000} y={360} t={t} t0={tb} power={1.2} seed={2} />
      <Splash x={1260} y={360} t={t} t0={tb + 2.9} power={0.9} seed={7} />
      <BubbleTrail t={t} pts={(u, k) => [x - 90 * Math.cos((rot * Math.PI) / 180) * (1 + k * 0.2), y + 300 * u]} n={18} />
    </Stage>
  );
};
const ei2 = (x) => Math.pow(cl(x), 2.2);

// 2 · Título + temas
const s02 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const l1 = 'CÓMO CAZA', l2 = 'EL TIBURÓN BLANCO';
  const letters = (str, y0, size, col, t0) => { const ws = str.split(' '); const cw = size * 0.74; const tot = str.length * cw; let cx = 960 - tot / 2; return ws.map((w, k) => {
    const wl = w.length * cw; const x = cx + wl / 2; cx += wl + cw; const s = pop(t, t0 + k * 0.18, 0.5);
    return <Txt key={k} x={x} y={y0 + 6 * Math.sin(t * 3 + k) - (1 - Math.min(1, s)) * 120} s={s} size={size} color={col} rot={3 * Math.sin(t * 2 + k)}>{w}</Txt>; }); };
  const items = [['SENTIDOS', C.cyan], ['ARMAS', C.red], ['TRUCOS', C.green], ['¿SU MIEDO?', C.gold]];
  return (
    <Stage {...p} env={{ theme: 'blue', seabed: 930 }}
      cam={{ keys: [[0, 960, 520, 1.25, -2], [2.5, 960, 470, 1.05, 1], [5.2, 960, 560, 1.15, -1], [7.8, 960, 700, 1.35, 2], [d, 960, 640, 1.1, 0]] }}
      back={<Shark x={lerp(-500, 2400, t / d)} y={560} s={0.7} t={t} seed={8} opacity={0.75} />}>
      {letters(l1, 430, 96, '#fff', 0.4)}
      {letters(l2, 560, 100, C.gold, 1.0)}
      {items.map(([n, c], k) => <Pill key={k} x={420 + k * 360} y={790 + 10 * Math.sin(t * 2 + k)} text={n} color={c} size={38} s={pop(t, d * 0.42 + k * d * 0.12)} rot={3 * Math.sin(t * 1.5 + k)} />)}
      <Shadow x={lerp(-500, 2400, t / d)} groundY={930} y={560} size={260} />
    </Stage>
  );
};

// 3 · Tamaño: buzo, cinta métrica, camioneta, peso
const s03 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const shx = lerp(1500, 1050, eo(t / (d * 0.35)));
  const tape = eo(ramp(t, d * 0.25, d * 0.45));
  const truckX = lerp(-600, 700, eo(ramp(t, d * 0.45, d * 0.62)));
  const wheel = t * 400;
  return (
    <Stage {...p} env={{ theme: 'blue', seabed: 900 }} cam={{ focus: (tt) => [lerp(700, 1000, ramp(tt, 0, d * 0.4)), 560], zamt: 0.7 }}>
      <Diver x={360} y={560} s={1.1} t={t} point={ramp(t, 1.5, 2.5)} />
      <Shark x={shx} y={520} s={1.05} t={t} seed={9} speed={0.7} />
      <Shadow x={shx} groundY={900} y={520} size={330} />
      <g opacity={tape > 0 ? 1 - ramp(t, d * 0.45, d * 0.52) : 0}>
        <rect x={shx - 420} y={668 + 0} width={760 * tape} height={34} fill="#f5d000" stroke="#7a6500" strokeWidth={3} />
        {[...Array(7)].map((_, k) => k / 6 <= tape + 0.001 && <g key={k}><line x1={shx - 420 + k * 126.7} y1={668} x2={shx - 420 + k * 126.7} y2={692} stroke="#000" strokeWidth={4} /><text x={shx - 420 + k * 126.7 + 6} y={699} fontFamily={FONT} fontWeight={900} fontSize={18}>{k}</text></g>)}
      </g>
      {t < d * 0.5 && <Counter x={shx - 40} y={640} t={t} t0={d * 0.25} t1={d * 0.45} v1={6} size={90} color={C.gold} suffix=" m" />}
      <g transform={`translate(${truckX} 860)`} opacity={0.9}>
        <rect x={-240} y={-110} width={330} height={90} rx={12} fill="#c0392b" stroke="#5a1a14" strokeWidth={4} />
        <path d="M90,-20 L90,-110 L170,-110 L220,-60 L220,-20Z" fill="#c0392b" stroke="#5a1a14" strokeWidth={4} />
        <rect x={110} y={-100} width={60} height={36} fill="#9fe3ff" />
        {[-160, 140].map((wx, k) => <g key={k} transform={`translate(${wx} -15) rotate(${wheel})`}><circle r={34} fill="#222" /><rect x={-4} y={-26} width={8} height={52} fill="#999" /></g>)}
        <Pill x={0} y={-150} text="MÁS QUE UNA CAMIONETA" size={30} color={C.cyan} s={pop(t, d * 0.6)} />
      </g>
      <g transform={`translate(1350 230)`}>
        <Pill x={0} y={0} text="≈ 2 TONELADAS" color={C.red} s={pop(t, d * 0.78)} rot={-3 + 3 * Math.sin(t * 2)} />
        {[...Array(4)].map((_, k) => <rect key={k} x={-120 + k * 62} y={60 - eo(ramp(t, d * 0.8 + k * 0.12, d * 0.86 + k * 0.12)) * 0 + (1 - eo(ramp(t, d * 0.8 + k * 0.12, d * 0.9 + k * 0.12))) * -300} width={54} height={54} rx={6} fill="#56606d" stroke="#222" strokeWidth={3} opacity={ramp(t, d * 0.8 + k * 0.12, d * 0.82 + k * 0.12)} />)}
      </g>
    </Stage>
  );
};

// 4 · Hidrodinámica: caja turbulenta vs torpedo
const s04 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const lines = [];
  for (let k = 0; k < 11; k++) {
    const y0 = 300 + k * 50, dy = y0 - 540, bump = 130 * Math.exp(-(dy * dy) / 26000) * Math.sign(dy || 1);
    const pts = []; for (let x = 0; x <= 1920; x += 40) { const g = Math.exp(-Math.pow((x - 1250) / 300, 2)); pts.push([x, y0 + bump * g]); }
    lines.push(<path key={k} d={pathPts(pts)} stroke="#9fe3ff" strokeWidth={3} fill="none" strokeDasharray="30 22" strokeDashoffset={t * 160} opacity={0.75} />);
  }
  const box = 1 - ramp(t, d * 0.35, d * 0.5);
  const eddies = [...Array(7)].map((_, k) => { const cx = 640 + (k % 3) * 70 + mod(t * 80 + k * 50, 200), cy = 440 + Math.floor(k / 3) * 90; return <path key={k} d={`M${cx},${cy} m-30,0 a30,30 0 1,1 60,0 a22,22 0 1,1 -44,0 a14,14 0 1,1 28,0`} stroke="#ff9f43" strokeWidth={4} fill="none" transform={`rotate(${t * 300 + k * 50} ${cx} ${cy})`} opacity={box} />; });
  return (
    <Stage {...p} env={{ theme: 'blue' }} cam={{ keys: [[0, 620, 540, 1.5, -2], [2.5, 800, 520, 1.2, 1], [4.6, 1200, 540, 1.35, -1], [6.8, 1320, 520, 1.7, 2], [d, 1150, 540, 1.15, 0]] }}>
      {lines}
      <g opacity={box}><rect x={420} y={460} width={170} height={160} fill="#7f8c8d" stroke="#2c3e50" strokeWidth={5} transform={`rotate(${3 * Math.sin(t * 8)} 505 540)`} />{eddies}
        <Pill x={505} y={380} text="RESISTENCIA" color={C.red} size={30} s={pop(t, 0.6)} /></g>
      <Shark x={lerp(1500, 1250, eo(ramp(t, d * 0.3, d * 0.55)))} y={540} s={0.95} t={t} seed={10} speed={0.6} opacity={ramp(t, d * 0.28, d * 0.45)} />
      <Pill x={1250} y={330} text="FORMA DE TORPEDO" s={pop(t, d * 0.55)} />
    </Stage>
  );
};

// 5 · Piel: dedo que roza, lupa con dentículos
const s05 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const z = seg(t, d * 0.3, d * 0.5);
  const fx = 900 + 120 * Math.sin(t * 5);
  const den = [];
  for (let r = -4; r <= 4; r++) for (let c = -6; c <= 6; c++) {
    const x = 960 + c * 44 + (r % 2) * 22, y = 560 + r * 36; if (Math.hypot(x - 960, y - 560) > 230) continue;
    const s = pop(t, d * 0.5 + (Math.abs(c) + Math.abs(r)) * 0.05, 0.4);
    den.push(<path key={r + '_' + c} d="M18,0 L-14,-14 L-8,0 L-14,14Z" transform={`translate(${x} ${y}) scale(${s}) rotate(${4 * Math.sin(t * 3 + c)})`} fill="#d5dee6" stroke="#22344a" strokeWidth={2} />);
  }
  const flow = [...Array(14)].map((_, k) => { const y = 380 + k * 26; const x = mod(t * 420 + k * 130, 600) + 660; return <line key={k} x1={x} y1={y} x2={x - 60} y2={y} stroke="#cfefff" strokeWidth={3} opacity={0.7 * ramp(t, d * 0.6, d * 0.7)} />; });
  return (
    <Stage {...p} env={{ theme: 'blue' }} cam={{ keys: [[0, 960, 540, 1.1, 1], [2.8, 900, 500, 1.6, -2], [d * 0.45, 960, 560, 1.9, 1], [d * 0.7, 980, 560, 2.2, -1.5], [d, 960, 540, 1.8, 2]] }}>
      <Shark x={1000} y={560} s={1.6} t={t} seed={11} speed={0.4} />
      <g opacity={1 - ramp(t, d * 0.3, d * 0.38)} transform={`translate(${fx} 470)`}>
        <path d="M0,0 C-10,-40 10,-140 30,-200 L90,-200 C80,-130 70,-50 60,0 C50,30 10,30 0,0Z" fill="#f0c8a0" stroke="#8a6040" strokeWidth={4} />
        {[...Array(5)].map((_, k) => <line key={k} x1={-30 - k * 12} y1={10 + k * 6} x2={-60 - k * 12} y2={18 + k * 6} stroke="#fff" strokeWidth={3} opacity={Math.abs(Math.sin(t * 5))} />)}
        <Pill x={40} y={-260} text="¡COMO LIJA!" size={34} s={pop(t, 1.2)} />
      </g>
      <g opacity={z}>
        <circle cx={960} cy={560} r={250 * z} fill="#53697e" stroke={C.gold} strokeWidth={10} />
        {den}{flow}
        <Pill x={960} y={270} text="ESCAMAS CON FORMA DE DIENTE" size={32} s={pop(t, d * 0.62)} />
      </g>
    </Stage>
  );
};

// 6 · Branquias: agua entra por la boca y sale por las ranuras
const s06 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const shx = 820, shy = 540, S = 1.7;
  const W2 = (u) => { // ruta del agua: frente a la boca -> boca -> branquias -> fuera
    const P = [[1600, 600], [shx + 312 * S, shy + 26 * S], [shx + 230 * S, shy + 10 * S], [shx + 170 * S, shy], [shx + 140 * S, shy + 120]];
    const n = P.length - 1, k = Math.min(n - 1, Math.floor(u * n)), v = u * n - k;
    return [lerp(P[k][0], P[k + 1][0], v), lerp(P[k][1], P[k + 1][1], v)];
  };
  const on = ramp(t, d * 0.45, d * 0.55);
  const parts = [...Array(36)].map((_, k) => { const u = mod(t * 0.35 + k / 36, 1); const [x, y] = W2(u); const o2 = u > 0.7; return <circle key={k} cx={x} cy={y + (o2 ? (u - 0.7) * 40 * Math.sin(k) : 0)} r={o2 ? 7 : 8} fill={o2 && k % 3 === 0 ? C.red : C.cyan} opacity={on * (0.5 + 0.5 * Math.sin(k))} />; });
  return (
    <Stage {...p} env={{ theme: 'blue' }} cam={{ keys: [[0, 900, 520, 1.15, -1], [2.6, shx + 170 * S, shy, 1.9, 2], [5.2, shx + 260 * S, shy + 20, 1.5, -1.5], [7.8, shx + 190 * S, shy + 40, 1.75, 1], [d, 1100, 540, 1.3, -1]] }}>
      <Shark x={shx} y={shy} s={S} t={t} seed={12} speed={0.5} mouth={0.35 + 0.15 * Math.sin(t * 3)} glowParts={{ gills: t > d * 0.3 }} />
      {[0, 1, 2, 3, 4].map((k) => <Ring key={k} x={shx + (150 + k * 14) * S} y={shy} t={t} t0={d * 0.3 + k * 0.15} dur={0.8} maxR={90} color={C.red} />)}
      <Pill x={shx + 175 * S} y={shy - 210} text="5 BRANQUIAS" color={C.red} s={pop(t, d * 0.33)} />
      {parts}
      <Pill x={shx + 140 * S} y={shy + 230} text="OXÍGENO" color={C.cyan} size={34} s={pop(t, d * 0.75)} />
    </Stage>
  );
};

// 7 · Nadar para respirar: medidor de oxígeno
const s07 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const slow = ramp(t, d * 0.58, d * 0.75);
  const speed = lerp(1.3, 0.15, slow);
  // posición del fondo: integral aproximada de la velocidad
  const dist = t * 260 - slow * slow * (t - d * 0.58) * 150;
  const o2 = cl(1 - slow * 0.9 - 0.05 * Math.sin(t));
  const alarm = slow > 0.4 ? 0.5 + 0.5 * Math.sin(t * 12) : 0;
  return (
    <Stage {...p} env={{ theme: 'blue' }} light={(tt) => 1 - 0.25 * slow} cam={{ focus: () => [960, 560], zamt: 0.6 }}
      hud={() => (<g transform="translate(1720 330)">
        <rect x={-30} y={-10} width={60} height={320} rx={14} fill="#0f2240" stroke="#fff" strokeWidth={4} />
        <rect x={-22} y={302 - 304 * o2} width={44} height={304 * o2} rx={10} fill={o2 > 0.4 ? C.cyan : C.red} />
        <text x={0} y={350} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill="#fff">O₂</text>
        <circle cx={0} cy={-50} r={26} fill={C.red} opacity={alarm} />
      </g>)}>
      <g transform={`translate(${-mod(dist, 1200)} 0)`}>
        <rect x={-200} y={880} width={4000} height={400} fill={C.sand} />
        {[...Array(12)].map((_, k) => <ellipse key={k} cx={k * 300 + 80} cy={890} rx={90} ry={40} fill="#56606d" stroke="#2c3138" strokeWidth={4} />)}
        {[...Array(16)].map((_, k) => { const kx = k * 220 + 40; const pts = []; for (let h = 0; h <= 260; h += 26) pts.push([kx + 25 * Math.sin(t * 1.6 + k + h * 0.02), 880 - h]); return <path key={k} d={pathPts(pts)} stroke={C.kelp} strokeWidth={9} fill="none" />; })}
      </g>
      <Shark x={900} y={540 + slow * 140} rot={slow * 18} s={1.1} t={t} seed={13} speed={speed} />
      <Shadow x={900} groundY={880} y={540 + slow * 140} size={320} />
      <BubbleTrail t={t} pts={(u, k) => [900 - 380 - u * 300 * (1 - slow), 560]} n={14 - Math.round(slow * 8)} />
      <Pill x={900} y={240} text={slow > 0.3 ? 'SI SE DETIENE… SE ASFIXIA' : 'NADA SIN PARAR'} color={slow > 0.3 ? C.red : C.cyan} s={pop(t, slow > 0.3 ? d * 0.62 : 1.0)} />
    </Stage>
  );
};

// 8 · Calor interno: red de vasos y termómetros
const s08 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const heat = seg(t, d * 0.25, d * 0.45);
  const merc = (v) => 20 + v * 230;
  const parts = [['MÚSCULOS', 960, 520, 0.5], ['ESTÓMAGO', 1060, 600, 0.62], ['OJOS', 1250, 480, 0.74]];
  const vessels = [...Array(10)].map((_, k) => { const y = 650 + k * 14; const u = mod(t * 0.6 + k * 0.1, 1); return <g key={k}><line x1={600} y1={y} x2={1300} y2={y} stroke={k % 2 ? '#ff4b4b' : '#4b9bff'} strokeWidth={5} opacity={0.6} /><circle cx={k % 2 ? lerp(600, 1300, u) : lerp(1300, 600, u)} cy={y} r={7} fill="#fff" /></g>; });
  return (
    <Stage {...p} env={{ theme: 'deep' }} cam={{ keys: [[0, 960, 540, 1.1, 0], [2.6, 960, 520, 1.4, -2], [5.3, 960, 560, 1.25, 1.5], [7.9, 1080, 560, 1.6, -1], [10.5, 1180, 500, 1.8, 2], [d, 960, 540, 1.2, 0]] }}>
      <Shark x={960} y={500} s={1.25} t={t} seed={14} speed={0.6} heat={heat} />
      <g opacity={ramp(t, d * 0.35, d * 0.45)}>{vessels}<Pill x={950} y={250} text="RED DE VASOS QUE GUARDA CALOR" size={30} color={C.red} s={pop(t, d * 0.4)} /></g>
      {parts.map(([n, x, y, fr], k) => <g key={k}><Ring x={x} y={y} t={t} t0={d * fr} dur={1} maxR={110} color={C.gold} /><Pill x={x} y={y - 150 - k * 20} text={n} size={30} s={pop(t, d * fr)} /></g>)}
      {[[330, '#4b9bff', 0.15, 'AGUA 15°C'], [1540, '#ff4b4b', 0.62, 'CUERPO 26°C']].map(([x, c, v, lb], k) => (
        <g key={k} transform={`translate(${x} 300)`}><rect x={-22} y={0} width={44} height={280} rx={22} fill="#fff" opacity={0.85} /><circle cy={300} r={40} fill={c} />
          <rect x={-12} y={270 - merc(lerp(0.05, v, seg(t, 1 + k * d * 0.4, 3 + k * d * 0.4)))} width={24} height={merc(lerp(0.05, v, seg(t, 1 + k * d * 0.4, 3 + k * d * 0.4)))} fill={c} />
          <Pill x={0} y={-50} text={lb} size={28} color={c} s={pop(t, 1.2 + k * d * 0.4)} /></g>))}
    </Stage>
  );
};

// 9 · Ventaja en agua fría: persecución
const s09 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const fx = lerp(700, 1500, t / d), shx = lerp(-200, 1300, eo(t / d));
  const R = rng(9);
  const ice = [...Array(22)].map((_, k) => { const x = mod(R() * 2400 - t * 30, 2400) - 200, y = R() * 1080, r = 10 + R() * 18; return <path key={k} d={`M${x},${y - r} L${x},${y + r} M${x - r},${y} L${x + r},${y} M${x - r * 0.7},${y - r * 0.7} L${x + r * 0.7},${y + r * 0.7} M${x - r * 0.7},${y + r * 0.7} L${x + r * 0.7},${y - r * 0.7}`} stroke="#e8f7ff" strokeWidth={3} opacity={0.5} transform={`rotate(${t * 20 + k * 10} ${x} ${y})`} />; });
  return (
    <Stage {...p} env={{ theme: 'cold' }} cam={{ focus: (tt) => [lerp(lerp(-200, 1300, eo(tt / d)), lerp(700, 1500, tt / d), 0.5) + 100, 560], zamt: 0.8 }}>
      {ice}
      <Fish x={fx} y={620 + 20 * Math.sin(t)} s={2.2} t={t} seed={4} color="#8fb3cc" wag={0.35} />
      <Pill x={fx} y={520} text="LENTO" color={C.cyan} size={28} s={pop(t, 1.2)} />
      {[...Array(6)].map((_, k) => <line key={k} x1={shx - 420 - k * 40} y1={480 + k * 22} x2={shx - 620 - k * 60} y2={480 + k * 22} stroke="#fff" strokeWidth={4} opacity={0.5} />)}
      <Shark x={shx} y={560} s={1.0} t={t} seed={15} speed={1.9} heat={0.35} mouth={ramp(t, d * 0.75, d * 0.9) * 0.8} />
      <Pill x={shx} y={380} text="MÚSCULOS CALIENTES = MÁS RÁPIDO" color={C.red} size={30} s={pop(t, d * 0.45)} />
    </Stage>
  );
};

// 10 · Los sentidos: íconos que orbitan
const SenseIcon = ({ k, t }) => {
  switch (k) {
    case 0: return <g><path d="M-20,10 C-20,-20 0,-40 0,-40 C0,-40 20,-20 20,10 A20,20 0 0,1 -20,10Z" fill={C.gold} /><circle cx={30} cy={-10 - mod(t * 30, 30)} r={5} fill={C.gold} /></g>;
    case 1: return <g>{[0, 1, 2].map((j) => <path key={j} d={`M${j * 14},-${20 + j * 10} A${20 + j * 10},${20 + j * 10} 0 0,1 ${j * 14},${20 + j * 10}`} stroke={C.cyan} strokeWidth={6} fill="none" opacity={0.4 + 0.6 * Math.abs(Math.sin(t * 4 - j))} />)}</g>;
    case 2: return <g>{[...Array(6)].map((_, j) => <circle key={j} cx={-30 + j * 12} cy={0} r={5 + 3 * Math.abs(Math.sin(t * 5 - j))} fill={C.green} />)}</g>;
    case 3: return <g><ellipse rx={34} ry={20} fill="#fff" /><circle r={13} fill="#0b0f18" /><circle cx={4} cy={-4} r={4} fill="#fff" /></g>;
    default: return <path d="M8,-36 L-14,4 L2,4 L-6,36 L18,-6 L2,-6Z" fill={C.purple} transform={`scale(${1 + 0.15 * Math.sin(t * 12)})`} />;
  }
};
const s10 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const names = ['OLFATO', 'OÍDO', 'LÍNEA LATERAL', 'VISTA', 'ELECTRICIDAD'];
  const t0 = [0.22, 0.32, 0.45, 0.6, 0.75];
  return (
    <Stage {...p} env={{ theme: 'blue' }} cam={{ focus: () => [960, 540], zamt: 0.6 }}>
      <Shark x={940} y={540} s={0.85} t={t} seed={16} speed={0.6} />
      {names.map((n, k) => {
        const a = t * 0.5 + k * (Math.PI * 2 / 5) - Math.PI / 2; const s = pop(t, d * t0[k]);
        const x = 960 + 560 * Math.cos(a), y = 540 + 320 * Math.sin(a);
        return <g key={k}><line x1={960} y1={540} x2={x} y2={y} stroke="#fff" strokeWidth={2} strokeDasharray="8 8" opacity={0.4 * Math.min(1, s)} strokeDashoffset={-t * 30} />
          <g transform={`translate(${x} ${y - 60}) scale(${s * 1.3})`}><circle r={46} fill="#0f2240" stroke="#fff" strokeWidth={3} /><SenseIcon k={k} t={t} /></g>
          <Pill x={x} y={y + 20} text={n} size={28} s={s} /></g>;
      })}
    </Stage>
  );
};

// 11 · Olfato: fosa nasal y roseta
const s11 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const shx = 700, S = 2.2; const nx = shx + 292 * S, ny = 540 - 6 * S;
  const mol = [...Array(40)].map((_, k) => { const u = mod(t * 0.4 + k / 40, 1); const a = k * 2.4 + u * 9; const r = (1 - u) * 380; return <circle key={k} cx={nx + Math.cos(a) * r + (1 - u) * 200} cy={ny + Math.sin(a) * r * 0.6} r={6} fill={C.gold} opacity={u * 0.9} />; });
  const ros = ramp(t, d * 0.45, d * 0.55);
  return (
    <Stage {...p} env={{ theme: 'blue' }} cam={{ keys: [[0, 1100, 540, 1.2, -1], [2.4, nx - 80, ny, 1.9, 1.5], [4.6, nx + 60, ny + 30, 2.2, -1], [6.8, nx + 150, ny + 60, 1.7, 2], [d, nx, ny, 1.5, 0]] }}>
      <Shark x={shx} y={540} s={S} t={t} seed={17} speed={0.4} glowParts={{ nose: true }} />
      {mol}
      <g transform={`translate(${nx + 200} ${ny + 210}) scale(${ros})`}>
        <circle r={150} fill="#0f2240" stroke={C.gold} strokeWidth={6} />
        {[...Array(9)].map((_, k) => <ellipse key={k} cx={0} cy={-100 + k * 25} rx={100 - Math.abs(k - 4) * 14} ry={9} fill={k / 9 < mod(t * 0.8, 1.2) ? C.gold : '#d18a8a'} />)}
        <Pill x={0} y={190} text="SOLO PARA OLER" size={28} s={pop(t, d * 0.55)} />
      </g>
    </Stage>
  );
};

// 12 · Rastro de olor: gota que se difunde, zigzag
const s12 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const R = rng(12);
  const src = [1650, 420];
  const drop = Math.min(1, t / 0.9);
  const plume = [...Array(120)].map((_, k) => {
    const age = cl(t - 0.9 - R() * 3), dx = -age * (260 + R() * 160), dy = Math.sin(age * 2 + k) * 60 * age + (R() - 0.5) * 120 * age;
    return <circle key={k} cx={src[0] + dx} cy={src[1] + 40 + dy} r={6 + age * 14} fill="#d43a4a" opacity={0.35 * (age > 0 ? 1 : 0)} />;
  });
  const u = ramp(t, d * 0.35, d);
  const shx = lerp(-300, 1500, u), shy = 460 + 70 * Math.sin(u * 14);
  const head = 18 * Math.cos(u * 14);
  return (
    <Stage {...p} env={{ theme: 'blue', seabed: 950 }} cam={{ focus: (tt) => { const uu = ramp(tt, d * 0.35, d); return [tt < d * 0.35 ? lerp(1500, 1100, tt / (d * 0.35)) : lerp(-300, 1500, uu) + 250, 500]; }, zamt: 0.8 }}>
      <Fish x={src[0] + 40} y={src[1] - 30} s={1.6} t={t} seed={6} color="#c9d3db" />
      <circle cx={src[0]} cy={src[1] + drop * 40} r={14} fill="#b0182a" opacity={1 - ramp(t, 0.9, 1.3)} />
      {plume}
      <Shark x={shx} y={shy} rot={head} s={0.75} t={t} seed={18} speed={1.1} glowParts={{ nose: true }} />
      <Pill x={1300} y={300} text="RASTRO INVISIBLE" color={C.red} size={32} s={pop(t, 1.4)} />
    </Stage>
  );
};

// 13 · Oído: ondas de baja frecuencia desde lejos
const s13 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const fx = 1500, fy = 520;
  const thr = 10 * Math.sin(t * 25);
  const turn = seg(t, d * 0.55, d * 0.75);
  return (
    <Stage {...p} env={{ theme: 'blue', seabed: 960 }} cam={{ keys: [[0, 1450, 520, 1.6, 2], [2.7, 1300, 540, 1.2, -1], [5.4, 800, 560, 1.05, 1], [8.1, 450, 560, 1.6, -2], [d, 700, 540, 1.2, 1]] }}>
      <Fish x={fx + thr} y={fy} rot={thr * 3} s={1.8} t={t} seed={8} color="#ff7b7b" wag={3} />
      {[...Array(9)].map((_, k) => { const t0 = 0.8 + k * 0.9; const u = (t - t0) / 3.2; if (u < 0 || u > 1) return null; const r = 40 + u * 1300; const pts = []; for (let a = 0; a <= 6.3; a += 0.12) pts.push([fx + Math.cos(a) * (r + 12 * Math.sin(a * 8 + t * 4)), fy + Math.sin(a) * (r + 12 * Math.sin(a * 8 + t * 4))]); return <path key={k} d={pathPts(pts) + 'Z'} stroke={C.cyan} strokeWidth={6} fill="none" opacity={1 - u} />; })}
      <Shark x={330} y={600} s={0.6} t={t} seed={19} speed={0.7} rot={-turn * 8} />
      <g transform="translate(470 560)"><path d={`M0,0 m-12,0 a12,12 0 1,1 24,0 a8,8 0 1,1 -16,0`} stroke={C.gold} strokeWidth={4} fill="none" transform={`scale(${1 + 0.4 * Math.abs(Math.sin(t * 6)) * ramp(t, 3, 4)})`} /></g>
      <line x1={480} y1={760} x2={lerp(480, 1450, eo(ramp(t, d * 0.4, d * 0.6)))} y2={760} stroke={C.gold} strokeWidth={5} strokeDasharray="16 10" />
      <Counter x={960} y={730} t={t} t0={d * 0.4} t1={d * 0.6} v1={400} size={64} color={C.gold} suffix=" m" />
      <Pill x={330} y={420} text="OÍDO INTERNO" size={30} s={pop(t, 1.5)} />
    </Stage>
  );
};

// 14 · Línea lateral: poros que se encienden en ola
const s14 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const S = 1.9, shx = 960, shy = 560;
  const g = ramp(t, d * 0.3, d);
  return (
    <Stage {...p} env={{ theme: 'blue' }} cam={{ keys: [[0, 960, 560, 1.1, 0], [2.6, shx + 200 * S, shy, 1.8, -2], [5.2, shx + 30 * S, shy, 2.1, 1], [7.8, shx - 150 * S, shy, 1.9, -1], [d, shx, shy + 40, 1.3, 2]] }}>
      <Shark x={shx} y={shy} s={S} t={t} seed={20} speed={0.4} lateralGlow={g > 0 ? 0.3 + t * 0.5 : 0} />
      {[...Array(5)].map((_, k) => { const u = mod(t * 0.4 + k / 5, 1); return <path key={k} d={`M${300},${180 + u * 300} Q960,${140 + u * 300} 1620,${180 + u * 300}`} stroke="#9fe3ff" strokeWidth={4} fill="none" opacity={(1 - u) * ramp(t, d * 0.45, d * 0.55)} />; })}
      <g transform={`translate(${shx - 40} ${shy + 260}) scale(${pop(t, d * 0.6)})`}>
        <rect x={-260} y={-60} width={520} height={120} rx={20} fill="#0f2240" stroke={C.green} strokeWidth={5} />
        <rect x={-240} y={-12} width={480} height={24} fill="#163d63" />
        {[...Array(7)].map((_, k) => <g key={k}><path d={`M${-200 + k * 66},12 L${-200 + k * 66 + 18 * Math.sin(t * 6 - k)},-28`} stroke={C.green} strokeWidth={5} /><circle cx={-200 + k * 66 + 18 * Math.sin(t * 6 - k)} cy={-30} r={6} fill={C.green} /></g>)}
      </g>
      <Pill x={shx} y={shy - 260} text="DETECTA VIBRACIONES" color={C.green} s={pop(t, d * 0.42)} />
    </Stage>
  );
};

// 15 · Ondas que llegan a la línea lateral, presa oculta
const s15 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const turn = seg(t, d * 0.6, d * 0.8);
  return (
    <Stage {...p} env={{ theme: 'deep', seabed: 900 }} light={0.8} cam={{ keys: [[0, 1400, 600, 1.6, -2], [2.5, 1150, 600, 1.2, 1], [4.8, 650, 560, 1.5, -1], [7, 900, 580, 1.25, 2], [d, 1000, 600, 1.1, 0]] }}>
      <Fish x={1450 + 60 * Math.sin(t * 2)} y={760} s={1.5} t={t} seed={9} color="#ffd166" wag={2} />
      <ellipse cx={1500} cy={800} rx={170} ry={110} fill="#4b5560" stroke="#2c3138" strokeWidth={5} />
      {[...Array(7)].map((_, k) => { const u = (t - k * 0.8) / 2.6; if (u < 0 || u > 1) return null; return <ellipse key={k} cx={1450} cy={760} rx={40 + u * 1000} ry={30 + u * 600} stroke="#ffd166" strokeWidth={5} fill="none" opacity={1 - u} />; })}
      <rect x={-500} y={-200} width={3000} height={1600} fill="#0b2a46" opacity={0.4} />
      <Shark x={560} y={560} s={0.9} t={t} seed={21} speed={0.6} rot={turn * 12} lateralGlow={t > d * 0.3 ? t : 0} />
      <path d={`M700,560 Q1100,${500 + 60 * Math.sin(t)} 1400,740`} stroke={C.gold} strokeWidth={7} fill="none" strokeDasharray="20 14" strokeDashoffset={-t * 60} opacity={ramp(t, d * 0.6, d * 0.7)} />
      <Pill x={1050} y={380} text="SABE DÓNDE ESTÁ SIN VERLA" color={C.green} size={32} s={pop(t, d * 0.65)} />
    </Stage>
  );
};

export const S1 = [s00, s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11, s12, s13, s14, s15];
