import { useEffect, useState } from 'react'
import { ftsSearch, type FtsBook, type FtsLine } from '../api/search'
import type { PageConfig } from '../types'
import '../ui/content.css'

export function SearchPage({ config }: { config: PageConfig }) {
  const q = config.query || new URLSearchParams(window.location.search).get('q') || ''
  const [books, setBooks] = useState<FtsBook[]>([])
  const [results, setResults] = useState<FtsLine[]>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (!q.trim()) return
    ftsSearch(config.baseUrl, q, config.lang).then(data => {
      setBooks(data.books || [])
      setResults(data.results || [])
      setTotal(data.total || 0)
    })
  }, [q, config.baseUrl, config.lang])

  return (
    <>
      <h1>Search</h1>
      <p>{q ? `Results for “${q}”` : 'Enter a query in the header search.'}</p>
      {q && <p>{total} matching paragraphs in {books.length} books</p>}
      <div className="searchList">
        {results.map((r, i) => (
          <a
            key={`${r.book_id}-${r.para_id}-${i}`}
            className="searchHit"
            href={`${config.baseUrl}/${config.lang}/book/${r.book_id}${r.slug ? '/' + r.slug : ''}`}
          >
            <b>{r.book_id}</b>
            <p dangerouslySetInnerHTML={{ __html: r.pali || r.translation || '' }} />
          </a>
        ))}
        {!results.length && books.map(b => (
          <a key={b.book_id} className="searchHit" href={`${config.baseUrl}/${config.lang}/book/${b.book_id}`}>
            <b>{b.book_name || b.book_id}</b>
            <p>{b.count} matches</p>
          </a>
        ))}
      </div>
    </>
  )
}
