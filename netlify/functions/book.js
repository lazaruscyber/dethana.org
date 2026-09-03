import { bookMeta, jsonResponse, loadBook } from '../lib/data.js'

export async function handler(event) {
  try {
    const params = event.queryStringParameters || {}
    const id = params.id || ''
    if (!id) return jsonResponse({ error: 'id required' }, 400)
    const book = await loadBook(id, event)
    if (params.para) {
      const section = book.sections?.[String(params.para)]
      if (!section) return jsonResponse({ error: 'section not found' }, 404)
      return jsonResponse(section)
    }
    return jsonResponse(bookMeta(book))
  } catch (err) {
    const missing = /not found|missing/i.test(err.message || '')
    return jsonResponse({ error: err.message || 'book unavailable' }, missing ? 404 : 500)
  }
}
