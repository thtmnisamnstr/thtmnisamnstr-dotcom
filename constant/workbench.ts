export const workspaceFiles = [
  { href: '/', label: 'README.md' },
  { href: '/blog', label: 'blog/index.md' },
  { href: '/about', label: 'about.md' },
  { href: '/resume', label: 'resume.md' },
  { href: '/tags', label: 'tags/index.md' },
]

export function documentForRoute(url: string) {
  const path = url.split(/[?#]/)[0].replace(/\/$/, '') || '/'
  const segments = path.split('/').filter(Boolean)
  const crumbs: { label: string; href?: string }[] = [{ label: 'thtmnisamnstr.com', href: '/' }]
  let label = workspaceFiles.find(({ href }) => href === path)?.label || '404.md'
  if (segments[0] === 'blog') {
    crumbs.push({ label: 'blog', href: '/blog' })
    label =
      segments[1] === 'page'
        ? `page-${segments[2]}.md`
        : segments[1]
          ? `${segments.slice(1).join('/')}.mdx`
          : 'index.md'
  } else if (segments[0] === 'tags') {
    crumbs.push({ label: 'tags', href: '/tags' })
    if (segments[1])
      crumbs.push({ label: decodeURIComponent(segments[1]), href: `/tags/${segments[1]}` })
    label = segments[2] === 'page' ? `page-${segments[3]}.md` : 'index.md'
  }
  crumbs.push({ label })
  return { href: path, label, crumbs, format: label.endsWith('.mdx') ? 'MDX' : 'Markdown' }
}
