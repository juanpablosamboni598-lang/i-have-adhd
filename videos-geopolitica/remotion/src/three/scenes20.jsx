import React from 'react';
import { interpolate } from 'remotion';
import { cl, tw, lerp, drop, Part, INK } from './kit.jsx';
import { P, Savanna, Giraffe, Human, Lion, HeartCut, Building, ValveTube, LegCut, DNA, Jet, Bed, Ruler, Acacia } from './world20.jsx';

const RED = '#e2483d';
// cámaras útiles (jirafa en el origen mirando a +x)
const FULL = (d, s = 0) => [[0, 3 + s, 3.4, 11, 0.5, 2.7, 0], [d * 0.5, 1.5, 3.0, 9.5, 0.6, 2.8, 0], [d, -1.5 - s, 3.3, 10, 0.4, 2.7, 0]];
const HEAD = (d) => [[0, 3.8, 5.4, 3.4, 1.5, 5.0, 0], [d * 0.5, 3.0, 5.1, 2.6, 1.5, 5.0, 0], [d, 2.2, 5.3, 3.2, 1.4, 4.9, 0]];
const CHEST = (d) => [[0, 2.6, 2.6, 4.0, 0.6, 2.3, 0], [d * 0.5, 1.8, 2.4, 3.2, 0.6, 2.3, 0], [d, 0.9, 2.5, 3.6, 0.6, 2.3, 0]];
const NECK = (d) => [[0, 3.5, 3.6, 5.2, 1.2, 3.8, 0], [d * 0.5, 2.6, 4.2, 4.4, 1.2, 4.0, 0], [d, 1.6, 3.9, 5.0, 1.1, 3.9, 0]];

// ---- overlays 2D ----
export const Gauge = ({ v, max = 300, label, x = 1500, y = 560, op = 1, warn = 200 }) => {
  const a = -120 + 240 * cl(v / max);
  const col = v > warn ? RED : v > 90 ? '#2bb36b' : '#3f7fe0';
  return <div style={{ position: 'absolute', left: x - 170, top: y - 170, width: 340, opacity: op, fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
    <svg width="340" height="250" viewBox="0 0 340 250">
      <path d="M 50 210 A 130 130 0 1 1 290 210" fill="#ffffffdd" stroke={INK} strokeWidth="10" />
      <path d={`M 170 170 L ${170 + 140 * Math.cos(((-30) * Math.PI) / 180)} ${170 - 140 * Math.sin(((-30) * Math.PI) / 180)}`} stroke="none" />
      <path d="M 238 63 A 130 130 0 0 1 290 210" fill="none" stroke={RED} strokeWidth="18" />
      <g transform={`rotate(${a} 170 170)`}><rect x="164" y="60" width="12" height="115" rx="6" fill={INK} /></g>
      <circle cx="170" cy="170" r="18" fill={INK} />
    </svg>
    <div style={{ fontWeight: 900, fontSize: 64, color: col, marginTop: -40 }}>{Math.round(v)}</div>
    <div style={{ fontWeight: 800, fontSize: 30, color: INK }}>{label}</div>
  </div>;
};
export const Tag = ({ txt, x, y, op = 1, col = INK, size = 46 }) => op <= 0.01 ? null : <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${0.85 + 0.15 * op})`, opacity: op, background: '#ffffffee', border: `5px solid ${INK}`, borderRadius: 18, padding: '6px 20px', fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: size, color: col, whiteSpace: 'nowrap' }}>{txt}</div>;
export const Big = ({ txt, x = 960, y = 540, op = 1, col = INK, size = 150 }) => op <= 0.01 ? null : <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${0.8 + 0.2 * op})`, opacity: op, fontFamily: 'Inter Display, Inter, sans-serif', fontWeight: 900, fontSize: size, color: col, whiteSpace: 'nowrap', WebkitTextStroke: `6px ${INK}`, paintOrder: 'stroke fill', textShadow: '0 8px 0 rgba(0,0,0,0.25)' }}>{txt}</div>;

