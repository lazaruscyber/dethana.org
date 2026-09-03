import { useUi } from '../i18n'
import styles from '../ui/Dana.module.css'

export function AboutPage() {
  const { t } = useUi()
  return (
    <div className={styles.page}>
      <p className={styles.crumb}>
        <a href="/en/">{t.home}</a>
        <span aria-hidden> / </span>
        <span>{t.about}</span>
      </p>
      <h1 className={styles.title}>{t.aboutH1}</h1>
      <p className={styles.lead}>{t.aboutP1}</p>
      <p className={styles.lead}>{t.aboutP2}</p>
      <h2 className={styles.heading}>{t.aboutMissionH}</h2>
      <p className={styles.lead}>{t.aboutP3}</p>
      <p className={styles.lead}>{t.aboutP4}</p>
      <h2 className={styles.heading}>{t.aboutInstH}</h2>
      <p className={styles.lead}>{t.aboutP5}</p>
      <p className={styles.lead}>
        {t.aboutP6a}
        <a href="/translation-policy">{t.translationPolicy}</a>
        {t.aboutP6b}
      </p>
      <h2 className={styles.heading}>{t.aboutJoinH}</h2>
      <p className={styles.lead}>
        {t.aboutP7a}
        <a href="/dana">{t.dana}</a>
        {t.aboutP7b}
        <a className={styles.mail} href="mailto:dethana.org@gmail.com">dethana.org@gmail.com</a>
        {t.aboutP7c}
      </p>
    </div>
  )
}
