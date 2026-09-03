import { useEffect, useState } from 'react'
import { COLLECTIONS } from '../api/collections'
import { blogPath, postsByDate } from '../blog/posts'
import { SearchBox } from '../ui/SearchBox'
import { useUi } from '../i18n'
import type { IndexConfig } from '../types'
import styles from '../ui/Home.module.css'

function formatDate(iso: string, locale: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(locale === 'my' ? 'my-MM' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const POPULAR = [
  { label: 'Dhammapada', href: (base: string, lang: string) => `${base}/${lang}/book/Dhp` },
  { label: 'Vinaya', href: (base: string, lang: string) => `${base}/${lang}/collection/vinaya` },
  { label: 'Abhidhamma', href: (base: string, lang: string) => `${base}/${lang}/collection/abhidhamma` },
]

const ICONS = [
  <svg key="book" viewBox="0 0 32 32" aria-hidden="true"><path d="M7 6.5h11.5a3.5 3.5 0 0 1 3.5 3.5v15.2H10A3 3 0 0 1 7 22.2V6.5z" fill="none" stroke="currentColor" strokeWidth="1.7"/><path d="M10.5 25.2h14V9.2" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>,
  <svg key="abhi" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.7"/><path d="M16 10.5v5.2l3.4 2.1" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>,
  <svg key="vinaya" viewBox="0 0 32 32" aria-hidden="true"><path d="M10 7h12M16 7v18M9 25h14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/><path d="M11 13h10M11 18h10" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>,
  <svg key="comm" viewBox="0 0 32 32" aria-hidden="true"><path d="M8 8h16v18H8z" fill="none" stroke="currentColor" strokeWidth="1.7"/><path d="M12 13h8M12 17h8M12 21h5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>,
]

export function Home({ config }: { config: IndexConfig }) {
  const { t, uiLang } = useUi()
  const [disclaimer, setDisclaimer] = useState(false)
  const posts = postsByDate()
  const featured = posts[0]
  const rest = posts.slice(1, 4)

  useEffect(() => {
    try { setDisclaimer(localStorage.getItem('epika_disclaimer_skip') !== '1') } catch { setDisclaimer(true) }
  }, [])

  return (
    <div className={styles.landing}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.question}>Dethana.org</h1>
          <p className={styles.tagline}>
            “Go forth, O bhikkhus, for the good of the many… Teach, O bhikkhus, the Dhamma that is good in the beginning, good in the middle, and good in the end…”
          </p>
          <div className={styles.heroSearch}>
            <SearchBox
              baseUrl={config.baseUrl}
              lang={config.lang}
              size="hero"
              placeholder={t.searchTipitaka}
            />
          </div>
          <div className={styles.popular}>
            <span>{t.popularSearches}</span>
            {POPULAR.map(item => (
              <a key={item.label} href={item.href(config.baseUrl, config.lang)}>{item.label}</a>
            ))}
          </div>
        </div>
        <div className={styles.waves} aria-hidden="true">
          <svg viewBox="0 0 1440 90" preserveAspectRatio="none">
            <path fill="#9eb6c9" d="M0,50 C240,90 480,10 720,40 C960,70 1200,20 1440,48 L1440,90 L0,90 Z" />
            <path fill="#d5e0ea" d="M0,62 C300,20 620,88 900,50 C1140,22 1300,70 1440,58 L1440,90 L0,90 Z" />
            <path fill="#ffffff" d="M0,72 C360,40 780,100 1100,68 C1280,50 1380,78 1440,70 L1440,90 L0,90 Z" />
          </svg>
        </div>
      </section>

      <section className={styles.body} id="get-started">
        <div className={styles.columns}>
          <div>
            <h2 className={styles.getStarted}>{t.getStarted}</h2>
            <div className={styles.grid}>
              {COLLECTIONS.map((item, i) => {
                const copy = {
                  nikaya: { title: t.colNikayaTitle, desc: t.colNikayaDesc },
                  abhidhamma: { title: t.colAbhiTitle, desc: t.colAbhiDesc },
                  vinaya: { title: t.colVinayaTitle, desc: t.colVinayaDesc },
                  expositions: { title: t.colExpTitle, desc: t.colExpDesc },
                }[item.id]
                return (
                <a key={item.id} className={styles.tile} href={item.href(config.baseUrl, config.lang)} data-icon={i}>
                  <span className={styles.tileIcon}>{ICONS[i]}</span>
                  <span className={styles.tileCopy}>
                    <span className={styles.tileTitle}>{copy?.title || item.title}</span>
                    <span className={styles.tileNote}>{item.note}</span>
                    <span className={styles.tileDesc}>{copy?.desc || item.description}</span>
                  </span>
                </a>
                )
              })}
            </div>
          </div>
          <aside className={styles.help}>
            <h2>{t.supportThisSite}</h2>
            <p>{t.supportBlurb}</p>
            <a className={styles.contact} href={`${config.baseUrl}/dana`}>{t.supportWithDana}</a>
          </aside>
        </div>
      </section>

      {featured && (
        <section className={styles.journal} id="blogs" aria-labelledby="blogs-heading">
          <div className={styles.journalInner}>
            <div className={styles.journalHead}>
              <div>
                <p className={styles.journalKicker}>{t.blogsKicker}</p>
                <h2 id="blogs-heading" className={styles.journalTitle}>{t.blogs}</h2>
              </div>
              <a className={styles.journalAll} href={blogPath()}>{t.allBlogs}</a>
            </div>
            <div className={styles.journalGrid}>
              <a className={styles.featured} href={blogPath(featured.slug)}>
                <span className={styles.featuredKicker}>{featured.kicker}</span>
                <span className={styles.featuredTitle}>{featured.title}</span>
                <time className={styles.featuredDate} dateTime={featured.date}>
                  {formatDate(featured.date, uiLang)}
                </time>
                <span className={styles.featuredExcerpt}>{featured.excerpt}</span>
                <span className={styles.featuredRead}>{t.readArticle}</span>
              </a>
              <ul className={styles.journalList}>
                {rest.map(post => (
                  <li key={post.slug}>
                    <a href={blogPath(post.slug)}>
                      <span className={styles.sideKicker}>{post.kicker}</span>
                      <span className={styles.sideTitle}>{post.title}</span>
                      <time dateTime={post.date}>{formatDate(post.date, uiLang)}</time>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {disclaimer && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="disc-title">
          <div className={styles.card}>
            <h2 id="disc-title">{t.researchTranslations}</h2>
            <p>{t.disclaimerBody}</p>
            <button type="button" onClick={() => {
              try { localStorage.setItem('epika_disclaimer_skip', '1') } catch { /* ignore */ }
              setDisclaimer(false)
            }}>{t.continue}</button>
          </div>
        </div>
      )}
    </div>
  )
}
