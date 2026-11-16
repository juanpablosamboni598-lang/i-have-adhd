import React from 'react';
import { registerRoot, Composition, useCurrentFrame, AbsoluteFill } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import d23 from './data23.json';
import { Cam, INK, cl, Dibujo, GranoPapel } from './three/kit.jsx';
globalThis.__OLK = 0.55;  // contornos más finos, como la referencia
import { Lights23, Laundry, Washer } from './three/world23.jsx';
import { S23 } from './three/scenes23.jsx';

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
  return <AbsoluteFill style={{ background: '#f3d9b8' }}>
    <ThreeCanvas width={W} height={H} dpr={1} shadows gl={{ antialias: true }} camera={{ fov: vert ? 58 : 40, position: [0, 1, 4], near: 0.02, far: 200 }}>
      <Dibujo /><Lights23 /><Cam t={t} keys={vert ? vkeys(S.keys) : S.keys} wob={0.12} />
      {S.three}
    </ThreeCanvas>
    {vert ? null : S.ov}
    <Caps caps={S.caps} words={sc.words} t={t} vert={vert} />
    <GranoPapel />
  </AbsoluteFill>;
};

const Thumb = () => <AbsoluteFill style={{ background: '#f3d9b8' }}>
  <ThreeCanvas width={1280} height={720} shadows gl={{ antialias: true }} camera={{ fov: 40, position: [0, 1, 4] }}>
    <Dibujo /><Lights23 /><Cam t={0} keys={[[0, 0.85, 0.72, 1.55, 0.42, 0.45, 0]]} />
    <Laundry /><Washer t={1.3} rotY={-0.35} on={{ drum: 1, holes: 1, paddles: 1, tub: 1, shell: 1, door: 1, motor: 1, belt: 1, valve: 1, hose: 1, heater: 1, pump: 1, filter: 1, weights: 1, springs: 1, gasket: 1, panel: 1 }} xr={0.82} hiW={1} ang={1.3} mode={1} level={0.5} foam={0.7} heat={0.8} />
  </ThreeCanvas>
  <svg width={1280} height={720} style={{ position: 'absolute', left: 0, top: 0 }}><g stroke="#141018" strokeWidth={26} strokeLinecap="round" fill="none"><path d="M690 300 Q600 250 515 165" /><path d="M515 165 l58 8 M515 165 l8 58" /></g><g stroke="#ff5a3c" strokeWidth={14} strokeLinecap="round" fill="none"><path d="M690 300 Q600 250 515 165" /><path d="M515 165 l58 8 M515 165 l8 58" /></g></svg>
  <div style={{ position: 'absolute', right: 40, top: 80, textAlign: 'right', fontFamily: 'Inter Display, Inter, sans-serif', fontWeight: 900, lineHeight: 0.95, WebkitTextStroke: '8px #141018', paintOrder: 'stroke fill' }}>
    <div style={{ fontSize: 100, color: '#ffffff' }}>¿QUÉ HAY</div>
    <div style={{ fontSize: 100, color: '#ffffff' }}>DENTRO?</div>
    <div style={{ fontSize: 120, color: '#ff5a3c' }}>CONCRETO</div>
  </div>
</AbsoluteFill>;
const Sheet = ({ at }) => { const f = useCurrentFrame(); return <Scene i={f % d23.length} at={at} />; };
registerRoot(() => <>
  {d23.map((sc, i) => <Composition key={i} id={`PR-${String(i).padStart(2, '0')}`} component={Scene} defaultProps={{ i, vert: true }} durationInFrames={sc.frames} fps={30} width={1080} height={1920} />)}
</>);
