import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { documentForRoute } from '~/constant/workbench'
import { Link } from '../Link'
import { Icon } from './Icon'

const STORAGE_KEY = 'workbench-open-documents'
const withHome = (paths: string[]) => [
  '/',
  ...Array.from(new Set(paths.filter((path) => path !== '/'))).slice(-11),
]

export function EditorTabs({ path }: { path: string }) {
  const router = useRouter()
  const history = useRef<string[]>([])
  const [open, setOpen] = useState<string[]>(['/'])
  const [ready, setReady] = useState(false)
  const dragged = useRef<string | null>(null)
  const [drop, setDrop] = useState<{ href: string; after: boolean } | null>(null)
  const [announcement, setAnnouncement] = useState('')
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]')
      if (Array.isArray(saved))
        setOpen(
          withHome(
            saved.filter(
              (value) =>
                typeof value === 'string' && /^\/(blog|about|resume|tags)(\/[^?#]*)?$/.test(value)
            )
          )
        )
    } catch {
      /* Storage may be disabled. Navigation still works. */
    }
    setReady(true)
  }, [])
  useEffect(() => {
    if (!ready) return
    history.current = [...history.current.filter((href) => href !== path), path]
    setOpen((previous) => (previous.includes(path) ? previous : withHome([...previous, path])))
  }, [path, ready])
  useEffect(() => {
    if (ready) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(open))
      } catch {
        /* Optional persistence. */
      }
    }
  }, [open, ready])
  const documents = [...new Set(['/', ...open, path])]
  function move(source: string, target: string, after: boolean) {
    if (source === '/' || source === target) return
    const remaining = documents.filter((href) => href !== source)
    const targetIndex = remaining.indexOf(target)
    if (targetIndex < 0 || !documents.includes(source)) return
    const index = Math.max(1, targetIndex + (after ? 1 : 0))
    remaining.splice(index, 0, source)
    setOpen(remaining)
    setAnnouncement(
      `${documentForRoute(source).label} moved to position ${index + 1} of ${remaining.length}.`
    )
  }
  useEffect(() => {
    const active = document.querySelector<HTMLElement>('.vscode-editor-tab.is-active')
    if (!active?.parentElement) return
    const strip = active.parentElement
    const left =
      active.getBoundingClientRect().left - strip.getBoundingClientRect().left + strip.scrollLeft
    const right = left + active.getBoundingClientRect().width
    if (left < strip.scrollLeft) strip.scrollLeft = left
    else if (right > strip.scrollLeft + strip.clientWidth)
      strip.scrollLeft = right - strip.clientWidth
  }, [path, ready])
  useEffect(() => {
    const focused = document.activeElement as HTMLElement | null
    if (focused?.closest('.vscode-editor-tab'))
      focused.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [open])
  return (
    <nav className="vscode-editor-tabs" aria-label="Open documents">
      <span id="tab-reorder-help" className="sr-only">
        Drag documents to reorder them, or use Alt Shift Left and Alt Shift Right on a document
        link. README stays pinned first.
      </span>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
      {documents.map((href) => {
        const file = documentForRoute(href)
        return (
          <div
            key={href}
            className={`vscode-editor-tab${href === path ? ' is-active' : ''}`}
            draggable={href !== '/'}
            data-drop={drop?.href === href ? (drop.after ? 'after' : 'before') : undefined}
            onDragStart={(event) => {
              dragged.current = href
              event.dataTransfer.effectAllowed = 'move'
              event.dataTransfer.setData('application/x-workbench-document', href)
            }}
            onDragOver={(event) => {
              if (!dragged.current) return
              event.preventDefault()
              event.dataTransfer.dropEffect = 'move'
              const rect = event.currentTarget.getBoundingClientRect()
              const after = href === '/' || event.clientX > rect.left + rect.width / 2
              setDrop({ href, after })
              const strip = event.currentTarget.parentElement!
              const bounds = strip.getBoundingClientRect()
              if (event.clientX > bounds.right - 32) strip.scrollLeft += 16
              else if (event.clientX < bounds.left + 32) strip.scrollLeft -= 16
            }}
            onDrop={(event) => {
              if (!dragged.current) return
              event.preventDefault()
              const rect = event.currentTarget.getBoundingClientRect()
              move(
                dragged.current,
                href,
                href === '/' || event.clientX > rect.left + rect.width / 2
              )
              dragged.current = null
              setDrop(null)
            }}
            onDragEnd={() => {
              dragged.current = null
              setDrop(null)
            }}
          >
            <Link
              href={href}
              draggable={false}
              aria-current={href === path ? 'page' : undefined}
              aria-describedby={href === '/' ? undefined : 'tab-reorder-help'}
              aria-keyshortcuts={
                href === '/' ? undefined : 'Alt+Shift+ArrowLeft Alt+Shift+ArrowRight'
              }
              title={href === '/' ? `${file.label} (pinned)` : `${file.label} — drag to reorder`}
              onKeyDown={(event) => {
                if (href === '/' || !event.altKey || !event.shiftKey) return
                const index = documents.indexOf(href)
                if (event.key === 'ArrowLeft') {
                  event.preventDefault()
                  if (index > 1) move(href, documents[index - 1], false)
                } else if (event.key === 'ArrowRight') {
                  event.preventDefault()
                  if (index < documents.length - 1) move(href, documents[index + 1], true)
                }
              }}
            >
              <Icon name="markdown" />
              <span>{file.label}</span>
            </Link>
            {href !== '/' && (
              <button
                type="button"
                aria-label={`Close ${file.label}`}
                onClick={() => {
                  const remaining = documents.filter((item) => item !== href)
                  if (href === path)
                    void router.push(
                      [...history.current].reverse().find((item) => remaining.includes(item)) || '/'
                    )
                  setOpen(remaining)
                }}
              >
                <Icon name="close" />
              </button>
            )}
          </div>
        )
      })}
    </nav>
  )
}
