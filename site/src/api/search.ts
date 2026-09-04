import type { HeadingHit } from '../types'
import { fetchJson } from './http'

export type { HeadingHit }

export type SearchMode = 'titles' | 'text'

export type FtsBook = { book_id: string; book_name?: string; count: number }
export type FtsLine = {
  book_id: string
  book_name?: string
  title?: string
  para_id: number
  line_id?: number
  pali?: string
  translation?: string
  slug?: string
  snippet?: string
}

export type TitleSearchResult = {
  books: FtsBook[]
  chapters: HeadingHit[]
  total: number
}

export type TextSearchResult = {
  books: FtsBook[]
  results: FtsLine[]
  total: number
}

const MODE_KEY = 'dethana_search_mode'

export function parseSearchMode(value?: string | null): SearchMode {
  return value === 'text' ? 'text' : 'titles'
}

export function readStoredMode(): SearchMode {
  try {
    return parseSearchMode(localStorage.getItem(MODE_KEY))
  } catch {
    return 'titles'
  }
}

export function storeSearchMode(mode: SearchMode) {
  try { localStorage.setItem(MODE_KEY, mode) } catch { /* ignore */ }
}

export function searchPageHref(baseUrl: string, lang: string, q: string, mode: SearchMode) {
  const params = new URLSearchParams()
  if (q.trim()) params.set('q', q.trim())
  if (mode === 'text') params.set('mode', 'text')
  const qs = params.toString()
  return `${baseUrl}/${lang}/search${qs ? `?${qs}` : ''}`
}

function matches(haystack: string, needle: string) {
  return haystack.toLocaleLowerCase().includes(needle.toLocaleLowerCase())
}

function norm(value: string) {
  return value.normalize('NFC').toLocaleLowerCase().trim()
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function excerptAround(text: string, query: string, radius = 88) {
  const raw = (text || '').replace(/\s+/g, ' ').trim()
  if (!raw) return ''
  const i = raw.toLocaleLowerCase().indexOf(query.toLocaleLowerCase())
  if (i < 0) return raw.length > radius * 2 ? `${raw.slice(0, radius * 2)}…` : raw
  const start = Math.max(0, i - radius)
  const end = Math.min(raw.length, i + query.length + radius)
  return `${start > 0 ? '…' : ''}${raw.slice(start, end)}${end < raw.length ? '…' : ''}`
}

export function highlightMatch(text: string, query: string) {
  const escaped = escapeHtml(text)
  const needle = query.trim()
  if (!needle) return escaped
  try {
    const re = new RegExp(`(${escapeRegExp(needle)})`, 'gi')
    return escaped.replace(re, '<mark>$1</mark>')
  } catch {
    return escaped
  }
}

function scoreTitle(h: HeadingHit, query: string) {
  const n = norm(query)
  const title = norm(h.title || '')
  const book = norm(h.book_name || '')
  const id = norm(h.book_id || '')
  if (id === n || book === n) return 100
  if (title === n) return 92
  if (id.startsWith(n) || book.startsWith(n)) return 80
  if (title.startsWith(n)) return 72
  if (book.includes(n)) return 55
  if (id.includes(n)) return 50
  if (title.includes(n)) return 40
  return 0
}

function bodyFields(h: HeadingHit) {
  const title = norm(h.title || '')
  const pali = (h.pali || '').replace(/\s+/g, ' ').trim()
  const translation = (h.translation || '').replace(/\s+/g, ' ').trim()
  const paliIsTitle = pali && norm(pali) === title
  return {
    pali: paliIsTitle ? '' : pali,
    translation,
  }
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
  const data = await searchTitles(q, 12)
  return data.chapters
}

export async function searchTitles(q: string, chapterLimit = 80): Promise<TitleSearchResult> {
  const query = q.trim()
  if (query.length < 2) return { books: [], chapters: [], total: 0 }
  try {
    const headings = await loadHeadings()
    const chapters: HeadingHit[] = []
    const counts = new Map<string, FtsBook>()
    for (const h of headings) {
      const titleHit = matches(h.title || '', query)
      const bookHit = matches(h.book_name || '', query) || matches(h.book_id || '', query)
      if (!titleHit && !bookHit) continue
      const entry = counts.get(h.book_id) || { book_id: h.book_id, book_name: h.book_name, count: 0 }
      if (titleHit) {
        entry.count += 1
        chapters.push(h)
      } else if (bookHit && entry.count === 0) {
        entry.count = 1
      }
      counts.set(h.book_id, entry)
    }
    chapters.sort((a, b) => scoreTitle(b, query) - scoreTitle(a, query))
    const books = [...counts.values()].sort((a, b) => b.count - a.count)
    return {
      books,
      chapters: chapters.slice(0, chapterLimit),
      total: chapters.length,
    }
  } catch {
    return { books: [], chapters: [], total: 0 }
  }
}

export async function searchText(q: string, limit = 80): Promise<TextSearchResult> {
  const query = q.trim()
  if (query.length < 2) return { books: [], results: [], total: 0 }
  try {
    const headings = await loadHeadings()
    const results: FtsLine[] = []
    const counts = new Map<string, FtsBook>()
    for (const h of headings) {
      const { pali, translation } = bodyFields(h)
      const inPali = pali && matches(pali, query)
      const inTr = translation && matches(translation, query)
      if (!inPali && !inTr) continue
      const entry = counts.get(h.book_id) || { book_id: h.book_id, book_name: h.book_name, count: 0 }
      entry.count += 1
      counts.set(h.book_id, entry)
      if (results.length < limit) {
        const source = inTr ? translation : pali
        results.push({
          book_id: h.book_id,
          book_name: h.book_name,
          title: h.title,
          para_id: h.para_id,
          pali,
          translation,
          slug: h.slug,
          snippet: excerptAround(source, query),
        })
      }
    }
    const books = [...counts.values()].sort((a, b) => b.count - a.count)
    return { books, results, total: books.reduce((n, b) => n + b.count, 0) }
  } catch {
    return { books: [], results: [], total: 0 }
  }
}

export async function ftsSearch(_baseUrl: string, q: string, _lang: string, _bookId?: string) {
  return searchText(q)
}
