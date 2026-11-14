import React from 'react';
import { registerRoot, Composition } from 'remotion';
import { Inodoro, DUR } from './three/inodoro.jsx';
import { AbsoluteFill } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { MatcapModel } from './three/MatcapModel.jsx';
const MatcapTest = () => <AbsoluteFill style={{ background: '#bfe3d9' }}>
  <ThreeCanvas width={1280} height={720} dpr={0.5} gl={{ antialias: false }} camera={{ fov: 40, position: [0, 1.2, 4] }}>
    <ambientLight intensity={0.6} />
    <MatcapModel geo={<sphereGeometry args={[0.6, 32, 20]} />} color="#e2483d" pos={[-1.4, 0.8, 0]} />
    <MatcapModel geo={<boxGeometry args={[0.9, 0.9, 0.9]} />} color="#1fb5a5" pos={[0, 0.8, 0]} rot={[0.4, 0.6, 0]} />
    <MatcapModel geo={<torusKnotGeometry args={[0.35, 0.12, 96, 12]} />} color="#ffd23d" pos={[1.4, 0.8, 0]} />
  </ThreeCanvas>
</AbsoluteFill>;
registerRoot(() => <>
  <Composition id="MATCAPTEST" component={MatcapTest} durationInFrames={1} fps={30} width={1280} height={720} />
  <Composition id="INODORO" component={Inodoro} durationInFrames={DUR} fps={30} width={1080} height={1920} />
</>);
