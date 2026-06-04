"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--primary)] text-[var(--primary-fg)] hover:brightness-110 shadow-[var(--shadow-soft)]",
        accent:
          "bg-[var(--accent)] text-[var(--accent-fg)] hover:brightness-110 shadow-[var(--shadow-soft)]",
        outline:
          "border-2 border-[var(--border)] bg-[var(--card)] text-[var(--card-fg)] hover:bg-[var(--muted)]",
        ghost:
          "text-[var(--card-fg)] hover:bg-[var(--muted)]",
        soft: "bg-[var(--muted)] text-[var(--card-fg)] hover:brightness-95",
        danger:
          "bg-[var(--danger)] text-white hover:brightness-110 shadow-[var(--shadow-soft)]",
        link: "text-[var(--primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 rounded-xl text-xs",
        lg: "h-12 px-7 text-base rounded-2xl",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
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
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
