import { SegmentScript, getSegmentWriteKey } from './segment'

export function Analytics() {
  let segmentWriteKey = getSegmentWriteKey()
  if (segmentWriteKey != null && segmentWriteKey != '') {
    return (
      <>
        <SegmentScript />
      </>
    )
  }
  return null
}
