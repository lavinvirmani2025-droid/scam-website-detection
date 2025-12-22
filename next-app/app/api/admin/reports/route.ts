import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const reports = await prisma.scamReport.findMany({
      orderBy: { id: "desc" }, // newest first
    });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error("LIST REPORTS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to load reports" },
      { status: 500 }
    );
  }
}

