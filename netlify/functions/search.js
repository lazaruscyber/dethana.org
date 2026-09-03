import { jsonResponse, searchCorpus } from '../lib/data.js'

export async function handler(event) {
  try {
    const params = event.queryStringParameters || {}
    const data = searchCorpus(params.q || '', params.book_id || '')
    if (params.headings === '1') {
      return jsonResponse(data.headings)
    }
    return jsonResponse(data)
  } catch (err) {
    return jsonResponse({ error: err.message || 'search unavailable', books: [], results: [], total: 0 }, 500)
  }
}
