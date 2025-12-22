import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await deleteDoc(doc(db, "users", userId));

    return NextResponse.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
