import { useState } from 'react'
import { Pencil, Trash } from '@phosphor-icons/react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import type { Entry } from '@/lib/types'
import { CATEGORIES } from '@/lib/types'
import { formatLocalTime, getTimeAgo } from '@/lib/time'

interface EntryCardProps {
  entry: Entry
  onEdit: (entry: Entry) => void
  onDelete: (id: string) => void
  compact?: boolean
}

export function EntryCard({
  entry,
  onEdit,
  onDelete,
  compact = false,
}: EntryCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const categoryInfo = CATEGORIES[entry.category]
  const isSympotm = entry.category === 'symptom'

  const handleDeleteConfirm = () => {
    onDelete(entry.id)
    setShowDeleteConfirm(false)
  }

  return (
    <>
      <div className="border border-stone-800 rounded-none bg-stone-800 hover:bg-stone-700 transition-colors">
        {/* Header row with badge, label, and actions */}
        <div className="flex items-center justify-between gap-3 p-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Badge className={`${categoryInfo.color} text-white whitespace-nowrap flex-shrink-0`}>
              {categoryInfo.label}
            </Badge>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2 flex-wrap">
                <p className="font-medium text-sm">{entry.label}</p>
                {isSympotm && entry.category === 'symptom' && 'severity' in entry && (
                  <p className="text-xs text-gray-600">Severity: {entry.severity}/10</p>
                )}
              </div>
            </div>
          </div>
          {!compact && (
            <div className="flex gap-1 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(entry)}
                className="h-8 w-8 p-0"
                aria-label="Edit"
              >
                <Pencil size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                aria-label="Delete"
              >
                <Trash size={16} />
              </Button>
            </div>
          )}
        </div>

        {/* Notes (if present) */}
        {entry.notes && (
          <div className="px-3 pb-2 text-sm text-gray-300 break-words">{entry.notes}</div>
        )}

        {/* Timestamp footer */}
        <div className="flex items-center gap-2 px-3 py-2 text-xs text-gray-500 border-t border-stone-700 bg-stone-900">
          <span>{formatLocalTime(entry.timestamp)}</span>
          <span>•</span>
          <span>{getTimeAgo(entry.timestamp)}</span>
        </div>
      </div>

      <DeleteConfirmDialog
        isOpen={showDeleteConfirm}
        itemLabel={entry.label}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  )
}
