// Piezas copiadas de index26 (sin registerRoot) para v27.
import React from 'react';
import { Person, OUT } from './xeno.jsx';
import { BlurG } from './kit2d.jsx';
export const W = 1920, H = 1080, FONT = 'Inter Display, Inter, Arial, sans-serif';
export const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const eo = (x) => 1 - Math.pow(1 - cl(x), 3);
export const pop = (t, at, d = 0.28) => { const u = cl((t - at) / d); return u <= 0 ? 0 : u < 1 ? 0.8 + 0.25 * Math.sin(u * Math.PI * 0.85) + 0.2 * u * (1 - u) : 1; };
export const PAL = { ambar: ['#C98B52', '#6B3E2A'], verde: ['#8DC7B6', '#3E6B5A'], azul: ['#6E86B8', '#262F4B'], rosa: ['#E9A3A0', '#7A3E4E'], crema: ['#EEDBB2', '#A98A63'] };
export const HIST = [{ jacket: '#8A5A3B', jacketD: '#6E4630', hair: 'xeno' }, { jacket: '#5E6E4A', jacketD: '#46543A', hair: 'largo' }, { jacket: '#A8433A', jacketD: '#84332C', hair: 'moño' }, { jacket: '#4A5A7A', jacketD: '#36435C', hair: 'xeno' }, { jacket: '#C9A26B', jacketD: '#A5834F', hair: 'largo' }];
export const Bg = ({ a, b }) => <><defs><linearGradient id="bgv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient></defs><rect width={W} height={H} fill="url(#bgv)" /></>;
export const Bokeh = ({ c = 'ambar', t = 0, n = 26 }) => { const [a, b] = PAL[c] || PAL.ambar; return <>
  <defs><radialGradient id="bk" cx="50%" cy="45%" r="75%"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></radialGradient></defs>
  <rect width={W} height={H} fill="url(#bk)" />
  <BlurG s={10}>{Array.from({ length: n }).map((_, k) => <circle key={k} cx={(k * 389 + Math.sin(t * 0.3 + k) * 30) % W} cy={(k * 211) % H} r={30 + (k % 5) * 18} fill={k % 3 ? '#FFF1D6' : a} opacity={0.12 + (k % 4) * 0.06} />)}</BlurG></>; };
export const Glow = ({ x, y, r = 240, c = '#FFE3A3', o = 0.5 }) => <><defs><radialGradient id={`gl${x}${y}`}><stop offset="0" stopColor={c} stopOpacity={o} /><stop offset="1" stopColor={c} stopOpacity="0" /></radialGradient></defs><circle cx={x} cy={y} r={r} fill={`url(#gl${x}${y})`} style={{ mixBlendMode: 'screen' }} /></>;
export const Polvo = ({ t, n = 40, c = '#FFF1D6' }) => <g>{Array.from({ length: n }).map((_, k) => <circle key={k} cx={(k * 173 + t * (8 + k % 5) * 6) % W} cy={(k * 97 + Math.sin(t + k) * 20) % H} r={1.5 + (k % 3)} fill={c} opacity={0.35} />)}</g>;
export const Casa = ({ x, w, h, c, y = 860, win = '#FFD58A', techo = '#6B3E2A' }) => <g>
  <rect x={x} y={y - h} width={w} height={h} fill={c} /><path d={`M${x - 14} ${y - h} L${x + w / 2} ${y - h - 70} L${x + w + 14} ${y - h}Z`} fill={techo} />
  {Array.from({ length: Math.floor((h - 60) / 90) }).map((_, r) => Array.from({ length: Math.floor(w / 80) }).map((_, k) => <g key={`${r}${k}`}>
    <rect x={x + 22 + k * 80} y={y - h + 30 + r * 90} width="40" height="54" fill={(r + k) % 3 ? win : '#3A2A22'} /><rect x={x + 22 + k * 80} y={y - h + 54 + r * 90} width="40" height="4" fill="#6B3E2A" /></g>))}
  <rect x={x} y={y - h} width={w} height="10" fill="#000" opacity="0.15" /></g>;
export const Suelo = ({ y = 860, c = '#7A5A43', c2 = '#5E4434' }) => <><defs><linearGradient id="sl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c} /><stop offset="1" stopColor={c2} /></linearGradient></defs><rect y={y} width={W} height={H - y} fill="url(#sl)" /></>;
export const Charco = ({ x, y, w = 160 }) => <ellipse cx={x} cy={y} rx={w} ry={w * 0.18} fill="#6E7A3E" opacity="0.7" />;
export const Mosca = ({ x, y, t, k = 0 }) => <g transform={`translate(${x + Math.sin(t * 7 + k) * 30} ${y + Math.cos(t * 9 + k) * 18})`}><ellipse rx="6" ry="4" fill="#1A1A1A" /><ellipse cx="-4" cy="-5" rx="5" ry="3" fill="#fff" opacity="0.6" /><ellipse cx="4" cy="-5" rx="5" ry="3" fill="#fff" opacity="0.6" /></g>;
export const Gente = ({ y = 880, s = 0.34, t, n = 7, seed = 0, pal = HIST, pañuelo = false }) => <BlurG s={1.2}>{Array.from({ length: n }).map((_, k) => {
  const x = ((k * 293 + seed * 170 + t * (k % 2 ? 26 : -20)) % 2200 + 2200) % 2200 - 140;
  return <g key={k}><Person x={x} y={y} s={s} t={t + k} pin={false} flip={k % 2 === 0} exp={pañuelo ? 'preocupado' : 'neutral'} {...pal[(k + seed) % pal.length]} />
    {pañuelo && <rect x={x - 22 * s * 2.2} y={y - 470 * s} width={44 * s * 2.2} height={30 * s} rx="6" fill="#F3F1E6" />}</g>; })}</BlurG>;
export const Inodoro = ({ x, y, s = 1, corte = false }) => <g transform={`translate(${x} ${y}) scale(${s})`}>
  <rect x="-70" y="-330" width="140" height="150" rx="16" fill="#F3F4F2" /><rect x="-70" y="-330" width="140" height="18" rx="9" fill="#fff" />
  <path d="M-110 -170 L110 -170 Q110 -60 30 -40 L40 0 L-40 0 L-30 -40 Q-110 -60 -110 -170Z" fill="#ECEDEA" /><ellipse cx="0" cy="-170" rx="110" ry="26" fill="#fff" />
  <ellipse cx="0" cy="-168" rx="80" ry="16" fill={corte ? '#8FD3F5' : '#D9E6EA'} />
  {corte && <g><path d="M10 -150 Q40 -60 0 -40 Q-40 -20 -10 30 Q20 70 90 70" stroke="#5CC8F0" strokeWidth="26" fill="none" strokeLinecap="round" opacity="0.9" />
    <path d="M10 -150 Q40 -60 0 -40 Q-40 -20 -10 30 Q20 70 90 70" stroke="#2E7FB8" strokeWidth="6" fill="none" /></g>}
  <rect x="-40" y="-18" width="80" height="18" rx="6" fill="#C9CED2" /></g>;
export const Bacteria = ({ x, y, s = 1, t, c = '#7CC07A' }) => <g transform={`translate(${x} ${y}) rotate(${Math.sin(t * 2 + x) * 15}) scale(${s})`}>
  <rect x="-60" y="-24" width="120" height="48" rx="24" fill={c} /><rect x="-50" y="-16" width="60" height="10" rx="5" fill="#fff" opacity="0.35" />
  <path d={`M60 0 q20 ${-14 + Math.sin(t * 8) * 10} 40 0 t40 0`} stroke={c} strokeWidth="5" fill="none" />
  <circle cx="-20" cy="0" r="6" fill="#2F6B45" /><circle cx="14" cy="4" r="5" fill="#2F6B45" /></g>;
export const Bacinilla = ({ x, y, s = 1 }) => <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-110 -90 L110 -90 L90 0 L-90 0Z" fill="#E9E2D0" /><ellipse cx="0" cy="-90" rx="120" ry="24" fill="#F6F1E3" /><ellipse cx="0" cy="-90" rx="96" ry="16" fill="#8A7A4E" />
  <path d="M110 -70 Q170 -60 150 -20 Q140 0 100 -10" stroke="#E9E2D0" strokeWidth="16" fill="none" /><path d="M-100 -50 L100 -50" stroke="#3E6B9E" strokeWidth="6" /></g>;
export const Gota = ({ x, y, s = 1 }) => <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M0 -150 C60 -60 90 -10 90 30 A90 90 0 0 1 -90 30 C-90 -10 -60 -60 0 -150Z" fill="#7CC8E8" /><ellipse cx="-30" cy="0" rx="18" ry="34" fill="#fff" opacity="0.5" /></g>;
export const Rollo = ({ x, y, s = 1 }) => <g transform={`translate(${x} ${y}) scale(${s})`}><rect x="-120" y="-90" width="240" height="180" rx="16" fill="#F6F4EE" /><ellipse cx="-120" cy="0" rx="40" ry="90" fill="#E2DFD6" /><ellipse cx="-120" cy="0" rx="16" ry="36" fill="#B5A58A" /><path d="M120 -90 L160 -90 L160 160 L120 160Z" fill="#F6F4EE" /></g>;
export const Panel = ({ children, t }) => <g opacity={eo(t / 0.25)}>{children}</g>;
export const Pill = ({ x, y, txt, c = '#FACA4F', size = 30 }) => { const w = txt.length * size * 0.62 + 50; return <g><rect x={x - w / 2} y={y - size} width={w} height={size * 1.7} rx={size * 0.85} fill="#0E111F" opacity="0.88" stroke="#E3C584" strokeWidth="2" />
  <text x={x} y={y + size * 0.25} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={size} fill={c} letterSpacing="2">{txt}</text></g>; };

// ---------- lugares (pg) ----------
