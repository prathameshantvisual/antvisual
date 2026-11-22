/* =====================================================================
   HEADER — hide on scroll down, reveal on scroll up; mobile menu
   ===================================================================== */
(function header(){
  const hdr=$('#hdr'), burger=$('#burger'), nav=$('#nav');
  let last=scrollY;
  addEventListener('scroll',()=>{ const y=scrollY;
    if(!nav.classList.contains('open')) hdr.classList.toggle('hide', y>last && y>300);
    last=y; },{passive:true});
  const setMenu=open=>{ nav.classList.toggle('open',open); burger.setAttribute('aria-expanded',open); burger.setAttribute('aria-label',open?'Close menu':'Open menu'); open?lock():unlock(); };
  burger.addEventListener('click',()=>setMenu(!nav.classList.contains('open')));
  $$('a',nav).forEach(a=>a.addEventListener('click',()=>{ if(nav.classList.contains('open')) setMenu(false); }));
  // Active section indicator
  const links=$$('nav a[href^="#"]:not(.btn)');
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ links.forEach(l=>l.classList.toggle('on', l.getAttribute('href')==='#'+e.target.id)); } }),{rootMargin:'-45% 0px -50% 0px'});
  ['work','services','clients','ant','contact'].map(id=>document.getElementById(id)).filter(Boolean).forEach(el=>io.observe(el));
})();

/* Ticker + video controls */
if($('#ticker')) $('#ticker').innerHTML = [0,1].map(()=>TICKER.map(t=>`<span>${esc(t)}</span>`).join('')).join('');
$$('.vid-toggle').forEach(b=>{ const v=document.getElementById(b.dataset.vid);
  const PAUSE=b.innerHTML, PLAY='<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5v11l9-5.5z" fill="currentColor"/></svg>';
  const set=play=>{ v.dataset.paused=play?'':'1'; if(play) v.play().catch(()=>{}); else v.pause();
    b.innerHTML=play?PAUSE:PLAY; b.setAttribute('aria-label',play?'Pause video':'Play video'); };
  b.addEventListener('click',()=>set(v.dataset.paused==='1'));
  // The hero clip is muted and decorative, so it plays even with Reduce Motion on; the button above is the user's control.
  watchVideo(v);
});
