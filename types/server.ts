import type { Node } from 'unist'

export interface TagsCount {
  [tag: string]: number
}

export interface PaginationType {
  currentPage: number
  totalPages: number
}

export interface UnistTreeType extends Node {
  children: UnistNodeType[]
}
export interface UnistNodeType extends Node {
  lang?: string
  children: UnistNodeType[]
  properties?: { [key: string]: string[] }
  depth?: number
}
export interface UnistImageNode extends UnistNodeType {
  url: string
  alt: string
  name: string
  attributes: unknown[]
}

export interface TOC {
  value: string
  url: string
  depth: number
}

export interface RemarkTocHeadingOptions {
  exportRef: TOC[]
}
