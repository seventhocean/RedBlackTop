import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full border border-[#3c3c3c] bg-transparent px-4 py-2 text-base transition-colors outline-none placeholder:text-[#7e7e7e] focus-visible:border-[#ffffff] focus-visible:ring-3 focus-visible:ring-[#ffffff]/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[#e22718] aria-invalid:ring-3 aria-invalid:ring-[#e22718]/20 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
