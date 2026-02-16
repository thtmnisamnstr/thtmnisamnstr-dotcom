import React from 'react'

interface Props {
  children: React.ReactNode
}

type SegmentClient = {
  page: (..._args: unknown[]) => void
  track: (..._args: unknown[]) => void
}

const noopAnalytics: SegmentClient = {
  page: () => undefined,
  track: () => undefined,
}

const SegmentContext = React.createContext<{
  analytics: SegmentClient
  writeKey: string
}>(undefined)

export const SegmentProvider: React.FC<Props> = ({ children }) => {
  let writeKey = getSegmentWriteKey()
  let [analytics, setAnalytics] = React.useState<SegmentClient>(noopAnalytics)

  React.useEffect(() => {
    let active = true

    async function loadAnalytics() {
      if (!writeKey) {
        setAnalytics(noopAnalytics)
        return
      }

      let { AnalyticsBrowser } = await import('@segment/analytics-next')
      if (active) {
        setAnalytics(AnalyticsBrowser.load({ writeKey }))
      }
    }

    loadAnalytics()
    return () => {
      active = false
    }
  }, [writeKey])

  return (
    <SegmentContext.Provider value={{ analytics, writeKey }}>{children}</SegmentContext.Provider>
  )
}

// Create an analytics hook that we can use with other components.
export const useSegment = () => {
  const result = React.useContext(SegmentContext)
  if (!result) {
    throw new Error('Context used outside of its Provider!')
  }
  return result
}

function getSegmentWriteKey() {
  let isProduction = process.env.NODE_ENV === 'production'
  var segmentWriteKey
  if (isProduction) {
    segmentWriteKey = process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY_PROD
  } else {
    segmentWriteKey = process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY_DEV
  }
  return segmentWriteKey || ''
}
