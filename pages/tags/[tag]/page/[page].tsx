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
  let allPosts = getAllFilesFrontMatter('blog')

  let paths = Object.keys(tags).flatMap((tag) => {
    let filteredPosts = allPosts.filter(
      (post) => post.draft !== true && post.tags.map((t) => kebabCase(t)).includes(tag)
    )
    let totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
    if (totalPages <= 1) {
      return []
    }

    return Array.from({ length: totalPages - 1 }, (_, index) => ({
      params: {
        tag,
        page: (index + 2).toString(),
      },
    }))
  })

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }: { params: { tag: string; page: string } }) {
  let allPosts = getAllFilesFrontMatter('blog')
  let filteredPosts = allPosts.filter(
    (post) => post.draft !== true && post.tags.map((t) => kebabCase(t)).includes(params.tag)
  )
  let pageNumber = parseInt(params.page)
  let initialDisplayPosts = filteredPosts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  let pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(filteredPosts.length / POSTS_PER_PAGE),
    basePath: `/tags/${params.tag}`,
  }

  return {
    props: {
      posts: filteredPosts,
      initialDisplayPosts,
      pagination,
      tag: params.tag,
    },
  }
}

export default function TagPage({
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
    if (pagination.currentPage > 1) {
      segment.page(`/tags/${tag}/page/${pagination.currentPage}`)
      return
    }

    segment.page(`/tags/${tag}`)
  }, [pagination.currentPage, segment, tag])

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
