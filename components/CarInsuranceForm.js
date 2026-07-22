"use client"

import { useState, useEffect } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { DatePickerInput } from "@/components/DatePickerInput";
import { DateTextInput } from "@/components/DateTextInput";
import { MonthYearInput } from "@/components/MonthYearInput";
import { ChevronLeft, ChevronRight, CheckCircle2, Check } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Field, FieldContent, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Stepper, StepperNav, StepperItem, StepperTrigger, StepperIndicator, StepperSeparator, StepperTitle } from "@/components/ui/stepper";
import { clarityEvent } from "@/lib/clarity";

const CAR_BRANDS = [
  "Audi", "BMW", "Citroën", "Dacia", "DS Automobiles", "Fiat", "Ford", "Honda",
  "Hyundai", "Kia", "Mazda", "Mercedes-Benz", "Nissan", "Opel", "Peugeot",
  "Renault", "Seat", "Skoda", "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo",
];

const MOTO_BRANDS = [
  "Aprilia", "BMW", "Ducati", "Harley-Davidson", "Honda", "Kawasaki", "KTM",
  "Piaggio", "Royal Enfield", "Suzuki", "Triumph", "Vespa", "Yamaha",
];

// cols: 1 = half width, 2 = full width
const DEFAULT_STEPS = [
  // --- Véhicule ---
  { id: 0,  cols: 2, section: "Véhicule",   type: "radio", card: true, eyebrow: "Pour commencer", question: "Quel véhicule souhaitez-vous assurer ?", options: ["Mon véhicule actuel", "Un futur achat"], values: ["current", "future"] },
  { id: 1,  cols: 2, section: "Véhicule",   type: "radio", card: true, question: "Quel type de véhicule souhaitez-vous assurer ?", options: ["Moto", "Scooter", "Voiture"], values: ["moto", "scooter", "voiture"] },
  { id: 2,  cols: 1, section: "Véhicule",   type: "select",   question: "Marque du véhicule",
    optionsFn: (answers) => {
      const brands = answers[1] === "voiture" ? CAR_BRANDS : MOTO_BRANDS;
      return { options: brands, values: brands };
    },
  },
  { id: 3,  cols: 1, section: "Véhicule",   type: "input",    question: "Modèle", inputType: "text", placeholder: "Ex : Clio, Série 3, CB500…" },
  { id: 4,  cols: 2, section: "Véhicule",   type: "input",    question: "Version ou finition", inputType: "text", placeholder: "Ex : Sport, Confort, 1.5 dCi…" },
  { id: 5,  cols: 1, section: "Véhicule",   type: "select",   question: "Cylindrée", options: ["Moins de 50 cc", "50 – 125 cc", "126 – 250 cc", "251 – 500 cc", "501 – 750 cc", "Plus de 750 cc"], values: ["<50", "50-125", "126-250", "251-500", "501-750", ">750"] },
  { id: 6,  cols: 1, section: "Véhicule",   type: "input",    question: "Puissance du moteur", inputType: "number", placeholder: "Puissance en kW ou CV" },
  { id: 7,  cols: 1, section: "Véhicule",   type: "input",    question: "Date d'achat du véhicule", inputType: "month" },
  { id: 8,  cols: 1, section: "Véhicule",   type: "input",    question: "Prix d'achat", inputType: "number", placeholder: "Montant en €" },
  { id: 9,  cols: 1, section: "Véhicule",   type: "input",    question: "Première mise en circulation", inputType: "month" },
  { id: 10, cols: 1, section: "Véhicule",   type: "radio",    question: "Neuf ou d'occasion ?", options: ["Neuf", "Occasion"], values: ["neuf", "occasion"] },
  { id: 11, cols: 2, section: "Véhicule",   type: "radio",    question: "Usage principal du véhicule", options: ["Domicile – travail", "Loisirs", "Professionnel"], values: ["commute", "leisure", "professional"] },
  { id: 12, cols: 1, section: "Véhicule",   type: "select",   question: "Kilométrage annuel estimé", options: ["Moins de 5 000 km", "5 000 – 10 000 km", "10 000 – 15 000 km", "15 000 – 20 000 km", "Plus de 20 000 km"], values: ["<5000", "5000-10000", "10000-15000", "15000-20000", ">20000"] },
  { id: 13, cols: 2, section: "Véhicule",   type: "radio",    question: "Stationnement la nuit", options: ["Garage privé", "Rue", "Parking privé"], values: ["garage", "street", "private_parking"] },
  { id: 14, cols: 2, section: "Véhicule",   type: "checkbox", question: "Dispositifs antivol", hint: "Sélectionnez tout ce qui s'applique.", options: ["Alarme", "Antivol mécanique", "Traceur GPS"], values: ["alarm", "lock", "tracker"], optional: true },
  { id: 15, cols: 2, section: "Véhicule",   type: "radio",    question: "Financement du véhicule", options: ["Comptant", "Crédit", "Leasing"], values: ["owned", "loan", "leasing"] },
  // --- Conducteur ---
  { id: 16, cols: 1, section: "Conducteur", type: "select",   question: "Votre âge", options: ["16 – 24 ans", "25 – 35 ans", "36 – 45 ans", "46 – 55 ans", "56 – 65 ans", "66 ans et plus"], values: ["16-24", "25-35", "36-45", "46-55", "56-65", "66+"] },
  { id: 17, cols: 1, section: "Conducteur", type: "select",   question: "Type de permis", options: ["Permis A – moto (> 35 kW)", "Permis A2 – moto limitée", "Permis A1 – 125 cc", "Permis B – voiture", "Permis AM – cyclomoteur"], values: ["A", "A2", "A1", "B", "AM"] },
  { id: 18, cols: 1, section: "Conducteur", type: "input",    question: "Date d'obtention du permis", inputType: "month" },
  { id: 19, cols: 1, section: "Conducteur", type: "select",   question: "Années d'expérience", options: ["Moins d'1 an", "1 – 3 ans", "4 – 6 ans", "7 – 10 ans", "11 – 20 ans", "Plus de 20 ans"], values: ["<1", "1-3", "4-6", "7-10", "11-20", "20+"] },
  { id: 20, cols: 2, section: "Conducteur", type: "radio",    question: "Êtes-vous le conducteur principal ?", options: ["Conducteur principal", "Conducteur secondaire"], values: ["main", "secondary"] },
  { id: 21, cols: 1, section: "Conducteur", type: "select",   question: "Conducteurs supplémentaires", options: ["Aucun", "1 conducteur", "2 conducteurs", "3 ou plus"], values: ["0", "1", "2", "3+"] },
  // --- Historique ---
  { id: 22, cols: 2, section: "Historique", type: "radio",    question: "Sinistres déclarés ces 3 à 5 dernières années ?", options: ["Oui", "Non"], values: ["oui", "non"] },
  { id: 23, cols: 2, section: "Historique", type: "radio",    question: "Ces sinistres étaient-ils de votre responsabilité ?", options: ["Responsable", "Non responsable", "Les deux"], values: ["responsible", "not_responsible", "both"] },
  { id: 24, cols: 1, section: "Historique", type: "select",   question: "Coefficient bonus-malus", options: ["0.50 — Bonus maximum", "0.51 – 0.79 — Bon conducteur", "0.80 – 0.99 — Conducteur confirmé", "1.00 — Référence", "1.01 – 1.25 — Malus léger", "1.26 – 2.00 — Malus modéré", "2.01 – 3.50 — Malus élevé"], values: ["0.50", "0.51-0.79", "0.80-0.99", "1.00", "1.01-1.25", "1.26-2.00", "2.01-3.50"] },
  { id: 25, cols: 2, section: "Historique", type: "radio",    question: "Votre permis a-t-il déjà été suspendu ou annulé ?", options: ["Oui", "Non"], values: ["oui", "non"] },
  // --- Couverture ---
  { id: 26, cols: 2, section: "Couverture", type: "radio",    question: "Type de couverture souhaité", options: ["Au tiers", "Tous risques"], values: ["third-party", "comprehensive"] },
  { id: 27, cols: 1, section: "Couverture", type: "select",   question: "Montant de franchise", options: ["150 €", "300 €", "500 €", "750 €", "1 000 €"], values: ["150", "300", "500", "750", "1000"] },
  { id: 28, cols: 2, section: "Couverture", type: "radio",    question: "Protection juridique ?", options: ["Oui", "Non"], values: ["oui", "non"] },
  { id: 29, cols: 2, section: "Couverture", type: "radio",    question: "Assistance routière ?", options: ["Oui", "Non"], values: ["oui", "non"] },
  { id: 30, cols: 2, section: "Couverture", type: "radio",    question: "Véhicule de remplacement en cas de sinistre ?", options: ["Oui", "Non"], values: ["oui", "non"] },
  // --- Contrat ---
  { id: 31, cols: 1, section: "Contrat",    type: "input",    question: "Date de prise d'effet", inputType: "date" },
  { id: 32, cols: 2, section: "Contrat",    type: "radio",    question: "Fréquence de paiement", options: ["Mensuelle", "Annuelle"], values: ["monthly", "yearly"] },
  { id: 33, cols: 2, section: "Contrat",    type: "input",    question: "Préférences ou contraintes", inputType: "text", placeholder: "Ex : assureur actuel, exclusions…", optional: true },
  // --- Contact ---
  { id: 34, cols: 1, section: "Contact",    type: "input",    question: "Adresse e-mail", inputType: "email", placeholder: "exemple@email.com" },
  { id: 35, cols: 1, section: "Contact",    type: "input",    question: "Numéro de téléphone", inputType: "tel", placeholder: "Ex : 06 12 34 56 78" },
];

