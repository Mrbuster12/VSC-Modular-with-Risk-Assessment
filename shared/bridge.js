// shared/bridge.js
(() => {
  const channelName = "vsc_bridge_channel";
  const bc = ("BroadcastChannel" in window) ? new BroadcastChannel(channelName) : null;
  const echo = (payload) => {
    try { localStorage.setItem("vsc_bridge_last", JSON.stringify({ ts: Date.now(), payload }));
      window.dispatchEvent(new CustomEvent("vsc:bridge:update", { detail: payload })); } catch(_) {}
  };
  window.VSCBridge = {
    push(payload = {}) {
      const env = { type: payload.type || "update", ts: Date.now(),
        data: payload.data || {}, ts_flags: payload.ts_flags || [], source: location.pathname };
      if (bc) bc.postMessage(env); echo(env);
    },
    subscribe(handler){ if (bc) bc.onmessage = e => handler && handler(e.data);
      window.addEventListener("vsc:bridge:update", e => handler && handler(e.detail)); },
    last(){ try { return JSON.parse(localStorage.getItem("vsc_bridge_last")||"null"); } catch(_) { return null; } }
  };
})();