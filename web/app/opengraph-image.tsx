import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#09090b",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* subtle grid lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* logo mark */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
          <span style={{ color: "#09090b", fontSize: 36, fontWeight: 700, lineHeight: 1 }}>
            Ș
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span style={{ color: "#ffffff", fontSize: 64, fontWeight: 700, lineHeight: 1, letterSpacing: "-2px" }}>
            Școlaritate
          </span>
          <span style={{ color: "#71717a", fontSize: 28, fontWeight: 400, lineHeight: 1.3 }}>
            Note · Orar · Profil — fără VPN, de pe orice dispozitiv
          </span>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 72,
            right: 80,
            color: "#3f3f46",
            fontSize: 18,
            fontWeight: 500,
          }}
        >
          Universitatea Ștefan cel Mare Suceava
        </div>
      </div>
    ),
    { ...size }
  );
}
