/* =====================================================================
   SCROLL ANIMATIONS (GSAP + ScrollTrigger)
   ===================================================================== */
function heroIn(){
  if(!HAS_GSAP || RM) return;
  gsap.from('.hero .frame',{clipPath:'inset(0 0 100% 0)',duration:1.3,ease:'expo.inOut'});
  gsap.from('.hero-top, .hero-copy > *, .ticker',{y:30,opacity:0,duration:1,ease:'expo.out',stagger:.08,delay:.3});
}
document.addEventListener('intro:done',heroIn,{once:true});

if(HAS_GSAP && !RM){
  // Section titles: word-by-word rise
  $$('.sec-head h2.split, .contact h2.split').forEach(h=>{ const w=splitWords(h);
    gsap.from(w,{yPercent:110,duration:1.1,ease:'expo.out',stagger:.06,scrollTrigger:{trigger:h,start:'top 85%'}}); });
  $$('.sec-head p').forEach(p=>gsap.from(p,{y:24,opacity:0,duration:1,ease:'expo.out',scrollTrigger:{trigger:p,start:'top 88%'}}));
  // Selected Work: cards rise in sequence
  gsap.from('.wcard',{y:60,opacity:0,duration:1.1,ease:'expo.out',stagger:.07,scrollTrigger:{trigger:'#workRail',start:'top 85%'}});
  gsap.from('.work-foot > *',{y:20,opacity:0,duration:1,ease:'expo.out',stagger:.08,scrollTrigger:{trigger:'.work-foot',start:'top 92%'}});
  // Capabilities: orbit draws in
  gsap.from('#orbit .ring',{scale:.6,opacity:0,transformOrigin:'300px 300px',duration:1.4,ease:'expo.out',stagger:.1,scrollTrigger:{trigger:'#orbit',start:'top 80%'}});
  gsap.from('#orbit .node',{scale:0,transformOrigin:'center',transformBox:'fill-box',duration:.9,ease:'back.out(1.6)',stagger:.08,delay:.3,scrollTrigger:{trigger:'#orbit',start:'top 80%'}});
  // Contact form fields
  gsap.from('.form > *',{y:26,opacity:0,stagger:.07,duration:1,ease:'expo.out',scrollTrigger:{trigger:'.form',start:'top 85%'}});
  gsap.from('.reach-row',{y:20,opacity:0,stagger:.08,duration:1,ease:'expo.out',scrollTrigger:{trigger:'.reach',start:'top 90%'}});
  addEventListener('load',()=>ScrollTrigger.refresh());
}
