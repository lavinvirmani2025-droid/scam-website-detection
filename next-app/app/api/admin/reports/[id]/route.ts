import { NextResponse } from "next/server";
import { adminDB } from "@/lib/firebase-admin";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await req.json();

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    await adminDB
      .collection("reports")
      .doc(params.id)
      .update({ status });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("UPDATE REPORT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update report" },
      { status: 500 }
    );
  }
}
