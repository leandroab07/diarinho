"use client";

/**
 * Decorative floating emojis. Only visible on the pink theme (CSS-controlled).
 * Pointer-events: none — pure cosmetic.
 */
export function FloralBackdrop() {
  return (
    <div
      aria-hidden
      className="floral-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
    >
      <span className="floral-bloom" style={{ top: "8%", left: "4%", animationDelay: "0s", fontSize: "2.2rem" }}>
        🌸
      </span>
      <span className="floral-bloom" style={{ top: "20%", right: "6%", animationDelay: "0.6s", fontSize: "2.5rem" }}>
        🌷
      </span>
      <span className="floral-bloom" style={{ top: "45%", left: "2%", animationDelay: "1.2s", fontSize: "1.8rem" }}>
        💐
      </span>
      <span className="floral-bloom" style={{ top: "62%", right: "3%", animationDelay: "1.8s", fontSize: "2.4rem" }}>
        🌻
      </span>
      <span className="floral-bloom" style={{ bottom: "12%", left: "8%", animationDelay: "2.4s", fontSize: "2rem" }}>
        🌼
      </span>
      <span className="floral-bloom" style={{ top: "33%", left: "48%", animationDelay: "0.3s", fontSize: "1.4rem" }}>
        ✨
      </span>
      <span className="floral-bloom" style={{ top: "75%", left: "55%", animationDelay: "1.5s", fontSize: "1.6rem" }}>
        💕
      </span>
      <span className="floral-bloom" style={{ top: "15%", left: "60%", animationDelay: "2.1s", fontSize: "1.5rem" }}>
        🌿
      </span>
      <span className="floral-bloom" style={{ bottom: "30%", right: "30%", animationDelay: "0.9s", fontSize: "1.7rem" }}>
        🦋
      </span>
      <span className="floral-bloom" style={{ top: "5%", left: "35%", animationDelay: "2.7s", fontSize: "1.3rem" }}>
        ⭐
      </span>

      <span
        className="floral-blob"
        style={{
          top: "-120px",
          left: "-120px",
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--primary) 35%, transparent), transparent 70%)",
        }}
      />
      <span
        className="floral-blob"
        style={{
          bottom: "-160px",
          right: "-140px",
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 35%, transparent), transparent 70%)",
        }}
      />
      <span
        className="floral-blob"
        style={{
          top: "40%",
          right: "-200px",
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--peach) 50%, transparent), transparent 70%)",
        }}
      />
    </div>
  );
}
