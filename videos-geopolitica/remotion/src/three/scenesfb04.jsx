import React from 'react';
import { tw, cl, lerp } from './kit.jsx';
import { Stove, Pot, Thermo } from './fb04.jsx';

const R = '#e2483d', G = '#2bb36b';
const P = {
  wide: [0.6, 1.45, 1.6, 0.05, 1.15, 0], wide2: [-0.5, 1.42, 1.5, 0.05, 1.15, 0], mid: [0.4, 1.38, 1.1, 0.06, 1.14, 0],
  in: [0.22, 1.32, 0.85, 0.02, 1.12, 0], in2: [-0.28, 1.33, 0.82, 0.02, 1.12, 0], lid: [0.28, 1.5, 0.72, 0, 1.2, 0], lid2: [-0.32, 1.52, 0.7, 0, 1.2, 0],
  top: [0.1, 1.72, 0.58, 0, 1.22, 0], end: [0.55, 1.45, 1.7, 0.05, 1.15, 0],
};
const go = (a, b, d) => [[0, ...P[a]], [d * 0.5, ...P[a].map((v, k) => lerp(v, P[b][k], 0.55))], [d, ...P[b]]];
const Deg = ({ v }) => <div style={{ position: 'absolute', right: 70, top: 380, fontFamily: 'Inter Display, Inter, sans-serif', fontWeight: 900, fontSize: 70,
  color: v > 105 ? R : v > 95 ? '#e08a1f' : '#3d7ee0', textShadow: '0 4px 0 rgba(255,255,255,0.8)' }}>{Math.round(v)} °C</div>;
const Big = ({ txt, sub, op = 1 }) => <div style={{ position: 'absolute', top: 520, width: '100%', textAlign: 'center', opacity: op, fontFamily: 'Inter Display, Inter, sans-serif', fontWeight: 900 }}>
  <div style={{ fontSize: 170, color: '#141018', letterSpacing: -5, textShadow: '0 8px 0 rgba(255,255,255,0.8)' }}>{txt}</div>
  {sub ? <div style={{ fontSize: 58, color: '#141018' }}>{sub}</div> : null}
</div>;
const S = (p) => <Stove t={p.t} fire={p.fire ?? 1} />;

