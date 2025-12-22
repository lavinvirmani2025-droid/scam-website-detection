// app/api/auth/me/route.ts
import { NextResponse } from "next/server";

import { verifyToken } from "@/lib/auth";



export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.match(/(?:^|;\s*)token=([^;]+)/);
    if (!match) return NextResponse.json({ user: null });

    const token = decodeURIComponent(match[1]);
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ user: null });

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) return NextResponse.json({ user: null });

    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error("ME ERROR:", err);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}

