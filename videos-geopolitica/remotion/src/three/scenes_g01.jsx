// Escenas del video de lanzamiento de ViceLeakss (GTA 6). Todo genérico y original.
import React from 'react';
import { cl, tw, lerp, drop } from './kit.jsx';
import { P, Studio, Confetti, Palm, City, Car, Console, Pad, Calendar, Coins, Case, Tag, Stamp, PC, Clock, Disk, Phone, Shield, Pings, Land, Pawn } from './world_g01.jsx';

const R = P.red, G = P.green;
const pop = (t, a, d = 0.35) => { const u = cl((t - a) / d); return u < 0.75 ? (u / 0.75) * 1.12 : 1.12 - 0.12 * ((u - 0.75) / 0.25); };
// órbita lenta alrededor de un punto
const ORB = (d, c = [0, 0.4, 0], r = 2.2, y = 1.0, a0 = 0.5, a1 = -0.5) => [0, 0.33, 0.66, 1].map((u) => {
  const a = lerp(a0, a1, u); return [d * u, c[0] + Math.sin(a) * r, y + Math.sin(u * 3) * 0.12, c[2] + Math.cos(a) * r, c[0], c[1], c[2]];
});

export const SG = {
  abre: ({ t, d }) => ({
    keys: [[0, 2.2, 1.6, 3.4, 0, 0.6, 0], [d * 0.35, 0.8, 0.9, 2.4, 0, 0.55, 0], [d * 0.7, -0.6, 0.75, 1.9, 0, 0.5, 0], [d, -1.4, 1.1, 2.4, 0, 0.55, 0]],
    three: <><Studio /><City t={t} pos={[0, 0, -0.9]} /><Palm pos={[-1.9, 0, -0.3]} t={t} /><Palm pos={[1.9, 0, -0.2]} t={t} s={0.9} />
      <Car pos={[lerp(-3, 3, ((t * 0.18) % 1)), 0, 0.55]} t={t} color={R} />
      <Calendar pos={[0, 0, 0.25]} label={'19\nNOV'} red={1} s={drop(t, 0.3, 0.6)} />
      <Confetti t={t} area={[4, 1.8, 2]} /></>,
    caps: [['jueves', 'este jueves', R], ['diecinueve', '19 de noviembre', R], ['trece', '13 años después'], ['confirmado', 'lo confirmado', G], ['rumor', 'y lo que es rumor', R]],
  }),
  retrasos: ({ t, d }) => {
    const f1 = tw(t, d * 0.3, d * 0.38), f2 = tw(t, d * 0.62, d * 0.7);
    const label = t < d * 0.34 ? '2025' : t < d * 0.66 ? '26\nMAY 2026' : '19\nNOV 2026';
    const prev = t < d * 0.34 ? '2025' : t < d * 0.66 ? '2025' : '26\nMAY 2026';
    const flip = t > d * 0.3 && t < d * 0.38 ? f1 : t > d * 0.62 && t < d * 0.7 ? f2 : 0;
    return {
      keys: [[0, 0.9, 0.75, 1.6, 0, 0.4, 0], [d * 0.3, -0.5, 0.6, 1.3, 0, 0.4, 0], [d * 0.65, 0.6, 0.55, 1.2, 0, 0.4, 0], [d, -0.2, 0.7, 1.45, 0, 0.42, 0]],
      three: <><Studio /><Calendar pos={[0, 0, 0]} label={flip ? prev : label} next={label} flip={flip} red={t > d * 0.66 ? 1 : 0} />
        <Stamp pos={[-0.42, 0.62, 0.12]} text="RETRASO" sc={pop(t, d * 0.33) * (t < d * 0.6 ? 1 : 0)} />
        <Stamp pos={[0.42, 0.25, 0.12]} text="RETRASO" sc={pop(t, d * 0.65) * (t < d * 0.88 ? 1 : 0)} rot={[0, 0, 0.18]} />
        <Stamp pos={[0, 0.95, 0.15]} text="FINAL" color={G} sc={pop(t, d * 0.88)} rot={[0, 0, -0.08]} />
        <Clock pos={[1.1, 0.9, -1.1]} t={t} spin={0.4} s={0.8} /><Confetti t={t} n={14} /></>,
      caps: [['veinticinco', '2025'], ['mayo', '26 de mayo 2026', R], ['noviembre', '19 de noviembre'], ['final', 'fecha final', G]],
    };
  },
  mundo: ({ t, d }) => ({
    keys: [[0, 0, 2.6, 1.6, 0, 0, 0], [d * 0.4, 1.0, 1.9, 1.5, 0, 0.05, 0], [d * 0.7, -0.6, 1.0, 1.6, 0.1, 0.2, 0], [d, 0.2, 0.7, 1.3, 0, 0.3, 0.1]],
    three: <><Studio /><Land pos={[0, 0, 0]} t={t} rise={tw(t, 0.2, 1.2)} />
      <group position={[0.25, 0.09, -0.35]}>{[[-0.15, 0.6], [0, 0.9], [0.15, 0.7], [0.3, 0.5]].map(([x, h], k) => <mesh key={k} position={[x, h * 0.25 * drop(t, 1 + k * 0.15, 0.5), 0]} castShadow><boxGeometry args={[0.1, h * 0.5 * drop(t, 1 + k * 0.15, 0.5) + 0.001, 0.1]} /><meshToonMaterial color={[P.pink, P.white, P.teal, P.yellow][k]} /></mesh>)}</group>
      <Palm pos={[-0.3, 0.09, 0.1]} s={0.35} t={t} /><Palm pos={[0.35, 0.09, 0.3]} s={0.3} t={t} />
      <Pawn pos={[-0.2, 0.09, 0.55]} color={P.purple} t={t} s={0.6 * pop(t, d * 0.6)} hop={1} />
      <Pawn pos={[0.15, 0.09, 0.6]} color={P.orange} t={t + 0.5} s={0.6 * pop(t, d * 0.75)} hop={1} />
      <Confetti t={t} n={16} y0={0.3} /></>,
    caps: [['leonida', 'Leonida'], ['florida', 'inspirado en Florida'], ['vice', 'Vice City'], ['primera', 'primera protagonista mujer', G]],
  }),
  consolas: ({ t, d }) => ({
    keys: ORB(d, [0, 0.35, 0], 1.7, 0.75, 0.6, -0.6),
    three: <><Studio /><Console pos={[-0.4, (1 - drop(t, 0.3, 0.6)) * 1.5, 0]} kind="a" glow={tw(t, 0.9, 1.2)} t={t} rotY={0.3} />
      <Console pos={[0.4, (1 - drop(t, d * 0.25, 0.6)) * 1.5, 0]} kind="b" color={P.dark} glow={tw(t, d * 0.3, d * 0.35)} t={t} rotY={-0.3} />
      <Pad pos={[-0.4, 0.04, 0.5]} rot={[0, 0.3 + Math.sin(t) * 0.1, 0]} color={P.white} /><Pad pos={[0.4, 0.04, 0.5]} rot={[0, -0.3 - Math.sin(t) * 0.1, 0]} />
      <group position={[1.25, 0, -0.3]} scale={pop(t, d * 0.65) * 0.8}><Console kind="b" color={P.metal} /><Stamp pos={[0, 0.35, 0.25]} text="NO" sc={1} /></group>
      <Confetti t={t} n={18} /></>,
    caps: [['playstation', 'PlayStation 5', G], ['xbox', 'Xbox Series X y S', G], ['únicas', 'solo esas dos'], ['pasada', 'generación pasada: no', R]],
  }),
  pc: ({ t, d }) => ({
    keys: [[0, 1.2, 0.9, 1.7, 0, 0.4, 0], [d * 0.4, 0.2, 0.6, 1.25, 0, 0.42, 0], [d * 0.75, -0.7, 0.7, 1.4, 0, 0.4, 0], [d, -0.2, 0.85, 1.6, 0, 0.42, 0]],
    three: <><Studio /><PC pos={[0, 0, 0]} t={t} screen={t < d * 0.45 ? '?' : '2027?'} />
      <Stamp pos={[0.62, 0.6, 0.25]} text="RUMOR" sc={pop(t, d * 0.45) * 0.7} />
      <Calendar pos={[-1.1, 0, -0.2]} label={'2027'} s={0.6 * pop(t, d * 0.35)} rotY={0.4} />
      <group position={[1.05, 0, -0.1]} scale={pop(t, d * 0.75) * 0.7}><Console kind="a" /></group>
      <Confetti t={t} n={14} /></>,
    caps: [['computador', '¿y en PC?'], ['anunciado', 'no anunciado', R], ['rumor', '2027 = rumor', R], ['medio', 'GTA 5: año y medio después']],
  }),
  precio: ({ t, d }) => ({
    keys: [[0, 0.8, 0.8, 1.6, 0, 0.35, 0], [d * 0.45, -0.6, 0.6, 1.3, 0, 0.35, 0], [d, 0.5, 0.9, 1.5, 0, 0.4, 0]],
    three: <><Studio /><Coins pos={[-0.45, 0, 0]} n={8} t={t} at={0.3} /><Coins pos={[0.45, 0, 0]} n={10} t={t} at={d * 0.35} color="#e8b730" />
      <Tag pos={[-0.45, 0.6, 0.15]} text="$79.99" sc={pop(t, d * 0.25)} /><Tag pos={[0.45, 0.72, 0.15]} text="$99.99" color="#ffe9a8" sc={pop(t, d * 0.45)} />
      <group position={[0, 1.0 - tw(t, d * 0.75, d * 0.85) * 0.2, -0.3]}><Tag text="$100" color={P.white} fg={R} sc={pop(t, d * 0.7)} /></group>
      <Confetti t={t} n={16} /></>,
    caps: [['estándar', 'estándar $79,99', G], ['ultimate', 'Ultimate $99,99'], ['cien', '¿$100? no se cumplió', R]],
  }),
  edicion: ({ t, d }) => ({
    keys: [[0, 0.0, 0.55, 1.4, 0, 0.3, 0], [d * 0.4, 0.7, 0.6, 1.2, 0, 0.3, 0], [d * 0.75, -0.6, 0.5, 1.15, 0, 0.3, 0], [d, 0.1, 0.65, 1.35, 0, 0.32, 0]],
    three: <><Studio /><Case pos={[-0.35, 0, 0]} rot={[0, 0.25 + Math.sin(t) * 0.05, 0]} label="ESTÁNDAR" s={drop(t, 0.2, 0.5)} />
      <Case pos={[0.35, 0, 0]} rot={[0, -0.25 - Math.sin(t) * 0.05, 0]} label="ULTIMATE" gold={1} s={drop(t, d * 0.3, 0.5)} />
      <group position={[0, 0.02, 0.35]} rotation={[0, 0, Math.sin(t * 1.5) * 0.08 * (1 - tw(t, d * 0.7, d * 0.8)) + (t > d * 0.8 ? -0.12 : 0)]}>
        <mesh castShadow><boxGeometry args={[1.0, 0.025, 0.08]} /><meshToonMaterial color={P.metal} /></mesh></group>
      <Tag pos={[0.35, 0.62, 0.12]} text="+$20" fg={R} sc={pop(t, d * 0.4) * 0.6} />
      
      <Confetti t={t} n={14} /></>,
    caps: [['completo', 'juego completo', G], ['veinte', '+20 dólares'], ['historia', 'solo historia: estándar', G]],
  }),
  hora: ({ t, d }) => ({
    keys: [[0, 0.0, 0.9, 1.5, 0, 0.75, -0.2], [d * 0.4, 0.6, 0.85, 1.2, 0, 0.75, -0.2], [d * 0.75, -0.6, 0.8, 1.3, 0, 0.7, -0.2], [d, 0.2, 0.95, 1.6, 0, 0.72, -0.2]],
    three: <><Studio /><Clock pos={[0, 0.75, -0.2]} t={t} h={11} m={30} spin={cl(1 - t / (d * 0.4)) * 0.8 + 0.02} s={1.2} />
      <Console pos={[-0.85, 0, 0.1]} kind="a" glow={tw(t, d * 0.4, d * 0.45)} t={t} rotY={0.4} />
      
      <Phone pos={[0.85, 0.35, 0.25]} rot={[0, -0.4, 0]} screen={'TIENDA'} fg={P.teal2} s={pop(t, d * 0.78) * 0.8} />
      <Confetti t={t} n={14} /></>,
    caps: [['hora', '¿a qué hora?'], ['medianoche', 'medianoche hora local'], ['confirmar', 'sin confirmar', R], ['tienda', 'revisa tu tienda', G]],
  }),
  espacio: ({ t, d }) => {
    const fill = lerp(0.35, 0.97, tw(t, d * 0.15, d * 0.55)) - 0.45 * tw(t, d * 0.75, d * 0.95);
    return {
      keys: [[0, 0.7, 0.75, 1.5, 0, 0.5, 0], [d * 0.5, -0.5, 0.6, 1.2, 0, 0.5, 0], [d, 0.4, 0.8, 1.45, 0, 0.5, 0]],
      three: <><Studio /><Disk pos={[0, 0.5, 0]} fill={fill} />
        {Array.from({ length: 6 }).map((_, k) => { const u = ((t * 0.35 + k / 6) % 1); return t < d * 0.55 ? <mesh key={k} position={[lerp(-1.3, -0.4, u), 0.9 - u * 0.4, 0.05]} castShadow><boxGeometry args={[0.12, 0.12, 0.12]} /><meshToonMaterial color={P.teal} /></mesh> : null; })}
        <Stamp pos={[0.25, 0.78, 0.12]} text="¿200 GB?" sc={pop(t, d * 0.3) * 0.5} rot={[0, 0, -0.1]} /><Console pos={[1.05, 0, -0.25]} kind="b" color={P.dark} glow={tw(t, d * 0.8, d * 0.9)} t={t} rotY={-0.4} s={0.8} />
        {Array.from({ length: 5 }).map((_, k) => t > d * 0.75 ? <mesh key={k} position={[0.7 + (t - d * 0.75) * 1.5 + k * 0.15, 0.5 + Math.sin(k) * 0.1 - (t - d * 0.75) * 0.6, 0.05]} rotation={[t * 3, t * 2, 0]}><boxGeometry args={[0.1, 0.1, 0.1]} /><meshToonMaterial color={P.metal} /></mesh> : null)}
        <Confetti t={t} n={12} /></>,
      caps: [['espacio', 'prepara espacio'], ['doscientos', '¿+200 GB? sin confirmar', R], ['enorme', 'juego enorme'], ['libera', 'libera espacio', G]],
    };
  },
  spoilers: ({ t, d }) => ({
    keys: [[0, 0.9, 1.0, 1.9, 0, 0.55, 0], [d * 0.45, -0.7, 0.8, 1.5, 0, 0.55, 0], [d, 0.2, 0.75, 1.3, 0, 0.55, 0]],
    three: <><Studio /><Phone pos={[0, 0.55, 0]} screen={t < d * 0.6 ? '!' : '✓'} fg={t < d * 0.6 ? R : G} />
      <Pings t={t} on={1 - tw(t, d * 0.55, d * 0.65)} target={[0, 0.55, 0]} />
      <Shield pos={[0, 0.12, 0]} t={t} sc={tw(t, d * 0.5, d * 0.62) * 1.1} />
      <Pad pos={[0.6, 0.04, 0.4]} rot={[0, -0.4, 0]} s={pop(t, d * 0.8)} />
      <Confetti t={t} n={14} /></>,
    caps: [['spoilers', 'cuidado: spoilers', R], ['silencia', 'silencia palabras'], ['apaga', 'apaga recomendaciones'], ['primero', 'juega tú primero', G]],
  }),
  cierre: ({ t, d }) => ({
    keys: [[0, 0, 1.2, 2.6, 0, 0.45, 0], [d * 0.5, 1.4, 1.0, 2.2, 0, 0.45, 0], [d, -1.5, 1.2, 2.4, 0, 0.45, 0]],
    three: <><Studio /><Calendar pos={[-1.05, 0, 0]} label={'19\nNOV'} red={1} s={0.7 * pop(t, 0.2)} rotY={0.35} />
      <Console pos={[-0.35, 0, 0]} kind="a" glow={1} t={t} s={pop(t, d * 0.15)} /><Console pos={[0.15, 0, 0]} kind="b" color={P.dark} glow={1} t={t} s={pop(t, d * 0.2)} />
      <Tag pos={[0.75, 0.55, 0.1]} text="$79.99" sc={pop(t, d * 0.3) * 0.8} /><PC pos={[1.35, 0, -0.2]} screen="?" rotY={-0.4} />
      <Stamp pos={[1.3, 0.72, 0.1]} text="RUMOR" sc={pop(t, d * 0.45) * 0.5} />
      <Confetti t={t} n={30} area={[4, 2, 2]} /></>,
    caps: [['resumen', 'resumen'], ['jueves', 'jueves 19', R], ['ochenta', '$80 la estándar'], ['rumor', 'lo demás: rumor', R], ['comentarios', '¿lo juegas el día 1?']],
  }),
};
