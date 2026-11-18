import React from 'react';
import { tw, cl, lerp } from './kit.jsx';
import { Desk, Zipper, Buttons, Wind, ZIP } from './fb03.jsx';

const R = '#e2483d', G = '#2bb36b';
const { Y0, SP, NT } = ZIP;
const yAt = (s) => Y0 + s * NT * SP;   // altura del carro según fracción
// poses [x, y, z, tx, ty, tz] — una sola toma continua: cada escena empieza donde terminó la anterior
const P = {
  wide: [0.45, 1.15, 1.55, 0, 1.1, 0], wide2: [-0.35, 1.12, 1.4, 0, 1.1, 0], mid: [0.25, 1.05, 0.85, 0, 1.05, 0],
  macro: [0.1, 0.95, 0.22, 0, 0.95, 0], macro2: [-0.1, 1.0, 0.2, 0, 1.0, 0], hand: [0.2, 0.9, 0.5, 0, 0.9, 0],
  top: [0.15, 1.6, 0.45, 0, 1.55, 0], low: [0.15, 0.62, 0.45, 0, 0.6, 0], end: [0.4, 1.12, 1.6, 0, 1.1, 0],
};
const go = (a, b, d) => [[0, ...P[a]], [d * 0.5, ...P[a].map((v, k) => lerp(v, P[b][k], 0.55))], [d, ...P[b]]];
// cámara que sigue al carro: de pose a pose, pero mirando a la altura del carro
const follow = (a, ysFn, d, dist = 0.42) => [0, 0.25, 0.5, 0.75, 1].map((u) => { const y = yAt(ysFn(u * d)); return [u * d, lerp(P[a][0], 0.16, u), y + 0.04, lerp(P[a][2], dist, u), 0, y, 0]; });
const Big = ({ txt, sub, op = 1 }) => <div style={{ position: 'absolute', top: 520, width: '100%', textAlign: 'center', opacity: op, fontFamily: 'Inter Display, Inter, sans-serif', fontWeight: 900 }}>
  <div style={{ fontSize: 210, color: '#141018', letterSpacing: -6, textShadow: '0 8px 0 rgba(255,255,255,0.8)' }}>{txt}</div>
  {sub ? <div style={{ fontSize: 62, color: '#141018', marginTop: -10 }}>{sub}</div> : null}
</div>;

