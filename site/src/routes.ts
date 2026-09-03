import type { AppRoute } from './types'

export const DEFAULT_LANG = 'en'
export const BASE_URL = ''

export function slugForHeading(title: string, paraId: number) {
  return `${(title || '').toLowerCase().replace(/ /g, '-')}-${paraId}`
}

function paraFromSlug(slug?: string) {
  if (!slug || !slug.includes('-')) return null
  const tail = slug.split('-').pop()
  const n = Number(tail)
  return Number.isFinite(n) ? n : null
}

export function parseRoute(pathname = window.location.pathname, search = window.location.search): AppRoute {
  const parts = pathname.replace(/\/+$/, '').split('/').filter(Boolean)
  const q = new URLSearchParams(search).get('q') || ''

  if (parts.length === 0) return { name: 'home', lang: DEFAULT_LANG }
  if (parts[0] === 'about' || parts[0] === 'about-translation') return { name: 'about' }
  if (parts[0] === 'privacy') return { name: 'privacy' }
  if (parts[0] === 'dana') return { name: 'dana' }
  if (parts[0] === 'search') return { name: 'search', lang: DEFAULT_LANG, query: q }

  const lang = parts[0]
  if (parts.length === 1) return { name: 'home', lang }
  if (parts[1] === 'search') return { name: 'search', lang, query: q }
  if (parts[1] === 'collection' && parts[2]) {
    return { name: 'collection', lang, collection: parts[2] }
  }
  if (parts[1] === 'book' && parts[2]) {
    const bookId = parts[2]
    const slug = parts.slice(3).join('/') || undefined
    return { name: 'book', lang, bookId, slug, paraId: paraFromSlug(slug) }
  }
  return { name: 'notfound' }
}
