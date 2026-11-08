import React from 'react';
import { registerRoot, Composition, useCurrentFrame, AbsoluteFill } from 'remotion';
import d15 from './data15.json';
import d16 from './data16.json';
import d17 from './data17.json';
import { S15, ORDER15 } from './scenes15.jsx';
import { S16, ORDER16 } from './scenes16.jsx';
import { S17, ORDER17 } from './scenes17.jsx';
const P = { 15: [d15, S15, ORDER15], 16: [d16, S16, ORDER16], 17: [d17, S17, ORDER17] };
const Scene = ({ v, i }) => {
  const f = useCurrentFrame();
  const [data, S, O] = P[v];
  const sc = data[i];
  return <AbsoluteFill style={{ background: '#03142a' }}>{S[O[i]]({ t: f / 30, f, frames: sc.frames, i, n: data.length, title: i === 1 ? null : sc.titulo })}</AbsoluteFill>;
};
registerRoot(() => <>{[15, 16, 17].map((v) => P[v][0].map((sc, i) => <Composition key={v + '_' + i} id={`V${v}-${String(i).padStart(2, "0")}`} component={Scene} defaultProps={{ v, i }} durationInFrames={sc.frames} fps={30} width={1920} height={1080} />))}</>);
