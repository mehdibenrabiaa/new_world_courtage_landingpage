"use client"

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const MONTHS = [
  ["01", "Janvier"], ["02", "Février"], ["03", "Mars"], ["04", "Avril"],
  ["05", "Mai"], ["06", "Juin"], ["07", "Juillet"], ["08", "Août"],
  ["09", "Septembre"], ["10", "Octobre"], ["11", "Novembre"], ["12", "Décembre"],
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1959 }, (_, i) => String(CURRENT_YEAR - i));

// mode="month" stores/returns "YYYY-MM", mode="year" stores/returns "YYYY".
export function MonthYearInput({ value, onChange, mode = "month", error = false, className = "" }) {
  const [yearPart, monthPart] = mode === "month" && value ? value.split("-") : [value || "", ""];

  function setMonth(m) {
    onChange(`${yearPart || CURRENT_YEAR}-${m}`);
  }
  function setYear(y) {
    if (mode === "year") { onChange(y); return; }
    onChange(`${y}-${monthPart || "01"}`);
  }

  const triggerCls = `bg-white h-[50px] ${error ? "border-[var(--color-error)] hover:border-[var(--color-error)]" : ""}`;

  if (mode === "year") {
    return (
      <Select value={yearPart} onValueChange={setYear}>
        <SelectTrigger className={`w-full ${triggerCls} ${className}`}>
          <SelectValue placeholder="Année" />
        </SelectTrigger>
        <SelectContent>
          {YEARS.map((y) => (
            <SelectItem key={y} value={y}>{y}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className={`flex gap-3 ${className}`}>
      <Select value={monthPart} onValueChange={setMonth}>
        <SelectTrigger className={`flex-1 ${triggerCls}`}>
          <SelectValue placeholder="Mois" />
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map(([v, label]) => (
            <SelectItem key={v} value={v}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={yearPart} onValueChange={setYear}>
        <SelectTrigger className={`flex-1 ${triggerCls}`}>
          <SelectValue placeholder="Année" />
        </SelectTrigger>
        <SelectContent>
          {YEARS.map((y) => (
            <SelectItem key={y} value={y}>{y}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
