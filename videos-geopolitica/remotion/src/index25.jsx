// v25 · ¿Qué pasaría si te congelaran 1.000 años? — estilo 2D Xeno (16:9), HUD de escenario, fichas de dato real y subtítulos.
import React from 'react';
import { registerRoot, Composition, useCurrentFrame, AbsoluteFill } from 'remotion';
import D from './data25.json';
import { Person, Xeno, Head, FUT, OUT } from './xeno.jsx';

const W = 1920, H = 1080;
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x) => { x = cl(x); return x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2; };
const pop = (t, at, d = 0.35) => { const u = cl((t - at) / d); return u <= 0 ? 0 : 1 + Math.sin(u * Math.PI) * 0.12 * (1 - u) + (u < 1 ? (u - 1) * 0.0 : 0); };
const app = (t, at, d = 0.3) => ease((t - at) / d);
const FONT = 'Inter Display, Inter, Arial, sans-serif';

// ---------- piezas de escenario ----------
const Sky = ({ a, b }) => <><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient></defs><rect width={W} height={H} fill="url(#sky)" /></>;
const Floor = ({ y = 860, c = '#C9D2DC', c2 }) => <><rect y={y} width={W} height={H - y} fill={c} />{c2 && <rect y={y} width={W} height="10" fill={c2} />}</>;
const Cloud = ({ x, y, s = 1, o = 0.9 }) => <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o} fill="#fff">
  <ellipse cx="0" cy="0" rx="90" ry="38" /><ellipse cx="60" cy="-22" rx="60" ry="40" /><ellipse cx="-50" cy="-14" rx="50" ry="32" /></g>;
const Blur = ({ id = 'bl', s = 3 }) => <defs><filter id={id}><feGaussianBlur stdDeviation={s} /></filter></defs>;
const Monserrate = ({ fut }) => <g>
  <path d="M-40 760 L260 520 L420 600 L640 380 L820 470 L1000 300 L1180 430 L1400 330 L1640 470 L1960 380 L1960 800 L-40 800Z" fill={fut ? '#4C7A6B' : '#3F6E52'} />
  <path d="M-40 800 L300 640 L520 700 L760 560 L1000 640 L1240 560 L1500 650 L1960 560 L1960 840 L-40 840Z" fill={fut ? '#5E9283' : '#4F8460'} />
  <g transform="translate(985 262)"><rect x="-26" y="0" width="52" height="40" fill="#F4EFE6" stroke={OUT} strokeWidth="3" /><path d="M-30 0 L0 -26 L30 0Z" fill="#C8553D" stroke={OUT} strokeWidth="3" />
    <rect x="-8" y="-58" width="16" height="34" fill="#F4EFE6" stroke={OUT} strokeWidth="3" /><path d="M0 -76 L0 -58 M-6 -70 L6 -70" stroke={OUT} strokeWidth="3" /></g>
</g>;
const Edificio = ({ x, w, h, c, y = 860, win = '#F6D77A', fut }) => <g>
  <rect x={x} y={y - h} width={w} height={h} fill={c} stroke={OUT} strokeWidth="3" rx={fut ? 18 : 2} />
  {Array.from({ length: Math.floor((h - 40) / 46) }).map((_, r) => Array.from({ length: Math.floor((w - 20) / 36) }).map((_, k) =>
    <rect key={`${r}-${k}`} x={x + 16 + k * 36} y={y - h + 22 + r * 46} width="20" height="26" rx={fut ? 6 : 1} fill={(r * 7 + k * 3) % 5 ? win : '#2C3446'} opacity="0.9" />))}
  {fut && <><ellipse cx={x + w / 2} cy={y - h} rx={w / 2 + 6} ry="14" fill="#67C587" stroke={OUT} strokeWidth="3" /><circle cx={x + w / 2 - 20} cy={y - h - 12} r="16" fill="#4FAF6E" /><circle cx={x + w / 2 + 16} cy={y - h - 16} r="20" fill="#5CBF7C" /></>}
</g>;
const Capsula = ({ x = 960, y = 870, s = 1, frost = 0.4, fill = 0, open = 0, inner }) => <g transform={`translate(${x} ${y}) scale(${s})`}>
  <rect x="-170" y="-40" width="340" height="60" rx="16" fill="#5B6B80" stroke={OUT} strokeWidth="5" />
  <rect x="-140" y="-620" width="280" height="590" rx="140" fill="#DCEFF7" opacity="0.35" stroke={OUT} strokeWidth="5" />
  <g>{inner}</g>
  {fill > 0 && <rect x="-136" y={-36 - 580 * fill} width="272" height={580 * fill} rx="40" fill="#5CC8F0" opacity="0.45" />}
  <rect x="-140" y="-620" width="280" height="590" rx="140" fill="none" stroke={OUT} strokeWidth="6" />
  <path d="M-110 -520 Q-120 -320 -100 -120" stroke="#fff" strokeWidth="10" opacity="0.6" fill="none" strokeLinecap="round" />
  {Array.from({ length: 22 }).map((_, k) => <circle key={k} cx={-120 + ((k * 53) % 240)} cy={-60 - ((k * 97) % 520)} r={6 + (k % 4) * 3} fill="#fff" opacity={frost * (0.4 + (k % 3) * 0.2)} />)}
  <rect x="-60" y="-680" width="120" height="70" rx="12" fill="#5B6B80" stroke={OUT} strokeWidth="5" /><circle cx="0" cy="-645" r="14" fill="#5CC8F0" stroke={OUT} strokeWidth="3" />
</g>;
const Papel = ({ x, y, w = 520, h = 680, r = 0, lines = 14, children }) => <g transform={`translate(${x} ${y}) rotate(${r})`}>
  <rect x={-w / 2 + 10} y={-h / 2 + 12} width={w} height={h} rx="10" fill="#000" opacity="0.18" />
  <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="10" fill="#FBF8F1" stroke={OUT} strokeWidth="4" />
  <rect x={-w / 2 + 40} y={-h / 2 + 40} width={w * 0.55} height="22" rx="6" fill="#2E3646" />
  {Array.from({ length: lines }).map((_, k) => <rect key={k} x={-w / 2 + 40} y={-h / 2 + 100 + k * 34} width={(w - 80) * (0.7 + ((k * 37) % 30) / 100)} height="10" rx="5" fill="#C9CED6" />)}
  {children}
