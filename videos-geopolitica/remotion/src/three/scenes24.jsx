import React from 'react';
import { tw, cl, lerp } from './kit.jsx';
import { Kitchen, Microwave, Water, Food, Lab, Patent, Radarange, MW } from './world24.jsx';

const R = '#e2483d', G = '#2bb36b';
const P = {
  kwide: [0.9, 1.35, 2.2, 0, 1.1, 0], kwide2: [-0.7, 1.3, 2.0, 0, 1.1, 0], front: [0.3, 1.18, 1.05, 0, 1.08, 0], front2: [-0.3, 1.2, 1.0, 0, 1.08, 0],
  side: [1.0, 1.28, 0.75, 0.05, 1.08, 0], inside: [0.12, 1.22, 0.62, -0.08, 0.98, 0], food: [0.08, 1.1, 0.34, -0.08, 0.95, 0], food2: [-0.15, 1.12, 0.32, -0.08, 0.95, 0],
  mag: [0.6, 1.22, 0.45, 0.2, 1.08, -0.05], top: [0.1, 1.6, 0.5, -0.05, 1.05, 0], door: [0.45, 1.12, 0.55, -0.05, 1.08, 0.2],
  lab: [0.7, 1.3, 1.5, 0, 1.0, 0], lab2: [-0.4, 1.15, 0.8, 0.0, 1.0, 0], choc: [0.35, 1.05, 0.5, 0.15, 0.93, 0.15], paper: [0.05, 1.45, 0.45, 0.05, 0.95, 0.05],
  rad: [1.8, 1.3, 3.4, 0.35, 0.95, 0], rad2: [-1.2, 1.2, 3.0, 0.35, 0.95, 0], mol: [0.0, 1.0, 1.25, 0, 1.0, 0],
};
const go = (a, b, d) => [[0, ...P[a]], [d * 0.5, ...P[a].map((v, k) => lerp(v, P[b][k], 0.55))], [d, ...P[b]]];
const Big = ({ txt, sub, op = 1 }) => <div style={{ position: 'absolute', top: 170, right: 110, textAlign: 'right', opacity: op, fontFamily: 'Inter Display, Inter, sans-serif', fontWeight: 900 }}>
  <div style={{ fontSize: 170, color: '#141018', letterSpacing: -5, lineHeight: 1, textShadow: '0 6px 0 rgba(255,255,255,0.8)' }}>{txt}</div>
  {sub ? <div style={{ fontSize: 50, color: '#141018' }}>{sub}</div> : null}
</div>;
const K = () => <Kitchen />;
const mols = (t, amp, n = 9) => Array.from({ length: n }).map((_, k) => <Water key={k} pos={[-0.36 + (k % 3) * 0.36, 0.82 + Math.floor(k / 3) * 0.18, 0]} rot={Math.sin(t * 9 + k) * amp} s={0.9} />);

