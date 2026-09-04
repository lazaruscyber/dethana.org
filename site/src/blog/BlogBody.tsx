import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import type { BlogBlock } from './posts'
import { fadeUp, stagger, viewOnce } from '../ui/motion'
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
    <motion.div
      className={styles.prose}
      variants={stagger(0.07, 0.12)}
      initial="hidden"
      animate="show"
    >
      {blocks.map((block, i) => {
        if (block.type === 'h2') {
          return (
            <motion.h2 key={i} variants={fadeUp} viewport={viewOnce}>
              {block.text}
            </motion.h2>
          )
        }
        if (block.type === 'quote') {
          return (
            <motion.blockquote key={i} variants={fadeUp}>
              <p>{inline(block.text)}</p>
              {block.cite ? <cite>{block.cite}</cite> : null}
            </motion.blockquote>
          )
        }
        return <motion.p key={i} variants={fadeUp}>{inline(block.text)}</motion.p>
      })}
    </motion.div>
  )
}
