module.exports = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  experimental: {
    largePageDataBytes: 256 * 1024,
  },
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'thtmnisamnstr.com' },
      { protocol: 'https', hostname: 'www.thtmnisamnstr.com' },
      { protocol: 'https', hostname: 'thtmnisamnstr.netlify.app' },
      { protocol: 'http', hostname: 'localhost', port: '3000' },
    ],
  },
}
