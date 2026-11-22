/* =====================================================================
   SELECTED WORK — expanding card rail (auto-cycles until the visitor takes over)
   ===================================================================== */
(function work(){
  const rail=$('#workRail'), DUR=5000;
  rail.innerHTML = PROJECTS.map((p,i)=>`<article class="wcard" role="listitem" style="--plate:${p.plate||'var(--night-2)'}">
      <button class="wcard-btn" type="button" data-project="${p.id}" aria-label="Open project: ${esc(p.name)}, ${esc(p.category)}">
        <img src="${p.images[0]}" alt="" loading="lazy" decoding="async">
        <span class="wcard-shade"></span>
        <span class="wcard-num">${pad2(i+1)}</span>
        <span class="wcard-vert" aria-hidden="true">${esc(p.name)}</span>
        <span class="wcard-info">
          <span class="wcard-cat">${esc(p.category)}${p.client?` · ${esc(p.client)}`:''}</span>
          <span class="wcard-title">${esc(p.name)}</span>
          <span class="wcard-sum">${esc(p.summary)}</span>
          <span class="wcard-cta">View project ${ARROW}</span>
        </span>
        <span class="wcard-bar"><i></i></span>
      </button>
    </article>`).join('');
  const cards=$$('.wcard',rail);
  const stacked=()=>matchMedia('(max-width:760px)').matches;
  let cur=0, timer=null, held=false, visible=false;
  function activate(i){
    cur=(i+cards.length)%cards.length;
    cards.forEach((c,k)=>{ c.classList.toggle('on',k===cur); c.classList.remove('run'); });
    void rail.offsetWidth; if(!held && !RM && !stacked()) cards[cur].classList.add('run');
    schedule();
  }
  function schedule(){ clearTimeout(timer); if(!held && visible && !RM && !stacked()) timer=setTimeout(()=>activate(cur+1),DUR); }
  cards.forEach((c,i)=>{
    const b=$('.wcard-btn',c);
    if(FINE) c.addEventListener('pointerenter',()=>{ held=true; activate(i); });
    b.addEventListener('focus',()=>{ held=true; activate(i); });
    b.addEventListener('click',()=>{
      // On touch tablets the first tap expands a closed card, the second opens it
      if(!FINE && !stacked() && !c.classList.contains('on')){ held=true; activate(i); return; }
      Drawer.open(b.dataset.project,b);
    });
    cursorZone(b,'View project');
  });
  rail.addEventListener('pointerleave',()=>{ held=false; activate(cur); });
  rail.addEventListener('focusout',e=>{ if(!rail.contains(e.relatedTarget)){ held=false; activate(cur); } });
  new IntersectionObserver(es=>{ visible=es[0].isIntersecting; visible?activate(cur):clearTimeout(timer); },{threshold:.35}).observe(rail);
  activate(0);
})();
