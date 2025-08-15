// /assessment-core/scoring-bridges/tier9-escalation.js
// Enforce instantaneous escalation when red-flag signals are present.
// Works alongside existing scoring: after recompute, bump tier to a minimum threshold.
(function(){
  function ready(fn){ if (document.readyState!=="loading") fn(); else document.addEventListener("DOMContentLoaded", fn); }
  function parseCurrentTier(){
    // Try common selectors; fall back to scanning for "CTC-" tokens
    const candidates = [
      '#ctcTierValue', '.ctc-tier-value', '.ctc-tier-badge', '[data-ctc-tier]'
    ];
    for (const sel of candidates) {
      const el = document.querySelector(sel);
      if (el) {
        const v = (el.getAttribute('data-ctc-tier') || el.textContent || '').trim();
        const m = v.match(/CTC-(\d)/i);
        if (m) return parseInt(m[1],10);
      }
    }
    // generic scan
    const txt = document.body.innerText || '';
    const m = txt.match(/CTC-(\d)/);
    return m ? parseInt(m[1],10) : null;
  }
  function setVisibleTier(tier){
    // Prefer data attribute
    const badge = document.querySelector('.ctc-tier-badge,[data-ctc-tier]');
    if (badge){
      badge.setAttribute('data-ctc-tier', 'CTC-'+tier);
      if (badge.textContent) badge.textContent = 'CTC-'+tier;
    }
    // Inject/Update override ribbon
    let rib = document.getElementById('ctcOverrideRibbon');
    if (!rib){
      rib = document.createElement('div');
      rib.id = 'ctcOverrideRibbon';
      rib.style = 'position:sticky;top:34px;z-index:9997;background:#ffe8e8;border:1px solid #f5a3a3;margin:.5rem 1rem;padding:.5rem .75rem;border-radius:8px;font:14px/1.35 system-ui,-apple-system,Segoe UI,Roboto';
      document.body.prepend(rib);
    }
    rib.textContent = 'Safety override applied · Minimum tier enforced: CTC-'+tier;
  }
  function computeMinTier(signals){
    const severe = /severe/i.test(signals.functioning||'');
    const psychosis = !!signals.psychosis;
    const suicidal  = !!signals.suicidal;
    const overdose  = !!signals.overdose;
    const hospitalized = !!signals.hospitalized;
    const noPlan = (signals.safety_plan === 'No');
    // Hard matrix (conservative):
    // Any psychosis/suicidal/overdose/hospitalized -> min CTC-4
    if (psychosis || suicidal || overdose || hospitalized) return 4;
    // Severe + no safety plan -> min CTC-3
    if (severe && noPlan) return 3;
    return null;
  }
  function gatherSignals(){
    const dsm = (document.querySelector('#dsmBox,#dsmText,textarea[name*="dsm"]')?.value || '').trim();
    const risk = (document.querySelector('#riskBox,#assessment,textarea[name*="risk"],textarea[name*="assessment"]')?.value || '').trim();
    const functioning = (document.querySelector('#funcSel,#functioning,select[name*="function"]')?.value || '').trim();
    const safetyPlan = document.querySelector('input[name="sp"][value="No"]:checked,input[name="safetyPlan"][value="No"]:checked') ? 'No' : 'Yes';
    const psychosis = /psychosis|psychotic|hearing voices|hallucin/i.test((dsm+' '+risk));
    const suicidal  = /suicid/i.test((dsm+' '+risk));
    const overdose  = /overdose|fentanyl|narcan/i.test(risk);
    const hospitalized = /hospital|ER|ICU/i.test((dsm+' '+risk));
    return { functioning, safety_plan: safetyPlan, psychosis, suicidal, overdose, hospitalized };
  }
  function enforce(){
    try{
      const signals = gatherSignals();
      const minTier = computeMinTier(signals);
      if (!minTier) return;
      const curr = parseCurrentTier();
      if (curr == null || curr < minTier){
        // Store override globally for exporters/bridge
        window.__ctc_override__ = { tier: 'CTC-'+minTier, reason: 'Safety override (Tier9 escalation)' };
        setVisibleTier(minTier);
      }
    }catch(e){ /* no-op */ }
  }
  ready(() => {
    // Run once on load, then observe changes in the DOM to re-apply if scoring reruns
    enforce();
    const mo = new MutationObserver(() => enforce());
    mo.observe(document.body, { subtree:true, childList:true, characterData:true });
    // Re-run on input changes as well
    document.addEventListener('input', enforce, true);
    document.addEventListener('change', enforce, true);
  });
})();