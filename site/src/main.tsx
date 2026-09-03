import { createRoot } from 'react-dom/client'
import { App } from './App'
import { UiLangProvider } from './i18n'

const root = document.getElementById('app')
if (root) {
  createRoot(root).render(
    <UiLangProvider>
      <App />
    </UiLangProvider>,
  )
}
