import { motion } from 'framer-motion'
import styles from './Logo.module.css'

type Props = {
  href: string
  size?: 'nav' | 'hero'
  inverted?: boolean
}

export function Logo({ href, size = 'nav', inverted = false }: Props) {
  return (
    <motion.a
      className={`${styles.logo} ${styles[size]} ${inverted ? styles.inverted : ''}`}
      href={href}
      aria-label="Dethana home"
      whileHover={{ y: -1, letterSpacing: size === 'nav' ? '0.34em' : undefined }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      Dethana
    </motion.a>
  )
}
