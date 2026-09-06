import { useState } from 'react'
import { motion } from 'framer-motion'
import { useUi } from '../i18n'
import { Logo } from '../ui/Logo'
import { fadeUp, PageEnter, stagger } from '../ui/motion'
import styles from '../ui/Brandkit.module.css'

const COLORS = [
  { name: 'Navy', hex: '#0e2a47', varName: '--navy' },
  { name: 'Navy deep', hex: '#081828', varName: '--navy-deep' },
  { name: 'Navy mid', hex: '#163a5c', varName: '--navy-mid' },
  { name: 'Gold', hex: '#c4a265', varName: '--gold' },
  { name: 'Surface', hex: '#ffffff', varName: '--surface' },
  { name: 'Surface 2', hex: '#f0f4f8', varName: '--surface-2' },
  { name: 'Border', hex: '#d7e0e8', varName: '--border' },
  { name: 'Accent light', hex: '#e8eef4', varName: '--accent-light' },
  { name: 'Text', hex: '#1a1a1a', varName: '--text' },
  { name: 'Muted', hex: '#6b7380', varName: '--muted' },
] as const

export function BrandkitPage() {
  const { t } = useUi()
  const [copied, setCopied] = useState<string | null>(null)

  async function copyHex(hex: string) {
    try {
      await navigator.clipboard.writeText(hex)
      setCopied(hex)
      window.setTimeout(() => setCopied(current => (current === hex ? null : current)), 1400)
    } catch {
      /* clipboard may be unavailable */
    }
  }

  return (
    <PageEnter className={styles.page}>
      <p className={styles.crumb}>
        <a href="/en/">{t.home}</a>
        <span aria-hidden> / </span>
        <span>{t.brandkit}</span>
      </p>
      <motion.div variants={stagger(0.08, 0.05)} initial="hidden" animate="show">
        <motion.h1 className={styles.title} variants={fadeUp}>{t.brandkitTitle}</motion.h1>
        <motion.p className={styles.lead} variants={fadeUp}>{t.brandkitLead}</motion.p>

        <motion.h2 className={styles.heading} variants={fadeUp}>{t.brandkitLogoH}</motion.h2>
        <motion.p className={styles.sectionLead} variants={fadeUp}>{t.brandkitLogoP}</motion.p>
        <motion.div className={styles.logoRow} variants={fadeUp}>
          <div className={styles.logoSample}>
            <span className={styles.logoLabel}>{t.brandkitLogoNav}</span>
            <Logo href="/en/" size="nav" />
          </div>
          <div className={styles.logoSample}>
            <span className={styles.logoLabel}>{t.brandkitLogoHero}</span>
            <Logo href="/en/" size="hero" />
          </div>
          <div className={`${styles.logoSample} ${styles.logoSampleNavy}`}>
            <span className={styles.logoLabel}>{t.brandkitLogoOnNavy}</span>
            <Logo href="/en/" size="nav" inverted />
          </div>
        </motion.div>

        <motion.h2 className={styles.heading} variants={fadeUp}>{t.brandkitColorsH}</motion.h2>
        <motion.p className={styles.sectionLead} variants={fadeUp}>{t.brandkitColorsP}</motion.p>
        <motion.div className={styles.swatches} variants={fadeUp}>
          {COLORS.map(color => (
            <button
              key={color.hex}
              type="button"
              className={styles.swatch}
              onClick={() => copyHex(color.hex)}
              aria-label={`${color.name} ${color.hex}`}
            >
              <span className={styles.chip} style={{ background: color.hex }} />
              <span className={styles.meta}>
                <span className={styles.name}>{color.name}</span>
                <span className={styles.hex}>{color.hex}</span>
                <span className={styles.hint}>
                  {copied === color.hex ? t.brandkitCopied : t.brandkitCopy}
                </span>
              </span>
            </button>
          ))}
        </motion.div>

        <motion.h2 className={styles.heading} variants={fadeUp}>{t.brandkitTypeH}</motion.h2>
        <motion.p className={styles.sectionLead} variants={fadeUp}>{t.brandkitTypeP}</motion.p>
        <motion.div className={styles.typeGrid} variants={fadeUp}>
          <div className={styles.typeSample}>
            <p className={styles.typeLabel}>{t.brandkitTypeLogo}</p>
            <p className={styles.typeName}>Cormorant Garamond</p>
            <p className={styles.specimenLogo}>Dethana</p>
          </div>
          <div className={styles.typeSample}>
            <p className={styles.typeLabel}>{t.brandkitTypeSerif}</p>
            <p className={styles.typeName}>Source Serif 4</p>
            <p className={styles.specimenSerif}>Chaṭṭha Saṅgāyana Tipiṭaka</p>
          </div>
          <div className={styles.typeSample}>
            <p className={styles.typeLabel}>{t.brandkitTypeSans}</p>
            <p className={styles.typeName}>Source Sans 3</p>
            <p className={styles.specimenSans}>Read, search, and study the Canon freely.</p>
          </div>
        </motion.div>

        <motion.h2 className={styles.heading} variants={fadeUp}>{t.brandkitAssetsH}</motion.h2>
        <motion.p className={styles.sectionLead} variants={fadeUp}>{t.brandkitAssetsP}</motion.p>
        <motion.div className={styles.assets} variants={fadeUp}>
          <a className={styles.asset} href="/icon.png" target="_blank" rel="noreferrer">
            <span className={styles.assetPreview}>
              <img src="/icon.png" alt="" width={160} height={160} />
            </span>
            <span className={styles.assetMeta}>
              <span className={styles.name}>{t.brandkitIcon}</span>
              <span className={styles.hex}>{t.brandkitDownload} · icon.png</span>
            </span>
          </a>
          <a className={styles.asset} href="/og-image.png" target="_blank" rel="noreferrer">
            <span className={`${styles.assetPreview} ${styles.assetPreviewDark}`}>
              <img src="/og-image.png" alt="" width={240} height={126} />
            </span>
            <span className={styles.assetMeta}>
              <span className={styles.name}>{t.brandkitOg}</span>
              <span className={styles.hex}>{t.brandkitDownload} · og-image.png</span>
            </span>
          </a>
        </motion.div>
      </motion.div>
    </PageEnter>
  )
}
