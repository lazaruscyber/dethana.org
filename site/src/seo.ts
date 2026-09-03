export const SITE_ORIGIN = 'https://dethana.org'
export const DEFAULT_TITLE = 'Dethana.org — Chaṭṭha Saṅgāyana Tipiṭaka'
export const DEFAULT_DESCRIPTION =
  'Read the Pāli Tipiṭaka, Vinaya, Abhidhamma, and Aṭṭhakathā with English study translations. Dhammapada, suttas, and commentaries on Dethana.org.'
export const OG_IMAGE = `${SITE_ORIGIN}/og-image.png`

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}

function setJsonLd(data: unknown) {
  const id = 'dethana-jsonld'
  let el = document.getElementById(id) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.id = id
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

export function pageUrl(path: string) {
  const normalized = path.startsWith('http') ? path : `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`
  return normalized.replace(/([^:]\/)\/+/g, '$1')
}

export function applySeo(opts: {
  title: string
  description: string
  path: string
  type?: 'website' | 'article' | 'book'
  noindex?: boolean
  jsonLd?: unknown
}) {
  const url = pageUrl(opts.path || '/')
  document.title = opts.title
  upsertMeta('name', 'description', opts.description)
  upsertMeta('name', 'robots', opts.noindex ? 'noindex, follow' : 'index, follow')
  upsertMeta('property', 'og:site_name', 'Dethana.org')
  upsertMeta('property', 'og:locale', 'en_US')
  upsertMeta('property', 'og:type', opts.type === 'book' ? 'book' : opts.type || 'website')
  upsertMeta('property', 'og:title', opts.title)
  upsertMeta('property', 'og:description', opts.description)
  upsertMeta('property', 'og:url', url)
  upsertMeta('property', 'og:image', OG_IMAGE)
  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:title', opts.title)
  upsertMeta('name', 'twitter:description', opts.description)
  upsertMeta('name', 'twitter:image', OG_IMAGE)
  upsertLink('canonical', url)
  setJsonLd(opts.jsonLd || {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Dethana.org',
    url: SITE_ORIGIN,
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_ORIGIN}/en/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  })
}
