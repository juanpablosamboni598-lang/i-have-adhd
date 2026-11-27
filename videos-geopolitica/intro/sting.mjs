// Sting de marca Xseng (1,6 s) hecho con RaveAnima por MCP. Va DESPUÉS del gancho, nunca al inicio.
import { readFileSync, writeFileSync } from 'node:fs';
const RA = process.env.RAVEANIMA || '/home/user/vibecoderkz/raveanima';
const { Client } = await import(RA + '/node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.js');
const { StdioClientTransport } = await import(RA + '/node_modules/@modelcontextprotocol/sdk/dist/esm/client/stdio.js');
const S = process.argv[2]; // carpeta con x_*.svg (partes_xeno.py)
const OUT = process.argv[3] || '/root/raveanima_out/sting_xseng';
const c = new Client({ name: 'sting', version: '1' });
await c.connect(new StdioClientTransport({ command: 'node', args: [RA + '/packages/headless/dist/anima.js', 'mcp'] }));
const call = async (name, args) => { const r = await c.callTool({ name, arguments: args });
  const txt = r.content.filter((p) => p.type === 'text').map((p) => p.text).join('\n');
  if (r.isError) throw new Error(name + ': ' + txt); return { txt, img: r.content.find((p) => p.type === 'image') }; };
const run = (command, params) => call('command_run', { command, params });
const idOf = (r) => (r.txt.match(/"id"\s*:\s*"(n\d+)"/) || [])[1];
const add = async (type, props, parent) => idOf(await run('node.add', parent ? { type, props, parent } : { type, props }));

const W = 1920, H = 1080, CY = '#38E8FF', MG = '#FF3FA4', NAVY = '#0B0A24', OUTL = '#120E22';
await run('doc.new', { name: 'Sting Xseng', width: W, height: H, background: NAVY, fps: 30 });
const cam = await add('group', { name: 'camara' });
await add('rect', { name: 'fondo', width: 2600, height: 1500, fill: { type: 'radial', center: { x: 300, y: -80 }, radius: 1300, stops: [{ offset: 0, color: '#3B1E7A' }, { offset: 0.5, color: '#16123F' }, { offset: 1, color: NAVY }] }, transform: { x: W / 2, y: H / 2 } }, cam);
const glowC = await add('ellipse', { name: 'glow_cian', width: 900, height: 900, fill: CY, opacity: 0.35, blur: 160, transform: { x: 470, y: 420 } }, cam);
const glowM = await add('ellipse', { name: 'glow_magenta', width: 1000, height: 700, fill: MG, opacity: 0.3, blur: 180, transform: { x: 1450, y: 700 } }, cam);
// rayos de velocidad
const rayos = [];
for (let k = 0; k < 7; k++) rayos.push(await add('rect', { name: 'raya' + k, width: 520 + (k % 3) * 160, height: 6 + (k % 2) * 4, cornerRadius: 4, fill: k % 2 ? CY : '#FFFFFF', opacity: 0.0, transform: { x: 1400, y: 160 + k * 120 } }, cam));
// Xeno grande a la izquierda (cortado por la cintura)
const imp = async (f, name) => idOf(await call('command_run', { command: 'import.svg', params: { svg: readFileSync(`${S}/${f}`, 'utf8'), x: 60, y: 60, width: 820, parent: cam, name } }));
const cuerpo = await imp('x_cuerpo.svg', 'xeno_cuerpo');
const caraS = await imp('x_cabeza_sorprendido.svg', 'xeno_sorprendido');
const caraR = await imp('x_cabeza_riendo.svg', 'xeno_riendo');
const xeno = idOf(await run('node.group', { ids: [cuerpo, caraS, caraR], name: 'xeno' }));
// el importador no trae los <text> del SVG: repongo el "?" de la gorra y del buzo
const qG = { fontWeight: 900, fill: '#1A1424', align: 'center' };
await add('text', { name: 'q_gorra', text: '?', fontSize: 74, ...qG, transform: { x: 487, y: 212 } }, xeno);
await add('text', { name: 'q_buzo', text: '?', fontSize: 120, fontWeight: 900, fill: '#FFFFFF', stroke: { paint: '#1A1424', width: 4, join: 'round' }, align: 'center', transform: { x: 490, y: 860 } }, xeno);
// rayo de energía desde los ojos
const rayo = await add('rect', { name: 'rayo', width: 1250, height: 34, cornerRadius: 17, fill: { type: 'linear', from: { x: -625, y: 0 }, to: { x: 625, y: 0 }, stops: [{ offset: 0, color: '#FFFFFF' }, { offset: 0.3, color: CY }, { offset: 1, color: CY + '00' }] }, shadow: { color: CY, x: 0, y: 0, blur: 40 }, transform: { x: 570, y: 425 } }, cam);
// textos
const marca = await add('text', { name: 'marca', text: 'XSENG', fontSize: 230, fontWeight: 900, letterSpacing: 8, fill: '#FFFFFF', stroke: { paint: OUTL, width: 7, join: 'round' }, shadow: { color: CY, x: 0, y: 0, blur: 50 }, align: 'center', transform: { x: 1370, y: 470 } }, cam);
const sub = await add('text', { name: 'sub', text: '¿QUÉ PASARÍA SI…?', fontSize: 84, fontWeight: 900, fill: '#FFD23F', stroke: { paint: OUTL, width: 4, join: 'round' }, align: 'center', transform: { x: 1370, y: 640, rotation: -3 } }, cam);
const flash = await add('rect', { name: 'flash', width: 2600, height: 1500, fill: '#FFFFFF', opacity: 0, transform: { x: W / 2, y: H / 2 } });
const negro = await add('rect', { name: 'negro', width: 2600, height: 1500, fill: '#000000', opacity: 0, transform: { x: W / 2, y: H / 2 } });

