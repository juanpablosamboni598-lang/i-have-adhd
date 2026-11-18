// node stills3.js video.json out_prefix t1 t2 ...  -> PNG por tiempo (para revisar)
const { chromium } = require('playwright'); const path=require('path'); const fs=require('fs');
const [, , j, pre, ...ts] = process.argv; const v=JSON.parse(fs.readFileSync(j,'utf8'));
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+path.join(__dirname,v.player),{waitUntil:'networkidle'});await p.evaluate(x=>window.setup(x),v);await p.evaluate(()=>document.fonts.ready);
await p.waitForTimeout(500);
for(const t of ts){await p.evaluate(t=>window.renderAt(t),+t);await p.screenshot({path:`${pre}_${t}.png`});}
await b.close();})();
