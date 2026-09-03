import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))

const bookCache = new Map()
let headingsCache = null

function dataRoots() {
  const roots = []
  const add = (dir) => {
    if (!dir) return
    const resolved = path.resolve(dir)
    if (!roots.includes(resolved)) roots.push(resolved)
  }
  add(process.env.LAMBDA_TASK_ROOT)
  add(process.cwd())
  add(here)
  add(path.join(here, '..'))
  add(path.join(here, '../..'))
  add(path.join(here, '../../..'))
  add(path.join(here, '../../site/public/data'))
  add(path.join(here, '../../site/dist/data'))
  add(path.join(process.cwd(), 'site/public/data'))
  add(path.join(process.cwd(), 'site/dist/data'))
  add(path.join(process.cwd(), 'public/data'))
  add(path.join(process.cwd(), 'dist/data'))
  if (process.env.LAMBDA_TASK_ROOT) {
    add(path.join(process.env.LAMBDA_TASK_ROOT, 'site/public/data'))
    add(path.join(process.env.LAMBDA_TASK_ROOT, 'site/dist/data'))
    add(path.join(process.env.LAMBDA_TASK_ROOT, 'public/data'))
    add(path.join(process.env.LAMBDA_TASK_ROOT, 'data'))
  }
  return roots
}

export function findDataFile(rel) {
  const safe = String(rel || '').replace(/\\/g, '/')
  if (!safe || safe.includes('..')) return null
  for (const root of dataRoots()) {
    const nested = [
      path.join(root, safe),
      path.join(root, 'site/public/data', safe),
      path.join(root, 'site/dist/data', safe),
      path.join(root, 'public/data', safe),
      path.join(root, 'dist/data', safe),
      path.join(root, 'data', safe),
    ]
    for (const full of nested) {
      if (fs.existsSync(full)) return full
    }
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
    const gzipped = buf.length >= 2 && buf[0] === 0x1f && buf[1] === 0x8b
    book = JSON.parse(gzipped ? zlib.gunzipSync(buf).toString('utf8') : buf.toString('utf8'))
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
