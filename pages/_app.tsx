import 'css/tailwind.css'
import 'css/twemoji.css'

import { ThemeProvider } from 'next-themes'
import Head from 'next/head'
import { LayoutWrapper, SegmentProvider } from '~/components'

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <SegmentProvider>
        <LayoutWrapper>
          <Component {...pageProps} />
        </LayoutWrapper>
      </SegmentProvider>
    </ThemeProvider>
  )
}
