import type { ImageProps as NextImageProps } from 'next/image'
import type React from 'react'
import type { ReadingTime } from './mdx'

export interface PageTitleProps {
  children: React.ReactNode
}

export interface ImageLightBoxProps extends Pick<NextImageProps, 'src'> {
  closeLightbox: () => void
}

export interface ImageProps extends NextImageProps {
  shouldOpenLightbox?: boolean
}

export interface SocialButtonsProps {
  postUrl: string
  title: string
  fileName: string
}

export type TwemojiProps = {
  emoji: string
  size?: string
  className?: string
}

export interface UnsplashPhotoProps {
  photoURL: string
  author: string
}

export interface BlogHeaderProps {
  title: string
  date: string
  readingTime: ReadingTime
}

export interface BlogMetaProps {
  date: string
  readingTime: ReadingTime
}
