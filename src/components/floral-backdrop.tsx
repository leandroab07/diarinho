/**
 * Decorative friends for the pink theme.
 * Care bears, bunnies and flowers with kawaii faces.
 * Non-interactive (<span>): wake up only on hover.
 */

/* ─────────────────────────────────────────────────────────────────────
 * CARE BEARS — 4 variations
 * ────────────────────────────────────────────────────────────────────── */

type BearProps = {
  fur: string;
  furDark: string;
  belly: string;
  cheek: string;
  symbol: "heart" | "star" | "rainbow" | "sun";
  className?: string;
};

function CareBear({ fur, furDark, belly, cheek, symbol, className = "" }: BearProps) {
  return (
    <svg viewBox="0 0 140 140" className={className} aria-hidden>
      <defs>
        <radialGradient id={`b-fur-${symbol}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={fur} />
          <stop offset="100%" stopColor={furDark} />
        </radialGradient>
        <radialGradient id={`b-belly-${symbol}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor={belly} />
        </radialGradient>
        <radialGradient id={`b-cheek-${symbol}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={cheek} />
          <stop offset="100%" stopColor={cheek} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ears */}
      <circle cx="36" cy="36" r="16" fill={`url(#b-fur-${symbol})`} stroke={furDark} strokeWidth="1.2" />
      <circle cx="104" cy="36" r="16" fill={`url(#b-fur-${symbol})`} stroke={furDark} strokeWidth="1.2" />
      <circle cx="36" cy="36" r="9" fill={belly} />
      <circle cx="104" cy="36" r="9" fill={belly} />

      {/* Body */}
      <ellipse cx="70" cy="110" rx="34" ry="26" fill={`url(#b-fur-${symbol})`} stroke={furDark} strokeWidth="1.2" />

      {/* Head */}
      <circle cx="70" cy="64" r="34" fill={`url(#b-fur-${symbol})`} stroke={furDark} strokeWidth="1.2" />

      {/* Belly patch */}
      <ellipse cx="70" cy="112" rx="22" ry="18" fill={`url(#b-belly-${symbol})`} />

      {/* Symbol on belly */}
      <g transform="translate(70 112)">
        {symbol === "heart" && (
          <path d="M0 6 C -10 -2, -12 -10, -6 -12 C -2 -13, 0 -10, 0 -8 C 0 -10, 2 -13, 6 -12 C 12 -10, 10 -2, 0 6 Z" fill="#ff4b7d" stroke="#a82451" strokeWidth="0.8" />
        )}
        {symbol === "star" && (
          <path d="M0 -12 L3 -4 L11 -4 L5 1 L7 9 L0 4 L-7 9 L-5 1 L-11 -4 L-3 -4 Z" fill="#ffd54f" stroke="#a8740c" strokeWidth="0.8" />
        )}
        {symbol === "rainbow" && (
          <g>
            <path d="M-11 4 A 11 11 0 0 1 11 4" fill="none" stroke="#ff6b9d" strokeWidth="3" strokeLinecap="round" />
            <path d="M-8 4 A 8 8 0 0 1 8 4" fill="none" stroke="#ffd166" strokeWidth="3" strokeLinecap="round" />
            <path d="M-5 4 A 5 5 0 0 1 5 4" fill="none" stroke="#5fb88a" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}
        {symbol === "sun" && (
          <g>
            <circle cx="0" cy="-1" r="6" fill="#ffd54f" stroke="#a8740c" strokeWidth="0.8" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <line key={a} x1="0" y1="-9" x2="0" y2="-12" stroke="#ffb84d" strokeWidth="1.5" strokeLinecap="round" transform={`rotate(${a})`} />
            ))}
          </g>
        )}
      </g>

      {/* Muzzle */}
      <ellipse cx="70" cy="78" rx="14" ry="10" fill="#fff5ec" />

      {/* Nose */}
      <ellipse cx="70" cy="70" rx="3.5" ry="2.5" fill="#3a2030" />

      {/* Mouth */}
      <path d="M64 80 Q 70 86 76 80" stroke="#3a2030" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Eyes */}
      <circle cx="56" cy="62" r="3" fill="#3a2030" />
      <circle cx="84" cy="62" r="3" fill="#3a2030" />
      <circle cx="57" cy="61" r="1" fill="#fff" />
      <circle cx="85" cy="61" r="1" fill="#fff" />

      {/* Cheeks */}
      <circle cx="48" cy="76" r="6" fill={`url(#b-cheek-${symbol})`} />
      <circle cx="92" cy="76" r="6" fill={`url(#b-cheek-${symbol})`} />

      {/* Tiny paws */}
      <ellipse cx="44" cy="124" rx="6" ry="5" fill={belly} stroke={furDark} strokeWidth="0.8" />
      <ellipse cx="96" cy="124" rx="6" ry="5" fill={belly} stroke={furDark} strokeWidth="0.8" />
    </svg>
  );
}

