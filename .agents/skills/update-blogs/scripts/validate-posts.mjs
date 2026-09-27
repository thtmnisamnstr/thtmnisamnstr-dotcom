#!/usr/bin/env node
// Read-only metadata/asset checks. MDX bodies still need source and browser checks.
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const usage = 'Usage: node validate-posts.mjs --repo /checkout data/blog/post.mdx [more explicit files]'

function isInside(root, target) {
  const relative = path.relative(root, target)
  return relative !== '' && !relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative)
}

function publicationDate(value) {
  if (typeof value !== 'string') return null
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,3})?)?(Z|[+-]\d{2}:?\d{2})?)?$/)
  if (!match) return null
  const [, yearText, monthText, dayText, hourText, minuteText, secondText, zone] = match
  const [year, month, day] = [yearText, monthText, dayText].map(Number)
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > days[month - 1]) return null
  if (hourText !== undefined && (Number(hourText) > 23 || Number(minuteText) > 59 || Number(secondText || 0) > 59)) return null
  if (zone && zone !== 'Z') {
    const digits = zone.slice(1).replace(':', '')
    if (Number(digits.slice(0, 2)) > 23 || Number(digits.slice(2)) > 59) return null
  }
  if (!Number.isFinite(Date.parse(value))) return null
  return `${yearText}${monthText}${dayText}`
}

function localBodyImages(content) {
  const visibleLines = []
  let fence = null
  for (const line of content.split(/\r?\n/)) {
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})/)
    if (marker) {
      const character = marker[1][0]
      if (!fence) fence = { character, length: marker[1].length }
      else if (fence.character === character && marker[1].length >= fence.length) fence = null
      continue
    }
    if (!fence) visibleLines.push(line)
  }

  const body = visibleLines.join('\n')
  const images = new Set()
  for (const match of body.matchAll(/!\[[^\]]*\]\(\s*(\/images\/[^\s)]+)[^)]*\)/g)) images.add(match[1])
  for (const match of body.matchAll(/<(?:Image|img)\b[^>]*\bsrc\s*=\s*["'](\/images\/[^"']+)["'][^>]*>/g)) images.add(match[1])
  return images
}

