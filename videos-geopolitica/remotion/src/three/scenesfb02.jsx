import React from 'react';
import { tw, cl, lerp } from './kit.jsx';
import { Bath, Shower, Gauge, POS } from './fb02.jsx';

const R = '#e2483d', G = '#2bb36b';
const { BY, BZ } = POS;
// poses de cámara [x, y, z, tx, ty, tz]; cada escena va de una pose a la siguiente (una sola toma continua, sin cortes)
const P = {
  far: [0.75, 1.7, 1.55, 0, 1.6, -0.1], far2: [0.4, 1.72, 1.25, 0, 1.62, -0.1],
  inner: [0.32, 1.8, 0.52, 0, 1.74, BZ], inner2: [-0.28, 1.78, 0.5, 0, 1.74, BZ],
  top: [0.2, 1.98, 0.42, 0, 1.86, BZ], mid: [0.5, 1.75, 1.05, 0, 1.62, -0.1],
  head: [0.42, 1.5, 0.85, 0, 1.45, -0.1], knob: [0.18, 1.86, 0.42, 0.06, 1.8, BZ],
  wall: [0.25, 1.85, 1.35, 0.02, 1.8, -0.2], wall2: [-0.35, 1.85, 1.2, -0.1, 1.8, -0.2],
  panel: [0.55, 2.15, 0.65, 0.35, 2.05, -0.22], end: [0.7, 1.75, 1.7, 0.08, 1.7, -0.1],
};
// camino: de pose a pose con un punto intermedio suave
const go = (a, b, d) => [[0, ...P[a]], [d * 0.5, ...P[a].map((v, k) => lerp(v, P[b][k], 0.55))], [d, ...P[b]]];
// número del medidor (HTML, abajo a la derecha)
const Temp = ({ v, show = 1 }) => show ? <div style={{ position: 'absolute', right: 70, bottom: 260, fontFamily: 'Inter Display, Inter, sans-serif', fontWeight: 900, fontSize: 64,
  color: v > 0.7 ? R : v > 0.35 ? '#e08a1f' : '#3d7ee0', textShadow: '0 4px 0 rgba(255,255,255,0.8)' }}>{Math.round(lerp(14, 52, cl(v)))} °C</div> : null;

