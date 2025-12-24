import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  orderBy,
  query,
} from "firebase/firestore";

/* ===============================
   GET ALL REPORTS (ADMIN)
================================ */
export async function GET() {
  try {
    const q = query(
      collection(db, "reports"),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    const reports = snap.docs.map((d) => ({
      id: d.id,          // 🔥 IMPORTANT
      ...d.data(),
    }));

    return NextResponse.json(reports);
  } catch (err) {
    console.error("FETCH REPORTS ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}

/* ===============================
   UPDATE REPORT STATUS
================================ */
export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing id or status" },
        { status: 400 }
      );
    }

    await updateDoc(doc(db, "reports", id), {
      status,                    // approved | rejected
      reviewedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("UPDATE REPORT ERROR:", err);
    return NextResponse.json(
      { error: "Failed to update report" },
      { status: 500 }
    );
  }
}
