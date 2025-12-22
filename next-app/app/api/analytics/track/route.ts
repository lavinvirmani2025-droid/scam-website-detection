import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, route } = body;

    if (!type) {
      return NextResponse.json(
        { error: "type is required" },
        { status: 400 }
      );
    }

    await addDoc(collection(db, "analytics"), {
      type,
      route: route || null,
      timestamp: serverTimestamp(),
    });

    return NextResponse.json({ status: "tracked" });
  } catch (err) {
    console.error("ANALYTICS ERROR:", err);
    return NextResponse.json(
      { error: "failed to track analytics" },
      { status: 500 }
    );
  }
}
