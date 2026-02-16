import { neon } from "@netlify/neon";
import { drizzle } from "drizzle-orm/neon-http";
import jwt from "jsonwebtoken";
import { bloodpressure } from "../../db/schema.js";

export default async (req) => {
  try {
    // 1. Verify JWT
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return Response.json({ error: "Missing Authorization header" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    let payload;

    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return Response.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const userId = payload.userId;

    // 2. Parse request body
    const { reading_time, systolic, diastolic, heart_rate, period } = await req.json();

    if (!reading_time || !systolic || !diastolic || !heart_rate) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 3. Connect to DB
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const db = drizzle(sql);

    // 4. Insert reading
    await db.insert(bloodpressure).values({
      user_id: userId,
      reading_time,
      systolic,
      diastolic,
      heart_rate,
      period,
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Add BP error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
};
