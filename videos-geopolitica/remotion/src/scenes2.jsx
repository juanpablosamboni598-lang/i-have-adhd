import React from 'react';
import { C, FONT, W, cl, lerp, ramp, ease, eo, seg, pop, mod, rng, pathPts, Pill, Ring, Counter } from './lib.jsx';
import { Stage } from './stage.jsx';
import { Shark, Seal, Fish, Shadow, Splash, BubbleTrail } from './actors.jsx';

const Txt = ({ x, y, s = 1, size = 60, color = '#fff', children, rot = 0 }) => (s <= 0.01 ? null :
  <text transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={size} fill={color} stroke="#000" strokeWidth={size / 9} paintOrder="stroke">{children}</text>);

// 16 · Ojo con tapetum: fotones que rebotan
const s16 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const ex = 1060, ey = 520;
  const ph = [...Array(14)].map((_, k) => {
    const u = mod(t * 0.45 + k / 14, 1); const y0 = ey - 120 + k * 18;
    const hit = 0.55; let x, y;
    if (u < hit) { x = lerp(200, ex + 250, u / hit); y = lerp(y0, ey + (y0 - ey) * 0.3, u / hit); }
    else { const v = (u - hit) / (1 - hit); x = lerp(ex + 250, 200, v); y = lerp(ey + (y0 - ey) * 0.3, ey - (y0 - ey) * 1.2, v); }
    return <circle key={k} cx={x} cy={y} r={9} fill={u < hit ? C.gold : '#fff7c2'} opacity={ramp(t, d * 0.25, d * 0.35)} filter="url(#glow)" />;
  });
  const mirror = ramp(t, d * 0.38, d * 0.48);
  return (
    <Stage {...p} env={{ theme: 'dark', rayStrength: 0.4 }} light={(tt) => 0.75 + 0.35 * mirror * (0.5 + 0.5 * Math.sin(tt * 3))} cam={{ keys: [[0, ex, ey, 1.05, 0], [2.6, ex + 100, ey, 1.4, -2], [5.1, ex + 230, ey, 1.9, 1.5], [7.6, ex - 200, ey, 1.3, -1], [d, ex, ey + 30, 1.15, 1]] }}>
      <circle cx={ex} cy={ey} r={300} fill="#0b0f18" stroke="#6f8aa3" strokeWidth={26} />
      <ellipse cx={ex - 210} cy={ey} rx={70} ry={120} fill="#3a6b8a" opacity={0.8} />
      <path d={`M${ex + 170},${ey - 220} A300,300 0 0,1 ${ex + 170},${ey + 220}`} stroke="#d34c6a" strokeWidth={22} fill="none" />
      <path d={`M${ex + 200},${ey - 200} A280,280 0 0,1 ${ex + 200},${ey + 200}`} stroke="#d7f7ff" strokeWidth={14 * mirror} fill="none" filter="url(#glow)" opacity={0.6 + 0.4 * Math.sin(t * 5)} />
      {ph}
      <Pill x={ex + 250} y={ey - 330} text="ESPEJO: TAPETUM LUCIDUM" size={32} color="#d7f7ff" s={pop(t, d * 0.42)} />
      <g transform={`translate(420 ${ey + 300})`} opacity={ramp(t, d * 0.7, d * 0.78)}>
        <circle r={100} fill="#0b1626" stroke="#fff" strokeWidth={4} /><Seal x={0} y={0} s={0.35} t={t} opacity={0.25} />
        <circle cx={250} r={100} fill="#2a4a6a" stroke={C.gold} strokeWidth={4} /><Seal x={250} y={0} s={0.35} t={t} opacity={1} />
        <path d="M110,0 L140,0" stroke="#fff" strokeWidth={6} markerEnd="" /><path d="M130,-12 L148,0 L130,12" stroke="#fff" strokeWidth={6} fill="none" />
      </g>
    </Stage>
  );
};

