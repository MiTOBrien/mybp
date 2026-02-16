import { integer, pgTable, varchar, serial, timestamp, text } from 'drizzle-orm/pg-core';

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
  systolic1: integer('systolic1').notNull(),
  diastolic1: integer('diastolic1').notNull(),
  heart_rate1: integer('heart_rate1').notNull(),
  systolic2: integer('systolic2').notNull(),
  diastolic2: integer('diastolic2').notNull(),
  heart_rate2: integer('heart_rate2').notNull(),
  created_at: timestamp('created_at').defaultNow(),
})