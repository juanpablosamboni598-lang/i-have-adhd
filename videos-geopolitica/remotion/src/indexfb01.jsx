import React from 'react';
import { registerRoot, Composition, useCurrentFrame, AbsoluteFill } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import dfb from './datafb01.json';
import { Cam, INK, cl } from './three/kit.jsx';
import { Lights } from './three/fb01.jsx';
import { SFB01 } from './three/scenesfb01.jsx';

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
  return <AbsoluteFill style={{ background: ['#ffdfbd', '#1fb5a5', '#e2483d', '#ffffff'][i % 4], clipPath: i % 2 ? `circle(${(1 - u) * 120}% at 50% 50%)` : `inset(0 0 0 ${u * 100}%)` }} />;
};
const vkeys = (keys) => keys.map(([t, x, y, z, tx, ty, tz]) => [t, tx + (x - tx) * 1.45, ty + (y - ty) * 1.2, tz + (z - tz) * 1.45, tx, ty, tz]);

const Scene = ({ i, at, vert }) => {
  const f0 = useCurrentFrame();
  const sc = dfb[i];
  const f = at !== undefined ? Math.round(sc.frames * at) : f0;
  const t = f / 30, d = sc.frames / 30;
  const S = SFB01[sc.tipo]({ t, d });
  const W = vert ? 1080 : 1920, H = vert ? 1920 : 1080;
  return <AbsoluteFill style={{ background: '#cfe3f5' }}>
    <ThreeCanvas width={W} height={H} dpr={0.5} shadows gl={{ antialias: false }} camera={{ fov: vert ? 58 : 40, position: [0, 1, 4], near: 0.02, far: 200 }}>
      <Lights /><Cam t={t} keys={S.keys} wob={0.12} />
      {S.three}
    </ThreeCanvas>
    {S.ov}
    <Caps caps={S.caps} words={sc.words} t={t} vert={vert} />
    <Wipe f={f} i={i} />
  </AbsoluteFill>;
};

const Sheet = ({ at }) => { const f = useCurrentFrame(); return <Scene i={f % dfb.length} at={at} vert />; };
registerRoot(() => <>
  {dfb.map((sc, i) => <Composition key={'v' + i} id={`FB01-${String(i).padStart(2, '0')}`} component={Scene} defaultProps={{ i, vert: true }} durationInFrames={sc.frames} fps={30} width={1080} height={1920} />)}
  <Composition id="SHEET" component={Sheet} defaultProps={{ at: 0.6 }} durationInFrames={dfb.length} fps={30} width={1080} height={1920} />
</>);
