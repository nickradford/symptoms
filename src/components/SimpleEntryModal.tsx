import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { CATEGORIES } from '@/lib/types'
import { formatForInput, parseLocalInput } from '@/lib/time'
import type { Category } from '@/lib/types'

interface SimpleEntryModalProps {
  category: Exclude<Category, 'symptom'>
  isOpen: boolean
  onClose: () => void
  onSubmit: (items: Array<string>, timestamp: string) => void
  suggestions: Array<string>
}

export function SimpleEntryModal({
  category,
  isOpen,
  onClose,
  onSubmit,
}: SimpleEntryModalProps) {
  const [input, setInput] = useState('')
  const [timestamp, setTimestamp] = useState(
    formatForInput(new Date().toISOString()),
  )
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setInput('')
      setTimestamp(formatForInput(new Date().toISOString()))
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [isOpen])

  const handleSubmit = () => {
    const items = input.split(',').map((s) => s.trim()).filter((s) => s.length > 0)
    if (items.length === 0) return
    onSubmit(items, parseLocalInput(timestamp))
    setInput('')
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const placeholders: Record<Exclude<Category, 'symptom'>, string> = {
    eat: 'e.g., chicken, rice, salad',
    drink: 'e.g., water, coffee, tea',
    meds: 'e.g., aspirin, vitamin D',
    other: 'e.g., exercise, rest',
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{CATEGORIES[category].label}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Simple text input */}
          <div className="space-y-2">
            <Label htmlFor={`entry-${category}`}>Entry</Label>
            <Input
              ref={inputRef}
              id={`entry-${category}`}
              type="text"
              placeholder={placeholders[category]}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
            <p className="text-xs text-gray-500">
              Use commas to add multiple items at once
            </p>
          </div>

          {/* Timestamp */}
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
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
              disabled={input.trim().length === 0}
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
