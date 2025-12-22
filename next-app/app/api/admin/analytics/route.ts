import { NextResponse } from "next/server";


export async function GET() {
  try {
    // BASIC COUNTS
    const [
      totalUsers,
      totalReports,
      approved,
      rejected,
      pending,
      visits,
      signups,
      logins,
      submissions,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.scamReport.count(),
      prisma.scamReport.count({ where: { status: "approved" } }),
      prisma.scamReport.count({ where: { status: "rejected" } }),
      prisma.scamReport.count({ where: { status: "pending" } }),
      prisma.analyticsEvent.count({ where: { type: "visit" } }),
      prisma.analyticsEvent.count({ where: { type: "signup" } }),
      prisma.analyticsEvent.count({ where: { type: "login" } }),
      prisma.analyticsEvent.count({ where: { type: "report_submitted" } }),
    ]);

    // RECENT ITEMS
    const recentReports = await prisma.scamReport.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: true },
    });

    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return NextResponse.json({
      totalUsers,
      totalReports,
      approved,
      rejected,
      pending,
      visits,
      signups,
      logins,
      submissions,
      recentReports,
      recentUsers,
    });
  } catch (error) {
    console.error("ANALYTICS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to load analytics" },
      { status: 500 }
    );
  }
}

