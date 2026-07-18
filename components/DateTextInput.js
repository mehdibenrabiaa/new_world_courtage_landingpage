"use client"

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

function splitIso(iso) {
  if (!iso) return { day: "", month: "", year: "" };
  const [y, m, d] = iso.split("-");
  return { day: d || "", month: m || "", year: y || "" };
}

// Typed dd/mm/yyyy date field with static, always-visible "/" separators
// (so users don't try to type them) — stores/returns an ISO "YYYY-MM-DD"
// string, same as DatePickerInput.
export function DateTextInput({ id, value, onChange, onEnter, error = false, className = "" }) {
  const initial = splitIso(value);
  const [day, setDay] = useState(initial.day);
  const [month, setMonth] = useState(initial.month);
  const [year, setYear] = useState(initial.year);

  const dayRef = useRef(null);
  const monthRef = useRef(null);
  const yearRef = useRef(null);
  // Tracks the last value *we* sent up, so the sync effect below can tell
  // its own echo (e.g. "" while the date is still incomplete) apart from a
  // real external reset — otherwise every incomplete keystroke round-trips
  // through the parent and wipes the segments the user just typed.
  const lastEmitted = useRef(value);

  useEffect(() => {
    if (value === lastEmitted.current) return;
    lastEmitted.current = value;
    const s = splitIso(value);
    setDay(s.day);
    setMonth(s.month);
    setYear(s.year);
  }, [value]);

  function emit(d, m, y) {
    const next = d.length === 2 && m.length === 2 && y.length === 4 ? `${y}-${m}-${d}` : "";
    lastEmitted.current = next;
    onChange?.(next);
  }

  function handleDayChange(e) {
    const v = e.target.value.replace(/\D/g, "").slice(0, 2);
    setDay(v);
    emit(v, month, year);
    if (v.length === 2) monthRef.current?.focus();
  }

  function handleMonthChange(e) {
    const v = e.target.value.replace(/\D/g, "").slice(0, 2);
    setMonth(v);
    emit(day, v, year);
    if (v.length === 2) yearRef.current?.focus();
  }

  function handleYearChange(e) {
    const v = e.target.value.replace(/\D/g, "").slice(0, 4);
    setYear(v);
    emit(day, month, v);
  }

  function handleKeyDown(which, e) {
    if (e.key === "Backspace" && e.target.value === "") {
      if (which === "month") dayRef.current?.focus();
      if (which === "year") monthRef.current?.focus();
    }
    if (e.key === "Enter") {
      e.preventDefault();
      onEnter?.();
    }
  }

  const segmentCls = "bg-transparent text-center outline-none placeholder:text-gray-400";

  return (
    <div
      id={id}
      className={cn(
        "flex items-center gap-1 h-[50px] rounded-md border bg-white px-3 focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
        error ? "border-[var(--color-error)]" : "border-input",
        className
      )}
    >
      <input
        ref={dayRef}
        type="text"
        inputMode="numeric"
        placeholder="JJ"
        maxLength={2}
        value={day}
        onChange={handleDayChange}
        onKeyDown={e => handleKeyDown("day", e)}
        className={cn(segmentCls, "w-7")}
      />
      <span className="text-gray-400 select-none">/</span>
      <input
        ref={monthRef}
        type="text"
        inputMode="numeric"
        placeholder="MM"
        maxLength={2}
        value={month}
        onChange={handleMonthChange}
        onKeyDown={e => handleKeyDown("month", e)}
        className={cn(segmentCls, "w-7")}
      />
      <span className="text-gray-400 select-none">/</span>
      <input
        ref={yearRef}
        type="text"
        inputMode="numeric"
        placeholder="AAAA"
        maxLength={4}
        value={year}
        onChange={handleYearChange}
        onKeyDown={e => handleKeyDown("year", e)}
        className={cn(segmentCls, "w-14")}
      />
    </div>
  );
}
