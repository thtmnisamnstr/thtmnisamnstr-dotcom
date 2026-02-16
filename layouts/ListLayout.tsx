import { useState } from 'react'
import { Pagination, PostListItem, PostsSearch } from '~/components'
import type { ListLayoutProps } from '~/types'

export function ListLayout(props: ListLayoutProps) {
  let { posts, title, initialDisplayPosts = [], pagination } = props
  let [searchValue, setSearchValue] = useState('')
  let filteredBlogPosts = posts.filter((frontMatter) => {
    let searchContent = frontMatter.title + frontMatter.summary + frontMatter.tags.join(' ')
    return searchContent.toLowerCase().includes(searchValue.toLowerCase())
  })

  let displayPosts =
    initialDisplayPosts.length > 0 && !searchValue ? initialDisplayPosts : filteredBlogPosts

  return (
    <>
      <div className="vscode-page-block divide-y divide-gray-200 dark:divide-gray-700">
        <div className="pt-2 pb-8 space-y-4">
          <h1 className="vscode-page-title">{title}</h1>
          <PostsSearch onChange={setSearchValue} />
        </div>
        <ul className="py-8 space-y-8">
          {!filteredBlogPosts.length && 'No posts found.'}
          {displayPosts.map((frontMatter) => (
            <PostListItem key={frontMatter.slug} frontMatter={frontMatter} />
          ))}
        </ul>
      </div>
      {pagination && pagination.totalPages > 1 && !searchValue && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          basePath={pagination.basePath}
        />
      )}
    </>
  )
}

export default ListLayout
