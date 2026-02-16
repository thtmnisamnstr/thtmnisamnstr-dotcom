import { AuthorDetails, BlogMeta } from '~/components/blog'
import { BlogSeo } from '~/components/SEO'
import { PageTitle } from '~/components/PageTitle'
import { SectionContainer } from '~/components/SectionContainer'
import { SocialButtons } from '~/components/SocialButtons'
import { BlogTags } from '~/components/blog/BlogTags'
import { siteMetadata } from '~/data'
import type { PostSimpleLayoutProps } from '~/types'
import Image from 'next/image'

export function PostSimple(props: PostSimpleLayoutProps) {
  let { frontMatter, type, children, authorDetails } = props
  let { date, title, slug, fileName, tags, readingTime, images = [] } = frontMatter
  let postUrl = `${siteMetadata.siteUrl}/${type}/${slug}`
  let heroImage = images[0]

  return (
    <SectionContainer>
      <BlogSeo
        url={`${siteMetadata.siteUrl}/${type}/${slug}`}
        authorDetails={authorDetails}
        {...frontMatter}
      />
      <article>
        <div>
          <header className="pt-6 xl:pt-12">
            <div className="space-y-4">
              <BlogTags tags={tags} />
              <PageTitle>{title}</PageTitle>
              <dl>
                <div className="pb-4">
                  <dt className="sr-only">Published on</dt>
                  <BlogMeta date={date} readingTime={readingTime} />
                </div>
                <div className="pb-4">
                  <dt className="sr-only">Written by</dt>
                  <AuthorDetails authorDetails={authorDetails} />
                </div>
              </dl>
              {heroImage && (
                <div className="pb-8">
                  <Image
                    src={heroImage}
                    alt={`${title} hero image`}
                    width={1200}
                    height={630}
                    sizes="(max-width: 1280px) 100vw, 1200px"
                    className="w-full h-auto"
                    priority
                  />
                </div>
              )}
            </div>
          </header>
          <div className="pb-8" style={{ gridTemplateRows: 'auto 1fr' }}>
            <div className="xl:pb-0 xl:col-span-3 xl:row-span-2">
              <div className="pb-8 prose prose-lg md:prose-xl dark:prose-dark max-w-none">
                {children}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700">
                <SocialButtons postUrl={postUrl} title={title} fileName={fileName} />
              </div>
            </div>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}

export default PostSimple
