import { createFileRoute } from '@tanstack/react-router'
import { HistoryScreen } from '@/components/HistoryScreen'
import { useEntries } from '@/lib/useEntries'
import { storage } from '@/lib/storage'
import type { Entry } from '@/lib/types'

export const Route = createFileRoute('/history')({
  component: HistoryPage,
})

function HistoryPage() {
  const {
    entries,
    updateEntry,
    deleteEntry,
  } = useEntries()

  const handleImportEntries = (importedEntries: Array<Entry>) => {
    const merged = [...entries]
    importedEntries.forEach((importedEntry) => {
      const existing = merged.find((e) => e.id === importedEntry.id)
      if (!existing) {
        merged.push(importedEntry)
      }
    })
    storage.save(merged)
    window.location.reload()
  }

  return (
    <HistoryScreen
      entries={entries}
      onEditEntry={updateEntry}
      onDeleteEntry={deleteEntry}
      onImportEntries={handleImportEntries}
    />
  )
}
