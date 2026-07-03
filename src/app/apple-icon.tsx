import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

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
          background: "linear-gradient(135deg, #0a1628 0%, #1e4d8c 100%)",
        }}
      >
        <div
          style={{
            fontSize: 88,
            fontWeight: 800,
            color: "#c9a227",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          D
        </div>
      </div>
    ),
    { ...size }
  );
}
