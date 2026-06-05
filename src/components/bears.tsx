/* Ursinhos de pelúcia — desenhados sentadinhos com tons naturais.
 * Versão realista: corpo + pernas + braços visíveis, costura central,
 * sombreamento de volume e textura sutil. */

export type BearKind = "honey" | "cream" | "rose" | "lavender" | "sage" | "skyblue";

const PALETTES: Record<
  BearKind,
  {
    fur: string;       // tom claro principal
    furDark: string;   // sombra
    furEdge: string;   // contorno
    belly: string;     // barriga clara
    muzzle: string;    // focinho
    pad: string;       // patinhas
    symbol: "heart" | "star" | "rainbow" | "sun" | "moon" | "flower";
    symbolColor: string;
  }
> = {
  honey: {
    fur: "#d4a87a", furDark: "#a47a4a", furEdge: "#7a5a30",
    belly: "#f2e0c2", muzzle: "#fff3df", pad: "#8a6840",
    symbol: "heart", symbolColor: "#c8425e",
  },
  cream: {
    fur: "#ead9b8", furDark: "#b89870", furEdge: "#876a48",
    belly: "#fdf5e3", muzzle: "#fff8e8", pad: "#a48560",
    symbol: "star", symbolColor: "#e0a040",
  },
  rose: {
    fur: "#e8b4bf", furDark: "#b07685", furEdge: "#7e5360",
    belly: "#fcdee5", muzzle: "#fff0ee", pad: "#945866",
    symbol: "flower", symbolColor: "#c45478",
  },
  lavender: {
    fur: "#c4b4d8", furDark: "#9282b0", furEdge: "#6a5a85",
    belly: "#e6dcef", muzzle: "#f8f2ff", pad: "#7c6a98",
    symbol: "moon", symbolColor: "#b8a040",
  },
  sage: {
    fur: "#b8cdb0", furDark: "#85a07c", furEdge: "#5e7858",
    belly: "#dde9d8", muzzle: "#f4f8ed", pad: "#6e8666",
    symbol: "rainbow", symbolColor: "#5fa07c",
  },
  skyblue: {
    fur: "#b4c8d8", furDark: "#7c98b4", furEdge: "#506e88",
    belly: "#d8e4ef", muzzle: "#f0f6fa", pad: "#5e7c98",
    symbol: "sun", symbolColor: "#e0a040",
  },
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
    <svg viewBox="0 0 140 160" className={className} aria-hidden>
      <defs>
        <radialGradient id={`fur-${id}`} cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor={p.fur} />
          <stop offset="60%" stopColor={p.fur} />
          <stop offset="100%" stopColor={p.furDark} />
        </radialGradient>
        <radialGradient id={`fur-shade-${id}`} cx="60%" cy="65%" r="50%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="100%" stopColor={p.furEdge} stopOpacity="0.35" />
        </radialGradient>
        <radialGradient id={`belly-${id}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor={p.belly} />
        </radialGradient>
        <radialGradient id={`muzzle-${id}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor={p.muzzle} />
        </radialGradient>
        <radialGradient id={`pad-${id}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor={p.belly} />
        </radialGradient>
        <radialGradient id={`cheek-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e09080" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#e09080" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* === LEGS (back, separate from body) === */}
      <g>
        <ellipse cx="38" cy="132" rx="20" ry="18" fill={`url(#fur-${id})`} stroke={p.furEdge} strokeWidth="1.2" />
        <ellipse cx="38" cy="132" rx="20" ry="18" fill={`url(#fur-shade-${id})`} />
        {/* foot pad */}
        <ellipse cx="38" cy="138" rx="12" ry="9" fill={`url(#pad-${id})`} stroke={p.furEdge} strokeWidth="0.8" />
        {/* toe dots */}
        <circle cx="32" cy="135" r="1.6" fill={p.pad} />
        <circle cx="38" cy="133" r="1.6" fill={p.pad} />
        <circle cx="44" cy="135" r="1.6" fill={p.pad} />
      </g>
      <g>
        <ellipse cx="102" cy="132" rx="20" ry="18" fill={`url(#fur-${id})`} stroke={p.furEdge} strokeWidth="1.2" />
        <ellipse cx="102" cy="132" rx="20" ry="18" fill={`url(#fur-shade-${id})`} />
        <ellipse cx="102" cy="138" rx="12" ry="9" fill={`url(#pad-${id})`} stroke={p.furEdge} strokeWidth="0.8" />
        <circle cx="96" cy="135" r="1.6" fill={p.pad} />
        <circle cx="102" cy="133" r="1.6" fill={p.pad} />
        <circle cx="108" cy="135" r="1.6" fill={p.pad} />
      </g>

      {/* === ARMS (back) === */}
      <g transform="translate(70 90)">
        <g transform="rotate(-28)">
          <ellipse cx="-32" cy="0" rx="10" ry="20" fill={`url(#fur-${id})`} stroke={p.furEdge} strokeWidth="1.2" />
          <ellipse cx="-32" cy="0" rx="10" ry="20" fill={`url(#fur-shade-${id})`} />
          <ellipse cx="-32" cy="14" rx="7" ry="6" fill={`url(#pad-${id})`} stroke={p.furEdge} strokeWidth="0.7" />
        </g>
      </g>
      <g transform="translate(70 90)">
        <g transform="rotate(28)">
          <ellipse cx="32" cy="0" rx="10" ry="20" fill={`url(#fur-${id})`} stroke={p.furEdge} strokeWidth="1.2" />
          <ellipse cx="32" cy="0" rx="10" ry="20" fill={`url(#fur-shade-${id})`} />
          <ellipse cx="32" cy="14" rx="7" ry="6" fill={`url(#pad-${id})`} stroke={p.furEdge} strokeWidth="0.7" />
        </g>
      </g>

      {/* === BODY === */}
      <ellipse cx="70" cy="95" rx="32" ry="32" fill={`url(#fur-${id})`} stroke={p.furEdge} strokeWidth="1.4" />
      <ellipse cx="70" cy="95" rx="32" ry="32" fill={`url(#fur-shade-${id})`} />
      {/* belly patch */}
      <ellipse cx="70" cy="98" rx="22" ry="24" fill={`url(#belly-${id})`} />
      {/* center stitch */}
      <path d="M70 70 L70 120" stroke={p.furEdge} strokeWidth="0.8" strokeDasharray="2 3" opacity="0.5" />

      {/* === SYMBOL on chest === */}
      <g transform="translate(70 95)">
        {p.symbol === "heart" && (
          <path d="M0 7 C -9 -1, -11 -9, -5 -11 C -1 -12, 0 -9, 0 -7 C 0 -9, 1 -12, 5 -11 C 11 -9, 9 -1, 0 7 Z" fill={p.symbolColor} opacity="0.9" />
        )}
        {p.symbol === "star" && (
          <path d="M0 -10 L3 -3 L10 -3 L4 1 L6 8 L0 4 L-6 8 L-4 1 L-10 -3 L-3 -3 Z" fill={p.symbolColor} opacity="0.9" />
        )}
        {p.symbol === "flower" && (
          <g>
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx="0" cy="-6" rx="3" ry="5" fill={p.symbolColor} transform={`rotate(${a})`} opacity="0.85" />
            ))}
            <circle r="2.5" fill="#ffe28a" />
          </g>
        )}
        {p.symbol === "moon" && (
          <path d="M-3 -7 A 7 7 0 1 0 5 5 A 5 5 0 1 1 -3 -7 Z" fill={p.symbolColor} opacity="0.9" />
        )}
        {p.symbol === "rainbow" && (
          <g opacity="0.9">
            <path d="M-9 3 A 9 9 0 0 1 9 3" fill="none" stroke="#c45478" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M-6 3 A 6 6 0 0 1 6 3" fill="none" stroke="#e0a040" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M-3 3 A 3 3 0 0 1 3 3" fill="none" stroke={p.symbolColor} strokeWidth="2.2" strokeLinecap="round" />
          </g>
        )}
        {p.symbol === "sun" && (
          <g opacity="0.9">
            <circle cx="0" cy="0" r="5" fill={p.symbolColor} />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <line key={a} x1="0" y1="-7" x2="0" y2="-10" stroke={p.symbolColor} strokeWidth="1.6" strokeLinecap="round" transform={`rotate(${a})`} />
            ))}
          </g>
        )}
      </g>

      {/* === HEAD === */}
      <circle cx="70" cy="50" r="36" fill={`url(#fur-${id})`} stroke={p.furEdge} strokeWidth="1.4" />
      <circle cx="70" cy="50" r="36" fill={`url(#fur-shade-${id})`} />

      {/* === EARS === */}
      <g>
        <circle cx="34" cy="22" r="14" fill={`url(#fur-${id})`} stroke={p.furEdge} strokeWidth="1.2" />
        <circle cx="34" cy="22" r="14" fill={`url(#fur-shade-${id})`} />
        <circle cx="34" cy="22" r="8" fill={`url(#pad-${id})`} stroke={p.furEdge} strokeWidth="0.6" />
      </g>
      <g>
        <circle cx="106" cy="22" r="14" fill={`url(#fur-${id})`} stroke={p.furEdge} strokeWidth="1.2" />
        <circle cx="106" cy="22" r="14" fill={`url(#fur-shade-${id})`} />
        <circle cx="106" cy="22" r="8" fill={`url(#pad-${id})`} stroke={p.furEdge} strokeWidth="0.6" />
      </g>

      {/* === MUZZLE === */}
      <ellipse cx="70" cy="62" rx="16" ry="12" fill={`url(#muzzle-${id})`} stroke={p.furEdge} strokeWidth="0.8" />

      {/* === NOSE === */}
      <ellipse cx="70" cy="55" rx="4.5" ry="3.5" fill="#3a2c25" />
      <ellipse cx="68.5" cy="53.5" rx="1.6" ry="1.1" fill="#fff" opacity="0.7" />

      {/* === MOUTH === */}
      <path d="M70 60 L70 65" stroke="#3a2c25" strokeWidth="1.2" />
      <path d="M62 67 Q 70 73 78 67" stroke="#3a2c25" strokeWidth="1.6" fill="none" strokeLinecap="round" />

      {/* === EYES === */}
      <circle cx="54" cy="46" r="3.6" fill="#3a2c25" />
      <circle cx="86" cy="46" r="3.6" fill="#3a2c25" />
      <circle cx="55.2" cy="44.8" r="1.3" fill="#fff" />
      <circle cx="87.2" cy="44.8" r="1.3" fill="#fff" />
      <circle cx="54" cy="48" r="0.5" fill="#fff" opacity="0.6" />
      <circle cx="86" cy="48" r="0.5" fill="#fff" opacity="0.6" />

      {/* === CHEEKS === */}
      <ellipse cx="44" cy="60" rx="6" ry="4" fill={`url(#cheek-${id})`} />
      <ellipse cx="96" cy="60" rx="6" ry="4" fill={`url(#cheek-${id})`} />

      {/* === FUR TEXTURE — tiny dots for plush look === */}
      <g fill={p.furEdge} opacity="0.25">
        <circle cx="50" cy="35" r="0.6" />
        <circle cx="90" cy="35" r="0.6" />
        <circle cx="58" cy="40" r="0.5" />
        <circle cx="82" cy="40" r="0.5" />
        <circle cx="55" cy="85" r="0.5" />
        <circle cx="85" cy="85" r="0.5" />
        <circle cx="50" cy="105" r="0.5" />
        <circle cx="90" cy="105" r="0.5" />
      </g>
    </svg>
  );
}

export const BEAR_KINDS: BearKind[] = [
  "honey",
  "cream",
  "rose",
  "lavender",
  "sage",
  "skyblue",
];

export const BEAR_LABELS: Record<BearKind, string> = {
  honey: "Mel 🍯",
  cream: "Baunilha 🍰",
  rose: "Rosê 🌸",
  lavender: "Lavanda 💜",
  sage: "Sálvia 🌿",
  skyblue: "Céu ☁️",
};

/** Massa relativa pra física (em "gramas" de pelúcia).
 * Cada cor tem peso ligeiramente diferente — adiciona variedade ao jogo. */
export const BEAR_WEIGHT: Record<BearKind, number> = {
  honey: 95,
  cream: 70,
  rose: 80,
  lavender: 75,
  sage: 110,    // o mais pesado
  skyblue: 60,  // o mais leve
};
