import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

/* ---------------- HELPER FUNCTIONS ---------------- */

function normalizeUrl(url: string) {
  return url
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");
}

function extractDomain(url: string) {
  return normalizeUrl(url).split("/")[0];
}

/* ---------------- API HANDLER ---------------- */

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

      const cleanUrl = url.trim();

      await addDoc(collection(db, "training_data"), {
        url: cleanUrl,
        label: label.trim(),
        reason: reason?.trim() || "",
        normalizedUrl: normalizeUrl(cleanUrl),
        domain: extractDomain(cleanUrl),
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
