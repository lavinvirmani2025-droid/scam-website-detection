"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent");
    } catch {
      setMessage("Failed to send reset email");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Forgot Password</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <button onClick={handleReset}>
        Send Reset Email
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}
