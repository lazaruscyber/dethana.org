import { motion } from 'framer-motion'
import { SearchBox } from './SearchBox'
import { Logo } from './Logo'
import { PageNav } from './PageNav'
import { springSnappy } from './motion'
import { useUi } from '../i18n'
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

function pathNow() {
  return window.location.pathname.replace(/\/+$/, '') || '/'
}

export function Header({
  baseUrl, lang, bookId, title, subtitle, bookmarked, showSearch,
  onMenu, onSettings, onBookmark,
}: Props) {
  const { t } = useUi()
  const path = pathNow()
  const langBrowse = `${baseUrl}/${lang}`
  const browseActive = path === '/browse' || path === langBrowse || path.startsWith(`${langBrowse}/`)

  return (
    <motion.header
      className={styles.header}
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.left}>
        <motion.button
          className={styles.icon}
          type="button"
          aria-label={t.contents}
          onClick={onMenu}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          transition={springSnappy}
        >
          ☰
        </motion.button>
        <Logo href="/" inverted />
        <PageNav baseUrl={baseUrl} lang={lang} />
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
          <motion.button
            className={`${styles.icon} ${bookmarked ? styles.on : ''}`}
            type="button"
            aria-label={bookmarked ? t.removeBookmark : t.bookmark}
            onClick={onBookmark}
            whileHover={{ scale: 1.12, y: -1 }}
            whileTap={{ scale: 0.88 }}
            transition={springSnappy}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M4 1.5h8A1.5 1.5 0 0 1 13.5 3v11.2L8 11.2 2.5 14.2V3A1.5 1.5 0 0 1 4 1.5z"
                fill={bookmarked ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.4"
              />
            </svg>
          </motion.button>
        )}
        <motion.button
          className={styles.iconA}
          type="button"
          aria-label={t.textSettings}
          onClick={onSettings}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          transition={springSnappy}
        >
          A
        </motion.button>
      </div>
      <nav className={styles.mobileNav} aria-label={t.sitePages}>
        <a href="/" data-on={String(path === '/')}>{t.home}</a>
        <a href={`${baseUrl}/browse`} data-on={String(browseActive)}>{t.browse}</a>
        <a href={`${baseUrl}/social-media`} data-on={String(path === '/social-media')}>{t.socialMedia}</a>
        <a href={`${baseUrl}/charity`} data-on={String(path === '/charity')}>{t.charity}</a>
      </nav>
    </motion.header>
  )
}
