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

export async function searchHeadings(_baseUrl: string, q: string): Promise<HeadingHit[]> {
  const query = q.trim()
  if (query.length < 2) return []
  try {
    return await fetchJson<HeadingHit[]>(`/api/search?headings=1&q=${encodeURIComponent(query)}`)
  } catch {
    return []
  }
}

export async function ftsSearch(_baseUrl: string, q: string, _lang: string, bookId?: string) {
  const query = q.trim()
  if (!query) return { books: [] as FtsBook[], results: [] as FtsLine[], total: 0 }
  try {
    const params = new URLSearchParams({ q: query })
    if (bookId) params.set('book_id', bookId)
    return await fetchJson<{ books: FtsBook[]; results: FtsLine[]; total: number }>(`/api/search?${params}`)
  } catch {
    return { books: [] as FtsBook[], results: [] as FtsLine[], total: 0 }
  }
}
