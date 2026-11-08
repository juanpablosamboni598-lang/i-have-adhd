// Personajes terrestres y de río (v14): todos parpadean, respiran y se mueven.
import React from 'react';
import { C, blink, rng, pathPts, lerp, cl, mod } from './lib.jsx';

const L = '#2b1d10';

// Pata de dos segmentos con ciclo de marcha
const Leg = ({ x, y, len, ph, amp, col, w, back = false }) => {
  const a1 = amp * Math.sin(ph), a2 = amp * 0.8 * Math.max(0, Math.sin(ph + (back ? -1.2 : 1.2)));
  const kx = x + Math.sin(a1) * len * 0.5, ky = y + Math.cos(a1) * len * 0.5;
  const fx = kx + Math.sin(a1 - (back ? -a2 : a2)) * len * 0.5, fy = ky + Math.cos(a1 - (back ? -a2 : a2)) * len * 0.5;
  return <g><path d={`M${x},${y} L${kx},${ky} L${fx},${fy}`} stroke={col} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" /><path d={`M${x},${y} L${kx},${ky} L${fx},${fy}`} stroke={L} strokeWidth={w + 6} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.25} /></g>;
};

// Cuadrúpedo genérico: cheetah | lion | lioness | hyena | gazelle | bear | capybara | cub
const SPEC = {
  cheetah: { body: '#e3b25a', belly: '#f5e3b8', len: 230, h: 62, leg: 150, head: 34, tail: 150, spots: '#3a2a14' },
  lion: { body: '#c9923f', belly: '#ecd2a0', len: 260, h: 86, leg: 135, head: 46, tail: 160, mane: '#7a4a1a' },
  lioness: { body: '#d2a056', belly: '#efd9ab', len: 240, h: 74, leg: 130, head: 40, tail: 150 },
  hyena: { body: '#a88a60', belly: '#cdb894', len: 200, h: 80, leg: 120, head: 40, tail: 70, spots: '#4a3a24', slope: 10 },
  gazelle: { body: '#c98a4a', belly: '#f3e6d0', len: 170, h: 52, leg: 140, head: 26, tail: 30, horns: true },
  bear: { body: '#f3f1ea', belly: '#e4e0d4', len: 270, h: 110, leg: 115, head: 50, tail: 20, line: '#8f8a7c' },
  capybara: { body: '#8a6440', belly: '#a37b55', len: 150, h: 70, leg: 55, head: 40, tail: 0 },
  cub: { body: '#e9c27a', belly: '#f7e6c2', len: 100, h: 36, leg: 55, head: 24, tail: 60, spots: '#6a5434' },
};
export function Quad({ kind = 'lion', x = 0, y = 0, s = 1, flip = false, t, seed = 1, speed = 1, run = true, mouth = 0, tongue = 0, heat = 0, opacity = 1, xray = 0, heartS = 1, sleep = 0, rot = 0, tint }) {
  const P = SPEC[kind];
  const body = tint || P.body;
  const ln = P.line || L;
  const ph = t * (run ? 9 : 4) * speed + seed;
  const amp = run ? 0.75 * Math.min(1.3, speed) : 0.32 * speed;
  const bob = (run ? 8 : 3) * Math.abs(Math.sin(ph));
  const breathe = 1 + (0.02 + tongue * 0.05) * Math.sin(t * (3 + tongue * 9) + seed);
  const bl = sleep > 0.5 ? 1 : blink(t, seed, 2.4);
  const hl = P.len / 2, hh = P.h / 2;
  const spine = run && (kind === 'cheetah') ? 14 * Math.sin(ph) : 0;
  const R = rng(seed + 7);
  const spots = P.spots ? [...Array(kind === 'cheetah' ? 26 : 12)].map(() => [lerp(-hl * 0.85, hl * 0.8, R()), lerp(-hh * 0.7, hh * 0.4, R())]) : [];
  const legs = (back) => [[-hl * 0.6, 0], [hl * 0.55, 1.6]].map(([lx, o], k) => (
    <Leg key={k + (back ? 'b' : 'f')} x={lx} y={hh * 0.5} len={P.leg} ph={ph + o + (back ? Math.PI : 0)} amp={amp} col={back ? shade(body) : body} w={kind === 'bear' ? 34 : kind === 'capybara' ? 22 : 18} back={k === 0} />));
  return (
    <g transform={`translate(${x} ${y - bob}) rotate(${rot}) scale(${flip ? -s : s} ${s})`} opacity={opacity}>
      {legs(true)}
      {P.tail > 0 && <path d={`M${-hl},${-hh * 0.4} Q${-hl - P.tail * 0.5},${-hh + 20 * Math.sin(t * 3 + seed)} ${-hl - P.tail},${-hh * 0.2 + 30 * Math.sin(t * 2.5 + seed)}`} stroke={body} strokeWidth={kind === 'lion' || kind === 'lioness' ? 9 : 12} fill="none" strokeLinecap="round" />}
      {(kind === 'lion' || kind === 'lioness') && <circle cx={-hl - P.tail} cy={-hh * 0.2 + 30 * Math.sin(t * 2.5 + seed)} r={11} fill="#6a3d14" />}
      <g transform={`scale(1 ${breathe})`}>
        <path d={`M${-hl},${-hh * 0.6 + (P.slope || 0)} C${-hl * 0.5},${-hh - spine} ${hl * 0.5},${-hh + spine - (P.slope || 0)} ${hl},${-hh * 0.6 - (P.slope || 0)} C${hl + 18},0 ${hl},${hh} ${hl * 0.6},${hh} L${-hl * 0.7},${hh} C${-hl - 20},${hh} ${-hl - 18},0 ${-hl},${-hh * 0.6 + (P.slope || 0)}Z`} fill={body} stroke={ln} strokeWidth={4} />
        <path d={`M${-hl * 0.6},${hh * 0.7} C${-hl * 0.2},${hh * 1.05} ${hl * 0.4},${hh * 1.05} ${hl * 0.65},${hh * 0.7}`} stroke={P.belly} strokeWidth={14} fill="none" strokeLinecap="round" />
        {spots.map((p, k) => <circle key={k} cx={p[0]} cy={p[1]} r={kind === 'cheetah' ? 5 : 7} fill={P.spots} />)}
        {heat > 0 && <ellipse cx={0} cy={0} rx={hl} ry={hh} fill="#ff3b2f" opacity={0.55 * heat} />}
        {xray > 0 && <g opacity={xray}>
          <ellipse cx={0} cy={0} rx={hl * 1.05} ry={hh * 1.1} fill="#0b1f33" opacity={0.75} />
          <path d={`M${-hl},${-hh * 0.4} Q0,${-hh * 0.8 + spine} ${hl},${-hh * 0.45}`} stroke="#d7f7ff" strokeWidth={7} fill="none" strokeDasharray="10 6" />
          {[...Array(6)].map((_, k) => <path key={k} d={`M${hl * 0.1 + k * 14},${-hh * 0.6} q-14,${hh * 0.6} 0,${hh * 0.9}`} stroke="#d7f7ff" strokeWidth={4} fill="none" opacity={0.6} />)}
          <g transform={`translate(${hl * 0.35} ${hh * 0.05}) scale(${heartS * (1 + 0.18 * Math.max(0, Math.sin(t * 7)))})`}><path d="M0,10 C-30,-14 -14,-34 0,-18 C14,-34 30,-14 0,10Z" fill={C.red} /></g>
        </g>}
      </g>
      {legs(false)}
      {/* cabeza */}
      <g transform={`translate(${hl + 4} ${-hh * 0.7}) rotate(${kind === 'hyena' ? 18 : 6 * Math.sin(t * 1.3 + seed)})`}>
        {P.mane && <circle cx={-8} cy={6} r={P.head * 1.55 + 3 * Math.sin(t * 2)} fill={P.mane} stroke={ln} strokeWidth={4} />}
        {kind === 'bear' && <circle cx={-6} cy={-P.head * 0.8} r={11} fill={body} stroke={ln} strokeWidth={3} />}
        {kind !== 'bear' && kind !== 'capybara' && <path d={`M${-12},${-P.head * 0.7} l-10,-22 l18,10Z`} fill={body} stroke={ln} strokeWidth={3} />}
        {P.horns && <path d={`M-6,${-P.head * 0.6} q-14,-40 6,-62 M4,${-P.head * 0.6} q-6,-40 14,-58`} stroke="#3a2a14" strokeWidth={5} fill="none" />}
        <ellipse cx={0} cy={0} rx={P.head * 1.1} ry={P.head * 0.85} fill={body} stroke={ln} strokeWidth={4} />
        <ellipse cx={P.head * 0.95} cy={P.head * 0.2} rx={P.head * 0.55} ry={P.head * 0.42} fill={P.belly} stroke={ln} strokeWidth={3} />
        <circle cx={P.head * 1.4} cy={P.head * 0.05} r={5} fill="#1a1a1a" />
        {kind === 'cheetah' && <path d={`M${P.head * 0.45},${-P.head * 0.15} q8,22 22,30`} stroke="#1a1a1a" strokeWidth={4} fill="none" />}
        <g transform={`translate(${P.head * 0.4} ${-P.head * 0.25})`}><circle r={5.5} fill="#1a1a1a" /><circle cx={1.5} cy={-1.5} r={1.6} fill="#fff" /><rect x={-7} y={-7} width={14} height={14 * bl} fill={body} /></g>
        <g transform={`rotate(${mouth * 28} ${P.head * 0.3} ${P.head * 0.4})`}><path d={`M${P.head * 0.3},${P.head * 0.45} Q${P.head},${P.head * 0.75} ${P.head * 1.35},${P.head * 0.45}`} stroke={ln} strokeWidth={4} fill={mouth > 0.05 ? '#7a2a2a' : 'none'} /></g>
        {tongue > 0 && <ellipse cx={P.head * 1.2} cy={P.head * 0.75 + 6 * Math.sin(t * 12)} rx={8} ry={14 * tongue} fill="#e2707a" />}
        {sleep > 0 && [0, 1, 2].map((k) => { const u = mod(t * 0.5 + k / 3, 1); return <text key={k} x={20 + u * 40} y={-P.head - u * 60} fontFamily="Inter" fontWeight={900} fontSize={22 + u * 14} fill="#fff" opacity={(1 - u) * sleep}>z</text>; })}
      </g>
    </g>
  );
}
const shade = (hex) => { const n = parseInt(hex.slice(1), 16); const f = (v) => Math.max(0, Math.round(v * 0.82)); return '#' + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(f).map((v) => v.toString(16).padStart(2, '0')).join(''); };

