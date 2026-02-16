import 'css/tailwind.css'
import 'css/twemoji.css'

import { ThemeProvider } from 'next-themes'
import Head from 'next/head'
import { LayoutWrapper, SegmentProvider, ThemeModeSync } from '~/components'

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider
      attribute="class"
      storageKey="thtmnisamnstr-theme"
      defaultTheme="vscode-dark-plus"
      themes={[
        'vscode-dark-plus',
        'vscode-light-plus',
        'github-dark',
        'github-light',
        'one-dark-pro',
        'dracula',
        'monokai',
        'night-owl',
        'solarized-dark',
        'solarized-light',
        'vscode-hc-black',
        'vscode-hc-light',
      ]}
      enableSystem={false}
    >
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <ThemeModeSync />
      <SegmentProvider>
        <LayoutWrapper>
          <Component {...pageProps} />
        </LayoutWrapper>
      </SegmentProvider>
    </ThemeProvider>
  )
}