const bears = {
  pink: { fur: "#ffb3cf", furDark: "#d97aa0", belly: "#ffe4ee", cheek: "#ff6699", symbol: "heart" as const },
  lilac: { fur: "#caa9ee", furDark: "#9a78c4", belly: "#ede1ff", cheek: "#b884e6", symbol: "star" as const },
  mint: { fur: "#a8e0c3", furDark: "#6db595", belly: "#e3f5ec", cheek: "#76ccaa", symbol: "rainbow" as const },
  yellow: { fur: "#ffe28a", furDark: "#d6a847", belly: "#fff6cf", cheek: "#ffc857", symbol: "sun" as const },
};

/* ─────────────────────────────────────────────────────────────────────
 * BUNNIES
 * ────────────────────────────────────────────────────────────────────── */

type BunnyProps = {
  fur: string;
  furDark: string;
  inner: string;
  bow?: string;
  className?: string;
  variant: "white" | "cream" | "lilac";
};

function Bunny({ fur, furDark, inner, bow, variant, className = "" }: BunnyProps) {
  return (
    <svg viewBox="0 0 140 140" className={className} aria-hidden>
      <defs>
        <radialGradient id={`bn-fur-${variant}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor={fur} />
          <stop offset="100%" stopColor={furDark} />
        </radialGradient>
      </defs>

      {/* Long ears */}
      <g>
        <ellipse cx="48" cy="32" rx="10" ry="26" fill={`url(#bn-fur-${variant})`} stroke={furDark} strokeWidth="1" transform="rotate(-8 48 32)" />
        <ellipse cx="48" cy="32" rx="5" ry="20" fill={inner} transform="rotate(-8 48 32)" />
        <ellipse cx="92" cy="32" rx="10" ry="26" fill={`url(#bn-fur-${variant})`} stroke={furDark} strokeWidth="1" transform="rotate(8 92 32)" />
        <ellipse cx="92" cy="32" rx="5" ry="20" fill={inner} transform="rotate(8 92 32)" />
      </g>

      {/* Head */}
      <circle cx="70" cy="80" r="34" fill={`url(#bn-fur-${variant})`} stroke={furDark} strokeWidth="1.2" />

      {/* Bow (optional) */}
      {bow && (
        <g transform="translate(96 56) rotate(20)">
          <path d="M-12 0 L0 6 L12 0 L8 -6 L-8 -6 Z" fill={bow} stroke="#a44168" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="3" fill={bow} stroke="#a44168" strokeWidth="0.8" />
        </g>
      )}

      {/* Cheeks */}
      <circle cx="48" cy="92" r="7" fill={inner} opacity="0.85" />
      <circle cx="92" cy="92" r="7" fill={inner} opacity="0.85" />

      {/* Eyes (closed-happy lines) */}
      <path d="M52 78 Q 56 82 60 78" stroke="#3a2030" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M80 78 Q 84 82 88 78" stroke="#3a2030" strokeWidth="2.2" fill="none" strokeLinecap="round" />

      {/* Nose (Y shape) */}
      <path d="M70 86 L70 90 M70 90 L66 94 M70 90 L74 94" stroke="#d36994" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <ellipse cx="70" cy="86" rx="3.5" ry="2.5" fill="#ec88a3" />

      {/* Whiskers */}
      <path d="M58 92 L46 90 M58 96 L46 98" stroke="#a06078" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M82 92 L94 90 M82 96 L94 98" stroke="#a06078" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

const bunnies = {
  white: { fur: "#fff", furDark: "#e8c4d2", inner: "#ffb3cf", variant: "white" as const },
  cream: { fur: "#fff1d4", furDark: "#dbb887", inner: "#ffc7a3", bow: "#ff7eb1", variant: "cream" as const },
  lilac: { fur: "#f1e5ff", furDark: "#b89bd6", inner: "#d8b3ff", bow: "#ffb3cf", variant: "lilac" as const },
};

/* ─────────────────────────────────────────────────────────────────────
 * KAWAII FLOWERS — with little faces
 * ────────────────────────────────────────────────────────────────────── */

function KawaiiDaisy({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 140" className={className} aria-hidden>
      <defs>
        <radialGradient id="kd-petal" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="55%" stopColor="#ffeaf2" />
          <stop offset="100%" stopColor="#ffc3d6" />
        </radialGradient>
        <radialGradient id="kd-core" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fff6c4" />
          <stop offset="55%" stopColor="#ffc83d" />
          <stop offset="100%" stopColor="#e07c00" />
        </radialGradient>
      </defs>
      <g transform="translate(70 70)">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <ellipse cx="0" cy="-34" rx="12" ry="26" fill="url(#kd-petal)" stroke="#f4a8c0" strokeWidth="1.2" />
          </g>
        ))}
      </g>
      <circle cx="70" cy="70" r="20" fill="url(#kd-core)" stroke="#c89525" strokeWidth="1" />
      {/* Face */}
      <ellipse cx="63" cy="67" rx="2.5" ry="3.2" fill="#3a2030" />
      <ellipse cx="77" cy="67" rx="2.5" ry="3.2" fill="#3a2030" />
      <ellipse cx="63" cy="65.5" rx="0.9" ry="1.2" fill="#fff" />
      <ellipse cx="77" cy="65.5" rx="0.9" ry="1.2" fill="#fff" />
      <path d="M64 76 Q 70 81 76 76" stroke="#3a2030" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="56" cy="73" r="2.8" fill="#ff8fb8" opacity="0.7" />
      <circle cx="84" cy="73" r="2.8" fill="#ff8fb8" opacity="0.7" />
    </svg>
  );
}

function KawaiiTulip({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 140" className={className} aria-hidden>
      <defs>
        <linearGradient id="kt-petal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffb3cf" />
          <stop offset="60%" stopColor="#ff6699" />
          <stop offset="100%" stopColor="#c4356b" />
        </linearGradient>
        <linearGradient id="kt-leaf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9adaaa" />
          <stop offset="100%" stopColor="#3e8a5e" />
        </linearGradient>
      </defs>
      {/* Stem */}
      <rect x="66" y="80" width="8" height="48" fill="url(#kt-leaf)" rx="3" />
      {/* Leaf */}
      <path d="M70 100 C 44 96, 32 116, 36 130 C 56 124, 68 112, 72 102 Z" fill="url(#kt-leaf)" stroke="#2e6b48" strokeWidth="0.8" />
      {/* Bloom */}
      <path d="M30 60 C 30 36, 54 22, 70 38 C 86 22, 110 36, 110 60 C 110 80, 90 86, 70 86 C 50 86, 30 80, 30 60 Z" fill="url(#kt-petal)" stroke="#9c2455" strokeWidth="1.2" />
      {/* Face on the bloom */}
      <ellipse cx="60" cy="56" rx="3" ry="3.5" fill="#3a2030" />
      <ellipse cx="80" cy="56" rx="3" ry="3.5" fill="#3a2030" />
      <ellipse cx="60" cy="54" rx="1" ry="1.3" fill="#fff" />
      <ellipse cx="80" cy="54" rx="1" ry="1.3" fill="#fff" />
      <path d="M64 66 Q 70 72 76 66" stroke="#3a2030" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <ellipse cx="50" cy="64" rx="4" ry="3" fill="#ffd1dd" opacity="0.7" />
      <ellipse cx="90" cy="64" rx="4" ry="3" fill="#ffd1dd" opacity="0.7" />
    </svg>
  );
}

function KawaiiCherry({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 140" className={className} aria-hidden>
      <defs>
        <radialGradient id="kc-petal" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="40%" stopColor="#ffd1de" />
          <stop offset="100%" stopColor="#ec7da3" />
        </radialGradient>
        <radialGradient id="kc-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff4a3" />
          <stop offset="100%" stopColor="#f7c842" />
        </radialGradient>
      </defs>
      <g transform="translate(70 70)">
        {[0, 72, 144, 216, 288].map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <path d="M0 -44 C 18 -44, 22 -26, 16 -10 C 8 -2, -8 -2, -16 -10 C -22 -26, -18 -44, 0 -44 Z" fill="url(#kc-petal)" stroke="#d96a93" strokeWidth="1" />
            <path d="M0 -44 L0 -32" stroke="#c4456e" strokeWidth="1.4" opacity="0.55" />
          </g>
        ))}
      </g>
      <circle cx="70" cy="70" r="14" fill="url(#kc-core)" stroke="#c89525" strokeWidth="1" />
      {/* Face */}
      <ellipse cx="65" cy="68" rx="2.2" ry="2.8" fill="#3a2030" />
      <ellipse cx="75" cy="68" rx="2.2" ry="2.8" fill="#3a2030" />
      <ellipse cx="65" cy="66.5" rx="0.8" ry="1" fill="#fff" />
      <ellipse cx="75" cy="66.5" rx="0.8" ry="1" fill="#fff" />
      <path d="M66 75 Q 70 78 74 75" stroke="#3a2030" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function KawaiiCloud({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 140" className={className} aria-hidden>
      <defs>
        <radialGradient id="kcl-grad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="#ffe4ee" />
        </radialGradient>
      </defs>
      <path d="M30 86 C 18 86, 14 70, 28 64 C 26 50, 44 44, 54 52 C 60 38, 84 38, 90 52 C 104 46, 120 60, 112 76 C 122 84, 112 96, 100 92 C 92 100, 70 100, 64 92 C 54 100, 36 98, 30 86 Z" fill="url(#kcl-grad)" stroke="#e8b6c6" strokeWidth="1.5" />
      <ellipse cx="58" cy="74" rx="3" ry="3.6" fill="#3a2030" />
      <ellipse cx="84" cy="74" rx="3" ry="3.6" fill="#3a2030" />
      <ellipse cx="58" cy="72" rx="1" ry="1.3" fill="#fff" />
      <ellipse cx="84" cy="72" rx="1" ry="1.3" fill="#fff" />
      <path d="M62 84 Q 71 90 80 84" stroke="#3a2030" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="48" cy="82" r="4" fill="#ffb3cf" opacity="0.7" />
      <circle cx="94" cy="82" r="4" fill="#ffb3cf" opacity="0.7" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 * Decoration meta
 * ────────────────────────────────────────────────────────────────────── */

type Decoration = {
  kind: string;
  style: React.CSSProperties;
  size: string;
  delay: number;
  anim?: "float" | "sway" | "spin" | "drift";
  /** 'side' = só em telas largas (>=1400px), 'edge' = sempre */
  zone: "side" | "edge";
};

// SIDE: aparecem só em telas largas (>=1400px) onde sobra espaço além da sidebar+conteúdo.
const LEFT_SIDE: Decoration[] = [
  { zone: "side", kind: "bear-pink",   style: { top: "5%",  left: "0.5%" }, size: "92px", delay: 0.0, anim: "float" },
  { zone: "side", kind: "kawaii-daisy",style: { top: "16%", left: "1.5%" }, size: "80px", delay: 0.5, anim: "sway" },
  { zone: "side", kind: "bunny-white", style: { top: "28%", left: "0.5%" }, size: "84px", delay: 1.0, anim: "float" },
  { zone: "side", kind: "bear-mint",   style: { top: "42%", left: "1%"   }, size: "88px", delay: 0.3, anim: "float" },
  { zone: "side", kind: "kawaii-tulip",style: { top: "55%", left: "1.5%" }, size: "82px", delay: 1.1, anim: "sway" },
  { zone: "side", kind: "bunny-cream", style: { top: "68%", left: "0.5%" }, size: "84px", delay: 0.7, anim: "float" },
  { zone: "side", kind: "kawaii-cloud",style: { top: "80%", left: "1.5%" }, size: "76px", delay: 1.4, anim: "drift" },
  { zone: "side", kind: "bear-yellow", style: { top: "92%", left: "0.5%" }, size: "82px", delay: 0.6, anim: "float" },
];

const RIGHT_SIDE: Decoration[] = [
  { zone: "side", kind: "kawaii-cherry",style: { top: "5%",  right: "0.5%" }, size: "82px", delay: 0.2, anim: "float" },
  { zone: "side", kind: "bear-lilac",   style: { top: "17%", right: "1%"   }, size: "90px", delay: 0.7, anim: "float" },
  { zone: "side", kind: "bunny-lilac",  style: { top: "30%", right: "1.5%" }, size: "86px", delay: 1.5, anim: "float" },
  { zone: "side", kind: "kawaii-daisy", style: { top: "43%", right: "0.5%" }, size: "78px", delay: 0.4, anim: "sway" },
  { zone: "side", kind: "bear-pink",    style: { top: "56%", right: "1%"   }, size: "88px", delay: 0.9, anim: "float" },
  { zone: "side", kind: "kawaii-tulip", style: { top: "69%", right: "1.5%" }, size: "80px", delay: 1.4, anim: "sway" },
  { zone: "side", kind: "bunny-white",  style: { top: "82%", right: "0.5%" }, size: "84px", delay: 1.7, anim: "float" },
  { zone: "side", kind: "kawaii-cherry",style: { top: "94%", right: "1%"   }, size: "78px", delay: 0.4, anim: "float" },
];

// EDGE: aparecem sempre — só nos cantos superior/inferior (fora do fluxo de leitura).
const EDGES: Decoration[] = [
  { zone: "edge", kind: "✨",     style: { top: "1%",  left: "30%" }, size: "1.3rem", delay: 0.6, anim: "spin" },
  { zone: "edge", kind: "💕",     style: { top: "0.8%",left: "62%" }, size: "1.4rem", delay: 1.1, anim: "float" },
  { zone: "edge", kind: "⭐",     style: { top: "1.2%",left: "78%" }, size: "1.2rem", delay: 1.6, anim: "spin" },
  { zone: "edge", kind: "🌸",     style: { bottom: "1%", left: "22%" }, size: "1.5rem", delay: 0.4, anim: "float" },
  { zone: "edge", kind: "🦋",     style: { bottom: "1.5%", left: "50%" }, size: "1.6rem", delay: 0.9, anim: "drift" },
  { zone: "edge", kind: "✨",     style: { bottom: "1%", left: "72%" }, size: "1.2rem", delay: 1.4, anim: "spin" },
];

const ALL_DECORATIONS = [...LEFT_SIDE, ...RIGHT_SIDE, ...EDGES];

/* ─────────────────────────────────────────────────────────────────────
 * Component
 * ────────────────────────────────────────────────────────────────────── */

export function FloralBackdrop() {
  return (
    <div
      aria-hidden
      className="floral-backdrop pointer-events-none fixed inset-0 overflow-hidden select-none"
      style={{ zIndex: 5 }}
    >
      <span className="floral-blob" style={{ top: "-180px", left: "-180px", background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 40%, transparent), transparent 70%)" }} />
      <span className="floral-blob" style={{ bottom: "-200px", right: "-200px", background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 45%, transparent), transparent 70%)" }} />
      <span className="floral-blob" style={{ top: "40%", right: "-260px", background: "radial-gradient(circle, color-mix(in srgb, var(--peach) 60%, transparent), transparent 70%)", width: "440px", height: "440px" }} />
      <span className="floral-blob" style={{ top: "55%", left: "-220px", background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 35%, transparent), transparent 70%)", width: "380px", height: "380px" }} />

      {ALL_DECORATIONS.map((deco, idx) => (
        <span
          key={idx}
          className={`floral-bloom floral-${deco.zone} anim-${deco.anim ?? "float"}`}
          style={{
            ...deco.style,
            fontSize: deco.size,
            width: isSvgKind(deco.kind) ? deco.size : undefined,
            height: isSvgKind(deco.kind) ? deco.size : undefined,
            animationDelay: `${deco.delay}s`,
          }}
        >
          <span className="floral-bloom-inner">{renderKind(deco.kind)}</span>
        </span>
      ))}
    </div>
  );
}

function isSvgKind(k: string) {
  return (
    k.startsWith("bear-") ||
    k.startsWith("bunny-") ||
    k.startsWith("kawaii-")
  );
}

function renderKind(k: string) {
  if (k === "bear-pink") return <CareBear {...bears.pink} className="w-full h-full" />;
  if (k === "bear-lilac") return <CareBear {...bears.lilac} className="w-full h-full" />;
  if (k === "bear-mint") return <CareBear {...bears.mint} className="w-full h-full" />;
  if (k === "bear-yellow") return <CareBear {...bears.yellow} className="w-full h-full" />;
  if (k === "bunny-white") return <Bunny {...bunnies.white} className="w-full h-full" />;
  if (k === "bunny-cream") return <Bunny {...bunnies.cream} className="w-full h-full" />;
  if (k === "bunny-lilac") return <Bunny {...bunnies.lilac} className="w-full h-full" />;
  if (k === "kawaii-daisy") return <KawaiiDaisy className="w-full h-full" />;
  if (k === "kawaii-tulip") return <KawaiiTulip className="w-full h-full" />;
  if (k === "kawaii-cherry") return <KawaiiCherry className="w-full h-full" />;
  if (k === "kawaii-cloud") return <KawaiiCloud className="w-full h-full" />;
  return <span>{k}</span>;
}
