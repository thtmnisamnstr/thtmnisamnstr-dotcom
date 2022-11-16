import { PageSeo } from 'components/SEO'
import {
  FeaturedPosts,
  Greeting,
  Heading,
  ProfileCard,
  ShortDescription,
  TypedBios,
} from '~/components'
import { siteMetadata } from '~/data'
import { getAllFilesFrontMatter } from '~/libs/mdx'
import type { BlogFrontMatter } from '~/types'

export function getStaticProps() {
  let posts = getAllFilesFrontMatter('blog')
  return { props: { posts } }
}

export default function Home({ posts }: { posts: BlogFrontMatter[] }) {
  return (
    <>
      <PageSeo title={siteMetadata.title} description={siteMetadata.description} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700 mt-8 md:mt-16">
        <div className="md:my-4 md:pt-6 md:pb-8 space-y-2 md:space-y-5 xl:grid xl:grid-cols-3">
          <div className="hidden xl:block md:pr-8">
            <ProfileCard />
          </div>
          <div className="xl:col-span-2">
            <Greeting />
            <div className="text-lg leading-8 text-gray-600 dark:text-gray-400">
              <Heading />
              <TypedBios />
              <ShortDescription />
            </div>
          </div>
        </div>
      </div>
      <FeaturedPosts posts={posts} />
    </>
  )
}
