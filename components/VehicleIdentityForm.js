import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import CtaButton from "@/components/CtaButton";

const STORAGE_KEY = "nwc_vehicle_form";

const INSURANCE_TYPES = [
  { label: "Poids lourd", value: "poids_lourd" },
  { label: "VTC", value: "vtc" },
  { label: "Taxi", value: "taxi" },
];

// Per-type devis pages (hardcoded questionnaires). Types without an entry
// here fall back to `redirectTo`.
const DEVIS_PATH_BY_TYPE = {
  vtc: "/devis/vtc/",
  poids_lourd: "/devis/poidslourds/",
};

function readStorage() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeStorage(values) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  } catch {}
}

function clearStorage() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export default function VehicleIdentityForm({ redirectTo = "/devis/" }) {
  const router = useRouter();

  const [name,            setName]           = useState("");
  const [phone,           setPhone]          = useState("");
  const [insuranceType,   setInsuranceType]  = useState("");
  const [errors,          setErrors]         = useState({});

  // Restore values from the URL (so browser back/forward keeps the fill), falling back to sessionStorage
  useEffect(() => {
    if (!router.isReady) return;
    const saved = readStorage();
    const { name: qName, phone: qPhone, insuranceType: qInsuranceType } = router.query;
    setName(qName || saved.name || "");
    setPhone(qPhone || saved.phone || "");
    setInsuranceType(qInsuranceType || saved.insuranceType || "");
  }, [router.isReady]);

  useEffect(() => {
    writeStorage({ name, phone, insuranceType });
  }, [name, phone, insuranceType]);

  function updateQuery(patch) {
    const merged = { name, phone, insuranceType, ...patch };
    const nextQuery = Object.fromEntries(Object.entries(merged).filter(([, v]) => v !== ""));
    router.replace({ pathname: router.pathname, query: nextQuery }, undefined, { shallow: true, scroll: false });
  }

  function clearError(field) {
    setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};
    if (!name)           newErrors.name           = "Ce champ est requis.";
    if (!phone)          newErrors.phone          = "Ce champ est requis.";
    if (!insuranceType)  newErrors.insuranceType  = "Ce champ est requis.";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    clearStorage();
    const q = new URLSearchParams({ name, phone, insuranceType });
    const target = DEVIS_PATH_BY_TYPE[insuranceType] || redirectTo;
    router.push(`${target}?${q.toString()}`);
  }

  const triggerCls = (field) =>
    `w-full bg-white h-[50px] data-[size=default]:h-[50px] ${errors[field] ? "border-2 border-[var(--color-error)]" : ""}`;

  const inputCls = (field) =>
    `bg-white h-[50px] ${errors[field] ? "border-[var(--color-error)] focus:border-[var(--color-error)]" : ""}`;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-11">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">

        {/* Nom complet */}
        <Field className="border-0 p-0" data-invalid={!!errors.name}>
          <FieldLabel htmlFor="field-name" className="flex w-auto! text-white text-[15px] font-semibold">
            Nom complet <span className="ml-0.5">*</span>
          </FieldLabel>
          <Input
            id="field-name"
            type="text"
            value={name}
            onChange={e => { setName(e.target.value); clearError("name"); updateQuery({ name: e.target.value }); }}
            placeholder="Ex : Jean Dupont"
            className={inputCls("name")}
          />
          {errors.name && <FieldError errors={[{ message: errors.name }]} className="text-[#F2693D]" />}
        </Field>

        {/* Téléphone */}
        <Field className="border-0 p-0" data-invalid={!!errors.phone}>
          <FieldLabel htmlFor="field-phone" className="flex w-auto! text-white text-[15px] font-semibold">
            Téléphone <span className="ml-0.5">*</span>
          </FieldLabel>
          <Input
            id="field-phone"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={e => {
              const v = e.target.value.replace(/[^\d\s+]/g, "");
              setPhone(v);
              clearError("phone");
              updateQuery({ phone: v });
            }}
            placeholder="Ex : 06 12 34 56 78"
            className={inputCls("phone")}
          />
          {errors.phone && <FieldError errors={[{ message: errors.phone }]} className="text-[#F2693D]" />}
        </Field>

        {/* Type d'assurance */}
        <Field className="border-0 p-0 sm:col-span-2" data-invalid={!!errors.insuranceType}>
          <FieldLabel className="flex w-auto! text-white text-[15px] font-semibold">
            Type d&apos;assurance <span className="ml-0.5">*</span>
          </FieldLabel>
          <Select
            value={insuranceType}
            onValueChange={v => { setInsuranceType(v); clearError("insuranceType"); updateQuery({ insuranceType: v }); }}
          >
            <SelectTrigger className={triggerCls("insuranceType")}>
              <SelectValue placeholder="Sélectionnez un type d'assurance" />
            </SelectTrigger>
            <SelectContent>
              {INSURANCE_TYPES.map(({ label, value }) => (
                <SelectItem key={value} value={value} className="text-base py-2.5">{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.insuranceType && <FieldError errors={[{ message: errors.insuranceType }]} className="text-[#F2693D]" />}
        </Field>

      </div>

      {/* Submit */}
      <div className="flex flex-col gap-3">
        <CtaButton
          type="submit"
          label="Obtenir un devis"
          className="self-start h-[50px] bg-white hover:bg-gray-100 text-black"
        />
        <div className="flex items-center gap-2 mt-5">
          <img src="/icons/lock.svg" alt="" aria-hidden="true" className="w-4 h-4 shrink-0 brightness-0 invert" />
          <p className="text-xs font-medium text-white">La sécurité de vos données est notre priorité.</p>
        </div>
      </div>

    </form>
  );
}
