"use client";

import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { paperClass } from "@/lib/paper-styles";
import type { PaperStyle } from "@/lib/database.types";

/**
 * Textarea com fundo de papel reagindo ao estilo selecionado num input hidden
 * irmão (procura por name="paper_style" no mesmo form).
 */
export const PaperTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    paperStyleName?: string;
    defaultPaperStyle?: PaperStyle | null;
  }
>(({ className, paperStyleName = "paper_style", defaultPaperStyle, ...props }, ref) => {
  const [style, setStyle] = useState<PaperStyle>(
    (defaultPaperStyle ?? "plain") as PaperStyle,
  );

  // Observa mudanças no input hidden do PaperPicker (mesmo form)
  React.useEffect(() => {
    const el = (ref as React.RefObject<HTMLTextAreaElement>)?.current;
    const form = el?.form;
    if (!form) return;
    const input = form.querySelector<HTMLInputElement>(
      `input[name="${paperStyleName}"]`,
    );
    if (!input) return;

    const observer = new MutationObserver(() => {
      setStyle((input.value as PaperStyle) || "plain");
    });
    observer.observe(input, { attributes: true, attributeFilter: ["value"] });

    // also poll because React updates value without firing mutation
    const id = setInterval(() => {
      if (input.value !== style) setStyle((input.value as PaperStyle) || "plain");
    }, 200);

    return () => {
      observer.disconnect();
      clearInterval(id);
    };
  }, [paperStyleName, ref, style]);

  return (
    <textarea
      ref={ref}
      {...props}
      className={cn(
        "flex min-h-[260px] w-full rounded-2xl border-2 border-[var(--border)] px-5 py-4 text-base leading-[28px] text-[var(--card-fg)] placeholder:text-[var(--muted-fg)] shadow-sm transition-all focus-visible:outline-none focus-visible:border-[var(--ring)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]/30 disabled:cursor-not-allowed disabled:opacity-50 resize-y font-handwriting text-xl",
        paperClass(style),
        className,
      )}
    />
  );
});
PaperTextarea.displayName = "PaperTextarea";
