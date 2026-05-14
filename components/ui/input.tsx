import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-base text-[rgba(255,255,255,0.75)] placeholder:text-[rgba(255,255,255,0.22)] transition-all duration-200",
          "focus:outline-none focus:border-[rgba(201,168,76,0.45)] focus:bg-[rgba(255,255,255,0.06)] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.08)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        style={{ fontFamily: "'Crimson Text', serif" }}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
