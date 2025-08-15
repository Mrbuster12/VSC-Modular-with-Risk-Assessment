// shared/autodoc-schema.js
window.AutoDoc = (() => {
  const deriveFlags = (text) => {
    const t = (text || "").toLowerCase();
    const f = [];
    if (/(suicid|self[- ]?harm|kill myself|end my life)/.test(t)) f.push("SI");
    if (/(homicid|kill (him|her|them)|violence)/.test(t)) f.push("HI");
    if (/(psychosis|hallucin|delusion|paranoid)/.test(t)) f.push("PSY");
    if (/(hospitaliz|inpatient|admit)/.test(t)) f.push("HOSP");
    return f;
  };
  const computeCareTier = (txt, risk) => {
    const t = (txt + " " + risk).toLowerCase();
    if (/(suicid|homicid|psychosis|danger|inpatient|hospital)/.test(t)) return "CTC-4";
    if (/(severe|acute|mania|detox|withdrawal)/.test(t)) return "CTC-3";
    if (/(moderate|ongoing|functional impairment)/.test(t)) return "CTC-2";
    return "CTC-1";
  };
  const normalize = ({ dsmText="", risk="" }) => {
    const flags = deriveFlags(dsmText + " " + risk);
    const careTier = computeCareTier(dsmText, risk);
    return { type:"ctc_update", data:{ dsmText, risk, careTier }, ts_flags: flags };
  };
  const mseFragments = (env) => {
    const flags = env.ts_flags || [];
    const dt = new Date(env.ts || Date.now()).toISOString();
    const riskSummary = `Risk events ${dt}: ${flags.join(", ") || "none"}. Risk: ${env.data?.risk || "n/a"}`;
    const thought = flags.includes("SI") ? "Reports SI; safety planning indicated."
      : flags.includes("HI") ? "Reports HI; safety planning/consultation indicated."
      : flags.includes("PSY") ? "Psychotic features noted; reality testing impaired."
      : "Thought content WNL for session.";
    return { riskSummary, thought };
  };
  const tpBlocks = (env) => {
    const flags = env.ts_flags || [];
    const tier = env.data?.careTier || "CTC-1";
    const out = [];
    if (flags.includes("SI")) out.push({
      problem:"Acute risk of self-harm (SI).", goal:"Stabilize safety; reduce SI.",
      objectives:["Identify 3 coping strategies for SI within 24h.","Daily safety check-ins for 7 days."],
      interventions:["Safety plan established; contacts confirmed.","Increase session frequency; consider higher level of care per tier."]
    });
    if (flags.includes("HI")) out.push({
      problem:"Risk of harm to others (HI).", goal:"Reduce aggressive ideation; ensure safety of others.",
      objectives:["Identify triggers and early warnings of HI.","Demonstrate de-escalation strategies."],
      interventions:["Safety planning; collateral consultation.","Monitor; consider higher level of care per tier."]
    });
    if (flags.includes("PSY")) out.push({
      problem:"Psychotic symptoms impacting function.", goal:"Improve reality testing; reduce distress.",
      objectives:["Track psychotic symptoms daily.","Use grounding techniques during episodes."],
      interventions:["Reality testing; coping skills; med mgmt referral as indicated.","Consider higher level of care per tier."]
    });
    return { careTier: tier, blocks: out };
  };
  return { normalize, mseFragments, tpBlocks };
})();