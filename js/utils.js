/* =====================================================================
   UTILITIES
   ===================================================================== */
const $ = (s,el=document)=>el.querySelector(s);
const $$ = (s,el=document)=>[...el.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = matchMedia('(hover:hover) and (pointer:fine)').matches;
const HAS_GSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
const esc = s => String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad2 = n => String(n).padStart(2,'0');
const store = { get(k){try{return sessionStorage.getItem(k)}catch(e){return null}}, set(k,v){try{sessionStorage.setItem(k,v)}catch(e){}} };
const ARROW = '<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M5 13 13 5M6 5h7v7" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
const phTag = t => `<span class="ph-tag">Placeholder${t?' · '+esc(t):''}</span>`;
document.documentElement.classList.add('js');
if(!CONFIG.showPlaceholderBadges) document.body.classList.add('no-ph');
if(HAS_GSAP) gsap.registerPlugin(ScrollTrigger);

/* Split a heading into word spans for staggered reveals */
function splitWords(el){
  el.innerHTML = el.textContent.trim().split(/\s+/).map(w=>`<span class="w"><span>${esc(w)}</span></span>`).join(' ');
  return $$('.w>span', el);
}

/* Play videos only while on screen */
const vidIO = new IntersectionObserver(es=>es.forEach(e=>{
  const v=e.target; if(v.dataset.paused==='1') return;
  if(e.isIntersecting){ const p=v.play(); if(p&&p.catch) p.catch(()=>{}); } else v.pause();
}),{threshold:.15});
function watchVideo(v){ v.muted=true; v.defaultMuted=true; v.playsInline=true; vidIO.observe(v); }
/* Safari/Chrome can refuse the first autoplay. Retry on first interaction, tab return and back/refresh restores. */
(function(){
  const inView=v=>{ const r=v.getBoundingClientRect(); return r.bottom>0 && r.top<innerHeight && r.right>0 && r.left<innerWidth; };
  const retry=()=>document.querySelectorAll('video').forEach(v=>{
    if(!v.paused || v.dataset.paused==='1' || v.closest('#intro') || !v.getAttribute('src') && !v.currentSrc || !inView(v)) return;
    v.muted=true; const p=v.play(); if(p&&p.catch) p.catch(()=>{});
  });
  ['pointerdown','keydown','touchstart'].forEach(ev=>addEventListener(ev,retry,{once:true,passive:true,capture:true}));
  document.addEventListener('visibilitychange',()=>{ if(!document.hidden) retry(); });
  addEventListener('pageshow',retry);
  addEventListener('load',()=>setTimeout(retry,400));
})();

/* Scroll lock that survives nested callers */
let lockN=0, lockY=0;
function lock(){ if(lockN++===0){ lockY=scrollY; document.body.classList.add('locked'); document.body.style.paddingRight=(innerWidth-document.documentElement.clientWidth)+'px'; } }
function unlock(){ if(--lockN<=0){ lockN=0; document.body.classList.remove('locked'); document.body.style.paddingRight=''; } }
