import { useEffect } from 'react'
import { PageSeo } from 'components/SEO'
import { FeaturedPosts, useSegment } from '~/components'
import { siteMetadata } from '~/data'
import { getAllFilesFrontMatter } from '~/libs/mdx'
import type { BlogFrontMatter } from '~/types'

export function getStaticProps() {
  let posts = getAllFilesFrontMatter('blog')
  return { props: { posts } }
}

export default function Home({ posts }: { posts: BlogFrontMatter[] }) {
  const { analytics: segment } = useSegment()

  useEffect(() => {
    segment.page('/')
  }, [segment])

  return (
    <>
      <PageSeo title={siteMetadata.title} description={siteMetadata.description} />
      <section className="vscode-page-block">
        <h1 className="vscode-page-title">README.md</h1>
        <p>Hi. I&apos;m Gavin. This is my site.</p>
        <p>
          You can find recent writing on the home page below, all writing in Blog, background in
          About, and work history in Resume.
        </p>
      </section>
      <FeaturedPosts posts={posts} />
    </>
  )
}
