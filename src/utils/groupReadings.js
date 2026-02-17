export function groupReadings(readings) {
  const groups = {}

  for (const r of readings) {
    const date = r.reading_time.split('T')[0]

    if (!groups[date]) {
      groups[date] = { am: [], pm: [] }
    }

    const hour = new Date(r.reading_time).getHours()
    const period = hour < 12 ? 'am' : 'pm'

    groups[date][period].push(r)
  }

  return groups
}
