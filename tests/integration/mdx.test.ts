import { describe, expect, it } from 'vitest'
import { getAllFilesFrontMatter, getFileBySlug } from '~/libs/mdx'

describe('mdx content integration', () => {
  it('loads blog frontmatter in descending date order', () => {
    let posts = getAllFilesFrontMatter('blog')

    expect(posts.length).toBeGreaterThan(0)

    for (let index = 1; index < posts.length; index += 1) {
      let previous = Number(new Date(posts[index - 1].date))
      let current = Number(new Date(posts[index].date))
      expect(previous).toBeGreaterThanOrEqual(current)
    }
  })

  it('bundles a blog post from disk', async () => {
    let posts = getAllFilesFrontMatter('blog')
    let firstPost = posts[0]
    let post = await getFileBySlug('blog', firstPost.slug)

    expect(post.frontMatter.slug).toBe(firstPost.slug)
    expect(post.mdxSource).toContain('function')
    expect(post.mdxSource.length).toBeGreaterThan(100)
  })

  it('preserves text when a paragraph mixes markdown image and inline caption text', async () => {
    let post = await getFileBySlug(
      'blog',
      '20201005-50-bucks+tux-turning-a-cheap-atom-2-in-1-into-a-linux-laptop'
    )
    expect(post.mdxSource).toContain('quarter for scale')
  })

  it('does not render trailing markdown hard-break markers after image-only paragraphs', async () => {
    let post = await getFileBySlug('blog', '20240604-earthly-cloud-ui-updates')
    expect(post.mdxSource).toContain('/images/blog/20240604-earthly-cloud-ui-updates/earthly-cloud-ui-updates-01.png')
    expect(post.mdxSource).not.toContain('earthly-cloud-ui-updates-01.png\\\\')
  })

  it('converts local markdown images in mixed paragraphs/lists to the Image component', async () => {
    let post = await getFileBySlug(
      'blog',
      '20200720-building-a-portfolio-resume-site-with-gatsby-part-1'
    )
    expect(post.mdxSource).toMatch(/Image:n\}=e/)
    expect(post.mdxSource).not.toContain(
      '(0,i.jsx)(e.img,{alt:"Alt Text",src:"/images/blog/20200720-building-a-portfolio-resume-site-with-gatsby-part-1/7vq44fvx5kehvo54rkol.png"})'
    )
  })
})
