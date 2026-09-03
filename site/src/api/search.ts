import type { HeadingHit } from '../types'
import { fetchJson } from './http'

export type { HeadingHit }

export type FtsBook = { book_id: string; book_name?: string; count: number }
export type FtsLine = {
  book_id: string
  para_id: number
  line_id?: number
  pali?: string
  translation?: string
  slug?: string
}

function matches(haystack: string, needle: string) {
  return haystack.toLocaleLowerCase().includes(needle.toLocaleLowerCase())
}

let headingsPromise: Promise<HeadingHit[]> | null = null

function loadHeadings() {
  if (!headingsPromise) {
    headingsPromise = fetchJson<HeadingHit[]>('/data/headings.json.gz').catch(async () => {
      const hits = await fetchJson<HeadingHit[]>('/api/search?headings=1&q=aa')
      return hits
    })
  }
  return headingsPromise
}

export async function searchHeadings(_baseUrl: string, q: string): Promise<HeadingHit[]> {
  const query = q.trim()
  if (query.length < 2) return []
  try {
    const headings = await loadHeadings()
    const hits: HeadingHit[] = []
    for (const h of headings) {
      if (matches(h.title, query) || matches(h.book_name, query) || matches(h.book_id, query)) {
        hits.push(h)
        if (hits.length >= 12) break
      }
    }
    return hits
  } catch {
    return []
  }
}

export async function ftsSearch(_baseUrl: string, q: string, _lang: string, bookId?: string) {
  const query = q.trim()
  if (!query) return { books: [] as FtsBook[], results: [] as FtsLine[], total: 0 }
  try {
    const headings = await loadHeadings()
    const results: FtsLine[] = []
    const counts = new Map<string, FtsBook>()
    for (const h of headings) {
      if (bookId && h.book_id !== bookId) continue
      const blob = `${h.title} ${h.pali || ''} ${h.translation || ''}`
      if (!matches(blob, query)) continue
      const entry = counts.get(h.book_id) || { book_id: h.book_id, book_name: h.book_name, count: 0 }
      entry.count += 1
      counts.set(h.book_id, entry)
      if (results.length < 40) {
        results.push({
          book_id: h.book_id,
          para_id: h.para_id,
          pali: h.pali || h.title,
          translation: h.translation,
          slug: h.slug,
        })
      }
    }
    const books = [...counts.values()].sort((a, b) => b.count - a.count)
    return { books, results, total: books.reduce((n, b) => n + b.count, 0) }
  } catch {
    return { books: [] as FtsBook[], results: [] as FtsLine[], total: 0 }
  }
}
