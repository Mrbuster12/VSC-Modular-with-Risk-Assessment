
// shared/bridge-tools.js
window.BridgeTools = (function(){
  function statusFor(key="session_bridge"){
    const at = parseInt(localStorage.getItem(key+":ts")||"0",10);
    const ttl = parseInt(localStorage.getItem(key+":ttl")||String(2*60*60*1000),10);
    if (!at) return {state:"empty", ageMs:0, ttlMs:ttl};
    const age = Date.now()-at;
    if (age > ttl) return {state:"expired", ageMs:age, ttlMs:ttl};
    const state = (age > (ttl*0.5)) ? "stale" : "fresh";
    return {state, ageMs:age, ttlMs:ttl};
  }
  function human(ms){
    const s = Math.floor(ms/1000);
    const m = Math.floor(s/60);
    const h = Math.floor(m/60);
    if (h>0) return h+"h "+(m%60)+"m";
    if (m>0) return m+"m "+(s%60)+"s";
    return s+"s";
  }
  async function copyCurrent(key="session_bridge"){
    try{
      const pass = window.Bridge?.fragKey?.() || "";
      let text = "";
      if (pass){
        const obj = await window.Bridge.load(key, pass);
        if (obj) text = JSON.stringify(obj, null, 2);
      }
      if (!text && typeof window.__buildCurrentEnvelope === "function"){
        text = JSON.stringify(await window.__buildCurrentEnvelope(), null, 2);
      }
      if (!text){
        alert("No session to copy. Generate first or use Import.");
        return;
      }
      await navigator.clipboard.writeText(text);
      alert("Session JSON copied to clipboard.");
    }catch(e){ console.warn(e); alert("Copy failed: "+e); }
  }
  async function importJsonToBridge(nextUrl="/assessment-core/?bridge=1"){
    try{
      const text = prompt("Paste Session JSON:");
      if (!text) return;
      const obj = JSON.parse(text);
      const pass = (crypto.randomUUID && crypto.randomUUID()) || String(Date.now());
      await window.Bridge.save("session_bridge", obj, pass);
      location.href = nextUrl + "#k="+encodeURIComponent(pass);
    }catch(e){ console.warn(e); alert("Import failed: "+e); }
  }
  function clearBridge(){
    window.Bridge.clear("session_bridge");
    alert("Bridge cleared.");
    document.querySelector("#bridgeStatusBadge")?.remove();
  }
  function setTTL(hours){
    const ttlMs = Math.max(1, Math.round(parseFloat(hours||"2")*60*60*1000));
    localStorage.setItem("session_bridge:ttl", String(ttlMs));
    alert("Bridge TTL set to ~"+hours+" hour(s). New handoffs will use this TTL.");
    renderStatus();
  }
  function renderStatus(){
    const s = statusFor();
    let badge = document.querySelector("#bridgeStatusBadge");
    if (!badge){
      badge = document.createElement("div");
      badge.id = "bridgeStatusBadge";
      badge.style = "position:sticky;top:0;z-index:9999;display:flex;gap:.5rem;align-items:center;justify-content:space-between;background:#f6f6f8;border-bottom:1px solid #ddd;padding:.5rem 1rem;font:14px/1.3 system-ui,-apple-system,Segoe UI,Roboto,Arial";
      const left = document.createElement("div");
      left.id = "bridgeStatusLeft";
      const right = document.createElement("div");
      right.id = "bridgeStatusRight";
      right.style = "display:flex;gap:.5rem;align-items:center;";
      right.innerHTML = `
        <button id="btnCopy" type="button">Copy Session JSON</button>
        <button id="btnImport" type="button">Import Session JSON</button>
        <button id="btnClear" type="button">Clear Bridge</button>
        <label style="display:inline-flex;align-items:center;gap:.25rem;">TTL:
          <select id="ttlSel">
            <option value="0.5">30m</option>
            <option value="2" selected>2h</option>
            <option value="24">24h</option>
          </select>
        </label>`;
      badge.appendChild(left);
      badge.appendChild(right);
      document.body.prepend(badge);
      badge.querySelector("#btnCopy").addEventListener("click", () => copyCurrent());
      badge.querySelector("#btnImport").addEventListener("click", () => importJsonToBridge());
      badge.querySelector("#btnClear").addEventListener("click", () => clearBridge());
      badge.querySelector("#ttlSel").addEventListener("change", (e) => setTTL(e.target.value));
    }
    const left = badge.querySelector("#bridgeStatusLeft");
    const dot = (c)=>`<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${c};vertical-align:middle;margin-right:.5rem;"></span>`;
    const color = s.state==="fresh"?"#22a06b":(s.state==="stale"?"#f0ad4e":(s.state==="expired"?"#d9534f":"#888"));
    left.innerHTML = `${dot(color)}<strong>Bridge:</strong> ${s.state.toUpperCase()} • Age ${human(s.ageMs)} • TTL ${human(s.ttlMs)}`;
    const ttlSel = badge.querySelector("#ttlSel");
    const hr = Math.round((s.ttlMs/3600000)*10)/10;
    for (const opt of ttlSel.options){
      if (Math.abs(parseFloat(opt.value) - hr) < 0.01){ opt.selected = true; break; }
    }
  }
  return { statusFor, renderStatus, setTTL, copyCurrent, importJsonToBridge, clearBridge };
})();
