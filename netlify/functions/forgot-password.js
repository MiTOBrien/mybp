import crypto from 'crypto'
import { db } from '../../db/db.js'
import { users, passwordResetTokens } from '../../db/schema.js'
import { eq } from 'drizzle-orm'

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

    // Find user by normalized email
    const [user] = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1)

    // Always respond the same, even if user not found
    if (!user) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'If an account exists for that email, a reset link has been sent.',
        }),
      }
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

    const resetUrl = `https://trackmybp.netlify.app/reset-password?token=${token}`

    // TODO: send email using Resend / SendGrid / etc.
    // await sendResetEmail(normalizedEmail, resetUrl)

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'If an account exists for that email, a reset link has been sent.',
      }),
    }
  } catch (error) {
    console.error('forgot-password error', error)
    return { statusCode: 500, body: 'Internal Server Error' }
  }
}
