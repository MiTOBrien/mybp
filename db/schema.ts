import { integer, pgTable, varchar, serial, timestamp, text } from 'drizzle-orm/pg-core';
import { t } from 'vue-router/dist/index-Cu9B0wDz.mjs';

export const posts = pgTable('posts', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar({ length: 255 }).notNull(),
    content: text().notNull().default('')
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password_hash: varchar('password_hash', { length: 255 }).notNull(),
  created_at: timestamp('created_at').defaultNow(),
});

export const bloodpressure = pgTable('bloodpressure', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id')
    .notNull()
    .references(() => users.id),
  reading_time: timestamp('reading_time').defaultNow().notNull(),
  systolic: integer('systolic').notNull(),
  diastolic: integer('diastolic').notNull(),
  heart_rate: integer('heart_rate').notNull(),
  period: varchar('period', { length: 10 }), // 'AM' | 'PM'
  created_at: timestamp('created_at').defaultNow(),
});
