// app/api/reports/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * POST - create a new report
 * GET  - list reports for current user (we read token cookie in future; for now accept userId)
 *
 * NOTE: In production, you must verify auth (JWT) and derive userId from token.
 */

export async function POST(req: Request) {
  try {
    const { url, description, userId } = await req.json();
    if (!url || !userId) {
      return NextResponse.json({ error: "Missing url or userId" }, { status: 400 });
    }

    const report = await prisma.scamReport.create({
      data: {
        url,
        description: description || null,
        status: "pending",
        createdBy: Number(userId)
      }
    });

    return NextResponse.json({ ok: true, report });
  } catch (err) {
    console.error("CREATE REPORT ERROR", err);
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    // For now, accept ?userId=... in query. Replace with auth-derived id later.
    const url = new URL(req.url);
    const uid = url.searchParams.get("userId");
    if (!uid) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    const reports = await prisma.scamReport.findMany({
      where: { createdBy: Number(uid) },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ ok: true, reports });
  } catch (err) {
    console.error("LIST REPORTS ERROR", err);
    return NextResponse.json({ error: "Failed to list reports" }, { status: 500 });
  }
}

