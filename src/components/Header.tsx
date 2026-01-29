import { useRef, useState } from 'react'
import { DotsThreeVertical } from '@phosphor-icons/react'
import { useLocation } from '@tanstack/react-router'
import { Button } from './ui/button'
import { ImportDataModal } from './ImportDataModal'
import { ExportDataModal } from './ExportDataModal'
import type { Entry } from '@/lib/types'

interface HeaderProps {
  entries: Array<Entry>
  onImportEntries?: (entries: Array<Entry>) => void
}

export function Header({ entries, onImportEntries }: HeaderProps) {
  const location = useLocation()
  const [showMenu, setShowMenu] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const isHome = location.pathname === '/'
  const isHistory = location.pathname === '/history'

  const handleExportClick = () => {
    setShowMenu(false)
    setShowExportModal(true)
  }

  const handleImportClick = () => {
    setShowMenu(false)
    setShowImportModal(true)
  }

  // Close menu when clicking outside
  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!menuRef.current?.contains(e.target as Node)) {
      setShowMenu(false)
    }
  }

  return (
    <>
      <div
        className="sticky top-0 z-40 bg-stone-900 border-b border-stone-800 px-4 py-4 sm:px-6"
        onClick={handleMenuClick}
      >
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

          {/* Menu button */}
          <div className="relative" ref={menuRef}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMenu(!showMenu)}
              className="h-10 w-10 p-0"
            >
              <DotsThreeVertical size={20} />
            </Button>

            {/* Dropdown menu */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-stone-800 border border-stone-700 rounded-md shadow-lg z-50">
                <button
                  onClick={handleExportClick}
                  className="w-full text-left px-4 py-2 hover:bg-stone-700 transition-colors text-sm"
                >
                  Export Data
                </button>
                <button
                  onClick={handleImportClick}
                  className="w-full text-left px-4 py-2 hover:bg-stone-700 transition-colors text-sm border-t border-stone-700"
                >
                  Import Data
                </button>
              </div>
            )}
          </div>
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
