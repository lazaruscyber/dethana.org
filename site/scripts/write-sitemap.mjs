import { readFileSync, writeFileSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const publicDir = join(here, '../public')
const origin = 'https://dethana.org'

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function loc(path, changefreq = 'weekly', priority = '0.6') {
  return `  <url><loc>${xmlEscape(origin + path)}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`
}

const urls = [
  loc('/', 'daily', '1.0'),
  loc('/en/', 'daily', '1.0'),
  loc('/about', 'monthly', '0.6'),
  loc('/translation-policy', 'monthly', '0.4'),
  loc('/privacy', 'yearly', '0.2'),
  loc('/dana', 'monthly', '0.3'),
  loc('/en/collection/nikaya', 'weekly', '0.8'),
  loc('/en/collection/abhidhamma', 'weekly', '0.8'),
  loc('/en/collection/vinaya', 'weekly', '0.8'),
  loc('/en/collection/expositions', 'weekly', '0.8'),
]

const menu = JSON.parse(readFileSync(join(publicDir, 'data/menu.json'), 'utf8'))
const books = new Set(Object.keys(menu.hierarchy || {}))
for (const id of books) urls.push(loc(`/en/book/${id}`, 'weekly', '0.7'))

try {
  const headings = JSON.parse(gunzipSync(readFileSync(join(publicDir, 'data/headings.json.gz'))).toString('utf8'))
  const seen = new Set()
  for (const h of headings) {
    if (!h?.book_id || !h?.slug) continue
    const path = `/en/book/${h.book_id}/${h.slug}`
    if (seen.has(path)) continue
    seen.add(path)
    urls.push(loc(path, 'monthly', '0.5'))
  }
} catch {
  /* headings optional */
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`

const out = process.argv[2] || join(publicDir, 'sitemap.xml')
writeFileSync(out, xml)
console.log(`sitemap: ${urls.length} URLs -> ${out}`)
