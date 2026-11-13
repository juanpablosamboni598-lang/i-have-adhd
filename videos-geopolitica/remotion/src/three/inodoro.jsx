import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import { Outlines, Edges } from '@react-three/drei';
import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// Prueba de estilo 3D "armado paso a paso" (paleta propia jxseng)
const W = 1080, H = 1920, FPS = 30;
const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = Easing.bezier(0.33, 0, 0.2, 1);
const tw = (f, a, b) => ease(cl((f - a) / (b - a)));
// caída con rebote: 0 → 1
const drop = (f, a, d = 22) => {
  const u = cl((f - a) / d);
  if (u < 0.7) return (u / 0.7) ** 2;
  const v = (u - 0.7) / 0.3;
  return 1 - Math.sin(v * Math.PI) * 0.08;
};

const C = {
  wall: '#f3c9a4', wall2: '#e9b48c', floor: '#d9e4ea', tile: '#b9c9d3',
  porcelain: '#fbfbf7', water: '#46a6f0', waterDeep: '#2b7fd0', metal: '#9aa6ad',
  float: '#ff8a3d', flap: '#e2483d', chain: '#5b6670', teal: '#1fb5a5', ink: '#141018',
};
const OL = ({ t = 0.012 }) => {
  const ref = React.useRef();
  React.useLayoutEffect(() => {
    const m = ref.current, par = m && m.parent;
    if (!par || !par.geometry) return;
    let g = par.geometry.clone();
    g.deleteAttribute('normal'); g.deleteAttribute('uv');
    g = mergeVertices(g, 1e-4);
    g.computeVertexNormals();
    m.geometry = g;
  });
  return <mesh ref={ref} renderOrder={-1}>
    <shaderMaterial side={THREE.BackSide} uniforms={{ th: { value: t * 1.1 } }}
      vertexShader={`uniform float th; void main(){ vec3 p = position + normalize(normal) * th; gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0); }`}
      fragmentShader={`void main(){ gl_FragColor = vec4(0.078,0.063,0.094,1.0); }`} />
  </mesh>;
};
const Toon = (p) => <meshToonMaterial {...p} />;

// nivel del agua del tanque (0..1) según el frame
const level = (f) => {
  if (f < 110) return 0;
  if (f < 185) return tw(f, 110, 185);
  if (f < 362) return 1;
  if (f < 430) return 1 - 0.92 * tw(f, 362, 430);
  if (f < 470) return 0.08;
  return 0.08 + 0.92 * tw(f, 470, 585);
};
const flapOpen = (f) => (f < 330 ? 0 : f < 350 ? tw(f, 330, 350) : f < 440 ? 1 : 1 - tw(f, 440, 458));
const handle = (f) => (f < 300 ? 0 : f < 318 ? tw(f, 300, 318) : f < 345 ? 1 : 1 - tw(f, 345, 370));

const CamRig = ({ f }) => {
  const { camera } = useThree();
  // llaves: [frame, angulo, altura, distancia, objetivoY]
  const K = [
    [0, 0.55, 1.5, 3.6, 0.55], [90, 0.25, 1.4, 3.0, 0.6], [150, -0.35, 1.25, 2.1, 0.78],
    [220, -0.6, 1.15, 1.45, 0.8], [290, -0.15, 1.1, 1.75, 0.72], [360, 0.35, 1.25, 2.3, 0.65],
    [470, 0.6, 1.35, 2.0, 0.75], [600, 0.2, 1.6, 3.3, 0.6],
  ];
  let i = 0; while (i < K.length - 2 && f > K[i + 1][0]) i++;
  const [a0, a1] = [K[i], K[i + 1]];
  const u = ease(cl((f - a0[0]) / (a1[0] - a0[0])));
  const L = (k) => a0[k] + (a1[k] - a0[k]) * u;
  const ang = L(1) + Math.sin(f / 70) * 0.04, h = L(2), d = L(3), ty = L(4);
  camera.position.set(Math.sin(ang) * d, h, Math.cos(ang) * d);
  camera.lookAt(0, ty, 0);
  return null;
};

