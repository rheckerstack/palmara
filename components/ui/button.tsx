import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--palmara-gold] focus-visible:ring-offset-2 focus-visible:ring-offset-[--palmara-bg]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-[--palmara-gold] to-[#a8893a] text-[#09070f] font-semibold shadow-[0_4px_24px_rgba(201,168,76,0.3)] hover:shadow-[0_8px_40px_rgba(201,168,76,0.5)] hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
        secondary:
          "bg-gradient-to-br from-[--palmara-purple] to-[#7a60c8] text-white shadow-[0_4px_20px_rgba(155,127,232,0.2)] hover:shadow-[0_8px_32px_rgba(155,127,232,0.4)] hover:brightness-110 hover:-translate-y-0.5 active:scale-[0.98]",
        outline:
          "border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] text-[rgba(255,255,255,0.6)] hover:border-[rgba(201,168,76,0.4)] hover:text-[--palmara-gold] hover:-translate-y-0.5 active:scale-[0.98]",
        ghost:
          "text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.05)] active:scale-[0.97]",
        destructive:
          "bg-[--palmara-love] text-white hover:brightness-110 hover:-translate-y-0.5 active:scale-[0.98]",
        love:
          "bg-gradient-to-br from-[--palmara-love] to-[#c04048] text-white shadow-[0_4px_20px_rgba(232,99,106,0.3)] hover:shadow-[0_8px_36px_rgba(232,99,106,0.5)] hover:-translate-y-0.5 active:scale-[0.98]",
        teal:
          "bg-gradient-to-br from-[--palmara-teal] to-[#468880] text-white shadow-[0_4px_20px_rgba(91,168,158,0.3)] hover:shadow-[0_8px_36px_rgba(91,168,158,0.5)] hover:-translate-y-0.5 active:scale-[0.98]",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm:      "h-9 px-4 py-2 text-xs rounded-lg",
        lg:      "h-14 px-8 py-3 text-base rounded-2xl",
        xl:      "h-16 px-10 py-4 text-lg rounded-2xl",
        icon:    "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
