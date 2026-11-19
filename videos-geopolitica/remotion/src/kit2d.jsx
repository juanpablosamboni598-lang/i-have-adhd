// Kit 2D v2 (estilo referencia): escenarios SIN contorno, con degradados, luz, sombras suaves, profundidad y grano.
// Solo los personajes llevan contorno. Todo en coordenadas 1920x1080.
import React from 'react';

export const W = 1920, H = 1080;
let UID = 0;
const useId = (p) => React.useMemo(() => `${p}${UID++}`, []);

// ---------- efectos globales ----------
export const Grain = ({ o = 0.07, seed = 3 }) => { const id = useId('gr'); return <>
  <defs><filter id={id} x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} /><feColorMatrix type="saturate" values="0" /></filter></defs>
  <rect width={W} height={H} filter={`url(#${id})`} opacity={o} style={{ mixBlendMode: 'overlay' }} /></>; };
export const Grade = ({ c = '#FFB46B', o = 0.12, mode = 'soft-light' }) => <rect width={W} height={H} fill={c} opacity={o} style={{ mixBlendMode: mode }} />;
export const Vignette = ({ o = 0.45 }) => { const id = useId('vg'); return <>
  <defs><radialGradient id={id} cx="50%" cy="48%" r="75%"><stop offset="0.55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity={o} /></radialGradient></defs>
  <rect width={W} height={H} fill={`url(#${id})`} /></>; };
export const BlurG = ({ s = 6, children }) => { const id = useId('bz'); return <g><defs><filter id={id} x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation={s} /></filter></defs><g filter={`url(#${id})`}>{children}</g></g>; };
export const Shadow = ({ x, y, w = 160, h = 26, o = 0.28 }) => { const id = useId('sh'); return <>
  <defs><radialGradient id={id}><stop offset="0" stopColor="#0B1020" stopOpacity={o} /><stop offset="1" stopColor="#0B1020" stopOpacity="0" /></radialGradient></defs>
  <ellipse cx={x} cy={y} rx={w} ry={h} fill={`url(#${id})`} /></>; };
// haz de luz (lámpara o ventana)
export const LightCone = ({ x, y, w = 420, h = 760, c = '#FFF4D6', o = 0.22 }) => { const id = useId('lc'); return <>
  <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c} stopOpacity={o} /><stop offset="1" stopColor={c} stopOpacity="0" /></linearGradient></defs>
  <path d={`M${x - 40} ${y} L${x + 40} ${y} L${x + w / 2} ${y + h} L${x - w / 2} ${y + h}Z`} fill={`url(#${id})`} style={{ mixBlendMode: 'screen' }} /></>; };
const VG = ({ id, a, b, x2 = 0, y2 = 1 }) => <linearGradient id={id} x1="0" y1="0" x2={x2} y2={y2}><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient>;

// ---------- paredes, pisos, ventanas ----------
export const Room = ({ wall = ['#DCE7EE', '#C3D2DD'], floor = ['#9FB0BF', '#7E91A3'], fy = 800, panel = true }) => { const a = useId('w'), b = useId('f'); return <>
  <defs><VG id={a} a={wall[0]} b={wall[1]} /><VG id={b} a={floor[0]} b={floor[1]} /></defs>
  <rect width={W} height={fy} fill={`url(#${a})`} />
  {panel && <><rect y={fy - 220} width={W} height="220" fill="#000" opacity="0.06" /><rect y={fy - 224} width={W} height="6" fill="#fff" opacity="0.35" /></>}
  <rect y={fy} width={W} height={H - fy} fill={`url(#${b})`} />
  {Array.from({ length: 13 }).map((_, k) => <path key={k} d={`M${960 + (k - 6) * 120} ${fy} L${960 + (k - 6) * 420} ${H}`} stroke="#fff" strokeOpacity="0.10" strokeWidth="3" />)}
  {[0, 1, 2].map((k) => <rect key={k} y={fy + 40 + k * k * 34 + k * 30} width={W} height="3" fill="#fff" opacity="0.10" />)}
  <rect y={fy} width={W} height="14" fill="#000" opacity="0.10" />
</>; };
export const CeilLamp = ({ x, y = 0, l = 120 }) => <g><rect x={x - 2} y={y} width="4" height={l} fill="#5B6676" />
  <path d={`M${x - 70} ${y + l + 40} Q${x} ${y + l - 20} ${x + 70} ${y + l + 40}Z`} fill="#2E3646" /><ellipse cx={x} cy={y + l + 40} rx="56" ry="10" fill="#FFF3C4" />
  <LightCone x={x} y={y + l + 40} w={520} h={720} /></g>;
