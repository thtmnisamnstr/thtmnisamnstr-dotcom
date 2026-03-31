import type { NextApiRequest, NextApiResponse } from 'next'
import { createPineconeSearchService } from 'nextjs-pinecone-search'

import pineconeSearchConfig from '../../pinecone.search.config'

export const config = {
  api: {
    bodyParser: true,
  },
}

const service = createPineconeSearchService({ config: pineconeSearchConfig })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let { search, query, topK } = req.body ?? {}

  if (typeof search !== 'string' || typeof query !== 'string') {
    return res.status(400).json({ error: 'Expected body: { search, query, topK? }' })
  }

  try {
    let topKNumber = typeof topK === 'number' ? topK : undefined
    let result = await service.search(search, query, { topK: topKNumber })
    return res.status(200).json(result)
  } catch (error) {
    let message = error instanceof Error ? error.message : 'Search failed'
    return res.status(500).json({ error: message })
  }
}
