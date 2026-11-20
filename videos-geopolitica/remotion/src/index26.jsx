// v26 · ¿Qué pasaría si nunca se hubiera inventado el inodoro? — gramática de la referencia medida (ANALISIS_HYPO_ROOM_V2.md):
// un plano por frase (~2 s, subplanos), cámara 3 %/s alternando con ease-out, PP con bokeh, paleta cálida, tarjetas, fichas sepia,
// flash en cambios de escenario, contador fijo, subtítulos por frase (4,3 % de alto, palabra en #FACA4F).
import React from 'react';
import { registerRoot, Composition, useCurrentFrame, AbsoluteFill } from 'remotion';
import D from './data26.json';
import { Person, Xeno, Head, FUT, OUT } from './xeno.jsx';
import { Grain, Grade, Vignette, BlurG, Room, CeilLamp, Ventana, Repisa, Reloj, Planta, LightCone } from './kit2d.jsx';

const W = 1920, H = 1080, FONT = 'Inter Display, Inter, Arial, sans-serif';
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eo = (x) => 1 - Math.pow(1 - cl(x), 3);
const pop = (t, at, d = 0.28) => { const u = cl((t - at) / d); return u <= 0 ? 0 : u < 1 ? 0.8 + 0.25 * Math.sin(u * Math.PI * 0.85) + 0.2 * u * (1 - u) : 1; };
const PAL = { ambar: ['#C98B52', '#6B3E2A'], verde: ['#8DC7B6', '#3E6B5A'], azul: ['#6E86B8', '#262F4B'], rosa: ['#E9A3A0', '#7A3E4E'], crema: ['#EEDBB2', '#A98A63'] };
const HIST = [{ jacket: '#8A5A3B', jacketD: '#6E4630', hair: 'xeno' }, { jacket: '#5E6E4A', jacketD: '#46543A', hair: 'largo' }, { jacket: '#A8433A', jacketD: '#84332C', hair: 'moño' }, { jacket: '#4A5A7A', jacketD: '#36435C', hair: 'xeno' }, { jacket: '#C9A26B', jacketD: '#A5834F', hair: 'largo' }];

