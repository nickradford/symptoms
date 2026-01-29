# Symptoms - Health Tracking App Implementation

A mobile-first, client-side health tracking web app built with React 19, TanStack Start, TailwindCSS, and shadcn/ui.

## Core Features

### Data Model
- **Five explicit categories**: eat, drink, meds, other, symptom
- **Color-coded** consistently across the app
- **Base entry fields**: id, category, label, timestamp (UTC, rendered in local time), createdAt, optional notes
- **Symptom entries**: structured with severity (1-10) scale

### Home Screen
Minimal, low-cognitive-load design:
- Category buttons (Eat, Drink, Meds, Other, Symptom)
- Last 10 entries displayed chronologically
- Navigation to History view

### Logging UX
**Simple categories** (Eat/Drink/Meds/Other):
- Modal with text input
- Comma-separated values create multiple entries (e.g., "chicken, rice, salad" → 3 entries)
- Timestamp editable (defaults to now)
- Auto-focused input on open
- Fuzzy-matched autocomplete suggestions scoped to category

**Symptom category**:
- Structured modal with name, severity (1-10 slider), notes, timestamp
- One symptom per entry

### History View
- Full entry list, newest first
- Text search across labels and notes
- Filter by category
- Edit/delete actions on each entry

### Data Persistence
- **localStorage** as primary storage with version tracking
- Abstract storage layer for future IndexedDB migration
- Safe schema evolution support

## Architecture

```
src/
├── lib/
│   ├── types.ts          # Category, Entry, SymptomEntry types + color mapping
│   ├── storage.ts        # Abstract localStorage API
│   ├── useEntries.ts     # Main state hook
│   ├── fuzzy.ts          # Autocomplete fuzzy matching
│   └── time.ts           # UTC ↔ local time conversion
├── components/
│   ├── SimpleEntryModal.tsx   # Eat/Drink/Meds/Other dialog
│   ├── SymptomModal.tsx       # Structured symptom dialog
│   ├── EditEntryModal.tsx     # Edit any entry
│   ├── EntryCard.tsx          # Entry display component
│   ├── HomeScreen.tsx         # Home page
│   ├── HistoryScreen.tsx      # History page with search/filter
│   └── ui/                    # shadcn/ui components
└── routes/
    ├── __root.tsx        # Root layout
    └── index.tsx         # App entry point with screen navigation

```

## UI Components Used
- Dialog (for modals)
- Input (text fields)
- Textarea (for notes)
- Button (with variants)
- Label (form labels)
- Slider (severity scale)
- Badge (category indicators)

## Code Quality
- Strict TypeScript with no unused locals/params
- ESLint + Prettier enforced
- React 19 functional components
- Explicit imports using @/* alias
- Comments on non-obvious decisions
- Future-ready structure (analytics-compatible without refactors)

## Offline-First
- All data stored in localStorage
- No network requests
- Works completely offline
- Can be synced to backend later

## Mobile Optimizations
- Touch-friendly button sizes
- Bottom-sheet style modals on mobile, centered on desktop
- Responsive grid (2 cols on mobile, 5 on desktop)
- Horizontal scrolling category filters
