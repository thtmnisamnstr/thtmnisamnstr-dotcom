import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

const THEMES = [
  { value: 'vscode-dark-plus', label: 'Dark+ (default dark)' },
  { value: 'vscode-light-plus', label: 'Light+ (default light)' },
  { value: 'dracula', label: 'Dracula' },
  { value: 'monokai', label: 'Monokai' },
  { value: 'solarized-dark', label: 'Solarized Dark' },
  { value: 'solarized-light', label: 'Solarized Light' },
  { value: 'one-dark-pro', label: 'One Dark Pro' },
  { value: 'night-owl', label: 'Night Owl' },
  { value: 'github-dark', label: 'GitHub Dark' },
  { value: 'github-light', label: 'GitHub Light' },
]

export function ThemeSwitcher() {
  let [mounted, setMounted] = useState(false)
  let { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div className="vscode-theme-select-placeholder" aria-hidden="true">
        Theme
      </div>
    )
  }

  let selectedTheme = theme || 'vscode-dark-plus'

  return (
    <label className="vscode-theme-select-wrap">
      <span className="sr-only">Select VS Code theme</span>
      <select
        aria-label="Select VS Code theme"
        className="vscode-theme-select"
        value={selectedTheme}
        onChange={(event) => setTheme(event.target.value)}
      >
        {THEMES.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  )
}
