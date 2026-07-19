const LEADS_API_URL = process.env.NEXT_PUBLIC_LEADS_API_URL || "http://localhost:8001";

// Upserts by leadUid: call once with just name+phone as soon as they're known
// (partial save) and again at the end with the full answers + completed:true —
// both calls land on the same backend row instead of creating two.
export async function submitLead({ leadUid, name, phone, insuranceType, answers, sourcePath, completed = false }) {
  const res = await fetch(`${LEADS_API_URL}/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      lead_uid: leadUid,
      name,
      phone,
      insurance_type: insuranceType,
      answers,
      source_path: sourcePath,
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
      completed,
    }),
  });
  if (!res.ok) throw new Error(`Failed to submit lead (${res.status})`);
  return res.json();
}
