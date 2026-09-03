const cache = new Map<string, Promise<unknown>>()

async function gunzipBytes(bytes: Uint8Array) {
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('This browser cannot read compressed book files.')
  }
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))
  return new Response(stream).text()
}

export async function fetchJson<T>(url: string): Promise<T> {
  if (!cache.has(url)) {
    const pending = (async () => {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`${url} ${res.status}`)
      const type = res.headers.get('content-type') || ''
      if (type.includes('text/html')) throw new Error(`${url} returned a web page, not data`)
      if (!url.endsWith('.gz')) return res.json()
      const bytes = new Uint8Array(await res.arrayBuffer())
      const gzipped = bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b
      const text = gzipped ? await gunzipBytes(bytes) : new TextDecoder().decode(bytes)
      return JSON.parse(text)
    })()
    cache.set(url, pending)
    pending.catch(() => cache.delete(url))
  }
  return cache.get(url) as Promise<T>
}
