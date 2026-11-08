import React from 'react';
import { registerRoot, Composition, AbsoluteFill } from 'remotion';
import { Tardi, Lady, Aphid, Axo } from './actors3.jsx';
const T = ({ x, y, size, color, children, rot = 0 }) => <text transform={`translate(${x} ${y}) rotate(${rot})`} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={size} fill={color} stroke="#120a24" strokeWidth={size / 7} paintOrder="stroke">{children}</text>;
const Bg = ({ a, b, id }) => <><defs><radialGradient id={id} cx="0.62" cy="0.5" r="0.75"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></radialGradient></defs><rect width={1280} height={720} fill={`url(#${id})`} /></>;
const A = () => <AbsoluteFill><svg width={1280} height={720}><Bg a="#2a3a8a" b="#05081a" id="a" />{[...Array(60)].map((_, k) => <circle key={k} cx={(k * 211) % 1280} cy={(k * 97) % 720} r={1 + (k % 3)} fill="#fff" opacity={0.7} />)}
  <circle cx={1150} cy={760} r={260} fill="#2e86c4" opacity={0.9} /><Tardi x={860} y={400} s={1.7} t={1} walk={0.4} glow={0.8} rot={-8} />
  <T x={380} y={210} size={92} color="#7dfcff" rot={-4}>SOBREVIVIÓ</T><T x={380} y={330} size={92} color="#ffd23c" rot={-4}>AL ESPACIO</T></svg></AbsoluteFill>;
const B = () => <AbsoluteFill><svg width={1280} height={720}><Bg a="#7ac74f" b="#1d4a1a" id="b" />
  {[...Array(14)].map((_, k) => <Aphid key={k} x={720 + (k % 5) * 90} y={470 + Math.floor(k / 5) * 70} s={1.4} t={k} seed={k} />)}<Lady x={900} y={330} s={2.4} rot={15} t={1} walk={0.4} />
  <T x={370} y={220} size={100} color="#ffd23c" rot={-4}>CAZADORA</T><T x={370} y={340} size={84} color="#fff2c4" rot={-4}>DE PLAGAS</T></svg></AbsoluteFill>;
const Cc = () => <AbsoluteFill><svg width={1280} height={720}><Bg a="#1f8a8a" b="#062a2a" id="c" />
  <Axo x={700} y={430} s={1.7} t={1} missing={0.4} glow={0.9} mouth={0.3} />
  <T x={380} y={170} size={100} color="#ff9fb8" rot={-4}>LE VUELVE</T><T x={380} y={290} size={100} color="#7dfcff" rot={-4}>A CRECER</T></svg></AbsoluteFill>;
registerRoot(() => <><Composition id="TA" component={A} durationInFrames={1} fps={30} width={1280} height={720} /><Composition id="TB" component={B} durationInFrames={1} fps={30} width={1280} height={720} /><Composition id="TC" component={Cc} durationInFrames={1} fps={30} width={1280} height={720} /></>);
