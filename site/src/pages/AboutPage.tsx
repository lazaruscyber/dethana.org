import { motion } from 'framer-motion'
import { useUi } from '../i18n'
import { fadeUp, PageEnter, stagger } from '../ui/motion'
import styles from '../ui/Dana.module.css'

export function AboutPage() {
  const { t } = useUi()
  return (
    <PageEnter className={styles.page}>
      <p className={styles.crumb}>
        <a href="/en/">{t.home}</a>
        <span aria-hidden> / </span>
        <span>{t.about}</span>
      </p>
      <motion.div variants={stagger(0.08, 0.05)} initial="hidden" animate="show">
        <motion.h1 className={styles.title} variants={fadeUp}>{t.aboutH1}</motion.h1>
        <motion.p className={styles.lead} variants={fadeUp}>{t.aboutP1}</motion.p>
        <motion.p className={styles.lead} variants={fadeUp}>{t.aboutP2}</motion.p>
        <motion.h2 className={styles.heading} variants={fadeUp}>{t.aboutMissionH}</motion.h2>
        <motion.p className={styles.lead} variants={fadeUp}>{t.aboutP3}</motion.p>
        <motion.p className={styles.lead} variants={fadeUp}>{t.aboutP4}</motion.p>
        <motion.h2 className={styles.heading} variants={fadeUp}>{t.aboutInstH}</motion.h2>
        <motion.p className={styles.lead} variants={fadeUp}>{t.aboutP5}</motion.p>
        <motion.p className={styles.lead} variants={fadeUp}>
          {t.aboutP6a}
          <a href="/translation-policy">{t.translationPolicy}</a>
          {t.aboutP6b}
        </motion.p>
        <motion.h2 className={styles.heading} variants={fadeUp}>{t.aboutJoinH}</motion.h2>
        <motion.p className={styles.lead} variants={fadeUp}>
          {t.aboutP7a}
          <a href="/dana">{t.dana}</a>
          {t.aboutP7b}
          <a className={styles.mail} href="mailto:dethana.org@gmail.com">dethana.org@gmail.com</a>
          {t.aboutP7c}
        </motion.p>
      </motion.div>
    </PageEnter>
  )
}
