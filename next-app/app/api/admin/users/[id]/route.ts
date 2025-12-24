import { NextResponse } from "next/server";
import { adminAuth, adminDB } from "@/lib/firebase-admin";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const uid = params.id;

  try {
    // 1️⃣ Delete from Firebase Auth
    await adminAuth.deleteUser(uid);

    // 2️⃣ Delete from Firestore
    await adminDB.collection("users").doc(uid).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