export const SFB02 = {
  abre: ({ t, d }) => ({
    keys: go('far', 'far2', d),
    three: <><Bath tap={tw(t, 0.3, 1.0)} /><Shower t={t} flow={tw(t, 0.6, 1.4)} /><Gauge v={0.0} /></>,
    ov: <Temp v={0} />,
    caps: [['tubo', 'un tubo de agua fría'], ['regadera', 'una regadera'], ['ducha', 'ya tienes una ducha'], ['helada', 'sale helada', R], ['duele', 'duele', R]],
  }),
  resistencia: ({ t, d }) => {
    const h = tw(t, d * 0.45, d * 0.75);
    return {
      keys: go('far2', 'inner', d),
      three: <><Bath tap={1} /><Shower t={t} xr={tw(t, 0.2, d * 0.3)} coil={tw(t, d * 0.25, d * 0.45)} heat={h} mode="all" flow={1} warm={h} steam={h} /><Gauge v={h * 0.75} /></>,
      ov: <Temp v={h * 0.75} />,
      caps: [['alambre', 'un alambre enrollado'], ['electricidad', 'se calienta'], ['pegada', 'el agua pasa pegada'], ['resistencia', 'la resistencia', G]],
    };
  },
  seca: ({ t, d }) => ({
    keys: go('inner', 'inner2', d),
    three: <><Bath tap={1 - tw(t, 0, 0.6)} /><Shower t={t} xr={0.85} coil={1} heat={1} mode="all" flow={1 - tw(t, 0, 0.6)} burn={tw(t, d * 0.55, d * 0.85)} /><Gauge v={0.75} /></>,
    ov: <Temp v={0.75} show={0} />,
    caps: [['agua', 'sin agua', R], ['enfríe', 'nada que lo enfríe', R], ['quema', 'se quema', R]],
  }),
  diafragma: ({ t, d }) => {
    const fl = tw(t, d * 0.25, d * 0.4), lift = tw(t, d * 0.35, d * 0.5), h = lift * tw(t, d * 0.5, d * 0.7);
    return {
      keys: go('inner2', 'top', d),
      three: <><Bath tap={fl} /><Shower t={t} xr={0.85} coil={1} heat={h} mode="all" flow={fl} warm={h} lift={lift} /><Gauge v={h * 0.75} /></>,
      ov: <Temp v={h * 0.75} show={0} />,
      caps: [['caucho', 'una tapita de caucho'], ['arriba', 'el agua la empuja'], ['contactos', 'junta dos contactos', G], ['clac', '¡clac!'], ['diafragma', 'el diafragma', G]],
    };
  },
  tibia: ({ t, d }) => ({
    keys: go('top', 'mid', d),
    three: <><Bath tap={1} /><Shower t={t} xr={0.85 - tw(t, d * 0.3, d) * 0.5} coil={1} heat={0.5} mode="all" flow={1} warm={0.3} lift={1} /><Gauge v={0.35} /></>,
    ov: <Temp v={0.35} />,
    caps: [['fría', 'en tierra fría'], ['tibia', 'apenas tibia', R]],
  }),
  poca: ({ t, d }) => {
    const c = tw(t, d * 0.1, d * 0.45), v = 0.35 + 0.4 * tw(t, d * 0.4, d * 0.85);
    return {
      keys: go('mid', 'head', d),
      three: <><Bath tap={1 - c * 0.5} /><Shower t={t} xr={0.35} coil={1} heat={0.8} mode="all" flow={1 - c * 0.55} warm={v} lift={1} steam={tw(t, d * 0.6, d)} /><Gauge v={v} /></>,
      ov: <Temp v={v} />,
      caps: [['llave', 'cierras un poco la llave'], ['menos', 'pasa menos agua'], ['calor', 'cada gota, más calor', G]],
    };
  },
  perilla: ({ t, d }) => {
    const toV = tw(t, d * 0.45, d * 0.55), toI = tw(t, d * 0.75, d * 0.85);
    const mode = toI > 0.5 ? 'inv' : toV > 0.5 ? 'ver' : 'all', knob = -0.6 * toI + 0.6 * toV * (1 - toI) * 1;
    const v = toI > 0.5 ? 0.75 : toV > 0.5 ? 0.45 : 0.95;
    return {
      keys: go('head', 'knob', d),
      three: <><Bath tap={0.5} /><Shower t={t} xr={tw(t, d * 0.2, d * 0.4) * 0.85} coil={1} heat={1} mode={mode} flow={0.5} warm={v} lift={1} knob={knob} steam={v > 0.8 ? 1 : 0} /><Gauge v={v} /></>,
      ov: <Temp v={v} />,
      caps: [['hirviendo', 'sale hirviendo', R], ['tramos', 'dos tramos'], ['perilla', 'una perilla'], ['invierno', 'más para el invierno', G], ['verano', 'menos para el verano', G]],
    };
  },
  tierra: ({ t, d }) => ({
    keys: go('knob', 'wall', d),
    three: <><Bath tap={1} /><Shower t={t} xr={0.85 * (1 - tw(t, 0, d * 0.4))} coil={1} heat={0.8} mode="inv" flow={1} warm={0.6} lift={1} leak={tw(t, d * 0.5, d * 0.55)} /><Gauge v={0.6} /></>,
    caps: [['electricidad', 'agua y electricidad', R], ['pela', 'si un cable se pela', R], ['corriente', 'queda con corriente', R]],
  }),
  polo: ({ t, d }) => {
    const g = tw(t, d * 0.15, d * 0.45);
    return {
      keys: go('wall', 'wall2', d),
      three: <><Bath tap={1} /><Shower t={t} coil={1} heat={0.8} mode="inv" flow={1} warm={0.6} lift={1} ground={g} leak={g < 0.95 ? 1 : 0} /><Gauge v={0.6} /></>,
      caps: [['verde', 'un cable verde'], ['tierra', 'directo a la tierra'], ['ti', 'y no por ti', G], ['polo', 'el polo a tierra', G]],
    };
  },
  breaker: ({ t, d }) => ({
    keys: go('wall2', 'panel', d),
    three: <><Bath tap={1} /><Shower t={t} coil={1} heat={0.8} mode="inv" flow={1} warm={0.6} lift={1} ground={1} panel={tw(t, d * 0.2, d * 0.45)} lever={t > d * 0.8 ? 1 : t > d * 0.6 ? 0 : 1} /><Gauge v={0.6} /></>,
    caps: [['bombillos', 'cuarenta bombillos'], ['breaker', 'su propio breaker', G]],
  }),
  cierre: ({ t, d }) => ({
    keys: go('panel', 'end', d),
    three: <><Bath tap={1} /><Shower t={t} xr={0.85 * tw(t, 0.2, d * 0.35)} coil={1} heat={0.8} mode="inv" flow={1} warm={0.7} lift={1} ground={1} panel={1} steam={1} /><Gauge v={0.7} /></>,
    ov: <Temp v={0.7} />,
    caps: [['alambre', 'un alambre que calienta'], ['tapita', 'una tapita que lo prende'], ['perilla', 'una perilla'], ['tierra', 'y un polo a tierra'], ['entiendes', 'así funciona', G]],
  }),
};
