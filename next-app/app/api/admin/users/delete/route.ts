import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "User deleted" });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

