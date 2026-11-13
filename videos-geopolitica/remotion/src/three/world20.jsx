import React, { useMemo } from 'react';
import * as THREE from 'three';
import { OL, Part, Toon, Flow, Tube, spotTex, cl, lerp, tw, INK } from './kit.jsx';

export const P = {
  sky: '#bfe6f5', ground: '#e9cf7c', ground2: '#dcbc62', grass: '#8fbf4a', grassD: '#6f9d36', hill: '#d6b866',
  tree: '#5f9a3c', treeD: '#4b7f2e', trunk: '#7a5232', skin: '#f7e2b0', spot: '#c4703a', hoof: '#3a2a22',
  red: '#e2483d', blue: '#3f7fe0', bone: '#fffaf0', brain: '#f2a3b3', water: '#46a6f0', teal: '#1fb5a5',
  lion: '#e2a854', mane: '#a5582a', shirt: '#1fb5a5', pants: '#3b4a6b', face: '#f0bf94', white: '#ffffff',
};

// ---------- escenario ----------
export const Sky = () => <color attach="background" args={[P.sky]} />;

export const Lights = () => <>
  <ambientLight intensity={1.05} />
  <directionalLight position={[6, 10, 6]} intensity={1.7} castShadow shadow-mapSize={[1024, 1024]}
    shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-camera-far={40} />
</>;

const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

export const Savanna = ({ t = 0, pond = false, trees = true, hills = true, clouds = true, grassN = 70 }) => {
  const grass = useMemo(() => Array.from({ length: grassN }).map((_, i) => [(rnd(i) - 0.5) * 30, (rnd(i + 99) - 0.5) * 22, 0.6 + rnd(i + 7) * 0.7]), [grassN]);
  return <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[60, 48]} /><Toon color={P.ground} /></mesh>
    {grass.map(([x, z, s], i) => <group key={i} position={[x, 0, z]} rotation={[0, 0, Math.sin(t * 1.6 + i) * 0.12]} scale={s}>
      <mesh position={[0, 0.18, 0]}><coneGeometry args={[0.07, 0.36, 5]} /><Toon color={i % 3 ? P.grass : P.grassD} /></mesh>
      <mesh position={[0.08, 0.13, 0.03]} rotation={[0, 0, -0.4]}><coneGeometry args={[0.05, 0.26, 5]} /><Toon color={P.grass} /></mesh>
    </group>)}
    {hills && [[-18, -26, 9], [4, -30, 12], [24, -24, 8], [-36, -14, 10]].map(([x, z, r], i) =>
      <mesh key={i} position={[x, 0, z]} scale={[1, 0.28, 0.6]}><sphereGeometry args={[r, 24, 12]} /><Toon color={P.hill} /></mesh>)}
    {trees && <><Acacia pos={[-7, 0, -6]} s={1.3} /><Acacia pos={[9, 0, -9]} s={1.6} /><Acacia pos={[-14, 0, -14]} s={1.8} /></>}
    {clouds && [[-10, 11, -20], [6, 13, -24], [18, 10, -18], [-24, 12, -22]].map(([x, y, z], i) => {
      const xx = ((x + t * 0.35 + 40) % 80) - 40;
      return <group key={i} position={[xx, y, z]}>
        {[[0, 0, 1.6], [1.5, -0.2, 1.2], [-1.5, -0.3, 1.1], [0.6, 0.6, 1.0]].map(([a, b, r], k) =>
          <mesh key={k} position={[a, b, 0]} scale={[1, 0.7, 0.7]}><sphereGeometry args={[r, 16, 12]} /><meshBasicMaterial color="#ffffff" /></mesh>)}
      </group>;
    })}
    {pond && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3.2, 0.02, 0]} scale={[1.6, 1, 1]}><circleGeometry args={[1.6, 40]} /><Toon color={P.water} /></mesh>}
  </group>;
};

