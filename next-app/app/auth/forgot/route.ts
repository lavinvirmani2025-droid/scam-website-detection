import { NextResponse } from 'next/server'

// Not functional yet — only simulates email
export async function POST(req: Request) {
  const { email } = await req.json()

  return NextResponse.json({
    success: true,
    message: `Password reset link sent to ${email}`
  })
}
