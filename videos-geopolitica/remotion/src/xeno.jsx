// Xeno v3 (personaje oficial de jxseng) y personas genéricas, en SVG. Puerto de personaje/personaje.py.
// Coordenadas internas 400x600; (x, y) = punto entre los pies.
import React from 'react';

export const OUT = '#0E0E12';
const BROW = '#11141B';
let GID = 0;

const almond = (x, y, w, h) => `M${x - w} ${y} Q${x} ${y - h} ${x + w} ${y} Q${x} ${y + h * 0.85} ${x - w} ${y}Z`;
const EYE = { neutral: [21, 12, 6, 0, 0], serio: [21, 10, 6, 0, 0], esceptico: [21, 11, 6, 2, 0], sorprendido: [22, 16, 5, 0, 0],
  preocupado: [21, 13, 5, 0, 2], pensativo: [21, 12, 6, -6, -3], sonrisa: [21, 10, 6, 0, 0], cerrado: [21, 1.5, 0, 0, 0] };
const BROWS = { neutral: [[152, 94, 190, 92], [210, 92, 248, 94]], serio: [[152, 96, 190, 100], [210, 100, 248, 96]],
  esceptico: [[152, 98, 190, 98], [210, 86, 248, 92]], sorprendido: [[152, 84, 190, 80], [210, 80, 248, 84]],
  preocupado: [[152, 98, 190, 88], [210, 88, 248, 98]], pensativo: [[152, 98, 190, 96], [210, 88, 248, 92]],
  sonrisa: [[152, 94, 190, 92], [210, 92, 248, 94]], cerrado: [[152, 96, 190, 96], [210, 96, 248, 96]] };
const MOUTH = {
  neutral: <path d="M188 150 L212 150" stroke="#E6E6EA" strokeWidth="4" strokeLinecap="round" />,
  serio: <path d="M186 152 Q200 149 214 152" fill="none" stroke="#E6E6EA" strokeWidth="4" strokeLinecap="round" />,
  esceptico: <path d="M186 152 Q202 150 216 146" fill="none" stroke="#E6E6EA" strokeWidth="4" strokeLinecap="round" />,
  sorprendido: <ellipse cx="200" cy="153" rx="6" ry="8" fill="#E6E6EA" />,
  preocupado: <path d="M186 154 Q200 147 214 154" fill="none" stroke="#E6E6EA" strokeWidth="4" strokeLinecap="round" />,
  pensativo: <path d="M190 152 L214 149" stroke="#E6E6EA" strokeWidth="4" strokeLinecap="round" />,
  sonrisa: <path d="M184 148 Q202 160 218 146" fill="none" stroke="#E6E6EA" strokeWidth="4" strokeLinecap="round" />,
  cerrado: <path d="M190 151 L210 151" stroke="#E6E6EA" strokeWidth="4" strokeLinecap="round" />,
};

export const Head = ({ exp = 'neutral', t = 0, hair = 'xeno', look = 0 }) => {
  const id = React.useMemo(() => `hl${GID++}`, []);
  const blink = exp !== 'cerrado' && (t % 3.4) > 3.25;
  const [w, h, pr, dx0, dy] = EYE[exp] || EYE.neutral;
  const dx = dx0 + look;
  const hh = blink ? 1.5 : h;
  return <g>
    <defs><radialGradient id={id} gradientUnits="userSpaceOnUse" cx="178" cy="78" r="120">
      <stop offset="0" stopColor="#5A6680" /><stop offset=".55" stopColor="#2E3646" /><stop offset="1" stopColor="#1A1F2A" />
    </radialGradient></defs>
    {[122, 278].map((x) => <ellipse key={x} cx={x} cy="116" rx="9" ry="15" fill={`url(#${id})`} stroke={OUT} strokeWidth="4" />)}
    <ellipse cx="200" cy="108" rx="78" ry="86" fill={`url(#${id})`} stroke={OUT} strokeWidth="4" />
    {hair === 'xeno' && <path d="M126 92 Q128 30 200 28 Q266 28 276 86 Q262 58 222 52 Q236 62 232 70 Q206 50 160 60 Q138 68 126 92Z" fill="#11141B" stroke={OUT} strokeWidth="4" strokeLinejoin="round" />}
    {hair === 'largo' && <path d="M122 120 Q110 30 200 26 Q290 30 280 120 L292 200 Q270 150 268 100 Q240 60 200 62 Q150 62 132 100 Q130 150 108 200Z" fill="#11141B" stroke={OUT} strokeWidth="4" />}
    {hair === 'moño' && <g><circle cx="200" cy="22" r="26" fill="#11141B" stroke={OUT} strokeWidth="4" /><path d="M126 96 Q130 34 200 32 Q270 34 274 96 Q250 60 200 58 Q150 60 126 96Z" fill="#11141B" stroke={OUT} strokeWidth="4" /></g>}
    {hair === 'casco' && <path d="M118 104 Q118 20 200 18 Q282 20 282 104 L270 104 Q266 50 200 46 Q134 50 130 104Z" fill="#9EE7FF" opacity="0.85" stroke={OUT} strokeWidth="4" />}
    {(BROWS[exp] || BROWS.neutral).map(([a, b, c, d], k) => <path key={k} d={`M${a} ${b} L${c} ${d}`} stroke={BROW} strokeWidth="7" strokeLinecap="round" />)}
    {[172, 228].map((x, k) => {
      const hk = exp === 'esceptico' && k === 0 ? hh - 3 : hh;
      return <g key={x}>
        <path d={almond(x, 112, w, Math.max(1.5, hk))} fill="#F4F4F6" />
        {hk > 3 && pr > 0 && <><circle cx={x + dx} cy={112 + dy} r={pr} fill={OUT} /><circle cx={x + dx + 2} cy={110 + dy} r="1.8" fill="#fff" /></>}
      </g>;
    })}
    {MOUTH[exp] || MOUTH.neutral}
  </g>;
};

