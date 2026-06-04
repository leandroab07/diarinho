/**
 * Floral decorations for the pink theme.
 *
 * Non-interactive: rendered as <span> with no cursor pointer, no click handlers.
 * They only animate on hover — like little garden creatures you can wake up.
 */

/* ─── SVG flowers (richer gradients, layered detail) ──────────────────── */

function Daisy({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <defs>
        <radialGradient id="d-petal" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#ffeaf2" />
          <stop offset="100%" stopColor="#ffc3d6" />
        </radialGradient>
        <radialGradient id="d-petal-shade" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="100%" stopColor="#e89bb4" stopOpacity="0.4" />
        </radialGradient>
        <radialGradient id="d-core" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fff6c4" />
          <stop offset="55%" stopColor="#ffc83d" />
          <stop offset="100%" stopColor="#e07c00" />
        </radialGradient>
      </defs>
      <g transform="translate(60 60)">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <ellipse
              cx="0"
              cy="-30"
              rx="10"
              ry="24"
              fill="url(#d-petal)"
              stroke="#f4a8c0"
              strokeWidth="1.2"
            />
            <ellipse
              cx="0"
              cy="-30"
              rx="10"
              ry="24"
              fill="url(#d-petal-shade)"
            />
          </g>
        ))}
      </g>
      <circle cx="60" cy="60" r="14" fill="url(#d-core)" />
      <circle cx="56" cy="56" r="3.5" fill="#fff6c4" opacity="0.8" />
      <circle cx="62" cy="62" r="1.2" fill="#a85a00" opacity="0.5" />
    </svg>
  );
}

function Tulip({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <defs>
        <linearGradient id="t-petal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffb3cf" />
          <stop offset="60%" stopColor="#ff6699" />
          <stop offset="100%" stopColor="#c4356b" />
        </linearGradient>
        <linearGradient id="t-petal-light" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd9e7" />
          <stop offset="100%" stopColor="#ff7faa" />
        </linearGradient>
        <linearGradient id="t-leaf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9adaaa" />
          <stop offset="100%" stopColor="#3e8a5e" />
        </linearGradient>
        <linearGradient id="t-stem" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6cb887" />
          <stop offset="100%" stopColor="#3e7857" />
        </linearGradient>
      </defs>
      {/* back petals */}
      <path
        d="M30 50 C 30 30, 50 18, 60 30 C 70 18, 90 30, 90 50 C 90 65, 75 70, 60 70 C 45 70, 30 65, 30 50 Z"
        fill="url(#t-petal)"
      />
      {/* front petal highlight */}
      <path
        d="M44 50 C 44 32, 60 22, 60 32 C 60 22, 76 32, 76 50 C 76 60, 68 64, 60 64 C 52 64, 44 60, 44 50 Z"
        fill="url(#t-petal-light)"
      />
      {/* highlight stripe */}
      <path
        d="M60 30 Q 58 45, 60 60"
        stroke="#fff"
        strokeWidth="2"
        fill="none"
        opacity="0.45"
        strokeLinecap="round"
      />
      {/* stem */}
      <rect x="57" y="64" width="6" height="44" fill="url(#t-stem)" rx="2" />
      {/* leaf */}
      <path
        d="M60 84 C 38 80, 28 96, 30 108 C 44 104, 56 96, 60 88 Z"
        fill="url(#t-leaf)"
        stroke="#2e6b48"
        strokeWidth="0.8"
      />
      <path
        d="M40 96 C 48 96, 54 92, 58 88"
        stroke="#2e6b48"
        strokeWidth="0.7"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}

function HeartGlow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <defs>
        <radialGradient id="h-grad" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#ffe4ed" />
          <stop offset="35%" stopColor="#ff9cc1" />
          <stop offset="75%" stopColor="#e94d8a" />
          <stop offset="100%" stopColor="#a73362" />
        </radialGradient>
        <radialGradient id="h-shine" cx="35%" cy="32%" r="22%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d="M60 102 C 22 76, 10 52, 26 32 C 38 18, 56 22, 60 38 C 64 22, 82 18, 94 32 C 110 52, 98 76, 60 102 Z"
        fill="url(#h-grad)"
        stroke="#8c2950"
        strokeWidth="1.5"
      />
      <ellipse cx="44" cy="44" rx="12" ry="8" fill="url(#h-shine)" transform="rotate(-30 44 44)" />
      <circle cx="76" cy="56" r="2.5" fill="#ffe4ed" opacity="0.7" />
    </svg>
  );
}

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <defs>
        <radialGradient id="s-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#fff0d4" />
          <stop offset="100%" stopColor="#ffb86b" />
        </radialGradient>
        <radialGradient id="s-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="50" fill="url(#s-glow)" />
      <path
        d="M60 12 L65 50 L102 60 L65 70 L60 108 L55 70 L18 60 L55 50 Z"
        fill="url(#s-grad)"
        stroke="#e89638"
        strokeWidth="0.8"
      />
      <circle cx="60" cy="60" r="8" fill="#fff" opacity="0.9" />
      <circle cx="58" cy="58" r="3" fill="#fff" />
    </svg>
  );
}

