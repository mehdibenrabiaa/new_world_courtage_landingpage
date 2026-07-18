import { ArrowRight } from "lucide-react";

export default function ManageCookiesButton({ className = "" }) {
  function handleClick() {
    window.dispatchEvent(new Event("open-cookie-prefs"));
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 text-[var(--color-brand)] text-sm hover:underline ${className}`}
    >
      <ArrowRight size={14} />
      Gérer mes préférences cookies
    </button>
  );
}
