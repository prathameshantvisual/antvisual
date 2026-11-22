/* =====================================================================
   PROJECT DRAWER
   ===================================================================== */
const Drawer=(function(){
  const dr=$('#drawer'), scrim=$('#scrim'), inner=$('#drIn'), body=$('#drBody');
  let cur=-1, opener=null;
  const block=(title,content,i)=>`<div class="dr-sec dr-rv" style="--i:${i}"><h4>${title}</h4><div>${content}</div></div>`;
  const ph=(what)=>`<div class="ph">${phTag()}<span>${esc(what)} to be supplied by AntVisual.</span></div>`;
  function render(p){
    const idx=PROJECTS.indexOf(p), next=PROJECTS[(idx+1)%PROJECTS.length];
    const tall=/poster|mailer/.test(p.images[0]);
    const extra=p.images.slice(1);
    const showPh=CONFIG.showPlaceholderBadges;
    let i=0;
    inner.innerHTML=`
      <div class="dr-kicker dr-rv" style="--i:${i++}"><span>${esc(p.category)}</span><span>No. ${pad2(idx+1)} / ${pad2(PROJECTS.length)}</span></div>
      <h2 class="dr-title dr-rv" id="drTitle" style="--i:${i++}">${esc(p.name)}</h2>
      ${p.client||showPh?`<p class="dr-client dr-rv" style="--i:${i++}">Client · ${p.client?`<b>${esc(p.client)}</b>`:phTag('client name to confirm')}</p>`:''}
      <div class="dr-hero dr-rv${tall?' tall':''}" style="--i:${i++};--plate:${p.plate};--ar:${tall?'4/3.6':'16/10'}"><img src="${p.images[0]}" alt="${esc(p.name)}, main visual"></div>
      ${block('Overview',`<p>${esc(p.overview)}</p>`,i++)}
      ${p.objectives||showPh?block('Objectives',p.objectives?`<p>${esc(p.objectives)}</p>`:ph('Project objectives'),i++):''}
      ${block('Services',`<ul>${p.services.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`,i++)}
      ${p.approach||showPh?block('Design approach',p.approach?`<p>${esc(p.approach)}</p>`:ph('Design approach notes'),i++):''}
      ${extra.length||showPh?block('Visuals',`<div class="dr-gallery" style="--plate:${p.plate}">${extra.map(src=>`<figure><img src="${src}" alt="${esc(p.name)}, additional visual" loading="lazy"></figure>`).join('')}${showPh&&extra.length<2?`<figure class="ph-fig${extra.length===0?' full':''}">${phTag()}<span>Additional mockups to be supplied</span></figure>`:''}</div>`,i++):''}
      ${p.outcomes?block('Outcomes',`<p>${esc(p.outcomes)}</p>`,i++):''}
      <div class="dr-foot dr-rv" style="--i:${i++}">
        <button class="btn" type="button" data-discuss="${esc(p.services[0])}">Discuss a similar project <span class="arr">↗</span></button>
        ${p.behance?`<a class="btn ghost" href="${p.behance}" target="_blank" rel="noopener">View on Behance <span class="arr">↗</span></a>`:''}
      </div>
      <button class="dr-next dr-rv" style="--i:${i++}" type="button" data-goto="${next.id}"><small>Next project</small><strong>${esc(next.name)} →</strong></button>`;
    $('#drCrumb').textContent=`${p.client||'Project'} · ${p.category}`;
    body.scrollTop=0;
    // restart entrance animations
    $$('.dr-rv',inner).forEach(n=>{ n.style.animation='none'; void n.offsetWidth; n.style.animation=''; });
  }
  function open(id,from){
    const p=PROJECTS.find(x=>x.id===id); if(!p) return;
    cur=PROJECTS.indexOf(p); render(p);
    if(!dr.classList.contains('on')){ opener=from||document.activeElement; lock(); }
    dr.classList.add('on'); scrim.classList.add('on'); dr.setAttribute('aria-hidden','false');
    cursor.clear();
    setTimeout(()=>$('#drClose').focus({preventScroll:true}),60);
  }
  function close(){
    if(!dr.classList.contains('on')) return;
    dr.classList.remove('on'); scrim.classList.remove('on'); dr.setAttribute('aria-hidden','true'); unlock();
    if(opener&&opener.focus) opener.focus({preventScroll:true});
  }
  const step=d=>{ cur=(cur+d+PROJECTS.length)%PROJECTS.length; render(PROJECTS[cur]); };
  $('#drClose').addEventListener('click',close);
  $('#drPrev').addEventListener('click',()=>step(-1));
  $('#drNext').addEventListener('click',()=>step(1));
  scrim.addEventListener('click',close);
  inner.addEventListener('click',e=>{
    const g=e.target.closest('[data-goto]'); if(g){ open(g.dataset.goto); return; }
    const d=e.target.closest('[data-discuss]'); if(d){ close(); Contact.prefill(d.dataset.discuss); }
  });
  dr.addEventListener('keydown',e=>{
    if(e.key==='Escape'){ e.preventDefault(); close(); }
    if(e.key==='Tab'){ // focus trap
      const f=$$('button,a[href],[tabindex]:not([tabindex="-1"])',dr).filter(x=>x.offsetParent!==null);
      const a=f[0], z=f[f.length-1];
      if(e.shiftKey && document.activeElement===a){ e.preventDefault(); z.focus(); }
      else if(!e.shiftKey && document.activeElement===z){ e.preventDefault(); a.focus(); }
    }
  });
  addEventListener('keydown',e=>{ if(e.key==='Escape') close(); });
  return { open, close };
})();
