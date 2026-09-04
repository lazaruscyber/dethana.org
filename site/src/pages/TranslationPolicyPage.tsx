import { motion } from 'framer-motion'
import { useUi } from '../i18n'
import { fadeUp, PageEnter, stagger } from '../ui/motion'
import styles from '../ui/Dana.module.css'

export function TranslationPolicyPage() {
  const { t } = useUi()
  return (
    <PageEnter className={styles.page}>
      <p className={styles.crumb}>
        <a href="/en/">{t.home}</a>
        <span aria-hidden> / </span>
        <a href="/about">{t.about}</a>
        <span aria-hidden> / </span>
        <span>{t.translationPolicy}</span>
      </p>
      <motion.div variants={stagger(0.08, 0.05)} initial="hidden" animate="show">
        <motion.h1 className={styles.title} variants={fadeUp}>{t.policyH1}</motion.h1>
        <motion.p className={styles.lead} variants={fadeUp}>{t.policyP1}</motion.p>
        <motion.p className={styles.lead} variants={fadeUp}>{t.policyP2}</motion.p>
        <motion.h2 className={styles.heading} variants={fadeUp}>{t.policyHowH}</motion.h2>
        <motion.p className={styles.lead} variants={fadeUp}>{t.policyP3}</motion.p>
        <motion.h2 className={styles.heading} variants={fadeUp}>{t.policyNotH}</motion.h2>
        <motion.p className={styles.lead} variants={fadeUp}>{t.policyP4}</motion.p>
        <motion.p className={styles.lead} variants={fadeUp}>
          <a href="/about">{t.aboutDethanaLink}</a>
        </motion.p>
      </motion.div>
    </PageEnter>
  )
}
