import bcrypt from 'bcryptjs'
import { db } from '../../db/db.js'
import { users, passwordResetTokens } from '../../db/schema.js'
import { eq } from 'drizzle-orm'

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { token, newPassword } = JSON.parse(event.body || '{}')

    if (!token || !newPassword) {
      return { statusCode: 400, body: 'Token and newPassword are required' }
    }

    // Look up token
    const [resetRow] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token))
      .limit(1)

    if (!resetRow) {
      return { statusCode: 400, body: 'Invalid or expired token' }
    }

    // Check expiration
    const now = new Date()
    if (resetRow.expiresAt <= now) {
      // Optionally delete expired token
      await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, resetRow.id))

      return { statusCode: 400, body: 'Invalid or expired token' }
    }

    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 10)

    // Update user password
    await db.update(users).set({ password: hashed }).where(eq(users.id, resetRow.userId))

    // Invalidate token
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, resetRow.id))

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Password has been reset successfully.' }),
    }
  } catch (error) {
    console.error('reset-password error', error)
    return { statusCode: 500, body: 'Internal Server Error' }
  }
}
