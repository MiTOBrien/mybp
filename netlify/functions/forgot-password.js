import crypto from 'crypto'
import { Resend } from 'resend'
import { db } from '../db/client.js'
import { users, passwordResetTokens } from '../../db/schema.js'
import { eq } from 'drizzle-orm'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { email } = JSON.parse(event.body || '{}')
    if (!email) {
      return { statusCode: 400, body: 'Email is required' }
    }

    const normalizedEmail = email.trim().toLowerCase()

    // Look up user
    const [user] = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1)

    // Always return success to avoid leaking which emails exist
    const genericResponse = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'If an account exists for that email, a reset link has been sent.',
      }),
    }

    if (!user) {
      return genericResponse
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Store token
    await db.insert(passwordResetTokens).values({
      userId: user.id,
      token,
      expiresAt,
    })

    // Build reset URL
    const resetUrl = `https://trackmybp.netlify.app/reset-password?token=${token}`

    // Send email via Resend
    await resend.emails.send({
      from: 'Track My BP <no-reply@trackmybp.app>',
      to: normalizedEmail,
      subject: 'Reset Your Password',
      html: `
        <p>Hello,</p>
        <p>You requested to reset your password. Click the link below to set a new one:</p>
        <p><a href="${resetUrl}">Reset your password</a></p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
        <p>— Track My BP</p>
      `,
    })

    return genericResponse
  } catch (error) {
    console.error('forgot-password error', error)
    return { statusCode: 500, body: 'Internal Server Error' }
  }
}
