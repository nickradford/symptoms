import { DotsThreeVertical } from '@phosphor-icons/react'
import { useLocation } from '@tanstack/react-router'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { ImportDataModal } from './ImportDataModal'
import { ExportDataModal } from './ExportDataModal'
import { useState } from 'react'
import type { Entry } from '@/lib/types'

interface HeaderProps {
  entries: Array<Entry>
  onImportEntries?: (entries: Array<Entry>) => void
}

export function Header({ entries, onImportEntries }: HeaderProps) {
  const location = useLocation()
  const [showImportModal, setShowImportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

  const isHome = location.pathname === '/'
  const isHistory = location.pathname === '/history'

  return (
    <>
      <div className="sticky top-0 z-40 bg-stone-900 border-b border-stone-800 px-4 py-4 sm:px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          {/* Center nav */}
          <div className="flex items-center gap-6">
            <a
              href="/"
              className={`text-sm font-medium transition-colors ${
                isHome ? 'text-white' : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Symptoms
            </a>
            <a
              href="/history"
              className={`text-sm font-medium transition-colors ${
                isHistory ? 'text-white' : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              History
            </a>
          </div>

          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10 w-10 p-0">
                <DotsThreeVertical size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowExportModal(true)}>
                Export Data
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowImportModal(true)}>
                Import Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ExportDataModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        entries={entries}
      />

      <ImportDataModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={onImportEntries || (() => {})}
      />
    </>
  )
}
