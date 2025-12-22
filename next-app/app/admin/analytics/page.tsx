"use client";

import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/analytics");
      const json = await res.json();
      setData(json);
    }
    load();
  }, []);

  if (!data) return <h2>Loading analytics…</h2>;

  return (
    <div style={{ width: "700px", margin: "40px auto" }}>
      <h1 style={{ marginBottom: "20px" }}>Analytics</h1>

      <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "1fr 1fr" }}>
        <Card title="Total Users" value={data.totalUsers} />
        <Card title="Total Visits" value={data.visits} />
        <Card title="Signups" value={data.signups} />
        <Card title="Logins" value={data.logins} />
        <Card title="Reports Submitted" value={data.submissions} />
        <Card title="Pending Reports" value={data.pending} />
        <Card title="Approved" value={data.approved} />
        <Card title="Rejected" value={data.rejected} />
      </div>
    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div style={{ padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
      <h3>{title}</h3>
      <p style={{ fontSize: 28, fontWeight: "bold" }}>{value}</p>
    </div>
  );
}

