
// shared/scorer-client.js
export async function serverScore(signals){
  const res = await fetch("/.netlify/functions/rora-match", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ signals })
  });
  if (!res.ok) throw new Error("Server scorer failed: "+res.status);
  return await res.json();
}
export async function voucherIssue(envelope){
  const res = await fetch("/.netlify/functions/voucher-issue", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(envelope)
  });
  if (!res.ok) throw new Error("Voucher issue failed: "+res.status);
  return await res.json();
}
