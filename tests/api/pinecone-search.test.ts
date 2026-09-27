import type { NextApiRequest, NextApiResponse } from 'next'
import { beforeEach, describe, expect, it, vi } from 'vitest'

let createPineconeSearchService = vi.hoisted(() => vi.fn())

vi.mock('nextjs-pinecone-search', () => ({
  createPineconeSearchService,
  definePineconeSearches: (input) => input,
}))

function createResponse() {
  let statusCode: number | undefined
  let body: unknown
  let response = {
    setHeader: vi.fn(),
    status: vi.fn((code: number) => {
      statusCode = code
      return response
    }),
    json: vi.fn((payload: unknown) => {
      body = payload
      return response
    }),
  }

  return {
    response: response as unknown as NextApiResponse,
    get statusCode() {
      return statusCode
    },
    get body() {
      return body
    },
  }
}

async function loadHandler() {
  vi.resetModules()
  return (await import('~/pages/api/pinecone-search')).default
}

beforeEach(() => {
  createPineconeSearchService.mockReset()
})

describe('pinecone search API', () => {
  it('returns the method contract before initializing the provider', async () => {
    let handler = await loadHandler()
    let result = createResponse()

    await handler({ method: 'GET' } as NextApiRequest, result.response)

    expect(result.response.setHeader).toHaveBeenCalledWith('Allow', 'POST')
    expect(result.statusCode).toBe(405)
    expect(result.body).toEqual({ error: 'Method not allowed' })
    expect(createPineconeSearchService).not.toHaveBeenCalled()
  })

  it('rejects malformed POST bodies before initializing the provider', async () => {
    let handler = await loadHandler()
    let result = createResponse()

    await handler({ method: 'POST', body: {} } as NextApiRequest, result.response)

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({ error: 'Expected body: { search, query, topK? }' })
    expect(createPineconeSearchService).not.toHaveBeenCalled()
  })

  it('initializes the provider only for valid searches', async () => {
    let search = vi.fn().mockResolvedValue({ results: [] })
    createPineconeSearchService.mockReturnValue({ search })
    let handler = await loadHandler()
    let result = createResponse()

    await handler(
      { method: 'POST', body: { search: 'blog', query: 'Pinecone', topK: 5 } } as NextApiRequest,
      result.response
    )

    expect(createPineconeSearchService).toHaveBeenCalledTimes(1)
    expect(search).toHaveBeenCalledWith('blog', 'Pinecone', { topK: 5 })
    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({ results: [] })
  })
})
