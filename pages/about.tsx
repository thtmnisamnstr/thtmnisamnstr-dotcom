import { useEffect } from 'react'
import { MDXLayoutRenderer, useSegment } from '~/components'
import { getFileBySlug } from '~/libs/mdx'
import type { MdxFileData } from '~/types'

export async function getStaticProps() {
  let authorData = await getFileBySlug('authors', 'gavin-johnson')
  return { props: { authorData } }
}

export default function About({ authorData }: { authorData: MdxFileData }) {
  let { mdxSource, frontMatter } = authorData

  const { analytics: segment } = useSegment()

  useEffect(() => {
    segment.page('/about')
  }, [segment])

  return (
    <MDXLayoutRenderer
      layout={frontMatter.layout}
      mdxSource={mdxSource}
      frontMatter={frontMatter}
    />
  )
}