const Arm = ({ d, c }) => <g>
  <path d={d} fill="none" stroke={OUT} strokeWidth="32" strokeLinecap="round" />
  <path d={d} fill="none" stroke={c} strokeWidth="23" strokeLinecap="round" />
</g>;
const Hand = ({ x, y }) => <ellipse cx={x} cy={y} rx="11" ry="13" fill="#262D3B" stroke={OUT} strokeWidth="4" />;
const ARMS = {
  normal: [[140, 222, 120, 300, 128, 382], [260, 222, 280, 300, 272, 382]],
  explica: [[140, 222, 120, 300, 128, 382], [260, 222, 320, 262, 336, 210]],
  pensando: [[140, 222, 120, 300, 128, 382], [260, 222, 290, 260, 222, 166]],
  brazos: [[140, 222, 150, 300, 238, 292], [260, 222, 250, 300, 162, 290]],
  shock: [[140, 222, 80, 220, 70, 140], [260, 222, 320, 220, 330, 140]],
  saluda: [[140, 222, 120, 300, 128, 382], [260, 222, 330, 200, 330, 120]],
  sostiene: [[140, 222, 140, 300, 180, 300], [260, 222, 260, 300, 220, 300]],
};

// Persona completa. jacket/tee/pants: colores; pin: el "?" de Xeno.
export const Person = ({ x = 960, y = 900, s = 1, exp = 'neutral', pose = 'normal', t = 0, flip = false, jacket = '#3A4A63', jacketD = '#2A374B',
  tee = '#ECEFF3', pants = '#1F2430', pin = true, hair = 'xeno', look = 0, bob = true, wave = 0 }) => {
  const by = bob ? Math.sin(t * 2.2) * 3 : 0;
  const [a1, a2] = ARMS[pose] || ARMS.normal;
  const a2w = pose === 'saluda' ? [a2[0], a2[1], a2[2] + Math.sin(t * 9) * 14 * wave, a2[3], a2[4] + Math.sin(t * 9) * 18, a2[5]] : a2;
  const arm = (a) => `M${a[0]} ${a[1]} Q${a[2]} ${a[3]} ${a[4]} ${a[5]}`;
  const head = <g transform={`translate(0 ${by * 0.6})`}><Head exp={exp} t={t} hair={hair} look={look} /></g>;
  return <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s}) translate(-200 -580)`}>
    {[[182, -4], [218, 4]].map(([lx, dx]) => <g key={lx}>
      <path d={`M${lx} 396 L${lx + dx} 560`} stroke={OUT} strokeWidth="34" strokeLinecap="round" />
      <path d={`M${lx} 396 L${lx + dx} 560`} stroke={pants} strokeWidth="25" strokeLinecap="round" />
    </g>)}
    {[172, 228].map((sx) => <path key={sx} d={`M${sx - 24} 580 Q${sx - 22} 556 ${sx + 2} 556 Q${sx + 30} 558 ${sx + 32} 580Z`} fill="#E9E9E9" stroke={OUT} strokeWidth="4" strokeLinejoin="round" />)}
    <g transform={`translate(0 ${by})`}>
      <rect x="186" y="186" width="28" height="22" fill="#262D3B" stroke={OUT} strokeWidth="4" />
      <path d="M176 204 L224 204 L230 390 L170 390Z" fill={tee} stroke={OUT} strokeWidth="4" />
      <path d="M136 214 Q200 194 264 214 L270 398 Q238 404 222 400 L216 212 L184 212 L178 400 Q162 404 130 398Z" fill={jacket} stroke={OUT} strokeWidth="4" strokeLinejoin="round" />
      <path d="M184 210 L172 246 L190 232Z M216 210 L228 246 L210 232Z" fill={jacketD} stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
      <path d="M130 384 Q150 392 178 390 M222 390 Q250 392 270 384" fill="none" stroke={jacketD} strokeWidth="9" />
      {pin && <g><circle cx="246" cy="250" r="10" fill="#F2B134" stroke={OUT} strokeWidth="3" />
        <text x="246" y="256" textAnchor="middle" fontFamily="Arial Black, Arial" fontWeight="900" fontSize="15" fill={OUT}>?</text></g>}
      {pose === 'pensando' ? <><Arm d={arm(a1)} c={jacket} /><Hand x={a1[4]} y={a1[5]} />{head}<Arm d={arm(a2w)} c={jacket} /><Hand x={a2w[4]} y={a2w[5]} /></>
        : <>{head}<Arm d={arm(a1)} c={jacket} /><Hand x={a1[4]} y={a1[5]} /><Arm d={arm(a2w)} c={jacket} /><Hand x={a2w[4]} y={a2w[5]} /></>}
    </g>
  </g>;
};

export const Xeno = (p) => <Person {...p} />;
// paleta de personas del futuro (3026)
export const FUT = [
  { jacket: '#E86A92', jacketD: '#C24F75', tee: '#FFF4E0', pants: '#3B2E5A', hair: 'casco' },
  { jacket: '#3FB8AF', jacketD: '#2C8C85', tee: '#F1F7F6', pants: '#26324A', hair: 'moño' },
  { jacket: '#F2B134', jacketD: '#C98E1E', tee: '#FFFFFF', pants: '#2B2D42', hair: 'largo' },
  { jacket: '#7A6FF0', jacketD: '#5A50C8', tee: '#EEF', pants: '#1F2430', hair: 'casco' },
];
