import { Link, Tag } from '~/components'
import type { MdxFrontMatter } from '~/types'
import { formatDate } from '~/utils'

export function PostListItem({ frontMatter }: { frontMatter: MdxFrontMatter }) {
  let { slug, date, title, summary, tags } = frontMatter

  return (
    <li key={slug}>
      <article className="space-y-2">
        <time className="block text-sm opacity-80" dateTime={date}>
          {formatDate(date)}
        </time>
        <h3 className="text-xl font-semibold leading-8">
          <Link href={`/blog/${slug}`}>{title}</Link>
        </h3>
        <div className="flex flex-wrap">
          {tags.map((tag) => (
            <Tag key={tag} text={tag} />
          ))}
        </div>
        <p className="vscode-list-body-copy">{summary}</p>
      </article>
    </li>
  )
}
