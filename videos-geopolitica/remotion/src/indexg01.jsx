import React from 'react';
import { registerRoot, Composition, useCurrentFrame, AbsoluteFill } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import d23 from './datag01.json';
import { Cam, INK, cl } from './three/kit.jsx';
import { LightsG as Lights23, Studio, Console, Calendar, Pad, Palm, Car, P } from './three/world_g01.jsx';
import { SG as S23 } from './three/scenes_g01.jsx';

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
  const sc = d23[i];
  const f = at !== undefined ? Math.round(sc.frames * at) : f0;
  const t = f / 30, d = sc.frames / 30;
  const S = S23[sc.tipo]({ t, d });
  const W = vert ? 1080 : 1920, H = vert ? 1920 : 1080;
  return <AbsoluteFill style={{ background: '#ffe1c2' }}>
    <ThreeCanvas width={W} height={H} dpr={0.5} shadows gl={{ antialias: false }} camera={{ fov: vert ? 58 : 40, position: [0, 1, 4], near: 0.02, far: 200 }}>
      <Lights23 /><Cam t={t} keys={vert ? vkeys(S.keys) : S.keys} wob={0.12} />
      {S.three}
    </ThreeCanvas>
    {vert ? null : S.ov}
    <Caps caps={S.caps} words={sc.words} t={t} vert={vert} />
    <Wipe f={f} i={i} />
  </AbsoluteFill>;
};

const Thumb = () => <AbsoluteFill style={{ background: '#ffe1c2' }}>
  <ThreeCanvas width={1280} height={720} shadows gl={{ antialias: true }} camera={{ fov: 40, position: [0, 1, 4] }}>
    <Lights23 /><Cam t={0} keys={[[0, 0.55, 0.85, 2.3, -0.55, 0.4, 0]]} />
    <Studio /><Palm pos={[-1.9, 0, -0.5]} t={0.4} />
    <Calendar pos={[-1.15, 0, 0.1]} label={'19\nNOV'} red={1} rotY={0.3} />
    <Console pos={[-0.35, 0, 0.05]} kind="a" glow={1} rotY={0.2} /><Console pos={[0.15, 0, 0.05]} kind="b" color={P.dark} glow={1} rotY={-0.2} />
    <Pad pos={[-0.3, 0.04, 0.6]} rot={[0, 0.3, 0]} color={P.white} /><Car pos={[-0.6, 0, 0.95]} rotY={0.5} t={0} />
  </ThreeCanvas>
  <div style={{ position: 'absolute', right: 40, top: 70, textAlign: 'right', fontFamily: 'Inter Display, Inter, sans-serif', fontWeight: 900, lineHeight: 0.95, WebkitTextStroke: '8px #141018', paintOrder: 'stroke fill' }}>
    <div style={{ fontSize: 96, color: '#ffffff' }}>SALE EL</div>
    <div style={{ fontSize: 120, color: '#ffd23d' }}>JUEVES</div>
    <div style={{ fontSize: 76, color: '#ffffff', marginTop: 18 }}>DATO</div>
    <div style={{ fontSize: 76, color: '#ff5a3c' }}>vs RUMOR</div>
  </div>
</AbsoluteFill>;
const Sheet = ({ at }) => { const f = useCurrentFrame(); return <Scene i={f % d23.length} at={at} />; };
registerRoot(() => <>
  {d23.map((sc, i) => <Composition key={i} id={`G01-${String(i).padStart(2, '0')}`} component={Scene} defaultProps={{ i }} durationInFrames={sc.frames} fps={30} width={1920} height={1080} />)}
  {d23.map((sc, i) => <Composition key={'v' + i} id={`VG01-${String(i).padStart(2, '0')}`} component={Scene} defaultProps={{ i, vert: true }} durationInFrames={sc.frames} fps={30} width={1080} height={1920} />)}
  <Composition id="THUMB" component={Thumb} durationInFrames={1} fps={30} width={1280} height={720} />
  <Composition id="SHEET" component={Sheet} defaultProps={{ at: 0.6 }} durationInFrames={d23.length} fps={30} width={1920} height={1080} />
</>);
