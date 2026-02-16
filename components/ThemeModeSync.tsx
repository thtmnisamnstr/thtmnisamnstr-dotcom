import { useEffect } from 'react'
import { useTheme } from 'next-themes'

const THEME_STORAGE_KEY = 'thtmnisamnstr-theme'
const LEGACY_THEME_STORAGE_KEY = 'theme'

const ALL_THEMES = new Set([
  'vscode-dark-plus',
  'vscode-light-plus',
  'vscode-hc-black',
  'vscode-hc-light',
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
  'vscode-hc-black',
  'dracula',
  'monokai',
  'solarized-dark',
  'one-dark-pro',
  'night-owl',
  'github-dark',
])

const LIGHT_THEMES = new Set([
  'vscode-light-plus',
  'vscode-hc-light',
  'solarized-light',
  'github-light',
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
    if (!theme || !ALL_THEMES.has(theme)) {
      return
    }

    document.documentElement.classList.toggle(
      'dark',
      DARK_THEMES.has(theme) && !LIGHT_THEMES.has(theme)
    )

    let frame = window.requestAnimationFrame(() => {
      let themeColorMeta = document.querySelector('meta[name=\"theme-color\"]')
      if (!(themeColorMeta instanceof HTMLMetaElement)) {
        return
      }

      let activeColor =
        getComputedStyle(document.documentElement)
          .getPropertyValue('--vscode-titlebar-active-background')
          .trim() ||
        getComputedStyle(document.documentElement).getPropertyValue('--vscode-bg').trim()

      if (activeColor) {
        themeColorMeta.setAttribute('content', activeColor)
      }
    })

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [theme])

  return null
}
