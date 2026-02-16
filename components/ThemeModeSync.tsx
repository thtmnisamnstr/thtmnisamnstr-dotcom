import { useEffect } from 'react'
import { useTheme } from 'next-themes'

const THEME_STORAGE_KEY = 'thtmnisamnstr-theme'
const LEGACY_THEME_STORAGE_KEY = 'theme'

const ALL_THEMES = new Set([
  'vscode-dark-plus',
  'vscode-light-plus',
  'dracula',
  'monokai',
  'solarized-dark',
  'solarized-light',
  'one-dark-pro',
  'night-owl',
  'github-dark',
  'github-light',
])

const DARK_THEMES = new Set([
  'vscode-dark-plus',
  'dracula',
  'monokai',
  'solarized-dark',
  'one-dark-pro',
  'night-owl',
  'github-dark',
])

export function ThemeModeSync() {
  let { theme, setTheme } = useTheme()

  useEffect(() => {
    let persistedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    if (persistedTheme && ALL_THEMES.has(persistedTheme)) {
      return
    }

    if (persistedTheme && !ALL_THEMES.has(persistedTheme)) {
      localStorage.removeItem(THEME_STORAGE_KEY)
    }

    let legacyTheme = localStorage.getItem(LEGACY_THEME_STORAGE_KEY)
    if (legacyTheme && ALL_THEMES.has(legacyTheme)) {
      setTheme(legacyTheme)
      return
    }

    let systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setTheme(systemPrefersDark ? 'vscode-dark-plus' : 'vscode-light-plus')
  }, [setTheme])

  useEffect(() => {
    if (!theme) {
      return
    }

    document.documentElement.classList.toggle('dark', DARK_THEMES.has(theme))
  }, [theme])

  return null
}