const G = (p) => <Giraffe {...p} />;
const fo = (t, a, b) => tw(t, a, a + 0.5) * (b === undefined ? 1 : 1 - tw(t, b - 0.5, b));

export const S20 = {
  apertura: ({ t, d }) => ({
    keys: [[0, 6, 1.2, 7, 0.8, 3.2, 0], [d * 0.35, 3.5, 3.5, 7.5, 0.8, 3.4, 0], [d * 0.7, 2.6, 3.6, 4.6, 0.9, 3.6, 0], [d, 1.8, 4.2, 6, 0.8, 3.5, 0]],
    three: <><Savanna t={t} /><G t={t} xr={tw(t, d * 0.45, d * 0.55)} flow={tw(t, d * 0.55, d * 0.65)} show={{ vert: 0, heart: 1, art: 1, jug: 0, brain: 1 }} /></>,
    ov: <><Tag txt="cerebro" x={1260} y={250} op={fo(t, d * 0.6)} /><Tag txt="corazón" x={1150} y={720} op={fo(t, d * 0.6)} col={RED} /></>,
  }),
  titulo: ({ t, d }) => ({
    keys: [[0, 0.5, 2.5, 13, 0.5, 2.6, 0], [d, -3, 3.2, 12, 0.5, 2.6, 0]],
    three: <><Savanna t={t} /><group position={[0, (1 - drop(t, 0.2, 0.9)) * 8, 0]}><G t={t} /></group><Acacia pos={[5, 0, -2]} s={1.2} /></>,
    ov: <><Big txt="¿CÓMO LE LLEGA" y={220} size={110} op={tw(t, 1, 1.5)} col="#ffd23d" /><Big txt="LA SANGRE AL CEREBRO?" y={360} size={110} op={tw(t, 1.4, 1.9)} col="#ffffff" /></>,
  }),
  altura: ({ t, d }) => ({
    keys: [[0, 2, 1.5, 12, 0, 2.4, 0], [d * 0.5, 0, 3, 13, 0, 2.8, 0], [d, -2, 4, 12, 0, 3, 0]],
    three: <><Savanna t={t} /><G t={t} /><Ruler pos={[-2.2, 0, 0.5]} h={5.5} grow={tw(t, 0.5, d * 0.5)} /><Human pos={[2.8, 0, 1]} rotY={-0.4} t={t} wave={tw(t, d * 0.6, d * 0.7)} /></>,
    ov: <><Tag txt="5 m" x={560} y={240} op={fo(t, d * 0.5)} col={RED} size={60} /><Tag txt="1,7 m" x={1350} y={640} op={fo(t, d * 0.65)} /></>,
  }),
  vertebras: ({ t, d }) => ({
    keys: NECK(d),
    three: <><Savanna t={t} /><G t={t} xr={tw(t, 0.6, 1.4)} show={{ vert: 1, heart: 0, art: 0, jug: 0, brain: 0 }} /><Human pos={[3.2, 0, 1.5]} rotY={-0.6} t={t} xr={tw(t, d * 0.5, d * 0.6)} /></>,
    ov: <><Big txt="7" x={420} y={500} op={fo(t, d * 0.3)} col="#ffffff" size={260} /><Tag txt="25 cm cada una" x={1400} y={300} op={fo(t, d * 0.6)} /></>,
  }),
  gravedad: ({ t, d }) => ({
    keys: [[0, 2, 4, 14, 0, 3, 0], [d, -2, 3, 12, 0, 3.2, 0]],
    three: <><Savanna t={t} /><G t={t} xr={0.85} flow={0.4} show={{ vert: 0, heart: 1, art: 1, jug: 0, brain: 1 }} />
      {Array.from({ length: 5 }).map((_, k) => <group key={k} position={[-2.5, 5 - ((t * 1.5 + k) % 5), 0]}><Part geo={<coneGeometry args={[0.18, 0.4, 10]} />} color={RED} rot={[Math.PI, 0, 0]} t={0.015} /></group>)}</>,
    ov: <Tag txt="gravedad ↓" x={560} y={300} op={fo(t, 0.8)} col={RED} />,
  }),
  manguera: ({ t, d }) => ({
    keys: [[0, 12, 3, 15, 0.8, 3.5, 0], [d * 0.35, 6, 6, 13, 0.8, 4.5, 0], [d * 0.7, -2, 5, 14, 0.8, 4.2, 0], [d, -6, 3.5, 13, 0.8, 4, 0]],
    three: <><Savanna t={t} trees={false} /><Building t={t} power={t < d * 0.45 ? 1 : lerp(1, 0.45, tw(t, d * 0.45, d * 0.6))} /></>,
    ov: <><Tag txt="bomba fuerte" x={1300} y={820} op={fo(t, 0.5, d * 0.45)} /><Tag txt="bomba débil" x={1300} y={820} op={fo(t, d * 0.5)} col={RED} /><Big txt="✗" x={1250} y={250} op={fo(t, d * 0.65)} col={RED} size={200} /></>,
  }),
  corazon: ({ t, d }) => ({
    keys: CHEST(d),
    three: <><Savanna t={t} /><G t={t} xr={tw(t, 0.3, 1.0)} flow={0.6} show={{ vert: 0, heart: 1, art: 1, jug: 0, brain: 0 }} /></>,
    ov: <><Tag txt="+10 kg" x={1200} y={330} op={fo(t, d * 0.35)} col={RED} size={60} /><Tag txt="60 cm" x={1250} y={460} op={fo(t, d * 0.5)} /></>,
  }),
  pared: ({ t, d }) => ({
    keys: [[0, -2, 0.3, 7, 0, 0.4, 0], [d * 0.35, 2, 1.6, 5.5, 0, 0.4, 0], [d * 0.7, 3, -0.5, 4.8, 0, 0.3, 0], [d, -1, 0.8, 4.5, 0, 0.4, 0]],
    three: <><color attach="background" args={['#f7d9c4']} /><HeartCut t={t} wall={tw(t, d * 0.3, d * 0.6)} rotY={Math.PI + 0.5 + Math.sin(t * 0.5) * 0.7} s={1.3} /></>,
    ov: <Tag txt="músculo grueso" x={1400} y={300} op={fo(t, d * 0.55)} col={RED} />,
  }),
  presion: ({ t, d }) => ({
    keys: [[0, 0.3, 2.2, 8, 0.3, 2, 0], [d, 1, 2.6, 7, 0.3, 2.2, 0]],
    three: <><Savanna t={t} /><Human pos={[-1.6, 0, 0.6]} rotY={0.2} t={t} xr={0.7} /><G pos={[1.2, 0, -0.6]} t={t} xr={0.85} flow={1} show={{ vert: 0, heart: 1, art: 1, jug: 0, brain: 1 }} /></>,
    ov: <><Big txt="×2" x={960} y={260} op={fo(t, d * 0.5)} col={RED} size={200} /></>,
  }),
  medidor: ({ t, d }) => ({
    keys: [[0, 3, 3, 9, 0.3, 2.7, 0], [d * 0.5, 2, 2.6, 7, 0.4, 2.4, 0], [d * 0.75, 2.5, 4.5, 6, 1, 4.4, 0], [d, -0.5, 5.4, 5, 1.2, 4.7, 0]],
    three: <><Savanna t={t} /><G t={t} xr={0.85} flow={1} show={{ vert: 0, heart: 1, art: 1, jug: 0, brain: 1 }} /></>,
    ov: <><Gauge v={interpolate(t, [0.5, 2.5], [0, 120], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} label="persona" x={340 + Math.sin(t * 1.3) * 12} y={600} op={tw(t, 0.3, 0.8)} />
      <Gauge v={t < d * 0.7 ? interpolate(t, [d * 0.25, d * 0.45], [0, 260], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : lerp(260, 115, tw(t, d * 0.72, d * 0.88))} label={t < d * 0.7 ? 'jirafa: corazón' : 'jirafa: cabeza'} x={1580} y={600} op={tw(t, d * 0.22, d * 0.3)} /></>,
  }),
  arteria: ({ t, d }) => ({
    keys: [[0, 3, 2.8, 4.5, 0.8, 2.8, 0], [d * 0.5, 2.5, 3.8, 4.8, 1, 3.8, 0], [d, 2.4, 4.8, 4, 1.3, 4.6, 0]],
    three: <><Savanna t={t} /><G t={t} xr={0.85} flow={1} show={{ vert: 0, heart: 1, art: 1, jug: 0, brain: 1 }} /></>,
    ov: <Tag txt="carótida" x={1250} y={480} op={fo(t, d * 0.3)} col={RED} />,
  }),
  cerebro: ({ t, d }) => ({
    keys: HEAD(d),
    three: <><Savanna t={t} /><G t={t} xr={0.85} flow={1} brainGlow={t > d * 0.4 ? 1 : 0} show={{ vert: 0, heart: 0, art: 1, jug: 0, brain: 1 }} /></>,
    ov: <><Tag txt="presión justa ✓" x={960} y={850} op={fo(t, d * 0.45)} col="#2bb36b" /></>,
  }),
  puente_bajar: ({ t, d }) => ({
    keys: [[0, 7, 3, 9, 1.5, 2, 0], [d, 4, 2.2, 8, 2, 1.2, 0]],
    three: <><Savanna t={t} pond /><G t={t} rotY={0} /></>,
    ov: <Big txt="SED" x={1400} y={300} op={fo(t, d * 0.5)} col="#46a6f0" size={170} />,
  }),
  beber: ({ t, d }) => ({
    keys: [[0, 4, 3.5, 9, 1, 2.5, 0], [d * 0.5, 3, 2.4, 7.5, 1.5, 1.8, 0], [d, 1.5, 1.6, 6.5, 2, 1, 0]],
    three: <><Savanna t={t} pond /><G t={t} neck={tw(t, d * 0.3, d * 0.55)} /><Ruler pos={[-1.8, 0, 0.6]} h={5} /></>,
    ov: <><Tag txt="5 m → 0" x={500} y={300} op={fo(t, d * 0.5)} col={RED} /></>,
  }),
  peligro_bajar: ({ t, d }) => ({
    keys: [[0, 3.2, 1.8, 5, 1.8, 1.4, 0], [d, 2.4, 1.4, 4.2, 2, 1.1, 0]],
    three: <><Savanna t={t} pond /><G t={t} neck={1} xr={0.85} flow={2} valve={0} show={{ vert: 0, heart: 1, art: 1, jug: 1, brain: 1 }} /></>,
    ov: <><Big txt="!" x={1500} y={300} op={fo(t, 0.5)} col={RED} size={220} /></>,
  }),
  valvulas: ({ t, d }) => ({
    keys: [[0, 0, 0, 9, 0, 0, 0], [d * 0.5, 3, 1, 7, 0, 0, 0], [d, 4, -1, 6, 0, 0, 0]],
    three: <><color attach="background" args={['#d6ecf7']} /><group rotation={[0, t * 0.35, Math.sin(t * 0.7) * 0.12]}><ValveTube t={t} closed={0.12 + 0.12 * Math.sin(t * 3)} s={1.1} /></group></>,
    ov: <><Tag txt="vena yugular" x={960} y={220} op={fo(t, 0.4)} col="#3f7fe0" /><Tag txt="válvulas" x={1450} y={540} op={fo(t, d * 0.5)} /></>,
  }),
  compuertas: ({ t, d }) => ({
    keys: [[0, 3, 0.5, 7, 0, 0, 0], [d * 0.5, 0, 0, 8, 0, 0, 0], [d, -3, 0.8, 7, 0, 0, 0]],
    three: <><color attach="background" args={['#d6ecf7']} /><ValveTube t={t} closed={tw(t, d * 0.25, d * 0.45)} s={1.1} /></>,
    ov: <><Tag txt="¡CERRADAS!" x={1450} y={300} op={fo(t, d * 0.45)} col={RED} size={56} /></>,
  }),
  red: ({ t, d }) => ({
    keys: [[0, 3.0, 1.6, 3.0, 2.2, 0.9, 0], [d * 0.5, 2.4, 1.2, 2.4, 2.25, 0.8, 0], [d, 3.2, 0.9, 2.0, 2.2, 0.8, 0]],
    three: <><Savanna t={t} pond /><G t={t} neck={1} xr={0.85} flow={0.6} valve={1} show={{ vert: 0, heart: 0, art: 1, jug: 1, brain: 1, rete: 1 }} /></>,
    ov: <><Tag txt="red de vasos" x={1300} y={300} op={fo(t, d * 0.3)} col={RED} /><Tag txt="¿esponja?" x={1300} y={420} op={fo(t, d * 0.6)} /></>,
  }),
  subir: ({ t, d }) => ({
    keys: [[0, 6, 2, 9, 1.5, 2, 0], [d * 0.5, 5, 3, 10, 1, 2.8, 0], [d * 0.55, -5, 1.8, 4.5, -8, 1.0, 0], [d, -5.5, 1.9, 4, -8, 1.1, 0]],
    three: <><Savanna t={t} pond /><G t={t} neck={1 - tw(t, 0.6, d * 0.35)} />
      <Bed pos={[-8, 0, 0]} rotY={Math.PI / 2} /><Human pos={[-8, 0.55, 0.2]} rotY={Math.PI / 2} t={t} lie={1 - tw(t, d * 0.6, d * 0.72)} sit={0} dizzy={tw(t, d * 0.75, d * 0.82)} /></>,
    ov: <><Tag txt="¡mareo!" x={960} y={250} op={fo(t, d * 0.78)} col={RED} /></>,
  }),
  mareo: ({ t, d }) => ({
    keys: [[0, 4, 4, 10, 0.9, 3.4, 0], [d * 0.5, 3, 4, 9, 0.9, 3.5, 0], [d, 2, 4.5, 8, 1.1, 3.8, 0]],
    three: <><Savanna t={t} /><G t={t} xr={0.85} flow={1} brainGlow={t > d * 0.5 ? 1 : 0} show={{ vert: 0, heart: 1, art: 1, jug: 1, brain: 1 }} heart={2} /></>,
    ov: <><Gauge v={lerp(40, 115, tw(t, d * 0.2, d * 0.5))} label="presión en la cabeza" x={1580} y={600} op={tw(t, 0.3, 0.8)} /></>,
  }),
  despacio: ({ t, d }) => ({
    keys: [[0, 5, 2.6, 10, 1.2, 2, 0], [d * 0.5, 3, 2.4, 9, 1.2, 2, 0], [d, 2, 4, 8, 1.3, 3.5, 0]],
    three: <><Savanna t={t} pond={t < d * 0.55} /><G t={t} neck={t < d * 0.5 ? 1 - 0.3 * Math.max(0, Math.sin(t * 1.6)) : 1 - tw(t, d * 0.5, d * 0.62)} chew={t > d * 0.65 ? 1 : 0} />
      {t > d * 0.55 ? <Acacia pos={[4.2, 0, -3.5]} s={1.35} /> : null}</>,
    ov: <><Tag txt="pocos sorbos" x={500} y={300} op={fo(t, 0.5, d * 0.5)} /><Tag txt="agua de las hojas" x={600} y={300} op={fo(t, d * 0.6)} col="#2bb36b" /></>,
  }),
  puente_piernas: ({ t, d }) => ({
    keys: [[0, 3, 4, 6, 0, 2.5, 0], [d, 2, 0.6, 4, 0, 0.8, 0]],
    three: <><Savanna t={t} /><G t={t} /></>,
    ov: <Big txt="↓" x={1500} y={500} op={fo(t, 0.5)} col="#ffd23d" size={220} />,
  }),
  hinchazon: ({ t, d }) => ({
    keys: [[0, -2.5, 1.2, 4, -0.8, 0.9, 0], [d, -1.5, 0.9, 3.2, -0.8, 0.7, 0]],
    three: <><Savanna t={t} /><G t={t} xr={0.6} show={{ vert: 0, heart: 1, art: 1, jug: 0, brain: 0, legs: 1 }} swell={tw(t, d * 0.3, d * 0.7)} /></>,
    ov: <><Big txt="COMO GLOBOS" x={1350} y={450} op={fo(t, d * 0.5)} col={RED} size={110} /></>,
  }),
  media: ({ t, d }) => ({
    keys: [[0, 0, 0, 9, 0, 0, 0], [d * 0.5, 4, 1, 7, 0, 0, 0], [d, 3, -1, 6, 0, -0.5, 0]],
    three: <><color attach="background" args={['#f7ecd6']} /><LegCut t={t} skin={tw(t, d * 0.35, d * 0.5)} swell={1} arrows={tw(t, d * 0.5, d * 0.6)} /></>,
    ov: <><Tag txt="sin piel apretada" x={1450} y={250} op={fo(t, 0.4, d * 0.4)} col={RED} /><Tag txt="piel = media de compresión" x={1350} y={250} op={fo(t, d * 0.5)} col="#1fb5a5" /></>,
  }),
  traje: ({ t, d }) => ({
    keys: [[0, 0, 6, 14, 0, 7, 0], [d, -2, 7, 12, 0, 7.5, 0]],
    three: <><Savanna t={t} /><Jet pos={[lerp(-14, 14, cl(t / d)), 8 + Math.sin(t) * 0.3, -2]} s={1.4} rot={[0, 0, 0.05]} /><G pos={[2, 0, -1]} t={t} /><Human pos={[-2.2, 0, 1]} rotY={0.3} t={t} /></>,
    ov: <><Tag txt="medias de vuelo" x={500} y={820} op={fo(t, d * 0.2)} /><Tag txt="traje de piloto" x={960} y={230} op={fo(t, d * 0.55)} /></>,
  }),
  arterias_piernas: ({ t, d }) => ({
    keys: [[0, 2.5, 1.2, 3.5, 0.5, 1, 0], [d * 0.5, 1, 0.8, 3, 0, 0.9, 0], [d, -1.5, 1.2, 3.5, -0.5, 1, 0]],
    three: <><Savanna t={t} /><G t={t} xr={0.75} show={{ vert: 0, heart: 1, art: 1, jug: 0, brain: 0, legs: 1 }} flow={1} /></>,
    ov: <Tag txt="paredes gruesas" x={1400} y={300} op={fo(t, d * 0.3)} col={RED} />,
  }),
  puente_genes: ({ t, d }) => ({
    keys: [[0, 0, 0, 7, 0, 0, 0], [d, 2, 1, 6, 0, 0, 0]],
    three: <><color attach="background" args={['#203a52']} /><DNA t={t} s={1.3} /></>,
    ov: <Big txt="ADN" x={1450} y={540} op={fo(t, 0.6)} col="#ffd23d" size={170} />,
  }),
  genes: ({ t, d }) => ({
    keys: [[0, 0, 0, 6, 0, 0, 0], [d * 0.5, -3, 1, 5, 0, 0, 0], [d, -2, -1, 4, 0, 0, 0]],
    three: <><color attach="background" args={['#203a52']} /><DNA t={t} s={1.3} /></>,
    ov: <><Tag txt="2016: genoma completo" x={960} y={220} op={fo(t, 0.5)} /><Tag txt="huesos" x={1450} y={450} op={fo(t, d * 0.4)} /><Tag txt="corazón y vasos" x={1450} y={600} op={fo(t, d * 0.55)} col={RED} /></>,
  }),
  juntos: ({ t, d }) => ({
    keys: [[0, 3, 3, 12, 0, 2.5, 0], [d, -3, 4, 13, 0, 2.8, 0]],
    three: <><Savanna t={t} />{[0, 1, 2].map((k) => <G key={k} pos={[-4 + k * 4, 0, -k * 0.5]} s={0.6 + k * 0.2} t={t} seed={k} xr={0.8} flow={1} show={{ vert: 0, heart: 1, art: 1, jug: 0, brain: 1 }} />)}</>,
    ov: <><Tag txt="millones de años →" x={960} y={230} op={fo(t, d * 0.3)} /></>,
  }),
  lengua: ({ t, d }) => ({
    keys: [[0, 3.2, 5.0, 4.2, 1.9, 4.9, 0], [d * 0.5, 2.6, 4.9, 3.4, 1.9, 4.85, 0], [d, 2.2, 5.1, 3.9, 1.8, 4.9, 0]],
    three: <><Savanna t={t} /><Acacia pos={[4.6, 0, -4.5]} s={1.4} /><G t={t} tongue={tw(t, d * 0.25, d * 0.4) * (0.7 + 0.3 * Math.sin(t * 3))} chew={1} /></>,
    ov: <><Tag txt="45 cm" x={1350} y={600} op={fo(t, d * 0.4)} col="#5b3f8a" size={60} /><Tag txt="color oscuro = protección del sol" x={960} y={220} op={fo(t, d * 0.65)} size={40} /></>,
  }),
  acacia: ({ t, d }) => ({
    keys: [[0, 6, 4.5, 8, 2.6, 4.3, -1.5], [d, 3.5, 4.8, 7.5, 2.6, 4.5, -1.5]],
    three: <><Savanna t={t} /><Acacia pos={[4.2, 0, -3.5]} s={1.35} />{Array.from({ length: 12 }).map((_, k) => <mesh key={k} position={[4.2 + Math.cos(k) * 2, 4.4 + (k % 3) * 0.1, -3.5 + Math.sin(k) * 1.5]} rotation={[0, 0, k]}><coneGeometry args={[0.03, 0.3, 6]} /><meshToonMaterial color="#f3ead2" /></mesh>)}<G t={t} tongue={0.5 + 0.3 * Math.sin(t * 2.5)} chew={1} /></>,
    ov: <Tag txt="espinas" x={1450} y={300} op={fo(t, d * 0.3)} col={RED} />,
  }),
  dormir: ({ t, d }) => ({
    keys: [[0, 3, 2.5, 9, 0, 2, 0], [d * 0.5, 0, 2, 8, 0, 1.5, 0], [d * 0.75, -3, 1.6, 6, 0, 1, 0], [d, -4.5, 3, 4.5, 0.5, 1.1, 0]],
    three: <><Savanna t={t} /><G t={t} lie={tw(t, d * 0.45, d * 0.7)} blink={false} /></>,
    ov: <><Tag txt="siestas cortas" x={500} y={300} op={fo(t, 0.5, d * 0.45)} /><Tag txt="unos minutos" x={1400} y={300} op={fo(t, d * 0.7)} /><Big txt="z z" x={1250 + Math.sin(t * 2) * 30} y={480 - (t % 2) * 40} op={fo(t, d * 0.75) * (0.6 + 0.4 * Math.sin(t * 3))} col="#ffffff" size={90} /></>,
  }),
  leon: ({ t, d }) => ({
    keys: [[0, -8, 2, 6, -4, 1, 0], [d * 0.5, -3, 4, 10, -2, 2, 0], [d, 1.5, 5.5, 4, -6, 1, 0]],
    three: <><Savanna t={t} /><G t={t} /><Lion pos={[lerp(-12, -6, tw(t, 0, d * 0.7)), 0, 1.5]} t={t} walk={t < d * 0.7 ? 1 : 0} crouch={tw(t, d * 0.7, d * 0.8)} /></>,
    ov: <><Big txt="!" x={1500} y={300} op={fo(t, d * 0.6)} col={RED} size={200} /></>,
  }),
  peligro: ({ t, d }) => {
    const n = Math.round(lerp(12, 7, tw(t, d * 0.35, d * 0.6)));
    return {
      keys: [[0, 0, 7, 16, 0, 1.5, 0], [d, 4, 6, 14, 0, 1.5, 0]],
      three: <><Savanna t={t} />{Array.from({ length: 12 }).map((_, k) => k < n ? <G key={k} pos={[-7.5 + (k % 6) * 3, 0, -2 + Math.floor(k / 6) * 3]} s={0.45} t={t} seed={k} walk={0.5} /> : null)}</>,
      ov: <><Big txt={`${Math.round(lerp(0, 117, tw(t, 0.3, 2.3)))}.000`} y={300} op={fo(t, 0.3)} col="#ffd23d" size={140} /><Tag txt="VULNERABLE" x={960} y={900} op={fo(t, d * 0.65)} col={RED} size={60} /></>,
    };
  },
  cuidar: ({ t, d }) => ({
    keys: [[0, 0, 3, 12, 0, 2.5, 0], [d, 3, 4, 11, 0, 2.8, 0]],
    three: <><Savanna t={t} /><G t={t} pos={[0, 0, 0]} /><G t={t} pos={[-3, 0, -2]} s={0.55} seed={3} walk={1} /><Human pos={[4, 0, 2]} rotY={-1} t={t} wave={1} /></>,
    ov: <><Tag txt="proteger la sabana" x={500} y={250} op={fo(t, d * 0.2)} col="#2bb36b" /><Tag txt="frenar la caza ilegal" x={1400} y={250} op={fo(t, d * 0.45)} col={RED} /></>,
  }),
  resumen: ({ t, d }) => ({
    keys: [[0, 4, 3, 9, 0.6, 2.8, 0], [d * 0.5, 0, 3.5, 9, 0.6, 3, 0], [d, -3, 3, 9, 0.6, 2.8, 0]],
    three: <><Savanna t={t} /><G t={t} xr={0.85} flow={1} valve={0.5} show={{ vert: 1, heart: 1, art: 1, jug: 1, brain: 1, rete: 1, legs: 1 }} /></>,
    ov: <>{['corazón grueso', 'presión alta', 'válvulas', 'red de vasos', 'piernas apretadas'].map((s, k) => <Tag key={k} txt={s} x={k % 2 ? 1560 : 360} y={250 + k * 140} op={fo(t, d * (0.1 + k * 0.15))} col={k === 1 ? RED : INK} size={40} />)}</>,
  }),
  pregunta: ({ t, d }) => ({
    keys: [[0, 2.5, 5.2, 3.5, 1.5, 5, 0], [d, 4, 5.5, 5, 1.5, 5, 0]],
    three: <><Savanna t={t} /><G t={t} /></>,
    ov: <Big txt="¿?" x={500} y={500} op={fo(t, 0.5)} col="#ffd23d" size={240} />,
  }),
  cierre: ({ t, d }) => ({
    keys: [[0, 2, 3, 11, 0.3, 2.7, 0], [d, -2, 3.3, 10, 0.3, 2.8, 0]],
    three: <><Savanna t={t} /><G t={t} /><Human pos={[3, 0, 1.5]} rotY={-0.5} t={t} wave={1} /></>,
    ov: <><Big txt="SUSCRÍBETE" y={220} op={fo(t, 0.5)} col={RED} size={130} /><Tag txt="y activa la campana" x={960} y={380} op={fo(t, 1.2)} size={50} /></>,
  }),
};
export const RED_CAPS = new Set(['manguera', 'peligro_bajar', 'hinchazon', 'leon', 'peligro', 'subir']);