// 17 · Ampollas de Lorenzini: zoom al poro y canal con gel
const s17 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const shx = 520, S = 2.4; const px = shx + 285 * S, py = 540 - 4 * S;
  const inside = ramp(t, d * 0.55, d * 0.65);
  return (
    <Stage {...p} env={{ theme: 'blue' }} cam={{ keys: [[0, 900, 540, 1.1, 1], [2.4, px - 40, py, 1.8, -1.5], [d * 0.55, px, py, 2.6, 1], [d * 0.8, px + 60, py + 40, 2.3, -2], [d, px + 30, py + 20, 2.0, 0]] }}>
      <Shark x={shx} y={540} s={S} t={t} seed={22} speed={0.35} ampGlow={ramp(t, d * 0.3, d * 0.4)} />
      <g opacity={inside} transform={`translate(${px + 40} ${py + 30})`}>
        <circle r={150} fill="#10223f" stroke={C.purple} strokeWidth={6} />
        <path d="M-120,-60 C-40,-60 -20,40 60,40 C100,40 110,10 110,-10" stroke="#f4e3b0" strokeWidth={34} fill="none" strokeLinecap="round" />
        <path d="M-120,-60 C-40,-60 -20,40 60,40 C100,40 110,10 110,-10" stroke="#ffe9a8" strokeWidth={18} fill="none" opacity={0.7} />
        {[...Array(6)].map((_, k) => { const u = mod(t * 0.9 + k / 6, 1); const x = lerp(-120, 110, u), y = -60 + 100 * Math.sin(u * 3); return <path key={k} d={`M${x},${y - 14} l-8,12 l10,0 l-8,14`} stroke={C.purple} strokeWidth={4} fill="none" filter="url(#glow)" />; })}
        <Txt x={0} y={130} size={22} color={C.purple}>CANAL CON GEL</Txt>
      </g>
      <Pill x={px - 20} y={py - 150} text="AMPOLLAS DE LORENZINI" color={C.purple} size={24} s={pop(t, d * 0.35)} />
    </Stage>
  );
};

// 18 · Campos eléctricos de seres vivos (latido)
const s18 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const beat = (tt) => { const ph = mod(tt, 0.9); return ph < 0.12 ? Math.sin((ph / 0.12) * Math.PI) : 0; };
  const field = (cx, cy, s, ph) => [...Array(5)].map((_, k) => { const r = 40 + k * 45 + 25 * beat(t + ph); return <g key={k} opacity={(0.9 - k * 0.15) * (0.4 + 0.6 * beat(t + ph))}><ellipse cx={cx - r * 0.6 * s} cy={cy} rx={r * 0.6 * s} ry={r * 0.45 * s} fill="none" stroke={C.purple} strokeWidth={4} /><ellipse cx={cx + r * 0.6 * s} cy={cy} rx={r * 0.6 * s} ry={r * 0.45 * s} fill="none" stroke={C.purple} strokeWidth={4} /></g>; });
  const sand = [...Array(30)].map((_, k) => { const R = rng(k); return <circle key={k} cx={760 + R() * 300} cy={880 + R() * 30 - beat(t) * 6 * R()} r={4} fill="#e3c27a" />; });
  const shx = lerp(-400, 300, ramp(t, d * 0.75, d));
  return (
    <Stage {...p} env={{ theme: 'blue', seabed: 890 }} cam={{ keys: [[0, 900, 760, 1.6, -1], [2.7, 920, 820, 2.0, 1.5], [5.4, 1100, 760, 1.4, -2], [8.1, 1400, 780, 1.7, 1], [10.8, 1100, 720, 1.25, -1], [d, 700, 700, 1.3, 1]] }}>
      <Fish x={900} y={880} s={2} t={t} seed={10} color="#ffb347" wag={0.6} rot={-5} />
      <path d="M720,900 C800,860 1000,860 1080,900Z" fill={C.sand} />
      {sand}
      {field(900, 880, 1.4, 0)}
      <path d={`M905,870 c-10,-14 -30,-6 -20,8 l20,18 l20,-18 c10,-14 -10,-22 -20,-8Z`} fill={C.red} transform={`translate(0 0) scale(${1 + 0.3 * beat(t)})`} style={{ transformOrigin: '905px 880px' }} />
      <g opacity={ramp(t, d * 0.45, d * 0.55)}>
        <g transform={`translate(1450 840) scale(1.1)`}><ellipse rx={60} ry={34} fill="#d35400" stroke="#6e2c00" strokeWidth={4} />{[...Array(4)].map((_, k) => <path key={k} d={`M${-40 + k * 26},20 l${-10 + 20 * Math.sin(t * 6 + k)},40`} stroke="#d35400" strokeWidth={8} />)}<circle cx={-20} cy={-30} r={6} fill="#111" /><circle cx={20} cy={-30} r={6} fill="#111" /></g>
        {field(1450, 840, 1.2, 0.3)}
        <Pill x={1450} y={680} text="TODOS LOS SERES VIVOS" color={C.purple} size={30} s={pop(t, d * 0.5)} />
      </g>
      <Shark x={shx} y={640} s={0.7} t={t} seed={23} speed={0.6} ampGlow={1} rot={8} />
      <Pill x={900} y={660} text="LATIDO = ELECTRICIDAD" color={C.red} size={32} s={pop(t, d * 0.25)} />
    </Stage>
  );
};

