import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  await connectDB();

  const admin = await User.create({
    email: "admin@gmail.com",
    password: "admin123",
    role: "admin",
  });

  return NextResponse.json(admin);
}
