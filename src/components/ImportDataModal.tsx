import { useState } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Textarea } from './ui/textarea'
import { importDataFromString } from '@/lib/dataExport'
import type { Entry } from '@/lib/types'

interface ImportDataModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (entries: Array<Entry>) => void
}

export function ImportDataModal({ isOpen, onClose, onImport }: ImportDataModalProps) {
  const [jsonInput, setJsonInput] = useState('')
  const [error, setError] = useState('')

  const handleImport = () => {
    try {
      setError('')
      const entries = importDataFromString(jsonInput)
      onImport(entries)
      setJsonInput('')
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Data</DialogTitle>
          <DialogDescription>
            Paste your exported JSON data below to import entries.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste your exported JSON data here..."
            className="font-mono text-sm resize-none max-h-64"
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={!jsonInput.trim()}
              className="flex-1"
            >
              Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
