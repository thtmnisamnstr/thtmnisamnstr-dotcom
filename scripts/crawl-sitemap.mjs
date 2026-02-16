import fs from 'node:fs'
import path from 'node:path'
import { chromium } from '@playwright/test'

const DEFAULT_BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const SITEMAP_PATH = path.join(process.cwd(), 'public', 'sitemap.xml')

function readRoutesFromSitemap() {
  let xml = fs.readFileSync(SITEMAP_PATH, 'utf8')
  let matches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  return matches.map((match) => match[1])
}

function toRuntimeUrl(absoluteLoc) {
  return absoluteLoc.replace(/^https?:\/\/[^/]+/, DEFAULT_BASE_URL)
}

async function crawlRoute(page, url) {
  let pageErrors = []
  let failedImageRequests = []

  page.removeAllListeners('pageerror')
  page.removeAllListeners('requestfailed')
  page.removeAllListeners('response')

  page.on('pageerror', (error) => pageErrors.push(error.message))
  page.on('requestfailed', (request) => {
    if (request.resourceType() === 'image') {
      failedImageRequests.push(`${request.url()} (${request.failure()?.errorText || 'failed'})`)
    }
  })
  page.on('response', (response) => {
    if (response.request().resourceType() === 'image' && response.status() >= 400) {
      failedImageRequests.push(`${response.url()} (HTTP ${response.status()})`)
    }
  })

  await page.goto(url, { waitUntil: 'networkidle' })

  let brokenImages = await page.evaluate(() => {
    let imageElements = Array.from(document.querySelectorAll('img'))
    return imageElements
      .filter((img) => img.complete && img.naturalWidth === 0)
      .map((img) => img.getAttribute('src') || '[missing-src]')
  })

  return {
    url,
    pageErrors,
    failedImageRequests,
    brokenImages,
  }
}

async function run() {
  let routes = readRoutesFromSitemap()
  let browser = await chromium.launch({ headless: true })
  let context = await browser.newContext()
  let page = await context.newPage()

  let failures = []

  for (let route of routes) {
    let runtimeUrl = toRuntimeUrl(route)
    let result = await crawlRoute(page, runtimeUrl)
    let hasFailure =
      result.pageErrors.length > 0 ||
      result.failedImageRequests.length > 0 ||
      result.brokenImages.length > 0

    if (hasFailure) {
      failures.push(result)
    }
  }

  await browser.close()

  if (failures.length > 0) {
    console.error(`Crawl failed on ${failures.length} routes.`)
    for (let failure of failures) {
      console.error(`\nRoute: ${failure.url}`)
      if (failure.pageErrors.length) {
        console.error(`- Page errors: ${failure.pageErrors.join(' | ')}`)
      }
      if (failure.failedImageRequests.length) {
        console.error(`- Failed image requests: ${failure.failedImageRequests.join(' | ')}`)
      }
      if (failure.brokenImages.length) {
        console.error(`- Broken images: ${failure.brokenImages.join(' | ')}`)
      }
    }
    process.exit(1)
  }

  console.log(`Crawl passed for ${routes.length} sitemap routes.`)
}

run()