export const Acacia = ({ pos, s = 1, rot = 0 }) => <group position={pos} scale={s} rotation={[0, rot, 0]}>
  <Part geo={<cylinderGeometry args={[0.12, 0.2, 3, 8]} />} color={P.trunk} pos={[0, 1.5, 0]} rot={[0, 0, 0.08]} t={0.025} />
  <Part geo={<cylinderGeometry args={[0.07, 0.1, 1.6, 6]} />} color={P.trunk} pos={[0.55, 2.9, 0]} rot={[0, 0, -0.8]} t={0.02} />
  <Part geo={<cylinderGeometry args={[0.07, 0.1, 1.4, 6]} />} color={P.trunk} pos={[-0.45, 2.9, 0]} rot={[0, 0, 0.7]} t={0.02} />
  <Part geo={<sphereGeometry args={[1, 20, 12]} />} color={P.tree} pos={[0, 3.55, 0]} scale={[2.4, 0.42, 1.8]} t={0.04} />
  <Part geo={<sphereGeometry args={[1, 20, 12]} />} color={P.treeD} pos={[1.1, 3.35, 0.3]} scale={[1.2, 0.3, 1.0]} t={0.03} />
</group>;

// ---------- jirafa ----------
// neck: 0 arriba → 1 bebiendo; xr: rayos X; flow: flujo de sangre; valve: 0 abiertas → 1 cerradas
export const Giraffe = ({ pos = [0, 0, 0], rotY = 0, s = 1, t = 0, neck = 0, xr = 0, flow = 0, valve = 0, walk = 0, lie = 0,
  tongue = 0, chew = 0, heart = 1, legsRed = 0, swell = 0, blink = true, seed = 0, brainGlow = 0, show = { vert: 1, heart: 1, art: 1, jug: 1, brain: 1, rete: 0, legs: 0 } }) => {
  const tex = spotTex();
  const m1 = useMemo(() => { const m = tex.clone(); m.needsUpdate = true; m.repeat.set(2, 1); return m; }, [tex]);
  const m2 = useMemo(() => { const m = tex.clone(); m.needsUpdate = true; m.repeat.set(1, 2.5); return m; }, [tex]);
  const m3 = useMemo(() => { const m = tex.clone(); m.needsUpdate = true; m.repeat.set(0.6, 2); return m; }, [tex]);
  const spread = neck;
  const drink = neck;
  const bodyY = 2.4 - drink * 0.45 - lie * 1.55;
  const nz = lerp(-0.45, -2.5, drink) + lie * 1.0 + Math.sin(t * 0.8 + seed) * 0.03;
  const hr = lerp(0.2, 1.1, drink) - lie * 0.4;
  const beat = 1 + 0.1 * Math.max(0, Math.sin(t * 2 * Math.PI * 1.1)) * heart;
  const bl = blink && ((t + seed * 1.7) % 3.4) < 0.12 ? 0.1 : 1;
  const tail = Math.sin(t * 2.2 + seed) * 0.35;
  const ear = Math.sin(t * 3 + seed) > 0.95 ? 0.4 : 0;
  const leg = (x, z, front, ph) => {
    const sw = walk ? Math.sin(t * 4 + ph) * 0.35 * walk : 0;
    const sp = front ? spread * 0.32 * Math.sign(z) : 0;
    const fold = lie * (front ? 1.35 : -1.35);
    const L = front ? bodyY - 0.15 + drink * 0.25 : bodyY - 0.25;
    const len = lie > 0 ? lerp(L, 1.0, lie) : L;
    const sw2 = swell * (front ? 0 : 1);
    return <group position={[x, bodyY - 0.35, z]} rotation={[sp, 0, sw + fold]}>
      <mesh position={[0, -len / 2, 0]} castShadow scale={[1 + sw2 * 0.9, 1, 1 + sw2 * 0.9]}>
        <cylinderGeometry args={[0.1, 0.075, len, 12]} />
        <meshToonMaterial color={swell > 0.3 && !front ? '#e8a07a' : P.skin} map={m3} transparent={xr > 0} opacity={1 - 0.8 * xr} depthWrite={xr < 0.5} />
        {xr < 0.5 ? <OL t={0.018} /> : null}
      </mesh>
      <Part geo={<cylinderGeometry args={[0.085, 0.09, 0.14, 12]} />} color={P.hoof} pos={[0, -len, 0]} t={0.015} xr={xr * 0.6} />
      {xr > 0.05 && show.legs ? <mesh position={[0, -len / 2, 0]}><cylinderGeometry args={[0.025, 0.025, len * 0.95, 8]} /><meshBasicMaterial color={P.red} /></mesh> : null}
    </group>;
  };
  return <group position={pos} rotation={[0, rotY, 0]} scale={s}>
    {/* cuerpo */}
    <group position={[0, bodyY, 0]} rotation={[0, 0, 0.16 - drink * 0.12 - lie * 0.1]}>
      <mesh castShadow scale={[1.25, 0.72 * (1 + Math.sin(t * 1.5) * 0.01), 0.58]}>
        <sphereGeometry args={[1, 32, 20]} />
        <meshToonMaterial color={P.skin} map={m1} transparent={xr > 0} opacity={1 - 0.82 * xr} depthWrite={xr < 0.5} />
        {xr < 0.5 ? <OL t={0.022} /> : null}
      </mesh>
      {/* cola */}
      <group position={[-1.18, 0.15, 0]} rotation={[tail * 0.5, 0, -0.35 + tail * 0.2]}>
        <Part geo={<cylinderGeometry args={[0.03, 0.04, 0.9, 6]} />} color={P.skin} pos={[0, -0.45, 0]} t={0.012} xr={xr} />
        <Part geo={<sphereGeometry args={[0.09, 10, 8]} />} color={P.hoof} pos={[0, -0.95, 0]} scale={[1, 1.8, 1]} t={0.012} />
      </group>
      {/* corazón */}
      {xr > 0.05 && show.heart ? <group position={[0.62, -0.25, 0]} scale={beat}>
        <Part geo={<sphereGeometry args={[0.24, 20, 14]} />} color={P.red} scale={[1, 1.25, 0.9]} t={0.015} />
        <Part geo={<cylinderGeometry args={[0.06, 0.07, 0.3, 10]} />} color={P.red} pos={[0.05, 0.3, 0]} t={0.01} />
      </group> : null}
      {/* conexión corazón → cuello */}
      {xr > 0.05 && show.art ? <Tube pts={[[0.67, 0.05, 0.03], [0.85, 0.35, 0.03], [0.98, 0.42, 0.04]]} r={0.04} color={P.red} /> : null}
      {xr > 0.05 && show.jug ? <Tube pts={[[0.5, -0.1, -0.05], [0.8, 0.3, -0.05], [0.92, 0.4, -0.06]]} r={0.04} color={P.blue} /> : null}
      <Flow pts={[[0.67, 0.05, 0.03], [0.85, 0.35, 0.03], [0.98, 0.42, 0.04]]} t={t} n={4} speed={0.9 * flow} r={0.035} on={xr > 0.05 && show.art ? flow : 0} />
      {/* cuello */}
      <group position={[0.98, 0.42, 0]} rotation={[0, 0, nz]}>
        <mesh castShadow position={[0, 1.05, 0]}>
          <cylinderGeometry args={[0.14, 0.24, 2.15, 16]} />
          <meshToonMaterial color={P.skin} map={m2} transparent={xr > 0} opacity={1 - 0.82 * xr} depthWrite={xr < 0.5} />
          {xr < 0.5 ? <OL t={0.02} /> : null}
        </mesh>
        {/* crin */}
        <Part geo={<boxGeometry args={[0.07, 1.9, 0.05]} />} color={P.spot} pos={[-0.17, 1.05, 0]} rot={[0, 0, 0.05]} t={0.01} xr={xr} />
        {/* vértebras */}
        {xr > 0.05 && show.vert ? Array.from({ length: 7 }).map((_, k) =>
          <Part key={k} geo={<boxGeometry args={[0.12, 0.24, 0.12]} />} color={P.bone} pos={[0, 0.2 + k * 0.28, 0]} t={0.01} />) : null}
        {/* carótida y yugular */}
        {xr > 0.05 && show.art ? <mesh position={[0.09, 1.05, 0.04]}><cylinderGeometry args={[0.035, 0.035, 2.1, 8]} /><meshToonMaterial color={P.red} /></mesh> : null}
        {xr > 0.05 && show.jug ? <mesh position={[-0.09, 1.05, -0.04]}><cylinderGeometry args={[0.04, 0.04, 2.1, 8]} /><meshToonMaterial color={P.blue} transparent opacity={0.85} /></mesh> : null}
        {xr > 0.05 && show.jug ? [0.55, 1.05, 1.55].map((y, k) => <group key={k} position={[-0.09, y, -0.04]} rotation={[0, 0, lerp(0.9, 0, valve)]}>
          <Part geo={<cylinderGeometry args={[0.055, 0.055, 0.015, 14]} />} color="#ffd23d" t={0.008} />
        </group>) : null}
        <Flow pts={[[0.09, 0, 0.04], [0.09, 2.1, 0.04]]} t={t} n={9} speed={0.55 * flow} r={0.035} on={xr > 0.05 && show.art ? flow : 0} />
        <Flow pts={[[-0.09, 2.1, -0.04], [-0.09, 0, -0.04]]} t={t} n={7} speed={0.4 * flow * (1 - valve)} r={0.035} color="#5d9bff" on={xr > 0.05 && show.jug ? flow : 0} />
        {/* cabeza */}
        <group position={[0, 2.12, 0]} rotation={[0, 0, hr]}>
          <mesh castShadow position={[0.22, 0, 0]} scale={[1, 0.62, 0.62]}>
            <capsuleGeometry args={[0.2, 0.42, 8, 16]} />
            <meshToonMaterial color={P.skin} transparent={xr > 0} opacity={1 - 0.75 * xr} depthWrite={xr < 0.5} />
            {xr < 0.5 ? <OL t={0.018} /> : null}
          </mesh>
          <group rotation={[0, 0, Math.PI / 2]} />
          <Part geo={<sphereGeometry args={[0.15, 16, 12]} />} color="#d9b98a" pos={[0.55, -0.04 + Math.sin(t * 9) * 0.01 * chew, 0]} scale={[1, 0.85, 0.95]} t={0.014} xr={xr * 0.7} />
          {/* osiconos */}
          {[-0.07, 0.07].map((z, k) => <group key={k} position={[-0.02, 0.15, z]} rotation={[z * 2, 0, 0.25]}>
            <Part geo={<cylinderGeometry args={[0.025, 0.03, 0.2, 8]} />} color={P.skin} pos={[0, 0.1, 0]} t={0.01} xr={xr} />
            <Part geo={<sphereGeometry args={[0.04, 10, 8]} />} color={P.hoof} pos={[0, 0.21, 0]} t={0.01} xr={xr} />
          </group>)}
          {/* orejas */}
          {[-1, 1].map((sd, k) => <group key={k} position={[-0.08, 0.08, sd * 0.13]} rotation={[sd * (0.9 + ear), 0, 0.3]}>
            <Part geo={<coneGeometry args={[0.05, 0.2, 8]} />} color={P.skin} pos={[0, 0.1, 0]} t={0.01} xr={xr} />
          </group>)}
          {/* ojos */}
          {[-1, 1].map((sd, k) => <group key={k} position={[0.12, 0.06, sd * 0.12]} scale={[1, bl, 1]}>
            <mesh><sphereGeometry args={[0.045, 12, 10]} /><meshBasicMaterial color={INK} /></mesh>
            <mesh position={[0.02, 0.015, sd * 0.03]}><sphereGeometry args={[0.013, 8, 6]} /><meshBasicMaterial color="#fff" /></mesh>
          </group>)}
          {/* lengua */}
          {tongue > 0.01 ? <mesh position={[0.62 + tongue * 0.25, -0.1, 0]} rotation={[0, 0, -0.4]}><capsuleGeometry args={[0.035, tongue * 0.5, 6, 10]} /><meshToonMaterial color="#3d2a55" /><OL t={0.008} /></mesh> : null}
          {/* cerebro y red */}
          {xr > 0.05 && show.brain ? <Part geo={<sphereGeometry args={[0.1, 16, 12]} />} color={brainGlow > 0.5 ? '#ff7a9a' : P.brain} pos={[0.05, 0.03, 0]} scale={[1.3, 0.9, 1]} t={0.008} /> : null}
          {xr > 0.05 && show.rete ? <mesh position={[-0.08, -0.06, 0]}><torusKnotGeometry args={[0.05, 0.012, 48, 6, 3, 7]} /><meshBasicMaterial color={P.red} /></mesh> : null}
        </group>
      </group>
    </group>
    {leg(0.75, 0.28, true, 0)}{leg(0.75, -0.28, true, Math.PI)}
    {leg(-0.8, 0.26, false, Math.PI)}{leg(-0.8, -0.26, false, 0)}
  </group>;
};

