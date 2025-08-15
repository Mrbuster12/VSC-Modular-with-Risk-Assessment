# Tier9 Instant Escalation Build (vNext)

This is a separate build that **instantly elevates the CTC tier** on DSM→CTC when red‑flag signals are present,
*regardless of the base score*, using a conservative safety matrix:

- Any of: **psychosis** OR **suicidal ideation** OR **overdose** OR **recent hospitalization** ⇒ **minimum CTC‑4**
- If **Functioning = Severe** AND **Safety Plan = No** ⇒ **minimum CTC‑3**

## What was added
- `/assessment-core/scoring-bridges/tier9-escalation.js` — hard safety override using DOM observers.
- `/assessment-core/scoring-bridges/tier9-match.js` — light matcher (pairs with your Tier9 mapping when present).
- `/assessment-core/scoring-bridges/bridge-producer-tier9-patch.js` — includes Tier9 reasons/flags and any override in the encrypted bridge payload.

## Wire-up (already done in this build)
The DSM page loads these files and the override is enforced automatically. The visible tier badge will reflect the **minimum tier** and `env.override` is carried to the next modules via the encrypted bridge.

## Notes
- This is **separate** from your live deployment. Test via a branch or new site and promote when satisfied.
- Serverless scorers (PAARE/Reflex) can still return a **higher** tier; the higher of (server, override) wins.
