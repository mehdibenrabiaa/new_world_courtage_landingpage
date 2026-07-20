import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import CarInsuranceForm from "@/components/CarInsuranceForm";
import ContactPopover from "@/components/ContactPopover";
import { submitLead } from "@/lib/api";
import { getOrCreateLeadUid } from "@/lib/leadUid";
import { clarityIdentify, claritySet } from "@/lib/clarity";
import { getStoredUtmParams } from "@/lib/utm";

const BONUS_MALUS_STEP_OPTIONS = {
  options: ["Bonus (moins de 1.00)", "1.00 — Référence", "Malus (plus de 1.00)", "Je ne sais pas"],
  values: ["bonus", "1.00", "malus", "unknown"],
};

const VEHICLE_COUNT_STEP = {
  id: "nombre_vehicules",
  type: "radio",
  card: true,
  question: "Souhaitez-vous assurer :",
  options: ["Un seul véhicule", "Une flotte de véhicules"],
  values: ["un_seul", "flotte"],
};

const NAME_STEP = {
  id: "name",
  type: "input",
  inputType: "text",
  question: "Quel est votre nom complet ?",
  placeholder: "Ex : Jean Dupont",
  nextLabel: "Enregistrer et continuer",
};

const PHONE_STEP = {
  id: "phone",
  type: "input",
  inputType: "tel",
  question: "Quel est votre numéro de téléphone ?",
  placeholder: "Ex : 06 12 34 56 78",
  nextLabel: "Enregistrer et continuer",
};

// A fleet has more than one driver/vehicle, so the per-driver, per-vehicle
// questions below don't apply — skip straight past them to submission.
const FLEET_SKIP_RULE = [{ action: "skip", source_question_id: "nombre_vehicules", operator: "equals", value: "flotte" }];
// Inverse: these only make sense for a fleet, so solo-vehicle users skip them.
const SOLO_SKIP_RULE = [{ action: "skip", source_question_id: "nombre_vehicules", operator: "not_equals", value: "flotte" }];

// Fleet-only qualifying questions — cheap radio/select, no document lookups,
// just enough for the advisor to size and prep the callback.
const FLEET_DETAIL_STEPS = [
  {
    id: "flotte_taille",
    type: "select",
    question: "Combien de véhicules compte votre flotte ?",
    options: ["2 à 5 véhicules", "6 à 10 véhicules", "11 à 20 véhicules", "Plus de 20 véhicules"],
    values: ["2-5", "6-10", "11-20", "20+"],
    autoOpen: true,
    rules: SOLO_SKIP_RULE,
  },
  {
    id: "flotte_structure",
    type: "radio",
    card: true,
    question: "Vous êtes :",
    options: ["Auto-entrepreneur / Indépendant", "Société (SARL, SAS…)"],
    values: ["independant", "societe"],
    rules: SOLO_SKIP_RULE,
  },
  {
    id: "flotte_deja_assure",
    type: "radio",
    card: true,
    question: "Avez-vous déjà une assurance flotte actuellement ?",
    options: ["Oui", "Non"],
    values: ["oui", "non"],
    rules: SOLO_SKIP_RULE,
  },
];

// Ordered cheapest-to-answer first, most likely to require digging up a
// document (immatriculation) last — minimizes drop-off before capture.
const POIDS_LOURD_DETAIL_STEPS = [
  {
    id: "permis_anciennete",
    type: "radio",
    card: true,
    question: "Conduisez-vous depuis plus de 3 ans ?",
    options: ["Oui, plus de 3 ans", "Non, moins de 3 ans"],
    values: ["plus_3_ans", "moins_3_ans"],
    rules: FLEET_SKIP_RULE,
  },
  {
    id: "naissance",
    type: "input",
    inputType: "date-text",
    question: "Quelle est votre date de naissance ?",
    optional: true,
    rules: FLEET_SKIP_RULE,
  },
  {
    id: "bonus_malus",
    type: "select",
    question: "Votre coefficient bonus-malus ?",
    options: BONUS_MALUS_STEP_OPTIONS.options,
    values: BONUS_MALUS_STEP_OPTIONS.values,
    optional: true,
    autoOpen: true,
    rules: FLEET_SKIP_RULE,
  },
  {
    id: "immat",
    type: "input",
    inputType: "text",
    uppercase: true,
    question: "Votre plaque d'immatriculation ?",
    placeholder: "Ex : AB-123-CD",
    optional: true,
    rules: FLEET_SKIP_RULE,
  },
];

// Hardcoded poids lourd questionnaire (not DB-driven, same approach as
// /devis/vtc). If name/phone weren't already captured on the landing page,
// ask them right after the vehicle-count question — early enough to still
// capture a partial lead from almost everyone who engages, without leading
// cold with a personal-info ask.
export default function DevisPoidsLourdsPage() {
  const router = useRouter();
  const [steps, setSteps] = useState(null);
  const [initialAnswers, setInitialAnswers] = useState({});
  const leadUidRef = useRef(null);
  const partialSentRef = useRef(false);

  useEffect(() => {
    if (!router.isReady) return;
    leadUidRef.current = getOrCreateLeadUid("landing-poidslourds");
    clarityIdentify(leadUidRef.current);
    claritySet("insurance_type", "poids_lourd");
    Object.entries(getStoredUtmParams()).forEach(([key, value]) => claritySet(key, value));

    const { name, phone } = router.query;
    const contactSteps = [];
    const answers = {};
    if (!name) contactSteps.push(NAME_STEP); else answers.name = name;
    if (!phone) contactSteps.push(PHONE_STEP); else answers.phone = phone;
    setSteps([VEHICLE_COUNT_STEP, ...contactSteps, ...FLEET_DETAIL_STEPS, ...POIDS_LOURD_DETAIL_STEPS]);
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
      insuranceType: "poids_lourd",
      answers,
      sourcePath: router.pathname,
      completed: false,
    }).catch(() => {});
  }

  function handleStepComplete(stepId, answers) {
    if (stepId === "name" || stepId === "phone") savePartial(answers);
    if (stepId === "nombre_vehicules") claritySet("vehicle_mode", answers.nombre_vehicules);
  }

  function handleSubmit(answers) {
    submitLead({
      leadUid: leadUidRef.current,
      name: answers.name,
      phone: answers.phone,
      insuranceType: "poids_lourd",
      answers,
      sourcePath: router.pathname,
      completed: true,
    }).catch(() => {});
  }

  return (
    <>
      <Head>
        <title>Votre devis assurance poids lourd — New World Courtage</title>
        <meta name="robots" content="noindex" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="New World Courtage" />
        <meta property="og:title" content="Votre devis assurance poids lourd — New World Courtage" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Votre devis assurance poids lourd — New World Courtage" />
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
              storageKey="landing-poidslourds"
              onSubmit={handleSubmit}
              onStepComplete={handleStepComplete}
            />
          )}
        </div>
      </main>
    </>
  );
}
