"use client";

import { RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b1220",
          color: "#e2e8f0",
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: 460, textAlign: "center" }}>
          <p style={{ fontSize: 48, fontWeight: 700, margin: 0, color: "#6d8dff" }}>
            MentorLagbe
          </p>
          <h1 style={{ fontSize: 22, marginTop: 16 }}>Something went wrong</h1>
          <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6 }}>
            The application could not finish loading. Please retry the page.
          </p>
          {error.digest ? (
            <p style={{ color: "#64748b", fontSize: 12 }}>
              Error reference: {error.digest}
            </p>
          ) : null}
          <button
            onClick={reset}
            style={{
              marginTop: 24,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              border: 0,
              borderRadius: 10,
              padding: "10px 18px",
              background: "#3b5bdb",
              color: "white",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <RotateCcw size={16} /> Try again
          </button>
        </div>
      </body>
    </html>
  );
}
