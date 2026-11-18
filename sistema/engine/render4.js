// node render4.js <intro|outro> <t0> <t1> <salida>  -> intro: mp4 opaco; outro: .mov con alfa (qtrle)
const { chromium } = require('playwright'); const { spawn } = require('child_process'); const path = require('path');
const [, , mode, t0s, t1s, out] = process.argv; const t0 = +t0s, t1 = +t1s, fps = 30;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.join(__dirname, 'player4.html'), { waitUntil: 'networkidle' });
  await p.evaluate(m => window.setup({ mode: m }), mode); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  const alpha = mode !== 'intro';
  const args = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-'];
  args.push(...(alpha ? ['-c:v', 'qtrle', out] : ['-c:v', 'libx264', '-crf', '17', '-pix_fmt', 'yuv420p', out]));
  const ff = spawn('ffmpeg', args, { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round((t1 - t0) * fps);
  for (let f = 0; f < n; f++) {
    await p.evaluate(t => window.renderAt(t), t0 + f / fps);
    const buf = await p.screenshot(alpha ? { type: 'png', omitBackground: true } : { type: 'jpeg', quality: 93 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close(); console.log('ok', out, n);
})();
