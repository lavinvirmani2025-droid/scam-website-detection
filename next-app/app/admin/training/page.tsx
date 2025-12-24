"use client";

import { useState } from "react";

export default function AdminTrainingPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");


  const handleUpload = async () => {
    try {
      setStatus("Training in progress...");

      // upload + train logic here

      setStatus("SUCCESS: Model trained successfully");
    } catch (err) {
      setStatus("ERROR: Training failed");
    }

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
  <div style={{ padding: 40, maxWidth: 500 }}>
    <h1>AI Training</h1>
    <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>
      Upload a CSV file to train the scam detection model
    </p>

    <input
      type="file"
      accept=".csv"
      onChange={(e) => setFile(e.target.files?.[0] || null)}
      style={{
        width: "100%",
        padding: 12,
        background: "#0e0824",
        border: "1px solid rgba(177,76,255,0.3)",
        borderRadius: 10,
        color: "white",
        marginBottom: 20,
      }}
    />

    <button className="btn-primary" onClick={handleUpload}>
      Upload & Train
    </button>
    {status && (
      <p
        className={
          status.startsWith("SUCCESS")
            ? "status-success"
            : status.startsWith("ERROR")
            ? "status-error"
            : ""
        }
        style={{ marginTop: 20 }}
      >
        {status}
      </p>
    )}


    {status && (
      <p style={{ marginTop: 20, color: "var(--text-muted)" }}>
        {status}
      </p>
    )}
  </div>
  );

}
