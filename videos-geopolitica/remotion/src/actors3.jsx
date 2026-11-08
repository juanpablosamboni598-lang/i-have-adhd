// Personajes y escenarios de v15-v17: tardígrado, mariquita, pulgón, larva, pupa, pájaro, ajolote, salamandra.
import React from 'react';
import { C, W, H, blink, rng, pathPts, lerp, cl, mod, layerT } from './lib.jsx';

// ---------------------------------------------------------------- tardígrado (vista lateral, mirando a la derecha)
export function Tardi({ x = 0, y = 0, s = 1, rot = 0, flip = false, t, seed = 1, walk = 1, tun = 0, glow = 0, color = '#d9c7a3', opacity = 1, sleep = 0 }) {
  const ph = t * 6 * walk + seed;
  const br = 1 + 0.03 * Math.sin(t * 2.6 + seed) * (1 - tun);
  const bl = sleep > 0.5 ? 1 : blink(t, seed, 2.6);
  const segs = 4;
  const sx = lerp(1, 0.55, tun), sy = lerp(1, 0.8, tun);
  const legs = [...Array(segs)].map((_, k) => {
    const lx = -90 + k * 60, a = Math.sin(ph + k * 1.3) * 0.5 * walk;
    const len = 46 * (1 - tun);
    return <g key={k} transform={`translate(${lx} 38) rotate(${(a * 180) / Math.PI})`}>{len > 2 && <><path d={`M0,0 Q-6,${len * 0.6} 0,${len}`} stroke={color} strokeWidth={22} strokeLinecap="round" fill="none" /><path d={`M-8,${len} l-6,10 M0,${len + 2} l0,12 M8,${len} l6,10`} stroke="#5a4a32" strokeWidth={3} /></>}</g>;
  });
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot + tun * 15}) scale(${(flip ? -s : s) * sx} ${s * sy * br})`} opacity={opacity}>
      {glow > 0 && <ellipse rx={190} ry={110} fill={C.cyan} opacity={0.25 * glow} filter="url(#blur14)" />}
      {legs}
      <path d="M-140,10 C-150,-50 -90,-80 -20,-82 C60,-84 130,-60 150,-10 C160,30 120,50 60,50 L-100,50 C-130,50 -140,35 -140,10Z" fill={color} stroke="#7a6446" strokeWidth={5} />
      {[...Array(segs - 1)].map((_, k) => <path key={k} d={`M${-70 + k * 60},-78 Q${-62 + k * 60},-10 ${-70 + k * 60},48`} stroke="#b8a37c" strokeWidth={4} fill="none" />)}
      {[...Array(10)].map((_, k) => <circle key={k} cx={-110 + k * 26} cy={-40 + 12 * Math.sin(k)} r={5} fill="#c9b48a" />)}
      <ellipse cx={128} cy={8} rx={28} ry={22} fill={color} stroke="#7a6446" strokeWidth={4} />
      <circle cx={152} cy={14} r={7} fill="#7a4a4a" />
      <g transform="translate(112 -20)"><circle r={7} fill="#111" /><circle cx={2} cy={-2} r={2} fill="#fff" /><rect x={-9} y={-9} width={18} height={18 * bl} fill={color} /></g>
    </g>
  );
}

// ---------------------------------------------------------------- mariquita (vista superior); open = alas desplegadas 0..1
export function Lady({ x = 0, y = 0, s = 1, rot = 0, t, seed = 2, open = 0, spots = 7, color = '#e8322c', walk = 1, opacity = 1, larvaColor, bleed = 0, upside = 0 }) {
  const ph = t * 10 * walk + seed;
  const flap = open > 0.5 ? Math.sin(t * 60) * 0.5 + 0.5 : 0;
  const R = rng(seed + spots);
  const sp = [...Array(spots)].map((_, k) => k === 0 && spots % 2 ? [0, -10] : [(k % 2 ? 1 : -1) * (14 + R() * 26), -30 + R() * 70]);
  const el = (side) => <g transform={`rotate(${side * open * 55} 0 -40)`}><path d={`M0,-44 C${side * 70},-44 ${side * 80},10 ${side * 60},50 C${side * 40},80 ${side * 8},84 0,80Z`} fill={color} stroke="#3a0a0a" strokeWidth={4} />
    {sp.filter((p) => Math.sign(p[0]) === side || p[0] === 0).map((p, k) => <circle key={k} cx={p[0] === 0 ? side * 4 : p[0]} cy={p[1]} r={p[0] === 0 ? 8 : 10} fill="#111" />)}</g>;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={opacity}>
      {[...Array(6)].map((_, k) => { const side = k % 2 ? 1 : -1, row = Math.floor(k / 2); const a = Math.sin(ph + k * 1.7) * 14 * walk; return <path key={k} d={`M${side * 30},${-16 + row * 26} l${side * 34},${-8 + row * 10 + a * 0.3} l${side * 10},${12}`} stroke="#111" strokeWidth={6} fill="none" strokeLinecap="round" transform={`rotate(${side * a} ${side * 30} ${-16 + row * 26})`} />; })}
      {open > 0 && [-1, 1].map((side) => <ellipse key={side} cx={side * (40 + 50 * open)} cy={10} rx={70 * open} ry={34 * open} fill="#e9f3ff" fillOpacity={0.55} stroke="#9ab" strokeWidth={2} transform={`rotate(${side * (20 + 25 * flap)} ${side * 20} -20)`} />)}
      <ellipse cx={0} cy={10} rx={58} ry={72} fill="#1a1a1a" />
      {el(-1)}{el(1)}
      <path d="M-34,-50 C-30,-80 30,-80 34,-50Z" fill="#111" />
      <ellipse cx={-18} cy={-56} rx={10} ry={6} fill="#f5f5f5" /><ellipse cx={18} cy={-56} rx={10} ry={6} fill="#f5f5f5" />
      <path d={`M-12,-74 q-10,-24 -24,-${30 + 4 * Math.sin(t * 5)} M12,-74 q10,-24 24,-${30 + 4 * Math.sin(t * 5 + 1)}`} stroke="#111" strokeWidth={4} fill="none" />
      {bleed > 0 && [...Array(6)].map((_, k) => <circle key={k} cx={(k % 2 ? 1 : -1) * 64} cy={-10 + Math.floor(k / 2) * 26} r={7 * bleed} fill="#f3c623" />)}
    </g>
  );
}
// mariquita de perfil (para vuelo/aterrizaje)
export function LadySide({ x = 0, y = 0, s = 1, t, seed = 3, open = 0, color = '#e8322c', rot = 0 }) {
  const flap = Math.sin(t * 60);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {[0, 1, 2].map((k) => <path key={k} d={`M${-20 + k * 20},20 l${-6 + 6 * Math.sin(t * 9 + k)},26`} stroke="#111" strokeWidth={5} />)}
      {open > 0 && <ellipse cx={-10} cy={-40 - 20 * flap * open} rx={70 * open} ry={16} fill="#e9f3ff" fillOpacity={0.6} stroke="#9ab" strokeWidth={2} transform={`rotate(${-15 + 25 * flap})`} />}
      <g transform={`rotate(${-open * 50} 30 -10)`}><path d="M-50,10 C-50,-50 50,-50 50,10Z" fill={color} stroke="#3a0a0a" strokeWidth={4} /><circle cx={-10} cy={-15} r={8} fill="#111" /><circle cx={20} cy={-5} r={7} fill="#111" /></g>
      <circle cx={58} cy={4} r={18} fill="#111" /><ellipse cx={64} cy={-4} rx={6} ry={4} fill="#f5f5f5" />
    </g>
  );
}
export function Aphid({ x = 0, y = 0, s = 1, t, seed = 4, color = '#8bd36a', opacity = 1 }) {
  const w = 3 * Math.sin(t * 4 + seed);
  return <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}><ellipse rx={20} ry={14 + 0.6 * Math.sin(t * 3 + seed)} fill={color} stroke="#3d7a2a" strokeWidth={2} /><circle cx={18} cy={-4} r={7} fill={color} stroke="#3d7a2a" strokeWidth={2} /><circle cx={21} cy={-6} r={2} fill="#300" />{[-10, 0, 10].map((k) => <path key={k} d={`M${k},12 l${-4 + w},10`} stroke="#3d7a2a" strokeWidth={2} />)}<path d="M-14,-10 l-8,-10 M-6,-12 l-6,-12" stroke="#3d7a2a" strokeWidth={2} /></g>;
}
export function LadyLarva({ x = 0, y = 0, s = 1, rot = 0, t, seed = 5, walk = 1 }) {
  const N = 9;
  return <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>{[...Array(N)].map((_, k) => { const u = k / (N - 1); const yy = 8 * Math.sin(t * 6 * walk - k * 0.8); const r = 20 * (1 - Math.abs(u - 0.35) * 0.9); return <g key={k}><ellipse cx={-k * 24} cy={yy} rx={r + 4} ry={r} fill={k === 3 || k === 4 ? '#f39c34' : '#2a2a3a'} stroke="#111" strokeWidth={2} />{k > 0 && k < N - 1 && <path d={`M${-k * 24},${yy - r} l-4,-12 m8,12 l4,-12`} stroke="#111" strokeWidth={3} />}</g>; })}<circle cx={14} cy={8 * Math.sin(t * 6 * walk)} r={14} fill="#111" />{[0, 1, 2].map((k) => <path key={k} d={`M${-k * 24},14 l${-6 + 8 * Math.sin(t * 9 * walk + k)},18`} stroke="#111" strokeWidth={4} />)}</g>;
}
export function Bird({ x = 0, y = 0, s = 1, t, seed = 6, flip = false, peck = 0, spit = 0 }) {
  const bl = blink(t, seed, 2);
  return <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}><path d="M-60,0 C-60,-50 40,-60 60,-20 C70,10 30,40 -20,40 C-50,40 -60,20 -60,0Z" fill="#4a7fd4" stroke="#1f3f7a" strokeWidth={4} /><path d={`M-40,-10 C-10,${-40 + 20 * Math.sin(t * 8)} 20,-30 30,-5Z`} fill="#2f5fb0" />
    <g transform={`rotate(${peck * 25} 50 -30)`}><circle cx={50} cy={-30} r={30} fill="#4a7fd4" stroke="#1f3f7a" strokeWidth={4} /><path d={`M76,-34 l${30 + spit * 6},${4 + spit * 6} l-30,8Z`} fill="#f0b93a" stroke="#8a6000" strokeWidth={3} /><circle cx={58} cy={-38} r={6} fill="#111" /><rect x={51} y={-45} width={14} height={14 * bl} fill="#4a7fd4" /></g>
    <path d="M-60,10 l-40,-6 l40,24Z" fill="#2f5fb0" /><path d="M-10,40 l-6,30 m20,-30 l6,30" stroke="#f0b93a" strokeWidth={5} />
    {spit > 0 && [...Array(5)].map((_, k) => <circle key={k} cx={110 + spit * 60 + k * 10} cy={-30 + k * 6 - spit * 20} r={5} fill="#f3c623" opacity={1 - spit} />)}</g>;
}
// ---------------------------------------------------------------- ajolote (vista lateral) y salamandra terrestre
export function Axo({ x = 0, y = 0, s = 1, rot = 0, flip = false, t, seed = 7, color = '#5a6b4a', gill = '#a33', swim = 0.6, mouth = 0, glow = 0, missing = 0, opacity = 1, wild = true }) {
  const col = color, gc = gill;
  const bl = blink(t, seed, 3);
  const w = t * 3 * (0.3 + swim) + seed;
  const tail = [...Array(14)].map((_, k) => { const u = k / 13; return [-80 - u * 230, 14 * Math.sin(w - u * 4) * u]; });
  const top = tail.map((p, k) => [p[0], p[1] - 30 * (1 - k / 13) - 22 * (1 - k / 13)]), bot = tail.map((p, k) => [p[0], p[1] + 26 * (1 - k / 13) + 12 * (1 - k / 13)]);
  const leg = (lx, ph, k, back) => { const gone = k === 0 && missing > 0; const len = gone ? 50 * (1 - missing) : 50; return <g key={k} transform={`translate(${lx} 28) rotate(${22 * Math.sin(w * 1.4 + ph)})`}><path d={`M0,0 L${back ? -10 : 10},${len}`} stroke={col} strokeWidth={16} strokeLinecap="round" />{len > 30 && [-8, 0, 8].map((d) => <path key={d} d={`M${back ? -10 : 10},${len} l${d},10`} stroke={col} strokeWidth={5} strokeLinecap="round" />)}</g>; };
  return (
    <g transform={`translate(${x} ${y + 6 * Math.sin(t * 1.5 + seed)}) rotate(${rot}) scale(${flip ? -s : s} ${s})`} opacity={opacity}>
      {glow > 0 && <ellipse rx={260} ry={110} fill={C.cyan} opacity={0.3 * glow} filter="url(#blur14)" />}
      {leg(-40, 2, 2, true)}{leg(110, 0.5, 3, false)}
      <path d={pathPts([...top, ...bot.slice().reverse()]) + 'Z'} fill={col} stroke="#2d3a24" strokeWidth={4} opacity={0.95} />
      <path d={pathPts(top.slice(2))} stroke="#7a8f62" strokeWidth={10} fill="none" opacity={0.7} />
      <path d="M-90,-26 C-20,-44 100,-44 150,-28 L150,30 C100,40 -20,40 -90,30Z" fill={col} stroke="#2d3a24" strokeWidth={4} />
      {wild && [...Array(10)].map((_, k) => <circle key={k} cx={-70 + k * 22} cy={-10 + 10 * Math.sin(k * 2)} r={5} fill="#2d3a24" opacity={0.5} />)}
      {leg(-60, 3.6, 0, true)}{leg(90, 2, 1, false)}
      {missing > 0 && <circle cx={-60} cy={34} r={12 * missing} fill={C.cyan} opacity={0.8} filter="url(#glow)" />}
      <ellipse cx={180} cy={-2} rx={70} ry={50} fill={col} stroke="#2d3a24" strokeWidth={4} />
      {[0, 1, 2].map((k) => <g key={k} transform={`translate(${148 - Math.abs(k - 1) * 4} ${-34 + k * 26}) rotate(${-150 - k * 30 + 6 * Math.sin(t * 3 + k)})`}><path d="M0,0 L80,0" stroke={gc} strokeWidth={8} strokeLinecap="round" />{[...Array(6)].map((_, j) => <path key={j} d={`M${12 + j * 11},0 l4,-10 m-4,10 l4,10`} stroke={gc} strokeWidth={4} />)}</g>)}
      <g transform="translate(212 -16)"><circle r={7} fill="#111" /><circle cx={2} cy={-2} r={2} fill="#fff" /><rect x={-9} y={-9} width={18} height={18 * bl} fill={col} /></g>
      <path d={`M200,${18 + mouth * 6} Q225,${30 + mouth * 14} 246,${12 + mouth * 4}`} stroke="#2d3a24" strokeWidth={4} fill={mouth > 0.1 ? '#4a1a1a' : 'none'} />
    </g>
  );
}
export function Salamander({ x = 0, y = 0, s = 1, t, seed = 8, flip = false }) {
  const w = t * 4 + seed;
  return <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}><path d={`M-80,0 Q-160,${20 * Math.sin(w)} -260,${10 * Math.sin(w + 1)}`} stroke="#3b3b3b" strokeWidth={26} strokeLinecap="round" fill="none" /><ellipse rx={110} ry={30} fill="#3b3b3b" stroke="#111" strokeWidth={4} />{[...Array(6)].map((_, k) => <circle key={k} cx={-70 + k * 30} cy={-8} r={9} fill="#f3c623" />)}<ellipse cx={120} cy={-4} rx={44} ry={28} fill="#3b3b3b" stroke="#111" strokeWidth={4} /><circle cx={135} cy={-16} r={7} fill="#111" />{[-60, 70].map((lx, k) => <path key={k} d={`M${lx},20 l${16 * Math.sin(w + k)},34`} stroke="#3b3b3b" strokeWidth={14} strokeLinecap="round" />)}</g>;
}
// ---------------------------------------------------------------- escenarios
export function MicroBack({ cam, t, seed = 1, tint = '#3f8f7a' }) {
  const R = rng(seed);
  return (
    <g>
      <defs><radialGradient id="micro" cx="0.5" cy="0.45" r="0.8"><stop offset="0" stopColor="#b9ecd6" /><stop offset="0.6" stopColor={tint} /><stop offset="1" stopColor="#0c2a24" /></radialGradient></defs>
      <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="url(#micro)" />
      <g transform={layerT(cam, 0.25)}>{[...Array(14)].map((_, k) => <circle key={k} cx={R() * 2400 - 240} cy={R() * 1300 - 100} r={60 + R() * 140} fill="#dffbea" opacity={0.08} />)}</g>
      <g transform={layerT(cam, 0.45)} filter="url(#blur6)">{[...Array(10)].map((_, k) => { const x0 = R() * 2400 - 240; return <path key={k} d={`M${x0},1300 Q${x0 + 40 * Math.sin(t + k)},800 ${x0 + 30},${400 + R() * 300}`} stroke="#2e7d4f" strokeWidth={30} fill="none" opacity={0.35} />; })}</g>
    </g>
  );
}
export function Moss({ t, y = 860, x0 = -1000, x1 = 3000, seed = 3 }) {
  const R = rng(seed);
  return <g>{[...Array(46)].map((_, k) => { const x = x0 + R() * (x1 - x0), h = 120 + R() * 220; const sw = 10 * Math.sin(t * 1.4 + k); return <g key={k}><path d={`M${x},${y + 40} Q${x + sw},${y - h * 0.5} ${x + sw * 2},${y - h}`} stroke={k % 3 ? '#3c9a4c' : '#57b860'} strokeWidth={14} fill="none" strokeLinecap="round" />{[0.3, 0.55, 0.8].map((u, j) => <ellipse key={j} cx={x + sw * 2 * u + (j % 2 ? 14 : -14)} cy={y - h * u} rx={18} ry={7} fill="#57b860" transform={`rotate(${j % 2 ? -30 : 30} ${x + sw * 2 * u} ${y - h * u})`} />)}</g>; })}
    <rect x={x0} y={y + 30} width={x1 - x0} height={600} fill="#2d5a32" /></g>;
}
export function Waterfilm({ t, y = 860, on = 1 }) { // capa de agua brillante
  if (on <= 0) return null;
  return <g opacity={on}>{[...Array(30)].map((_, k) => <circle key={k} cx={-200 + mod(k * 97 + t * 30, 2300)} cy={y - 60 - (k % 6) * 60} r={10 + (k % 4) * 6} fill="#e6fbff" opacity={0.35} stroke="#fff" strokeWidth={2} />)}</g>;
}
export function GardenBack({ cam, t, seed = 1 }) {
  const R = rng(seed);
  return (
    <g>
      <defs><linearGradient id="garden" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bfe8ff" /><stop offset="0.6" stopColor="#d8f3c8" /><stop offset="1" stopColor="#8cc46a" /></linearGradient></defs>
      <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="url(#garden)" />
      <g transform={layerT(cam, 0.2)} filter="url(#blur14)">{[...Array(16)].map((_, k) => <circle key={k} cx={R() * 2600 - 300} cy={R() * 1000} r={50 + R() * 90} fill={['#ffd6e8', '#fff3b0', '#d6f5ff', '#e3ffd6'][k % 4]} opacity={0.6} />)}</g>
      <g transform={layerT(cam, 0.45)} filter="url(#blur6)">{[...Array(8)].map((_, k) => { const x0 = -300 + k * 340; return <path key={k} d={`M${x0},1300 Q${x0 + 60 * Math.sin(t * 0.8 + k)},700 ${x0 + 120},${300 + 50 * k % 300}`} stroke="#5aa04a" strokeWidth={26} fill="none" opacity={0.5} />; })}</g>
    </g>
  );
}
export function BigLeaf({ x = 0, y = 0, s = 1, rot = 0, t, color = '#6fc04f', seed = 1 }) {
  const sw = 3 * Math.sin(t * 1.2 + seed);
  return <g transform={`translate(${x} ${y}) rotate(${rot + sw}) scale(${s})`}><path d="M-600,0 C-400,-260 300,-280 620,0 C300,280 -400,260 -600,0Z" fill={color} stroke="#3d7a2a" strokeWidth={6} /><path d="M-600,0 L620,0" stroke="#4f9a3a" strokeWidth={10} />{[...Array(8)].map((_, k) => <path key={k} d={`M${-450 + k * 130},0 q60,${k % 2 ? -80 : 80} 140,${k % 2 ? -150 : 150}`} stroke="#4f9a3a" strokeWidth={5} fill="none" />)}</g>;
}
export function CanalBack({ cam, t, seed = 1, murky = 0 }) {
  return (
    <g>
      <defs><linearGradient id="canal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={murky ? '#6a7a4a' : '#5f9a7a'} /><stop offset="1" stopColor={murky ? '#2a3018' : '#16352a'} /></linearGradient></defs>
      <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="url(#canal)" />
      <g transform={layerT(cam, 0.3)}>{[...Array(9)].map((_, k) => { const x0 = -400 + k * 330; return <path key={k} d={`M${x0},1300 Q${x0 + 40 * Math.sin(t + k)},800 ${x0 + 20},${300 + (k % 3) * 120}`} stroke="#3f6a3a" strokeWidth={22} fill="none" opacity={0.5} />; })}</g>
      {[...Array(5)].map((_, k) => <polygon key={k} points={`${-200 + k * 500 + 60 * Math.sin(t * 0.3)},-100 ${-120 + k * 500},-100 ${-400 + k * 500},1300 ${-560 + k * 500},1300`} fill="#fffbe0" opacity={0.05 + 0.03 * Math.sin(t + k)} />)}
    </g>
  );
}
export function Mud({ t, y = 900, x0 = -1000, x1 = 3000, seed = 2 }) {
  const R = rng(seed);
  const pts = [[x0, y + 500]]; for (let x = x0; x <= x1; x += 120) pts.push([x, y + 20 * Math.sin(x * 0.005 + seed)]); pts.push([x1, y + 500]);
  return <g><path d={pathPts(pts) + 'Z'} fill="#4a3f2a" stroke="#2e271a" strokeWidth={5} />{[...Array(16)].map((_, k) => { const px = x0 + R() * (x1 - x0), h = 120 + R() * 260; return <path key={k} d={`M${px},${y} Q${px + 30 * Math.sin(t * 1.2 + k)},${y - h / 2} ${px + 10},${y - h}`} stroke="#4f8a3a" strokeWidth={10} fill="none" strokeLinecap="round" />; })}</g>;
}
export function Microscope({ x = 0, y = 0, s = 1, t }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}><rect x={-120} y={160} width={240} height={40} rx={10} fill="#3a3f4a" /><path d="M60,160 L60,-40 C60,-90 20,-120 -20,-130" stroke="#3a3f4a" strokeWidth={34} fill="none" strokeLinecap="round" /><g transform="rotate(-25 -20 -130)"><rect x={-40} y={-260} width={50} height={170} rx={10} fill="#d0d4dc" stroke="#3a3f4a" strokeWidth={5} /><rect x={-34} y={-300} width={38} height={44} rx={6} fill="#3a3f4a" /></g><rect x={-90} y={40} width={150} height={16} fill="#3a3f4a" /><circle cx={-20} cy={70} r={14} fill="#fff6c2" opacity={0.6 + 0.4 * Math.sin(t * 3)} /></g>;
}
