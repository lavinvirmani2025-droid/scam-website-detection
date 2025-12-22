import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const text = await file.text();
    const lines = text.split("\n").slice(1); // skip header

    let count = 0;

    for (const line of lines) {
      if (!line.trim()) continue;

      const [url, label, reason] = line.split(",");

      if (!url || !label) continue;

      await addDoc(collection(db, "training_data"), {
        url: url.trim(),
        label: label.trim(),
        reason: reason?.trim() || "",
        uploadedAt: serverTimestamp(),
      });

      count++;
    }

    return NextResponse.json({ status: "ok", rows: count });
  } catch (err) {
    console.error("CSV UPLOAD ERROR:", err);
    return NextResponse.json(
      { error: "Failed to process CSV" },
      { status: 500 }
    );
  }
}
