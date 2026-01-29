import type { Entry } from './types'

/**
 * Copy entries as JSON string to clipboard
 */
export async function exportDataToClipboard(entries: Array<Entry>): Promise<void> {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    entries,
  }

  const json = JSON.stringify(data, null, 2)
  await navigator.clipboard.writeText(json)
}

/**
 * Import entries from JSON string
 */
export function importDataFromString(jsonString: string): Array<Entry> {
  const data = JSON.parse(jsonString)

  // Validate data structure
  if (!data.entries || !Array.isArray(data.entries)) {
    throw new Error('Invalid data format: missing entries array')
  }

  return data.entries as Array<Entry>
}
