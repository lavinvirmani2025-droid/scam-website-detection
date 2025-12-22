import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export async function GET() {
  try {
    const usersSnap = await getDocs(collection(db, "users"));
    const reportsSnap = await getDocs(collection(db, "reports"));

    const approvedReportsSnap = await getDocs(
      query(collection(db, "reports"), where("status", "==", "approved"))
    );

    const rejectedReportsSnap = await getDocs(
      query(collection(db, "reports"), where("status", "==", "rejected"))
    );

    return NextResponse.json({
      users: usersSnap.size,
      reports: reportsSnap.size,
      approved: approvedReportsSnap.size,
      rejected: rejectedReportsSnap.size,
    });
  } catch (error) {
    console.error("ADMIN ANALYTICS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to load analytics" },
      { status: 500 }
    );
  }
}
