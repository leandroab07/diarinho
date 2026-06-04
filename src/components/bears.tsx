/* SVG dos ursinhos carinhosos — usados no backdrop e no joguinho da máquina */

export type BearKind = "pink" | "lilac" | "mint" | "yellow" | "blue" | "peach";

const PALETTES: Record<
  BearKind,
  { fur: string; furDark: string; belly: string; cheek: string; symbol: "heart" | "star" | "rainbow" | "sun" | "moon" | "flower" }
> = {
  pink:   { fur: "#ffb3cf", furDark: "#d97aa0", belly: "#ffe4ee", cheek: "#ff6699", symbol: "heart" },
  lilac:  { fur: "#caa9ee", furDark: "#9a78c4", belly: "#ede1ff", cheek: "#b884e6", symbol: "star" },
  mint:   { fur: "#a8e0c3", furDark: "#6db595", belly: "#e3f5ec", cheek: "#76ccaa", symbol: "rainbow" },
  yellow: { fur: "#ffe28a", furDark: "#d6a847", belly: "#fff6cf", cheek: "#ffc857", symbol: "sun" },
  blue:   { fur: "#a8c8f5", furDark: "#6f93ce", belly: "#e1ecff", cheek: "#7aa7e0", symbol: "moon" },
  peach:  { fur: "#ffcfae", furDark: "#d9956a", belly: "#fff0e1", cheek: "#ff9b7a", symbol: "flower" },
};

export function Bear({
  kind,
  className = "",
}: {
  kind: BearKind;
  className?: string;
}) {
  const p = PALETTES[kind];
  const id = `bear-${kind}`;
  return (
    <svg viewBox="0 0 140 140" className={className} aria-hidden>
      <defs>
        <radialGradient id={`bf-${id}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={p.fur} />
          <stop offset="100%" stopColor={p.furDark} />
        </radialGradient>
        <radialGradient id={`bb-${id}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor={p.belly} />
        </radialGradient>
        <radialGradient id={`bc-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.cheek} />
          <stop offset="100%" stopColor={p.cheek} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="36" cy="36" r="16" fill={`url(#bf-${id})`} stroke={p.furDark} strokeWidth="1.2" />
      <circle cx="104" cy="36" r="16" fill={`url(#bf-${id})`} stroke={p.furDark} strokeWidth="1.2" />
      <circle cx="36" cy="36" r="9" fill={p.belly} />
      <circle cx="104" cy="36" r="9" fill={p.belly} />
      <ellipse cx="70" cy="110" rx="34" ry="26" fill={`url(#bf-${id})`} stroke={p.furDark} strokeWidth="1.2" />
      <circle cx="70" cy="64" r="34" fill={`url(#bf-${id})`} stroke={p.furDark} strokeWidth="1.2" />
      <ellipse cx="70" cy="112" rx="22" ry="18" fill={`url(#bb-${id})`} />
      <g transform="translate(70 112)">
        {p.symbol === "heart" && (
          <path d="M0 6 C -10 -2, -12 -10, -6 -12 C -2 -13, 0 -10, 0 -8 C 0 -10, 2 -13, 6 -12 C 12 -10, 10 -2, 0 6 Z" fill="#ff4b7d" stroke="#a82451" strokeWidth="0.8" />
        )}
        {p.symbol === "star" && (
          <path d="M0 -12 L3 -4 L11 -4 L5 1 L7 9 L0 4 L-7 9 L-5 1 L-11 -4 L-3 -4 Z" fill="#ffd54f" stroke="#a8740c" strokeWidth="0.8" />
        )}
        {p.symbol === "rainbow" && (
          <g>
            <path d="M-11 4 A 11 11 0 0 1 11 4" fill="none" stroke="#ff6b9d" strokeWidth="3" strokeLinecap="round" />
            <path d="M-8 4 A 8 8 0 0 1 8 4" fill="none" stroke="#ffd166" strokeWidth="3" strokeLinecap="round" />
            <path d="M-5 4 A 5 5 0 0 1 5 4" fill="none" stroke="#5fb88a" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}
        {p.symbol === "sun" && (
          <g>
            <circle cx="0" cy="-1" r="6" fill="#ffd54f" stroke="#a8740c" strokeWidth="0.8" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <line key={a} x1="0" y1="-9" x2="0" y2="-12" stroke="#ffb84d" strokeWidth="1.5" strokeLinecap="round" transform={`rotate(${a})`} />
            ))}
          </g>
        )}
        {p.symbol === "moon" && (
          <path d="M-4 -8 A 8 8 0 1 0 6 6 A 6 6 0 1 1 -4 -8 Z" fill="#fff6c4" stroke="#a8740c" strokeWidth="0.8" />
        )}
        {p.symbol === "flower" && (
          <g>
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx="0" cy="-6" rx="3" ry="5" fill="#ff8fb8" transform={`rotate(${a})`} />
            ))}
            <circle r="2.5" fill="#ffd54f" />
          </g>
        )}
      </g>
      <ellipse cx="70" cy="78" rx="14" ry="10" fill="#fff5ec" />
      <ellipse cx="70" cy="70" rx="3.5" ry="2.5" fill="#3a2030" />
      <path d="M64 80 Q 70 86 76 80" stroke="#3a2030" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="56" cy="62" r="3" fill="#3a2030" />
      <circle cx="84" cy="62" r="3" fill="#3a2030" />
      <circle cx="57" cy="61" r="1" fill="#fff" />
      <circle cx="85" cy="61" r="1" fill="#fff" />
      <circle cx="48" cy="76" r="6" fill={`url(#bc-${id})`} />
      <circle cx="92" cy="76" r="6" fill={`url(#bc-${id})`} />
      <ellipse cx="44" cy="124" rx="6" ry="5" fill={p.belly} stroke={p.furDark} strokeWidth="0.8" />
      <ellipse cx="96" cy="124" rx="6" ry="5" fill={p.belly} stroke={p.furDark} strokeWidth="0.8" />
    </svg>
  );
}

export const BEAR_KINDS: BearKind[] = ["pink", "lilac", "mint", "yellow", "blue", "peach"];

export const BEAR_LABELS: Record<BearKind, string> = {
  pink: "Carinhoso ❤️",
  lilac: "Estrelinha ⭐",
  mint: "Arco-íris 🌈",
  yellow: "Solzinho ☀️",
  blue: "Luarzinho 🌙",
  peach: "Florzinha 🌼",
};