// 19 · Ataque final guiado por electricidad
const s19 = (p) => {
  const { t } = p; const d = p.frames / 30; const ts = d * 0.65;
  const u = ramp(t, 0, ts);
  const shx = lerp(200, 980, ease(u)), shy = lerp(420, 790, ease(u));
  const blast = t > ts;
  const R = rng(19);
  return (
    <Stage {...p} env={{ theme: 'blue', seabed: 900 }} light={(tt) => 1 + 0.4 * Math.max(0, 1 - Math.abs(tt - ts) * 4)}
      cam={{ keys: [[0, 600, 560, 1.3, -2], [2.5, 800, 680, 1.6, 1], [ts, 1000, 800, 2.0, -1], [ts + 1.2, 1050, 760, 1.5, 2], [d, 1000, 700, 1.3, 0]], shake: (tt) => Math.max(0, 1 - Math.abs(tt - ts) * 2.5) }}>
      {[...Array(4)].map((_, k) => <ellipse key={k} cx={1150} cy={890} rx={60 + k * 70 + 15 * Math.sin(t * 6)} ry={30 + k * 34} fill="none" stroke={C.purple} strokeWidth={4} opacity={blast ? 0 : 0.7 - k * 0.15} />)}
      {!blast && <Fish x={1150} y={895} s={1.3} t={t} seed={11} color="#ffb347" opacity={0.5} />}
      <Shark x={shx} y={shy} s={0.85} rot={lerp(25, 30, u)} t={t} seed={24} speed={1.4} eyeRoll={ramp(t, ts - 1.5, ts - 1)} mouth={ramp(t, ts - 0.6, ts)} ampGlow={1} />
      <Shadow x={shx} groundY={900} y={shy} size={280} />
      {blast && [...Array(60)].map((_, k) => { const a = -Math.PI * (0.1 + R() * 0.8), v = 300 + R() * 600, uu = t - ts; return <circle key={k} cx={1150 + Math.cos(a) * v * uu} cy={890 + Math.sin(a) * v * uu + 500 * uu * uu} r={5 + R() * 8} fill="#e3c27a" opacity={Math.max(0, 1 - uu / 2)} />; })}
      <Pill x={700} y={300} text="LOS ÚLTIMOS CENTÍMETROS" color={C.purple} size={32} s={pop(t, 1)} />
    </Stage>
  );
};

// 20 · Radar por capas (vista cenital)
const s20 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const cx = 1100, cy = 560;
  const rings = [[460, 'OÍDO Y OLFATO', C.cyan, 0.2], [310, 'LÍNEA LATERAL Y VISTA', C.green, 0.45], [160, 'ELECTRICIDAD', C.purple, 0.7]];
  const prog = ramp(t, d * 0.12, d * 0.85);
  const sr = lerp(620, 60, prog); const sa = -2.6 + t * 0.15;
  const sweep = t * 1.6;
  return (
    <Stage {...p} env={{ theme: 'dark', rays: false, fish: false }} cam={{ keys: [[0, cx, cy, 1.1, 0], [2.6, cx - 150, cy - 40, 1.4, -2], [5.3, cx - 60, cy, 1.25, 2], [7.9, cx, cy + 20, 1.6, -1], [10.4, cx + 40, cy, 1.9, 1], [d, cx, cy, 1.3, 0]] }}>
      <circle cx={cx} cy={cy} r={600} fill="#06210f" opacity={0.7} />
      {[...Array(6)].map((_, k) => <circle key={k} cx={cx} cy={cy} r={100 * (k + 1)} fill="none" stroke="#1f6a3a" strokeWidth={2} />)}
      <path d={`M${cx},${cy} L${cx + 600 * Math.cos(sweep)},${cy + 600 * Math.sin(sweep)} A600,600 0 0,0 ${cx + 600 * Math.cos(sweep - 0.5)},${cy + 600 * Math.sin(sweep - 0.5)} Z`} fill="#3cff8a" opacity={0.18} />
      {rings.map(([r, n, c, fr], k) => { const on = ramp(t, d * fr, d * fr + 0.5); return <g key={k}><circle cx={cx} cy={cy} r={r} fill="none" stroke={c} strokeWidth={4 + 6 * on} opacity={0.35 + 0.65 * on} filter={on ? 'url(#glow)' : undefined} /><Pill x={cx - r * 0.72 - 120} y={cy - r * 0.72} text={n} size={26} color={c} s={pop(t, d * fr)} /></g>; })}
      <Fish x={cx} y={cy} s={0.9} t={t} seed={12} color="#ffd166" />
      <circle cx={cx} cy={cy} r={20 + 15 * Math.abs(Math.sin(t * 4))} fill="none" stroke="#ffd166" strokeWidth={3} />
      <Shark x={cx + sr * Math.cos(sa)} y={cy + sr * Math.sin(sa)} s={0.32} rot={(sa * 180) / Math.PI + 180} t={t} seed={25} speed={1} />
    </Stage>
  );
};

