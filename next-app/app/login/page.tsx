"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    alert("LOGIN CLICKED"); // 🔥 visual proof
    setError("");

    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userEmail = userCred.user.email;
      if (!userEmail) {
        setError("Login failed");
        return;
      }

      const userDoc = await getDoc(doc(db, "users", userEmail));

      if (!userDoc.exists()) {
        setError("No role assigned");
        return;
      }

      if (userDoc.data().role !== "admin") {
        setError("Access denied");
        return;
      }
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "login",
        route: "/login",
      }),
    });

    window.location.href = "/admin";
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
        color: "white",
      }}
    >
      <div style={{ width: 350 }}>
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>
          Admin Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 10,
            background: "#111",
            color: "white",
            border: "1px solid #444",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 15,
            background: "#111",
            color: "white",
            border: "1px solid #444",
          }}
        />

        {/* ✅ THE ONLY LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: 10,
            background: "#2563eb",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Login
        </button>
        <p
          style={{
            marginTop: 10,
            textAlign: "center",
            color: "#aaa",
            cursor: "pointer",
          }}
          onClick={async () => {
            if (!email) {
              setError("Enter your email first");
              return;
            }

            try {
              const { sendPasswordResetEmail } = await import(
                "firebase/auth"
              );
              await sendPasswordResetEmail(auth, email);
              alert("Password reset email sent");
            } catch {
              setError("Failed to send reset email");
            }
          }}
>
  Forgot password?
</p>


        {error && (
          <p style={{ color: "red", marginTop: 10, textAlign: "center" }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
