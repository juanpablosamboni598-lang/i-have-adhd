import React from 'react';
import * as THREE from 'three';
import { cl, tw, lerp, drop, Part, Flow, INK } from './kit.jsx';
import { Human } from './world20.jsx';
import { Tag, Big } from './scenes20.jsx';
import { K, FR, Kitchen, Fridge, Thermo, Arm, Piston } from './world22.jsx';

const R = '#e2483d', G = '#2bb36b';
const fo = (t, a, b) => tw(t, a, a + 0.4) * (b === undefined ? 1 : 1 - tw(t, b - 0.4, b));
// niveles de armado acumulado
const LV = ['caja', 'evap', 'comp', 'cond', 'capil', 'thermo', 'foam', 'gasket', 'light', 'freezer', 'fan', 'tray', 'drawer'];
const ON = (lv, extra = {}) => {
  const o = { shell: 1, door: 1, shelves: 1, food: 1 };
  const k = LV.indexOf(lv);
  if (k >= 1) o.evap = 1; if (k >= 2) o.comp = 1; if (k >= 3) o.cond = 1; if (k >= 4) o.capil = 1;
  if (k >= 5) o.thermo = 1; if (k >= 6) o.foam = 0; if (k >= 7) o.gasket = 1; if (k >= 8) o.light = 1;
  if (k >= 9) o.freezer = 1; if (k >= 10) o.fan = 1; if (k >= 11) o.tray = 1; if (k >= 12) o.drawer = 1;
  return { ...o, ...extra };
};
// cámaras (nevera en el origen mirando a +z)
const FRONT = (d, s = 1) => [[0, 1.6 * s, 1.2, 3.6, 0, 0.9, 0], [d * 0.35, 0.6 * s, 1.4, 3.0, 0, 0.95, 0], [d * 0.7, -0.8 * s, 1.1, 3.2, 0, 0.9, 0], [d, -1.4 * s, 1.3, 3.5, 0, 0.9, 0]];
const INSIDE = (d) => [[0, 0.9, 1.3, 2.0, 0, 0.95, 0], [d * 0.4, 0.2, 1.1, 1.6, 0, 0.9, 0], [d * 0.75, -0.6, 1.3, 1.8, 0, 0.95, 0], [d, 0.4, 1.0, 1.7, 0, 0.9, 0]];
const TOP = (d) => [[0, 0.8, 1.7, 1.6, 0, 1.45, -0.1], [d * 0.5, -0.4, 1.55, 1.3, 0, 1.45, -0.15], [d, 0.5, 1.6, 1.5, 0, 1.45, -0.1]];
const BACK = (d) => [[0, 1.2, 1.0, 2.6, 0, 0.8, 0], [d * 0.35, 0.3, 0.6, 2.0, 0, 0.6, 0], [d * 0.7, -0.6, 1.1, 2.2, 0, 0.8, 0], [d, -1.2, 0.8, 2.6, 0, 0.75, 0]];
const LOWBACK = (d) => [[0, 0.8, 0.5, 1.6, 0.1, 0.3, 0.2], [d * 0.5, 0.1, 0.35, 1.2, 0.1, 0.25, 0.2], [d, -0.6, 0.6, 1.4, 0.1, 0.3, 0.2]];
// gira la nevera para ver la espalda
const BK = Math.PI;

