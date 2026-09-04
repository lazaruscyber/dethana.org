import { motion } from 'framer-motion'
import { BlogBody } from '../blog/BlogBody'
import { blogPath, postsByDate, type BlogPost } from '../blog/posts'
import { formatUiDate, useUi } from '../i18n'
import { PageEnter, viewOnce } from '../ui/motion'
import styles from '../ui/Blog.module.css'

export function BlogPostPage({ post }: { post: BlogPost }) {
  const { t, uiLang } = useUi()
  const others = postsByDate().filter(item => item.slug !== post.slug).slice(0, 3)

  return (
    <PageEnter>
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
          <motion.aside
            className={styles.more}
            aria-labelledby="more-blogs"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewOnce}
          >
            <h2 id="more-blogs">{t.moreBlogs}</h2>
            <ul>
              {others.map((item, i) => (
                <motion.li
                  key={item.slug}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewOnce}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                >
                  <a href={blogPath(item.slug)}>
                    <span>{item.title}</span>
                    <time dateTime={item.date}>{formatUiDate(item.date, uiLang)}</time>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.aside>
        )}
      </article>
    </PageEnter>
  )
}
