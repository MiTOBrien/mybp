import { parseLocalDateTime } from './parseLocalDateTime'

export function groupReadings(readings) {
  const groups = {}

  for (const r of readings) {
    const d = parseLocalDateTime(r.reading_time)

    // Build a YYYY-MM-DD key from the *local* date
    const dateKey = [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0'),
    ].join('-')

    if (!groups[dateKey]) {
      groups[dateKey] = { am: [], pm: [] }
    }

    const hour = d.getHours()
    const period = hour < 12 ? 'am' : 'pm'

    groups[dateKey][period].push(r)
  }

  return groups
}
