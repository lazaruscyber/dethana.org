import { useUi } from '../i18n'
import styles from '../ui/Dana.module.css'

export function PrivacyPage() {
  const { t } = useUi()
  return (
    <div className={styles.page}>
      <p className={styles.crumb}>
        <a href="/en/">{t.home}</a>
        <span aria-hidden> / </span>
        <span>{t.privacy}</span>
      </p>
      <h1 className={styles.title}>{t.privacyTitle}</h1>
      <p className={styles.lead}>{t.privacyLead}</p>
      <h2 className={styles.heading}>{t.privacyAnalyticsH}</h2>
      <p className={styles.lead}>{t.privacyAnalytics}</p>
      <h2 className={styles.heading}>{t.privacyLocalH}</h2>
      <p className={styles.lead}>{t.privacyLocal}</p>
      <h2 className={styles.heading}>{t.privacyContactH}</h2>
      <p className={styles.lead}>
        {t.privacyContact}{' '}
        <a className={styles.mail} href="mailto:dethana.org@gmail.com">dethana.org@gmail.com</a>
      </p>
    </div>
  )
}
