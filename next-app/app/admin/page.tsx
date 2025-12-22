"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

type AnalyticsEvent = {
  id: string;
  type: string;
  route: string | null;
};

export default function AdminDashboard() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const q = query(
          collection(db, "analytics"),
          orderBy("timestamp", "desc")
        );

        const snap = await getDocs(q);

        const data: AnalyticsEvent[] = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any),
        }));

        setEvents(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load analytics");
      }
    };

    loadAnalytics();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Admin Dashboard</h1>

      {/* 🔹 Navigation button */}
      <button
        onClick={() => {
          window.location.href = "/admin/training";
        }}
        style={{
          marginTop: 10,
          marginBottom: 20,
          padding: "6px 12px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          fontSize: 13,
        }}
      >
        Go to AI Training
      </button>

      {/* 🔹 Error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2 style={{ marginTop: 20 }}>Analytics Events</h2>

      {events.length === 0 && <p>No analytics data yet.</p>}

      <ul>
        {events.map((e) => (
          <li key={e.id}>
            <strong>{e.type}</strong> — {e.route}
          </li>
        ))}
      </ul>
    </div>
  );
}
