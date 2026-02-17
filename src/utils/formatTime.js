export function formatTime(ts) {
  const d = new Date(ts)
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}
