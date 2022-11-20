import React from 'react'
import Typed from 'typed.js'

export function TypedBios() {
  let el = React.useRef(null)
  let typed = React.useRef(null)

  React.useEffect(() => {
    typed.current = new Typed(el.current, {
      stringsElement: '#bios',
      typeSpeed: 100,
      backSpeed: 50,
      loop: true,
      backDelay: 2000,
      showCursor: true,
    })
    return () => typed.current.destroy()
  }, [])

  return (
    <div>
      <span className="text-5xl"></span>
      <ul id="bios" className="hidden">
        <li>
          <span className="text-5xl font-mono" style={{ color: '#33ff00' }}>
            <b className="font-heavy">thtmnisamnstr</b>
          </span>
        </li>
      </ul>
      <span ref={el} className="text-neutral-900 dark:text-neutral-200" />
    </div>
  )
}