function Cherry({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <defs>
        <radialGradient id="c-petal" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#ffd1de" />
          <stop offset="100%" stopColor="#ec7da3" />
        </radialGradient>
        <radialGradient id="c-shade" cx="50%" cy="80%" r="55%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="100%" stopColor="#c4356b" stopOpacity="0.35" />
        </radialGradient>
        <radialGradient id="c-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff4a3" />
          <stop offset="80%" stopColor="#f7c842" />
          <stop offset="100%" stopColor="#c98a14" />
        </radialGradient>
      </defs>
      <g transform="translate(60 60)">
        {[0, 72, 144, 216, 288].map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            {/* petal */}
            <path
              d="M0 -38 C 14 -38, 18 -22, 14 -8 C 8 -2, -8 -2, -14 -8 C -18 -22, -14 -38, 0 -38 Z"
              fill="url(#c-petal)"
              stroke="#d96a93"
              strokeWidth="1"
            />
            <path
              d="M0 -38 C 14 -38, 18 -22, 14 -8 C 8 -2, -8 -2, -14 -8 C -18 -22, -14 -38, 0 -38 Z"
              fill="url(#c-shade)"
            />
            {/* notch */}
            <path
              d="M0 -38 L0 -28"
              stroke="#c4456e"
              strokeWidth="1.2"
              opacity="0.55"
            />
          </g>
        ))}
      </g>
      <circle cx="60" cy="60" r="11" fill="url(#c-core)" />
      <circle cx="56" cy="56" r="2" fill="#fff" opacity="0.85" />
    </svg>
  );
}

function Butterfly({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <defs>
        <linearGradient id="b-wing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffaad8" />
          <stop offset="50%" stopColor="#d68bff" />
          <stop offset="100%" stopColor="#86a8ff" />
        </linearGradient>
        <radialGradient id="b-spot" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* upper wings */}
      <path
        d="M60 60 C 30 18, 8 28, 14 50 C 18 64, 36 66, 60 60 Z"
        fill="url(#b-wing)"
        stroke="#a060c0"
        strokeWidth="1"
      />
      <path
        d="M60 60 C 90 18, 112 28, 106 50 C 102 64, 84 66, 60 60 Z"
        fill="url(#b-wing)"
        stroke="#a060c0"
        strokeWidth="1"
      />
      {/* lower wings */}
      <path
        d="M60 60 C 36 80, 22 96, 36 104 C 50 108, 58 80, 60 60 Z"
        fill="url(#b-wing)"
        stroke="#a060c0"
        strokeWidth="1"
      />
      <path
        d="M60 60 C 84 80, 98 96, 84 104 C 70 108, 62 80, 60 60 Z"
        fill="url(#b-wing)"
        stroke="#a060c0"
        strokeWidth="1"
      />
      {/* wing spots */}
      <circle cx="30" cy="42" r="6" fill="url(#b-spot)" />
      <circle cx="90" cy="42" r="6" fill="url(#b-spot)" />
      <circle cx="44" cy="90" r="4" fill="url(#b-spot)" />
      <circle cx="76" cy="90" r="4" fill="url(#b-spot)" />
      {/* body */}
      <ellipse cx="60" cy="62" rx="3.5" ry="22" fill="#5d3a8a" />
      <circle cx="60" cy="42" r="4" fill="#5d3a8a" />
      {/* antennae */}
      <path
        d="M60 40 C 56 30, 50 26, 46 28"
        stroke="#5d3a8a"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M60 40 C 64 30, 70 26, 74 28"
        stroke="#5d3a8a"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="46" cy="28" r="1.5" fill="#5d3a8a" />
      <circle cx="74" cy="28" r="1.5" fill="#5d3a8a" />
    </svg>
  );
}

