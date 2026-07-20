import { useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { ShieldCheck, Clock, Users } from "lucide-react";
import CarCalculatorSection from "@/components/CarCalculatorSection";
import ContactPopover from "@/components/ContactPopover";
import { captureUtmParams } from "@/lib/utm";
import { claritySet } from "@/lib/clarity";

// Facebook Ads landing page — deliberately minimal (no nav menu, no other
// pages to click into) so there's only one path: fill the form. Swap the
// headline/trust points below for the actual campaign's angle; the
// CarCalculatorSection + questionnaire flow underneath is what's shared
// with the main site and the CRM.
export default function LandingPage() {
  const router = useRouter();

  // Ad traffic carries campaign info in the URL — stash it (for the devis
  // pages later) and tag it onto the Clarity session right away so you can
  // filter recordings by which ad/campaign brought that visitor in.
  useEffect(() => {
    if (!router.isReady) return;
    const utm = captureUtmParams(router.query);
    Object.entries(utm).forEach(([key, value]) => claritySet(key, value));
  }, [router.isReady]);

  return (
    <>
      <Head>
        <title>Devis gratuit en 2 minutes | New World Courtage</title>
        <meta
          name="description"
          content="Recevez votre devis d'assurance gratuitement, sans engagement. 0 frais, 0 commission."
        />
        {/* Ad-traffic-only page — keep it out of search results so it doesn't compete with the main site. */}
        <meta name="robots" content="noindex" />
      </Head>

      <header className="w-full">
        <div className="flex items-center justify-between px-4 lg:px-12 h-16">
          <Image src="/nwc_logo.svg" alt="New World Courtage" width={120} height={33} className="h-9 w-auto" />
          <ContactPopover />
        </div>
      </header>

      <main className="bg-white pb-16">
        <CarCalculatorSection redirectTo="/devis/" />

        {/* Trust row */}
        <div className="max-w-5xl mx-auto px-4 lg:px-12 2xl:px-24">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-4">
              <Clock size={20} className="text-[var(--color-brand)] shrink-0" />
              <p className="text-sm text-gray-600">Devis en moins de 2 minutes</p>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-4">
              <ShieldCheck size={20} className="text-[var(--color-brand)] shrink-0" />
              <p className="text-sm text-gray-600">0 frais, 0 commission</p>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-4">
              <Users size={20} className="text-[var(--color-brand)] shrink-0" />
              <p className="text-sm text-gray-600">Conseillers agréés ORIAS</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
