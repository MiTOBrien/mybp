import { neon } from '@netlify/neon'
import { drizzle } from 'drizzle-orm/neon-http'
import jwt from 'jsonwebtoken'
import { bloodpressure } from '../../db/schema.js'
import { eq, gte, and, asc } from 'drizzle-orm'

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

    const url = new URL(req.url)
    const days = url.searchParams.get('days')
    const all = url.searchParams.get('all')

    const conditions = [eq(bloodpressure.user_id, userId)]

    if (days && !all) {
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - Number(days))
      conditions.push(gte(bloodpressure.reading_time, cutoff.toISOString()))
    }

    const readings = await db
      .select()
      .from(bloodpressure)
      .where(and(...conditions))
      .orderBy(asc(bloodpressure.reading_time))

    return Response.json(
      { readings },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
          'Surrogate-Control': 'no-store',
        },
      },
    )
  } catch (err) {
    console.error('Get readings error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
