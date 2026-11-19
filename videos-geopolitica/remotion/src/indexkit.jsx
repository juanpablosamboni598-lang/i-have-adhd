// Muestra del kit 2D v2: la escena "firma" (laboratorio) rehecha con luz, objetos, profundidad y grano.
import React from 'react';
import { registerRoot, Composition, useCurrentFrame, AbsoluteFill } from 'remotion';
import { Person, Xeno } from './xeno.jsx';
import { W, H, Grain, Grade, Vignette, BlurG, Shadow, Room, CeilLamp, Ventana, Repisa, Reloj, Planta, Poster, Monitor, Mesa, Microscopio, Matraz, Portapapeles, Cables, FrontLeaves } from './kit2d.jsx';

const FONT = 'Inter Display, Inter, Arial, sans-serif';
const Billete = ({ x, y, s = 1, r = 0 }) => <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
  <rect x="-110" y="-50" width="220" height="100" rx="10" fill="#8CCB8A" /><rect x="-110" y="-50" width="220" height="12" rx="6" fill="#A6DBA2" />
  <circle cx="0" cy="0" r="30" fill="#BDE3B6" /><text x="0" y="12" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="34" fill="#2F6B2D">100</text></g>;

const Firma = ({ t }) => <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
  {/* fondo (más lejos, un poco desenfocado) */}
  <BlurG s={1.6}>
    <Room wall={['#E4ECF1', '#C9D6E0']} floor={['#A9B8C6', '#8395A6']} fy={790} />
    <Ventana x={120} y={170} w={440} h={320} view="ciudad" t={t} />
    <Poster x={640} y={190} c="#3FB8AF" tipo="copo" />
    <Repisa x={930} y={300} w={420} items="libros" /><Repisa x={930} y={470} w={420} items="frascos" />
    <Reloj x={1480} y={230} t={t} />
    <Monitor x={1520} y={360} t={t} />
    <Cables pts="M1600 600 Q1620 700 1700 720 T1900 760" />
    <Person x={1560} y={800} s={0.55} exp="pensativo" pose="sostiene" t={t} pin={false} coat hair="moño" jacket="#fff" />
    <Shadow x={1560} y={800} w={70} h={12} />
    <Person x={420} y={800} s={0.52} exp="neutral" pose="normal" t={t + 1} pin={false} coat hair="largo" flip />
    <Shadow x={420} y={800} w={66} h={12} />
    <Planta x={1820} y={800} s={1.1} t={t} />
  </BlurG>
  <CeilLamp x={520} l={60} /><CeilLamp x={1380} l={60} />
  {/* plano medio: mesa de laboratorio */}
  <Mesa x={520} y={720} w={900} />
  <Microscopio x={1300} y={720} s={1.1} />
  <Matraz x={1180} y={720} s={0.9} c="#5CC8F0" t={t} /><Matraz x={1105} y={720} s={0.7} c="#F2B134" t={t + 0.5} />
  <g transform="translate(860 690) rotate(-4)"><rect x="-150" y="-26" width="300" height="52" rx="4" fill="#FBF8F1" />
    {[0, 1].map((k) => <rect key={k} x="-130" y={-14 + k * 14} width={200 - k * 60} height="6" rx="3" fill="#C9CED6" />)}
    <path d={`M-60 14 q20 -26 34 0 t34 0 t40 -6`} stroke="#2E5BD6" strokeWidth="4" fill="none" strokeDasharray="200" strokeDashoffset={200 * (1 - Math.min(1, Math.max(0, (t - 0.8) / 1.2)))} /></g>
  <Billete x={1010} y={655} s={0.62} r={8} />
  <Portapapeles x={620} y={660} r={-10} />
  <Shadow x={700} y={1010} w={190} h={24} o={0.35} />
  <Xeno x={700} y={1000} s={0.95} exp="serio" pose="explica" t={t} />
  {/* primer plano */}
  <FrontLeaves side="right" t={t} />
  <Grade c="#FFC27A" o={0.14} /><Vignette o={0.4} /><Grain o={0.06} />
</svg>;

const Muestra = () => { const f = useCurrentFrame(); const t = f / 30; return <AbsoluteFill style={{ background: '#000' }}>
  <Firma t={t} />
  <div style={{ position: 'absolute', left: 48, top: 40, padding: '12px 26px', borderRadius: 40, background: 'rgba(20,26,40,0.78)', color: '#fff', fontFamily: FONT, fontWeight: 900, fontSize: 26, letterSpacing: 2.5, backdropFilter: 'blur(4px)' }}>
    <span style={{ color: '#FFD23F', marginRight: 10 }}>●</span>ESCENARIO 1 · LA CÁPSULA</div>
  <div style={{ position: 'absolute', right: 48, top: 40, padding: '12px 26px', borderRadius: 40, background: 'rgba(20,26,40,0.78)', color: '#FFD23F', fontFamily: FONT, fontWeight: 900, fontSize: 26, letterSpacing: 2.5 }}>AÑO 2026</div>
  <div style={{ position: 'absolute', bottom: 70, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 60, WebkitTextStroke: '9px #10131C', paintOrder: 'stroke fill' }}>
    <span style={{ color: '#fff', margin: '0 12px' }}>Así</span><span style={{ color: '#fff', margin: '0 12px' }}>que</span><span style={{ color: '#FFD23F', margin: '0 12px' }}>firmas</span></div>
</AbsoluteFill>; };

registerRoot(() => <Composition id="KIT-FIRMA" component={Muestra} durationInFrames={90} fps={30} width={W} height={H} />);
