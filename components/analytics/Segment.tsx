import Script from 'next/script'
import * as snippet from '@segment/snippet'

let isProduction = process.env.NODE_ENV === 'production'

export function getSegmentWriteKey() {
  var segmentWriteKey
  if (isProduction) {
    segmentWriteKey = process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY_PROD
  } else {
    segmentWriteKey = process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY_DEV
  }
  return segmentWriteKey
}

const loadSegment = () => {
  const options = {
    apiKey: getSegmentWriteKey(),
    page: false,
  }
  if (isProduction) {
    return snippet.min(options)
  } else {
    return snippet.max(options)
  }
}

export function SegmentScript() {
  return (
    <>
      <Script
        strategy="lazyOnload"
        id="segment-script"
        dangerouslySetInnerHTML={{ __html: loadSegment() }}
      />
    </>
  )
}
