import styles from '../ui/Dana.module.css'

export function AboutPage() {
  return (
    <div className={styles.page}>
      <p className={styles.crumb}>
        <a href="/en/">Home</a>
        <span aria-hidden> / </span>
        <span>About</span>
      </p>
      <h1 className={styles.title}>Dethana.org</h1>
      <p className={styles.lead}>
        Dethana.org is an institution and a movement. It exists so the Buddha’s
        teaching can be carried farther — read, studied, and offered for the
        good of the many, in the spirit of Dhamma missionary work (dhammadūta).
      </p>
      <p className={styles.lead}>
        The name comes from Pāli <i>desanā</i>: the teaching, the exposition of
        the Dhamma. Dethana is not a bookstore and not a social network. It is
        a place to meet the Tipiṭaka itself — the Vinaya, the Suttas, the
        Abhidhamma, and the commentaries that have preserved that teaching.
      </p>

      <h2 className={styles.heading}>A missionary movement</h2>
      <p className={styles.lead}>
        From the beginning the Buddha sent his disciples out: go forth for the
        good of the many, for the happiness of the many; teach the Dhamma that
        is good in the beginning, good in the middle, and good in the end.
        Dethana.org takes that charge as its reason for being.
      </p>
      <p className={styles.lead}>
        Mission here means making the Canon available — in Pāli and in a study
        translation — so anyone, anywhere, can open a sutta, a verse, a rule,
        or an exposition without a paywall, an account, or a priest standing
        in the way of the text. Spreading the Dhamma is not the same as
        selling a brand. The work is to put the words where people can find
        them, and to keep them free.
      </p>

      <h2 className={styles.heading}>The institution</h2>
      <p className={styles.lead}>
        Dethana.org Institution holds that work together: this library, the
        care of the texts, and the invitation to read. It is a home for a
        shared effort — translators, readers, supporters, and those who simply
        wish the Dhamma to remain in the world. The website is the public face
        of that effort; the movement is the people who use it and keep it
        alive.
      </p>
      <p className={styles.lead}>
        We read the Chaṭṭha Saṅgāyana (Sixth Council) Tipiṭaka, following the
        VRI digital edition, with commentaries (Aṭṭhakathā) and
        sub-commentaries (Ṭīkā) close at hand. How English is produced, and
        what it is not, is set out in the{' '}
        <a href="/translation-policy">Translation Policy</a>.
      </p>

      <h2 className={styles.heading}>How to take part</h2>
      <p className={styles.lead}>
        Read. Share a sutta. Support the site with{' '}
        <a href="/dana">dana</a> if you wish the hosting to continue. Write to{' '}
        <a className={styles.mail} href="mailto:dethana.org@gmail.com">dethana.org@gmail.com</a>
        {' '}if you want to help the movement grow.
      </p>
    </div>
  )
}
