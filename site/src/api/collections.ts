import type { BookEntry } from '../types'

export type CollectionId = 'nikaya' | 'abhidhamma' | 'vinaya' | 'expositions'

export type CollectionMeta = {
  id: CollectionId
  title: string
  note: string
  description: string
  href: (baseUrl: string, lang: string) => string
}

export const COLLECTIONS: CollectionMeta[] = [
  {
    id: 'nikaya',
    title: 'The Five Collections',
    note: 'Pañcanikāya',
    description: 'Read the five Nikāyas of the Sutta Piṭaka — Dīgha, Majjhima, Saṃyutta, Aṅguttara, and Khuddaka — with Pāli and study translations.',
    href: (base, lang) => `${base}/${lang}/collection/nikaya`,
  },
  {
    id: 'abhidhamma',
    title: 'The Higher Teaching',
    note: 'Abhidhamma',
    description: 'Explore the Abhidhamma Piṭaka, the Canon’s systematic analysis of mind, matter, and the path.',
    href: (base, lang) => `${base}/${lang}/collection/abhidhamma`,
  },
  {
    id: 'vinaya',
    title: 'The Discipline',
    note: 'Vinaya',
    description: 'Browse the Vinaya Piṭaka: the monastic rules, procedures, and origin stories of the Sangha.',
    href: (base, lang) => `${base}/${lang}/collection/vinaya`,
  },
  {
    id: 'expositions',
    title: 'The Expositions',
    note: 'Aṭṭhakathā',
    description: 'Open the Aṭṭhakathā, the classical expositions that explain the Tipiṭaka book by book.',
    href: (base, lang) => `${base}/${lang}/collection/expositions`,
  },
]

export function collectionById(id: string | undefined) {
  if (id === 'commentaries') return COLLECTIONS.find(c => c.id === 'expositions')
  return COLLECTIONS.find(c => c.id === id)
}

const FIVE_NIKAYAS = ['dīgha', 'digha', 'majjhima', 'saṃyutta', 'samyutta', 'aṅguttara', 'anguttara', 'khuddaka']

function haystack(book: BookEntry) {
  return `${book.nikaya || ''} ${book.subNikaya || ''}`.toLowerCase()
}

export function bookInCollection(book: BookEntry, id: CollectionId) {
  const text = haystack(book)
  if (id === 'nikaya') {
    return text.includes('sutta') || FIVE_NIKAYAS.some(n => text.includes(n))
  }
  if (id === 'abhidhamma') return text.includes('abhidhamma')
  if (id === 'vinaya') return text.includes('vinaya')
  if (id === 'expositions' || id === 'commentaries') return book.category === 'Aṭṭhakathā' || book.category === 'Atthakatha'
  return false
}
