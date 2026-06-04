import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "outline" | "soft" | "accent" | "peach" | "danger";
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const v = {
    default: "bg-[var(--primary)] text-[var(--primary-fg)]",
    accent: "bg-[var(--accent)] text-[var(--accent-fg)]",
    peach: "bg-[var(--peach)] text-[#5a3a1a]",
    soft: "bg-[var(--muted)] text-[var(--card-fg)]",
    outline: "border-2 border-[var(--border)] text-[var(--card-fg)]",
    danger: "bg-[var(--danger)] text-white",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-all",
        v,
        className,
      )}
      {...props}
    />
  );
}
