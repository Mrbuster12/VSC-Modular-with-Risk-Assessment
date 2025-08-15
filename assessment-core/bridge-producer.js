// /assessment-core/bridge-producer.js
// Save DSM→CTC state to encrypted bridge on every change (debounced)
(function(){
  function ready(fn){ if (document.readyState!=="loading") fn(); else document.addEventListener("DOMContentLoaded", fn); }
  function getOrMakeKey(){
    let k = sessionStorage.getItem("session_bridge_key");
    if (!k){
      k = (crypto.randomUUID && crypto.randomUUID()) || String(Date.now());
      sessionStorage.setItem("session_bridge_key", k);
      const url = new URL(location.href);
      const frag = new URLSearchParams(url.hash.slice(1)); frag.set("k", k);
      history.replaceState(null, "", url.pathname + url.search + "#" + frag.toString());
    }
    return k;
  }
  async function buildEnvelope(){
    const dsm = (document.querySelector('#dsmBox,#dsmText,textarea[name*="dsm"]')?.value || "").trim();
    const risk = (document.querySelector('#riskBox,#assessment,textarea[name*="risk"],textarea[name*="assessment"]')?.value || "").trim();
    const functioning = (document.querySelector('#funcSel,#functioning,select[name*="function"]')?.value || "").trim();
    const safetyPlan = document.querySelector('input[name="sp"][value="No"]:checked,input[name="safetyPlan"][value="No"]:checked') ? "No" : "Yes";
    const psychosis = !!document.querySelector('[data-flag="psychosis"].active,input[name="psychosis"]:checked');
    const suicidal  = !!document.querySelector('[data-flag="suicidal"].active,input[name="suicidal"]:checked');
    const overdose  = /overdose|fentanyl|narcan/i.test(risk);
    const hospitalized = /hospital|ER|ICU/i.test(risk);
    return { v:2, source:"assessment-core",
      signals:{ psychosis, suicidal, overdose, hospitalized, safety_plan:safetyPlan, functioning },
      dsm_text:dsm, risk_text:risk };
  }
  let t=null;
  async function saveDebounced(){
    clearTimeout(t);
    t = setTimeout(async () => {
      if (!window.Bridge) return;
      const env = await buildEnvelope();
      const key = getOrMakeKey();
      const ttl = parseInt(localStorage.getItem("session_bridge:ttl") || String(2*60*60*1000), 10);
      await window.Bridge.save("session_bridge", env, key, ttl);
    }, 350);
  }
  function wireInputs(){
    document.querySelectorAll('input,textarea,select').forEach(el => {
      el.addEventListener("input", saveDebounced);
      el.addEventListener("change", saveDebounced);
    });
  }
  ready(() => {
    if (!window.Bridge){ console.warn("Bridge not loaded; producer inactive."); return; }
    wireInputs();
    saveDebounced();
    const gen = document.querySelector('#generateBtn,[data-action="generate-doc"]');
    if (gen){ gen.addEventListener("click", saveDebounced, {capture:true}); }
  });
})();