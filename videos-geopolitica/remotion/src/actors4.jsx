// Personajes y escenarios de v18: gato (con mitades que giran por separado), casa, ciudad, oído, columna, patinadora, cámara antigua, avión.
import React from 'react';
import { C, W, H, blink, rng, pathPts, lerp, cl, mod, layerT } from './lib.jsx';

const INK = '#3a2412';
// ---------------------------------------------------------------- gato (vista lateral, mirando a la derecha)
// rollF / rollB: giro de cada mitad sobre la columna (0 = patas abajo, PI = patas arriba)
// tuckF / tuckB: 0 patas estiradas, 1 encogidas · spread: patas abiertas tipo paracaídas · walk: ciclo de marcha
export function Cat({ x = 0, y = 0, s = 1, rot = 0, flip = false, t, seed = 1, rollF = 0, rollB, headRoll, tuckF = 0, tuckB = 0, spread = 0, walk = 0, arch = 0, color = '#f0a24a', stripe = '#c0661c', belly = '#fde3c0', eye = '#7ad35a', mouth = 0, opacity = 1, look = 0, sleep = 0, kit = 0 }) {
  const rb = rollB ?? rollF, rh = headRoll ?? rollF;
  const bl = sleep > 0.5 ? 1 : blink(t, seed, 2.9);
  const br = 1 + 0.025 * Math.sin(t * 2.4 + seed);
  const ph = t * 7 * walk + seed;
  const leg = (bx, k, back, tuck) => {
    const sw = walk > 0 ? 28 * Math.sin(ph + k * Math.PI + (back ? 1.6 : 0)) : 4 * Math.sin(t * 2 + k);
    const ex = [bx + (back ? -8 : 8) + sw, 105 - (walk > 0 ? 8 * Math.max(0, Math.sin(ph + k * Math.PI)) : 0)];
    const tk = [bx + (back ? 34 : 30), 38];
    const sp = [bx + (back ? -95 : 95), 34 + 10 * Math.sin(t * 9 + k)];
    let fx = lerp(ex[0], tk[0], tuck), fy = lerp(ex[1], tk[1], tuck);
    fx = lerp(fx, sp[0], spread); fy = lerp(fy, sp[1], spread);
    const kx = lerp(bx, fx, 0.5) + (back ? -14 : 10) * (1 - spread), ky = lerp(18, fy, 0.5);
    return <g key={k + (back ? 'b' : 'f')}><path d={`M${bx},18 Q${kx},${ky} ${fx},${fy}`} stroke={INK} strokeWidth={30} strokeLinecap="round" fill="none" /><path d={`M${bx},18 Q${kx},${ky} ${fx},${fy}`} stroke={k ? color : '#e3913a'} strokeWidth={23} strokeLinecap="round" fill="none" /><ellipse cx={fx} cy={fy + 2} rx={14} ry={9} fill={belly} stroke={INK} strokeWidth={3} /></g>;
  };
  const sq = (r, m) => { const c = Math.cos(r); return (c < 0 ? -1 : 1) * Math.max(m, Math.abs(c)); };
  const half = (roll, back, children) => <g transform={`scale(1 ${sq(roll, 0.28)})`}>{children}</g>;
  const tw = Math.abs(Math.sin((rollF - rb) / 2)); // pliegue de la cintura cuando las mitades no coinciden
  const tailW = t * 2.2 + seed;
  const tail = [...Array(10)].map((_, k) => { const u = k / 9; return [-125 - u * 150, -10 - u * 70 * (1 - spread * 0.6) + 30 * Math.sin(tailW - u * 2.4) * u]; });
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${flip ? -s : s} ${s})`} opacity={opacity}>
      <path d={pathPts(tail)} stroke={INK} strokeWidth={28} strokeLinecap="round" fill="none" />
      <path d={pathPts(tail)} stroke={color} strokeWidth={21} strokeLinecap="round" fill="none" />
      {tail.filter((_, k) => k % 3 === 2).map((p, k) => <circle key={k} cx={p[0]} cy={p[1]} r={9} fill={stripe} />)}
      {half(rb, true, <g>
        {leg(-80, 0, true, tuckB)}
        <path d={`M0,${-48 * br - arch * 30} C-60,${-56 - arch * 40} -130,-54 -138,-10 C-142,30 -100,44 -40,44 L0,44Z`} fill={color} stroke={INK} strokeWidth={5} />
        <path d={`M-20,${-46 - arch * 30} C-40,-30 -110,-20 -132,-4`} stroke={belly} strokeWidth={0} fill="none" />
        <path d="M-120,30 C-80,46 -30,46 0,42" stroke={belly} strokeWidth={14} fill="none" strokeLinecap="round" />
        {[-30, -60, -90, -115].map((sx, k) => <path key={k} d={`M${sx},${-50 - arch * 28 + Math.abs(sx) * 0.05} q-8,22 -4,40`} stroke={stripe} strokeWidth={9} strokeLinecap="round" fill="none" />)}
        {leg(-100, 1, true, tuckB)}
      </g>)}
      {half(rollF, false, <g>
        {leg(70, 0, false, tuckF)}
        <path d={`M-4,${-48 * br - arch * 30} C50,${-58 - arch * 20} 120,-60 130,-14 C136,26 100,46 50,46 L-4,44Z`} fill={color} stroke={INK} strokeWidth={5} />
        <path d="M10,40 C50,48 100,40 122,16" stroke={belly} strokeWidth={16} fill="none" strokeLinecap="round" />
        {[20, 50, 80].map((sx, k) => <path key={k} d={`M${sx},${-52 - arch * 22} q8,22 4,40`} stroke={stripe} strokeWidth={9} strokeLinecap="round" fill="none" />)}
        {leg(100, 1, false, tuckF)}
      </g>)}
      {tw > 0.08 && <path d={`M-4,-44 Q${10 * tw},0 -4,44`} stroke={INK} strokeWidth={4 + 4 * tw} fill="none" opacity={0.6} />}
      <g transform={`translate(150 -42) scale(1 ${sq(rh, 0.5)}) rotate(${look * 20})`}>
        <path d="M-40,-28 L-34,-80 L-6,-40Z" fill={color} stroke={INK} strokeWidth={5} strokeLinejoin="round" /><path d="M-32,-36 L-30,-64 L-14,-40Z" fill="#f4a3a8" />
        <path d="M6,-40 L30,-82 L42,-30Z" fill={color} stroke={INK} strokeWidth={5} strokeLinejoin="round" /><path d="M14,-40 L28,-66 L34,-36Z" fill="#f4a3a8" />
        <ellipse cx={0} cy={0} rx={56} ry={48} fill={color} stroke={INK} strokeWidth={5} />
        <ellipse cx={18} cy={22} rx={34} ry={22} fill={belly} />
        {[-12, 4].map((sx, k) => <path key={k} d={`M${sx},-46 l4,18`} stroke={stripe} strokeWidth={7} strokeLinecap="round" />)}
        {[[-6, -6], [30, -6]].map(([ex, ey], k) => <g key={k} transform={`translate(${ex} ${ey})`}><ellipse rx={12} ry={15} fill={eye} stroke={INK} strokeWidth={3} /><ellipse cx={3} rx={4} ry={11} fill="#111" /><circle cx={5} cy={-6} r={3} fill="#fff" /><rect x={-14} y={-17} width={28} height={34 * bl} fill={color} /></g>)}
        <path d="M44,10 l10,-2 l-4,10Z" fill="#e57386" stroke={INK} strokeWidth={2} />
        <path d={`M50,20 q-8,${8 + mouth * 14} -18,${4 + mouth * 6} M50,20 q4,${8 + mouth * 10} 12,2`} stroke={INK} strokeWidth={3} fill={mouth > 0.2 ? '#7a2a2a' : 'none'} />
        {[-6, 4, 14].map((wy, k) => <path key={k} d={`M56,${14 + wy * 0.4} l${46},${wy - 4 + 2 * Math.sin(t * 3 + k)}`} stroke="#fff" strokeWidth={2.5} opacity={0.9} />)}
      </g>
    </g>
  );
}

// ---------------------------------------------------------------- escenarios
// Sala de una casa con ventana y cielo; parallax: pared lejana (0.25), cuadros (0.5)
export function RoomBack({ cam, t, seed = 1, wall = '#f3dcb8', night = 0 }) {
  const R = rng(seed);
  return (
    <g>
      <rect x={-200} y={-200} width={W + 400} height={H + 400} fill={wall} />
      <g transform={layerT(cam, 0.25)}>
        {[...Array(14)].map((_, k) => <rect key={k} x={-400 + k * 220} y={-200} width={110} height={1400} fill="#000" opacity={0.03} />)}
        <g transform="translate(1500 330)"><rect x={-230} y={-200} width={460} height={380} rx={10} fill={night ? '#1d2a4a' : '#9fd8f7'} stroke="#8a5a2a" strokeWidth={18} />
          <circle cx={120 - 30 * Math.sin(t * 0.2)} cy={-100} r={44} fill={night ? '#eef' : '#fff3c0'} />
          {[0, 1, 2].map((k) => <ellipse key={k} cx={-200 + mod(k * 170 + t * 25, 520)} cy={-60 + k * 50} rx={60} ry={18} fill="#fff" opacity={night ? 0.15 : 0.8} />)}
          <path d="M0,-200 L0,180 M-230,-10 L230,-10" stroke="#8a5a2a" strokeWidth={12} />
          <path d={`M-250,-220 Q${-200 + 20 * Math.sin(t)},0 -260,200`} stroke="#c0504a" strokeWidth={40} fill="none" opacity={0.85} /></g>
      </g>
      <g transform={layerT(cam, 0.5)}>
        <g transform="translate(420 300)"><rect x={-110} y={-80} width={220} height={160} fill="#fff" stroke="#6a4a2a" strokeWidth={12} /><circle cx={-20} cy={0} r={34} fill="#f0a24a" /><path d="M-40,-30 l6,-24 l14,18 M0,-30 l6,-24 l10,22" fill="#f0a24a" /></g>
        <g transform="translate(760 820)"><rect x={-260} y={-140} width={520} height={160} rx={30} fill="#5a7fb0" /><rect x={-290} y={-200} width={580} height={90} rx={40} fill="#6a8fc0" /></g>
      </g>
      <rect x={-1000} y={880} width={4000} height={600} fill="#b98a5a" />
      {[...Array(20)].map((_, k) => <rect key={k} x={-1000 + k * 200} y={880} width={4} height={600} fill="#8a5a2a" opacity={0.5} />)}
    </g>
  );
}
// Ciudad: cielo, edificios lejanos (0.2) y medios (0.45)
export function CityBack({ cam, t, seed = 1, dusk = 0 }) {
  const R = rng(seed);
  const b1 = [...Array(14)].map(() => [R() * 160 + 120, R() * 500 + 300]);
  const b2 = [...Array(10)].map(() => [R() * 220 + 180, R() * 400 + 380]);
  return (
    <g>
      <defs><linearGradient id={'city' + dusk} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={dusk ? '#f08a5a' : '#7cc4ef'} /><stop offset="1" stopColor={dusk ? '#ffd9a0' : '#e4f5ff'} /></linearGradient></defs>
      <rect x={-200} y={-200} width={W + 400} height={H + 400} fill={`url(#city${dusk})`} />
      {[0, 1, 2, 3].map((k) => <ellipse key={k} cx={mod(k * 600 + t * 18, 2600) - 300} cy={150 + k * 60} rx={130} ry={30} fill="#fff" opacity={0.7} />)}
      <g transform={layerT(cam, 0.2)}>{b1.reduce((acc, [w, h], k) => { const x = acc.x; acc.x += w + 20; acc.els.push(<rect key={k} x={x} y={1080 - h} width={w} height={h + 400} fill="#9fb4c8" />); return acc; }, { x: -800, els: [] }).els}</g>
      <g transform={layerT(cam, 0.45)}>{b2.reduce((acc, [w, h], k) => { const x = acc.x; acc.x += w + 60; acc.els.push(<g key={k}><rect x={x} y={1080 - h} width={w} height={h + 400} fill="#6f8aa6" />{[...Array(Math.floor(h / 70))].map((_, j) => [0, 1, 2].map((c) => <rect key={j + '-' + c} x={x + 20 + c * (w - 40) / 3} y={1100 - h + j * 70} width={(w - 40) / 3 - 14} height={34} fill={(j * 3 + c + k) % 5 ? '#cfe3f2' : '#ffe79a'} opacity={0.8} />))}</g>); return acc; }, { x: -900, els: [] }).els}</g>
    </g>
  );
}
// Fachada de un edificio con pisos numerados (en el mundo 1x)
export function Building({ x = 0, top = -2000, bottom = 1000, w = 520, floors = 8, t, mark }) {
  const fh = (bottom - top) / floors;
  return (
    <g>
      <rect x={x - w / 2} y={top} width={w} height={bottom - top} fill="#d7b48a" stroke="#7a5a3a" strokeWidth={8} />
      {[...Array(floors)].map((_, k) => { const fy = bottom - (k + 1) * fh; return <g key={k}><rect x={x - w / 2 + 40} y={fy + 30} width={w - 80} height={fh - 70} fill="#9fd4f5" stroke="#7a5a3a" strokeWidth={6} /><rect x={x - w / 2 - 30} y={fy + fh - 40} width={w + 60} height={14} fill="#8a6a4a" />{[...Array(9)].map((_, j) => <rect key={j} x={x - w / 2 - 20 + j * (w + 40) / 8} y={fy + fh - 100} width={6} height={60} fill="#8a6a4a" />)}<text x={x + w / 2 + 30} y={fy + fh / 2} fontFamily="Inter" fontWeight={900} fontSize={44} fill={mark === k + 1 ? C.red : '#fff'} stroke="#000" strokeWidth={1.5}>{k + 1}</text></g>; })}
    </g>
  );
}
export function Street({ t, y = 1000 }) {
  return <g><rect x={-1400} y={y} width={4800} height={800} fill="#6a6a72" /><rect x={-1400} y={y} width={4800} height={24} fill="#9a9aa2" />{[...Array(16)].map((_, k) => <rect key={k} x={-1400 + k * 320 - mod(t * 40, 320)} y={y + 120} width={160} height={14} fill="#fff" opacity={0.7} />)}{[...Array(6)].map((_, k) => <g key={k} transform={`translate(${-900 + k * 760} ${y})`}><circle cy={-120} r={70} fill="#5aa04a" /><rect x={-8} y={-80} width={16} height={80} fill="#6a4a2a" /></g>)}</g>;
}
// Oído interno (laberinto): canales semicirculares con líquido que se desplaza según tilt (-1..1)
export function Ear({ x = 0, y = 0, s = 1, t, tilt = 0, hair = 0 }) {
  const lv = tilt * 40;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[[-90, -60, 0], [60, -90, 70], [10, 30, -60]].map(([cx, cy, r], k) => <g key={k} transform={`translate(${cx} ${cy}) rotate(${r})`}><ellipse rx={110} ry={75} fill="none" stroke="#f2b8a8" strokeWidth={34} /><ellipse rx={110} ry={75} fill="none" stroke="#7fd3f0" strokeWidth={18} strokeDasharray={`${180 + lv * 2} 600`} strokeDashoffset={-lv * 3 - t * 10} /></g>)}
      <ellipse cx={-10} cy={70} rx={90} ry={60} fill="#f2b8a8" stroke="#a0605a" strokeWidth={5} />
      <path d={`M-90,${80 + lv * 0.5} Q-10,${60 - lv} 70,${80 - lv * 0.5} L70,120 L-90,120Z`} fill="#7fd3f0" opacity={0.9} />
      {[...Array(7)].map((_, k) => <path key={k} d={`M${-60 + k * 20},120 q${hair * 20 * Math.sin(t * 8 + k) + tilt * 18},-30 ${tilt * 26},-50`} stroke="#5a3a6a" strokeWidth={5} fill="none" strokeLinecap="round" />)}
      <path d="M80,70 C200,60 260,140 360,140" stroke="#f5d76e" strokeWidth={14} fill="none" strokeDasharray="24 18" strokeDashoffset={-t * 120} />
    </g>
  );
}
// Columna vertebral: n vértebras que se tuercen con twist (0..1)
export function Spine({ x = 0, y = 0, s = 1, t, twist = 0, n = 14, len = 900 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[...Array(n)].map((_, k) => { const u = k / (n - 1); const a = twist * (u - 0.5) * Math.PI; const vx = -len / 2 + u * len, vy = 30 * Math.sin(u * Math.PI) * -1; return <g key={k} transform={`translate(${vx} ${vy})`}><g transform={`scale(1 ${Math.cos(a) || 0.01})`}><rect x={-24} y={-40} width={48} height={80} rx={14} fill="#f4efe3" stroke="#8a7a5a" strokeWidth={5} /><path d="M0,-40 L0,-74" stroke="#f4efe3" strokeWidth={14} strokeLinecap="round" /></g>{k < n - 1 && <rect x={22} y={-26} width={len / (n - 1) - 44} height={52} rx={10} fill="#e86a7a" opacity={0.85} />}</g>; })}
    </g>
  );
}
// Patinadora que gira: arms 0 abiertos .. 1 pegados
export function Skater({ x = 0, y = 0, s = 1, t, arms = 0, spin = 0 }) {
  const a = spin; const w = Math.cos(a);
  const reach = lerp(150, 34, arms);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={190} rx={120} ry={20} fill="#000" opacity={0.15} />
      <path d={`M-10,60 L${-20 * w},180 M10,60 L${30 * w},120 L${10 * w},175`} stroke="#3a3a5a" strokeWidth={16} strokeLinecap="round" fill="none" />
      <path d={`M${-40 * w},185 L${10 * w},185`} stroke="#ccc" strokeWidth={6} />
      <path d={`M-40,60 L-30,-60 L30,-60 L40,60Z`} fill="#c0396a" />
      <path d={`M-60,70 Q0,100 60,70 L40,40 L-40,40Z`} fill="#e05a8a" />
      <path d={`M-24,-50 L${-reach * w},${-40 - arms * 20} M24,-50 L${reach * w},${-40 - arms * 20}`} stroke="#f0c8a0" strokeWidth={12} strokeLinecap="round" />
      <circle cx={0} cy={-90} r={30} fill="#f0c8a0" />
      <path d={`M${-30 * w},-104 Q0,-136 ${30 * w},-104 L${44 * w},-80`} stroke="#5a3a1a" strokeWidth={14} fill="none" strokeLinecap="round" />
    </g>
  );
}
// Cámara antigua de fuelle (Marey)
export function OldCamera({ x = 0, y = 0, s = 1, t, flash = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-30,60 L-90,260 M30,60 L90,260 M0,60 L0,270" stroke="#6a4a2a" strokeWidth={12} />
      <rect x={-110} y={-70} width={120} height={140} rx={8} fill="#6a4a2a" stroke="#3a2412" strokeWidth={5} />
      {[0, 1, 2, 3].map((k) => <rect key={k} x={10 + k * 22} y={-56 + k * 6} width={22} height={112 - k * 12} fill={k % 2 ? '#2a2a2a' : '#3a3a3a'} />)}
      <circle cx={110} cy={0} r={26} fill="#222" stroke="#b08a4a" strokeWidth={6} /><circle cx={110} cy={0} r={10} fill="#5a8ab0" />
      <g transform={`rotate(${t * 360 * 2} -50 0)`}><circle cx={-50} cy={0} r={40} fill="none" stroke="#b08a4a" strokeWidth={6} strokeDasharray="10 8" /></g>
      {flash > 0 && <circle cx={130} cy={0} r={60 + 80 * flash} fill="#fff" opacity={0.7 * (1 - flash)} />}
    </g>
  );
}
// Avión de pruebas (vista lateral) con trayectoria parabólica
export function Plane({ x = 0, y = 0, s = 1, rot = 0, t }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M-300,0 C-300,-50 200,-60 300,-20 C330,-10 330,20 300,30 L-300,40Z" fill="#e8eef4" stroke="#4a5a6a" strokeWidth={6} />
      <path d="M-260,-10 L-330,-120 L-230,-120 L-160,-10Z" fill="#c0392b" stroke="#4a5a6a" strokeWidth={5} />
      <path d="M-40,20 L-160,140 L-60,140 L80,20Z" fill="#b8c4d0" stroke="#4a5a6a" strokeWidth={5} />
      {[...Array(8)].map((_, k) => <circle key={k} cx={-180 + k * 50} cy={-14} r={11} fill="#7fc4ef" stroke="#4a5a6a" strokeWidth={3} />)}
      {[...Array(5)].map((_, k) => <path key={k} d={`M-310,${10 + k * 6} l${-60 - 40 * Math.sin(t * 9 + k)},0`} stroke="#fff" strokeWidth={4} opacity={0.6} />)}
    </g>
  );
}
// Malla de protección en una ventana
export function Net({ x = 0, y = 0, w = 400, h = 300, on = 1 }) {
  if (on <= 0) return null;
  return <g opacity={on}>{[...Array(Math.floor(w / 30) + 1)].map((_, k) => <line key={'v' + k} x1={x - w / 2 + k * 30} y1={y - h / 2} x2={x - w / 2 + k * 30} y2={y - h / 2 + h * on} stroke="#fff" strokeWidth={3} />)}{[...Array(Math.floor(h / 30) + 1)].map((_, k) => k * 30 <= h * on && <line key={'h' + k} x1={x - w / 2} y1={y - h / 2 + k * 30} x2={x + w / 2} y2={y - h / 2 + k * 30} stroke="#fff" strokeWidth={3} />)}</g>;
}
