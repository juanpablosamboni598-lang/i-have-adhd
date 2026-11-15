// Usage: node render.js <video.json> <out.mp4> [voice.mp3]
// Renders the motion-graphics timeline frame by frame (1080x1920, 30fps),
// adds whoosh SFX on scene cuts and muxes the voiceover.
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const fs = require('fs'), path = require('path');

const [, , jsonPath, outPath, voice] = process.argv;
const video = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const fps = video.fps || 30;
const total = Math.ceil(video.duration * fps);
const tmp = outPath.replace(/\.mp4$/, '');
const silent = tmp + '_silent.mp4';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + path.join(__dirname, video.player || 'player.html'), { waitUntil: 'networkidle' });
  await page.evaluate(v => window.setup(v), video);
  await page.evaluate(() => document.fonts.ready);

  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps),
    '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', silent],
    { stdio: ['pipe', 'inherit', 'inherit'] });

  for (let f = 0; f < total; f++) {
    await page.evaluate(t => window.renderAt(t), f / fps);
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 150 === 0) console.log(`frame ${f}/${total}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();

  // whoosh SFX: short filtered noise burst at each scene start (except t=0)
  const cuts = video.scenes.map(s => s.start).filter(t => t > 0.05);
  const sfx = tmp + '_sfx.wav';
  const parts = cuts.map((t, i) => `[0:a]atrim=0:0.35,asetpts=PTS-STARTPTS,highpass=f=600,lowpass=f=5000,afade=t=in:d=0.12,afade=t=out:st=0.12:d=0.23,volume=0.22,adelay=${Math.max(0, Math.round((t - 0.12) * 1000))}|${Math.max(0, Math.round((t - 0.12) * 1000))}[s${i}]`);
  const mix = cuts.map((_, i) => `[s${i}]`).join('') + `amix=inputs=${cuts.length}:normalize=0[out]`;
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', `anoisesrc=d=0.4:c=pink:r=44100`,
    '-filter_complex', parts.join(';') + ';' + mix, '-map', '[out]', '-t', String(video.duration), sfx]);

  const args = ['-y', '-loglevel', 'error', '-i', silent, '-i', sfx];
  let filter;
  if (voice) {
    args.push('-i', voice);
    filter = `[2:a]adelay=${Math.round((video.voiceOffset || 0) * 1000)}|${Math.round((video.voiceOffset || 0) * 1000)},loudnorm=I=-14:TP=-1.5[v];[1:a][v]amix=inputs=2:normalize=0,apad[a]`;
  } else filter = `[1:a]apad[a]`;
  args.push('-filter_complex', filter, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', outPath);
  execFileSync('ffmpeg', args);
  fs.unlinkSync(silent); fs.unlinkSync(sfx);
  console.log('done', outPath);
})();
