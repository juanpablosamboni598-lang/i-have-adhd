// Núcleo: utilidades, cámara con parallax, ambiente oceánico, luz, transiciones y encabezado.
import React from 'react';

export const W = 1920, H = 1080, FPS = 30;
export const C = {
  red: '#eb404a', gold: '#ffc83c', cyan: '#46c8ff', soft: '#b0c0d8', line: '#1d2e42',
  sharkTop: '#6f8aa3', sharkBelly: '#e9eef2', sand: '#d2b071', sandD: '#9c7b45', kelp: '#2fae66',
  navy: '#04162d', purple: '#b388ff', green: '#7ee081',
};
export const FONT = 'Inter, "Inter ExtraBold", sans-serif';

export const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, x) => a + (b - a) * x;
export const ramp = (t, t0, t1) => cl((t - t0) / (t1 - t0));
export const ease = (x) => { x = cl(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const eo = (x) => 1 - Math.pow(1 - cl(x), 3);
export const ei = (x) => Math.pow(cl(x), 3);
export const back = (x) => { x = cl(x); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
export const pop = (t, t0, d = 0.45) => (t < t0 ? 0 : back((t - t0) / d));
export const seg = (t, t0, t1) => ease(ramp(t, t0, t1));
export const mod = (a, n) => ((a % n) + n) % n;
export function rng(seed) {
  let a = (seed * 2654435761) >>> 0;
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
export const pathPts = (pts) => pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
// Parpadeo determinista: devuelve 0..1 (1 = ojo cerrado)
export const blink = (t, seed = 0, every = 2.7) => {
  const r = rng(seed + 11);
  let tt = 0.4 + r() * every;
  while (tt < t + 1) { const d = t - tt; if (d >= 0 && d < 0.18) return Math.sin((d / 0.18) * Math.PI); tt += every * (0.7 + r() * 0.6); }
  return 0;
};

// ---------------------------------------------------------------- cámara
const FRAMINGS = [
  { z: 1.0, ox: 0, oy: 0, r: 0 }, { z: 1.45, ox: -110, oy: 25, r: -2.2 }, { z: 1.85, ox: 90, oy: -35, r: 1.6 },
  { z: 1.2, ox: 160, oy: 45, r: 3 }, { z: 1.62, ox: -70, oy: -60, r: -3.4 }, { z: 1.12, ox: -170, oy: 30, r: 1.2 },
  { z: 1.3, ox: 40, oy: 70, r: -1.2 }, { z: 1.7, ox: 130, oy: 10, r: 2.4 },
];
// spec: {focus:(t)=>[x,y], zamt, period, keys:[[t,x,y,z,r]...] }
export function camera(t, dur, seed, spec = {}) {
  let x, y, z, r;
  if (spec.keys) {
    const k = spec.keys;
    let i = 0; while (i < k.length - 2 && t > k[i + 1][0]) i++;
    const a = k[i], b = k[Math.min(i + 1, k.length - 1)];
    const u = b[0] > a[0] ? ease(ramp(t, a[0], b[0])) : 0;
    x = lerp(a[1], b[1], u); y = lerp(a[2], b[2], u); z = lerp(a[3], b[3], u); r = lerp(a[4] || 0, b[4] || 0, u);
  } else {
    const R = rng(seed * 7 + 3);
    const order = FRAMINGS.map((f, i) => [R(), i]).sort((p, q) => p[0] - q[0]).map((p) => p[1]);
    const P = spec.period || (2.3 + R() * 0.6);
    const n = Math.floor(t / P), u = ease((t - n * P) / P);
    const fa = FRAMINGS[order[n % order.length]], fb = FRAMINGS[order[(n + 1) % order.length]];
    const za = spec.zamt ?? 1;
    const [fx, fy] = spec.focus ? spec.focus(t) : [W / 2, H / 2];
    x = fx + lerp(fa.ox, fb.ox, u) * za; y = fy + lerp(fa.oy, fb.oy, u) * za;
    z = 1 + (lerp(fa.z, fb.z, u) - 1) * za * (spec.zmul ?? 1) + (spec.zadd || 0);
    r = lerp(fa.r, fb.r, u) * za;
  }
  // cámara en mano + respiración continua del encuadre
  x += 9 * Math.sin(t * 0.73 + seed) + 4 * Math.sin(t * 1.9);
  y += 7 * Math.sin(t * 0.91 + seed * 2);
  r += 0.45 * Math.sin(t * 0.53 + seed);
  z *= 1 + 0.025 * Math.sin(t * 0.4 + seed);
  if (spec.shake) { const s = spec.shake(t); x += s * 14 * Math.sin(t * 61); y += s * 11 * Math.cos(t * 53); r += s * 0.8 * Math.sin(t * 47); }
  return { x, y, z: Math.max(1, z), r };
}
export const layerT = (cam, p) => {
  const zp = 1 + (cam.z - 1) * p;
  const cx = W / 2 + (cam.x - W / 2) * p, cy = H / 2 + (cam.y - H / 2) * p;
  return `translate(${W / 2} ${H / 2}) rotate(${cam.r * Math.min(1, p)}) scale(${zp}) translate(${-cx} ${-cy})`;
};

// ---------------------------------------------------------------- ambiente
const THEMES = {
  blue: ['#2479b8', '#0b3d6b', '#03142a'], deep: ['#123e66', '#071d36', '#01060f'], cold: ['#5fa8d6', '#20618f', '#0a2747'],
  dusk: ['#2a6ea8', '#122f55', '#050c1e'], map: ['#2e86c4', '#1b5f94', '#0e3d68'], dark: ['#0c2a48', '#040f1f', '#000000'],
  light: ['#7cc9ff', '#2f84c2', '#0a2d55'],
};
export function Backdrop({ cam, t, theme = 'blue', seed = 0, ridges = true, fish = true }) {
  const g = THEMES[theme] || THEMES.blue;
  const R = rng(seed + 5);
  const far = [];
  if (ridges) {
    for (let k = 0; k < 2; k++) {
      const pts = [[-1200, 1500]]; const base = 760 + k * 120;
      for (let x = -1200; x <= 3200; x += 160) pts.push([x, base - 90 * Math.sin(x * 0.004 + seed + k) - 60 * R()]);
      pts.push([3200, 1500]);
      far.push(<path key={'r' + k} d={pathPts(pts) + 'Z'} fill={k ? '#0a2a4a' : '#0d3357'} opacity={0.55 + k * 0.2} transform={layerT(cam, 0.18 + k * 0.12)} />);
    }
  }
  const school = [];
  if (fish) {
    for (let k = 0; k < 16; k++) {
      const bx = mod(-400 + k * 37 + t * 60 + R() * 80, 3200) - 600, by = 330 + 40 * Math.sin(k * 1.7 + t * 0.8) + (k % 4) * 18;
      school.push(<ellipse key={k} cx={bx} cy={by} rx={11} ry={4} fill="#0f3a62" opacity={0.7} />);
    }
  }
  return (
    <g>
      <defs>
        <linearGradient id={'bg' + theme} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={g[0]} /><stop offset="0.55" stopColor={g[1]} /><stop offset="1" stopColor={g[2]} /></linearGradient>
      </defs>
      <rect x={-200} y={-200} width={W + 400} height={H + 400} fill={`url(#bg${theme})`} />
      {far}
      <g transform={layerT(cam, 0.3)}>{school}</g>
    </g>
  );
}
export function Rays({ cam, t, seed = 0, strength = 1 }) {
  const out = [];
  for (let k = 0; k < 7; k++) {
    const x = -300 + k * 380 + 60 * Math.sin(t * 0.3 + k);
    const o = (0.035 + 0.03 * Math.sin(t * 0.9 + k * 1.3 + seed)) * strength;
    out.push(<polygon key={k} points={`${x},-300 ${x + 110},-300 ${x - 420},1400 ${x - 700},1400`} fill="#e8f7ff" opacity={o} />);
  }
  return <g transform={layerT(cam, 0.45)}>{out}</g>;
}
export function Snow({ cam, t, seed = 0, n = 70, p = 0.7, size = 1, op = 0.45, blur = false }) {
  const R = rng(seed * 13 + p * 100);
  const out = [];
  const zp = 1 + (cam.z - 1) * p;
  for (let k = 0; k < n; k++) {
    const x0 = R() * 2400, y0 = R() * 1500, vx = (R() - 0.6) * 25, vy = -8 - R() * 22, r = (0.8 + R() * 2.2) * size;
    const sx = mod(x0 + vx * t - cam.x * p * zp, 2400) - 240;
    const sy = mod(y0 + vy * t - cam.y * p * zp, 1500) - 210;
    out.push(<circle key={k} cx={sx} cy={sy} r={r * zp} fill="#d6f1ff" opacity={op * (0.5 + 0.5 * Math.sin(t * 2 + k))} />);
  }
  return <g filter={blur ? 'url(#blur6)' : undefined} transform={`rotate(${cam.r * 0.6} 960 540)`}>{out}</g>;
}
export function Seabed({ t, seed = 0, y = 900, x0 = -900, x1 = 2900, rocks = true, kelp = true, light = 1 }) {
  const R = rng(seed + 21);
  const pts = [[x0, y + 400]];
  for (let x = x0; x <= x1; x += 120) pts.push([x, y + 25 * Math.sin(x * 0.006 + seed) + 10 * Math.sin(x * 0.02)]);
  pts.push([x1, y + 400]);
  const items = [];
  if (rocks) for (let k = 0; k < 9; k++) {
    const rx = x0 + 200 + R() * (x1 - x0 - 400), w = 70 + R() * 130;
    items.push(<ellipse key={'k' + k} cx={rx} cy={y + 8} rx={w} ry={w * 0.45} fill="#56606d" stroke="#2c3138" strokeWidth={4} />);
    items.push(<ellipse key={'kh' + k} cx={rx - w * 0.25} cy={y - w * 0.12} rx={w * 0.35} ry={w * 0.12} fill="#7d8896" opacity={0.6 * light} />);
  }
  if (kelp) for (let k = 0; k < 14; k++) {
    const kx = x0 + 100 + R() * (x1 - x0 - 200), hgt = 180 + R() * 260, ph = R() * 6;
    const sw = (h) => 30 * Math.sin(t * 1.3 + ph + h * 0.012) * (h / hgt);
    const p = [];
    for (let h = 0; h <= hgt; h += 30) p.push([kx + sw(h) + 12 * Math.sin(h * 0.03 + ph), y - h]);
    items.push(<path key={'w' + k} d={pathPts(p)} stroke={k % 3 ? C.kelp : '#3fcf7c'} strokeWidth={9} fill="none" strokeLinecap="round" />);
    for (let j = 2; j < p.length - 1; j += 2) items.push(<ellipse key={'wl' + k + j} cx={p[j][0] + 14} cy={p[j][1]} rx={16} ry={6} fill="#2a9a5a" transform={`rotate(${-30 + 15 * Math.sin(t * 2 + j)} ${p[j][0]} ${p[j][1]})`} />);
  }
  // cáusticas animadas sobre la arena
  const caus = [];
  for (let k = 0; k < 26; k++) {
    const cx = x0 + mod(k * 170 + t * 40, x1 - x0), cy = y + 40 + (k % 3) * 35;
    caus.push(<ellipse key={'c' + k} cx={cx} cy={cy} rx={60 + 20 * Math.sin(t * 2 + k)} ry={10} fill="#fff6d8" opacity={0.18 * light} />);
  }
  return (<g><path d={pathPts(pts) + 'Z'} fill={C.sand} stroke={C.sandD} strokeWidth={5} />{caus}{items}</g>);
}
export function Surface({ t, y = 200, x0 = -1200, x1 = 3200 }) {
  const wave = [];
  for (let x = x0; x <= x1; x += 40) wave.push([x, y + 10 * Math.sin(x * 0.012 + t * 2.2) + 5 * Math.sin(x * 0.031 - t * 3)]);
  const glint = [];
  for (let k = 0; k < 30; k++) glint.push(<rect key={k} x={x0 + mod(k * 140 + t * 70, x1 - x0)} y={y + 8 + (k % 4) * 9} width={40 + (k % 5) * 12} height={3} fill="#e8f7ff" opacity={0.35 + 0.3 * Math.sin(t * 4 + k)} />);
  return (
    <g>
      <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9ad8ff" /><stop offset="1" stopColor="#d9f2ff" /></linearGradient></defs>
      <path d={pathPts([[x0, y - 1600], [x1, y - 1600], ...wave.slice().reverse()]) + 'Z'} fill="url(#sky)" />
      <path d={pathPts(wave)} stroke="#f2fbff" strokeWidth={7} fill="none" />
      {glint}
    </g>
  );
}

// ---------------------------------------------------------------- transiciones (24 tipos, cubren y destapan)
export const TRANS = [
  'iris', 'wipeR', 'diag', 'blindsV', 'blindsH', 'checker', 'bubbles', 'ink', 'clock', 'doorsH', 'doorsV', 'flash',
  'dip', 'finSwipe', 'waveUp', 'diamond', 'shards', 'burst', 'bands', 'rays', 'dots', 'curtain', 'corner', 'twin',
];
const ORDER = [0, 13, 5, 11, 2, 19, 7, 3, 16, 9, 22, 6, 14, 1, 20, 8, 23, 4, 17, 12, 10, 21, 15, 18];
export const transFor = (k) => TRANS[ORDER[mod(k, 24)]];
export function Cover({ type, p, t }) { // p: 0 nada .. 1 pantalla cubierta
  if (p <= 0) return null;
  const col = C.navy; const q = cl(p);
  const full = `M-50,-50 H${W + 50} V${H + 50} H-50 Z`;
  switch (type) {
    case 'iris': { const r = lerp(1300, 0, ease(q)); return <path d={`${full} M${960 + r},540 A${r},${r} 0 1,0 ${960 - r},540 A${r},${r} 0 1,0 ${960 + r},540 Z`} fill={col} fillRule="evenodd" />; }
    case 'wipeR': return <rect x={-50} y={-50} width={(W + 100) * ease(q)} height={H + 100} fill={col} />;
    case 'diag': { const d = lerp(-1100, W + 100, ease(q)); return <polygon points={`-50,-50 ${d + 1100},-50 ${d},${H + 50} -50,${H + 50}`} fill={col} />; }
    case 'blindsV': return <g>{[...Array(12)].map((_, k) => <rect key={k} x={k * 160} y={-50} width={160 * ease(q * 1.4 - k * 0.03)} height={H + 100} fill={col} />)}</g>;
    case 'blindsH': return <g>{[...Array(9)].map((_, k) => <rect key={k} x={-50} y={k * 120} width={W + 100} height={121 * ease(q * 1.4 - (8 - k) * 0.04)} fill={col} />)}</g>;
    case 'checker': return <g>{[...Array(96)].map((_, k) => { const cx = (k % 12) * 160 + 80, cy = Math.floor(k / 12) * 135 + 67; const s = ease(q * 1.8 - (cx + cy) / 4000) * 170; return <rect key={k} x={cx - s / 2} y={cy - s * 0.42} width={s} height={s * 0.85} fill={col} />; })}</g>;
    case 'bubbles': return <g>{[...Array(40)].map((_, k) => { const R = rng(k + 3); const x = R() * W, y = H + 100 - ease(q) * (H + 400) * (0.7 + R() * 0.6); return <circle key={k} cx={x} cy={y} r={ease(q) * (180 + R() * 160)} fill={col} />; })}</g>;
    case 'ink': return <g>{[...Array(9)].map((_, k) => { const a = k * 0.7; return <circle key={k} cx={960 + Math.cos(a) * 300 * (k % 3)} cy={540 + Math.sin(a) * 200 * (k % 3)} r={ei(q) * 1400 * (0.5 + 0.1 * k)} fill={col} />; })}</g>;
    case 'clock': { const a = ease(q) * Math.PI * 2 - Math.PI / 2; const x = 960 + 2000 * Math.cos(a), y = 540 + 2000 * Math.sin(a); return <path d={`M960,540 L960,-1460 A2000,2000 0 ${ease(q) > 0.5 ? 1 : 0},1 ${x},${y} Z`} fill={col} />; }
    case 'doorsH': { const w = ease(q) * 1010; return <g><rect x={-50} y={-50} width={w} height={H + 100} fill={col} /><rect x={W + 50 - w} y={-50} width={w} height={H + 100} fill={col} /></g>; }
    case 'doorsV': { const h = ease(q) * 600; return <g><rect x={-50} y={-50} width={W + 100} height={h} fill={col} /><rect x={-50} y={H + 50 - h} width={W + 100} height={h} fill={col} /></g>; }
    case 'flash': return <rect x={-50} y={-50} width={W + 100} height={H + 100} fill="#ffffff" opacity={q} />;
    case 'dip': return <rect x={-50} y={-50} width={W + 100} height={H + 100} fill="#000" opacity={q} />;
    case 'finSwipe': { const x = lerp(W + 1400, -400, ease(q)); return <g transform={`translate(${x} 560) scale(5.5)`}><path d="M300,0 C200,-90 -60,-110 -240,-20 L-420,-150 L-380,0 L-420,150 L-240,20 C-60,110 200,90 300,0Z" fill={col} /><path d="M40,-80 L-30,-220 L-90,-70Z" fill={col} /><rect x={-1500} y={-200} width={1100} height={400} fill={col} /></g>; }
    case 'waveUp': { const y = lerp(H + 120, -160, ease(q)); const pts = [[-50, H + 60]]; for (let x = -50; x <= W + 50; x += 40) pts.push([x, y + 50 * Math.sin(x * 0.01 + t * 6)]); pts.push([W + 50, H + 60]); return <path d={pathPts(pts) + 'Z'} fill={col} />; }
    case 'diamond': { const s = ease(q) * 1600; return <polygon points={`960,${540 - s} ${960 + s * 1.2},540 960,${540 + s} ${960 - s * 1.2},540`} fill={col} />; }
    case 'shards': return <g>{[...Array(10)].map((_, k) => { const R = rng(k * 9 + 1); const a = R() * 6.28, d = (1 - ease(q * 1.2 - k * 0.02)) * 1500; const cx = 960 + Math.cos(a) * d, cy = 540 + Math.sin(a) * d; return <polygon key={k} points={`960,540 ${cx + 1800 * Math.cos(k * 0.63)},${cy + 1800 * Math.sin(k * 0.63)} ${cx + 1800 * Math.cos(k * 0.63 + 0.75)},${cy + 1800 * Math.sin(k * 0.63 + 0.75)}`} transform={`translate(${cx - 960} ${cy - 540})`} fill={col} />; })}</g>;
    case 'burst': return <circle cx={960} cy={540} r={ei(q) * 1200} fill={C.cyan} opacity={0.9} stroke={col} strokeWidth={ease(q) * 900} />;
    case 'bands': return <g>{[...Array(8)].map((_, k) => { const x = lerp(-900, W + 200, ease(q * 1.5 - k * 0.07)); return <polygon key={k} points={`${x - 2600},${k * 140 - 60} ${x},${k * 140 - 60} ${x - 140},${k * 140 + 90} ${x - 2740},${k * 140 + 90}`} fill={col} />; })}</g>;
    case 'rays': return <g>{[...Array(16)].map((_, k) => { const a0 = k * 0.3927, a1 = a0 + 0.3927 * ease(q); return <path key={k} d={`M960,540 L${960 + 2000 * Math.cos(a0)},${540 + 2000 * Math.sin(a0)} L${960 + 2000 * Math.cos(a1)},${540 + 2000 * Math.sin(a1)} Z`} fill={col} />; })}</g>;
    case 'dots': return <g>{[...Array(160)].map((_, k) => { const cx = (k % 16) * 128 + 64, cy = Math.floor(k / 16) * 120 + 60; const d = Math.hypot(cx - 960, cy - 540) / 1100; return <circle key={k} cx={cx} cy={cy} r={ease(q * 1.6 - d * 0.5) * 95} fill={col} />; })}</g>;
    case 'curtain': { const y = lerp(-140, H + 80, ease(q)); const pts = [[-50, -60]]; for (let x = -50; x <= W + 50; x += 60) pts.push([x, y + 40 * Math.sin(x * 0.02 + t * 8)]); pts.push([W + 50, -60]); return <path d={pathPts(pts) + 'Z'} fill={col} />; }
    case 'corner': return <circle cx={W} cy={H} r={ease(q) * 2300} fill={col} />;
    case 'twin': { const r = ease(q) * 1150; return <g><circle cx={0} cy={540} r={r} fill={col} /><circle cx={W} cy={540} r={r} fill={col} /></g>; }
    default: return <rect width={W} height={H} fill={col} opacity={q} />;
  }
}

// ---------------------------------------------------------------- piezas comunes de interfaz animada
export function Pill({ x, y, text, color = C.gold, size = 40, s = 1, rot = 0 }) {
  if (s <= 0.01) return null;
  const w = text.length * size * 0.62 + 44;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-w / 2 + 6} y={-size * 0.85 + 8} width={w} height={size * 1.7} rx={18} fill="#000" opacity={0.3} />
      <rect x={-w / 2} y={-size * 0.85} width={w} height={size * 1.7} rx={18} fill="#0f2240" stroke={color} strokeWidth={5} />
      <text x={0} y={size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={size} fill="#fff">{text}</text>
    </g>
  );
}
export function Header({ text, t }) {
  const p = eo(ramp(t, 0.15, 0.6));
  if (!text) return null;
  const w = text.length * 19 + 46;
  return (
    <g transform={`translate(${lerp(-w, 44, p)} 42)`}>
      <rect width={w} height={56} rx={12} fill="#000" opacity={0.42} />
      <rect width={7} height={56} rx={3} fill={C.gold} />
      <text x={24} y={39} fontFamily={FONT} fontWeight={900} fontSize={30} fill={C.gold}>{text.toUpperCase()}</text>
      <rect x={24} y={46} width={(w - 44) * eo(ramp(t, 0.45, 1.1))} height={3} fill={C.gold} opacity={0.8} />
    </g>
  );
}
export function Ring({ x, y, t, t0, dur = 1.2, maxR = 400, color = C.cyan, w = 5 }) {
  const u = (t - t0) / dur; if (u < 0 || u > 1) return null;
  return <circle cx={x} cy={y} r={20 + maxR * eo(u)} fill="none" stroke={color} strokeWidth={w} opacity={1 - u} />;
}
export function Counter({ x, y, t, t0, t1, v0 = 0, v1, size = 120, color = '#fff', suffix = '', anchor = 'middle' }) {
  const v = Math.round(lerp(v0, v1, eo(ramp(t, t0, t1))));
  const s = v.toLocaleString('es-CO').replace(/,/g, '.');
  const kick = 1 + 0.06 * Math.max(0, Math.sin((t - t0) * 30)) * (t < t1 ? 1 : 0);
  return <text x={x} y={y} textAnchor={anchor} fontFamily={FONT} fontWeight={900} fontSize={size * kick} fill={color} stroke="#000" strokeWidth={size / 14} paintOrder="stroke">{s + suffix}</text>;
}