export const SFB04 = {
  gancho: ({ t, d }) => ({ keys: go('mid', 'wide', d), three: <>{S({ t })}<Pot t={t} lid={0} xr={0.85} boil={1} beans={1} /><Thermo v={91} /></>, ov: <><Deg v={91} /><Big txt="91 °C" sub="Bogotá · 2.600 m" op={tw(t, 0.2, 0.6) * (1 - tw(t, d * 0.7, d))} /></>,
    caps: [['Bogotá', 'en Bogotá'], ['noventa', 'hierve a 91 grados', R], ['eternidad', 'una eternidad', R], ['presión', 'la olla a presión', G]] }),
  abre: ({ t, d }) => { const v = Math.min(100, 20 + tw(t, 0.3, d * 0.5) * 80); return { keys: go('wide', 'in', d), three: <>{S({ t })}<Pot t={t} lid={0} xr={0.85} boil={v > 98 ? 1 : 0} /><Thermo v={v} /></>, ov: <Deg v={v} />,
    caps: [['olla', 'ya tienes una olla'], ['cien', 'no pasa de 100 grados', R], ['montaña', 'en la montaña, menos', R]] }; },
  aire: ({ t, d }) => ({ keys: go('in', 'in2', d), three: <>{S({ t })}<Pot t={t} lid={0} xr={0.85} boil={1} press={0.5} /><Thermo v={95} /></>, ov: <Deg v={95} />,
    caps: [['aire', 'el aire empuja el agua'], ['menos', 'menos aire encima'], ['frío', 'hierve más frío', R]] }),
  tapa: ({ t, d }) => { const v = 100 + tw(t, d * 0.4, d) * 15; return { keys: go('in2', 'in', d), three: <>{S({ t })}<Pot t={t} lid={tw(t, 0.3, 0.8) > 0.5 ? 1 : 0} xr={0.85} boil={t < d * 0.4 ? 1 : 0.3} press={tw(t, d * 0.4, d * 0.6)} gasket={0} weight={0} safety={0} /><Thermo v={v} /></>, ov: <Deg v={v} />,
    caps: [['duro', 'una tapa que cierre duro'], ['acumula', 'el vapor se acumula'], ['calentarse', 'tiene que calentarse más', G]] }; },
  grados: ({ t, d }) => { const v = 115 + tw(t, 0.2, d * 0.5) * 5; return { keys: go('in', 'mid', d), three: <>{S({ t })}<Pot t={t} xr={0.85} boil={0.6} press={1} beans={1} swell={tw(t, d * 0.5, d)} gasket={0} weight={0} safety={0} /><Thermo v={v} /></>, ov: <><Deg v={v} /><Big txt="120 °C" sub="con una atmósfera de más" op={tw(t, 0.4, 0.9)} /></>,
    caps: [['ciento', '120 grados', G], ['fríjoles', 'los fríjoles'], ['tiempo', 'en mucho menos tiempo', G]] }; },
  fuga: ({ t, d }) => ({ keys: go('mid', 'lid', d), three: <>{S({ t })}<Pot t={t} xr={0.3} gasket={0} weight={0} safety={0} leakEdge={tw(t, 0.3, 0.8)} /><Thermo v={100} /></>, ov: <Deg v={100} />,
    caps: [['perfecta', 'no queda perfecta'], ['silbando', 'se escapa silbando', R]] }),
  empaque: ({ t, d }) => ({ keys: go('lid', 'lid2', d), three: <>{S({ t })}<Pot t={t} lidUp={1 - tw(t, d * 0.4, d * 0.7)} xr={0.3} weight={0} safety={0} /></>,
    caps: [['caucho', 'un anillo de caucho'], ['sella', 'se aplasta y sella', G], ['empaque', 'el empaque', G]] }),
  revienta: ({ t, d }) => ({ keys: go('lid2', 'mid', d), three: <>{S({ t })}<Pot t={t} xr={0.85} boil={1} press={1} weight={0} safety={0} swell={tw(t, d * 0.3, d * 0.9) * (1 + Math.sin(t * 20) * 0.1)} /><Thermo v={125} /></>, ov: <Deg v={125} />,
    caps: [['salida', 'sin salida', R], ['sube', 'la presión sube y sube', R], ['reventar', 'puede reventar', R]] }),
  pito: ({ t, d }) => ({ keys: go('mid', 'top', d), three: <>{S({ t })}<Pot t={t} xr={0.3} safety={0} jiggle={tw(t, d * 0.35, d * 0.5)} /><Thermo v={120} /></>, ov: <Deg v={120} />,
    caps: [['pesita', 'un tubito y una pesita'], ['levanta', 'la presión la levanta'], ['chu', 'chu chu chu'], ['pito', 'la válvula reguladora', G]] }),
  tapado: ({ t, d }) => ({ keys: go('top', 'lid', d), three: <>{S({ t })}<Pot t={t} xr={0.3} safety={0} clog={tw(t, 0.3, 0.6) > 0.5 ? 1 : 0} jiggle={t < d * 0.4 ? 1 : 0} /><Thermo v={120} /></>, ov: <Deg v={120} />,
    caps: [['fríjol', 'un fríjol lo tapa', R], ['salir', 'no tiene por dónde salir', R]] }),
  seguridad: ({ t, d }) => ({ keys: go('lid', 'lid2', d), three: <>{S({ t })}<Pot t={t} xr={0.3} clog={1} popped={tw(t, d * 0.45, d * 0.55)} /><Thermo v={t < d * 0.5 ? 124 : 115} /></>, ov: <Deg v={t < d * 0.5 ? 124 : 115} />,
    caps: [['segunda', 'una segunda salida'], ['dispara', 'se dispara'], ['seguridad', 'la válvula de seguridad', G]] }),
  abrir: ({ t, d }) => ({ keys: go('lid2', 'mid', d), three: <>{S({ t })}<Pot t={t} xr={0.3} lidUp={tw(t, d * 0.45, d * 0.6)} blast={tw(t, d * 0.5, d * 0.65)} jiggle={1} /><Thermo v={120} /></>, ov: <Deg v={120} />,
    caps: [['abre', 'si abres con presión', R], ['golpe', 'vapor de golpe', R], ['disparada', 'sale disparado', R]] }),
  seguro: ({ t, d }) => ({ keys: go('mid', 'lid', d), three: <>{S({ t, fire: 1 - tw(t, d * 0.4, d * 0.6) })}<Pot t={t} xr={0.3} lock={1} jiggle={t < d * 0.5 ? 1 : 0} /><Thermo v={120 - tw(t, d * 0.5, d) * 40} /></>, ov: <Deg v={120 - tw(t, d * 0.5, d) * 40} />,
    caps: [['seguro', 'la tapa tiene un seguro', G], ['girarla', 'no deja girarla'], ['enfríe', 'primero que se enfríe', G]] }),
  llena: ({ t, d }) => ({ keys: go('lid', 'in', d), three: <>{S({ t })}<Pot t={t} lid={0} xr={0.85} fill={0.55 + tw(t, d * 0.2, d * 0.5) * 0.4} beans={1} swell={tw(t, d * 0.3, d * 0.6)} foam={tw(t, d * 0.4, d * 0.6)} line={1} /></>,
    caps: [['arriba', 'nunca hasta arriba', R], ['espuma', 'crecen y hacen espuma', R], ['rayita', 'una rayita', G]] }),
  cierre: ({ t, d }) => ({ keys: go('in', 'end', d), three: <>{S({ t })}<Pot t={t} xr={0.85 * (1 - tw(t, d * 0.5, d))} boil={0.6} press={1} beans={1} jiggle={1} /><Thermo v={120} /></>, ov: <Deg v={120} />,
    caps: [['encierra', 'una tapa que encierra el vapor'], ['empaque', 'un empaque'], ['pesita', 'una pesita'], ['seguridad', 'y una de seguridad'], ['entiendes', 'así funciona', G]] }),
};
