import { db } from './index'
import { symptoms } from './schema'
import { eq } from 'drizzle-orm'

const SYMPTOMS = [
  'Chest Pain',
  'Shortness of Breath',
  'Back Pain',
  'Numbness',
  'Weakness',
  'Changes in Vision',
  'Difficulty Speaking',
]

async function seedSymptoms() {
  for (const name of SYMPTOMS) {
    // Check if it already exists
    const existing = await db.select().from(symptoms).where(eq(symptoms.name, name))

    if (existing.length === 0) {
      await db.insert(symptoms).values({ name })
      console.log(`Inserted symptom: ${name}`)
    } else {
      console.log(`Skipped (already exists): ${name}`)
    }
  }

  console.log('Done seeding symptoms.')
  process.exit(0)
}

seedSymptoms()
