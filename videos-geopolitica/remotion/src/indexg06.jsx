// ViceLeakss g06: animación 2D plana (SVG), estilo propio del canal: fondo #0B0B10, rojo/lima/azul, figuras sin cara.
// Formato de historia. Cada escena se mueve todo el tiempo (cámara que deriva + elementos animados) para pasar el QC.
import React from 'react';
import { registerRoot, Composition, useCurrentFrame, AbsoluteFill, Easing } from 'remotion';
import D from './datag06.json';
import { TypeCard } from './three/scenes_g02.jsx';

const C = { bg: '#0b0b10', text: '#f0ebe4', red: '#f84418', lime: '#d2f834', blue: '#2a42f6', paper: '#efe9e1', gray: '#8a8d96', dark: '#23262d', card: '#1c1e23', card2: '#31373f', gold: '#e8b730', skin: '#c9a27e' };
const K = (c) => C[c] || c || C.text;
const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = Easing.bezier(0.33, 0, 0.2, 1);
const tw = (t, a, b) => ease(cl((t - a) / (b - a)));
const pop = (t, a, d = 0.35) => { const u = cl((t - a) / d); return u <= 0 ? 0 : 1 + Math.sin(u * Math.PI) * 0.18 * (1 - u) - (1 - ease(u)) * 1; };
const P = (x) => Math.max(0.0001, x);
const FONT = '"Inter Display", Inter, sans-serif', MONO = '"JetBrains Mono", monospace';
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zñ0-9]/g, '');
const COL = { r: C.red, l: C.lime, b: C.blue };
const parse = (s) => s.split(' ').map((w) => { const m = w.match(/^\^([rlbs])(.*)$/); if (!m) return { w, c: C.text, s: 0 }; return { w: m[2], c: m[1] === 's' ? C.text : COL[m[1]], s: m[1] === 's' ? 1 : 0 }; });

