import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import { App } from './App'
import { UiLangProvider } from './i18n'

const root = document.getElementById('app')
if (root) {
  createRoot(root).render(
    <MotionConfig reducedMotion="user">
      <UiLangProvider>
        <App />
      </UiLangProvider>
    </MotionConfig>,
  )
}
