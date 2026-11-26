// Cliente MCP mínimo (stdio) para probar el servidor de RaveAnima. Uso: node mcpc.mjs <tool> '<json args>' [...más pares]
import { Client } from '/home/user/vibecoderkz/raveanima/node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.js';
import { StdioClientTransport } from '/home/user/vibecoderkz/raveanima/node_modules/@modelcontextprotocol/sdk/dist/esm/client/stdio.js';
const t = new StdioClientTransport({ command: 'node', args: ['/home/user/vibecoderkz/raveanima/packages/headless/dist/anima.js', 'mcp'] });
const c = new Client({ name: 'prueba', version: '1' }); await c.connect(t);
const a = process.argv.slice(2);
if (!a.length) { const r = await c.listTools(); console.log(r.tools.map((x) => x.name + ' :: ' + (x.description || '').slice(0, 110)).join('\n')); }
for (let i = 0; i < a.length; i += 2) { const r = await c.callTool({ name: a[i], arguments: JSON.parse(a[i + 1] || '{}') });
  for (const p of r.content) { if (p.type === 'text') console.log(p.text.slice(0, Number(process.env.MAXC || 6000))); else console.log('[' + p.type + ' ' + (p.mimeType || '') + ' ' + (p.data ? p.data.length : 0) + ' b64]'); } }
await c.close();
