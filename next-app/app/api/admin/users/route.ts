import { NextResponse } from "next/server";
import { adminDB } from "@/lib/firebase-admin";

export async function GET() {
  const snap = await adminDB.collection("users").get();

  const users = snap.docs.map(doc => ({
    _id: doc.id,
    ...doc.data(),
  }));

  return NextResponse.json(users);
}