const TOKENS = {
  dark: {
    eyebrow:         "text-white/60 font-medium",
    bigQuestion:     "text-white",
    label:           "text-[var(--color-text)] font-semibold",
    hint:            "text-white/50",
    optional:        "text-white/30",
    radioText:       "text-white",
    radioDot:        "border-white/40 group-hover:border-white/80",
    radioDotSelected:"border-white bg-white",
    radioDotInner:   "bg-[var(--color-brand)]",
    checkText:       "text-white",
    checkBox:        "border-white/40 group-hover:border-white/80",
    checkBoxSelected:"border-white bg-white",
    backBtn:         "text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-20",
    nextBtn:         "bg-white text-[var(--color-brand)] hover:bg-white/90 font-semibold",
    selectTrigger:   "w-full bg-white text-[var(--color-text)]",
    divider:         "border-gray-100",
    successIcon:     "text-white",
    successHeading:  "text-white",
    successBody:     "text-white/70",
    stepCircleDone:  "bg-[var(--color-brand)] text-white",
    stepCircleActive:"bg-[var(--color-brand)] text-white",
    stepCircleAhead: "bg-gray-100 text-gray-400",
    stepLabelDone:   "text-[var(--color-brand)] font-medium",
    stepLabelActive: "text-[var(--color-text)] font-semibold",
    stepLabelAhead:  "text-gray-400",
    stepLine:        "bg-[var(--color-brand)]",
    stepLineAhead:   "bg-gray-200",
  },
  light: {
    eyebrow:         "text-gray-500 font-medium",
    bigQuestion:     "text-[var(--color-text)]",
    label:           "text-[rgba(0,0,0,0.88)] font-normal",
    hint:            "text-gray-500",
    optional:        "text-gray-400",
    radioText:       "text-[rgba(0,0,0,0.88)]",
    radioDot:        "border-[#d9d9d9] bg-white group-hover:border-[var(--color-brand)]",
    radioDotSelected:"border-[var(--color-brand)] bg-[var(--color-brand)]",
    radioDotInner:   "bg-white",
    checkText:       "text-[rgba(0,0,0,0.88)]",
    checkBox:        "border-[#d9d9d9] bg-white rounded-[3px] group-hover:border-[var(--color-brand)]",
    checkBoxSelected:"border-[var(--color-brand)] bg-[var(--color-brand)] rounded-[3px]",
    backBtn:         "text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30",
    nextBtn:         "cta-btn text-white font-semibold",
    selectTrigger:   "w-full",
    divider:         "border-gray-100",
    successIcon:     "text-[var(--color-brand)]",
    successHeading:  "text-[var(--color-text)]",
    successBody:     "text-gray-500",
    stepCircleDone:  "bg-[var(--color-brand)] text-white",
    stepCircleActive:"bg-[var(--color-brand)] text-white",
    stepCircleAhead: "border-2 border-[#d9d9d9] text-[rgba(0,0,0,0.45)] bg-white",
    stepLabelDone:   "text-[var(--color-brand)]",
    stepLabelActive: "text-[rgba(0,0,0,0.88)] font-medium",
    stepLabelAhead:  "text-[rgba(0,0,0,0.45)]",
    stepLine:        "bg-[var(--color-brand)]",
    stepLineAhead:   "bg-[#d9d9d9]",
  },
};

