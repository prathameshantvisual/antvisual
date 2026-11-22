/* =====================================================================
   WHAT IS AN ANT? — canvas colony that re-forms per story step
   ===================================================================== */
(function antStory(){
  const cv=$('#antCanvas'), ctx=cv.getContext('2d'), steps=$$('.ant-step'), word=$('#antWord'), lbl=$('#antLbl');
  const N=window.innerWidth<700?170:300;
  let W=0,H=0,dpr=1, state=0, running=false, t=0, markPts=[], FR=1, last=0;
  const ants=Array.from({length:N},(_,i)=>({x:Math.random(),y:Math.random(),vx:0,vy:0,seed:Math.random()*1000,lead:i%23===0,ph:Math.random()}));
  function size(){ const r=cv.getBoundingClientRect(); dpr=Math.min(2,devicePixelRatio||1); W=r.width; H=r.height; cv.width=W*dpr; cv.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); ants.forEach(a=>{ if(a.px===undefined){ a.px=a.x*W; a.py=a.y*H; } }); }
  // Sample the ANT mark into target points
  const im=new Image(); im.onload=()=>{ try{ const c=document.createElement('canvas'), w=140, h=Math.round(140*im.height/im.width); c.width=w; c.height=h; const g=c.getContext('2d'); g.drawImage(im,0,0,w,h);
      const d=g.getImageData(0,0,w,h).data, on=(x,y)=>d[(y*w+x)*4+3]>120 && d[(y*w+x)*4]<120;
      let M=0; for(let y=0;y<h;y++) for(let x=0;x<w;x++) if(on(x,y)) M++;
      const st=Math.max(1,Math.round(Math.sqrt(M/N))), pts=[]; // even grid so every ant has a place in the mark
      for(let y=0;y<h;y+=st) for(let x=0;x<w;x+=st) if(on(x,y)) pts.push([x/w,y/h]);
      for(let i=pts.length-1;i>0;i--){ const j=(Math.random()*(i+1))|0; [pts[i],pts[j]]=[pts[j],pts[i]]; } markPts=pts; markAR=h/w; markImg=im; }catch(e){} };
  let markImg=null;
  let markAR=.535; im.src='assets/mark.png';
  // Trail used by "Direction": a smooth S-curve across the stage
  const trail=u=>{ const x=.08+.84*u; return [x, .5+.28*Math.sin(u*Math.PI*2.2-.6)]; };
  const hubs=[[.2,.25],[.5,.18],[.8,.3],[.3,.6],[.68,.62],[.18,.85],[.55,.86],[.86,.8]];
  const edges=[[0,1],[1,2],[0,3],[1,4],[2,4],[3,4],[3,5],[4,6],[5,6],[6,7],[4,7],[1,3]];
  function target(a,i){
    const m=Math.min(W,H);
    switch(state){
      case 1:{ const cols=Math.ceil(Math.sqrt(N*W/H)), rows=Math.ceil(N/cols), gx=i%cols, gy=(i/cols)|0; const sp=Math.min(W*.8/cols,H*.8/rows);
        return [W/2+(gx-(cols-1)/2)*sp, H/2+(gy-(rows-1)/2)*sp]; }
      case 2:{ const u=((i/N)+t*.035)%1; const [x,y]=trail(u); const off=(a.seed%1-.5)*10; return [x*W, y*H+off]; }
      case 3:{ const bw=m*.42, bx=W/2-bw/2, by=H*.36-bw/2+Math.sin(t*1.4)*4; // ants under a block they carry
        const k=i/N; if(i<N*.55){ return [bx+(k/.55)*bw, by+bw+6+((i*7)%5)*3]; }
        const r=m*.42*Math.sqrt(a.ph), ang=a.seed+t*.15; return [W/2+Math.cos(ang)*r*1.15, H*.78+Math.sin(ang)*r*.25]; }
      case 4:{ const e=edges[i%edges.length], u=(((i/edges.length)|0)/(N/edges.length)+t*.05*(i%2?1:-1)+1)%1; const A=hubs[e[0]],B=hubs[e[1]];
        return [(A[0]+(B[0]-A[0])*u)*W, (A[1]+(B[1]-A[1])*u)*H]; }
      case 5:{ if(!markPts.length) break; const p=markPts[i%markPts.length], w=Math.min(W*.8,H*.8/markAR), h=w*markAR; return [W/2-w/2+p[0]*w, H/2-h/2+p[1]*h]; }
    }
    // 0: free roaming colony
    const n1=Math.sin(a.seed+t*.3)*.5+Math.sin(a.seed*1.7+t*.17)*.5, n2=Math.cos(a.seed*1.3+t*.27)*.5+Math.cos(a.seed*.7+t*.21)*.5;
    return [W*(.5+n1*.42), H*(.5+n2*.4)];
  }
  function ink(){ return getComputedStyle(document.body).color; }
  let INK=ink(), LIME=getComputedStyle(document.documentElement).getPropertyValue('--lime').trim()||'#cde66a', LINE=getComputedStyle(document.documentElement).getPropertyValue('--line').trim();
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{ INK=ink(); LINE=getComputedStyle(document.documentElement).getPropertyValue('--line').trim(); });
  function draw(){
    ctx.clearRect(0,0,W,H);
    // scaffolding per step
    ctx.strokeStyle=LINE; ctx.lineWidth=1;
    if(state===2){ ctx.setLineDash([2,6]); ctx.beginPath(); for(let u=0;u<=1.001;u+=.01){ const [x,y]=trail(u); u?ctx.lineTo(x*W,y*H):ctx.moveTo(x*W,y*H); } ctx.stroke(); ctx.setLineDash([]); }
    if(state===4){ edges.forEach(([a,b])=>{ ctx.beginPath(); ctx.moveTo(hubs[a][0]*W,hubs[a][1]*H); ctx.lineTo(hubs[b][0]*W,hubs[b][1]*H); ctx.stroke(); });
      ctx.fillStyle=LIME; hubs.forEach(h=>{ ctx.beginPath(); ctx.arc(h[0]*W,h[1]*H,5,0,7); ctx.fill(); }); }
    if(state===5 && markImg){ const w=Math.min(W*.8,H*.8/markAR), h=w*markAR; ctx.save(); ctx.globalAlpha=.07;
      ctx.filter=getComputedStyle(document.documentElement).getPropertyValue('--logo-filter').trim()||'none';
      ctx.drawImage(markImg,W/2-w/2,H/2-h/2,w,h); ctx.restore(); }
    if(state===3){ const m=Math.min(W,H), bw=m*.42; ctx.fillStyle=LIME; ctx.fillRect(W/2-bw/2, H*.36-bw/2+Math.sin(t*1.4)*4, bw, bw); }
    ants.forEach((a,i)=>{
      const [tx,ty]=target(a,i); const k0=(state===2||state===4?.12:.06); const k=RM?1:1-Math.pow(1-k0,FR);
      const nx=a.px+(tx-a.px)*k, ny=a.py+(ty-a.py)*k; a.vx=nx-a.px; a.vy=ny-a.py; a.px=nx; a.py=ny;
      let ang=Math.atan2(a.vy,a.vx); if(Math.hypot(a.vx,a.vy)<.05) ang=a.ang??0; a.ang=ang;
      const len=state===5?2.2:4.2;
      ctx.strokeStyle=a.lead&&state!==5?LIME:INK; ctx.lineWidth=state===5?2.6:2; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(a.px-Math.cos(ang)*len,a.py-Math.sin(ang)*len); ctx.lineTo(a.px+Math.cos(ang)*len,a.py+Math.sin(ang)*len); ctx.stroke();
    });
  }
  function loop(now){ if(!running) return; const dt=Math.min(.05,last?(now-last)/1000:1/60); last=now; t+=dt; FR=dt*60; draw(); requestAnimationFrame(loop); } /* time-based, so 60/120/144Hz screens move at the same speed */
  size(); addEventListener('resize',size);
  new IntersectionObserver(es=>{ const v=es[0].isIntersecting; if(v&&!running){ running=true; last=0; size(); requestAnimationFrame(loop); } if(!v) running=false; }).observe(cv);
  if(RM){ running=false; setTimeout(()=>{ size(); draw(); },50); }
  const words=['The colony','Precision','Direction','Strength','Collaboration','AntVisual'];
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(!e.isIntersecting) return; const s=+e.target.dataset.step;
    steps.forEach(x=>x.classList.toggle('on',x===e.target)); state=s; word.textContent=words[s]; lbl.textContent=`${pad2(s)} / 05`; if(RM){ size(); draw(); } }),{rootMargin:matchMedia('(max-width:860px)').matches?'-66% 0px -26% 0px':'-45% 0px -45% 0px'});
  steps.forEach(s=>io.observe(s));
})();
