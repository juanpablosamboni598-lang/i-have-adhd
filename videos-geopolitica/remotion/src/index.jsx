import React from 'react';
import { registerRoot, Composition, useCurrentFrame, AbsoluteFill, staticFile } from 'remotion';
import data from './data.json';
import { S1 } from './scenes1.jsx';
let S2 = [], S3 = [];
try { S2 = require('./scenes2.jsx').S2; } catch (e) {}
try { S3 = require('./scenes3.jsx').S3; } catch (e) {}
const ALL = [...S1, ...S2, ...S3];

const Scene = ({ i }) => {
  const f = useCurrentFrame();
  const sc = data[i];
  const Fn = ALL[i];
  return (
    <AbsoluteFill style={{ background: '#03142a' }}>
      {Fn ? Fn({ t: f / 30, f, frames: sc.frames, i, title: i === 2 ? null : sc.titulo }) : null}
    </AbsoluteFill>
  );
};
const Root = () => (
  <>
    {data.map((sc, i) => (
      <Composition key={i} id={`S${String(i).padStart(2, '0')}`} component={Scene} defaultProps={{ i }} durationInFrames={sc.frames} fps={30} width={1920} height={1080} />
    ))}
  </>
);
registerRoot(Root);
