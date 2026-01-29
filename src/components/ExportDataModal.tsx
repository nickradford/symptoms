import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { toast } from 'sonner'
import type { Entry } from '@/lib/types'

interface ExportDataModalProps {
  isOpen: boolean
  onClose: () => void
  entries: Array<Entry>
}

export function ExportDataModal({ isOpen, onClose, entries }: ExportDataModalProps) {
  const jsonData = JSON.stringify({ version: 1, entries }, null, 2)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonData)
      toast.success('Entries copied to clipboard')
      onClose()
    } catch (error) {
      toast.error('Failed to copy entries')
      console.error('Failed to copy:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <textarea
            readOnly
            value={jsonData}
            className="w-full h-64 p-3 bg-stone-900 text-gray-200 font-mono text-xs rounded border border-stone-700 overflow-auto"
          />
          <Button onClick={handleCopy} className="w-full">
            Copy to Clipboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
