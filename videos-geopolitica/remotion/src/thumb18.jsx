import React from 'react';
import { registerRoot, Composition, AbsoluteFill } from 'remotion';
import { Cat } from './actors4.jsx';
const T = ({ x, y, size, color, children, rot = 0 }) => <text transform={`translate(${x} ${y}) rotate(${rot})`} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={size} fill={color} stroke="#120a24" strokeWidth={size / 7} paintOrder="stroke">{children}</text>;
const A = () => <AbsoluteFill><svg width={1280} height={720}><defs><radialGradient id="g" cx="0.68" cy="0.45" r="0.8"><stop offset="0" stopColor="#5ab4f0" /><stop offset="1" stopColor="#0a2a5a" /></radialGradient></defs><rect width={1280} height={720} fill="url(#g)" />
  <g opacity={0.45}><Cat x={760} y={150} s={0.55} t={1} rollF={Math.PI} rollB={Math.PI} headRoll={Math.PI} /></g>
  <g opacity={0.7}><Cat x={860} y={300} s={0.7} t={1} rollF={0.2} rollB={Math.PI * 0.9} headRoll={0} tuckF={1} /></g>
  <Cat x={930} y={520} s={1.15} t={1} spread={0.15} mouth={0.4} />
  <path d="M1180,120 A220,220 0 0 1 1180,520" stroke="#ffd23c" strokeWidth={16} fill="none" /><path d="M1150,520 L1180,560 L1210,515Z" fill="#ffd23c" />
  <T x={340} y={250} size={110} color="#ffd23c" rot={-4}>SIEMPRE</T><T x={340} y={380} size={96} color="#fff" rot={-4}>DE PIE</T><T x={340} y={500} size={70} color="#7dfcff" rot={-4}>¿CÓMO?</T></svg></AbsoluteFill>;
registerRoot(() => <Composition id="TA" component={A} durationInFrames={1} fps={30} width={1280} height={720} />);
