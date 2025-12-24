import { NextResponse } from "next/server";
import { adminDB } from "@/lib/firebase-admin";

export async function GET() {
  const snap = await adminDB.collection("reports").get();

  const reports = snap.docs.map(doc => ({
    _id: doc.id,
    ...doc.data(),
  }));

  return NextResponse.json(reports);
}
