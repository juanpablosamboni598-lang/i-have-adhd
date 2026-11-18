import React from 'react';
import { tw, cl, lerp } from './kit.jsx';
import { Table, Flask, Hand } from './fb05.jsx';

const R = '#e2483d', G = '#2bb36b';
const P = {
  wide: [0.6, 1.4, 1.4, 0, 1.12, 0], wide2: [-0.5, 1.38, 1.3, 0, 1.12, 0], mid: [0.35, 1.3, 0.95, 0, 1.12, 0], mid2: [-0.35, 1.3, 0.92, 0, 1.12, 0],
  wall: [0.15, 1.18, 0.6, 0, 1.12, 0], wall2: [-0.15, 1.2, 0.58, 0, 1.12, 0], neck: [0.2, 1.5, 0.55, 0, 1.35, 0], end: [0.55, 1.42, 1.5, 0, 1.13, 0],
};
const go = (a, b, d) => [[0, ...P[a]], [d * 0.5, ...P[a].map((v, k) => lerp(v, P[b][k], 0.55))], [d, ...P[b]]];
const Big = ({ txt, sub, op = 1 }) => <div style={{ position: 'absolute', top: 520, width: '100%', textAlign: 'center', opacity: op, fontFamily: 'Inter Display, Inter, sans-serif', fontWeight: 900 }}>
  <div style={{ fontSize: 190, color: '#141018', letterSpacing: -6, textShadow: '0 8px 0 rgba(255,255,255,0.8)' }}>{txt}</div>
  {sub ? <div style={{ fontSize: 58, color: '#141018' }}>{sub}</div> : null}
</div>;
const T = () => <Table />;

