import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  highlightMatch,
  parseSearchMode,
  readStoredMode,
  searchPageHref,
  searchText,
  searchTitles,
  storeSearchMode,
  type HeadingHit,
  type SearchMode,
  type FtsLine,
} from '../api/search'
import { interpolate, useUi } from '../i18n'
import styles from './SearchBox.module.css'

type Props = {
  baseUrl: string
  lang: string
  size?: 'nav' | 'hero' | 'page'
  placeholder?: string
  initialQuery?: string
  initialMode?: SearchMode
}

export function SearchBox({ baseUrl, lang, size = 'nav', placeholder, initialQuery = '', initialMode }: Props) {
  const { t } = useUi()
  const [q, setQ] = useState(initialQuery)
  const [mode, setMode] = useState<SearchMode>(() => initialMode || readStoredMode())
  const [titleHits, setTitleHits] = useState<HeadingHit[]>([])
  const [textHits, setTextHits] = useState<FtsLine[]>([])
  const [open, setOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const box = useRef<HTMLFormElement>(null)

  useEffect(() => {
    setQ(initialQuery)
  }, [initialQuery])

  useEffect(() => {
    if (initialMode) setMode(parseSearchMode(initialMode))
  }, [initialMode])

  useEffect(() => {
    const wait = setTimeout(async () => {
      const query = q.trim()
      if (query.length < 2) {
        setTitleHits([])
        setTextHits([])
        return
      }
      if (mode === 'text') {
        const data = await searchText(query, 8)
        setTextHits(data.results)
        setTitleHits([])
      } else {
        const data = await searchTitles(query, 8)
        setTitleHits(data.chapters)
        setTextHits([])
      }
    }, 160)
    return () => clearTimeout(wait)
  }, [q, mode])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) {
        setOpen(false)
        setFiltersOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  function applyMode(next: SearchMode) {
    setMode(next)
    storeSearchMode(next)
    setFiltersOpen(false)
    if (q.trim().length >= 2) setOpen(true)
  }

  function toggleFilters(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setFiltersOpen(v => !v)
    setOpen(false)
  }

  function goSearch(e: React.FormEvent) {
    e.preventDefault()
    const query = q.trim()
    if (!query) return
    storeSearchMode(mode)
    window.location.href = searchPageHref(baseUrl, lang, query, mode)
  }

  const showPanel = open && q.trim().length >= 2 && !filtersOpen
  const label = mode === 'text' ? t.searchPlaceholderText : t.searchPlaceholderTitles
  const empty = mode === 'text' ? t.searchNoText : t.searchNoTitles
  const resultsHref = searchPageHref(baseUrl, lang, q.trim(), mode)

  return (
    <form
      className={`${styles.wrap} ${styles[size] || ''}`}
      ref={box}
      onSubmit={goSearch}
      role="search"
    >
      <div className={styles.field}>
        <button
          className={styles.icon}
          type="button"
          aria-label={`${t.search}: ${mode === 'text' ? t.searchModeText : t.searchModeTitles}`}
          aria-expanded={filtersOpen}
          aria-haspopup="listbox"
          onClick={toggleFilters}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12.2 12.2L16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        <input
          className={styles.input}
          value={q}
          onChange={e => { setQ(e.target.value); setFiltersOpen(false); setOpen(true) }}
          onFocus={() => { setFiltersOpen(false); setOpen(true) }}
          placeholder={placeholder || label}
          aria-label={t.searchTipitaka}
        />
      </div>
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            className={styles.filterMenu}
            role="listbox"
            aria-label={t.search}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              role="option"
              aria-selected={mode === 'titles'}
              data-on={String(mode === 'titles')}
              onClick={() => applyMode('titles')}
            >
              <span>{t.searchModeTitles}</span>
              <small>{t.searchModeTitlesHint}</small>
            </button>
            <button
              type="button"
              role="option"
              aria-selected={mode === 'text'}
              data-on={String(mode === 'text')}
              onClick={() => applyMode('text')}
            >
              <span>{t.searchModeText}</span>
              <small>{t.searchModeTextHint}</small>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showPanel && (
          <motion.div
            className={styles.panel}
            role="listbox"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {mode === 'titles' && titleHits.length === 0 && <div className={styles.empty}>{empty}</div>}
            {mode === 'text' && textHits.length === 0 && <div className={styles.empty}>{empty}</div>}
            {mode === 'titles' && titleHits.map(h => (
              <a
                key={`${h.book_id}-${h.para_id}`}
                className={styles.hit}
                href={`${baseUrl}/${lang}/book/${h.book_id}/${h.slug}`}
              >
                <span className={styles.hitKicker}>{h.book_name}</span>
                <span
                  className={styles.hitTitle}
                  dangerouslySetInnerHTML={{ __html: highlightMatch(h.title, q) }}
                />
              </a>
            ))}
            {mode === 'text' && textHits.map(h => (
              <a
                key={`${h.book_id}-${h.para_id}`}
                className={styles.hit}
                href={`${baseUrl}/${lang}/book/${h.book_id}${h.slug ? `/${h.slug}` : ''}`}
              >
                <span className={styles.hitKicker}>{h.book_name} · {h.title}</span>
                <span
                  className={styles.hitSnippet}
                  dangerouslySetInnerHTML={{ __html: highlightMatch(h.snippet || h.translation || h.pali || '', q) }}
                />
              </a>
            ))}
            <a className={`${styles.hit} ${styles.more}`} href={resultsHref}>
              {interpolate(t.searchSeeAll, { q: q.trim() })}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}
