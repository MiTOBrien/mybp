console.log('LOGIN FUNCTION LOADED')
import { db } from '../db/client.js'
import { users } from '../../db/schema.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { eq } from 'drizzle-orm'

export default async function (request) {
  try {
    const raw = await request.text()
    console.log('RAW BODY:', raw)

    let body = {}
    try {
      body = raw ? JSON.parse(raw) : {}
    } catch (e) {
      console.log('JSON PARSE ERROR:', e)
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 })
    }

    const parsedUser = body.user || {}
    const email = parsedUser.email
    const password = parsedUser.password

    console.log('PARSED EMAIL:', email)
    console.log('PARSED PASSWORD:', password)

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password required' }), { status: 400 })
    }

    const rows = await db.select().from(users).where(eq(users.email, email))
    const user = rows[0]

    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 })
    }

    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 })
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    return new Response(
      JSON.stringify({
        status: {
          code: 200,
          message: 'Logged in successfully',
          token,
          data: { user: { id: user.id, email: user.email } },
        },
      }),
      { status: 200 },
    )
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })
  }
}