const Room = () => {
  const tiles = useMemo(() => {
    const a = [];
    for (let i = -6; i <= 6; i++) a.push(<mesh key={'x' + i} position={[i * 0.4, 0.002, 0]}><boxGeometry args={[0.012, 0.002, 6]} /><meshBasicMaterial color={C.tile} /></mesh>);
    for (let j = -6; j <= 6; j++) a.push(<mesh key={'z' + j} position={[0, 0.002, j * 0.4]}><boxGeometry args={[6, 0.002, 0.012]} /><meshBasicMaterial color={C.tile} /></mesh>);
    return a;
  }, []);
  return <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[8, 8]} /><Toon color={C.floor} /></mesh>
    {tiles}
    <mesh position={[0, 2, -0.55]} receiveShadow><planeGeometry args={[8, 4]} /><Toon color={C.wall} /></mesh>
    <mesh position={[0, 0.06, -0.54]}><boxGeometry args={[8, 0.12, 0.03]} /><Toon color={C.wall2} /></mesh>
    <mesh position={[-1.6, 1.0, -0.53]}><boxGeometry args={[0.7, 2.0, 0.04]} /><Toon color={C.teal} /><OL t={0.01} /></mesh>
    <mesh position={[-1.37, 1.0, -0.5]}><sphereGeometry args={[0.035]} /><Toon color={C.metal} /></mesh>
  </group>;
};

