import { getLangs, jsonResponse } from '../lib/data.js'

export async function handler() {
  try {
    return jsonResponse(getLangs())
  } catch (err) {
    return jsonResponse({ error: err.message || 'langs unavailable' }, 500)
  }
}
