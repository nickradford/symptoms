export type Category = 'eat' | 'drink' | 'meds' | 'other' | 'symptom'

export interface BaseEntry {
  id: string
  category: Category
  label: string
  timestamp: string // ISO string, UTC
  createdAt: string // ISO string, UTC
  notes?: string
}

export interface SymptomEntry extends BaseEntry {
  category: 'symptom'
  severity: number // 1-10
}

export type Entry = BaseEntry | SymptomEntry

export const CATEGORIES: Record<Category, { label: string; color: string }> = {
  eat: { label: 'Eat', color: 'bg-orange-600' },
  drink: { label: 'Drink', color: 'bg-blue-600' },
  meds: { label: 'Meds', color: 'bg-violet-600' },
  other: { label: 'Other', color: 'bg-gray-600' },
  symptom: { label: 'Symptom', color: 'bg-rose-600' },
}

export const CATEGORY_TEXT_COLOR: Record<Category, string> = {
  eat: 'text-orange-600',
  drink: 'text-blue-600',
  meds: 'text-red-600',
  other: 'text-gray-600',
  symptom: 'text-purple-600',
}
