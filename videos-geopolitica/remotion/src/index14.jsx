import React from 'react';
import { registerRoot, Composition, useCurrentFrame, AbsoluteFill } from 'remotion';
import data from './data14.json';
import { SA } from './scenes14a.jsx';
import { SB } from './scenes14b.jsx';
const ALL = [...SA, ...SB];
const Scene = ({ i }) => {
  const f = useCurrentFrame();
  const sc = data[i];
  return <AbsoluteFill style={{ background: '#03142a' }}>{ALL[i]({ t: f / 30, f, frames: sc.frames, i, n: data.length, title: i === 1 ? null : sc.titulo })}</AbsoluteFill>;
};
registerRoot(() => <>{data.map((sc, i) => <Composition key={i} id={`T${String(i).padStart(2, '0')}`} component={Scene} defaultProps={{ i }} durationInFrames={sc.frames} fps={30} width={1920} height={1080} />)}</>);
