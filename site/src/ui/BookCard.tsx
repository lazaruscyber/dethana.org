import type { BookEntry } from '../types'
import styles from './BookCard.module.css'

export function BookCard({ book, href }: { book: BookEntry; href: string }) {
  return (
    <a className={styles.card} href={href}>
      <span className={styles.id}>{book.id}</span>
      <span className={styles.name}>{book.name}</span>
      <span className={styles.meta}>{[book.nikaya, book.subNikaya].filter(Boolean).join(' · ')}</span>
    </a>
  )
}
