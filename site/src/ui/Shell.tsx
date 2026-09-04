import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { SiteLanguageField } from './SiteLanguageField'
import { fetchMenu } from '../api/menu'
import { applyTheme } from './theme'
import { initCookieConsent } from '../cookie-consent.js'
import { useUi } from '../i18n'
import { ModalLayer } from './motion'
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
  const { t } = useUi()
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
      <a className="skip-link" href="#main-content">{t.skipToContent}</a>
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
        <AnimatePresence>
          {navOpen && (
            <motion.button
              className={styles.backdrop}
              aria-label={t.close}
              onClick={() => setNavOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
        <main id="main-content" className={styles.main}>
          {children}
          {!hideFooter && (
            <motion.div
              className={styles.footer}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {[
                [`${baseUrl}/blog`, t.blogs],
                [`${baseUrl}/about`, t.about],
                [`${baseUrl}/translation-policy`, t.translationPolicy],
                [`${baseUrl}/dana`, t.dana],
                [`${baseUrl}/privacy`, t.privacy],
              ].map(([href, label]) => (
                <a key={href} href={href}>{label}</a>
              ))}
              <span>Dethana</span>
            </motion.div>
          )}
        </main>
      </div>
      <ModalLayer open={panel} onClose={() => setPanel(false)} className={styles.modal} boxClassName={styles.modalBox}>
        <h2>{t.textSettings}</h2>
        <SiteLanguageField />
        {langs.length > 0 && (
          <div className={styles.field}>
            {t.scriptureTranslation}
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
        <button className={styles.close} type="button" onClick={() => setPanel(false)}>{t.close}</button>
      </ModalLayer>
    </div>
  )
}
