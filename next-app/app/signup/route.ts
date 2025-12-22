import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    message: "Signup handled on client using Firebase Auth",
  });
}
