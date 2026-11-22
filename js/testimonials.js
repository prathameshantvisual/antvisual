/* =====================================================================
   TESTIMONIALS — carousel with auto-advance, pause on hover/focus
   ===================================================================== */
(function testimonials(){
  if(!CONFIG.showTestimonials){ const s=$('#clients'); if(s) s.remove(); return; }
  const sec=$('#clients'), slides=$('#tstSlides'), dots=$('#tstDots'), count=$('#tstCount'), DUR=7000;
  slides.innerHTML=TESTIMONIALS.map((t,i)=>`<figure class="tst-slide" role="group" aria-roledescription="slide" aria-label="${i+1} of ${TESTIMONIALS.length}" style="margin:0">
    ${t.placeholder?phTag('testimonial to be supplied'):''}
    <blockquote>${t.quote.split(/\s+/).map((w,k)=>`<span class="w"><span style="transition-delay:${k*22}ms">${esc(w)}</span></span>`).join(' ')}</blockquote>
    <figcaption class="tst-who"><span class="tst-av">${t.photo?`<img src="${t.photo}" alt="">`:'Photo'}</span><span><b>${esc(t.name)}</b><span>${esc(t.role)}, ${esc(t.company)}</span></span></figcaption>
  </figure>`).join('');
  dots.innerHTML=TESTIMONIALS.map((t,i)=>`<button type="button" role="tab" aria-label="Testimonial ${i+1}" style="--dur:${DUR}ms"><i></i></button>`).join('');
  const S=$$('.tst-slide',slides), D=$$('button',dots);
  let cur=-1, timer=null, paused=false, visible=false;
  function go(i){
    i=(i+S.length)%S.length; cur=i;
    S.forEach((s,k)=>s.classList.toggle('on',k===i));
    D.forEach((d,k)=>{ d.classList.toggle('done',k<i); d.classList.remove('on'); d.setAttribute('aria-selected',k===i); });
    void dots.offsetWidth; D[i].classList.add('on');
    count.textContent=`${pad2(i+1)} / ${pad2(S.length)}`;
    sec.style.backgroundColor=TESTIMONIALS[i].tint;
    schedule();
  }
  function schedule(){ clearTimeout(timer); if(!paused && visible && !RM) timer=setTimeout(()=>go(cur+1),DUR); }
  const pause=v=>{ paused=v; sec.classList.toggle('paused',v); if(v) clearTimeout(timer); else go(cur); };
  sec.addEventListener('pointerenter',()=>pause(true)); sec.addEventListener('pointerleave',()=>pause(false));
  sec.addEventListener('focusin',()=>pause(true)); sec.addEventListener('focusout',e=>{ if(!sec.contains(e.relatedTarget)) pause(false); });
  D.forEach((d,k)=>d.addEventListener('click',()=>go(k)));
  $('#tstPrev').addEventListener('click',()=>go(cur-1)); $('#tstNext').addEventListener('click',()=>go(cur+1));
  sec.addEventListener('keydown',e=>{ if(e.key==='ArrowRight') go(cur+1); if(e.key==='ArrowLeft') go(cur-1); });
  new IntersectionObserver(es=>{ visible=es[0].isIntersecting; if(visible) schedule(); else clearTimeout(timer); },{threshold:.3}).observe(sec);
  if(RM) sec.classList.add('paused');
  go(0);
})();
