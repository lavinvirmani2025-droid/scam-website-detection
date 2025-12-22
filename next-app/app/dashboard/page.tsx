"use client";

import { useEffect, useState } from "react";

type Report = {
  id: number;
  url: string;
  description?: string | null;
  status: string;
  createdAt: string;
};

export default function DashboardPage() {
  // TEMP: set currentUserId to your logged-in user id.
  // Later: derive from cookie/JWT or server-side props.
  const [currentUserId] = useState<number>(1); // change to actual user id or read from context
  const [url, setUrl] = useState("");
  const [desc, setDesc] = useState("");
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    if (!currentUserId) return;
    const res = await fetch(`/api/reports?userId=${currentUserId}`);
    const data = await res.json();
    if (data.ok) setReports(data.reports);
  }

  async function handleScan(e: any) {
    e.preventDefault();
    setScanResult(null);
    setMsg("");
    if (!url) {
      setMsg("Enter URL");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });
    const data = await res.json();
    setLoading(false);
    if (data.ok) {
      setScanResult(`${data.result} — ${data.explanation || ""}`);
    } else {
      setMsg("Scan failed");
    }
  }

  async function submitReport(e: any) {
    e.preventDefault();
    if (!url) {
      setMsg("Enter URL before reporting");
      return;
    }
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, description: desc, userId: currentUserId })
    });
    const data = await res.json();
    if (data.ok) {
      setMsg("Report submitted");
      setDesc("");
      fetchReports();
    } else {
      setMsg("Report failed");
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <h1>User Dashboard</h1>

      <section style={{ marginTop: 20, padding: 12, border: "1px solid #ddd" }}>
        <h2>Check a website</h2>
        <form onSubmit={handleScan}>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            style={{ width: 420, padding: 8, marginRight: 8 }}
          />
          <button type="submit" style={{ padding: "8px 12px" }} disabled={loading}>
            {loading ? "Scanning..." : "Scan"}
          </button>
        </form>
        {scanResult && <p style={{ marginTop: 8 }}>Result: <strong>{scanResult}</strong></p>}
      </section>

      <section style={{ marginTop: 16, padding: 12, border: "1px solid #ddd" }}>
        <h2>Report this site as scam</h2>
        <form onSubmit={submitReport}>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Add details (optional)"
            style={{ width: "100%", minHeight: 70, marginBottom: 8 }}
          />
          <button type="submit" style={{ padding: "8px 12px" }}>Submit Report</button>
        </form>
        {msg && <p style={{ marginTop: 8 }}>{msg}</p>}
      </section>

      <section style={{ marginTop: 20 }}>
        <h2>Your reports</h2>
        {reports.length === 0 ? (
          <p>No reports yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>URL</th>
                <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>Status</th>
                <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>When</th>
                <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td style={{ padding: 8 }}>{r.url}</td>
                  <td style={{ padding: 8 }}>{r.status}</td>
                  <td style={{ padding: 8 }}>{new Date(r.createdAt).toLocaleString()}</td>
                  <td style={{ padding: 8 }}>{r.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}


