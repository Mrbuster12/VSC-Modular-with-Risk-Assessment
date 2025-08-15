// shared/ctc-publisher-ctcmod.js
(()=>{
  const dsmSel = '#dsmText, #dsmBox, [name="dsm_text"], textarea[name="dsm"]';
  const riskSel = '#risk, #riskBox, [name="risk"]';
  const careMirrorSel = '#careTier, #ctcPanel, [data-bind="care-tier"]';
  const q = (s)=>document.querySelector(s);
  const read = (s)=>{ const el=q(s); return el ? (el.value ?? el.textContent ?? '').trim() : ''; };
  const mirror = (tier)=>{ const el=q(careMirrorSel); if(el){ if('value' in el) el.value=tier; else el.textContent=tier; } };
  const publish = ()=>{
    const env = window.AutoDoc.normalize({ dsmText: read(dsmSel), risk: read(riskSel) });
    window.VSCBridge.push(env); window.SessionStore.saveEnvelope(env); mirror(env.data.careTier);
  };
  window.addEventListener('DOMContentLoaded', ()=>{
    ['input','change','keyup'].forEach(evt=>document.addEventListener(evt,(e)=>{
      const t=e.target; if(!t) return;
      if(t.matches(dsmSel) || t.matches(riskSel)) publish();
    }));
    const last = window.VSCBridge.last(); const st = window.SessionStore.get();
    const env = (st && st.envelope) || (last && last.payload) || null;
    if (env?.data?.careTier) mirror(env.data.careTier);
  });
})();