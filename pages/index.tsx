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
        <p>You can find me floating around the internet as thtmnisamnstr</p>
        <ul>
          <li>
            Product marketer at Pinecone. Director of Product & Marketing at Earthly. Ex-PMM at
            Earthly, Segment, Yugabyte, RudderStack, New Relic, and AT&T
          </li>
          <li>Ex-tech consultant at Deloitte</li>
          <li>Ex-sys admin</li>
          <li>(Sometimes)Ex-developer</li>
          <li>Brazilian Jiu Jitsu black belt</li>
        </ul>
      </section>
      <FeaturedPosts posts={posts} />
    </>
  )
}