export const S22 = {
  abre: ({ t, d }) => ({
    keys: [[0, 2.0, 1.2, 4.2, 0, 0.9, 0], [d * 0.4, 0.4, 1.4, 3.2, 0, 0.95, 0], [d * 0.75, -1.2, 1.0, 3.0, 0, 0.9, 0], [d, -1.8, 1.4, 3.6, 0, 0.9, 0]],
    three: <><Kitchen /><group position={[0, t > d * 0.7 ? (t - d * 0.7) * 6 : 0, 0]}><Fridge t={t} on={ON('drawer')} xr={tw(t, d * 0.3, d * 0.45) * 0.85} flow={1} comp={1} heat={1} open={0} /></group></>,
    caps: [['nevera', 'una nevera'], ['truco', 'un truco'], ['espalda', 'lo tira por la espalda', R], ['cero', 'desde cero']],
  }),
  caja: ({ t, d }) => ({
    keys: FRONT(d),
    three: <><Kitchen /><group position={[0, (1 - drop(t, 0.2, 0.7)) * 3, 0]}><Fridge t={t} on={{ shell: 1, door: 1, shelves: 1, food: 1 }} xr={0.75} open={0} foodP={{ spoil: tw(t, d * 0.55, d * 0.8) }} /></group>
      <Thermo pos={[0.65, 0.2, 0.4]} v={lerp(25, 27, tw(t, d * 0.4, d))} /></>,
    ov: <Tag txt={`${Math.round(lerp(25, 27, tw(t, d * 0.4, d)))} °C`} x={1350} y={560} op={fo(t, d * 0.35)} col={R} size={50} />,
    caps: [['caja', 'una caja'], ['mismo', 'mismo calor', R], ['corta', 'se corta', R]],
  }),
  hielo: ({ t, d }) => ({
    keys: INSIDE(d),
    three: <><Kitchen /><Fridge t={t} on={{ shell: 1, door: 1, shelves: 1, food: 1 }} xr={0.8} ice={1} /><group position={[0, (1 - drop(t, 0.3, 0.6)) * 2, 0]} />
      <Thermo pos={[0.65, 0.2, 0.4]} v={lerp(25, 6, tw(t, d * 0.35, d * 0.8))} /></>,
    ov: <Tag txt={`${Math.round(lerp(25, 6, tw(t, d * 0.35, d * 0.8)))} °C`} x={1350} y={560} op={fo(t, d * 0.3)} col="#1fb5a5" size={50} />,
    caps: [['hielo', 'un bloque de hielo'], ['roba', 'se roba el calor'], ['antes', 'neveras de antes']],
  }),
  derrite: ({ t, d }) => ({
    keys: INSIDE(d),
    three: <><Kitchen /><Fridge t={t} on={{ shell: 1, door: 1, shelves: 1, food: 1 }} xr={0.8} ice={1} melt={tw(t, 0.3, d * 0.7)} />
      <Thermo pos={[0.65, 0.2, 0.4]} v={lerp(6, 20, tw(t, d * 0.5, d))} /></>,
    caps: [['derrite', 'se derrite', R], ['charco', 'un charco', R], ['cargarlo', 'otro bloque', R]],
  }),
  sudor: ({ t, d }) => ({
    keys: [[0, 0.8, 1.2, 1.8, 0, 1.05, 0.3], [d * 0.5, 0.1, 1.1, 1.5, 0, 1.05, 0.3], [d, -0.7, 1.25, 1.7, 0, 1.05, 0.3]],
    three: <><Kitchen /><Arm t={t} wind={tw(t, d * 0.3, d * 0.4)} /><Thermo pos={[0.6, 0.85, 0.4]} v={lerp(34, 28, tw(t, d * 0.45, d * 0.9))} min={20} max={40} /></>,
    caps: [['sudas', 'cuando sudas'], ['viento', 'te da el viento'], ['evaporarse', 'se lleva el calor', G]],
  }),
  liquido: ({ t, d }) => ({
    keys: TOP(d),
    three: <><Kitchen /><Fridge t={t} on={{ shell: 1, door: 1, shelves: 1, food: 1, evap: t > d * 0.45 ? 1 : 0 }} xr={0.85} flow={t > d * 0.55 ? 0.6 : 0} /></>,
    caps: [['especial', 'un líquido especial'], ['bajo', 'hierve bajo cero'], ['tubos', 'en unos tubos']],
  }),
  evapora: ({ t, d }) => ({
    keys: TOP(d),
    three: <><Kitchen /><Fridge t={t} on={ON('evap')} xr={0.85} flow={1} /><Thermo pos={[0.65, 0.2, 0.4]} v={lerp(20, 3, tw(t, d * 0.3, d * 0.8))} /></>,
    caps: [['hierve', 'hierve'], ['roba', 'le roba el calor', G], ['evaporador', 'el evaporador', G]],
  }),
  seacaba: ({ t, d }) => ({
    keys: TOP(d),
    three: <><Kitchen /><Fridge t={t} on={ON('evap')} xr={0.85} flow={1 - tw(t, d * 0.3, d * 0.6)} />
      {Array.from({ length: 10 }).map((_, k) => { const u = ((t * 0.5 + k / 10) % 1); return <mesh key={k} position={[0.3 + u * 0.8, 1.5 + u * 0.6, -0.3]} scale={0.03 * (1 - u)}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color={K.cold2} transparent opacity={0.7} /></mesh>; })}
      <Thermo pos={[0.65, 0.2, 0.4]} v={lerp(3, 20, tw(t, d * 0.5, d))} /></>,
    caps: [['gasta', 'se gasta', R], ['escapa', 'se escapa', R], ['rellenarla', 'rellenarla cada día', R]],
  }),
  cerrado: ({ t, d }) => ({
    keys: BACK(d),
    three: <><Kitchen /><Fridge t={t} rotY={lerp(0, BK, tw(t, 0.3, d * 0.4))} on={ON('evap', { comp: 0 })} xr={0.85} flow={0.8} />
      <Part geo={<torusGeometry args={[0.25, 0.02, 8, 32]} />} color={K.teal} pos={[0, 1.0, 0.5]} rot={[0, 0, t]} t={0.005} /></>,
    caps: [['cierras', 'cierras el circuito'], ['vueltas', 'da vueltas'], ['líquido', 'otra vez líquido']],
  }),
  aprieta: ({ t, d }) => ({
    keys: [[0, 0.9, 0.9, 2.2, 0, 0.6, 0.3], [d * 0.5, 0.2, 0.8, 1.8, 0, 0.6, 0.3], [d, -0.8, 1.0, 2.0, 0, 0.6, 0.3]],
    three: <><Kitchen /><Piston t={t} squeeze={(Math.sin(t * 1.5) + 1) / 2 * tw(t, 0.4, 1.4)} hot={0} /></>,
    caps: [['apretarlo', 'hay que apretarlo'], ['fuerte', 'muy fuerte'], ['globo', 'como un globo']],
  }),
  compresor: ({ t, d }) => ({
    keys: LOWBACK(d),
    three: <><Kitchen /><Fridge t={t} rotY={BK} on={ON('comp')} xr={0.6} flow={1} comp={tw(t, d * 0.3, d * 0.4)} /></>,
    caps: [['motor', 'un motor'], ['bola', 'la bola negra'], ['compresor', 'el compresor', G]],
  }),
  caliente: ({ t, d }) => ({
    keys: [[0, 0.9, 0.9, 2.2, 0, 0.6, 0.3], [d * 0.5, -0.2, 0.8, 1.8, 0, 0.6, 0.3], [d, 0.8, 1.0, 2.0, 0, 0.6, 0.3]],
    three: <><Kitchen /><Piston t={t} squeeze={0.4 + 0.5 * (Math.sin(t * 2.5) + 1) / 2} hot={tw(t, 0.4, d * 0.5)} /><Thermo pos={[0.55, 0.15, 0.4]} v={lerp(20, 70, tw(t, 0.4, d * 0.6))} min={0} max={80} /></>,
    caps: [['calienta', 'se calienta', R], ['muchísimo', 'muchísimo', R], ['llanta', 'como la bomba de una llanta']],
  }),
  rejilla: ({ t, d }) => ({
    keys: BACK(d),
    three: <><Kitchen /><Fridge t={t} rotY={BK} on={ON('cond')} xr={0.6} flow={1} comp={1} heat={tw(t, d * 0.3, d * 0.5)} /></>,
    caps: [['zigzag', 'un tubo en zigzag'], ['suelta', 'suelta el calor'], ['condensador', 'el condensador', G]],
  }),
  espalda: ({ t, d }) => ({
    keys: [[0, -0.8, 1.1, 3.0, -0.3, 0.9, 0], [d, 0.6, 1.0, 2.6, -0.3, 0.9, 0]],
    three: <><Kitchen /><Fridge t={t} rotY={BK} on={ON('cond')} xr={0.2} flow={1} comp={1} heat={1} />
      <Human pos={[-1.15, 0, -0.3]} rotY={0.9} s={0.95} t={t} wave={tw(t, d * 0.3, d * 0.5)} /></>,
    caps: [['tocas', 'si la tocas'], ['tibia', 'está tibia', R], ['comida', 'el calor de tu comida']],
  }),
  presion: ({ t, d }) => ({
    keys: BACK(d),
    three: <><Kitchen /><Fridge t={t} rotY={BK} on={ON('cond')} xr={0.6} flow={1} comp={1} heat={0.6} /></>,
    caps: [['apretado', 'sale apretado'], ['tibio', 'y tibio', R], ['hierve', 'no hierve', R]],
  }),
  capilar: ({ t, d }) => ({
    keys: [[0, 0.6, 1.7, 1.4, 0.2, 1.5, -0.3], [d * 0.5, -0.2, 1.55, 1.2, 0.2, 1.5, -0.3], [d, 0.5, 1.6, 1.3, 0.1, 1.5, -0.3]],
    three: <><Kitchen /><Fridge t={t} rotY={BK} on={ON('capil')} xr={0.6} flow={1} comp={1} /></>,
    caps: [['finito', 'un tubo finito'], ['cabello', 'como un cabello'], ['capilar', 'el tubo capilar', G]],
  }),
  vuelta: ({ t, d }) => ({
    keys: [[0, 1.8, 1.2, 2.8, 0, 0.9, 0], [d * 0.35, 0, 1.6, 2.4, 0, 0.9, 0], [d * 0.7, -1.8, 1.0, 2.6, 0, 0.9, 0], [d, -0.6, 1.4, 3.0, 0, 0.9, 0]],
    three: <><Kitchen /><Fridge t={t} rotY={t * 0.5} on={ON('capil')} xr={0.85} flow={1.3} comp={1} heat={0.8} /></>,
    caps: [['vuelta', 'da la vuelta'], ['aprieta', 'lo aprieta'], ['empezar', 'y vuelve a empezar', G]],
  }),
  congela: ({ t, d }) => ({
    keys: INSIDE(d),
    three: <><Kitchen /><Fridge t={t} on={ON('capil')} xr={0.85} flow={1} comp={1} foodP={{ frozen: t > d * 0.6 ? 1 : 0, wilt: t > d * 0.5 ? 1 : 0 }} /><Thermo pos={[0.65, 0.2, 0.4]} v={lerp(4, -15, tw(t, d * 0.2, d * 0.8))} /></>,
    caps: [['apaga', 'nunca se apaga'], ['congela', 'se congela', R], ['hielo', 'la leche, hielo', R]],
  }),
  termostato: ({ t, d }) => ({
    keys: [[0, 0.7, 1.35, 1.2, 0.27, 1.2, 0.1], [d * 0.5, 0.2, 1.25, 0.9, 0.27, 1.2, 0.1], [d, 0.6, 1.3, 1.1, 0.25, 1.15, 0.1]],
    three: <><Kitchen /><Fridge t={t} on={ON('thermo')} xr={0.85} flow={Math.sin(t * 0.8) > 0 ? 1 : 0.2} comp={Math.sin(t * 0.8) > 0 ? 1 : 0} knob={tw(t, 0.4, d * 0.4) * 0.5} /><Thermo pos={[0.55, 0.85, 0.45]} v={4 + Math.sin(t * 0.8) * -1.5} min={-10} max={20} /></>,
    caps: [['perilla', 'una perilla'], ['apaga', 'apaga el compresor'], ['termostato', 'el termostato', G]],
  }),
  zumbido: ({ t, d }) => ({
    keys: [[0, 1.4, 0.8, 2.8, 0, 0.6, 0], [d, -1.2, 0.9, 2.6, 0, 0.6, 0]],
    three: <><Kitchen /><Fridge t={t} rotY={BK} on={ON('thermo')} xr={0.2} flow={1} comp={t % 4 < 2.2 ? 1 : 0} shake={t % 4 < 2.2 ? 1 : 0} /></>,
    ov: <Big txt={t % 4 < 2.2 ? 'zzzz' : ''} x={1400} y={650} op={1} col="#ffd23d" size={90} />,
    caps: [['zumba', 'a veces zumba'], ['callada', 'a veces callada'], ['fallando', 'no está fallando', G]],
  }),
  paredes: ({ t, d }) => ({
    keys: FRONT(d),
    three: <><Kitchen /><Fridge t={t} on={ON('thermo')} xr={0.85} flow={1} comp={1} />
      {Array.from({ length: 14 }).map((_, k) => { const u = ((t * 0.4 + k / 14) % 1); const sd = k % 2 ? 1 : -1; return <mesh key={k} position={[sd * (1.0 - u * 0.62), 0.3 + (k * 0.11) % 1.3, 0]} scale={0.035}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color={K.warm} transparent opacity={0.8 * (1 - u * 0.5)} /></mesh>; })}</>,
    caps: [['lámina', 'paredes de lámina'], ['calor', 'entra el calor', R], ['luz', 'gastas mucha luz', R]],
  }),
  espuma: ({ t, d }) => ({
    keys: [[0, 1.2, 1.3, 2.4, 0, 0.9, 0], [d * 0.5, 0.2, 1.1, 1.9, -0.3, 0.9, 0], [d, -0.9, 1.3, 2.2, -0.2, 0.9, 0]],
    three: <><Kitchen /><Fridge t={t} on={ON('thermo', { foam: tw(t, 0.4, d * 0.5) })} xr={0.85} flow={1} comp={1} /></>,
    caps: [['espuma', 'una espuma'], ['burbujitas', 'burbujitas de aire'], ['aislante', 'el aislante', G]],
  }),
  puerta: ({ t, d }) => ({
    keys: [[0, 1.2, 1.0, 1.4, 0.3, 1.0, 0.3], [d, 0.6, 0.8, 1.2, 0.3, 0.9, 0.3]],
    three: <><Kitchen /><Fridge t={t} on={ON('thermo')} xr={0} open={0.03 + 0.02 * Math.sin(t * 2)} />
      {Array.from({ length: 8 }).map((_, k) => { const u = ((t * 0.6 + k / 8) % 1); return <mesh key={k} position={[0.39 - u * 0.2, 0.3 + k * 0.17, 0.5 - u * 0.4]} scale={0.03}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color={K.warm} /></mesh>; })}</>,
    caps: [['rendija', 'queda una rendija'], ['caliente', 'entra aire caliente', R]],
  }),
  iman: ({ t, d }) => ({
    keys: [[0, 1.4, 1.0, 1.8, 0, 0.9, 0.3], [d * 0.5, 0.7, 0.8, 1.4, 0.2, 0.9, 0.3], [d, 1.2, 1.1, 1.6, 0.2, 0.9, 0.3]],
    three: <><Kitchen /><Fridge t={t} on={ON('gasket')} xr={0} open={t < d * 0.5 ? lerp(0.45, 0.25, tw(t, 0.3, d * 0.45)) : lerp(0.25, 0, tw(t, d * 0.5, d * 0.6))} /></>,
    caps: [['goma', 'un borde de goma'], ['imán', 'con un imán'], ['empaque', 'el empaque', G]],
  }),
  dificil: ({ t, d }) => ({
    keys: [[0, 1.4, 1.1, 2.9, 0.2, 1.0, 0], [d, -0.4, 1.2, 2.7, 0.2, 1.0, 0]],
    three: <><Kitchen /><Fridge t={t} on={ON('gasket')} xr={0} open={0.015 * Math.max(0, Math.sin(t * 6))} shake={0.4} /><Human pos={[0.75, 0, 0.35]} rotY={-1.2} s={0.95} t={t} /></>,
    caps: [['cuesta', 'cuesta abrirla'], ['encoge', 'el aire se encoge'], ['pegado', 'queda pegado']],
  }),
  oscuro: ({ t, d }) => ({
    keys: INSIDE(d),
    three: <><Kitchen /><Fridge t={t} on={ON('gasket')} xr={0} open={tw(t, 0.3, 1.2) * 0.75} />
      <mesh position={[0, 0.9, 0.05]}><boxGeometry args={[FR.W - 0.08, FR.H - 0.1, FR.D - 0.1]} /><meshBasicMaterial color="#1b1f26" transparent opacity={0.85} /></mesh></>,
    caps: [['oscura', 'oscura por dentro', R], ['encuentras', 'no encuentras nada', R]],
  }),
  luz: ({ t, d }) => ({
    keys: [[0, 0.8, 1.15, 1.6, 0.2, 1.05, 0.2], [d * 0.5, 0.3, 1.1, 1.3, 0.3, 1.0, 0.3], [d, 0.9, 1.2, 1.5, 0.2, 1.05, 0.2]],
    three: <><Kitchen /><Fridge t={t} on={ON('light')} xr={0} open={t < d * 0.6 ? 0.7 : lerp(0.7, 0.05, tw(t, d * 0.6, d * 0.8))} lit={t > d * 0.2 && t < d * 0.78 ? 1 : 0} /></>,
    caps: [['foco', 'un foco'], ['botoncito', 'un botoncito'], ['prende', 'se prende', G]],
  }),
  frio_baja: ({ t, d }) => ({
    keys: FRONT(d, -1),
    three: <><Kitchen /><Fridge t={t} on={ON('light')} xr={0.85} flow={1} comp={1} />
      <Thermo pos={[0.6, 1.35, 0.4]} v={8} min={-20} max={20} s={0.7} /><Thermo pos={[0.6, 0.2, 0.4]} v={2} min={-20} max={20} s={0.7} /></>,
    caps: [['pesa', 'el frío pesa más'], ['fondo', 'se va al fondo'], ['tibio', 'arriba, más tibio']],
  }),
  congelador: ({ t, d }) => ({
    keys: TOP(d),
    three: <><Kitchen /><Fridge t={t} on={ON('freezer')} xr={0.85} flow={1} comp={1} /><Thermo pos={[0.6, 1.3, 0.4]} v={-18} min={-25} max={15} s={0.7} /></>,
    caps: [['congelador', 'el congelador'], ['arriba', 'va arriba'], ['cae', 'el aire helado cae', G]],
  }),
  escarcha: ({ t, d }) => ({
    keys: TOP(d),
    three: <><Kitchen /><Fridge t={t} on={ON('freezer')} xr={0.85} flow={1} comp={1} frost={tw(t, 0.4, d * 0.8)} /><Thermo pos={[0.6, 1.3, 0.4]} v={lerp(-18, -8, tw(t, d * 0.4, d))} min={-25} max={15} s={0.7} /></>,
    caps: [['humedad', 'la humedad'], ['escarcha', 'escarcha', R], ['cobija', 'una cobija de hielo', R]],
  }),
  ventilador: ({ t, d }) => ({
    keys: TOP(d),
    three: <><Kitchen /><Fridge t={t} on={ON('fan')} xr={0.85} flow={1} comp={1} frost={1 - tw(t, d * 0.5, d * 0.85)} /></>,
    caps: [['ventilador', 'un ventilador'], ['resistencia', 'una resistencia'], ['frost', 'no frost', G]],
  }),
  charco: ({ t, d }) => ({
    keys: LOWBACK(d),
    three: <><Kitchen /><Fridge t={t} rotY={BK} on={ON('tray')} xr={0.6} flow={1} comp={1} />
      {Array.from({ length: 6 }).map((_, k) => { const u = ((t * 0.5 + k / 6) % 1); return <mesh key={k} position={[0.17 + Math.sin(k) * 0.05, 0.34 + u * 0.4, 0.5]} scale={0.02 * (1 - u)}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.7} /></mesh>; })}</>,
    caps: [['tubito', 'por un tubito'], ['bandeja', 'a una bandeja'], ['evapora', 'se evapora sola', G]],
  }),
  cajon: ({ t, d }) => ({
    keys: [[0, 0.7, 0.6, 1.6, 0, 0.25, 0], [d * 0.5, 0, 0.5, 1.3, 0, 0.25, 0], [d, -0.6, 0.65, 1.5, 0, 0.25, 0]],
    three: <><Kitchen /><Fridge t={t} on={ON(t > d * 0.5 ? 'drawer' : 'tray')} xr={0.85} flow={1} comp={1} foodP={{ wilt: t < d * 0.5 ? tw(t, 0.4, d * 0.35) : 0 }} /></>,
    caps: [['seco', 'muy seco', R], ['arrugan', 'se arrugan', R], ['cajón', 'el cajón de verduras', G]],
  }),
  puerta_tibia: ({ t, d }) => ({
    keys: [[0, 1.6, 1.2, 1.8, -0.2, 0.8, 0.4], [d * 0.5, 0.8, 1.0, 1.5, -0.2, 0.8, 0.4], [d, 1.4, 1.3, 1.7, -0.2, 0.8, 0.4]],
    three: <><Kitchen /><Fridge t={t} on={ON('drawer')} xr={0} open={0.75} lit={1} /><Thermo pos={[-0.55, 0.4, 0.9]} v={7} min={-10} max={20} s={0.7} /><Thermo pos={[0.1, 0.25, 0.1]} v={2} min={-10} max={20} s={0.6} /></>,
    caps: [['tibia', 'la parte más tibia', R], ['salsas', 'salsas y bebidas'], ['fondo', 'la leche, al fondo', G]],
  }),
  olla: ({ t, d }) => ({
    keys: [[0, 1.4, 1.2, 2.6, 0.4, 0.8, 0.4], [d, -0.6, 1.3, 2.4, 0.4, 0.8, 0.4]],
    three: <><Kitchen /><Fridge t={t} on={ON('drawer')} xr={0.6} flow={1} comp={1} />
      <group position={[1.05, 0.75, 0.6]}>
        <mesh position={[0, -0.38, 0]}><boxGeometry args={[0.6, 0.76, 0.5]} /><meshToonMaterial color="#c9a26b" /></mesh>
        <mesh castShadow><cylinderGeometry args={[0.16, 0.14, 0.18, 20]} /><meshToonMaterial color={K.metal} /></mesh>
        {Array.from({ length: 6 }).map((_, k) => { const u = ((t * 0.5 + k / 6) % 1); return <mesh key={k} position={[Math.sin(t + k) * 0.05, 0.12 + u * 0.5, 0]} scale={(0.03 + u * 0.05) * (1 - tw(t, d * 0.6, d * 0.9))}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.6 * (1 - u)} /></mesh>; })}
      </group></>,
    caps: [['hirviendo', 'una olla hirviendo', R], ['vapor', 'que suelte el vapor'], ['tapada', 'luego, tapada', G]],
  }),
  ozono: ({ t, d }) => ({
    keys: [[0, 0, 1.5, 4.0, 0, 1.6, 0], [d, 0.8, 1.8, 3.6, 0, 1.8, 0]],
    three: <><Kitchen /><Fridge t={t} on={ON('drawer')} xr={0.85} flow={1} comp={1} />
      <mesh position={[0, 3.2, -0.8]} scale={[1, 0.3, 0.3]}><sphereGeometry args={[1.4, 24, 12]} /><meshBasicMaterial color="#9fd8f0" transparent opacity={0.35 + 0.2 * Math.sin(t)} /></mesh></>,
    caps: [['antiguas', 'el gas de antes'], ['ozono', 'dañaba el ozono', R], ['otros', 'ahora, otros gases', G]],
  }),
  pared: ({ t, d }) => ({
    keys: [[0, 2.0, 1.4, 2.4, 0, 0.8, -0.4], [d, 1.4, 1.1, 2.0, 0, 0.8, -0.5]],
    three: <><Kitchen /><Fridge pos={[0, 0, lerp(0, -0.55, tw(t, 0.3, d * 0.35))]} t={t} on={ON('drawer', { wallBlock: 1 })} xr={0.5} flow={1} comp={1} heat={1.4} shake={0.6} /></>,
    caps: [['pared', 'contra la pared'], ['soltar', 'no puede soltar el calor', R], ['doble', 'trabaja el doble', R]],
  }),
  espacio: ({ t, d }) => ({
    keys: [[0, 2.0, 1.4, 2.4, 0, 0.8, -0.3], [d, 2.4, 1.6, 2.8, 0, 0.8, -0.2]],
    three: <><Kitchen /><Fridge pos={[0, 0, lerp(-0.55, -0.4, tw(t, 0.3, d * 0.4))]} t={t} on={ON('drawer')} xr={0.5} flow={1} comp={1} heat={1} /></>,
    ov: <Tag txt="10 cm" x={1100} y={650} op={fo(t, d * 0.4)} col={G} size={50} />,
    caps: [['espacio', 'déjale espacio', G], ['aire', 'que pase el aire', G]],
  }),
  abrir: ({ t, d }) => ({
    keys: [[0, 1.8, 1.1, 3.4, 0.2, 0.8, 0.3], [d, -0.8, 1.2, 3.2, 0.2, 0.8, 0.3]],
    three: <><Kitchen /><Fridge t={t} on={ON('drawer')} xr={0} open={t < d * 0.75 ? 0.8 : lerp(0.8, 0, tw(t, d * 0.75, d * 0.85))} lit={t < d * 0.83 ? 1 : 0} />
      {t < d * 0.75 ? Array.from({ length: 10 }).map((_, k) => { const u = ((t * 0.6 + k / 10) % 1); return <mesh key={k} position={[-0.2 + (k % 5) * 0.1, 0.5 - u * 0.48, 0.4 + u * 0.6]} scale={0.03 * (1 - u * 0.5)}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color={K.cold2} transparent opacity={0.7} /></mesh>; }) : null}
      <Human pos={[0.85, 0, 0.9]} rotY={-2.4} s={0.95} t={t} /></>,
    caps: [['abierta', 'puerta abierta', R], ['piso', 'el frío se cae al piso', R], ['rápido', 'ciérrala rápido', G]],
  }),
  repaso: ({ t, d }) => {
    const L = ['caja', 'líquido', 'compresor', 'rejilla', 'tubito', 'termostato', 'espuma', 'imán', 'foco'];
    const k = Math.min(8, Math.floor(t / d * 9.6));
    const lv = ['caja', 'evap', 'comp', 'cond', 'capil', 'thermo', 'foam', 'gasket', 'light'][k];
    return {
      keys: [[0, 1.8, 1.2, 3.2, 0, 0.9, 0], [d * 0.5, 0, 1.5, 2.8, 0, 0.9, 0], [d, -1.8, 1.1, 3.0, 0, 0.9, 0]],
      three: <><Kitchen /><Fridge t={t} rotY={Math.sin(t * 0.4) * 0.6} on={ON(lv, { foam: k >= 6 ? 1 : 0 })} xr={0.85} flow={k >= 1 ? 1 : 0} comp={k >= 2 ? 1 : 0} heat={k >= 3 ? 0.7 : 0} lit={k >= 8 ? 1 : 0} /></>,
      ov: <>{L.map((s, j) => <Tag key={j} txt={s} x={j < 5 ? 260 : 1660} y={250 + (j % 5) * 130} op={j <= k ? 1 : 0} col={j === k ? R : INK} size={40} />)}</>,
      caps: [],
    };
  },
  cierre: ({ t, d }) => ({
    keys: [[0, 1.6, 1.0, 3.0, 0, 0.9, 0], [d, -1.4, 1.2, 2.8, 0, 0.9, 0]],
    three: <><Kitchen /><Fridge t={t} rotY={lerp(0, BK, tw(t, d * 0.4, d * 0.8))} on={ON('drawer')} xr={0.6} flow={1} comp={1} heat={1} /></>,
    caps: [['fabrica', 'no fabrica frío'], ['saca', 'le saca el calor', G], ['espalda', 'y lo tira atrás']],
  }),
  pregunta: ({ t, d }) => ({
    keys: [[0, 1.2, 1.1, 3.2, 0, 1.0, 0], [d, -0.8, 1.2, 3.0, 0, 1.0, 0]],
    three: <><Kitchen /><Fridge t={t} on={ON('drawer')} xr={0} open={0.3 + 0.1 * Math.sin(t * 2)} lit={1} /><Human pos={[-1.1, 0, 0.1]} rotY={0.8} s={0.95} t={t} wave={1} /></>,
    ov: <><Big txt="¿QUÉ ARMAMOS?" y={300} op={fo(t, 0.6)} col="#ffd23d" size={110} /></>,
    caps: [['síguenos', 'síguenos'], ['comentarios', 'déjalo en comentarios']],
  }),
};
