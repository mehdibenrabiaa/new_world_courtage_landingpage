import * as React from "react"
import { cn } from "@/lib/utils"

const PopoverContext = React.createContext(null)

function Popover({ children, open: controlledOpen, onOpenChange, className }) {
  const [internal, setInternal] = React.useState(false)
  const open   = controlledOpen !== undefined ? controlledOpen : internal
  const setOpen = onOpenChange ?? setInternal
  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div className={cn("relative inline-block w-full", className)}>
        {children}
      </div>
    </PopoverContext.Provider>
  )
}

const PopoverTrigger = React.forwardRef(function PopoverTrigger(
  { children, asChild, ...props },
  ref
) {
  const { open, setOpen } = React.useContext(PopoverContext)
  const toggle = () => setOpen(!open)

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      ref,
      onClick(e) {
        children.props.onClick?.(e)
        toggle()
      },
    })
  }
  return (
    <button ref={ref} type="button" onClick={toggle} {...props}>
      {children}
    </button>
  )
})
PopoverTrigger.displayName = "PopoverTrigger"

const PopoverContent = React.forwardRef(function PopoverContent(
  { children, className, align = "center", sideOffset = 4, alignOffset = 0, ...props },
  ref
) {
  const { open, setOpen } = React.useContext(PopoverContext)
  const innerRef = React.useRef(null)
  const [openAbove, setOpenAbove] = React.useState(false)

  // Detect whether to flip above (collision detection)
  React.useLayoutEffect(() => {
    if (!open || !innerRef.current) return
    const trigger = innerRef.current.parentElement
    if (!trigger) return
    const triggerRect = trigger.getBoundingClientRect()
    const contentH    = innerRef.current.offsetHeight
    const spaceBelow  = window.innerHeight - triggerRect.bottom
    setOpenAbove(spaceBelow < contentH + sideOffset + 8)
  }, [open, sideOffset])

  React.useEffect(() => {
    if (!open) return
    function onMouseDown(e) {
      if (innerRef.current && !innerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onMouseDown)
    return () => document.removeEventListener("mousedown", onMouseDown)
  }, [open, setOpen])

  if (!open) return null

  const alignStyle =
    align === "end"   ? { right: alignOffset } :
    align === "start" ? { left: alignOffset }  :
    { left: "50%", transform: "translateX(-50%)" }

  const positionStyle = openAbove
    ? { bottom: `calc(100% + ${sideOffset}px)`, ...alignStyle }
    : { top:    `calc(100% + ${sideOffset}px)`, ...alignStyle }

  return (
    <div
      ref={node => {
        innerRef.current = node
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      }}
      className={cn(
        "absolute z-50 rounded-xl border border-gray-200 bg-white shadow-lg outline-none",
        className
      )}
      style={positionStyle}
      {...props}
    >
      {children}
    </div>
  )
})
PopoverContent.displayName = "PopoverContent"

const PopoverAnchor = ({ children }) => children

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