const Caps = ({ caps = [], words = [], t, d }) => {
  const timed = caps.map(([trig, text]) => { const alts = trig.split('|').map(norm); const w = words.find(([x]) => alts.some((a) => norm(x).includes(a))); return { at: w ? w[1] : null, ws: parse(text) }; })
    .filter((c) => c.at !== null).sort((a, b) => a.at - b.at);
  return <>{timed.map((c, k) => {
    const end = k + 1 < timed.length ? timed[k + 1].at : d - 0.05;
    if (t < c.at - 0.02 || t > end) return null;
    const ex = cl((t - (end - 0.22)) / 0.22);
    return <div key={k} style={{ position: 'absolute', top: 60, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 78, letterSpacing: 1, textShadow: '0 4px 14px rgba(0,0,0,0.7)', filter: `blur(${ex * 10}px)`, opacity: 1 - ex * 0.9 }}>
      {c.ws.map((x, j) => { const u = cl((t - c.at - j * 0.11) / 0.18); return <span key={j} style={{ display: 'inline-block', position: 'relative', margin: '0 12px', color: ex > 0 ? '#6b6b70' : x.c, opacity: u, transform: `translateY(${(1 - u) * 16}px) scale(${0.9 + 0.1 * u})` }}>
        {x.w}{x.s ? <span style={{ position: 'absolute', left: -4, right: -4, top: '52%', height: 8, background: C.red, transformOrigin: 'left', transform: `scaleX(${cl((t - c.at - j * 0.11 - 0.2) / 0.2)})` }} /> : null}</span>; })}
    </div>;
  })}</>;
};
const Grain = ({ f }) => <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen', opacity: 0.07, pointerEvents: 'none' }}>
  <filter id={`g${f % 8}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 8} /></filter><rect width="100%" height="100%" filter={`url(#g${f % 8})`} /></svg>;
const Card = ({ t, d, lines, paper, x = 110, y = 800 }) => lines && lines.length ? <TypeCard t={t} at={d * 0.12} lines={lines} x={x} y={y} paper={paper} /> : null;

// ---------- piezas 2D ----------
const Shadow = ({ x, y, w = 300, o = 0.35 }) => <ellipse cx={x} cy={y} rx={w / 2} ry={w / 12} fill="#000" opacity={o} />;
// persona sin cara, con capucha; typing=teclea, hair=pelo largo
const Person = ({ x, y, s = 1, col = C.gray, t = 0, typing = 0, hair = 0, hood = 1, k = 0 }) => {
  const bob = Math.sin(t * 3 + k) * 4, arm = typing ? Math.sin(t * 18 + k) * 6 : Math.sin(t * 1.5 + k) * 3;
  return <g transform={`translate(${x},${y + bob}) scale(${s})`}>
    <rect x={-70} y={-150} width={140} height={170} rx={60} fill={col} />
    <rect x={-95} y={-120 + arm} width={34} height={110} rx={17} fill={col} transform={`rotate(${typing ? -35 : 8} -78 -115)`} />
    <rect x={61} y={-120 - arm} width={34} height={110} rx={17} fill={col} transform={`rotate(${typing ? 35 : -8} 78 -115)`} />
    {hair ? <rect x={-62} y={-262} width={124} height={150} rx={50} fill="#2b1d16" /> : null}
    <circle cx={0} cy={-205} r={52} fill={C.skin} />
    {hood ? <path d="M-66,-200 Q-66,-275 0,-275 Q66,-275 66,-200 L66,-150 Q0,-120 -66,-150 Z" fill={col} opacity={0.95} /> : null}
    {hood ? <ellipse cx={0} cy={-200} rx={40} ry={46} fill="#141418" /> : null}
  </g>;
};
const TV = ({ x, y, w = 520, h = 300, txt = '', glow = C.blue, t = 0, fs = 120, flick = 1 }) => {
  const fl = flick ? 0.85 + Math.sin(t * 23) * 0.06 + Math.sin(t * 7) * 0.05 : 1;
  return <g transform={`translate(${x},${y})`}>
    <rect x={-w / 2 - 40} y={-h / 2 - 40} width={w + 80} height={h + 80} rx={30} fill={glow} opacity={0.12 * fl} />
    <rect x={-w / 2 - 14} y={-h / 2 - 14} width={w + 28} height={h + 28} rx={14} fill="#15161b" />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={6} fill={glow} opacity={0.35 * fl} />
    {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={-w / 2} y={-h / 2 + ((i * h / 8 + t * 60) % h)} width={w} height={3} fill="#fff" opacity={0.06} />)}
    <text x={0} y={fs * 0.35} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={fs} fill={C.text} opacity={fl}>{txt}</text>
    <rect x={-60} y={h / 2 + 14} width={120} height={18} fill="#15161b" /><rect x={-110} y={h / 2 + 30} width={220} height={14} rx={7} fill="#15161b" />
  </g>;
};
const Bed = ({ x, y }) => <g transform={`translate(${x},${y})`}><rect x={-230} y={-40} width={460} height={90} rx={16} fill={C.card2} /><rect x={-230} y={-120} width={40} height={170} rx={10} fill={C.dark} /><rect x={-180} y={-80} width={120} height={50} rx={20} fill={C.paper} opacity={0.8} /><rect x={-60} y={-60} width={290} height={30} rx={10} fill={C.blue} opacity={0.55} /></g>;
const Win = ({ x, y, t }) => <g transform={`translate(${x},${y})`}><rect x={-120} y={-150} width={240} height={300} rx={8} fill="#11131f" stroke={C.card2} strokeWidth={14} />
  <circle cx={40 + Math.sin(t * 0.3) * 10} cy={-70} r={34} fill={C.paper} opacity={0.85} /><line x1={0} y1={-150} x2={0} y2={150} stroke={C.card2} strokeWidth={10} />
  {[[-70, -100], [-40, 40], [60, 80], [-80, 100]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={3} fill="#fff" opacity={0.4 + 0.4 * Math.sin(t * 3 + i)} />)}</g>;
const Tag = ({ x, y, txt, col = C.red, fg = C.text, s = 1, rot = 0, fs = 54 }) => { const w = Math.max(160, txt.length * fs * 0.62 + 70);
  return <g transform={`translate(${x},${y}) rotate(${rot}) scale(${P(s)})`}><rect x={-w / 2} y={-fs * 0.85} width={w} height={fs * 1.7} rx={14} fill={col} /><circle cx={-w / 2 + 26} cy={0} r={9} fill={C.bg} />
    <text x={12} y={fs * 0.36} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={fs} fill={fg}>{txt}</text></g>; };
const Num = ({ x, y, v, suffix = '', col = C.lime, fs = 200 }) => <text x={x} y={y} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={fs} fill={col}>{v}<tspan fontSize={fs * 0.42}>{suffix}</tspan></text>;
const Sparks = ({ t, n = 14, cx = 960, cy = 560, r = 520 }) => <>{Array.from({ length: n }).map((_, k) => { const u = (t * 0.22 + k / n) % 1, a = k * 2.4;
  return <circle key={k} cx={cx + Math.cos(a) * r * (0.4 + u * 0.6)} cy={cy + Math.sin(a) * r * 0.5 * (0.4 + u * 0.6) - u * 120} r={5 + (k % 3) * 3} fill={[C.red, C.lime, C.blue][k % 3]} opacity={Math.sin(u * Math.PI) * 0.8} />; })}</>;
const Floor = () => <rect x={0} y={880} width={1920} height={200} fill="#101116" />;

// ---------- escenas ----------
const SC = {
  cuarto: ({ t, d, p }) => <>
    <Floor /><Win x={430} y={430} t={t} /><Bed x={720} y={820} />
    <TV x={1350} y={470} w={480} h={280} txt={p.scr} glow={C.blue} t={t} fs={150} />
    <rect x={1240} y={640} width={220} height={240} fill={C.dark} />
    <Shadow x={1100} y={900} w={260} /><Person x={1100} y={870} s={0.95} col={C.red} t={t} typing={1} />
    <g transform={`translate(1100,${740 + Math.sin(t * 2) * 3})`}><rect x={-90} y={-14} width={180} height={28} rx={6} fill="#2c2f37" />{Array.from({ length: 8 }).map((_, i) => <rect key={i} x={-80 + i * 20} y={-8} width={14} height={14} rx={3} fill={Math.floor(t * 9 + i * 3) % 5 ? '#4a4e58' : C.lime} />)}</g>
    <line x1={1350} y1={640} x2={1120} y2={740} stroke={C.lime} strokeWidth={3} strokeDasharray="10 14" strokeDashoffset={-t * 60} opacity={0.6} />
  </>,
  titulo: ({ t, p }) => { const g = Math.sin(t * 13) > 0.92 ? 12 : 0;
    return <><Sparks t={t} n={20} />
      <text x={960 + g} y={560} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={170 * (0.96 + 0.04 * Math.sin(t))} fill={C.red} opacity={0.5}>{p.head}</text>
      <text x={960 - g / 2} y={555} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={170 * (0.96 + 0.04 * Math.sin(t))} fill={C.text}>{p.head}</text>
      <Tag x={960} y={700} txt={p.sub} col={C.lime} fg={C.bg} s={pop(t, 0.5)} rot={Math.sin(t * 1.3) * 3} fs={46} /></>; },
  calendario: ({ t, d, p }) => { const flip = tw(t, d * 0.15, d * 0.35);
    return <><Sparks t={t} n={10} />
      <g transform={`translate(960,560) rotate(${Math.sin(t * 0.8) * 3})`}>
        <rect x={-260} y={-280} width={520} height={560} rx={26} fill={C.paper} /><rect x={-260} y={-280} width={520} height={130} rx={26} fill={C.red} />
        {[-150, 0, 150].map((a) => <rect key={a} x={a - 10} y={-310} width={20} height={70} rx={10} fill={C.card2} />)}
        <text x={0} y={-190} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={70} fill={C.text}>{p.month}</text>
        <text x={0} y={90} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={260} fill="#141018">{p.day}</text>
        <text x={0} y={210} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={56} fill={C.gray}>{p.year}</text>
        <g transform={`translate(0,-150) scale(1,${1 - flip})`} opacity={1 - flip}><rect x={-260} y={0} width={520} height={430} fill={C.paper} stroke="#d8d0c4" strokeWidth={4} /></g>
      </g></>; },
  foro: ({ t, d, p }) => { const n = Math.round(p.to * tw(t, d * 0.3, d * 0.75));
    return <><g transform={`translate(960,${520 + Math.sin(t) * 6})`}>
      <rect x={-560} y={-300} width={1120} height={560} rx={24} fill={C.card} /><rect x={-560} y={-300} width={1120} height={70} rx={24} fill={C.card2} />
      {[0, 1, 2].map((i) => <circle key={i} cx={-520 + i * 36} cy={-265} r={11} fill={[C.red, C.gold, C.lime][i]} />)}
      <circle cx={-450} cy={-150} r={50} fill={C.gray} /><text x={-380} y={-160} fontFamily={MONO} fontWeight={800} fontSize={40} fill={C.text}>{p.user}</text>
      <text x={-380} y={-115} fontFamily={MONO} fontSize={30} fill={C.gray}>miembro nuevo · hace 1 min</text>
      {Array.from({ length: 10 }).map((_, i) => { const on = i < n / 9; return <g key={i} transform={`translate(${-470 + (i % 5) * 230},${-20 + Math.floor(i / 5) * 150}) scale(${P(on ? pop(t, d * 0.3 + i * 0.12) : 0)})`}>
        <rect x={-95} y={-55} width={190} height={110} rx={10} fill={['#3b2a55', '#1f4d5c', '#5c3a1f', '#204a2a'][i % 4]} /><path d="M-18,-26 L28,0 L-18,26 Z" fill={C.text} opacity={0.85} /></g>; })}
      </g><Tag x={1460} y={260} txt={`${n} VIDEOS`} col={C.red} s={pop(t, d * 0.3)} rot={6 + Math.sin(t * 2) * 2} /></>; },
  tv: ({ t, d, p }) => <><Floor />
    {Array.from({ length: 6 }).map((_, i) => { const x = ((i * 340 - t * 50) % 2200 + 2200) % 2200 - 140; return <g key={i} transform={`translate(${x},880)`}><rect x={-8} y={-300} width={16} height={300} fill="#3d3324" /><path d="M0,-300 Q-90,-330 -150,-280 M0,-300 Q90,-340 150,-285 M0,-300 Q-40,-380 -100,-390 M0,-300 Q40,-385 105,-385" stroke={C.lime} strokeWidth={22} fill="none" strokeLinecap="round" opacity={0.75} /></g>; })}
    <TV x={960} y={480} w={700} h={400} txt={p.scr} glow={C.red} t={t} fs={170} />
    <rect x={720} y={660} width={480} height={18} rx={9} fill={C.blue} opacity={0.5 + 0.5 * Math.sin(t * 6)} /></>,
  duo2: ({ t, d }) => <><Floor /><rect x={300} y={700} width={1320} height={180} rx={14} fill={C.card2} /><rect x={300} y={700} width={1320} height={30} fill={C.dark} />
    <Shadow x={800} y={900} w={240} /><Shadow x={1120} y={900} w={240} />
    <g transform={`translate(${-60 * (1 - tw(t, 0.2, 0.9))},0)`}><Person x={800} y={880} col={C.blue} t={t} k={0} /></g>
    <g transform={`translate(${60 * (1 - tw(t, 0.4, 1.1))},0)`}><Person x={1120} y={880} col={C.red} t={t} hair={1} hood={0} k={2} /></g>
    <Tag x={960} y={300} txt="1 + 1" col={C.lime} fg={C.bg} s={pop(t, d * 0.4)} rot={Math.sin(t * 1.7) * 4} fs={60} /></>,
  contador: ({ t, d, p }) => { const v = Math.round(p.to * tw(t, d * 0.1, d * 0.6));
    return <><Sparks t={t} n={22} />
      {Array.from({ length: 12 }).map((_, i) => { const a = i / 12 * Math.PI * 2 + t * 0.4, r = 330 + Math.sin(t * 2 + i) * 30; return <g key={i} transform={`translate(${960 + Math.cos(a) * r * 1.4},${540 + Math.sin(a) * r * 0.75})`} opacity={0.7}><rect x={-60} y={-38} width={120} height={76} rx={10} fill={C.card2} /><path d="M-12,-18 L20,0 L-12,18 Z" fill={C.text} /></g>; })}
      <Num x={960} y={620} v={v} suffix={p.suffix} fs={220} /></>; },
  titular: ({ t, d, p }) => <><Sparks t={t} n={10} />
    <g transform={`translate(960,560) rotate(${-4 + Math.sin(t * 0.7) * 2}) scale(${0.85 + 0.15 * tw(t, 0, 0.6) + t * 0.004})`}>
      <rect x={-560} y={-300} width={1120} height={600} fill={C.paper} />
      <text x={-500} y={-210} fontFamily={MONO} fontWeight={800} fontSize={38} fill={C.gray}>NOTICIAS · 19 SEP 2022</text>
      <rect x={-500} y={-190} width={1000} height={6} fill="#141018" />
      <text x={0} y={-40} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={150} fill="#141018">{p.head}</text>
      <text x={0} y={50} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={52} fill={C.red}>{p.sub}</text>
      {[0, 1, 2, 3].map((i) => <rect key={i} x={-500} y={110 + i * 40} width={i === 3 ? 600 : 1000} height={16} rx={8} fill="#cfc6b8" />)}
    </g></>,
  pantalla: ({ t, d, p }) => { const prog = 0.12 + 0.1 * Math.sin(t * 0.8);
    return <><Sparks t={t} n={12} /><TV x={960} y={470} w={760} h={420} txt={p.scr} glow={C.gold} t={t} fs={180} />
      <rect x={580} y={760} width={760} height={34} rx={17} fill={C.card2} /><rect x={580} y={760} width={760 * prog} height={34} rx={17} fill={C.red} />
      <text x={1360} y={788} fontFamily={MONO} fontWeight={800} fontSize={34} fill={C.text}>{Math.round(prog * 100)}%</text></>; },
  borrar: ({ t, d, p }) => <>{Array.from({ length: 12 }).map((_, i) => { const x = 420 + (i % 4) * 360, y = 330 + Math.floor(i / 4) * 230, kill = d * 0.15 + i * 0.25, back = kill + 0.9 + (i % 3) * 0.5;
    const gone = t > kill && t < back; return <g key={i} transform={`translate(${x},${y + Math.sin(t * 2 + i) * 6})`}>
      <rect x={-150} y={-90} width={300} height={180} rx={12} fill={['#3b2a55', '#1f4d5c', '#5c3a1f', '#204a2a'][i % 4]} opacity={gone ? 0.25 : 1} /><path d="M-22,-32 L34,0 L-22,32 Z" fill={C.text} opacity={gone ? 0.2 : 0.85} />
      {gone ? <g transform={`scale(${P(pop(t, kill, 0.25))})`}><line x1={-60} y1={-60} x2={60} y2={60} stroke={C.red} strokeWidth={22} strokeLinecap="round" /><line x1={60} y1={-60} x2={-60} y2={60} stroke={C.red} strokeWidth={22} strokeLinecap="round" /></g> : null}
    </g>; })}</>,
  figura: ({ t, d, p }) => <><Floor /><Sparks t={t} n={12} />
    <circle cx={960} cy={560} r={300 + Math.sin(t * 2) * 12} fill={C.red} opacity={0.08} />
    <Shadow x={960} y={900} w={300} /><Person x={960} y={880} s={1.25} col="#4a505e" t={t} />
    {Array.from({ length: 5 }).map((_, i) => { const a = t * 0.9 + i * 1.26; return <text key={i} x={960 + Math.cos(a) * 380} y={520 + Math.sin(a) * 160} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={44} fill={[C.lime, C.red, C.blue][i % 3]} opacity={0.6}>{['01', '10', '{}', '</>', '$'][i]}</text>; })}
    <Tag x={1380} y={360} txt={p.tag} col={C.red} s={pop(t, d * 0.3) * 1.3} rot={8 + Math.sin(t * 2) * 3} fs={70} /></>,
  red: ({ t, d, p }) => { const pts = [[520, 380], [960, 760], [1400, 380]];
    return <><Sparks t={t} n={8} />{pts.map(([x, y], i) => <g key={i}>
      <line x1={960} y1={520} x2={x} y2={y} stroke={i === 2 ? C.red : C.gray} strokeWidth={6} strokeDasharray="16 16" strokeDashoffset={-t * 80} opacity={tw(t, 0.3 + i * d * 0.2, 0.6 + i * d * 0.2)} />
      <g transform={`translate(${x},${y}) scale(${P(pop(t, 0.3 + i * d * 0.2))})`}><circle r={95} fill={i === 2 ? C.red : C.card2} /><text y={14} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={34} fill={C.text}>{p.labels[i]}</text></g></g>)}
      <circle cx={960} cy={520} r={70 + Math.sin(t * 4) * 6} fill="#1d1f26" stroke={C.lime} strokeWidth={6} /><text x={960} y={536} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={46} fill={C.lime}>?</text></>; },
  kit: ({ t, d, p }) => <><Floor />{p.items.map((it, i) => { const x = 360 + i * 300, y = 560 + Math.sin(t * 2 + i) * 14, s = pop(t, 0.3 + i * d * 0.14);
    return <g key={i} transform={`translate(${x},${y}) scale(${P(s)})`}><circle r={120} fill={C.card} stroke={i === 1 ? C.lime : C.card2} strokeWidth={8} />
      {i === 0 ? <><rect x={-70} y={-45} width={140} height={85} rx={8} fill={C.blue} opacity={0.7} /><rect x={-20} y={42} width={40} height={14} fill={C.gray} /></> : null}
      {i === 1 ? <rect x={-22} y={-60} width={44} height={120} rx={10} fill={C.lime} /> : null}
      {i === 2 ? <><rect x={-80} y={-30} width={160} height={60} rx={8} fill={C.gray} />{Array.from({ length: 6 }).map((_, j) => <rect key={j} x={-68 + j * 23} y={-18} width={18} height={14} rx={3} fill={C.dark} />)}</> : null}
      {i === 3 ? <><rect x={-35} y={-55} width={70} height={110} rx={35} fill={C.gray} /><line x1={0} y1={-55} x2={0} y2={-10} stroke={C.dark} strokeWidth={5} /></> : null}
      {i === 4 ? <><rect x={-40} y={-70} width={80} height={140} rx={14} fill={C.gray} /><rect x={-30} y={-55} width={60} height={100} rx={6} fill={C.blue} opacity={0.7} /></> : null}
      <text y={175} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={34} fill={C.text}>{it}</text></g>; })}</>,
  chat: ({ t, d, p }) => <><g transform={`translate(960,${540 + Math.sin(t * 0.9) * 6})`}>
    <rect x={-560} y={-320} width={1120} height={620} rx={24} fill={C.card} /><rect x={-560} y={-320} width={260} height={620} rx={24} fill="#15161b" />
    {['# general', '# builds', '# clips', '# equipo'].map((c, i) => <text key={i} x={-530} y={-240 + i * 60} fontFamily={MONO} fontWeight={700} fontSize={30} fill={i === 2 ? C.lime : C.gray}>{c}</text>)}
    {p.msgs.map(([u, m], i) => { const at = 0.3 + i * d * 0.2, s = pop(t, at), bad = u === '???';
      return <g key={i} transform={`translate(${-250},${-240 + i * 130}) scale(${P(s)})`} opacity={cl(s)}>
        <circle cx={30} cy={30} r={30} fill={bad ? C.red : C.gray} /><text x={80} y={18} fontFamily={MONO} fontWeight={800} fontSize={28} fill={bad ? C.red : C.text}>{u}</text>
        <rect x={80} y={32} width={m.length * 22 + 50} height={60} rx={16} fill={bad ? '#3a1610' : C.card2} /><text x={104} y={74} fontFamily={MONO} fontSize={32} fill={C.text}>{m}</text></g>; })}
    <rect x={-250} y={240} width={760} height={50} rx={14} fill="#15161b" /><rect x={-230} y={252} width={4} height={26} fill={C.lime} opacity={Math.floor(t * 3) % 2} />
  </g></>,
  sirena: ({ t, d }) => { const a = t * 5;
    return <><Floor /><rect x={0} y={0} width={1920} height={1080} fill={Math.sin(a) > 0 ? C.red : C.blue} opacity={0.08 + 0.05 * Math.abs(Math.sin(a))} />
      <g transform="translate(960,620)"><rect x={-260} y={-60} width={520} height={120} rx={60} fill={C.card2} />
        <path d={`M0,0 L${Math.cos(a) * 900},${Math.sin(a) * 300 - 200} L${Math.cos(a + 0.4) * 900},${Math.sin(a + 0.4) * 300 - 200} Z`} fill={C.red} opacity={0.25} />
        <path d={`M0,0 L${Math.cos(a + Math.PI) * 900},${Math.sin(a + Math.PI) * 300 - 200} L${Math.cos(a + Math.PI + 0.4) * 900},${Math.sin(a + Math.PI + 0.4) * 300 - 200} Z`} fill={C.blue} opacity={0.25} />
        <rect x={-230} y={-50} width={220} height={100} rx={50} fill={C.red} opacity={0.6 + 0.4 * Math.sin(a)} /><rect x={10} y={-50} width={220} height={100} rx={50} fill={C.blue} opacity={0.6 - 0.4 * Math.sin(a)} /></g></>; },
  dinero: ({ t, d, p }) => { const v = (p.to * tw(t, d * 0.15, d * 0.6)).toFixed(1);
    return <><Floor />{Array.from({ length: 7 }).map((_, i) => { const h = Math.round(10 * tw(t, 0.2 + i * 0.15, 1.2 + i * 0.15)); return <g key={i}>{Array.from({ length: h }).map((_, j) => <rect key={j} x={460 + i * 150} y={860 - j * 28} width={120} height={24} rx={4} fill={j % 2 ? '#5f8f3a' : '#76a84a'} />)}</g>; })}
      {Array.from({ length: 8 }).map((_, i) => { const u = (t * 0.3 + i / 8) % 1; return <rect key={i} x={300 + i * 180 + Math.sin(t + i) * 40} y={-60 + u * 900} width={90} height={44} rx={4} fill="#76a84a" opacity={0.6} transform={`rotate(${u * 360 + i * 40} ${345 + i * 180} ${u * 900 - 38})`} />; })}
      <Num x={960} y={420} v={v} suffix={p.suffix} col={C.red} fs={170} /></>; },
  cuarto2: ({ t }) => <><Floor />{[0, 1, 2].map((i) => <g key={i}><rect x={330 + i * 460} y={640} width={360} height={30} fill={C.card2} />
    <TV x={510 + i * 460} y={540} w={240} h={140} txt="" glow={[C.blue, C.lime, C.red][i]} t={t + i} fs={40} />
    <Person x={510 + i * 460} y={900} s={0.75} col={[C.gray, '#5a5f6b', C.gray][i]} t={t} typing={1} k={i * 2} /></g>)}
    <g transform="translate(1660,250)"><circle r={90} fill={C.paper} /><line x1={0} y1={0} x2={Math.cos(t * 2) * 60} y2={Math.sin(t * 2) * 60} stroke="#141018" strokeWidth={8} strokeLinecap="round" /><line x1={0} y1={0} x2={Math.cos(t * 0.3) * 40} y2={Math.sin(t * 0.3) * 40} stroke={C.red} strokeWidth={10} strokeLinecap="round" /></g></>,
  juez: ({ t, d, p }) => { const hit = (t * 0.7) % 1, ang = hit < 0.15 ? -10 + hit / 0.15 * 50 : 40 - (hit - 0.15) / 0.85 * 50;
    return <><Floor /><rect x={560} y={600} width={800} height={280} rx={10} fill="#3d2a1e" /><rect x={520} y={580} width={880} height={40} rx={8} fill="#523826" />
      <g transform={`translate(1150,560) rotate(${ang})`}><rect x={-10} y={-20} width={20} height={180} rx={8} fill="#7a5232" transform="rotate(-90)" /><rect x={-170} y={-50} width={90} height={100} rx={14} fill="#523826" /></g>
      <rect x={1100} y={560} width={120} height={24} rx={6} fill="#2a1c13" />
      {hit < 0.25 ? <circle cx={1160} cy={560} r={30 + hit * 300} fill="none" stroke={C.lime} strokeWidth={6} opacity={1 - hit * 4} /> : null}
      <g transform={`translate(760,${430 + Math.sin(t * 1.2) * 8})`}><line x1={0} y1={-120} x2={0} y2={160} stroke={C.gold} strokeWidth={10} /><line x1={-150} y1={-100 + Math.sin(t) * 18} x2={150} y2={-100 - Math.sin(t) * 18} stroke={C.gold} strokeWidth={8} />
        <path d={`M-200,${-40 + Math.sin(t) * 18} Q-150,${10 + Math.sin(t) * 18} -100,${-40 + Math.sin(t) * 18} Z`} fill={C.gold} /><path d={`M100,${-40 - Math.sin(t) * 18} Q150,${10 - Math.sin(t) * 18} 200,${-40 - Math.sin(t) * 18} Z`} fill={C.gold} /></g>
      <Tag x={1350} y={300} txt={p.text} col={C.red} s={pop(t, d * 0.35) * 1.2} rot={-6 + Math.sin(t * 1.5) * 3} fs={70} /></>; },
  balanza2: ({ t, d, p }) => { const sw = tw(t, d * 0.35, d * 0.55);
    return <><Sparks t={t} n={12} />
      <g transform={`translate(560,${520 + Math.sin(t * 1.3) * 8}) scale(${1 - 0.1 * sw})`} opacity={1 - 0.5 * sw}><rect x={-300} y={-180} width={600} height={340} rx={14} fill="#2a2433" />{Array.from({ length: 30 }).map((_, i) => <rect key={i} x={-300 + (i * 97) % 580} y={-180 + (i * 53 + Math.floor(t * 8) * 31) % 320} width={20} height={20} fill={C.gray} opacity={0.35} />)}
        <text x={0} y={30} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={90} fill={C.gray}>{p.a}</text><text x={0} y={240} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={40} fill={C.gray}>FILTRADO</text></g>
      <g transform={`translate(1360,${520 + Math.sin(t * 1.3 + 1) * 8}) scale(${0.9 + 0.15 * sw})`}><rect x={-300} y={-180} width={600} height={340} rx={14} fill={C.blue} opacity={0.6} /><rect x={-300} y={60} width={600} height={100} fill={C.lime} opacity={0.25} />
        <text x={0} y={30} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={90} fill={C.text}>{p.b}</text><text x={0} y={240} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={40} fill={C.lime}>COMPLETO · 99</text></g>
      <path d={`M${820 + sw * 40},520 L${1000 + sw * 40},520`} stroke={C.lime} strokeWidth={12} strokeLinecap="round" /><path d={`M${970 + sw * 40},490 L${1010 + sw * 40},520 L${970 + sw * 40},550`} stroke={C.lime} strokeWidth={12} fill="none" strokeLinecap="round" /></>; },
  lista2: ({ t, d, p }) => <><Sparks t={t} n={10} />{p.items.map(([txt, col], i) => { const at = 0.3 + i * d * 0.18, s = pop(t, at);
    return <Tag key={i} x={960 + Math.sin(t * 1.2 + i) * 20} y={300 + i * 150} txt={txt} col={K(col)} fg={col === 'lime' ? C.bg : C.text} s={s} rot={(i % 2 ? 3 : -3) + Math.sin(t + i) * 2} fs={56} />; })}</>,
};

const MOV = { figura: 1, chat: 1, contador: 1, balanza2: 1 };
const Scene = ({ i, at }) => {
  const f0 = useCurrentFrame(); const sc = D[i];
  const f = at !== undefined ? Math.round(sc.frames * at) : f0; const t = f / 30, d = sc.frames / 30;
  const g = Math.min(tw(t, 0, 0.3), 1 - tw(t, d - 0.3, d));
  // cámara 2D: acercamiento lento + deriva, distinto en cada escena
  // escenas que el control de calidad marcó casi quietas: cámara más amplia + franjas que se mueven
  const mv = MOV[sc.tipo] ? 1 : 0;
  const z = 1 + (mv ? 0.22 : 0.08) * (t / d), dx = Math.sin(t * 0.5 + i) * (mv ? 110 : 24), dy = Math.cos(t * 0.4 + i) * (mv ? 40 : 14), rot = mv ? Math.sin(t * 0.45) * 2.5 : 0;
  return <AbsoluteFill style={{ background: C.bg }}>
    <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      {mv ? <g opacity={0.09 * g}>{Array.from({ length: 14 }).map((_, k) => { const x = ((k * 220 + t * 140) % 3080) - 580; return <rect key={k} x={x} y={-200} width={70 + (k % 3) * 40} height={1500} fill={[C.red, C.blue, C.lime][k % 3]} transform={`rotate(18 ${x} 540)`} />; })}</g> : null}
      <g transform={`translate(${960 + dx},${560 + dy}) rotate(${rot}) scale(${z * (0.92 + 0.08 * g)}) translate(-960,-560)`} opacity={g}>{SC[sc.tipo]({ t, d, p: sc.p || {} })}</g>
      <circle cx={960} cy={560} r={P((1 - g) * 40)} fill={C.red} opacity={g < 0.999 ? 1 : 0} />
    </svg>
    <div style={{ position: 'absolute', inset: 0, opacity: g }}><Card t={t} d={d} lines={sc.p && sc.p.lines} paper={sc.tipo === 'juez' || sc.tipo === 'dinero'} /></div>
    <Caps caps={sc.caps} words={sc.words} t={t} d={d} />
    <Grain f={f} />
  </AbsoluteFill>;
};

const Thumb = () => { const t = 1.2;
  return <AbsoluteFill style={{ background: C.bg }}>
    <svg viewBox="0 0 1280 720" width={1280} height={720} style={{ position: 'absolute', inset: 0 }}><rect x={0} y={585} width={1280} height={135} fill="#101116" />
      <circle cx={430} cy={420} r={330} fill={C.red} opacity={0.12} />
      <g transform="scale(0.78) translate(-560,-130)">{SC.cuarto({ t, d: 6, p: { scr: '90' } })}</g></svg>
    <div style={{ position: 'absolute', right: 40, top: 80, textAlign: 'right', fontFamily: FONT, fontWeight: 900, lineHeight: 0.98 }}>
      <div style={{ fontSize: 92, color: C.text }}>FILTRÓ</div><div style={{ fontSize: 92, color: C.red }}>GTA 6</div><div style={{ fontSize: 92, color: C.text }}>A LOS 17</div>
      <div style={{ fontSize: 44, color: C.lime, fontFamily: MONO, marginTop: 16 }}>DESDE UN HOTEL</div></div>
    <Grain f={3} /></AbsoluteFill>; };
const Sheet = ({ at }) => { const f = useCurrentFrame(); return <Scene i={f % D.length} at={at} />; };
registerRoot(() => <>
  {D.map((sc, i) => <Composition key={i} id={`G06-${String(i).padStart(2, '0')}`} component={Scene} defaultProps={{ i }} durationInFrames={sc.frames} fps={30} width={1920} height={1080} />)}
  <Composition id="THUMB" component={Thumb} durationInFrames={1} fps={30} width={1280} height={720} />
  <Composition id="SHEET" component={Sheet} defaultProps={{ at: 0.6 }} durationInFrames={D.length} fps={30} width={1920} height={1080} />
</>);
