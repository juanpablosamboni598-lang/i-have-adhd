import React from 'react';
import { cl, tw, lerp, drop, Part, OL, INK } from './kit.jsx';
import { Human } from './world20.jsx';
import { Tag, Big } from './scenes20.jsx';
import { Thermo } from './world22.jsx';
import { K, WS, Laundry, Washer, Bucket, Board, Hands } from './world23.jsx';

const R = '#e2483d', G = '#2bb36b';
const fo = (t, a, b) => tw(t, a, a + 0.4) * (b === undefined ? 1 : 1 - tw(t, b - 0.4, b));
// armado acumulado
const LV = ['drum', 'paddles', 'tub', 'motor', 'valve', 'press', 'heater', 'disp', 'pump', 'filter', 'weights', 'springs', 'lock', 'gasket', 'panel'];
const ON = (lv, extra = {}) => {
  const k = LV.indexOf(lv);
  const o = { drum: 1, holes: 1 };
  if (k >= 1) o.paddles = 1; if (k >= 2) { o.tub = 1; o.shell = 1; o.door = 1; }
  if (k >= 3) { o.motor = 1; o.belt = 1; } if (k >= 4) { o.valve = 1; o.hose = 1; } if (k >= 5) o.press = 1;
  if (k >= 6) o.heater = 1; if (k >= 7) o.disp = 1; if (k >= 8) o.pump = 1; if (k >= 9) o.filter = 1;
  if (k >= 10) o.weights = 1; if (k >= 11) o.springs = 1; if (k >= 12) o.lock = 1; if (k >= 13) o.gasket = 1; if (k >= 14) o.panel = 1;
  return { ...o, ...extra };
};
const ALL = ON('panel');
const tumble = (t) => t * 1.6;
const spin = (t) => t * 24;
// cámaras (lavadora en el origen, frente a +z, centro del tambor a y=0.46)
const FRONT = (d, s = 1) => [[0, 1.1 * s, 0.85, 2.1, 0, 0.45, 0], [d * 0.35, 0.4 * s, 0.7, 1.7, 0, 0.45, 0], [d * 0.7, -0.6 * s, 0.75, 1.8, 0, 0.45, 0], [d, -1.0 * s, 0.9, 2.0, 0, 0.45, 0]];
const CLOSE = (d) => [[0, 0.5, 0.65, 1.25, 0, 0.46, 0], [d * 0.4, 0.1, 0.55, 1.0, 0, 0.46, 0], [d * 0.75, -0.4, 0.62, 1.1, 0, 0.46, 0], [d, 0.25, 0.5, 1.05, 0, 0.46, 0]];
const SIDE = (d) => [[0, 1.5, 0.8, 1.2, 0, 0.45, -0.05], [d * 0.5, 1.2, 0.55, 0.6, 0, 0.42, -0.05], [d, 1.45, 0.9, 0.3, 0, 0.45, -0.05]];
const BACKV = (d) => [[0, -1.5, 1.0, -1.1, 0, 0.42, -0.1], [d * 0.5, -1.2, 0.75, -1.4, 0, 0.4, -0.1], [d, -1.7, 1.05, -0.6, 0, 0.42, -0.1]];
const LOW = (d) => [[0, 0.7, 0.25, 1.1, -0.1, 0.15, 0.1], [d * 0.5, 0.1, 0.18, 0.85, -0.12, 0.13, 0.1], [d, -0.5, 0.3, 1.0, -0.1, 0.15, 0.1]];
const TOP = (d) => [[0, 0.6, 1.5, 0.9, 0, 0.75, -0.05], [d * 0.5, -0.3, 1.35, 0.7, 0, 0.72, -0.1], [d, 0.5, 1.45, 0.8, 0, 0.75, -0.05]];
const WIDE = (d) => [[0, 1.8, 1.2, 2.8, 0, 0.5, 0], [d * 0.5, 0.3, 1.0, 2.3, 0, 0.5, 0], [d, -1.6, 1.25, 2.6, 0, 0.5, 0]];
// tambor suelto, sin carcasa (sobre un soporte)
const Stand = () => <group>
  {[-0.18, 0.18].map((z, k) => <mesh key={k} position={[0, 0.11, z]} castShadow><boxGeometry args={[0.5, 0.22, 0.03]} /><meshToonMaterial color={K.wood} /></mesh>)}
</group>;
const Splash = ({ t, on = 1 }) => on <= 0.01 ? null : <group>{Array.from({ length: 6 }).map((_, k) => { const u = ((t * 1.3 + k / 6) % 1); return <mesh key={k} position={[Math.sin(k * 2.1) * 0.15 * u, 0.6 + u * 0.15 - u * u * 0.3, 0.1 + Math.cos(k * 1.7) * 0.15 * u]} scale={0.014 * (1 - u)}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color={K.water} /></mesh>; })}</group>;

