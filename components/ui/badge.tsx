import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide transition-all duration-200 select-none",
  {
    variants: {
      variant: {
        default:
          "border border-[rgba(201,168,76,0.3)] bg-[rgba(201,168,76,0.08)] text-[--palmara-gold]",
        secondary:
          "border border-[rgba(155,127,232,0.3)] bg-[rgba(155,127,232,0.08)] text-[--palmara-purple]",
        free:
          "border border-[rgba(201,168,76,0.22)] bg-[rgba(201,168,76,0.07)] text-[--palmara-gold] gap-1.5",
        pro:
          "border border-[rgba(155,127,232,0.4)] bg-[rgba(155,127,232,0.12)] text-[--palmara-purple] font-semibold",
        love:
          "border border-[rgba(232,99,106,0.3)] bg-[rgba(232,99,106,0.08)] text-[--palmara-love]",
        teal:
          "border border-[rgba(91,168,158,0.3)] bg-[rgba(91,168,158,0.08)] text-[--palmara-teal]",
        outline:
          "border border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.4)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