function Rose({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <defs>
        <radialGradient id="r-out" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#ffd6e1" />
          <stop offset="50%" stopColor="#ff7a9c" />
          <stop offset="100%" stopColor="#b3204a" />
        </radialGradient>
        <radialGradient id="r-mid" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe4ee" />
          <stop offset="100%" stopColor="#ed567f" />
        </radialGradient>
        <radialGradient id="r-leaf" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#88c69b" />
          <stop offset="100%" stopColor="#356e4f" />
        </radialGradient>
      </defs>
      {/* leaves behind */}
      <path
        d="M30 60 C 14 56, 8 78, 18 86 C 32 84, 40 72, 36 62 Z"
        fill="url(#r-leaf)"
        stroke="#2d5c40"
        strokeWidth="0.8"
      />
      <path
        d="M90 60 C 106 56, 112 78, 102 86 C 88 84, 80 72, 84 62 Z"
        fill="url(#r-leaf)"
        stroke="#2d5c40"
        strokeWidth="0.8"
      />
      {/* outer bloom */}
      <circle cx="60" cy="60" r="36" fill="url(#r-out)" />
      {/* spiral petals */}
      <path
        d="M60 32 C 76 38, 84 56, 76 70 C 64 80, 48 76, 42 62 C 40 50, 48 38, 60 32 Z"
        fill="url(#r-mid)"
        opacity="0.95"
      />
      <path
        d="M58 46 C 70 50, 72 64, 64 70 C 54 72, 48 64, 50 56 C 52 50, 56 47, 58 46 Z"
        fill="#ffd6e1"
        opacity="0.85"
      />
      <path
        d="M58 56 C 64 56, 66 64, 60 66 C 56 66, 54 60, 58 56 Z"
        fill="#fff4f7"
      />
      <circle cx="60" cy="60" r="2" fill="#9a1b3f" opacity="0.6" />
    </svg>
  );
}

/* ─── Decoration meta ──────────────────────────────────────────────────── */

type Decoration = {
  kind:
    | "daisy"
    | "tulip"
    | "heart"
    | "sparkle"
    | "cherry"
    | "butterfly"
    | "rose"
    | string;
  style: React.CSSProperties;
  size: string;
  delay: number;
  anim?: "float" | "sway" | "spin" | "drift";
};

// Margins only — never over the central content area.
const LEFT_SIDE: Decoration[] = [
  { kind: "rose",     style: { top: "5%",  left: "1.5%" }, size: "82px", delay: 0.0, anim: "sway" },
  { kind: "🌷",       style: { top: "15%", left: "3%"   }, size: "2.6rem", delay: 0.5, anim: "float" },
  { kind: "daisy",    style: { top: "25%", left: "1%"   }, size: "72px", delay: 1.0, anim: "sway" },
  { kind: "heart",    style: { top: "37%", left: "2.5%" }, size: "62px", delay: 1.5, anim: "float" },
  { kind: "🌿",       style: { top: "47%", left: "0.8%" }, size: "2.2rem", delay: 1.7, anim: "sway" },
  { kind: "butterfly",style: { top: "57%", left: "2%"   }, size: "70px", delay: 0.4, anim: "drift" },
  { kind: "tulip",    style: { top: "70%", left: "1.5%" }, size: "76px", delay: 0.8, anim: "sway" },
  { kind: "sparkle",  style: { top: "82%", left: "3%"   }, size: "44px", delay: 1.2, anim: "spin" },
  { kind: "cherry",   style: { top: "92%", left: "1%"   }, size: "60px", delay: 1.8, anim: "float" },
];

