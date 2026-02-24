import { integer, pgTable, varchar, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password_hash: varchar('password_hash', { length: 255 }).notNull(),
  tos_accepted: boolean('tos_accepted').notNull().default(false),
  created_at: timestamp('created_at').defaultNow(),
})

export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const bloodpressure = pgTable('bloodpressure', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id')
    .notNull()
    .references(() => users.id),
  medication_taken: boolean('medication_taken').default(false),
  reading_time: varchar('reading_time', { length: 30 }).notNull(),
  systolic: integer('systolic').notNull(),
  diastolic: integer('diastolic').notNull(),
  heart_rate: integer('heart_rate').notNull(),
  created_at: timestamp('created_at').defaultNow(),
})

export const symptoms = pgTable('symptoms', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull().unique(),
})

export const bloodpressureSymptoms = pgTable('bloodpressure_symptoms', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  readingId: integer('reading_id')
    .notNull()
    .references(() => bloodpressure.id, { onDelete: 'cascade' }),
  symptomId: integer('symptom_id')
    .notNull()
    .references(() => symptoms.id, { onDelete: 'cascade' }),
})
