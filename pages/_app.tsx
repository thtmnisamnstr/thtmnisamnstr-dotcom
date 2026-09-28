import 'css/tailwind.css'
import 'css/themes.css'
import 'css/workbench.css'
import 'css/twemoji.css'

import { ThemeProvider } from 'next-themes'
import Head from 'next/head'
import { LayoutWrapper, SegmentProvider, ThemeModeSync } from '~/components'
import { themeIds, themeStorageKey, themeValues } from '~/constant/themes'

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider
      attribute="class"
      storageKey={themeStorageKey}
      defaultTheme="system"
      themes={themeIds}
      value={themeValues}
      enableSystem
      disableTransitionOnChange
      enableColorScheme={false}
    >
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <ThemeModeSync />
      <SegmentProvider>
        <LayoutWrapper pageData={pageProps}>
          <Component {...pageProps} />
        </LayoutWrapper>
      </SegmentProvider>
    </ThemeProvider>
  )
}
