import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #ffd4e0 0%, #ffb3cf 35%, #ec88a3 65%, #c9a8e0 100%)",
        }}
      >
        <svg
          width="146"
          height="146"
          viewBox="0 0 140 140"
          style={{ filter: "drop-shadow(0 5px 8px rgba(150, 50, 100, 0.35))" }}
        >
          <defs>
            <radialGradient id="fur" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ffd1de" />
              <stop offset="100%" stopColor="#d97aa0" />
            </radialGradient>
            <radialGradient id="belly" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#ffe4ee" />
            </radialGradient>
            <radialGradient id="cheek" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff6699" />
              <stop offset="100%" stopColor="#ff6699" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="36" cy="36" r="16" fill="url(#fur)" stroke="#a85274" strokeWidth="1.4" />
          <circle cx="104" cy="36" r="16" fill="url(#fur)" stroke="#a85274" strokeWidth="1.4" />
          <circle cx="36" cy="36" r="9" fill="#ffe4ee" />
          <circle cx="104" cy="36" r="9" fill="#ffe4ee" />
          <ellipse cx="70" cy="112" rx="36" ry="28" fill="url(#fur)" stroke="#a85274" strokeWidth="1.4" />
          <circle cx="70" cy="64" r="36" fill="url(#fur)" stroke="#a85274" strokeWidth="1.4" />
          <ellipse cx="70" cy="112" rx="24" ry="20" fill="url(#belly)" />
          <path
            d="M70 122 C 56 112, 54 100, 62 96 C 66 94, 70 98, 70 102 C 70 98, 74 94, 78 96 C 86 100, 84 112, 70 122 Z"
            fill="#ff4b7d"
            stroke="#a82451"
            strokeWidth="1.2"
          />
          <ellipse cx="70" cy="78" rx="15" ry="11" fill="#fff5ec" />
          <ellipse cx="70" cy="70" rx="4" ry="2.8" fill="#3a2030" />
          <path
            d="M64 81 Q 70 87 76 81"
            stroke="#3a2030"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="55" cy="60" r="3.5" fill="#3a2030" />
          <circle cx="85" cy="60" r="3.5" fill="#3a2030" />
          <circle cx="56.5" cy="58.5" r="1.2" fill="#fff" />
          <circle cx="86.5" cy="58.5" r="1.2" fill="#fff" />
          <circle cx="46" cy="76" r="7" fill="url(#cheek)" />
          <circle cx="94" cy="76" r="7" fill="url(#cheek)" />
          <ellipse cx="42" cy="128" rx="7" ry="6" fill="#ffe4ee" stroke="#a85274" strokeWidth="1" />
          <ellipse cx="98" cy="128" rx="7" ry="6" fill="#ffe4ee" stroke="#a85274" strokeWidth="1" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
