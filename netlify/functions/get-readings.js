import { neon } from '@netlify/neon'
import { drizzle } from 'drizzle-orm/neon-http'
import jwt from 'jsonwebtoken'
import { bloodpressure } from '../../db/schema.js'
import { eq, desc } from 'drizzle-orm'

export default async (req) => {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return Response.json({ error: 'Missing Authorization header' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    let payload

    try {
      payload = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      return Response.json({ error: 'Invalid or expired token' }, { status: 401 })
    }

    const userId = payload.userId

    const sql = neon(process.env.NETLIFY_DATABASE_URL)
    const db = drizzle(sql)

    const readings = await db
      .select()
      .from(bloodpressure)
      .where(eq(bloodpressure.user_id, userId))
      .orderBy(desc(bloodpressure.reading_time))

    return Response.json({ readings })
  } catch (err) {
    console.error('Get readings error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
