import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const { url, description, userId } = await req.json();

    // Create report in DB
    const report = await prisma.scamReport.create({
      data: {
        url,
        description,
        status: "pending",
        createdBy: userId,
      },
    });

    // TRACK ANALYTICS
    await prisma.analyticsEvent.create({
      data: { type: "report_submitted" },
    });

    return NextResponse.json({ message: "Report submitted", report });
  } catch (error) {
    console.error("REPORT ERROR:", error);
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
  }
}