</g>;
const Snow = ({ t, n = 40, c = '#fff', o = 0.7 }) => <g>{Array.from({ length: n }).map((_, k) => {
  const x = (k * 197) % W, sp = 30 + (k % 5) * 14, y = ((k * 131) + t * sp) % (H + 40) - 20;
  return <circle key={k} cx={x + Math.sin(t + k) * 12} cy={y} r={2 + (k % 3)} fill={c} opacity={o} />;
})}</g>;
const BigText = ({ x = 960, y = 540, txt, size = 150, c = '#FFD23F', t, at = 0.2, stroke = 12 }) => {
  const s = pop(t, at); if (!s) return null;
  return <text x={x} y={y} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={size} fill={c} stroke={OUT} strokeWidth={stroke} paintOrder="stroke" transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}>{txt}</text>;
};
const Moneda = ({ x, y, r = 40 }) => <g><circle cx={x} cy={y} r={r} fill="#F2B134" stroke={OUT} strokeWidth="4" /><circle cx={x} cy={y} r={r * 0.72} fill="none" stroke="#C98E1E" strokeWidth="4" />
  <text x={x} y={y + r * 0.35} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={r} fill="#8A5A0C">$</text></g>;
const Billete = ({ x, y, s = 1, r = 0 }) => <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
  <rect x="-110" y="-50" width="220" height="100" rx="10" fill="#8CCB8A" stroke={OUT} strokeWidth="4" /><circle cx="0" cy="0" r="30" fill="#BDE3B6" stroke={OUT} strokeWidth="3" />
  <text x="0" y="12" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="34" fill="#2F6B2D">100</text></g>;
const Rana = ({ x, y, s = 1, frozen = 0, t }) => <g transform={`translate(${x} ${y}) scale(${s})`}>
  <ellipse cx="0" cy="40" rx="150" ry="20" fill="#000" opacity="0.15" />
  <path d="M-130 30 Q-140 -60 -60 -90 Q0 -110 60 -90 Q140 -60 130 30Z" fill={frozen > 0.5 ? '#9CC9D9' : '#6DBA5C'} stroke={OUT} strokeWidth="5" />
  <path d="M-150 34 Q-170 0 -120 -6 M150 34 Q170 0 120 -6" stroke={OUT} strokeWidth="5" fill={frozen > 0.5 ? '#9CC9D9' : '#6DBA5C'} />
  {[-60, 60].map((ex) => <g key={ex}><circle cx={ex} cy="-96" r="34" fill={frozen > 0.5 ? '#9CC9D9' : '#6DBA5C'} stroke={OUT} strokeWidth="5" />
    <circle cx={ex} cy="-98" r="20" fill="#fff" /><circle cx={ex + 4} cy="-96" r={frozen > 0.5 ? 2 : 10} fill={OUT} /></g>)}
  <path d="M-50 -20 Q0 10 50 -20" stroke={OUT} strokeWidth="5" fill="none" strokeLinecap="round" />
  {frozen > 0 && <rect x="-200" y="-170" width="400" height="230" rx="30" fill="#CFEFFF" opacity={0.5 * frozen} stroke="#fff" strokeWidth="6" />}
</g>;
const Tardigrado = ({ x, y, s = 1, t }) => <g transform={`translate(${x} ${y}) scale(${s})`}>
  {[-90, -30, 30, 90].map((lx, k) => <g key={lx}><path d={`M${lx} 30 L${lx - 6} ${70 + Math.sin(t * 6 + k) * 6}`} stroke={OUT} strokeWidth="26" strokeLinecap="round" /><path d={`M${lx} 30 L${lx - 6} ${70 + Math.sin(t * 6 + k) * 6}`} stroke="#E7C9A9" strokeWidth="16" strokeLinecap="round" /></g>)}
  <path d="M-150 10 Q-160 -70 -60 -80 Q60 -95 140 -50 Q190 -20 160 30 Q60 60 -60 50 Q-150 50 -150 10Z" fill="#EBD2B5" stroke={OUT} strokeWidth="5" />
  {[-90, -30, 30, 90].map((rx) => <path key={rx} d={`M${rx} -78 Q${rx + 6} -20 ${rx} 46`} stroke="#D2B595" strokeWidth="4" fill="none" />)}
  <circle cx="170" cy="-10" r="22" fill="#EBD2B5" stroke={OUT} strokeWidth="5" /><circle cx="178" cy="-14" r="4" fill={OUT} /><circle cx="172" cy="-30" r="4" fill={OUT} />
</g>;
const Gusano = ({ x, y, s = 1, t }) => <g transform={`translate(${x} ${y}) scale(${s})`}>
  <path d={`M-160 0 Q-80 ${-40 + Math.sin(t * 3) * 20} 0 0 T160 0`} stroke={OUT} strokeWidth="34" fill="none" strokeLinecap="round" />
  <path d={`M-160 0 Q-80 ${-40 + Math.sin(t * 3) * 20} 0 0 T160 0`} stroke="#F2C6C6" strokeWidth="22" fill="none" strokeLinecap="round" />
  <circle cx="156" cy="-4" r="3.5" fill={OUT} />
</g>;
const Tanque = ({ x, y, s = 1 }) => <g transform={`translate(${x} ${y}) scale(${s})`}>
  <rect x="-70" y="-300" width="140" height="300" rx="60" fill="#C8D0DA" stroke={OUT} strokeWidth="5" />
  <rect x="-70" y="-200" width="140" height="22" fill="#9AA6B4" /><rect x="-30" y="-330" width="60" height="36" rx="8" fill="#8892A0" stroke={OUT} strokeWidth="4" />
  <text x="0" y="-120" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="28" fill="#2E3646">N₂</text></g>;
const Estante = ({ x, y, w = 600, rows = 5, seed = 0 }) => <g transform={`translate(${x} ${y})`}>
  <rect x="0" y="0" width={w} height={rows * 110 + 20} fill="#3A4558" stroke={OUT} strokeWidth="4" />
  {Array.from({ length: rows }).map((_, r) => <g key={r}><rect x="0" y={r * 110 + 100} width={w} height="14" fill="#56637A" />
    {Array.from({ length: Math.floor(w / 90) }).map((_, k) => <rect key={k} x={16 + k * 90} y={r * 110 + 30} width="70" height="70" rx="6" fill={['#7FA7C9', '#9AB8D6', '#6E93B8', '#B7CDE3'][(r + k + seed) % 4]} stroke={OUT} strokeWidth="3" />)}</g>)}
</g>;
const Cel = ({ x, y, r = 300, t, cris = 0 }) => <g transform={`translate(${x} ${y})`}>
  <circle r={r} fill="#F7B8C4" stroke={OUT} strokeWidth="6" /><circle r={r * 0.3} cx={-40} cy={-30} fill="#D9849A" stroke={OUT} strokeWidth="5" />
  {Array.from({ length: 9 }).map((_, k) => { const a = k * 0.7, L = r * 0.95 * cris; return <path key={k} d={`M${Math.cos(a) * r * 0.2} ${Math.sin(a) * r * 0.2} L${Math.cos(a) * L} ${Math.sin(a) * L} L${Math.cos(a + 0.08) * L * 0.8} ${Math.sin(a + 0.08) * L * 0.8}Z`} fill="#fff" stroke="#8FD3F5" strokeWidth="4" />; })}
  {cris > 0.8 && <path d={`M${r * 0.7} ${-r * 0.7} L${r * 0.5} ${-r * 0.3} L${r * 0.8} ${-r * 0.1}`} stroke={OUT} strokeWidth="6" fill="none" />}
