import { motion } from 'framer-motion'
import { useUi } from '../i18n'
import { fadeUp, PageEnter, stagger } from '../ui/motion'
import styles from '../ui/Dana.module.css'

export function SocialMediaPage() {
  const { t } = useUi()
  return (
    <PageEnter className={styles.page}>
      <p className={styles.crumb}>
        <a href="/">{t.home}</a>
        <span aria-hidden> / </span>
        <span>{t.socialMedia}</span>
      </p>
      <motion.div variants={stagger(0.08, 0.05)} initial="hidden" animate="show">
        <motion.h1 className={styles.title} variants={fadeUp}>{t.socialTitle}</motion.h1>
        <motion.p className={styles.lead} variants={fadeUp}>{t.socialLead}</motion.p>
        <motion.h2 className={styles.heading} variants={fadeUp}>{t.socialShareH}</motion.h2>
        <motion.p className={styles.lead} variants={fadeUp}>{t.socialShareP}</motion.p>
        <motion.h2 className={styles.heading} variants={fadeUp}>{t.socialContactH}</motion.h2>
        <motion.p className={styles.lead} variants={fadeUp}>
          {t.socialContactP}{' '}
          <a className={styles.mail} href="mailto:dethana.org@gmail.com">dethana.org@gmail.com</a>
        </motion.p>
        <motion.p className={styles.lead} variants={fadeUp}>
          <a href="/browse">{t.browseCta}</a>
        </motion.p>
      </motion.div>
    </PageEnter>
  )
}
