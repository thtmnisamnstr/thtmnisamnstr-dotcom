module.exports = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  eslint: {
    ignoreDuringBuilds: true,
    dirs: [
      'components',
      'constant',
      'css',
      'data',
      'layouts',
      'libs',
      'pages',
      'scripts',
      'types',
      'utils',
    ],
  },
  typescript: {
    tsconfigPath: './tsconfig.json',
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'thtmnisamnstr.com' },
      { protocol: 'https', hostname: 'www.thtmnisamnstr.com' },
      { protocol: 'https', hostname: 'thtmnisamnstr.netlify.app' },
      { protocol: 'http', hostname: 'localhost', port: '3000' },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
}
