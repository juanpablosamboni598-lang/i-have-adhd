// v30 · ¿Qué pasaría si te encontraras con tu crush en el peor momento? — motor de v29 + medidor de vergüenza y efectos nuevos.
// Intérprete de planos: 'lugar;tok;…' (ver v28/guion.py). Cada plano: fondo con capas animadas, personajes con respiración,
// corazón con porcentaje que cuenta, paneo/zoom con ease-out, FG desenfocado y blur de entrada en ~20 %.
import React from 'react';
import { registerRoot, Composition, useCurrentFrame, AbsoluteFill } from 'remotion';
import D from './data30.json';
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
const Chat = ({ t, f }) => { const incoming = /explicas|mensaje/.test(f); const words = /párrafo/.test(f) ? 'Sofía, desde hace meses quería decirte que…' : /despierta/.test(f) ? '¿estás despierta?' : 'hola';
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
const Chip = ({ c }) => !c ? null : <div style={{ position: 'absolute', right: 40, top: 30, padding: '12px 22px', borderRadius: 18, background: 'rgba(18,14,31,0.9)', border: '3px solid #FF6F8F', fontFamily: FONT, color: '#fff', display: 'flex', alignItems: 'center', gap: 14 }}>
  <div style={{ fontWeight: 900, fontSize: 20, letterSpacing: 2.4, lineHeight: 1.1, color: '#FF9AB0' }}>{c[0]}<br />METRO</div><div style={{ fontWeight: 900, fontSize: 46, color: parseInt(c[1]) >= 60 ? '#FF5E6E' : '#7CE0A0' }}>{c[1]}</div></div>;

// ---------- intérprete de planos ----------
const parse = (v) => { const [lugar, ...tok] = v.split(';'); const o = { lugar, chars: [], nums: {}, cu: false, ui: null, fx: null };
  tok.forEach((s) => { if (s === 'cu') o.cu = true; else if (s.startsWith('n:')) { const [k, val] = s.slice(2).split('='); o.nums[k] = val; } else if (s.startsWith('ui:')) o.ui = s.slice(3); else if (s.startsWith('fx:')) o.fx = s.slice(3);
    else { const m = s.match(/^([A-Z]+)=(\w+)@([\d.]+)(?:!(\w+))?(~inv)?$/); if (m) o.chars.push({ k: m[1], exp: m[2], x: Number(m[3]), pose: m[4] || 'normal', inv: !!m[5] }); } }); return o; };

const shotOf = (pl, lt, ld, si) => {
  if (pl.v === 'tit') return { bg: <><Bok a="#FF8AB8" b="#4A1E6A" t={lt} /><Char k="X" exp="sonrojado" x={330} y={700} s={0.95} t={lt} /><Char k="S" exp="sorprendido" pose="manos" x={1600} y={700} s={0.95} t={lt} ph={1} /><g transform="translate(560 640) scale(1.1)"><Tostada x={0} y={0} t={lt} /></g></>, cam: [0, 0, 3],
    ui: <g transform={`translate(960 430) scale(${pop(lt, 0.1)})`}><text textAnchor="middle" y="-60" fontFamily={FONT} fontWeight="900" fontSize="80" fill="#fff" stroke={OUT} strokeWidth="16" paintOrder="stroke">¿QUÉ PASARÍA SI TE ENCONTRARAS</text>
      <text textAnchor="middle" y="50" fontFamily={FONT} fontWeight="900" fontSize="86" fill="#FFD23F" stroke={OUT} strokeWidth="18" paintOrder="stroke">CON TU CRUSH EN EL PEOR</text><text textAnchor="middle" y="150" fontFamily={FONT} fontWeight="900" fontSize="86" fill="#FFD23F" stroke={OUT} strokeWidth="18" paintOrder="stroke">MOMENTO?</text></g> };
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
  if (o.fx === 'calcetines') fxNode = <Calcetines t={lt} />;
  if (o.fx === 'choque') fxNode = <Choque t={lt} />;
  if (o.fx === 'chocolate') fxNode = <Chocolate t={lt} />;
  if (o.fx === 'carta') fxNode = <Carta t={lt} />;
  if (o.fx === 'lluvia') fxNode = <Lluvia t={lt} />;
  if (o.fx === 'tostada') { const it = items.find((q) => q.c.k === 'X'); fxNode = it ? <Tostada x={it.x + 120 * s} y={it.y + 300 * s} t={lt} /> : <g transform="translate(960 520) scale(2.4)"><Tostada x={0} y={0} t={lt} /></g>; }
  const brillo = o.fx === 'brillo' ? <g>{Array.from({ length: 14 }).map((_, k) => <Sparkle key={k} x={rnd(k) * W} y={120 + rnd(k + 5) * 700} r={18 + (k % 3) * 10} t={lt} k={k} />)}</g> : null;
  const h = hash(pl.v + pl.j); const dir = h % 2 ? 1 : -1;
  const cam = cu ? [dir * (8 + h % 10), -4, 4.5] : o.chars.length ? [dir * (22 + h % 16), (h % 3 - 1) * 8, (h % 5 === 0 ? -3.2 : 3.4)] : [dir * 14, -6, 3.2];
  return { bg: <>{set.bg}{items.map((q) => q.node)}{hearts}{fxNode}{brillo}</>, fg: !cu && set.fg && h % 3 !== 0 ? set.fg : null, cam, blur: h % 5 === 1,
    ui: o.ui && o.ui !== 'corazon' ? <Pildora x={960} y={110} txt={o.ui} t={lt} at={0.15} c={o.ui.startsWith('PRUEBA') ? '#FFD23F' : '#FF9AC0'} borde={o.ui.startsWith('PRUEBA') ? '#FFD23F' : '#FF9AC0'} /> : null };
};

// ---------- tiempos ----------
const planesOf = (sc) => {
  const P = sc.planos || []; const words = sc.words || []; const d = sc.frames / 30;
  const tot = P.reduce((s, p) => s + p.f.split(/\s+/).length, 0) || 1; let acc = 0;
  const starts = P.map((p, i) => { const idx = Math.min(words.length - 1, Math.round(acc * words.length / tot)); acc += p.f.split(/\s+/).length; return i === 0 ? 0 : Math.max(0, (words[idx] ? words[idx][1] : 0) - 0.15); });
  const out = [];
  P.forEach((p, i) => { const a = starts[i], b = i + 1 < P.length ? starts[i + 1] : d, dur = b - a; const n = p.v === 'tit' ? 1 : Math.max(1, Math.ceil(dur / 3.4));
    for (let j = 0; j < n; j++) out.push({ v: p.v, f: p.f, i, j, a: a + dur * j / n, b: a + dur * (j + 1) / n }); });
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
  const blur = S.blur ? Math.max(0, 18 * (1 - lt / 0.27)) : 0;
  return <AbsoluteFill style={{ background: '#140E1A', overflow: 'hidden' }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute' }}>
      <defs><filter id="bin"><feGaussianBlur stdDeviation={blur} /></filter></defs>
      <g filter={blur > 0.3 ? 'url(#bin)' : undefined}>
        <g transform={`translate(${W / 2 - dx} ${H / 2 - dy}) scale(${zf}) translate(${-W / 2} ${-H / 2})`}>{S.bg}</g>
        {S.fg && <g transform={`translate(${W / 2 - dx * 1.8} ${H / 2 - dy * 1.8}) scale(${zf * 1.04}) translate(${-W / 2} ${-H / 2})`}>{S.fg}</g>}</g>
      <Grade c="#FFB4C8" o={0.08} /><Vignette o={0.42} /><Grain o={0.05} seed={i} />
      {pl.v !== 'tit' && <><defs><linearGradient id="sb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.6" /></linearGradient></defs><rect y="860" width={W} height="220" fill="url(#sb)" /></>}
      {S.ui}
    </svg>
    <Chip c={(sc.p || {}).chip} />
    {pl.v !== 'tit' && <Subs sc={sc} t={t} pl={pl} />}
  </AbsoluteFill>;
};
const Thumb = () => <AbsoluteFill style={{ background: '#16121F' }}><svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
  <defs><linearGradient id="atar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FF9A7A" /><stop offset="0.55" stopColor="#FFC2A0" /><stop offset="1" stopColor="#FF8AB8" /></linearGradient></defs>
  <rect width={W} height={H} fill="url(#atar)" /><circle cx="960" cy="640" r="260" fill="#FFE9B0" opacity="0.8" /><Glow x={960} y={600} r={700} c="#FFE2B0" o={0.7} />
  <BlurG s={6}>{[[0, 300, '#E88A7A'], [330, 240, '#F0A08A'], [1500, 280, '#E88A9A'], [1720, 220, '#F0A8A0']].map(([x, h, c], k) => <rect key={k} x={x} y={1080 - h - 260} width="320" height={h + 260} fill={c} opacity="0.75" />)}</BlurG>
  <BlurG s={14}>{Array.from({ length: 18 }).map((_, k) => <circle key={k} cx={(k * 331) % W} cy={(k * 197) % 900} r={24 + (k % 4) * 18} fill={k % 2 ? '#FFF0F6' : '#FFE2A0'} opacity={0.35} />)}</BlurG>
  {Array.from({ length: 22 }).map((_, k) => <ellipse key={k} cx={(k * 257 + 90) % W} cy={(k * 149 + 60) % 1000} rx="14" ry="8" fill="#FFB8D0" stroke="#E88AA8" strokeWidth="2" transform={`rotate(${k * 37} ${(k * 257 + 90) % W} ${(k * 149 + 60) % 1000})`} />)}
  <Char k="X" exp="sonrojado" x={600} y={600} s={1.55} t={0.2} />
  <Char k="S" exp="sonrojado" pose="manos" x={1320} y={600} s={1.55} t={0.5} />
  <g transform="translate(960 870) rotate(-3)"><rect x="-230" y="-120" width="460" height="230" rx="12" fill="#FFFDF6" stroke={OUT} strokeWidth="7" /><rect x="-6" y="-120" width="12" height="230" fill="#E8E0D0" />
    <g transform="translate(-110 -10) scale(0.4)" style={{ filter: 'grayscale(1) contrast(1.3)' }}><Raw html={CH.X.h.sonrojado} /></g><path d="M110 20 C80 -10 100 -40 120 -22 C140 -40 160 -10 130 20 L120 30Z" fill="#FF4F7B" />
    <ellipse cx="-250" cy="0" rx="34" ry="30" fill="url(#skA_X)" stroke={OUT} strokeWidth="6" /><ellipse cx="250" cy="0" rx="32" ry="28" fill="url(#skA_S)" stroke={OUT} strokeWidth="6" /></g>
  <g transform="translate(960 330)"><Glow x={0} y={0} r={240} c="#FF7AB0" o={0.6} /><path d="M0 36 C-60 -10 -48 -70 0 -44 C48 -70 60 -10 0 36Z" transform="scale(2.6)" fill="#FF4F7B" stroke={OUT} strokeWidth="2.5" /><path d="M-50 -110 q-30 14 -30 50" stroke="#fff" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.7" /></g>
  {[[820, 200, 0.5], [1110, 180, 0.6], [760, 420, 0.4], [1180, 440, 0.45]].map(([x, y, sc], k) => <path key={k} transform={`translate(${x} ${y}) scale(${sc})`} d="M0 36 C-60 -10 -48 -70 0 -44 C48 -70 60 -10 0 36Z" fill="#FF8AB0" stroke={OUT} strokeWidth="5" />)}
  {[[700, 140, 20], [1250, 150, 16], [880, 520, 12], [1060, 540, 14], [520, 300, 14], [1420, 300, 18]].map(([x, y, r], k) => <path key={k} transform={`translate(${x} ${y})`} d={`M0 ${-r} Q0 0 ${r} 0 Q0 0 0 ${r} Q0 0 ${-r} 0 Q0 0 0 ${-r}Z`} fill="#FFFFFF" />)}
  <g transform="translate(1600 900) rotate(18) scale(0.9)"><Tostada x={0} y={0} t={0.3} /></g>
  <text x="960" y="1050" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="118" fill="#FFD23F" stroke={OUT} strokeWidth="20" paintOrder="stroke" style={{ filter: 'drop-shadow(0 0 16px rgba(255,120,180,0.8))' }}>¿HOLA… TOSTADA?</text>
  <Vignette o={0.35} /></svg></AbsoluteFill>;
const Sheet = ({ at }) => { const f = useCurrentFrame(); return <Scene i={f % D.length} at={at} />; };
registerRoot(() => <>
  {D.map((sc, i) => <Composition key={i} id={`V30-${String(i).padStart(2, '0')}`} component={Scene} defaultProps={{ i }} durationInFrames={sc.frames} fps={30} width={W} height={H} />)}
  <Composition id="THUMB" component={Thumb} durationInFrames={1} fps={30} width={W} height={H} />
  <Composition id="SHEET" component={Sheet} defaultProps={{ at: 0.5 }} durationInFrames={D.length} fps={30} width={W} height={H} />
</>);
