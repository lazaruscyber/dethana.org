import styles from '../ui/Dana.module.css'

export function PrivacyPage() {
  return (
    <div className={styles.page}>
      <p className={styles.crumb}>
        <a href="/en/">Home</a>
        <span aria-hidden> / </span>
        <span>Privacy</span>
      </p>
      <h1 className={styles.title}>Privacy policy</h1>
      <p className={styles.lead}>
        Dethana is offered so you can read the Tipiṭaka. You do not need an
        account. We do not sell personal data.
      </p>
      <h2 className={styles.heading}>Analytics</h2>
      <p className={styles.lead}>
        Google Analytics loads only after you accept the cookie banner. You can
        clear site data in your browser to reset that choice.
      </p>
      <h2 className={styles.heading}>Local storage</h2>
      <p className={styles.lead}>
        Reading preferences (script, font size, bookmarks, disclaimer) stay in
        your browser. They are not sent to a server.
      </p>
      <h2 className={styles.heading}>Contact</h2>
      <p className={styles.lead}>
        Questions:{' '}
        <a className={styles.mail} href="mailto:dethana.org@gmail.com">dethana.org@gmail.com</a>
      </p>
    </div>
  )
}
