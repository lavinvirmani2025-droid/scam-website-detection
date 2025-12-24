"use client";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");
    setLoading(true);

    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // create user document
      await setDoc(doc(db, "users", cred.user.uid), {
        email,
        role: "user",
        createdAt: serverTimestamp(),
      });

      window.location.href = "/login";
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "radial-gradient(circle at top, #0F172A, #070B1A)",
      }}
    >
      <div
        style={{
          background: "#0E1329",
          padding: 36,
          width: 380,
          borderRadius: 16,
          border: "1px solid rgba(124,58,237,0.25)",
          boxShadow: "0 0 45px rgba(124,58,237,0.2)",
          color: "white",
        }}
      >
        {/* TITLE */}
        <h2
          style={{
            textAlign: "center",
            marginBottom: 8,
            fontSize: 26,
            fontWeight: 800,
            background:
              "linear-gradient(90deg,#7C3AED,#EC4899,#3B82F6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Create Account
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "#9CA3AF",
            fontSize: 14,
            marginBottom: 24,
          }}
        >
          Join WEBDEX to report scam websites
        </p>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: 14,
            marginBottom: 14,
            background: "#070B1A",
            color: "white",
            border: "1px solid #1F2937",
            borderRadius: 10,
            fontSize: 14,
          }}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: 14,
            marginBottom: 18,
            background: "#070B1A",
            color: "white",
            border: "1px solid #1F2937",
            borderRadius: 10,
            fontSize: 14,
          }}
        />

        {/* BUTTON */}
        <button
          onClick={handleRegister}
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
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        {/* LOGIN LINK */}
        <p
          onClick={() => (window.location.href = "/login")}
          style={{
            marginTop: 16,
            textAlign: "center",
            fontSize: 14,
            color: "#60A5FA",
            cursor: "pointer",
          }}
        >
          Already have an account? Login
        </p>

        {/* ERROR */}
        {error && (
          <p
            style={{
              marginTop: 12,
              textAlign: "center",
              color: "#F87171",
              fontSize: 14,
            }}
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
