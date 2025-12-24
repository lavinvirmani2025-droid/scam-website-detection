import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    let data = {};

    try {
      data = await req.json();
    } catch {
      data = {}; // handle empty body safely
    }

    // OPTIONAL: log analytics if needed
    console.log("Analytics event:", data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ANALYTICS ERROR:", error);
    return NextResponse.json({ success: false });
  }
}
