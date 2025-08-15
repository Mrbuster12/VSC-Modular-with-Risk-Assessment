# CTC Modular Site – vNext Build (Aug 14, 2025)

This folder is a **complete copy** of the morning’s patched deployment **plus**:
- Fix: sticky **← Back to Hub** button in DSM→CTC (saves bridge and routes with `#k`).
- Bridge improvements: key propagation and producer (emits encrypted envelope on change).
- Stashed IP: `/stashed/projection_tierX_algorithms.js` + README (not loaded at runtime).

## Verify
1) Open `/index.html` → click DSM card.
2) Type DSM/Risk/Functioning/Safety Plan; see bridge toolbar = **FRESH**.
3) Click **← Back to Hub** → URL includes `#k=…`.
4) Reopen DSM or another module → loads with `?bridge=1#k=…` and prefills.
5) Confirm no network requests to `/stashed/*` in DevTools → Network.

## Notes
- All original UI and modules remain intact.
- No trade‑secret algorithms are shipped in runtime; projection Tier X files are stashed only.