// 21 · Boca de frente: filas de dientes
const s21 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const open = seg(t, d * 0.15, d * 0.35);
  const teeth = [];
  for (let row = 0; row < 3; row++) for (let k = 0; k < 13; k++) {
    const x = 960 + (k - 6) * 46 * (1 - row * 0.08), s = pop(t, d * 0.3 + (row * 13 + k) * 0.03, 0.3);
    teeth.push(<path key={'u' + row + k} d="M-17,0 L17,0 L0,46Z" transform={`translate(${x} ${470 + row * 22 - (1 - open) * 60}) scale(${s})`} fill="#fff" opacity={1 - row * 0.25} stroke="#aaa" strokeWidth={1.5} />);
    teeth.push(<path key={'l' + row + k} d="M-17,0 L17,0 L0,-46Z" transform={`translate(${x} ${720 - row * 22 + (1 - open) * 60}) scale(${s})`} fill="#fff" opacity={1 - row * 0.25} stroke="#aaa" strokeWidth={1.5} />);
  }
  const bl = Math.max(0, Math.sin(t * 2.3) > 0.97 ? 1 : 0);
  return (
    <Stage {...p} env={{ theme: 'blue' }} cam={{ keys: [[0, 960, 540, 1.0, 0], [2.4, 960, 520, 1.2, -2], [4.8, 960, 560, 1.4, 1.5], [d, 960, 600, 1.75, -1]] }}>
      <ellipse cx={960} cy={560 + 6 * Math.sin(t * 2)} rx={440} ry={360} fill={C.sharkTop} stroke={C.line} strokeWidth={8} />
      <ellipse cx={960} cy={720} rx={330} ry={180} fill={C.sharkBelly} />
      {[-1, 1].map((sg) => <g key={sg}><circle cx={960 + sg * 300} cy={400} r={30} fill="#0b0f18" /><circle cx={960 + sg * 300 + 8} cy={392} r={9} fill="#fff" /><rect x={960 + sg * 300 - 34} y={366} width={68} height={68 * bl} fill={C.sharkTop} /></g>)}
      <ellipse cx={960} cy={595} rx={330} ry={20 + 150 * open} fill="#5a1a22" stroke="#2a0a10" strokeWidth={6} />
      {teeth}
      <Counter x={960} y={250} t={t} t0={d * 0.3} t1={d * 0.85} v1={300} size={80} color={C.gold} suffix=" DIENTES" />
    </Stage>
  );
};

// 22 · Diente aserrado: lupa y corte
const s22 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const spin = Math.cos(t * 1.4);
  const cut = ramp(t, d * 0.6, d * 0.85);
  const saw = [...Array(12)].map((_, k) => <path key={k} d="M0,0 l14,-6 l-2,22Z" transform={`translate(${-150 + k * 25 * (k < 6 ? 1 : 1)} ${0})`} />);
  return (
    <Stage {...p} env={{ theme: 'blue', rays: true }} cam={{ keys: [[0, 700, 540, 1.2, -1], [2.5, 640, 500, 1.7, 2], [4.9, 900, 560, 1.3, -2], [7, 1300, 560, 1.6, 1], [d, 1200, 540, 1.3, 0]] }}>
      <g transform={`translate(640 500) scale(${0.25 + 0.75 * Math.abs(spin)} 1)`}>
        <path d="M-160,-200 L160,-200 L0,240Z" fill="#f4f1e8" stroke="#b8b2a0" strokeWidth={6} />
        {[...Array(12)].map((_, k) => { const u = k / 12; return <g key={k}><path d={`M${-160 * (1 - u)},${-200 + 440 * u} l-14,8 l10,18Z`} fill="#e6e0cf" stroke="#b8b2a0" strokeWidth={2} /><path d={`M${160 * (1 - u)},${-200 + 440 * u} l14,8 l-10,18Z`} fill="#e6e0cf" stroke="#b8b2a0" strokeWidth={2} /></g>; })}
      </g>
      <g opacity={ramp(t, d * 0.25, d * 0.35)} transform={`translate(${640 + 90} ${500 + 40})`}>
        <circle r={95} fill="none" stroke={C.gold} strokeWidth={10} /><line x1={68} y1={68} x2={150} y2={150} stroke={C.gold} strokeWidth={18} strokeLinecap="round" />
      </g>
      <Pill x={640} y={200} text="BORDES ASERRADOS" s={pop(t, d * 0.3)} />
      <g transform="translate(1320 560)">
        <path d={`M-200,0 C-150,-90 150,-90 200,0 C150,90 -150,90 -200,0Z`} fill="#f2a28c" stroke="#a05a48" strokeWidth={5} transform={`translate(0 ${cut * 40}) `} clipPath="" />
        <g transform={`translate(0 ${-cut * 50}) rotate(${-cut * 8})`}><path d="M-200,0 C-150,-90 150,-90 200,0Z" fill="#f2a28c" stroke="#a05a48" strokeWidth={5} /></g>
        <g transform={`translate(${lerp(260, -260, cut)} ${-10 + 12 * Math.sin(t * 20) * (cut > 0 && cut < 1 ? 1 : 0)})`}>
          <path d="M-60,-120 L60,-120 L0,40Z" fill="#f4f1e8" stroke="#b8b2a0" strokeWidth={4} />
        </g>
        <Pill x={0} y={-200} text="CORTA, NO MASTICA" color={C.red} size={32} s={pop(t, d * 0.65)} />
      </g>
    </Stage>
  );
};