export const Ventana = ({ x, y, w = 420, h = 300, view = 'ciudad', t = 0 }) => { const s = useId('vs'), cp = useId('vc'); return <g>
  <defs><VG id={s} a="#8FCBEA" b="#DDF1FA" /><clipPath id={cp}><rect x={x} y={y} width={w} height={h} /></clipPath></defs>
  <rect x={x - 14} y={y - 14} width={w + 28} height={h + 28} rx="8" fill="#B8C6D2" />
  <rect x={x} y={y} width={w} height={h} fill={`url(#${s})`} />
  <g clipPath={`url(#${cp})`}>
  {view === 'ciudad' && <BlurG s={2.5}>
    <path d={`M${x} ${y + h * 0.55} L${x + w * 0.3} ${y + h * 0.3} L${x + w * 0.55} ${y + h * 0.45} L${x + w * 0.8} ${y + h * 0.2} L${x + w} ${y + h * 0.4} L${x + w} ${y + h} L${x} ${y + h}Z`} fill="#6E9E80" />
    {[0.05, 0.22, 0.4, 0.62, 0.8].map((p, k) => <rect key={k} x={x + w * p} y={y + h * (0.5 + (k % 2) * 0.12)} width={w * 0.14} height={h} fill={['#C46A4E', '#B5543A', '#D08A6A', '#A84E36', '#C46A4E'][k]} />)}
  </BlurG>}
  {view === 'nieve' && <BlurG s={2}><rect x={x} y={y + h * 0.7} width={w} height={h * 0.3} fill="#F2F7FB" />{[0.15, 0.45, 0.75].map((p) => <path key={p} d={`M${x + w * p} ${y + h * 0.3} l40 110 l-80 0Z`} fill="#3E6B5A" />)}</BlurG>}
  </g>
  <path d={`M${x} ${y} L${x + w * 0.35} ${y} L${x} ${y + h * 0.5}Z`} fill="#fff" opacity="0.25" />
  <rect x={x + w / 2 - 5} y={y} width="10" height={h} fill="#B8C6D2" /><rect x={x} y={y + h / 2 - 5} width={w} height="10" fill="#B8C6D2" />
  <rect x={x - 24} y={y + h + 10} width={w + 48} height="18" rx="4" fill="#A6B5C2" />
</g>; };

// ---------- mobiliario y objetos ----------
export const Repisa = ({ x, y, w = 420, items = 'libros' }) => <g>
  <rect x={x} y={y} width={w} height="14" rx="3" fill="#8A5A3B" /><rect x={x} y={y + 14} width={w} height="6" fill="#000" opacity="0.18" />
  {items === 'libros' && Array.from({ length: Math.floor(w / 28) }).map((_, k) => { const hh = 70 + ((k * 37) % 40); return <rect key={k} x={x + 10 + k * 28} y={y - hh} width="22" height={hh} rx="2"
    fill={['#E8584A', '#F2B134', '#3FB8AF', '#5B7FD6', '#9B6FD6', '#F28C6B', '#7CC07A'][k % 7]} transform={k % 9 === 4 ? `rotate(12 ${x + 10 + k * 28} ${y})` : undefined} />; })}
  {items === 'frascos' && Array.from({ length: Math.floor(w / 60) }).map((_, k) => <g key={k}><rect x={x + 14 + k * 60} y={y - 70} width="40" height="70" rx="10" fill="#DDEFF7" opacity="0.8" />
    <rect x={x + 14 + k * 60} y={y - 40 + (k % 3) * 8} width="40" height={40 - (k % 3) * 8} rx="8" fill={['#5CC8F0', '#7CE0A0', '#F2B134', '#E86A92'][k % 4]} opacity="0.85" /><rect x={x + 22 + k * 60} y={y - 82} width="24" height="14" rx="3" fill="#5B6676" /></g>)}
