// Personajes animados: siempre respiran, parpadean y mueven aletas.
import React from 'react';
import { C, blink, rng, pathPts, lerp } from './lib.jsx';

// Tiburón (kind='shark' | 'orca'). Mirando a la derecha, largo ~640 unidades.
export function Shark({ x = 0, y = 0, s = 1, rot = 0, flip = false, t, seed = 1, speed = 1, mouth = 0, jaw = 0, eyeRoll = 0,
  kind = 'shark', opacity = 1, tint, glowParts = {}, heat = 0, belly = false, lateralGlow = 0, ampGlow = 0 }) {
  const orca = kind === 'orca';
  const top = tint || (orca ? '#14181e' : C.sharkTop), low = orca ? '#f4f4f4' : C.sharkBelly;
  const w = t * (4 + 4 * speed) + seed;
  const tail = 14 * Math.sin(w) * (0.4 + 0.6 * Math.min(speed, 1.6));
  const breathe = 1 + 0.018 * Math.sin(t * 2.4 + seed);
  const gill = 0.5 + 0.5 * Math.sin(t * 3.1 + seed);
  const bl = blink(t, seed);
  const R = rng(seed + 99);
  const amp = [...Array(28)].map(() => [258 + R() * 48, -18 + R() * 30]);
  const ma = mouth * 24;
  const body = orca
    ? 'M300,0 C298,-50 220,-88 100,-95 C-20,-98 -150,-62 -240,-14 L-240,14 C-150,50 -20,78 100,78 C220,74 298,48 300,0Z'
    : 'M318,4 C290,-38 205,-80 100,-90 C-20,-96 -150,-62 -240,-14 L-240,14 C-150,48 -20,74 100,74 C200,70 270,44 318,4Z';
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${flip ? -s : s} ${s * breathe})`} opacity={opacity}>
      {/* aleta pectoral lejana */}
      <path d="M90,40 L10,130 L50,48Z" fill={top} opacity={0.6} transform={`rotate(${6 * Math.sin(w * 0.5)} 70 44)`} />
      {/* cola */}
      <g transform={`rotate(${tail} -230 0)`}>
        <path d="M-230,-14 C-260,-12 -290,-8 -300,0 C-290,8 -260,12 -230,14Z" fill={top} stroke={C.line} strokeWidth={4} />
        <g transform={`rotate(${tail * 0.9} -298 0)`}>
          <path d="M-296,-4 C-330,-60 -360,-120 -392,-170 C-372,-100 -362,-40 -352,0 C-362,40 -372,90 -386,135 C-350,95 -320,50 -296,4Z" fill={top} stroke={C.line} strokeWidth={4} />
        </g>
      </g>
      {/* aleta dorsal */}
      <path d={orca ? 'M60,-92 C40,-200 10,-300 -10,-330 C-30,-230 -60,-140 -90,-86Z' : 'M75,-86 C60,-130 30,-170 -5,-195 C-20,-150 -40,-110 -70,-80Z'}
        fill={top} stroke={C.line} strokeWidth={4} transform={`rotate(${1.5 * Math.sin(w * 0.5)} 0 -86)`} />
      <path d="M-170,-42 L-195,-80 L-205,-36Z" fill={top} stroke={C.line} strokeWidth={3} />
      {/* cuerpo */}
      <path d={body} fill={top} stroke={C.line} strokeWidth={5} />
      <path d={orca ? 'M290,20 C230,60 120,70 40,68 C-60,64 -170,40 -238,10 C-120,22 80,30 290,20Z' : 'M310,10 C250,42 150,64 60,66 C-60,62 -170,40 -238,10 C-120,20 60,26 310,10Z'} fill={low} />
      {orca && <ellipse cx={175} cy={-38} rx={42} ry={16} fill="#f4f4f4" transform="rotate(-8 175 -38)" />}
      {orca && <path d="M-60,-60 C-100,-75 -150,-55 -170,-30 C-130,-45 -90,-48 -60,-60Z" fill="#9aa0a8" opacity={0.6} />}
      {heat > 0 && (
        <g opacity={heat}>
          <ellipse cx={40} cy={-5} rx={230} ry={62} fill="#ffb347" opacity={0.55} />
          <ellipse cx={40} cy={-5} rx={160} ry={44} fill="#ff7b39" opacity={0.65} />
          <ellipse cx={40} cy={-5} rx={85} ry={26} fill="#ff3b2f" opacity={0.75 + 0.2 * Math.sin(t * 5)} />
          <ellipse cx={235} cy={-25} rx={24} ry={18} fill="#ff7b39" opacity={0.8} />
        </g>
      )}
      {/* línea lateral */}
      {!orca && <path d="M225,-4 C120,-10 0,-12 -230,0" stroke={lateralGlow ? C.green : '#a9bfd2'} strokeWidth={lateralGlow ? 6 : 3} strokeDasharray="10 9" fill="none" opacity={0.9} />}
      {!orca && lateralGlow > 0 && [...Array(16)].map((_, k) => { const u = k / 15; const px = lerp(220, -225, u); const on = Math.max(0, Math.sin((lateralGlow * 6 - u * 4) * 1.2)); return <circle key={k} cx={px} cy={-6 - 5 * Math.sin(u * 3)} r={6 + 6 * on} fill={C.green} opacity={0.4 + 0.6 * on} />; })}
      {/* branquias que respiran */}
      {[0, 1, 2, 3, 4].map((k) => (
        <path key={k} d={`M${150 + k * 14},-40 Q${138 + k * 14 - gill * 6},0 ${150 + k * 14},40`} stroke={glowParts.gills ? C.red : C.line} strokeWidth={glowParts.gills ? 6 : 4} fill="none" />
      ))}
      {/* hocico, ampollas, fosa nasal */}
      {!orca && amp.map((p, k) => <circle key={k} cx={p[0]} cy={p[1]} r={ampGlow ? 3 + 3 * ampGlow * (0.6 + 0.4 * Math.sin(t * 8 + k)) : 2.6} fill={ampGlow ? C.purple : '#1b2532'} />)}
      {!orca && <ellipse cx={292} cy={-6} rx={11 + 3 * (glowParts.nose ? Math.sin(t * 9) : 0)} ry={4} fill="#151d27" />}
      {/* boca / mandíbula */}
      <g transform={`translate(${jaw * 30} ${jaw * 6})`}>
        {mouth > 0.02 && <path d={`M305,18 L215,26 L${300 - ma},${40 + ma * 2.4}Z`} fill="#5a1a22" />}
        {mouth > 0.02 && [...Array(7)].map((_, k) => <path key={k} d={`M${290 - k * 12},20 l6,0 l-3,${10 + mouth * 6}Z`} fill="#fff" />)}
        <path d="M312,16 C280,24 245,28 212,26" stroke={C.line} strokeWidth={5} fill="none" />
      </g>
      <g transform={`rotate(${ma} 214 28)`}>
        {mouth > 0.02 && [...Array(6)].map((_, k) => <path key={k} d={`M${282 - k * 12},34 l6,0 l-3,${-10 - mouth * 6}Z`} fill="#fff" />)}
        <path d="M300,36 C270,38 240,36 214,30" stroke={C.line} strokeWidth={4} fill="none" />
      </g>
      {/* ojo con parpadeo y giro */}
      <g transform="translate(232 -26)">
        <circle r={11} fill={eyeRoll > 0.5 ? '#f2f2f2' : '#0b0f18'} />
        {eyeRoll <= 0.5 && <circle cx={3 - eyeRoll * 8} cy={-3 + eyeRoll * 14} r={3.5} fill="#fff" />}
        {glowParts.eye && <circle r={20 + 5 * Math.sin(t * 6)} fill={C.red} opacity={0.35} />}
        <rect x={-13} y={-13} width={26} height={26 * bl} fill={top} />
      </g>
      {/* aleta pectoral cercana */}
      <path d="M135,42 C110,90 70,140 30,170 C60,120 75,80 85,46Z" fill={top} stroke={C.line} strokeWidth={4} transform={`rotate(${8 * Math.sin(w * 0.5 + 1)} 110 44)`} />
      {belly && <path d="M310,10 C250,42 150,64 60,66" stroke={C.gold} strokeWidth={6} fill="none" />}
    </g>
  );
}

export function Seal({ x = 0, y = 0, s = 1, rot = 0, flip = false, t, seed = 2, paddle = 1, color = '#7d6b58', silhouette = false, look = 0, opacity = 1 }) {
  const c = silhouette ? '#081018' : color, st = silhouette ? '#081018' : '#3b2f24';
  const w = t * 5 * paddle + seed;
  const bob = 4 * Math.sin(t * 2 + seed);
  const bl = blink(t, seed, 2.2);
  const br = 1 + 0.03 * Math.sin(t * 2.6 + seed);
  return (
    <g transform={`translate(${x} ${y + bob}) rotate(${rot}) scale(${flip ? -s : s} ${s * br})`} opacity={opacity}>
      <g transform={`rotate(${18 * Math.sin(w)} -120 0)`}><path d="M-118,0 L-175,-34 L-165,0 L-178,34Z" fill={c} stroke={st} strokeWidth={3} /></g>
      <path d="M110,10 C80,-30 -20,-38 -120,-6 C-130,0 -130,6 -120,10 C-20,40 80,40 110,10Z" fill={c} stroke={st} strokeWidth={4} />
      {!silhouette && <path d="M100,16 C40,34 -40,30 -110,10 C-40,18 40,18 100,16Z" fill="#a8957e" />}
      <g transform={`rotate(${look * 20} 120 -6)`}>
        <circle cx={130} cy={-8} r={34} fill={c} stroke={st} strokeWidth={4} />
        <ellipse cx={160} cy={0} rx={14} ry={10} fill={silhouette ? c : '#8f7c66'} />
        {!silhouette && <circle cx={142} cy={-18} r={6} fill="#111" />}
        {!silhouette && <rect x={135} y={-25} width={14} height={14 * bl} fill={c} />}
        {!silhouette && <circle cx={170} cy={-2} r={4} fill="#222" />}
        {[...Array(3)].map((_, k) => <path key={k} d={`M166,${4 + k * 3} L${200 + 3 * Math.sin(t * 7 + k)},${-2 + k * 8}`} stroke={silhouette ? c : '#ddd'} strokeWidth={2} />)}
      </g>
      <path d="M40,18 C30,50 15,70 -5,82 C10,55 18,40 20,20Z" fill={c} stroke={st} strokeWidth={3} transform={`rotate(${30 * Math.sin(w + 1)} 30 18)`} />
    </g>
  );
}

export function Fish({ x = 0, y = 0, s = 1, rot = 0, flip = false, t, seed = 3, color = '#ff9f43', wag = 1, opacity = 1 }) {
  const w = t * 9 * wag + seed;
  const bl = blink(t, seed, 1.9);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot + 4 * Math.sin(w * 0.5)}) scale(${flip ? -s : s} ${s})`} opacity={opacity}>
      <g transform={`rotate(${22 * Math.sin(w)} -30 0)`}><path d="M-28,0 L-62,-24 L-56,0 L-62,24Z" fill={color} stroke="#5a3412" strokeWidth={2} /></g>
      <ellipse cx={0} cy={0} rx={40} ry={19} fill={color} stroke="#5a3412" strokeWidth={2.5} />
      <path d="M-5,-18 L-18,-30 L-25,-16Z" fill={color} stroke="#5a3412" strokeWidth={2} />
      <path d="M10,-17 Q2,0 10,17" stroke="#5a3412" strokeWidth={2} fill="none" />
      <circle cx={22} cy={-4} r={4.5} fill="#111" />
      <rect x={17} y={-9} width={10} height={10 * bl} fill={color} />
    </g>
  );
}

