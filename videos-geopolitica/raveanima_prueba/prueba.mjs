// Prueba de RaveAnima por MCP: escenario + Xeno importado + fotogramas clave + cámara + transición + MP4.
import { readFileSync, writeFileSync } from 'node:fs';
import { Client } from '/home/user/vibecoderkz/raveanima/node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.js';
import { StdioClientTransport } from '/home/user/vibecoderkz/raveanima/node_modules/@modelcontextprotocol/sdk/dist/esm/client/stdio.js';
const D = '/tmp/claude-0/-home-user-i-have-adhd/b44a631c-aa93-5a06-8553-5375e2a18dfb/scratchpad/rave/';
const t = new StdioClientTransport({ command: 'node', args: ['/home/user/vibecoderkz/raveanima/packages/headless/dist/anima.js', 'mcp'] });
const c = new Client({ name: 'prueba', version: '1' }); await c.connect(t);
const call = async (name, args) => { const r = await c.callTool({ name, arguments: args });
  const txt = r.content.filter((p) => p.type === 'text').map((p) => p.text).join('\n'); const img = r.content.find((p) => p.type === 'image');
  if (r.isError) throw new Error(name + ': ' + txt); return { txt, img, json: (() => { try { return JSON.parse(txt); } catch { return null; } })() }; };
const run = (command, params) => call('command_run', { command, params });
const idOf = (r) => r.json?.id ?? r.json?.result?.id ?? (r.txt.match(/"id"\s*:\s*"(n\d+)"/) || [])[1];

await run('doc.new', { name: 'Prueba Xeno', width: 1280, height: 720, background: '#8FD0FF', fps: 24 });
const cam = idOf(await run('node.add', { type: 'group', props: { name: 'camara' } }));
const add = async (type, props) => idOf(await run('node.add', { type, props, parent: cam }));
await add('rect', { name: 'cielo', width: 1700, height: 1000, fill: { type: 'linear', from: { x: 0, y: -500 }, to: { x: 0, y: 500 }, stops: [{ offset: 0, color: '#6EC3FF' }, { offset: 1, color: '#FFE3B8' }] }, transform: { x: 640, y: 360 } });
const sol = await add('ellipse', { name: 'sol', width: 150, height: 150, fill: '#FFD23F', shadow: { color: '#FFD23F', x: 0, y: 0, blur: 60 }, transform: { x: 1080, y: 130 } });
const cols = ['#F08A72', '#7CC0D0', '#F2C46A', '#B79CFF', '#8AC07A', '#E8A0C0'];
for (let k = 0; k < 6; k++) { const h = 220 + (k * 53) % 140; await add('rect', { name: 'edificio' + k, width: 230, height: h, cornerRadius: 6, fill: cols[k], stroke: { paint: '#1A1424', width: 5 }, transform: { x: 120 + k * 210, y: 560 - h / 2 } });
  for (let j = 0; j < 4; j++) await add('rect', { width: 46, height: 46, cornerRadius: 4, fill: '#FFF3D8', stroke: { paint: '#1A1424', width: 3 }, transform: { x: 120 + k * 210 + (j % 2 ? 45 : -45), y: 560 - h + 60 + Math.floor(j / 2) * 75 } }); }
await add('rect', { name: 'suelo', width: 1700, height: 260, fill: '#C8C2D0', transform: { x: 640, y: 690 } });
await add('rect', { name: 'acera', width: 1700, height: 16, fill: '#9A94A4', transform: { x: 640, y: 562 } });

const svg = (f) => readFileSync(D + f, 'utf8');
const imp = async (f, name) => idOf(await call('command_run', { command: 'import.svg', params: { svg: svg(f), x: 300, y: 140, width: 260, parent: cam, name } }));
const cuerpo = await imp('x_cuerpo.svg', 'xeno_cuerpo');
const caraA = await imp('x_cabeza_riendo.svg', 'xeno_cara_riendo');
const caraB = await imp('x_cabeza_sorprendido.svg', 'xeno_cara_sorprendido');
const xeno = idOf(await run('node.group', { ids: [cuerpo, caraA, caraB], name: 'xeno' }));
const titulo = idOf(await run('node.add', { type: 'text', props: { name: 'titulo', text: '¿QUÉ PASARÍA SI…?', fontSize: 64, fontWeight: 900, fill: '#FFD23F', stroke: { paint: '#1A1424', width: 10 }, align: 'center', transform: { x: 640, y: 80 } } }));
const negro = idOf(await run('node.add', { type: 'rect', props: { name: 'fundido', width: 1400, height: 800, fill: '#000000', opacity: 0, transform: { x: 640, y: 360 } } }));
console.log('ids', { cam, sol, cuerpo, caraA, caraB, xeno, titulo, negro });

await run('anim.new', { name: 'Escena', duration: 6, loop: 'none' });
const batch = [];
const K = (nodeId, prop, time, value, ease = 'easeInOut') => batch.push({ command: 'keyframe.set', params: { nodeId, prop, time, value, ease } });
const P = (nodeId, preset, time, extra = {}) => batch.push({ command: 'anim.preset', params: { nodeId, preset, time, ...extra } });
P(xeno, 'slideInLeft', 0, { duration: 1.2, distance: 600 });
P(titulo, 'popIn', 0.6);
P(sol, 'pulse', 0.2, { duration: 2 });
P(xeno, 'bounce', 1.4, { distance: 30 });
// cambio de expresión: riendo -> sorprendido a los 3 s
K(caraA, 'opacity', 0, 1, 'hold'); K(caraA, 'opacity', 3, 0, 'hold');
K(caraB, 'opacity', 0, 0, 'hold'); K(caraB, 'opacity', 3, 1, 'hold');
P(xeno, 'shake', 3.0, { duration: 0.5, distance: 12 });
// cámara: zoom y paneo hacia la cara de Xeno
K(cam, 'transform.scaleX', 0, 1); K(cam, 'transform.scaleY', 0, 1);
K(cam, 'transform.scaleX', 2.6, 1); K(cam, 'transform.scaleY', 2.6, 1);
K(cam, 'transform.scaleX', 4.6, 1.6, 'easeOut'); K(cam, 'transform.scaleY', 4.6, 1.6, 'easeOut');
// transición: fundido a negro
K(negro, 'opacity', 5.2, 0, 'easeIn'); K(negro, 'opacity', 6, 1);
await call('command_batch', { steps: batch });
//
const sheet = await call('render_contact_sheet', { mode: 'even', count: 8 }).catch((e) => ({ err: e.message }));
if (sheet.img) writeFileSync(D + 'contacto.png', Buffer.from(sheet.img.data, 'base64')); else console.log('sheet', sheet.err || sheet.txt);
console.log((await call('export', { path: '/root/raveanima_out/prueba_xeno.anima' })).txt);
const t0 = Date.now(); console.log((await call('export', { path: '/root/raveanima_out/prueba_xeno.mp4' })).txt, 'segundos:', ((Date.now() - t0) / 1000).toFixed(1));
await c.close();
