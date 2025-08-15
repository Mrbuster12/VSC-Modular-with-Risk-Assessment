// /assessment-core/scoring-bridges/bridge-producer-tier9-patch.js
// If Tier9 state/override is present, include it in the bridge envelope at save-time.
(function(){
  const origSave = (window.Bridge && window.Bridge.save) ? window.Bridge.save.bind(window.Bridge) : null;
  if (!origSave) return;
  window.Bridge.save = async function(key, env, pass, ttl){
    try{
      // Merge Tier9 state
      if (window.__tier9_state__) {
        env.tier9 = {
          reasons: window.__tier9_state__.reasons || [],
          ts_flags: window.__tier9_state__.ts_flags || [],
          recommended_tier: window.__tier9_state__.recommended_tier || null
        };
      }
      // Merge explicit override
      if (window.__ctc_override__){
        env.override = window.__ctc_override__;
      }
    }catch(e){ /* ignore */ }
    return origSave(key, env, pass, ttl);
  };
})();