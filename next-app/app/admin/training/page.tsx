"use client";

import { useState } from "react";

export default function AdminTrainingPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload-csv", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Upload failed");
        return;
      }

      setMessage(`Upload successful. Rows added: ${data.rows}`);
    } catch {
      setMessage("Something went wrong");
    }
  };

  const handleTrain = async () => {
    try {
      const res = await fetch("/api/admin/train", {
        method: "POST",
      });
      const data = await res.json();
      alert(
        `Training completed\nRows: ${data.rowsProcessed}\nKeywords learned: ${data.keywordsLearned}`
      );
    } catch {
      alert("Training failed");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>AI Training (Admin)</h1>

      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <br />
      <br />

      <button
        onClick={handleUpload}
        style={{
          padding: "8px 14px",
          background: "#2563eb",
          color: "white",
          border: "none",
          cursor: "pointer",
          marginRight: 10,
        }}
      >
        Upload CSV
      </button>

      <button
        onClick={handleTrain}
        style={{
          padding: "8px 14px",
          background: "green",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Start Training
      </button>

      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  );
}
