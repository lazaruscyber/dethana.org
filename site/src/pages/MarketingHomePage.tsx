import { useEffect, useState } from 'react'
import { Logo } from '../ui/Logo'
import { useUi } from '../i18n'
import styles from '../ui/MarketingHome.module.css'

const SLIDES = [
  {
    image: '/hero/hero-manuscript.jpg',
    titleKey: 'slide1Title' as const,
    descKey: 'slide1Desc' as const,
  },
  {
    image: '/hero/hero-temple-dawn.jpg',
    titleKey: 'slide2Title' as const,
    descKey: 'slide2Desc' as const,
  },
  {
    image: '/hero/hero-library.jpg',
    titleKey: 'slide3Title' as const,
    descKey: 'slide3Desc' as const,
  },
  {
    image: '/hero/hero-river-dusk.jpg',
    titleKey: 'slide4Title' as const,
    descKey: 'slide4Desc' as const,
  },
]

export function MarketingHomePage() {
  const { t } = useUi()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex(current => (current + 1) % SLIDES.length)
    }, 7000)
    return () => window.clearInterval(id)
  }, [index])

  function go(next: number) {
    setIndex((next + SLIDES.length) % SLIDES.length)
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-roledescription="carousel" aria-label={t.home}>
        {SLIDES.map((slide, i) => (
          <div
            key={slide.image}
            className={`${styles.slide} ${i === index ? styles.slideActive : ''}`}
            aria-hidden={i !== index}
          >
            <div
              className={styles.bg}
              style={{ backgroundImage: `url(${slide.image})` }}
              role="img"
              aria-label=""
            />
            <div className={styles.veil} aria-hidden="true" />
            <div className={styles.copy}>
              <h1 className={styles.brand}>
                <Logo href="/" size="hero" />
              </h1>
              <h2 className={styles.title}>{t[slide.titleKey]}</h2>
              <p className={styles.desc}>{t[slide.descKey]}</p>
              <a className={styles.cta} href="/browse">{t.browseCta}</a>
            </div>
          </div>
        ))}
        <div className={styles.controls}>
          <button type="button" className={styles.arrow} aria-label={t.prevSlide} onClick={() => go(index - 1)}>
            ‹
          </button>
          <div className={styles.dots} role="tablist" aria-label={t.home}>
            {SLIDES.map((slide, i) => (
              <button
                key={slide.image}
                type="button"
                className={styles.dot}
                data-on={String(i === index)}
                aria-label={`${t.home} ${i + 1}`}
                aria-selected={i === index}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <button type="button" className={styles.arrow} aria-label={t.nextSlide} onClick={() => go(index + 1)}>
            ›
          </button>
        </div>
      </section>
    </div>
  )
}
