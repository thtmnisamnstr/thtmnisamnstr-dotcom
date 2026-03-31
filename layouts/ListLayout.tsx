import { useEffect, useMemo, useState } from 'react'
import { Pagination, PostListItem, PostsSearch } from '~/components'
import type { ListLayoutProps } from '~/types'

type PineconeSearchResult = {
  id?: string
  url?: string
  urlPath?: string
  title?: string
  content?: string
  snippet?: string
}

type PineconeSearchResponse = {
  results?: PineconeSearchResult[]
}

function getNormalizedPathFromResult(result: PineconeSearchResult): string | undefined {
  let href = result.urlPath || result.url
  if (!href) {
    return undefined
  }

  if (href.startsWith('http://') || href.startsWith('https://')) {
    try {
      href = new URL(href).pathname
    } catch {
      return undefined
    }
  }

  let normalized = href.split(/[?#]/, 1)[0] || ''
  normalized = normalized.trim()
  if (!normalized) {
    return undefined
  }

  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`
  }

  return normalized.length > 1 ? normalized.replace(/\/$/, '') : normalized
}

function getBlogSlugFromResult(result: PineconeSearchResult): string | undefined {
  let path = getNormalizedPathFromResult(result)
  if (!path || !path.startsWith('/blog/')) {
    return undefined
  }

  let slug = path.slice('/blog/'.length).trim()
  return slug ? decodeURIComponent(slug) : undefined
}

export function ListLayout(props: ListLayoutProps) {
  let { posts, title, initialDisplayPosts = [], pagination } = props
  let [searchValue, setSearchValue] = useState('')
  let [searchResults, setSearchResults] = useState<PineconeSearchResult[]>([])
  let [isSearching, setIsSearching] = useState(false)
  let hasQuery = searchValue.trim().length > 0

  useEffect(() => {
    let query = searchValue.trim()

    if (!query) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    let controller = new AbortController()
    let timeoutId = setTimeout(async () => {
      setIsSearching(true)
      try {
        let response = await fetch('/api/pinecone-search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ search: 'blog', query, topK: 10 }),
          signal: controller.signal,
        })

        if (!response.ok) {
          setSearchResults([])
          return
        }

        let payload = (await response.json()) as PineconeSearchResponse
        setSearchResults(Array.isArray(payload.results) ? payload.results : [])
      } catch {
        if (!controller.signal.aborted) {
          setSearchResults([])
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false)
        }
      }
    }, 250)

    return () => {
      controller.abort()
      clearTimeout(timeoutId)
    }
  }, [searchValue])

  let postsBySlug = useMemo(() => {
    return new Map(posts.map((post) => [post.slug, post]))
  }, [posts])

  let searchDisplay = useMemo(() => {
    let seenSlugs = new Set<string>()
    let matchedPosts: Array<(typeof posts)[number]> = []

    for (let result of searchResults) {
      let slug = getBlogSlugFromResult(result)

      if (!slug || seenSlugs.has(slug)) {
        continue
      }

      seenSlugs.add(slug)
      let matched = postsBySlug.get(slug)
      if (matched) {
        matchedPosts.push(matched)
      }
    }

    return { matchedPosts }
  }, [postsBySlug, searchResults])

  let displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <>
      <div className="vscode-page-block divide-y vscode-divide-y">
        <div className="pt-2 pb-8 space-y-4">
          <h1 className="vscode-page-title">{title}</h1>
          <PostsSearch onChange={setSearchValue} />
        </div>
        {hasQuery ? (
          <ul className="py-8 space-y-8">
            {isSearching ? (
              <li>
                <div className="flex items-center" role="status" aria-live="polite">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                  <span className="ml-3 text-sm opacity-80">Loading...</span>
                </div>
              </li>
            ) : null}
            {!isSearching && !searchDisplay.matchedPosts.length && 'No posts found.'}
            {searchDisplay.matchedPosts.map((frontMatter) => (
              <PostListItem key={frontMatter.slug} frontMatter={frontMatter} />
            ))}
          </ul>
        ) : (
          <ul className="py-8 space-y-8">
            {displayPosts.map((frontMatter) => (
              <PostListItem key={frontMatter.slug} frontMatter={frontMatter} />
            ))}
          </ul>
        )}
      </div>
      {pagination && pagination.totalPages > 1 && !hasQuery && (
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
