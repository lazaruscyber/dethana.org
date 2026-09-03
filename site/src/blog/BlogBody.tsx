import type { ReactNode } from 'react'
import type { BlogBlock } from './posts'
import styles from '../ui/Blog.module.css'

function inline(text: string): ReactNode[] {
  const parts: ReactNode[] = []
  const re = /\[([^\]]+)\]\(([^)]+)\)/g
  let last = 0
  let match: RegExpExecArray | null
  let i = 0
  while ((match = re.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index))
    parts.push(<a key={i++} href={match[2]}>{match[1]}</a>)
    last = match.index + match[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

export function BlogBody({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className={styles.prose}>
      {blocks.map((block, i) => {
        if (block.type === 'h2') return <h2 key={i}>{block.text}</h2>
        if (block.type === 'quote') {
          return (
            <blockquote key={i}>
              <p>{inline(block.text)}</p>
              {block.cite ? <cite>{block.cite}</cite> : null}
            </blockquote>
          )
        }
        return <p key={i}>{inline(block.text)}</p>
      })}
    </div>
  )
}
