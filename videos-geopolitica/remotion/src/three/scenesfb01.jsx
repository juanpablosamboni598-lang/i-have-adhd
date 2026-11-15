import React from 'react';
import { tw, lerp, drop, INK } from './kit.jsx';
import { Tag, Big } from './scenes20.jsx';
import { Shop, Padlock } from './fb01.jsx';

const R = '#e2483d', G = '#2bb36b';
const fo = (t, a, b) => tw(t, a, a + 0.4) * (b === undefined ? 1 : 1 - tw(t, b - 0.4, b));
const FULL = (d) => [[0, 0.9, 0.75, 1.7, 0, 0.45, 0], [d * 0.4, 0.2, 0.6, 1.45, 0, 0.45, 0], [d * 0.75, -0.6, 0.7, 1.55, 0, 0.45, 0], [d, -0.9, 0.85, 1.7, 0, 0.45, 0]];
const TOPV = (d) => [[0, 0.7, 1.0, 1.5, 0, 0.6, 0], [d * 0.5, -0.4, 0.9, 1.35, -0.05, 0.6, 0], [d, 0.4, 1.05, 1.45, 0, 0.6, 0]];
const SECT = (d) => [[0, 1.1, 0.45, 0.45, 0, 0.38, 0], [d * 0.4, 0.95, 0.4, 0.15, 0, 0.38, 0], [d * 0.75, 1.0, 0.5, -0.1, 0, 0.38, 0], [d, 1.15, 0.42, 0.3, 0, 0.38, 0]];
const FRONTK = (d) => [[0, 0.5, 0.4, 1.3, 0, 0.32, 0.2], [d * 0.5, -0.4, 0.35, 1.1, 0, 0.32, 0.2], [d, 0.3, 0.45, 1.25, 0, 0.32, 0.2]];
const L = (o) => ({ latch: 1, plug: 1, pins: 2, ...o });

