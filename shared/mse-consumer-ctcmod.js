// shared/mse-consumer-ctcmod.js
(()=>{
  const thoughtSel = '#thought, #mse_thought, textarea[name="mse_thought"]';
  const outSel = '#out, #mse_risk_summary, textarea[name="mse_risk_summary"]';
  const q=(s)=>document.querySelector(s);
  const appendOnce=(el, text, tag)=>{ if(!el||!text) return; const mk=`\n\n[autodoc:${tag}] `+text;
    if(!(el.value||'').includes(`[autodoc:${tag}]`)) el.value = (el.value? el.value+"\n\n": "") + mk; };
  const apply=(env)=>{
    const fr = window.AutoDoc.mseFragments(env);
    appendOnce(q(thoughtSel), fr.thought, "thought");
    appendOnce(q(outSel), `Care Tier: ${env.data?.careTier||"n/a"} | ${fr.riskSummary}`, "risk");
  };
  const init=()=>{ const st=window.SessionStore.get(); const last=window.VSCBridge.last();
    const env=(st&&st.envelope)||(last&&last.payload); if(env) apply(env); };
  window.addEventListener('DOMContentLoaded', init);
  window.VSCBridge.subscribe(apply);
})();