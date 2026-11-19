const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + process.cwd() + '/hoja_personaje.svg'); await p.screenshot({ path: 'hoja_personaje.png' });
  await b.close();
})();
