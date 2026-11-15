const { chromium } = require('playwright'); const fs=require('fs'),path=require('path');
const [, , json, outdir, ...ts] = process.argv;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.log('ERR',e.message));
const V=JSON.parse(fs.readFileSync(json));await p.goto('file://'+path.join(__dirname,V.player||'player.html'),{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.evaluate(v=>window.setup(v),V);
fs.mkdirSync(outdir,{recursive:true});
for(const t of ts){await p.evaluate(t=>window.renderAt(t),+t);await p.screenshot({path:`${outdir}/t${t}.jpg`,type:'jpeg',quality:70});}
await b.close();})();
