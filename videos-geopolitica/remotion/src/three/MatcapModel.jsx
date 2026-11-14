import React, { Suspense, useMemo, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { staticFile } from 'remotion';
import { useGLTF, Outlines } from '@react-three/drei';
import { OL } from './kit.jsx';

// MatCap procedural (Canvas 2D en memoria, sin archivos): da volumen y brillo sin luces dinámicas.
// Muy barato en CPU/swangle porque no calcula iluminación por luz.
const _cache = new Map();
export const matcapTexture = (color = '#ffffff', { shade = 0.55, rim = 0.25, spec = 0.9 } = {}) => {
  const key = `${color}|${shade}|${rim}|${spec}`;
  if (_cache.has(key)) return _cache.get(key);
  const S = 256, c = document.createElement('canvas'); c.width = c.height = S;
  const g = c.getContext('2d');
  const base = new THREE.Color(color);
  const dark = base.clone().multiplyScalar(shade), light = base.clone().lerp(new THREE.Color('#ffffff'), 0.35);
  // cuerpo: degradado radial desplazado (luz arriba-izquierda)
  const grd = g.createRadialGradient(S * 0.38, S * 0.32, S * 0.05, S * 0.5, S * 0.5, S * 0.5);
  grd.addColorStop(0, `#${light.getHexString()}`);
  grd.addColorStop(0.55, `#${base.getHexString()}`);
  grd.addColorStop(1, `#${dark.getHexString()}`);
  g.fillStyle = grd; g.fillRect(0, 0, S, S);
  // borde (rim light) suave
  const rimG = g.createRadialGradient(S / 2, S / 2, S * 0.38, S / 2, S / 2, S * 0.5);
  rimG.addColorStop(0, 'rgba(255,255,255,0)'); rimG.addColorStop(1, `rgba(255,255,255,${rim})`);
  g.fillStyle = rimG; g.fillRect(0, 0, S, S);
  // brillo especular
  const sp = g.createRadialGradient(S * 0.33, S * 0.28, 0, S * 0.33, S * 0.28, S * 0.12);
  sp.addColorStop(0, `rgba(255,255,255,${spec})`); sp.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = sp; g.fillRect(0, 0, S, S);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  _cache.set(key, tex);
  return tex;
};

// Material MatCap listo para usar en JSX
export const Matcap = ({ color = '#ffffff', opacity = 1, ...o }) => {
  const tex = useMemo(() => matcapTexture(color, o), [color, o.shade, o.rim, o.spec]);
  return <meshMatcapMaterial matcap={tex} transparent opacity={opacity} depthWrite={opacity > 0.5} />;
};

// Contorno: 'hull' (casco invertido de kit.jsx, comprobado en --gl=swangle) o 'drei' (<Outlines>, no se dibuja en swangle en nuestras pruebas)
const Edge = ({ outline, t, color }) => outline === 'drei'
  ? <Outlines thickness={t} color={color} />
  : <OL t={t} color={color} />;

// Malla primitiva con MatCap + contorno
export const MatcapMesh = ({ geo, color = '#ffffff', pos, rot, scale, t = 0.015, outline = 'hull', outlineColor = '#141018', opacity = 1, castShadow = true, children }) =>
  <mesh position={pos} rotation={rot} scale={scale} castShadow={castShadow}>
    {geo}
    <Matcap color={color} opacity={opacity} />
    {opacity > 0.5 && t > 0 ? <Edge outline={outline} t={t} color={outlineColor} /> : null}
    {children}
  </mesh>;

// Modelo .glb desde remotion/public/models/ con todas sus mallas en MatCap + contorno
const GLB = ({ file, color, colors = {}, t, outline, outlineColor }) => {
  const { scene } = useGLTF(staticFile(`models/${file}`));
  const cloned = useMemo(() => scene.clone(true), [scene]);
  useLayoutEffect(() => {
    cloned.traverse((o) => {
      if (!o.isMesh) return;
      const c = colors[o.name] || (o.material && o.material.color ? `#${o.material.color.getHexString()}` : color);
      o.material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture(color || c) });
      o.castShadow = true;
    });
  }, [cloned, color]);
  const meshes = [];
  cloned.traverse((o) => { if (o.isMesh) meshes.push(o); });
  return <group>
    <primitive object={cloned} />
    {t > 0 ? meshes.map((m, k) => <mesh key={k} geometry={m.geometry} position={m.getWorldPosition(new THREE.Vector3())} quaternion={m.getWorldQuaternion(new THREE.Quaternion())} scale={m.getWorldScale(new THREE.Vector3())}>
      <meshBasicMaterial visible={false} />
      <Edge outline={outline} t={t} color={outlineColor} />
    </mesh>) : null}
  </group>;
};

// Uso: <MatcapModel file="nevera.glb" pos={[0,0,0]} scale={1} color="#f4f6f8" />
//  o   <MatcapModel geo={<boxGeometry args={[1,1,1]} />} color="#e2483d" />
export const MatcapModel = ({ file: fileProp, modelPath, geo, pos = [0, 0, 0], rot = [0, 0, 0], scale = 1, color, colors, t = 0.015, outline = 'hull', outlineColor = '#141018', ...rest }) => {
  // acepta file="x.glb" o modelPath="/models/x.glb"
  const file = fileProp || (modelPath ? modelPath.replace(/^\/?models\//, '').replace(/^\//, '') : null);
  if (!file) return <MatcapMesh geo={geo} color={color || '#ffffff'} pos={pos} rot={rot} scale={scale} t={t} outline={outline} outlineColor={outlineColor} {...rest} />;
  return <group position={pos} rotation={rot} scale={scale}>
    <Suspense fallback={null}><GLB file={file} color={color} colors={colors} t={t} outline={outline} outlineColor={outlineColor} /></Suspense>
  </group>;
};

export const preloadModel = (file) => useGLTF.preload(staticFile(`models/${file}`));
