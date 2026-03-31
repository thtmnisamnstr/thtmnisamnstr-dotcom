import nextEnv from '@next/env'
import { createPineconeSearchService, loadPineconeSearchConfig } from 'nextjs-pinecone-search'

const cwd = process.cwd()
const { loadEnvConfig } = nextEnv

loadEnvConfig(cwd)

async function run() {
  const config = await loadPineconeSearchConfig({ cwd })
  const service = createPineconeSearchService({ config, cwd })
  const summary = await service.reindexAll()

  console.log('[nextjs-pinecone-search] manual reindex complete')
  console.log(JSON.stringify(summary, null, 2))
}

run().catch((error) => {
  console.error('[nextjs-pinecone-search] manual reindex failed')
  console.error(error)
  process.exit(1)
})
