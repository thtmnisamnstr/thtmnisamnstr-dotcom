import type { SVGProps } from 'react'

const paths = {
  files: 'M6 1h8v11H6z M3 4H1v11h9v-2',
  search: 'M10.5 10.5 15 15 M12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0',
  menu: 'M2 4h12 M2 8h12 M2 12h12',
  close: 'm4 4 8 8 M12 4l-8 8',
  add: 'M3 8h10 M8 3v10',
  remove: 'M3 8h10',
  reset: 'M3 6a5 5 0 1 1 0 4 M3 2v4h4',
  chevron: 'm6 3 5 5-5 5',
  folder: 'M1 3h5l2 2h7v9H1z',
  markdown: 'M1 3h14v10H1z M3 10V6l2 2 2-2v4 M10 6v4m-2-2 2 2 2-2',
  repository: 'M4 1h9v14H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2z M2 11h11 M5 4h5 M5 7h5',
  settings:
    'M6 1h4l.5 2 1.5 1 2-.5 2 3-1.5 1.5v2l1.5 1.5-2 3-2-.5-1.5 1-.5 2H6l-.5-2-1.5-1-2 .5-2-3L1.5 10V8L0 6.5l2-3 2 .5 1.5-1z M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0',
} as const

export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: keyof typeof paths }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  )
}