export const S24 = {
  gancho: ({ t, d }) => ({ keys: go('food', 'front', d), three: <><K /><Microwave t={t} door={1} xr={0.85} heat={0.9} depth={0.6} cut={tw(t, 0.4, 1.4)} spin={0} /></>,
    caps: [['adentro', 'de adentro hacia afuera'], ['falso', 'es falso', R], ['helado', 'el centro helado', R]] }),
  anio: ({ t, d }) => ({ keys: go('lab', 'lab2', d), three: <><Lab t={t} on={1} /></>, ov: <Big txt="1945" sub="Massachusetts · Raytheon" op={tw(t, 0.2, 0.7)} />,
    caps: [['1945', '1945'], ['Raytheon', 'Raytheon'], ['radares', 'piezas para radares']] }),
  spencer: ({ t, d }) => ({ keys: go('lab2', 'choc', d), three: <><Lab t={t} on={1} /></>, ov: <Big txt="Percy Spencer" sub="ingeniero autodidacta" op={tw(t, 0.2, 0.7) * (1 - tw(t, d * 0.75, d))} />,
    caps: [['Spencer', 'Percy Spencer'], ['cuenta', 'aprendió por su cuenta'], ['magnetrones', 'el magnetrón', G]] }),
  chocolate: ({ t, d }) => ({ keys: go('choc', 'lab', d), three: <><Lab t={t} on={1} melt={tw(t, d * 0.2, d * 0.5)} /></>,
    caps: [['chocolate', 'una barra de chocolate'], ['derretido', 'se había derretido', R], ['1946', 'o en 1946'], ['exacta', 'sin fecha exacta']] }),
  patente: ({ t, d }) => ({ keys: go('lab', 'paper', d), three: <><Lab t={t} on={0} /><Patent /></>, ov: <Big txt="8 oct 1945" sub="patente US 2,495,429 · aprobada en 1950" op={tw(t, d * 0.2, d * 0.4)} />,
    caps: [['patente', 'la patente', G], ['1950', 'aprobada en 1950']] }),
  radarange: ({ t, d }) => ({ keys: go('rad', 'rad2', d), three: <><Radarange /></>, ov: <Big txt="1947" sub="Radarange · ~340 kg · ~5.000 dólares" op={tw(t, 0.3, 0.8)} />,
    caps: [['Radarange', 'el Radarange'], ['persona', 'tan alto como una persona'], ['kilos', 'unos 340 kilos', R], ['cocina', 'no para tu cocina']] }),
  amana: ({ t, d }) => ({ keys: go('kwide2', 'kwide', d), three: <><K /><group position={[0, -0.02 + (1 - tw(t, 0.2, 0.8)) * 0.6, 0]}><Microwave t={t} /></group></>, ov: <Big txt="1967" sub="microondas de mesa · 495 dólares" op={tw(t, 0.3, 0.8)} />,
    caps: [['1967', 'de mesa, en 1967'], ['casas', 'empezó a entrar a las casas', G]] }),
  caja: ({ t, d }) => ({ keys: go('kwide', 'front', d), three: <><K /><Microwave t={t} xr={tw(t, d * 0.3, d * 0.6) * 0.85} /></>,
    caps: [['caja', 'una caja de metal'], ['radio', 'ondas de radio'], ['lado', 'tienen que salir de algún lado', R]] }),
  magnetron: ({ t, d }) => ({ keys: go('front', 'mag', d), three: <><K /><Microwave t={t} xr={0.85} mag={tw(t, 0.2, 0.8)} on={t > d * 0.5 ? 1 : 0} /></>,
    caps: [['magnetrón', 'un magnetrón', G], ['radar', 'el mismo del radar'], ['segundo', '2.450 millones de veces por segundo']] }),
  guia: ({ t, d }) => ({ keys: go('mag', 'top', d), three: <><K /><Microwave t={t} xr={0.85} mag={1} on={1} guide={tw(t, d * 0.3, d * 0.6)} waves={tw(t, d * 0.55, d * 0.8)} /></>,
    caps: [['pierde', 'se pierde', R], ['tubo', 'un tubo de metal'], ['guía', 'la guía de onda', G]] }),
  agua: ({ t, d }) => ({ keys: go('top', 'mol', d), three: <><K /><group position={[0, 0, 0.15]}>{mols(t, 0, Math.round(tw(t, 0.3, d * 0.6) * 9))}</group></>,
    caps: [['agua', 'casi toda la comida tiene agua'], ['positiva', 'un lado positivo'], ['negativa', 'y otro negativo'], ['imán', 'como un imán chiquito', G]] }),
  gira: ({ t, d }) => ({ keys: go('mol', 'mol', d), three: <><K /><group position={[0, 0, 0.15]}>{mols(t, tw(t, 0.3, 1) * 0.9)}</group></>,
    caps: [['voltearse', 'se voltean'], ['millones', 'miles de millones de veces'], ['calor', 'ese roce es calor', R]] }),
  frecuencia: ({ t, d }) => ({ keys: go('mol', 'mol', d), three: <><K /><group position={[0, 0, 0.15]}>{mols(t, 0.6)}</group></>,
    caps: [['natural', '¿la frecuencia del agua?'], ['es', 'no lo es', R], ['banda', 'una banda permitida', G]] }),
  profundo: ({ t, d }) => ({ keys: go('mol', 'food', d), three: <><K /><Microwave t={t} door={1} xr={0.85} heat={tw(t, 0.3, d * 0.6)} depth={0.9} cut={1} /></>,
    caps: [['mito', 'aquí está el mito', R], ['centro', 'no llegan al centro', R], ['centímetros', 'de 1 a 3 centímetros', G]] }),
  conduccion: ({ t, d }) => ({ keys: go('food', 'food2', d), three: <><K /><Microwave t={t} door={1} xr={0.85} heat={0.9} depth={0.9 - tw(t, d * 0.2, d) * 0.6} cut={1} /></>,
    caps: [['olla', 'como en una olla'], ['centro', 'hacia el centro'], ['conducción', 'conducción', G]] }),
  helado: ({ t, d }) => ({ keys: go('food2', 'inside', d), three: <><K /><Microwave t={t} door={1} xr={0.85} heat={0.95} depth={0.85} cut={1} /></>,
    caps: [['orilla', 'la orilla quema', R], ['frío', 'el centro sigue frío', R], ['delgado', 'en un plato delgado'], ['dentro', 'parece que calentó por dentro']] }),
  reposar: ({ t, d }) => ({ keys: go('inside', 'food', d), three: <><K /><Microwave t={t} door={1} xr={0.85} heat={0.95} depth={0.85 - tw(t, d * 0.3, d) * 0.7} cut={1} /></>,
    caps: [['reposar', 'deja reposar un minuto', G], ['enfríe', 'no es para que se enfríe'], ['centro', 'para que llegue al centro', G]] }),
  puntos: ({ t, d }) => ({ keys: go('food', 'top', d), three: <><K /><Microwave t={t} xr={0.85} on={1} mag={1} guide={1} waves={1} spots={tw(t, d * 0.3, d * 0.6)} food={0} /></>,
    caps: [['rebotan', 'rebotan en las paredes'], ['suman', 'se suman', R], ['cancelan', 'se cancelan', '#3d7ee0']] }),
  plato: ({ t, d }) => ({ keys: go('top', 'inside', d), three: <><K /><Microwave t={t} xr={0.85} on={1} spots={1} spin={t * 1.2} heat={0.6} stirrer={t > d * 0.7 ? 1 : 0} /></>,
    caps: [['girar', 'el plato gira'], ['giratorio', 'el plato giratorio', G], ['ventilador', 'o un ventilador de metal']] }),
  puerta: ({ t, d }) => ({ keys: go('inside', 'door', d), three: <><K /><Microwave t={t} xr={0.3} on={1} grid={tw(t, d * 0.3, d * 0.6)} spin={t} heat={0.5} /></>,
    caps: [['vidrio', 'el vidrio de la puerta'], ['rejilla', 'una rejilla de metal', G], ['luz', 'la luz pasa'], ['onda', 'la onda no', G]] }),
  metal: ({ t, d }) => ({ keys: go('door', 'inside', d), three: <><K /><Microwave t={t} door={1} xr={0.85} food={0} fork={1} on={1} /></>,
    caps: [['tenedor', 'un tenedor'], ['lisas', 'las paredes son lisas'], ['puntas', 'las puntas juntan la electricidad', R], ['chispa', 'salta una chispa', R]] }),
  huevo: ({ t, d }) => ({ keys: go('inside', 'food', d), three: <><K /><Microwave t={t} door={1} xr={0.85} food={0} egg={tw(t, 0.4, d * 0.75)} on={1} /></>,
    caps: [['explotar', 'un huevo puede explotar', R], ['vapor', 'se vuelve vapor'], ['presión', 'la presión lo revienta', R]] }),
  debate: ({ t, d }) => ({ keys: go('food', 'kwide', d), three: <><K /><Microwave t={t} on={1} /></>,
    caps: [['debate', 'el debate'], ['peligroso', '¿es peligroso?', R]] }),
  radiactivo: ({ t, d }) => ({ keys: go('kwide', 'front2', d), three: <><K /><Microwave t={t} xr={0.85} on={1} mag={1} guide={1} waves={1} heat={0.6} /></>,
    caps: [['ionizante', 'radiación no ionizante', G], ['radiactiva', 'no vuelve radiactiva la comida', G], ['calor', 'se vuelve calor']] }),
  fuga: ({ t, d }) => ({ keys: go('front2', 'door', d), three: <><K /><Microwave t={t} on={1} grid={1} /></>, ov: <Big txt="1 → 5" sub="mW/cm² a 5 cm (nuevo → toda su vida)" op={tw(t, 0.3, 0.8)} />,
    caps: [['regla', 'hay una regla'], ['milivatio', 'un milivatio nuevo'], ['cinco', 'nunca más de cinco', G]] }),
  riesgos: ({ t, d }) => ({ keys: go('door', 'inside', d), three: <><K /><Microwave t={t} door={1} xr={0.85} food={0} cup={tw(t, d * 0.4, d * 0.9)} /></>,
    caps: [['riesgos', 'los riesgos reales', R], ['quemaduras', 'quemaduras', R], ['sobrecalienta', 'agua que salta de golpe', R]] }),
  danada: ({ t, d }) => ({ keys: go('inside', 'side', d), three: <><K /><Microwave t={t} broken={tw(t, 0.3, 1.0)} /></>,
    caps: [['cierra', 'si la puerta no cierra bien', R], ['revisar', 'mándalo a revisar', G]] }),
  nutrientes: ({ t, d }) => ({ keys: go('side', 'food', d), three: <><K /><Microwave t={t} door={1} xr={0.85} heat={0.5} spin={t} /></>,
    caps: [['destruye', '¿los destruye?', R], ['depende', 'depende del alimento'], ['hervir', 'tanto o más que hervir', G]] }),
  repaso: ({ t, d }) => ({ keys: go('food', 'front', d), three: <><K /><Microwave t={t} xr={0.85} on={1} mag={1} guide={1} waves={1} spin={t} heat={0.7} /></>,
    caps: [['magnetrón', 'magnetrón'], ['guía', 'guía de onda'], ['agua', 'el agua se voltea'], ['plato', 'plato que gira', G]] }),
  mito: ({ t, d }) => ({ keys: go('front', 'food2', d), three: <><K /><Microwave t={t} door={1} xr={0.85} heat={0.9} depth={0.85} cut={1} /></>,
    caps: [['adentro', 'no calienta de adentro hacia afuera', R], ['afuera', 'calienta la capa de afuera', G], ['tiempo', 'el resto lo hace el tiempo']] }),
  pregunta: ({ t, d }) => ({ keys: go('food2', 'kwide', d), three: <><K /><Microwave t={t} on={1} /></>,
    caps: [['mito', '¿qué otro mito?'], ['comentarios', 'escríbelo en los comentarios', G]] }),
};
