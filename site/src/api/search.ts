import type { HeadingHit } from '../types'
import { fetchJson } from './http'
import { TextProcessor, Script, getScriptForCode } from '../pali-script.js'

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

type IndexedHit = HeadingHit & {
  titleKey: string
  bookKey: string
  idKey: string
  paliKey: string
  enKey: string
  enPlain: string
  paliPlain: string
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

export function stripTags(value: string) {
  return (value || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim()
}

function hasIndicScript(text: string) {
  for (let i = 0; i < text.length; i++) {
    const script = getScriptForCode(text.charCodeAt(i))
    if (script !== -1 && script !== Script.RO) return true
  }
  return false
}

function romanizeIfNeeded(text: string) {
  if (!text || !hasIndicScript(text)) return text
  try {
    return TextProcessor.convert(TextProcessor.convertFromMixed(text), Script.RO)
  } catch {
    return text
  }
}

export function foldSearch(text: string) {
  const roman = romanizeIfNeeded(stripTags(text))
  return roman
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/æ/g, 'ae')
    .replace(/œ/g, 'oe')
    .replace(/ß/g, 'ss')
    .replace(/[ṁṃŋ]/gi, 'm')
    .replace(/[ñṅṇ]/gi, 'n')
    .replace(/[ṭ]/gi, 't')
    .replace(/[ḍ]/gi, 'd')
    .replace(/[ḷ]/gi, 'l')
    .replace(/[ṛ]/gi, 'r')
    .replace(/[śṣ]/gi, 's')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function queryKey(query: string) {
  return foldSearch(query)
}

function containsKey(haystackKey: string, needleKey: string) {
  if (!needleKey || !haystackKey) return false
  return haystackKey.includes(needleKey)
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

function foldChar(ch: string) {
  return ch
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[ṁṃŋ]/gi, 'm')
    .replace(/[ñṅṇ]/gi, 'n')
    .replace(/[ṭ]/gi, 't')
    .replace(/[ḍ]/gi, 'd')
    .replace(/[ḷ]/gi, 'l')
    .replace(/[ṛ]/gi, 'r')
    .replace(/[śṣ]/gi, 's')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

function foldedIndex(plain: string, query: string) {
  const needle = queryKey(query).replace(/ /g, '')
  if (!needle) return -1
  let folded = ''
  const map: number[] = []
  for (let i = 0; i < plain.length; i++) {
    const piece = foldChar(plain[i])
    for (let j = 0; j < piece.length; j++) {
      folded += piece[j]
      map.push(i)
    }
  }
  const at = folded.indexOf(needle)
  if (at < 0) return -1
  return map[at]
}

export function excerptAround(text: string, query: string, radius = 88) {
  const raw = stripTags(text)
  if (!raw) return ''
  let i = raw.toLocaleLowerCase().indexOf(query.toLocaleLowerCase())
  if (i < 0) i = foldedIndex(raw, query)
  if (i < 0) {
    const roman = romanizeIfNeeded(raw)
    if (roman !== raw) {
      i = foldedIndex(roman, query)
      if (i >= 0) {
        const start = Math.max(0, i - radius)
        const end = Math.min(roman.length, i + query.length + radius)
        return `${start > 0 ? '…' : ''}${roman.slice(start, end)}${end < roman.length ? '…' : ''}`
      }
    }
    return raw.length > radius * 2 ? `${raw.slice(0, radius * 2)}…` : raw
  }
  const start = Math.max(0, i - radius)
  const end = Math.min(raw.length, i + query.length + radius)
  return `${start > 0 ? '…' : ''}${raw.slice(start, end)}${end < raw.length ? '…' : ''}`
}

export function highlightMatch(text: string, query: string) {
  const plain = stripTags(text)
  const needle = query.trim()
  if (!needle) return escapeHtml(plain)
  const foldedQ = queryKey(needle).replace(/ /g, '')
  if (!foldedQ) return escapeHtml(plain)
  const variants: Record<string, string> = {
    a: 'aāáàäâAĀ',
    i: 'iīíìïIĪ',
    u: 'uūúùüUŪ',
    e: 'eēéèEĒ',
    o: 'oōóòOŌ',
    n: 'nñṅṇNÑṄṆ',
    m: 'mṁṃMṀṂ',
    t: 'tṭTṬ',
    d: 'dḍDḌ',
    l: 'lḷLḶ',
    s: 'sśṣSŚṢ',
    r: 'rṛRṚ',
  }
  try {
    const pattern = [...foldedQ].map(ch => {
      const set = variants[ch] || ch
      return `[${escapeRegExp(set)}][\\u0300-\\u036f]*`
    }).join('\\s*')
    return escapeHtml(plain).replace(new RegExp(`(${pattern})`, 'gi'), '<mark>$1</mark>')
  } catch {
    return escapeHtml(plain)
  }
}

function scoreIndexed(h: IndexedHit, q: string) {
  const n = q
  if (h.idKey === n || h.bookKey === n) return 100
  if (h.titleKey === n) return 92
  if (h.enKey === n) return 88
  if (h.idKey.startsWith(n) || h.bookKey.startsWith(n)) return 80
  if (h.titleKey.startsWith(n)) return 72
  if (h.enKey.startsWith(n)) return 68
  if (containsKey(h.bookKey, n) || containsKey(h.idKey, n)) return 55
  if (containsKey(h.titleKey, n)) return 48
  if (containsKey(h.enKey, n)) return 44
  return 0
}

let headingsPromise: Promise<HeadingHit[]> | null = null
let indexedPromise: Promise<IndexedHit[]> | null = null

function loadHeadings() {
  if (!headingsPromise) {
    headingsPromise = fetchJson<HeadingHit[]>('/data/headings.json.gz').catch(async () => {
      const hits = await fetchJson<HeadingHit[]>('/api/search?headings=1&q=aa')
      return hits
    })
  }
  return headingsPromise
}

function indexHeadings(headings: HeadingHit[]): IndexedHit[] {
  return headings.map(h => {
    const paliPlain = stripTags(h.pali || '')
    const enPlain = stripTags(h.translation || '')
    const titleKey = foldSearch(h.title || '')
    const paliLooksLikeTitle = paliPlain && (foldSearch(paliPlain) === titleKey || foldSearch(paliPlain) === foldSearch(h.title || ''))
    return {
      ...h,
      titleKey,
      bookKey: foldSearch(h.book_name || ''),
      idKey: foldSearch(h.book_id || ''),
      paliKey: paliLooksLikeTitle ? '' : foldSearch(paliPlain),
      enKey: foldSearch(enPlain),
      enPlain,
      paliPlain: paliLooksLikeTitle ? '' : paliPlain,
    }
  })
}

function loadIndexed() {
  if (!indexedPromise) {
    indexedPromise = loadHeadings().then(indexHeadings)
  }
  return indexedPromise
}

export async function searchHeadings(_baseUrl: string, q: string): Promise<HeadingHit[]> {
  const data = await searchTitles(q, 12)
  return data.chapters
}

export async function searchTitles(q: string, chapterLimit = 80): Promise<TitleSearchResult> {
  const query = q.trim()
  const needle = queryKey(query)
  if (query.length < 2 || !needle) return { books: [], chapters: [], total: 0 }
  try {
    const headings = await loadIndexed()
    const chapters: IndexedHit[] = []
    const counts = new Map<string, FtsBook>()
    for (const h of headings) {
      const titleHit = containsKey(h.titleKey, needle) || containsKey(h.enKey, needle)
      const bookHit = containsKey(h.bookKey, needle) || containsKey(h.idKey, needle)
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
    chapters.sort((a, b) => scoreIndexed(b, needle) - scoreIndexed(a, needle))
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
  const needle = queryKey(query)
  if (query.length < 2 || !needle) return { books: [], results: [], total: 0 }
  try {
    const headings = await loadIndexed()
    const results: FtsLine[] = []
    const counts = new Map<string, FtsBook>()
    for (const h of headings) {
      const inEn = containsKey(h.enKey, needle)
      const inPali = containsKey(h.paliKey, needle)
      if (!inEn && !inPali) continue
      const entry = counts.get(h.book_id) || { book_id: h.book_id, book_name: h.book_name, count: 0 }
      entry.count += 1
      counts.set(h.book_id, entry)
      if (results.length < limit) {
        const source = inEn ? h.enPlain : (h.paliPlain || h.pali || '')
        results.push({
          book_id: h.book_id,
          book_name: h.book_name,
          title: h.title,
          para_id: h.para_id,
          pali: h.paliPlain,
          translation: h.enPlain,
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