</g>;
export const Reloj = ({ x, y, r = 46, t = 0 }) => <g><circle cx={x} cy={y} r={r + 6} fill="#5B6676" /><circle cx={x} cy={y} r={r} fill="#F7FAFC" />
  <path d={`M${x} ${y} L${x} ${y - r * 0.6}`} stroke="#2E3646" strokeWidth="5" strokeLinecap="round" transform={`rotate(${t * 6} ${x} ${y})`} />
  <path d={`M${x} ${y} L${x + r * 0.45} ${y}`} stroke="#2E3646" strokeWidth="6" strokeLinecap="round" /><circle cx={x} cy={y} r="5" fill="#E8584A" /></g>;
export const Planta = ({ x, y, s = 1, t = 0 }) => <g transform={`translate(${x} ${y}) scale(${s})`}>
  {[-50, -20, 10, 40, -35, 25].map((a, k) => <path key={k} d={`M0 -60 Q${a * 1.6} ${-160 - (k % 3) * 30} ${a * 2.2 + Math.sin(t * 1.5 + k) * 4} ${-200 - (k % 3) * 40}`} stroke={k % 2 ? '#4FA36B' : '#3E8E5A'} strokeWidth="22" strokeLinecap="round" fill="none" />)}
  <path d="M-55 -70 L55 -70 L42 0 L-42 0Z" fill="#D9774E" /><rect x="-60" y="-80" width="120" height="16" rx="5" fill="#E8875C" /></g>;
export const Poster = ({ x, y, w = 220, h = 300, c = '#5B7FD6', tipo = 'adn' }) => <g transform={`rotate(-2 ${x} ${y})`}>
  <rect x={x} y={y} width={w} height={h} fill="#F7F4EC" /><rect x={x + 16} y={y + 16} width={w - 32} height={h * 0.6} fill={c} />
  {tipo === 'adn' && Array.from({ length: 8 }).map((_, k) => <g key={k}><circle cx={x + w / 2 + Math.sin(k * 0.8) * 50} cy={y + 40 + k * 18} r="6" fill="#FFD23F" /><circle cx={x + w / 2 - Math.sin(k * 0.8) * 50} cy={y + 40 + k * 18} r="6" fill="#fff" /></g>)}
  {tipo === 'copo' && <path d={`M${x + w / 2} ${y + 40} L${x + w / 2} ${y + h * 0.55} M${x + w / 2 - 60} ${y + h * 0.33} L${x + w / 2 + 60} ${y + h * 0.33}`} stroke="#fff" strokeWidth="8" />}
  <rect x={x + 16} y={y + h * 0.72} width={w * 0.6} height="12" rx="6" fill="#2E3646" /><rect x={x + 16} y={y + h * 0.82} width={w * 0.45} height="10" rx="5" fill="#9AA6B4" /></g>;
export const Monitor = ({ x, y, w = 300, h = 190, t = 0, c = '#5CC8F0' }) => <g>
  <rect x={x + w / 2 - 14} y={y + h} width="28" height="50" fill="#4B5566" /><rect x={x + w / 2 - 70} y={y + h + 44} width="140" height="14" rx="6" fill="#4B5566" />
  <rect x={x} y={y} width={w} height={h} rx="12" fill="#2A3240" /><rect x={x + 12} y={y + 12} width={w - 24} height={h - 24} rx="6" fill="#0F1A2A" />
  <polyline points={Array.from({ length: 16 }).map((_, k) => `${x + 24 + k * ((w - 48) / 15)},${y + h / 2 + Math.sin(k * 0.9 + t * 3) * (h * 0.22)}`).join(' ')} fill="none" stroke={c} strokeWidth="4" />
  <rect x={x + 24} y={y + 22} width={w * 0.3} height="8" rx="4" fill="#5B6676" /><rect x={x + 12} y={y + 12} width={w - 24} height={(h - 24) * 0.45} rx="6" fill="#fff" opacity="0.05" /></g>;
