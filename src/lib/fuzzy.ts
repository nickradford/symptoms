/**
 * Simple fuzzy matching for autocomplete suggestions.
 * Returns score 0-1 where 1 is perfect match.
 */
export function fuzzyMatch(query: string, text: string): number {
  const q = query.toLowerCase()
  let t = text.toLowerCase()

  if (q === t) return 1
  if (!q) return 0
  if (!t.includes(q)) return 0

  let score = 0
  let prevMatch = false

  for (let i = 0; i < q.length; i++) {
    const found = t.indexOf(q[i])
    if (found === -1) return 0

    // Bonus for consecutive matches
    if (i > 0 && prevMatch) {
      score += 0.05
    }

    // Bonus for match at start of word
    if (found === 0 || t[found - 1] === ' ') {
      score += 0.2
    }

    prevMatch = found === 0 || t[found - 1] === ' '
    t = t.slice(found + 1)
  }

  return Math.min(score, 1)
}

export function getFuzzyMatches(
  query: string,
  items: Array<string>,
  limit: number = 5,
): Array<string> {
  if (!query) return []

  return items
    .map((item) => ({ item, score: fuzzyMatch(query, item) }))
    .filter((x) => x.score > 0.2)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.item)
}
