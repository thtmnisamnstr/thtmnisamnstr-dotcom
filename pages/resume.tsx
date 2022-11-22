import { MDXLayoutRenderer, useSegment } from '~/components'
import { getFileBySlug } from '~/libs/mdx'
import type { MdxFileData } from '~/types'

export async function getStaticProps() {
  let resumeData = await getFileBySlug('authors', 'resume')
  return { props: { resumeData } }
}

export default function Resume({ resumeData }: { resumeData: MdxFileData }) {
  let { mdxSource, frontMatter } = resumeData

  const { analytics: segment } = useSegment()
  segment.page('/resume')

  return (
    <MDXLayoutRenderer
      layout={frontMatter.layout}
      mdxSource={mdxSource}
      frontMatter={frontMatter}
    />
  )
}
