const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  eslint: {
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
  images: {
    domains: [
      'thtmnisamnstr.com',
      'www.thtmnisamnstr.com',
      'thtmnisamnstr.netlify.app/',
      'localhost:3000',
    ],
  },
  typescript: { tsconfigPath: './tsconfig.json' },
  webpack: (config, { dev, isServer }) => {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|mp4)$/i,
      use: [
        {
          loader: 'file-loader',
        },
      ],
    })

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    // if (!dev && !isServer) {
    // 	// Replace React with Preact only in client production build
    // 	Object.assign(config.resolve.alias, {
    // 		'react/jsx-runtime.js': 'preact/compat/jsx-runtime',
    // 		react: 'preact/compat',
    // 		'react-dom/test-utils': 'preact/test-utils',
    // 		'react-dom': 'preact/compat',
    // 	})
    // }

    return config
  },
})
