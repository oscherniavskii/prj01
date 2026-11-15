const { chromium } = require('playwright');
(async()=>{
  const b=await chromium.launch({executablePath:'/root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell'});
  const pg=await b.newPage({viewport:{width:1280,height:800}});
  const errs=[];
  pg.on('pageerror',e=>errs.push(String(e)));
  pg.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await pg.goto('file:///workspace/artcraft/index.html');
  await pg.waitForTimeout(600);
  for(const y of [0,400,900,1500,2400,3600,5200]){
    await pg.evaluate(v=>window.scrollTo(0,v),y);
    await pg.waitForTimeout(700);
    await pg.screenshot({path:`shot-${y}.png`});
  }
  console.log('errors:',errs.length?errs:'none');
  await b.close();
})();
