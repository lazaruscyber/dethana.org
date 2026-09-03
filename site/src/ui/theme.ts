export function applyTheme(_theme?: string) {
  const root = document.documentElement
  root.dataset.theme = 'light'
  root.style.colorScheme = 'light'
}

export function getThemePreference() {
  return 'light' as const
}

export function setThemePreference(_theme?: string) {
  applyTheme('light')
}
