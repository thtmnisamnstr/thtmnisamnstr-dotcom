import {
  AuthorDetails,
  BlogMeta,
  BlogSeo,
  BlogTags,
  PageTitle,
  SectionContainer,
  SocialButtons,
} from '~/components'
import { siteMetadata } from '~/data'
import type { PostSimpleLayoutProps } from '~/types'

export function PostSimple(props: PostSimpleLayoutProps) {
  let { frontMatter, type, children, authorDetails } = props
  let { date, title, slug, fileName, tags, readingTime } = frontMatter
  let postUrl = `${siteMetadata.siteUrl}/${type}/${slug}`

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
                  <BlogMeta date={date} slug={slug} readingTime={readingTime} />
                </div>
                <div>
                  <dt className="sr-only">Written by</dt>
                  <AuthorDetails authorDetails={authorDetails} />
                </div>
              </dl>
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
