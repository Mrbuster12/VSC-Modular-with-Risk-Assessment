// shared/toolbar-inject.js
(()=>{window.addEventListener("DOMContentLoaded",()=>{
  if(!window.VSCBridge||!window.VSCBridge.last)return;
  const last=window.VSCBridge.last(); const env=last&&last.payload;
  const box=document.createElement("div"); box.style.cssText="position:fixed;bottom:12px;right:12px;padding:8px 10px;border:1px solid #999;background:#fff;font:12px system-ui;z-index:9999";
  box.textContent= env ? `Tier: ${env.data?.careTier||"n/a"} | Flags: ${(env.ts_flags||[]).join(",")}` : "DSM→CTC: (no data)";
  document.body.appendChild(box);
});})();