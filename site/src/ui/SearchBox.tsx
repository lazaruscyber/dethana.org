import { useEffect, useRef, useState } from 'react'
import { searchHeadings, type HeadingHit } from '../api/search'
import styles from './SearchBox.module.css'

type Props = {
  baseUrl: string
  lang: string
  size?: 'nav' | 'hero'
  placeholder?: string
}

export function SearchBox({ baseUrl, lang, size = 'nav', placeholder }: Props) {
  const [q, setQ] = useState('')
  const [hits, setHits] = useState<HeadingHit[]>([])
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const t = setTimeout(async () => {
      if (q.trim().length < 2) { setHits([]); return }
      setHits(await searchHeadings(baseUrl, q))
    }, 180)
    return () => clearTimeout(t)
  }, [q, baseUrl])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  function goSearch(e: React.FormEvent) {
    e.preventDefault()
    const query = q.trim()
    if (!query) return
    window.location.href = `${baseUrl}/${lang}/search?q=${encodeURIComponent(query)}`
  }

  return (
    <form className={`${styles.wrap} ${size === 'hero' ? styles.hero : ''}`} ref={box} onSubmit={goSearch} role="search">
      <span className={styles.icon} aria-hidden>⌕</span>
      <input
        className={styles.input}
        value={q}
        onChange={e => { setQ(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder || (size === 'hero' ? 'Search the Tipiṭaka' : 'Search titles and text…')}
        aria-label="Search the Tipiṭaka"
      />
      {open && q.trim().length >= 2 && (
        <div className={styles.panel} role="listbox">
          {hits.length === 0 && <div className={styles.empty}>No matching headings. Press Enter for full-text search.</div>}
          {hits.map(h => (
            <a
              key={`${h.book_id}-${h.para_id}`}
              className={styles.hit}
              href={`${baseUrl}/${lang}/book/${h.book_id}/${h.slug}`}
            >
              {h.title}
              <small>{h.book_name}</small>
            </a>
          ))}
          <a className={styles.hit} href={`${baseUrl}/${lang}/search?q=${encodeURIComponent(q.trim())}`}>
            Search all text for “{q.trim()}”
          </a>
        </div>
      )}
    </form>
  )
}
