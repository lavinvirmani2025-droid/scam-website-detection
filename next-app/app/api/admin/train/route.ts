import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";

export async function POST() {
  try {
    // create training job
    const jobRef = await addDoc(collection(db, "training_jobs"), {
      status: "running",
      startedAt: serverTimestamp(),
    });

    // read training data
    const snap = await getDocs(collection(db, "training_data"));

    const keywordCount: Record<string, number> = {};
    let total = 0;

    snap.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.label !== "scam") return;

      total++;

      const words = data.url.split(/[^a-zA-Z]/);
      words.forEach((w: string) => {
        if (w.length < 4) return;
        const key = w.toLowerCase();
        keywordCount[key] = (keywordCount[key] || 0) + 1;
      });
    });

    // pick top keywords
    const scamKeywords = Object.entries(keywordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([k]) => k);

    // update model config
    await setDoc(doc(db, "model_config", "current"), {
      version: Date.now(),
      scamKeywords,
      threshold: 0.6,
      lastTrainedAt: serverTimestamp(),
    });

    // mark training job complete
    await setDoc(
      doc(db, "training_jobs", jobRef.id),
      {
        status: "completed",
        rowsProcessed: snap.size,
        completedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return NextResponse.json({
      status: "training completed",
      keywordsLearned: scamKeywords.length,
      rowsProcessed: snap.size,
    });
  } catch (err) {
    console.error("TRAINING ERROR:", err);
    return NextResponse.json(
      { error: "Training failed" },
      { status: 500 }
    );
  }
}
