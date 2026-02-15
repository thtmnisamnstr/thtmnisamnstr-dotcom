import type React from 'react'
import type { AuthorFrontMatter, BlogFrontMatter, MdxFrontMatter } from './mdx'
import type { PaginationType } from './server'

export interface AuthorLayoutProps {
  children: React.ReactNode
  frontMatter: AuthorFrontMatter
}

export interface ListLayoutProps {
  posts: BlogFrontMatter[]
  title: string
  initialDisplayPosts?: BlogFrontMatter[]
  pagination?: PaginationType
}

export interface PostSimpleLayoutProps {
  frontMatter: BlogFrontMatter
  type: string
  children: React.ReactNode
  authorDetails: AuthorFrontMatter[]
  page: number
}

export interface PostLayoutProps extends PostSimpleLayoutProps {}

export interface ResumeLayoutProps {
  children: React.ReactNode
  frontMatter: MdxFrontMatter
}
