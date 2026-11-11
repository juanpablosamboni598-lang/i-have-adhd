// Personajes de v19: delfín (ojo y espiráculo animables), cerebro de dos mitades, ondas, pato, fragata, cachalote, persona en cama, lancha.
import React from 'react';
import { C, blink, rng, pathPts, lerp, cl, mod } from './lib.jsx';

const INK = '#1d2b3a';
// ---------------------------------------------------------------- delfín (vista lateral, mirando a la derecha, largo ~560)
// eye: 1 abierto, 0 cerrado · hole: espiráculo abierto 0..1 · swim: batido de cola · sleep: 0..1 (más lento, Zzz)
export function Dolphin({ x = 0, y = 0, s = 1, rot = 0, flip = false, t, seed = 1, swim = 1, eye = 1, hole = 0, blow = 0, sleep = 0, color = '#7fa6c4', belly = '#dfe9ef', opacity = 1, brain = null, mouth = 0, click = 0 }) {
  const w = t * (3 + 3 * swim) + seed;
  const fl = 22 * Math.sin(w) * (0.3 + 0.7 * swim);
  const bob = 6 * Math.sin(t * 1.3 + seed);
  const bl = eye < 0.5 ? 1 : blink(t, seed, 3.4);
  const open = cl(eye) * (1 - bl);
  const body = `M322,6 C300,0 270,-4 248,-8 C240,-36 214,-60 168,-68 C80,-82 -60,-76 -160,-52 C-220,-38 -260,-18 -285,${-4 + fl * 0.3} L-285,${8 + fl * 0.3} C-240,24 -150,52 -40,58 C80,62 190,46 246,22 C272,18 300,16 322,10Z`;
  return (
    <g transform={`translate(${x} ${y + bob}) rotate(${rot}) scale(${flip ? -s : s} ${s})`} opacity={opacity}>
      {/* aleta caudal: se mueve arriba y abajo */}
      <g transform={`translate(-275 ${fl * 0.3}) rotate(${fl * 0.9})`}><path d="M0,0 C-30,-10 -70,-60 -90,-70 C-70,-30 -60,-10 -60,0 C-60,10 -70,30 -90,70 C-70,60 -30,10 0,0Z" fill={color} stroke={INK} strokeWidth={5} strokeLinejoin="round" /></g>
      <path d="M50,-78 C30,-112 -6,-142 -56,-156 C-34,-124 -34,-96 -44,-72Z" fill={color} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d={body} fill={color} stroke={INK} strokeWidth={5} />
      <path d="M-230,16 C-150,42 60,50 246,20 C272,16 300,14 322,9 C300,16 270,22 246,24 C190,48 80,62 -40,58 C-130,54 -200,38 -230,16Z" fill={belly} /><path d="M-230,16 C-120,30 60,34 246,14" stroke={belly} strokeWidth={22} fill="none" opacity={0.85} />
      <path d="M-120,-56 C0,-74 120,-66 200,-50" stroke="#8fb0c8" strokeWidth={10} fill="none" opacity={0.6} strokeLinecap="round" />
      <g transform={`translate(110 30) rotate(${30 + 12 * Math.sin(w * 0.8)})`}><path d="M0,0 C20,10 40,40 30,70 C10,50 -10,30 0,0Z" fill={color} stroke={INK} strokeWidth={4} /></g>
      <path d={`M236,10 Q280,${18 + mouth * 10} 320,8`} stroke={INK} strokeWidth={4} fill="none" />
      <path d="M236,10 q-10,-6 -14,-14" stroke={INK} strokeWidth={3} fill="none" />
      {/* ojo */}
      <g transform="translate(200 -14)">
        <ellipse rx={14} ry={13 * Math.max(0.12, open)} fill="#111" />
        {open > 0.3 && <circle cx={3} cy={-3} r={3.5} fill="#fff" />}
        {open <= 0.3 && <path d="M-13,0 Q0,7 13,0" stroke={INK} strokeWidth={4} fill="none" />}
      </g>
      {/* espiráculo */}
      <ellipse cx={140} cy={-70} rx={14} ry={4 + 6 * hole} fill={hole > 0.1 ? '#1d2b3a' : '#5f7d95'} stroke={INK} strokeWidth={3} />
      {blow > 0 && [...Array(14)].map((_, k) => { const u = mod(blow * 1.6 + k / 14, 1); return <circle key={k} cx={140 + (k % 5 - 2) * 14 * u} cy={-84 - u * 220} r={8 + 16 * u} fill="#fff" opacity={0.75 * (1 - u)} />; })}
      {click > 0 && [0, 1, 2].map((k) => { const u = mod(t * 1.5 + k / 3, 1); return <path key={k} d={`M${320 + u * 300},${-40 - u * 60} Q${340 + u * 330},0 ${320 + u * 300},${40 + u * 60}`} stroke="#bff3ff" strokeWidth={6} fill="none" opacity={(1 - u) * click} />; })}
      {sleep > 0 && [0, 1, 2].map((k) => { const u = mod(t * 0.5 + k / 3, 1); return <text key={k} x={230 + u * 60 + k * 10} y={-90 - u * 120} fontFamily="Inter" fontWeight={900} fontSize={30 + u * 20} fill="#fff" opacity={sleep * (1 - u)}>z</text>; })}
      {brain && <g transform="translate(40 -230) scale(0.36)"><Brain2 t={t} sleepL={brain[0]} sleepR={brain[1]} side /></g>}
    </g>
  );
}
// Cerebro visto desde arriba: dos hemisferios; sleepL/sleepR 0 despierto (amarillo) .. 1 dormido (azul con Zzz)
export function Brain2({ x = 0, y = 0, s = 1, t, sleepL = 0, sleepR = 1, side = false, labels = false }) {
  const col = (v) => `rgb(${Math.round(lerp(255, 80, v))},${Math.round(lerp(196, 130, v))},${Math.round(lerp(60, 220, v))})`;
  const hemi = (dir, v) => (
    <g transform={`scale(${dir} 1)`}>
      <path d="M6,-150 C80,-160 170,-110 180,-20 C190,70 140,150 6,150Z" fill={col(v)} stroke="#2a2440" strokeWidth={8} />
      {[...Array(5)].map((_, k) => <path key={k} d={`M${30 + k * 26},-120 q${30 * Math.sin(k)},60 0,${110 + k * 10} q-20,40 10,80`} stroke="#2a2440" strokeWidth={5} fill="none" opacity={0.5} />)}
      <circle cx={95} cy={0} r={110 + 10 * Math.sin(t * (v > 0.5 ? 1 : 6))} fill={v > 0.5 ? '#6ab0ff' : '#fff3a0'} opacity={0.18 + 0.1 * Math.sin(t * 3)} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {hemi(-1, sleepL)}{hemi(1, sleepR)}
      {[[-1, sleepL], [1, sleepR]].map(([d, v], k) => v > 0.5 && [0, 1].map((j) => { const u = mod(t * 0.6 + j / 2, 1); return <text key={k + '' + j} x={d * 95 + 20 * u} y={-60 - u * 120} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={50 + 30 * u} fill="#fff" opacity={1 - u}>Z</text>; }))}
      {labels && <g><text x={-95} y={210} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={40} fill="#fff">IZQ.</text><text x={95} y={210} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={40} fill="#fff">DER.</text></g>}
    </g>
  );
}
// Trazo de electroencefalograma: slow 1 = ondas lentas grandes, 0 = rápidas pequeñas
export function Wave({ x = 0, y = 0, w = 600, t, slow = 0, color = '#7dfcff', label }) {
  const pts = [...Array(121)].map((_, k) => { const u = k / 120; const ph = u * w; const a = slow > 0.5 ? 60 * Math.sin(ph * 0.025 - t * 3) : 14 * Math.sin(ph * 0.22 - t * 12) + 8 * Math.sin(ph * 0.5 - t * 20); return [x + ph, y + a]; });
  return <g><rect x={x - 20} y={y - 90} width={w + 40} height={180} rx={14} fill="#06182e" stroke="#2a4a6a" strokeWidth={4} /><path d={pathPts(pts)} stroke={color} strokeWidth={5} fill="none" />{label && <text x={x} y={y - 100} fontFamily="Inter" fontWeight={900} fontSize={30} fill="#fff">{label}</text>}</g>;
}
export function Duck({ x = 0, y = 0, s = 1, t, seed = 1, eye = 1, flip = false }) {
  const bob = 4 * Math.sin(t * 2 + seed); const op = eye * (eye > 0.5 ? 1 - blink(t, seed, 2.8) : 1);
  return <g transform={`translate(${x} ${y + bob}) scale(${flip ? -s : s} ${s})`}><ellipse rx={70} ry={38} fill="#8a6a4a" stroke="#3a2a1a" strokeWidth={4} /><path d="M-70,-10 l-30,-20 l10,30Z" fill="#6a4a2a" /><circle cx={56} cy={-46} r={30} fill="#2f7a4a" stroke="#1a3a2a" strokeWidth={4} /><path d="M80,-44 l34,6 l-34,8Z" fill="#f4b23c" stroke="#8a5a1a" strokeWidth={3} /><ellipse cx={64} cy={-52} rx={6} ry={6 * Math.max(0.15, op)} fill="#111" />{op < 0.3 && <path d="M57,-52 q7,5 14,0" stroke="#111" strokeWidth={3} fill="none" />}</g>;
}
export function Frigate({ x = 0, y = 0, s = 1, t, seed = 1, eye = 1 }) {
  const f = 18 * Math.sin(t * 1.2 + seed);
  return <g transform={`translate(${x} ${y}) scale(${s})`}><path d={`M0,0 C-80,${-30 + f} -180,${-10 + f * 1.6} -260,${30 + f * 2} C-170,${10 + f} -80,20 0,14 C80,20 170,${10 + f} 260,${30 + f * 2} C180,${-10 + f * 1.6} 80,${-30 + f} 0,0Z`} fill="#1f1f28" /><ellipse cx={0} cy={10} rx={40} ry={18} fill="#1f1f28" /><circle cx={40} cy={2} r={14} fill="#1f1f28" /><path d="M52,2 l40,6 l-40,4Z" fill="#9aa" /><circle cx={30} cy={22} r={12} fill="#e23" /><circle cx={44} cy={-2} r={3 * eye + 0.5} fill="#fff" /><path d="M-30,16 l-40,40 M-20,16 l-10,46" stroke="#1f1f28" strokeWidth={8} /></g>;
}
export function SpermWhale({ x = 0, y = 0, s = 1, rot = -90, t, seed = 1 }) {
  const b = 4 * Math.sin(t * 0.8 + seed);
  return <g transform={`translate(${x} ${y + b}) rotate(${rot}) scale(${s})`}><path d="M300,-80 C340,-80 360,-40 360,0 C360,50 330,70 260,70 L-160,50 C-240,40 -300,20 -340,0 C-300,-20 -240,-50 -160,-60Z" fill="#5a6470" stroke="#2a3038" strokeWidth={6} /><path d="M-330,0 C-370,-30 -420,-60 -440,-70 C-420,-30 -420,30 -440,70 C-420,60 -370,30 -330,0Z" fill="#5a6470" stroke="#2a3038" strokeWidth={6} /><path d="M330,60 L200,66" stroke="#2a3038" strokeWidth={6} /><circle cx={220} cy={20} r={7} fill="#111" /><path d="M213,20 q7,5 14,0" stroke="#2a3038" strokeWidth={3} fill="none" /></g>;
}
export function Bed({ x = 0, y = 0, s = 1, t, eyeL = 0, eyeR = 0, hotel = false }) {
  const br = 1 + 0.03 * Math.sin(t * 1.4);
  return <g transform={`translate(${x} ${y}) scale(${s})`}><rect x={-300} y={-40} width={600} height={120} rx={20} fill={hotel ? '#c9a06a' : '#8a5a3a'} /><rect x={-320} y={-160} width={40} height={240} rx={10} fill={hotel ? '#a07a4a' : '#6a4a2a'} /><rect x={-280} y={-80} width={140} height={60} rx={26} fill="#fff" />
    <circle cx={-200} cy={-90} r={46} fill="#f0c8a0" /><path d="M-246,-104 Q-200,-150 -154,-104" fill="#4a2a1a" />
    {[[-218, eyeL], [-182, eyeR]].map(([ex, e], k) => <g key={k}>{e > 0.5 ? <circle cx={ex} cy={-92} r={7} fill="#222" /> : <path d={`M${ex - 8},-92 q8,6 16,0`} stroke="#222" strokeWidth={4} fill="none" />}</g>)}
    <path d={`M-150,${-50 * br} C0,${-80 * br} 200,${-70 * br} 280,-40 L280,40 L-150,40Z`} fill={hotel ? '#e8f0f8' : '#6a8fc0'} stroke="#3a4a6a" strokeWidth={5} /></g>;
}
export function Boat({ x = 0, y = 0, s = 1, t, flip = false }) {
  const r = 3 * Math.sin(t * 2);
  return <g transform={`translate(${x} ${y}) rotate(${r}) scale(${flip ? -s : s} ${s})`}><path d="M-200,0 L220,0 L170,70 L-170,70Z" fill="#f4f4f4" stroke="#333" strokeWidth={6} /><rect x={-80} y={-70} width={130} height={70} rx={10} fill="#d23" stroke="#333" strokeWidth={5} /><rect x={-60} y={-56} width={40} height={30} fill="#9fd4f5" /><path d="M-200,40 l-80,0" stroke="#fff" strokeWidth={10} opacity={0.6} />{[...Array(6)].map((_, k) => <circle key={k} cx={-220 - mod(t * 300 + k * 40, 240)} cy={50 + (k % 3) * 8} r={10 + k} fill="#fff" opacity={0.6} />)}</g>;
}