export const SFB03 = {
  gancho: ({ t, d }) => {
    const ys = tw(t, 0.2, d * 0.8);
    return { keys: follow('mid', (x) => tw(x, 0.2, d * 0.8), d), three: <><Desk /><Zipper t={t} ys={ys} /></>,
      caps: [['diente', 'sin tocar un diente', G], ['jalas', 'la piecita que jalas'], ['cero', 'desde cero']] };
  },
  abre: ({ t, d }) => ({ keys: go('mid', 'wide', d), three: <><Desk /><Zipper t={t} ys={0} open={1.4} slider={0} teeth={0} stops={0} bottomBox={0} /><Wind t={t} on={t > d * 0.5 ? 1 : 0} /></>,
    caps: [['telas', 'dos telas'], ['chaqueta', 'ya tienes una chaqueta'], ['viento', 'el viento se mete', R]] }),
  botones: ({ t, d }) => ({ keys: go('wide', 'wide2', d), three: <><Desk /><Zipper t={t} ys={1} open={0} slider={0} teeth={0} stops={0} bottomBox={0} /><Buttons n={Math.floor(tw(t, 0.4, d * 0.7) * 5)} t={t} /></>,
    caps: [['botones', 'botones'], ['eternidad', 'toma una eternidad', R], ['atinas', 'ni atinas', R]] }),
  dientes: ({ t, d }) => ({ keys: go('wide2', 'macro', d), three: <><Desk /><Zipper t={t} ys={0} open={0.6} slider={0} teeth={tw(t, 0.3, d * 0.6)} stops={0} bottomBox={0} /></>,
    caps: [['dientitos', 'una fila de dientitos'], ['corridos', 'corridos medio diente', G], ['manos', 'como cruzar las manos']] }),
  forma: ({ t, d }) => ({ keys: follow('macro', (x) => 0.3 + tw(x, d * 0.4, d * 0.8) * 0.1, d, 0.2), three: <><Desk /><Zipper t={t} ys={0.3 + tw(t, d * 0.4, d * 0.8) * 0.1} open={0.5} slider={0} stops={0} bottomBox={0} /></>,
    caps: [['bolita', 'una bolita arriba'], ['huequito', 'un huequito abajo'], ['trabados', 'quedan trabados', G]] }),
  mano: ({ t, d }) => ({ keys: follow('macro2', (x) => 0.4 + Math.floor(x * 2) * 0.012, d, 0.3), three: <><Desk /><Zipper t={t} ys={0.4 + Math.floor(t * 2) * 0.012} open={0.5} slider={0} stops={0} bottomBox={0} /></>,
    caps: [['dedos', 'con los dedos'], ['botones', 'peor que los botones', R]] }),
  carro: ({ t, d }) => ({ keys: go('hand', 'low', d), three: <><Desk /><Zipper t={t} ys={0} open={1} slider={tw(t, 0.2, 0.6) > 0 ? 1 : 0} xr={tw(t, d * 0.4, d * 0.6) * 0.85} /></>,
    caps: [['Y', 'una pieza en forma de Y'], ['entradas', 'dos entradas arriba'], ['salida', 'una sola salida', G]] }),
  cuna: ({ t, d }) => { const f = (x) => tw(x, d * 0.15, d * 0.85) * 0.75; return { keys: follow('low', f, d, 0.34), three: <><Desk /><Zipper t={t} ys={f(t)} xr={0.85} /></>,
    caps: [['paredes', 'las paredes de la Y'], ['centro', 'empujan al centro'], ['hueco', 'cada diente en su hueco', G], ['deslizador', 'el carro o deslizador', G]] }; },
  abrir: ({ t, d }) => { const f = (x) => 0.75 - tw(x, d * 0.2, d * 0.85) * 0.45; return { keys: follow('macro', f, d, 0.36), three: <><Desk /><Zipper t={t} ys={f(t)} xr={0.85} /></>,
    caps: [['cuñita', 'una cuñita en el medio', G], ['separa', 'los separa otra vez'], ['uno', 'uno por uno']] }; },
  sale: ({ t, d }) => { const ys = 0.3 + tw(t, 0.2, d * 0.5) * 0.72; return { keys: follow('mid', (x) => Math.min(1, 0.3 + tw(x, 0.2, d * 0.5) * 0.72), d, 0.45), three: <><Desk /><Zipper t={t} ys={Math.min(1, ys)} stops={0} offTop={tw(t, d * 0.5, d * 0.7)} /></>,
    caps: [['demasiado', 'si subes demasiado'], ['punta', 'se sale por la punta', R], ['desarma', 'se desarma', R]] }; },
  topes: ({ t, d }) => ({ keys: go('top', 'low', d), three: <><Desk /><Zipper t={t} ys={t < d * 0.45 ? 0.97 : 0.02} open={t < d * 0.45 ? 0 : 1.2} stops={1} bottomBox={tw(t, d * 0.4, d * 0.6) > 0.5 ? 1 : 0} /></>,
    caps: [['topes', 'dos topes arriba', G], ['frenan', 'lo frenan'], ['pin', 'una cajita con un pin'], ['separar', 'separar del todo', G]] }),
  torcido: ({ t, d }) => { const f = (x) => 0.2 + tw(x, d * 0.1, d * 0.7) * 0.45; return { keys: follow('low', f, d, 0.4), three: <><Desk /><Zipper t={t} ys={f(t)} twisted={12} gap={tw(t, d * 0.55, d * 0.8)} /></>,
    caps: [['tuerce', 'un diente torcido', R], ['hueco', 'ya no cae en su hueco', R], ['detrás', 'se abre detrás del carro', R]] }; },
  lapiz: ({ t, d }) => ({ keys: go('mid', 'macro', d), three: <><Desk /><Zipper t={t} ys={0.15 + tw(t, d * 0.65, d) * 0.5} pencil={0.2 + Math.sin(t * 3) * 0.12 + 0.3} /></>,
    caps: [['lápiz', 'la punta de un lápiz'], ['resbaloso', 'el grafito es resbaloso', G], ['mejor', 'corre mejor', G]] }),
  tipos: ({ t, d }) => ({ keys: go('macro', 'mid', d), three: <><Desk /><Zipper t={t} ys={0.55 + Math.sin(t * 1.5) * 0.1} gap={t > d * 0.5 && t < d * 0.75 ? 1 : 0} /></>,
    caps: [['metal', 'de metal'], ['plástico', 'de plástico'], ['nailon', 'espiral de nailon', G], ['cerrar', 'vuelve a cerrar', G]] }),
  historia: ({ t, d }) => ({ keys: go('mid', 'wide2', d), three: <><Desk /><Zipper t={t} ys={0.5} open={0.5} /></>,
    ov: <Big txt={t < d * 0.55 ? '1893' : '1913'} sub={t < d * 0.55 ? 'Whitcomb Judson · Chicago' : 'Gideon Sundback'} op={tw(t, 0.2, 0.6)} />,
    caps: [['cien', 'más de cien años'], ['ganchos', 'un cierre de ganchos'], ['dientes', 'la cremallera de dientes', G]] }),
  cierre: ({ t, d }) => ({ keys: go('wide2', 'end', d), three: <><Desk /><Zipper t={t} ys={tw(t, 0.2, d * 0.7)} /></>,
    caps: [['dientes', 'dos filas de dientes'], ['Y', 'una pieza en Y'], ['topes', 'dos topes'], ['entiendes', 'así funciona', G]] }),
};
