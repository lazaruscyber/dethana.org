import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Shell } from '../ui/Shell'
import { loadSettings, saveSettings, applySettings, defaultSettings } from '../settings.js'
import { TextProcessor, Script } from '../pali-script.js'
import { fetchBook, fetchSection, slugForHeading } from '../api/menu'
import { BASE_URL } from '../routes'
import { applySeo, SITE_ORIGIN } from '../seo'
import { interpolate, useUi } from '../i18n'
import { SiteLanguageField } from '../ui/SiteLanguageField'
import { bindPaliTooltips, wrapPaliWords } from '../pali-gloss'
import { fadeUp, ModalLayer, springSnappy } from '../ui/motion'
import type { BookFile, LangInfo, SectionData, TocItem } from '../types'
import styles from '../ui/Reader.module.css'
import '../ui/content.css'

type Props = {
  lang: string
  bookId: string
  paraId: number | null
  langs: LangInfo[]
}

const BANNER_KEY = 'dethana_hide_script_banner'
const BOOKMARK_KEY = 'epitaka_bookmarks'

function readerScript(settings: Record<string, any>) {
  if (settings.scriptManuallySet && settings.paliScript) return settings.paliScript
  return Script.MY
}

function paliScriptOptions(t: { scriptBurmese: string; scriptRoman: string; scriptSinhala: string; scriptDevanagari: string; scriptThai: string }) {
  return [
    { id: Script.MY, label: t.scriptBurmese },
    { id: Script.RO, label: t.scriptRoman },
    { id: Script.SI, label: t.scriptSinhala },
    { id: Script.HI, label: t.scriptDevanagari },
    { id: Script.THAI, label: t.scriptThai },
  ]
}

function convertPaliHtml(html: string, targetScript: string) {
  return html.replace(/(<[^>]+>)|([^<]+)/g, (_m: string, tag: string, text: string) => {
    if (tag) return tag
    if (!text) return ''
    return wrapPaliWords(TextProcessor.convert(TextProcessor.convertFromMixed(text), targetScript))
  })
}

function bookmarkId(bookId: string, paraId: number | null) {
  return `${bookId}:${paraId || 0}`
}