// Cocodrilo: mandíbula que se abre, cola ondulante, cinta opcional
export function Croc({ x = 0, y = 0, s = 1, flip = false, t, seed = 2, jaw = 0, tape = 0, swim = 1, roll = 0, opacity = 1, xray = 0 }) {
  const col = '#5f7a3a', dark = '#3d5224', belly = '#cdbf7a';
  const bl = blink(t, seed, 3.2);
  const pts = [];
  for (let k = 0; k <= 12; k++) { const u = k / 12; pts.push([-60 - u * 330, 10 + 18 * Math.sin(t * 3 * swim - u * 4 + seed) * u]); }
  const tail = 'M-60,-24 ' + pts.map((p) => `L${p[0].toFixed(1)},${(p[1] - 22 * (1 - (-(p[0] + 60) / 330))).toFixed(1)}`).join(' ') + ' ' + pts.slice().reverse().map((p) => `L${p[0].toFixed(1)},${(p[1] + 22 * (1 - (-(p[0] + 60) / 330))).toFixed(1)}`).join(' ') + ' L-60,30Z';
  const ja = jaw * 32;
  const legPh = t * 4 * swim + seed;
  const sy = roll ? Math.cos(roll) : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s * sy})`} opacity={opacity}>
      {[[-40, 0], [120, 1.5]].map(([lx, o], k) => <path key={k} d={`M${lx},20 l${18 * Math.sin(legPh + o)},40 l22,4`} stroke={dark} strokeWidth={16} fill="none" strokeLinecap="round" />)}
      <path d={tail} fill={col} stroke={dark} strokeWidth={4} />
      {[...Array(10)].map((_, k) => <path key={k} d={`M${-80 - k * 30},${pts[Math.min(12, Math.round(k * 1.2))][1] - 24 + k * 1.6} l8,-12 l8,12`} fill={dark} />)}
      <path d="M-70,-30 C0,-46 120,-46 190,-24 L190,32 C120,44 0,44 -70,30Z" fill={col} stroke={dark} strokeWidth={4} />
      <path d="M-60,26 C20,38 120,38 186,28" stroke={belly} strokeWidth={12} fill="none" />
      {[...Array(9)].map((_, k) => <ellipse key={k} cx={-50 + k * 26} cy={-36} rx={8} ry={5} fill={dark} />)}
      {xray > 0 && <g opacity={xray}>
        <ellipse cx={250} cy={0} rx={110} ry={36} fill="#0b1f33" opacity={0.75} />
        <ellipse cx={215} cy={-6} rx={46} ry={22} fill="#d9534f" opacity={0.9} />
        <ellipse cx={300} cy={22} rx={14} ry={7} fill="#f0ad4e" />
      </g>}
      {/* mandíbula inferior */}
      <g transform={`rotate(${ja * 0.45} 190 12)`}>
        <path d="M188,6 L380,14 C392,16 392,30 378,32 L188,34Z" fill={col} stroke={dark} strokeWidth={4} />
        {[...Array(9)].map((_, k) => <path key={k} d={`M${206 + k * 19},14 l5,-12 l5,12Z`} fill="#fff" />)}
      </g>
      {/* mandíbula superior */}
      <g transform={`rotate(${-ja * 0.55} 190 0)`}>
        <path d="M186,-26 C250,-34 330,-22 392,-4 C400,2 398,12 386,12 L188,10Z" fill={col} stroke={dark} strokeWidth={4} />
        {[...Array(10)].map((_, k) => <path key={k} d={`M${204 + k * 18},10 l5,12 l5,-12Z`} fill="#fff" />)}
        <circle cx={380} cy={-8} r={5} fill={dark} />
        <g transform="translate(228 -30)"><circle r={13} fill="#d9c34a" stroke={dark} strokeWidth={3} /><ellipse rx={3} ry={10} fill="#111" /><rect x={-15} y={-15} width={30} height={30 * bl} fill={col} /></g>
      </g>
      {tape > 0 && [...Array(3)].map((_, k) => <rect key={k} x={300 + k * 18} y={-16} width={12} height={46 * cl(tape * 3 - k)} rx={3} fill="#c8c8c8" stroke="#888" strokeWidth={2} />)}
    </g>
  );
}

// Anaconda: cuerpo como cinta sinusoidal; coil = enrollarse en (cx,cy); bulge = bulto que viaja (0..1)
export function Snake({ x = 0, y = 0, s = 1, t, seed = 3, len = 900, wave = 1, coil = 0, cx = 0, cy = 0, r = 90, bulge = -1, bulgeSize = 0, jaw = 0, opacity = 1, flip = false }) {
  const N = 60;
  const pts = [];
  for (let k = 0; k <= N; k++) {
    const u = k / N;
    let px = -u * len, py = 30 * Math.sin(u * 9 - t * 3 * wave + seed) * (0.3 + u);
    if (coil > 0 && u < 0.7) { const a = u * 14 - t * 0.5; const cr = r * (1 - 0.15 * Math.sin(t * 3)); const qx = cx + Math.cos(a) * cr, qy = cy + Math.sin(a) * cr * 0.55; px = lerp(px, qx, coil); py = lerp(py, qy, coil); }
    pts.push([px, py]);
  }
  const width = (u) => (18 + 10 * Math.sin(Math.PI * Math.min(1, u * 1.2))) * (1 - u * 0.6) + (bulge >= 0 ? bulgeSize * Math.exp(-Math.pow((u - bulge) / 0.06, 2)) : 0);
  const top = [], bot = [];
  for (let k = 0; k <= N; k++) {
    const a = pts[Math.min(N, k + 1)], b = pts[Math.max(0, k - 1)]; const dx = a[0] - b[0], dy = a[1] - b[1]; const n = Math.hypot(dx, dy) || 1;
    const w = width(k / N); top.push([pts[k][0] - dy / n * w, pts[k][1] + dx / n * w]); bot.push([pts[k][0] + dy / n * w, pts[k][1] - dx / n * w]);
  }
  const bl = blink(t, seed, 3.6);
  const R = rng(seed);
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} opacity={opacity}>
      <path d={pathPts([...top, ...bot.reverse()]) + 'Z'} fill="#4f6b2a" stroke="#26360f" strokeWidth={4} />
      {pts.filter((_, k) => k % 3 === 1 && k < N - 2).map((p, k) => <ellipse key={k} cx={p[0]} cy={p[1]} rx={9} ry={6} fill="#1f2a0c" opacity={0.8} transform={`rotate(${R() * 40} ${p[0]} ${p[1]})`} />)}
      <g transform={`translate(${pts[0][0]} ${pts[0][1]})`}>
        <g transform={`rotate(${-jaw * 35} 0 0)`}><path d="M-10,-22 C30,-30 60,-20 70,-4 L-6,0Z" fill="#5a7a30" stroke="#26360f" strokeWidth={4} /></g>
        <g transform={`rotate(${jaw * 45} 0 0)`}><path d="M-10,22 C30,26 56,16 66,4 L-6,0Z" fill="#6d8a3c" stroke="#26360f" strokeWidth={4} /></g>
        {jaw > 0.1 && <path d={`M0,0 L60,${-jaw * 40} L60,${jaw * 40}Z`} fill="#7a2a2a" opacity={0.7} />}
        {jaw < 0.3 && <path d={`M60,2 l22,${-4 + 4 * Math.sin(t * 14)} m-22,-4 l22,${4 + 4 * Math.sin(t * 14)}`} stroke={C.red} strokeWidth={3} opacity={Math.sin(t * 3) > 0 ? 1 : 0} />}
        <g transform="translate(26 -12)"><circle r={7} fill="#e8d36a" /><ellipse rx={2} ry={6} fill="#111" /><rect x={-8} y={-8} width={16} height={16 * bl} fill="#5a7a30" /></g>
      </g>
    </g>
  );
}

export function Person({ x = 0, y = 0, s = 1, t, seed = 5, shirt = '#2e86de', arms = 0, hat = true, flip = false }) {
  const sw = Math.sin(t * 2 + seed);
  return (
    <g transform={`translate(${x} ${y + 2 * Math.sin(t * 2.2 + seed)}) scale(${flip ? -s : s} ${s})`}>
      <path d={`M-12,0 L${-18 + 4 * sw},70 M12,0 L${18 - 4 * sw},70`} stroke="#3d3d5c" strokeWidth={16} strokeLinecap="round" />
      <rect x={-26} y={-90} width={52} height={96} rx={22} fill={shirt} />
      <path d={`M-20,-70 L${-50 - arms * 10},${-20 - arms * 60} M20,-70 L${55 + arms * 30},${-30 - arms * 30 + 8 * sw}`} stroke="#f0c8a0" strokeWidth={13} strokeLinecap="round" />
      <circle cx={0} cy={-118} r={26} fill="#f0c8a0" />
      <circle cx={9} cy={-122} r={3.5} fill="#222" />
      <rect x={4} y={-126} width={10} height={9 * blink(t, seed)} fill="#f0c8a0" />
      {hat && <path d="M-34,-132 L34,-132 L22,-150 L-22,-150Z" fill="#c8a05a" />}
    </g>
  );
}