// ---------- piezas ----------
const Bg = ({ a, b }) => <><defs><linearGradient id="bgv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient></defs><rect width={W} height={H} fill="url(#bgv)" /></>;
const Bokeh = ({ c = 'ambar', t = 0, n = 26 }) => { const [a, b] = PAL[c] || PAL.ambar; return <>
  <defs><radialGradient id="bk" cx="50%" cy="45%" r="75%"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></radialGradient></defs>
  <rect width={W} height={H} fill="url(#bk)" />
  <BlurG s={10}>{Array.from({ length: n }).map((_, k) => <circle key={k} cx={(k * 389 + Math.sin(t * 0.3 + k) * 30) % W} cy={(k * 211) % H} r={30 + (k % 5) * 18} fill={k % 3 ? '#FFF1D6' : a} opacity={0.12 + (k % 4) * 0.06} />)}</BlurG></>; };
const Glow = ({ x, y, r = 240, c = '#FFE3A3', o = 0.5 }) => <><defs><radialGradient id={`gl${x}${y}`}><stop offset="0" stopColor={c} stopOpacity={o} /><stop offset="1" stopColor={c} stopOpacity="0" /></radialGradient></defs><circle cx={x} cy={y} r={r} fill={`url(#gl${x}${y})`} style={{ mixBlendMode: 'screen' }} /></>;
const Polvo = ({ t, n = 40, c = '#FFF1D6' }) => <g>{Array.from({ length: n }).map((_, k) => <circle key={k} cx={(k * 173 + t * (8 + k % 5) * 6) % W} cy={(k * 97 + Math.sin(t + k) * 20) % H} r={1.5 + (k % 3)} fill={c} opacity={0.35} />)}</g>;
const Casa = ({ x, w, h, c, y = 860, win = '#FFD58A', techo = '#6B3E2A' }) => <g>
  <rect x={x} y={y - h} width={w} height={h} fill={c} /><path d={`M${x - 14} ${y - h} L${x + w / 2} ${y - h - 70} L${x + w + 14} ${y - h}Z`} fill={techo} />
  {Array.from({ length: Math.floor((h - 60) / 90) }).map((_, r) => Array.from({ length: Math.floor(w / 80) }).map((_, k) => <g key={`${r}${k}`}>
    <rect x={x + 22 + k * 80} y={y - h + 30 + r * 90} width="40" height="54" fill={(r + k) % 3 ? win : '#3A2A22'} /><rect x={x + 22 + k * 80} y={y - h + 54 + r * 90} width="40" height="4" fill="#6B3E2A" /></g>))}
  <rect x={x} y={y - h} width={w} height="10" fill="#000" opacity="0.15" /></g>;
const Suelo = ({ y = 860, c = '#7A5A43', c2 = '#5E4434' }) => <><defs><linearGradient id="sl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c} /><stop offset="1" stopColor={c2} /></linearGradient></defs><rect y={y} width={W} height={H - y} fill="url(#sl)" /></>;
const Charco = ({ x, y, w = 160 }) => <ellipse cx={x} cy={y} rx={w} ry={w * 0.18} fill="#6E7A3E" opacity="0.7" />;
const Mosca = ({ x, y, t, k = 0 }) => <g transform={`translate(${x + Math.sin(t * 7 + k) * 30} ${y + Math.cos(t * 9 + k) * 18})`}><ellipse rx="6" ry="4" fill="#1A1A1A" /><ellipse cx="-4" cy="-5" rx="5" ry="3" fill="#fff" opacity="0.6" /><ellipse cx="4" cy="-5" rx="5" ry="3" fill="#fff" opacity="0.6" /></g>;
const Gente = ({ y = 880, s = 0.34, t, n = 7, seed = 0, pal = HIST, pañuelo = false }) => <BlurG s={1.2}>{Array.from({ length: n }).map((_, k) => {
  const x = ((k * 293 + seed * 170 + t * (k % 2 ? 26 : -20)) % 2200 + 2200) % 2200 - 140;
  return <g key={k}><Person x={x} y={y} s={s} t={t + k} pin={false} flip={k % 2 === 0} exp={pañuelo ? 'preocupado' : 'neutral'} {...pal[(k + seed) % pal.length]} />
    {pañuelo && <rect x={x - 22 * s * 2.2} y={y - 470 * s} width={44 * s * 2.2} height={30 * s} rx="6" fill="#F3F1E6" />}</g>; })}</BlurG>;
const Inodoro = ({ x, y, s = 1, corte = false }) => <g transform={`translate(${x} ${y}) scale(${s})`}>
  <rect x="-70" y="-330" width="140" height="150" rx="16" fill="#F3F4F2" /><rect x="-70" y="-330" width="140" height="18" rx="9" fill="#fff" />
  <path d="M-110 -170 L110 -170 Q110 -60 30 -40 L40 0 L-40 0 L-30 -40 Q-110 -60 -110 -170Z" fill="#ECEDEA" /><ellipse cx="0" cy="-170" rx="110" ry="26" fill="#fff" />
  <ellipse cx="0" cy="-168" rx="80" ry="16" fill={corte ? '#8FD3F5' : '#D9E6EA'} />
  {corte && <g><path d="M10 -150 Q40 -60 0 -40 Q-40 -20 -10 30 Q20 70 90 70" stroke="#5CC8F0" strokeWidth="26" fill="none" strokeLinecap="round" opacity="0.9" />
    <path d="M10 -150 Q40 -60 0 -40 Q-40 -20 -10 30 Q20 70 90 70" stroke="#2E7FB8" strokeWidth="6" fill="none" /></g>}
  <rect x="-40" y="-18" width="80" height="18" rx="6" fill="#C9CED2" /></g>;
const Bacteria = ({ x, y, s = 1, t, c = '#7CC07A' }) => <g transform={`translate(${x} ${y}) rotate(${Math.sin(t * 2 + x) * 15}) scale(${s})`}>
  <rect x="-60" y="-24" width="120" height="48" rx="24" fill={c} /><rect x="-50" y="-16" width="60" height="10" rx="5" fill="#fff" opacity="0.35" />
  <path d={`M60 0 q20 ${-14 + Math.sin(t * 8) * 10} 40 0 t40 0`} stroke={c} strokeWidth="5" fill="none" />
  <circle cx="-20" cy="0" r="6" fill="#2F6B45" /><circle cx="14" cy="4" r="5" fill="#2F6B45" /></g>;
const Bacinilla = ({ x, y, s = 1 }) => <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-110 -90 L110 -90 L90 0 L-90 0Z" fill="#E9E2D0" /><ellipse cx="0" cy="-90" rx="120" ry="24" fill="#F6F1E3" /><ellipse cx="0" cy="-90" rx="96" ry="16" fill="#8A7A4E" />
  <path d="M110 -70 Q170 -60 150 -20 Q140 0 100 -10" stroke="#E9E2D0" strokeWidth="16" fill="none" /><path d="M-100 -50 L100 -50" stroke="#3E6B9E" strokeWidth="6" /></g>;
const Gota = ({ x, y, s = 1 }) => <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M0 -150 C60 -60 90 -10 90 30 A90 90 0 0 1 -90 30 C-90 -10 -60 -60 0 -150Z" fill="#7CC8E8" /><ellipse cx="-30" cy="0" rx="18" ry="34" fill="#fff" opacity="0.5" /></g>;
const Rollo = ({ x, y, s = 1 }) => <g transform={`translate(${x} ${y}) scale(${s})`}><rect x="-120" y="-90" width="240" height="180" rx="16" fill="#F6F4EE" /><ellipse cx="-120" cy="0" rx="40" ry="90" fill="#E2DFD6" /><ellipse cx="-120" cy="0" rx="16" ry="36" fill="#B5A58A" /><path d="M120 -90 L160 -90 L160 160 L120 160Z" fill="#F6F4EE" /></g>;
const Panel = ({ children, t }) => <g opacity={eo(t / 0.25)}>{children}</g>;
const Pill = ({ x, y, txt, c = '#FACA4F', size = 30 }) => { const w = txt.length * size * 0.62 + 50; return <g><rect x={x - w / 2} y={y - size} width={w} height={size * 1.7} rx={size * 0.85} fill="#0E111F" opacity="0.88" stroke="#E3C584" strokeWidth="2" />
  <text x={x} y={y + size * 0.25} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={size} fill={c} letterSpacing="2">{txt}</text></g>; };

// ---------- lugares (pg) ----------
const LUG = {
  cuarto: (t) => <><Room wall={['#6B4E7A', '#4B3A6E']} floor={['#8A5A3B', '#6E4630']} fy={820} /><Ventana x={760} y={160} w={420} h={300} view="ciudad" t={t} /><Repisa x={180} y={300} w={360} />
    <rect x="140" y="640" width="560" height="140" rx="14" fill="#C9A26B" /><rect x="140" y="600" width="560" height="60" rx="14" fill="#E8D6B0" /><rect x="160" y="560" width="160" height="70" rx="20" fill="#F3F1E6" /><Reloj x={1460} y={260} t={t} /><Glow x={970} y={300} r={420} o={0.35} /></>,
  cuarto_noche: (t) => <><Room wall={['#2E2A44', '#1E1B30']} floor={['#4A3A30', '#33281F']} fy={820} /><Ventana x={760} y={160} w={420} h={300} view="nieve" t={t} />
    <rect x="140" y="640" width="560" height="140" rx="14" fill="#5E4A6E" /><rect x="140" y="600" width="560" height="60" rx="14" fill="#7A6A8A" /><Glow x={1460} y={600} r={260} c="#FFC27A" o={0.6} /><rect x="1440" y="560" width="40" height="60" rx="6" fill="#FFE3A3" /></>,
  calle_sucia: (t) => <><Bg a="#F2C38A" b="#E8D6B0" /><BlurG s={2}><Casa x={-40} w={420} h={520} c="#B07A5A" /><Casa x={400} w={360} h={600} c="#9C6542" /><Casa x={1160} w={380} h={560} c="#A86A4A" /><Casa x={1560} w={420} h={500} c="#B5845E" /></BlurG>
    <Suelo y={860} c="#8A6A4E" c2="#5E4434" /><Charco x={520} y={930} /><Charco x={1380} y={980} w={220} /><Gente y={900} s={0.36} t={t} n={6} pañuelo />
    {[0, 1, 2, 3].map((k) => <Mosca key={k} x={480 + k * 300} y={880} t={t} k={k} />)}<Glow x={960} y={120} r={500} o={0.3} /></>,
  calle_ventanas: (t) => <><Bg a="#E9B07A" b="#E8D6B0" /><Casa x={-60} w={520} h={760} c="#9C6542" /><Casa x={1400} w={560} h={720} c="#B07A5A" />
    <g transform={`translate(380 ${300 + Math.min(1, t / 1.5) * 0})`}><rect x="-60" y="-80" width="120" height="140" fill="#3A2A22" /><g transform={`rotate(${-40 * eo(t / 0.8)} 30 -20)`}><Bacinilla x={40} y={-10} s={0.45} /></g></g>
    {t > 0.6 && <path d={`M420 300 Q470 ${300 + (t - 0.6) * 200} 500 ${Math.min(860, 300 + (t - 0.6) * 500)}`} stroke="#8A7A4E" strokeWidth="18" fill="none" opacity="0.8" />}
    <Suelo y={860} c="#8A6A4E" c2="#5E4434" /><Gente y={900} s={0.4} t={t} n={4} seed={2} pañuelo /></>,
  multitud: (t) => <><Bg a="#F2C38A" b="#E8D6B0" /><BlurG s={2.5}><Casa x={0} w={500} h={560} c="#B07A5A" /><Casa x={1420} w={500} h={600} c="#9C6542" /></BlurG><Suelo y={760} />
    {[0, 1, 2].map((r) => <Gente key={r} y={800 + r * 90} s={0.3 + r * 0.06} t={t} n={9 + r * 2} seed={r * 3} />)}</>,
  rio: (t) => <><Bg a="#E9C79A" b="#C8D7B0" /><BlurG s={2}><Casa x={60} w={400} h={420} c="#9C6542" y={640} /><Casa x={1400} w={460} h={460} c="#B07A5A" y={640} /></BlurG>
    <rect y="640" width={W} height="440" fill="#6E7A4E" />{Array.from({ length: 8 }).map((_, k) => <path key={k} d={`M${-100 + ((k * 260 + t * 60) % 2200)} ${700 + k * 45} q60 -12 120 0`} stroke="#8E9A62" strokeWidth="6" fill="none" />)}
    <rect y="620" width={W} height="30" fill="#8A6A4E" />{[0, 1, 2].map((k) => <Mosca key={k} x={700 + k * 250} y={600} t={t} k={k} />)}</>,
  aldea: (t) => <><Bg a="#F2C38A" b="#F3E3BB" /><Glow x={1500} y={240} r={300} c="#FFD27A" o={0.6} /><circle cx="1500" cy="240" r="70" fill="#FFE3A3" />
    <Suelo y={820} c="#C49A6C" c2="#9C7650" />{[300, 760, 1240].map((x, k) => <g key={x}><rect x={x} y="620" width="240" height="200" fill={['#B5845E', '#A86A4A', '#C9A26B'][k]} /><path d={`M${x - 30} 620 L${x + 120} 520 L${x + 270} 620Z`} fill="#7A5236" /><rect x={x + 90} y="700" width="60" height="120" fill="#4A3426" /></g>)}
    <Gente y={900} s={0.36} t={t} n={5} seed={4} /></>,
  parlamento: (t) => <><Bg a="#D9B48A" b="#E8D6B0" /><rect x="300" y="300" width="1320" height="560" fill="#C9A26B" />{Array.from({ length: 11 }).map((_, k) => <g key={k}><rect x={340 + k * 120} y="380" width="60" height="420" fill="#8A6A4E" />
    <path d={`M${340 + k * 120} 380 q30 ${200 + Math.sin(t * 2 + k) * 20} 0 420`} fill="#E9E2D0" opacity="0.85" /></g>)}<rect x="900" y="160" width="120" height="160" fill="#B5845E" /><Suelo y={860} c="#6E7A4E" c2="#4E5A36" />
    <Gente y={920} s={0.34} t={t} n={6} seed={1} pañuelo /></>,
  tunel: (t) => <><rect width={W} height={H} fill="#2A1F1A" />{Array.from({ length: 9 }).map((_, k) => { const s = 1 - k * 0.1; return <ellipse key={k} cx="960" cy="560" rx={760 * s} ry={520 * s} fill="none" stroke={k % 2 ? '#8A5A3B' : '#A86A4A'} strokeWidth={60 * s} />; })}
    <ellipse cx="960" cy="560" rx="120" ry="80" fill="#FFC27A" opacity="0.8" /><Glow x={960} y={560} r={360} c="#FFC27A" o={0.6} /><Gente y={900} s={0.3} t={t} n={4} seed={5} /></>,
  noche_trabajo: (t) => <><Bg a="#1E1B30" b="#2E2A44" /><circle cx="1500" cy="200" r="60" fill="#F3F1E6" /><Casa x={100} w={480} h={500} c="#4A3A5A" win="#FFC27A" techo="#2E2438" />
    <Suelo y={860} c="#3A2E2A" c2="#2A201C" /><Glow x={900} y={760} r={260} c="#FFC27A" o={0.65} /><rect x="880" y="700" width="40" height="60" rx="6" fill="#FFE3A3" />
    <Person x={1100} y={920} s={0.55} exp="serio" pose="sostiene" t={t} pin={false} {...HIST[0]} /><Person x={760} y={920} s={0.55} exp="cerrado" t={t} pin={false} {...HIST[3]} flip /></>,
  baño_moderno: (t) => <><Room wall={['#E9EEF1', '#D3DDE3']} floor={['#C9D2DA', '#AEB9C6']} fy={820} />{Array.from({ length: 12 }).map((_, k) => <rect key={k} x={k * 170} y="300" width="2" height="520" fill="#fff" opacity="0.6" />)}
    <Inodoro x={960} y={840} s={1.3} /><Planta x={1500} y={830} s={0.9} t={t} /><Glow x={960} y={120} r={500} c="#FFF4D6" o={0.4} /></>,
};
// ---------- objetos (pd) ----------
const OBJ = {
  baño_vacio: (t) => <><Room wall={['#E9EEF1', '#C9D6E0']} floor={['#B9C4CF', '#9AA6B4']} fy={800} /><rect x="840" y="620" width="240" height="200" fill="#9AA6B4" opacity="0.35" /><circle cx="960" cy="760" r="20" fill="#5B6676" />
    <text x="960" y="560" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="220" fill="#B9C4CF">?</text></>,
  hueco: (t) => <><Bokeh c="crema" t={t} /><ellipse cx="960" cy="600" rx="300" ry="120" fill="#3A2A22" /><ellipse cx="960" cy="590" rx="260" ry="90" fill="#1A120E" />{[0, 1, 2].map((k) => <Mosca key={k} x={860 + k * 100} y={480} t={t} k={k} />)}</>,
  bacteria: (t) => <><defs><radialGradient id="mic"><stop offset="0" stopColor="#F3F1D6" /><stop offset="1" stopColor="#C8D7A8" /></radialGradient></defs><rect width={W} height={H} fill="#111" /><circle cx="960" cy="540" r="460" fill="url(#mic)" />
    {Array.from({ length: 7 }).map((_, k) => <Bacteria key={k} x={760 + (k % 3) * 200} y={380 + Math.floor(k / 3) * 160} s={0.9 + (k % 2) * 0.3} t={t} />)}<Pill x={960} y={860} txt="VIBRIO CHOLERAE" size={26} /></>,
  rollo: (t) => <><Bokeh c="rosa" t={t} /><g transform={`scale(${1 + 0.02 * Math.sin(t * 2)})`}><Rollo x={900} y={560} s={1.4} /></g></>,
  bacinilla: (t) => <><Bokeh c="ambar" t={t} /><Bacinilla x={960} y={700} s={2} /><Glow x={1300} y={300} r={300} o={0.35} /></>,
  zapatos: (t) => <><Bokeh c="crema" t={t} />{[760, 1100].map((x) => <g key={x}><path d={`M${x - 160} 700 Q${x - 150} 600 ${x - 40} 600 L${x + 100} 640 L${x + 120} 700Z`} fill="#6B3E2A" /><rect x={x + 90} y="700" width="30" height="110" fill="#4A2A1C" /></g>)}<Charco x={960} y={820} w={420} /></>,
  gota: (t) => <><Bokeh c="verde" t={t} /><Gota x={960} y={620} s={2.4} />{Array.from({ length: 4 }).map((_, k) => <Bacteria key={k} x={880 + (k % 2) * 160} y={580 + Math.floor(k / 2) * 110} s={0.45} t={t} />)}</>,
  mapa_puntos: (t) => <><rect width={W} height={H} fill="#E8D7AE" />{Array.from({ length: 14 }).map((_, k) => <rect key={k} x={200 + (k % 7) * 230} y={200 + Math.floor(k / 7) * 380} width="180" height="300" fill="#D9C39A" />)}
    {Array.from({ length: 40 }).map((_, k) => { const a = k * 2.4, r = 30 + (k % 9) * 28; return <rect key={k} x={960 + Math.cos(a) * r} y={540 + Math.sin(a) * r * 0.8} width="16" height="16" fill="#1A1A1A" opacity={cl((t - k * 0.04) * 4)} />; })}
    <circle cx="960" cy="540" r="26" fill="#C8553D" /><Pill x={960} y={880} txt="BROAD STREET · LONDRES 1854" size={26} /></>,
  bomba: (t) => <><Bokeh c="crema" t={t} /><rect x="900" y="300" width="120" height="520" rx="20" fill="#3A4558" /><path d="M900 420 L760 420 L760 470 L900 470Z" fill="#3A4558" />
    <g transform={`translate(${eo((t - 0.8) / 0.6) * 260} ${-eo((t - 0.8) / 0.6) * 120}) rotate(${eo((t - 0.8) / 0.6) * 40} 1020 360)`}><rect x="1020" y="340" width="240" height="30" rx="15" fill="#5B6676" /></g><rect x="800" y="820" width="320" height="40" fill="#5B6676" /></>,
  planos: (t) => <><rect width={W} height={H} fill="#2E5B8A" />{Array.from({ length: 30 }).map((_, k) => <rect key={k} x={k * 66} y="0" width="2" height={H} fill="#fff" opacity="0.15" />)}
    <path d="M200 700 L800 700 L800 400 L1700 400" stroke="#fff" strokeWidth="10" fill="none" strokeDasharray="3000" strokeDashoffset={3000 * (1 - eo(t / 1.5))} /><path d="M500 700 L500 900 M1200 400 L1200 200" stroke="#fff" strokeWidth="6" fill="none" opacity="0.7" /></>,
  tubo: (t) => <><Bokeh c="azul" t={t} /><path d="M300 600 L1000 600 Q1200 600 1200 800 L1200 1080" stroke="#8A939C" strokeWidth="120" fill="none" /><path d="M300 600 L1000 600 Q1200 600 1200 800 L1200 1080" stroke="#AEB6BE" strokeWidth="40" fill="none" opacity="0.6" /></>,
  esponja: (t) => <><Bokeh c="ambar" t={t} /><g transform={`rotate(${-20 + Math.sin(t * 2) * 4} 960 600)`}><rect x="940" y="300" width="40" height="600" rx="10" fill="#8A5A3B" /><ellipse cx="960" cy="290" rx="110" ry="80" fill="#E9C46A" />{Array.from({ length: 12 }).map((_, k) => <circle key={k} cx={900 + (k % 4) * 40} cy={260 + Math.floor(k / 4) * 30} r="8" fill="#C9A24A" />)}</g></>,
  sifon: (t) => <><rect width={W} height={H} fill="#2E5B8A" /><path d="M500 300 L500 600 Q500 760 660 760 Q820 760 820 600 Q820 480 940 480 L1500 480" stroke="#fff" strokeWidth="14" fill="none" strokeDasharray="2600" strokeDashoffset={2600 * (1 - eo(t / 1.4))} />
    <Pill x={1200} y={300} txt="CUMMING · 1775" size={30} /><text x="660" y="880" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="80" fill="#FACA4F">S</text></>,
  inodoro_corte: (t) => <><Bokeh c="azul" t={t} /><Inodoro x={960} y={900} s={2} corte /><Pill x={1440} y={360} txt="AGUA QUE BLOQUEA EL OLOR" size={26} /></>,
  inodoro: (t) => <><Bokeh c="crema" t={t} /><Glow x={960} y={500} r={420} o={0.5} /><Inodoro x={960} y={900} s={2} /></>,
  trofeo: (t) => <><Bokeh c="ambar" t={t} /><Glow x={960} y={460} r={360} o={0.6} /><path d="M760 260 L1160 260 Q1160 560 960 600 Q760 560 760 260Z" fill="#E9B44A" /><rect x="920" y="600" width="80" height="140" fill="#C98E1E" /><rect x="820" y="740" width="280" height="60" rx="10" fill="#8A5A3B" />
    <text x="960" y="440" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="120" fill="#fff">1</text></>,
  cultivo: (t) => <><Bg a="#F2C38A" b="#E8D6B0" /><Suelo y={700} c="#6E8A4E" c2="#4E6A36" />{Array.from({ length: 40 }).map((_, k) => <path key={k} d={`M${60 + (k % 10) * 190} ${760 + Math.floor(k / 10) * 80} q10 -60 ${Math.sin(t + k) * 10} -90`} stroke="#3E8E5A" strokeWidth="10" fill="none" />)}
    <Person x={1300} y={900} s={0.5} exp="sonrisa" pose="sostiene" t={t} pin={false} {...HIST[1]} /></>,
};
// ---------- fichas de fuente (sepia) ----------
const FICHA = {
  edimburgo: ['EDIMBURGO · SIGLO XVIII', 'Bacinillas vaciadas por la ventana', 'calle_ventanas'], snow: ['JOHN SNOW · LONDRES 1854', 'Mapa de los casos de cólera', 'mapa_puntos'],
  hedor: ['EL GRAN HEDOR · LONDRES 1858', 'El río Támesis en verano', 'rio'], roma: ['ROMA ANTIGUA', 'Letrinas públicas con agua corriente', 'roma'],
  harington: ['JOHN HARINGTON · 1596', 'Inodoro con descarga para Isabel I', 'inodoro'], gong: ['INGLATERRA TUDOR · SIGLO XVI', 'Los "gong farmers" limpiaban pozos negros', 'noche_trabajo'],
  edo: ['JAPÓN · PERÍODO EDO', 'Los desechos se vendían como abono', 'cultivo'], bmj: ['BRITISH MEDICAL JOURNAL · 2007', 'El saneamiento, mayor avance médico desde 1840', 'trofeo'],
};
const Roma = ({ t }) => <><Bg a="#E9C79A" b="#D9B48A" /><rect x="200" y="420" width="1520" height="80" fill="#C9A26B" />{Array.from({ length: 8 }).map((_, k) => <g key={k}><rect x={260 + k * 190} y="500" width="120" height="60" rx="30" fill="#F3E3BB" /><ellipse cx={320 + k * 190} cy="530" rx="26" ry="14" fill="#3A2A22" /></g>)}
  <rect x="200" y="560" width="1520" height="300" fill="#B5845E" /><rect x="200" y="700" width="1520" height="40" fill="#7CA8B8" />{Array.from({ length: 6 }).map((_, k) => <rect key={k} x={260 + k * 260} y="200" width="60" height="220" fill="#E8D6B0" />)}</>;
const Ficha = ({ id, t }) => { const [titulo, sub, esc] = FICHA[id] || ['FUENTE', '', 'rio']; const inner = esc === 'roma' ? <Roma t={t} /> : (LUG[esc] || OBJ[esc] || LUG.rio)(t);
  return <><Bokeh c="crema" t={t} /><g transform={`translate(${W / 2} ${H / 2 - 30}) scale(${0.9 + 0.04 * eo(t / 0.4)})`}>
    <rect x="-720" y="-420" width="1440" height="820" rx="18" fill="#13182A" stroke="#E3C584" strokeWidth="4" />
    <defs><filter id="sepia"><feColorMatrix type="matrix" values="0.39 0.77 0.19 0 0  0.35 0.69 0.17 0 0  0.27 0.53 0.13 0 0  0 0 0 1 0" /></filter><clipPath id="fc"><rect x="-680" y="-380" width="1360" height="600" rx="8" /></clipPath></defs>
    <g clipPath="url(#fc)"><g filter="url(#sepia)" transform="translate(-680 -380) scale(0.7083 0.5556)">{inner}</g>
      {Array.from({ length: 6 }).map((_, k) => <rect key={k} x={-680 + ((k * 263 + t * 400) % 1360)} y="-380" width="2" height="600" fill="#fff" opacity="0.25" />)}</g>
    <text x="0" y="300" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="44" fill="#FACA4F" letterSpacing="4">{titulo}</text>
    <text x="0" y="360" textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="30" fill="#E8DCC4">{sub}</text></g></>; };
// ---------- plantillas ----------
const EXPS = ['neutral', 'serio', 'esceptico', 'sorprendido', 'preocupado', 'pensativo', 'sonrisa', 'cerrado'];
const tpl = (v, t, d, k) => {
  const [p, a, b] = v.split(':');
  if (p === 'pg') { const L = LUG[a] || LUG.calle_sucia; const xeno = a !== 'noche_trabajo' && a !== 'parlamento';
    return { bg: L(t), fg: xeno ? <Xeno x={k % 2 ? 1400 : 560} y={a === 'baño_moderno' ? 1000 : 960} s={a.startsWith('cuarto') ? 0.75 : 0.62} exp={b === 'despierta' ? (t > 0.6 ? 'sorprendido' : 'cerrado') : ['preocupado', 'esceptico', 'neutral'][k % 3]} t={t} look={k % 2 ? -5 : 5} /> : null, focal: [k % 2 ? 1400 : 560, 700] }; }
  if (p === 'pp') { const exp = EXPS.includes(a) ? a : 'neutral'; const pose = a === 'pensativo' ? 'pensando' : a === 'explica' ? 'explica' : a === 'asustado' ? 'shock' : 'normal';
    return { bg: <Bokeh c={b} t={t} />, fg: <><Glow x={k % 2 ? 1300 : 620} y={300} r={360} o={0.3} /><Xeno x={k % 2 ? 1180 : 760} y={1480} s={2.1} exp={a === 'asustado' ? 'preocupado' : a === 'explica' ? 'sonrisa' : exp} pose={pose} t={t} /></>, focal: [k % 2 ? 1180 : 760, 360] }; }
  if (p === 'pd') return { bg: (OBJ[a] || OBJ.inodoro)(t), fg: null, focal: [960, 560] };
  if (p === 'inf') return { bg: <><Bokeh c="azul" t={t} /><Polvo t={t} /></>, fg: <g transform={`translate(960 520) scale(${pop(t, 0.1)})`}>
      <text y="40" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={a.length > 8 ? 150 : 220} fill="#FACA4F" stroke="#0E111F" strokeWidth="10" paintOrder="stroke">{a}</text>
      <g transform="translate(0 170)"><Pill x={0} y={0} txt={(b || '').toUpperCase()} c="#fff" size={40} /></g></g>, focal: [960, 540] };
  if (p === 'card') return { bg: <><Bokeh c="rosa" t={t} /><Polvo t={t} /></>, fg: <g transform={`translate(960 520) scale(${0.92 + 0.08 * eo(t / 0.5)})`} opacity={eo(t / 0.25)}>
      <rect x="-520" y="-230" width="1040" height="460" rx="26" fill="#0E111F" opacity="0.92" stroke="#E3C584" strokeWidth="4" />
      <text y="-90" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="44" fill="#E3C584" letterSpacing="10">ESCENARIO</text>
      <text y="80" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="190" fill="#fff">{a}</text>
      <g transform="translate(0 165)"><Pill x={0} y={0} txt={b} c="#FACA4F" size={38} /></g></g>, focal: [960, 540], card: true };
  if (p === 'ficha') return { bg: <Ficha id={a} t={t} />, fg: null, focal: [960, 500] };
  if (p === 'tit') return { bg: <><Bg a="#3A2A22" b="#1E1612" />{Array.from({ length: 24 }).map((_, k) => <g key={k}><rect x={120 + (k % 6) * 290} y={120 + Math.floor(k / 6) * 220} width="260" height="190" rx="8" fill={k === 14 ? '#C98B52' : '#8A5A3B'} />
      <rect x={210 + (k % 6) * 290} y={200 + Math.floor(k / 6) * 220} width="80" height="16" rx="8" fill="#E3C584" /></g>)}<Glow x={960} y={560} r={500} c="#FFC27A" o={0.4} /></>,
    fg: <g opacity={eo((t - 0.4) / 0.4)}><rect x="360" y="380" width="1200" height="320" rx="20" fill="#0E111F" opacity="0.9" stroke="#E3C584" strokeWidth="4" />
      <text x="960" y="460" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="36" fill="#E3C584" letterSpacing="8">ARCHIVO ¿Y SI?</text>
      <text x="960" y="560" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="64" fill="#fff">¿QUÉ PASARÍA SI NUNCA SE</text>
      <text x="960" y="640" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="64" fill="#fff">HUBIERA INVENTADO EL INODORO?</text></g>, focal: [960, 540], card: true };
  return { bg: <Bokeh t={t} />, fg: null, focal: [960, 540] };
};

// ---------- tiempo de cada plano (por frase, con subplanos de ~2,1 s y corte 0,15 s antes de la frase) ----------
const planesOf = (sc) => {
  const P = sc.planos || []; const words = sc.words || []; const d = sc.frames / 30;
  const tot = P.reduce((s, p) => s + p.f.split(/\s+/).length, 0) || 1; let acc = 0;
  const starts = P.map((p, i) => { const idx = Math.min(words.length - 1, Math.round(acc * words.length / tot)); acc += p.f.split(/\s+/).length; return i === 0 ? 0 : Math.max(0, (words[idx] ? words[idx][1] : 0) - 0.15); });
  const out = [];
  P.forEach((p, i) => { const a = starts[i], b = i + 1 < P.length ? starts[i + 1] : d, dur = b - a; const card = p.v.startsWith('card') || p.v === 'tit' || p.v.startsWith('inf');
    const n = card ? 1 : Math.max(1, Math.round(dur / 2.1));
    for (let j = 0; j < n; j++) out.push({ v: p.v, f: p.f, i, j, a: a + dur * j / n, b: a + dur * (j + 1) / n }); });
  return out;
};
const PRESET = [[1.0, 0, 0], [1.22, 1, -0.3], [1.12, -1, 0.2], [1.3, 0.6, -0.5]];
const Subs = ({ sc, t, pl }) => {
  const words = sc.words || []; if (!pl || !words.length) return null;
  const P = sc.planos; const tot = P.reduce((s, p) => s + p.f.split(/\s+/).length, 0); let acc = 0, a0 = 0, n = 0;
  P.forEach((p, i) => { const c = p.f.split(/\s+/).length; if (i === pl.i) { a0 = acc; n = c; } acc += c; });
  const fw = pl.f.split(/\s+/); const r = words.length / tot;
  let cur = 0; for (let k = 0; k < n; k++) { const wi = Math.min(words.length - 1, Math.round((a0 + k) * r)); if (words[wi] && t >= words[wi][1] - 0.05) cur = k; }
  const g = Math.floor(cur / 8) * 8; const chunk = fw.slice(g, g + 8);
  return <div style={{ position: 'absolute', top: 1002 - 46, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 46, lineHeight: 1.15, color: '#fff', textShadow: '0 3px 10px rgba(0,0,0,0.85), 0 0 2px rgba(0,0,0,0.9)', padding: '0 220px', boxSizing: 'border-box' }}>
    {chunk.map((w, j) => <span key={j} style={{ color: g + j === cur ? '#FACA4F' : '#fff', marginRight: 14 }}>{w}</span>)}</div>;
};
const Hud = ({ p, t }) => <>
  {p.esc && <div style={{ position: 'absolute', left: 48, top: 34, padding: '10px 24px', borderRadius: 30, background: 'rgba(14,17,31,0.85)', border: '2px solid #E3C584', color: '#fff', fontFamily: FONT, fontWeight: 900, fontSize: 22, letterSpacing: 2.6 }}>{p.esc}</div>}
  {p.med !== null && p.med !== undefined && <div style={{ position: 'absolute', right: 48, top: 34, width: 300, padding: '10px 18px', borderRadius: 18, background: 'rgba(14,17,31,0.85)', border: '2px solid #E3C584', fontFamily: FONT, color: '#fff' }}>
    <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: 2.4 }}>OLORÓMETRO <span style={{ float: 'right', color: p.med >= 60 ? '#FF7A59' : '#7CE0A0' }}>{p.med}%</span></div>
    <div style={{ marginTop: 8, height: 12, borderRadius: 6, background: '#2A2F45' }}><div style={{ height: 12, borderRadius: 6, width: `${Math.max(3, p.med)}%`, background: p.med >= 60 ? 'linear-gradient(90deg,#FACA4F,#FF7A59)' : 'linear-gradient(90deg,#7CE0A0,#FACA4F)' }} /></div></div>}
