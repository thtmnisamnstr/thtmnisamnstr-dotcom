import clsx from 'clsx'
import { headerNavLinks } from '~/data'
import { Link } from './Link'

export function MobileNav({ navShow, onToggleNav }) {
  let className = clsx('vscode-mobile-nav sm:hidden', navShow ? 'open' : 'closed')

  return (
    <div className={className}>
      <button
        type="button"
        aria-label="Close mobile navigation"
        className="vscode-mobile-close"
        onClick={onToggleNav}
      >
        ✕
      </button>
      <nav className="vscode-mobile-links" aria-label="Mobile navigation">
        {headerNavLinks.map((link) => (
          <Link
            key={link.title}
            href={link.href}
            className="vscode-mobile-link"
            onClick={onToggleNav}
          >
            {link.title}
          </Link>
        ))}
      </nav>
    </div>
  )
}
