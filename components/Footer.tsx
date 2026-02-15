import { siteMetadata } from '~/data'
import { Link } from './Link'

export function Footer() {
  return (
    <footer className="vscode-footer">
      <div className="vscode-footer-meta">
        <div>{`Copyright © ${new Date().getFullYear()}`}</div>
        <span>{` • `}</span>
        <Link href="/">{siteMetadata.footerTitle}</Link>
      </div>
    </footer>
  )
}
