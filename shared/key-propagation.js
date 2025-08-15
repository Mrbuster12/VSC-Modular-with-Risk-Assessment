// /shared/key-propagation.js
// Propagate #k across same-origin links; ensure DSM link has ?bridge=1
(function(){
  function ready(fn){ if (document.readyState!=="loading") fn(); else document.addEventListener("DOMContentLoaded", fn); }
  function getKey(){ const f = new URLSearchParams(location.hash.slice(1)); return f.get("k"); }
  function sameOrigin(href){ try{ const u = new URL(href, location.href); return u.origin===location.origin; }catch{ return false; } }
  ready(() => {
    const key = getKey(); if (!key) return;
    document.querySelectorAll('a[href]').forEach(a => {
      const u = new URL(a.getAttribute('href'), location.href);
      if (!sameOrigin(u.href)) return;
      const frag = new URLSearchParams(u.hash.slice(1));
      if (!frag.get("k")) frag.set("k", key);
      u.hash = "#" + frag.toString();
      if (/\/assessment-core\/?$/.test(u.pathname)){
        const sp = u.searchParams; if (!sp.get("bridge")) sp.set("bridge","1"); u.search = "?" + sp.toString();
      }
      a.setAttribute('href', u.pathname + u.search + u.hash);
    });
  });
})();