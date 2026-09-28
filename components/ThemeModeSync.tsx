import { useEffect } from 'react'
import { useTheme } from 'next-themes'
import { themes, darkThemeIds, resolveTheme } from '~/constant/themes'

export function ThemeModeSync() {
  const { theme, systemTheme, setTheme } = useTheme()
  useEffect(() => {
    if (theme && theme !== 'system' && !themes.some(({ id }) => id === theme)) {
      setTheme('system')
      return
    }
    const resolved = resolveTheme(theme, systemTheme)
    document.documentElement.setAttribute('data-theme', resolved)
    const dark = darkThemeIds.has(resolved)
    document.documentElement.classList.toggle('dark', dark)
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
    const frame = requestAnimationFrame(() => {
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute(
          'content',
          getComputedStyle(document.documentElement)
            .getPropertyValue('--vscode-titlebar-active-background')
            .trim()
        )
    })
    return () => cancelAnimationFrame(frame)
  }, [theme, systemTheme, setTheme])
  return null
}