// 23 · Cinta transportadora de dientes
const s23 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const adv = seg(t, d * 0.5, d * 0.75);
  const fall = ramp(t, d * 0.4, d * 0.55);
  const slot = (q) => { const qq = cl(q, 0, 3); return [560 - qq * 85, -qq * 30, 1 - qq * 0.15]; }; // y, ángulo, escala
  const teeth = [];
  for (let r = 0; r < 5; r++) {
    const [y, ang, sc] = slot(r - adv - (r === 0 ? 0 : 0));
    for (let k = 0; k < 7; k++) {
      const x = 420 + k * 180;
      const lost = r === 0 && k === 3;
      if (r === 0 && k !== 3 && adv > 0.5) continue;
      const off = lost ? fall : 0;
      const yy = r === 0 ? 560 : 560 + (r - adv) * 85;
      teeth.push(<g key={r + '_' + k} transform={`translate(${x + off * 160} ${yy - off * 260 + off * off * 700}) rotate(${(r === 0 ? 0 : -(r - adv) * 30) + off * 420}) scale(${r === 0 ? 1 : 1 - (r - adv) * 0.15})`} opacity={r === 0 && !lost ? 1 - ramp(t, d * 0.5, d * 0.6) : 1}>
        <path d="M-42,0 L42,0 L0,-120Z" fill="#fff" stroke="#bbb" strokeWidth={3} /></g>);
    }
  }
  return (
    <Stage {...p} env={{ theme: 'blue', rays: true }} cam={{ keys: [[0, 960, 600, 1.1, 0], [2.6, 960, 560, 1.4, -2], [5.2, 980, 520, 1.75, 1], [7.8, 900, 600, 1.3, -1.5], [d, 960, 600, 1.2, 1]] }}>
      <rect x={260} y={560} width={1400} height={420} rx={120} fill="#c85a6a" stroke="#7a2a36" strokeWidth={7} />
      {teeth}
      {[0, 1, 2].map((k) => <path key={k} d={`M${1700},${880 - k * 85} l0,-70 l-16,20 m16,-20 l16,20`} stroke={C.gold} strokeWidth={7} fill="none" opacity={adv > 0 && adv < 1 ? 1 : 0.4} />)}
      <Pill x={960} y={250} text="EL DE ATRÁS AVANZA" size={36} s={pop(t, d * 0.55)} />
    </Stage>
  );
};

// 24 · Miles de dientes en su vida: lluvia que forma un montón
const s24 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const R = rng(24);
  const teeth = [...Array(110)].map((_, k) => {
    const t0 = R() * d * 0.75, x = 560 + R() * 800, rest = 900 - Math.max(0, (1 - Math.abs(x - 960) / 420)) * 190 * ramp(t, 0, d) - R() * 30;
    const u = t - t0; if (u < 0) return null;
    const y = Math.min(rest, -60 + 1400 * u * u);
    return <path key={k} d="M-12,0 L12,0 L0,-30Z" transform={`translate(${x} ${y}) rotate(${y < rest ? u * 500 + k * 30 : k * 30})`} fill="#fff" stroke="#bbb" strokeWidth={1.5} />;
  });
  return (
    <Stage {...p} env={{ theme: 'blue', seabed: 920 }} cam={{ keys: [[0, 960, 520, 1.15, -2], [2.5, 960, 600, 1.3, 2], [d, 960, 560, 1.1, -1]] }}>
      {teeth}
      <Counter x={960} y={420} t={t} t0={0.3} t1={d * 0.8} v1={30000} size={140} color="#fff" />
      <Txt x={960} y={500} s={pop(t, d * 0.5)} size={48} color={C.gold}>DIENTES EN SU VIDA</Txt>
    </Stage>
  );
};

