import { useState } from 'react'
import { SimpleEntryModal } from './SimpleEntryModal'
import { SymptomModal } from './SymptomModal'
import { EntryCard } from './EntryCard'
import { EditEntryModal } from './EditEntryModal'
import { Header } from './Header'
import { CATEGORIES } from '@/lib/types'
import type { Category, Entry } from '@/lib/types'

interface HomeScreenProps {
  entries: Array<Entry>
  onAddEntry: (
    items: Array<string>,
    category: Exclude<Category, 'symptom'>,
    timestamp: string,
  ) => void
  onAddSymptom: (name: string, severity: number, timestamp: string, notes?: string) => void
  onEditEntry: (entry: Entry) => void
  onDeleteEntry: (id: string) => void
  onImportEntries?: (entries: Array<Entry>) => void
}

export function HomeScreen({
  entries,
  onAddEntry,
  onAddSymptom,
  onEditEntry,
  onDeleteEntry,
  onImportEntries,
}: HomeScreenProps) {
  const [openCategory, setOpenCategory] = useState<Category | null>(null)
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null)

  const simpleCategories: Array<Exclude<Category, 'symptom'>> = [
    'eat',
    'drink',
    'meds',
    'other',
  ]

  // Get category-specific suggestions
  const getCategorySuggestions = (category: Exclude<Category, 'symptom'>) => {
    const categoryEntries = entries.filter((e) => e.category === category)
    const labels = categoryEntries.map((e) => e.label)
    // Return unique labels, most recent first
    const unique = [...new Set(labels)]
    return unique.reverse()
  }

  const recentEntries = [...entries]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 to-stone-950">
      <Header entries={entries} onImportEntries={onImportEntries} />

      {/* Category Buttons */}
      <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[...simpleCategories, 'symptom'].map((category) => {
            const info = CATEGORIES[category]
            return (
              <button
                key={category}
                onClick={() => setOpenCategory(category as Category)}
                className={`${info.color} text-white h-16 font-semibold hover:opacity-90 active:scale-95 transition-all`}
              >
                {info.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Recent Entries */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-20">
        <h2 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">
          Recent Entries
        </h2>
        {recentEntries.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No entries yet. Start logging!</p>
        ) : (
          <div className="space-y-3">
            {recentEntries.map((entry) => (
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

      {/* Modals */}
      {simpleCategories.map((category) => (
        <SimpleEntryModal
          key={category}
          category={category}
          isOpen={openCategory === category}
          onClose={() => setOpenCategory(null)}
          onSubmit={(items, timestamp) => {
            onAddEntry(items, category, timestamp)
            setOpenCategory(null)
          }}
          suggestions={getCategorySuggestions(category)}
        />
      ))}

      <SymptomModal
        isOpen={openCategory === 'symptom'}
        onClose={() => setOpenCategory(null)}
        onSubmit={(name, severity, timestamp, notes) => {
          onAddSymptom(name, severity, timestamp, notes)
          setOpenCategory(null)
        }}
      />

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
