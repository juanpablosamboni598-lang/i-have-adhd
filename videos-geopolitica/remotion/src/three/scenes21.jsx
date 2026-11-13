import React from 'react';
import { cl, tw, lerp, drop, Part, Tube, Flow, INK } from './kit.jsx';
import { Human } from './world20.jsx';
import { Tag, Big } from './scenes20.jsx';
import { B, Room, Drain, Gas, Flies, Hole, Lid, Bowl, Tank, Bucket, House, Crown, Bottles, DualButton, Wipes, Drops } from './world21.jsx';

const RED = '#e2483d', GREEN = '#2bb36b';
const fo = (t, a, b) => tw(t, a, a + 0.5) * (b === undefined ? 1 : 1 - tw(t, b - 0.5, b));
const ALL = { supply: 1, valve: 1, float: 1, overflow: 1, hole: 1, flap: 1, lever: 1 };
// cámaras
const FULL = (d, s = 1) => [[0, 0.8 * s, 0.25, 3.6, 0.25, -0.1, 0], [d * 0.5, 0.25 * s, 0.35, 3.3, 0.25, -0.05, 0], [d, -0.3 * s, 0.2, 3.5, 0.25, -0.1, 0]];
const UNDER = (d) => [[0, 1.1, -0.2, 2.4, 0.35, -0.55, 0.2], [d * 0.5, 0.6, -0.5, 2.0, 0.3, -0.6, 0.2], [d, -0.1, -0.3, 2.3, 0.3, -0.55, 0.2]];
const TANKC = (d) => [[0, 0.8, 1.0, 1.6, 0, 0.72, -0.33], [d * 0.5, 0.3, 0.85, 1.3, 0, 0.72, -0.33], [d, -0.5, 1.0, 1.5, 0, 0.72, -0.33]];
const MID = (d) => [[0, 1.2, 1.0, 2.8, 0.1, 0.45, 0], [d * 0.5, 0.3, 0.9, 2.4, 0.1, 0.45, 0], [d, -0.8, 1.1, 2.7, 0.1, 0.45, 0]];
const man = (t, x = -1.0, p = {}) => <Human pos={[x, 0, -0.1]} rotY={0.6} s={0.6} t={t} {...p} />;

// ciclo de descarga completo: devuelve estado según u (0..1)
const flush = (t, a, d0 = 1.2) => {
  const h = t < a ? 0 : t < a + 0.5 ? 1 : 0;
  const fl = t < a ? 0 : t < a + 0.3 ? tw(t, a, a + 0.3) : t < a + d0 + 0.6 ? 1 : 1 - tw(t, a + d0 + 0.6, a + d0 + 0.9);
  const lv = t < a + 0.2 ? 1 : t < a + d0 + 0.6 ? 1 - 0.92 * tw(t, a + 0.2, a + d0 + 0.6) : 0.08 + 0.92 * tw(t, a + d0 + 0.9, a + d0 + 4);
  const sw = t > a + 0.3 && t < a + d0 + 1.5 ? (t - a) * 4 : 0;
  const si = t > a + 0.7 && t < a + d0 + 1.2 ? 1 : 0;
  return { handle: h, flap: fl, level: lv, swirl: sw, siphon: si, fill: lv < 0.98 && t > a + d0 + 0.9 ? 1 : 0 };
};
const Full = ({ t, st = { level: 1 }, xr = 0.85, bowlXr = 0.6, paper = 0, extra = {} }) => <>
  <Room t={t} />
  <Drain s={1} trapWater={st.siphon ? 0 : 1} siphon={st.siphon || 0} t={t} />
  <Bowl xr={bowlXr} water={st.siphon ? 0.15 : 0.3} swirl={st.swirl || 0} paper={paper} t={t} />
  <Tank xr={xr} level={st.level} on={ALL} flap={st.flap || 0} handle={st.handle || 0} t={t} fillFlow={st.fill || 0} {...extra} />
</>;

