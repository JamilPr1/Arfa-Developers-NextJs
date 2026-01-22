import { NextRequest, NextResponse } from 'next/server'

// Simple password-based authentication
// In production, use proper authentication (JWT, sessions, etc.)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({ success: true, message: 'Login successful' })
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid password' },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error during login' },
      { status: 500 }
    )
  }
}