</g>;
const Tierra = ({ x, y, r = 160 }) => <g transform={`translate(${x} ${y})`}><circle r={r} fill="#3D8BD6" stroke={OUT} strokeWidth="5" />
  <path d={`M${-r * 0.5} ${-r * 0.4} q40 -30 80 0 t40 50 q-30 40 -70 20 t-50 -70Z`} fill="#5DBB63" /><path d={`M${r * 0.1} ${r * 0.1} q50 -10 70 30 t-20 60 q-40 0 -50 -40Z`} fill="#5DBB63" /></g>;
const Luna = ({ x, y, r = 60 }) => <g transform={`translate(${x} ${y})`}><circle r={r} fill="#D9DCE3" stroke={OUT} strokeWidth="5" /><circle cx={-r * 0.3} cy={-r * 0.2} r={r * 0.2} fill="#BFC4CE" /><circle cx={r * 0.3} cy={r * 0.3} r={r * 0.14} fill="#BFC4CE" /></g>;
const Burbuja = ({ x, y, w, h, txt, size = 44, t, at = 0 }) => { const s = pop(t, at); if (!s) return null;
  return <g transform={`translate(${x} ${y}) scale(${s})`}><rect x={-w / 2} y={-h / 2} width={w} height={h} rx="30" fill="#fff" stroke={OUT} strokeWidth="5" />
    <path d={`M-20 ${h / 2 - 2} L-40 ${h / 2 + 40} L20 ${h / 2 - 2}Z`} fill="#fff" stroke={OUT} strokeWidth="5" strokeLinejoin="round" /><rect x="-26" y={h / 2 - 6} width="50" height="10" fill="#fff" />
    <text y={size * 0.35} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={size} fill={OUT}>{txt}</text></g>; };
const Fondo = ({ c = '#1B2440', c2 = '#0F1424' }) => <><defs><radialGradient id="fd" cx="50%" cy="45%" r="75%"><stop offset="0" stopColor={c} /><stop offset="1" stopColor={c2} /></radialGradient></defs><rect width={W} height={H} fill="url(#fd)" /></>;
const Lab = () => <><rect width={W} height={H} fill="#DCE5EC" /><rect y="0" width={W} height="90" fill="#C7D3DD" />
  {[200, 760, 1320].map((x) => <rect key={x} x={x} y="20" width="400" height="40" rx="20" fill="#F6FBFF" opacity="0.9" />)}
  <Floor y={880} c="#AEB9C6" c2="#97A3B1" /><rect x="1450" y="420" width="300" height="460" rx="10" fill="#C2CDD8" stroke={OUT} strokeWidth="4" />
  <rect x="1480" y="460" width="240" height="140" rx="8" fill="#2E3646" /><path d="M1500 560 L1550 520 L1600 545 L1650 490 L1700 510" stroke="#5CC8F0" strokeWidth="5" fill="none" /></>;
const Boveda = ({ t }) => <><Fondo c="#24344F" c2="#0B1222" />
  <path d="M0 0 L760 300 L1160 300 L1920 0Z" fill="#1A2740" /><path d="M0 1080 L760 760 L1160 760 L1920 1080Z" fill="#18233A" />
  <Estante x={60} y={170} w={540} seed={1} /><Estante x={1320} y={170} w={540} seed={2} />
  <rect x="760" y="300" width="400" height="460" fill="#2F4363" /><rect x="900" y="420" width="120" height="340" fill="#9FD8FF" opacity="0.35" />
  <Snow t={t} n={30} o={0.35} /></>;

