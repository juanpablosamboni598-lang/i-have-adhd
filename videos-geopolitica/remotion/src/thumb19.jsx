import React from 'react';
import { registerRoot, Composition, AbsoluteFill } from 'remotion';
import { Dolphin, Brain2 } from './actors5.jsx';
const T = ({ x, y, size, color, children, rot = 0 }) => <text transform={`translate(${x} ${y}) rotate(${rot})`} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={size} fill={color} stroke="#0a1024" strokeWidth={size / 7} paintOrder="stroke">{children}</text>;
const A = () => <AbsoluteFill><svg width={1280} height={720}><defs><radialGradient id="g" cx="0.68" cy="0.5" r="0.8"><stop offset="0" stopColor="#2a6ea8" /><stop offset="1" stopColor="#030c22" /></radialGradient></defs><rect width={1280} height={720} fill="url(#g)" />
  {[...Array(40)].map((_, k) => <circle key={k} cx={(k * 211) % 1280} cy={(k * 97) % 720} r={1 + (k % 3)} fill="#bfe8ff" opacity={0.4} />)}
  <Dolphin x={860} y={470} s={1.05} t={0.4} swim={0.3} eye={1} /><circle cx={1070} cy={455} r={40} fill="none" stroke="#ffd23c" strokeWidth={7} />
  <Brain2 x={930} y={170} s={0.5} t={0.2} sleepL={0} sleepR={1} />
  <T x={330} y={250} size={96} color="#7dfcff" rot={-4}>DUERME</T><T x={330} y={370} size={96} color="#ffd23c" rot={-4}>CON MEDIO</T><T x={330} y={490} size={96} color="#fff" rot={-4}>CEREBRO</T></svg></AbsoluteFill>;
registerRoot(() => <Composition id="TA" component={A} durationInFrames={1} fps={30} width={1280} height={720} />);
