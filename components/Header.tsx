import NextImage from 'next/image'
import { useRouter } from 'next/router'
import { headerNavLinks, siteMetadata } from 'data'
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
      <div className="vscode-header-inner max-w-3xl px-3 xl:px-0 mx-auto sm:px-6 xl:max-w-5xl">
        <div className="vscode-logo-row">
          <Link href="/" aria-label="thtmnisamnstr - Gavin Johnson">
            <NextImage
              className="md:hidden"
              src={siteMetadata.siteMobileLogo}
              alt="Site logo"
              width={32}
              height={32}
            />
            <NextImage
              className="hidden md:block"
              src={siteMetadata.siteLogo}
              alt="Site logo"
              width={367}
              height={32}
            />
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
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <button
              className="vscode-mobile-trigger sm:hidden"
              type="button"
              aria-label="Toggle Menu"
              onClick={onToggleNav}
            >
              ☰
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
