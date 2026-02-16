import { getMDXComponent } from 'mdx-bundler/client'
import { useMemo } from 'react'
import type { MdxLayoutRendererProps } from '~/types'
import AuthorLayout from '~/layouts/AuthorLayout'
import ListLayout from '~/layouts/ListLayout'
import PostLayout from '~/layouts/PostLayout'
import PostSimple from '~/layouts/PostSimple'
import ResumeLayout from '~/layouts/ResumeLayout'
import { Image } from './Image'
import { Link } from './Link'
import { Pre } from './Pre'

let layoutMap = {
  AuthorLayout,
  ListLayout,
  PostLayout,
  PostSimple,
  ResumeLayout,
} as const

let MDXComponents = {
  Image,
  a: Link,
  pre: Pre,
  wrapper: ({ layout, ...rest }) => {
    let Layout = layoutMap[layout] || PostSimple
    return <Layout {...rest} />
  },
}

export function MDXLayoutRenderer({ layout, mdxSource, ...rest }: MdxLayoutRendererProps) {
  let MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource])
  return <MDXLayout layout={layout} components={MDXComponents} {...rest} />
}
