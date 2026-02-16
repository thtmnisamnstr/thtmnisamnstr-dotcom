import fs from 'node:fs'
import path from 'node:path'
import { globby } from 'globby'
import matter from 'gray-matter'

const SITE_METADATA = {
  title: 'thtmnisamnstr - Gavin Johnson',
  author: 'Gavin Johnson',
  description:
    "Gavin Johnson's personal site. Resume, blog posts, tech product marketing stuff, maybe some tech-y stuff too.",
  language: 'en-us',
  siteUrl: 'https://thtmnisamnstr.com',
  email: 'gavin@thtmnisamnstr.com',
}

function xmlEscape(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function sortByDateDesc(a, b) {
  return Number(new Date(b.date)) - Number(new Date(a.date))
}

function toTagSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function toPostSlug(filePath) {
  return filePath.replace(/^data\/blog\//, '').replace(/\.(md|mdx)$/, '')
}

function generateRssItem(post) {
  return `
  <item>
    <guid>${SITE_METADATA.siteUrl}/blog/${post.slug}</guid>
    <title>${xmlEscape(post.title)}</title>
    <link>${SITE_METADATA.siteUrl}/blog/${post.slug}</link>
    ${post.summary ? `<description>${xmlEscape(post.summary)}</description>` : ''}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${SITE_METADATA.email} (${SITE_METADATA.author})</author>
    ${(post.tags || []).map((tag) => `<category>${xmlEscape(tag)}</category>`).join('')}
  </item>
`
}

function generateRss(posts, feedPath = 'feed.xml') {
  if (posts.length === 0) {
    return ''
  }

  return `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${xmlEscape(SITE_METADATA.title)}</title>
      <link>${SITE_METADATA.siteUrl}/blog</link>
      <description>${xmlEscape(SITE_METADATA.description)}</description>
      <language>${SITE_METADATA.language}</language>
      <managingEditor>${SITE_METADATA.email} (${SITE_METADATA.author})</managingEditor>
      <webMaster>${SITE_METADATA.email} (${SITE_METADATA.author})</webMaster>
      <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
      <atom:link href="${SITE_METADATA.siteUrl}/${feedPath}" rel="self" type="application/rss+xml"/>
      ${posts.map(generateRssItem).join('')}
    </channel>
  </rss>
`
}

async function generateFeeds() {
  console.log('Generating RSS feeds...')
  let postPaths = await globby(['data/blog/**/*.mdx', 'data/blog/**/*.md'])
  let tagsRootDir = path.join(process.cwd(), 'public', 'tags')

  // Remove stale tag feeds so deleted/renamed tags do not linger in output.
  fs.rmSync(tagsRootDir, { recursive: true, force: true })

  let posts = postPaths
    .map((postPath) => {
      let source = fs.readFileSync(postPath, 'utf8')
      let { data } = matter(source)
      return {
        ...data,
        slug: toPostSlug(postPath),
      }
    })
    .filter((post) => post.draft !== true && post.date)
    .sort(sortByDateDesc)

  let rootFeed = generateRss(posts)
  fs.writeFileSync(path.join(process.cwd(), 'public', 'feed.xml'), rootFeed)

  let postsByTag = new Map()
  for (let post of posts) {
    for (let tag of post.tags || []) {
      let tagSlug = toTagSlug(tag)
      let taggedPosts = postsByTag.get(tagSlug) || []
      taggedPosts.push(post)
      postsByTag.set(tagSlug, taggedPosts)
    }
  }

  for (let [tagSlug, taggedPosts] of postsByTag.entries()) {
    let tagDir = path.join(tagsRootDir, tagSlug)
    fs.mkdirSync(tagDir, { recursive: true })
    fs.writeFileSync(
      path.join(tagDir, 'feed.xml'),
      generateRss(taggedPosts, `tags/${tagSlug}/feed.xml`)
    )
  }

  console.log(`Generated RSS root feed and ${postsByTag.size} tag feeds.`)
}

generateFeeds()
