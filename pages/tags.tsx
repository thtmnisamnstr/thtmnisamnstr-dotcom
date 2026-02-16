import { useEffect } from 'react'
import { PageSeo } from 'components/SEO'
import { Link, useSegment } from '~/components'
import { siteMetadata } from '~/data'
import { getAllTags } from '~/libs'
import type { TagsCount } from '~/types'
import { kebabCase } from '~/utils'

export async function getStaticProps() {
  let tags = getAllTags('blog')
  return { props: { tags } }
}

export default function Tags({ tags }: { tags: TagsCount }) {
  let sortedTags = Object.keys(tags).sort((a, b) => tags[b] - tags[a])

  const { analytics: segment } = useSegment()

  useEffect(() => {
    segment.page('/tags')
  }, [segment])

  return (
    <>
      <PageSeo title={`All tags - ${siteMetadata.title}`} description={`All blog post tags`} />
      <section className="vscode-page-block">
        <h1 className="vscode-page-title">Tags</h1>
        <ul className="space-y-2">
          {Object.keys(tags).length === 0 && <li>No tags found.</li>}
          {sortedTags.map((tag) => (
            <li key={tag}>
              <Link href={`/tags/${kebabCase(tag)}`}>
                #{tag.split(' ').join('-')} ({tags[tag]})
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
