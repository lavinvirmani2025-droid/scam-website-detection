import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    await prisma.user.update({
      where: { id: Number(id) },
      data: { role: "admin" },
    });

    return NextResponse.json({ message: "User promoted to admin" });
  } catch (error) {
    console.error("PROMOTE USER ERROR:", error);
    return NextResponse.json(
      { error: "Failed to promote user" },
      { status: 500 }
    );
  }
}

