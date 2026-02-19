import { db } from '../db/client.js'
import { passwordResetTokens } from '../../db/schema.js'
import { eq } from 'drizzle-orm'

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { token } = JSON.parse(event.body || '{}')

    if (!token) {
      return {
        statusCode: 400,
        body: JSON.stringify({ valid: false, reason: 'Missing token' }),
      }
    }

    // Look up token
    const [row] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token))
      .limit(1)

    if (!row) {
      return {
        statusCode: 200,
        body: JSON.stringify({ valid: false, reason: 'Invalid token' }),
      }
    }

    // Check expiration
    const now = new Date()
    if (row.expiresAt <= now) {
      return {
        statusCode: 200,
        body: JSON.stringify({ valid: false, reason: 'Expired token' }),
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ valid: true }),
    }
  } catch (error) {
    console.error('validate-reset-token error', error)
    return { statusCode: 500, body: 'Internal Server Error' }
  }
}
