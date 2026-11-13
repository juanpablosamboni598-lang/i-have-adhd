import React from 'react';
import { registerRoot, Composition, useCurrentFrame, AbsoluteFill } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import d20 from './data21.json';
import { Cam, INK, cl } from './three/kit.jsx';
import { Lights } from './three/world20.jsx';
import { S21 as S20, RED_CAPS21 as RED_CAPS } from './three/scenes21.jsx';

const Wipe = ({ f, i }) => {
  if (f > 12) return null;
  const u = f / 12, k = i % 4;
  const col = ['#ffd23d', '#1fb5a5', '#e2483d', '#ffffff'][i % 4];
  const st = k === 0 ? { clipPath: `circle(${(1 - u) * 120}% at 50% 50%)` }
    : k === 1 ? { transform: `translateX(${u * 100}%)` }
    : k === 2 ? { transform: `translateY(${-u * 100}%)` }
    : { clipPath: `polygon(0 0, ${(1 - u) * 140}% 0, ${(1 - u) * 140 - 40}% 100%, 0 100%)` };
  return <AbsoluteFill style={{ background: col, ...st }} />;
};

const Scene = ({ i, at }) => {
  const f0 = useCurrentFrame();
  const sc = d20[i];
  const f = at !== undefined ? Math.round(sc.frames * at) : f0;
  const t = f / 30, d = sc.frames / 30;
  const S = S20[sc.tipo]({ t, d });
  const cap = sc.tipo === 'titulo' || sc.tipo === 'cierre' ? null : sc.titulo;
  const n = cap ? Math.max(1, Math.ceil(cl((f - 6) / 10) * cap.length)) : 0;
  return <AbsoluteFill style={{ background: '#f3c9a4' }}>
    <ThreeCanvas width={1920} height={1080} dpr={0.5} gl={{ antialias: false }} camera={{ fov: 40, position: [0, 1, 4], near: 0.02, far: 200 }}>
      <Lights /><Cam t={t} keys={S.keys} />
      {S.three}
    </ThreeCanvas>
    {S.ov}
    {cap && f > 6 ? <div style={{ position: 'absolute', top: 40, width: '100%', textAlign: 'center', fontFamily: 'Inter Display, Inter, sans-serif', fontWeight: 900, fontSize: 76, color: RED_CAPS.has(sc.tipo) ? '#e2483d' : INK, textShadow: '0 4px 0 rgba(255,255,255,0.7)' }}>{cap.slice(0, n).toUpperCase()}</div> : null}
    <Wipe f={f} i={i} />
  </AbsoluteFill>;
};

const Sheet = ({ at }) => { const f = useCurrentFrame(); return <Scene i={f % d20.length} at={at} />; };
registerRoot(() => <>
  {d20.map((sc, i) => <Composition key={i} id={`V21-${String(i).padStart(2, '0')}`} component={Scene} defaultProps={{ i }} durationInFrames={sc.frames} fps={30} width={1920} height={1080} />)}
  <Composition id="SHEET" component={Sheet} defaultProps={{ at: 0.55 }} durationInFrames={d20.length} fps={30} width={1920} height={1080} />
</>);
