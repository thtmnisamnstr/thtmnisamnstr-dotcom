import fs from 'node:fs'
import { globby } from 'globby'
import matter from 'gray-matter'
import prettier from 'prettier'
const SITE_URL = 'https://thtmnisamnstr.com'
const POSTS_PER_PAGE = 5

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

  const postCount = postPages.length
  const totalPages = Math.ceil(postCount / POSTS_PER_PAGE)
  const blogPaginationRoutes = Array.from(
    { length: totalPages },
    (_, index) => `/blog/page/${index + 1}`
  )

  const routes = new Set([
    '/',
    ...staticPages.map(normalizePageRoute),
    ...postPages.map(normalizePostRoute),
    ...tagFeeds.map(
      (tagFeedPath) => `/${tagFeedPath.replace(/^public\//, '').replace(/\/feed\.xml$/, '')}`
    ),
    ...blogPaginationRoutes,
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
