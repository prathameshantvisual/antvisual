/* =====================================================================
   WHAT WE DO — capability orbit
   ===================================================================== */
(function caps(){
  const svg=$('#orbit'), panes=$('#capPanes'), tabs=$('#capTabs'), NS='http://www.w3.org/2000/svg';
  const C=300, R1=92, R2=192, R3=268;
  const pol=(a,r)=>[C+r*Math.cos(a*Math.PI/180), C+r*Math.sin(a*Math.PI/180)];
  let html=`
    <g class="spin rev"><circle class="ring dash" cx="${C}" cy="${C}" r="${R3}"/></g>
    <g class="spin"><circle class="ring" cx="${C}" cy="${C}" r="${R2}"/>${[0,60,120,180,240,300].map(a=>{const [x,y]=pol(a+15,R2);return `<circle cx="${x}" cy="${y}" r="2" fill="var(--night-mute)"/>`}).join('')}</g>
    <circle class="ring" cx="${C}" cy="${C}" r="${R1+26}" stroke-dasharray="1 5"/>`;
  CAPABILITIES.forEach((c,i)=>{ const [x,y]=pol(c.angle,R2); html+=`<line class="link" id="lk-${c.id}" x1="${C}" y1="${C}" x2="${x}" y2="${y}"/>`; });
  CAPABILITIES.forEach((c,i)=>{
    // service satellites on the outer ring, fanned around the category angle
    const n=c.services.length, spread=Math.min(78, n*16);
    html+=`<g class="svc" id="sv-${c.id}">`;
    c.services.forEach((s,j)=>{ const a=c.angle-spread/2+(n===1?spread/2:spread*j/(n-1)); const [sx,sy]=pol(a,R3); const [cx,cy]=pol(c.angle,R2);
      const right=Math.cos(a*Math.PI/180)>=0, [tx,ty]=pol(a,R3+12);
      html+=`<line x1="${cx}" y1="${cy}" x2="${sx}" y2="${sy}"/><circle cx="${sx}" cy="${sy}" r="3.5"/><text x="${tx}" y="${ty+4}" text-anchor="${right?'start':'end'}">${esc(s[0])}</text>`; });
    html+=`</g>`;
  });
  html+=`<circle class="core-c" cx="${C}" cy="${C}" r="${R1}"/><image class="core-img" href="assets/mark.png" x="${C-56}" y="${C-30}" width="112" height="60" preserveAspectRatio="xMidYMid meet"/>
    <text x="${C}" y="${C+52}" text-anchor="middle" fill="var(--night-mute)" style="font:500 10px var(--f-body);letter-spacing:.2em">DESIGN CORE</text>`;
  CAPABILITIES.forEach((c,i)=>{ const [x,y]=pol(c.angle,R2); const below=y>C;
    html+=`<g class="node" id="nd-${c.id}" tabindex="0" role="button" aria-label="${esc(c.name)}" data-cap="${c.id}">
      <circle class="halo" cx="${x}" cy="${y}" r="28"/><circle class="dot" cx="${x}" cy="${y}" r="26"/>
      <text class="n" x="${x}" y="${y+4}" text-anchor="middle">${pad2(i+1)}</text>
      <text x="${x}" y="${below?y+50:y-38}" text-anchor="middle">${esc(c.short)}</text></g>`; });
  svg.innerHTML=html;

  tabs.innerHTML=CAPABILITIES.map((c,i)=>`<button type="button" role="tab" id="tab-${c.id}" aria-controls="pane-${c.id}" aria-selected="false" data-cap="${c.id}">${pad2(i+1)} ${esc(c.short)}</button>`).join('');
  panes.innerHTML=CAPABILITIES.map((c,i)=>`<div class="cap-pane" id="pane-${c.id}" role="tabpanel" aria-labelledby="tab-${c.id}" hidden>
    <span class="num">${pad2(i+1)} / ${pad2(CAPABILITIES.length)}</span>
    <h3>${esc(c.name)}</h3>
    <p class="lead">${esc(c.lead)}</p>
    <ul class="svc-list">${c.services.map(s=>`<li><b>${esc(s[0])}${s[2]?'<span class="star">Our strongest craft</span>':''}</b><span>${esc(s[1])}</span></li>`).join('')}</ul>
    <div class="cap-prev">${c.previews.map(p=>{
      if(p.video) return `<div><video data-src="${p.video}" poster="${p.poster}" muted loop playsinline preload="none" aria-hidden="true"></video></div>`;
      const proj=p.project&&PROJECTS.find(x=>x.id===p.project);
      return proj?`<button type="button" data-project="${proj.id}" aria-label="Open project: ${esc(proj.name)}"><img src="${p.img}" alt="" loading="lazy"></button>`:`<div><img src="${p.img}" alt="" loading="lazy"></div>`; }).join('')}</div>
    <div><button class="btn" type="button" data-need="${esc(c.need)}">Discuss ${esc(c.short.toLowerCase())} work <span class="arr">↗</span></button></div>
  </div>`).join('');
  $$('video[data-src]',panes).forEach(v=>{ v.src=v.dataset.src; watchVideo(v); });

  let active=null;
  function select(id,focusTab){
    if(active===id) return; active=id;
    CAPABILITIES.forEach(c=>{ const on=c.id===id;
      $('#nd-'+c.id).classList.toggle('on',on); $('#lk-'+c.id).classList.toggle('on',on); $('#sv-'+c.id).classList.toggle('on',on);
      $('#nd-'+c.id).setAttribute('aria-pressed',on);
      const t=$('#tab-'+c.id); t.setAttribute('aria-selected',on); t.tabIndex=on?0:-1; if(on&&focusTab) t.focus();
      const p=$('#pane-'+c.id); p.hidden=!on; if(on){ p.classList.remove('enter'); void p.offsetWidth; p.classList.add('enter'); }
    });
    if(HAS_GSAP && !RM){ const sv=$('#sv-'+id); gsap.fromTo($$('circle,text',sv),{opacity:0},{opacity:1,duration:.5,stagger:.04,ease:'power2.out'});
      gsap.fromTo($$('line',sv),{attr:{'stroke-dasharray':'0 400'}},{attr:{'stroke-dasharray':'400 0'},duration:.7,stagger:.04,ease:'power2.out'}); }
  }
  $$('.node',svg).forEach(n=>{
    n.addEventListener('click',()=>select(n.dataset.cap));
    if(FINE) n.addEventListener('pointerenter',()=>select(n.dataset.cap));
    n.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); select(n.dataset.cap); } });
  });
  tabs.addEventListener('click',e=>{ const b=e.target.closest('[data-cap]'); if(b) select(b.dataset.cap); });
  tabs.addEventListener('keydown',e=>{ if(!/Arrow(Left|Right)/.test(e.key)) return; const i=CAPABILITIES.findIndex(c=>c.id===active); const d=e.key==='ArrowRight'?1:-1; select(CAPABILITIES[(i+d+CAPABILITIES.length)%CAPABILITIES.length].id,true); });
  panes.addEventListener('click',e=>{
    const pr=e.target.closest('[data-project]'); if(pr) return Drawer.open(pr.dataset.project,pr);
    const nd=e.target.closest('[data-need]'); if(nd) Contact.prefill(nd.dataset.need);
  });
  select(CAPABILITIES[0].id);
})();