// ---------- escenas (devuelven capas: bg con parallax y fg) ----------
const SC = {
  gancho_capsula: ({ t, d }) => ({ bg: <Lab />, fg: <>
    <Capsula x={760} frost={0.3} inner={<Xeno x={0} y={-40} s={0.92} exp={t > d * 0.55 ? 'serio' : 'neutral'} t={t} />} />
    <g opacity={app(t, 0.3)}><Billete x={1250} y={420 - app(t, 0.3, 0.8) * 60} s={1.3} r={-8} /></g>
    <g opacity={app(t, d * 0.45)}><Papel x={1300} y={720} w={360} h={440} r={6} lines={9}>
      <path d={`M-110 150 q30 -40 50 0 t50 0 t60 -10`} stroke="#2E5BD6" strokeWidth="6" fill="none" strokeDasharray="400" strokeDashoffset={400 * (1 - app(t, d * 0.5, 0.8))} /></Papel></g>
  </> }),
  despierta: ({ t }) => ({ bg: <Fondo c="#203556" c2="#070B16" />, fg: <>
    <g transform="translate(960 600) scale(2.6) translate(-200 -110)"><Head exp={t > 0.7 ? 'sorprendido' : 'cerrado'} t={t} /></g>
    <Snow t={t} n={50} o={0.6} />
  </> }),
  bogota_3026: ({ t }) => ({ bg: <><Sky a="#7FD3E6" b="#E9F7F2" /><Cloud x={300} y={160} /><Cloud x={1500} y={120} s={1.2} /><Monserrate fut /></>, fg: <>
    {[[80, 220, 520, '#7A6FF0'], [330, 180, 640, '#E86A92'], [560, 240, 420, '#3FB8AF'], [1180, 220, 560, '#F2B134'], [1430, 200, 700, '#7A6FF0'], [1660, 230, 480, '#3FB8AF']].map(([x, w, h, c]) => <Edificio key={x} x={x} w={w} h={h} c={c} fut win="#DFF6FF" />)}
    <Floor y={860} c="#5A6B80" c2="#9EE7FF" />
    {[0, 1, 2].map((k) => { const x = ((t * (180 + k * 60) + k * 700) % 2400) - 240; return <g key={k} transform={`translate(${x} ${260 + k * 90})`}><ellipse rx="70" ry="22" fill={['#FF7A59', '#F4F4F6', '#FFD23F'][k]} stroke={OUT} strokeWidth="4" /><ellipse cx="10" cy="-14" rx="30" ry="14" fill="#9EE7FF" stroke={OUT} strokeWidth="3" /></g>; })}
    <Xeno x={960} y={940} s={0.62} exp="sorprendido" t={t} />
    <Person x={1260} y={940} s={0.56} exp="neutral" t={t} pin={false} {...FUT[0]} />
  </> }),
  pregunta: ({ t }) => ({ bg: <Fondo />, fg: <>
    <BigText x={960} y={720} txt="?" size={720} c="#2E3E5C" t={t} at={0} stroke={0} />
    <Xeno x={960} y={980} s={1.25} exp="pensativo" pose="pensando" t={t} />
  </> }),
  contrato: ({ t, d }) => ({ bg: <Fondo c="#2B3A57" />, fg: <>
    <Papel x={960} y={560} w={640} h={820} lines={16}>
      <rect x="-280" y="300" width="560" height="60" rx="8" fill="#FFD23F" opacity={0.25 + 0.5 * app(t, d * 0.4)} />
      <text x="0" y="338" textAnchor="middle" fontFamily={FONT} fontSize="18" fill="#7A818C">…despertado solo cuando…</text>
    </Papel>
    <circle cx="960" cy="890" r={80 * app(t, d * 0.45)} fill="none" stroke="#FF4D4D" strokeWidth="10" />
  </> }),
  bogota_2026: ({ t }) => ({ bg: <><Sky a="#9CC9E8" b="#E8F1F6" /><Cloud x={400} y={180} /><Cloud x={1400} y={140} s={0.9} /><Monserrate /></>, fg: <>
    {[[60, 240, 420], [320, 200, 520], [1300, 260, 460], [1580, 220, 560]].map(([x, w, h]) => <Edificio key={x} x={x} w={w} h={h} c="#B5543A" win="#F3E3C3" />)}
    <rect x="560" y="520" width="700" height="340" fill="#E9E4DA" stroke={OUT} strokeWidth="4" /><rect x="600" y="560" width="620" height="90" rx="8" fill="#2E5BD6" />
    <text x="910" y="622" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="38" fill="#fff">LABORATORIO HIELO ANDINO</text>
    <rect x="640" y="690" width="240" height="170" fill="#9FD8FF" stroke={OUT} strokeWidth="4" /><rect x="940" y="680" width="260" height="120" rx="8" fill="#FFD23F" stroke={OUT} strokeWidth="4" />
    <text x="1070" y="730" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="30" fill={OUT}>VOLUNTARIOS</text>
    <text x="1070" y="776" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="38" fill="#2F6B2D">US$100</text>
    <Floor y={860} c="#8C939C" c2="#B9BFC6" />
    <g transform={`translate(${((t * 220) % 2600) - 600} 0)`}><rect x="0" y="890" width="520" height="130" rx="20" fill="#D52B1E" stroke={OUT} strokeWidth="5" />
      {[30, 130, 230, 330, 430].map((wx) => <rect key={wx} x={wx} y="905" width="70" height="50" rx="6" fill="#BFE6F2" />)}<circle cx="110" cy="1025" r="26" fill={OUT} /><circle cx="420" cy="1025" r="26" fill={OUT} /></g>
    <Xeno x={1420} y={960} s={0.62} exp="esceptico" t={t} />
  </> }),
  firma: ({ t, d }) => ({ bg: <Lab />, fg: <>
    <rect x="560" y="700" width="800" height="40" fill="#8A5A3B" stroke={OUT} strokeWidth="4" /><rect x="600" y="740" width="30" height="160" fill="#6E4630" /><rect x="1290" y="740" width="30" height="160" fill="#6E4630" />
    <Papel x={960} y={690} w={360} h={90} lines={1}><path d="M-120 20 q30 -40 50 0 t50 0 t60 -10" stroke="#2E5BD6" strokeWidth="6" fill="none" strokeDasharray="400" strokeDashoffset={400 * (1 - app(t, d * 0.45, 0.9))} /></Papel>
    <Xeno x={700} y={900} s={0.8} exp="serio" pose="explica" t={t} />
    <Billete x={1250} y={560} s={1} r={10} />
  </> }),
  capsula_llena: ({ t, d }) => ({ bg: <Lab />, fg: <>
    <Capsula x={900} frost={0.2 + 0.5 * app(t, 0, d)} fill={app(t, 0.4, d * 0.8) * 0.92} inner={<Xeno x={0} y={-40} s={0.92} exp="preocupado" t={t} />} />
    <g transform="translate(1350 300)"><rect x="-24" y="0" width="48" height="420" rx="24" fill="#fff" stroke={OUT} strokeWidth="5" /><circle cx="0" cy="440" r="44" fill="#5CC8F0" stroke={OUT} strokeWidth="5" />
      <rect x="-12" y={20 + 360 * app(t, 0.3, d * 0.8)} width="24" height={400 - 360 * app(t, 0.3, d * 0.8)} rx="12" fill="#5CC8F0" />
      <text x="70" y="40" fontFamily={FONT} fontWeight="900" fontSize="40" fill={OUT}>37°</text><text x="70" y="400" fontFamily={FONT} fontWeight="900" fontSize="40" fill="#2E8BD6">−196°</text></g>
  </> }),
  cristales: ({ t, d }) => ({ bg: <Fondo c="#2A3E5E" />, fg: <>
    <Cel x={960} y={540} r={330} t={t} cris={app(t, 0.6, d * 0.7)} />
    <Snow t={t} n={24} o={0.4} />
  </> }),
  rana: ({ t, d }) => { const fz = t < d * 0.55 ? app(t, 0.3, 1) : 1 - app(t, d * 0.62, 0.8); return { bg: <><Sky a={fz > 0.5 ? '#AFC8DA' : '#BFE3C0'} b={fz > 0.5 ? '#EEF5FA' : '#F4FBEA'} /><Floor y={760} c={fz > 0.5 ? '#F1F6FA' : '#8CC56E'} /></>, fg: <>
    <Rana x={960} y={720} s={1.5} frozen={fz} t={t} />
    {fz > 0.5 && <Snow t={t} n={40} />}
    <g transform="translate(1420 300)"><path d="M0 30 C-40 -20 -100 20 0 100 C100 20 40 -20 0 30Z" fill={fz > 0.5 ? '#9AA6B4' : '#FF4D6D'} stroke={OUT} strokeWidth="5" transform={`scale(${fz > 0.5 ? 1 : 1 + Math.abs(Math.sin(t * 6)) * 0.12})`} /></g>
  </> }; },
  rana_azucar: ({ t }) => ({ bg: <Fondo c="#24425A" />, fg: <>
    <Cel x={760} y={540} r={300} t={t} cris={0} />
    {Array.from({ length: 8 }).map((_, k) => { const a = k * 0.8 + t * 0.5, rr = 150; return <g key={k} transform={`translate(${760 + Math.cos(a) * rr} ${540 + Math.sin(a) * rr}) scale(${pop(t, 0.3 + k * 0.12)})`}><rect x="-26" y="-26" width="52" height="52" rx="6" fill="#fff" stroke={OUT} strokeWidth="4" /></g>; })}
    <BigText x={1430} y={560} txt="AZÚCAR" size={110} t={t} at={0.6} />
    <Rana x={1440} y={860} s={0.6} frozen={0} t={t} />
  </> }),
  tardigrado: ({ t }) => ({ bg: <Fondo c="#2B4C6A" />, fg: <>
    <rect x="560" y="300" width="800" height="440" rx="40" fill="#CFEFFF" opacity={0.55 * (1 - app(t, 2.5, 1))} stroke="#fff" strokeWidth="8" />
    <Tardigrado x={960} y={560} s={1.6} t={t > 2.8 ? t : 0} />
    <BigText x={960} y={900} txt="30 AÑOS" size={120} t={t} at={0.5} />
  </> }),
  gusano: ({ t }) => ({ bg: <><rect width={W} height={H} fill="#7FA9C9" />{[0, 1, 2, 3, 4].map((k) => <rect key={k} y={300 + k * 160} width={W} height="160" fill={['#E7F2F8', '#C9DDEA', '#B4CBDB', '#9DB8CB', '#8AA8BE'][k]} />)}</>, fg: <>
    <Gusano x={960} y={640} s={1.8} t={t} />
    <BigText x={960} y={900} txt="46.000 AÑOS" size={130} t={t} at={0.5} />
  </> }),
  nitrogeno: ({ t }) => ({ bg: <><rect width={W} height={H} fill="#D7DEE6" /><Floor y={860} c="#AEB9C6" /></>, fg: <>
    {[460, 760, 1060, 1360].map((x, k) => <g key={x}><Tanque x={x} y={860} s={1.1} />{Array.from({ length: 3 }).map((_, j) => <circle key={j} cx={x + Math.sin(t * 2 + j + k) * 20} cy={480 - ((t * 40 + j * 40) % 140)} r={18 + j * 6} fill="#fff" opacity={0.5 - j * 0.12} />)}</g>)}
    <BigText x={960} y={370} txt="1967" size={150} t={t} at={0.3} />
  </> }),
  cierra_ojos: ({ t, d }) => ({ bg: <Lab />, fg: <>
    <Capsula x={960} frost={0.8} fill={0.92} inner={<Xeno x={0} y={-40} s={0.92} exp={t > d * 0.55 ? 'cerrado' : 'neutral'} t={t} />} />
    <rect width={W} height={H} fill="#000" opacity={app(t, d * 0.7, d * 0.3)} />
  </> }),
  boveda: ({ t }) => ({ bg: <Boveda t={t} />, fg: <>
    <Capsula x={960} y={880} s={0.55} frost={0.6} open={1} inner={null} />
    <Xeno x={1180} y={900} s={0.5} exp="preocupado" t={t} look={-5} />
  </> }),
  semillas: ({ t }) => ({ bg: <Fondo c="#24344F" c2="#0B1222" />, fg: <>
    <g transform={`translate(${-t * 40} 0)`}><Estante x={-40} y={120} w={2400} rows={7} seed={3} /></g>
    {Array.from({ length: 10 }).map((_, k) => <ellipse key={k} cx={200 + k * 170} cy={520 + Math.sin(k) * 200} rx="16" ry="10" fill="#C9A26B" stroke={OUT} strokeWidth="3" transform={`scale(${pop(t, 0.2 + k * 0.08)})`} style={{ transformOrigin: `${200 + k * 170}px ${520 + Math.sin(k) * 200}px` }} />)}
  </> }),
  svalbard: ({ t }) => ({ bg: <><Sky a="#0E1A33" b="#2A4870" /><path d={`M0 300 Q480 ${180 + Math.sin(t) * 20} 960 260 T1920 220`} stroke="#5CF2B0" strokeWidth="60" opacity="0.25" fill="none" /><Snow t={t} n={60} o={0.8} /></>, fg: <>
    <path d="M-40 860 L500 420 L900 640 L1300 380 L1960 760 L1960 1080 L-40 1080Z" fill="#E9F1F7" stroke={OUT} strokeWidth="4" />
    <path d="M880 640 L1180 520 L1180 860 L880 860Z" fill="#9AA6B4" stroke={OUT} strokeWidth="5" /><rect x="960" y="700" width="120" height="160" fill="#4B5566" stroke={OUT} strokeWidth="4" />
    <rect x="1000" y="560" width="160" height="30" fill="#5CC8F0" opacity="0.7" />
    <BigText x={420} y={430} txt="NORUEGA" size={90} c="#fff" t={t} at={0.4} stroke={10} />
  </> }),
  etiqueta: ({ t }) => ({ bg: <Fondo c="#2F4363" />, fg: <>
    <g transform="translate(960 540) rotate(-3)"><rect x="-560" y="-220" width="1120" height="440" rx="20" fill="#F4F1E8" stroke={OUT} strokeWidth="6" />
      <rect x="-560" y="-220" width="1120" height="100" rx="20" fill="#2E3646" />
      <text x="0" y="-150" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="56" fill="#FFD23F">MUESTRA HUMANA 001</text>
      <text x="0" y="-20" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="46" fill={OUT}>NO ABRIR HASTA CUMPLIR</text>
      <text x="0" y="50" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="46" fill={OUT}>LA CONDICIÓN DEL CONTRATO</text>
      <g opacity={app(t, 1.5)}><text x="0" y="160" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="64" fill="#FF4D4D">¿QUÉ CONDICIÓN?</text></g></g>
    <Snow t={t} n={20} o={0.4} />
  </> }),
  fecha: ({ t, d }) => { const y = Math.round(2026 + 1000 * ease(cl((t - 0.3) / (d * 0.6)))); return { bg: <Fondo c="#162238" />, fg: <>
    <rect x="460" y="300" width="1000" height="480" rx="30" fill="#0B1222" stroke="#5CC8F0" strokeWidth="8" />
    <text x="960" y="600" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="260" fill="#5CC8F0">{y}</text>
    <text x="960" y="390" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="48" fill="#9AA6B4">AÑO</text>
  </> }; },
  nadie_nota: ({ t }) => ({ bg: <><Sky a="#7FD3E6" b="#E9F7F2" /><Monserrate fut /><Floor y={860} c="#5A6B80" /></>, fg: <>
    <Xeno x={960} y={960} s={0.95} exp="esceptico" t={t} look={Math.sin(t * 1.5) * 6} />
    <g transform={`translate(560 380) scale(${pop(t, 0.4)})`}><Luna x={0} y={0} r={70} /></g>
    <g transform={`translate(1360 380) scale(${pop(t, 0.8)})`}><circle r="80" fill="#fff" stroke={OUT} strokeWidth="6" /><path d="M0 0 L0 -50 M0 0 L36 20" stroke={OUT} strokeWidth="8" strokeLinecap="round" /></g>
  </> }),
  luna: ({ t, d }) => { const mx = 1200 + 380 * ease(cl((t - 0.4) / (d * 0.6))); return { bg: <><Fondo c="#101A30" c2="#05080F" />{Array.from({ length: 60 }).map((_, k) => <circle key={k} cx={(k * 331) % W} cy={(k * 173) % H} r={1 + (k % 3)} fill="#fff" opacity="0.6" />)}</>, fg: <>
    <Tierra x={520} y={560} r={190} /><Luna x={mx} y={560} r={70} />
    <path d={`M1200 700 L${mx} 700`} stroke="#FFD23F" strokeWidth="8" markerEnd="" /><path d={`M${mx} 680 L${mx + 30} 700 L${mx} 720Z`} fill="#FFD23F" />
    <BigText x={1390} y={800} txt="+38 m" size={110} t={t} at={d * 0.5} />
  </> }; },
  dia: ({ t, d }) => ({ bg: <Fondo c="#1F3A5A" />, fg: <>
    <g transform="translate(760 540)"><circle r="300" fill="#fff" stroke={OUT} strokeWidth="10" />
      {Array.from({ length: 24 }).map((_, k) => <rect key={k} x="-4" y="-286" width="8" height={k % 6 ? 20 : 40} fill={OUT} transform={`rotate(${k * 15})`} />)}
      <rect x="-7" y="-240" width="14" height="240" rx="7" fill={OUT} transform={`rotate(${t * 40})`} /><circle r="18" fill="#FF4D4D" /></g>
    <BigText x={1460} y={520} txt="+0,02 s" size={130} t={t} at={d * 0.45} />
  </> }),
  continentes: ({ t, d }) => { const sp = 120 * ease(cl((t - 0.5) / (d * 0.7))); return { bg: <rect width={W} height={H} fill="#5BA7D9" />, fg: <>
    <path d="M1000 260 q120 -40 220 20 q60 80 40 180 q60 60 20 160 q-60 120 -160 200 q-40 -120 -100 -200 q-80 -60 -60 -160 q-40 -120 40 -200Z" fill="#E6C27A" stroke={OUT} strokeWidth="5" transform={`translate(${sp} 0)`} />
    <path d="M700 300 q100 -20 160 60 q40 80 0 160 q-20 120 -100 220 q-40 60 -60 0 q-20 -120 -60 -220 q-40 -120 60 -220Z" fill="#7CC07A" stroke={OUT} strokeWidth="5" transform={`translate(${-sp} 0)`} />
    <circle cx={760 - sp} cy="420" r="12" fill="#FF4D4D" stroke={OUT} strokeWidth="3" /><text x={780 - sp} y="410" fontFamily={FONT} fontWeight="900" fontSize="34" fill={OUT}>Bogotá</text>
    <path d={`M${880 - sp} 560 L${820 - sp} 560`} stroke="#FFD23F" strokeWidth="10" /><path d={`M${1010 + sp} 560 L${1070 + sp} 560`} stroke="#FFD23F" strokeWidth="10" />
  </> }; },
  mapas: ({ t }) => ({ bg: <><Sky a="#7FD3E6" b="#E9F7F2" /><Floor y={860} c="#5A6B80" /></>, fg: <>
    <Xeno x={760} y={960} s={0.95} exp="preocupado" pose="sostiene" t={t} />
    <g transform={`translate(1240 520) rotate(${-6 + Math.sin(t) * 2})`}><rect x="-260" y="-180" width="520" height="360" rx="10" fill="#F4E9C8" stroke={OUT} strokeWidth="5" />
      <path d="M-200 -100 q80 -40 160 20 t180 -10 M-200 40 q100 30 200 -20 t180 30" stroke="#8AA86E" strokeWidth="10" fill="none" />
      <g opacity={app(t, 0.8)}><path d="M-160 -130 L160 130 M160 -130 L-160 130" stroke="#FF4D4D" strokeWidth="18" strokeLinecap="round" /></g></g>
  </> }),
  idioma: ({ t }) => ({ bg: <><Sky a="#7FD3E6" b="#E9F7F2" /><Monserrate fut /><Floor y={860} c="#5A6B80" /></>, fg: <>
    <Xeno x={720} y={960} s={0.95} exp="neutral" pose="explica" t={t} />
    <Person x={1220} y={960} s={0.95} exp={t > 1.6 ? 'esceptico' : 'neutral'} t={t} pin={false} flip {...FUT[1]} />
    <Burbuja x={640} y={240} w={440} h={130} txt="¿Qué año es?" t={t} at={0.4} />
    <Burbuja x={1320} y={260} w={360} h={130} txt="◇▽ ◎ ⌁?" t={t} at={1.6} />
  </> }),
  glosas: ({ t, d }) => ({ bg: <rect width={W} height={H} fill="#5A3B26" />, fg: <>
    <g transform="translate(960 540) rotate(-2)"><rect x="-620" y="-420" width="1240" height="840" rx="16" fill="#E8D7AE" stroke={OUT} strokeWidth="6" />
      {Array.from({ length: 13 }).map((_, k) => <rect key={k} x="-560" y={-360 + k * 54} width={780 - (k % 3) * 60} height="14" rx="7" fill="#6B5134" opacity="0.6" />)}
      <g opacity={app(t, d * 0.35)}><text x="290" y="-300" fontFamily="Georgia, serif" fontStyle="italic" fontSize="36" fill="#7A2E1B">Cono ajutorio</text>
        <text x="290" y="-250" fontFamily="Georgia, serif" fontStyle="italic" fontSize="36" fill="#7A2E1B">de nuestro dueno,</text>
        <text x="290" y="-200" fontFamily="Georgia, serif" fontStyle="italic" fontSize="36" fill="#7A2E1B">dueno Christo…</text></g>
      <BigText x={0} y={330} txt="SIGLO X–XI" size={80} t={t} at={0.5} stroke={8} /></g>
  </> }),
  museo: ({ t }) => ({ bg: <><rect width={W} height={H} fill="#2B2F3A" /><Floor y={860} c="#3B4150" /><ellipse cx="960" cy="300" rx="500" ry="380" fill="#FFF3C4" opacity="0.12" /></>, fg: <>
    <rect x="760" y="640" width="400" height="220" fill="#E9E4DA" stroke={OUT} strokeWidth="5" /><rect x="740" y="320" width="440" height="320" fill="#BFE6F2" opacity="0.35" stroke={OUT} strokeWidth="5" />
    <Burbuja x={960} y={470} w={380} h={120} txt="«Parce, qué más»" size={40} t={t} at={0.4} />
    <rect x="830" y="700" width="260" height="80" rx="6" fill="#C9A26B" stroke={OUT} strokeWidth="4" /><text x="960" y="752" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="26" fill={OUT}>SIGLO XXI</text>
    <Person x={1420} y={960} s={0.7} exp="esceptico" t={t} pin={false} flip {...FUT[2]} /><Xeno x={480} y={960} s={0.7} exp="preocupado" t={t} />
  </> }),
  banco: ({ t, d }) => { const u = ease(cl((t - 0.5) / (d * 0.7))); const pts = Array.from({ length: 40 }).map((_, k) => { const x = k / 39; return `${360 + x * 1200},${860 - 600 * (Math.exp(x * 5) - 1) / (Math.exp(5) - 1) * Math.min(1, u * 1.05)}`; }).join(' ');
    return { bg: <rect width={W} height={H} fill="#13324A" />, fg: <>
      <path d="M360 260 L360 860 L1600 860" stroke="#9AB8D6" strokeWidth="6" fill="none" />
      <polyline points={pts} fill="none" stroke="#5CF2B0" strokeWidth="12" strokeLinejoin="round" />
      <text x="360" y="920" fontFamily={FONT} fontWeight="800" fontSize="36" fill="#9AB8D6">2026</text><text x="1500" y="920" fontFamily={FONT} fontWeight="800" fontSize="36" fill="#9AB8D6">3026</text>
      <Moneda x={460} y={780} r={46} /><BigText x={900} y={430} txt="+10 TRILLONES" size={100} t={t} at={d * 0.6} />
    </> }; },
  planeta: ({ t }) => ({ bg: <><Fondo c="#101A30" c2="#05080F" /></>, fg: <>
    <Tierra x={720} y={560} r={180} /><g transform={`translate(1240 560) scale(${0.6 + 0.6 * app(t, 0.2, 1)})`}><Moneda x={0} y={0} r={240} /></g>
  </> }),
  banco_antiguo: ({ t }) => ({ bg: <><Sky a="#F2D9A6" b="#FBF1DE" /><Floor y={860} c="#C9B48A" /></>, fg: <>
    <rect x="560" y="420" width="800" height="440" fill="#E8D7B8" stroke={OUT} strokeWidth="5" /><path d="M520 420 L960 240 L1400 420Z" fill="#D9C39A" stroke={OUT} strokeWidth="5" />
    {[620, 760, 900, 1040, 1180, 1300].map((x) => <rect key={x} x={x} y="440" width="40" height="420" fill="#F4EAD5" stroke={OUT} strokeWidth="3" />)}
    <text x="960" y="370" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700" fontSize="60" fill={OUT}>1472</text>
    <Xeno x={1560} y={960} s={0.62} exp="pensativo" pose="pensando" t={t} />
  </> }),
  quiebra: ({ t }) => ({ bg: <><Sky a="#8A96A8" b="#C9CFD8" /><Floor y={860} c="#7A808A" /></>, fg: <>
    <rect x="560" y="420" width="800" height="440" fill="#B9BEC6" stroke={OUT} strokeWidth="5" /><path d="M520 420 L960 260 L1400 420Z" fill="#A3A9B2" stroke={OUT} strokeWidth="5" />
    <path d="M800 430 L840 560 L800 640 L860 760" stroke={OUT} strokeWidth="6" fill="none" />
    <g transform={`translate(960 640) rotate(${-8 + Math.sin(t * 3) * 3})`}><rect x="-220" y="-60" width="440" height="120" rx="10" fill="#FF4D4D" stroke={OUT} strokeWidth="5" /><text y="24" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="72" fill="#fff">CERRADO</text></g>
    <Xeno x={1560} y={960} s={0.62} exp="preocupado" t={t} />
  </> }),
  contrato_zoom: ({ t, d }) => ({ bg: <Boveda t={t} />, fg: <>
    <Papel x={960} y={500} w={900} h={820} lines={14}>
      <rect x="-420" y="250" width="840" height="110" rx="10" fill="#FFD23F" opacity={0.2 + 0.6 * app(t, d * 0.35)} />
      <text x="0" y="292" textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="27" fill={OUT}>"El voluntario será despertado solo cuando la medicina</text>
      <text x="0" y="334" textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="27" fill={OUT}>pueda revivirlo sin ningún riesgo".</text>
    </Papel>
    <g transform={`translate(${700 + 260 * app(t, 0.5, d * 0.4)} ${700 + 120 * app(t, 0.5, d * 0.4)})`}><circle r="150" fill="#BFE6F2" opacity="0.25" stroke={OUT} strokeWidth="12" /><path d="M105 105 L210 210" stroke={OUT} strokeWidth="30" strokeLinecap="round" /></g>
  </> }),
  una_noche: ({ t, d }) => ({ bg: <><rect width={W / 2} height={H} fill="#1B2A4A" /><rect x={W / 2} width={W / 2} height={H} fill="#3A1E2E" /></>, fg: <>
    <Luna x={480} y={360} r={90} /><BigText x={480} y={720} txt="1 NOCHE" size={130} t={t} at={0.3} />
    {Array.from({ length: 6 }).map((_, k) => <rect key={k} x={1300 + k * 14} y={260 + k * 10} width="240" height="280" rx="10" fill="#F4F1E8" stroke={OUT} strokeWidth="4" transform={`rotate(${(k - 3) * 4} 1420 400)`} opacity={app(t, d * 0.45 + k * 0.08)} />)}
    <BigText x={1440} y={720} txt="1.000 AÑOS" size={130} c="#FF4D4D" t={t} at={d * 0.5} />
  </> }),
  siglos: ({ t, d }) => { const u = ease(cl((t - 0.4) / (d * 0.75))); return { bg: <Boveda t={t} />, fg: <>
    <rect x="260" y="760" width="1400" height="20" rx="10" fill="#9AB8D6" />
    {Array.from({ length: 11 }).map((_, k) => <g key={k}><rect x={260 + k * 140 - 3} y="740" width="6" height="60" fill="#9AB8D6" /><text x={260 + k * 140} y="840" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="26" fill="#C9D6E6">{2026 + k * 100}</text></g>)}
    <Capsula x={260 + 1400 * u} y={720} s={0.42} frost={0.7} fill={0.9} inner={<Xeno x={0} y={-40} s={0.92} exp="cerrado" t={t} bob={false} />} />
  </> }; },
  leer_tyc: ({ t, d }) => { const L = 200 + 560 * ease(cl((t - 0.3) / (d * 0.7))); return { bg: <><Sky a="#7FD3E6" b="#E9F7F2" /><Monserrate fut /><Floor y={860} c="#5A6B80" /></>, fg: <>
    <rect x="1040" y={300} width="320" height={L} fill="#FBF8F1" stroke={OUT} strokeWidth="5" />
    {Array.from({ length: Math.floor(L / 30) }).map((_, k) => <rect key={k} x="1070" y={330 + k * 30} width={260 - (k % 4) * 30} height="8" rx="4" fill="#C9CED6" />)}
    <rect x="1020" y="280" width="360" height="40" rx="20" fill="#E8D7B8" stroke={OUT} strokeWidth="5" />
    <Xeno x={820} y={960} s={0.95} exp="serio" pose="sostiene" t={t} look={4} />
    <BigText x={520} y={230} txt="TÉRMINOS Y CONDICIONES" size={64} t={t} at={d * 0.55} stroke={8} />
  </> }; },
  cierre: ({ t }) => ({ bg: <><Sky a="#7FD3E6" b="#E9F7F2" /><Monserrate fut /><Floor y={860} c="#5A6B80" /></>, fg: <>
    <Xeno x={760} y={980} s={1.15} exp="sonrisa" pose="explica" t={t} />
    <Burbuja x={1360} y={360} w={520} h={170} txt="¿Firmarías?" size={70} t={t} at={0.6} />
    <g transform={`translate(1360 680) scale(${pop(t, 1.4)})`}><rect x="-210" y="-60" width="420" height="120" rx="60" fill="#FF4D4D" stroke={OUT} strokeWidth="5" /><text y="20" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="50" fill="#fff">COMENTA 👇</text></g>
  </> }),
};

