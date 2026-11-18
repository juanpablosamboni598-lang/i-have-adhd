import React from 'react';
import { registerRoot, Composition, useCurrentFrame, AbsoluteFill, getInputProps } from 'remotion';
const P = getInputProps();
import { ThreeCanvas } from '@remotion/three';
import dfb from './datafb05.json';
import { Cam, INK, cl, Dibujo, GranoPapel } from './three/kit.jsx';
globalThis.__OLK = 0.55;  // contornos más finos, como la referencia
import { Lights } from './three/fb05.jsx';
import { SFB05 } from './three/scenesfb05.jsx';

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
// subtítulos grandes abajo: 3 palabras a la vez, la palabra que suena en amarillo
const Subs = ({ words = [], t }) => {
  if (!words.length) return null;
  let k = words.findIndex((w, j) => t < (words[j + 1] ? words[j + 1][1] : 1e9) && t >= w[1] - 0.05);
  if (k < 0) { if (t < words[0][1]) return null; k = words.length - 1; }
  const g = Math.floor(k / 3) * 3, chunk = words.slice(g, g + 3);
  return <div style={{ position: 'absolute', top: 1380, width: '100%', textAlign: 'center', fontFamily: 'Inter Display, Inter, sans-serif', fontWeight: 900, fontSize: 92, lineHeight: 1.05,
    WebkitTextStroke: '10px #141018', paintOrder: 'stroke fill', letterSpacing: -1 }}>
    {chunk.map(([w], j) => <span key={j} style={{ display: 'inline-block', margin: '0 14px', color: g + j === k ? '#ffd23d' : '#ffffff', transform: g + j === k ? 'scale(1.08)' : 'none' }}>{w.replace(/[.,]/g, '')}</span>)}
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
  const sc = dfb[i];
  const f = at !== undefined ? Math.round(sc.frames * at) : f0;
  const t = f / 30, d = sc.frames / 30;
  const S = SFB05[sc.tipo]({ t, d });
  const W = vert ? 1080 : 1920, H = vert ? 1920 : 1080;
  return <AbsoluteFill style={{ background: '#dbe9f2' }}>
    <ThreeCanvas width={W} height={H} dpr={P.dpr ?? 1} shadows gl={{ antialias: P.aa ?? false }} camera={{ fov: vert ? 58 : 40, position: [0, 1, 4], near: 0.02, far: 200 }}>
      <Dibujo edges={P.edges ?? true} /><Lights /><Cam t={t} keys={S.keys} fov={58} wob={0.03} />
      {S.three}
    </ThreeCanvas>
    {S.ov}
    <Caps caps={S.caps} words={sc.words} t={t} vert={vert} />
    <Subs words={sc.words} t={t} />
    <GranoPapel />
  </AbsoluteFill>;
};

const Sheet = ({ at }) => { const f = useCurrentFrame(); return <Scene i={f % dfb.length} at={at} vert />; };
registerRoot(() => <>
  {dfb.map((sc, i) => <Composition key={i} id={`FB05-${String(i).padStart(2, '0')}`} component={Scene} defaultProps={{ i, vert: true }} durationInFrames={sc.frames} fps={30} width={1080} height={1920} />)}
  <Composition id="SHEET" component={Sheet} defaultProps={{ at: 0.6 }} durationInFrames={dfb.length} fps={30} width={1080} height={1920} />
</>);
