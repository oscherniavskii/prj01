const { chromium } = require('playwright');
(async()=>{
  const b=await chromium.launch({executablePath:'/root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell'});
  const pg=await b.newPage({viewport:{width:1280,height:800}});
  await pg.goto('file:///workspace/artcraft/index.html');
  await pg.waitForTimeout(500);
  for(const y of [900,1500,2400]){
    await pg.evaluate(v=>window.scrollTo(0,v),y);
    await pg.waitForTimeout(800);
    const info=await pg.evaluate(()=>{
      const out=[];
      document.querySelectorAll('#overlay span').forEach(sp=>{
        if(sp.style.opacity!=='0'&&sp.textContent.trim()){
          const r=sp.getBoundingClientRect();
          out.push({ch:sp.textContent,x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)});
        }});
      return out;});
    console.log(y, JSON.stringify(info));
  }
  // клик по слову в стопке
  await pg.evaluate(()=>window.scrollTo(0,3600));
  await pg.waitForTimeout(900);
  const hit=await pg.evaluate(()=>{const a=[...document.querySelectorAll('#overlay a')].find(a=>a.style.pointerEvents==='auto');if(!a)return null;const r=a.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};});
  console.log('hit',hit);
  if(hit){await pg.mouse.click(hit.x,hit.y);await pg.waitForTimeout(1600);console.log('scrollY after click',await pg.evaluate(()=>window.scrollY));}
  await b.close();
})();
