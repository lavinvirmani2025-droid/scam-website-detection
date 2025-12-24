"use client";

import { auth, db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

export default function ReportPage() {
  const [url, setUrl] = useState("");
  const [desc, setDesc] = useState("");
  const router = useRouter();

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/login");
    });
  }, []);

  const submitReport = async () => {
    await addDoc(collection(db, "reports"), {
      url,
      description: desc,
      status: "pending",
      createdAt: new Date(),
    });

    alert("Report submitted");
    setUrl("");
    setDesc("");
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Report Scam Website</h2>

      <input
        placeholder="Website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      <br /><br />

      <button onClick={submitReport}>Submit</button>
    </div>
  );
}