function BookingPanel({ t }) {
  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <CheckCircle2 size={40} className="text-green-500" />
        <h3 className={`text-xl font-semibold ${t.successHeading}`}>Demande envoyée !</h3>
        <p className={`text-base max-w-sm ${t.successBody}`}>
          Merci ! Un conseiller agréé vous recontactera très prochainement.
        </p>
      </div>

    </div>
  );
}

// ── Skip-logic (rules) ───────────────────────────────────────────────────────

function isStepSkipped(step, answers) {
  if (!step.rules || step.rules.length === 0) return false;
  return step.rules.some(rule => {
    if (rule.action !== "skip") return false;
    const sourceValue = answers[rule.source_question_id];
    if (rule.operator === "not_equals") return sourceValue !== rule.value;
    return sourceValue === rule.value;
  });
}

// Walks in `dir` (+1/-1) from `fromIdx`, skipping any step whose rules match, and
// returns the first visible index (or an out-of-bounds index if none remain).
function findVisibleStepIndex(steps, fromIdx, dir, answers) {
  let i = fromIdx;
  while (i >= 0 && i < steps.length && isStepSkipped(steps[i], answers)) {
    i += dir;
  }
  return i;
}

// ── Resume-in-progress persistence (localStorage) ────────────────────────────

function progressStorageKey(key) {
  return `nwc_car_form_${key}`;
}

