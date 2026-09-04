import { motion } from 'framer-motion'
import { useUi } from '../i18n'
import { fadeUp, PageEnter, stagger } from '../ui/motion'
import styles from '../ui/Dana.module.css'

export function PrivacyPage() {
  const { t } = useUi()
  return (
    <PageEnter className={styles.page}>
      <p className={styles.crumb}>
        <a href="/en/">{t.home}</a>
        <span aria-hidden> / </span>
        <span>{t.privacy}</span>
      </p>
      <motion.div variants={stagger(0.08, 0.05)} initial="hidden" animate="show">
        <motion.h1 className={styles.title} variants={fadeUp}>{t.privacyTitle}</motion.h1>
        <motion.p className={styles.lead} variants={fadeUp}>{t.privacyLead}</motion.p>
        <motion.h2 className={styles.heading} variants={fadeUp}>{t.privacyAnalyticsH}</motion.h2>
        <motion.p className={styles.lead} variants={fadeUp}>{t.privacyAnalytics}</motion.p>
        <motion.h2 className={styles.heading} variants={fadeUp}>{t.privacyLocalH}</motion.h2>
        <motion.p className={styles.lead} variants={fadeUp}>{t.privacyLocal}</motion.p>
        <motion.h2 className={styles.heading} variants={fadeUp}>{t.privacyContactH}</motion.h2>
        <motion.p className={styles.lead} variants={fadeUp}>
          {t.privacyContact}{' '}
          <a className={styles.mail} href="mailto:dethana.org@gmail.com">dethana.org@gmail.com</a>
        </motion.p>
      </motion.div>
    </PageEnter>
  )
}
