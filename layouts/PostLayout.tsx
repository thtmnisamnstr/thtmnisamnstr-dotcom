import { AuthorDetails, BackToPosts, BlogHeader, BlogTags } from '~/components/blog'
import { BlogSeo } from '~/components/SEO'
import { ScrollTopButton } from '~/components/ScrollTopButton'
import { SectionContainer } from '~/components/SectionContainer'
import { siteMetadata } from '~/data'
import type { PostLayoutProps } from '~/types'

export function PostLayout({ frontMatter, authorDetails, page, children }: PostLayoutProps) {
  const { slug, date, title, tags, readingTime } = frontMatter
  return (
    <SectionContainer>
      <BlogSeo
        url={`${siteMetadata.siteUrl}/blog/${slug}`}
        authorDetails={authorDetails}
        {...frontMatter}
      />
      <ScrollTopButton />
      <article>
        <BlogHeader title={title} date={date} readingTime={readingTime} />
        <div className="vscode-post-metadata">
          <AuthorDetails authorDetails={authorDetails} />
          <BlogTags tags={tags} />
        </div>
        <div className="vscode-body-copy pb-8 prose dark:prose-dark max-w-none">{children}</div>
        <BackToPosts page={page} />
      </article>
    </SectionContainer>
  )
}
export default PostLayout
