import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // 1️⃣ Load trained model
    const modelRef = doc(db, "model_config", "current");
    const modelSnap = await getDoc(modelRef);

    if (!modelSnap.exists()) {
      return NextResponse.json({
        status: "untrained",
        message: "Model not trained yet",
      });
    }

    const model = modelSnap.data();
    const keywords: string[] = model.scamKeywords || [];
    const threshold: number = model.threshold || 0.7;

    if (keywords.length === 0) {
      return NextResponse.json({
        status: "untrained",
        message: "Model has no keywords",
      });
    }

    // 2️⃣ Detect keywords
    const urlLower = url.toLowerCase();
    const matchedKeywords = keywords.filter((k) =>
      urlLower.includes(k.toLowerCase())
    );

    const confidence = matchedKeywords.length / keywords.length;
    const isScam = confidence >= threshold;

    // 3️⃣ Save detection
    await addDoc(collection(db, "detections"), {
      url,
      isScam,
      confidence,
      matchedKeywords,
      detectedAt: serverTimestamp(),
    });

    // 4️⃣ Return result
    return NextResponse.json({
      isScam,
      confidence,
      matchedKeywords,
    });
  } catch (err) {
    console.error("DETECTION ERROR:", err);
    return NextResponse.json(
      { error: "Detection failed" },
      { status: 500 }
    );
  }
}
