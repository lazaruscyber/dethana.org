import styles from '../ui/Dana.module.css'

export function AboutPage() {
  return (
    <div className={styles.page}>
      <p className={styles.crumb}>
        <a href="/en/">Home</a>
        <span aria-hidden> / </span>
        <span>About</span>
      </p>
      <h1 className={styles.title}>About the translation</h1>
      <p className={styles.lead}>
        Dethana makes the Chaṭṭha Saṅgāyana (Sixth Council) Tipiṭaka — with its
        commentaries (Aṭṭhakathā) and sub-commentaries (Ṭīkā) — easier to read.
        The Pāli follows the VRI digital edition.
      </p>
      <p className={styles.lead}>
        The English here is an AI-assisted study translation. It draws on existing
        translations (Bhikkhu Bodhi, Anandajoti, Sinhala, Thai, Myanmar nissaya,
        Vietnamese, and others), the commentary, and a glossary — then a human
        reviews the result. These are research translations, not a replacement
        for the original Pāli or an authoritative rendering.
      </p>
      <h2 className={styles.heading}>How it is made</h2>
      <p className={styles.lead}>
        Source translations are aligned to VRI paragraphs. For each sentence the
        model sees those sources, the linked commentary, and nearby context.
        A second pass checks the English against the Pāli. Corrections go back
        into the glossary and prompts.
      </p>
      <h2 className={styles.heading}>Open source</h2>
      <p className={styles.lead}>
        The website is open source. This public build is a static site so it can
        be hosted on Netlify from GitHub, without a Flask server.
      </p>
    </div>
  )
}
