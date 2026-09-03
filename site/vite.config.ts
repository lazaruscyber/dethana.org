import { defineConfig, type PreviewServer, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import {
  bookMeta,
  getLangs,
  getMenu,
  jsonResponse,
  loadBook,
  searchCorpus,
} from '../netlify/lib/data.js'

function send(res: { statusCode: number; setHeader: (k: string, v: string) => void; end: (b: string) => void }, result: { statusCode: number; headers: Record<string, string>; body: string }) {
  res.statusCode = result.statusCode
  for (const [key, value] of Object.entries(result.headers)) res.setHeader(key, value)
  res.end(result.body)
}

async function handleApi(req: { url?: string; headers: { host?: string } }, res: any, next: () => void) {
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
}

function jsonDataApi() {
  const attach = (server: ViteDevServer | PreviewServer) => {
    server.middlewares.use((req, res, next) => {
      handleApi(req, res, next)
    })
  }
  return {
    name: 'json-data-api',
    configureServer: attach,
    configurePreviewServer: attach,
  }
}

export default defineConfig({
  plugins: [react(), jsonDataApi()],
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
