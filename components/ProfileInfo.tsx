import { Link } from './Link'
import { siteMetadata } from '~/data'
import { useSegment } from '~/components'

export function ProfileCardInfo() {
  const { analytics: segment } = useSegment()

  return (
    <div className="hidden xl:block xl:px-6 py-4">
      <h3 className="text-xl font-semibold text-gray-900">Gavin Johnson</h3>
      <div className="space-y-4 mt-4 mb-2">
        <div className="flex items-center text-gray-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>

          <p className="px-2">
            Product & Marketing @{' '}
            <a
              target="_blank"
              href="https://earthly.dev/"
              rel="noreferrer"
              className="hover:underline"
            >
              Earthly
            </a>
          </p>
        </div>
        <div className="flex items-center text-gray-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>

          <p className="px-2">Los Angeles, CA</p>
        </div>
        <div className="flex items-center text-gray-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <a
            className="px-2"
            href={`mailto:${siteMetadata.email}`}
            onClick={() => {
              segment.track('social-profile-link-Mail')
            }}
          >
            {siteMetadata.email}
          </a>
        </div>
        <div className="flex items-center text-gray-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          <p className="px-2">
            <a
              target="_blank"
              href={siteMetadata.github}
              rel="noreferrer"
              className="hover:underline"
              onClick={() => {
                segment.track('social-profile-link-Github')
              }}
            >
              gh/{siteMetadata.socialAccounts.github}
            </a>
            <br />
            <a
              target="_blank"
              href={siteMetadata.twitter}
              rel="noreferrer"
              className="hover:underline"
              onClick={() => {
                segment.track('social-profile-link-Twitter')
              }}
            >
              tw/{siteMetadata.socialAccounts.twitter}
            </a>
            <br />
            <a
              target="_blank"
              href={siteMetadata.instagram}
              rel="noreferrer"
              className="hover:underline"
              onClick={() => {
                segment.track('social-profile-link-Instagram')
              }}
            >
              ig/{siteMetadata.socialAccounts.instagram}
            </a>
            <br />
            <a
              target="_blank"
              href={siteMetadata.linkedin}
              rel="noreferrer"
              className="hover:underline"
              onClick={() => {
                segment.track('social-profile-link-Linkedin')
              }}
            >
              li/{siteMetadata.socialAccounts.linkedin}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
