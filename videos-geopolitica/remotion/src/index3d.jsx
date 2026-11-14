import React from 'react';
import { registerRoot, Composition } from 'remotion';
import { Inodoro, DUR } from './three/inodoro.jsx';
registerRoot(() => <>
  <Composition id="INODORO" component={Inodoro} durationInFrames={DUR} fps={30} width={1080} height={1920} />
</>);
