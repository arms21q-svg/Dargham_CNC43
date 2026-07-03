import { ImageResponse } from "next/og";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

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
          background: "linear-gradient(135deg, #0a1628 0%, #1e4d8c 100%)",
          borderRadius: 32,
        }}
      >
        <div
          style={{
            fontSize: 96,
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
