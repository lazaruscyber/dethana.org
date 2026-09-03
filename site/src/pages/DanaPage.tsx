import type { PageConfig } from '../types'
import { interpolate, useUi } from '../i18n'
import styles from '../ui/Dana.module.css'

const EMAIL = 'dethana.org@gmail.com'

export function DanaPage({ config }: { config: PageConfig }) {
  const { t } = useUi()
  const home = `${config.baseUrl}/${config.lang}/`
  return (
    <div className={styles.page}>
      <p className={styles.crumb}>
        <a href={home}>{t.home}</a>
        <span aria-hidden> / </span>
        <span>{t.dana}</span>
      </p>
      <h1 className={styles.title}>{t.danaTitle}</h1>
      <p className={styles.lead}>{t.danaLead}</p>
      <h2 className={styles.heading}>{t.danaExpenses}</h2>
      <table className={styles.table}>
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
      </table>
      <h2 className={styles.heading}>{t.danaHow}</h2>
      <p className={styles.lead}>
        {interpolate(t.danaHowP, { email: EMAIL }).split(EMAIL).map((part, i, arr) => (
          i < arr.length - 1
            ? <span key={i}>{part}<a className={styles.mail} href={`mailto:${EMAIL}`}>{EMAIL}</a></span>
            : <span key={i}>{part}</span>
        ))}
      </p>
    </div>
  )
}
