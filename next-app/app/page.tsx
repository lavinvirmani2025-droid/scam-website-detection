"use client";

import { useState } from "react";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function checkScam() {
    setLoading(true);
    setResult(null);

    const res = await fetch("/api/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "radial-gradient(circle at top, #0F172A, #070B1A)",
        color: "white",
      }}
    >
      <div
        style={{
          background: "#0E1329",
          padding: 36,
          borderRadius: 16,
          width: 520,
          textAlign: "center",
          border: "1px solid rgba(124,58,237,0.2)",
          boxShadow: "0 0 50px rgba(124,58,237,0.15)",
        }}
      >
        {/* TITLE */}
        <h1
          style={{
            fontSize: 40,
            fontWeight: 800,
            marginBottom: 10,
            background:
              "linear-gradient(90deg,#7C3AED,#EC4899,#3B82F6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Scam Website Detection
        </h1>

        <p style={{ color: "#9CA3AF", marginBottom: 24 }}>
          Check whether a website is safe or a scam in seconds
        </p>

        {/* INPUT */}
        <input
          placeholder="Enter website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            width: "100%",
            padding: 14,
            marginBottom: 16,
            background: "#070B1A",
            color: "white",
            border: "1px solid #1F2937",
            borderRadius: 10,
            fontSize: 15,
          }}
        />

        {/* BUTTON */}
        <button
          onClick={checkScam}
          disabled={loading}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 10,
            background:
              "linear-gradient(90deg,#7C3AED,#EC4899,#3B82F6)",
            color: "white",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 0 25px rgba(236,72,153,0.45)",
          }}
        >
          {loading ? "Checking..." : "Check Website"}
        </button>

        {/* RESULT */}
        {result && (
          <div
            style={{
              marginTop: 28,
              padding: 18,
              borderRadius: 12,
              background:
                result.verdict === "Scam"
                  ? "rgba(239,68,68,0.15)"
                  : "rgba(34,197,94,0.15)",
              border:
                result.verdict === "Scam"
                  ? "1px solid rgba(239,68,68,0.4)"
                  : "1px solid rgba(34,197,94,0.4)",
            }}
          >
            <h3
              style={{
                marginBottom: 6,
                color:
                  result.verdict === "Scam"
                    ? "#F87171"
                    : "#4ADE80",
              }}
            >
              Result: {result.verdict}
            </h3>

            <p style={{ color: "#E5E7EB", marginBottom: 6 }}>
              Confidence: {result.confidence}%
            </p>

            <p style={{ color: "#9CA3AF" }}>
              {result.reason}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
