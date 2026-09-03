import { cpSync, existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { defineConfig, type PreviewServer, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'

function send(res: { statusCode: number; setHeader: (k: string, v: string) => void; end: (b: string) => void }, result: { statusCode: number; headers: Record<string, string>; body: string }) {
  res.statusCode = result.statusCode
  for (const [key, value] of Object.entries(result.headers)) res.setHeader(key, value)
  res.end(result.body)
}

function jsonDataApi() {
  const attach = async (server: ViteDevServer | PreviewServer) => {
    const {
      bookMeta,
      getLangs,
      getMenu,
      jsonResponse,
      loadBook,
      searchCorpus,
    } = await import('../netlify/lib/data.js')
    server.middlewares.use(async (req, res, next) => {
      const url = new URL(req.url || '/', 'http://127.0.0.1')
      if (!url.pathname.startsWith('/api/')) {
        next()
        return
      }
      try {
        if (url.pathname === '/api/menu') {
          send(res, jsonResponse(getMenu()))
          return
        }
        if (url.pathname === '/api/langs') {
          send(res, jsonResponse(getLangs()))
          return
        }
        if (url.pathname === '/api/search') {
          const data = searchCorpus(url.searchParams.get('q') || '', url.searchParams.get('book_id') || '')
          send(res, jsonResponse(url.searchParams.get('headings') === '1' ? data.headings : data))
          return
        }
        if (url.pathname === '/api/book') {
          const id = url.searchParams.get('id') || ''
          if (!id) {
            send(res, jsonResponse({ error: 'id required' }, 400))
            return
          }
          const book = await loadBook(id, { headers: { host: req.headers.host || '127.0.0.1' } })
          const para = url.searchParams.get('para')
          if (para) {
            const section = book.sections?.[String(para)]
            send(res, section ? jsonResponse(section) : jsonResponse({ error: 'section not found' }, 404))
            return
          }
          send(res, jsonResponse(bookMeta(book)))
          return
        }
        next()
      } catch (err: any) {
        send(res, jsonResponse({ error: err?.message || 'api error' }, 500))
      }
    })
  }
  return {
    name: 'json-data-api',
    apply: 'serve' as const,
    configureServer: attach,
    configurePreviewServer: attach,
  }
}

function publishData() {
  return {
    name: 'publish-data',
    apply: 'build' as const,
    writeBundle(_options, bundle) {
      const builtApp = Object.keys(bundle).some(name => name.endsWith('.html') || name.startsWith('assets/'))
      if (!builtApp) return
      if (!existsSync('dist/data/menu.json') && existsSync('public/data/menu.json')) {
        cpSync('public/data', 'dist/data', { recursive: true })
      }
      if (!existsSync('dist/data/menu.json') || !existsSync('dist/data/books/Dhp.json.gz')) {
        throw new Error('Book data is missing from site/public/data. The Cloudflare clone has no menu.json / Dhp.json.gz.')
      }
      const sitemap = spawnSync(process.execPath, ['scripts/write-sitemap.mjs', 'dist/sitemap.xml'], { stdio: 'inherit' })
      if (sitemap.status !== 0) throw new Error('Failed to write sitemap.xml')
    },
  }
}

export default defineConfig({
  plugins: [react(), jsonDataApi(), publishData()],
  appType: 'spa',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
})
