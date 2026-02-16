import fs from 'node:fs'
import { globby } from 'globby'
import matter from 'gray-matter'
import prettier from 'prettier'
const SITE_URL = 'https://thtmnisamnstr.com'
const POSTS_PER_PAGE = 10

function normalizePageRoute(pagePath) {
  return pagePath
    .replace(/^pages/, '')
    .replace(/\/(index)?\.(t|j)sx?$/, '')
    .replace(/\.(t|j)sx?$/, '')
}

function normalizePostRoute(postPath) {
  return postPath.replace(/^data\/blog/, '/blog').replace(/\.(md|mdx)$/, '')
}

function isPublishedPost(postPath) {
  let source = fs.readFileSync(postPath, 'utf8')
  let { data } = matter(source)
  return data.draft !== true
}

function getPostData(postPath) {
  let source = fs.readFileSync(postPath, 'utf8')
  return matter(source).data
}

async function generateSitemap() {
  console.log('Generating sitemap...')
  const prettierConfig = (await prettier.resolveConfig('./prettier.config.js')) || {}

  const staticPages = await globby([
    'pages/**/*.tsx',
    '!pages/_*.tsx',
    '!pages/api/**',
    '!pages/404.tsx',
    '!pages/blog/[...slug].tsx',
    '!pages/blog/page/[page].tsx',
    '!pages/tags/[tag].tsx',
  ])

  const allPostPages = await globby(['data/blog/**/*.mdx', 'data/blog/**/*.md'])
  const postPages = allPostPages.filter(isPublishedPost)
  const tagFeeds = await globby(['public/tags/**/feed.xml'])
  const tagsCount = {}

  postPages.forEach((postPath) => {
    const data = getPostData(postPath)
    if (!Array.isArray(data.tags)) return
    data.tags.forEach((tag) => {
      const normalizedTag = String(tag)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      if (!normalizedTag) return
      tagsCount[normalizedTag] = (tagsCount[normalizedTag] || 0) + 1
    })
  })

  const postCount = postPages.length
  const totalPages = Math.ceil(postCount / POSTS_PER_PAGE)
  const blogPaginationRoutes =
    totalPages > 1
      ? Array.from({ length: totalPages - 1 }, (_, index) => `/blog/page/${index + 2}`)
      : []
  const tagPaginationRoutes = Object.entries(tagsCount).flatMap(([tag, count]) => {
    const tagTotalPages = Math.ceil(count / POSTS_PER_PAGE)
    if (tagTotalPages <= 1) return []
    return Array.from({ length: tagTotalPages - 1 }, (_, index) => `/tags/${tag}/page/${index + 2}`)
  })

  const routes = new Set([
    '/',
    ...staticPages.map(normalizePageRoute),
    ...postPages.map(normalizePostRoute),
    ...tagFeeds.map(
      (tagFeedPath) => `/${tagFeedPath.replace(/^public\//, '').replace(/\/feed\.xml$/, '')}`
    ),
    ...blogPaginationRoutes,
    ...tagPaginationRoutes,
  ])

  const orderedRoutes = [...new Set([...routes].map((route) => route || '/'))]
    .filter((route) => !route.includes('[') && route !== '/404')
    .sort((a, b) => a.localeCompare(b))

  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${orderedRoutes.map((route) => `<url><loc>${SITE_URL}${route || '/'}</loc></url>`).join('\n')}
    </urlset>
  `

  const formatted = await prettier.format(sitemap, {
    ...prettierConfig,
    parser: 'html',
  })

  fs.writeFileSync('public/sitemap.xml', formatted)

  console.log('Sitemap generated successfully in `public/sitemap.xml`.')
}

generateSitemap()
