import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { COLLECTIONS } from '../api/collections'
import { blogPath, postsByDate } from '../blog/posts'
import { SearchBox } from '../ui/SearchBox'
import { easeOut, fadeUp, springSnappy, stagger, viewOnce } from '../ui/motion'
import { formatUiDate, useUi } from '../i18n'
import type { IndexConfig } from '../types'
import styles from '../ui/Home.module.css'

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
        <motion.div
          className={styles.heroInner}
          variants={stagger(0.12, 0.08)}
          initial="hidden"
          animate="show"
        >
          <motion.h1 className={styles.question} variants={fadeUp}>Dethana.org</motion.h1>
          <motion.span
            className={styles.heroRule}
            aria-hidden
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.7, ease: easeOut }}
          />
          <motion.p className={styles.tagline} variants={fadeUp}>
            “Go forth, O bhikkhus, for the good of the many… Teach, O bhikkhus, the Dhamma that is good in the beginning, good in the middle, and good in the end…”
          </motion.p>
          <motion.div className={styles.heroSearch} variants={fadeUp}>
            <SearchBox
              baseUrl={config.baseUrl}
              lang={config.lang}
              size="hero"
            />
          </motion.div>
          <motion.div className={styles.popular} variants={fadeUp}>
            <span>{t.popularSearches}</span>
            {POPULAR.map(item => (
              <a key={item.label} href={item.href(config.baseUrl, config.lang)}>
                {item.label}
              </a>
            ))}
          </motion.div>
        </motion.div>
        <motion.div
          className={styles.waves}
          aria-hidden="true"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.9, ease: easeOut }}
        >
          <svg viewBox="0 0 1440 90" preserveAspectRatio="none">
            <path fill="#9eb6c9" d="M0,50 C240,90 480,10 720,40 C960,70 1200,20 1440,48 L1440,90 L0,90 Z" />
            <path fill="#d5e0ea" d="M0,62 C300,20 620,88 900,50 C1140,22 1300,70 1440,58 L1440,90 L0,90 Z" />
            <path fill="#ffffff" d="M0,72 C360,40 780,100 1100,68 C1280,50 1380,78 1440,70 L1440,90 L0,90 Z" />
          </svg>
        </motion.div>
      </section>

      <section className={styles.body} id="get-started">
        <div className={styles.columns}>
          <div>
            <motion.h2
              className={styles.getStarted}
              initial="hidden"
              whileInView="show"
              viewport={viewOnce}
              variants={fadeUp}
            >
              {t.getStarted}
            </motion.h2>
            <div className={styles.grid}>
              {COLLECTIONS.map((item, i) => {
                const copy = {
                  nikaya: { title: t.colNikayaTitle, desc: t.colNikayaDesc },
                  abhidhamma: { title: t.colAbhiTitle, desc: t.colAbhiDesc },
                  vinaya: { title: t.colVinayaTitle, desc: t.colVinayaDesc },
                  expositions: { title: t.colExpTitle, desc: t.colExpDesc },
                }[item.id]
                return (
                <motion.a
                  key={item.id}
                  className={styles.tile}
                  href={item.href(config.baseUrl, config.lang)}
                  data-icon={i}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewOnce}
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.99 }}
                  transition={springSnappy}
                >
                  <motion.span
                    className={styles.tileIcon}
                    whileHover={{ rotate: -8, scale: 1.08 }}
                    transition={springSnappy}
                  >
                    {ICONS[i]}
                  </motion.span>
                  <span className={styles.tileCopy}>
                    <span className={styles.tileTitle}>{copy?.title || item.title}</span>
                    <span className={styles.tileNote}>{item.note}</span>
                    <span className={styles.tileDesc}>{copy?.desc || item.description}</span>
                  </span>
                </motion.a>
                )
              })}
            </div>
          </div>
          <motion.aside
            className={styles.help}
            initial="hidden"
            whileInView="show"
            viewport={viewOnce}
            variants={fadeUp}
          >
            <h2>{t.supportThisSite}</h2>
            <p>{t.supportBlurb}</p>
            <motion.a
              className={styles.contact}
              href={`${config.baseUrl}/dana`}
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={springSnappy}
            >
              {t.supportWithDana}
            </motion.a>
          </motion.aside>
        </div>
      </section>

      {featured && (
        <section className={styles.journal} id="blogs" aria-labelledby="blogs-heading">
          <div className={styles.journalInner}>
            <motion.div
              className={styles.journalHead}
              initial="hidden"
              whileInView="show"
              viewport={viewOnce}
              variants={fadeUp}
            >
              <div>
                <p className={styles.journalKicker}>{t.blogsKicker}</p>
                <h2 id="blogs-heading" className={styles.journalTitle}>{t.blogs}</h2>
              </div>
              <motion.a
                className={styles.journalAll}
                href={blogPath()}
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={springSnappy}
              >
                {t.allBlogs}
              </motion.a>
            </motion.div>
            <div className={styles.journalGrid}>
              <motion.a
                className={styles.featured}
                href={blogPath(featured.slug)}
                initial="hidden"
                whileInView="show"
                viewport={viewOnce}
                variants={fadeUp}
                whileHover={{ y: -6, boxShadow: '0 18px 40px rgba(14, 42, 71, 0.1)' }}
                transition={{ duration: 0.35, ease: easeOut }}
              >
                <span className={styles.featuredKicker}>{featured.kicker}</span>
                <span className={styles.featuredTitle}>{featured.title}</span>
                <time className={styles.featuredDate} dateTime={featured.date}>
                  {formatUiDate(featured.date, uiLang, 'short')}
                </time>
                <span className={styles.featuredExcerpt}>{featured.excerpt}</span>
                <span className={styles.featuredRead}>{t.readArticle}</span>
              </motion.a>
              <ul className={styles.journalList}>
                {rest.map((post, i) => (
                  <motion.li
                    key={post.slug}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewOnce}
                    transition={{ delay: i * 0.08, duration: 0.45, ease: easeOut }}
                  >
                    <a href={blogPath(post.slug)}>
                      <span className={styles.sideKicker}>{post.kicker}</span>
                      <span className={styles.sideTitle}>{post.title}</span>
                      <time dateTime={post.date}>{formatUiDate(post.date, uiLang, 'short')}</time>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      <AnimatePresence>
        {disclaimer && (
          <motion.div
            className={styles.overlay}
            role="dialog"
            aria-modal="true"
            aria-labelledby="disc-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.card}
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            >
              <h2 id="disc-title">{t.researchTranslations}</h2>
              <p>{t.disclaimerBody}</p>
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  try { localStorage.setItem('epika_disclaimer_skip', '1') } catch { /* ignore */ }
                  setDisclaimer(false)
                }}
              >
                {t.continue}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
