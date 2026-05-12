import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding text-sm font-bold whitespace-nowrap transition-all outline-none select-none uppercase tracking-widest focus-visible:border-[#ffffff] focus-visible:ring-3 focus-visible:ring-[#ffffff]/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-[#e22718] aria-invalid:ring-3 aria-invalid:ring-[#e22718]/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-[#ffffff] text-[#000000] hover:bg-[#ffffff]/80",
        outline:
          "border-[#3c3c3c] bg-transparent hover:bg-[#1a1a1a] hover:text-[#ffffff] aria-expanded:bg-[#1a1a1a] aria-expanded:text-[#ffffff]",
        secondary:
          "bg-[#1a1a1a] text-[#ffffff] hover:bg-[#1a1a1a]/80",
        ghost:
          "hover:bg-[#1a1a1a] hover:text-[#ffffff] aria-expanded:bg-[#1a1a1a] aria-expanded:text-[#ffffff]",
        destructive:
          "bg-[#e22718]/10 text-[#e22718] hover:bg-[#e22718]/20 focus-visible:border-[#e22718]/40 focus-visible:ring-[#e22718]/20",
        link: "text-[#ffffff] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 gap-1.5 px-8",
        xs: "h-6 gap-1 px-2 text-xs",
        sm: "h-10 gap-1 px-6 text-xs",
        lg: "h-14 gap-1.5 px-10",
        icon: "size-12",
        "icon-xs": "size-6",
        "icon-sm": "size-10",
        "icon-lg": "size-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
