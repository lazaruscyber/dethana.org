import { getMenu, jsonResponse } from '../lib/data.js'

export async function handler() {
  try {
    return jsonResponse(getMenu())
  } catch (err) {
    return jsonResponse({ error: err.message || 'menu unavailable' }, 500)
  }
}
