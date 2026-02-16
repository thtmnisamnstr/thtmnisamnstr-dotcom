import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="apple-touch-icon" sizes="76x76" href="/images/favicons/apple-touch-icon.png" />
          <link
            rel="icon"
            type="image/png"
            sizes="96x96"
            href="/images/favicons/android-chrome-96x96.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/images/favicons/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/images/favicons/favicon-16x16.png"
          />
          <link rel="manifest" href="/images/favicons/site.webmanifest" />
          <link rel="mask-icon" href="/images/favicons/safari-pinned-tab.svg" color="#fff" />
          <meta name="msapplication-TileImage" content="/images/favicons/mstile-150x150.png" />
          <meta name="msapplication-TileColor" content="#000000" />
          <meta name="theme-color" content="#000000" />
          <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
        </Head>
        <body className="antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
