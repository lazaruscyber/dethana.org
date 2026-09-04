import { BlogBody } from '../blog/BlogBody'
import { blogPath, postsByDate, type BlogPost } from '../blog/posts'
import { formatUiDate, useUi } from '../i18n'
import styles from '../ui/Blog.module.css'

export function BlogPostPage({ post }: { post: BlogPost }) {
  const { t, uiLang } = useUi()
  const others = postsByDate().filter(item => item.slug !== post.slug).slice(0, 3)

  return (
    <article className={styles.article}>
      <p className={styles.crumb}>
        <a href="/en/">{t.home}</a>
        <span aria-hidden> / </span>
        <a href={blogPath()}>{t.blogs}</a>
        <span aria-hidden> / </span>
        <span>{post.title}</span>
      </p>
      <p className={styles.kicker}>{post.kicker}</p>
      <h1 className={styles.articleTitle}>{post.title}</h1>
      <time className={styles.articleDate} dateTime={post.date}>{formatUiDate(post.date, uiLang)}</time>
      <BlogBody blocks={post.body} />
      {others.length > 0 && (
        <aside className={styles.more} aria-labelledby="more-blogs">
          <h2 id="more-blogs">{t.moreBlogs}</h2>
          <ul>
            {others.map(item => (
              <li key={item.slug}>
                <a href={blogPath(item.slug)}>
                  <span>{item.title}</span>
                  <time dateTime={item.date}>{formatUiDate(item.date, uiLang)}</time>
                </a>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </article>
  )
}
