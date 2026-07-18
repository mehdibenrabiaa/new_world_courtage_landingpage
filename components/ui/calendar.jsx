import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { cn } from "@/lib/utils"

const MONTHS_FR   = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"]
const MONTHS_SHORT = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"]
const DAYS_FR     = ["Lu","Ma","Me","Je","Ve","Sa","Di"]

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOffset(year, month) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

export function Calendar({
  selected,
  onSelect,
  month: controlledMonth,
  onMonthChange,
  className,
  fromYear = 1940,
  toYear = new Date().getFullYear() + 5,
  disabled, // (date: Date) => boolean
}) {
  const [internalMonth, setInternalMonth] = React.useState(selected || new Date())
  const [view, setView] = React.useState("day") // "day" | "month" | "year"
  const yearListRef = React.useRef(null)

  const display = controlledMonth || internalMonth
  const year    = display.getFullYear()
  const month   = display.getMonth()
  const today   = new Date()

  function setDisplay(d) {
    onMonthChange ? onMonthChange(d) : setInternalMonth(d)
  }
  function navigate(months) {
    setDisplay(new Date(year, month + months, 1))
  }
  function navigateYear(years) {
    setDisplay(new Date(year + years, month, 1))
  }

  // Scroll selected year into view when year panel opens
  React.useEffect(() => {
    if (view === "year" && yearListRef.current) {
      const el = yearListRef.current.querySelector("[data-selected=true]")
      if (el) el.scrollIntoView({ block: "center" })
    }
  }, [view])

  const years = []
  for (let y = fromYear; y <= toYear; y++) years.push(y)

  // Day grid cells
  const cells = []
  for (let i = 0; i < getFirstDayOffset(year, month); i++) cells.push(null)
  for (let d = 1; d <= getDaysInMonth(year, month); d++) cells.push(d)

  function isSelected(day) {
    if (!selected) return false
    return selected.getFullYear() === year && selected.getMonth() === month && selected.getDate() === day
  }
  function isToday(day) {
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
  }
  function isDisabled(day) {
    if (!disabled) return false
    return disabled(new Date(year, month, day))
  }

  const navBtn   = "h-6 w-6 rounded flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
  const headerBtn = "px-1.5 py-0.5 rounded text-sm font-semibold text-gray-900 hover:text-[var(--color-brand)] hover:bg-gray-50 transition-colors"

  return (
    <div className={cn("p-3 select-none w-[280px]", className)}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-3">

        {view === "day" && (
          <>
            <div className="flex items-center gap-0.5">
              <button type="button" onClick={() => navigateYear(-1)} className={navBtn}><ChevronsLeft size={13} /></button>
              <button type="button" onClick={() => navigate(-1)}     className={navBtn}><ChevronLeft  size={13} /></button>
            </div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setView("month")} className={headerBtn}>{MONTHS_FR[month]}</button>
              <button type="button" onClick={() => setView("year")}  className={headerBtn}>{year}</button>
            </div>
            <div className="flex items-center gap-0.5">
              <button type="button" onClick={() => navigate(1)}      className={navBtn}><ChevronRight  size={13} /></button>
              <button type="button" onClick={() => navigateYear(1)}  className={navBtn}><ChevronsRight size={13} /></button>
            </div>
          </>
        )}

        {view === "month" && (
          <>
            <div className="flex items-center gap-0.5">
              <button type="button" onClick={() => navigateYear(-1)} className={navBtn}><ChevronsLeft size={13} /></button>
            </div>
            <button type="button" onClick={() => setView("year")} className={headerBtn}>{year}</button>
            <div className="flex items-center gap-0.5">
              <button type="button" onClick={() => navigateYear(1)}  className={navBtn}><ChevronsRight size={13} /></button>
            </div>
          </>
        )}

        {view === "year" && (
          <span className="w-full text-center text-sm font-semibold text-gray-900">Sélectionner une année</span>
        )}

      </div>

      {/* ── Day view ── */}
      {view === "day" && (
        <>
          <div className="grid grid-cols-7 mb-1">
            {DAYS_FR.map(d => (
              <div key={d} className="h-8 flex items-center justify-center text-[11px] font-medium text-gray-400">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-0.5">
            {cells.map((day, i) => (
              <div key={i} className="flex items-center justify-center">
                {day ? (
                  <button
                    type="button"
                    disabled={isDisabled(day)}
                    onClick={() => !isDisabled(day) && onSelect?.(new Date(year, month, day))}
                    className={cn(
                      "h-8 w-8 rounded-md text-sm transition-colors",
                      isDisabled(day) && "text-gray-300 cursor-not-allowed",
                      !isDisabled(day) && isSelected(day) && "bg-[var(--color-brand)] text-white font-semibold",
                      !isDisabled(day) && isToday(day) && !isSelected(day) && "bg-gray-100 font-semibold text-gray-900",
                      !isDisabled(day) && !isSelected(day) && !isToday(day) && "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    {day}
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Month view ── */}
      {view === "month" && (
        <div className="grid grid-cols-3 gap-2 py-1">
          {MONTHS_SHORT.map((m, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { setDisplay(new Date(year, i, 1)); setView("day") }}
              className={cn(
                "py-2 rounded-md text-sm transition-colors",
                i === month
                  ? "bg-[var(--color-brand)] text-white font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {/* ── Year view ── */}
      {view === "year" && (
        <div ref={yearListRef} className="grid grid-cols-3 gap-2 py-1 max-h-[200px] overflow-y-auto">
          {years.map(y => (
            <button
              key={y}
              type="button"
              data-selected={y === year}
              onClick={() => { setDisplay(new Date(y, month, 1)); setView("month") }}
              className={cn(
                "py-2 rounded-md text-sm transition-colors",
                y === year
                  ? "bg-[var(--color-brand)] text-white font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              {y}
            </button>
          ))}
        </div>
      )}

    </div>
  )
}
