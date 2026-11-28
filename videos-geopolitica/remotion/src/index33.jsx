// v33 · ¿Qué pasaría si ganaras $1 cada vez que tu crush te miente? — motor de v32 MÁS DINÁMICO: cortes cada ~2,3 s, entrada con
// latigazo + zoom + desenfoque en cada corte, temblor (sh), palabra que golpea (kw:), monedas (fx:moneda/monedas), impacto, confeti, fiesta.
// Intérprete de planos: 'lugar;tok;…' (ver v28/guion.py). Cada plano: fondo con capas animadas, personajes con respiración,
// corazón con porcentaje que cuenta, paneo/zoom con ease-out, FG desenfocado y blur de entrada en ~20 %.
import React from 'react';
import { registerRoot, Composition, useCurrentFrame, AbsoluteFill } from 'remotion';
import D from './data33.json';
import CH from './chars28.json';
import { Grain, Grade, Vignette, BlurG } from './kit2d.jsx';
import { W, H, FONT, cl, eo, pop, Glow } from './piezas27.jsx';

const OUT = '#1A1424';
const rnd = (k) => { const x = Math.sin(k * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const hash = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100003; return h; };
const Raw = ({ html }) => <g dangerouslySetInnerHTML={{ __html: html }} />;
const Grad = ({ id, a, b, x2 = 0, y2 = 1 }) => <defs><linearGradient id={id} x1="0" y1="0" x2={x2} y2={y2}><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient></defs>;
const Fondo = ({ a, b, id }) => <><Grad id={id} a={a} b={b} /><rect width={W} height={H} fill={`url(#${id})`} /></>;
const Bok = ({ a, b, t, light = '#FFF1F6', n = 22, id = 'bk8' }) => <><defs><radialGradient id={id} cx="50%" cy="45%" r="75%"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></radialGradient></defs>
  <rect width={W} height={H} fill={`url(#${id})`} /><BlurG s={14}>{Array.from({ length: n }).map((_, k) => <circle key={k} cx={(k * 389 + Math.sin(t * 0.5 + k) * 50) % W} cy={(k * 211 + Math.cos(t * 0.4 + k) * 30) % H} r={36 + (k % 5) * 22} fill={k % 3 ? light : a} opacity={0.1 + (k % 4) * 0.07} />)}</BlurG></>;
const Pildora = ({ x, y, txt, c = '#FACA4F', borde = '#FACA4F', size = 34, t = 9, at = 0 }) => { const s = pop(t, at); if (s <= 0) return null; const w = txt.length * size * 0.66 + 60;
  return <g transform={`translate(${x} ${y}) scale(${s})`}><rect x={-w / 2} y={-size} width={w} height={size * 1.75} rx={size * 0.87} fill="#120E1F" opacity="0.92" stroke={borde} strokeWidth="4" />
    <text x="0" y={size * 0.3} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={size} fill={c} letterSpacing="2">{txt}</text></g>; };
const Sparkle = ({ x, y, r, t, k = 0 }) => { const s = 0.5 + 0.5 * Math.sin(t * 5 + k * 1.7); return <path transform={`translate(${x} ${y}) scale(${s}) rotate(${t * 40 + k * 20})`} d={`M0 ${-r} Q0 0 ${r} 0 Q0 0 0 ${r} Q0 0 ${-r} 0 Q0 0 0 ${-r}Z`} fill="#FFF6C8" />; };
const Ventana = ({ x, y, w, h, t, noche = false }) => <g>
  <Grad id={`vt${x}${noche ? 'n' : 'd'}`} a={noche ? '#1A2450' : '#9ED8FF'} b={noche ? '#3A3A78' : '#FFE2B8'} />
  <rect x={x} y={y} width={w} height={h} rx="10" fill={`url(#vt${x}${noche ? 'n' : 'd'})`} stroke="#5A4A5A" strokeWidth="14" />
  {noche ? <><circle cx={x + w * 0.7} cy={y + h * 0.3} r={h * 0.12} fill="#FFF6D8" /><Glow x={x + w * 0.7} y={y + h * 0.3} r={h * 0.4} c="#FFF6D8" o={0.4} />
    {Array.from({ length: 9 }).map((_, k) => <circle key={k} cx={x + rnd(k) * w} cy={y + rnd(k + 9) * h * 0.8} r="3" fill="#fff" opacity={0.4 + 0.6 * Math.abs(Math.sin(t * 2 + k))} />)}</>
    : <>{[0, 1].map((k) => <ellipse key={k} cx={x + ((t * 18 + k * w * 0.55) % (w + 160)) - 80} cy={y + h * (0.3 + k * 0.25)} rx="70" ry="22" fill="#fff" opacity="0.85" />)}</>}
  <rect x={x + w / 2 - 6} y={y} width="12" height={h} fill="#5A4A5A" /><rect x={x} y={y + h / 2 - 6} width={w} height="12" fill="#5A4A5A" /></g>;
const Rayos = ({ x, y, t, c = '#FFF3C8', o = 0.18 }) => <g opacity={o + 0.04 * Math.sin(t * 2)}>{[0, 1, 2, 3].map((k) => <path key={k} d={`M${x + k * 60} ${y} L${x + 300 + k * 140} ${y + 900} L${x + 380 + k * 140} ${y + 900} L${x + 40 + k * 60} ${y}Z`} fill={c} />)}</g>;
const Polvo = ({ t, n = 14, c = '#FFF6D8' }) => <g>{Array.from({ length: n }).map((_, k) => <circle key={k} cx={(rnd(k) * W + t * 14 * (k % 3 + 1)) % W} cy={(rnd(k + 3) * H - t * 10 * (k % 2 + 1) + H) % H} r={2 + (k % 3)} fill={c} opacity={0.35 + 0.3 * Math.sin(t * 3 + k)} />)}</g>;

// ---------- lugares: { bg, fg } ----------
const SETS = {
  cuarto: (t) => ({ bg: <><Fondo a="#C9B8F0" b="#E8DCFF" id="cu1" /><rect y="820" width={W} height="260" fill="#8A6A9A" /><Ventana x={1180} y={140} w={520} h={420} t={t} />
    <Rayos x={1200} y={150} t={t} /><rect x="160" y="190" width="200" height="260" rx="8" fill="#FFB86B" stroke={OUT} strokeWidth="6" /><text x="260" y="340" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="90" fill={OUT}>?</text>
    <rect x="80" y="700" width="820" height="160" rx="30" fill="#4E7BD8" stroke={OUT} strokeWidth="6" /><rect x="80" y="640" width="200" height="90" rx="30" fill="#fff" stroke={OUT} strokeWidth="6" />
    <path d="M300 690 Q600 650 900 700 L900 780 Q600 740 300 780Z" fill="#6E98F0" /><rect x="1500" y="700" width="160" height="160" fill="#B07A50" stroke={OUT} strokeWidth="6" /><circle cx="1580" cy="660" r="40" fill="#FFD23F" /><Glow x={1580} y={640} r={160} o={0.35} /><Polvo t={t} /></>,
    fg: <BlurG s={10}><path d="M-40 1080 Q40 820 130 760 Q160 900 120 1080Z" fill="#3E8A50" /><path d="M60 1080 Q140 860 260 820 Q220 960 200 1080Z" fill="#2E7040" /></BlurG> }),
  noche: (t) => ({ bg: <><Fondo a="#232048" b="#3A3470" id="no1" /><rect y="820" width={W} height="260" fill="#1E1A3A" /><Ventana x={1180} y={140} w={520} h={420} t={t} noche />
    <rect x="80" y="700" width="820" height="160" rx="30" fill="#2E3E80" stroke={OUT} strokeWidth="6" /><rect x="80" y="640" width="200" height="90" rx="30" fill="#C8C8E8" stroke={OUT} strokeWidth="6" />
    <rect x="1500" y="700" width="160" height="160" fill="#4A3A50" stroke={OUT} strokeWidth="6" /><Glow x={1580} y={680} r={120} c="#7AA8FF" o={0.25 + 0.08 * Math.sin(t * 3)} /><Polvo t={t} n={8} c="#9AB0FF" /></>,
    fg: <BlurG s={10}><rect x="1700" y="760" width="260" height="400" rx="20" fill="#14122A" /></BlurG> }),
  cocina: (t) => ({ bg: <><Fondo a="#FFE2A8" b="#FFC97A" id="co1" /><rect y="760" width={W} height="320" fill="#E8D2B8" />{Array.from({ length: 16 }).map((_, k) => <rect key={k} x={k * 124} y="760" width="120" height="320" fill="none" stroke="#D2B898" strokeWidth="4" />)}
    {[0, 1, 2, 3].map((k) => <rect key={k} x={120 + k * 230} y="150" width="210" height="200" rx="10" fill="#7CC0A0" stroke={OUT} strokeWidth="6" />)}
    <rect x="100" y="560" width="980" height="200" fill="#6AA88A" stroke={OUT} strokeWidth="6" /><rect x="90" y="540" width="1000" height="34" fill="#F4EEE4" stroke={OUT} strokeWidth="5" />
    <rect x="700" y="500" width="160" height="40" rx="8" fill="#3A3A48" />{[0, 1, 2].map((k) => { const u = (t * 0.7 + k / 3) % 1; return <path key={k} d={`M${740 + k * 40} ${490 - u * 160} q16 -24 0 -48 q-16 -24 0 -48`} stroke="#fff" strokeWidth="8" fill="none" opacity={(1 - u) * 0.7} />; })}
    <rect x="1480" y="200" width="300" height="560" rx="20" fill="#F2F4F8" stroke={OUT} strokeWidth="6" /><rect x="1480" y="420" width="300" height="8" fill={OUT} /><rect x="1500" y="260" width="16" height="120" rx="8" fill="#B8BCC8" />
    <Ventana x={1130} y={160} w={300} h={260} t={t} /><Rayos x={1140} y={170} t={t} o={0.12} /></>,
    fg: <BlurG s={10}><ellipse cx="1760" cy="1040" rx="260" ry="90" fill="#E86A5C" /><circle cx="1680" cy="960" r="70" fill="#F2B134" /><circle cx="1820" cy="950" r="64" fill="#7CC07A" /></BlurG> }),
  calle: (t) => ({ bg: <><Fondo a="#8FD0FF" b="#FFE8C8" id="ca1" />{[0, 1, 2].map((k) => <ellipse key={k} cx={((t * 22 + k * 700) % 2300) - 200} cy={120 + k * 60} rx="120" ry="36" fill="#fff" opacity="0.9" />)}
    {[[0, 380, '#F08A72'], [400, 300, '#7CC0D0'], [720, 420, '#F2C46A'], [1160, 340, '#B79CFF'], [1520, 400, '#8AC07A']].map(([x, h, c], k) => <g key={k}><rect x={x} y={760 - h} width="380" height={h} fill={c} stroke={OUT} strokeWidth="6" />
      {Array.from({ length: 6 }).map((_, j) => <rect key={j} x={x + 40 + (j % 3) * 110} y={790 - h + Math.floor(j / 3) * 110} width="70" height="70" fill="#FFF3D8" stroke={OUT} strokeWidth="4" />)}</g>)}
    <rect y="760" width={W} height="320" fill="#C8C2D0" /><rect y="760" width={W} height="20" fill="#9A94A4" /><rect x={((t * 260) % 2600) - 400} y="660" width="300" height="110" rx="30" fill="#E8344A" stroke={OUT} strokeWidth="6" opacity="0.9" />
    <g transform="translate(1520 520)"><rect width="300" height="240" fill="#4E8A6A" stroke={OUT} strokeWidth="6" /><rect y="-40" width="300" height="50" fill="#E8344A" stroke={OUT} strokeWidth="6" /><text x="150" y="-6" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="30" fill="#fff">PERIÓDICOS</text></g></>,
    fg: <BlurG s={9}><rect x="40" y="0" width="40" height="1080" fill="#3A3A48" /><circle cx="60" cy="40" r="120" fill="#3E8A50" /></BlurG> }),
  entrada: (t) => ({ bg: <><Fondo a="#9ED8FF" b="#FFF0D8" id="en1" /><rect x="260" y="200" width="1400" height="600" fill="#C8584A" stroke={OUT} strokeWidth="6" />{Array.from({ length: 12 }).map((_, k) => <rect key={k} x="260" y={230 + k * 48} width="1400" height="4" fill="#A84438" />)}
    <rect x="760" y="120" width="400" height="110" rx="14" fill="#FFF3D8" stroke={OUT} strokeWidth="6" /><text x="960" y="196" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="56" fill={OUT}>COLEGIO</text>
    {[0, 1, 2, 3, 4].map((k) => <rect key={k} x={320 + k * 270} y="300" width="160" height="180" fill="#9ED8FF" stroke={OUT} strokeWidth="6" />)}<rect x="850" y="560" width="220" height="240" fill="#5A3A30" stroke={OUT} strokeWidth="6" />
    {[0, 1, 2, 3].map((k) => <rect key={k} x={700 - k * 40} y={800 + k * 30} width={520 + k * 80} height="30" fill="#D8D2DE" stroke={OUT} strokeWidth="4" />)}<rect y="920" width={W} height="160" fill="#B8B2C0" />
    <BlurG s={5}>{Array.from({ length: 6 }).map((_, k) => { const x = ((t * (60 + k * 20) + k * 400) % 2200) - 140; return <g key={k} opacity="0.55"><circle cx={x} cy={760} r="40" fill="#fff" /><rect x={x - 40} y={800} width="80" height="160" rx="30" fill={['#E86A5C', '#4C9AD6', '#7CC07A', '#B07AD6'][k % 4]} /></g>; })}</BlurG></>,
    fg: <BlurG s={10}><circle cx="1840" cy="200" r="260" fill="#3E8A50" /><rect x="1800" y="300" width="50" height="800" fill="#6A4A30" /></BlurG> }),
  salon: (t) => ({ bg: <><Fondo a="#FFF0D6" b="#F6DDB8" id="sa1" /><rect x="200" y="130" width="980" height="440" rx="16" fill="#2E5E4A" stroke="#8A5A3A" strokeWidth="22" />
    <text x="300" y="250" fontFamily={FONT} fontWeight="700" fontSize="44" fill="#E8F4EA" opacity="0.85">x² + y² = r²</text><path d="M760 420 q60 -80 120 0 t120 0" stroke="#E8F4EA" strokeWidth="5" fill="none" opacity="0.8" /><circle cx="420" cy="420" r="60" stroke="#E8F4EA" strokeWidth="5" fill="none" opacity="0.7" />
    <Ventana x={1330} y={120} w={460} h={420} t={t} /><Rayos x={1340} y={130} t={t} o={0.14} /><rect y="800" width={W} height="280" fill="#C89A6A" />
    {[0, 1, 2].map((k) => <g key={k}><rect x={180 + k * 560} y="760" width="420" height="40" rx="8" fill="#E8B87A" stroke={OUT} strokeWidth="5" /><rect x={200 + k * 560} y="800" width="20" height="160" fill="#6A4A30" /><rect x={560 + k * 560} y="800" width="20" height="160" fill="#6A4A30" /></g>)}<Polvo t={t} n={10} /></>,
    fg: <BlurG s={12}><rect x="-60" y="900" width="900" height="80" rx="10" fill="#B8865A" /><rect x="-60" y="980" width="900" height="200" fill="#8A6040" /></BlurG> }),
  pasillo: (t) => ({ bg: <><Fondo a="#E8ECF4" b="#C8D0E0" id="pa1" />{Array.from({ length: 14 }).map((_, k) => <g key={k}><rect x={k * 140} y="240" width="130" height="560" fill="#4C7CC8" stroke={OUT} strokeWidth="5" /><rect x={k * 140 + 20} y="280" width="90" height="8" fill="#2E5AA0" /><rect x={k * 140 + 20} y="300" width="90" height="8" fill="#2E5AA0" /><circle cx={k * 140 + 100} cy="520" r="8" fill="#B8C8E8" /></g>)}
    <rect y="800" width={W} height="280" fill="#B8A890" /><path d={`M0 1080 L960 800 L1920 1080`} stroke="#A89878" strokeWidth="4" fill="none" /><rect x="820" y="120" width="280" height="90" rx="10" fill="#FFD23F" stroke={OUT} strokeWidth="5" /><text x="960" y="180" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="40" fill={OUT}>SILENCIO</text>
    <Glow x={480} y={150} r={260} o={0.3} /><Glow x={1440} y={150} r={260} o={0.3} /></>,
    fg: <BlurG s={10}><rect x="1720" y="200" width="260" height="900" fill="#3A5A98" /></BlurG> }),
  comedor: (t) => ({ bg: <><Fondo a="#FFE8D0" b="#FFD0A8" id="cm1" /><rect x="180" y="120" width="560" height="300" rx="14" fill="#3A3A48" stroke={OUT} strokeWidth="6" /><text x="460" y="200" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="48" fill="#FFD23F">MENÚ</text>
    {['PIZZA', 'ENSALADA', 'JUGO'].map((s, k) => <text key={k} x="240" y={270 + k * 50} fontFamily={FONT} fontWeight="700" fontSize="34" fill="#fff">{s}</text>)}<Ventana x={1060} y={110} w={700} h={360} t={t} />
    <rect y="760" width={W} height="320" fill="#E0C8B0" />{[0, 1].map((k) => <g key={k}><rect x={120 + k * 900} y="700" width="760" height="40" rx="10" fill="#F08A72" stroke={OUT} strokeWidth="5" /><rect x={200 + k * 900} y="660" width="140" height="40" rx="6" fill="#7CC0D0" stroke={OUT} strokeWidth="4" /><circle cx={600 + k * 900} cy={680} r="28" fill="#FFD23F" stroke={OUT} strokeWidth="4" /></g>)}</>,
    fg: <BlurG s={10}><rect x="1540" y="880" width="420" height="260" rx="20" fill="#C86A58" /><rect x="1600" y="820" width="140" height="80" rx="10" fill="#FFF3D8" /></BlurG> }),
  patio: (t) => ({ bg: <><Fondo a="#8FD0FF" b="#FFF0D0" id="pt1" />{[0, 1].map((k) => <ellipse key={k} cx={((t * 20 + k * 900) % 2300) - 200} cy={140 + k * 70} rx="130" ry="40" fill="#fff" />)}
    <rect y="700" width={W} height="380" fill="#8AC86A" /><rect y="700" width={W} height="16" fill="#6AA850" />{[200, 700, 1500].map((x, k) => <g key={k}><rect x={x - 20} y="420" width="40" height="300" fill="#7A5A3A" /><circle cx={x} cy={400 + Math.sin(t + k) * 4} r="150" fill="#3E9A58" /><circle cx={x - 70} cy={450} r="90" fill="#4EAA66" /></g>)}
    <rect x="1100" y="640" width="320" height="30" rx="8" fill="#C8884A" stroke={OUT} strokeWidth="5" /><rect x="1120" y="670" width="20" height="60" fill="#6A4A30" /><rect x="1380" y="670" width="20" height="60" fill="#6A4A30" />
    {Array.from({ length: 6 }).map((_, k) => { const u = (t * 0.2 + k / 6) % 1; return <ellipse key={k} cx={rnd(k) * W + Math.sin(t + k) * 40} cy={u * 900} rx="10" ry="6" fill="#FF9AB8" opacity={0.8} transform={`rotate(${t * 60 + k * 30} ${rnd(k) * W} ${u * 900})`} />; })}</>,
    fg: <BlurG s={10}><circle cx="-40" cy="120" r="240" fill="#2E7A44" /></BlurG> }),
  biblio: (t) => ({ bg: <><Fondo a="#6A4A3A" b="#3A2A22" id="bi1" />{[0, 1, 2, 3].map((r) => <g key={r}><rect x="80" y={160 + r * 170} width="1760" height="16" fill="#2A1A12" />
      {Array.from({ length: 52 }).map((_, k) => <rect key={k} x={100 + k * 33} y={176 + r * 170 - 120 + (k * 7 + r * 3) % 30} width="28" height={120 - (k * 7 + r * 3) % 30} fill={['#C8584A', '#E8A23A', '#4C7CC8', '#5AA06A', '#9A6AC8', '#E8D2A8'][(k + r) % 6]} stroke="#2A1A12" strokeWidth="2" />)}</g>)}
    <rect y="820" width={W} height="260" fill="#5A3A2A" /><rect x="300" y="760" width="1320" height="50" rx="8" fill="#8A5A3A" stroke={OUT} strokeWidth="5" />
    <g transform="translate(1400 640)"><rect x="-10" y="20" width="20" height="100" fill="#3A2A22" /><path d="M-70 20 L70 20 L44 -50 L-44 -50Z" fill="#7CC07A" stroke={OUT} strokeWidth="5" /><Glow x={0} y={40} r={260} c="#FFE2A0" o={0.5 + 0.04 * Math.sin(t * 4)} /></g><Polvo t={t} n={16} c="#FFE2A0" /></>,
    fg: <BlurG s={12}><rect x="-80" y="0" width="300" height="1080" fill="#2A1A12" />{Array.from({ length: 6 }).map((_, k) => <rect key={k} x="-60" y={80 + k * 170} width="260" height="120" fill={['#C8584A', '#4C7CC8', '#E8A23A'][k % 3]} />)}</BlurG> }),

  londres: (t) => ({ bg: <><Fondo a="#8A9AB0" b="#D8C8B0" id="ld1" />{[0, 1, 2].map((k) => <ellipse key={k} cx={((t * 15 + k * 700) % 2300) - 200} cy={160 + k * 50} rx="160" ry="40" fill="#B8C0CC" opacity="0.7" />)}
    {[[260, 140, 0], [980, 110, 1], [1580, 150, 2]].map(([x, y, k]) => <g key={k} transform={`translate(${x} ${y + Math.sin(t + k) * 10})`}><ellipse rx="90" ry="40" fill="#C8CCD4" stroke="#1A1424" strokeWidth="5" /><path d="M70 -10 L120 -40 L120 20Z" fill="#B0B6C0" stroke="#1A1424" strokeWidth="4" /><path d="M0 40 L0 400" stroke="#1A1424" strokeWidth="2" opacity="0.5" /></g>)}
    {[[0, 380, '#8A6A5A'], [380, 320, '#9A7A64'], [720, 420, '#7A5A4A'], [1160, 340, '#A08470'], [1520, 400, '#86685A']].map(([x, h, c], k) => <g key={k}><rect x={x} y={760 - h} width="380" height={h} fill={c} stroke="#1A1424" strokeWidth="6" />{Array.from({ length: 6 }).map((_, j) => <rect key={j} x={x + 40 + (j % 3) * 110} y={790 - h + Math.floor(j / 3) * 110} width="70" height="80" fill="#3A3448" stroke="#1A1424" strokeWidth="4" />)}{Array.from({ length: 6 }).map((_, j) => <path key={'x' + j} d={`M${x + 40 + (j % 3) * 110} ${790 - h + Math.floor(j / 3) * 110} l70 80 M${x + 110 + (j % 3) * 110} ${790 - h + Math.floor(j / 3) * 110} l-70 80`} stroke="#E8DCC0" strokeWidth="5" />)}</g>)}
    <rect y="760" width={W} height="320" fill="#8A8478" /><g transform="translate(1660 600)"><rect x="-50" y="-160" width="100" height="320" rx="10" fill="#C8202A" stroke="#1A1424" strokeWidth="6" />{[0, 1, 2, 3].map((k) => <rect key={k} x="-34" y={-130 + k * 60} width="68" height="44" fill="#FFE8B0" stroke="#1A1424" strokeWidth="3" />)}</g>
    {Array.from({ length: 10 }).map((_, k) => <ellipse key={k} cx={100 + k * 90} cy={790 - (k % 2) * 26} rx="54" ry="26" fill="#C8B080" stroke="#1A1424" strokeWidth="4" />)}
    <Polvo t={t} n={18} c="#C8C0B8" /></>,
    fg: <BlurG s={10}><rect x="1760" y="0" width="200" height="1080" fill="#3A2E2A" /></BlurG> }),
  refugio: (t) => ({ bg: <><Fondo a="#5A5A6A" b="#2A2A36" id="rf1" /><path d="M0 760 L0 300 Q960 -40 1920 300 L1920 760Z" fill="#E8E0D0" stroke="#1A1424" strokeWidth="8" />
    {Array.from({ length: 12 }).map((_, k) => <rect key={k} x={k * 170} y="300" width="160" height="40" fill="#C8382A" opacity="0.9" />)}<rect x="640" y="360" width="640" height="110" rx="12" fill="#1E3A8A" stroke="#1A1424" strokeWidth="6" /><text x="960" y="438" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="60" fill="#fff">UNDERGROUND</text>
    {[300, 960, 1620].map((x, k) => <g key={k}><path d={`M${x} 120 L${x} 200`} stroke="#3A3A48" strokeWidth="6" /><circle cx={x} cy="210" r="22" fill="#FFE2A0" /><Glow x={x} y={220} r={200} c="#FFE2A0" o={0.35 + 0.08 * Math.sin(t * 3 + k)} /></g>)}
    <rect y="760" width={W} height="320" fill="#6A6458" />{Array.from({ length: 8 }).map((_, k) => <rect key={k} x={60 + k * 240} y="820" width="180" height="50" rx="14" fill={['#B0503A', '#4A6A9A', '#7A8A4A'][k % 3]} stroke="#1A1424" strokeWidth="4" />)}</>,
    fg: <BlurG s={10}><ellipse cx="140" cy="1040" rx="320" ry="120" fill="#3A3448" /></BlurG> }),
  bletchley: (t) => ({ bg: <><Fondo a="#C8B89A" b="#A89070" id="bl1" />{Array.from({ length: 16 }).map((_, k) => <rect key={k} x={k * 124} y="0" width="6" height="760" fill="#8A7458" opacity="0.6" />)}
    <rect x="160" y="140" width="700" height="380" rx="10" fill="#2E3E34" stroke="#6A4A30" strokeWidth="20" />{['A→K', 'B→R', 'C→?', 'WETTER'].map((w, k) => <text key={k} x="220" y={230 + k * 80} fontFamily="Courier New, monospace" fontWeight="700" fontSize="52" fill="#E8F0E0" opacity="0.85">{w}</text>)}
    <rect x="1060" y="150" width="660" height="380" rx="8" fill="#E8DCC0" stroke="#1A1424" strokeWidth="6" /><path d="M1100 220 L1300 300 L1500 260 L1680 360" stroke="#C8382A" strokeWidth="6" fill="none" strokeDasharray="14 10" />{[[1180, 260], [1420, 320], [1600, 420]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r="12" fill="#1E3A8A" />)}
    <rect y="760" width={W} height="320" fill="#7A5A3A" /><rect x="200" y="700" width="1520" height="60" rx="8" fill="#9A6A40" stroke="#1A1424" strokeWidth="6" />
    <g transform="translate(1300 650)"><rect x="-130" y="-60" width="260" height="110" rx="12" fill="#3A3A2E" stroke="#1A1424" strokeWidth="6" />{Array.from({ length: 10 }).map((_, k) => <circle key={k} cx={-105 + k * 23} cy="20" r="9" fill="#E8E0C8" stroke="#1A1424" strokeWidth="2" />)}{Array.from({ length: 3 }).map((_, k) => <rect key={k} x={-60 + k * 45} y="-50" width="30" height="40" rx="6" fill="#C8B070" stroke="#1A1424" strokeWidth="3" />)}</g>
    <g transform="translate(480 680)"><path d="M-40 0 L40 0 L28 -60 L-28 -60Z" fill="#2E6A4A" stroke="#1A1424" strokeWidth="5" /><Glow x={0} y={10} r={220} c="#FFE2A0" o={0.5 + 0.05 * Math.sin(t * 4)} /></g><Polvo t={t} n={12} c="#FFE8C0" /></>,
    fg: <BlurG s={12}><rect x="-60" y="900" width="900" height="200" fill="#5A3A22" /><rect x="40" y="860" width="300" height="60" fill="#E8E0C8" /></BlurG> }),
  museo: (t) => ({ bg: <><Fondo a="#F2F0EA" b="#DCD8CE" id="mu1" /><rect y="780" width={W} height="300" fill="#B8A88A" />{[0, 1, 2].map((k) => <g key={k}><rect x={180 + k * 560} y="200" width="420" height="300" fill="#8A7A6A" stroke="#4A3A2A" strokeWidth="16" /><rect x={220 + k * 560} y="240" width="340" height="220" fill="#C8BCA8" /><Glow x={390 + k * 560} y={150} r={260} c="#FFF6D8" o={0.5} /><path d={`M${360 + k * 560} 120 L${420 + k * 560} 120 L${440 + k * 560} 170 L${340 + k * 560} 170Z`} fill="#3A3A48" /></g>)}
    <rect x="760" y="640" width="400" height="140" fill="#E8E4DA" stroke="#4A3A2A" strokeWidth="6" /><text x="960" y="726" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="34" fill="#4A3A2A">BLETCHLEY PARK</text></>,
    fg: <BlurG s={10}><rect x="1700" y="300" width="300" height="800" fill="#2A2A36" opacity="0.6" /></BlurG> }),
  balcon: (t) => ({ bg: <><Fondo a="#1A1450" b="#5A2A7A" id="ba1" />{Array.from({ length: 70 }).map((_, k) => <circle key={k} cx={rnd(k) * W} cy={rnd(k + 70) * 640} r={1.5 + (k % 3)} fill="#fff" opacity={0.3 + 0.7 * Math.abs(Math.sin(t * 1.5 + k))} />)}
    <circle cx="1560" cy="200" r="90" fill="#FFF6D8" /><Glow x={1560} y={200} r={300} c="#FFF6D8" o={0.35} />
    {[[0, 300], [260, 420], [560, 260], [900, 380], [1240, 300], [1600, 440]].map(([x, h], k) => <g key={k}><rect x={x} y={760 - h} width="300" height={h} fill="#20183A" />{Array.from({ length: 6 }).map((_, j) => <rect key={j} x={x + 40 + (j % 3) * 80} y={790 - h + Math.floor(j / 3) * 90} width="40" height="50" fill="#FFD27A" opacity={(k + j) % 3 ? 0.75 : 0.15} />)}</g>)}
    <rect y="760" width={W} height="320" fill="#3A2A4A" /><rect y="740" width={W} height="22" fill="#C8B8D8" stroke={OUT} strokeWidth="5" />
    {Array.from({ length: 25 }).map((_, k) => <rect key={k} x={k * 80 + 30} y="762" width="12" height="160" fill="#C8B8D8" stroke={OUT} strokeWidth="3" />)}</>,
    fg: <BlurG s={10}><rect y="960" width={W} height="120" fill="#2A1E3A" /></BlurG> }),
  fiesta: (t) => ({ bg: <><Fondo a="#6A2E8A" b="#24123E" id="fi1" /><rect y="800" width={W} height="280" fill="#3A1E4A" /><rect y="800" width={W} height="14" fill="#5A3A6A" />
    {Array.from({ length: 22 }).map((_, k) => <g key={k}><circle cx={60 + k * 88} cy={170 + Math.sin(k * 0.7) * 26} r="11" fill={['#FFD23F', '#FF4F7B', '#38E8FF'][k % 3]} opacity={0.6 + 0.4 * Math.sin(t * 4 + k)} /><Glow x={60 + k * 88} y={170 + Math.sin(k * 0.7) * 26} r={50} c={['#FFD23F', '#FF4F7B', '#38E8FF'][k % 3]} o={0.35} /></g>)}
    <g transform="translate(1500 760)"><rect x="-200" y="0" width="400" height="40" fill="#8A5A3A" stroke={OUT} strokeWidth="5" /><rect x="-110" y="-120" width="220" height="120" rx="14" fill="#FFB4C8" stroke={OUT} strokeWidth="6" /><rect x="-110" y="-70" width="220" height="18" fill="#FF4F7B" />
      {[-60, 0, 60].map((x, k) => <g key={k}><rect x={x - 6} y="-170" width="12" height="50" fill="#38E8FF" stroke={OUT} strokeWidth="3" /><ellipse cx={x} cy={-182 + Math.sin(t * 12 + k) * 2} rx="8" ry="13" fill="#FFD23F" /></g>)}</g>
    <Fiesta t={t} /></>, fg: <BlurG s={10}><ellipse cx="1820" cy="1040" rx="300" ry="120" fill="#24123E" /></BlurG> }),
  neutro: (t) => ({ bg: <Bok a="#FF9AC0" b="#7A3A8A" t={t} light="#FFE0EE" /> }),
};

// ---------- personajes ----------
const Char = ({ k, exp = 'normal', pose = 'normal', x, y, s, t, ph = 0, flip = false, inv = false }) => {
  const c = CH[k] || CH.X; const bob = Math.sin(t * 2.2 + ph) * 6, rot = Math.sin(t * 1.3 + ph) * 1.4;
  const hb = c.h[exp] || c.h.normal, bb = c.b[pose] || c.b.normal;
  const sc = s * (k === 'H' ? 0.82 : k === 'P' ? 0.75 : 1);
  const body = <g transform={`translate(${x} ${y + bob}) scale(${flip ? -sc : sc} ${sc}) rotate(${rot})`}><Raw html={bb} /><g transform={`translate(0 -40) rotate(${Math.sin(t * 1.7 + ph) * 2.5})`}><Raw html={hb} /></g></g>;
  if (!inv) return body;
  return <g><g opacity={0.26 + 0.06 * Math.sin(t * 3 + ph)} style={{ filter: 'drop-shadow(0 0 10px #8FE8FF) drop-shadow(0 0 3px #FFFFFF)' }}>{body}</g>
    {Array.from({ length: 9 }).map((_, j) => { const u = (t * 0.6 + j / 9) % 1; return <circle key={j} cx={x + Math.sin(j * 2.3 + t) * 140 * s * 1.4} cy={y + (-120 + u * 900) * s} r={5 + (j % 3) * 3} fill="#CFF6FF" opacity={Math.sin(u * Math.PI) * 0.9} />; })}</g>;
};
const HEART = 'M0 36 C-60 -10 -48 -70 0 -44 C48 -70 60 -10 0 36Z';
const Corazon = ({ x, y, val, t, s = 1 }) => {
  const k = pop(t, 0.2); if (k <= 0) return null;
  let txt = val, col = '#FF4F7B', shake = 0;
  if (val === '?' || val === '?!') { txt = '???'; col = '#8A7AA8'; shake = Math.sin(t * 40) * 3 * (Math.sin(t * 7) > 0.6 ? 1 : 0);
    if (val === '?!' && t > 1.1 && t < 1.35) { txt = `${Math.floor(rnd(Math.floor(t * 30)) * 99)}%`; col = '#FF4F7B'; } }
  else if (val === '+') { txt = '↑'; col = '#3CC07A'; }
  else if (val === 'glitch') { const g = t < 1.6; txt = g ? `${Math.floor(rnd(Math.floor(t * 24)) * 99)}%` : '♥'; col = g ? '#B04FFF' : '#FF4F7B'; shake = g ? (rnd(Math.floor(t * 30)) - 0.5) * 14 : 0; }
  else { const n = Number(val); txt = `${Math.round(n * eo((t - 0.2) / 0.9))}%`; }
  const pulse = 1 + 0.05 * Math.sin(t * 6);
  return <g transform={`translate(${x + shake} ${y + Math.sin(t * 2.4) * 8}) scale(${k * s * pulse})`}>
    <Glow x={0} y={0} r={150} c={col} o={0.45} /><path d={HEART} transform="scale(1.9)" fill={col} stroke={OUT} strokeWidth="3.5" /><path d="M-40 -60 q-22 10 -24 40" stroke="#fff" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.6" />
    <text x="0" y="12" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={txt.length > 3 ? 46 : 54} fill="#fff" stroke={OUT} strokeWidth="5" paintOrder="stroke">{txt}</text></g>;
};

// ---------- efectos ----------
const Poema = ({ t }) => { const L = ['Sofía…', 'todavía', 'alegría', '¿lavandería?']; return <g transform={`translate(960 520) rotate(${-4 + Math.sin(t) * 1.5})`}>
  <rect x="-330" y="-300" width="660" height="600" rx="26" fill="#FFFDF6" stroke={OUT} strokeWidth="6" /><path d="M-330 -240 H330" stroke="#F2B8C8" strokeWidth="4" />
  {L.map((s, i) => { const u = cl((t - 0.3 - i * 0.55) / 0.4); return <text key={i} x="-260" y={-150 + i * 120} fontFamily="Comic Sans MS, Inter" fontWeight="700" fontSize="66" fill={i === 3 ? '#E8344A' : '#3A2E58'} opacity={u} transform={`translate(${(1 - u) * -30} 0)`}>{s}</text>; })}
  <path d="M200 220 C170 190 190 160 220 180 C250 160 270 190 240 220 L220 240Z" fill="#FF4F7B" opacity={cl((t - 2) / 0.3)} /></g>; };
const Chat = ({ t, f }) => { const incoming = /explicas|mensaje/.test(f); const words = /mintiendo/.test(f) ? 'ya sé que me mientes.' : /párrafo/.test(f) ? 'Sofía, desde hace meses quería decirte que…' : /despierta/.test(f) ? '¿estás despierta?' : 'hola';
  const cyc = (t * 0.8) % 2; const n = Math.round(words.length * (cyc < 1 ? cyc : 2 - cyc));
  return <g transform="translate(960 540)"><rect x="-260" y="-470" width="520" height="940" rx="60" fill="#14121C" stroke="#3A3650" strokeWidth="10" /><rect x="-232" y="-430" width="464" height="860" rx="40" fill="#F4F2FA" />
    <rect x="-232" y="-430" width="464" height="110" fill="#B79CFF" /><circle cx="-170" cy="-375" r="34" fill="#FFE2D0" stroke={OUT} strokeWidth="4" /><text x="-120" y="-362" fontFamily={FONT} fontWeight="900" fontSize="38" fill="#fff">Sofía ⭐</text>
    {incoming ? <g opacity={cl((t - 0.3) / 0.3)} transform={`translate(0 ${(1 - eo((t - 0.3) / 0.4)) * 40})`}><rect x="-210" y="-260" width="380" height="250" rx="30" fill="#fff" stroke="#D8D2EA" strokeWidth="4" />
      <text x="-186" y="-206" fontFamily={FONT} fontWeight="700" fontSize="31" fill="#2A2238">¿Mañana me ayudas</text><text x="-186" y="-164" fontFamily={FONT} fontWeight="700" fontSize="31" fill="#2A2238">con el trabajo de</text>
      <text x="-186" y="-122" fontFamily={FONT} fontWeight="700" fontSize="31" fill="#2A2238">ciencias? Tú explicas</text><text x="-186" y="-80" fontFamily={FONT} fontWeight="700" fontSize="31" fill="#7E62D6">bonito 💜</text>
      <text x="-186" y="-30" fontFamily={FONT} fontWeight="600" fontSize="22" fill="#9A94A8">3:00 a. m.</text></g>
      : <><rect x="-210" y="300" width="420" height="80" rx="40" fill="#fff" stroke="#D8D2EA" strokeWidth="4" /><text x="-186" y="352" fontFamily={FONT} fontWeight="700" fontSize="30" fill="#2A2238">{words.slice(0, n).slice(-24)}{Math.floor(t * 3) % 2 ? '|' : ''}</text>
        <text x="0" y="0" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="34" fill="#B8B2C8">{cyc > 1 ? '⌫ borrando…' : 'escribiendo…'}</text></>}</g>; };
const Dibujos = ({ t }) => <g transform={`translate(960 520) rotate(${Math.sin(t * 0.8) * 1.5})`}><rect x="-700" y="-380" width="1400" height="760" rx="20" fill="#FFFDF6" stroke={OUT} strokeWidth="7" /><rect x="-8" y="-380" width="16" height="760" fill="#E8E0D0" />
  {[[-460, -120, 'normal'], [-200, 140, 'sonrojado'], [300, -120, 'sorprendido'], [520, 160, 'riendo']].map(([x, y, e], i) => { const u = cl((t - 0.2 - i * 0.45) / 0.35);
    return <g key={i} opacity={u} transform={`translate(${x} ${y}) scale(${0.9 * (0.8 + 0.2 * u)}) rotate(${(i % 2 ? 6 : -5)})`} style={{ filter: 'grayscale(1) contrast(1.4)' }}><Raw html={CH.X.h[e]} /></g>; })}
  <text x="360" y="330" fontFamily="Comic Sans MS, Inter" fontWeight="700" fontSize="44" fill="#7E62D6" opacity={cl((t - 2.2) / 0.4)}>♥</text></g>;
const Caida = ({ t, x, y, s }) => { const u = eo((t - 0.5) / 0.55); return <g><g transform={`translate(${x + 140} ${y - 360 * s})`}><rect x="0" y="0" width="40" height={720 * s} fill="#6A4A30" transform={`skewY(${-u * 30})`} /></g>
  {u > 0.9 && [0, 1, 2, 3].map((k) => <circle key={k} cx={x + (k - 1.5) * 90 + (t - 1) * 40 * (k - 1.5)} cy={y + 20} r={30 + (t - 1) * 30} fill="#E8E0D8" opacity={cl(1.6 - t)} />)}</g>; };


const Espejo = ({ t }) => <g transform="translate(960 470)"><rect x="-300" y="-380" width="600" height="760" rx="300" fill="#8A6A9A" stroke={OUT} strokeWidth="10" />
  <rect x="-270" y="-350" width="540" height="700" rx="270" fill="#DCEFFF" /><ellipse cx="0" cy="0" rx="270" ry="350" fill="none" stroke="#fff" strokeWidth="6" opacity="0.6" />
  <path d={`M-180 -260 L-60 -340 M-200 -160 L-20 -300`} stroke="#fff" strokeWidth="18" strokeLinecap="round" opacity={0.6 + 0.2 * Math.sin(t * 3)} />
  <rect x="-270" y="140" width="540" height="210" fill="#C9B8F0" opacity="0.5" /><text x="0" y="40" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="80" fill="#8A94B8" opacity={0.25 + 0.2 * Math.sin(t * 4)}>¿…?</text></g>;
const Tostada = ({ x, y, t, bite = 0 }) => <g transform={`translate(${x} ${y + Math.sin(t * 3) * 14}) rotate(${Math.sin(t * 2) * 10})`}><path d="M-70 -60 Q-80 -100 -40 -100 Q0 -120 40 -100 Q80 -100 70 -60 L70 60 L-70 60Z" fill="#E8A85A" stroke={OUT} strokeWidth="6" />
  <path d="M-52 -50 Q0 -80 52 -50 L52 44 L-52 44Z" fill="#F6D08A" /><rect x="-36" y="-30" width="72" height="50" rx="10" fill="#FFE27A" opacity="0.9" />{bite > 0 && <circle cx="70" cy={-70} r={36 * bite} fill="#140E1A" opacity="0" />}
  {[0, 1, 2].map((k) => <circle key={k} cx={-40 + k * 40} cy={90 + ((t * 60 + k * 20) % 60)} r="5" fill="#E8A85A" opacity={1 - ((t * 60 + k * 20) % 60) / 60} />)}</g>;
const Examen = ({ t }) => <g transform={`translate(1380 640) rotate(-8)`}><rect x="-230" y="-170" width="460" height="340" rx="10" fill="#FFFDF6" stroke={OUT} strokeWidth="6" />
  <text x="-200" y="-110" fontFamily={FONT} fontWeight="900" fontSize="40" fill="#E8344A">RESPUESTAS</text>{[0, 1, 2, 3].map((k) => <g key={k}><text x="-200" y={-50 + k * 56} fontFamily={FONT} fontWeight="800" fontSize="34" fill="#2A2238">{k + 1}. {['B', 'D', 'A', 'C'][k]}</text><rect x="-120" y={-74 + k * 56} width={200 + (k % 2) * 60} height="10" y2="0" fill="#D8D2EA" /></g>)}
  <Glow x={0} y={0} r={300} c="#FFE27A" o={0.35 + 0.15 * Math.sin(t * 4)} /></g>;
const Pelota = ({ t }) => { const u = eo(t / 2.2); return <g><circle cx={600 + u * 900} cy={950 - Math.abs(Math.sin(t * 6)) * 80 * (1 - u)} r="46" fill="#E8344A" stroke={OUT} strokeWidth="6" /><path d={`M${560 + u * 900} 950 h80`} stroke="#fff" strokeWidth="8" /></g>; };
const Cuenta = ({ t, f }) => { const n = t < 1.0 ? '11:59' : t < 1.8 ? '3' : t < 2.6 ? '2' : t < 3.4 ? '1' : '00:00'; const k = pop(t % 0.8 + 0.2, 0.2);
  return <g transform="translate(960 500)"><Glow x={0} y={0} r={420} c="#8FE8FF" o={0.4} /><text textAnchor="middle" y="70" fontFamily={FONT} fontWeight="900" fontSize={n.length > 2 ? 220 : 380} fill="#fff" stroke={OUT} strokeWidth="18" paintOrder="stroke" transform={`scale(${0.85 + 0.15 * k})`}>{n}</text></g>; };
const RelojChip = ({ r }) => !r ? null : <div style={{ position: 'absolute', right: 40, top: 30, padding: '12px 22px', borderRadius: 18, background: 'rgba(18,14,31,0.9)', border: '3px solid #8FE8FF', fontFamily: FONT, color: '#fff', display: 'flex', alignItems: 'center', gap: 14 }}>
  <div style={{ fontWeight: 900, fontSize: 20, letterSpacing: 2.4, lineHeight: 1.1, color: '#8FE8FF' }}>INVISIBLE<br />QUEDAN</div><div style={{ fontWeight: 900, fontSize: 46 }}>{r}</div></div>;


const Alarma = ({ t }) => { const sh = Math.sin(t * 60) * 6; return <g transform={`translate(${1440 + sh} 380) rotate(${Math.sin(t * 50) * 6})`}><circle r="150" fill="#E8344A" stroke={OUT} strokeWidth="8" /><circle r="118" fill="#FFFDF6" stroke={OUT} strokeWidth="6" />
  <text y="28" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="74" fill={OUT}>7:40</text>{[-1, 1].map((d) => <circle key={d} cx={d * 110} cy="-130" r="44" fill="#FFD23F" stroke={OUT} strokeWidth="6" />)}
  {[0, 1, 2].map((k) => <path key={k} d={`M${180 + k * 26} ${-60 + k * 30} l40 -10`} stroke="#E8344A" strokeWidth="9" strokeLinecap="round" opacity={0.5 + 0.5 * Math.sin(t * 20 + k)} />)}</g>; };
const Calcetines = ({ t }) => <g transform="translate(960 520)">{[[-170, '#FF7A1A', -8], [170, '#4C7CC8', 8]].map(([x, c, r], k) => <g key={k} transform={`translate(${x} ${Math.sin(t * 3 + k) * 12}) rotate(${r})`}>
  <path d="M-60 -260 L60 -260 L60 80 Q60 160 -20 170 L-150 170 Q-200 170 -200 120 Q-200 70 -150 60 L-60 50Z" fill={c} stroke={OUT} strokeWidth="8" />{[0, 1, 2].map((j) => <rect key={j} x="-60" y={-230 + j * 60} width="120" height="22" fill="#fff" opacity="0.8" />)}</g>)}
  <text y="300" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="70" fill="#fff" stroke={OUT} strokeWidth="12" paintOrder="stroke">≠</text></g>;
const Choque = ({ t }) => { const u = eo(t / 0.4); return <g transform="translate(960 480)"><path d={Array.from({ length: 16 }).map((_, k) => { const a = k * Math.PI / 8, r = k % 2 ? 130 : 300 * u; return `${k ? 'L' : 'M'}${Math.cos(a) * r} ${Math.sin(a) * r}`; }).join(' ') + 'Z'} fill="#FFD23F" stroke={OUT} strokeWidth="8" />
  <text y="40" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="130" fill="#E8344A" stroke={OUT} strokeWidth="10" paintOrder="stroke" transform={`scale(${0.6 + 0.4 * u})`}>¡PUM!</text>
  {[[-1, -1, '#4C7CC8'], [1, -0.6, '#E86A5C'], [-0.7, 0.8, '#7CC07A'], [0.9, 0.9, '#B07AD6']].map(([dx, dy, c], k) => <rect key={k} x={dx * (200 + t * 260) - 50} y={dy * (160 + t * 200) - 35} width="100" height="70" rx="6" fill={c} stroke={OUT} strokeWidth="5" transform={`rotate(${t * 200 * (k % 2 ? 1 : -1)} ${dx * (200 + t * 260)} ${dy * (160 + t * 200)})`} />)}</g>; };
const Chocolate = ({ t }) => { const u = eo((t - 0.3) / 0.6); return <g transform="translate(960 760)"><g transform={`rotate(${80 * u} 0 0)`}><rect x="-50" y="-120" width="100" height="120" rx="12" fill="#fff" stroke={OUT} strokeWidth="6" /><path d="M50 -90 q40 10 0 50" stroke={OUT} strokeWidth="8" fill="none" /></g>
  <ellipse cx={u * 160} cy="10" rx={260 * u} ry={40 * u} fill="#6A3A1E" opacity="0.9" />{[0, 1, 2].map((k) => <path key={k} d={`M${-30 + k * 30} ${-140 - (t * 40) % 40} q12 -20 0 -40`} stroke="#fff" strokeWidth="6" fill="none" opacity={0.6 * (1 - u)} />)}</g>; };
const Carta = ({ t }) => <g transform={`translate(1450 400) rotate(${-8 + Math.sin(t * 2) * 3}) scale(${pop(t, 0.1)})`}><rect x="-150" y="-100" width="300" height="200" rx="10" fill="#FFF3F6" stroke={OUT} strokeWidth="7" /><path d="M-150 -100 L0 20 L150 -100" stroke={OUT} strokeWidth="6" fill="none" />
  <path d="M0 40 C-24 18 -16 -6 0 6 C16 -6 24 18 0 40Z" fill="#FF4F7B" stroke={OUT} strokeWidth="4" /></g>;
const Lluvia = ({ t }) => <g opacity="0.75"><rect width={W} height={H} fill="#2A3A5A" opacity="0.35" />{Array.from({ length: 70 }).map((_, k) => { const x = (rnd(k) * W + t * 120) % W, y = (rnd(k + 70) * H + t * 1400) % H; return <path key={k} d={`M${x} ${y} l-14 46`} stroke="#CFE6FF" strokeWidth="4" strokeLinecap="round" />; })}</g>;
const Chip = ({ c }) => !c ? null : <div style={{ position: 'absolute', right: 40, top: 30, padding: '12px 22px', borderRadius: 18, background: 'rgba(18,14,31,0.9)', border: `3px solid ${c[0] === '$' ? '#FFD23F' : '#FF6F8F'}`, fontFamily: FONT, color: '#fff', display: 'flex', alignItems: 'center', gap: 14 }}>
  <div style={{ fontWeight: 900, fontSize: 20, letterSpacing: 2.4, lineHeight: 1.1, color: '#FF9AB0' }}>{c[0]}<br />{c[2] || 'METRO'}</div><div style={{ fontWeight: 900, fontSize: 46, color: c[0] === '$' ? '#7CF0A0' : c[2] ? '#FF9AE8' : (parseInt(c[1]) >= 60 ? '#FF5E6E' : '#7CE0A0') }}>{c[1]}</div></div>;


const Nube = ({ x, y, txt, t, s = 1 }) => { const k = pop(t, 0.15); if (k <= 0) return null; const w = Math.max(320, txt.length * 30 + 120);
  return <g transform={`translate(${x} ${y + Math.sin(t * 2) * 6}) scale(${k * s})`}><g style={{ filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.35))' }}>
    {Array.from({ length: 9 }).map((_, j) => { const a = j / 9 * Math.PI * 2; return <ellipse key={j} cx={Math.cos(a) * w * 0.42} cy={Math.sin(a) * 62} rx={w * 0.2} ry="62" fill="#FFFFFF" stroke={OUT} strokeWidth="6" />; })}
    <ellipse cx="0" cy="0" rx={w * 0.47} ry="78" fill="#FFFFFF" /></g>
    <circle cx={-w * 0.32} cy="118" r="20" fill="#fff" stroke={OUT} strokeWidth="5" /><circle cx={-w * 0.4} cy="160" r="12" fill="#fff" stroke={OUT} strokeWidth="4" />
    <text x="0" y="14" textAnchor="middle" fontFamily={FONT} fontStyle="italic" fontWeight="900" fontSize="42" fill="#5A2A8A">{txt}</text></g>; };
const Rayo = ({ x1, y1, x2, y2, t }) => { const n = 40, pts = Array.from({ length: n + 1 }).map((_, i) => { const u = i / n, x = x1 + (x2 - x1) * u, y = y1 + (y2 - y1) * u - Math.sin(u * Math.PI) * 120 + Math.sin(u * 14 - t * 8) * 14 * Math.sin(u * Math.PI); return `${i ? 'L' : 'M'}${x} ${y}`; }).join(' ');
  const g = cl((t - 0.1) / 0.4); return <g opacity={g}><path d={pts} stroke="#FF4FD8" strokeWidth="34" fill="none" strokeLinecap="round" opacity="0.35" style={{ filter: 'blur(8px)' }} />
    <path d={pts} stroke="#FF7AE8" strokeWidth="14" fill="none" strokeLinecap="round" /><path d={pts} stroke="#FFFFFF" strokeWidth="5" fill="none" strokeLinecap="round" />
    {[0, 1, 2, 3, 4].map((j) => { const u = ((t * 0.6 + j / 5) % 1), x = x1 + (x2 - x1) * u, y = y1 + (y2 - y1) * u - Math.sin(u * Math.PI) * 120; return <circle key={j} cx={x} cy={y} r="9" fill="#FFF" />; })}
    <Glow x={x1} y={y1} r={120} c="#FF7AE8" o={0.6} /><Glow x={x2} y={y2} r={120} c="#FF7AE8" o={0.6} /></g>; };


const Ecuaciones = ({ t }) => { const L = ['E = mc²', '∫ f(x) dx', '∑ 26ⁿ', 'π ≈ 3.14159', 'x² + y² = r²', '√2', 'log₂(n)', 'P(A|B)', '∞', 'Δv = at']; return <g>{L.map((e, k) => { const a = k / L.length * Math.PI * 2 + t * 0.4, r = 360 + (k % 3) * 70;
  return <text key={k} x={960 + Math.cos(a) * r * 1.4} y={480 + Math.sin(a) * r * 0.8} textAnchor="middle" fontFamily="Courier New, monospace" fontWeight="900" fontSize={42 + (k % 3) * 10} fill={['#8FE8FF', '#FFD23F', '#FF9AE8'][k % 3]} opacity={0.5 + 0.5 * Math.sin(t * 2 + k)} style={{ filter: 'drop-shadow(0 0 8px rgba(143,232,255,0.8))' }}>{e}</text>; })}</g>; };
const Enigma = ({ t }) => { const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; return <g transform="translate(960 560)"><rect x="-460" y="-300" width="920" height="560" rx="30" fill="#3A3428" stroke="#1A1424" strokeWidth="10" /><rect x="-430" y="-270" width="860" height="160" rx="16" fill="#2A2620" />
  {[0, 1, 2].map((k) => <g key={k} transform={`translate(${-140 + k * 140} -190)`}><rect x="-50" y="-60" width="100" height="120" rx="12" fill="#C8B070" stroke="#1A1424" strokeWidth="5" /><text y="20" textAnchor="middle" fontFamily="Courier New, monospace" fontWeight="900" fontSize="64" fill="#1A1424">{A[Math.floor(t * (3 + k * 2) + k * 7) % 26]}</text></g>)}
  {Array.from({ length: 26 }).map((_, k) => { const row = k < 9 ? 0 : k < 17 ? 1 : 2, i = row === 0 ? k : row === 1 ? k - 9 : k - 17, n = row === 0 ? 9 : row === 1 ? 8 : 9; const lit = Math.floor(t * 4) % 26 === k;
    return <g key={k} transform={`translate(${(i - (n - 1) / 2) * 92} ${-30 + row * 92})`}><circle r="36" fill={lit ? '#FFD23F' : '#E8E0C8'} stroke="#1A1424" strokeWidth="4" />{lit && <Glow x={0} y={0} r={80} c="#FFD23F" o={0.8} />}<text y="14" textAnchor="middle" fontFamily="Courier New, monospace" fontWeight="900" fontSize="38" fill="#1A1424">{A[k]}</text></g>; })}</g>; };
const Reflectores = ({ t }) => <g opacity="0.5">{[0, 1, 2].map((k) => { const a = -60 + Math.sin(t * 0.6 + k * 2) * 35; return <path key={k} d="M0 0 L-60 -1400 L60 -1400Z" transform={`translate(${400 + k * 560} 1080) rotate(${a + 60})`} fill="#FFF6C8" opacity="0.35" />; })}</g>;
const Mapa = ({ t }) => <g><rect width={W} height={H} fill="#1E3A5A" />{Array.from({ length: 30 }).map((_, k) => <path key={k} d={`M0 ${k * 40} Q960 ${k * 40 + 20 * Math.sin(t + k)} 1920 ${k * 40}`} stroke="#2E5A80" strokeWidth="2" fill="none" />)}
  <path d="M0 160 Q200 120 300 260 Q260 420 120 520 L0 560Z" fill="#7A9A6A" stroke="#1A1424" strokeWidth="5" /><path d="M1600 200 Q1760 160 1920 220 L1920 760 Q1760 700 1700 520 Q1640 360 1600 200Z" fill="#7A9A6A" stroke="#1A1424" strokeWidth="5" />
  <text x="160" y="360" fontFamily={FONT} fontWeight="900" fontSize="36" fill="#1A1424">AMÉRICA</text><text x="1650" y="440" fontFamily={FONT} fontWeight="900" fontSize="36" fill="#1A1424">EUROPA</text><text x="960" y="120" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="56" fill="#E8F0FF">OCÉANO ATLÁNTICO</text>
  {Array.from({ length: 5 }).map((_, k) => <g key={k} transform={`translate(${520 + k * 70 + t * 30} ${520 + (k % 2) * 40})`}><path d="M-26 0 L26 0 L18 14 L-18 14Z" fill="#E8E0C8" stroke="#1A1424" strokeWidth="3" /></g>)}
  {[[1000, 460], [1060, 600], [940, 640]].map(([x, y], k) => <g key={k} opacity={0.6 + 0.4 * Math.sin(t * 4 + k)}><ellipse cx={x} cy={y} rx="30" ry="8" fill="#C8382A" /><circle cx={x} cy={y} r={40 + (t * 40 + k * 20) % 60} fill="none" stroke="#C8382A" strokeWidth="3" /></g>)}
  <path d={`M600 560 Q760 ${560 - 160 * cl(t / 2)} 1600 360`} stroke="#3CC07A" strokeWidth="8" fill="none" strokeDasharray="20 14" opacity={cl((t - 0.8) / 0.5)} /></g>;
const Convoy = ({ t }) => <g><Fondo a="#FFB38A" b="#2E4A6A" id="cv1" /><circle cx="1500" cy="300" r="90" fill="#FFE2A0" /><Glow x={1500} y={300} r={300} c="#FFE2A0" o={0.5} /><rect y="620" width={W} height="460" fill="#2E5A80" />
  {Array.from({ length: 12 }).map((_, k) => <path key={k} d={`M0 ${640 + k * 34} Q480 ${630 + k * 34 + 10 * Math.sin(t * 2 + k)} 960 ${640 + k * 34} T1920 ${640 + k * 34}`} stroke="#4A7AA0" strokeWidth="3" fill="none" />)}
  {[0, 1, 2, 3].map((k) => <g key={k} transform={`translate(${(200 + k * 380 + t * 40) % 2200 - 140} ${640 + (k % 2) * 60 + Math.sin(t * 2 + k) * 6}) scale(${0.9 + (k % 2) * 0.3})`}><path d="M-160 0 L160 0 L120 50 L-120 50Z" fill="#5A5A6A" stroke="#1A1424" strokeWidth="5" /><rect x="-60" y="-60" width="120" height="60" fill="#8A8A9A" stroke="#1A1424" strokeWidth="5" /><rect x="-20" y="-110" width="30" height="50" fill="#3A3A48" />
    {[0, 1].map((j) => { const u = (t * 0.5 + j / 2) % 1; return <circle key={j} cx={-5 + u * 30} cy={-120 - u * 80} r={14 + u * 20} fill="#C8C8D0" opacity={1 - u} />; })}</g>)}</g>;
const Foto = ({ t }) => <g transform={`translate(960 500) rotate(${-2 + Math.sin(t) * 0.5})`}><rect x="-620" y="-360" width="1240" height="720" fill="#F2EAD8" stroke="#4A3A2A" strokeWidth="14" /><rect x="-580" y="-320" width="1160" height="560" fill="#C8BCA4" />
  <g style={{ filter: 'sepia(1) contrast(1.1)' }}>{[[-420, 'T', 'riendo'], [-200, 'D', 'riendo'], [60, 'S', 'riendo'], [300, 'X', 'riendo'], [480, 'K', 'normal']].map(([x, k, e], i) => <g key={i} transform={`translate(${x} -60) scale(0.62)`}><Raw html={CH[k].b.normal} /><g transform="translate(0 -40)"><Raw html={CH[k].h[e]} /></g></g>)}</g>
  <text x="0" y="310" textAnchor="middle" fontFamily="Courier New, monospace" fontWeight="700" fontSize="40" fill="#4A3A2A">Bletchley Park · 1941</text>
  {t > 1.2 && <ellipse cx="300" cy="-120" rx="120" ry="150" fill="none" stroke="#FF2A3A" strokeWidth="10" opacity={cl((t - 1.2) / 0.3)} />}</g>;

// ---------- efectos v33 ----------
const COIN = ({ x, y, r = 46, rot = 0, sq = 1 }) => <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${sq} 1)`}>
  <circle r={r * 1.5} fill="#FFD23F" opacity="0.25" /><circle r={r} fill="#E8A81C" stroke={OUT} strokeWidth="6" /><circle r={r * 0.78} fill="#FFD23F" stroke="#C88A10" strokeWidth="4" />
  <text y={r * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={r * 1.05} fill="#B87A08">$</text><path d={`M${-r * 0.5} ${-r * 0.45} q${r * 0.2} ${-r * 0.25} ${r * 0.5} ${-r * 0.3}`} stroke="#FFF6C8" strokeWidth="6" fill="none" strokeLinecap="round" /></g>;
// una moneda que cae y rebota en (x,y); u = tiempo relativo al aterrizaje
const Moneda = ({ x, y, u }) => { if (u < -0.4 || u > 1.6) return null;
  const fy = u < 0 ? y - 900 * (u / -0.4) ** 2 : y - Math.abs(Math.sin(u * 9)) * 70 * Math.exp(-u * 4);
  const k = u > 0 && u < 0.5 ? 1 - u * 2 : 0;
  return <g><COIN x={x} y={fy} rot={u * 400} sq={Math.abs(Math.cos(u * 8)) * 0.7 + 0.3} />
    {k > 0 && Array.from({ length: 8 }).map((_, j) => { const a = j / 8 * Math.PI * 2; return <path key={j} d={`M${x + Math.cos(a) * 60} ${y + Math.sin(a) * 60} L${x + Math.cos(a) * (90 + 80 * (1 - k))} ${y + Math.sin(a) * (90 + 80 * (1 - k))}`} stroke="#FFF3A0" strokeWidth="9" strokeLinecap="round" opacity={k} />; })}
    {u > 0 && <g opacity={cl(1.4 - u)} transform={`translate(${x + 90} ${y - 120 - u * 60})`}><text textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="74" fill="#7CF0A0" stroke={OUT} strokeWidth="10" paintOrder="stroke">+$1</text></g>}</g>; };
const Monedas = ({ t }) => <g>{Array.from({ length: 46 }).map((_, k) => { const u = (t * (0.55 + rnd(k) * 0.5) + rnd(k + 3)) % 1.4;
  return <COIN key={k} x={rnd(k + 7) * W} y={-120 + u * 1000} r={26 + rnd(k + 11) * 26} rot={t * 300 + k * 40} sq={Math.abs(Math.cos(t * 6 + k)) * 0.7 + 0.3} />; })}</g>;
const Impacto = ({ t }) => { const k = cl(1 - t / 0.35); if (k <= 0) return null; return <g>{Array.from({ length: 28 }).map((_, j) => { const a = j / 28 * Math.PI * 2 + rnd(j) * 0.2, r0 = 380 + rnd(j + 1) * 200;
  return <path key={j} d={`M${960 + Math.cos(a) * r0} ${540 + Math.sin(a) * r0} L${960 + Math.cos(a) * 1300} ${540 + Math.sin(a) * 1300}`} stroke="#fff" strokeWidth={6 + rnd(j + 2) * 14} opacity={k * 0.85} />; })}
  <rect width={W} height={H} fill="#fff" opacity={cl(1 - t / 0.08) * 0.6} /></g>; };
const Confeti = ({ t }) => <g>{Array.from({ length: 90 }).map((_, k) => { const u = (t * (0.35 + rnd(k) * 0.3) + rnd(k + 5)) % 1.3;
  return <rect key={k} x={rnd(k + 9) * W + Math.sin(t * 3 + k) * 40} y={-60 + u * 1150} width="18" height="30" rx="3" fill={['#FF4F7B', '#FFD23F', '#38E8FF', '#7CF0A0', '#B79CFF'][k % 5]} transform={`rotate(${t * 220 + k * 37} ${rnd(k + 9) * W} ${-60 + u * 1150})`} />; })}</g>;
const Palabra = ({ txt, t }) => { const u = eo(cl(t / 0.18)); if (t < 0) return null; const sc = 2.4 - 1.4 * u, sh = t < 0.35 ? Math.sin(t * 90) * 8 * (1 - t / 0.35) : 0;
  const c = txt.startsWith('+') ? '#7CF0A0' : txt.includes('$') || txt.includes('CLINK') ? '#FFD23F' : txt.includes('TÓXICO') || txt.includes('VISTO') ? '#FF5E6E' : '#FFFFFF';
  const w = Math.max(420, txt.length * 86 + 160);
  return <g transform={`translate(${960 + sh} 760) rotate(-4) scale(${sc * 0.9})`} opacity={cl(t / 0.06)}>
    <path d={Array.from({ length: 24 }).map((_, j) => { const a = j / 24 * Math.PI * 2, r = j % 2 ? 0.78 : 1; return `${j ? 'L' : 'M'}${Math.cos(a) * w * 0.56 * r} ${Math.sin(a) * 120 * r}`; }).join(' ') + 'Z'} fill="#FF3FA4" stroke={OUT} strokeWidth="8" opacity="0.92" />
    <text y="42" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="124" fill={c} stroke={OUT} strokeWidth="16" paintOrder="stroke">{txt}</text></g>; };
const Fiesta = ({ t }) => <g>{Array.from({ length: 13 }).map((_, k) => <path key={k} d={`M${k * 160} 60 l80 0 l-40 70Z`} fill={['#FF4F7B', '#FFD23F', '#38E8FF', '#7CF0A0'][k % 4]} stroke={OUT} strokeWidth="4" transform={`translate(0 ${Math.sin(k * 0.5) * 20 + 30})`} />)}
  <path d="M0 90 Q960 190 1920 90" stroke={OUT} strokeWidth="5" fill="none" />
  <g transform="translate(960 250)"><rect x="-330" y="-62" width="660" height="110" rx="20" fill="#FF3FA4" stroke={OUT} strokeWidth="7" /><text y="22" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="66" fill="#fff" stroke={OUT} strokeWidth="8" paintOrder="stroke">¡FELIZ CUMPLE!</text></g>
  {[[180, '#FF4F7B'], [300, '#FFD23F'], [1640, '#38E8FF'], [1760, '#B79CFF']].map(([x, c], k) => { const y = 330 + Math.sin(t * 1.6 + k) * 18; return <g key={k}><path d={`M${x} ${y + 95} q-14 120 10 260`} stroke={OUT} strokeWidth="3" fill="none" /><ellipse cx={x} cy={y} rx="70" ry="88" fill={c} stroke={OUT} strokeWidth="6" /><ellipse cx={x - 24} cy={y - 34} rx="14" ry="24" fill="#fff" opacity="0.5" /></g>; })}</g>;
// ---------- intérprete de planos ----------
const parse = (v) => { const [lugar, ...tok] = v.split(';'); const o = { lugar, chars: [], nums: {}, cu: false, ui: null, fx: null };
  tok.forEach((s) => { if (s === 'cu') o.cu = true; else if (s === 'sh') o.sh = true; else if (s.startsWith('kw:')) o.kw = s.slice(3); else if (s.startsWith('n:')) { const [k, val] = s.slice(2).split('='); o.nums[k] = val; } else if (s.startsWith('ui:')) o.ui = s.slice(3); else if (s.startsWith('fx:')) o.fx = s.slice(3); else if (s.startsWith('th:')) o.th = s.slice(3);
    else { const m = s.match(/^([A-Z]+)=(\w+)@([\d.]+)(?:!(\w+))?(~inv)?$/); if (m) o.chars.push({ k: m[1], exp: m[2], x: Number(m[3]), pose: m[4] || 'normal', inv: !!m[5] }); } }); return o; };

const shotOf = (pl, lt, ld, si) => {
  if (pl.v === 'tit') return { bg: <>{SETS.londres(lt).bg}<rect width={W} height={H} fill="#140E1A" opacity="0.45" /><Reflectores t={lt} /><Char k="X" exp="sorprendido" x={330} y={700} s={0.95} t={lt} /><Ecuaciones t={lt} /></>, cam: [0, 0, 3],
    ui: <g transform={`translate(1040 500) scale(${pop(lt, 0.1)})`}><text textAnchor="middle" y="-60" fontFamily={FONT} fontWeight="900" fontSize="76" fill="#fff" stroke={OUT} strokeWidth="16" paintOrder="stroke">¿QUÉ PASARÍA SI VIAJARAS A LA</text>
      <text textAnchor="middle" y="40" fontFamily={FONT} fontWeight="900" fontSize="80" fill="#FFD23F" stroke={OUT} strokeWidth="18" paintOrder="stroke">SEGUNDA GUERRA MUNDIAL</text><text textAnchor="middle" y="140" fontFamily={FONT} fontWeight="900" fontSize="80" fill="#8FE8FF" stroke={OUT} strokeWidth="18" paintOrder="stroke">CON IQ INFINITO?</text></g> };
  const o = parse(pl.v); const alt = pl.j % 2 === 1; const cu = o.cu !== alt && o.chars.length > 0; const set = (SETS[o.lugar] || SETS.neutro)(lt + si * 3);
  const chars = cu ? o.chars.slice(0, 1).map((c) => ({ ...c, x: 0.5 })) : o.chars;
  const s = cu ? 1.5 : (o.chars.some((c) => c.k === 'P') && o.chars.length === 1 ? 0.8 : 0.66);
  const items = chars.map((c, i) => { const x = c.x * W, y = cu ? 470 + 40 * s : 1010 - 830 * s; let ex = c.exp, pz = c.pose;
    if (o.fx === 'caida' && c.k === 'X') { const u = eo((lt - 0.5) / 0.55); return { c, node: <g key={i}><Caida t={lt} x={x} y={y + 830 * s} s={s} /><g transform={`rotate(${-80 * u} ${x} ${y + 830 * s}) translate(${u * -60} 0)`}><Char k={c.k} exp={u > 0.1 ? 'sorprendido' : ex} pose={pz} x={x} y={y} s={s} t={lt} ph={i} /></g></g>, x, y }; }
    return { c, node: <Char key={i} inv={c.inv} k={c.k} exp={ex} pose={pz} x={x} y={y} s={s} t={lt} ph={i * 1.3} flip={!cu && c.x > 0.55 && c.k !== 'S' && c.k !== 'C' && c.k !== 'M' && c.k !== 'D' ? false : false} />, x, y }; });
  const hearts = []; Object.entries(o.nums).forEach(([k, val]) => { if (k === '0') { hearts.push(<Corazon key="h0" x={960} y={480} val={val} t={lt} s={2.2} />); return; }
    const it = items.find((q) => q.c.k === k); if (!it) return;
    if (cu) { hearts.push(<Corazon key={k} x={it.x + 380} y={300} val={val} t={lt} s={1.3} />); return; }
    const hy = it.y + (k === 'P' ? -260 : -300) * s - 60; hearts.push(<Corazon key={k} x={it.x} y={Math.max(230, hy)} val={val} t={lt} s={0.95} />); });
  let fxNode = null;
  if (o.fx === 'poema' && !o.chars.length) fxNode = <Poema t={lt} />;
  if (o.fx === 'poema' && o.chars.length) fxNode = <g transform="translate(560 160) scale(0.45)"><Poema t={lt} /></g>;
  if (o.fx === 'chat' && !o.chars.length) fxNode = <Chat t={lt} f={pl.f} />;
  if (o.fx === 'chat' && o.chars.length) fxNode = <g transform={`translate(${cu ? 1500 : 1380} 380) scale(0.42) rotate(8)`}><Chat t={lt} f={pl.f} /></g>;
  if (o.fx === 'dibujos') fxNode = <Dibujos t={lt} />;
  if (o.fx === 'espejo') fxNode = <Espejo t={lt} />;
  if (o.fx === 'examen') fxNode = <Examen t={lt} />;
  if (o.fx === 'pelota') fxNode = <Pelota t={lt} />;
  if (o.fx === 'cuenta') fxNode = <Cuenta t={lt} f={pl.f} />;
  if (o.fx === 'alarma') fxNode = <Alarma t={lt} />;
  if (o.fx === 'ecuaciones') fxNode = <Ecuaciones t={lt} />;
  if (o.fx === 'enigma') fxNode = <Enigma t={lt} />;
  if (o.fx === 'reflectores') fxNode = <Reflectores t={lt} />;
  if (o.fx === 'mapa') fxNode = <Mapa t={lt} />;
  if (o.fx === 'convoy') fxNode = <Convoy t={lt} />;
  if (o.fx === 'foto') fxNode = <Foto t={lt} />;
  const tp = (pl.pa !== undefined ? pl.a - pl.pa : 0) + lt, pd = pl.pd || ld, land = 0.6 * pd;
  if (o.fx === 'moneda') { const it = items.find((q) => q.c.k === 'X') || items[0]; const mx = it ? it.x + (cu ? 0 : 10) : 960, my = it ? it.y - 250 * s : 560; fxNode = <Moneda x={mx} y={Math.max(160, my)} u={tp - land} />; }
  if (o.fx === 'monedas') fxNode = <Monedas t={tp} />;
  if (o.fx === 'impacto') fxNode = <Impacto t={tp} />;
  if (o.fx === 'confeti') fxNode = <Confeti t={tp} />;
  if (o.fx === 'calcetines') fxNode = <Calcetines t={lt} />;
  if (o.fx === 'choque') fxNode = <Choque t={lt} />;
  if (o.fx === 'chocolate') fxNode = <Chocolate t={lt} />;
  if (o.fx === 'carta') fxNode = <Carta t={lt} />;
  if (o.fx === 'lluvia') fxNode = <Lluvia t={lt} />;
  if (o.fx === 'tostada') { const it = items.find((q) => q.c.k === 'X'); fxNode = it ? <Tostada x={it.x + 120 * s} y={it.y + 300 * s} t={lt} /> : <g transform="translate(960 520) scale(2.4)"><Tostada x={0} y={0} t={lt} /></g>; }
  const itX = items.find((q) => q.c.k === 'X'), itS = items.find((q) => q.c.k === 'S');
  if (o.fx === 'rayo' && itX && itS) fxNode = <Rayo x1={itX.x} y1={itX.y - 40 * s} x2={itS.x} y2={itS.y - 40 * s} t={lt} />;
  const nubeNode = o.th ? (() => { const it = items[0]; if (!it) return <Nube x={960} y={300} txt={o.th} t={lt} s={1.3} />; return cu ? <Nube x={1330} y={230} txt={o.th} t={lt} s={1.0} /> : <Nube x={Math.min(1500, it.x + 260)} y={Math.max(180, it.y - 380 * s)} txt={o.th} t={lt} s={0.9} />; })() : null;
  const brillo = o.fx === 'brillo' ? <g>{Array.from({ length: 14 }).map((_, k) => <Sparkle key={k} x={rnd(k) * W} y={120 + rnd(k + 5) * 700} r={18 + (k % 3) * 10} t={lt} k={k} />)}</g> : null;
  const h = hash(pl.v + pl.j); const dir = h % 2 ? 1 : -1;
  const cam = cu ? [dir * (8 + h % 10), -4, 4.5] : o.chars.length ? [dir * (22 + h % 16), (h % 3 - 1) * 8, (h % 5 === 0 ? -3.2 : 3.4)] : [dir * 14, -6, 3.2];
  const shT = o.sh ? (o.fx === 'moneda' ? tp - land : tp) : -9; const kwT = o.kw ? tp - 0.05 : -9;
  return { shT, kw: o.kw ? <Palabra txt={o.kw} t={kwT} /> : null, imp: o.kw ? <Impacto t={kwT} /> : null,
    bg: <>{set.bg}{items.map((q) => q.node)}{hearts}{fxNode}{nubeNode}{brillo}</>, fg: !cu && set.fg && h % 3 !== 0 ? set.fg : null, cam, blur: h % 5 === 1,
    ui: o.ui && o.ui !== 'corazon' ? <Pildora x={960} y={110} txt={o.ui} t={lt} at={0.15} c={o.ui.startsWith('PRUEBA') ? '#FFD23F' : '#FF9AC0'} borde={o.ui.startsWith('PRUEBA') ? '#FFD23F' : '#FF9AC0'} /> : null };
};

// ---------- tiempos ----------
const planesOf = (sc) => {
  const P = sc.planos || []; const words = sc.words || []; const d = sc.frames / 30;
  const tot = P.reduce((s, p) => s + p.f.split(/\s+/).length, 0) || 1; let acc = 0;
  const starts = P.map((p, i) => { const idx = Math.min(words.length - 1, Math.round(acc * words.length / tot)); acc += p.f.split(/\s+/).length; return i === 0 ? 0 : Math.max(0, (words[idx] ? words[idx][1] : 0) - 0.15); });
  const out = [];
  P.forEach((p, i) => { const a = starts[i], b = i + 1 < P.length ? starts[i + 1] : d, dur = b - a; const n = p.v === 'tit' ? 1 : Math.max(1, Math.ceil(dur / 2.3));
    for (let j = 0; j < n; j++) out.push({ v: p.v, f: p.f, i, j, n, pa: a, pd: dur, a: a + dur * j / n, b: a + dur * (j + 1) / n }); });
  return out;
};
const Subs = ({ sc, t, pl }) => {
  const words = sc.words || []; if (!pl || !words.length) return null;
  const P = sc.planos; const tot = P.reduce((s, p) => s + p.f.split(/\s+/).length, 0); let acc = 0, a0 = 0, n = 0;
  P.forEach((p, i) => { const c = p.f.split(/\s+/).length; if (i === pl.i) { a0 = acc; n = c; } acc += c; });
  const fw = pl.f.split(/\s+/); const r = words.length / tot;
  let cur = 0; for (let k = 0; k < n; k++) { const wi = Math.min(words.length - 1, Math.round((a0 + k) * r)); if (words[wi] && t >= words[wi][1] - 0.05) cur = k; }
  const g = Math.floor(cur / 7) * 7; const chunk = fw.slice(g, g + 7);
  return <div style={{ position: 'absolute', top: 960, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 50, lineHeight: 1.15, color: '#fff', textShadow: '0 0 6px #000, 0 4px 0 #1A1424, 0 -2px 0 #1A1424, 3px 0 0 #1A1424, -3px 0 0 #1A1424', padding: '0 200px', boxSizing: 'border-box' }}>
    {chunk.map((w, j) => <span key={j} style={{ color: g + j === cur ? '#FFD23F' : '#fff', marginRight: 14 }}>{w}</span>)}</div>;
};
const Scene = ({ i, at }) => {
  const f0 = useCurrentFrame(); const sc = D[i];
  const f = at !== undefined ? Math.round(sc.frames * at) : f0; const t = f / 30;
  const pls = planesOf(sc); const pl = pls.find((x) => t >= x.a && t < x.b) || pls[pls.length - 1];
  const lt = t - pl.a, ld = pl.b - pl.a; const S = shotOf(pl, lt, ld, i);
  const [px, py, zz] = S.cam; const e = eo(lt / Math.max(0.5, ld));
  const z0 = zz < 0 ? 1.08 + (-zz / 100) * ld : 1.08; const zf = zz < 0 ? z0 - (-zz / 100) * ld * e : 1.08 + (zz / 100) * ld * e;
  const dx = px * ld * (e - 0.5) * 1.5, dy = py * ld * (e - 0.5) * 1.5;
  const h2 = hash(pl.v + pl.j + i), dir = h2 % 2 ? 1 : -1, ent = 1 - eo(cl(lt / 0.22));
  const whip = dir * 260 * ent; const kick = 1 + 0.16 * (1 - eo(cl(lt / 0.2)));
  const shk = S.shT >= 0 && S.shT < 0.5 ? (1 - S.shT / 0.5) * 22 : 0; const sx = shk * Math.sin(t * 95), sy = shk * Math.cos(t * 81);
  const blur = Math.max(S.blur ? 18 * (1 - lt / 0.27) : 0, 16 * (1 - lt / 0.14)); const bx = Math.max(0, blur), by = Math.max(0, blur * 0.25);
  return <AbsoluteFill style={{ background: '#140E1A', overflow: 'hidden' }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute' }}>
      <defs><filter id="bin" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation={`${bx} ${by}`} /></filter></defs>
      <g filter={blur > 0.3 ? 'url(#bin)' : undefined} transform={`translate(${whip + sx} ${sy})`}>
        <g transform={`translate(${W / 2 - dx} ${H / 2 - dy}) scale(${zf * kick}) translate(${-W / 2} ${-H / 2})`}>{S.bg}</g>
        {S.fg && <g transform={`translate(${W / 2 - dx * 1.8} ${H / 2 - dy * 1.8}) scale(${zf * kick * 1.04}) translate(${-W / 2} ${-H / 2})`}>{S.fg}</g>}</g>
      {S.imp}{S.kw}
      <Grade c="#FFB4C8" o={0.08} /><Vignette o={0.42} /><Grain o={0.05} seed={i} />
      {pl.v !== 'tit' && <><defs><linearGradient id="sb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.6" /></linearGradient></defs><rect y="860" width={W} height="220" fill="url(#sb)" /></>}
      {S.ui}
    </svg>
    <Chip c={(sc.p || {}).chip} />
    {pl.v !== 'tit' && <Subs sc={sc} t={t} pl={pl} />}
  </AbsoluteFill>;
};
const Thumb = () => <AbsoluteFill style={{ background: '#120A26' }}><svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
  {SETS.balcon(1.2).bg}<rect width={W} height={H} fill="#1A0A3A" opacity="0.35" />
  <Glow x={560} y={420} r={560} c="#38E8FF" o={0.35} /><Glow x={1450} y={520} r={500} c="#FF3FA4" o={0.38} />
  <g opacity="0.9">{Array.from({ length: 16 }).map((_, k) => <COIN key={k} x={80 + rnd(k + 3) * 1760} y={60 + rnd(k + 8) * 560} r={22 + rnd(k) * 22} rot={k * 37} sq={0.4 + rnd(k + 1) * 0.6} />)}</g>
  <Char k="S" exp="sonrojado" x={1460} y={600} s={1.25} t={0.4} />
  <Char k="X" exp="sorprendido" x={520} y={620} s={1.6} t={0.2} />
  <Rayo x1={600} y1={380} x2={1400} y2={420} t={1.2} />
  <COIN x={980} y={560} r={90} rot={-14} />
  <text x="1460" y="200" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="64" fill="#fff" stroke={OUT} strokeWidth="12" paintOrder="stroke">"te quiero…"</text>
  <text x="70" y="1010" fontFamily={FONT} fontWeight="900" fontSize="118" fill="#fff" stroke={OUT} strokeWidth="20" paintOrder="stroke">¿<tspan fill="#FFD23F">como amigo</tspan>?..</text>
  <Vignette o={0.4} /></svg></AbsoluteFill>;
const Arrow = ({ d, c = '#fff' }) => <path d={d} fill="none" stroke={c} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 0 #000)' }} />;
const Lbl = ({ x, y, txt, c, sz = 120, rot = 0 }) => <text x={x} y={y} textAnchor="middle" transform={`rotate(${rot} ${x} ${y})`} fontFamily={FONT} fontWeight="900" fontSize={sz} fill={c} stroke={OUT} strokeWidth="22" paintOrder="stroke">{txt}</text>;
const Thumb2 = () => <AbsoluteFill style={{ background: '#120A26' }}><svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
  {SETS.balcon(1.2).bg}<rect width={W} height={H} fill="#2A0A4A" opacity="0.45" />
  <Glow x={620} y={520} r={620} c="#38E8FF" o={0.45} /><Glow x={1340} y={520} r={620} c="#FF3FA4" o={0.55} />
  <g opacity="0.95">{Array.from({ length: 8 }).map((_, k) => <COIN key={k} x={60 + rnd(k + 3) * 1800} y={300 + rnd(k + 8) * 500} r={26 + rnd(k) * 26} rot={k * 37} sq={0.4 + rnd(k + 1) * 0.6} />)}</g>
  <Char k="S" exp="sonrojado" x={1390} y={720} s={2.35} t={0.4} />
  <Char k="X" exp="sorprendido" x={540} y={740} s={2.5} t={0.2} />
  <Glow x={965} y={560} r={220} c="#FFD23F" o={0.6} />
  <COIN x={965} y={560} r={100} rot={-14} />
  <Lbl x={965} y={745} txt="+$1" c="#7CFF6B" sz={110} rot={-6} />
  <Lbl x={250} y={190} txt="TÚ" c="#fff" sz={150} rot={-6} />
  <Arrow d="M300 230 Q 380 300 400 360 M400 360 l -50 -10 M400 360 l 5 -50" />
  <Lbl x={1580} y={170} txt="TU CRUSH" c="#FF3FA4" sz={130} rot={4} />
  <Arrow d="M1640 210 Q 1600 290 1530 340 M1530 340 l 50 -2 M1530 340 l 12 -48" />
  <Vignette o={0.35} /></svg></AbsoluteFill>;
const Bang = ({ x, y, s = 1, c = '#FF3B3B' }) => <g transform={`translate(${x} ${y}) scale(${s}) rotate(-12)`}>{[0, 70].map((dx, k) => <g key={k} transform={`translate(${dx} ${k * -14})`}><path d="M-18 -110 L18 -110 L10 10 L-10 10Z" fill={c} stroke={OUT} strokeWidth="9" strokeLinejoin="round" /><circle cx="0" cy="44" r="17" fill={c} stroke={OUT} strokeWidth="9" /></g>)}
  {[-60, -30, 200, 230].map((a, k) => <path key={k} d={`M${Math.cos(a * Math.PI / 180) * 150 + 35} ${Math.sin(a * Math.PI / 180) * 150 - 40} l${Math.cos(a * Math.PI / 180) * 50} ${Math.sin(a * Math.PI / 180) * 50}`} stroke="#fff" strokeWidth="10" strokeLinecap="round" />)}</g>;
const MiniChat = ({ x, y, s }) => <g transform={`translate(${x} ${y}) scale(${s}) rotate(4)`}><Glow x={0} y={0} r={520} c="#B79CFF" o={0.55} />
  <rect x="-260" y="-470" width="520" height="940" rx="60" fill="#14121C" stroke={OUT} strokeWidth="14" /><rect x="-232" y="-430" width="464" height="860" rx="40" fill="#F4F2FA" />
  <rect x="-232" y="-430" width="464" height="120" fill="#B79CFF" /><circle cx="-165" cy="-370" r="36" fill="#FFE2D0" stroke={OUT} strokeWidth="4" /><text x="-112" y="-356" fontFamily={FONT} fontWeight="900" fontSize="42" fill="#fff">Sofía ⭐</text>
  <rect x="-215" y="-200" width="430" height="210" rx="36" fill="#fff" stroke="#D8D2EA" strokeWidth="5" />
  <text x="-190" y="-122" fontFamily={FONT} fontWeight="900" fontSize="50" fill="#2A2238">te quiero…</text><text x="-190" y="-52" fontFamily={FONT} fontWeight="900" fontSize="50" fill="#7E62D6">como amigo 💛</text>
  <text x="200" y="60" textAnchor="end" fontFamily={FONT} fontWeight="700" fontSize="32" fill="#9A94A8">Visto 9:47 p. m.</text></g>;
const Thumb3 = () => <AbsoluteFill style={{ background: '#120A26' }}><svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
  <defs><filter id="tb3"><feGaussianBlur stdDeviation="6" /></filter></defs>
  {SETS.balcon(1.2).bg}<rect width={W} height={H} fill="#2A0A4A" opacity="0.4" />
  <Glow x={430} y={560} r={620} c="#38E8FF" o={0.5} /><Glow x={1500} y={560} r={620} c="#FF3FA4" o={0.6} />
  <g filter="url(#tb3)" opacity="0.9"><Char k="C" exp="enojado" x={1830} y={560} s={1.25} t={0.7} flip /></g>
  <g transform="rotate(-9 1480 700)"><Char k="S" exp="riendo" x={1480} y={760} s={2.3} t={0.4} /></g>
  <Char k="X" exp="sorprendido" x={430} y={780} s={2.45} t={0.2} />
  <Bang x={720} y={250} s={0.9} />
  <MiniChat x={985} y={560} s={0.56} />
  <Glow x={880} y={800} r={200} c="#FFD23F" o={0.7} />
  <path d="M880 560 v120 M840 590 v80 M920 600 v70" stroke="#fff" strokeWidth="8" strokeLinecap="round" opacity="0.7" />
  <COIN x={880} y={800} r={92} rot={-18} />
  <Lbl x={1080} y={960} txt="+$1" c="#7CFF6B" sz={120} rot={-6} />
  {[[1250, 300, 1.1], [1700, 380, 0.8], [1180, 470, 0.6]].map(([hx, hy, hs], k) => <path key={k} d={HEART} transform={`translate(${hx} ${hy}) scale(${hs})`} fill="#FF4F7B" stroke={OUT} strokeWidth="4" />)}
  <Lbl x={210} y={175} txt="TÚ" c="#fff" sz={150} rot={-6} />
  <Arrow d="M250 215 Q 300 280 330 330 M330 330 l -48 -14 M330 330 l 2 -50" />
  <Lbl x={1600} y={160} txt="TU CRUSH" c="#FF3FA4" sz={124} rot={4} />
  <Arrow d="M1560 200 Q 1530 260 1490 300 M1490 300 l 48 -6 M1490 300 l 8 -48" />
  <Vignette o={0.35} /></svg></AbsoluteFill>;
const Sheet = ({ at }) => { const f = useCurrentFrame(); return <Scene i={f % D.length} at={at} />; };
registerRoot(() => <>
  {D.map((sc, i) => <Composition key={i} id={`V33-${String(i).padStart(2, '0')}`} component={Scene} defaultProps={{ i }} durationInFrames={sc.frames} fps={30} width={W} height={H} />)}
  <Composition id="THUMB3" component={Thumb3} durationInFrames={1} fps={30} width={W} height={H} />
  <Composition id="THUMB2" component={Thumb2} durationInFrames={1} fps={30} width={W} height={H} />
  <Composition id="THUMB" component={Thumb} durationInFrames={1} fps={30} width={W} height={H} />
  <Composition id="SHEET" component={Sheet} defaultProps={{ at: 0.5 }} durationInFrames={D.length} fps={30} width={W} height={H} />
</>);
