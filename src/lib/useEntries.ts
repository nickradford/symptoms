import { useEffect, useState } from 'react'
import { storage } from './storage'
import type { BaseEntry, Category, Entry, SymptomEntry } from './types'

export function useEntries() {
  const [entries, setEntries] = useState<Array<Entry>>(() => storage.getAll())

  // Sync with storage changes
  useEffect(() => {
    const loaded = storage.getAll()
    setEntries(loaded)
  }, [])

  const addEntry = (entry: Omit<Entry, 'id' | 'createdAt'>) => {
    const now = new Date().toISOString()
    const newEntry: Entry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: now,
    } as Entry

    const updated = storage.add(newEntry)
    setEntries(updated)
    return newEntry
  }

  const addMultipleEntries = (
    items: Array<string>,
    category: Exclude<Category, 'symptom'>,
    timestamp?: string,
  ) => {
    const now = new Date().toISOString()
    const ts = timestamp || now

    const newEntries: Array<BaseEntry> = items
      .map((label) => ({
        id: crypto.randomUUID(),
        category,
        label: label.trim(),
        timestamp: ts,
        createdAt: now,
      }))
      .filter((e) => e.label.length > 0)

    if (newEntries.length === 0) return []

    let updated = entries
    newEntries.forEach((entry) => {
      updated = storage.add(entry)
    })
    setEntries(updated)
    return newEntries
  }

  const addSymptom = (
    name: string,
    severity: number,
    timestamp?: string,
    notes?: string,
  ) => {
    const now = new Date().toISOString()
    const newEntry: SymptomEntry = {
      id: crypto.randomUUID(),
      category: 'symptom',
      label: name,
      severity,
      timestamp: timestamp || now,
      createdAt: now,
      notes,
    }

    const updated = storage.add(newEntry)
    setEntries(updated)
    return newEntry
  }

  const updateEntry = (id: string, updates: Partial<Entry>) => {
    const updated = storage.update(id, updates)
    setEntries(updated)
  }

  const deleteEntry = (id: string) => {
    const updated = storage.delete(id)
    setEntries(updated)
  }

  const getRecentEntries = (limit: number = 10) => {
    return entries.slice(-limit).reverse()
  }

  const getEntriesByCategory = (category: Category) => {
    return entries.filter((e) => e.category === category)
  }

  const searchEntries = (query: string) => {
    const q = query.toLowerCase()
    return entries.filter(
      (e) =>
        e.label.toLowerCase().includes(q) || e.notes?.toLowerCase().includes(q),
    )
  }

  return {
    entries,
    addEntry,
    addMultipleEntries,
    addSymptom,
    updateEntry,
    deleteEntry,
    getRecentEntries,
    getEntriesByCategory,
    searchEntries,
  }
}
