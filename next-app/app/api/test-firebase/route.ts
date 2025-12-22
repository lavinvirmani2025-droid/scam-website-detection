import { NextResponse } from "next/server";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET() {
  await addDoc(collection(db, "test"), {
    message: "Firebase connected successfully",
    time: Date.now(),
  });

  return NextResponse.json({ status: "Firebase working" });
}
