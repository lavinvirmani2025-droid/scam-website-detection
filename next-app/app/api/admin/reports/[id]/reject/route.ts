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
      status: "rejected",
      reviewedAt: new Date(),
    });

    return NextResponse.json({
      message: "Report rejected",
    });
  } catch (error) {
    console.error("REJECT REPORT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to reject report" },
      { status: 500 }
    );
  }
}
