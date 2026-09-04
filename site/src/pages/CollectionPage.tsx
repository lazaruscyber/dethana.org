import { useEffect, useMemo, useState } from 'react'
import { fetchMenu, flattenMenu } from '../api/menu'
import { collectionById, bookInCollection, type CollectionId } from '../api/collections'
import { BookCard } from '../ui/BookCard'
import { PageEnter } from '../ui/motion'
import { interpolate, useUi } from '../i18n'
import type { BookEntry, PageConfig } from '../types'
import styles from '../ui/Collection.module.css'

const GROUP_ORDER = [
  'Dīgha Nikāya',
  'Majjhima Nikāya',
  'Saṃyutta Nikāya',
  'Aṅguttara Nikāya',
  'Khuddaka Nikāya',
  'Sutta Piṭaka',
  'Vinaya Piṭaka',
  'Vinayapiṭaka',
  'Abhidhamma Piṭaka',
]
const LAYER_ORDER = ['Mūla', 'Aṭṭhakathā', 'Ṭīkā', 'Añña']

function groupRank(name: string) {
  const i = GROUP_ORDER.indexOf(name)
  return i === -1 ? GROUP_ORDER.length + name.localeCompare('zzz') : i
}

function layerRank(name: string) {
  const i = LAYER_ORDER.indexOf(name)
  return i === -1 ? LAYER_ORDER.length : i
}

function groupBooks(books: BookEntry[]) {
  const map = new Map<string, Map<string, BookEntry[]>>()
  for (const book of books) {
    const nikaya = book.subNikaya || book.nikaya || 'Other'
    const layer = book.category || ''
    if (!map.has(nikaya)) map.set(nikaya, new Map())
    const layers = map.get(nikaya)!
    if (!layers.has(layer)) layers.set(layer, [])
    layers.get(layer)!.push(book)
  }
  return [...map.entries()]
    .sort((a, b) => groupRank(a[0]) - groupRank(b[0]))
    .map(([nikaya, layers]) => [
      nikaya,
      new Map([...layers.entries()].sort((a, b) => layerRank(a[0]) - layerRank(b[0]))),
    ] as const)
}

export function CollectionPage({ config }: { config: PageConfig }) {
  const { t } = useUi()
  const meta = collectionById(config.collection)
  const [books, setBooks] = useState<BookEntry[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetchMenu(config.baseUrl)
      .then(data => setBooks(flattenMenu(data.menu, data.hierarchy)))
      .catch(() => setBooks([]))
      .finally(() => setLoaded(true))
  }, [config.baseUrl])

  const filtered = useMemo(
    () => books.filter(b => meta && bookInCollection(b, meta.id as CollectionId)),
    [books, meta],
  )
  const groups = useMemo(() => groupBooks(filtered), [filtered])

  if (!meta) {
    return (
      <PageEnter className={styles.page}>
        <h1>{t.collectionNotFound}</h1>
        <p><a href={`${config.baseUrl}/${config.lang}/`}>{t.backToDethana}</a></p>
      </PageEnter>
    )
  }

  const titles = {
    nikaya: t.colNikayaTitle,
    abhidhamma: t.colAbhiTitle,
    vinaya: t.colVinayaTitle,
    expositions: t.colExpTitle,
  }
  const descs = {
    nikaya: t.colNikayaDesc,
    abhidhamma: t.colAbhiDesc,
    vinaya: t.colVinayaDesc,
    expositions: t.colExpDesc,
  }
  const uiTitle = titles[meta.id] || meta.title
  const uiDesc = descs[meta.id] || meta.description

  return (
    <PageEnter className={styles.page}>
      <p className={styles.crumb}>
        <a href={`${config.baseUrl}/${config.lang}/`}>{t.home}</a>
        <span aria-hidden> / </span>
        <span>{uiTitle}</span>
      </p>
      <h1 className={styles.title}>{uiTitle}</h1>
      <p className={styles.note}>{meta.note}</p>
      <p className={styles.lead}>{uiDesc}</p>
      <p className={styles.count}>{loaded ? interpolate(t.booksCount, { n: filtered.length }) : t.loading}</p>
      {groups.map(([nikaya, layers]) => (
        <section key={nikaya} className={styles.group}>
          <h2 className={styles.groupTitle}>{nikaya}</h2>
          {[...layers.entries()].map(([layer, items]) => (
            <div key={layer || 'books'}>
              {layer && <h3 className={styles.layer}>{layer}</h3>}
              <div className={styles.list}>
                {items.map(book => (
                  <BookCard key={book.id} book={book} href={`${config.baseUrl}/${config.lang}/book/${book.id}`} />
                ))}
              </div>
            </div>
          ))}
        </section>
      ))}
    </PageEnter>
  )
}
