const STORAGE_KEY = "nwc_utm_params";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"];

// Ad traffic lands on the root page carrying these in the URL — stash them
// so later pages (the actual devis flow) can still tag Clarity sessions with
// campaign info even though the params themselves aren't in their URL.
export function captureUtmParams(query) {
  const found = {};
  for (const key of UTM_KEYS) {
    if (query[key]) found[key] = query[key];
  }
  if (Object.keys(found).length === 0) return getStoredUtmParams();
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found));
  } catch {}
  return found;
}

export function getStoredUtmParams() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