export const SFB01 = {
  abre: ({ t, d }) => ({
    keys: FULL(d),
    three: <><Shop /><group position={[0, (1 - drop(t, 0.1, 0.6)) * 1.2, 0]}><Padlock t={t} {...L({})} xr={tw(t, d * 0.35, d * 0.5) * 0.85} key="ok" keyIn={tw(t, d * 0.55, d * 0.75)} rot={tw(t, d * 0.8, d * 0.9) * 0.9} up={tw(t, d * 0.88, d * 0.95)} /></group></>,
    caps: [['candado', 'un candado'], ['llave', 'solo con su llave'], ['pernitos', 'unos pernitos cortados', R], ['cero', 'desde cero']],
  }),
  gancho: ({ t, d }) => ({
    keys: TOPV(d),
    three: <><Shop /><Padlock t={t} xr={0.3} up={t < d * 0.55 ? (1 - drop(t, 0.2, 0.5)) * 3 : tw(t, d * 0.65, d * 0.75)} /></>,
    caps: [['gancho', 'un gancho de metal'], ['candado', 'ya tienes un candado'], ['jala', 'cualquiera lo jala', R]],
  }),
  pestillo: ({ t, d }) => ({
    keys: [[0, 0.2, 0.75, 0.9, -0.08, 0.6, 0], [d * 0.5, -0.5, 0.7, 0.75, -0.08, 0.6, 0], [d, -0.8, 0.65, 0.6, -0.12, 0.6, 0]],
    three: <><Shop /><Padlock t={t} xr={0.82} latch={tw(t, 0.3, 1.0) * (1 - tw(t, d * 0.65, d * 0.8))} nail={tw(t, d * 0.55, d * 0.75)} up={tw(t, d * 0.82, d * 0.92)} /></>,
    caps: [['pestillo', 'un pestillo'], ['traba', 'lo traba', G], ['clavo', 'lo empuja con un clavo', R]],
  }),
  cilindro: ({ t, d }) => ({
    keys: FRONTK(d),
    three: <><Shop /><Padlock t={t} xr={0.82} latch={1 - tw(t, d * 0.75, d * 0.85)} plug={1} key="driver" keyIn={tw(t, d * 0.5, d * 0.65)} rot={tw(t, d * 0.7, d * 0.85) * 1.2} up={tw(t, d * 0.85, d * 0.95)} /></>,
    caps: [['cilindro', 'un cilindro'], ['gira', 'gira con cualquier cosa', R], ['destornillador', 'con un destornillador', R]],
  }),
  pines: ({ t, d }) => ({
    keys: SECT(d),
    three: <><Shop /><Padlock t={t} xr={0.85} latch={1} plug={1} pins={1} rot={Math.sin(t * 4) * 0.03} /></>,
    caps: [['pernitos', 'unos pernitos'], ['resortes', 'empujados por resortes'], ['girar', 'ya no puede girar', G], ['pines', 'los pines', G]],
  }),
  nadie: ({ t, d }) => ({
    keys: [[0, 0.7, 0.6, 1.2, 0, 0.45, 0], [d, -0.5, 0.65, 1.15, 0, 0.45, 0]],
    three: <><Shop /><Padlock t={t} xr={0.6} latch={1} plug={1} pins={1} shake={tw(t, 0.3, 0.6) * (1 - tw(t, d * 0.8, d))} /></>,
    caps: [['nadie', 'no lo abre nadie', R], ['tú', 'ni siquiera tú', R]],
  }),
  corte: ({ t, d }) => ({
    keys: SECT(d),
    three: <><Shop /><Padlock t={t} xr={0.85} latch={1} plug={1} pins={t < d * 0.3 ? 1 : 2} /></>,
    caps: [['dos', 'cada pin en dos'], ['distintas', 'alturas distintas'], ['borde', 'justo en el borde'], ['corte', 'la línea de corte', G]],
  }),
  llave: ({ t, d }) => ({
    keys: SECT(d),
    three: <><Shop /><Padlock t={t} xr={0.85} latch={1 - tw(t, d * 0.82, d * 0.9)} plug={1} pins={2} key="ok" keyIn={tw(t, d * 0.2, d * 0.65)} rot={tw(t, d * 0.75, d * 0.88) * 1.2} /></>,
    caps: [['picos', 'una lámina con picos'], ['sube', 'cada pico sube su pin', G], ['forma', 'su propia forma']],
  }),
  otra: ({ t, d }) => ({
    keys: SECT(d),
    three: <><Shop /><Padlock t={t} xr={0.85} latch={1} plug={1} pins={2} key="bad" keyIn={tw(t, 0.2, d * 0.5)} rot={t > d * 0.6 ? Math.sin(t * 14) * 0.02 : 0} /></>,
    caps: [['otra', 'otra llave'], ['alto', 'muy alto o muy bajo', R], ['mueve', 'no se mueve', R]],
  }),
  combina: ({ t, d }) => {
    const n = Math.round(lerp(1, 7776, tw(t, 0.3, d * 0.7)));
    return {
      keys: [[0, 0.6, 0.55, 1.1, 0, 0.4, 0], [d, -0.6, 0.6, 1.1, 0, 0.4, 0]],
      three: <><Shop /><Padlock t={t} xr={0.5} latch={1} plug={1} pins={2} />
        {Array.from({ length: 6 }).map((_, k) => <group key={k} position={[-0.6 + (k % 3) * 0.6, 0.02, 0.45 + Math.floor(k / 3) * 0.2]} scale={drop(t, 0.3 + k * 0.2, 0.4) * 0.6} rotation={[-Math.PI / 2, 0, k]}>
          <mesh><boxGeometry args={[0.35, 0.08, 0.015]} /><meshToonMaterial color={['#b8c2c9', '#c7a24a', '#b8c2c9', '#c7a24a', '#b8c2c9', '#c7a24a'][k]} /></mesh></group>)}</>,
      ov: <Big txt={n.toLocaleString('es-CO')} x={540} y={1450} op={fo(t, 0.3)} col="#ffd23d" size={150} />,
      caps: [['cinco', 'cinco pines'], ['seis', 'seis alturas'], ['miles', 'miles de llaves', G], ['vecino', 'no abre la del vecino']],
    };
  },
  arco: ({ t, d }) => ({
    keys: [[0, 0.8, 0.95, 1.4, 0.1, 0.65, 0], [d * 0.5, 0.2, 0.9, 1.25, 0.1, 0.65, 0], [d, 0.7, 1.0, 1.35, 0.1, 0.65, 0]],
    three: <><Shop /><Padlock t={t} xr={0} latch={1} plug={1} pins={2} saw={tw(t, 0.2, 0.5)} hard={t > d * 0.5 ? 1 : 0} cutDone={t < d * 0.5 ? tw(t, 0.5, d * 0.45) : 0.15} /></>,
    caps: [['sierra', 'lo corta con una sierra', R], ['endurecido', 'acero endurecido'], ['muerde', 'casi no muerde', G], ['arco', 'el arco', G]],
  }),
  cierre: ({ t, d }) => ({
    keys: [[0, 0.9, 0.7, 1.6, 0, 0.45, 0], [d, -0.9, 0.8, 1.6, 0, 0.45, 0]],
    three: <><Shop /><Padlock t={t} xr={0.85 * (1 - tw(t, d * 0.6, d * 0.85))} latch={1} plug={1} pins={2} key="ok" keyIn={1} rot={Math.sin(t * 1.5) * 0.5 + 0.5} up={Math.sin(t * 1.5) * 0.5 + 0.5} /></>,
    ov: <Big txt="SÍGUENOS" x={540} y={1500} op={fo(t, d * 0.65)} col="#ffd23d" size={120} />,
    caps: [['gancho', 'gancho, pestillo, cilindro'], ['pines', 'pines cortados'], ['funciona', 'así funciona', G]],
  }),
};
