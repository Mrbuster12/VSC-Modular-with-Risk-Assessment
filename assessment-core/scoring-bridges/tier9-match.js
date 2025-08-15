// /assessment-core/scoring-bridges/tier9-match.js
// Minimal matcher placeholder: expects window.__tier9_state__ to be consumed by producer patch.
export async function tier9Match({ dsmCodes=[], riskText="", age=null, signals={} }) {
  // Simple keyword/DSM pattern demo; replace with full mapping loader if present.
  const has = (rx) => rx.test(riskText);
  let reasons = [];
  let flags = [];
  let recommended_tier = null;

  const psychosis = signals.psychosis || /psychosis|hearing voices|hallucinat/i.test(riskText);
  const suicidal  = signals.suicidal  || /suicid/i.test(riskText);
  const overdose  = signals.overdose  || /overdose|fentanyl|narcan/i.test(riskText);
  const hospitalized = signals.hospitalized || /hospital|ER|ICU/i.test(riskText);

  if (psychosis) { reasons.push("Active psychosis indicators"); flags.push("ECL-0005"); }
  if (suicidal)  { reasons.push("Suicidal ideation reported");  flags.push("ECL-0002"); }
  if (overdose)  { reasons.push("Recent overdose risk markers"); flags.push("ECL-0001"); }
  if (hospitalized) { reasons.push("Recent hospitalization"); flags.push("ECL-0006"); }

  // Soft recommendation; hard escalation handled by tier9-escalation.js
  if ((psychosis || suicidal || overdose || hospitalized)) {
    recommended_tier = "CTC-4";
  }

  return { reasons, ts_flags: flags, recommended_tier };
}
