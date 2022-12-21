import { siteMetadata, headerNavLinks } from 'data'
import NextImage from 'next/image'
import { Link } from './Link'
import { ThemeSwitcher } from './ThemeSwitcher'
import { fetcher } from '~/utils'
import { SpotifyNowPlaying } from '~/components'
import type { SpotifyNowPlayingData } from '~/types'
const { default: useSWR } = require('swr')

export function Header({ onToggleNav }: { onToggleNav: () => void }) {
  let response = useSWR('/api/spotify', fetcher)
  let nowPlayingData = response.data as SpotifyNowPlayingData

  return (
    <header className="overflow-x-hidden backdrop-blur supports-backdrop-blur:bg-white/95 py-3 sticky top-0 z-40 bg-white/75 dark:bg-dark/75">
      <div className="mx-auto max-w-3xl xl:max-w-5xl flex items-center justify-between px-3 xl:px-0">
        <div>
          <div className="mr-3 flex justify-center items-center">
            <span className="inline-block w-8 md:w-96">
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
            </span>
            <span className="inline-block w-56 md:w-72">
              <SpotifyNowPlaying {...nowPlayingData} />
            </span>
          </div>
        </div>
        <div className="flex items-center text-base leading-5">
          <div className="hidden sm:block space-x-2">
            {headerNavLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="rounded py-1 px-2 font-medium text-gray-900 sm:py-2 sm:px-3 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {link.title}
              </Link>
            ))}
          </div>
          <ThemeSwitcher />
          <button
            className="w-8 h-8 ml-2 mr-1 rounded sm:hidden"
            type="button"
            aria-label="Toggle Menu"
            onClick={onToggleNav}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="text-gray-900 dark:text-gray-100"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
