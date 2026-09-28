import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { siteMetadata } from '~/data'
import { themes, resolveTheme } from '~/constant/themes'
import { Link } from './Link'
import { Icon } from './workbench/Icon'

export function Footer({
  format = 'Markdown',
  readingTime,
}: {
  format?: string
  readingTime?: string
}) {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const label = mounted
    ? themes.find(({ id }) => id === resolveTheme(theme, systemTheme))?.label
    : 'Color theme'
  return (
    <footer className="vscode-statusbar" aria-label="Document status">
      <div className="vscode-statusbar-group">
        <Link className="vscode-statusbar-item" href={siteMetadata.siteRepo}>
          <Icon name="repository" />
          <span>thtmnisamnstr-dotcom</span>
        </Link>
        <span className="vscode-statusbar-copyright">
          © {new Date().getFullYear()} Gavin Johnson
        </span>
      </div>
      <div className="vscode-statusbar-group">
        <span className="vscode-statusbar-item">{format}</span>
        {readingTime && <span className="vscode-statusbar-reading">{readingTime}</span>}
        <button
          type="button"
          className="vscode-statusbar-item"
          onClick={() => document.querySelector<HTMLSelectElement>('.vscode-theme-select')?.focus()}
        >
          {label}
        </button>
      </div>
    </footer>
  )
}
