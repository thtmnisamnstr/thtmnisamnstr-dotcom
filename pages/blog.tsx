import { useEffect } from 'react'
import { PageSeo } from 'components/SEO'
import { useSegment } from '~/components'
import ListLayout from '~/layouts/ListLayout'
import { POSTS_PER_PAGE } from '~/constant'
import { siteMetadata } from '~/data'
import { getAllFilesFrontMatter } from '~/libs/mdx'
import type { BlogFrontMatter } from '~/types'

export function getStaticProps() {
  let posts = getAllFilesFrontMatter('blog')
  let initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE)
  let pagination = {
    currentPage: 1,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
    basePath: '/blog',
  }

  return { props: { initialDisplayPosts, pagination, posts } }
}

export default function Blog({ posts, initialDisplayPosts, pagination }) {
  const { analytics: segment } = useSegment()

  useEffect(() => {
    segment.page('/blog')
  }, [segment])

  return (
    <>
      <PageSeo title={`Blog - ${siteMetadata.author}`} description={siteMetadata.description} />
      <ListLayout
        posts={posts as BlogFrontMatter[]}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="All Posts"
      />
    </>
  )
}
