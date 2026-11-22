/* =====================================================================
   INTRO
   ===================================================================== */
(function intro(){
  const el=$('#intro'), v=$('#introVideo'), cnt=$('#introCount'), bar=$('#introBar'), skip=$('#introSkip');
  const done=()=>{ if(el.dataset.done) return; el.dataset.done=1; store.set('av-intro','1');
    el.classList.add('out'); unlock(); document.dispatchEvent(new Event('intro:done'));
    setTimeout(()=>{ el.remove(); }, 1200); };
  if((CONFIG.introOncePerSession && store.get('av-intro')) || !CONFIG.introVideo){ el.remove(); requestAnimationFrame(()=>document.dispatchEvent(new Event('intro:done'))); return; }
  lock();
  v.poster=CONFIG.introPoster; v.src=CONFIG.introVideo; v.muted=true;
  const t0=performance.now();
  // Progress counter blends real buffering with elapsed time so it never stalls
  (function tick(){
    if(el.dataset.done) return;
    const el_t=performance.now()-t0;
    let p = v.duration ? v.currentTime/Math.min(v.duration, CONFIG.introMaxMs/1000) : el_t/CONFIG.introMaxMs*.6;
    p=Math.max(0,Math.min(1,Math.max(p, el_t/CONFIG.introMaxMs)));
    cnt.innerHTML=Math.round(p*100)+'<small>%</small>'; bar.style.transform=`scaleX(${p})`;
    if(p>=1) return done();
    requestAnimationFrame(tick);
  })();
  const pl=v.play(); if(pl&&pl.catch) pl.catch(()=>{});
  v.addEventListener('ended',done); v.addEventListener('error',()=>setTimeout(done,600));
  setTimeout(()=>skip.classList.add('show'), RM?0:CONFIG.introSkipAfterMs);
  skip.addEventListener('click',done);
  addEventListener('keydown',e=>{ if(e.key==='Escape' && document.body.contains(el)) done(); });
  if(RM) setTimeout(done,900);
})();
