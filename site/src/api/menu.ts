import type { BookFile, LangInfo, MenuResponse, SectionData } from '../types'
import { fetchJson } from './http'

export function fetchMenu(_baseUrl?: string) {
  return fetchJson<MenuResponse>('/api/menu')
}

export function flattenMenu(menu: MenuResponse['menu']) {
  const books: Array<{
    id: string
    name: string
    category: string
    nikaya: string
    subNikaya: string
    sort: number
  }> = []
  for (const [category, nikayas] of Object.entries(menu || {})) {
    for (const [nikaya, subs] of Object.entries(nikayas || {})) {
      for (const [subNikaya, leaves] of Object.entries(subs || {})) {
        for (const leaf of leaves || []) {
          const [id, name, sort] = leaf
          books.push({ id, name, category, nikaya, subNikaya, sort: Number(sort) || 0 })
        }
      }
    }
  }
  books.sort((a, b) => a.sort - b.sort)
  return books
}

export function slugForHeading(title: string, paraId: number) {
  return `${(title || '').toLowerCase().replace(/ /g, '-')}-${paraId}`
}

export function fetchLangs() {
  return fetchJson<LangInfo[]>('/api/langs')
}

export function fetchBook(bookId: string) {
  return fetchJson<BookFile>(`/api/book?id=${encodeURIComponent(bookId)}`)
}

export function fetchSection(bookId: string, paraId: number) {
  return fetchJson<SectionData>(`/api/book?id=${encodeURIComponent(bookId)}&para=${paraId}`)
}
