import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import CarInsuranceForm from "@/components/CarInsuranceForm";
import ContactPopover from "@/components/ContactPopover";
import { submitLead } from "@/lib/api";
import { getOrCreateLeadUid } from "@/lib/leadUid";

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

const VTC_BASE_STEPS = [
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

const NAME_STEP = {
  id: "name",
  type: "input",
  inputType: "text",
  question: "Quel est votre nom complet ?",
  placeholder: "Ex : Jean Dupont",
};

const PHONE_STEP = {
  id: "phone",
  type: "input",
  inputType: "tel",
  question: "Quel est votre numéro de téléphone ?",
  placeholder: "Ex : 06 12 34 56 78",
};

// Hardcoded VTC questionnaire (not DB-driven). If name/phone weren't already
// captured on the landing page, ask them first before the VTC-specific questions.
export default function DevisVtcPage() {
  const router = useRouter();
  const [steps, setSteps] = useState(null);
  const [initialAnswers, setInitialAnswers] = useState({});
  const leadUidRef = useRef(null);
  const partialSentRef = useRef(false);

  useEffect(() => {
    if (!router.isReady) return;
    leadUidRef.current = getOrCreateLeadUid("landing-vtc");
    const { name, phone } = router.query;
    const prefixSteps = [];
    const answers = {};
    if (!name) prefixSteps.push(NAME_STEP); else answers.name = name;
    if (!phone) prefixSteps.push(PHONE_STEP); else answers.phone = phone;
    setSteps([...prefixSteps, ...VTC_BASE_STEPS]);
    setInitialAnswers(answers);

    // Already known from the landing form (no in-form name/phone steps to
    // complete) — save the partial lead right away instead of waiting for
    // a step-completion event that will never fire for "name"/"phone".
    if (name && phone) savePartial(answers);
  }, [router.isReady]);

  // As soon as name+phone are both known (whether pre-filled from the
  // landing form or just typed in-form), save a partial lead so we still
  // have contact info even if the user abandons the rest of the form.
  function savePartial(answers) {
    if (partialSentRef.current || !answers.name || !answers.phone) return;
    partialSentRef.current = true;
    submitLead({
      leadUid: leadUidRef.current,
      name: answers.name,
      phone: answers.phone,
      insuranceType: "vtc",
      answers,
      sourcePath: router.pathname,
      completed: false,
    }).catch(() => {});
  }

  function handleStepComplete(stepId, answers) {
    if (stepId === "name" || stepId === "phone") savePartial(answers);
  }

  function handleSubmit(answers) {
    submitLead({
      leadUid: leadUidRef.current,
      name: answers.name,
      phone: answers.phone,
      insuranceType: "vtc",
      answers,
      sourcePath: router.pathname,
      completed: true,
    }).catch(() => {});
  }

  return (
    <>
      <Head>
        <title>Votre devis assurance VTC — New World Courtage</title>
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
              storageKey="landing-vtc"
              onSubmit={handleSubmit}
              onStepComplete={handleStepComplete}
            />
          )}
        </div>
      </main>
    </>
  );
}