// 25 · Mandíbula protráctil
const s25 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const tb = d * 0.5;
  const jaw = ramp(t, tb - 0.5, tb) * (1 - ramp(t, tb + 1.2, tb + 2));
  const mouth = Math.max(ramp(t, tb - 1, tb - 0.4), 0) * (1 - ramp(t, tb + 0.1, tb + 0.3) * 0.7);
  const S = 2.0, shx = 640;
  return (
    <Stage {...p} env={{ theme: 'blue' }} light={(tt) => 1 + 0.35 * Math.max(0, 1 - Math.abs(tt - tb) * 5)} cam={{ keys: [[0, 960, 540, 1.2, 2], [2.4, shx + 250 * S, 560, 1.8, -1], [tb, shx + 280 * S, 570, 2.3, 1], [tb + 1.5, shx + 200 * S, 560, 1.6, -2], [d, 1000, 540, 1.3, 0]], shake: (tt) => Math.max(0, 1 - Math.abs(tt - tb) * 3) }}>
      {[0.25, 0.5].map((g, k) => <g key={k} opacity={jaw * 0.25}><Shark x={shx} y={540} s={S} t={t} seed={26} speed={0.5} mouth={mouth} jaw={jaw * g} /></g>)}
      <Shark x={shx} y={540} s={S} t={t} seed={26} speed={0.5} mouth={mouth} jaw={jaw} />
      <path d={`M${shx + 330 * S},${520} l${70 * jaw},0`} stroke={C.gold} strokeWidth={10} opacity={jaw} />
      <path d={`M${shx + 330 * S + 70 * jaw},500 l20,20 l-20,20`} stroke={C.gold} strokeWidth={10} fill="none" opacity={jaw} />
      <Pill x={shx + 260 * S} y={300} text="LA MANDÍBULA SALE HACIA ADELANTE" size={28} s={pop(t, tb + 0.2)} />
    </Stage>
  );
};

// 26 · Ojos que giran para protegerse
const s26 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const roll = seg(t, d * 0.5, d * 0.6);
  const claw = lerp(1600, 1180, ease(ramp(t, d * 0.3, d * 0.62))) + (t > d * 0.62 ? 20 * Math.sin(t * 20) : 0);
  return (
    <Stage {...p} env={{ theme: 'blue', rays: true }} cam={{ keys: [[0, 960, 540, 1.1, -1], [2.5, 1000, 540, 1.5, 2], [d * 0.55, 960, 540, 1.9, -1], [d * 0.8, 1050, 560, 1.6, 1.5], [d, 960, 540, 1.25, 0]], shake: (tt) => (tt > d * 0.62 && tt < d * 0.75 ? 0.5 : 0) }}>
      <circle cx={960} cy={540} r={280} fill={C.sharkTop} stroke={C.line} strokeWidth={10} />
      <circle cx={960} cy={540} r={190} fill="#f0f0f0" stroke="#22344a" strokeWidth={6} />
      <g transform={`translate(${960 - roll * 40} ${540 + roll * 260})`} opacity={1 - roll}><circle r={110} fill="#0b0f18" /><circle cx={30} cy={-30} r={26} fill="#fff" /></g>
      <path d={`M770,${540 - 190 * (1 - roll * 0.1)} A190,190 0 0,1 1150,540`} fill="none" />
      <g transform={`translate(${claw} 470) rotate(-20)`}>
        <path d="M0,0 C80,-60 260,-40 380,20 L380,120 C260,80 80,90 0,60Z" fill="#7d6b58" stroke="#3b2f24" strokeWidth={5} />
        {[0, 1, 2].map((k) => <path key={k} d={`M${-10},${8 + k * 22} l-40,-10 l36,22Z`} fill="#eee" stroke="#555" strokeWidth={2} />)}
      </g>
      {t > d * 0.62 && [...Array(6)].map((_, k) => <line key={k} x1={1100} y1={480 + k * 10} x2={1060 - 40 * Math.abs(Math.sin(t * 8 + k))} y2={470 + k * 14} stroke="#fff" strokeWidth={4} />)}
      <Pill x={960} y={180} text="OJOS A SALVO" color={C.gold} s={pop(t, d * 0.62)} />
    </Stage>
  );
};

// 27 · Mapa: isla de focas en Sudáfrica (vista cenital)
const s27 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const R = rng(27);
  const coast = 'M-400,-200 L1500,-200 L1500,300 C1350,330 1250,420 1180,520 C1100,640 960,700 820,680 C680,660 560,560 430,560 C300,560 150,520 -400,560Z';
  const isl = [1250, 760];
  const seals = [...Array(30)].map((_, k) => <ellipse key={k} cx={isl[0] - 50 + R() * 100 + 3 * Math.sin(t * 3 + k)} cy={isl[1] - 22 + R() * 44} rx={7} ry={4} fill="#5a4a3a" />);
  const fins = [...Array(5)].map((_, k) => { const a = t * 0.8 + k * 1.25; const r = 150 + 20 * Math.sin(t + k); return <path key={k} d="M0,0 L-10,-26 L-22,0Z" fill="#2c3e50" transform={`translate(${isl[0] + Math.cos(a) * r} ${isl[1] + Math.sin(a) * r * 0.6}) rotate(${(a * 180) / Math.PI + 90})`} opacity={ramp(t, d * 0.6, d * 0.7)} />; });
  const waves = [...Array(10)].map((_, k) => { const u = mod(t * 0.3 + k / 10, 1); return <path key={k} d={`M${200 + k * 140},${620 + u * 120} q30,-10 60,0`} stroke="#e8f7ff" strokeWidth={4} fill="none" opacity={1 - u} />; });
  return (
    <Stage {...p} env={{ theme: 'map', rays: false, ridges: false, fish: false }} cam={{ keys: [[0, 700, 450, 1.0, 0], [2.6, 900, 560, 1.25, -2], [5.2, isl[0], isl[1], 2.2, 1], [7.8, isl[0] + 40, isl[1] - 20, 2.6, -1.5], [d, isl[0], isl[1], 2.0, 1]] }}>
      <path d={coast} fill="#c9a86a" stroke="#8b6e3c" strokeWidth={6} />
      <path d={coast} fill="none" stroke="#e8f7ff" strokeWidth={14} opacity={0.3 + 0.2 * Math.sin(t * 2)} />
      {waves}
      <Txt x={500} y={250} size={60} color="#fff">SUDÁFRICA</Txt>
      <ellipse cx={isl[0]} cy={isl[1]} rx={70} ry={38} fill="#e7d3a1" stroke="#8b6e3c" strokeWidth={4} />
      {seals}{fins}
      <Pill x={isl[0]} y={isl[1] - 90} text="MILES DE FOCAS" size={22} s={pop(t, d * 0.42)} />
      <Pill x={isl[0]} y={isl[1] + 100} text="CADA INVIERNO" color={C.cyan} size={22} s={pop(t, d * 0.7)} />
    </Stage>
  );
};