function main() {
  const args = process.argv.slice(2)
  if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
    console.log(usage)
    return
  }
  if (args[0] !== '--repo' || !args[1] || args.length < 3 || args.slice(2).some((arg) => arg.startsWith('-'))) {
    throw new Error(usage)
  }

  const repo = fs.realpathSync(path.resolve(args[1]))
  const blogRoot = fs.realpathSync(path.join(repo, 'data', 'blog'))
  const authorsRoot = fs.realpathSync(path.join(repo, 'data', 'authors'))
  const publicRoot = fs.realpathSync(path.join(repo, 'public'))
  const require = createRequire(path.join(repo, 'package.json'))
  const matter = require('gray-matter')
  const { imageSize } = require('image-size')
  const diagnostics = []
  const imageCache = new Map()
  const authorCache = new Map()
  const postFiles = [...new Set(args.slice(2).map((file) => path.resolve(repo, file)))]

  function imageError(reference) {
    if (imageCache.has(reference)) return imageCache.get(reference)
    let error = null
    try {
      if (typeof reference !== 'string' || !reference.startsWith('/') || reference.startsWith('//') || reference.includes('\\') || /[?#]/.test(reference)) {
        throw new Error('must be a local /images/... path without a query or fragment')
      }
      const decoded = decodeURIComponent(reference)
      if (!decoded.startsWith('/images/') || decoded.includes('\\') || decoded.includes('\0')) {
        throw new Error('must point inside public/images')
      }
      const imagePath = path.resolve(publicRoot, `.${decoded}`)
      const imagesRoot = path.join(publicRoot, 'images')
      if (!isInside(imagesRoot, imagePath) || !isInside(imagesRoot, fs.realpathSync(imagePath))) {
        throw new Error('must stay inside public/images, including symlinks')
      }
      if (!fs.statSync(imagePath).isFile()) throw new Error('is not a regular file')
      const dimensions = imageSize(fs.readFileSync(imagePath))
      if (!Number.isFinite(dimensions.width) || dimensions.width <= 0 || !Number.isFinite(dimensions.height) || dimensions.height <= 0) {
        throw new Error('has no readable positive image dimensions')
      }
    } catch (cause) {
      error = cause.code === 'ENOENT' ? 'file does not exist' : cause.message
    }
    imageCache.set(reference, error)
    return error
  }

  function authorErrors(slug) {
    if (authorCache.has(slug)) return authorCache.get(slug)
    const errors = []
    try {
      const candidates = ['.mdx', '.md'].map((extension) => path.join(authorsRoot, `${slug}${extension}`))
      const authorPath = candidates.find((candidate) => fs.existsSync(candidate))
      if (!authorPath) throw new Error('author file does not exist')
      if (!isInside(authorsRoot, fs.realpathSync(authorPath))) throw new Error('author file resolves outside data/authors')
      const { data } = matter(fs.readFileSync(authorPath, 'utf8'))
      if (typeof data.name !== 'string' || !data.name.trim()) errors.push('name must be a nonempty string')
      if (data.avatar !== undefined && (typeof data.avatar !== 'string' || !data.avatar.trim())) {
        errors.push('avatar must be a nonempty local image path when provided')
      } else if (typeof data.avatar === 'string') {
        const error = imageError(data.avatar)
        if (error) errors.push(`avatar ${JSON.stringify(data.avatar)}: ${error}`)
      }
    } catch (cause) {
      errors.push(cause.message)
    }
    authorCache.set(slug, errors)
    return errors
  }

  for (const postPath of postFiles) {
    const label = path.relative(repo, postPath) || postPath
    const error = (message) => diagnostics.push(`${label}: ${message}`)
    try {
      if (!isInside(blogRoot, postPath) || !/\.mdx?$/.test(postPath)) {
        throw new Error('provide an explicit .md or .mdx file inside data/blog')
      }
      if (!isInside(blogRoot, fs.realpathSync(postPath))) throw new Error('post resolves outside data/blog')
      const { data, content } = matter(fs.readFileSync(postPath, 'utf8'))
      for (const key of ['title', 'summary']) {
        if (typeof data[key] !== 'string' || !data[key].trim()) error(`${key} must be a nonempty string`)
      }
      const date = publicationDate(data.date)
      if (!date) error('date must be a quoted valid YYYY-MM-DD calendar date, optionally followed by a valid time and zone')
      const filenameDate = path.basename(postPath).match(/^(\d{8})-.+\.mdx?$/)?.[1]
      if (!filenameDate) error('filename must begin YYYYMMDD- and contain a slug')
      else if (date && filenameDate !== date) error(`filename date ${filenameDate} does not match publication date ${date}`)
      if (data.lastmod !== undefined && !publicationDate(data.lastmod)) error('lastmod must be a quoted valid calendar date/time when provided')
      if (data.layout !== undefined && !['PostSimple', 'PostLayout'].includes(data.layout)) error('layout must be PostSimple or PostLayout when provided')
      if (typeof data.draft !== 'boolean') error('draft must be an explicit boolean')

      if (!Array.isArray(data.tags)) {
        error('tags must be an array (empty is allowed)')
      } else {
        for (const tag of data.tags) {
          if (typeof tag !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tag)) error(`tag ${JSON.stringify(tag)} must use lowercase words separated by single hyphens`)
        }
        if (new Set(data.tags).size !== data.tags.length) error('tags must not contain duplicates')
      }

      if (!Array.isArray(data.authors) || !data.authors.length) {
        error('authors must be an explicit nonempty array of existing author slugs')
      } else {
        for (const author of data.authors) {
          if (typeof author !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(author)) {
            error(`author ${JSON.stringify(author)} must be a lowercase hyphenated slug`)
            continue
          }
          for (const issue of authorErrors(author)) error(`author ${author}: ${issue}`)
        }
        if (new Set(data.authors).size !== data.authors.length) error('authors must not contain duplicates')
      }

      if (!Array.isArray(data.images)) {
        error('images must be an array (empty is allowed); the post layout reads images[0]')
      } else {
        for (const image of data.images) {
          const issue = imageError(image)
          if (issue) error(`image ${JSON.stringify(image)}: ${issue}`)
        }
      }
      for (const image of localBodyImages(content)) {
        const issue = imageError(image)
        if (issue) error(`inline image ${JSON.stringify(image)}: ${issue}`)
      }
    } catch (cause) {
      error(cause.code === 'ENOENT' ? 'post file does not exist' : cause.message)
    }
  }

  if (diagnostics.length) {
    for (const diagnostic of diagnostics) console.error(`ERROR ${diagnostic}`)
    console.error(`Failed: ${diagnostics.length} issue(s) across ${postFiles.length} supplied post(s).`)
    process.exitCode = 1
  } else {
    console.log(`Passed metadata, authors, and local image checks for ${postFiles.length} supplied post(s).`)
  }
  console.log('Scope: read-only. Inline checks cover literal local Markdown and JSX image paths outside fenced code. Source fidelity, links, MDX compilation, and rendered layout still require review. Image checks read dimensions, not every pixel.')
}

try {
  main()
} catch (error) {
  console.error(`ERROR ${error.message}`)
  process.exitCode = 1
}