// ---------- persona ----------
export const Human = ({ pos = [0, 0, 0], rotY = 0, s = 1, t = 0, dizzy = 0, wave = 0, lie = 0, sit = 0, xr = 0 }) => {
  const sway = dizzy * Math.sin(t * 5) * 0.12;
  return <group position={pos} rotation={[0, rotY, 0]} scale={s}>
    <group rotation={[0, 0, sway + lie * -Math.PI / 2 * (1 - sit)]} position={[0, lie * 0.55, 0]}>
      {[-0.11, 0.11].map((z, k) => <Part key={k} geo={<cylinderGeometry args={[0.075, 0.065, 0.85, 10]} />} color={P.pants} pos={[0, 0.43, z]} rot={[0, 0, sit * 1.4]} t={0.015} xr={xr} />)}
      <Part geo={<capsuleGeometry args={[0.2, 0.42, 6, 14]} />} color={P.shirt} pos={[0, 1.15, 0]} scale={[0.8, 1, 1.05]} t={0.018} xr={xr} />
      {[-1, 1].map((sd, k) => <group key={k} position={[0, 1.38, sd * 0.27]} rotation={[sd * (0.15 + (k ? wave * (1.8 + Math.sin(t * 8) * 0.3) : 0)), 0, 0]}>
        <Part geo={<capsuleGeometry args={[0.055, 0.5, 4, 8]} />} color={P.shirt} pos={[0, -0.3, 0]} t={0.012} xr={xr} />
        <Part geo={<sphereGeometry args={[0.06, 10, 8]} />} color={P.face} pos={[0, -0.6, 0]} t={0.01} xr={xr} />
      </group>)}
      <group position={[0, 1.65, 0]}>
        <Part geo={<sphereGeometry args={[0.17, 20, 14]} />} color={P.face} t={0.016} xr={xr} />
        <Part geo={<sphereGeometry args={[0.18, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />} color="#3a2418" pos={[-0.02, 0.03, 0]} t={0.01} xr={xr} />
        {[-0.06, 0.06].map((z, k) => <mesh key={k} position={[0.155, 0.02, z]}><sphereGeometry args={[0.022, 8, 6]} /><meshBasicMaterial color={INK} /></mesh>)}
        {dizzy > 0.05 ? Array.from({ length: 4 }).map((_, k) => {
          const a = t * 4 + k * Math.PI / 2;
          return <mesh key={k} position={[Math.cos(a) * 0.28, 0.32, Math.sin(a) * 0.28]} scale={dizzy}><octahedronGeometry args={[0.06]} /><meshBasicMaterial color="#ffd23d" /></mesh>;
        }) : null}
      </group>
    </group>
  </group>;
};

// ---------- león ----------
export const Lion = ({ pos = [0, 0, 0], rotY = 0, s = 1, t = 0, walk = 0, crouch = 0 }) => {
  const by = 0.85 - crouch * 0.3;
  const leg = (x, z, ph) => <group position={[x, by - 0.1, z]} rotation={[0, 0, Math.sin(t * 6 + ph) * 0.4 * walk]}>
    <Part geo={<cylinderGeometry args={[0.09, 0.08, by - 0.1, 10]} />} color={P.lion} pos={[0, -(by - 0.1) / 2, 0]} t={0.015} />
  </group>;
  return <group position={pos} rotation={[0, rotY, 0]} scale={s}>
    <Part geo={<sphereGeometry args={[1, 24, 16]} />} color={P.lion} pos={[0, by + 0.1, 0]} scale={[0.85, 0.38, 0.36]} t={0.02} />
    {leg(0.55, 0.18, 0)}{leg(0.55, -0.18, Math.PI)}{leg(-0.55, 0.18, Math.PI)}{leg(-0.55, -0.18, 0)}
    <group position={[0.9, by + 0.35, 0]}>
      <Part geo={<sphereGeometry args={[0.42, 18, 14]} />} color={P.mane} scale={[0.7, 1, 1]} t={0.02} />
      <Part geo={<sphereGeometry args={[0.24, 18, 14]} />} color={P.lion} pos={[0.2, -0.02, 0]} t={0.015} />
      <Part geo={<sphereGeometry args={[0.11, 12, 10]} />} color="#f3d39a" pos={[0.4, -0.08, 0]} t={0.01} />
      {[-0.09, 0.09].map((z, k) => <mesh key={k} position={[0.38, 0.06, z]}><sphereGeometry args={[0.03, 8, 6]} /><meshBasicMaterial color={INK} /></mesh>)}
    </group>
    <group position={[-0.85, by + 0.15, 0]} rotation={[0, 0, 0.9 + Math.sin(t * 2) * 0.2]}>
      <Part geo={<cylinderGeometry args={[0.025, 0.03, 0.8, 6]} />} color={P.lion} pos={[0, -0.4, 0]} t={0.01} />
    </group>
  </group>;
};

// ---------- corazón en corte ----------
export const HeartCut = ({ pos = [0, 0, 0], s = 1, t = 0, wall = 1, rotY = 0 }) => {
  const beat = 1 + 0.06 * Math.max(0, Math.sin(t * 2 * Math.PI * 1.1));
  const inner = lerp(0.82, 0.5, wall);
  const ph = Math.PI * 1.45;
  return <group position={pos} scale={s * beat} rotation={[0, rotY, 0]}>
    <group scale={[1, 1.25, 0.9]}>
      <mesh castShadow><sphereGeometry args={[1, 40, 28, 0, ph]} /><meshToonMaterial color={P.red} side={THREE.DoubleSide} /></mesh>
      <mesh><sphereGeometry args={[inner, 32, 24, 0, ph]} /><meshToonMaterial color="#8e1f22" side={THREE.DoubleSide} /></mesh>
      {[0, ph].map((a, k) => <mesh key={k} rotation={[0, a - Math.PI / 2, 0]}>
        <ringGeometry args={[inner, 1, 40, 1, -Math.PI / 2, Math.PI]} /><meshToonMaterial color="#c9343a" side={THREE.DoubleSide} />
      </mesh>)}
    </group>
    <Part geo={<cylinderGeometry args={[0.22, 0.26, 0.9, 16]} />} color={P.red} pos={[0.25, 1.35, 0]} rot={[0, 0, -0.25]} t={0.03} />
    <Part geo={<cylinderGeometry args={[0.18, 0.2, 0.7, 16]} />} color={P.blue} pos={[-0.35, 1.25, 0.1]} rot={[0, 0, 0.2]} t={0.03} />
  </group>;
};

// ---------- edificio con manguera ----------
export const Building = ({ pos = [0, 0, 0], t = 0, power = 1, on = 1 }) => {
  const reach = power * 7.2;
  const pts = [[1.8, 0.4, 1.3], [1.9, 3, 1.3], [1.9, 6, 1.3], [1.6, 7.6, 1.0]];
  return <group position={pos}>
    {[0, 1, 2].map((k) => <Part key={k} geo={<boxGeometry args={[3, 2.5, 2.4]} />} color={['#f2c46d', '#ef9f6a', '#e98a8a'][k]} pos={[0, 1.25 + k * 2.5, 0]} t={0.035} />)}
    <Part geo={<boxGeometry args={[3.3, 0.2, 2.7]} />} color="#8a6a5a" pos={[0, 7.6, 0]} t={0.03} />
    {[0, 1, 2].map((k) => [-0.7, 0.7].map((x, j) => <Part key={k + '-' + j} geo={<boxGeometry args={[0.6, 0.8, 0.05]} />} color="#9fd8f0" pos={[x, 1.4 + k * 2.5, 1.22]} t={0.02} />))}
    <Part geo={<boxGeometry args={[0.7, 0.6, 0.6]} />} color={P.red} pos={[2.4, 0.3, 1.3]} t={0.025} />
    <Tube pts={pts} r={0.07} color="#2f8a4a" />
    {on > 0 ? Array.from({ length: 16 }).map((_, k) => {
      const u = ((t * 0.6 + k / 16) % 1);
      const h = u * 9;
      const y = h < reach ? 0.6 + h : 0.6 + reach - (h - reach) * 1.2;
      if (y < 0.4) return null;
      return <mesh key={k} position={[1.95 + (h > reach ? (h - reach) * 0.15 : 0), y, 1.45]}><sphereGeometry args={[0.09, 8, 6]} /><meshBasicMaterial color={P.water} /></mesh>;
    }) : null}
  </group>;
};

// ---------- válvula en tubo (zoom) ----------
export const ValveTube = ({ pos = [0, 0, 0], t = 0, closed = 0, flowDir = -1, s = 1 }) => {
  return <group position={pos} scale={s}>
    <mesh><cylinderGeometry args={[0.6, 0.6, 6, 32, 1, true]} /><meshToonMaterial color={P.blue} transparent opacity={0.35} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    {[-1.5, 0, 1.5].map((y, k) => [-1, 1].map((sd, j) => <group key={k + '' + j} position={[sd * 0.58, y, 0]} rotation={[0, 0, sd * lerp(0.15, 1.45, closed)]}>
      <Part geo={<boxGeometry args={[0.06, 0.62, 0.9]} />} color="#ffd23d" pos={[-sd * 0.0, 0.31 * 1, 0]} rot={[0, 0, 0]} t={0.02} />
    </group>))}
    <Flow pts={[[0, 3, 0], [0, -3, 0]]} t={t} n={14} speed={0.35 * (1 - closed)} r={0.12} color="#5d9bff" on={1} />
  </group>;
};

// ---------- pierna en corte ----------
export const LegCut = ({ pos = [0, 0, 0], t = 0, skin = 1, swell = 0, arrows = 0, s = 1 }) => {
  const tex = spotTex();
  const bulge = swell * (1 - skin);
  return <group position={pos} scale={s}>
    <mesh scale={[1 + bulge * 0.9, 1, 1 + bulge * 0.9]} position={[0, 0, 0]}>
      <cylinderGeometry args={[0.55, 0.45 + bulge * 0.3, 5, 28]} />
      <meshToonMaterial color={bulge > 0.2 ? '#e8a07a' : P.skin} map={bulge > 0.2 ? null : tex} transparent opacity={0.4 + 0.3 * skin} depthWrite={false} />
    </mesh>
    <mesh><cylinderGeometry args={[0.14, 0.12, 5, 14]} /><meshBasicMaterial color={P.red} /></mesh>
    <mesh position={[0.25, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 5, 12]} /><meshBasicMaterial color={P.blue} /></mesh>
    <Flow pts={[[0, 2.5, 0], [0, -2.5, 0]]} t={t} n={10} speed={0.45} r={0.07} on={1} />
    {bulge > 0.1 ? Array.from({ length: 10 }).map((_, k) => <mesh key={k} position={[Math.cos(k) * (0.35 + bulge * 0.3), -2 + (k % 5) * 0.4, Math.sin(k) * (0.35 + bulge * 0.3)]} scale={bulge}><sphereGeometry args={[0.08, 8, 6]} /><meshBasicMaterial color="#9fd8f0" /></mesh>) : null}
    {arrows > 0 ? Array.from({ length: 8 }).map((_, k) => {
      const a = k / 8 * Math.PI * 2, y = -1.5 + (k % 4);
      const r = 1.05 + Math.sin(t * 4 + k) * 0.08;
      return <group key={k} position={[Math.cos(a) * r, y, Math.sin(a) * r]} rotation={[0, -a, Math.PI / 2]} scale={arrows}>
        <Part geo={<coneGeometry args={[0.12, 0.3, 10]} />} color={P.teal} t={0.012} />
      </group>;
    }) : null}
  </group>;
};

// ---------- ADN ----------
export const DNA = ({ pos = [0, 0, 0], t = 0, s = 1 }) => <group position={pos} scale={s} rotation={[0, t * 0.8, 0.2]}>
  {Array.from({ length: 22 }).map((_, k) => {
    const y = -2.2 + k * 0.2, a = k * 0.55;
    const x = Math.cos(a) * 0.6, z = Math.sin(a) * 0.6;
    return <group key={k}>
      <mesh position={[x, y, z]}><sphereGeometry args={[0.1, 10, 8]} /><meshToonMaterial color={P.teal} /></mesh>
      <mesh position={[-x, y, -z]}><sphereGeometry args={[0.1, 10, 8]} /><meshToonMaterial color={P.red} /></mesh>
      <mesh position={[0, y, 0]} rotation={[0, -a, Math.PI / 2]}><cylinderGeometry args={[0.025, 0.025, 1.2, 6]} /><meshToonMaterial color={k % 2 ? '#ffd23d' : '#ffffff'} /></mesh>
    </group>;
  })}
</group>;

// ---------- avión ----------
export const Jet = ({ pos = [0, 0, 0], s = 1, rot = [0, 0, 0] }) => <group position={pos} scale={s} rotation={rot}>
  <Part geo={<capsuleGeometry args={[0.3, 2.6, 8, 16]} />} color="#dfe6ec" rot={[0, 0, Math.PI / 2]} t={0.03} />
  <Part geo={<boxGeometry args={[0.9, 0.06, 3.0]} />} color="#9aa6ad" pos={[0.1, 0, 0]} t={0.025} />
  <Part geo={<boxGeometry args={[0.5, 0.7, 0.06]} />} color={P.red} pos={[-1.4, 0.4, 0]} t={0.02} />
  <Part geo={<boxGeometry args={[0.4, 0.05, 1.2]} />} color="#9aa6ad" pos={[-1.4, 0.05, 0]} t={0.02} />
  <mesh position={[1.0, 0.18, 0]} scale={[1.4, 0.7, 0.8]}><sphereGeometry args={[0.2, 12, 10]} /><meshToonMaterial color="#3d5a80" /></mesh>
</group>;

// ---------- cama ----------
export const Bed = ({ pos = [0, 0, 0], rotY = 0 }) => <group position={pos} rotation={[0, rotY, 0]}>
  <Part geo={<boxGeometry args={[2.2, 0.4, 1.2]} />} color="#8a6a5a" pos={[0, 0.2, 0]} t={0.03} />
  <Part geo={<boxGeometry args={[2.1, 0.22, 1.1]} />} color="#ffffff" pos={[0, 0.5, 0]} t={0.025} />
  <Part geo={<boxGeometry args={[0.45, 0.14, 0.8]} />} color="#cfe8ff" pos={[-0.8, 0.68, 0]} t={0.02} />
  <Part geo={<boxGeometry args={[0.12, 1.0, 1.2]} />} color="#8a6a5a" pos={[-1.1, 0.5, 0]} t={0.025} />
</group>;

// ---------- regla de altura ----------
export const Ruler = ({ pos = [0, 0, 0], h = 5, grow = 1 }) => <group position={pos}>
  <Part geo={<boxGeometry args={[0.08, h * grow, 0.08]} />} color={INK} pos={[0, h * grow / 2, 0]} t={0} />
  {Array.from({ length: Math.floor(h * grow) + 1 }).map((_, k) => <Part key={k} geo={<boxGeometry args={[0.4, 0.05, 0.05]} />} color={k % 5 === 0 ? P.red : INK} pos={[0.2, k, 0]} t={0} />)}
</group>;
