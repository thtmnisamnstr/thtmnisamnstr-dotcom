import { useEffect } from 'react'
import { PageSeo } from 'components/SEO'
import { useSegment } from '~/components'
import { POSTS_PER_PAGE } from '~/constant'
import { siteMetadata } from '~/data'
import { ListLayout } from '~/layouts'
import { getAllTags } from '~/libs'
import { getAllFilesFrontMatter } from '~/libs/mdx'
import type { BlogFrontMatter } from '~/types'
import { kebabCase } from '~/utils'

function formatTagLabel(tag: string) {
  return tag
    .split('-')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ')
}

export function getStaticPaths() {
  let tags = getAllTags('blog')

  return {
    paths: Object.keys(tags).map((tag) => ({
      params: {
        tag,
      },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }: { params: { tag: string } }) {
  let allPosts = getAllFilesFrontMatter('blog')
  let filteredPosts = allPosts.filter(
    (post) => post.draft !== true && post.tags.map((t) => kebabCase(t)).includes(params.tag)
  )
  let initialDisplayPosts = filteredPosts.slice(0, POSTS_PER_PAGE)
  let pagination = {
    currentPage: 1,
    totalPages: Math.ceil(filteredPosts.length / POSTS_PER_PAGE),
    basePath: `/tags/${params.tag}`,
  }

  return { props: { posts: filteredPosts, initialDisplayPosts, pagination, tag: params.tag } }
}

export default function Tag({
  posts,
  initialDisplayPosts,
  pagination,
  tag,
}: {
  posts: BlogFrontMatter[]
  initialDisplayPosts: BlogFrontMatter[]
  pagination: { currentPage: number; totalPages: number; basePath: string }
  tag: string
}) {
  let tagLabel = formatTagLabel(tag)

  const { analytics: segment } = useSegment()

  useEffect(() => {
    segment.page(`/tags/${tag}`)
  }, [segment, tag])

  return (
    <>
      <PageSeo
        title={`${tagLabel} - ${siteMetadata.title}`}
        description={`${tagLabel} blog post tags`}
      />
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title={`Tag: #${tagLabel}`}
      />
    </>
  )
}
