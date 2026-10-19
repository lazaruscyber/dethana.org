import { motion } from 'framer-motion'
import { useUi } from '../i18n'
import { fadeUp, PageEnter, stagger } from '../ui/motion'
import styles from '../ui/Dana.module.css'

export function CharityPage() {
  const { t } = useUi()
  return (
    <PageEnter className={styles.page}>
      <p className={styles.crumb}>
        <a href="/">{t.home}</a>
        <span aria-hidden> / </span>
        <span>{t.charity}</span>
      </p>
      <motion.div variants={stagger(0.08, 0.05)} initial="hidden" animate="show">
        <motion.h1 className={styles.title} variants={fadeUp}>{t.charityTitle}</motion.h1>
        <motion.p className={styles.lead} variants={fadeUp}>{t.charityLead}</motion.p>
        <motion.h2 className={styles.heading} variants={fadeUp}>{t.charityOfferH}</motion.h2>
        <motion.p className={styles.lead} variants={fadeUp}>{t.charityOfferP}</motion.p>
        <motion.h2 className={styles.heading} variants={fadeUp}>{t.charityHelpH}</motion.h2>
        <motion.p className={styles.lead} variants={fadeUp}>
          {t.charityHelpP}{' '}
          <a href="/dana">{t.dana}</a>.
        </motion.p>
        <motion.p className={styles.lead} variants={fadeUp}>
          {t.charityContactP}{' '}
          <a className={styles.mail} href="mailto:dethana.org@gmail.com">dethana.org@gmail.com</a>
        </motion.p>
      </motion.div>
    </PageEnter>
  )
}
