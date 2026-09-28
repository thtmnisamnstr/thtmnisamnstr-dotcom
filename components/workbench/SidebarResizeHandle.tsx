import { useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'workbench-sidebar-width'
const MIN_WIDTH = 170
const MAX_WIDTH = 420

export function useSidebarWidth() {
  const [width, setWidth] = useState<number | null>(null)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved !== null && Number.isFinite(Number(saved)))
        setWidth(Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, Number(saved))))
    } catch {
      // Persistence is optional when storage is unavailable.
    }
    setReady(true)
  }, [])
  useEffect(() => {
    if (!ready) return
    try {
      if (width === null) localStorage.removeItem(STORAGE_KEY)
      else localStorage.setItem(STORAGE_KEY, String(width))
    } catch {
      // Resizing still works without storage.
    }
  }, [width, ready])
  return { width, setWidth }
}

export function SidebarResizeHandle({
  width,
  onResize,
}: {
  width: number | null
  onResize: (width: number | null) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; width: number; pointerId: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const [defaultWidth, setDefaultWidth] = useState(280)
  useEffect(() => {
    const update = () => setDefaultWidth(Math.max(220, Math.min(300, innerWidth * 0.2)))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  useEffect(() => {
    if (!dragging) return
    const { userSelect, cursor } = document.body.style
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'col-resize'
    return () => {
      document.body.style.userSelect = userSelect
      document.body.style.cursor = cursor
    }
  }, [dragging])
  const resize = (value: number) => onResize(Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, value)))
  const stop = () => {
    const previous = drag.current
    drag.current = null
    if (previous && ref.current?.hasPointerCapture(previous.pointerId))
      ref.current.releasePointerCapture(previous.pointerId)
    setDragging(false)
  }
  return (
    <>
      <div
        ref={ref}
        className="vscode-sidebar-sash"
        role="separator"
        tabIndex={0}
        aria-label="Resize Explorer"
        aria-orientation="vertical"
        aria-controls="desktop-explorer"
        aria-valuemin={MIN_WIDTH}
        aria-valuemax={MAX_WIDTH}
        aria-valuenow={Math.round(width ?? defaultWidth)}
        aria-describedby="sidebar-resize-help"
        title="Drag to resize Explorer. Double-click or press Enter to reset."
        data-dragging={dragging}
        onPointerDown={(event) => {
          if (event.button !== 0) return
          event.preventDefault()
          event.currentTarget.focus({ preventScroll: true })
          drag.current = {
            x: event.clientX,
            width: event.currentTarget.parentElement!.getBoundingClientRect().width,
            pointerId: event.pointerId,
          }
          event.currentTarget.setPointerCapture(event.pointerId)
          setDragging(true)
        }}
        onPointerMove={(event) => {
          if (drag.current) resize(Math.round(drag.current.width + event.clientX - drag.current.x))
        }}
        onPointerUp={stop}
        onPointerCancel={stop}
        onLostPointerCapture={stop}
        onDoubleClick={() => onResize(null)}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && drag.current) {
            onResize(drag.current.width)
            stop()
            event.preventDefault()
            return
          }
          const current = width ?? defaultWidth
          const step = event.shiftKey ? 1 : 10
          if (event.key === 'ArrowLeft') resize(current - step)
          else if (event.key === 'ArrowRight') resize(current + step)
          else if (event.key === 'Home') resize(MIN_WIDTH)
          else if (event.key === 'End') resize(MAX_WIDTH)
          else if (event.key === 'Enter') {
            stop()
            onResize(null)
          } else return
          event.preventDefault()
        }}
      />
      <span id="sidebar-resize-help" className="sr-only">
        Left and right arrows resize Explorer. Hold Shift for one-pixel steps. Home selects the
        minimum width, End the maximum. Enter or double-click restores the responsive default.
        Escape cancels a drag. Width buttons are also available in the Explorer header.
      </span>
    </>
  )
}
