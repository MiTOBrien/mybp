import { neon } from "@netlify/neon";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.NETLIFY_DATABASE_URL);
export const db = drizzle(sql);