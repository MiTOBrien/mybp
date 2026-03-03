import { neon } from '@netlify/neon'
import { drizzle } from 'drizzle-orm/neon-http'
import jwt from 'jsonwebtoken'
import { bloodpressure } from '../../db/schema.js'
import { eq, desc, gte } from 'drizzle-orm'

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

    // Read query params
    const url = new URL(req.url)
    const days = url.searchParams.get('days')
    const all = url.searchParams.get('all')

    let query = db.select().from(bloodpressure).where(eq(bloodpressure.user_id, userId))

    // Apply days filter if provided
    if (days && !all) {
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - Number(days))

      query = query.where(gte(bloodpressure.reading_time, cutoff.toISOString()))
    }

    // Always order ASC for grouping logic
    const readings = await query.orderBy(bloodpressure.reading_time)

    return Response.json({ readings })
  } catch (err) {
    console.error('Get readings error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
