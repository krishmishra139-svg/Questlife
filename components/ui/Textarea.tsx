"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-lg bg-black/30 border border-white/10 px-4 py-2.5 text-sm text-parchment placeholder:text-white/30 resize-none",
          "outline-none transition-all duration-200",
          "focus:border-gold/60 focus:shadow-gold focus:bg-black/40",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
