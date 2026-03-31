import { definePineconeSearches } from 'nextjs-pinecone-search'

export default definePineconeSearches({
  //siteUrl: 'http://localhost:3000',
  siteUrl: 'https://thtmnisamnstr.com',
  namespacePrefix: 'thtmnisamnstr-dotcom',
  searches: {
    blog: {
      namespace: 'blog',
      sources: [{ include: ['data/blog/**/*.{md,mdx}'], routePrefix: '/blog' }],
    },
  },
})