export const Mesa = ({ x, y, w = 700, c = '#E3E9EE', legs = '#7E8B99' }) => <g>
  <rect x={x + 30} y={y + 30} width="22" height={H - y} fill={legs} /><rect x={x + w - 52} y={y + 30} width="22" height={H - y} fill={legs} />
  <rect x={x} y={y} width={w} height="34" rx="6" fill={c} /><rect x={x} y={y + 26} width={w} height="10" fill="#000" opacity="0.12" />
  <rect x={x} y={y} width={w} height="6" rx="3" fill="#fff" opacity="0.5" /></g>;
export const Microscopio = ({ x, y, s = 1 }) => <g transform={`translate(${x} ${y}) scale(${s})`}>
  <rect x="-60" y="-14" width="120" height="14" rx="5" fill="#3A4558" /><path d="M10 -14 Q60 -60 20 -130" stroke="#E3E9EE" strokeWidth="20" fill="none" strokeLinecap="round" />
  <rect x="-20" y="-150" width="30" height="80" rx="8" fill="#5B6676" transform="rotate(-20 -5 -110)" /><rect x="-40" y="-60" width="70" height="10" rx="4" fill="#3A4558" /></g>;
export const Matraz = ({ x, y, s = 1, c = '#7CE0A0', t = 0 }) => <g transform={`translate(${x} ${y}) scale(${s})`}>
  <path d="M-12 -110 L12 -110 L12 -70 L50 0 L-50 0 L-12 -70Z" fill="#DDEFF7" opacity="0.75" /><path d="M-30 -36 L30 -36 L50 0 L-50 0Z" fill={c} opacity="0.9" />
  {[0, 1, 2].map((k) => <circle key={k} cx={-14 + k * 14} cy={-20 - ((t * 30 + k * 12) % 40)} r={3 + k} fill="#fff" opacity="0.7" />)}
  <path d="M-6 -104 L-6 -76" stroke="#fff" strokeWidth="4" opacity="0.6" /></g>;
export const Portapapeles = ({ x, y, r = 0 }) => <g transform={`translate(${x} ${y}) rotate(${r})`}>
  <rect x="-60" y="-80" width="120" height="160" rx="8" fill="#B07B4F" /><rect x="-50" y="-66" width="100" height="136" rx="4" fill="#FBF8F1" />
  <rect x="-24" y="-90" width="48" height="20" rx="6" fill="#9AA6B4" />{[0, 1, 2, 3, 4].map((k) => <rect key={k} x="-38" y={-44 + k * 20} width={70 - (k % 2) * 20} height="6" rx="3" fill="#C9CED6" />)}</g>;
export const Cables = ({ pts, c = '#2E3646' }) => <path d={pts} fill="none" stroke={c} strokeWidth="8" strokeLinecap="round" opacity="0.8" />;
// primer plano desenfocado (da profundidad)
export const FrontLeaves = ({ side = 'left', t = 0 }) => <BlurG s={9}><g transform={side === 'left' ? '' : `translate(${W} 0) scale(-1 1)`}>
  {[0, 1, 2, 3].map((k) => <path key={k} d={`M-40 ${H + 20} Q${60 + k * 30} ${900 - k * 50} ${120 + k * 50 + Math.sin(t + k) * 6} ${820 - k * 60}`} stroke={k % 2 ? '#2F6B45' : '#3E8E5A'} strokeWidth={70 - k * 8} strokeLinecap="round" fill="none" />)}
</g></BlurG>;
