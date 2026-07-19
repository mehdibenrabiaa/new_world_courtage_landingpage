import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import CarInsuranceForm from "@/components/CarInsuranceForm";
import ContactPopover from "@/components/ContactPopover";
import { fetchQuestionnaire, submitLead } from "@/lib/api";
import { getOrCreateLeadUid } from "@/lib/leadUid";

function bucketBonusMalus(raw) {
  const n = parseFloat(raw);
  if (Number.isNaN(n)) return "";
  if (n <= 0.50) return "0.50";
  if (n <= 0.79) return "0.51-0.79";
  if (n <= 0.99) return "0.80-0.99";
  if (n <= 1.00) return "1.00";
  if (n <= 1.25) return "1.01-1.25";
  if (n <= 2.00) return "1.26-2.00";
  return "2.01-3.50";
}

function buildInitialAnswers(steps, query) {
  const byKey = Object.fromEntries(steps.map((s) => [s.key, s]));
  const answers = {};
  if (query.permis && byKey.permis_date) {
    answers[byKey.permis_date.id] = `${query.permis}-01`;
  }
  if (query.bonusMalus && byKey.bonus_malus) {
    answers[byKey.bonus_malus.id] = bucketBonusMalus(query.bonusMalus);
  }
  return answers;
}

const INSURANCE_TYPE_STEP = {
  id: "insurance_type",
  type: "radio",
  card: true,
  question: "Quel type d'assurance recherchez-vous ?",
  options: ["Poids lourd", "VTC", "Taxi"],
  values: ["poids_lourd", "vtc", "taxi"],
};

// Same "taxi" questionnaire as the main site — both apps read from the same
// backend/DB, so a question added in the CRM shows up here too automatically.
export default function DevisPage() {
  const router = useRouter();
  const [steps, setSteps] = useState(null);
  const [initialAnswers, setInitialAnswers] = useState({});
  const [error, setError] = useState(null);
  const leadUidRef = useRef(null);

  useEffect(() => {
    if (!router.isReady) return;
    leadUidRef.current = getOrCreateLeadUid("landing-taxi");
    fetchQuestionnaire("taxi")
      .then((fetchedSteps) => {
        const answers = buildInitialAnswers(fetchedSteps, router.query);
        if (router.query.insuranceType) {
          setSteps(fetchedSteps);
          answers.insurance_type = router.query.insuranceType;
        } else {
          setSteps([INSURANCE_TYPE_STEP, ...fetchedSteps]);
        }
        setInitialAnswers(answers);

        // name/phone always arrive via the URL on this page (never asked
        // in-form) — save a partial lead right away so we have contact info
        // even if the user abandons the rest of the questionnaire.
        if (router.query.name && router.query.phone) {
          submitLead({
            leadUid: leadUidRef.current,
            name: router.query.name,
            phone: router.query.phone,
            insuranceType: router.query.insuranceType,
            answers,
            sourcePath: router.pathname,
            completed: false,
          }).catch(() => {});
        }
      })
      .catch((err) => setError(err.message));
  }, [router.isReady]);

  function handleSubmit(answers) {
    submitLead({
      leadUid: leadUidRef.current,
      name: router.query.name,
      phone: router.query.phone,
      insuranceType: answers.insurance_type,
      answers,
      sourcePath: router.pathname,
      completed: true,
    }).catch(() => {});
  }

  return (
    <>
      <Head>
        <title>Votre devis assurance taxi — New World Courtage</title>
        <meta name="robots" content="noindex" />
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
          {error && (
            <p className="text-sm text-[var(--color-error)]">
              Impossible de charger le questionnaire ({error}).
            </p>
          )}
          {!error && !steps && (
            <p className="text-sm text-gray-400">Chargement du questionnaire…</p>
          )}
          {steps && (
            <CarInsuranceForm
              steps={steps}
              initialAnswers={initialAnswers}
              theme="light"
              storageKey="landing-taxi"
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </main>
    </>
  );
}