// 28 · Emboscada desde abajo: silueta contra la luz
const s28 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const sx = lerp(300, 1500, t / d);
  return (
    <Stage {...p} env={{ theme: 'light', surface: 120, fish: false }} light={(tt) => 1.0 - 0.15 * Math.sin(tt * 0.8)} lightX={() => 960 + 300 * Math.sin(t * 0.3)}
      cam={{ keys: [[0, 960, 820, 1.4, 3], [2.6, 900, 620, 1.2, -2], [5.2, sx, 300, 1.6, 1], [7.8, 1100, 500, 1.3, -1], [d, 1000, 700, 1.5, 2]] }}
      back={<g>{[...Array(9)].map((_, k) => <polygon key={k} points={`${700 + k * 60},100 ${740 + k * 60},100 ${500 + k * 120},1200 ${400 + k * 120},1200`} fill="#fffbe0" opacity={0.08 + 0.05 * Math.sin(t * 2 + k)} />)}</g>}>
      <circle cx={960 + 300 * Math.sin(t * 0.3)} cy={60} r={160} fill="#fffbe6" opacity={0.6} filter="url(#blur14)" />
      <Seal x={sx} y={150} s={1.4} t={t} silhouette />
      <rect x={-600} y={850} width={3200} height={600} fill="#020a18" opacity={0.85} />
      <Shark x={lerp(500, 900, t / d)} y={lerp(980, 900, t / d)} s={1.1} rot={-12} t={t} seed={27} speed={0.5} tint="#2a3846" opacity={0.85} />
      <Pill x={sx} y={300} text="SILUETA CONTRA EL CIELO" s={pop(t, d * 0.55)} />
    </Stage>
  );
};

// 29 · Vista desde arriba: camuflaje
const s29 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const reveal = ramp(t, d * 0.45, d * 0.55) * (1 - ramp(t, d * 0.8, d * 0.9));
  const shx = lerp(300, 1500, t / d);
  const R = rng(29);
  const tex = [...Array(70)].map((_, k) => { const x = mod(R() * 2400 + t * 25, 2400) - 240, y = R() * 1200; return <path key={k} d={`M${x},${y} q40,-14 80,0 q40,14 80,0`} stroke="#3c6e8f" strokeWidth={4} fill="none" opacity={0.5} />; });
  return (
    <Stage {...p} env={{ custom: (cam) => <rect x={-200} y={-200} width={2400} height={1500} fill="#163a57" />, rays: false }}
      cam={{ keys: [[0, 960, 540, 1.1, 0], [2.4, 800, 500, 1.4, 3], [4.8, shx, 560, 1.7, -2], [7.2, shx + 100, 560, 1.3, 1], [d, 1100, 540, 1.2, -1]] }}>
      {tex}
      <g transform={`translate(${shx} 560) rotate(-90) scale(1.1)`} opacity={0.32 + 0.45 * reveal}>
        <path d="M0,-300 C70,-220 80,0 50,180 L0,260 L-50,180 C-80,0 -70,-220 0,-300Z" fill="#1d3346" stroke={reveal ? C.gold : 'none'} strokeWidth={6} strokeDasharray="20 12" transform={`rotate(${4 * Math.sin(t * 4)})`} />
        <path d="M40,-40 L170,40 L45,10Z M-40,-40 L-170,40 L-45,10Z" fill="#1d3346" />
      </g>
      {[...Array(20)].map((_, k) => <circle key={k} cx={mod(k * 137 + t * 40, 2000)} cy={mod(k * 89 + t * 15, 1100)} r={30 + (k % 4) * 10} fill="#fff" opacity={0.03} />)}
      <Seal x={1300} y={260} s={0.9} t={t} look={Math.sin(t * 1.5)} />
      <path d={`M1360,290 L${1100 + 300 * Math.sin(t * 1.5)},900 L${1500 + 300 * Math.sin(t * 1.5)},900Z`} fill="#fffbe0" opacity={0.08} />
      <Txt x={1600} y={260} size={110} color="#fff" s={pop(t, d * 0.3)}>?</Txt>
      <Pill x={700} y={200} text="CAMUFLAJE PERFECTO" s={pop(t, d * 0.6)} />
    </Stage>
  );
};

