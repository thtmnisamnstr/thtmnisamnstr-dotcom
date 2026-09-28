import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { themes } from '~/constant/themes'

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

  let selectedTheme = theme || 'system'

  return (
    <label className="vscode-theme-select-wrap">
      <span className="sr-only">Select VS Code theme</span>
      <select
        aria-label="Select VS Code theme"
        className="vscode-theme-select"
        value={selectedTheme}
        onChange={(event) => setTheme(event.target.value)}
      >
        <option value="system">System theme</option>
        {themes.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  )
}
