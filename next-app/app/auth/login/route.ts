import { NextResponse } from 'next/server'

// The same in-memory users for testing
let users: any[] = [
  {
    name: "Admin",
    email: "admin@scam.com",
    password: "admin123",
    role: "admin"
  }
]

export async function POST(req: Request) {
  const { email, password } = await req.json()

  const user = users.find(
    u => u.email === email && u.password === password
  )

  if (!user) {
    return NextResponse.json({
      success: false,
      message: 'Invalid email or password'
    })
  }

  return NextResponse.json({
    success: true,
    role: user.role
  })
}