export const S21 = {
  apertura: ({ t, d }) => {
    const up = t > d * 0.62 ? (t - d * 0.62) * 5 : 0;
    const st = flush(t, d * 0.3);
    return {
      keys: [[0, 0.9, 0.3, 3.7, 0.25, -0.05, 0], [d * 0.5, 0.2, 0.4, 3.2, 0.25, 0, 0], [d, -0.5, 0.3, 3.5, 0.25, -0.05, 0]],
      three: <><Room t={t} />
        <group position={[0, (1 - drop(t, 0.2, 0.8)) * 3 + up, 0]}><Drain s={1} trapWater={st.siphon ? 0 : 1} siphon={st.siphon} t={t} /></group>
        <group position={[0, (1 - drop(t, 0.5, 0.8)) * 3 + up * 1.2, 0]}><Bowl xr={0.6} swirl={st.swirl} t={t} /></group>
        <group position={[0, (1 - drop(t, 0.8, 0.8)) * 3 + up * 1.4, 0]}><Tank xr={tw(t, 1.6, 2.2) * 0.85} level={st.level} on={ALL} flap={st.flap} handle={st.handle} t={t} fillFlow={st.fill} /></group></>,
      ov: <><Big txt="DESDE CERO" y={300} op={fo(t, d * 0.66)} col="#ffd23d" size={140} /></>,
    };
  },
  titulo: ({ t, d }) => ({
    keys: [[0, 0.2, 1.0, 4.6, -0.3, 0.6, 0], [d, -0.6, 1.1, 4.2, -0.3, 0.6, 0]],
    three: <><Room t={t} />{man(t, lerp(-3.2, -0.6, tw(t, 0.3, d * 0.5)), { wave: tw(t, d * 0.55, d * 0.65) })}</>,
    ov: <><Big txt="¿CÓMO FUNCIONA" y={240} size={110} op={tw(t, 0.6, 1.1)} col="#ffffff" /><Big txt="UN INODORO?" y={380} size={130} op={tw(t, 1.0, 1.5)} col="#ffd23d" /><Tag txt="prueba y error" x={960} y={520} op={fo(t, 2)} col={RED} size={50} /></>,
  }),
  hoyo: ({ t, d }) => ({
    keys: FULL(d),
    three: <><Room t={t} sewer={0} /><Hole on={tw(t, 0.3, 0.9)} fill={tw(t, d * 0.35, d * 0.7) * 0.8} /><Flies t={t} on={tw(t, d * 0.55, d * 0.65)} c={[0, 0.35, Z0]} />{man(t, -1.05, { dizzy: tw(t, d * 0.5, d * 0.6) })}</>,
    ov: <><Tag txt="miles de años" x={500} y={250} op={fo(t, 0.8, d * 0.45)} /><Big txt="✗" x={1450} y={400} op={fo(t, d * 0.7)} col={RED} size={200} /></>,
  }),
  tubo: ({ t, d }) => ({
    keys: FULL(d, -1),
    three: <><Room t={t} /><group position={[0, (1 - drop(t, 0.3, 0.9)) * 3, 0]}><Drain s={0} down={tw(t, d * 0.4, d * 0.5)} t={t} /></group>{man(t, -1.05, { wave: tw(t, d * 0.55, d * 0.6) })}</>,
    ov: <><Tag txt="→ alcantarilla" x={1450} y={820} op={fo(t, d * 0.35)} /><Big txt="✓" x={1500} y={330} op={fo(t, d * 0.55, d * 0.85)} col={GREEN} size={200} /><Tag txt="¿seguro?" x={1450} y={330} op={fo(t, d * 0.87)} col={RED} /></>,
  }),
  gases: ({ t, d }) => ({
    keys: FULL(d),
    three: <><Room t={t} /><Drain s={0} t={t} /><Gas t={t} on={tw(t, 0.6, 1.4)} />{man(t, -1.05, { dizzy: tw(t, d * 0.4, d * 0.5) })}</>,
    ov: <><Tag txt="gases de la alcantarilla" x={1300} y={300} op={fo(t, d * 0.25)} col={RED} /><Big txt="✗" x={1550} y={550} op={fo(t, d * 0.65)} col={RED} size={200} /></>,
  }),
  tapa: ({ t, d }) => ({
    keys: MID(d),
    three: <><Room t={t} /><Drain s={0} t={t} /><Lid y={(1 - drop(t, 0.3, 0.8)) * 2 + (t > d * 0.45 ? Math.max(0, Math.sin(t * 7)) * 0.03 : 0)} tilt={t > d * 0.45 ? Math.sin(t * 7) * 0.08 : 0} />
      <Gas t={t} on={t > d * 0.45 ? 0.5 : 0} x={0.27} /><Gas t={t + 1.3} on={t > d * 0.45 ? 0.5 : 0} x={-0.27} />{man(t, -1.1, { dizzy: tw(t, d * 0.55, d * 0.6) })}</>,
    ov: <><Tag txt="hay que quitarla" x={500} y={250} op={fo(t, d * 0.3, d * 0.6)} /><Tag txt="se escapa por los bordes" x={1350} y={250} op={fo(t, d * 0.6)} col={RED} /></>,
  }),
  curva: ({ t, d }) => {
    const s = t > d * 0.3 ? 1 : 0;
    return {
      keys: [[0, 1.3, 0.3, 3.5, 0.35, -0.4, 0], [d * 0.5, 0.8, -0.3, 2.6, 0.3, -0.5, 0.2], [d, 0.0, -0.2, 2.5, 0.3, -0.5, 0.2]],
      three: <><Room t={t} /><group position={[0, s ? (1 - drop(t, d * 0.3, 0.7)) * 2 : 0, 0]}><Drain s={s} trapWater={s ? tw(t, d * 0.45, d * 0.6) : 0} t={t} /></group><Gas t={t} on={1} block={t > d * 0.6 ? 1 : 0} x={t > d * 0.6 ? 0.8 : 0} /></>,
      ov: <><Tag txt="forma de S" x={1400} y={260} op={fo(t, d * 0.35)} /><Tag txt="el agua tapa el paso" x={1400} y={380} op={fo(t, d * 0.65)} col={GREEN} /></>,
    };
  },
  sello: ({ t, d }) => ({
    keys: UNDER(d),
    three: <><Room t={t} /><Drain s={1} trapWater={1} t={t} /><Gas t={t} on={1} block={1} x={0.8} /><Bowl y={(1 - drop(t, d * 0.4, 0.8)) * 2} xr={0.6} t={t} /></>,
    ov: <><Tag txt="sello de agua" x={1300} y={300} op={fo(t, 0.5)} col="#3f7fe0" size={56} /><Tag txt="Alexander Cumming, 1775" x={960} y={880} op={fo(t, d * 0.65)} /></>,
  }),
  empujar: ({ t, d }) => ({
    keys: MID(d),
    three: <><Room t={t} /><Drain s={1} trapWater={1} t={t} /><Bowl xr={0.5} paper={tw(t, 0.5, 1.2)} t={t} /></>,
    ov: <><Tag txt="se queda flotando" x={1400} y={280} op={fo(t, d * 0.2, d * 0.55)} col={RED} /><Big txt="AGUA" x={1400} y={420} op={fo(t, d * 0.65)} col="#46a6f0" size={150} /></>,
  }),
  balde: ({ t, d }) => {
    const p = tw(t, d * 0.2, d * 0.32) * (1 - tw(t, d * 0.45, d * 0.5));
    return {
      keys: [[0, 0.4, 1.0, 3.0, -0.3, 0.4, 0], [d * 0.5, -0.4, 0.9, 2.6, -0.2, 0.4, 0], [d, -1.2, 1.1, 2.8, -0.4, 0.4, 0]],
      three: <><Room t={t} /><Drain s={1} trapWater={1} down={p} t={t} /><Bowl xr={0.5} paper={1 - tw(t, d * 0.3, d * 0.45)} paperY={-tw(t, d * 0.3, d * 0.45) * 0.3} swirl={p ? t * 4 : 0} t={t} />
        <Bucket pos={[-0.55, 0.5, 0.25]} tilt={p * 1.6} water={1 - tw(t, d * 0.25, d * 0.45)} pour={p} t={t} />{man(t, -1.05, { dizzy: tw(t, d * 0.65, d * 0.75) })}</>,
      ov: <><Big txt="✓" x={1500} y={330} op={fo(t, d * 0.4, d * 0.6)} col={GREEN} size={180} /><Tag txt="10 L = 10 kg" x={1350} y={330} op={fo(t, d * 0.62)} col={RED} size={56} /></>,
    };
  },
  tanque: ({ t, d }) => ({
    keys: [[0, 1.2, 1.2, 3.2, 0, 0.6, -0.2], [d * 0.5, 0.4, 1.0, 2.6, 0, 0.6, -0.2], [d, -0.6, 1.2, 2.8, 0, 0.6, -0.2]],
    three: <><Room t={t} /><Drain s={1} trapWater={1} t={t} /><Bowl xr={0.5} t={t} /><group position={[0, (1 - drop(t, 0.4, 0.9)) * 2.5, 0]}><Tank xr={tw(t, d * 0.4, d * 0.5) * 0.85} level={1} on={{}} t={t} /></group></>,
    ov: <><Tag txt="gravedad ↓" x={1450} y={450} op={fo(t, d * 0.55)} /><Tag txt="agua lista" x={1450} y={300} op={fo(t, d * 0.35)} col="#3f7fe0" /></>,
  }),
  llave: ({ t, d }) => {
    const lv = tw(t, d * 0.35, d * 0.85);
    return {
      keys: TANKC(d),
      three: <><Room t={t} /><Bowl xr={0.5} t={t} /><Tank level={lv} on={{ supply: 1, valve: 1 }} tapOpen={tw(t, d * 0.25, d * 0.35)} fillFlow={t > d * 0.35 ? 1 : 0} t={t} /></>,
      ov: <><Tag txt="llave abierta" x={500} y={300} op={fo(t, d * 0.3)} col={GREEN} /><Tag txt={`${Math.round(lv * 6)} L`} x={1500} y={300} op={fo(t, d * 0.35)} size={60} /></>,
    };
  },
  desborde: ({ t, d }) => {
    const lv = 1 + 0.08 * tw(t, 0.4, d * 0.4);
    const pud = tw(t, d * 0.35, d);
    return {
      keys: [[0, 0.6, 1.0, 1.8, 0, 0.6, -0.2], [d * 0.5, 1.0, 0.8, 2.4, 0, 0.4, 0], [d, 1.4, 1.3, 3.2, 0, 0.2, 0]],
      three: <><Room t={t} /><Bowl xr={0.5} t={t} /><Tank level={lv} on={{ supply: 1, valve: 1 }} tapOpen={1} fillFlow={1} spill={tw(t, d * 0.3, d * 0.4)} t={t} />
        <mesh position={[0, 0.006, 0.1]} rotation={[-Math.PI / 2, 0, 0]} scale={[pud * 1.6, pud * 1.2, 1]}><circleGeometry args={[1, 32]} /><meshToonMaterial color="#8fd0ff" transparent opacity={0.8} /></mesh></>,
      ov: <><Big txt="¡INUNDACIÓN!" y={300} op={fo(t, d * 0.55)} col={RED} size={110} /></>,
    };
  },
  flotador: ({ t, d }) => ({
    keys: TANKC(d),
    three: <><Room t={t} /><Bowl xr={0.5} t={t} /><Tank level={lerp(0.25, 0.8, tw(t, 0.5, d))} on={{ supply: 1, valve: 1, float: t > d * 0.2 ? 1 : 0 }} tapOpen={1} fillFlow={1} t={t} /></>,
    ov: <><Tag txt="bola hueca" x={1450} y={300} op={fo(t, d * 0.3)} col="#ff8a3d" size={56} /><Tag txt="sube con el agua ↑" x={1450} y={420} op={fo(t, d * 0.6)} /></>,
  }),
  brazo: ({ t, d }) => {
    const lv = lerp(0.8, 1, tw(t, 0.3, d * 0.55));
    return {
      keys: [[0, 0.5, 0.95, 1.2, -0.08, 0.78, -0.33], [d * 0.5, 0.2, 0.9, 1.0, -0.1, 0.8, -0.33], [d, -0.3, 0.95, 1.2, -0.08, 0.78, -0.33]],
      three: <><Room t={t} /><Tank level={lv} on={{ supply: 1, valve: 1, float: 1 }} tapOpen={1} fillFlow={lv < 0.99 ? 1 : 0} t={t} /></>,
      ov: <><Tag txt="brazo" x={700} y={330} op={fo(t, d * 0.2)} /><Tag txt="¡se cierra solo!" x={1350} y={300} op={fo(t, d * 0.6)} col={GREEN} size={56} /></>,
    };
  },
  solo: ({ t, d }) => {
    const st = flush(t, d * 0.15, 1.0);
    return {
      keys: [[0, 0.9, 1.0, 2.0, 0, 0.6, -0.2], [d, -0.6, 1.1, 2.0, 0, 0.6, -0.2]],
      three: <><Room t={t} /><Bowl xr={0.5} swirl={st.swirl} t={t} /><Tank level={st.level} on={{ supply: 1, valve: 1, float: 1, hole: 1, flap: 1 }} flap={st.flap} fillFlow={st.fill} tapOpen={1} t={t} /></>,
      ov: <><Big txt="✓" x={1500} y={350} op={fo(t, d * 0.7)} col={GREEN} size={200} /></>,
    };
  },
  falla: ({ t, d }) => ({
    keys: TANKC(d),
    three: <><Room t={t} /><Bowl xr={0.5} t={t} /><Tank level={1 + 0.08 * tw(t, d * 0.3, d * 0.6)} on={{ supply: 1, valve: 1, float: 1 }} floatStuck={t > d * 0.2 ? 1 : 0} fillFlow={1} tapOpen={1} spill={tw(t, d * 0.55, d * 0.65)} t={t} /></>,
    ov: <><Tag txt="atascado" x={1450} y={300} op={fo(t, d * 0.25)} col={RED} size={56} /><Big txt="✗" x={500} y={420} op={fo(t, d * 0.65)} col={RED} size={200} /></>,
  }),
  rebose: ({ t, d }) => ({
    keys: [[0, 0.9, 1.0, 1.7, 0.05, 0.65, -0.2], [d * 0.5, 0.3, 0.8, 1.5, 0.05, 0.6, -0.1], [d, -0.4, 0.9, 1.8, 0.05, 0.6, -0.1]],
    three: <><Room t={t} /><Bowl xr={0.5} t={t} /><Tank level={1} on={{ supply: 1, valve: 1, float: 1, overflow: t > d * 0.15 ? 1 : 0 }} floatStuck={1} fillFlow={1} tapOpen={1} t={t} /></>,
    ov: <><Tag txt="tubo de rebose" x={1450} y={280} op={fo(t, d * 0.2)} col="#1fb5a5" size={52} /><Tag txt="sobra → a la taza" x={1450} y={400} op={fo(t, d * 0.5)} /><Big txt="✓" x={500} y={420} op={fo(t, d * 0.75)} col={GREEN} size={180} /></>,
  }),
  agujero: ({ t, d }) => ({
    keys: TANKC(d),
    three: <><Room t={t} /><Bowl xr={0.5} swirl={t > d * 0.4 ? t * 3 : 0} t={t} /><Tank level={t < d * 0.4 ? 1 : 1 - 0.95 * tw(t, d * 0.4, d * 0.8)} on={{ supply: 1, valve: 1, float: 1, overflow: 1, hole: t > d * 0.2 ? 1 : 0 }} flap={t > d * 0.4 && t < d * 0.85 ? 1 : 0} t={t} /></>,
    ov: <><Tag txt="se sale enseguida" x={1400} y={300} op={fo(t, d * 0.55)} col={RED} /></>,
  }),
  compuerta: ({ t, d }) => ({
    keys: [[0, 0.5, 0.8, 1.1, 0.02, 0.6, -0.33], [d * 0.5, 0.1, 0.75, 0.95, 0.02, 0.6, -0.33], [d, -0.4, 0.8, 1.1, 0.02, 0.6, -0.33]],
    three: <><Room t={t} /><Tank level={tw(t, d * 0.3, d * 0.9) * 0.9 + 0.05} on={{ supply: 1, valve: 1, float: 1, overflow: 1, hole: 1, flap: t > d * 0.15 ? 1 : 0 }} fillFlow={1} tapOpen={1} t={t} /></>,
    ov: <><Tag txt="compuerta de goma" x={1400} y={280} op={fo(t, d * 0.2)} col={RED} /><Tag txt="sapito · pera" x={1400} y={400} op={fo(t, d * 0.6)} /></>,
  }),
  palanca: ({ t, d }) => {
    const h = t > d * 0.5 && t < d * 0.75 ? 1 : 0;
    return {
      keys: [[0, 0.3, 1.0, 1.5, -0.1, 0.75, -0.33], [d * 0.5, -0.2, 0.95, 1.3, -0.1, 0.75, -0.33], [d, -0.6, 1.05, 1.5, -0.05, 0.72, -0.33]],
      three: <><Room t={t} /><Bowl xr={0.5} t={t} /><Tank level={1 - (h ? 0.15 * tw(t, d * 0.5, d * 0.75) : 0)} on={{ ...ALL, lever: t > d * 0.15 ? 1 : 0 }} handle={h} flap={h} t={t} /></>,
      ov: <><Tag txt="palanca" x={600} y={300} op={fo(t, d * 0.2)} /><Tag txt="cadena" x={1350} y={300} op={fo(t, d * 0.35)} /></>,
    };
  },
  flota: ({ t, d }) => {
    const st = flush(t, d * 0.25, d * 0.5);
    return {
      keys: [[0, 0.5, 0.75, 1.0, 0.02, 0.6, -0.33], [d * 0.5, 0.15, 0.7, 0.9, 0.02, 0.6, -0.33], [d, -0.3, 0.75, 1.0, 0.02, 0.6, -0.33]],
      three: <><Room t={t} /><Tank level={st.level} on={ALL} handle={st.handle} flap={st.flap} t={t} /></>,
      ov: <><Tag txt="aire por dentro" x={1400} y={280} op={fo(t, d * 0.3)} /><Tag txt="un toque basta" x={1400} y={400} op={fo(t, d * 0.65)} col={GREEN} /></>,
    };
  },
  cierra: ({ t, d }) => {
    const st = flush(t, -0.5, d * 0.3);
    return {
      keys: TANKC(d),
      three: <><Room t={t} /><Bowl xr={0.5} t={t} /><Tank level={st.level} on={ALL} flap={st.flap} fillFlow={st.fill} t={t} /></>,
      ov: <><Tag txt="cae y tapa" x={1400} y={280} op={fo(t, d * 0.3)} /><Tag txt="se vuelve a llenar" x={1400} y={400} op={fo(t, d * 0.6)} col="#3f7fe0" /></>,
    };
  },
  prueba: ({ t, d }) => {
    const st = flush(t, d * 0.2, 1.2);
    return {
      keys: MID(d),
      three: <Full t={t} st={{ ...st, siphon: 0 }} paper={1} />,
      ov: <><Tag txt="sin fuerza" x={1400} y={300} op={fo(t, d * 0.6)} col={RED} size={56} /><Big txt="?" x={500} y={420} op={fo(t, d * 0.75)} col={RED} size={200} /></>,
    };
  },
  sifon: ({ t, d }) => ({
    keys: [[0, 1.2, 0.4, 3.2, 0.35, -0.2, 0], [d * 0.5, 0.6, 0.0, 2.6, 0.35, -0.35, 0.1], [d, 0.0, 0.2, 2.8, 0.35, -0.3, 0.1]],
    three: <><Room t={t} /><Drain s={1} trapWater={t > d * 0.5 ? 0 : 1} siphon={t > d * 0.5 ? 1 : 0} t={t} /><Bowl xr={0.6} water={t > d * 0.5 ? lerp(0.36, 0.12, tw(t, d * 0.5, d * 0.8)) : lerp(0.3, 0.36, tw(t, d * 0.2, d * 0.5))} swirl={t > d * 0.2 ? t * 4 : 0} paper={1 - tw(t, d * 0.55, d * 0.75)} paperY={-tw(t, d * 0.55, d * 0.75) * 0.3} t={t} /></>,
    ov: <><Tag txt="tubo lleno" x={1450} y={300} op={fo(t, d * 0.35)} /><Big txt="SIFÓN" x={1450} y={450} op={fo(t, d * 0.55)} col="#46a6f0" size={140} /></>,
  }),
  manguera: ({ t, d }) => ({
    keys: [[0, 0.2, 0.7, 3.2, 0, 0.4, 0], [d, -0.4, 0.8, 3.0, 0, 0.4, 0]],
    three: <><Room t={t} sewer={0} />
      <Part geo={<boxGeometry args={[0.6, 0.7, 0.6]} />} color={B.wood} pos={[-0.8, 0.35, 0.2]} t={0.015} />
      <Bucket pos={[-0.8, 0.7, 0.2]} water={1 - 0.6 * tw(t, d * 0.3, d)} t={t} /><Bucket pos={[0.8, 0, 0.2]} water={0.2 + 0.6 * tw(t, d * 0.3, d)} t={t} />
      <Tube pts={[[-0.8, 0.85, 0.2], [-0.6, 1.25, 0.2], [-0.3, 1.0, 0.2], [0.5, 0.6, 0.2], [0.8, 0.2, 0.2]]} r={0.025} color="#2f8a4a" />
      <Flow pts={[[-0.8, 0.85, 0.2], [-0.6, 1.25, 0.2], [-0.3, 1.0, 0.2], [0.5, 0.6, 0.2], [0.8, 0.2, 0.2]]} t={t} n={14} speed={0.7} r={0.03} color="#8fd0ff" on={tw(t, d * 0.25, d * 0.35)} /></>,
    ov: <><Tag txt="baja y jala lo de atrás" x={960} y={250} op={fo(t, d * 0.5)} /></>,
  }),
  glup: ({ t, d }) => ({
    keys: UNDER(d),
    three: <><Room t={t} /><Drain s={1} trapWater={t > d * 0.35 ? tw(t, d * 0.35, d * 0.6) : 0} siphon={t < d * 0.3 ? 1 : 0} t={t} /><Bowl xr={0.6} water={t < d * 0.35 ? 0.12 : lerp(0.12, 0.3, tw(t, d * 0.4, d * 0.8))} t={t} />
      {t > d * 0.25 && t < d * 0.5 ? <Flow pts={[[0.6, -0.3, 0.2], [0.3, -0.5, 0.2], [0, 0.1, 0.2], [0, 0.5, 0.2]]} t={t} n={8} speed={1.2} r={0.04} color="#ffffff" on={1} /> : null}</>,
    ov: <><Big txt="¡GLUP!" x={1400} y={350} op={fo(t, d * 0.3, d * 0.6)} col="#ffd23d" size={160} /><Tag txt="el sello vuelve" x={1400} y={350} op={fo(t, d * 0.65)} col={GREEN} size={56} /></>,
  }),
  ventilacion: ({ t, d }) => ({
    keys: [[0, 2, 2.2, 8, 0.6, 1.3, 0], [d * 0.5, 0, 2.0, 7.5, 0.6, 1.4, 0], [d, -2, 2.4, 7.8, 0.6, 1.5, 0]],
    three: <><color attach="background" args={['#bfe6f5']} /><mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}><circleGeometry args={[30, 32]} /><meshToonMaterial color="#e9cf7c" /></mesh><House t={t} air={tw(t, d * 0.45, d * 0.55)} /></>,
    ov: <><Tag txt="lavamanos" x={1150} y={560} op={fo(t, d * 0.25)} /><Tag txt="tubo de ventilación" x={1350} y={180} op={fo(t, d * 0.45)} col="#1fb5a5" size={52} /></>,
  }),
  harington: ({ t, d }) => ({
    keys: [[0, 0.8, 1.0, 3.0, 0, 0.6, 0], [d, -0.8, 1.1, 2.8, 0, 0.6, 0]],
    three: <><Room t={t} sewer={0} /><Bowl xr={0} water={0.3} t={t} /><Part geo={<boxGeometry args={[0.6, 0.5, 0.3]} />} color={B.wood} pos={[0, 1.0, -0.35]} t={0.015} /><Crown pos={[0.9, 1.1 + Math.sin(t * 2) * 0.05, 0.3]} s={0.6} t={t} />
      <Gas t={t} on={tw(t, d * 0.65, d * 0.75)} /></>,
    ov: <><Big txt="1596" x={500} y={300} op={fo(t, 0.5)} col="#ffd23d" size={160} /><Tag txt="John Harington" x={500} y={480} op={fo(t, d * 0.2)} /><Tag txt="sin sello de agua ✗" x={1350} y={850} op={fo(t, d * 0.65)} col={RED} /></>,
  }),
  crapper: ({ t, d }) => ({
    keys: FULL(d),
    three: <Full t={t} />,
    ov: <><Tag txt="Cumming: sello" x={450} y={250} op={fo(t, d * 0.15)} /><Tag txt="mejoras al flotador" x={450} y={380} op={fo(t, d * 0.3)} /><Big txt="MITO" x={1450} y={400} op={fo(t, d * 0.6)} col={RED} size={170} /></>,
  }),
  litros: ({ t, d }) => ({
    keys: [[0, 0, 0.8, 3.4, 0, 0.35, 0.6], [d, 0.6, 0.9, 3.2, 0, 0.35, 0.6]],
    three: <><Room t={t} sewer={0} /><Bottles n={12} pos={[0, 0, 0.1]} grow={tw(t, 0.4, d * 0.3)} /><Bottles n={6} pos={[0, 0, 0.6]} grow={tw(t, d * 0.4, d * 0.55)} /><Bottles n={3} pos={[0, 0, 1.0]} grow={tw(t, d * 0.65, d * 0.75)} /></>,
    ov: <><Tag txt="viejos: +12 L" x={1500} y={330} op={fo(t, d * 0.25)} col={RED} /><Tag txt="modernos: 6 L" x={1500} y={480} op={fo(t, d * 0.5)} /><Tag txt="corta: 3 L" x={1500} y={630} op={fo(t, d * 0.72)} col={GREEN} /></>,
  }),
  doble: ({ t, d }) => ({
    keys: [[0, 0.3, 1.25, 0.9, 0, 0.96, -0.33], [d * 0.5, -0.1, 1.2, 0.8, 0, 0.96, -0.33], [d, 0.4, 1.4, 1.6, 0, 0.8, -0.33]],
    three: <><Room t={t} /><Tank xr={0} level={1} t={t} /><DualButton press={t > d * 0.25 && t < d * 0.4 ? 1 : t > d * 0.55 && t < d * 0.7 ? 2 : 0} /></>,
    ov: <><Tag txt="3 L" x={760} y={600} op={fo(t, d * 0.25)} col={GREEN} size={60} /><Tag txt="6 L" x={1160} y={600} op={fo(t, d * 0.55)} col="#3f7fe0" size={60} /><Tag txt="miles de litros al año" x={960} y={250} op={fo(t, d * 0.75)} /></>,
  }),
  fuga: ({ t, d }) => ({
    keys: [[0, 0.8, 1.2, 2.0, 0, 0.6, -0.15], [d * 0.5, 0.3, 1.0, 1.8, 0, 0.55, -0.1], [d, -0.3, 1.0, 1.9, 0, 0.5, 0]],
    three: <><Room t={t} /><Bowl xr={0.3} dye={t > d * 0.75 ? 1 : 0} t={t} /><Tank level={0.98} on={ALL} dye={t > d * 0.45 ? 1 : 0} t={t} fillFlow={Math.sin(t * 2) > 0.6 ? 1 : 0} /><Drops t={t} on={t > d * 0.35 && t < d * 0.5 ? 1 : 0} /></>,
    ov: <><Tag txt="colorante" x={1400} y={250} op={fo(t, d * 0.35)} col="#ff2f7a" /><Big txt="¡FUGA!" x={1400} y={420} op={fo(t, d * 0.78)} col={RED} size={140} /></>,
  }),
  toallitas: ({ t, d }) => ({
    keys: [[0, 1.0, 0.6, 3.0, 0.3, -0.1, 0], [d * 0.5, 0.6, 0.0, 2.4, 0.3, -0.4, 0.2], [d, 0.0, -0.1, 2.4, 0.3, -0.45, 0.2]],
    three: <><Room t={t} /><Drain s={1} trapWater={1} clog={tw(t, d * 0.4, d * 0.7)} t={t} /><Bowl xr={0.6} water={0.3 + 0.08 * tw(t, d * 0.6, d)} t={t} /><Wipes t={t} on={t < d * 0.6 ? 1 : 0} /></>,
    ov: <><Tag txt="no se deshacen" x={1400} y={280} op={fo(t, d * 0.3)} col={RED} /><Big txt="NO" x={500} y={420} op={fo(t, d * 0.7)} col={RED} size={200} /></>,
  }),
  repaso: ({ t, d }) => {
    const L = ['hoyo', 'tubo', 'curva', 'tanque', 'flotador', 'rebose', 'compuerta', 'palanca', 'sifón'];
    const k = Math.min(8, Math.floor(t / d * 9.5));
    return {
      keys: [[0, 0.8, 0.3, 3.6, 0.25, -0.05, 0], [d, -0.5, 0.35, 3.5, 0.25, 0, 0]],
      three: <><Room t={t} />{k >= 1 ? <Drain s={k >= 2 ? 1 : 0} trapWater={k >= 2 ? 1 : 0} siphon={k >= 8 ? 1 : 0} t={t} /> : <Hole />}{k >= 2 ? <Bowl xr={0.6} t={t} /> : null}
        {k >= 3 ? <Tank level={1} on={{ supply: 1, valve: 1, float: k >= 4 ? 1 : 0, overflow: k >= 5 ? 1 : 0, hole: k >= 6 ? 1 : 0, flap: k >= 6 ? 1 : 0, lever: k >= 7 ? 1 : 0 }} t={t} /> : null}</>,
      ov: <>{L.map((s, j) => <Tag key={j} txt={s} x={j < 5 ? 260 : 1660} y={230 + (j % 5) * 130} op={j <= k ? 1 : 0} col={j === k ? RED : INK} size={40} />)}</>,
    };
  },
  resumen: ({ t, d }) => ({
    keys: FULL(d),
    three: <Full t={t} st={flush(t, d * 0.25, 1.0)} />,
    ov: <><Tag txt="cada pieza arregla un fallo" x={960} y={880} op={fo(t, d * 0.3)} /></>,
  }),
  pregunta: ({ t, d }) => ({
    keys: [[0, 1.2, 1.0, 2.6, 0, 0.5, 0], [d, -1.0, 1.2, 2.6, 0, 0.5, 0]],
    three: <Full t={t} xr={0} bowlXr={0} />,
    ov: <><Big txt="¿?" x={480} y={450} op={fo(t, 0.5)} col="#ffd23d" size={220} /><Tag txt="sin motor · sin electricidad" x={1400} y={300} op={fo(t, d * 0.35)} /></>,
  }),
  cierre: ({ t, d }) => ({
    keys: [[0, 0.6, 1.0, 3.6, -0.2, 0.6, 0], [d, -0.6, 1.1, 3.4, -0.2, 0.6, 0]],
    three: <><Full t={t} xr={0} bowlXr={0} />{man(t, -1.0, { wave: 1 })}</>,
    ov: <><Big txt="SUSCRÍBETE" y={220} op={fo(t, 0.5)} col={RED} size={130} /><Tag txt="y activa la campana" x={960} y={380} op={fo(t, 1.2)} size={50} /></>,
  }),
};
const Z0 = 0.2;
export const RED_CAPS21 = new Set(['hoyo', 'gases', 'tapa', 'desborde', 'falla', 'agujero', 'prueba', 'toallitas']);
