import React from 'react';
import { W, H, camera, layerT, Backdrop, Rays, Snow, Seabed, Surface, Cover, transFor, Header, cl, ramp } from './lib.jsx';

// Escena con capas: fondo (parallax lento) · rayos · mundo (1x) · partículas · primer plano (rápido) · luz · HUD · transiciones
export function Stage({ t, f, frames, i, n = 48, title, cam: camSpec = {}, env = {}, light = 1, lightX, children, back, front, hud, seed }) {
  const dur = frames / 30;
  const sd = seed ?? i * 17 + 5;
  const cam = camera(t, dur, sd, camSpec);
  const L = typeof light === 'function' ? light(t) : light;
  const lx = lightX ? lightX(t) : 960 + 500 * Math.sin(t * 0.35 + i);
  const outP = i < n - 1 ? ramp(f, frames - 9, frames - 1) : 0;
  const inP = i > 0 ? 1 - ramp(f, 0, 10) : 0;
  const fgOn = env.fg !== false;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, background: '#03142a' }}>
      <defs>
        <filter id="blur6" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6" /></filter>
        <filter id="blur14" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14" /></filter>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <radialGradient id="spot" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff6dc" stopOpacity="0.22" /><stop offset="1" stopColor="#fff6dc" stopOpacity="0" /></radialGradient>
        <radialGradient id="vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.55" /></radialGradient>
      </defs>
      {env.custom ? env.custom(cam) : <Backdrop cam={cam} t={t} theme={env.theme || 'blue'} seed={sd} ridges={env.ridges !== false} fish={env.fish !== false} />}
      {env.rays !== false && <Rays cam={cam} t={t} seed={sd} strength={env.rayStrength ?? 1} />}
      {back && <g transform={layerT(cam, 0.6)}>{back}</g>}
      <Snow cam={cam} t={t} seed={sd} n={55} p={0.55} size={0.8} op={0.4} />
      <g transform={layerT(cam, 1)}>
        {env.surface !== undefined && <Surface t={t} y={env.surface} />}
        {env.seabed !== undefined && <Seabed t={t} seed={sd} y={env.seabed} light={L} />}
        {children}
      </g>
      {front && <g transform={layerT(cam, 1.35)}>{front}</g>}
      {fgOn && <Snow cam={cam} t={t} seed={sd + 1} n={14} p={1.6} size={4.5} op={0.35} blur />}
      {/* luz dinámica: foco que se mueve + oscuridad/flash según la acción */}
      <ellipse cx={lx} cy={300} rx={900} ry={700} fill="url(#spot)" />
      {L < 1 && <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="#000814" opacity={cl((1 - L) * 0.85)} />}
      {L > 1 && <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="#ffffff" opacity={cl(L - 1)} />}
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#vig)" />
      {hud && hud(cam)}
      {title && <Header text={title} t={t} />}
      <Cover type={transFor(i - 1)} p={inP} t={t} />
      <Cover type={transFor(i)} p={outP} t={t} />
    </svg>
  );
}