export function Diver({ x = 0, y = 0, s = 1, t, seed = 4, point = 0 }) {
  const kick = Math.sin(t * 4 + seed);
  const bubbles = [...Array(6)].map((_, k) => {
    const u = ((t * 0.8 + k / 6) % 1);
    return <circle key={k} cx={30 + 14 * Math.sin(u * 9 + k)} cy={-90 - u * 260} r={4 + u * 7} fill="none" stroke="#cfefff" strokeWidth={2.5} opacity={1 - u} />;
  });
  const suit = '#1d2b3a';
  return (
    <g transform={`translate(${x} ${y + 6 * Math.sin(t * 1.5)}) scale(${s})`}>
      {bubbles}
      <rect x={-48} y={-50} width={30} height={92} rx={13} fill="#f2b705" stroke="#6b5200" strokeWidth={2} />
      <g transform={`rotate(${kick * 12} -8 40)`}><path d="M-8,40 L-20,120" stroke={suit} strokeWidth={18} strokeLinecap="round" /><path d="M-20,118 L-55,160 L5,150Z" fill="#1fa2ff" /></g>
      <g transform={`rotate(${-kick * 12} 8 40)`}><path d="M8,40 L18,120" stroke={suit} strokeWidth={18} strokeLinecap="round" /><path d="M18,118 L-8,158 L55,152Z" fill="#1fa2ff" /></g>
      <rect x={-24} y={-58} width={48} height={106} rx={22} fill={suit} />
      <path d={`M0,-35 L${50 + point * 40},${-10 - point * 60}`} stroke={suit} strokeWidth={14} strokeLinecap="round" />
      <path d={`M0,-35 L-40,${15 + 8 * Math.sin(t * 2)}`} stroke={suit} strokeWidth={14} strokeLinecap="round" />
      <circle cx={0} cy={-84} r={28} fill="#f0c8a0" />
      <rect x={-14} y={-98} width={40} height={22} rx={8} fill="#5fd0ff" stroke="#111" strokeWidth={2.5} />
      <circle cx={20} cy={-72} r={6} fill="#333" />
    </g>
  );
}

