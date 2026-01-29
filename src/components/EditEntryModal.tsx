import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Slider } from './ui/slider'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import type { Entry } from '@/lib/types'
import { CATEGORIES } from '@/lib/types'
import { formatForInput, parseLocalInput } from '@/lib/time'

interface EditEntryModalProps {
  entry: Entry | null
  isOpen: boolean
  onClose: () => void
  onSave: (entry: Entry) => void
}

export function EditEntryModal({
  entry,
  isOpen,
  onClose,
  onSave,
}: EditEntryModalProps) {
  const [label, setLabel] = useState('')
  const [notes, setNotes] = useState('')
  const [timestamp, setTimestamp] = useState('')
  const [severity, setSeverity] = useState([5])

  useEffect(() => {
    if (entry && isOpen) {
      setLabel(entry.label)
      setNotes(entry.notes || '')
      setTimestamp(formatForInput(entry.timestamp))
      if (entry.category === 'symptom' && 'severity' in entry) {
        setSeverity([entry.severity])
      }
    }
  }, [entry, isOpen])

  const handleSave = () => {
    if (!entry || label.trim().length === 0) return

    const trimmedNotes = notes.trim()
    const updated: Entry = {
      ...entry,
      label: label.trim(),
      notes: trimmedNotes.length > 0 ? trimmedNotes : undefined,
      timestamp: parseLocalInput(timestamp),
    } as Entry

    if (entry.category === 'symptom' && 'severity' in updated) {
      ;(updated as any).severity = severity[0]
    }

    onSave(updated)
    onClose()
  }

  if (!entry || !isOpen) return null

  const categoryInfo = CATEGORIES[entry.category]
  const isSympotm = entry.category === 'symptom'

  return (
    <Dialog open={isOpen && entry !== null} onOpenChange={onClose}>
      <DialogContent className="w-full sm:max-w-sm max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Entry</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Category badge (read-only) */}
          <div>
            <Badge className={`${categoryInfo.color} text-white`}>
              {categoryInfo.label}
            </Badge>
          </div>

          {/* Label */}
          <div className="space-y-2">
            <Label htmlFor="edit-entry">Entry</Label>
            <Input
              id="edit-entry"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>

          {/* Severity for symptoms */}
          {isSympotm && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="edit-severity">Severity</Label>
                <span className="text-sm font-semibold">{severity[0]}/10</span>
              </div>
              <Slider
                id="edit-severity"
                min={1}
                max={10}
                step={1}
                value={severity}
                onValueChange={setSeverity}
              />
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea
              id="edit-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault()
                  handleSave()
                }
              }}
              placeholder="Optional details..."
              rows={3}
            />
          </div>

          {/* Timestamp */}
          <div className="space-y-2">
            <Label htmlFor="edit-time">Time</Label>
            <Input
              id="edit-time"
              type="datetime-local"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
