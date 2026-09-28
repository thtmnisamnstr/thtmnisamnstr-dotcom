import { useEffect, useState } from 'react'

export function ScrollTopButton() {
  let [show, setShow] = useState(false)

  useEffect(() => {
    let handleWindowScroll = () => {
      if (window.scrollY > 200) setShow(true)
      else setShow(false)
    }

    window.addEventListener('scroll', handleWindowScroll)
    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [])

  let handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    })
  }

  return (
    <button
      aria-label="Scroll To Top"
      type="button"
      onClick={handleClick}
      hidden={!show}
      tabIndex={show ? 0 : -1}
      style={{ visibility: show ? 'visible' : 'hidden' }}
      className="vscode-scroll-top hidden md:inline-block transition-opacity"
    >
      <svg
        className="w-5.5 h-5.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  )
}
