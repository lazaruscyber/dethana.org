import { SearchBox } from './SearchBox'
import { Logo } from './Logo'
import type { LangInfo } from '../types'
import styles from './Header.module.css'

type Props = {
  baseUrl: string
  lang: string
  langs: LangInfo[]
  bookId?: string
  title?: string
  subtitle?: string
  bookmarked?: boolean
  showClose?: boolean
  showSearch?: boolean
  onMenu: () => void
  onSettings?: () => void
  onBookmark?: () => void
}

export function Header({
  baseUrl, lang, bookId, title, subtitle, bookmarked, showSearch,
  onMenu, onSettings, onBookmark,
}: Props) {
  const home = `${baseUrl}/${lang}/`
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.icon} type="button" aria-label="Contents" onClick={onMenu}>☰</button>
        <Logo href={home} inverted />
      </div>
      <div className={styles.center}>
        {bookId ? (
          <>
            <a className={styles.title} href={`${baseUrl}/${lang}/book/${bookId}`}>
              {title}
            </a>
            {subtitle && <p className={styles.sub}>{subtitle}</p>}
          </>
        ) : null}
      </div>
      <div className={styles.right}>
        {showSearch !== false && (
          <div className={styles.searchWrap}>
            <SearchBox baseUrl={baseUrl} lang={lang} />
          </div>
        )}
        {onBookmark && (
          <button
            className={`${styles.icon} ${bookmarked ? styles.on : ''}`}
            type="button"
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark'}
            onClick={onBookmark}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M4 1.5h8A1.5 1.5 0 0 1 13.5 3v11.2L8 11.2 2.5 14.2V3A1.5 1.5 0 0 1 4 1.5z"
                fill={bookmarked ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.4"
              />
            </svg>
          </button>
        )}
        <button className={styles.iconA} type="button" aria-label="Text settings" onClick={onSettings}>A</button>
      </div>
    </header>
  )
}
