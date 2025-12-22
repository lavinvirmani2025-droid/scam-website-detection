// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: "user",
      },
    });

    // Optional: record analytics event (if you have AnalyticsEvent model)
    try {
      await prisma.analyticsEvent?.create?.({ data: { type: "signup", meta: JSON.stringify({ email }) } } as any);
    } catch {
      /* ignore if model missing */
    }

    return NextResponse.json({ message: "Signup successful", user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}

