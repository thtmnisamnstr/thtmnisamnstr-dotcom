import fs from 'node:fs'
import path from 'node:path'
import { globby } from 'globby'

const DRY_RUN = process.argv.includes('--dry-run') || process.argv.includes('--dry')

const DIRECT_TARGETS = [
  '.next',
  '.netlify',
  '.lighthouseci',
  '.vercel',
  '.cache',
  '.tmp-earthly-out',
  'node_modules',
  'out',
  'build',
  'coverage',
  'playwright-report',
  'test-results',
  'tests/artifacts',
  'public/tags',
  'public/feed.xml',
  'public/sitemap.xml',
  '.eslintcache',
]

const GLOB_TARGETS = ['**/*.tsbuildinfo', '*.log']
const GLOB_IGNORE = ['node_modules/**', '.git/**']

function removePath(targetPath) {
  if (!fs.existsSync(targetPath)) return false
  if (!DRY_RUN) {
    fs.rmSync(targetPath, { recursive: true, force: true })
  }
  return true
}

async function run() {
  const removed = []

  for (const target of DIRECT_TARGETS) {
    if (removePath(target)) {
      removed.push(target)
    }
  }

  const globMatches = await globby(GLOB_TARGETS, { gitignore: true, ignore: GLOB_IGNORE })

  for (const match of globMatches) {
    if (removePath(match)) {
      removed.push(match)
    }
  }

  const mode = DRY_RUN ? 'Dry run' : 'Clean'
  console.log(`${mode} complete. ${removed.length} existing path(s) matched.`)
  console.log(`Configured direct targets (${DIRECT_TARGETS.length}):`)
  for (const target of DIRECT_TARGETS) {
    console.log(`- ${target}`)
  }
  console.log(`Configured glob targets (${GLOB_TARGETS.length}):`)
  for (const target of GLOB_TARGETS) {
    console.log(`- ${target}`)
  }

  if (removed.length > 0) {
    console.log('Matched existing paths:')
    for (const target of removed.sort((a, b) => a.localeCompare(b))) {
      console.log(`- ${target}`)
    }
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
