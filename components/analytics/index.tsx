import { siteMetadata } from '~/data'
import { GAScript } from './GoogleAnalytics'
import { SegmentScript } from './SegmentAnalytics'

let isProduction = process.env.NODE_ENV === 'production'

export function Analytics() {
  if (isProduction) {
    let { analytics } = siteMetadata
    let { googleAnalyticsId } = analytics
    let { segmentWriteKey } = analytics
    return (
      <>
        {segmentWriteKey && <SegmentScript />}
        {googleAnalyticsId && <GAScript />}
      </>
    )
  }
  return null
}
