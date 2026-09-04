import { useEffect, useState } from 'react'
import { SearchBox } from '../ui/SearchBox'
import {
  highlightMatch,
  parseSearchMode,
  searchText,
  searchTitles,
  type FtsBook,
  type FtsLine,
  type HeadingHit,
  type SearchMode,
} from '../api/search'
import { interpolate, useUi } from '../i18n'
import { PageEnter } from '../ui/motion'
import type { PageConfig } from '../types'
import styles from '../ui/Search.module.css'

export function SearchPage({ config }: { config: PageConfig }) {
  const { t } = useUi()
  const q = config.query || new URLSearchParams(window.location.search).get('q') || ''
  const mode: SearchMode = parseSearchMode(config.mode || new URLSearchParams(window.location.search).get('mode'))
  const [loading, setLoading] = useState(Boolean(q.trim()))
  const [books, setBooks] = useState<FtsBook[]>([])
  const [chapters, setChapters] = useState<HeadingHit[]>([])
  const [passages, setPassages] = useState<FtsLine[]>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    let cancelled = false
    const query = q.trim()
    if (!query) {
      setBooks([])
      setChapters([])
      setPassages([])
      setTotal(0)
      setLoading(false)
      return
    }
    setLoading(true)
    const run = mode === 'text' ? searchText(query, 80) : searchTitles(query, 80)
    run.then(data => {
      if (cancelled) return
      setBooks(data.books || [])
      if (mode === 'text') {
        setPassages('results' in data ? data.results : [])
        setChapters([])
        setTotal(data.total || 0)
      } else {
        setChapters('chapters' in data ? data.chapters : [])
        setPassages([])
        setTotal('chapters' in data ? data.total : data.total || 0)
      }
      setLoading(false)
    }).catch(() => {
      if (!cancelled) setLoading(false)
    })
    return () => { cancelled = true }
  }, [q, mode])

  const empty = !loading && Boolean(q.trim()) && !books.length && !chapters.length && !passages.length
  const summary = !q.trim()
    ? t.searchHint
    : loading
      ? t.searching
      : mode === 'text'
        ? interpolate(t.searchSummaryText, { total, books: books.length })
        : interpolate(t.searchSummaryTitles, { chapters: total, books: books.length })

  return (
    <PageEnter className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.kicker}>{t.search}</p>
          <h1 className={styles.title}>{q ? interpolate(t.searchResults, { q }) : t.search}</h1>
          <SearchBox
            baseUrl={config.baseUrl}
            lang={config.lang}
            size="hero"
            initialQuery={q}
            initialMode={mode}
          />
        </div>
      </section>
      <div className={styles.body}>
        <p className={styles.summary}>{summary}</p>
        {empty && (
          <p className={styles.empty}>{mode === 'text' ? t.searchNoText : t.searchNoTitles}</p>
        )}
        {mode === 'titles' && books.length > 0 && (
          <section className={styles.section} aria-labelledby="search-books">
            <h2 id="search-books" className={styles.sectionTitle}>{t.searchBooks}</h2>
            <div className={styles.books}>
              {books.slice(0, 12).map(book => (
                <a key={book.book_id} className={styles.book} href={`${config.baseUrl}/${config.lang}/book/${book.book_id}`}>
                  <span className={styles.bookId}>{book.book_id}</span>
                  <span className={styles.bookName}>{book.book_name || book.book_id}</span>
                  <span className={styles.bookCount}>{interpolate(t.matches, { n: book.count })}</span>
                </a>
              ))}
            </div>
          </section>
        )}
        {mode === 'titles' && chapters.length > 0 && (
          <section className={styles.section} aria-labelledby="search-chapters">
            <h2 id="search-chapters" className={styles.sectionTitle}>{t.searchChapters}</h2>
            <div className={styles.list}>
              {chapters.map(item => (
                <a
                  key={`${item.book_id}-${item.para_id}`}
                  className={styles.hit}
                  href={`${config.baseUrl}/${config.lang}/book/${item.book_id}/${item.slug}`}
                >
                  <span className={styles.hitKicker}>{item.book_name}</span>
                  <span
                    className={styles.hitTitle}
                    dangerouslySetInnerHTML={{ __html: highlightMatch(item.title, q) }}
                  />
                </a>
              ))}
            </div>
          </section>
        )}
        {mode === 'text' && passages.length > 0 && (
          <section className={styles.section} aria-labelledby="search-passages">
            <h2 id="search-passages" className={styles.sectionTitle}>{t.searchModeText}</h2>
            <div className={styles.list}>
              {passages.map((item, i) => (
                <a
                  key={`${item.book_id}-${item.para_id}-${i}`}
                  className={styles.hit}
                  href={`${config.baseUrl}/${config.lang}/book/${item.book_id}${item.slug ? `/${item.slug}` : ''}`}
                >
                  <span className={styles.hitKicker}>{item.book_name} · {item.book_id}</span>
                  {item.title && <span className={styles.hitTitle}>{item.title}</span>}
                  <span
                    className={styles.hitSnippet}
                    dangerouslySetInnerHTML={{ __html: highlightMatch(item.snippet || item.translation || item.pali || '', q) }}
                  />
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </PageEnter>
  )
}
