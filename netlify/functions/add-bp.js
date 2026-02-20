import { neon } from '@netlify/neon'
import { drizzle } from 'drizzle-orm/neon-http'
import jwt from 'jsonwebtoken'
import { bloodpressure } from '../../db/schema.js'

export default async (req) => {
  try {
    // 1. Validate Authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // 2. Verify JWT
    const token = authHeader.replace('Bearer ', '')
    let payload
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const userId = payload.userId

    // 3. Safely parse JSON body
    let body
    try {
      body = await req.json()
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { reading_time, systolic, diastolic, heart_rate } = body

    // 4. Validate required fields
    if (!reading_time || !systolic || !diastolic || !heart_rate) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // 5. Connect to DB
    const sql = neon(process.env.NETLIFY_DATABASE_URL)
    const db = drizzle(sql)

    // 6. Insert reading
    await db.insert(bloodpressure).values({
      user_id: userId,
      reading_time,
      systolic,
      diastolic,
      heart_rate,
    })

    // 7. Return success
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Add BP error:', err)
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
