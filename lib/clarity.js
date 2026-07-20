// Thin wrappers around window.clarity — safe to call any time (the injected
// snippet defines a stub that queues calls until the real script loads), and
// a no-op during SSR or if Clarity hasn't been injected for any reason.

export function clarityEvent(name) {
  if (typeof window !== "undefined" && window.clarity) window.clarity("event", name);
}

export function claritySet(key, value) {
  if (typeof window !== "undefined" && window.clarity && value) window.clarity("set", key, String(value));
}

export function clarityIdentify(customId) {
  if (typeof window !== "undefined" && window.clarity && customId) window.clarity("identify", customId);
}
