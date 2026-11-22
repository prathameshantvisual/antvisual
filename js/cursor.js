/* =====================================================================
   CUSTOM CURSOR
   ===================================================================== */
const cursor=(function(){
  const c=$('#cursor'), lbl=$('#cursorLabel');
  if(!FINE) return { set(){}, clear(){} };
  let x=innerWidth/2,y=innerHeight/2,cx=x,cy=y;
  addEventListener('pointermove',e=>{ x=e.clientX; y=e.clientY; c.classList.add('on'); },{passive:true});
  document.addEventListener('pointerleave',()=>c.classList.remove('on'));
  (function loop(){ cx+=(x-cx)*.2; cy+=(y-cy)*.2; c.style.transform=`translate3d(${cx}px,${cy}px,0)`; requestAnimationFrame(loop); })();
  return { set(t){ lbl.textContent=t; c.classList.add('big'); }, clear(){ c.classList.remove('big'); } };
})();
function cursorZone(el,label){ if(!FINE) return; el.addEventListener('pointerenter',()=>cursor.set(label)); el.addEventListener('pointerleave',()=>cursor.clear()); }
