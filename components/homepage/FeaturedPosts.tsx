import { Link, Tag } from '~/components'
import { FEATURED_POSTS } from '~/constant'
import type { BlogFrontMatter } from '~/types'
import { formatDate } from '~/utils'

export function FeaturedPosts({ posts }: { posts: BlogFrontMatter[] }) {
  return (
    <section className="vscode-page-block border-t vscode-divider">
      <h2 className="vscode-section-title">Recent Posts</h2>
      <ul className="divide-y vscode-divide-y">
        {!posts.length && 'No posts found.'}
        {posts.slice(0, FEATURED_POSTS).map((frontMatter) => {
          let { slug, date, title, summary, tags } = frontMatter
          return (
            <li key={slug} className="py-6">
              <article className="space-y-2">
                <time className="block text-sm opacity-80" dateTime={date}>
                  {formatDate(date)}
                </time>
                <h3 className="text-xl font-semibold">
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
        })}
      </ul>
      {posts.length > FEATURED_POSTS && (
        <div className="pt-4 text-sm">
          <Link href="/blog" aria-label="all posts">
            All Posts →
          </Link>
        </div>
      )}
    </section>
  )
}
