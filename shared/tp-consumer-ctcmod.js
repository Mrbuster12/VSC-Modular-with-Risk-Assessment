// shared/tp-consumer-ctcmod.js
(()=>{
  const careSel = '#ctc, #tp_care_tier, [data-bind="care-tier"]';
  const locSel = '#loc, #level_of_care, [name="loc"]';
  const probSel = '#problem, textarea[name="tp_problem"]';
  const goalSel = '#goals, textarea[name="tp_goal"]';
  const objSel = '#objectives, textarea[name="tp_objectives"]';
  const intSel = '#interventions, textarea[name="tp_interventions"]';
  const q=(s)=>document.querySelector(s);
  const appendOnce=(el, text, tag)=>{ if(!el||!text) return; const mk=`\n\n[autodoc:${tag}] `+text;
    if(!(el.value||'').includes(`[autodoc:${tag}]`)) el.value = (el.value? el.value+"\n\n": "") + mk; };
  const apply=(env)=>{
    const tp=window.AutoDoc.tpBlocks(env);
    const care=q(careSel);
    if(care){ if(care.tagName==='SELECT'){ const code=tp.careTier; [...care.options].forEach(o=>{ if((o.text||'').includes(code)) care.value=o.value; }); } else { care.textContent = tp.careTier; } }
    const loc=q(locSel); if(loc) { if('value' in loc) loc.value = tp.careTier; else loc.textContent = tp.careTier; }
    tp.blocks.forEach((b,i)=>{
      appendOnce(q(probSel), b.problem, `prob${i}`);
      appendOnce(q(goalSel), b.goal, `goal${i}`);
      appendOnce(q(objSel), b.objectives.map(x=>"- "+x).join("\n"), `obj${i}`);
      appendOnce(q(intSel), b.interventions.map(x=>"- "+x).join("\n"), `int${i}`);
    });
  };
  const init=()=>{ const st=window.SessionStore.get(); const last=window.VSCBridge.last();
    const env=(st&&st.envelope)||(last&&last.payload); if(env) apply(env); };
  window.addEventListener('DOMContentLoaded', init);
  window.VSCBridge.subscribe(apply);
})();