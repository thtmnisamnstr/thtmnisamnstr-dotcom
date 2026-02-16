import { useRouter } from 'next/router'
import { headerNavLinks } from 'data'
import { Link } from './Link'
import { ThemeSwitcher } from './ThemeSwitcher'

function isLinkActive(pathname: string, href: string) {
  if (href === '/') {
    return pathname === '/'
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export function Header({ onToggleNav }: { onToggleNav: () => void }) {
  let router = useRouter()

  return (
    <header className="vscode-header sticky top-0 z-40">
      <div className="vscode-header-inner max-w-3xl mx-auto xl:max-w-5xl">
        <div className="vscode-logo-row">
          <Link href="/" aria-label="thtmnisamnstr - Gavin Johnson" className="vscode-logo-link">
            <span className="vscode-site-logo" aria-hidden="true" />
          </Link>
        </div>

        <div className="vscode-tabbar">
          <nav className="hidden sm:flex items-end overflow-x-auto" aria-label="Main navigation">
            {headerNavLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className={`vscode-tab ${
                  isLinkActive(router.pathname, link.href) ? 'is-active' : ''
                }`}
              >
                {link.title}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 w-full justify-between sm:w-auto sm:justify-start">
            <button
              className="vscode-mobile-trigger sm:hidden"
              type="button"
              aria-label="Toggle Menu"
              onClick={onToggleNav}
            >
              ☰
            </button>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
}
