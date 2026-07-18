"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const RadioGroupContext = React.createContext({})

const RadioGroup = React.forwardRef(function RadioGroup(
  { className, value, onValueChange, defaultValue, ...props }, ref
) {
  const [internal, setInternal] = React.useState(defaultValue ?? "")
  const controlled = value !== undefined
  const current = controlled ? value : internal

  function handleChange(val) {
    if (!controlled) setInternal(val)
    onValueChange?.(val)
  }

  return (
    <RadioGroupContext.Provider value={{ current, handleChange }}>
      <div
        ref={ref}
        role="radiogroup"
        className={cn("flex flex-wrap gap-x-6 gap-y-4", className)}
        {...props}
      />
    </RadioGroupContext.Provider>
  )
})
RadioGroup.displayName = "RadioGroup"

const RadioGroupItem = React.forwardRef(function RadioGroupItem(
  { className, value, disabled, id, ...props }, ref
) {
  const { current, handleChange } = React.useContext(RadioGroupContext)
  const checked = current === value

  return (
    <button
      ref={ref}
      type="button"
      id={id}
      role="radio"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && handleChange(value)}
      className={cn(
        "w-5 h-5 rounded-full border-2 border-[#d9d9d9] bg-white relative shrink-0 transition-colors",
        "hover:border-[var(--color-brand)]",
        checked && "border-[var(--color-brand)] bg-[var(--color-brand)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {checked && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-white" />
        </span>
      )}
    </button>
  )
})
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
