const cache = new Map<string, Promise<unknown>>()

async function decodeGzip(response: Response) {
  if (!response.body) throw new Error('empty body')
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('This browser cannot decode gzipped book data. Please use a current Chrome, Firefox, Safari, or Edge.')
  }
  const stream = response.body.pipeThrough(new DecompressionStream('gzip'))
  return new Response(stream).text()
}

export async function fetchJson<T>(url: string): Promise<T> {
  if (!cache.has(url)) {
    cache.set(url, (async () => {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`${url} ${res.status}`)
      if (url.endsWith('.gz')) {
        return JSON.parse(await decodeGzip(res))
      }
      return res.json()
    })())
  }
  return cache.get(url) as Promise<T>
}
