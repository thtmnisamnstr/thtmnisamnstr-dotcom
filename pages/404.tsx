import { useEffect } from 'react'
import { Link, PageSeo, useSegment } from '~/components'

export default function FourZeroFour() {
  const { analytics: segment } = useSegment()

  useEffect(() => {
    segment.page('/404')
  }, [segment])

  return (
    <section className="vscode-page-block">
      <PageSeo
        title="Page not found - Gavin Johnson"
        description="This page does not exist. Browse the site using Explorer."
      />
      <h1 className="vscode-page-title">404</h1>
      <p className="mb-3">This file does not exist in the current workspace.</p>
      <p className="mb-6">Choose a page in Explorer, or return to the home page.</p>
      <Link href="/" className="vscode-action-link">
        Go to Home
      </Link>
    </section>
  )
}
