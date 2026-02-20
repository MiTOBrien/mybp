import { db } from '../db/client.js'
import { bloodpressure } from '../../db/schema.js'
import { eq } from 'drizzle-orm'

export async function handler(event) {
  if (event.httpMethod !== 'DELETE') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { id } = JSON.parse(event.body || '{}')

    if (!id) {
      return { statusCode: 400, body: 'Missing reading ID' }
    }

    await db.delete(bloodpressure).where(eq(bloodpressure.id, id))

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Reading deleted successfully' }),
    }
  } catch (error) {
    console.error('delete-reading error', error)
    return { statusCode: 500, body: 'Internal Server Error' }
  }
}