// ---------- HUD, fichas, medidor y subtítulos ----------
const MEDL = { idioma: '¿TE ENTIENDEN?', glosas: '¿TE ENTIENDEN?', museo: '¿TE ENTIENDEN?', quiebra: '¿ERES RICO?' };
const Hud = ({ p, t, tipo }) => <>
  {p.esc && <div style={{ position: 'absolute', left: 48, top: 40, padding: '14px 28px', borderRadius: 40, background: 'rgba(20,26,40,0.86)', color: '#fff', fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 2.5, border: '3px solid rgba(255,255,255,0.15)' }}>{p.esc}</div>}
  {p.anio && <div style={{ position: 'absolute', right: 48, top: 40, padding: '14px 28px', borderRadius: 40, background: 'rgba(20,26,40,0.86)', color: p.anio === '3026' ? '#5CC8F0' : '#FFD23F', fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 2.5 }}>AÑO {p.anio}</div>}
  {p.med !== null && p.med !== undefined && <div style={{ position: 'absolute', right: 48, top: 112, width: 380, padding: '14px 22px', borderRadius: 22, background: 'rgba(20,26,40,0.86)', fontFamily: FONT, color: '#fff' }}>
    <div style={{ fontWeight: 900, fontSize: 22, letterSpacing: 2 }}>{MEDL[tipo] || 'PROBABILIDAD REAL'} <span style={{ float: 'right', color: p.med >= 50 ? '#5CF2B0' : '#FF6B6B' }}>{Math.round(p.med * ease(t / 1.2))} %</span></div>
    <div style={{ marginTop: 10, height: 16, borderRadius: 8, background: '#3A4558' }}><div style={{ height: 16, borderRadius: 8, width: `${Math.max(3, p.med * ease(t / 1.2))}%`, background: p.med >= 50 ? '#5CF2B0' : '#FF6B6B' }} /></div>
  </div>}
  {p.dato && <div style={{ position: 'absolute', left: '50%', top: 128, transform: `translateX(-50%) translateY(${(1 - app(t, 0.25, 0.35)) * -30}px)`, opacity: app(t, 0.25, 0.3), maxWidth: 1300,
    padding: '16px 34px', background: '#13203A', border: '4px solid #FFD23F', borderRadius: 14, fontFamily: FONT, color: '#FFD23F', fontWeight: 900, fontSize: 34, letterSpacing: 1.5, textAlign: 'center' }}>
    <span style={{ color: '#fff', marginRight: 14 }}>DATO REAL ·</span>{p.dato.toUpperCase()}</div>}
