import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 border border-[#3c3c3c] bg-transparent px-4 py-1 text-base transition-colors outline-none placeholder:text-[#7e7e7e] focus-visible:border-[#ffffff] focus-visible:ring-3 focus-visible:ring-[#ffffff]/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[#e22718] aria-invalid:ring-3 aria-invalid:ring-[#e22718]/20 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