export function Surfer({ x = 0, y = 0, s = 1, t, silhouette = true }) {
  const c = silhouette ? '#081018' : '#d35400';
  const a = Math.sin(t * 3);
  return (
    <g transform={`translate(${x} ${y + 3 * Math.sin(t * 2)}) scale(${s})`}>
      <path d="M-170,0 C-120,-22 120,-22 180,0 C120,22 -120,22 -170,0Z" fill={c} />
      <path d="M-90,-6 L60,-12" stroke={c} strokeWidth={30} strokeLinecap="round" />
      <circle cx={85} cy={-16} r={20} fill={c} />
      <path d={`M40,-8 L${70 + 40 * a},${40 + 30 * Math.abs(a)}`} stroke={c} strokeWidth={13} strokeLinecap="round" />
      <path d={`M30,-8 L${60 - 40 * a},${40 + 30 * Math.abs(a)}`} stroke={c} strokeWidth={13} strokeLinecap="round" />
      <path d={`M-90,-4 L-150,${30 + 10 * Math.sin(t * 2.5)}`} stroke={c} strokeWidth={14} strokeLinecap="round" />
      <path d={`M-80,-4 L-140,${36 + 10 * Math.sin(t * 2.5 + 1)}`} stroke={c} strokeWidth={14} strokeLinecap="round" />
    </g>
  );
}