const RIGHT_SIDE: Decoration[] = [
  { kind: "🌸",       style: { top: "7%",  right: "1.5%" }, size: "2.8rem", delay: 0.2, anim: "float" },
  { kind: "daisy",    style: { top: "17%", right: "2%"   }, size: "70px", delay: 0.7, anim: "sway" },
  { kind: "rose",     style: { top: "28%", right: "0.8%" }, size: "78px", delay: 1.2, anim: "sway" },
  { kind: "💐",       style: { top: "40%", right: "2.5%" }, size: "2.4rem", delay: 1.4, anim: "float" },
  { kind: "tulip",    style: { top: "50%", right: "1%"   }, size: "72px", delay: 1.7, anim: "sway" },
  { kind: "butterfly",style: { top: "62%", right: "2.5%" }, size: "66px", delay: 0.3, anim: "drift" },
  { kind: "cherry",   style: { top: "74%", right: "0.5%" }, size: "62px", delay: 0.9, anim: "float" },
  { kind: "🌻",       style: { top: "85%", right: "2%"   }, size: "2.6rem", delay: 1.4, anim: "sway" },
  { kind: "heart",    style: { top: "94%", right: "1%"   }, size: "56px", delay: 1.9, anim: "float" },
];

const EDGES: Decoration[] = [
  { kind: "✨",       style: { top: "3%",  left: "30%" }, size: "1.4rem", delay: 0.6, anim: "spin" },
  { kind: "💕",       style: { top: "2%",  left: "62%" }, size: "1.5rem", delay: 1.1, anim: "float" },
  { kind: "⭐",       style: { top: "4%",  left: "78%" }, size: "1.3rem", delay: 1.6, anim: "spin" },
  { kind: "🌸",       style: { bottom: "2%", left: "22%" }, size: "1.6rem", delay: 0.4, anim: "float" },
  { kind: "🦋",       style: { bottom: "3%", left: "50%" }, size: "1.7rem", delay: 0.9, anim: "drift" },
  { kind: "✨",       style: { bottom: "2%", left: "72%" }, size: "1.3rem", delay: 1.4, anim: "spin" },
];

const ALL_DECORATIONS = [...LEFT_SIDE, ...RIGHT_SIDE, ...EDGES];

/* ─── Component ────────────────────────────────────────────────────────── */

export function FloralBackdrop() {
  return (
    <div
      aria-hidden
      className="floral-backdrop pointer-events-none fixed inset-0 overflow-hidden select-none"
      style={{ zIndex: 5 }}
    >
      {/* Color blobs */}
      <span
        className="floral-blob"
        style={{
          top: "-180px",
          left: "-180px",
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--primary) 40%, transparent), transparent 70%)",
        }}
      />
      <span
        className="floral-blob"
        style={{
          bottom: "-200px",
          right: "-200px",
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 45%, transparent), transparent 70%)",
        }}
      />
      <span
        className="floral-blob"
        style={{
          top: "40%",
          right: "-260px",
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--peach) 60%, transparent), transparent 70%)",
          width: "440px",
          height: "440px",
        }}
      />
      <span
        className="floral-blob"
        style={{
          top: "55%",
          left: "-220px",
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 35%, transparent), transparent 70%)",
          width: "380px",
          height: "380px",
        }}
      />

      {/* Decorations — span (não interativo), só anima no hover */}
      {ALL_DECORATIONS.map((deco, idx) => (
        <span
          key={idx}
          className={`floral-bloom anim-${deco.anim ?? "float"}`}
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
  return [
    "daisy",
    "tulip",
    "heart",
    "sparkle",
    "cherry",
    "butterfly",
    "rose",
  ].includes(k);
}

function renderKind(k: string) {
  if (k === "daisy") return <Daisy className="w-full h-full" />;
  if (k === "tulip") return <Tulip className="w-full h-full" />;
  if (k === "heart") return <HeartGlow className="w-full h-full" />;
  if (k === "sparkle") return <Sparkle className="w-full h-full" />;
  if (k === "cherry") return <Cherry className="w-full h-full" />;
  if (k === "butterfly") return <Butterfly className="w-full h-full" />;
  if (k === "rose") return <Rose className="w-full h-full" />;
  return <span>{k}</span>;
}
