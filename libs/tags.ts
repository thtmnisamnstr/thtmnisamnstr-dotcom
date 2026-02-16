import type { TagsCount } from '~/types'
import { kebabCase } from '~/utils'
import { getAllFilesFrontMatter } from './mdx'

export function getAllTags(type: string): TagsCount {
  let allFrontMatter = getAllFilesFrontMatter(type)
  let tagsCount: TagsCount = {}

  allFrontMatter.forEach((post) => {
    if (post.tags && post.draft !== true) {
      post.tags.forEach((tag: string) => {
        let formattedTag = kebabCase(tag)
        if (formattedTag in tagsCount) {
          tagsCount[formattedTag] += 1
        } else {
          tagsCount[formattedTag] = 1
        }
      })
    }
  })

  return tagsCount
}
