// v27 · rehecho de v26 (misma narración) siguiendo ANALISIS_HYPO_ROOM_V3.md:
// ≥6 capas por plano, ≥1 evento animado por plano, paneo diagonal ~70 % de planos (25–45 px/s), zoom 3–5 %/s ease-out con empujes,
// FG desenfocado ~35 %, blur de entrada ~20 %, píldora por dato, HUD grande, flashback sepia con parpadeo, paleta por escena.
import React from 'react';
import { registerRoot, Composition, useCurrentFrame, AbsoluteFill } from 'remotion';
import D from './data26.json';
import { Person, OUT } from './xeno.jsx';
import { Grain, Grade, Vignette, BlurG, LightCone, Planta, Reloj } from './kit2d.jsx';
import { W, H, FONT, cl, eo, pop, HIST, Glow, Polvo, Casa, Suelo, Charco, Mosca, Gente, Inodoro, Bacteria, Bacinilla, Rollo } from './piezas27.jsx';

const lerp = (a, b, u) => a + (b - a) * cl(u);
const ein = (u) => cl(u) * cl(u);
const rnd = (k) => { const x = Math.sin(k * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const Xeno = (p) => <Person {...p} />;

// ---------- piezas nuevas ----------
const Grad = ({ id, a, b, x2 = 0, y2 = 1 }) => <defs><linearGradient id={id} x1="0" y1="0" x2={x2} y2={y2}><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient></defs>;
const Fondo = ({ a, b, id = 'fd' }) => <><Grad id={id} a={a} b={b} /><rect width={W} height={H} fill={`url(#${id})`} /></>;
const Bok = ({ a = '#C98B52', b = '#6B3E2A', t = 0, n = 22, light = '#FFF1D6' }) => <><defs><radialGradient id="bk7" cx="50%" cy="45%" r="75%"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></radialGradient></defs>
  <rect width={W} height={H} fill="url(#bk7)" /><BlurG s={12}>{Array.from({ length: n }).map((_, k) => <circle key={k} cx={(k * 389 + Math.sin(t * 0.4 + k) * 40) % W} cy={(k * 211) % H} r={34 + (k % 5) * 20} fill={k % 3 ? light : a} opacity={0.1 + (k % 4) * 0.06} />)}</BlurG></>;
const Pildora = ({ x, y, txt, c = '#FACA4F', borde = '#E3C584', size = 30, t = 9, at = 0 }) => { const s = pop(t, at); if (s <= 0) return null; const w = txt.length * size * 0.64 + 56;
  return <g transform={`translate(${x} ${y}) scale(${s})`}><rect x={-w / 2} y={-size} width={w} height={size * 1.75} rx={size * 0.87} fill="#0E111F" opacity="0.9" stroke={borde} strokeWidth="3" />
    <text x="0" y={size * 0.28} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={size} fill={c} letterSpacing="2.5">{txt}</text></g>; };
const Fuente = ({ txt }) => <text x={W / 2} y={1066} textAnchor="middle" fontFamily={FONT} fontWeight="600" fontSize="17" fill="#fff" opacity="0.55">{txt}</text>;
const Olor = ({ x, y, t, n = 3, c = '#9BD46A', s = 1 }) => <g opacity="0.75">{Array.from({ length: n }).map((_, k) => { const u = ((t * 0.6 + k / n) % 1);
  return <path key={k} d={`M${x + (k - 1) * 40 * s} ${y - u * 160 * s} q${18 * s} ${-25 * s} 0 ${-50 * s} t0 ${-50 * s}`} stroke={c} strokeWidth={9 * s} fill="none" strokeLinecap="round" opacity={Math.sin(u * Math.PI)} />; })}</g>;
const Signo = ({ x, y, t, at = 0, s = 1, c = '#FACA4F' }) => { const k = pop(t, at); return k > 0 ? <text x={x} y={y + Math.sin(t * 3) * 6} transform={`rotate(${Math.sin(t * 2) * 8} ${x} ${y})`} fontFamily={FONT} fontWeight="900" fontSize={90 * s * k} fill={c} stroke={OUT} strokeWidth="6" paintOrder="stroke" textAnchor="middle">?</text> : null; };
const Sudor = ({ x, y, t }) => { const u = (t * 0.9) % 1; return <path d={`M${x} ${y + u * 40} q10 16 0 26 q-10 -10 0 -26Z`} fill="#8FD3F5" opacity={1 - u} />; };
const Ondas = ({ x, y, t, c = '#FFF', r = 30 }) => <g fill="none" stroke={c} strokeWidth="5" strokeLinecap="round">{[0, 1, 2].map((k) => { const u = (t * 2 + k / 3) % 1;
  return <g key={k} opacity={1 - u}><path d={`M${x - r - u * 40} ${y - 20} q-14 20 0 40`} /><path d={`M${x + r + u * 40} ${y - 20} q14 20 0 40`} /></g>; })}</g>;
const Ventanal = ({ x, y, w, h, t, cielo = ['#FFB38A', '#FFD9A8'], noche = false }) => <g>
  <defs><clipPath id={`vc${x}`}><rect x={x} y={y} width={w} height={h} /></clipPath></defs>
  <g clipPath={`url(#vc${x})`}><Grad id={`vg${x}`} a={cielo[0]} b={cielo[1]} /><rect x={x} y={y} width={w} height={h} fill={`url(#vg${x})`} />
    {!noche && <circle cx={x + w * 0.72} cy={y + h * 0.62} r={46} fill="#FFF3C9" opacity="0.9" />}
    {[0, 1, 2, 3, 4, 5, 6].map((k) => <rect key={k} x={x + k * w / 6.5 - 10} y={y + h * (0.45 + rnd(k) * 0.25)} width={w / 7} height={h} fill={noche ? '#1E2340' : '#9A6A7A'} opacity="0.9" />)}
    {[0, 1, 2, 3, 4, 5, 6].map((k) => <rect key={k} x={x + k * w / 6.5 + 8} y={y + h * (0.55 + rnd(k) * 0.2)} width="10" height="12" fill="#FFE3A3" opacity="0.8" />)}
    <ellipse cx={x + ((t * 18) % (w + 200)) - 100} cy={y + h * 0.2} rx="70" ry="18" fill="#fff" opacity="0.6" /></g>
  <rect x={x - 14} y={y - 14} width={w + 28} height={h + 28} fill="none" stroke="#F3EDE4" strokeWidth="20" /><rect x={x + w / 2 - 6} y={y} width="12" height={h} fill="#F3EDE4" /><rect x={x} y={y + h / 2 - 6} width={w} height="12" fill="#F3EDE4" />
  <rect x={x - 30} y={y + h + 14} width={w + 60} height="20" rx="6" fill="#E5DACB" /></g>;
const Cortina = ({ x, y, h, c = '#3FA9A0', flip = false }) => <path d={flip ? `M${x} ${y} L${x - 110} ${y} Q${x - 70} ${y + h * 0.5} ${x - 120} ${y + h} L${x} ${y + h}Z` : `M${x} ${y} L${x + 110} ${y} Q${x + 70} ${y + h * 0.5} ${x + 120} ${y + h} L${x} ${y + h}Z`} fill={c} />;
const Libros = ({ x, y, n = 9 }) => <g>{Array.from({ length: n }).map((_, k) => <rect key={k} x={x + k * 26} y={y - 70 - (k % 3) * 10} width="22" height={70 + (k % 3) * 10} fill={['#E86A5C', '#F2B134', '#4C9AD6', '#7CC07A', '#B07AD6', '#F08A4B'][k % 6]} />)}<rect x={x - 20} y={y} width={n * 26 + 40} height="14" fill="#7A4E36" /></g>;
const Farol = ({ x, y, h = 380, on = true }) => <g><rect x={x - 8} y={y - h} width="16" height={h} fill="#2A2420" /><path d={`M${x - 30} ${y - h} L${x + 30} ${y - h} L${x + 20} ${y - h - 60} L${x - 20} ${y - h - 60}Z`} fill={on ? '#FFD58A' : '#7A6A50'} stroke="#2A2420" strokeWidth="6" />{on && <Glow x={x} y={y - h - 30} r={120} o={0.5} />}</g>;
const Tendedero = ({ x1, x2, y, t }) => <g><path d={`M${x1} ${y} Q${(x1 + x2) / 2} ${y + 40} ${x2} ${y}`} stroke="#3A2A22" strokeWidth="3" fill="none" />
  {[0.15, 0.3, 0.48, 0.65, 0.82].map((u, k) => { const x = x1 + (x2 - x1) * u, yy = y + 40 * 4 * u * (1 - u); return <rect key={k} x={x - 22} y={yy} width="44" height={50 + (k % 2) * 16} fill={['#F3F1E6', '#C9604C', '#6E8FB8', '#E8C77A', '#9CB87A'][k]} transform={`rotate(${Math.sin(t * 2 + k) * 6} ${x} ${yy})`} />; })}</g>;
const Edificio = ({ x, w, h, c, y = 860, balcon = true, techo = '#5E3A2A', t = 0, k = 0 }) => <g>
  <rect x={x} y={y - h} width={w} height={h} fill={c} /><rect x={x - 10} y={y - h - 18} width={w + 20} height="22" fill={techo} />
  {Array.from({ length: Math.floor((h - 80) / 110) }).map((_, r) => Array.from({ length: Math.max(1, Math.floor(w / 95)) }).map((_, q) => { const wx = x + 26 + q * 95, wy = y - h + 40 + r * 110, lit = rnd(k * 31 + r * 7 + q) > 0.55;
    return <g key={`${r}${q}`}><rect x={wx} y={wy} width="48" height="70" fill={lit ? '#FFD58A' : '#3A2A22'} /><rect x={wx - 6} y={wy - 8} width="60" height="10" fill={techo} opacity="0.8" />
      {balcon && r % 2 === 1 && <path d={`M${wx - 10} ${wy + 70} h68 v18 h-68z M${wx - 6} ${wy + 70} v18 M${wx + 10} ${wy + 70} v18 M${wx + 26} ${wy + 70} v18 M${wx + 42} ${wy + 70} v18`} fill="none" stroke="#2A2420" strokeWidth="3" />}
      {rnd(k * 17 + r + q) > 0.8 && <rect x={wx + 4} y={wy + 50} width="40" height="16" fill="#6FA36A" />}</g>; }))}
  <rect x={x + w / 2 - 34} y={y - 120} width="68" height="120" fill="#4A3226" /></g>;
const Carreta = ({ x, y, t }) => <g transform={`translate(${x} ${y})`}><rect x="-120" y="-90" width="240" height="70" fill="#8A5A3B" /><rect x="-110" y="-120" width="220" height="34" fill="#6E8A4A" />
  {[-70, 70].map((cx) => <g key={cx} transform={`rotate(${t * 120} ${cx} -10)`}><circle cx={cx} cy="-10" r="40" fill="none" stroke="#3A2A22" strokeWidth="10" /><path d={`M${cx - 40} -10 h80 M${cx} -50 v80`} stroke="#3A2A22" strokeWidth="6" /></g>)}</g>;
const Caminante = ({ x0, y, t, v = 60, s = 0.42, k = 0, pañuelo = true, flip = false }) => { const x = x0 + (flip ? -1 : 1) * v * t; const pal = HIST[k % HIST.length];
  return <g transform={`translate(0 ${Math.abs(Math.sin(t * 6 + k)) * -6})`}><Person x={x} y={y} s={s} t={t + k} pin={false} flip={flip} exp={pañuelo ? 'preocupado' : 'neutral'} bob={false} {...pal} />
    {pañuelo && <rect x={x - 26 * s * 2} y={y - 470 * s} width={52 * s * 2} height={34 * s} rx="6" fill="#F3F1E6" />}</g>; };
const Sello = ({ x, y, txt, t, at, c = '#D8473B', rot = -12 }) => { const u = cl((t - at) / 0.22); if (u <= 0) return null; const s = 2.2 - 1.2 * u;
  return <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={u}><rect x={-txt.length * 26 - 30} y="-50" width={txt.length * 52 + 60} height="100" rx="12" fill="none" stroke={c} strokeWidth="10" />
    <text x="0" y="24" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="74" fill={c} letterSpacing="6">{txt}</text></g>; };
const Rayas = ({ t }) => <g opacity="0.35">{[0, 1, 2].map((k) => { const x = (rnd(Math.floor(t * 8) + k * 13) * W); return <rect key={k} x={x} y="0" width="2" height={H} fill="#fff" />; })}
  {Array.from({ length: 14 }).map((_, k) => <circle key={k} cx={rnd(Math.floor(t * 12) * 3 + k) * W} cy={rnd(Math.floor(t * 12) * 5 + k + 99) * H} r={1.5 + rnd(k) * 2.5} fill="#fff" />)}</g>;

// ---------- planos del primer minuto (escena-frase → variantes de subplano) ----------
// Cada función devuelve { bg, fg, ui, cam:[panX px/s, panY px/s, zoom %/s], blur, sepia }
const Dormitorio = (t, wake) => <>
  <Fondo a="#6C5A8E" b="#4D3B6E" id="dw" />{Array.from({ length: 24 }).map((_, k) => <rect key={k} x={k * 84} y="0" width="34" height="820" fill="#5E4C80" opacity="0.5" />)}
  <Ventanal x={980} y={150} w={520} h={360} t={t} /><Cortina x={930} y={120} h={470} /><Cortina x={1550} y={120} h={470} flip />
  <rect x="120" y="230" width="380" height="16" fill="#7A4E36" /><Libros x={140} y={230} n={8} /><circle cx="440" cy="196" r="32" fill="#4C9AD6" /><path d="M418 190 q22 -18 44 0 q-20 20 -44 0" fill="#7CC07A" />
  <Planta x={1700} y={800} s={1.3} t={t} /><g transform="translate(700 150)"><rect width="150" height="200" fill="#F2B134" /><circle cx="75" cy="90" r="45" fill="#E86A5C" /><rect x="20" y="160" width="110" height="14" fill="#fff" opacity="0.7" /></g>
  <rect y="820" width={W} height="260" fill="#8A5A3B" />{Array.from({ length: 12 }).map((_, k) => <rect key={k} x={k * 170} y="820" width="4" height="260" fill="#6E4630" />)}
  <ellipse cx="1150" cy="960" rx="420" ry="70" fill="#E86A5C" opacity="0.9" /><ellipse cx="1150" cy="960" rx="320" ry="50" fill="#F2B134" /><ellipse cx="1150" cy="960" rx="220" ry="32" fill="#4C9AD6" />
  <rect x="140" y="560" width="40" height="300" fill="#6E4630" /><rect x="140" y="560" width="700" height="70" rx="20" fill="#7A4E36" />
  <rect x="160" y="700" width="680" height="140" rx="16" fill="#E8E2D0" />
  {Array.from({ length: 16 }).map((_, k) => <rect key={k} x={170 + (k % 8) * 82} y={640 + Math.floor(k / 8) * 70} width="80" height="68" fill={['#E86A5C', '#4C9AD6', '#F2B134', '#7CC07A', '#B07AD6'][(k * 3) % 5]} opacity="0.95" />)}
  <rect x="180" y="610" width="200" height="60" rx="26" fill="#F7F4EC" />
  <g><Xeno x={560 + eo((t - 0.5) / 0.9) * 260} y={lerp(700, 860, eo((t - 0.4) / 0.9))} s={0.62} exp={t < 0.6 ? 'cerrado' : 'sorprendido'} t={t} pose={t > 1 ? 'normal' : 'brazos'} /></g>
  <rect x="880" y="700" width="160" height="140" fill="#6E4630" /><g transform={`translate(${960 + Math.sin(t * 60) * 3} 660)`}><circle r="44" fill="#E86A5C" /><circle r="34" fill="#FFF7EA" /><path d="M0 0 V-22 M0 0 H16" stroke={OUT} strokeWidth="5" /><circle cx="-34" cy="-38" r="12" fill="#F2B134" /><circle cx="34" cy="-38" r="12" fill="#F2B134" /></g>
  <Ondas x={960} y={655} t={t} c="#FFE3A3" r={52} /><LightCone x={1240} y={150} w={520} h={760} o={0.18} /><Polvo t={t} n={30} /></>;
const Bano = (t) => <>
  <Fondo a="#CFE3E8" b="#B5CDD4" id="bw" />{Array.from({ length: 22 }).map((_, k) => <rect key={k} x={k * 90} y="0" width="2" height="760" fill="#9FBAC2" />)}{Array.from({ length: 9 }).map((_, k) => <rect key={k} x="0" y={k * 90} width={W} height="2" fill="#9FBAC2" />)}
  <rect y="760" width={W} height="320" fill="#E9E4DA" />{Array.from({ length: 10 }).map((_, k) => <rect key={k} x={k * 200} y="760" width="4" height="320" fill="#CFC8BB" />)}
  <g><rect x="200" y="200" width="300" height="380" rx="20" fill="#DDEDF2" stroke="#9FB0B8" strokeWidth="10" /><path d="M230 240 L300 320" stroke="#fff" strokeWidth="14" opacity="0.6" /><rect x="180" y="600" width="340" height="40" rx="16" fill="#fff" /><path d="M210 640 q140 120 280 0" fill="#F4F6F7" /><rect x="330" y="560" width="40" height="40" fill="#B9C3C8" /></g>
  <rect x="1450" y="120" width="360" height="640" fill="#6FA3D6" opacity="0.85" />{Array.from({ length: 8 }).map((_, k) => <path key={k} d={`M${1450 + k * 46} 120 v640`} stroke="#5A8CC0" strokeWidth="6" />)}<rect x="1430" y="100" width="400" height="20" rx="10" fill="#B9C3C8" />
  <rect x="640" y="300" width="20" height="200" fill="#B9C3C8" /><rect x="620" y="300" width="160" height="12" rx="6" fill="#B9C3C8" /><rect x="660" y="312" width="100" height="180" rx="10" fill="#F2B134" />
  <ellipse cx="1050" cy="900" rx="170" ry="40" fill="none" stroke="#A39B8E" strokeWidth="6" strokeDasharray="18 14" opacity={0.4 + 0.4 * Math.sin(t * 4)} />
  <rect x="1020" y="600" width="60" height="140" fill="none" stroke="#A39B8E" strokeWidth="5" strokeDasharray="14 12" opacity="0.6" /><circle cx="1050" cy="900" r="14" fill="#5E574E" />
  <Planta x={1340} y={760} s={0.8} t={t} /><LightCone x={1050} y={0} w={460} h={800} o={0.16} /></>;
const Lista = (t, items, sello) => <>
  <Fondo a="#D8A866" b="#B98A4E" id="lw" />{Array.from({ length: 60 }).map((_, k) => <circle key={k} cx={rnd(k) * W} cy={rnd(k + 50) * H} r="3" fill="#8A6236" opacity="0.4" />)}
  <g transform="rotate(-3 760 560)"><rect x="470" y="150" width="600" height="800" rx="20" fill="#7A4E36" /><rect x="500" y="200" width="540" height="720" fill="#FBF9ED" /><rect x="680" y="130" width="180" height="70" rx="14" fill="#B9C3C8" />
    <text x="770" y="290" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="44" letterSpacing="6" fill="#2A2420">TU BAÑO HOY</text>
    {items.map((it, k) => { const on = t > 0.35 + k * 0.42; return <g key={k}><rect x="550" y={360 + k * 130} width="64" height="64" rx="8" fill="none" stroke="#2A2420" strokeWidth="6" />
      {on && <path d={`M558 ${368 + k * 130} l48 48 M606 ${368 + k * 130} l-48 48`} stroke="#D8473B" strokeWidth="12" strokeLinecap="round" />}
      <text x="650" y={410 + k * 130} fontFamily={FONT} fontWeight="900" fontSize="46" fill="#2A2420" opacity={on ? 0.45 : 1}>{it}</text>{on && <rect x="645" y={396 + k * 130} width={it.length * 30} height="6" fill="#D8473B" />}</g>; })}</g>
  <g transform={`translate(1380 ${330 + Math.sin(t * 2) * 6}) rotate(6)`}><rect x="-150" y="-110" width="300" height="230" fill="#FFF4A8" /><circle cx="0" cy="-96" r="14" fill="#D8473B" /><Inodoro x={0} y={90} s={0.5} /><path d="M-90 -40 L90 100 M90 -40 L-90 100" stroke="#D8473B" strokeWidth="14" /></g>
  <path d="M1380 236 L1060 520" stroke="#D8473B" strokeWidth="4" /><Sello x={1340} y={760} txt={sello} t={t} at={0.35 + items.length * 0.42} /></>;
const Tierra = (t, n) => <>
  <Fondo a="#0E1630" b="#040919" id="tw" />{Array.from({ length: 90 }).map((_, k) => <circle key={k} cx={rnd(k) * W} cy={rnd(k + 9) * H} r={rnd(k + 3) * 2.4} fill="#fff" opacity={0.4 + 0.5 * Math.abs(Math.sin(t * 2 + k))} />)}
  {Array.from({ length: 10 }).map((_, k) => <rect key={k} x={((k * 300 - t * 900) % 2400 + 2400) % 2400 - 300} y={120 + k * 90} width="260" height="3" fill="#9EC5FF" opacity="0.25" />)}
  <circle cx="960" cy="520" r="330" fill="none" stroke="#9EC5FF" strokeWidth="3" opacity="0.5" />{Array.from({ length: 60 }).map((_, k) => { const a = k / 60 * Math.PI * 2; return <path key={k} d={`M${960 + Math.cos(a) * 330} ${520 + Math.sin(a) * 330} L${960 + Math.cos(a) * (k % 5 ? 316 : 300)} ${520 + Math.sin(a) * (k % 5 ? 316 : 300)}`} stroke="#9EC5FF" strokeWidth="3" opacity="0.6" />; })}
  <defs><clipPath id="glb"><circle cx="960" cy="520" r="240" /></clipPath><radialGradient id="glo" cx="38%" cy="35%"><stop offset="0" stopColor="#5CB4F0" /><stop offset="1" stopColor="#1E5FA8" /></radialGradient></defs>
  <circle cx="960" cy="520" r="250" fill="#9EC5FF" opacity="0.2" /><circle cx="960" cy="520" r="240" fill="url(#glo)" />
  <g clipPath="url(#glb)">{[0, 1, 2].map((k) => <g key={k} transform={`translate(${((t * 60 + k * 520) % 1560) - 780} 0)`}><path d="M780 380 q60 -60 140 -20 q40 60 -20 120 q-60 40 -40 120 q-80 -20 -100 -100 q-40 -60 20 -120Z" fill="#6FBF5A" /><path d="M1040 300 q80 0 120 60 q-20 80 -100 60 q-40 -40 -20 -120Z M1000 560 q70 20 80 100 q-60 60 -100 0Z" fill="#6FBF5A" /></g>)}
    <rect x="960" y="280" width="240" height="480" fill="#000" opacity="0.28" /></g>
  <path d={`M960 520 L${960 + Math.cos(t * 3) * 300} ${520 + Math.sin(t * 3) * 300}`} stroke="#fff" strokeWidth="4" opacity="0.8" /></>;

const CalleHist = (t, v = 0, opts = {}) => { const { olor = true, gente = 9, sucia = true } = opts; return <>
  <Fondo a="#F2C38A" b="#F6DDB0" id="cw" /><Glow x={1500} y={180} r={420} c="#FFE9B8" o={0.6} />
  <BlurG s={3}><Edificio x={-60} w={300} h={560} c="#A86A4A" k={1} /><Edificio x={1720} w={300} h={600} c="#9C6542" k={2} /></BlurG>
  <Edificio x={180} w={420} h={700} c="#B5845E" k={3} t={t} /><Edificio x={620} w={360} h={620} c="#C9966A" k={4} t={t} /><Edificio x={1000} w={400} h={740} c="#A0684A" k={5} t={t} /><Edificio x={1420} w={380} h={660} c="#B97C55" k={6} t={t} />
  <Tendedero x1={600} x2={1000} y={330} t={t} /><Tendedero x1={1400} x2={1700} y={420} t={t} />
  <Suelo y={860} c="#8A6A4E" c2="#5E4434" />{Array.from({ length: 20 }).map((_, k) => <ellipse key={k} cx={k * 100 + 40} cy={900 + (k % 3) * 50} rx="40" ry="10" fill="#6E5440" opacity="0.6" />)}
  {sucia && <><Charco x={520} y={940} /><Charco x={1300} y={990} w={220} /><Charco x={900} y={1030} w={140} /></>}
  <Carreta x={((v ? 1500 : 300) + t * (v ? -70 : 70))} y={900} t={t} />
  {Array.from({ length: gente }).map((_, k) => <Caminante key={k} x0={(k * 233 + v * 90) % 1900} y={880 + (k % 3) * 40} t={t} v={30 + (k % 3) * 20} k={k + v} flip={k % 2 === 1} s={0.36 + (k % 3) * 0.04} />)}
  {olor && [400, 900, 1350].map((x, k) => <Olor key={k} x={x} y={930} t={t + k} n={3} />)}{[0, 1, 2, 3, 4].map((k) => <Mosca key={k} x={380 + k * 280} y={880} t={t} k={k} />)}<Farol x={1640} y={900} on={false} /></>; };

const SHOTS = {
  '0-0': [(t) => ({ bg: Dormitorio(t), cam: [-26, 0, -3], ui: null })],
  '0-1': [(t) => ({ bg: Bano(t), fg: <BlurG s={10}><g opacity="0.9"><Xeno x={170} y={1300} s={1.45} exp="sorprendido" t={t} flip /></g></BlurG>, cam: [0, -10, 3.5], blur: true, ui: <Pildora x={1050} y={810} txt="AQUÍ NO HAY NADA" t={t} at={0.9} /> })],
  '0-2': [(t) => ({ bg: <><BlurG s={8}>{Bano(t)}</BlurG><Xeno x={960} y={1460} s={1.75} exp="sorprendido" pose="shock" t={t} /><Sudor x={1110} y={540} t={t} /><Signo x={1260} y={360} t={t} at={0.2} /><Signo x={650} y={420} t={t} at={0.45} s={0.7} /></>, cam: [18, 0, 11], ui: null })],
  '0-3': [(t, d) => ({ bg: Lista(t * (2.4 / Math.max(1.5, d)), ['TUBO', 'CISTERNA', 'SIFÓN', 'ALCANTARILLA'], 'NADA'), cam: [-22, 8, 3] })],
  '0-4': [(t) => ({ bg: Tierra(t), cam: [-14, -6, 3.2], ui: <><Pildora x={960} y={940} txt="INODOROS INVENTADOS: 0" t={t} at={0.3} size={34} /><text x="960" y="130" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="26" letterSpacing="6" fill="#9EC5FF">◀◀ OTRA HISTORIA</text></> })],
  '1-0': [
    (t) => ({ bg: CalleHist(t, 0), fg: <BlurG s={9}><Farol x={1780} y={1200} h={900} on={false} /></BlurG>, cam: [34, -8, 4], blur: true, ui: <Pildora x={760} y={250} txt="OLOR: INSOPORTABLE" c="#9BD46A" borde="#9BD46A" t={t} at={1.0} /> }),
    (t) => ({ bg: <><BlurG s={7}>{CalleHist(t + 3, 1, { gente: 5 })}</BlurG><Caminante x0={300} y={1180} t={t} v={90} s={1.1} k={2} /><Xeno x={1320} y={1220} s={1.25} exp="preocupado" pose="pensando" t={t} /><Olor x={1300} y={720} t={t} n={3} s={1.4} /><Olor x={520} y={760} t={t + 1} n={3} s={1.2} /></>, cam: [-30, 0, 3.6], ui: <Pildora x={560} y={330} txt="PAÑUELO" t={t} at={0.4} /> }),
  ],
  '1-1': [(t) => ({ bg: <><Fondo a="#1A2D24" b="#0B1410" id="ag" /><Glow x={960} y={520} r={600} c="#7CC07A" o={0.25} />
    <g transform={`translate(960 560) scale(${1 + eo(t / 1.4) * 0.15})`}><circle r="330" fill="#DDE8C8" /><circle r="330" fill="none" stroke="#2E3646" strokeWidth="40" />
      {Array.from({ length: 9 }).map((_, k) => <Bacteria key={k} x={-200 + (k % 3) * 200 + Math.sin(t + k) * 20} y={-180 + Math.floor(k / 3) * 170} s={0.9} t={t + k} />)}
      <circle r="330" fill="none" stroke="#fff" strokeWidth="6" opacity="0.4" strokeDasharray="60 900" transform={`rotate(${t * 40})`} /></g>
    <g transform="translate(1560 820)"><path d="M-90 -260 L90 -260 L70 0 L-70 0Z" fill="#B9D7C8" opacity="0.6" stroke="#fff" strokeWidth="6" /><rect x="-78" y="-150" width="156" height="146" fill="#8AA86A" opacity="0.7" />{[0, 1, 2].map((k) => <circle key={k} cx={-30 + k * 30} cy={-60 - ((t * 40 + k * 30) % 80)} r="6" fill="#DDE8C8" />)}</g>
    <path d="M1490 640 L1250 600" stroke="#fff" strokeWidth="4" strokeDasharray="12 10" /></>, cam: [0, 10, 4.5], ui: <><Pildora x={960} y={905} txt="VIBRIO CHOLERAE" t={t} at={0.5} /><Pildora x={1560} y={540} txt="AGUA DEL POZO" c="#7CE0A0" borde="#7CE0A0" size={24} t={t} at={0.9} /></> })],
  '1-2': [(t) => ({ bg: <><BlurG s={8}>{CalleHist(t, 1, { gente: 4 })}</BlurG><rect x="540" y="880" width="760" height="40" rx="10" fill="#6E4630" /><rect x="580" y="920" width="20" height="160" fill="#3A2A22" /><rect x="1240" y="920" width="20" height="160" fill="#3A2A22" />
    <Xeno x={900} y={1180} s={1.1} exp="pensativo" pose="pensando" t={t} /><Signo x={1220} y={420} t={t} at={0.3} s={1.6} /></>, cam: [24, 6, 3], fg: <BlurG s={10}><Bacinilla x={300} y={1150} s={2.2} /></BlurG> })],
  '1-3': [(t) => ({ bg: <><Fondo a="#2B2238" b="#16121F" id="mu" />{Array.from({ length: 7 }).map((_, k) => <rect key={k} x={k * 300 - 40} y="120" width="40" height="760" fill="#3A3048" />)}
    <rect y="860" width={W} height="220" fill="#3A2E2A" />{Array.from({ length: 8 }).map((_, k) => <rect key={k} x={k * 260} y="860" width="4" height="220" fill="#2A201C" />)}
    <LightCone x={960} y={0} w={600} h={900} o={0.3} /><rect x="760" y="700" width="400" height="160" fill="#E8E2D0" /><rect x="740" y="680" width="440" height="30" fill="#F7F4EC" />
    <g transform={`translate(960 ${700 - Math.sin(t * 2) * 4})`}><Inodoro x={0} y={0} s={1.15} /></g><Glow x={960} y={520} r={360} o={0.4} />
    {[560, 1360].map((x) => <g key={x}><rect x={x - 8} y="720" width="16" height="140" fill="#C9A26B" /><circle cx={x} cy="716" r="18" fill="#C9A26B" /></g>)}<path d="M560 740 Q760 800 960 760 Q1160 800 1360 740" stroke="#B5342C" strokeWidth="14" fill="none" />
    <rect x="860" y="760" width="200" height="60" rx="6" fill="#C9A26B" /><text x="960" y="800" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="22" fill="#2A2420">INVENTO Nº ?</text>
    <BlurG s={3}>{Array.from({ length: 5 }).map((_, k) => <Person key={k} x={200 + k * 380 + (k > 1 ? 300 : 0)} y={1000} s={0.55} t={t + k} pin={false} {...HIST[k]} exp="sorprendido" />)}</BlurG></>, cam: [-20, -8, 3.4], blur: true, ui: <Pildora x={960} y={180} txt="ALGO TAN SIMPLE" t={t} at={0.6} /> })],
  '1-4': [
    (t) => { const u = eo((t - 0.6) / 1.2); const a = -12 * u; return { bg: <><Bok a="#E0B07A" b="#8A5A3B" t={t} />
      <rect x="950" y="420" width="20" height="520" fill="#5E3A2A" /><path d="M860 940 h200 l-40 -40 h-120z" fill="#5E3A2A" />
      <g transform={`rotate(${a} 960 420)`}><rect x="560" y="410" width="800" height="18" rx="9" fill="#7A4E36" />
        <g transform="translate(600 430)"><path d="M-40 0 L40 0 L80 120 L-80 120Z" fill="none" stroke="#7A4E36" strokeWidth="6" /><ellipse cx="0" cy="130" rx="130" ry="22" fill="#C9A26B" /><g transform={`rotate(${-a} 0 120)`}><Inodoro x={0} y={124} s={0.5} /></g></g>
        <g transform="translate(1320 430)"><path d="M-40 0 L40 0 L80 120 L-80 120Z" fill="none" stroke="#7A4E36" strokeWidth="6" /><ellipse cx="0" cy="130" rx="130" ry="22" fill="#C9A26B" />
          <g transform={`rotate(${-a} 0 120)`}><rect x="-70" y="40" width="50" height="80" rx="10" fill="#fff" /><rect x="-70" y="40" width="50" height="34" rx="10" fill="#E86A5C" /><rect x="0" y="70" width="70" height="26" rx="13" fill="#4C9AD6" /><rect x="35" y="70" width="35" height="26" rx="13" fill="#fff" /></g></g></g></>, cam: [16, -6, 3], ui: <><Pildora x={600} y={300} txt="INODORO" t={t} at={0.3} /><Pildora x={1320} y={300} txt="MEDICINAS" t={t} at={0.45} c="#8FD3F5" borde="#8FD3F5" /></> }; },
    (t) => ({ bg: <><Bok a="#C98B52" b="#5E3A2A" t={t + 2} /><Xeno x={760} y={1180} s={1.25} exp="pensativo" pose="sostiene" t={t} /><g transform="translate(760 780)"><rect x="-110" y="-70" width="220" height="140" rx="8" fill="#C9604C" /><rect x="-4" y="-70" width="8" height="140" fill="#7A3A2E" /><text x="-55" y="10" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="22" fill="#FFF4D6">HISTORIA</text></g>
      <g opacity={eo((t - 0.4) / 0.5)}><circle cx="1350" cy="460" r="170" fill="#FFF8EA" /><circle cx="1180" cy="640" r="26" fill="#FFF8EA" /><circle cx="1130" cy="700" r="14" fill="#FFF8EA" /><Inodoro x={1350} y={560} s={0.48} /><text x="1450" y="370" fontFamily={FONT} fontWeight="900" fontSize="70" fill="#7CC07A">+</text></g></>, cam: [-26, 0, 3.8] }),
  ],
  '4-0': [(t) => ({ bg: <>{CalleHist(t, 0, { gente: 4 })}{[[960, 760, 420, 380], [960, 760, 1500, 560], [960, 760, 1120, 990]].map(([x1, y1, x2, y2], k) => { const u = eo((t - 0.4 - k * 0.35) / 0.5);
      return <g key={k}><path d={`M${x1} ${y1} L${lerp(x1, x2, u)} ${lerp(y1, y2, u)}`} stroke="#FACA4F" strokeWidth="10" strokeDasharray="22 16" strokeLinecap="round" />{u > 0.95 && <circle cx={x2} cy={y2} r="18" fill="#FACA4F" />}</g>; })}
    <Bacinilla x={960} y={800} s={0.7} /></>, cam: [28, -10, 3.2], ui: <><Pildora x={420} y={320} txt="¿VENTANA?" t={t} at={0.9} size={26} /><Pildora x={1500} y={500} txt="¿RÍO?" t={t} at={1.25} size={26} /><Pildora x={1120} y={930} txt="¿CALLE?" t={t} at={1.6} size={26} /></> })],
  '4-1': [(t) => { const g = Math.round(130 * eo((t - 0.3) / 1.4)); const a = -120 + 240 * (g / 300); return { bg: <><Fondo a="#3F5A8A" b="#1E2B48" id="ba" /><Glow x={960} y={460} r={520} o={0.25} />
    <rect y="820" width={W} height="260" fill="#C9A26B" /><rect y="820" width={W} height="16" fill="#E8D6B0" />
    <g transform="translate(960 600)"><rect x="-260" y="-40" width="520" height="260" rx="40" fill="#E9E4DA" /><ellipse cx="0" cy="-60" rx="290" ry="40" fill="#F7F4EC" /><circle cx="0" cy="90" r="110" fill="#fff" stroke="#2E3646" strokeWidth="10" />
      {Array.from({ length: 11 }).map((_, k) => { const an = (-120 + k * 24) * Math.PI / 180; return <path key={k} d={`M${Math.sin(an) * 88} ${90 - Math.cos(an) * 88} L${Math.sin(an) * 100} ${90 - Math.cos(an) * 100}`} stroke="#2E3646" strokeWidth="5" />; })}
      <path d={`M0 90 L${Math.sin(a * Math.PI / 180) * 84} ${90 - Math.cos(a * Math.PI / 180) * 84}`} stroke="#D8473B" strokeWidth="8" strokeLinecap="round" /><circle cx="0" cy="90" r="12" fill="#2E3646" />
      <path d="M-120 -120 q120 -80 240 0 q-40 40 -120 40 q-80 0 -120 -40Z" fill="#7A5A3A" /></g>
    <text x="960" y="330" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="170" fill="#FACA4F" stroke={OUT} strokeWidth="14" paintOrder="stroke">{g} g</text></>, cam: [0, 0, 2.6], ui: <><Pildora x={960} y={420} txt="POR PERSONA, AL DÍA" t={t} at={0.5} size={28} /><Fuente txt="Rose et al. (2015), Critical Reviews in Environmental Science and Technology" /></> }; }],
  '4-2': [(t) => { const n = Math.min(50, Math.floor(50 * eo((t - 0.2) / 1.6))); return { bg: <><Fondo a="#2E3E66" b="#141C33" id="kg" />
    <g transform="translate(330 560)"><rect x="-170" y="-200" width="340" height="400" rx="20" fill="#F7F4EC" /><rect x="-170" y="-200" width="340" height="90" rx="20" fill="#D8473B" /><text x="0" y="-140" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="44" fill="#fff">{['ENE', 'MAR', 'JUN', 'SEP', 'DIC'][Math.min(4, Math.floor(t * 2.2))]}</text>
      {Array.from({ length: 28 }).map((_, k) => <rect key={k} x={-140 + (k % 7) * 42} y={-90 + Math.floor(k / 7) * 60} width="30" height="36" rx="4" fill={k < (t * 12) % 28 ? '#FACA4F' : '#E2DFD6'} />)}</g>
    {Array.from({ length: n }).map((_, k) => { const col = k % 10, row = Math.floor(k / 10); return <g key={k} transform={`translate(${760 + col * 100} ${880 - row * 105})`}><path d="M-40 0 Q-46 -70 0 -80 Q46 -70 40 0Z" fill="#6E5440" /><path d="M-14 -80 l14 -18 l14 18" fill="none" stroke="#3A2A22" strokeWidth="6" /></g>; })}
    <text x="1210" y="230" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="150" fill="#FACA4F" stroke={OUT} strokeWidth="14" paintOrder="stroke">{n} kg</text></>, cam: [-18, -8, 3], ui: <Pildora x={1210} y={320} txt="EN UN AÑO" t={t} at={0.4} size={28} /> }; }],
  '4-3': [(t) => { const lit = Math.floor(400 * eo((t - 0.2) / 1.8)); return { bg: <><Fondo a="#1A2234" b="#0B1020" id="mc" />
    {Array.from({ length: 12 }).map((_, k) => <rect key={k} x="0" y={k * 95} width={W} height="10" fill="#2A3450" />)}{Array.from({ length: 20 }).map((_, k) => <rect key={k} x={k * 100} y="0" width="10" height={H} fill="#2A3450" />)}
    <path d="M0 640 Q500 560 900 700 T1920 620 V720 Q1500 760 900 800 T0 740Z" fill="#2E5A7A" opacity="0.8" />
    {Array.from({ length: 400 }).map((_, k) => <circle key={k} cx={80 + rnd(k) * 1760} cy={80 + rnd(k + 999) * 900} r={k < lit ? 5 : 3} fill={k < lit ? '#FACA4F' : '#3A4460'} opacity={k < lit ? 0.9 : 0.6} />)}</>, cam: [22, 10, 4.2], ui: <><Pildora x={960} y={180} txt={`${lit * 2500 > 999999 ? (lit * 2500 / 1e6).toFixed(1).replace('.', ',') + ' MILLONES' : (lit * 2500).toLocaleString('es')} PERSONAS`} t={t} at={0.2} size={34} /><Pildora x={960} y={940} txt="1 PUNTO = 2.500 PERSONAS (ILUSTRATIVO)" c="#fff" size={20} t={t} at={0.6} /></> }; }],
  '4-4': [(t) => ({ bg: <><Bok a="#8DC7B6" b="#2E5A4A" t={t} light="#E6FFE8" /><Xeno x={960} y={1460} s={1.75} exp="preocupado" pose="shock" t={t} /><Olor x={760} y={760} t={t} s={1.6} /><Olor x={1180} y={760} t={t + 0.5} s={1.6} /><Sudor x={1110} y={540} t={t} /></>, cam: [0, 0, 12] })],
};
const SEPIA = '0.393 0.769 0.189 0 0  0.349 0.686 0.168 0 0  0.272 0.534 0.131 0 0  0 0 0 1 0';
const EdimburgoPG = (t) => <><Fondo a="#C9B48A" b="#8A7650" id="ed" />
  <Edificio x={-40} w={480} h={900} c="#7A6248" k={7} /><Edificio x={1460} w={500} h={880} c="#6E5840" k={8} /><BlurG s={2}><Edificio x={460} w={300} h={640} c="#8A7050" k={9} /><Edificio x={1160} w={300} h={660} c="#80684A" k={10} /></BlurG>
  <path d="M760 860 L1160 860 L1040 300 L880 300Z" fill="#B9A47E" /><Suelo y={860} c="#6E5840" c2="#4A3A28" />{Array.from({ length: 30 }).map((_, k) => <rect key={k} x={(k % 10) * 200 + (Math.floor(k / 10) % 2) * 100} y={880 + Math.floor(k / 10) * 60} width="180" height="50" rx="8" fill="#5E4A34" opacity="0.6" />)}
  {Array.from({ length: 6 }).map((_, k) => <Caminante key={k} x0={300 + k * 260} y={940 + (k % 2) * 40} t={t} v={25} k={k} flip={k % 2 === 0} pañuelo={k % 2 === 1} s={0.4} />)}<Farol x={420} y={940} /><Farol x={1500} y={940} /></>;
const Ventana18 = (t, grito = false) => { const u = eo((t - 0.5) / 0.6); return <><Fondo a="#9C8460" b="#6E5840" id="v18" />{Array.from({ length: 9 }).map((_, k) => <rect key={k} x="0" y={k * 120} width={W} height="6" fill="#5E4A34" />)}{Array.from({ length: 12 }).map((_, k) => <rect key={k} x={(k * 170) + (k % 2) * 60} y="0" width="6" height={H} fill="#5E4A34" opacity="0.5" />)}
  <rect x="660" y="160" width="600" height="560" fill="#2A2018" /><rect x="640" y="140" width="640" height="30" fill="#4A3A28" /><rect x="620" y="720" width="680" height="40" fill="#4A3A28" />
  <path d="M660 160 L760 160 L760 720 L660 720Z M1260 160 L1160 160 L1160 720 L1260 720Z" fill="#8A3A2E" />
  <Person x={960} y={980} s={0.95} exp={grito ? 'sorprendido' : 'serio'} pose="sostiene" t={t} pin={false} {...HIST[2]} />
  <g transform={`translate(${960 + u * 120} ${700 - u * 40}) rotate(${-90 * u})`}><Bacinilla x={0} y={0} s={0.7} /></g>
  {u > 0.6 && <path d={`M${1080 + 60} 680 q40 ${200 * (u - 0.6) * 2.5} 20 ${400 * (u - 0.6) * 2.5}`} stroke="#6E6A3A" strokeWidth="40" fill="none" strokeLinecap="round" opacity="0.85" />}
  {[0, 1].map((k) => <rect key={k} x={760 - 300 + k * 900} y="780" width="200" height="60" rx="10" fill="#7A9A5A" />)}</>; };

Object.assign(SHOTS, {
  '5-0': [
    (t) => ({ bg: EdimburgoPG(t), sepia: true, cam: [-24, -10, 3.4], ui: <Pildora x={960} y={170} txt="EDIMBURGO · SIGLO XVIII" t={t} at={0.25} size={32} /> }),
    (t) => ({ bg: Ventana18(t), sepia: true, cam: [16, 12, 4.5], fg: <BlurG s={10}><rect x="0" y="0" width="200" height={H} fill="#3A2A1E" /></BlurG> }),
    (t) => ({ bg: <>{EdimburgoPG(t + 2)}<g transform={`translate(1180 ${300 + eo(t / 0.8) * 520})`}><path d="M-30 0 q30 -60 60 0 q-30 40 -60 0" fill="#6E6A3A" /></g></>, sepia: true, cam: [30, 0, 5], ui: <Pildora x={960} y={170} txt="BACINILLAS POR LA VENTANA" t={t} at={0.2} size={28} /> }),
  ],
  '5-1': [(t) => ({ bg: <>{Ventana18(t * 0.3, true)}<g opacity={eo((t - 0.3) / 0.3)}><path d="M1300 240 h420 q30 0 30 30 v120 q0 30 -30 30 h-300 l-60 50 l10 -50 h-70 q-30 0 -30 -30 v-120 q0 -30 30 -30Z" fill="#FFF8EA" stroke={OUT} strokeWidth="6" />
    <text x="1510" y="350" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="64" fill="#2A2420">¡GARDYLOO!</text></g></>, sepia: true, cam: [-20, 0, 6], ui: null })],
  '5-2': [(t) => ({ bg: <><BlurG s={7}>{EdimburgoPG(t)}</BlurG><Xeno x={960} y={1400} s={1.6} exp="sorprendido" pose="shock" t={t} look={0} /><Signo x={1300} y={380} t={t} at={0.25} /></>, sepia: false, cam: [0, 18, 10], ui: <Pildora x={960} y={200} txt="«¡CUIDADO CON EL AGUA!»" t={t} at={0.2} size={34} /> })],
  '5-3': [(t) => { const u = eo((t - 0.3) / 0.5); return { bg: <>{CalleHist(t, 1, { gente: 3, olor: false })}<g transform={`translate(${lerp(960, 1380, u)} ${980 - Math.sin(u * Math.PI) * 160})`}><Xeno x={0} y={0} s={0.8} exp="sorprendido" pose="shock" t={t} /></g>
    <g transform={`translate(900 ${lerp(200, 900, eo((t - 0.1) / 0.45))})`}><path d="M-40 0 q40 -80 80 0 q-40 50 -80 0" fill="#6E6A3A" /></g>{t > 0.55 && Array.from({ length: 10 }).map((_, k) => { const v = (t - 0.55) * 3; return <circle key={k} cx={900 + Math.cos(k) * 160 * v} cy={940 - Math.abs(Math.sin(k * 1.7)) * 140 * v + 200 * v * v} r="12" fill="#6E6A3A" />; })}</>, cam: [36, 0, 4], blur: true, ui: <Pildora x={900} y={300} txt="¡SPLASH!" c="#9BD46A" borde="#9BD46A" t={t} at={0.55} /> }; }],
  '2-0': [(t) => { const u = eo((t - 0.3) / 1.0); return { bg: <><Fondo a="#2A1E18" b="#140E0B" id="ar" />{Array.from({ length: 28 }).map((_, k) => { const x = 60 + (k % 7) * 260, y = 60 + Math.floor(k / 7) * 250, open = k === 17;
      return <g key={k}><rect x={x} y={y} width="240" height="230" rx="10" fill="#7A4E36" /><rect x={x + 14} y={y + 14} width="212" height="202" rx="6" fill="#94643F" transform={open ? `translate(${-20 * u} ${-20 * u}) scale(${1 + 0.1 * u})` : ''} /><rect x={x + 90} y={y + 100} width="60" height="16" rx="8" fill="#E8D6B0" />
        <rect x={x + 70} y={y + 40} width="100" height="34" fill="#F3EDE4" /><text x={x + 120} y={y + 64} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="18" fill="#2A2420">{['¿Y SI?', 'Nº ' + (k + 1)][k % 2]}</text></g>; })}
    <Glow x={1210} y={1010} r={420 * u + 1} c="#FFE3A3" o={0.7} /><Polvo t={t} n={50} /></>, cam: [-18, -10, 3], ui: <g opacity={eo((t - 0.6) / 0.4)}><rect x="420" y="380" width="1080" height="300" rx="22" fill="#0E111F" opacity="0.92" stroke="#E3C584" strokeWidth="3" />
      <text x="960" y="450" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="30" letterSpacing="8" fill="#E3C584">ARCHIVO ¿Y SI?</text><text x="960" y="545" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="62" fill="#fff">¿QUÉ PASARÍA SI NUNCA SE</text><text x="960" y="625" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="62" fill="#fff">HUBIERA INVENTADO EL INODORO?</text></g> }; }],
  '3-0': [(t) => { const u = eo((t - 0.2) / 0.7); return { bg: <><Fondo a="#3A2A30" b="#1E1418" id="pb" />{Array.from({ length: 6 }).map((_, k) => <g key={k}><rect x={k * 340 - 40} y="200" width="20" height="660" fill="#2A1E22" /><circle cx={k * 340 + 130} cy="260" r="16" fill="#FFD58A" /><Glow x={k * 340 + 130} y={260} r={90} o={0.4} /></g>)}
    <rect y="860" width={W} height="220" fill="#5E2A2A" /><path d="M760 1080 L860 860 L1060 860 L1160 1080Z" fill="#8A3A34" />
    <rect x="780" y="300" width="360" height="560" fill="#FFF8EA" opacity={u} /><Glow x={960} y={580} r={500 * u + 1} c="#FFFFFF" o={0.6 * u} />
    <g transform={`translate(780 300) scale(${1 - 0.85 * u} 1)`}><rect width="360" height="560" fill="#94643F" /><rect x="30" y="30" width="300" height="220" fill="#7A4E36" /><rect x="30" y="290" width="300" height="240" fill="#7A4E36" /><circle cx="320" cy="300" r="14" fill="#E3C584" /></g>
    <rect x="860" y="220" width="200" height="56" rx="10" fill="#E3C584" /><text x="960" y="258" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="26" fill="#2A2420">ESCENARIO 1</text>
    {Array.from({ length: 30 }).map((_, k) => <circle key={k} cx={960 + (rnd(k) - 0.5) * 900 * u} cy={580 + (rnd(k + 7) - 0.5) * 600 * u} r={3 + rnd(k) * 5} fill="#fff" opacity={u * 0.8} />)}</>, cam: [0, 0, 6], ui: <text x="960" y="560" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="120" fill="#fff" stroke={OUT} strokeWidth="12" paintOrder="stroke" opacity={eo((t - 0.4) / 0.4)}>LA CALLE</text> }; }],
});

// ---------- tiempos ----------
const planesOf = (sc, si) => {
  const P = sc.planos || []; const words = sc.words || []; const d = sc.frames / 30;
  const tot = P.reduce((s, p) => s + p.f.split(/\s+/).length, 0) || 1; let acc = 0;
  const starts = P.map((p, i) => { const idx = Math.min(words.length - 1, Math.round(acc * words.length / tot)); acc += p.f.split(/\s+/).length; return i === 0 ? 0 : Math.max(0, (words[idx] ? words[idx][1] : 0) - 0.15); });
  const out = [];
  P.forEach((p, i) => { const a = starts[i], b = i + 1 < P.length ? starts[i + 1] : d, dur = b - a; const V = SHOTS[`${si}-${i}`] || [null]; const n = V.length;
    for (let j = 0; j < n; j++) out.push({ v: p.v, f: p.f, i, j, fn: V[j], a: a + dur * j / n, b: a + dur * (j + 1) / n }); });
  return out;
};
const Subs = ({ sc, t, pl }) => {
  const words = sc.words || []; if (!pl || !words.length) return null;
  const P = sc.planos; const tot = P.reduce((s, p) => s + p.f.split(/\s+/).length, 0); let acc = 0, a0 = 0, n = 0;
  P.forEach((p, i) => { const c = p.f.split(/\s+/).length; if (i === pl.i) { a0 = acc; n = c; } acc += c; });
  const fw = pl.f.split(/\s+/); const r = words.length / tot;
  let cur = 0; for (let k = 0; k < n; k++) { const wi = Math.min(words.length - 1, Math.round((a0 + k) * r)); if (words[wi] && t >= words[wi][1] - 0.05) cur = k; }
  const g = Math.floor(cur / 8) * 8; const chunk = fw.slice(g, g + 8);
  return <div style={{ position: 'absolute', top: 956, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 46, lineHeight: 1.15, color: '#fff', textShadow: '0 3px 10px rgba(0,0,0,0.85), 0 0 2px rgba(0,0,0,0.9)', padding: '0 220px', boxSizing: 'border-box' }}>
    {chunk.map((w, j) => <span key={j} style={{ color: g + j === cur ? '#FACA4F' : '#fff', marginRight: 14 }}>{w}</span>)}</div>;
};
const Hud = ({ p }) => p.med === null || p.med === undefined ? null : <div style={{ position: 'absolute', right: 44, top: 30, padding: '12px 22px', borderRadius: 18, background: 'rgba(14,17,31,0.88)', border: '3px solid #E3C584', fontFamily: FONT, color: '#fff', display: 'flex', alignItems: 'center', gap: 16 }}>
  <div style={{ fontWeight: 900, fontSize: 20, letterSpacing: 2.6, lineHeight: 1.1 }}>OLOR<br />METRO</div><div style={{ fontWeight: 900, fontSize: 48, color: p.med >= 60 ? '#FF7A59' : '#7CE0A0' }}>{p.med}%</div></div>;

const Scene = ({ i, at }) => {
  const f0 = useCurrentFrame(); const sc = D[i];
  const f = at !== undefined ? Math.round(sc.frames * at) : f0; const t = f / 30;
  const pls = planesOf(sc, i); const pl = pls.find((x) => t >= x.a && t < x.b) || pls[pls.length - 1];
  const lt = t - pl.a, ld = pl.b - pl.a;
  const S = pl.fn ? pl.fn(lt, ld) : { bg: <Bok t={lt} />, cam: [0, 0, 2] };
  const [px, py, zz] = S.cam || [0, 0, 3]; const e = eo(lt / Math.max(0.5, ld));
  const z = 1.08 + (zz / 100) * ld * e * (zz < 0 ? 1 : 1), z0 = zz < 0 ? 1.08 + (-zz / 100) * ld : 1.08;
  const zf = zz < 0 ? z0 - (-zz / 100) * ld * e : z;
  const dx = px * ld * (e - 0.5) * 1.5, dy = py * ld * (e - 0.5) * 1.5;
  const blur = S.blur ? Math.max(0, 18 * (1 - lt / 0.27)) : 0;
  const flick = S.sepia ? 0.88 + 0.12 * rnd(f) : 1;
  return <AbsoluteFill style={{ background: '#140E0B', overflow: 'hidden' }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute' }}>
      <defs><filter id="sep"><feColorMatrix type="matrix" values={SEPIA} /></filter><filter id="bin"><feGaussianBlur stdDeviation={blur} /></filter></defs>
      <g filter={blur > 0.3 ? 'url(#bin)' : undefined}><g filter={S.sepia ? 'url(#sep)' : undefined} opacity={flick}>
        <g transform={`translate(${W / 2 - dx} ${H / 2 - dy}) scale(${zf}) translate(${-W / 2} ${-H / 2})`}>{S.bg}</g>
        {S.fg && <g transform={`translate(${W / 2 - dx * 1.8} ${H / 2 - dy * 1.8}) scale(${zf * 1.04}) translate(${-W / 2} ${-H / 2})`}>{S.fg}</g>}
        {S.sepia && <Rayas t={t} />}</g></g>
      {S.sepia ? <Vignette o={0.7} /> : <><Grade c="#FFB46B" o={0.1} /><Vignette o={0.5} /></>}<Grain o={0.06} seed={i} />
      {S.ui}
    </svg>
    <Hud p={sc.p || {}} />
    {!pl.v.startsWith('card') && pl.v !== 'tit' && <Subs sc={sc} t={t} pl={pl} />}
  </AbsoluteFill>;
};
const Sheet = ({ at }) => { const f = useCurrentFrame(); return <Scene i={f % D.length} at={at} />; };
registerRoot(() => <>
  {D.map((sc, i) => <Composition key={i} id={`V27-${String(i).padStart(2, '0')}`} component={Scene} defaultProps={{ i }} durationInFrames={sc.frames} fps={30} width={W} height={H} />)}
  <Composition id="SHEET" component={Sheet} defaultProps={{ at: 0.5 }} durationInFrames={D.length} fps={30} width={W} height={H} />
</>);
