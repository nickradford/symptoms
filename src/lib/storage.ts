import type { Entry } from './types'

const STORAGE_KEY = 'symptoms:entries'
const VERSION = 1

interface StorageData {
  version: number
  entries: Array<Entry>
}

/**
 * Abstract storage layer for future IndexedDB migration.
 * Currently uses localStorage.
 */
export const storage = {
  getAll(): Array<Entry> {
    if (typeof window === 'undefined') return []
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (!data) return []
      const parsed = JSON.parse(data) as StorageData
      // Handle schema evolution
      if (parsed.version !== VERSION) {
        return migrateSchema(parsed)
      }
      return parsed.entries
    } catch {
      console.error('Failed to load entries from storage')
      return []
    }
  },

  save(entries: Array<Entry>): void {
    if (typeof window === 'undefined') return
    try {
      const data: StorageData = { version: VERSION, entries }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      console.error('Failed to save entries to storage')
    }
  },

  add(entry: Entry): Array<Entry> {
    const entries = this.getAll()
    entries.push(entry)
    this.save(entries)
    return entries
  },

  update(id: string, updates: Partial<Entry>): Array<Entry> {
    const entries = this.getAll()
    const index = entries.findIndex((e) => e.id === id)
    if (index === -1) return entries
    entries[index] = { ...entries[index], ...updates }
    this.save(entries)
    return entries
  },

  delete(id: string): Array<Entry> {
    const entries = this.getAll().filter((e) => e.id !== id)
    this.save(entries)
    return entries
  },
}

// Schema migration logic for future updates
function migrateSchema(data: StorageData): Array<Entry> {
  // Add migration steps as needed
  return data.entries
}
