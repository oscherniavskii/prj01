const { chromium } = require('playwright');
(async()=>{
  const b=await chromium.launch({executablePath:'/root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell'});
  const pg=await b.newPage({viewport:{width:1280,height:800}});
  await pg.goto('file:///workspace/artcraft/index.html');
  await pg.waitForTimeout(500);
  // клик по слову в стопке
  await pg.evaluate(()=>window.scrollTo(0,3600));
  await pg.waitForTimeout(900);
  const hit=await pg.evaluate(()=>{const a=[...document.querySelectorAll('#overlay a')].find(a=>a.style.pointerEvents==='auto');if(!a)return null;const r=a.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};});
  console.log('RESULT hit',JSON.stringify(hit));
  if(hit){await pg.mouse.click(hit.x,hit.y);await pg.waitForTimeout(1800);console.log('RESULT after click scrollY=',await pg.evaluate(()=>window.scrollY));}
  // снап: остановиться посреди флипа. Найдем y где flip ~0.5 для какой-то секции
  const mid=await pg.evaluate(()=>{ // flip=0.5 <=> v=L+flipZone/2 => scrollY=anchor+drift-L-fz/2 ; приблизительно: ищем вручную
    return window.scrollY;});
  for(const y of [770,780,790]){
    await pg.evaluate(v=>window.scrollTo(0,v),y);
    await pg.waitForTimeout(1200); // подождем snapDelay+snapDur
    console.log('RESULT snap from',y,'-> now',await pg.evaluate(()=>Math.round(window.scrollY)));
  }
  await b.close();
})();
