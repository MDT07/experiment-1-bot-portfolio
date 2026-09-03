import { ImageResponse } from "next/og";

export const alt = "Emir Semenov — Bot and Agent Systems";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#030506",
          color: "#ecf5f1",
          fontFamily: "Arial, sans-serif",
          padding: "60px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(circle at 73% 48%, rgba(61,229,255,.25), transparent 28%), radial-gradient(circle at 86% 66%, rgba(255,65,55,.18), transparent 20%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 92,
            top: 102,
            width: 330,
            height: 420,
            display: "flex",
            border: "1px solid rgba(113,245,223,.45)",
            borderRadius: "50% 50% 44% 44%",
            boxShadow: "0 0 80px rgba(113,245,223,.14), inset 0 0 60px rgba(113,245,223,.08)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 18, alignItems: "center", fontSize: 22, letterSpacing: "0.12em" }}>
            <span style={{ color: "#71f5df" }}>E/S</span>
            <span>EMIR SEMENOV / BOT + AGENT SYSTEMS</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontWeight: 650, fontSize: 66, lineHeight: 1.02, letterSpacing: "-0.045em" }}>
            <span>SYSTEMS BEFORE</span>
            <span style={{ color: "#71f5df" }}>MODEL CHOICE.</span>
          </div>
          <div style={{ fontSize: 20, letterSpacing: "0.08em", color: "#8b9c98" }}>
            08 ARCHITECTURES · OPTIONAL AI · CONTROLLED DELIVERY
          </div>
        </div>
      </div>
    ),
    size,
  );
}
