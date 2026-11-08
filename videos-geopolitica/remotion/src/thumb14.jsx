import React from 'react';
import { registerRoot, Composition, AbsoluteFill } from 'remotion';
import { Croc, Quad } from './actors2.jsx';
import { Shark } from './actors.jsx';
const T = ({ x, y, size, color, children, rot = 0 }) => <text transform={`translate(${x} ${y}) rotate(${rot})`} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={size} fill={color} stroke="#120a24" strokeWidth={size / 7} paintOrder="stroke">{children}</text>;
const Bg = ({ a, b }) => <><defs><radialGradient id="g" cx="0.62" cy="0.5" r="0.7"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></radialGradient></defs><rect width={1280} height={720} fill="url(#g)" /></>;
const A = () => (<AbsoluteFill><svg width={1280} height={720}><Bg a="#5b2a86" b="#1a0b33" />
  <g transform="translate(250 450) scale(2.3)"><Croc x={0} y={0} s={1} t={0.7} jaw={0} tape={1} swim={0} /></g>
  <circle cx={1002} cy={466} r={120} fill="none" stroke="#ffd23c" strokeWidth={12} />
  <path d="M760,230 Q900,200 930,340" stroke="#ffd23c" strokeWidth={14} fill="none" /><path d="M905,330 L935,372 L958,324Z" fill="#ffd23c" />
  <T x={330} y={170} size={118} color="#ffd23c" rot={-4}>SOLO</T><T x={360} y={300} size={128} color="#7dff8a" rot={-4}>1 CINTA</T></svg></AbsoluteFill>);
const B = () => (<AbsoluteFill><svg width={1280} height={720}><Bg a="#0f6fb0" b="#06142c" />
  <g transform="translate(760 420) rotate(180) translate(-760 -420)"><Shark x={760} y={420} s={1.25} t={0.4} eyeRoll={1} speed={0} /></g>
  <T x={330} y={180} size={120} color="#ffd23c" rot={-4}>EN</T><T x={360} y={310} size={120} color="#7dfcff" rot={-4}>TRANCE</T></svg></AbsoluteFill>);
const Cc = () => (<AbsoluteFill><svg width={1280} height={720}><Bg a="#ff9a3c" b="#5a1e08" />
  <g transform="translate(780 330) scale(1.5)"><Quad kind="cheetah" x={0} y={0} s={1} t={1} run={false} speed={0.2} heat={0.8} tongue={1} mouth={0.6} /></g>
  <rect x={1130} y={120} width={50} height={330} rx={25} fill="#fff8e7" stroke="#120a24" strokeWidth={6} /><circle cx={1155} cy={470} r={50} fill="#ffd23c" stroke="#120a24" strokeWidth={6} /><rect x={1142} y={140} width={26} height={320} fill="#ffd23c" />
  <T x={330} y={180} size={120} color="#ffd23c" rot={-4}>30</T><T x={360} y={310} size={110} color="#fff2c4" rot={-4}>SEGUNDOS</T></svg></AbsoluteFill>);
registerRoot(() => <><Composition id="ThumbA" component={A} durationInFrames={1} fps={30} width={1280} height={720} /><Composition id="ThumbB" component={B} durationInFrames={1} fps={30} width={1280} height={720} /><Composition id="ThumbC" component={Cc} durationInFrames={1} fps={30} width={1280} height={720} /></>);
