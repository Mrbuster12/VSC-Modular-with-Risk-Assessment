// /assessment-core/add-return-to-hub.js
// Sticky ← Back to Hub button: saves to bridge, then routes to hub with #k
(function(){
  function ready(fn){ if (document.readyState!=="loading") fn(); else document.addEventListener("DOMContentLoaded", fn); }
  function getKey(){ const f = new URLSearchParams(location.hash.slice(1)); return f.get("k") || sessionStorage.getItem("session_bridge_key"); }
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
  ready(() => {
    const hubPath = document.body.getAttribute("data-hub") || "/index.html";
    const bar = document.createElement("div");
    bar.style = "position:sticky;top:0;z-index:9998;background:#fff;border-bottom:1px solid #ddd;padding:.5rem 1rem;display:flex;justify-content:space-between;align-items:center;font:15px/1.3 system-ui,-apple-system,Segoe UI,Roboto,Arial";
    const btn = document.createElement("button");
    btn.textContent = "← Back to Hub";
    btn.style = "padding:.35rem .6rem;border:1px solid #aaa;border-radius:8px;background:#f7f7f7;cursor:pointer";
    btn.addEventListener("click", async () => {
      try{
        const env = await buildEnvelope();
        let k = getKey(); if (!k){ k = (crypto.randomUUID && crypto.randomUUID()) || String(Date.now()); }
        const ttl = parseInt(localStorage.getItem("session_bridge:ttl") || String(2*60*60*1000), 10);
        if (window.Bridge) await window.Bridge.save("session_bridge", env, k, ttl);
        const u = new URL(hubPath, location.origin);
        const f = new URLSearchParams(u.hash.slice(1)); f.set("k", k); u.hash = "#" + f.toString();
        location.href = u.href;
      }catch(e){ location.href = hubPath; }
    });
    bar.appendChild(btn);
    document.body.prepend(bar);
  });
})();