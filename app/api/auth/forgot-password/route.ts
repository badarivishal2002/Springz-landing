import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import crypto from "crypto"
import { sendPasswordResetEmail } from "@/lib/email"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    // Don't reveal if user exists or not for security
    if (!user) {
      return NextResponse.json(
        { message: "If an account with this email exists, you will receive a password reset link." },
        { status: 200 }
      )
    }

    // Generate reset token (32 bytes = 64 hex characters)
    const resetToken = crypto.randomBytes(32).toString('hex')
    
    // Set token expiry to 1 hour from now
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Save reset token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })

    // Send password reset email
    try {
      await sendPasswordResetEmail(user.email, user.name || 'User', resetToken)
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError)
      // Don't expose email sending errors to client
      return NextResponse.json(
        { error: "Failed to send reset email. Please try again later." },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: "If an account with this email exists, you will receive a password reset link." },
      { status: 200 }
    )
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
