import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import CarInsuranceForm from "@/components/CarInsuranceForm";
import ContactPopover from "@/components/ContactPopover";

const INSURANCE_TYPE_STEP = {
  id: "insurance_type",
  type: "radio",
  card: true,
  question: "Quel type d'assurance recherchez-vous ?",
  options: ["Poids lourd", "VTC", "Taxi"],
  values: ["poids_lourd", "vtc", "taxi"],
  hint: "Sélectionnez une option pour continuer.",
};

const PATH_BY_TYPE = {
  poids_lourd: "/devis/poidslourds/",
  vtc: "/devis/vtc/",
  taxi: "/devis/taxi/",
};

// Pure dispatcher — no questionnaire content lives here. If the insurance
// type is already known from the URL, redirect immediately; otherwise ask,
// then redirect to that type's dedicated flow (/devis/vtc/, /devis/taxi/,
// /devis/poidslourds/), all three handled the same way.
export default function DevisDispatcherPage() {
  const router = useRouter();
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.insuranceType) {
      redirectTo(router.query.insuranceType);
    } else {
      setShowPicker(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  function redirectTo(type) {
    const target = PATH_BY_TYPE[type];
    if (!target) return false;
    const params = {};
    if (router.query.name) params.name = router.query.name;
    if (router.query.phone) params.phone = router.query.phone;
    const qs = new URLSearchParams(params).toString();
    router.push(`${target}${qs ? `?${qs}` : ""}`);
    return true; // halt CarInsuranceForm's own local auto-advance
  }

  function handleStepComplete(stepId, answers) {
    if (stepId !== "insurance_type") return false;
    return redirectTo(answers.insurance_type);
  }

  return (
    <>
      <Head>
        <title>Votre devis d&apos;assurance — New World Courtage</title>
        <meta name="robots" content="noindex" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="New World Courtage" />
        <meta property="og:title" content="Votre devis d'assurance — New World Courtage" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Votre devis d'assurance — New World Courtage" />
      </Head>

      <header
        className="sticky top-0 z-40 w-full"
        style={{ background: "linear-gradient(90deg,rgba(232, 232, 232, 1) 0%, rgba(255, 255, 255, 1) 100%)" }}
      >
        <div className="flex items-center justify-between px-4 lg:px-12 h-16">
          <Image src="/nwc_logo.svg" alt="New World Courtage" width={120} height={33} className="h-9 w-auto" />
          <ContactPopover />
        </div>
      </header>

      <main className="bg-white">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 py-10 lg:py-16">
          {!showPicker && (
            <p className="text-sm text-gray-500">Chargement…</p>
          )}
          {showPicker && (
            <CarInsuranceForm
              steps={[INSURANCE_TYPE_STEP]}
              theme="light"
              storageKey="landing-dispatch"
              onStepComplete={handleStepComplete}
              introScreen={{
                heading: "Comment ça marche ?",
                steps: [
                  "Répondez à quelques questions simples sur votre véhicule (2 minutes).",
                  "Un conseiller vous recontacte avec un devis personnalisé et vous aide à trouver l'assurance qui vous convient le mieux.",
                ],
                cta: "Commencer",
              }}
            />
          )}
        </div>
      </main>
    </>
  );
}