export const SFB05 = {
  gancho: ({ t, d }) => ({ keys: go('mid', 'wide', d), three: <><T /><Flask t={t} gap="vac" mirror={1} /></>,
    caps: [['caliente', 'caliente todo el día', R], ['fría', 'y fría también', '#3d7ee0'], ['vacío', 'con vacío', G]] }),
  abre: ({ t, d }) => ({ keys: go('wide', 'mid', d), three: <><T /><Flask t={t} wall="single" glass={1} cap={0} heat={tw(t, d * 0.5, d * 0.8)} /></>,
    caps: [['botella', 'una botella de vidrio'], ['tibio', 'en una hora, tibio', R]] }),
  tres: ({ t, d }) => ({ keys: go('mid', 'mid2', d), three: <><T /><Flask t={t} wall="single" glass={1} cap={0} heat={tw(t, 0.3, 0.8)} conv={tw(t, d * 0.35, d * 0.5)} rad={tw(t, d * 0.65, d * 0.8)} /></>,
    caps: [['tocando', '1. tocando', R], ['aire', '2. con el aire', R], ['luz', '3. como luz invisible', R]] }),
  doble: ({ t, d }) => ({ keys: go('mid2', 'wall', d), three: <><T /><Flask t={t} wall={tw(t, 0.3, 0.8) > 0.5 ? 'double' : 'single'} gap="solid" /></>,
    caps: [['doble', 'pared doble', G], ['espacio', 'un espacio entre las dos']] }),
  aire: ({ t, d }) => ({ keys: go('wall', 'wall2', d), three: <><T /><Flask t={t} gap="air" heat={tw(t, d * 0.4, d * 0.7)} /></>,
    caps: [['aire', 'ese espacio tiene aire'], ['pasa', 'todavía pasa calor', R]] }),
  vacio: ({ t, d }) => ({ keys: go('wall2', 'wall', d), three: <><T /><Flask t={t} gap={t < d * 0.45 ? 'air' : 'vac'} heat={1 - tw(t, d * 0.4, d * 0.6)} /></>,
    caps: [['sacas', 'le sacas el aire'], ['moléculas', 'sin moléculas'], ['vacío', 'el vacío', G]] }),
  luz: ({ t, d }) => ({ keys: go('wall', 'mid', d), three: <><T /><Flask t={t} gap="vac" rad={tw(t, 0.3, 0.8)} /></>,
    caps: [['luz', 'como luz invisible', R], ['brasa', 'como de una brasa']] }),
  espejo: ({ t, d }) => ({ keys: go('mid', 'wall2', d), three: <><T /><Flask t={t} gap="vac" mirror={tw(t, 0.3, d * 0.4)} rad={1} /></>,
    caps: [['espejo', 'como un espejo', G], ['rebota', 'la luz rebota'], ['brillan', 'por eso brillan']] }),
  prueba: ({ t, d }) => ({ keys: go('wall2', 'mid2', d), three: <><T /><Flask t={t} gap="vac" mirror={1} /><Hand x={0.2 - tw(t, d * 0.3, d * 0.5) * 0.06} /></>,
    caps: [['toca', 'tócalo por fuera'], ['cuarto', 'casi a temperatura del cuarto', G], ['adentro', 'se quedó adentro', G]] }),
  cuello: ({ t, d }) => ({ keys: go('mid2', 'neck', d), three: <><T /><Flask t={t} gap="vac" mirror={1} cap={0} neck={1} /></>,
    caps: [['cuello', 'en el cuello'], ['pasa', 'por ahí sí pasa', R]] }),
  tapa: ({ t, d }) => ({ keys: go('neck', 'mid', d), three: <><T /><Flask t={t} gap="vac" mirror={1} cap={tw(t, 0.3, d * 0.4)} neck={t < d * 0.5 ? 1 : 0} /></>,
    caps: [['delgado', 'un cuello delgado'], ['corcho', 'un corcho o tapón', G], ['tapa', 'por la tapa se enfría', R]] }),
  frio: ({ t, d }) => ({ keys: go('mid', 'wall', d), three: <><T /><Flask t={t} gap="vac" mirror={1} cap={0} ice={1 - tw(t, d * 0.4, d) * 0.15} level={0.6} hot={0} /></>,
    caps: [['revés', 'funciona al revés', G], ['hielo', 'el hielo tarda muchísimo', '#3d7ee0']] }),
  fragil: ({ t, d }) => ({ keys: go('wall', 'mid2', d), three: <><T /><Flask t={t} gap="vac" mirror={1} broken={t > d * 0.3 && t < d * 0.6 ? 1 : 0} steel={t > d * 0.6 ? 1 : 0} glass={t > d * 0.6 ? 0 : 1} /></>,
    caps: [['frágil', 'el vidrio es frágil', R], ['tintineo', 'un tintineo', R], ['acero', 'acero inoxidable doble', G]] }),
  historia: ({ t, d }) => ({ keys: go('mid2', 'wide2', d), three: <><T /><Flask t={t} gap="vac" mirror={1} /></>, ov: <Big txt={t < d * 0.6 ? '1892' : '1904'} sub={t < d * 0.6 ? 'James Dewar · Escocia' : 'Thermos · Alemania'} op={tw(t, 0.2, 0.6)} />,
    caps: [['Dewar', 'James Dewar'], ['fríos', 'gases muy fríos'], ['Thermos', 'Thermos', G]] }),
  truco: ({ t, d }) => ({ keys: go('wide2', 'mid', d), three: <><T /><Flask t={t} gap="vac" mirror={1} cap={0} level={t > d * 0.6 ? tw(t, d * 0.6, d) * 0.8 : 0} rinse={t < d * 0.55 ? tw(t, 0.2, 0.8) * (1 - tw(t, d * 0.4, d * 0.55)) : 0} /></>,
    caps: [['caliente', 'agua caliente un minuto'], ['bótala', 'y bótala'], ['roban', 'no le roban calor', G]] }),
  cierre: ({ t, d }) => ({ keys: go('mid', 'end', d), three: <><T /><Flask t={t} gap="vac" mirror={1} /></>,
    caps: [['paredes', 'dos paredes'], ['vacío', 'vacío en medio'], ['espejo', 'espejo por dentro'], ['entiendes', 'así funciona', G]] }),
};