function loadBookmarks(): string[] {
  try { return JSON.parse(localStorage.getItem(BOOKMARK_KEY) || '[]') } catch { return [] }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderSection(data: SectionData) {
  const rows = (data.sentences || []).map(s => {
    const pages = [
      s.vripage && `<span class="page-num-badge" data-page-system="vri">VRI ${s.vripage}</span>`,
      s.ptspage && `<span class="page-num-badge" data-page-system="pts">PTS ${s.ptspage}</span>`,
      s.mypage && `<span class="page-num-badge" data-page-system="myanmar">Myanmar ${s.mypage}</span>`,
      s.thaipage && `<span class="page-num-badge" data-page-system="thai">Thai ${s.thaipage}</span>`,
    ].filter(Boolean).join('')
    const tr = s.translation ? `<div class="translation-text">${s.translation}</div>` : ''
    return `<div class="sentence-row" id="p-${s.para_id}-l-${s.line_id}">
      <div class="pali-text">${s.pali || ''}</div>${pages}${tr}
    </div>`
  }).join('')
  return rows
}

function buildArticle(book: BookFile, lang: string) {
  const article = document.createElement('article')
  article.id = 'book-article'
  article.className = 'reader-focus'
  for (const item of book.toc || []) {
    const slug = item.slug || slugForHeading(item.title, item.para_id)
    const section = document.createElement('section')
    section.className = 'section-block'
    section.id = `para-${item.para_id}`
    section.dataset.paraId = String(item.para_id)
    section.setAttribute('aria-label', item.title)
    if (item.has_content) {
      section.innerHTML = `
        <a href="${BASE_URL}/${lang}/book/${book.book_id}/${slug}" class="section-heading-link" data-level="${item.level}">
          <span class="section-heading-label">
            <span class="section-heading-text pali-text">${escapeHtml(item.title)}</span>
          </span>
        </a>
        <div class="section-content" aria-hidden="true"></div>`
    } else {
      section.innerHTML = `
        <div class="section-heading-link section-heading-empty" data-level="${item.level}">
          <span class="section-heading-label">
            <span class="section-heading-text pali-text">${escapeHtml(item.title)}</span>
          </span>
        </div>
        <div class="section-content" aria-hidden="true"></div>`
    }
    article.appendChild(section)
  }
  return article
}

export function Reader({ lang, bookId, paraId, langs }: Props) {
  const { t } = useUi()
  const host = useRef<HTMLDivElement>(null)
  const original = useRef(new WeakMap<Element, string>())
  const bookRef = useRef<BookFile | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [scriptOpen, setScriptOpen] = useState(false)
  const [banner, setBanner] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [book, setBook] = useState<BookFile | null>(null)
  const [settings, setSettings] = useState(() => loadSettings(lang))
  const [activePara, setActivePara] = useState<number | null>(paraId)
  const [bookmarked, setBookmarked] = useState(false)
  const scriptRef = useRef(readerScript(settings))
  const toc: TocItem[] = book?.toc || []
  const section = toc.find(t => t.para_id === activePara)
  const headerTitle = book?.book_name || bookId

  useEffect(() => {
    scriptRef.current = readerScript(settings)
  }, [settings])

  useEffect(() => {
    try { setBanner(localStorage.getItem(BANNER_KEY) !== '1') } catch { setBanner(true) }
    setBookmarked(loadBookmarks().includes(bookmarkId(bookId, activePara)))
  }, [bookId, activePara])

  useEffect(() => {
    const name = book?.book_name || bookId
    const heading = toc.find(t => t.para_id === activePara)?.title
    const title = heading
      ? `${heading} — ${name} | Dethana.org`
      : `${name} | Tipiṭaka | Dethana.org`
    const description = heading
      ? `Read “${heading}” from ${name} in Pāli with English on Dethana.org, a Chaṭṭha Saṅgāyana Tipiṭaka reader.`
      : `Read ${name} in Pāli with English study translation on Dethana.org. Chaṭṭha Saṅgāyana (VRI) Tipiṭaka.`
    applySeo({
      title,
      description,
      path: window.location.pathname,
      type: 'book',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Book',
        name,
        inLanguage: ['pi', 'en'],
        url: `${SITE_ORIGIN}${window.location.pathname}`,
        publisher: { '@type': 'Organization', name: 'Dethana.org', url: SITE_ORIGIN },
        isPartOf: { '@type': 'CreativeWork', name: 'Chaṭṭha Saṅgāyana Tipiṭaka' },
      },
    })
  }, [book, bookId, activePara])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    fetchBook(bookId)
      .then(data => {
        if (cancelled) return
        bookRef.current = data
        setBook(data)
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setError(t.bookMissing)
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [bookId, t.bookMissing])

  useEffect(() => {
    const root = host.current
    if (!root) return
    return bindPaliTooltips(root, t.paliGlossMissing)
  }, [t.paliGlossMissing])

  useEffect(() => {
    const root = host.current
    if (!root || !book) return
    root.innerHTML = ''
    const article = buildArticle(book, lang)
    root.appendChild(article)
    applyReader(settings)

    const openSection = async (pid: number, href?: string) => {
      const sectionEl = root.querySelector(`.section-block[data-para-id="${pid}"]`) as HTMLElement | null
      const content = sectionEl?.querySelector('.section-content') as HTMLElement | null
      if (!content) return
      root.querySelectorAll('.section-content.open').forEach(el => {
        if (el !== content) {
          el.classList.remove('open')
          el.setAttribute('aria-hidden', 'true')
        }
      })
      let payload = bookRef.current?.sections?.[String(pid)]
      if (!payload) {
        content.innerHTML = '<p class="translation-text">Loading…</p>'
        try {
          payload = await fetchSection(bookId, pid)
          if (bookRef.current) {
            bookRef.current.sections = bookRef.current.sections || {}
            bookRef.current.sections[String(pid)] = payload
          }
        } catch {
          payload = { sentences: [] }
        }
      }
      content.innerHTML = payload?.sentences?.length
        ? renderSection(payload)
        : '<p class="translation-text">No text in this section.</p>'
      content.classList.add('open')
      content.setAttribute('aria-hidden', 'false')
      setActivePara(pid)
      applyPaliScript(scriptRef.current)
      if (href) window.history.replaceState({}, '', href)
    }

    const onClick = (e: MouseEvent) => {
      const row = (e.target as HTMLElement).closest('.sentence-row') as HTMLElement | null
      if (row && root.contains(row) && !(e.target as HTMLElement).closest('a')) {
        root.querySelectorAll('.sentence-row.is-active').forEach(el => el.classList.remove('is-active'))
        row.classList.add('is-active')
      }
      const a = (e.target as HTMLElement).closest('a.section-heading-link') as HTMLAnchorElement | null
      if (!a || !root.contains(a)) return
      const sectionEl = a.closest('.section-block') as HTMLElement | null
      const pid = Number(sectionEl?.dataset.paraId)
      if (!pid) return
      e.preventDefault()
      void openSection(pid, a.href)
    }
    root.addEventListener('click', onClick)

    const start = paraId
      || toc.find(t => t.has_content)?.para_id
      || null
    if (start) {
      const link = root.querySelector(`.section-block[data-para-id="${start}"] a.section-heading-link`) as HTMLAnchorElement | null
      void openSection(start, link?.href)
    }

    return () => root.removeEventListener('click', onClick)
  }, [book, lang])

  function applyPaliScript(targetScript: string) {
    document.body.setAttribute('script', targetScript)
    document.querySelectorAll('.pali-text, .book-link-badge').forEach(el => {
      if (!original.current.has(el)) original.current.set(el, el.innerHTML)
      const source = original.current.get(el) || ''
      el.innerHTML = convertPaliHtml(source, targetScript)
    })
  }

  function applyReader(next: Record<string, any>) {
    const script = readerScript(next)
    const patched = {
      ...next,
      paliScript: script,
      paliColor: '#1a1a1a',
      transColor: '#2c2c2c',
      pageSystem: 'none',
    }
    applySettings(patched)
    document.body.setAttribute('data-layout', next.layout || 'stacked')
    document.body.setAttribute('data-page', 'none')
    applyPaliScript(script)
  }

  function save() {
    const next = { ...settings, scriptManuallySet: true, paliScript: settings.paliScript || Script.MY }
    saveSettings(next)
    applyReader(next)
    setSettings(next)
    setSettingsOpen(false)
  }

  function setPaliScript(paliScript: string) {
    const next = { ...settings, paliScript, scriptManuallySet: true }
    setSettings(next)
    saveSettings(next)
    applyReader(next)
  }

  function dismissBanner() {
    try { localStorage.setItem(BANNER_KEY, '1') } catch { /* ignore */ }
    setBanner(false)
    setScriptOpen(false)
  }

  function toggleBookmark() {
    const id = bookmarkId(bookId, activePara)
    const all = loadBookmarks()
    const next = all.includes(id) ? all.filter(x => x !== id) : [...all, id]
    try { localStorage.setItem(BOOKMARK_KEY, JSON.stringify(next)) } catch { /* ignore */ }
    setBookmarked(next.includes(id))
  }

  return (
    <Shell
      baseUrl={BASE_URL}
      lang={lang}
      langs={langs}
      bookId={bookId}
      title={headerTitle}
      subtitle="The Chaṭṭha Saṅgāyana Tipiṭaka"
      toc={toc}
      activePara={activePara}
      sidebarMode="toc"
      bookmarked={bookmarked}
      showClose
      showSearch={false}
      hideFooter
      onSettings={() => setSettingsOpen(true)}
      onBookmark={toggleBookmark}
    >
      {banner && (
        <motion.div
          className={styles.banner}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <span>{t.changeTranslation}</span>
          <motion.button
            className={styles.bannerBtn}
            type="button"
            onClick={() => setScriptOpen(v => !v)}
            whileHover={{ y: -1, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={springSnappy}
          >
            {paliScriptOptions(t).find(opt => opt.id === readerScript(settings))?.label || t.goToTranslations}
          </motion.button>
          <button className={styles.bannerX} type="button" aria-label={t.dismiss} onClick={dismissBanner}>×</button>
        </motion.div>
      )}
      <AnimatePresence>
        {banner && scriptOpen && (
          <motion.div
            className={styles.langPanel}
            role="listbox"
            aria-label={t.paliScript}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {paliScriptOptions(t).map(opt => (
              <button
                key={opt.id}
                type="button"
                data-on={String(readerScript(settings) === opt.id)}
                onClick={() => setPaliScript(opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className={styles.folio}
        key={`${bookId}-${section?.title || ''}`}
        initial="hidden"
        animate="show"
        variants={fadeUp}
      >
        <h1 className={styles.folioTitle}>{book?.book_name || bookId}</h1>
        <p className={styles.folioMark}>{section?.title || (loading ? t.loading : bookId)}</p>
      </motion.div>
      {error && <p className={styles.folioMark}>{error}</p>}
      <div className={styles.article} ref={host} />

      <ModalLayer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        className={styles.modal}
        boxClassName={styles.modalBox}
      >
            <h2>{t.textSettings}</h2>
            <SiteLanguageField />
            <label className={styles.field}>
              {t.paliScript}
              <select value={settings.paliScript} onChange={e => {
                const paliScript = e.target.value
                setPaliScript(paliScript)
              }}>
                <option value={Script.MY}>{t.scriptBurmese}</option>
                <option value={Script.RO}>{t.scriptRoman}</option>
                <option value={Script.SI}>{t.scriptSinhala}</option>
                <option value={Script.HI}>{t.scriptDevanagari}</option>
                <option value={Script.THAI}>{t.scriptThai}</option>
              </select>
            </label>
            <label className={styles.field}>
              {t.layout}
              <select value={settings.layout} onChange={e => setSettings({ ...settings, layout: e.target.value })}>
                <option value="stacked">{t.stacked}</option>
                <option value="sidebyside">{t.sideBySide}</option>
              </select>
            </label>
            <label className={styles.field}>
              {interpolate(t.fontSize, { n: settings.fontSize })}
              <input type="range" min={16} max={32} value={settings.fontSize}
                onChange={e => setSettings({ ...settings, fontSize: Number(e.target.value) })} />
            </label>
            <label className={styles.field}>
              <span><input type="checkbox" checked={settings.pali} onChange={e => setSettings({ ...settings, pali: e.target.checked })} /> {t.showPali}</span>
            </label>
            <label className={styles.field}>
              <span><input type="checkbox" checked={settings.translation} onChange={e => setSettings({ ...settings, translation: e.target.checked })} /> {t.showTranslation}</span>
            </label>
            <div className={styles.actions}>
              <button className={styles.btn} type="button" onClick={() => {
                const next = { ...defaultSettings(), paliScript: Script.MY, scriptManuallySet: false }
                setSettings(next)
                applyPaliScript(next.paliScript)
              }}>{t.reset}</button>
              <button className={`${styles.btn} ${styles.btnPrimary}`} type="button" onClick={save}>{t.save}</button>
            </div>
      </ModalLayer>
    </Shell>
  )
}
