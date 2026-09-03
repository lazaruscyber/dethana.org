import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))

const DATA_CANDIDATES = [
  path.join(here, '../../site/public/data'),
  path.join(here, '../../site/dist/data'),
  path.join(process.cwd(), 'site/public/data'),
  path.join(process.cwd(), 'site/dist/data'),
  path.join(process.cwd(), 'public/data'),
  path.join(process.cwd(), 'dist/data'),
]

const bookCache = new Map()
let headingsCache = null

function dataRoots() {
  return DATA_CANDIDATES.filter((dir, i, all) => all.indexOf(dir) === i)
}

export function findDataFile(rel) {
  const safe = String(rel || '').replace(/\\/g, '/')
  if (!safe || safe.includes('..')) return null
  for (const root of dataRoots()) {
    const full = path.join(root, safe)
    if (fs.existsSync(full)) return full
  }
  return null
}

export function readJsonFile(rel) {
  const full = findDataFile(rel)
  if (!full) throw new Error(`missing ${rel}`)
  return JSON.parse(fs.readFileSync(full, 'utf8'))
}

export function readGzipJson(rel) {
  const full = findDataFile(rel)
  if (!full) throw new Error(`missing ${rel}`)
  return JSON.parse(zlib.gunzipSync(fs.readFileSync(full)).toString('utf8'))
}

export function jsonResponse(body, status = 200, ttl = 300) {
  return {
    statusCode: status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': status === 200 ? `public, max-age=${ttl}` : 'no-store',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(body),
  }
}

function matches(haystack, needle) {
  return String(haystack || '').toLocaleLowerCase().includes(needle.toLocaleLowerCase())
}

export function getMenu() {
  return readJsonFile('menu.json')
}

export function getLangs() {
  try {
    return readJsonFile('langs.json')
  } catch {
    return [{ code: 'en', english_name: 'English', native_name: 'English' }]
  }
}

function getHeadings() {
  if (!headingsCache) headingsCache = readGzipJson('headings.json.gz')
  return headingsCache
}

export function searchCorpus(query, bookId) {
  const q = String(query || '').trim()
  if (q.length < 2) return { books: [], results: [], total: 0, headings: [] }
  const headings = getHeadings()
  const headingHits = []
  const results = []
  const counts = new Map()
  for (const h of headings) {
    if (bookId && h.book_id !== bookId) continue
    const titleHit = matches(h.title, q) || matches(h.book_name, q) || matches(h.book_id, q)
    const blob = `${h.title} ${h.pali || ''} ${h.translation || ''}`
    if (!matches(blob, q) && !titleHit) continue
    if (titleHit && headingHits.length < 12) headingHits.push(h)
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
  return {
    books,
    results,
    total: books.reduce((n, b) => n + b.count, 0),
    headings: headingHits,
  }
}

function originFromEvent(event) {
  const headers = event.headers || {}
  const host = headers['x-forwarded-host'] || headers.host
  if (!host) return process.env.URL || process.env.DEPLOY_PRIME_URL || ''
  const proto = headers['x-forwarded-proto'] || (String(host).includes('localhost') ? 'http' : 'https')
  return `${proto}://${host}`
}

export async function loadBook(bookId, event) {
  const id = String(bookId || '').trim()
  if (!id || id.includes('..') || id.includes('/') || id.includes('\\')) {
    throw new Error('invalid book id')
  }
  if (bookCache.has(id)) return bookCache.get(id)

  let book
  try {
    book = readGzipJson(`books/${id}.json.gz`)
  } catch {
    const origin = originFromEvent(event || {})
    if (!origin) throw new Error('book not found')
    const res = await fetch(`${origin}/data/books/${encodeURIComponent(id)}.json.gz`)
    if (!res.ok) throw new Error('book not found')
    const buf = Buffer.from(await res.arrayBuffer())
    book = JSON.parse(zlib.gunzipSync(buf).toString('utf8'))
  }
  bookCache.set(id, book)
  return book
}

export function bookMeta(book) {
  return {
    book_id: book.book_id,
    book_name: book.book_name,
    toc: book.toc || [],
    bookref: book.bookref || { mula_ref: [], attha_ref: [], tika_ref: [] },
  }
}
