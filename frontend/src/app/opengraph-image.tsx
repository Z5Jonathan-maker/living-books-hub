import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Living Books Hub — Discover the World's Best Living Books";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFFBF0",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #d4c5a9 1px, transparent 0)",
          backgroundSize: "50px 50px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 80px",
            backgroundColor: "rgba(255, 251, 240, 0.95)",
            borderRadius: "24px",
            border: "2px solid rgba(107, 143, 113, 0.3)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                backgroundColor: "#2D5F2D",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
              }}
            >
              📖
            </div>
            <span
              style={{
                fontSize: "36px",
                fontWeight: 700,
                color: "#1A1A2E",
                fontFamily: "Georgia, serif",
              }}
            >
              Living Books Hub
            </span>
          </div>
          <p
            style={{
              fontSize: "52px",
              fontWeight: 700,
              color: "#2D5F2D",
              textAlign: "center",
              lineHeight: 1.2,
              margin: 0,
              fontFamily: "Georgia, serif",
            }}
          >
            Discover the Books That
            <br />
            Bring Learning Alive
          </p>
          <p
            style={{
              fontSize: "22px",
              color: "#6B6B6B",
              textAlign: "center",
              marginTop: "20px",
              maxWidth: "700px",
            }}
          >
            99+ curated living books for homeschool families.
            Searchable by age, subject, and reading level.
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
}
