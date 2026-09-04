import { motion } from 'framer-motion'
import type { PageConfig } from '../types'
import { interpolate, useUi } from '../i18n'
import { fadeUp, PageEnter, stagger } from '../ui/motion'
import styles from '../ui/Dana.module.css'

const EMAIL = 'dethana.org@gmail.com'

export function DanaPage({ config }: { config: PageConfig }) {
  const { t } = useUi()
  const home = `${config.baseUrl}/${config.lang}/`
  return (
    <PageEnter className={styles.page}>
      <p className={styles.crumb}>
        <a href={home}>{t.home}</a>
        <span aria-hidden> / </span>
        <span>{t.dana}</span>
      </p>
      <motion.div variants={stagger(0.08, 0.05)} initial="hidden" animate="show">
        <motion.h1 className={styles.title} variants={fadeUp}>{t.danaTitle}</motion.h1>
        <motion.p className={styles.lead} variants={fadeUp}>{t.danaLead}</motion.p>
        <motion.h2 className={styles.heading} variants={fadeUp}>{t.danaExpenses}</motion.h2>
        <motion.table className={styles.table} variants={fadeUp}>
          <thead>
            <tr>
              <th>{t.danaItem}</th>
              <th>{t.danaAmount}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{t.danaDomain}</td>
              <td>$14 <span className={styles.note}>({t.danaMonthly})</span></td>
            </tr>
            <tr>
              <td>{t.danaHosting}</td>
              <td>$5</td>
            </tr>
            <tr>
              <td>{t.danaProtection}</td>
              <td>$3</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th>{t.danaTotal}</th>
              <th>$9.17</th>
            </tr>
          </tfoot>
        </motion.table>
        <motion.h2 className={styles.heading} variants={fadeUp}>{t.danaHow}</motion.h2>
        <motion.p className={styles.lead} variants={fadeUp}>
          {interpolate(t.danaHowP, { email: EMAIL }).split(EMAIL).map((part, i, arr) => (
            i < arr.length - 1
              ? <span key={i}>{part}<a className={styles.mail} href={`mailto:${EMAIL}`}>{EMAIL}</a></span>
              : <span key={i}>{part}</span>
          ))}
        </motion.p>
      </motion.div>
    </PageEnter>
  )
}
