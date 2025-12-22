// app/api/admin/users/delete/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // verify admin
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.match(/(?:^|;\s*)token=([^;]+)/);
    if (!match) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyToken(decodeURIComponent(match[1]));
    if (!payload || payload.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = Number(params.id);
    if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    // Prevent deleting yourself (optional)
    if (id === payload.id) return NextResponse.json({ error: "Cannot delete own admin account" }, { status: 400 });

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: "User deleted" });
  } catch (err) {
    console.error("ADMIN DELETE ERROR:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

