import { blogPath, postsByDate } from '../blog/posts'
import { formatUiDate, useUi } from '../i18n'
import styles from '../ui/Blog.module.css'

export function BlogIndexPage() {
  const { t, uiLang } = useUi()
  const posts = postsByDate()

  return (
    <div className={styles.index}>
      <p className={styles.crumb}>
        <a href="/en/">{t.home}</a>
        <span aria-hidden> / </span>
        <span>{t.blogs}</span>
      </p>
      <header className={styles.indexHead}>
        <p className={styles.kicker}>{t.blogsKicker}</p>
        <h1 className={styles.indexTitle}>{t.blogs}</h1>
        <p className={styles.indexLead}>{t.blogsLead}</p>
      </header>
      <ol className={styles.list}>
        {posts.map(post => (
          <li key={post.slug}>
            <a className={styles.row} href={blogPath(post.slug)}>
              <time className={styles.rowDate} dateTime={post.date}>{formatUiDate(post.date, uiLang)}</time>
              <span className={styles.rowBody}>
                <span className={styles.rowKicker}>{post.kicker}</span>
                <span className={styles.rowTitle}>{post.title}</span>
                <span className={styles.rowExcerpt}>{post.excerpt}</span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  )
}
