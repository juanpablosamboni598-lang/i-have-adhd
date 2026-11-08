// Escenarios terrestres con capas de parallax: cielo, montes lejanos, medio, suelo con hierba que se mece.
import React from 'react';
import { W, H, layerT, pathPts, rng, mod, C } from './lib.jsx';

const SKY = {
  savanna: ['#ffcf8a', '#ffe9c4', '#f6d79a'], dusk: ['#ff9a5a', '#ffc98a', '#e8b070'],
  arctic: ['#9fd3f2', '#d9f0fb', '#eef8fd'], swamp: ['#9ccf9a', '#d8ecc4', '#c4dca6'], river: ['#8fd0f0', '#d4eefa', '#bfe3c8'],
};
const HILL = { savanna: ['#d9a868', '#c48a4e'], dusk: ['#c97a4a', '#a8603a'], arctic: ['#cfe6f3', '#b3d4e8'], swamp: ['#6f9a5a', '#4f7a3e'], river: ['#7fb06a', '#5f9050'] };

export function LandBack({ cam, t, kind = 'savanna', seed = 1, sun = true }) {
  const s = SKY[kind], h = HILL[kind];
  const R = rng(seed + 3);
  const ridge = (k, base, amp) => { const pts = [[-1400, 1600]]; for (let x = -1400; x <= 3400; x += 140) pts.push([x, base - amp * Math.abs(Math.sin(x * 0.0035 + k + seed)) - 30 * R()]); pts.push([3400, 1600]); return pathPts(pts) + 'Z'; };
  const birds = [...Array(6)].map((_, k) => { const bx = mod(k * 330 + t * 70, 2800) - 400, by = 200 + 40 * Math.sin(k + t * 0.6); const f = 10 * Math.sin(t * 8 + k); return <path key={k} d={`M${bx - 16},${by + f} Q${bx - 8},${by - 6} ${bx},${by} Q${bx + 8},${by - 6} ${bx + 16},${by + f}`} stroke="#3a2a1a" strokeWidth={3} fill="none" opacity={kind === 'arctic' ? 0.4 : 0.6} />; });
  const trees = kind === 'savanna' || kind === 'dusk' ? [...Array(7)].map((_, k) => { const tx = -800 + k * 520 + R() * 120; return <g key={k} transform={`translate(${tx} 610)`}><path d="M0,0 L0,-90" stroke="#5a3a1a" strokeWidth={10} /><ellipse cx={0} cy={-100} rx={90} ry={22} fill="#6f8a3a" /><ellipse cx={-20} cy={-114} rx={60} ry={16} fill="#7f9a46" /></g>; }) : null;
  const bergs = kind === 'arctic' ? [...Array(6)].map((_, k) => <polygon key={k} points={`${-600 + k * 600},640 ${-500 + k * 600},${500 - (k % 3) * 40} ${-380 + k * 600},560 ${-300 + k * 600},640`} fill="#f4fbff" stroke="#b9d9ea" strokeWidth={3} />) : null;
  return (
    <g>
      <defs><linearGradient id={'sky' + kind} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={s[0]} /><stop offset="0.6" stopColor={s[1]} /><stop offset="1" stopColor={s[2]} /></linearGradient></defs>
      <rect x={-200} y={-200} width={W + 400} height={H + 400} fill={`url(#sky${kind})`} />
      {sun && <circle cx={1400 - cam.x * 0.05} cy={250 - cam.y * 0.03} r={110} fill={kind === 'arctic' ? '#ffffff' : '#fff2c4'} opacity={0.9} />}
      <g transform={layerT(cam, 0.12)}>{birds}</g>
      <path d={ridge(0, 640, 160)} fill={h[0]} opacity={0.7} transform={layerT(cam, 0.2)} />
      <g transform={layerT(cam, 0.32)}>{trees}{bergs}<path d={ridge(2, 720, 90)} fill={h[1]} opacity={0.85} /></g>
    </g>
  );
}
// Suelo del mundo (capa 1x): hierba/nieve/barro con elementos que se mecen
export function Ground({ t, kind = 'savanna', y = 820, seed = 1, x0 = -1200, x1 = 3200 }) {
  const R = rng(seed + 11);
  const col = { savanna: '#d9b46a', dusk: '#c99a5a', arctic: '#f4fbff', swamp: '#6b8a44', river: '#8ab865' }[kind];
  const edge = { savanna: '#b38a48', dusk: '#a07040', arctic: '#bcd9ea', swamp: '#4c6a2e', river: '#5f8a44' }[kind];
  const pts = [[x0, y + 600]]; for (let x = x0; x <= x1; x += 100) pts.push([x, y + 14 * Math.sin(x * 0.007 + seed)]); pts.push([x1, y + 600]);
  const tufts = kind === 'arctic' ? null : [...Array(60)].map((_, k) => { const gx = x0 + R() * (x1 - x0), gy = y + 10 + R() * 200, hgt = 20 + R() * 40; const sw = 10 * Math.sin(t * 2 + k); return <path key={k} d={`M${gx - 8},${gy} Q${gx - 4 + sw},${gy - hgt} ${gx + sw * 1.4},${gy - hgt * 1.2} M${gx},${gy} Q${gx + sw},${gy - hgt * 1.1} ${gx + 6 + sw * 1.5},${gy - hgt * 1.3} M${gx + 8},${gy} Q${gx + 6 + sw},${gy - hgt * 0.8} ${gx + 16 + sw},${gy - hgt}`} stroke={kind === 'savanna' || kind === 'dusk' ? '#b8913f' : '#3f6a26'} strokeWidth={4} fill="none" strokeLinecap="round" />; });
  const cracks = kind === 'arctic' ? [...Array(14)].map((_, k) => { const cx = x0 + R() * (x1 - x0); return <path key={k} d={`M${cx},${y + 30 + R() * 120} l40,10 l30,-8 l50,14`} stroke="#bcd9ea" strokeWidth={3} fill="none" />; }) : null;
  const glint = kind === 'arctic' ? [...Array(30)].map((_, k) => <circle key={k} cx={x0 + mod(k * 160 + t * 15, x1 - x0)} cy={y + 20 + (k % 5) * 40} r={3} fill="#fff" opacity={0.5 + 0.5 * Math.sin(t * 5 + k)} />) : null;
  return <g><path d={pathPts(pts) + 'Z'} fill={col} stroke={edge} strokeWidth={5} />{cracks}{glint}{tufts}</g>;
}
// Agua de río/pantano vista de lado: superficie ondulante con nenúfares
export function RiverWater({ t, y = 600, x0 = -1200, x1 = 3200, murky = false, lilies = false }) {
  const pts = [];
  for (let x = x0; x <= x1; x += 40) pts.push([x, y + 8 * Math.sin(x * 0.015 + t * 2) + 4 * Math.sin(x * 0.04 - t * 3)]);
  const body = [...pts, [x1, y + 1400], [x0, y + 1400]];
  return (
    <g>
      <path d={pathPts(body) + 'Z'} fill={murky ? '#4a6a3a' : '#3f7fa6'} opacity={0.82} />
      <path d={pathPts(pts)} stroke="#e8f7ff" strokeWidth={5} fill="none" opacity={0.8} />
      {[...Array(24)].map((_, k) => <rect key={k} x={x0 + mod(k * 190 + t * 50, x1 - x0)} y={y + 14 + (k % 4) * 12} width={50} height={3} fill="#e8f7ff" opacity={0.35 + 0.3 * Math.sin(t * 4 + k)} />)}
      {lilies && [...Array(10)].map((_, k) => { const lx = x0 + 300 + k * 380 + 20 * Math.sin(t + k); return <g key={'l' + k}><ellipse cx={lx} cy={y + 4} rx={48} ry={12} fill="#4f9a3a" /><circle cx={lx + 10} cy={y - 6} r={k % 3 === 0 ? 10 : 0} fill="#f7a8c8" /></g>; })}
    </g>
  );
}
export function Dust({ x, y, t, t0 = 0, n = 18, seed = 1, col = '#d8b98a', on = 1 }) {
  if (on <= 0) return null;
  const R = rng(seed);
  return <g>{[...Array(n)].map((_, k) => { const u = mod((t - t0) * 0.9 + k / n, 1); return <circle key={k} cx={x - u * 220 - R() * 40} cy={y - u * 60 * R()} r={8 + u * 26} fill={col} opacity={(1 - u) * 0.5 * on} />; })}</g>;
}
export function HeatWaves({ x, y, t, w = 200, on = 1 }) {
  if (on <= 0) return null;
  return <g opacity={on}>{[0, 1, 2, 3].map((k) => { const u = mod(t * 0.7 + k / 4, 1); const yy = y - u * 120; return <path key={k} d={`M${x - w / 2},${yy} q${w / 8},-14 ${w / 4},0 t${w / 4},0 t${w / 4},0 t${w / 4},0`} stroke="#ff7b39" strokeWidth={4} fill="none" opacity={1 - u} />; })}</g>;
}
export function Gauge({ x, y, v, max, label, color = C.red, t, size = 1 }) {
  const a = Math.PI - (Math.PI * Math.min(v, max)) / max;
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      <path d="M-160,0 A160,160 0 0,1 160,0" stroke="#fff" strokeWidth={12} fill="none" />
      <path d={`M-160,0 A160,160 0 0,1 ${160 * Math.cos(a)},${-160 * Math.sin(a)}`} stroke={color} strokeWidth={12} fill="none" />
      <line x1={0} y1={0} x2={135 * Math.cos(a)} y2={-135 * Math.sin(a)} stroke={C.gold} strokeWidth={9} strokeLinecap="round" />
      <circle r={13} fill={C.gold} />
      <text x={0} y={72} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={54} fill={C.gold} stroke="#000" strokeWidth={6} paintOrder="stroke">{label}</text>
    </g>
  );
}
export function Thermo({ x, y, v, t, col = C.red, label }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-20} y={-260} width={40} height={260} rx={20} fill="#fff" opacity={0.9} stroke="#333" strokeWidth={3} />
      <circle cy={20} r={38} fill={col} stroke="#333" strokeWidth={3} />
      <rect x={-11} y={-250 * v} width={22} height={250 * v + 10} fill={col} />
      {label && <text x={0} y={100} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={34} fill="#fff" stroke="#000" strokeWidth={5} paintOrder="stroke">{label}</text>}
    </g>
  );
}
