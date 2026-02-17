export function parseLocalDateTime(ts) {
  // ts example: "2026-02-10T06:55"
  const [datePart, timePart] = ts.split("T")

  const [year, month, day] = datePart.split("-").map(Number)
  const [hour, minute] = timePart.split(":").map(Number)

  // IMPORTANT: month - 1 because JS months are 0-based
  return new Date(year, month - 1, day, hour, minute)
}
