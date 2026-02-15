import { neon } from '@netlify/neon'

export default async (req) => {
  const sql = neon()

  const { systolic, diastolic, pulse } = await req.json()

  await sql`
    INSERT INTO readings (systolic, diastolic, pulse)
    VALUES (${systolic}, ${diastolic}, ${pulse})
  `

  return Response.json({ ok: true })
}