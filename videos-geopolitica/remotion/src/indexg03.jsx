// ViceLeakss g03 (16:9, video largo) con el estilo de las referencias: fondo #0B0B10 con grano, 3D semitono, textos palabra por palabra.
import React from 'react';
import { registerRoot, Composition, useCurrentFrame, AbsoluteFill } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import D from './datag03.json';
import { Cam, cl, tw } from './three/kit.jsx';
import { C, Bridge, PriceTag, Strike, Plate, Dust } from './three/world_g02.jsx';
import { SG3 } from './three/scenes_g03.jsx';

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zñ0-9]/g, '');
const COL = { r: C.red, l: C.lime, b: C.blue };
// "TEXTO ^rROJO ^lLIMA ^bAZUL ^sTACHADO"
const parse = (s) => s.split(' ').map((w) => {
  const m = w.match(/^\^([rlbs])(.*)$/); if (!m) return { w, c: C.text, s: 0 };
  return { w: m[2], c: m[1] === 's' ? C.text : COL[m[1]], s: m[1] === 's' ? 1 : 0 };
});
const FONT = '"Inter Display", Inter, sans-serif';
const Caps = ({ caps = [], words = [], t, d }) => {
  const timed = caps.map(([trig, text]) => {
    const alts = trig.split('|').map(norm);
    const w = words.find(([x]) => alts.some((a) => norm(x).includes(a)));
    return { at: w ? w[1] : null, ws: parse(text) };
  }).filter((c) => c.at !== null).sort((a, b) => a.at - b.at);
  const out = [];
  timed.forEach((c, k) => {
    const end = k + 1 < timed.length ? timed[k + 1].at : d - 0.05;
    if (t < c.at - 0.02 || t > end) return;
    const ex = cl((t - (end - 0.22)) / 0.22); // salida: desenfoque + gris
    out.push(<div key={k} style={{ position: 'absolute', top: 70, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 78, letterSpacing: 1, transform: 'scaleX(1.06)', textShadow: '0 4px 14px rgba(0,0,0,0.6)', filter: `blur(${ex * 10}px)`, opacity: 1 - ex * 0.9 }}>
      {c.ws.map((x, j) => {
        const u = cl((t - c.at - j * 0.11) / 0.18);
        const col = ex > 0 ? '#6b6b70' : x.c;
        return <span key={j} style={{ display: 'inline-block', position: 'relative', margin: '0 12px', color: col, opacity: u, transform: `translateY(${(1 - u) * 16}px) scale(${0.9 + 0.1 * u})`, filter: `blur(${(1 - u) * 6}px)` }}>
          {x.w}{x.s ? <span style={{ position: 'absolute', left: -4, right: -4, top: '52%', height: 8, background: C.red, transformOrigin: 'left', transform: `scaleX(${cl((t - c.at - j * 0.11 - 0.2) / 0.2)})` }} /> : null}
        </span>;
      })}
    </div>);
  });
  return <>{out}</>;
};
// grano animado del fondo
const Grain = ({ f }) => <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen', opacity: 0.07, pointerEvents: 'none' }}>
  <filter id={`g${f % 8}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 8} /></filter>
  <rect width="100%" height="100%" filter={`url(#g${f % 8})`} />
</svg>;

const Scene = ({ i, at }) => {
  const f0 = useCurrentFrame();
  const sc = D[i];
  const f = at !== undefined ? Math.round(sc.frames * at) : f0;
  const t = f / 30, d = sc.frames / 30;
  const S = SG3[sc.tipo]({ t, d });
  const g = Math.min(tw(t, 0, 0.3), 1 - tw(t, d - 0.3, d)); // transición: todo se encoge a una bolita roja y la siguiente escena sale de ella
  const k0 = S.keys[0], k1 = S.keys[S.keys.length - 1];
  const tgt = t < d / 2 ? [k0[4], k0[5], k0[6]] : [k1[4], k1[5], k1[6]];
  return <AbsoluteFill style={{ background: C.bg }}>
    <ThreeCanvas width={1920} height={1080} dpr={0.5} gl={{ antialias: false }} camera={{ fov: 40, position: [0, 1, 4], near: 0.02, far: 200 }}>
      <color attach="background" args={[C.bg]} />
      <Cam t={t} keys={S.keys} wob={0.08} />
      <group scale={0.0001 + g}>{S.three}</group>
      <Bridge sc={(1 - g) * (g < 0.999 ? 1 : 0)} pos={tgt} />
    </ThreeCanvas>
    <div style={{ position: 'absolute', inset: 0, opacity: g }}>{S.ov || null}</div>
    <Caps caps={sc.caps} words={sc.words} t={t} d={d} />
    <Grain f={f} />
  </AbsoluteFill>;
};

const Thumb = () => <AbsoluteFill style={{ background: C.bg }}>
  <ThreeCanvas width={1280} height={720} gl={{ antialias: true }} camera={{ fov: 40, position: [0, 1, 4] }}>
    <color attach="background" args={[C.bg]} /><Cam t={0} keys={[[0, 0.35, 0.85, 3.4, 0.55, 0.62, 0]]} />
    <Plate r={1.1} pos={[-0.6, 0, 0]} /><Dust t={3} />
    <group position={[-0.65, 0.68, 0]} rotation={[0, 0.3, -0.06]} scale={1.15}><PriceTag text="19 NOV" color={C.lime} /></group>
  </ThreeCanvas>
  <div style={{ position: 'absolute', right: 40, top: 90, textAlign: 'right', fontFamily: FONT, fontWeight: 900, lineHeight: 0.98, transform: 'scaleX(1.05)', transformOrigin: 'right' }}>
    <div style={{ fontSize: 96, color: C.text }}>GTA 6</div>
    <div style={{ fontSize: 96, color: C.text }}>TODO LO</div>
    <div style={{ fontSize: 112, color: C.red }}>CONFIRMADO</div>
    <div style={{ fontSize: 46, color: C.lime, fontFamily: '"JetBrains Mono", monospace', marginTop: 16 }}>DATO vs RUMOR</div>
  </div>
  <Grain f={3} />
</AbsoluteFill>;
const Sheet = ({ at }) => { const f = useCurrentFrame(); return <Scene i={f % D.length} at={at} />; };
registerRoot(() => <>
  {D.map((sc, i) => <Composition key={i} id={`G03-${String(i).padStart(2, '0')}`} component={Scene} defaultProps={{ i }} durationInFrames={sc.frames} fps={30} width={1920} height={1080} />)}
  <Composition id="THUMB" component={Thumb} durationInFrames={1} fps={30} width={1280} height={720} />
  <Composition id="SHEET" component={Sheet} defaultProps={{ at: 0.6 }} durationInFrames={D.length} fps={30} width={1920} height={1080} />
</>);
