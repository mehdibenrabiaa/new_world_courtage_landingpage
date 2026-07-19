import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { X, BarChart2, Megaphone, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getConsent, saveConsent } from "@/lib/consent";

// ── Replace with your actual tracking IDs ────────────────────────────────────
const GA_ID         = "G-XXXXXXXXXX";
const CLARITY_ID    = "XXXXXXXXXX";
const META_PIXEL_ID = "XXXXXXXXXXXXXXX";
// ─────────────────────────────────────────────────────────────────────────────

function injectGA(id) {
  if (document.getElementById("ga-script")) return;
  const s1 = document.createElement("script");
  s1.id = "ga-script"; s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s1);
  const s2 = document.createElement("script");
  s2.id = "ga-init";
  s2.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}',{anonymize_ip:true});`;
  document.head.appendChild(s2);
}

function injectClarity(id) {
  if (document.getElementById("clarity-script")) return;
  const s = document.createElement("script");
  s.id = "clarity-script";
  s.innerHTML = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${id}");`;
  document.head.appendChild(s);
}

function injectMetaPixel(id) {
  if (document.getElementById("meta-pixel")) return;
  const s = document.createElement("script");
  s.id = "meta-pixel";
  s.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${id}');fbq('track','PageView');`;
  document.head.appendChild(s);
}

export function applyConsent(analytics, marketing) {
  if (analytics) { injectGA(GA_ID); injectClarity(CLARITY_ID); }
  if (marketing) { injectMetaPixel(META_PIXEL_ID); }
}

// ── Cookie SVG (inlined lucide icon) ─────────────────────────────────────────
function CookieIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
      <path d="M8.5 8.5v.01" /><path d="M16 15.5v.01" />
      <path d="M12 12v.01" /><path d="M11 17v.01" /><path d="M7 14v.01" />
    </svg>
  );
}

// ── Toggle switch ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2 ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      } ${checked ? "bg-[var(--color-brand)]" : "bg-gray-200"}`}
    >
      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

// ── Category definitions ──────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: "essential", icon: Lock, label: "Essentiels", locked: true,
    description: "Nécessaires au bon fonctionnement du site. Ces cookies ne peuvent pas être désactivés.",
    providers: "New World Courtage",
  },
  {
    id: "analytics", icon: BarChart2, label: "Analytique", locked: false,
    description: "Nous aident à comprendre comment les visiteurs utilisent notre site afin d'en améliorer les performances.",
    providers: "Google Analytics, Microsoft Clarity",
  },
  {
    id: "marketing", icon: Megaphone, label: "Marketing", locked: false,
    description: "Permettent de vous proposer des publicités pertinentes et de mesurer l'efficacité de nos campagnes.",
    providers: "Meta Pixel (Facebook & Instagram)",
  },
];