</>;
const Subs = ({ words = [], t }) => {
  if (!words.length || t < words[0][1] - 0.05) return null;
  let k = words.findIndex((w, j) => t >= w[1] - 0.05 && t < (words[j + 1] ? words[j + 1][1] - 0.05 : 1e9));
  if (k < 0) k = words.length - 1;
  const g = Math.floor(k / 4) * 4, chunk = words.slice(g, g + 4);
  return <div style={{ position: 'absolute', bottom: 70, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 64, lineHeight: 1.1, WebkitTextStroke: '9px #10131C', paintOrder: 'stroke fill', letterSpacing: -0.5 }}>
    {chunk.map(([w], j) => <span key={j} style={{ display: 'inline-block', margin: '0 12px', color: g + j === k ? '#FFD23F' : '#fff', transform: g + j === k ? 'scale(1.06)' : 'none' }}>{w.replace(/[".,;:]/g, '')}</span>)}
  </div>;
};

const Scene = ({ i, at }) => {
  const f0 = useCurrentFrame();
  const sc = D[i];
  const f = at !== undefined ? Math.round(sc.frames * at) : f0;
  const t = f / 30, d = sc.frames / 30;
  const S = (SC[sc.tipo] || SC.pregunta)({ t, d });
  const z = 1 + 0.06 * (t / d), zb = 1 + 0.03 * (t / d), px = (i % 2 ? -1 : 1) * 18 * (t / d);
  return <AbsoluteFill style={{ background: '#0B1222', overflow: 'hidden' }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute' }}>
      <g transform={`translate(${W / 2 + px * 0.5} ${H / 2}) scale(${zb}) translate(${-W / 2} ${-H / 2})`}>{S.bg}</g>
      <g transform={`translate(${W / 2 + px} ${H / 2}) scale(${z}) translate(${-W / 2} ${-H / 2})`}>{S.fg}</g>
      <defs><radialGradient id="vig" cx="50%" cy="50%" r="72%"><stop offset="0.6" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.38" /></radialGradient></defs>
      <rect width={W} height={H} fill="url(#vig)" />
    </svg>
    <Hud p={sc.p || {}} t={t} tipo={sc.tipo} />
    <Subs words={sc.words} t={t} />
  </AbsoluteFill>;
};


const Thumb = () => <AbsoluteFill style={{ background: '#0B1222' }}>
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
    <defs><radialGradient id="tb" cx="62%" cy="50%" r="70%"><stop offset="0" stopColor="#2F7FB8" /><stop offset="1" stopColor="#0B1630" /></radialGradient></defs>
    <rect width={W} height={H} fill="url(#tb)" />
    <Snow t={1.3} n={70} o={0.7} />
    <g transform="translate(1350 1080) scale(1.55) translate(-960 -870)"><Capsula x={960} y={870} frost={0.9} fill={0.0} inner={<Xeno x={0} y={-40} s={0.92} exp="sorprendido" pose="shock" t={0} bob={false} />} /></g>
    <text x="80" y="420" fontFamily={FONT} fontWeight="900" fontSize="230" fill="#FFD23F" stroke={OUT} strokeWidth="22" paintOrder="stroke">1.000</text>
    <text x="90" y="640" fontFamily={FONT} fontWeight="900" fontSize="210" fill="#fff" stroke={OUT} strokeWidth="22" paintOrder="stroke">AÑOS</text>
    <text x="100" y="800" fontFamily={FONT} fontWeight="900" fontSize="110" fill="#5CC8F0" stroke={OUT} strokeWidth="16" paintOrder="stroke">CONGELADO</text>
  </svg>
</AbsoluteFill>;

const Sheet = ({ at }) => { const f = useCurrentFrame(); return <Scene i={f % D.length} at={at} />; };
registerRoot(() => <>
  {D.map((sc, i) => <Composition key={i} id={`V25-${String(i).padStart(2, '0')}`} component={Scene} defaultProps={{ i }} durationInFrames={sc.frames} fps={30} width={W} height={H} />)}
  <Composition id="THUMB" component={Thumb} durationInFrames={1} fps={30} width={W} height={H} />
  <Composition id="SHEET" component={Sheet} defaultProps={{ at: 0.7 }} durationInFrames={D.length} fps={30} width={W} height={H} />
</>);
