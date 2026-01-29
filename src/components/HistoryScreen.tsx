import { useState } from 'react'
import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { Input } from './ui/input'
import { EntryCard } from './EntryCard'
import { EditEntryModal } from './EditEntryModal'
import { Header } from './Header'
import { CATEGORIES } from '@/lib/types'
import type { Category, Entry } from '@/lib/types'

interface HistoryScreenProps {
  entries: Array<Entry>
  onEditEntry: (entry: Entry) => void
  onDeleteEntry: (id: string) => void
  onImportEntries?: (entries: Array<Entry>) => void
}

export function HistoryScreen({
  entries,
  onEditEntry,
  onDeleteEntry,
  onImportEntries,
}: HistoryScreenProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null)

  // Filter entries
  let filtered = entries

  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    filtered = filtered.filter(
      (e) =>
        e.label.toLowerCase().includes(q) ||
        e.notes?.toLowerCase().includes(q),
    )
  }

  if (selectedCategory) {
    filtered = filtered.filter((e) => e.category === selectedCategory)
  }

  // Sort by timestamp, newest first
  const sorted = [...filtered].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 to-stone-950">
      <Header entries={entries} onImportEntries={onImportEntries} />

      {/* Search */}
      <div className="max-w-2xl mx-auto px-4 py-4 sm:px-6">
        <div className="relative">
          <MagnifyingGlass
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <Input
            type="text"
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-stone-700 rounded"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="flex gap-2 overflow-x-auto pb-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 whitespace-nowrap text-sm font-medium transition-colors flex items-center gap-2 ${
              selectedCategory === null
                ? 'bg-stone-700 text-white'
                : 'bg-stone-800 text-gray-400 hover:text-white'
            }`}
          >
            All
          </button>
          {Object.entries(CATEGORIES).map(([key, info]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as Category)}
              className={`px-4 py-2 whitespace-nowrap text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedCategory === key
                  ? `${info.color} text-white`
                  : 'bg-stone-800 text-gray-400 hover:text-white'
              }`}
            >
              <div className={`w-3 h-3 ${info.color}`} />
              {info.label}
            </button>
          ))}
        </div>
      </div>

      {/* Entries List */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-20">
        {sorted.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchQuery || selectedCategory
                ? 'No entries match your filters'
                : 'No entries yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-3 py-4">
            {sorted.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onEdit={setEditingEntry}
                onDelete={onDeleteEntry}
              />
            ))}
          </div>
        )}
      </div>

      <EditEntryModal
        entry={editingEntry}
        isOpen={editingEntry !== null}
        onClose={() => setEditingEntry(null)}
        onSave={(entry) => {
          onEditEntry(entry.id, entry)
          setEditingEntry(null)
        }}
      />
    </div>
  )
}
