import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import CarInsuranceForm from "@/components/CarInsuranceForm";
import ContactPopover from "@/components/ContactPopover";
import { submitLead } from "@/lib/api";
import { getOrCreateLeadUid } from "@/lib/leadUid";

const INSURANCE_TYPE_STEP = {
  id: "insurance_type",
  type: "radio",
  card: true,
  question: "Quel type d'assurance recherchez-vous ?",
  options: ["Poids lourd", "VTC", "Taxi"],
  values: ["poids_lourd", "vtc", "taxi"],
};

const BONUS_MALUS_STEP_OPTIONS = {
  options: [
    "0.50 — Bonus maximum",
    "0.51 – 0.79 — Bon conducteur",
    "0.80 – 0.99 — Conducteur confirmé",
    "1.00 — Référence",
    "1.01 – 1.25 — Malus léger",
    "1.26 – 2.00 — Malus modéré",
    "2.01 – 3.50 — Malus élevé",
  ],
  values: ["0.50", "0.51-0.79", "0.80-0.99", "1.00", "1.01-1.25", "1.26-2.00", "2.01-3.50"],
};

const VEHICLE_COUNT_STEP = {
  id: "nombre_vehicules",
  type: "radio",
  card: true,
  question: "Souhaitez-vous assurer :",
  options: ["Un seul véhicule", "Une flotte de véhicules"],
  values: ["un_seul", "flotte"],
};

// Placeholder taxi questionnaire, mirroring the VTC page's fields — swap in
// the real taxi-specific questions/options.
const TAXI_BASE_STEPS = [
  VEHICLE_COUNT_STEP,
  {
    id: "immat",
    type: "input",
    inputType: "text",
    uppercase: true,
    question: "Votre plaque d'immatriculation ?",
    placeholder: "Ex : AB-123-CD",
    rules: [{ action: "skip", source_question_id: "nombre_vehicules", operator: "equals", value: "flotte" }],
  },
  {
    id: "bonus_malus",
    type: "select",
    question: "Votre coefficient bonus-malus ?",
    options: BONUS_MALUS_STEP_OPTIONS.options,
    values: BONUS_MALUS_STEP_OPTIONS.values,
  },
  {
    id: "naissance",
    type: "input",
    inputType: "date-text",
    question: "Quelle est votre date de naissance ?",
  },
  {
    id: "permis_anciennete",
    type: "radio",
    card: true,
    question: "Conduisez-vous depuis plus de 3 ans ?",
    options: ["Oui, plus de 3 ans", "Non, moins de 3 ans"],
    values: ["plus_3_ans", "moins_3_ans"],
  },
];

// Hardcoded taxi questionnaire (not DB-driven, same approach as /devis/vtc).
export default function DevisPage() {
  const router = useRouter();
  const [steps, setSteps] = useState(null);
  const [initialAnswers, setInitialAnswers] = useState({});
  const leadUidRef = useRef(null);

  useEffect(() => {
    if (!router.isReady) return;
    leadUidRef.current = getOrCreateLeadUid("landing-taxi");

    const answers = {};
    if (router.query.insuranceType) {
      setSteps(TAXI_BASE_STEPS);
      answers.insurance_type = router.query.insuranceType;
    } else {
      setSteps([INSURANCE_TYPE_STEP, ...TAXI_BASE_STEPS]);
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
          {!steps && (
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
