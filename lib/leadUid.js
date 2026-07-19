function storageKeyFor(formKey) {
  return `nwc_lead_uid_${formKey}`;
}

// Stable per-form-session id so a partial save (name+phone) and the later
// completed save land on the same backend row instead of creating two.
export function getOrCreateLeadUid(formKey) {
  const key = storageKeyFor(formKey);
  try {
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const uid = crypto.randomUUID();
    localStorage.setItem(key, uid);
    return uid;
  } catch {
    return crypto.randomUUID();
  }
}
