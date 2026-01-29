import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Slider } from './ui/slider'
import { Textarea } from './ui/textarea'
import { CATEGORIES } from '@/lib/types'
import { formatForInput, parseLocalInput } from '@/lib/time'

interface SymptomModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string, severity: number, timestamp: string, notes?: string) => void
}

export function SymptomModal({
  isOpen,
  onClose,
  onSubmit,
}: SymptomModalProps) {
  const [name, setName] = useState('')
  const [severity, setSeverity] = useState([5])
  const [notes, setNotes] = useState('')
  const [timestamp, setTimestamp] = useState(
    formatForInput(new Date().toISOString()),
  )
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0)
      setName('')
      setSeverity([5])
      setNotes('')
      setTimestamp(formatForInput(new Date().toISOString()))
    }
  }, [isOpen])

  const handleSubmit = () => {
    if (name.trim().length === 0) return
    const trimmedNotes = notes.trim()
    onSubmit(
      name.trim(),
      severity[0],
      parseLocalInput(timestamp),
      trimmedNotes.length > 0 ? trimmedNotes : undefined,
    )
    setName('')
    setSeverity([5])
    setNotes('')
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full sm:max-w-sm max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{CATEGORIES.symptom.label}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Symptom Name */}
          <div className="space-y-2">
            <Label htmlFor="symptom">Symptom</Label>
            <Input
              ref={inputRef}
              id="symptom"
              type="text"
              placeholder="e.g., headache, nausea, fatigue"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Severity */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="severity">Severity</Label>
              <span className="text-sm font-semibold">{severity[0]}/10</span>
            </div>
            <Slider
              id="severity"
              min={1}
              max={10}
              step={1}
              value={severity}
              onValueChange={setSeverity}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Mild</span>
              <span>Severe</span>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="symptom-notes">Notes (optional)</Label>
            <Textarea
              id="symptom-notes"
              name="symptom-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Additional details..."
              rows={3}
            />
          </div>

          {/* Timestamp */}
          <div className="space-y-2">
            <Label htmlFor="symptom-time">Time</Label>
            <Input
              id="symptom-time"
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
            <Button
              onClick={handleSubmit}
              disabled={name.trim().length === 0}
              className="flex-1"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