await run('anim.new', { name: 'Sting', duration: 1.6, loop: 'none' });
const b = [];
const K = (nodeId, prop, time, value, ease = 'easeInOut') => b.push({ command: 'keyframe.set', params: { nodeId, prop, time, value, ease } });
// flash de entrada
K(flash, 'opacity', 0, 0.9, 'easeOut'); K(flash, 'opacity', 0.15, 0);
// Xeno entra desde la izquierda con rebote, cara sorprendida -> riendo
K(xeno, 'transform.x', 0, -700, 'backOut'); K(xeno, 'transform.x', 0.35, 0);
K(caraS, 'opacity', 0, 1, 'hold'); K(caraS, 'opacity', 0.55, 0, 'hold');
K(caraR, 'opacity', 0, 0, 'hold'); K(caraR, 'opacity', 0.55, 1, 'hold');
K(xeno, 'transform.rotation', 0.35, -4, 'easeOut'); K(xeno, 'transform.rotation', 0.55, 2); K(xeno, 'transform.rotation', 0.8, 0);
// rayo que dispara desde los ojos
K(rayo, 'width', 0, 1, 'hold'); K(rayo, 'width', 0.3, 1, 'easeOut'); K(rayo, 'width', 0.5, 1350);
K(rayo, 'transform.x', 0, 570, 'hold'); K(rayo, 'transform.x', 0.3, 570, 'easeOut'); K(rayo, 'transform.x', 0.5, 1245);
K(rayo, 'opacity', 0, 0, 'hold'); K(rayo, 'opacity', 0.3, 1, 'hold');
K(rayo, 'opacity', 0.5, 1); K(rayo, 'opacity', 0.75, 0);
// marca: golpe de escala
K(marca, 'transform.scaleX', 0, 0, 'hold'); K(marca, 'transform.scaleY', 0, 0, 'hold');
K(marca, 'transform.scaleX', 0.45, 0, 'backOut'); K(marca, 'transform.scaleY', 0.45, 0, 'backOut');
K(marca, 'transform.scaleX', 0.7, 1); K(marca, 'transform.scaleY', 0.7, 1);
K(sub, 'opacity', 0, 0, 'hold'); K(sub, 'opacity', 0.65, 0, 'easeOut'); K(sub, 'opacity', 0.8, 1);
K(sub, 'transform.y', 0.65, 720, 'backOut'); K(sub, 'transform.y', 0.85, 640);
// rayas de velocidad
rayos.forEach((r, k) => { const t0 = 0.05 + k * 0.03; K(r, 'opacity', t0, 0.8); K(r, 'opacity', t0 + 0.35, 0);
  K(r, 'transform.x', t0, 2300, 'easeOut'); K(r, 'transform.x', t0 + 0.4, -200); });
// glows que laten
K(glowC, 'opacity', 0.3, 0.2); K(glowC, 'opacity', 0.5, 0.6); K(glowC, 'opacity', 1.2, 0.35);
K(glowM, 'opacity', 0.5, 0.2); K(glowM, 'opacity', 0.75, 0.5);
// cámara: empujón suave y salida con zoom
K(cam, 'transform.scaleX', 0, 1.06); K(cam, 'transform.scaleY', 0, 1.06);
K(cam, 'transform.scaleX', 1.25, 1, 'easeIn'); K(cam, 'transform.scaleY', 1.25, 1, 'easeIn');
K(cam, 'transform.scaleX', 1.6, 1.25); K(cam, 'transform.scaleY', 1.6, 1.25);
K(negro, 'opacity', 1.3, 0, 'easeIn'); K(negro, 'opacity', 1.6, 1);
await call('command_batch', { steps: b });

const sheet = await call('render_contact_sheet', { mode: 'even', count: 8 });
if (sheet.img) writeFileSync(`${S}/sting_contacto.png`, Buffer.from(sheet.img.data, 'base64'));
console.log((await call('export', { path: OUT + '.anima' })).txt);
console.log((await call('export', { path: OUT + '.mp4' })).txt);
await c.close();
