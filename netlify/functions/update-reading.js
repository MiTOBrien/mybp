import { db } from '../db/client.js'
import { bloodpressure } from '../../db/schema.js'
import { eq } from 'drizzle-orm'

export async function handler(event) {
  if (event.httpMethod !== 'PUT') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { id, systolic, diastolic, heart_rate, reading_time } = JSON.parse(event.body || '{}')

    if (!id) {
      return { statusCode: 400, body: 'Missing reading ID' }
    }

    await db
      .update(bloodpressure)
      .set({
        systolic,
        diastolic,
        heart_rate,
        reading_time,
      })
      .where(eq(bloodpressure.id, id))

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Reading updated successfully' }),
    }
  } catch (error) {
    console.error('update-reading error', error)
    return { statusCode: 500, body: 'Internal Server Error' }
  }
}
