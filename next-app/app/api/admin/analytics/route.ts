import { NextResponse } from "next/server";
import { adminDB } from "@/lib/firebase-admin";

export async function GET() {
  const usersSnap = await adminDB.collection("users").get();
  const reportsSnap = await adminDB.collection("reports").get();

  let approved = 0;
  let rejected = 0;

  reportsSnap.forEach(doc => {
    const status = doc.data().status;
    if (status === "approved") approved++;
    if (status === "rejected") rejected++;
  });

  return NextResponse.json({
    users: usersSnap.size,
    reports: reportsSnap.size,
    approved,
    rejected,
  });
}
