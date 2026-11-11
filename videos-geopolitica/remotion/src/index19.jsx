import React from 'react';
import { registerRoot, Composition, useCurrentFrame, AbsoluteFill } from 'remotion';
import d19 from './data19.json';
import { S19, ORDER19 } from './scenes19.jsx';
const Scene = ({ i, at }) => {
  const f0 = useCurrentFrame();
  const sc = d19[i];
  const f = at !== undefined ? Math.round(sc.frames * at) : f0;
  return <AbsoluteFill style={{ background: '#03142a' }}>{S19[ORDER19[i]]({ t: f / 30, f, frames: sc.frames, i, n: d19.length, title: i === 1 ? null : sc.titulo })}</AbsoluteFill>;
};
const Sheet = ({ at }) => { const f = useCurrentFrame(); return <Scene i={f % d19.length} at={at} />; };
registerRoot(() => <>
  {d19.map((sc, i) => <Composition key={i} id={`V19-${String(i).padStart(2, '0')}`} component={Scene} defaultProps={{ i }} durationInFrames={sc.frames} fps={30} width={1920} height={1080} />)}
  <Composition id="SHEET" component={Sheet} defaultProps={{ at: 0.5 }} durationInFrames={d19.length} fps={30} width={1920} height={1080} />
</>);
