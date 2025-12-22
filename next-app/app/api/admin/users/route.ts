import { NextResponse } from "next/server";


export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("USER LIST ERROR:", error);
    return NextResponse.json(
      { error: "Failed to load users" },
      { status: 500 }
    );
  }
}

