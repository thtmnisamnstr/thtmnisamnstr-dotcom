import { siteMetadata } from '~/data'
import { Link } from './Link'
import type { SocialButtonsProps } from '~/types'

export function SocialButtons({ fileName }: SocialButtonsProps) {
  let creatEditOnGithubUrl = (fileName: string) =>
    `${siteMetadata.siteRepo}/blob/main/data/blog/${fileName}`

  return (
    <div className="md:flex justify-between items-center pt-6 pb-6 text-sm text-gray-700 dark:text-gray-300">
      <div className="mb-6 md:mb-0">
        <Link href={creatEditOnGithubUrl(fileName)} className="hover:underline">
          {'View on GitHub'}
        </Link>
      </div>
    </div>
  )
}
