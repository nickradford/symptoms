/**
 * Format ISO UTC timestamp as local time string.
 * Shows only time if today, otherwise shows date and time.
 * Removes leading zeros from hours (8:00 PM instead of 08:00 PM).
 */
export function formatLocalTime(isoString: string): string {
  const date = new Date(isoString)
  const today = new Date()
  
  // Check if the date is today
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()

  // Format time without leading zero
  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const period = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours || 12 // 12-hour format
  const timeStr = `${hours}:${minutes} ${period}`

  if (isToday) {
    return timeStr
  }

  // Format date
  const month = date.toLocaleString('en-US', { month: 'short' })
  const day = date.getDate()
  return `${month} ${day}, ${timeStr}`
}

/**
 * Format for display in editing UI (YYYY-MM-DDTHH:mm format)
 */
export function formatForInput(isoString: string): string {
  const date = new Date(isoString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * Convert local datetime-local input to ISO UTC string.
 */
export function parseLocalInput(input: string): string {
  const date = new Date(input)
  return date.toISOString()
}

/**
 * Get time ago string (e.g., "2h ago", "now").
 */
export function getTimeAgo(isoString: string): string {
  const now = new Date()
  const then = new Date(isoString)
  const diff = now.getTime() - then.getTime()
  const seconds = Math.floor(diff / 1000)

  if (seconds < 60) return 'now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
