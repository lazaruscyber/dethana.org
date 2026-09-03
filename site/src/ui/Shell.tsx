import { useEffect, useState, type ReactNode } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { fetchMenu } from '../api/menu'
import { applyTheme } from './theme'
import { initCookieConsent } from '../cookie-consent.js'
import type { LangInfo, MenuTree, TocItem } from '../types'
import styles from './Shell.module.css'

type Props = {
  baseUrl: string
  lang: string
  langs: LangInfo[]
  bookId?: string
  title?: string
  subtitle?: string
  toc?: TocItem[]
  activePara?: number | null
  sidebarMode?: 'library' | 'toc'
  bookmarked?: boolean
  showClose?: boolean
  showSearch?: boolean
  hideFooter?: boolean
  fullBleed?: boolean
  onSettings?: () => void
  onBookmark?: () => void
  children: ReactNode
}

export function Shell({
  baseUrl, lang, langs, bookId, title, subtitle, toc, activePara, sidebarMode,
  bookmarked, showClose, showSearch, hideFooter, fullBleed, onSettings, onBookmark, children,
}: Props) {
  const [menu, setMenu] = useState<MenuTree>({})
  const [navOpen, setNavOpen] = useState(false)
  const [panel, setPanel] = useState(false)

  useEffect(() => {
    applyTheme('light')
    initCookieConsent({ gaId: 'G-7NQWX1DCC2' })
    fetchMenu(baseUrl).then(data => setMenu(data.menu || {})).catch(() => setMenu({}))
  }, [baseUrl])

  const mode = sidebarMode || (toc?.length ? 'toc' : 'library')

  return (
    <div className={`${styles.layout} ${fullBleed ? styles.fullBleed : ''}`}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header
        baseUrl={baseUrl}
        lang={lang}
        langs={langs}
        bookId={bookId}
        title={title}
        subtitle={subtitle}
        bookmarked={bookmarked}
        showClose={showClose}
        showSearch={showSearch}
        onMenu={() => setNavOpen(v => !v)}
        onSettings={onSettings || (() => setPanel(true))}
        onBookmark={onBookmark}
      />
      <div className={styles.body}>
        <Sidebar
          mode={mode}
          menu={menu}
          lang={lang}
          baseUrl={baseUrl}
          open={navOpen}
          toc={toc}
          bookId={bookId}
          activePara={activePara}
        />
        {navOpen && <button className={styles.backdrop} aria-label="Close menu" onClick={() => setNavOpen(false)} />}
        <main id="main-content" className={styles.main}>
          {children}
          {!hideFooter && (
            <div className={styles.footer}>
              <a href={`${baseUrl}/about`}>About</a>
              <a href={`${baseUrl}/translation-policy`}>Translation Policy</a>
              <a href={`${baseUrl}/dana`}>Dana</a>
              <a href={`${baseUrl}/privacy`}>Privacy</a>
              <span>Dethana</span>
            </div>
          )}
        </main>
      </div>
      {panel && (
        <div className={styles.modal} role="dialog" aria-modal="true" onClick={() => setPanel(false)}>
          <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
            <h2>Text settings</h2>
            {langs.length > 0 && (
              <div className={styles.field}>
                Translation
                <div className={styles.langs}>
                  {langs.map(l => (
                    <a
                      key={l.code}
                      href={bookId ? `${baseUrl}/${l.code}/book/${bookId}` : `${baseUrl}/${l.code}/`}
                      data-on={String(l.code === lang)}
                    >
                      {l.english_name || l.code}
                    </a>
                  ))}
                </div>
              </div>
            )}
            <button className={styles.close} type="button" onClick={() => setPanel(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