const Bowl = ({ f }) => {
  const prof = useMemo(() => {
    const p = [[0.0, 0], [0.17, 0], [0.15, 0.08], [0.14, 0.2], [0.2, 0.3], [0.27, 0.36], [0.29, 0.42], [0.0, 0.42]];
    return p.map(([x, y]) => new THREE.Vector2(x, y));
  }, []);
  const yB = (1 - drop(f, 8)) * 2.5;
  const yS = (1 - drop(f, 40)) * 2.5;
  const swirl = f > 365 && f < 470 ? (f - 365) * 0.25 : 0;
  const bowlWater = f < 365 ? 0.3 : f < 400 ? 0.3 + 0.07 * tw(f, 365, 385) : 0.37 - 0.07 * tw(f, 420, 470);
  return <group position={[0, 0, 0.18]}>
    <group position={[0, yB, 0]} scale={[1, 1, 1.25]}>
      <mesh castShadow><latheGeometry args={[prof, 40]} /><Toon color={C.porcelain} side={THREE.DoubleSide} /><OL t={0.014} /></mesh>
      <mesh position={[0, bowlWater + 0.04, 0]} rotation={[-Math.PI / 2, 0, swirl]}>
        <circleGeometry args={[0.2, 32]} /><Toon color={C.water} transparent opacity={0.9} />
      </mesh>
      {swirl > 0 && <mesh position={[0, bowlWater + 0.045, 0]} rotation={[-Math.PI / 2, 0, swirl * 1.6]}>
        <ringGeometry args={[0.07, 0.11, 24, 1, 0, Math.PI * 1.3]} /><meshBasicMaterial color="#d8f0ff" />
      </mesh>}
    </group>
    <group position={[0, 0.435 + yS, 0]} scale={[1, 1, 1.25]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow><torusGeometry args={[0.235, 0.035, 12, 40]} /><Toon color="#ffffff" /><OL t={0.008} /></mesh>
    </group>
  </group>;
};

const Tank = ({ f }) => {
  const yT = (1 - drop(f, 24)) * 2.5;
  const yL = (1 - drop(f, 52)) * 2.5;
  const xr = tw(f, 92, 112); // rayos X
  const lv = level(f);
  const inner = { w: 0.46, h: 0.34, d: 0.17, y0: 0.53 };
  const wy = inner.y0 + 0.01;
  const wh = Math.max(0.005, inner.h * 0.92 * lv);
  const floatY = wy + Math.max(wh, 0.04) + 0.02;
  const fo = flapOpen(f);
  const hd = handle(f);
  const full = lv > 0.98 && f > 185 && f < 362;
  return <group position={[0, yT, -0.33]}>
    {/* cuerpo del tanque */}
    <mesh position={[0, 0.72, 0]} castShadow>
      <boxGeometry args={[0.52, 0.42, 0.22]} />
      <Toon color={C.porcelain} transparent opacity={1 - 0.85 * xr} depthWrite={xr < 0.5} />
      {xr < 0.5 ? <OL t={0.012} /> : <Edges color={C.ink} lineWidth={3} />}
    </mesh>
    {/* tapa */}
    <mesh position={[0, 0.955 + yL, 0]} castShadow>
      <boxGeometry args={[0.56, 0.05, 0.26]} />
      <Toon color={C.porcelain} transparent opacity={1 - 0.85 * xr} depthWrite={xr < 0.5} />{xr < 0.5 ? <OL t={0.01} /> : <Edges color={C.ink} lineWidth={3} />}
    </mesh>
    {/* interior visible */}
    <group visible={xr > 0.02}>
      <mesh position={[0, wy + wh / 2, 0]}>
        <boxGeometry args={[inner.w, wh, inner.d]} /><Toon color={C.water} transparent opacity={0.75} />
      </mesh>
      {/* válvula de llenado */}
      <mesh position={[-0.17, 0.68, 0]}><cylinderGeometry args={[0.022, 0.022, 0.3, 16]} /><Toon color={C.metal} /><OL t={0.006} /></mesh>
      {/* brazo y flotador */}
      <mesh position={[-0.08, (0.83 + floatY) / 2, 0]} rotation={[0, 0, Math.atan2(0.83 - floatY, -0.18) + Math.PI]}>
        <boxGeometry args={[Math.hypot(0.18, 0.83 - floatY), 0.012, 0.012]} /><Toon color={C.chain} />
      </mesh>
      <mesh position={[0.01, floatY, 0]}><sphereGeometry args={[0.055, 24, 16]} /><Toon color={C.float} /><OL t={0.006} /></mesh>
      {/* tubo de rebose */}
      <mesh position={[0.12, 0.7, 0]}><cylinderGeometry args={[0.018, 0.018, 0.3, 16]} /><Toon color={C.metal} /><OL t={0.005} /></mesh>
      {/* compuerta (sapo) */}
      <group position={[0.02, 0.555, 0.0]}>
        <group position={[-0.05, 0, 0]} rotation={[0, 0, fo * 1.1]}>
          <mesh position={[0.05, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 0.02, 24]} /><Toon color={C.flap} /><OL t={0.006} /></mesh>
        </group>
      </group>
      {/* cadena */}
      <mesh position={[0.02, 0.555 + 0.13 + fo * 0.03, 0]}><boxGeometry args={[0.006, 0.24 - fo * 0.06, 0.006]} /><Toon color={C.chain} /></mesh>
      {/* chorro de entrada al rellenar */}
      {(f > 112 && f < 185) || (f > 460 && f < 585) ? <mesh position={[-0.17, 0.66, 0.04]}><cylinderGeometry args={[0.008, 0.008, 0.22, 8]} /><meshBasicMaterial color="#cfeeff" /></mesh> : null}
      {full && <mesh position={[-0.17, 0.86, 0.05]}><sphereGeometry args={[0.03]} /><meshBasicMaterial color="#2bd36b" /></mesh>}
    </group>
    {/* palanca */}
    <group position={[-0.24, 0.86, 0.12]} rotation={[0, 0, -hd * 0.5]}>
      <mesh position={[0.04, 0, 0]}><boxGeometry args={[0.1, 0.022, 0.03]} /><Toon color={C.metal} /><OL t={0.005} /></mesh>
    </group>
    {/* chorro hacia la taza */}
    {fo > 0.3 && f < 440 && Array.from({ length: 14 }).map((_, k) => {
      const p = ((f * 0.06 + k / 14) % 1);
      return <mesh key={k} position={[0.02 + Math.sin(k * 7.3) * 0.03, 0.54 - p * 0.3, 0.12 + p * 0.25]}>
        <sphereGeometry args={[0.018, 8, 6]} /><meshBasicMaterial color="#8fd0ff" />
      </mesh>;
    })}
  </group>;
};

const Pedestal = ({ f }) => {
  const y = (1 - drop(f, 0, 20)) * 2.5;
  return <mesh position={[0, 0.01 + y, 0.18]} castShadow><cylinderGeometry args={[0.2, 0.22, 0.02, 32]} /><Toon color={C.porcelain} /><OL t={0.008} /></mesh>;
};

const Caption = ({ f }) => {
  const caps = [
    [6, 88, 'ASÍ FUNCIONA', C.ink], [92, 150, 'EL TANQUE', C.ink], [150, 215, 'EL FLOTADOR', C.ink],
    [215, 292, 'CIERRA EL AGUA', C.ink], [292, 330, 'LA PALANCA', C.ink], [330, 362, 'SE ABRE LA COMPUERTA', '#e2483d'],
    [362, 455, 'SE VACÍA DE GOLPE', '#e2483d'], [455, 600, 'Y SE VUELVE A LLENAR', C.ink],
  ];
  const c = caps.find(([a, b]) => f >= a && f < b);
  if (!c) return null;
  const [a, , txt, col] = c;
  const n = Math.max(1, Math.floor(cl((f - a) / 8) * txt.length + 0.999));
  const s = interpolate(f - a, [0, 6, 10], [0.8, 1.06, 1], { extrapolateRight: 'clamp' });
  return <div style={{ position: 'absolute', top: 210, width: '100%', textAlign: 'center', fontFamily: 'Inter Display, Inter, sans-serif', fontWeight: 900, fontSize: 84, color: col, letterSpacing: -1, transform: `scale(${s})`, textShadow: '0 4px 0 rgba(255,255,255,0.65)' }}>
    {txt.slice(0, n)}
  </div>;
};

const Gauge = ({ f }) => {
  const lv = level(f);
  const op = tw(f, 100, 118);
  const col = lv > 0.98 ? '#2bd36b' : lv < 0.2 ? '#e2483d' : C.water;
  return <div style={{ position: 'absolute', right: 70, bottom: 360, opacity: op, fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
    <div style={{ fontWeight: 800, fontSize: 34, color: C.ink, marginBottom: 8 }}>{Math.round(lv * 6)} L</div>
    <div style={{ width: 70, height: 360, border: `6px solid ${C.ink}`, borderRadius: 36, background: '#ffffffcc', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', bottom: 0, width: '100%', height: `${lv * 100}%`, background: col }} />
    </div>
    <div style={{ fontWeight: 800, fontSize: 28, color: C.ink, marginTop: 8 }}>agua</div>
  </div>;
};

export const Inodoro = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: C.wall }}>
    <ThreeCanvas width={W} height={H} shadows camera={{ fov: 38, position: [0, 1.5, 3.6] }} gl={{ antialias: true }}>
      <CamRig f={f} />
      <ambientLight intensity={1.1} />
      <directionalLight position={[2.5, 4, 3]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-2} shadow-camera-right={2} shadow-camera-top={2} shadow-camera-bottom={-2} />
      <Room />
      <Pedestal f={f} />
      <Bowl f={f} />
      <Tank f={f} />
    </ThreeCanvas>
    <Caption f={f} />
    <Gauge f={f} />
    <div style={{ position: 'absolute', bottom: 120, width: '100%', textAlign: 'center', fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 30, color: '#14101880' }}>jxseng</div>
  </AbsoluteFill>;
};
export const DUR = 600, FPS3 = FPS;
