import { AnimatePresence, motion, type Transition } from 'framer-motion'
import type { ReactNode } from 'react'

export const easeOut = [0.22, 1, 0.36, 1] as const

export const springSoft: Transition = { type: 'spring', stiffness: 380, damping: 34, mass: 0.85 }
export const springSnappy: Transition = { type: 'spring', stiffness: 520, damping: 32, mass: 0.7 }

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.45, ease: easeOut } },
}

export const stagger = (staggerChildren = 0.09, delayChildren = 0.08) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
})

export const viewOnce = { once: true, amount: 0.18, margin: '0px 0px -48px 0px' } as const

export function PageEnter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: easeOut }}
    >
      {children}
    </motion.div>
  )
}

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewOnce}
      transition={{ duration: 0.65, ease: easeOut, delay }}
    >
      {children}
    </motion.div>
  )
}

export function ModalLayer({
  open,
  onClose,
  className,
  boxClassName,
  labelledBy,
  children,
}: {
  open: boolean
  onClose: () => void
  className?: string
  boxClassName?: string
  labelledBy?: string
  children: ReactNode
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={className}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
        >
          <motion.div
            className={boxClassName}
            initial={{ opacity: 0, x: 28, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 16, scale: 0.98 }}
            transition={springSoft}
            onClick={e => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
