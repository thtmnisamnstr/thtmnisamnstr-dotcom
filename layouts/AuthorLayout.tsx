import Image from 'next/image'
import { Link } from '~/components/Link'
import { PageSeo } from '~/components/SEO'
import { siteMetadata } from '~/data'
import type { AuthorLayoutProps } from '~/types'

const FALLBACK_AVATAR = '/images/authors/gavin-johnson.png'

export function AuthorLayout({ children, frontMatter }: AuthorLayoutProps) {
  let title = 'About me'
  let description = 'About page for thtmnisamnstr.com - Gavin Johnson'

  let socialLinks = [
    frontMatter.email ? { label: 'Email', href: `mailto:${frontMatter.email}` } : null,
    frontMatter.github ? { label: 'GitHub', href: frontMatter.github } : null,
    frontMatter.linkedin ? { label: 'LinkedIn', href: frontMatter.linkedin } : null,
  ].filter(Boolean)

  return (
    <>
      <PageSeo title={`${title} - ${siteMetadata.title}`} description={`${description}`} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="pt-6 pb-8 space-y-2 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {title}
          </h1>
        </div>
        <div className="items-start space-y-3 xl:grid xl:grid-cols-1 xl:space-y-0 pt-8">
          <div className="flex py-2">
            <Image
              src={frontMatter.avatar || FALLBACK_AVATAR}
              alt="avatar"
              width={220}
              height={220}
              className="rounded-2xl"
            />
          </div>
          {socialLinks.length > 0 && (
            <div className="text-sm flex flex-wrap justify-start gap-x-4 gap-y-2">
              {socialLinks.map((social) => (
                <Link key={social.label} href={social.href} className="vscode-author-link">
                  {social.label}
                </Link>
              ))}
            </div>
          )}
          <div className="py-8 prose prose-lg dark:prose-dark max-w-none xl:col-span-1">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

export default AuthorLayout