function readStoredProgress(key) {
  if (!key) return null;
  try {
    const raw = localStorage.getItem(progressStorageKey(key));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStoredProgress(key, data) {
  if (!key) return;
  try {
    localStorage.setItem(progressStorageKey(key), JSON.stringify(data));
  } catch {}
}

function clearStoredProgress(key) {
  if (!key) return;
  try {
    localStorage.removeItem(progressStorageKey(key));
  } catch {}
}

// ─────────────────────────────────────────────────────────────────────────────

export default function CarInsuranceForm({ steps = DEFAULT_STEPS, initialAnswers = {}, startStep = 0, theme = "dark", onProgress, onSubmit, onStepComplete, storageKey, introText }) {
  const [stepIdx, setStepIdx] = useState(startStep);
  const [direction, setDirection] = useState("next");
  const [answers, setAnswers] = useState(initialAnswers);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [hydrated, setHydrated] = useState(false);

  const t = TOKENS[theme];
  const step = steps[stepIdx];
  const isLastStep = findVisibleStepIndex(steps, stepIdx + 1, 1, answers) >= steps.length;
  const progress = Math.round(((stepIdx + 1) / steps.length) * 100);

  // Sections, in first-appearance order, for the right-hand-side stepper.
  const sections = [...new Set(steps.map(s => s.section).filter(Boolean))];
  const currentSectionIdx = sections.indexOf(step.section);

  useEffect(() => {
    onProgress?.(progress);
  }, [progress]);

  // Tags each question as it's reached so Clarity sessions can be filtered
  // by exactly where people are in the flow — without this, Clarity only
  // sees one URL for the whole multi-step form and can't tell steps apart.
  useEffect(() => {
    if (!hydrated) return;
    clarityEvent(`step_reached_${step.id}`);
  }, [step.id, hydrated]);

  useEffect(() => {
    if (submitted) clarityEvent("form_completed");
  }, [submitted]);

  // Auto-focus the current question's field so users can type/select right
  // away instead of having to click into it first. Mobile browsers only
  // allow a text field to grab focus (and pop the keyboard) when that call
  // happens synchronously inside the user gesture that triggered it — a
  // separate useEffect firing on the next tick is too late and gets
  // silently ignored on iOS Safari. focusStepContent() is called directly
  // from the nav handlers below instead, right after flushSync applies the
  // step change, so it's still within the original tap/click's call stack.
  function focusStepContent() {
    const container = document.getElementById("step-content");
    const focusable = container?.querySelector("input, button, [tabindex]");
    focusable?.focus({ preventScroll: true });
  }

  // Still handles the very first question on load/resume — there's no
  // preceding gesture then anyway, so the mobile restriction above doesn't
  // apply (and is moot: no browser auto-opens a keyboard on page load).
  useEffect(() => {
    if (!hydrated) return;
    focusStepContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  // Resume from a previous visit: merge any saved progress under `answers`
  // (URL-derived initialAnswers still win on conflicts), jump back to the
  // step they'd reached, then re-check skip-logic in case rules changed.
  // Resolved by step *id*, not raw array index — the question set gets
  // reordered/edited over time, so an old numeric index would silently
  // point at a different question after any such change.
  useEffect(() => {
    const saved = readStoredProgress(storageKey);
    const mergedAnswers = saved ? { ...saved.answers, ...initialAnswers } : initialAnswers;
    let targetStep = startStep;
    if (saved && saved.stepId !== undefined) {
      const savedIdx = steps.findIndex(s => s.id === saved.stepId);
      if (savedIdx >= 0) targetStep = Math.max(startStep, savedIdx);
    }
    if (isStepSkipped(steps[targetStep], mergedAnswers)) {
      targetStep = Math.min(findVisibleStepIndex(steps, targetStep + 1, 1, mergedAnswers), steps.length - 1);
    }
    setAnswers(mergedAnswers);
    setStepIdx(targetStep);
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist progress as the user fills the form, so a reload or a later visit
  // resumes where they left off instead of starting blank.
  useEffect(() => {
    if (!hydrated) return;
    writeStoredProgress(storageKey, { answers, stepId: step.id });
  }, [answers, step.id, storageKey, hydrated]);

  function setAnswer(stepId, val) {
    setAnswers(prev => ({ ...prev, [stepId]: val }));
    setErrors(prev => { const e = { ...prev }; delete e[stepId]; return e; });
  }

  function handleNext() {
    if (!(step.optional || step.type === "checkbox")) {
      const ans = answers[step.id] ?? "";
      if (ans === "") {
        setErrors({ [step.id]: "Ce champ est requis." });
        return;
      }
    }

    setErrors({});
    setDirection("next");
    if (onStepComplete?.(step.id, answers)) return;
    const next = findVisibleStepIndex(steps, stepIdx + 1, 1, answers);
    if (next >= steps.length) {
      clearStoredProgress(storageKey);
      setSubmitted(true);
      onSubmit?.(answers);
    } else {
      flushSync(() => setStepIdx(next));
      focusStepContent();
    }
  }

  function handleBack() {
    const prev = findVisibleStepIndex(steps, stepIdx - 1, -1, answers);
    if (prev >= 0) {
      setDirection("prev");
      flushSync(() => setStepIdx(prev));
      focusStepContent();
    }
  }

  function selectAndAdvance(stepId, val) {
    const nextAnswers = { ...answers, [stepId]: val };
    setAnswer(stepId, val);
    // onStepComplete can return true to mean "I'm navigating away" — halts
    // the local auto-advance below so it can't race a slow page transition
    // and overwrite this step's saved progress after we've already left.
    if (onStepComplete?.(stepId, nextAnswers)) return;
    // Advances synchronously (no setTimeout) so the next field's auto-focus
    // below still runs inside this tap's user-activation window — any async
    // gap here and mobile Safari silently refuses to open the keyboard.
    const next = findVisibleStepIndex(steps, stepIdx + 1, 1, nextAnswers);
    if (next >= steps.length) {
      clearStoredProgress(storageKey);
      setSubmitted(true);
      onSubmit?.(nextAnswers);
    } else {
      setDirection("next");
      flushSync(() => setStepIdx(next));
      focusStepContent();
    }
  }

  if (submitted) {
    return <BookingPanel t={t} />;
  }

  return (
    <>
    <div className="flex flex-col gap-10">

      {/* Question — one at a time */}
      {(() => {
        const answer = answers[step.id] ?? (step.type === "checkbox" ? [] : "");
        const dynamicOpts = step.optionsFn ? step.optionsFn(answers) : { options: step.options, values: step.values };

        return (
          <div id="step-content" key={step.id} className={`flex flex-col gap-5 max-w-3xl ${direction === "next" ? "slide-in-right" : "slide-in-left"}`}>

            {/* First-question-only intro — first-time visitors don't always
                realize this is a form to fill out, not just page content. */}
            {stepIdx === 0 && introText && (
              <p className={`text-sm font-medium ${t.eyebrow}`}>{introText}</p>
            )}

            {/* Eyebrow + big question */}
            <div className="flex flex-col gap-2">
              {step.eyebrow && (
                <p className={`text-sm uppercase tracking-wide ${t.eyebrow}`}>{step.eyebrow}</p>
              )}
              {(step.type === "radio" || step.type === "checkbox") ? (
                <p className={`text-2xl sm:text-[35px] font-semibold leading-snug ${t.bigQuestion}`}>
                  {step.question}
                  {step.optional && <span className={`ml-2 font-normal text-sm ${t.optional}`}>(optionnel)</span>}
                </p>
              ) : (
                <label htmlFor={`field-${step.id}`} className={`text-2xl sm:text-[35px] font-semibold leading-snug cursor-pointer ${t.bigQuestion}`}>
                  {step.question}
                  {step.optional && <span className={`ml-2 font-normal text-sm ${t.optional}`}>(optionnel)</span>}
                </label>
              )}
              {step.hint && <p className={`text-sm ${t.hint}`}>{step.hint}</p>}
            </div>

            {/* Radio — card style */}
            {step.type === "radio" && step.card && (
              <>
                <RadioGroup
                  value={answer}
                  onValueChange={val => selectAndAdvance(step.id, val)}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {dynamicOpts.options.map((opt, i) => (
                    <FieldLabel
                      key={i}
                      htmlFor={`radio-${step.id}-${i}`}
                      className={`transition-colors ${
                        answer === dynamicOpts.values[i]
                          ? "border-[var(--color-brand)] bg-[var(--color-brand)]/5"
                          : errors[step.id]
                            ? "border-[var(--color-error)]"
                            : "hover:border-[var(--color-brand)]"
                      }`}
                    >
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldTitle>{opt}</FieldTitle>
                        </FieldContent>
                        <RadioGroupItem
                          value={dynamicOpts.values[i]}
                          id={`radio-${step.id}-${i}`}
                          className="sr-only"
                        />
                      </Field>
                    </FieldLabel>
                  ))}
                </RadioGroup>
                {errors[step.id] && <p className="text-xs text-[var(--color-error)] mt-0.5">{errors[step.id]}</p>}
              </>
            )}

            {/* Radio — inline style */}
            {step.type === "radio" && !step.card && (
              <>
                <RadioGroup
                  value={answer}
                  onValueChange={val => selectAndAdvance(step.id, val)}
                >
                  {dynamicOpts.options.map((opt, i) => (
                    <Label key={i} htmlFor={`radio-${step.id}-${i}`} className="flex items-center gap-2.5">
                      <RadioGroupItem value={dynamicOpts.values[i]} id={`radio-${step.id}-${i}`} className="sr-only" />
                      <span className={`text-base font-normal ${t.radioText}`}>{opt}</span>
                    </Label>
                  ))}
                </RadioGroup>
                {errors[step.id] && <p className="text-xs text-[var(--color-error)] mt-0.5">{errors[step.id]}</p>}
              </>
            )}

            {/* Checkbox */}
            {step.type === "checkbox" && (
              <div className="flex flex-wrap gap-x-6 gap-y-4">
                {step.options.map((opt, i) => {
                  const val = step.values[i];
                  const isSelected = answer.includes(val);
                  return (
                    <label key={i} className="flex items-center gap-2.5 cursor-pointer group"
                      onClick={() => setAnswer(step.id, isSelected ? answer.filter(v => v !== val) : [...answer, val])}>
                      <span className={`w-5 h-5 border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? t.checkBoxSelected : t.checkBox
                      }`}>
                        {isSelected && (
                          <svg width="11" height="9" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span className={`text-base ${t.checkText}`}>{opt}</span>
                    </label>
                  );
                })}
              </div>
            )}

            {/* Select */}
            {step.type === "select" && (
              <>
                <Select value={answer} onValueChange={val => setAnswer(step.id, val)} defaultOpen={!!step.autoOpen}>
                  <SelectTrigger
                    id={`field-${step.id}`}
                    className={`w-full max-w-sm bg-white h-[50px] data-[size=default]:h-[50px] ${errors[step.id] ? "border-[var(--color-error)] hover:border-[var(--color-error)] focus:border-[var(--color-error)] focus:shadow-[0_0_0_2px_rgba(255,143,0,0.15)]" : ""}`}
                  >
                    <SelectValue placeholder="Sélectionnez une option" />
                  </SelectTrigger>
                  <SelectContent>
                    {dynamicOpts.options.map((opt, i) => (
                      <SelectItem key={i} value={dynamicOpts.values[i]}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[step.id] && <p className="text-xs text-[var(--color-error)] mt-0.5">{errors[step.id]}</p>}
              </>
            )}

            {/* Full date picker */}
            {step.type === "input" && step.inputType === "date" && (
              <>
                <div className="max-w-sm">
                  <DatePickerInput
                    id={`field-${step.id}`}
                    value={answer}
                    onChange={val => setAnswer(step.id, val)}
                    placeholder={step.placeholder || "Sélectionnez une date"}
                    theme={theme}
                    error={!!errors[step.id]}
                    className="bg-white h-[50px]"
                  />
                </div>
                {errors[step.id] && <p className="text-xs text-[var(--color-error)] mt-0.5">{errors[step.id]}</p>}
              </>
            )}

            {/* Typed dd/mm/yyyy date field */}
            {step.type === "input" && step.inputType === "date-text" && (
              <>
                <div className="max-w-sm">
                  <DateTextInput
                    id={`field-${step.id}`}
                    value={answer}
                    onChange={val => setAnswer(step.id, val)}
                    onEnter={handleNext}
                    error={!!errors[step.id]}
                  />
                </div>
                {errors[step.id] && <p className="text-xs text-[var(--color-error)] mt-0.5">{errors[step.id]}</p>}
              </>
            )}

            {/* Month + year dropdowns */}
            {step.type === "input" && step.inputType === "month" && (
              <>
                <MonthYearInput
                  mode="month"
                  value={answer}
                  onChange={val => setAnswer(step.id, val)}
                  error={!!errors[step.id]}
                  className="max-w-md"
                />
                {errors[step.id] && <p className="text-xs text-[var(--color-error)] mt-0.5">{errors[step.id]}</p>}
              </>
            )}

            {/* Year-only dropdown */}
            {step.type === "input" && step.inputType === "year" && (
              <>
                <MonthYearInput
                  mode="year"
                  value={answer}
                  onChange={val => setAnswer(step.id, val)}
                  error={!!errors[step.id]}
                  className="max-w-[160px]"
                />
                {errors[step.id] && <p className="text-xs text-[var(--color-error)] mt-0.5">{errors[step.id]}</p>}
              </>
            )}

            {/* Text / number / email / tel */}
            {step.type === "input" && !["date", "date-text", "month", "year"].includes(step.inputType) && (
              <>
                <Input
                  id={`field-${step.id}`}
                  type={step.inputType}
                  inputMode={step.inputType === "tel" ? "tel" : undefined}
                  placeholder={step.placeholder}
                  value={answer}
                  onChange={e => {
                    let v = step.inputType === "tel" ? e.target.value.replace(/[^\d\s+]/g, "") : e.target.value;
                    if (step.uppercase) v = v.toUpperCase();
                    setAnswer(step.id, v);
                  }}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleNext();
                    }
                  }}
                  className={`max-w-sm bg-white h-[50px] ${errors[step.id] ? "border-[var(--color-error)] hover:border-[var(--color-error)] focus:border-[var(--color-error)] focus:shadow-[0_0_0_2px_rgba(255,143,0,0.15)]" : ""}`}
                />
                {errors[step.id] && <p className="text-xs text-[var(--color-error)] mt-0.5">{errors[step.id]}</p>}
              </>
            )}
          </div>
        );
      })()}

      {/* Navigation */}
      <div className={`flex items-center gap-4 flex-wrap ${step.showConsentNote ? "justify-between" : "justify-end"} pt-2 ${sections.length > 1 ? "lg:pr-64" : ""}`}>
        {step.showConsentNote && (
          <p className={`text-xs leading-relaxed max-w-[220px] ${t.consentNote || "text-gray-500"}`}>
            En continuant, vous acceptez notre{" "}
            <Link href="/confidentialite/" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
              Politique de confidentialité
            </Link>.
          </p>
        )}

        <ButtonGroup>
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={findVisibleStepIndex(steps, stepIdx - 1, -1, answers) < 0}
            className="gap-1"
          >
            <ChevronLeft size={16} />
            Retour
          </Button>

          <Button
            onClick={handleNext}
            className={`gap-1 ${t.nextBtn}`}
          >
            {isLastStep ? "Envoyer ma demande" : (step.nextLabel || "Suivant")}
            {!isLastStep && <ChevronRight size={16} />}
          </Button>
        </ButtonGroup>
      </div>

    </div>

    {sections.length > 1 && (
      <aside
        className="hidden lg:block fixed right-8 xl:right-16 top-1/2 -translate-y-1/2 z-30 w-56"
        style={{ "--primary": "var(--color-brand)", "--primary-foreground": "#ffffff" }}
      >
        <Stepper value={currentSectionIdx + 1} orientation="vertical">
          <StepperNav>
            {sections.map((section, i) => (
              <StepperItem key={section} step={i + 1} className="relative items-start not-last:flex-1">
                <StepperTrigger asChild className="items-start gap-2.5 pb-8 last:pb-0">
                  <div className="flex items-start gap-2.5">
                    <StepperIndicator>
                      {i + 1 < currentSectionIdx + 1 ? <Check size={12} /> : i + 1}
                    </StepperIndicator>
                    <StepperTitle
                      className={i === currentSectionIdx ? "text-[var(--color-text)]" : "text-gray-400"}
                    >
                      {section}
                    </StepperTitle>
                  </div>
                </StepperTrigger>
                {i < sections.length - 1 && (
                  <StepperSeparator className="absolute inset-y-0 top-6 left-3 -order-1 -translate-x-1/2" />
                )}
              </StepperItem>
            ))}
          </StepperNav>
        </Stepper>
      </aside>
    )}
    </>
  );
}
