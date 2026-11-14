import React, { useLayoutEffect } from 'react';
import { registerRoot, Composition, useCurrentFrame, AbsoluteFill } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import dd from './data22demo.json';
import { Cam, INK, cl } from './three/kit.jsx';
import { matcapTexture } from './three/MatcapModel.jsx';
import { S22 } from './three/scenes22.jsx';

// Reglas de la skill: MatCap en los objetos, sin sombras en tiempo real, sombra falsa.
const MatcapPass = () => {
  const { scene } = useThree();
  useLayoutEffect(() => {
    scene.traverse((o) => {
      if (!o.isMesh || !o.material || o.userData.keepToon) return;
      const m = o.material;
      if (!m.isMeshToonMaterial) return;
      const g = o.geometry && o.geometry.type;
      if (g === 'PlaneGeometry' || g === 'CircleGeometry') return; // piso y pared: siguen en toon
      const mc = new THREE.MeshMatcapMaterial({ matcap: matcapTexture('#' + m.color.getHexString(), { shade: 0.6, rim: 0.2, spec: 0.55 }),
        map: m.map || null, transparent: true, opacity: m.opacity, depthWrite: m.depthWrite, side: m.side });
      o.material = mc;
      o.castShadow = false; o.receiveShadow = false;
    });
  });
  return null;
};
const FakeShadow = () => <group>
  <mesh rotation={[-Math.PI / 2, 0, -0.5]} position={[0.42, 0.004, -0.12]} scale={[1.6, 0.7, 1]}><circleGeometry args={[0.55, 32]} /><meshBasicMaterial color="#1b2a28" transparent opacity={0.22} depthWrite={false} /></mesh>
  <mesh position={[1.05, 0.95, -0.985]} rotation={[0, 0, 0]}>
    <shapeGeometry args={[(() => { const s = new THREE.Shape(); s.moveTo(-0.45, -0.95); s.lineTo(0.35, -0.95); s.lineTo(0.75, 0.85); s.lineTo(-0.05, 0.85); s.closePath(); return s; })()]} />
    <meshBasicMaterial color="#1b2a28" transparent opacity={0.16} depthWrite={false} />
  </mesh>
</group>;
const Caps = ({ caps = [], words = [], t }) => {
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zñ0-9]/g, '');
  const timed = caps.map(([trig, txt, col]) => { const w = words.find(([x]) => norm(x).includes(norm(trig))); return { at: w ? w[1] : null, txt, col: col || INK }; }).filter((c) => c.at !== null).sort((a, b) => a.at - b.at);
  let cur = null; for (const c of timed) if (t >= c.at - 0.05) cur = c;
  if (!cur) return null;
  const ws = cur.txt.split(' ');
  return <div style={{ position: 'absolute', top: 230, width: '100%', textAlign: 'center', fontFamily: 'Inter Display, Inter, sans-serif', fontWeight: 900, fontSize: 84, color: cur.col, textShadow: '0 4px 0 rgba(255,255,255,0.75)' }}>
    {ws.filter((_, k) => t >= cur.at + k * 0.12).map((w, k) => <span key={k} style={{ display: 'inline-block', marginRight: 18, transform: `translateY(${(1 - cl((t - cur.at - k * 0.12) / 0.15)) * 14}px)` }}>{w}</span>)}
  </div>;
};
const vkeys = (keys) => keys.map(([t, x, y, z, tx, ty, tz]) => [t, tx + (x - tx) * 1.45, ty + (y - ty) * 1.2, tz + (z - tz) * 1.45, tx, ty, tz]);
const Scene = ({ i, at }) => {
  const f0 = useCurrentFrame(); const sc = dd[i];
  const f = at !== undefined ? Math.round(sc.frames * at) : f0;
  const t = f / 30, d = sc.frames / 30;
  const S = S22[sc.tipo]({ t, d });
  return <AbsoluteFill style={{ background: '#bfe3d9' }}>
    <ThreeCanvas width={1080} height={1920} dpr={0.5} gl={{ antialias: false }} camera={{ fov: 58, position: [0, 1, 4], near: 0.02, far: 200 }}>
      <ambientLight intensity={0.95} /><directionalLight position={[-3.5, 3.2, 3.0]} intensity={1.6} />
      <Cam t={t} keys={vkeys(S.keys)} wob={0.12} />
      {S.three}<FakeShadow /><MatcapPass />
    </ThreeCanvas>
    <Caps caps={S.caps} words={sc.words} t={t} />
    {f < 9 ? <AbsoluteFill style={{ background: ['#ffd23d', '#1fb5a5', '#e2483d'][i % 3], clipPath: `inset(0 0 0 ${f / 9 * 100}%)` }} /> : null}
  </AbsoluteFill>;
};
const Sheet = ({ at }) => { const f = useCurrentFrame(); return <Scene i={f % dd.length} at={at} />; };
registerRoot(() => <>
  {dd.map((sc, i) => <Composition key={i} id={`D-${String(i).padStart(2, '0')}`} component={Scene} defaultProps={{ i }} durationInFrames={sc.frames} fps={30} width={1080} height={1920} />)}
  <Composition id="SHEET" component={Sheet} defaultProps={{ at: 0.6 }} durationInFrames={dd.length} fps={30} width={1080} height={1920} />
</>);
