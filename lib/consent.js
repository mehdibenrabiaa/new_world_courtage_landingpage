const KEY = "nwc_consent";
const VERSION = 1;
const MAX_AGE_MS = 13 * 30 * 24 * 60 * 60 * 1000; // 13 months (CNIL max)

export function getConsent() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.v !== VERSION) return null;
    if (Date.now() - data.ts > MAX_AGE_MS) return null;
    return data;
  } catch {
    return null;
  }
}

export function saveConsent({ analytics, marketing }) {
  const data = { v: VERSION, ts: Date.now(), analytics, marketing };
  localStorage.setItem(KEY, JSON.stringify(data));
  return data;
}

export function clearConsent() {
  localStorage.removeItem(KEY);
}
