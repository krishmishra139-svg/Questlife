"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-lg bg-black/30 border border-white/10 px-4 py-2.5 text-sm text-parchment placeholder:text-white/30",
          "outline-none transition-all duration-200",
          "focus:border-gold/60 focus:shadow-gold focus:bg-black/40",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
