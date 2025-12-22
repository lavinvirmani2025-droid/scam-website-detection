import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export async function POST() {
  try {
    const modelRef = doc(db, "model_config", "current");
    const snap = await getDoc(modelRef);

    // If model already exists, do not overwrite
    if (snap.exists()) {
      return NextResponse.json({
        status: "exists",
        message: "Model already initialized",
      });
    }

    // Create EMPTY model
    await setDoc(modelRef, {
      version: 1,
      trained: false,
      scamKeywords: [],
      threshold: 0.7,
      totalSamples: 0,
      lastTrainedAt: null,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({
      status: "created",
      message: "Model initialized successfully",
    });
  } catch (err) {
    console.error("MODEL INIT ERROR:", err);
    return NextResponse.json(
      { error: "Failed to initialize model" },
      { status: 500 }
    );
  }
}
