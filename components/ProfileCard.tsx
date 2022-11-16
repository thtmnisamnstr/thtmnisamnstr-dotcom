import Image from 'next/image'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ProfileCardInfo, SpotifyNowPlaying } from '~/components'
import { fetcher } from '~/utils'
import type { SpotifyNowPlayingData } from '~/types'
const { default: useSWR } = require('swr')

export function ProfileCard() {
  let response = useSWR('/api/spotify', fetcher)
  let nowPlayingData = response.data as SpotifyNowPlayingData

  let ref = useRef(null)
  let [style, setStyle] = useState<React.CSSProperties>({})

  return (
    <div className="scale-100 mb-8" style={{ perspective: '600px' }} ref={ref}>
      <div
        style={style}
        className="flex flex-col transition-all duration-200 ease-out xl:shadow-lg shadow-cyan-100/50 dark:shadow-cyan-700/50 xl:rounded-lg bg-white dark:bg-dark overflow-hidden"
      >
        <Image
          src={'/static/images/logo.jpg'}
          alt="avatar"
          width={550}
          height={350}
          className="object-cover"
          style={{ objectPosition: '50% 16%', width: 340, height: 220 }}
        />
        <SpotifyNowPlaying {...nowPlayingData} />
        <ProfileCardInfo />
        <span className="h-1.5 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>
      </div>
    </div>
  )
}
