"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Analytics = {
  users: number;
  reports: number;
  approved: number;
  rejected: number;
};

type User = {
  _id: string;
  email: string;
  role: string;
};

type Report = {
  _id: string;
  url: string;
  status: "pending" | "approved" | "rejected";
};

export default function AdminDashboard() {
  const router = useRouter();

  const [analytics, setAnalytics] = useState<Analytics>({
    users: 0,
    reports: 0,
    approved: 0,
    rejected: 0,
  });

  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH DATA =================

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    try {
      const [a, u, r] = await Promise.all([
        fetch("/api/admin/analytics").then(res => res.json()),
        fetch("/api/admin/users").then(res => res.json()),
        fetch("/api/admin/reports").then(res => res.json()),
      ]);

      setAnalytics(a);
      setUsers(u);
      setReports(r);
    } catch (err) {
      console.error("Admin fetch error", err);
    } finally {
      setLoading(false);
    }
  }

  // ================= ACTIONS =================

  async function deleteUser(id: string) {
    if (!confirm("Delete this user?")) return;

    await fetch(`/api/admin/users/${id}`, {
      method: "DELETE",
    });

    setUsers(users.filter(u => u._id !== id));
  }

  async function updateReport(id: string, status: "approved" | "rejected") {
    await fetch(`/api/admin/reports/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    setReports(reports.map(r =>
      r._id === id ? { ...r, status } : r
    ));
  }

  if (loading) {
    return <div className="p-10 text-xl">Loading admin dashboard...</div>;
  }

  return (
    <div className="p-8 space-y-10">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <button
          onClick={() => router.push("/admin/train")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Go to Training Page
        </button>
      </div>

      {/* ================= ANALYTICS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Users", value: analytics.users },
          { label: "Total Reports", value: analytics.reports },
          { label: "Approved", value: analytics.approved },
          { label: "Rejected", value: analytics.rejected },
        ].map(card => (
          <div
            key={card.label}
            className="bg-black text-white p-6 rounded-xl shadow"
          >
            <p className="text-gray-400">{card.label}</p>
            <h2 className="text-3xl font-bold">{card.value}</h2>
          </div>
        ))}
      </div>
      {/* ================= ANALYTICS CHART ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Report Decisions Overview</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={[
              { name: "Approved", value: analytics.approved },
              { name: "Rejected", value: analytics.rejected },
            ]}
          >
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>


      {/* ================= USERS ================= */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Users</h2>

        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.role}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= REPORTS ================= */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Scam Reports</h2>

        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">URL</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report._id}>
                <td className="p-2 border">{report.url}</td>
                <td className="p-2 border capitalize">{report.status}</td>
                <td className="p-2 border space-x-2">
                  {report.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateReport(report._id, "approved")}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateReport(report._id, "rejected")}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
