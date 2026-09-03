import { useUi } from '../i18n'
import styles from '../ui/Dana.module.css'

export function TranslationPolicyPage() {
  const { t } = useUi()
  return (
    <div className={styles.page}>
      <p className={styles.crumb}>
        <a href="/en/">{t.home}</a>
        <span aria-hidden> / </span>
        <a href="/about">{t.about}</a>
        <span aria-hidden> / </span>
        <span>{t.translationPolicy}</span>
      </p>
      <h1 className={styles.title}>{t.policyH1}</h1>
      <p className={styles.lead}>{t.policyP1}</p>
      <p className={styles.lead}>{t.policyP2}</p>
      <h2 className={styles.heading}>{t.policyHowH}</h2>
      <p className={styles.lead}>{t.policyP3}</p>
      <h2 className={styles.heading}>{t.policyNotH}</h2>
      <p className={styles.lead}>{t.policyP4}</p>
      <p className={styles.lead}>
        <a href="/about">{t.aboutDethanaLink}</a>
      </p>
    </div>
  )
}
