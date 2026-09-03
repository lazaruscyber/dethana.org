import bundledMenu from '../../public/data/menu.json'
import bundledLangs from '../../public/data/langs.json'
import type { BookFile, HierarchyMap, LangInfo, MenuResponse, MenuTree, SectionData } from '../types'
import { fetchJson } from './http'

const catalog = bundledMenu as MenuResponse
const langs = bundledLangs as LangInfo[]

export async function fetchMenu(_baseUrl?: string): Promise<MenuResponse> {
  try {
    const remote = await fetchJson<MenuResponse>('/data/menu.json')
    if (remote?.menu && Object.keys(remote.menu).length) return remote
  } catch {
    /* use the catalog shipped with the app */
  }
  return catalog
}

export function flattenMenu(menu: MenuTree, hierarchy?: HierarchyMap) {
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
  if (!books.length && hierarchy) {
    for (const [id, meta] of Object.entries(hierarchy)) {
      books.push({
        id,
        name: meta.book_name || id,
        category: meta.category || '',
        nikaya: meta.nikaya || '',
        subNikaya: '',
        sort: 0,
      })
    }
  }
  books.sort((a, b) => a.sort - b.sort)
  return books
}

export function slugForHeading(title: string, paraId: number) {
  return `${(title || '').toLowerCase().replace(/ /g, '-')}-${paraId}`
}

export async function fetchLangs() {
  try {
    const remote = await fetchJson<LangInfo[]>('/data/langs.json')
    if (Array.isArray(remote) && remote.length) return remote
  } catch {
    /* bundled langs */
  }
  return langs
}

export async function fetchBook(bookId: string) {
  const id = encodeURIComponent(bookId)
  try {
    return await fetchJson<BookFile>(`/data/books/${id}.json.gz`)
  } catch {
    return fetchJson<BookFile>(`/api/book?id=${id}`)
  }
}

export function fetchSection(bookId: string, paraId: number) {
  return fetchJson<SectionData>(`/api/book?id=${encodeURIComponent(bookId)}&para=${paraId}`)
}
