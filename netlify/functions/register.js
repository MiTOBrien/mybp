import { db } from "../db/client.js";
import { users } from "../../db/schema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

export default async function (request) {
  try {
    const body = await request.json();
    const { email, password } = body.user || {};

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password required" }), { status: 400 });
    }

    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) {
      return new Response(JSON.stringify({ error: "Email already in use" }), { status: 409 });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const [inserted] = await db
      .insert(users)
      .values({ email, password_hash })
      .returning({ id: users.id, email: users.email });

    const token = jwt.sign(
      { userId: inserted.id, email: inserted.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return new Response(JSON.stringify({ token, user: inserted }), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}