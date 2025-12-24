"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<"admin" | "user" | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (u) {
        const snap = await getDoc(doc(db, "users", u.uid));
        if (snap.exists()) {
          setRole(snap.data().role);
        } else {
          setRole(null);
        }
      } else {
        setRole(null);
      }
    });
  }, []);

  const logout = async () => {
    await signOut(auth);
    document.cookie = "token=; Max-Age=0; path=/";
    window.location.href = "/";
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 32px",
        background: "#070B1A",
        borderBottom: "1px solid #1F2937",
      }}
    >
      {/* LOGO */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img src="/logo.png" height={36} alt="WEBDEX" />
        <span
          style={{
            fontWeight: 800,
            fontSize: 18,
            background:
              "linear-gradient(90deg,#7C3AED,#EC4899,#3B82F6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          WEBDEX
        </span>
      </div>

      {/* LINKS */}
      <div style={{ display: "flex", gap: 18 }}>
        <Link href="/" style={{ color: "#E5E7EB" }}>
          Check
        </Link>

        {user && role === "user" && (
          <Link href="/report" style={{ color: "#E5E7EB" }}>
            Report
          </Link>
        )}

        {user && role === "admin" && (
          <Link href="/admin" style={{ color: "#F472B6" }}>
            Admin Dashboard
          </Link>
        )}

        {!user && (
          <>
            <Link href="/login" style={{ color: "#E5E7EB" }}>
              Login
            </Link>
            <Link href="/register" style={{ color: "#60A5FA" }}>
              Sign Up
            </Link>
          </>
        )}

        {user && (
          <button
            onClick={logout}
            style={{
              background: "transparent",
              border: "none",
              color: "#E5E7EB",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
