import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden border border-transparent px-2 py-0.5 text-xs font-bold whitespace-nowrap transition-all uppercase tracking-widest focus-visible:border-[#ffffff] focus-visible:ring-[3px] focus-visible:ring-[#ffffff]/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-[#e22718] aria-invalid:ring-[#e22718]/20 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-[#ffffff] text-[#000000] hover:bg-[#ffffff]/80",
        secondary:
          "bg-[#1a1a1a] text-[#ffffff] hover:bg-[#1a1a1a]/80",
        destructive:
          "bg-[#e22718]/10 text-[#e22718] focus-visible:ring-[#e22718]/20",
        outline:
          "border-[#3c3c3c] text-[#ffffff] hover:bg-[#1a1a1a]",
        ghost:
          "hover:bg-[#1a1a1a] hover:text-[#ffffff]",
        link: "text-[#ffffff] underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
