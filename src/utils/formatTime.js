import { parseLocalDateTime } from './parseLocalDateTime'

export function formatTime(ts) {
  const d = parseLocalDateTime(ts)
  return d.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit'
  })
}
