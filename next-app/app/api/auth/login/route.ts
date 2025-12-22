// app/api/auth/login/route.ts
import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { serialize } from "cookie";



export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    const res = NextResponse.json({ message: "Login successful", role: user.role });
    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    });
    res.headers.set("Set-Cookie", cookie);

    // Optional analytics
    try {
      await prisma.analyticsEvent?.create?.({ data: { type: "login", meta: JSON.stringify({ userId: user.id }) } } as any);
    } catch {}

    return res;
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

