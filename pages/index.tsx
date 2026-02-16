import { useEffect } from 'react'
import { PageSeo } from 'components/SEO'
import { FeaturedPosts, useSegment, Twemoji } from '~/components'
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
        <h1 className="vscode-page-title">Hi. I&apos;m Gavin. This is my site.</h1>
        <p className="vscode-body-copy mb-4">
          You can find me floating around the internet as{' '}
          <span className="vscode-special-text">thtmnisamnstr</span>.
        </p>
        <p className="vscode-body-copy mt-4">
          <span className="flex items-center mt-4 mb-4">
            Product marketer at Pinecone. Ex-PMM at Pulumi, Earthly, Segment, Yugabyte, RudderStack,
            New Relic, and AT&T
            <span className="mx-4">
              <Twemoji size="twa-3x" emoji="chart-increasing" />
            </span>
          </span>
          <span className="flex items-center mt-4 mb-4">
            Ex-tech consultant at Deloitte
            <span className="mx-4">
              <Twemoji size="twa-3x" emoji="necktie" />
            </span>
          </span>
          <span className="flex items-center mt-4 mb-4">
            Ex-sys admin
            <span className="mx-4">
              <Twemoji size="twa-3x" emoji="pager" />
            </span>
          </span>
          <span className="flex items-center mt-4 mb-4">
            (Sometimes)Ex-developer
            <span className="mx-4">
              <Twemoji size="twa-3x" emoji="laptop" />
            </span>
          </span>
          <span className="flex items-center mt-4 mb-4">
            Brazilian Jiu Jitsu black belt
            <span className="mx-4">
              <Twemoji size="twa-3x" emoji="martial-arts-uniform" /> &nbsp;&nbsp;
              <Twemoji size="twa-3x" emoji="people-wrestling" />
            </span>
          </span>
        </p>
      </section>
      <FeaturedPosts posts={posts} />
    </>
  )
}
