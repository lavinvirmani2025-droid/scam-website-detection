import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(_: Request, { params }: any) {
  await prisma.scamReport.update({
    where: { id: Number(params.id) },
    data: { status: "approved" }
  });

  return NextResponse.json({ message: "Report approved" });
}

