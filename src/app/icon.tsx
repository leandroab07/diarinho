import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Icon() {
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
            "linear-gradient(135deg, #ffd4e0 0%, #ffb3cf 35%, #ec88a3 70%, #c9a8e0 100%)",
          position: "relative",
        }}
      >
        {/* Soft outer glow */}
        <div
          style={{
            position: "absolute",
            width: 380,
            height: 380,
            borderRadius: 9999,
            background: "rgba(255, 255, 255, 0.18)",
            filter: "blur(20px)",
          }}
        />
        {/* Petals + core flower */}
        <svg
          width="380"
          height="380"
          viewBox="0 0 100 100"
          style={{ filter: "drop-shadow(0 8px 16px rgba(150, 50, 100, 0.3))" }}
        >
          <defs>
            <radialGradient id="p" cx="50%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#ffeaf2" />
              <stop offset="100%" stopColor="#ffc3d6" />
            </radialGradient>
            <radialGradient id="c" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#fff6c4" />
              <stop offset="60%" stopColor="#ffc83d" />
              <stop offset="100%" stopColor="#e07c00" />
            </radialGradient>
          </defs>
          <g transform="translate(50 50)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <ellipse
                key={a}
                cx="0"
                cy="-28"
                rx="11"
                ry="22"
                fill="url(#p)"
                stroke="#f4a8c0"
                strokeWidth="1.2"
                transform={`rotate(${a})`}
              />
            ))}
          </g>
          <circle cx="50" cy="50" r="15" fill="url(#c)" />
          {/* face */}
          <ellipse cx="45" cy="48" rx="2" ry="2.6" fill="#3a2030" />
          <ellipse cx="55" cy="48" rx="2" ry="2.6" fill="#3a2030" />
          <ellipse cx="45.5" cy="47" rx="0.7" ry="0.9" fill="#fff" />
          <ellipse cx="55.5" cy="47" rx="0.7" ry="0.9" fill="#fff" />
          <path
            d="M46 55 Q 50 58 54 55"
            stroke="#3a2030"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
          {/* cheeks */}
          <circle cx="40" cy="53" r="2.4" fill="#ff8fb8" opacity="0.7" />
          <circle cx="60" cy="53" r="2.4" fill="#ff8fb8" opacity="0.7" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
