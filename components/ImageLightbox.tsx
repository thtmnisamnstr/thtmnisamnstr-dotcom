import NextImage from 'next/image'
import { useTheme } from 'next-themes'
import React, { useState, useEffect, useCallback } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import type { ImageLightBoxProps } from '~/types'
import { Twemoji } from './Twemoji'

export function ImageLightbox({ src, closeLightbox }: ImageLightBoxProps) {
  let { theme } = useTheme()
  let [imgLoaded, setImgLoaded] = useState(false)
  let [close, setClose] = useState(false)

  let handleClose = useCallback(() => {
    setClose(true)
    document.documentElement.classList.remove('prevent-scroll', 'lightbox-loading')
    setTimeout(() => closeLightbox(), 300)
  }, [closeLightbox])

  let handleKeydown = useCallback(
    (e: ReactKeyboardEvent | KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    },
    [handleClose]
  )

  useEffect(() => {
    document.documentElement.classList.add('prevent-scroll')
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [handleKeydown])

  useEffect(() => {
    if (imgLoaded) {
      setTimeout(() => {
        document.documentElement.classList.remove('lightbox-loading')
      }, 150)
    }
  }, [imgLoaded])

  let style = {
    '--tw-bg-opacity': theme === 'dark' ? 0.7 : 0.8,
    opacity: !close && imgLoaded ? 1 : 0,
  } as React.CSSProperties

  return (
    <div
      className="lightbox-overlay fixed inset-0 bg-black z-50 flex items-center justify-center transition-opacity duration-300 ease-out"
      style={style}
      onClick={handleClose}
    >
      <div
        className="w-full h-full relative flex justify-center items-center"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="absolute flex justify-between top-0 inset-x-0">
          <button type="button" className="p-4 text-xl text-white" onClick={handleClose}>
            Esc
          </button>
          <button type="button" className="p-4" onClick={handleClose}>
            <Twemoji emoji="cross-mark" />
          </button>
        </div>
        <div className="relative w-[90vw] h-[80vh]">
          <NextImage
            src={src.toString()}
            alt="Lightbox"
            fill
            sizes="90vw"
            className="cursor-zoom-out object-contain"
            onLoadingComplete={() => setImgLoaded(true)}
          />
        </div>
      </div>
    </div>
  )
}
