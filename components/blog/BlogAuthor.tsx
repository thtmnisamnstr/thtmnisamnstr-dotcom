import { Link } from '~/components'
import type { AuthorFrontMatter } from '~/types'

export function AuthorDetails({ authorDetails }: { authorDetails: AuthorFrontMatter[] }) {
  return (
    <ul className="flex flex-wrap justify-left">
      {authorDetails.map((author) => (
        <Author key={author.name} author={author} />
      ))}
    </ul>
  )
}

export function Author({ author }: { author: AuthorFrontMatter }) {
  return (
    <li className="flex items-center mr-8 mb-4">
      <dl className="text-sm font-medium leading-5 whitespace-nowrap">
        <dt className="sr-only">Name</dt>
        <dd className="text-gray-900 dark:text-gray-100 mb-0.5">
          {author.linkedin ? (
            <Link href={author.linkedin} className="vscode-author-link">
              {author.name}
            </Link>
          ) : (
            author.name
          )}
        </dd>
      </dl>
    </li>
  )
}