// 30 · Aceleración vertical + velocímetro
const s30 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const v = 37 * eo(ramp(t, d * 0.15, d * 0.8));
  const y = lerp(1300, 200, ease(ramp(t, 0.2, d)));
  const a = Math.PI - (Math.PI * v) / 45;
  return (
    <Stage {...p} env={{ theme: 'dusk' }} cam={{ focus: (tt) => [700, lerp(1300, 200, ease(ramp(tt, 0.2, d))) + 100], zamt: 0.6 }}
      hud={() => (<g transform="translate(1450 650)">
        <path d="M-260,0 A260,260 0 0,1 260,0" stroke="#fff" strokeWidth={14} fill="none" />
        <path d={`M-260,0 A260,260 0 0,1 ${260 * Math.cos(a)},${-260 * Math.sin(a)}`} stroke={C.red} strokeWidth={14} fill="none" />
        {[...Array(10)].map((_, k) => { const b = Math.PI - (k * Math.PI) / 9; return <line key={k} x1={230 * Math.cos(b)} y1={-230 * Math.sin(b)} x2={258 * Math.cos(b)} y2={-258 * Math.sin(b)} stroke="#fff" strokeWidth={5} />; })}
        <line x1={0} y1={0} x2={220 * Math.cos(a)} y2={-220 * Math.sin(a)} stroke={C.gold} strokeWidth={12} strokeLinecap="round" />
        <circle r={20} fill={C.gold} />
        <text x={0} y={110} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={84} fill={C.gold} stroke="#000" strokeWidth={8} paintOrder="stroke">{Math.round(v)} km/h</text>
      </g>)}>
      {[...Array(30)].map((_, k) => { const R = rng(k); const x = 300 + R() * 800, yy = mod(R() * 1600 + t * 1400 * (v / 37), 1600) - 300 + y - 500; return <line key={k} x1={x} y1={yy} x2={x} y2={yy + 120} stroke="#fff" strokeWidth={3} opacity={0.4 * (v / 37)} />; })}
      <Shark x={700} y={y} s={0.95} rot={-88} t={t} seed={28} speed={0.8 + v / 20} />
      <BubbleTrail t={t} pts={(u, k) => [700 + 20 * Math.sin(k), y + 320 + u * 400]} n={24} />
    </Stage>
  );
};

// 31 · Salto en cámara lenta, vista a ras del agua
const s31 = (p) => {
  const { t } = p; const d = p.frames / 30;
  const tb = d * 0.35;
  // tiempo deformado: cámara lenta alrededor del salto
  const slow = (tt) => (tt < tb ? tt : tb + (tt - tb) * 0.35);
  const tt = slow(t);
  const u = cl((tt - tb + 1) / 3.2);
  const x = lerp(700, 1300, u), y = 540 - 620 * Math.sin(u * Math.PI) + 200, rot = lerp(-60, 50, u);
  return (
    <Stage {...p} env={{ theme: 'dusk', surface: 600 }} light={(t2) => 1 + 0.25 * Math.max(0, 1 - Math.abs(t2 - tb) * 2)}
      cam={{ keys: [[0, 900, 620, 1.3, -4], [2.4, 960, 560, 1.2, 3], [tb + 0.5, 1000, 420, 1.45, -3], [tb + 3, 1150, 380, 1.7, 4], [d, 1150, 520, 1.25, -2]], shake: (t2) => Math.max(0, 1 - Math.abs(t2 - tb) * 3) * 0.6 }}>
      {u > 0 && <g><Shark x={x} y={y} s={1.0} rot={rot} t={tt} seed={29} speed={1.5} mouth={1} />
        <Seal x={x + Math.cos((rot * Math.PI) / 180) * 300} y={y + Math.sin((rot * Math.PI) / 180) * 300} s={0.6} rot={rot + 80} t={t} paddle={2.5} /></g>}
      {u <= 0 && <Seal x={980} y={620} s={0.9} t={t} />}
      <Splash x={900} y={600} t={tt} t0={tb - 0.6} power={1.3} seed={31} n={70} />
      <Splash x={1350} y={600} t={tt} t0={tb + 2.4} power={1} seed={33} n={50} />
      <Pill x={960} y={180} text="¡FUERA DEL AGUA!" color={C.gold} s={pop(t, tb + 0.6)} rot={-4} />
    </Stage>
  );
};

export const S2 = [s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31];
