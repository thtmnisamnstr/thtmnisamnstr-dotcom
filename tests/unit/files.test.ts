import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { formatSlug, getAllFilesRecursively } from '~/libs/files'

let tempDirs: string[] = []

afterEach(() => {
  for (let tempDir of tempDirs) {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
  tempDirs = []
})

describe('libs/files', () => {
  it('formatSlug strips markdown extensions', () => {
    expect(formatSlug('example-post.mdx')).toBe('example-post')
    expect(formatSlug('example-post.md')).toBe('example-post')
  })

  it('getAllFilesRecursively returns nested file paths', () => {
    let tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'files-test-'))
    tempDirs.push(tempDir)

    let nestedDir = path.join(tempDir, 'nested')
    fs.mkdirSync(nestedDir)
    fs.writeFileSync(path.join(tempDir, 'root.mdx'), '# root')
    fs.writeFileSync(path.join(nestedDir, 'nested.mdx'), '# nested')

    let files = getAllFilesRecursively(tempDir)

    expect(files).toContain(path.join(tempDir, 'root.mdx'))
    expect(files).toContain(path.join(tempDir, 'nested', 'nested.mdx'))
    expect(files.length).toBe(2)
  })
})
