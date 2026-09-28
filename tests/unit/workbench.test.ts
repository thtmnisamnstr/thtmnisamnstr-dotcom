import { describe, expect, test } from 'vitest'
import { documentForRoute } from '../../constant/workbench'
import { resolveTheme, themes, themeValues } from '../../constant/themes'

describe('document route model', () => {
  test.each([
    ['/', 'README.md', 'Markdown'],
    ['/blog', 'index.md', 'Markdown'],
    ['/blog/page/2?view=all', 'page-2.md', 'Markdown'],
    ['/blog/real-post#heading', 'real-post.mdx', 'MDX'],
    ['/tags/product-launch/page/2', 'page-2.md', 'Markdown'],
    ['/about', 'about.md', 'Markdown'],
    ['/resume', 'resume.md', 'Markdown'],
    ['/missing', '404.md', 'Markdown'],
  ])('%s describes the actual route', (path, label, format) => {
    expect(documentForRoute(path)).toMatchObject({ label, format })
  })
  test('tag breadcrumbs point to the matching tag collection', () => {
    expect(documentForRoute('/tags/product-launch/page/2').crumbs).toEqual([
      { label: 'thtmnisamnstr.com', href: '/' },
      { label: 'tags', href: '/tags' },
      { label: 'product-launch', href: '/tags/product-launch' },
      { label: 'page-2.md' },
    ])
  })
})

test('all themes survive next-themes value mapping', () => {
  for (const { id } of themes) expect(themeValues[id]).toBe(id)
  expect(resolveTheme('system', 'light')).toBe('vscode-light-modern')
  expect(resolveTheme('system', 'dark')).toBe('vscode-dark-modern')
})
