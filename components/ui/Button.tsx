"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-body font-semibold tracking-wide transition-colors disabled:opacity-40 disabled:pointer-events-none rounded-lg",
  {
    variants: {
      variant: {
        gold: "bg-gradient-to-b from-gold-bright to-gold text-ink-deep shadow-gold hover:shadow-gold-lg border border-gold-bright/60",
        arcane:
          "bg-gradient-to-b from-arcane-bright to-arcane text-white shadow-arcane border border-arcane-bright/50",
        ghost:
          "bg-white/5 text-parchment border border-white/10 hover:bg-white/10",
        outline:
          "bg-transparent text-gold border border-gold/50 hover:bg-gold/10",
        danger:
          "bg-strength/90 text-white border border-strength/60 hover:bg-strength",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "gold",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "ref">,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