</>;

const Scene = ({ i, at }) => {
  const f0 = useCurrentFrame(); const sc = D[i];
  const f = at !== undefined ? Math.round(sc.frames * at) : f0; const t = f / 30, d = sc.frames / 30;
  const pls = planesOf(sc); const pl = pls.find((x) => t >= x.a && t < x.b) || pls[pls.length - 1];
  const k = pls.indexOf(pl), lt = t - pl.a, ld = pl.b - pl.a;
  const S = tpl(pl.v, lt + pl.j * 0.7, ld, pl.i + pl.j);
  const pre = S.card ? [1, 0, 0] : PRESET[(pl.j + pl.i) % PRESET.length];
  const dir = (k + i) % 5 === 4 ? 0 : ((k + i) % 2 ? -1 : 1);
  const z = pre[0] * (1 + dir * 0.03 * ld * eo(lt / ld));
  const [fx, fy] = S.focal || [960, 540];
  const cx = W / 2 + (W / 2 - fx) * (pre[0] - 1) * 0.6 * (pre[1] ? 1 : 0), cy = H / 2 + (H / 2 - fy) * (pre[0] - 1) * 0.5;
  const flash = sc.p && sc.p.flash ? Math.max(0, 1 - f / 9) : 0;
  return <AbsoluteFill style={{ background: '#1E1612', overflow: 'hidden' }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute' }}>
      <g transform={`translate(${cx} ${cy}) scale(${z}) translate(${-W / 2} ${-H / 2})`}>{S.bg}{S.fg}</g>
      <Grade c="#FFB46B" o={0.14} /><Vignette o={0.48} /><Grain o={0.06} seed={i} />
      {flash > 0 && <rect width={W} height={H} fill="#fff" opacity={flash} />}
    </svg>
    <Hud p={sc.p || {}} t={t} />
    {!S.card && <Subs sc={sc} t={t} pl={pl} />}
  </AbsoluteFill>;
};
const Sheet = ({ at }) => { const f = useCurrentFrame(); return <Scene i={f % D.length} at={at} />; };
registerRoot(() => <>
  {D.map((sc, i) => <Composition key={i} id={`V26-${String(i).padStart(2, '0')}`} component={Scene} defaultProps={{ i }} durationInFrames={sc.frames} fps={30} width={W} height={H} />)}
  <Composition id="SHEET" component={Sheet} defaultProps={{ at: 0.5 }} durationInFrames={D.length} fps={30} width={W} height={H} />
</>);