// ── Shared preferences panel (also used on /cookies/ page) ───────────────────
export function CookiePreferencesPanel({ analytics, marketing, setAnalytics, setMarketing, onSave, onAcceptAll, onRejectAll, onClose = () => {}, loading = null }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-base text-gray-500 leading-relaxed">
        Choisissez les catégories de cookies que vous souhaitez autoriser. Votre choix sera conservé 13 mois.{" "}
        <Link href="/confidentialite/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-brand)] hover:underline">Politique de confidentialité</Link>
      </p>

      <div className="flex flex-col gap-3">
        {CATEGORIES.map(({ id, icon: Icon, label, description, providers, locked }) => {
          const checked = locked || (id === "analytics" ? analytics : marketing);
          const onChange = id === "analytics" ? setAnalytics : setMarketing;
          return (
            <div key={id} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50">
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Icon size={15} className="text-[var(--color-brand)] shrink-0" />
                  <span className="text-base font-semibold text-[#131212]">{label}</span>
                  {locked && (
                    <span className="text-xs font-medium text-gray-400 border border-gray-200 rounded-full px-2 py-0.5 leading-none">
                      Toujours actif
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 leading-relaxed mt-0.5">{description}</p>
                <p className="text-xs text-gray-400 mt-1">Prestataires : {providers}</p>
              </div>
              <div className="shrink-0 pt-0.5">
                <Toggle checked={checked} onChange={onChange} disabled={locked} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 pt-1">
        <Button onClick={onSave} disabled={!!loading} className="cta-btn text-white w-full text-base font-semibold py-[12px] h-auto">
          {loading === "save" ? <Loader2 size={16} className="animate-spin" /> : "Enregistrer mes préférences"}
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={onRejectAll} disabled={!!loading} variant="ghost" className="text-gray-500 hover:text-[#131212] text-base py-[12px] h-auto border border-gray-200">
            {loading === "reject" ? <Loader2 size={16} className="animate-spin" /> : "Tout refuser"}
          </Button>
          <Button onClick={onAcceptAll} disabled={!!loading} variant="ghost" className="text-[var(--color-brand)] hover:text-[var(--color-brand-hover)] font-semibold text-base py-[12px] h-auto border border-gray-200">
            {loading === "accept" ? <Loader2 size={16} className="animate-spin" /> : "Tout accepter"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CookieBanner() {
  const [mounted, setMounted]       = useState(false);
  const [visible, setVisible]       = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const [prefsOpen, setPrefsOpen]   = useState(false);
  const [analytics, setAnalytics]   = useState(true);
  const [marketing, setMarketing]   = useState(false);
  const [loading, setLoading]       = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartY = useRef(null);

  function handleTouchStart(e) {
    dragStartY.current = e.touches[0].clientY;
  }
  function handleTouchMove(e) {
    const delta = e.touches[0].clientY - dragStartY.current;
    if (delta > 0) setDragOffset(delta);
  }
  function handleTouchEnd() {
    if (dragOffset > 80) {
      setPrefsOpen(false);
    }
    setDragOffset(0);
    dragStartY.current = null;
  }

  useEffect(() => {
    const consent = getConsent();
    if (consent) {
      setHasConsent(true);
      setAnalytics(consent.analytics);
      setMarketing(consent.marketing);
      applyConsent(consent.analytics, consent.marketing);
    }
    setMounted(true);
    const slideIn = setTimeout(() => setVisible(true), 2000);

    const handler = () => setPrefsOpen(true);
    window.addEventListener("open-cookie-prefs", handler);

    return () => {
      clearTimeout(slideIn);
      window.removeEventListener("open-cookie-prefs", handler);
    };
  }, []);

  const acceptAll = useCallback(() => {
    setLoading("accept");
    setTimeout(() => {
      saveConsent({ analytics: true, marketing: true });
      applyConsent(true, true);
      setAnalytics(true); setMarketing(true);
      setHasConsent(true);
      setPrefsOpen(false);
      setLoading(null);
    }, 1000);
  }, []);

  const rejectAll = useCallback(() => {
    setLoading("reject");
    setTimeout(() => {
      saveConsent({ analytics: false, marketing: false });
      setAnalytics(false); setMarketing(false);
      setHasConsent(true);
      setPrefsOpen(false);
      setLoading(null);
    }, 1000);
  }, []);

  const savePrefs = useCallback(() => {
    setLoading("save");
    setTimeout(() => {
      saveConsent({ analytics, marketing });
      applyConsent(analytics, marketing);
      setHasConsent(true);
      setPrefsOpen(false);
      setLoading(null);
    }, 1000);
  }, [analytics, marketing]);

  if (!mounted) return null;

  return (
    <>
      {/* Floating cookie button — rendered in its own portal so Radix Sheet's inert on #__next doesn't block it */}
      {createPortal(
        <div className={`fixed bottom-6 left-6 z-[200] transition-all duration-500 ease-out ${visible ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"}`}>
          <button
            onClick={() => setPrefsOpen(true)}
            aria-label="Gérer les cookies"
            className="relative w-14 h-14 rounded-full bg-[var(--color-brand)] text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
          >
            <CookieIcon size={24} />

            {/* Tooltip */}
            <span className="absolute bottom-full mb-2.5 left-0 whitespace-nowrap text-xs font-medium bg-[#131212] text-white px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
              Gérer les cookies
              <span className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#131212]" />
            </span>
          </button>
        </div>,
        document.body
      )}

      {/* Preferences modal */}
      <Dialog.Root open={prefsOpen} onOpenChange={setPrefsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[61] bg-black/40 sheet-overlay" />

          {/* Mobile: bottom sheet — Desktop: centered modal */}
          <Dialog.Content className="modal-content fixed z-[62] inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center md:p-4">
            <div
              className="bg-white shadow-2xl w-full flex flex-col overflow-hidden rounded-t-2xl max-h-[88vh] md:rounded-[var(--radius)] md:max-w-md md:max-h-[90vh]"
              style={{ transform: dragOffset > 0 ? `translateY(${dragOffset}px)` : undefined, transition: dragOffset === 0 ? "transform 0.3s ease" : "none" }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Drag handle — mobile only */}
              <div className="flex justify-center pt-3 pb-1 md:hidden shrink-0 cursor-grab active:cursor-grabbing">
                <div className="w-10 h-1 rounded-full bg-gray-200" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4 md:px-6 md:py-5 border-b border-gray-100 shrink-0">
                <Dialog.Title className="text-base font-semibold text-[#131212]">
                  Gérer mes cookies
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button
                    className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                    aria-label="Fermer"
                  >
                    <X size={18} />
                  </button>
                </Dialog.Close>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-4 py-5 md:px-6 md:py-6">
                <CookiePreferencesPanel
                  analytics={analytics}
                  marketing={marketing}
                  setAnalytics={setAnalytics}
                  setMarketing={setMarketing}
                  onSave={savePrefs}
                  onAcceptAll={acceptAll}
                  onRejectAll={rejectAll}
                  onClose={() => setPrefsOpen(false)}
                  loading={loading}
                />
              </div>

            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