// Sombra en el fondo que cambia con la luz y la altura
export function Shadow({ x, groundY, y, size = 300, lightX = 960 }) {
  const h = Math.max(0, groundY - y);
  const k = Math.max(0.15, 1 - h / 900);
  return <ellipse cx={x + (x - lightX) * 0.08 * (1 + h / 400)} cy={groundY + 12} rx={size * (1.2 - k * 0.4)} ry={size * 0.12 * k + 6} fill="#000" opacity={0.35 * k} />;
}
// Gotas/salpicaduras con física
export function Splash({ x, y, t, t0, n = 46, power = 1, seed = 1 }) {
  const u = t - t0; if (u < 0 || u > 2.2) return null;
  const R = rng(seed);
  return (<g>{[...Array(n)].map((_, k) => {
    const a = -Math.PI / 2 + (R() - 0.5) * 2.2, v = (500 + R() * 700) * power;
    const px = x + Math.cos(a) * v * u, py = y + Math.sin(a) * v * u + 900 * u * u;
    return <circle key={k} cx={px} cy={py} r={4 + R() * 9} fill="#e8f7ff" opacity={Math.max(0, 1 - u / 2.2)} />;
  })}
    <ellipse cx={x} cy={y} rx={40 + 420 * Math.min(1, u)} ry={10 + 30 * Math.min(1, u)} fill="none" stroke="#f2fbff" strokeWidth={8} opacity={Math.max(0, 1 - u / 1.6)} />
  </g>);
}
export function BubbleTrail({ pts, t, seed = 1, n = 20 }) {
  const R = rng(seed);
  return <g>{[...Array(n)].map((_, k) => { const u = (t * 0.6 + k / n) % 1; const p = pts(u, k); return <circle key={k} cx={p[0] + 10 * Math.sin(t * 3 + k)} cy={p[1] - u * 140} r={3 + R() * 7} fill="none" stroke="#cfefff" strokeWidth={2} opacity={0.9 * (1 - u)} />; })}</g>;
}
