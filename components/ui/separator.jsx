"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cn } from "@/lib/utils"

function Separator({ className, orientation = "horizontal", decorative = true, ...props }) {
  return (
    <SeparatorPrimitive.Root
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0",
        orientation === "horizontal" ? "w-full" : "h-full",
        className
      )}
      style={{
        backgroundColor: "#d1d5db",
        ...(orientation === "horizontal" ? { height: "1px" } : { width: "1px" }),
      }}
      {...props}
    />
  )
}

export { Separator }
