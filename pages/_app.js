import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import "../global.css";
import { Geist } from "next/font/google";
import CookieBanner from "../components/CookieBanner";
import Footer from "../components/Footer";
import LegalLinksFooter from "../components/LegalLinksFooter";

const geistSans = Geist({
  subsets: ["latin"],
  display: "optional",
});

// Legal pages already end with their own CTA/content — the fixed footer
// would just sit on top of it, so it's hidden there entirely.
const HIDE_FOOTER_PATHS = ["/confidentialite", "/accessibilite", "/conditions-generales", "/mentions-legales"];
// Root landing page gets only the bare legal links, not the full contact footer.
const LEGAL_LINKS_ONLY_PATHS = ["/"];

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const footerRef = useRef(null);
  const [footerHeight, setFooterHeight] = useState(0);
  const normalizedPath = router.pathname === "/" ? "/" : router.pathname.replace(/\/$/, "");
  const hideFooter = HIDE_FOOTER_PATHS.includes(normalizedPath);
  const legalLinksOnly = LEGAL_LINKS_ONLY_PATHS.includes(normalizedPath);
  const showFixedFooter = !hideFooter && !legalLinksOnly;

  useEffect(() => {
    if (!showFixedFooter) return;
    const el = footerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setFooterHeight(entry.contentRect.height));
    observer.observe(el);
    return () => observer.disconnect();
  }, [showFixedFooter]);

  return (
    <div className={geistSans.className} style={{ minHeight: "100vh", overflowX: "clip" }}>
      <div style={showFixedFooter ? { minHeight: `calc(100vh - ${footerHeight}px)`, paddingBottom: footerHeight } : undefined}>
        <Component {...pageProps} />
      </div>
      {showFixedFooter && <Footer ref={footerRef} />}
      {legalLinksOnly && <LegalLinksFooter />}
      <CookieBanner />
    </div>
  );
}
