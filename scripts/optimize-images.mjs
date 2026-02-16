import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { globby } from 'globby'

const ONE_MB = 1024 * 1024
const MIN_SIZE_BYTES = Number(process.env.MIN_IMAGE_BYTES || ONE_MB)

function isOptimizable(filePath) {
  let ext = path.extname(filePath).toLowerCase()
  return ext === '.jpg' || ext === '.jpeg' || ext === '.png'
}

async function optimizeImage(filePath) {
  let before = fs.statSync(filePath).size
  if (before < MIN_SIZE_BYTES) {
    return { filePath, before, after: before, changed: false, skipped: true }
  }

  let ext = path.extname(filePath).toLowerCase()
  let buffer = fs.readFileSync(filePath)
  let pipeline = sharp(buffer)
  let optimized

  if (ext === '.png') {
    optimized = await pipeline.png({ palette: true, compressionLevel: 9, effort: 10 }).toBuffer()
  } else {
    optimized = await pipeline.jpeg({ quality: 82, mozjpeg: true }).toBuffer()
  }

  if (optimized.length >= before) {
    return { filePath, before, after: before, changed: false, skipped: false }
  }

  fs.writeFileSync(filePath, optimized)
  return { filePath, before, after: optimized.length, changed: true, skipped: false }
}

async function run() {
  let files = await globby(['public/**/*.{jpg,jpeg,png}', 'src/assets/**/*.{jpg,jpeg,png}'])
  let targets = files.filter(isOptimizable)
  let results = []

  for (let filePath of targets) {
    let result = await optimizeImage(filePath)
    results.push(result)
  }

  let changed = results.filter((item) => item.changed)
  let totalSaved = changed.reduce((acc, item) => acc + (item.before - item.after), 0)
  let scanned = results.length
  let skipped = results.filter((item) => item.skipped).length

  console.log(`Scanned ${scanned} images.`)
  console.log(`Skipped ${skipped} files smaller than ${MIN_SIZE_BYTES} bytes.`)
  console.log(`Optimized ${changed.length} files.`)
  console.log(`Saved ${(totalSaved / 1024 / 1024).toFixed(2)} MB.`)

  if (changed.length > 0) {
    console.log('Updated files:')
    for (let file of changed) {
      console.log(`- ${file.filePath}: ${file.before} -> ${file.after} bytes`)
    }
  }
}

run()
