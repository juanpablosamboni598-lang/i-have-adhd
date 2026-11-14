import React from 'react';
import { registerRoot, Composition, useCurrentFrame, AbsoluteFill } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import d22 from './data22.json';
import { Cam, INK, cl } from './three/kit.jsx';
import { Lights22, Kitchen, Fridge } from './three/world22.jsx';
import { S22 } from './three/scenes22.jsx';

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zñ0-9]/g, '');
// texto sincronizado: aparece cuando la voz dice la palabra clave
const Caps = ({ caps = [], words = [], t, vert }) => {
  const timed = caps.map(([trig, txt, col]) => {
    const w = words.find(([x]) => norm(x).includes(norm(trig)));
    return { at: w ? w[1] : null, txt, col: col || INK };
  }).filter((c) => c.at !== null).sort((a, b) => a.at - b.at);
  let cur = null;
  for (const c of timed) if (t >= c.at - 0.05) cur = c;
  if (!cur) return null;
  const ws = cur.txt.split(' ');
  const shown = ws.filter((_, k) => t >= cur.at + k * 0.12);
  return <div style={{ position: 'absolute', top: vert ? 230 : 46, width: '100%', textAlign: 'center', fontFamily: 'Inter Display, Inter, sans-serif', fontWeight: 900, fontSize: vert ? 84 : 72, color: cur.col, letterSpacing: -1, textShadow: '0 4px 0 rgba(255,255,255,0.75)' }}>
    {shown.map((w, k) => <span key={k} style={{ display: 'inline-block', marginRight: 18, transform: `translateY(${(1 - cl((t - cur.at - k * 0.12) / 0.15)) * 14}px)`, opacity: cl((t - cur.at - k * 0.12) / 0.12) }}>{w}</span>)}
  </div>;
};
const Wipe = ({ f, i }) => {
  if (f > 9) return null;
  const u = f / 9;
  return <AbsoluteFill style={{ background: ['#ffd23d', '#1fb5a5', '#e2483d', '#ffffff'][i % 4], clipPath: i % 2 ? `circle(${(1 - u) * 120}% at 50% 50%)` : `inset(0 0 0 ${u * 100}%)` }} />;
};
const vkeys = (keys) => keys.map(([t, x, y, z, tx, ty, tz]) => [t, tx + (x - tx) * 1.45, ty + (y - ty) * 1.2, tz + (z - tz) * 1.45, tx, ty, tz]);

const Scene = ({ i, at, vert }) => {
  const f0 = useCurrentFrame();
  const sc = d22[i];
  const f = at !== undefined ? Math.round(sc.frames * at) : f0;
  const t = f / 30, d = sc.frames / 30;
  const S = S22[sc.tipo]({ t, d });
  const W = vert ? 1080 : 1920, H = vert ? 1920 : 1080;
  return <AbsoluteFill style={{ background: '#bfe3d9' }}>
    <ThreeCanvas width={W} height={H} dpr={0.5} shadows gl={{ antialias: false }} camera={{ fov: vert ? 58 : 40, position: [0, 1, 4], near: 0.02, far: 200 }}>
      <Lights22 /><Cam t={t} keys={vert ? vkeys(S.keys) : S.keys} wob={0.12} />
      {S.three}
    </ThreeCanvas>
    {vert ? null : S.ov}
    <Caps caps={S.caps} words={sc.words} t={t} vert={vert} />
    <Wipe f={f} i={i} />
  </AbsoluteFill>;
};

const TON = { shell: 1, door: 1, shelves: 1, food: 1, evap: 1, comp: 1, cond: 1, capil: 1 };
const Thumb = () => <AbsoluteFill style={{ background: '#bfe3d9' }}>
  <ThreeCanvas width={1280} height={720} shadows gl={{ antialias: true }} camera={{ fov: 40, position: [0, 1, 4] }}>
    <Lights22 /><Cam t={0} keys={[[0, 1.25, 1.0, 2.5, 0.75, 0.9, 0]]} />
    <Kitchen /><Fridge t={1.3} rotY={Math.PI - 0.35} on={TON} xr={0.45} flow={1} comp={1} heat={1.3} />
  </ThreeCanvas>
  <div style={{ position: 'absolute', right: 40, top: 70, textAlign: 'right', fontFamily: 'Inter Display, Inter, sans-serif', fontWeight: 900, lineHeight: 0.95, WebkitTextStroke: '8px #141018', paintOrder: 'stroke fill' }}>
    <div style={{ fontSize: 96, color: '#ffffff' }}>¿POR QUÉ</div>
    <div style={{ fontSize: 96, color: '#ffffff' }}>ESTÁ</div>
    <div style={{ fontSize: 96, color: '#ff5a3c' }}>CALIENTE</div>
    <div style={{ fontSize: 130, color: '#ffffff' }}>ATRÁS?</div>
  </div>
</AbsoluteFill>;
const Sheet = ({ at }) => { const f = useCurrentFrame(); return <Scene i={f % d22.length} at={at} />; };
registerRoot(() => <>
  {d22.map((sc, i) => <Composition key={i} id={`V22-${String(i).padStart(2, '0')}`} component={Scene} defaultProps={{ i }} durationInFrames={sc.frames} fps={30} width={1920} height={1080} />)}
  {d22.map((sc, i) => <Composition key={'v' + i} id={`VV22-${String(i).padStart(2, '0')}`} component={Scene} defaultProps={{ i, vert: true }} durationInFrames={sc.frames} fps={30} width={1080} height={1920} />)}
  <Composition id="THUMB" component={Thumb} durationInFrames={1} fps={30} width={1280} height={720} />
  <Composition id="SHEET" component={Sheet} defaultProps={{ at: 0.6 }} durationInFrames={d22.length} fps={30} width={1920} height={1080} />
</>);
