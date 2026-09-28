import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { useRouter } from 'next/router'
import GithubSlugger from 'github-slugger'
import { siteMetadata } from '~/data'
import { documentForRoute, workspaceFiles } from '~/constant/workbench'
import type { AuthorFrontMatter, BlogFrontMatter } from '~/types'
import { formatDate, kebabCase } from '~/utils'
import { Footer } from './Footer'
import { ThemeSwitcher } from './ThemeSwitcher'
import { Link } from './Link'
import { Icon } from './workbench/Icon'
import { Modal } from './workbench/Modal'
import { EditorTabs } from './workbench/EditorTabs'
import { SidebarResizeHandle, useSidebarWidth } from './workbench/SidebarResizeHandle'

type PageData = {
  post?: { frontMatter: BlogFrontMatter }
  authorDetails?: AuthorFrontMatter[]
  posts?: BlogFrontMatter[]
}
type Heading = { id: string; label: string; depth: number }

export function LayoutWrapper({
  children,
  pageData = {},
}: {
  children: ReactNode
  pageData?: PageData
}) {
  const router = useRouter()
  const file = documentForRoute(router.pathname === '/404' ? '/404' : router.asPath)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [desktop, setDesktop] = useState(true)
  const [quickOpen, setQuickOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [headings, setHeadings] = useState<Heading[]>([])
  const [blogOpen, setBlogOpen] = useState(true)
  const { width: sidebarWidth, setWidth: setSidebarWidth } = useSidebarWidth()
  const mainRef = useRef<HTMLElement>(null)
  const post = pageData.post?.frontMatter
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])
  const closeQuickOpen = useCallback(() => setQuickOpen(false), [])
  const blogRelated = /^\/(blog|tags)(\/|$)/.test(file.href)
  const tagDocument = file.href.startsWith('/tags/')
  const explorerFileLabel = tagDocument
    ? file.crumbs
        .slice(1)
        .map(({ label }) => label)
        .join('/')
    : file.label
  const extraFile = !workspaceFiles.some(({ href }) => href === file.href)

  useEffect(() => {
    if (blogRelated) setBlogOpen(true)
  }, [file.href, blogRelated])

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    const onResize = () => {
      setDesktop(media.matches)
      setDrawerOpen(false)
    }
    setDesktop(media.matches)
    media.addEventListener('change', onResize)
    return () => media.removeEventListener('change', onResize)
  }, [])

  useEffect(() => {
    const onRoute = () => {
      setDrawerOpen(false)
      setQuickOpen(false)
    }
    router.events.on('routeChangeStart', onRoute)
    router.events.on('hashChangeStart', onRoute)
    return () => {
      router.events.off('routeChangeStart', onRoute)
      router.events.off('hashChangeStart', onRoute)
    }
  }, [router.events])

  useEffect(() => {
    if (router.asPath.endsWith('#post-search')) {
      const frame = requestAnimationFrame(() => document.getElementById('post-search')?.focus())
      return () => cancelAnimationFrame(frame)
    }
  }, [router.asPath])

  useEffect(() => {
    const slugger = new GithubSlugger()
    const outline = Array.from(mainRef.current?.querySelectorAll<HTMLElement>('h2, h3') || []).map(
      (heading) => {
        const label = heading.textContent?.trim() || ''
        const slug = slugger.slug(label)
        if (!heading.id) heading.id = `section-${slug}`
        heading.tabIndex = -1
        return { id: heading.id, label, depth: Number(heading.tagName.slice(1)) }
      }
    )
    setHeadings(outline)
  }, [children, file.href])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setDrawerOpen(false)
        setQuickOpen((open) => !open)
        setQuery('')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function toggleExplorer() {
    if (window.matchMedia('(min-width: 1024px)').matches) setCollapsed((value) => !value)
    else setDrawerOpen(true)
  }

  function navigateOutline(id: string) {
    setDrawerOpen(false)
    requestAnimationFrame(() => {
      const target = document.getElementById(id)
      target?.scrollIntoView({ block: 'start' })
      target?.focus({ preventScroll: true })
    })
  }

  const explorerLink = (href: string, label: string, nested = false) => (
    <Link
      key={href}
      href={href}
      className={`vscode-file-link${href === file.href ? ' is-active' : ''}${nested ? ' vscode-nested-file' : ''}`}
      aria-current={href === file.href ? 'page' : undefined}
      title={label}
    >
      <Icon name="markdown" />
      <span>{label}</span>
    </Link>
  )

  const sidebar = (drawer: boolean) => (
    <>
      <div className="vscode-sidebar-heading">
        <span>EXPLORER</span>
        {drawer && (
          <button type="button" aria-label="Close Explorer" onClick={closeDrawer}>
            <Icon name="close" />
          </button>
        )}
        {!drawer && (
          <div className="vscode-sidebar-width-actions">
            <button
              type="button"
              aria-label="Narrow Explorer"
              title="Narrow Explorer"
              disabled={sidebarWidth === 170}
              onClick={() =>
                setSidebarWidth(
                  Math.max(
                    170,
                    document.getElementById('desktop-explorer')!.getBoundingClientRect().width - 10
                  )
                )
              }
            >
              <Icon name="remove" />
            </button>
            <button
              type="button"
              aria-label="Widen Explorer"
              title="Widen Explorer"
              disabled={sidebarWidth === 420}
              onClick={() =>
                setSidebarWidth(
                  Math.min(
                    420,
                    document.getElementById('desktop-explorer')!.getBoundingClientRect().width + 10
                  )
                )
              }
            >
              <Icon name="add" />
            </button>
            <button
              type="button"
              aria-label="Reset Explorer width"
              title="Reset Explorer width"
              disabled={sidebarWidth === null}
              onClick={() => setSidebarWidth(null)}
            >
              <Icon name="reset" />
            </button>
          </div>
        )}
      </div>
      <details className="vscode-workspace-tree" open>
        <summary>thtmnisamnstr.com</summary>
        <nav aria-label="Site files" className="vscode-file-tree">
          {workspaceFiles.map(({ href, label }) => {
            if (href === '/tags') return null
            if (href !== '/blog') return explorerLink(href, label)
            return (
              <details
                key={href}
                className="vscode-explorer-folder"
                open={blogOpen}
                onToggle={(event) => setBlogOpen(event.currentTarget.open)}
              >
                <summary>
                  <Icon name="folder" />
                  <span>blog</span>
                </summary>
                {explorerLink('/blog', 'index.md', true)}
                {extraFile &&
                  blogRelated &&
                  !tagDocument &&
                  explorerLink(file.href, file.label, true)}
                {explorerLink('/tags', 'tags/index.md', true)}
                {extraFile && tagDocument && explorerLink(file.href, explorerFileLabel, true)}
              </details>
            )
          })}
          {extraFile && !blogRelated && explorerLink(file.href, file.label)}
        </nav>
      </details>
      <details className="vscode-outline" open>
        <summary>OUTLINE</summary>
        {headings.length ? (
          <nav aria-label="Page outline">
            {headings.map((heading) => (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                style={{ paddingLeft: heading.depth === 3 ? 30 : 18 }}
                onClick={() => navigateOutline(heading.id)}
              >
                {heading.label}
              </a>
            ))}
          </nav>
        ) : (
          <p>No headings in this document.</p>
        )}
      </details>
      {post && (
        <details className="vscode-post-details" open>
          <summary>POST</summary>
          <dl>
            <dt>Published</dt>
            <dd>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </dd>
            <dt>Reading time</dt>
            <dd>{post.readingTime.text}</dd>
            <dt>Authors</dt>
            <dd>{pageData.authorDetails?.map((author) => author.name).join(', ')}</dd>
            <dt>Tags</dt>
            <dd>
              {post.tags.map((tag) => (
                <Link key={tag} href={`/tags/${kebabCase(tag)}`}>
                  {tag}
                </Link>
              ))}
            </dd>
          </dl>
        </details>
      )}
    </>
  )
  const quickFiles = [
    ...workspaceFiles,
    ...(pageData.posts || []).map((post) => ({ href: `/blog/${post.slug}`, label: post.title })),
  ]
    .filter(({ label }) => label.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 30)

  return (
    <div className="vscode-workbench">
      <a
        className="vscode-skip-link"
        href="#editor-content"
        onClick={() => mainRef.current?.focus()}
      >
        Skip to editor content
      </a>
      <header className="vscode-titlebar">
        <button
          className="vscode-titlebar-menu"
          type="button"
          aria-label="Open Explorer"
          aria-expanded={drawerOpen}
          aria-controls="explorer-drawer"
          onClick={() => setDrawerOpen(true)}
        >
          <Icon name="menu" />
        </button>
        <Link href="/" className="vscode-titlebar-brand" aria-label="thtmnisamnstr.com home">
          <span className="vscode-titlebar-logo" aria-hidden="true" />
        </Link>
        <button
          className="vscode-command-center"
          type="button"
          onClick={() => {
            setQuery('')
            setQuickOpen(true)
          }}
          aria-label="Search files by name (Quick Open)"
        >
          <Icon name="search" />
          <span>Search files by name</span>
          <kbd>⌘/Ctrl K</kbd>
        </button>
        <div className="vscode-titlebar-actions">
          <ThemeSwitcher />
        </div>
      </header>
      <div
        className="vscode-workbench-body"
        data-collapsed={collapsed}
        style={
          {
            '--workbench-sidebar-width': sidebarWidth === null ? undefined : `${sidebarWidth}px`,
          } as CSSProperties
        }
      >
        <nav className="vscode-activitybar" aria-label="Workbench views">
          <button
            type="button"
            className={`vscode-activity-item${!collapsed ? ' is-active' : ''}`}
            aria-label="Toggle Explorer"
            aria-controls={desktop ? 'desktop-explorer' : 'explorer-drawer'}
            aria-expanded={desktop ? !collapsed : drawerOpen}
            onClick={toggleExplorer}
          >
            <Icon name="files" />
          </button>
          <Link
            className="vscode-activity-item"
            href="/blog#post-search"
            aria-label="Search blog posts"
          >
            <Icon name="search" />
          </Link>
          <div className="vscode-activity-spacer" />
          <Link
            className="vscode-activity-item"
            href={siteMetadata.siteRepo}
            aria-label="Site source on GitHub"
          >
            <Icon name="repository" />
          </Link>
          <button
            type="button"
            className="vscode-activity-item"
            aria-label="Select color theme"
            onClick={() =>
              document.querySelector<HTMLSelectElement>('.vscode-theme-select')?.focus()
            }
          >
            <Icon name="settings" />
          </button>
        </nav>
        <aside
          id="desktop-explorer"
          className="vscode-primary-sidebar"
          hidden={collapsed}
          aria-label="Explorer"
        >
          <div className="vscode-sidebar-content">{sidebar(false)}</div>
          {desktop && !collapsed && (
            <SidebarResizeHandle width={sidebarWidth} onResize={setSidebarWidth} />
          )}
        </aside>
        <div className="vscode-editor-region">
          <EditorTabs path={file.href} />
          <nav className="vscode-breadcrumbs" aria-label="Breadcrumb">
            {file.crumbs.map((crumb, index) => (
              <span key={`${index}-${crumb.label}`}>
                {index > 0 && <Icon name="chevron" />}
                {crumb.href ? (
                  <Link href={crumb.href}>{crumb.label}</Link>
                ) : (
                  <span aria-current="page" title={crumb.label}>
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
          <main id="editor-content" tabIndex={-1} ref={mainRef} className="vscode-editor-content">
            <div className="vscode-reading-column">{children}</div>
          </main>
        </div>
      </div>
      <Footer format={file.format} readingTime={post?.readingTime.text} />
      <Modal
        open={drawerOpen}
        onClose={closeDrawer}
        label="Explorer"
        className="vscode-sidebar-dialog"
      >
        <div id="explorer-drawer">{sidebar(true)}</div>
      </Modal>
      <Modal
        open={quickOpen}
        onClose={closeQuickOpen}
        label="Quick Open"
        className="vscode-quick-open"
      >
        <div className="vscode-quick-header">
          <label htmlFor="quick-open-query">Open a document</label>
          <button type="button" aria-label="Close Quick Open" onClick={closeQuickOpen}>
            <Icon name="close" />
          </button>
        </div>
        <input
          id="quick-open-query"
          autoFocus
          className="vscode-input"
          placeholder="Search files by name"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              event.currentTarget.parentElement
                ?.querySelector<HTMLElement>('.vscode-quick-results a')
                ?.focus()
            }
          }}
        />
        <nav className="vscode-quick-results" aria-label="Matching documents">
          {quickFiles.map(({ href, label }) => (
            <Link key={href} href={href} onClick={closeQuickOpen}>
              <Icon name="markdown" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        {!quickFiles.length && <p role="status">No matching documents.</p>}
        <Link className="vscode-quick-search" href="/blog#post-search" onClick={closeQuickOpen}>
          Search all blog content
        </Link>
      </Modal>
    </div>
  )
}
