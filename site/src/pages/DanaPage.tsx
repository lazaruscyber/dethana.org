import type { PageConfig } from '../types'
import styles from '../ui/Dana.module.css'

const EMAIL = 'dethana.org@gmail.com'

export function DanaPage({ config }: { config: PageConfig }) {
  const home = `${config.baseUrl}/${config.lang}/`
  return (
    <div className={styles.page}>
      <p className={styles.crumb}>
        <a href={home}>Home</a>
        <span aria-hidden> / </span>
        <span>Dana</span>
      </p>
      <h1 className={styles.title}>Support This Site</h1>
      <p className={styles.lead}>
        Dethana is offered freely. If you wish to help keep it online, dana toward hosting
        and related expenses is gratefully received.
      </p>
      <h2 className={styles.heading}>Current expenses</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Item</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Domain (yearly)</td>
            <td>$14 <span className={styles.note}>($1.17 monthly)</span></td>
          </tr>
          <tr>
            <td>Web hosting (monthly)</td>
            <td>$5</td>
          </tr>
          <tr>
            <td>Web protection (monthly)</td>
            <td>$3</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th>Total monthly</th>
            <th>$9.17</th>
          </tr>
        </tfoot>
      </table>
      <h2 className={styles.heading}>How to help</h2>
      <p className={styles.lead}>
        Write to{' '}
        <a className={styles.mail} href={`mailto:${EMAIL}`}>{EMAIL}</a>
        {' '}to offer dana for these costs. Thank you.
      </p>
    </div>
  )
}
