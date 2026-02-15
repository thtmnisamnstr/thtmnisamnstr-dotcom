import { useEffect } from 'react'
import { useTheme } from 'next-themes'

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
  let { theme } = useTheme()

  useEffect(() => {
    if (!theme) {
      return
    }

    document.documentElement.classList.toggle('dark', DARK_THEMES.has(theme))
  }, [theme])

  return null
}
