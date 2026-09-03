import type { MenuTree, TocItem } from '../types'
import { slugForHeading } from '../api/menu'
import styles from './Sidebar.module.css'

type Props = {
  mode: 'library' | 'toc'
  menu: MenuTree
  lang: string
  baseUrl: string
  open: boolean
  toc?: TocItem[]
  bookId?: string
  activePara?: number | null
}

export function Sidebar({ mode, menu, lang, baseUrl, open, toc, bookId, activePara }: Props) {
  return (
    <aside className={`${styles.aside} ${open ? styles.open : ''}`} aria-label={mode === 'toc' ? 'Contents' : 'Library'}>
      {mode === 'toc' && toc && bookId ? (
        <nav className={styles.group}>
          <div className={styles.label}>Contents</div>
          {toc.map(item => (
            item.has_content ? (
              <a
                key={item.para_id}
                className={`${styles.tocLink} ${activePara === item.para_id ? styles.active : ''}`}
                data-level={item.level}
                href={`${baseUrl}/${lang}/book/${bookId}/${slugForHeading(item.title, item.para_id)}`}
              >
                {item.title}
              </a>
            ) : (
              <div key={item.para_id} className={styles.tocLink} data-level={item.level}>{item.title}</div>
            )
          ))}
        </nav>
      ) : (
        <nav className={styles.group}>
          {Object.entries(menu).map(([category, nikayas]) => (
            <details key={category} className={styles.details} open={category === 'Mūla' || category === 'Mula'}>
              <summary>{category}</summary>
              {Object.entries(nikayas).map(([nikaya, subs]) => (
                <div key={nikaya}>
                  <div className={styles.nikaya}>{nikaya}</div>
                  {Object.values(subs).flat().map(([id, name]) => (
                    <a key={id} className={styles.link} href={`${baseUrl}/${lang}/book/${id}`}>{name}</a>
                  ))}
                </div>
              ))}
            </details>
          ))}
        </nav>
      )}
    </aside>
  )
}
