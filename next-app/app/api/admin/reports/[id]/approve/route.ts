import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await updateDoc(doc(db, "reports", id), {
      status: "approved",
      reviewedAt: new Date(),
    });

    return NextResponse.json({
      message: "Report approved",
    });
  } catch (error) {
    console.error("APPROVE REPORT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to approve report" },
      { status: 500 }
    );
  }
}