export const S23 = {
  abre: ({ t, d }) => ({
    keys: [[0, 1.6, 1.0, 2.6, 0, 0.45, 0], [d * 0.4, 0.4, 0.8, 1.9, 0, 0.45, 0], [d * 0.75, -0.9, 0.7, 1.8, 0, 0.45, 0], [d, -1.4, 1.0, 2.2, 0, 0.45, 0]],
    three: <><Laundry /><group position={[0, t > d * 0.75 ? (t - d * 0.75) * 4 : 0, 0]}><Washer t={t} on={ALL} xr={tw(t, d * 0.3, d * 0.45) * 0.85} ang={tumble(t)} mode={1} level={0.5} foam={0.7} knob={0.6} locked={1} /></group></>,
    caps: [['lavadora', 'una lavadora'], ['tambor', 'un tambor con huecos'], ['concreto', 'bloques de concreto', R], ['cero', 'desde cero']],
  }),
  balde: ({ t, d }) => ({
    keys: [[0, 1.0, 1.0, 1.7, 0, 0.2, 0], [d * 0.5, -0.2, 0.9, 1.4, 0, 0.2, 0], [d, -0.9, 1.0, 1.6, 0, 0.2, 0]],
    three: <><Laundry /><Bucket t={t} pos={[0, 0, 0]} level={tw(t, 0.2, 1.2) * 0.8} foam={tw(t, d * 0.25, d * 0.4)} dirt={1} slosh={1} /></>,
    caps: [['balde', 'un balde'], ['lavadora', 'ya tienes una lavadora'], ['suelta', 'no se suelta', R], ['sucia', 'sigue sucia', R]],
  }),
  frotar: ({ t, d }) => ({
    keys: [[0, 0.9, 0.95, 1.5, 0, 0.35, 0], [d * 0.5, -0.5, 0.85, 1.3, 0, 0.35, 0], [d, 0.4, 1.0, 1.45, 0, 0.35, 0]],
    three: <><Laundry /><Bucket t={t} level={0.8} foam={1} dirt={1 - tw(t, d * 0.3, d * 0.8)} /><Board pos={[0, 0.42, 0.05]} rot={[-0.45, 0, 0]} />
      <Hands pos={[0, 0.48, 0.16]} rot={[-0.45, 0, 0]} t={t} rub={1} /></>,
    caps: [['frotas', 'la frotas'], ['tabla', 'contra una tabla'], ['roce', 'el roce despega la mugre', G], ['siglos', 'durante siglos']],
  }),
  cansa: ({ t, d }) => ({
    keys: [[0, 1.6, 1.3, 2.8, -0.2, 0.75, 0], [d * 0.5, 0.8, 1.2, 2.5, -0.2, 0.75, 0], [d, -0.7, 1.3, 2.7, -0.2, 0.75, 0]],
    three: <><Laundry /><Bucket t={t} pos={[0.2, 0, 0.1]} level={0.8} foam={0.6} dirt={0.6} />
      <Human pos={[-0.35, 0, 0.1]} rotY={0.6} s={0.75} t={t} dizzy={tw(t, d * 0.2, d * 0.5)} />
      {Array.from({ length: 8 }).map((_, k) => <mesh key={k} position={[-1.3 + (k % 4) * 0.22, 0.04 + Math.floor(k / 4) * 0.08, 0.3 + (k % 2) * 0.1]} scale={drop(t, 0.3 + k * 0.15, 0.4)} castShadow><boxGeometry args={[0.2, 0.07, 0.16]} /><meshToonMaterial color={['#e2483d', '#3f6fb0', '#ffd23d', '#2bb36b'][k % 4]} /></mesh>)}</>,
    caps: [['cansa', 'frotar cansa', R], ['cobija', 'una sola cobija', R], ['semana', 'ropa para toda la semana', R]],
  }),
  tambor: ({ t, d }) => ({
    keys: CLOSE(d),
    three: <><Laundry /><Stand /><group position={[0, (1 - drop(t, 0.1, 0.6)) * 1.5, 0]}><Washer t={t} on={{ drum: 1, holes: 1 }} ang={tumble(t)} mode={t > 1.2 ? 1 : 0} level={0.5} /></group></>,
    caps: [['tambor', 'un tambor acostado'], ['huequitos', 'lleno de huequitos'], ['girar', 'a girar'], ['misma', 'se frota sola', G]],
  }),
  resbala: ({ t, d }) => ({
    keys: [[0, 0.3, 0.55, 0.9, 0, 0.42, 0], [d * 0.5, -0.25, 0.5, 0.85, 0, 0.42, 0], [d, 0.35, 0.58, 0.95, 0, 0.42, 0]],
    three: <><Laundry /><Stand /><Washer t={t} on={{ drum: 1, holes: 1 }} ang={tumble(t)} mode={0} slip={1} level={0.5} /></>,
    caps: [['resbala', 'la ropa resbala', R], ['abajo', 'se queda abajo', R]],
  }),
  paletas: ({ t, d }) => ({
    keys: CLOSE(d),
    three: <><Laundry /><Stand /><Washer t={t} on={{ drum: 1, holes: 1, paddles: tw(t, 0.3, 1.0) }} ang={tumble(t)} mode={t > 1.2 ? 1 : 0} level={0.5} /></>,
    caps: [['aletas', 'unas aletas'], ['suben', 'la suben'], ['caer', 'y la dejan caer'], ['paletas', 'las paletas', G]],
  }),
  chorrea: ({ t, d }) => ({
    keys: FRONT(d, 0.7),
    three: <><Laundry /><Stand /><Washer t={t} on={{ drum: 1, holes: 1, paddles: 1 }} ang={tumble(t)} mode={1} level={lerp(0.5, 0.1, tw(t, 0.3, d * 0.6))} jets={1} leak={tw(t, 0.4, d * 0.7)} /></>,
    caps: [['huecos', 'lleno de huecos'], ['sale', 'el agua se sale', R], ['inunda', 'te inunda el piso', R]],
  }),
  tina: ({ t, d }) => ({
    keys: SIDE(d),
    three: <><Laundry /><Washer t={t} on={{ drum: 1, holes: 1, paddles: 1, tub: t > 0.6 ? 1 : 0, shell: t > d * 0.55 ? 1 : 0, door: t > d * 0.55 ? 1 : 0 }} xr={0.85} ang={tumble(t)} mode={1} level={0.5} /></>,
    caps: [['tina', 'otra tina'], ['cerrada', 'bien cerrada'], ['escapa', 'no se escapa', G], ['cuba', 'la cuba', G]],
  }),
  girar: ({ t, d }) => ({
    keys: BACKV(d),
    three: <><Laundry /><Washer t={t} on={ON('tub')} xr={0.85} ang={Math.sin(t * 1.2) * 0.6} mode={0} level={0.5} />
      <group position={[0, 0.46, -0.42]} rotation={[0, 0, t * 1.2]}><mesh position={[0.1, 0, 0]}><boxGeometry args={[0.2, 0.025, 0.025]} /><meshToonMaterial color={K.wood} /></mesh><mesh position={[0.2, 0, -0.06]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.02, 0.02, 0.12, 8]} /><meshToonMaterial color={K.red} /></mesh></group></>,
    caps: [['girar', 'hay que girarlo'], ['manivela', 'con una manivela'], ['rendidos', 'brazos rendidos', R]],
  }),
  motor: ({ t, d }) => ({
    keys: BACKV(d),
    three: <><Laundry /><Washer t={t} on={ON('motor')} xr={0.85} ang={tumble(t) * tw(t, 1, 2)} mode={t > 2 ? 1 : 0} level={0.5} /></>,
    caps: [['motor', 'un motor'], ['correa', 'una correa'], ['polea', 'una polea grande'], ['fuerza', 'más fuerza', G]],
  }),
  llenar: ({ t, d }) => ({
    keys: FRONT(d),
    three: <><Laundry /><Washer t={t} on={ON('motor')} xr={0.85} ang={tumble(t)} mode={1} level={lerp(0.2, 0.9, tw(t, 0.5, d * 0.7))} leak={tw(t, d * 0.6, d * 0.9)} />
      <group position={[0.15, 0.75 + Math.sin(t * 3) * 0.02, 0.45]} rotation={[0, 0, -0.9 - Math.sin(t * 3) * 0.1]}><Bucket t={t} level={0.6} cloth={0} /></group>
      <Splash t={t} /></>,
    caps: [['baldes', 'llenarla con baldes', R], ['desborda', 'se desborda', R]],
  }),
  valvula: ({ t, d }) => ({
    keys: [[0, 1.6, 1.3, 0.4, 0.25, 0.8, -0.4], [d * 0.5, 1.3, 1.15, 0.7, 0.25, 0.78, -0.4], [d, 1.5, 1.35, 1.0, 0.2, 0.72, -0.3]],
    three: <><Laundry /><Washer t={t} on={ON('valve')} xr={0.85} ang={tumble(t)} mode={1} inflow={tw(t, d * 0.45, d * 0.55)} level={lerp(0.1, 0.5, tw(t, d * 0.5, d))} /></>,
    caps: [['manguera', 'una manguera'], ['eléctrica', 'una llave eléctrica'], ['electroválvula', 'la electroválvula', G]],
  }),
  cuanta: ({ t, d }) => ({
    keys: FRONT(d),
    three: <><Laundry /><Washer t={t} on={ON('valve')} xr={0.85} ang={tumble(t)} mode={1} inflow={1} level={lerp(0.5, 1.3, tw(t, 0.3, d * 0.6))} leak={tw(t, d * 0.55, d * 0.85)} /></>,
    caps: [['parar', 'no sabe cuándo parar', R], ['subiendo', 'sigue subiendo', R], ['puerta', 'por la puerta', R]],
  }),
  presostato: ({ t, d }) => ({
    keys: [[0, -0.9, 0.7, 0.9, -0.15, 0.45, -0.1], [d * 0.4, -0.7, 0.6, 0.6, -0.15, 0.5, -0.1], [d * 0.75, -0.9, 0.8, 0.5, -0.2, 0.65, -0.15], [d, -0.6, 0.95, 0.8, -0.2, 0.7, -0.15]],
    three: <><Laundry /><Washer t={t} on={ON('press')} xr={0.88} ang={tumble(t)} mode={1} inflow={t < d * 0.8 ? 1 : 0} level={lerp(0.1, 0.55, tw(t, 0.3, d * 0.75))} press={tw(t, d * 0.4, d * 0.8)} /></>,
    caps: [['tubito', 'un tubito'], ['aire', 'aprieta el aire'], ['interruptor', 'empuja un interruptor'], ['presostato', 'el presostato', G]],
  }),
  fria: ({ t, d }) => ({
    keys: CLOSE(d),
    three: <><Laundry /><Washer t={t} on={ON('press')} xr={0.85} ang={tumble(t)} mode={1} level={0.55} dirtCl={1} />
      <Thermo pos={[0.48, 0.15, 0.35]} v={lerp(18, 15, tw(t, 0.3, d))} min={0} max={70} s={0.75} /></>,
    ov: <Tag txt={`${Math.round(lerp(18, 15, tw(t, 0.3, d)))} °C`} x={1380} y={600} op={fo(t, 0.4)} col="#1fb5a5" size={50} />,
    caps: [['fría', 'agua fría'], ['grasa', 'la grasa no se suelta', R]],
  }),
  resistencia: ({ t, d }) => ({
    keys: [[0, 0.6, 0.3, 0.9, 0, 0.25, 0], [d * 0.4, -0.2, 0.25, 0.75, 0, 0.24, 0], [d * 0.75, 0.4, 0.4, 0.95, 0, 0.3, 0], [d, -0.5, 0.55, 1.2, 0, 0.4, 0]],
    three: <><Laundry /><Washer t={t} on={ON('heater')} xr={0.88} ang={tumble(t)} mode={1} level={0.55} heat={tw(t, d * 0.2, d * 0.45) * (1 - tw(t, d * 0.8, d * 0.9))} dirtCl={1 - tw(t, d * 0.5, d)} />
      <Thermo pos={[0.48, 0.15, 0.35]} v={lerp(15, 40, tw(t, d * 0.3, d * 0.8))} min={0} max={70} s={0.75} /></>,
    ov: <Tag txt={`${Math.round(lerp(15, 40, tw(t, d * 0.3, d * 0.8)))} °C`} x={1380} y={600} op={fo(t, d * 0.25)} col={R} size={50} />,
    caps: [['espiral', 'un alambre en espiral'], ['ducha', 'como el de una ducha'], ['resistencia', 'la resistencia', G], ['sensor', 'un sensor la apaga']],
  }),
  jabon: ({ t, d }) => ({
    keys: TOP(d),
    three: <><Laundry /><Washer t={t} on={ON('heater')} xr={0.85} ang={tumble(t)} mode={1} level={0.5} heat={0.6} />
      <mesh position={[0.05, lerp(1.3, 0.55, drop(t, 0.3, 0.6)), 0.05]} scale={1 + tw(t, d * 0.4, d) * 0.4} castShadow><sphereGeometry args={[0.05, 12, 8]} /><meshToonMaterial color="#ffffff" /><Part geo={<sphereGeometry args={[0.01]} />} color="#7fc4e8" /></mesh></>,
    caps: [['directo', 'directo sobre la ropa'], ['bola', 'se queda en una bola', R], ['manchas', 'manchas blancas', R]],
  }),
  cajetin: ({ t, d }) => ({
    keys: [[0, -0.6, 1.1, 0.9, -0.17, 0.8, 0.3], [d * 0.5, -0.2, 1.0, 0.7, -0.17, 0.78, 0.3], [d, -0.4, 0.95, 1.1, -0.1, 0.6, 0.2]],
    three: <><Laundry /><Washer t={t} on={ON('disp')} xr={0.8} ang={tumble(t)} mode={1} inflow={tw(t, d * 0.35, d * 0.45)} level={lerp(0.4, 0.55, tw(t, d * 0.4, d))} foam={tw(t, d * 0.5, d * 0.8)} /></>,
    caps: [['cajoncito', 'un cajoncito'], ['disuelve', 'disuelve el jabón'], ['mezclado', 'ya mezclado', G], ['dispensador', 'el dispensador', G]],
  }),
  sucia: ({ t, d }) => ({
    keys: CLOSE(d),
    three: <><Laundry /><Washer t={t} on={ON('disp')} xr={0.85} ang={tumble(t) * (1 - tw(t, d * 0.3, d * 0.5))} mode={t < d * 0.4 ? 1 : 0} level={0.6} dirty={tw(t, 0.2, d * 0.4)} foam={0.5} /></>,
    caps: [['gris', 'agua gris', R], ['mugre', 'jabón y mugre', R], ['salir', 'no tiene por dónde salir', R]],
  }),
  bomba: ({ t, d }) => ({
    keys: LOW(d),
    three: <><Laundry /><Washer t={t} on={ON('pump')} xr={0.88} ang={0} mode={0} level={lerp(0.6, 0.02, tw(t, d * 0.3, d * 0.9))} dirty={1} drain={tw(t, d * 0.25, d * 0.35)} /></>,
    caps: [['bomba', 'una bomba pequeña'], ['chupa', 'chupa el agua sucia'], ['desagüe', 'la bomba de desagüe', G]],
  }),
  moneda: ({ t, d }) => ({
    keys: LOW(d),
    three: <><Laundry /><Washer t={t} on={ON('pump')} xr={0.88} ang={tumble(t)} mode={1} level={0.4} dirty={0.7} coin={tw(t, d * 0.3, d * 0.7)} clog={t > d * 0.7 ? 1 : 0} drain={t < d * 0.7 ? 0.8 : 0} /></>,
    caps: [['moneda', 'una moneda'], ['botón', 'un botón'], ['bomba', 'entran en la bomba'], ['traban', 'la traban', R]],
  }),
  filtro: ({ t, d }) => ({
    keys: [[0, -0.1, 0.25, 1.0, -0.2, 0.12, 0.3], [d * 0.5, -0.45, 0.2, 0.8, -0.2, 0.1, 0.3], [d, 0.1, 0.3, 0.95, -0.2, 0.12, 0.3]],
    three: <><Laundry /><Washer t={t} on={ON('filter')} xr={0.6} ang={tumble(t)} mode={1} level={0.3} filterOpen={tw(t, d * 0.35, d * 0.5) * (1 - tw(t, d * 0.85, d * 0.95))} />
      {t > d * 0.5 && t < d * 0.85 ? <mesh position={[-0.2, 0.1, 0.42 + tw(t, d * 0.5, d * 0.6) * 0.12]} rotation={[Math.PI / 2, 0, t]}><cylinderGeometry args={[0.02, 0.02, 0.004, 14]} /><meshToonMaterial color={K.yellow} /></mesh> : null}</>,
    caps: [['colador', 'un colador'], ['tapita', 'una tapita al frente'], ['filtro', 'el filtro', G], ['existe', 'casi nadie lo conoce', R]],
  }),
  mojada: ({ t, d }) => ({
    keys: [[0, 1.2, 1.1, 1.8, -0.6, 0.8, 0], [d * 0.5, 0.4, 1.0, 1.5, -0.6, 0.85, 0], [d, -0.3, 1.1, 1.7, -0.6, 0.85, 0]],
    three: <><Laundry /><Washer t={t} on={ALL} xr={0} open={0.8} clothes={0} />
      <mesh position={[-0.6, 1.25, 0.1]}><boxGeometry args={[1.4, 0.008, 0.008]} /><meshBasicMaterial color={INK} /></mesh>
      {[0, 1, 2].map((k) => <group key={k} position={[-1.05 + k * 0.42, 1.08 - tw(t, 0.4, d * 0.5) * 0.04, 0.1]}>
        <mesh castShadow><boxGeometry args={[0.26, 0.34, 0.015]} /><meshToonMaterial color={['#e2483d', '#3f6fb0', '#2bb36b'][k]} /><OL t={0.005} /></mesh>
        {Array.from({ length: 3 }).map((_, j) => { const u = ((t * 1.1 + j / 3 + k * 0.2) % 1); return <mesh key={j} position={[-0.08 + j * 0.08, -0.18 - u * 0.9, 0]} scale={0.012}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color={K.water} /></mesh>; })}
      </group>)}</>,
    caps: [['chorreando', 'sale chorreando', R], ['doble', 'pesa el doble', R], ['días', 'tarda días en secarse', R]],
  }),
  centrifuga: ({ t, d }) => ({
    keys: CLOSE(d),
    three: <><Laundry /><Washer t={t} on={ON('filter')} xr={0.85} ang={spin(t) * tw(t, 0.3, 2.0)} mode={t > 1.2 ? 2 : 1} level={lerp(0.2, 0, tw(t, 0.5, 2))} jets={tw(t, 1.0, 1.6)} /></>,
    ov: <Tag txt={`${Math.round(lerp(0, 1200, tw(t, 0.3, d * 0.6)))} vueltas/min`} x={1400} y={620} op={fo(t, 0.6)} col={G} size={46} />,
    caps: [['rapidísimo', 'rapidísimo'], ['mil', 'más de mil vueltas'], ['disparada', 'el agua sale disparada'], ['centrifugado', 'el centrifugado', G]],
  }),
  baila: ({ t, d }) => ({
    keys: WIDE(d),
    three: <><Laundry /><Washer pos={[Math.sin(t * 2) * 0.12 * tw(t, d * 0.3, d * 0.6), 0, tw(t, d * 0.3, d) * 0.3]} t={t} on={ON('filter')} xr={0.6} ang={spin(t)} mode={2} shake={tw(t, 0.3, d * 0.3)} /></>,
    caps: [['pareja', 'nunca queda pareja'], ['tambalea', 'se tambalea', R], ['camina', 'camina por el piso', R]],
  }),
  concreto: ({ t, d }) => ({
    keys: SIDE(d),
    three: <><Laundry /><Washer t={t} on={ON('weights', { weights: t > 0.5 ? 1 : 0 })} xr={0.85} ang={spin(t)} mode={2} shake={t > 1.2 ? 0.35 : 1} />
      <group position={[0, 0.46 + (1 - drop(t, 0.2, 0.5)) * 1.2, 0]} visible={t < 0.6}><mesh position={[0, 0.33, 0.05]}><boxGeometry args={[0.34, 0.08, 0.14]} /><meshToonMaterial color={K.concrete} /></mesh></group></>,
    ov: <Tag txt="+25 kg" x={1350} y={360} op={fo(t, d * 0.35)} col={INK} size={50} />,
    caps: [['concreto', 'bloques de concreto'], ['pesadísimos', 'pesadísimos'], ['contrapesos', 'los contrapesos', G], ['pesa', 'por eso pesa tanto']],
  }),
  resortes: ({ t, d }) => ({
    keys: [[0, 0.8, 0.35, 1.2, 0, 0.1, 0.2], [d * 0.5, -0.3, 0.3, 1.0, 0, 0.1, 0.2], [d, 0.5, 0.45, 1.3, 0, 0.15, 0.2]],
    three: <><Laundry /><Washer t={t} on={ON('weights')} xr={0.7} ang={spin(t)} mode={2} shake={0.6} />
      {Array.from({ length: 4 }).map((_, k) => { const u = ((t * 1.5 + k / 4) % 1); return <mesh key={k} position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.4 + u * 0.8}><ringGeometry args={[0.95, 1, 40]} /><meshBasicMaterial color={INK} transparent opacity={0.5 * (1 - u)} /></mesh>; })}</>,
    caps: [['pegada', 'pegada a la carcasa'], ['temblor', 'todo el temblor', R], ['terremoto', 'como un terremoto', R]],
  }),
  amortiguar: ({ t, d }) => ({
    keys: [[0, 1.3, 0.6, 0.5, 0, 0.45, 0], [d * 0.5, 1.2, 0.4, 0.1, 0, 0.4, 0], [d, 1.3, 0.75, 0.4, 0, 0.5, 0]],
    three: <><Laundry /><Washer t={t} on={ON('springs')} xr={0.88} ang={spin(t)} mode={2} shake={0.6} /></>,
    caps: [['resortes', 'unos resortes'], ['pistones', 'unos pistones'], ['amortiguadores', 'los amortiguadores', G], ['moto', 'como los de una moto']],
  }),
  puerta: ({ t, d }) => ({
    keys: [[0, 1.0, 0.7, 1.6, -0.1, 0.45, 0.2], [d * 0.5, 0.5, 0.6, 1.3, -0.1, 0.45, 0.2], [d, 1.1, 0.75, 1.5, -0.1, 0.45, 0.2]],
    three: <><Laundry /><Washer t={t} on={ON('springs')} xr={0.3} ang={tumble(t)} mode={1} level={0.6} open={tw(t, 0.4, 1.0) * 0.7} leak={tw(t, 0.8, d * 0.7)} />
      {t < d * 0.6 ? <Hands pos={[0.1, 0.48, 0.65]} rot={[0, 0, 0]} t={t} rub={0.2} /> : null}</>,
    caps: [['abres', 'abres la puerta'], ['sale', 'se sale el agua', R], ['lastimar', 'te puedes lastimar', R]],
  }),
  seguro: ({ t, d }) => ({
    keys: [[0, 0.7, 0.55, 0.9, 0.25, 0.46, 0.25], [d * 0.5, 0.35, 0.5, 0.75, 0.25, 0.46, 0.25], [d, 0.8, 0.6, 1.1, 0.15, 0.46, 0.2]],
    three: <><Laundry /><Washer t={t} on={ON('lock')} xr={0.2} ang={tumble(t)} mode={1} level={0.5} locked={tw(t, d * 0.25, d * 0.3)} /></>,
    caps: [['seguro', 'un seguro'], ['traba', 'traba la puerta'], ['clac', '¡clac!'], ['esperas', 'esperas un rato al final']],
  }),
  goma: ({ t, d }) => ({
    keys: [[0, 0.5, 0.35, 0.9, 0, 0.25, 0.25], [d * 0.5, -0.2, 0.3, 0.8, 0, 0.25, 0.25], [d, 0.4, 0.4, 0.95, 0, 0.3, 0.25]],
    three: <><Laundry /><Washer t={t} on={ON('lock')} xr={0.3} ang={tumble(t)} mode={1} level={0.6} locked={1} leak={tw(t, 0.3, d * 0.8) * 0.6} /></>,
    caps: [['rendija', 'queda una rendija'], ['gotea', 'por ahí gotea', R]],
  }),
  fuelle: ({ t, d }) => ({
    keys: [[0, 0.9, 0.7, 0.8, 0, 0.46, 0.25], [d * 0.5, 0.5, 0.55, 0.65, 0, 0.46, 0.25], [d, 0.95, 0.75, 0.9, 0, 0.46, 0.25]],
    three: <><Laundry /><Washer t={t} on={ON('gasket')} xr={0.75} ang={tumble(t)} mode={1} level={0.5} locked={1} open={0.55} shake={0.1} />
      {t > d * 0.6 ? <mesh position={[0.1, 0.24, 0.29]} rotation={[0.4, t, 0.2]}><boxGeometry args={[0.06, 0.02, 0.1]} /><meshToonMaterial color="#ff8fc0" /></mesh> : null}</>,
    caps: [['fuelle', 'un fuelle de goma'], ['acordeón', 'como un acordeón'], ['medias', 'medias perdidas', R]],
  }),
  cerebro: ({ t, d }) => {
    const parts = ['válvula', 'motor', 'resistencia', 'bomba', 'seguro'];
    const k = Math.min(4, Math.floor(t / d * 6));
    return {
      keys: WIDE(d),
      three: <><Laundry /><Washer t={t} on={ON('gasket')} xr={0.85} ang={k >= 1 ? tumble(t) : 0} mode={k >= 1 ? 1 : 0} level={0.5} inflow={k === 0 ? 1 : 0} heat={k === 2 ? 1 : 0} drain={k === 3 ? 1 : 0} locked={k >= 4 ? 1 : 0} />
        <Human pos={[-0.85, 0, 0.5]} rotY={0.9} s={0.8} t={t} dizzy={tw(t, d * 0.5, d * 0.8)} /></>,
      ov: <>{parts.map((s, j) => <Tag key={j} txt={s} x={1500} y={260 + j * 120} op={j <= k ? 1 : 0} col={j === k ? R : INK} size={40} />)}</>,
      caps: [['válvula', 'válvula, motor, bomba…'], ['mano', 'uno por uno', R], ['pegado', 'pegado a la lavadora', R]],
    };
  },
  programa: ({ t, d }) => ({
    keys: [[0, 0.35, 0.95, 0.75, 0.15, 0.82, 0.3], [d * 0.5, 0.05, 0.9, 0.62, 0.15, 0.82, 0.3], [d, 0.5, 0.85, 1.4, 0, 0.6, 0.1]],
    three: <><Laundry /><Washer t={t} on={ALL} xr={0.4} ang={tumble(t)} mode={1} level={0.5} knob={tw(t, 0.3, d * 0.5) * 0.8} locked={1} /></>,
    caps: [['perilla', 'una perilla'], ['cerebro', 'un pequeño cerebro'], ['programa', 'tú escoges el programa', G], ['exprimir', 'cuándo exprimir']],
  }),
  ciclo: ({ t, d }) => {
    const u = t / d;
    const st = u < 0.18 ? 0 : u < 0.33 ? 1 : u < 0.5 ? 2 : u < 0.65 ? 3 : u < 0.8 ? 4 : 5;
    return {
      keys: [[0, 1.2, 0.9, 1.8, 0, 0.45, 0], [d * 0.33, 0.3, 0.75, 1.5, 0, 0.45, 0], [d * 0.66, -0.6, 0.8, 1.6, 0, 0.45, 0], [d, -1.2, 0.95, 1.9, 0, 0.45, 0]],
      three: <><Laundry /><Washer t={t} on={ALL} xr={0.85} ang={st === 5 ? spin(t) : tumble(t)} mode={st === 5 ? 2 : 1} level={st === 3 || st === 5 ? 0.1 : 0.5} inflow={st === 0 || st === 4 ? 1 : 0} heat={st === 1 ? 1 : 0}
        foam={st <= 2 ? 0.7 : 0} dirty={st === 2 || st === 3 ? 0.7 : 0} drain={st === 3 ? 1 : 0} jets={st === 5 ? 1 : 0} locked={1} knob={0.2 + st * 0.12} /></>,
      ov: <Tag txt={['entra el agua', 'calienta', 'da vueltas', 'saca el agua', 'enjuaga', 'centrifuga'][st]} x={960} y={950} op={1} col={G} size={50} />,
      caps: [['jabón', 'entra el agua'], ['vueltas', 'da vueltas'], ['enjuagar', 'enjuaga'], ['centrifuga', 'y centrifuga', G]],
    };
  },
  suavizante: ({ t, d }) => ({
    keys: [[0, -0.5, 1.05, 0.85, -0.15, 0.8, 0.3], [d * 0.5, -0.15, 0.95, 0.7, -0.15, 0.78, 0.3], [d, -0.4, 0.9, 1.1, -0.1, 0.6, 0.2]],
    three: <><Laundry /><Washer t={t} on={ALL} xr={0.7} ang={tumble(t)} mode={1} level={0.45} softener={1} inflow={tw(t, d * 0.4, d * 0.5)} locked={1} /></>,
    caps: [['suavizante', 'el suavizante'], ['último', 'el último enjuague', G], ['sucia', 'no se va con el agua sucia']],
  }),
  llena: ({ t, d }) => ({
    keys: CLOSE(d),
    three: <><Laundry /><Washer t={t} on={ALL} xr={0.85} ang={tumble(t)} mode={0} level={0.4} locked={1} clothes={1} />
      {Array.from({ length: 14 }).map((_, k) => <mesh key={k} position={[((k * 0.37) % 1 - 0.5) * 0.36, 0.3 + ((k * 0.61) % 1) * 0.32, ((k * 0.53) % 1 - 0.5) * 0.3]} rotation={[k, k * 2, 0]} scale={drop(t, 0.2 + k * 0.05, 0.3)}><boxGeometry args={[0.1, 0.06, 0.09]} /><meshToonMaterial color={['#e2483d', '#3f6fb0', '#ffd23d', '#2bb36b', '#7a5cd6'][k % 5]} /></mesh>)}</>,
    caps: [['tope', 'hasta el tope', R], ['espacio', 'no tiene espacio', R], ['sucia', 'sale casi igual de sucia', R]],
  }),
  espacio: ({ t, d }) => ({
    keys: [[0, 0.4, 0.7, 1.0, 0, 0.5, 0], [d * 0.5, -0.1, 0.65, 0.85, 0, 0.5, 0], [d, 0.35, 0.72, 1.0, 0, 0.5, 0]],
    three: <><Laundry /><Washer t={t} on={ALL} xr={0.85} ang={tumble(t)} mode={1} level={0.4} locked={1} />
      <group scale={0.55}><Hands pos={[0, 1.2, 0.1]} rot={[Math.PI / 2, 0, 0]} t={t} rub={0} /></group></>,
    ov: <Tag txt="una mano de espacio" x={960} y={930} op={fo(t, 0.5)} col={G} size={46} />,
    caps: [['mano', 'una mano de espacio', G], ['vueltas', 'que dé sus vueltas', G]],
  }),
  repaso: ({ t, d }) => {
    const L = ['tambor', 'aletas', 'tina', 'motor', 'válvula', 'presostato', 'resistencia', 'bomba', 'filtro', 'concreto', 'resortes', 'seguro'];
    const lv = ['drum', 'paddles', 'tub', 'motor', 'valve', 'press', 'heater', 'pump', 'filter', 'weights', 'springs', 'lock'];
    const k = Math.min(11, Math.floor(t / d * 12.6));
    return {
      keys: [[0, 1.3, 0.9, 1.9, 0, 0.45, 0], [d * 0.5, 0, 1.0, 1.7, 0, 0.45, 0], [d, -1.3, 0.85, 1.8, 0, 0.45, 0]],
      three: <><Laundry /><Washer t={t} rotY={Math.sin(t * 0.4) * 0.5} on={ON(lv[k])} xr={0.85} ang={tumble(t)} mode={1} level={k >= 4 ? 0.5 : 0.3} heat={k === 6 ? 1 : 0} drain={k === 7 ? 1 : 0} locked={k >= 11 ? 1 : 0} /></>,
      ov: <>{L.map((s, j) => <Tag key={j} txt={s} x={j < 6 ? 250 : 1670} y={230 + (j % 6) * 115} op={j <= k ? 1 : 0} col={j === k ? R : INK} size={38} />)}</>,
      caps: [],
    };
  },
  cierre: ({ t, d }) => ({
    keys: [[0, 1.2, 0.85, 1.9, 0, 0.45, 0], [d, -1.2, 0.95, 1.8, 0, 0.45, 0]],
    three: <><Laundry /><Washer t={t} on={ALL} xr={0.85 * (1 - tw(t, d * 0.6, d * 0.9))} ang={tumble(t)} mode={1} level={0.5} foam={0.6} locked={1} /></>,
    caps: [['manos', 'no tiene manos'], ['sola', 'se frota sola', G], ['miles', 'miles de veces']],
  }),
  pregunta: ({ t, d }) => ({
    keys: [[0, 1.0, 1.2, 3.0, -0.3, 0.75, 0], [d, -0.6, 1.3, 2.9, -0.3, 0.75, 0]],
    three: <><Laundry /><Washer t={t} on={ALL} xr={0} ang={tumble(t)} mode={1} open={0.25 + 0.1 * Math.sin(t * 2)} /><Human pos={[-0.85, 0, 0.2]} rotY={0.8} s={0.85} t={t} wave={1} /></>,
    ov: <><Big txt="¿QUÉ ARMAMOS?" y={300} op={fo(t, 0.6)} col="#ffd23d" size={110} /></>,
    caps: [['síguenos', 'síguenos'], ['comentarios', 'déjalo en comentarios']],
  }),
};
