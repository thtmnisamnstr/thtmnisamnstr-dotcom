import Image from 'next/image'
import React, { useRef, useState } from 'react'
import { ProfileCardInfo } from '~/components'

export function ProfileCard() {
  let ref = useRef(null)
  let [style, setStyle] = useState<React.CSSProperties>({})

  return (
    <div className="scale-100 mb-8" style={{ perspective: '600px' }} ref={ref}>
      <div
        style={style}
        className="flex flex-col transition-all duration-200 ease-out bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 xl:shadow-lg shadow-cyan-100/50 dark:shadow-cyan-700/50 xl:rounded-lg bg-white dark:bg-dark overflow-hidden"
      >
        <div className="flex px-3 xl:px-6 py-2">
          <Image
            src={'/static/images/gavin-johnson.png'}
            alt="avatar"
            width={220}
            height={220}
            className="rounded-full mx-auto"
          />
        </div>
        <ProfileCardInfo />
        <span className="h-1.5 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>
      </div>
    </div>
  )
}
