import styles from './Logo.module.css'

type Props = {
  href: string
  size?: 'nav' | 'hero'
  inverted?: boolean
}

export function Logo({ href, size = 'nav', inverted = false }: Props) {
  return (
    <a
      className={`${styles.logo} ${styles[size]} ${inverted ? styles.inverted : ''}`}
      href={href}
      aria-label="Dethana home"
    >
      Dethana
    </a>
  )
}
