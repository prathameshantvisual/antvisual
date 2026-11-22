/* =====================================================================
   CONTACT — validation, prefill from other sections, form delivery
   Delivery modes (CONFIG.formEndpoint):
   1. Google Apps Script URL (script.google.com/macros/s/.../exec): saves to your Google Sheet,
      then confirms the row was really saved before telling the visitor "thank you".
   2. Any other URL: plain JSON POST of {name,email,need,details}; a 2xx response = success.
   3. Empty: the visitor is offered a "copy enquiry" fallback.
   ===================================================================== */
const Contact=(function(){
  const form=$('#enquiry'), chips=$('#needChips'), status=$('#formStatus'), btn=$('button[type="submit"]',form);
  chips.innerHTML=NEEDS.map((n,i)=>`<input type="radio" name="need" id="need-${i}" value="${esc(n)}"><label for="need-${i}">${esc(n)}</label>`).join('');
  const map={ 'Branding':'Branding','Logo design':'Logo design','Visual identity':'Branding','Website design':'Website design','App design':'Website design','Digital interfaces':'Website design',
    'Social media creatives':'Social media creatives','Marketing creatives':'Social media creatives','Graphic design':'Other','Infographics':'Infographics','Company decks':'Company deck' };
  function prefill(need){
    const v=map[need]||NEEDS.find(n=>n===need)||'Other';
    const r=$$('input[name="need"]',chips).find(x=>x.value===v); if(r) r.checked=true;
    document.getElementById('contact').scrollIntoView({behavior:RM?'auto':'smooth'});
    setTimeout(()=>$('#f-name').focus({preventScroll:true}),RM?0:900);
  }
  const err=(id,msg)=>{ $('#e-'+id).textContent=msg; $('#f-'+id).setAttribute('aria-invalid',!!msg); if(msg) $('#f-'+id).setAttribute('aria-describedby','e-'+id); };
  function text(d){ return `Name: ${d.name}\nEmail: ${d.email}\nNeed: ${d.need||'Not specified'}\n\n${d.details||''}`; }
  const isAppsScript=u=>/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec(?:\?.*)?$/.test(u||'');
  const makeId=()=> (window.crypto&&crypto.randomUUID) ? crypto.randomUUID().replace(/-/g,'') : 'av'+Date.now().toString(36)+Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2);

  function emailFallback(msg){
    status.className='form-status'; status.textContent=msg+' ';
    const a=document.createElement('a'); a.href='mailto:prathamesh@antvisual.com'; a.textContent='Email us directly'; status.appendChild(a);
    btn.disabled=false;
  }
  function saved(email){
    form.reset(); btn.disabled=false; status.className='form-status ok';
    status.textContent='Thank you. Your enquiry was saved and we will reply to '+email+'.';
  }

  /* Google Apps Script: no-cors POST (text/plain avoids the CORS preflight), then poll for a receipt via JSONP */
  function confirmReceipt(id,email){
    const t0=Date.now(); let attempt=0, script=null, cb='', pollT=null, scriptT=null, finished=false;
    function cleanup(){ if(script){ script.onerror=null; script.remove(); script=null; } if(cb){ try{ delete window[cb]; }catch(e){} cb=''; } if(scriptT){ clearTimeout(scriptT); scriptT=null; } }
    function end(ok){ if(finished) return; finished=true; clearTimeout(pollT); cleanup();
      ok ? saved(email) : emailFallback('We could not confirm that your enquiry arrived. Your message is still in the form.'); }
    function check(){
      if(finished) return;
      if(Date.now()-t0>=25000) return end(false);
      attempt++; const me='antVisualReceipt_'+id+'_'+attempt; cb=me;
      script=document.createElement('script'); script.async=true;
      window[me]=r=>{ if(finished||cb!==me) return; cleanup();
        if(r&&r.status==='saved') return end(true);
        if(r&&r.status==='failed') return end(false);
        pollT=setTimeout(check,1200); };
      script.onerror=()=>{ if(finished||cb!==me) return; cleanup(); pollT=setTimeout(check,1500); };
      const sep=CONFIG.formEndpoint.indexOf('?')===-1?'?':'&';
      script.src=CONFIG.formEndpoint+sep+'action=status&id='+encodeURIComponent(id)+'&callback='+encodeURIComponent(me)+'&_='+Date.now();
      scriptT=setTimeout(()=>{ if(finished||cb!==me) return; cleanup(); pollT=setTimeout(check,1500); },6000);
      document.head.appendChild(script);
    }
    check();
  }
  function sendAppsScript(d){
    const id=makeId();
    status.className='form-status'; status.textContent='Sending…'; btn.disabled=true;
    fetch(CONFIG.formEndpoint,{ method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain;charset=utf-8'},
      body:JSON.stringify({ id, name:d.name, email:d.email, need:d.need||'Not specified', message:d.details, website:d.website }) })
      .then(()=>confirmReceipt(id,d.email))
      .catch(()=>emailFallback('The enquiry could not be sent. Your message is still in the form.'));
  }
  async function sendJson(d){
    status.className='form-status'; status.textContent='Sending…'; btn.disabled=true;
    try{ const r=await fetch(CONFIG.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({name:d.name,email:d.email,need:d.need,details:d.details})});
      if(!r.ok) throw 0; saved(d.email); }
    catch(_){ emailFallback('The enquiry could not be sent. Your message is still in the form.'); }
  }

  form.addEventListener('submit',e=>{
    e.preventDefault();
    const d={ name:$('#f-name').value.trim(), email:$('#f-email').value.trim(), need:(form.need.value||''), details:$('#f-details').value.trim(), website:($('#f-website')||{value:''}).value.trim() };
    let ok=true;
    err('name', d.name?'':'Add your name so we know who to reply to.'); if(!d.name) ok=false;
    const em=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email); err('email', em?'':'Add an email address like name@company.com.'); if(!em) ok=false;
    if(!ok){ status.className='form-status'; status.textContent='Check the highlighted fields.'; return; }
    if(d.website){ saved(d.email); return; }                 // honeypot filled = bot: pretend success, send nothing
    if(isAppsScript(CONFIG.formEndpoint)) return sendAppsScript(d);
    if(CONFIG.formEndpoint) return sendJson(d);
    status.className='form-status ok';
    status.innerHTML='This page isn’t connected to a mail service yet. <button class="copy" type="button" id="copyEnq">Copy enquiry</button> and email it to prathamesh@antvisual.com.';
    $('#copyEnq').addEventListener('click',ev=>copyText(text(d),ev.currentTarget));
  });
  return { prefill };
})();
function copyText(s,btn){
  const done=()=>{ const o=btn.textContent; btn.textContent='Copied'; setTimeout(()=>btn.textContent=o,1600); };
  try{ navigator.clipboard.writeText(s).then(done,()=>fallback()); }catch(e){ fallback(); }
  function fallback(){ const ta=document.createElement('textarea'); ta.value=s; ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta); ta.select(); try{ document.execCommand('copy'); done(); }catch(e){} ta.remove(); }
}
$$('.copy[data-copy]').forEach(b=>b.addEventListener('click',()=>copyText(b.dataset.copy,b)));
